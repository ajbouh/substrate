#!/bin/bash

set -ex

HERE=$(cd $(dirname $0); pwd)

: ${NAMESPACE:=substrate-nobody}

cue_export() {
  NAMESPACE=$NAMESPACE $HERE/tools/cue-export.sh "$@"
}

CUE_MODULE=github.com/ajbouh/substrate

docker_compose() {
  docker_compose_yml=$1
  shift
  docker compose \
    -p $(basename $docker_compose_yml .yml) \
    --project-directory $HERE \
    -f $docker_compose_yml "$@"
}

make_docker_compose_yml() {
  suffix=$1
  expr=$2
  docker_compose_yml=$HERE/.gen/docker/$NAMESPACE-$suffix.yml
  mkdir -p $(dirname $docker_compose_yml)
  cue_export yaml $CUE_MODULE:dev $expr > $docker_compose_yml
  echo $docker_compose_yml
}

fcos_installer() {
  docker run \
    --security-opt label=disable \
    --pull=always \
    --rm \
    -v $HERE/os/fcos:/data \
    -w /data \
    quay.io/coreos/coreos-installer:release "$@"
}

butane() {
  docker run \
    --interactive \
    --rm \
    -v $HERE/os/fcos:/data \
    -w /data \
    quay.io/coreos/butane:release "$@"
}

ssh_qemu() {
  ssh -p 2222 -i ~/.ssh/id_substrateos substrate@localhost "$@"
}

FCOS_STREAM=stable
FCOS_VERSION=38.20230918.3.0
QEMU_RAM=2048
QEMU_DISK=32G
SUBSTRATEOS_QCOW2_FILE_BASENAME=substrateos-qemu.qcow2
SUBSTRATEOS_ISO_BASENAME=substrateos.iso

case "$1" in
  fcos-installer)
    shift
    fcos_installer "$@"
    ;;
  os-rebase-push)
    shift
    docker compose -f $HERE/os/fcos/docker-compose.yml build
    docker compose -f $HERE/os/fcos/docker-compose.yml push
    ;;
  os-make-install-iso)
    shift
    cd $HERE/os/fcos/
    mkdir -p .gen .fetch
    cue_export yaml $CUE_MODULE:dev 'substrateos.ignition' | butane --pretty --strict --files-dir=./ /dev/stdin --output .gen/substrate.ign
    FCOS_INSTALLER_ISO=$(fcos_installer download -s $FCOS_STREAM -p metal -f iso -C .fetch)
    fcos_installer \
        iso customize \
        '--dest-device=/dev/nvme0n1' \
        '--dest-ignition=./.gen/substrate.ign' \
        '--dest-console=tty0' \
        -o .gen/$SUBSTRATEOS_ISO_BASENAME \
        $FCOS_INSTALLER_ISO
    ;;
  os-qemu-reset)
    shift
    cd $HERE/os/fcos/
    rm .gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME
    ssh-keygen -R '[localhost]:2222'
    ;;
  os-qemu-run)
    shift
    cd $HERE/os/fcos/
    mkdir -p .gen .fetch
    IGNITION_FILE=.gen/substrate.ign
    cue_export yaml $CUE_MODULE:dev 'substrateos.ignition' | butane --pretty --strict --files-dir=./ /dev/stdin --output $IGNITION_FILE
    if [ ! -f .gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME ]; then
      FCOS_QCOW2_XZ_FILE=$(fcos_installer download -s $FCOS_STREAM -p qemu -f qcow2.xz -C .fetch)
      FCOS_QCOW2_FILE=.gen/$(basename $FCOS_QCOW2_XZ_FILE .xz)
      if [ ! -f $FCOS_QCOW2_FILE ]; then
        unxz <$FCOS_QCOW2_XZ_FILE >$FCOS_QCOW2_FILE
      fi
      cd .gen
      ssh-keygen -R '[localhost]:2222'
      qemu-img create \
          -f qcow2 \
          -F qcow2 \
          -b $FCOS_QCOW2_FILE \
          $SUBSTRATEOS_QCOW2_FILE_BASENAME \
          $QEMU_DISK
      cd -
    fi
    # need qemu ≥ 7.1.0 for vmnet-bridge to work, but nixpkgs build still lacks it.
    qemu-system-x86_64 \
      -m $QEMU_RAM \
      -nographic \
      -cpu host \
      -snapshot \
      -M accel=hvf \
      -drive if=virtio,file=.gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME \
      -fw_cfg name=opt/com.coreos/config,file=$IGNITION_FILE \
      -nic user,model=virtio,hostfwd=tcp::2222-:22,hostfwd=tcp::2280-:2280,hostfwd=tcp::2281-:2281,hostfwd=tcp::4222-:4222

    ;;
  os-qemu-rebase)
    shift
    docker_compose_yml=$(make_docker_compose_yml os substrateos.docker_compose_build)
    docker_compose $docker_compose_yml build "rebase"
    REBASE_IMAGE=$(cue_export text $CUE_MODULE:dev 'substrateos.#rebase_image')
    docker image save $REBASE_IMAGE | ssh_qemu 'skopeo copy docker-archive:/dev/stdin ostree:$REBASE_IMAGE@/ostree/repo'
    ssh_qemu sudo rpm-ostree rebase --reboot --cache-only $REBASE_IMAGE
    ;;
  os-qemu-update-containers)
    shift
    # re-render /etc
    mkdir -p $HERE/os/fcos/.gen/etc/containers/systemd
    # cue_export text $CUE_MODULE:dev 'systemd.containers["substrate-pull.image"].#text' > $HERE/os/fcos/.gen/etc/containers/systemd/substrate-pull.image
    cue_export text $CUE_MODULE:dev 'substrateos.systemd.containers["substrate.container"].#text' > $HERE/os/fcos/.gen/etc/containers/systemd/substrate.container
    cue_export text $CUE_MODULE:dev 'substrateos.systemd.containers["substrate.container"].#environment_file_text' > $HERE/os/fcos/.gen/etc/containers/systemd/substrate.env
    # build
    docker_compose_yml=$(make_docker_compose_yml os substrateos.docker_compose_build)
    docker_compose $docker_compose_yml build
    # replace /etc
    tar -cv -C $HERE/os/fcos/.gen/etc . | ssh_qemu sudo tar xv --no-same-owner -C /etc
    # update
    IMAGES=$(cue_export text $CUE_MODULE:dev 'substrateos.docker_compose_build.#images')
    echo IMAGES=$IMAGES
    for image in $IMAGES; do
      docker image save $image | ssh_qemu sudo skopeo copy docker-archive:/dev/stdin containers-storage:$image
    done
    ssh_qemu sudo systemctl daemon-reload
    ssh_qemu sudo systemctl restart substrate
    ssh_qemu sudo journalctl -xlfeu substrate.service
    ;;
  os-qemu-ssh)
    shift
    ssh_qemu "$@"
    ;;
  bridge-docker-compose)
    shift
    docker_compose $(make_docker_compose_yml bridge bridge.docker_compose) "$@"
    ;;
  bridge-docker-compose-up)
    shift
    docker_compose $(make_docker_compose_yml bridge bridge.docker_compose) up \
        --always-recreate-deps \
        --remove-orphans \
        --force-recreate \
        --build "$@"
    ;;
  docker-compose-up)
    shift
    # docker_compose down || true
    docker_compose $(make_docker_compose_yml substrate docker_compose) up \
        --always-recreate-deps \
        --remove-orphans \
        --force-recreate \
        --build "$@"
    ;;
  test-lens)
    cd $HERE/tests; go test -v ./...
    ;;
  run-lens)
    shift
    lens=$1
    shift
    if [ -z $lens ]; then
      echo >&2 "usage: $0 <lens> [<data-dir> ...]"
      exit 1
    fi

    set -x

    volume_args=()
    for viewspec in "$@"; do
      if [[ $viewspec != *=* ]]; then
        viewspec="data=$viewspec"
      fi

      viewname=${viewspec%=*}
      localdir_raw=${viewspec#*=}

      # if [[ $localdir_raw != '"'* ]] || [[ $localdir_raw != "'"* ]]; then
      #   # TODO parse lens.cue and pull out environment variable name for this field...
      #   env_args+=("-e" "$localdir_raw")
      # el
      if [[ $localdir_raw != ','* ]]; then
        localdir=$localdir_raw

        if [[ $localdir != *:* ]]; then
          mode=ro
        else
          mode=${localdir#*:}
          localdir=${localdir%:*}
        fi
        # echo "localdir_raw=$localdir_raw mode=$mode localdir=$localdir"
        
        volume_args+=("-v" "$(cd $localdir; pwd):/spaces/$viewname/tree:$mode")
      else
        localdirs=(${localdir_raw//,/ })
        localdirid=0
        for localdir_elt in ${localdirs[@]}; do
          if [ -z "$localdir_elt" ]; then
            continue
          fi

          localdir=$localdir_elt

          if [[ $localdir != *:* ]]; then
            mode=ro
          else
            mode=${localdir#*:}
            localdir=${localdir%:*}
          fi

          # echo "localdir_raw=$localdir_raw localdir_elt=$localdir_elt mode=$mode localdir=$localdir"

          volume_args+=("-v" "$(cd $localdir; pwd):/spaces/$viewname/sp-$localdirid/tree:$mode")
          localdirid=$((localdirid+1))
        done
      fi
    done

    : ${PORT:=8080}
    internal_port=8080

    docker_compose_yml=$(make_docker_compose_yml lenses docker_compose_lenses)
    docker_compose $docker_compose_yml build "lens-$lens"
    docker_compose $docker_compose_yml run \
        --rm \
        --interactive \
        --env PORT=$internal_port \
        -p $PORT:$internal_port \
        ${volume_args[@]} \
        "lens-$lens"
    ;;
  *) docker_compose $(make_docker_compose_yml dev docker_compose) "$@"
esac


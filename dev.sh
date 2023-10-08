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
  docker_compose_yml=$HERE/.gen/docker/docker-compose-$NAMESPACE-$suffix.yml
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

case "$1" in
  os-rebase-push)
    shift
    docker compose -f $HERE/os/fcos/docker-compose.yml build
    docker compose -f $HERE/os/fcos/docker-compose.yml push
    ;;
  os-make-install-iso)
    shift
    cd $HERE/os/fcos/
    mkdir -p .gen .fetch
    butane --pretty --strict --files-dir=./ substrate.bu --output .gen/substrate.ign
    fcos_installer download -s $FCOS_STREAM -p metal -f iso -C .fetch
    fcos_installer \
        iso customize \
        '--dest-device=/dev/nvme0n1' \
        '--dest-ignition=./.gen/substrate.ign' \
        '--dest-console=tty0' \
        -o .gen/substrate-install-fcos-$FCOS_VERSION.x86_64.iso \
        .fetch/fedora-coreos-$FCOS_VERSION-live.x86_64.iso
    ;;
  os-qemu-reset)
    shift
    cd $HERE/os/fcos/
    rm .gen/substrate-fcos-$FCOS_VERSION-qemu.x86_64.qcow2
    ssh-keygen -R '[localhost]:2222'
    ;;
  os-qemu-run)
    shift
    cd $HERE/os/fcos/
    mkdir -p .gen .fetch
    butane --pretty --strict --files-dir=./ substrate.bu --output .gen/substrate.ign
    if [ ! -f .gen/fedora-coreos-$FCOS_VERSION-qemu.x86_64.qcow2 ]; then
      fcos_installer download -s $FCOS_STREAM -p qemu -f qcow2.xz -C .fetch
      unxz <.fetch/fedora-coreos-$FCOS_VERSION-qemu.x86_64.qcow2.xz >.gen/fedora-coreos-$FCOS_VERSION-qemu.x86_64.qcow2
    fi
    if [ ! -f .gen/substrate-fcos-$FCOS_VERSION-qemu.x86_64.qcow2 ]; then
      cd .gen
      qemu-img create \
          -f qcow2 \
          -F qcow2 \
          -b fedora-coreos-$FCOS_VERSION-qemu.x86_64.qcow2 \
          substrate-fcos-$FCOS_VERSION-qemu.x86_64.qcow2 \
          16G
      cd -
    fi
    qemu-kvm \
      -m 2048 \
      -cpu host \
      -nographic \
      -snapshot \
      -accel hvf \
      -drive if=virtio,file=.gen/substrate-fcos-$FCOS_VERSION-qemu.x86_64.qcow2 \
      -fw_cfg name=opt/com.coreos/config,file=.gen/substrate.ign \
      -nic user,model=virtio,hostfwd=tcp::2222-:22,hostfwd=tcp::2280-:80
    ;;
  os-qemu-rebase)
    shift
    # docker compose -f $HERE/os/fcos/docker-compose.yml build substrate
    docker image save ghcr.io/ajbouh/substrate:substrateos | ssh_qemu 'skopeo copy docker-archive:/dev/stdin ostree:ghcr.io/ajbouh/substrate:substrateos@/ostree/repo'
    ssh_qemu sudo rpm-ostree rebase --reboot --cache-only ghcr.io/ajbouh/substrate:substrateos
    ;;
  os-qemu-update-containers)
    shift
    docker compose -f $HERE/os/fcos/docker-compose.yml build substrate
    tar -cv $HERE/os/fcos/etc | ssh_qemu sudo tar xv --no-same-owner -C /etc
    docker image save ghcr.io/ajbouh/substrate:substrate | ssh_qemu sudo skopeo copy docker-archive:/dev/stdin containers-storage:ghcr.io/ajbouh/substrate:substrate
    ssh_qemu sudo systemctl daemon-reload
    ssh_qemu sudo systemctl restart substrate
    ssh_qemu sudo journalctl -xlfeu substrate.service
    ;;
  os-qemu-ssh)
    shift
    ssh_qemu "$@"
    ;;
  up)
    shift
    # docker_compose down || true
    docker_compose $(make_docker_compose_yml dev docker_compose) up \
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

    docker_compose_yml=$(make_docker_compose_yml dev-lenses docker_compose_lenses)
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


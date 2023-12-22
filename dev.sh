#!/bin/bash

set -exo pipefail

HERE=$(cd $(dirname $0); pwd)

: ${NAMESPACE:=substrate-nobody}

: ${REMOTE_DOCKER_HOSTNAME:=129.146.163.132}
: ${REMOTE_DOCKER_HOST:=ssh://$REMOTE_DOCKER_HOSTNAME}
# Assumes you have an entry like this in ~/.ssh/config
# Host 129.146.163.132
#   User ubuntu
#   IdentityFile ~/.ssh/id_substrateos


cue() {
  $HERE/tools/cue.sh "$@"
}

CUE_DEV_EXPR_PATH=.gen/cue/$NAMESPACE-dev.cue
CUE_MODULE=github.com/ajbouh/substrate

detect_dev_cue_tag_args() {
  if [ -n "$CUE_DEV_TAG_ARGS" ]; then
    return
  fi

  CUE_DEV_TAG_ARGS=" "

  if [ -z "$NAMESPACE" ]; then
    echo >&2 "NAMESPACE not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t namespace=$NAMESPACE"

  if [ -z "$ROOT_SOURCE_DIR" ]; then
    echo >&2 "ROOT_SOURCE_DIR not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t root_source_directory=$ROOT_SOURCE_DIR"

  if [ -z "$LENSES_EXPR_PATH" ]; then
    echo >&2 "LENSES_EXPR_PATH not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t lenses_expr_path=$LENSES_EXPR_PATH"

  if [ -z "$HOST_DOCKER_SOCKET" ]; then
    echo >&2 "HOST_DOCKER_SOCKET not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t host_docker_socket=$HOST_DOCKER_SOCKET"

  if [ -z "$NO_CUDA" ]; then
    if [ -z "$PROBE_PREFIX" ]; then
      echo >&2 "PROBE_PREFIX not set"
      exit 2
    fi
  
    if ! $PROBE_PREFIX nvidia-smi 2>&1 >/dev/null; then
      CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t no_cuda=1"
    fi
  fi
}

debug_cue_dev_expr() {
  detect_dev_cue_tag_args

  mkdir -p $(dirname $CUE_DEV_EXPR_PATH)
  [ ! -e $CUE_DEV_EXPR_PATH ] || mv -f $CUE_DEV_EXPR_PATH $CUE_DEV_EXPR_PATH.old
  cue def \
    $CUE_MODULE:dev \
    --outfile $CUE_DEV_EXPR_PATH \
    $CUE_DEV_TAG_ARGS
}

print_rendered_cue_dev_expr_as() {
  format=$1
  shift

  detect_dev_cue_tag_args

  debug_cue_dev_expr

  cue export \
    --out $format \
    $CUE_DEV_TAG_ARGS \
    $CUE_MODULE:dev \
    "$@"
}

write_rendered_cue_dev_expr_as() {
  format=$1
  dest=$2
  shift 2

  detect_dev_cue_tag_args
  debug_cue_dev_expr

  mkdir -p $(dirname $dest)
  [ ! -e $docker_compose_yml ] || mv -f $docker_compose_yml $docker_compose_yml.old
  cue export --trace --all-errors --verbose \
    --out $format \
    --outfile $docker_compose_yml \
    $CUE_DEV_TAG_ARGS \
    $CUE_MODULE:dev \
    "$@"
}

write_rendered_cue_dev_expr_as_cue() {
  dest=$1
  shift

  detect_dev_cue_tag_args
  debug_cue_dev_expr

  mkdir -p $(dirname $dest)
  [ ! -e $dest ] || mv -f $dest $dest.old

  # write cue
  cue def --strict --trace --all-errors --verbose --inline-imports --simplify \
    $CUE_MODULE:dev \
    --outfile $dest \
    $CUE_DEV_TAG_ARGS \
    "$@"

  # double check it
  cue eval --strict --trace --all-errors --verbose $dest
}

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
  shift 2
  docker_compose_yml=.gen/docker/$NAMESPACE-$suffix.yml
  mkdir -p $(dirname $docker_compose_yml)
  write_rendered_cue_dev_expr_as yaml $docker_compose_yml -e $expr "$@"
  echo $HERE/$docker_compose_yml
}

fcos_installer() {
  docker run \
    --security-opt label=disable \
    --pull=always \
    --rm \
    -v $PWD:/data \
    -w /data \
    quay.io/coreos/coreos-installer:release "$@"
}

butane() {
  docker run \
    --interactive \
    --rm \
    -v $PWD:/data \
    -w /data \
    quay.io/coreos/butane:release "$@"
}

ssh_qemu() {
  ssh -p 2222 -i ~/.ssh/id_substrateos substrate@localhost "$@"
}

os_make_install_iso() {
  cd $HERE/os/fcos/
  mkdir -p .gen .fetch
  print_rendered_cue_dev_expr_as yaml -e '#out.ignition' | butane --pretty --strict --files-dir=./ /dev/stdin --output .gen/substrate.ign
  FCOS_INSTALLER_ISO=$(fcos_installer download -s $FCOS_STREAM -p metal -f iso -C .fetch)
  fcos_installer \
      iso customize \
      '--dest-device=/dev/nvme0n1' \
      '--dest-ignition=./.gen/substrate.ign' \
      '--dest-console=ttyS0,115200n8' \
      '--dest-console=tty0' \
      '--force' \
      -o .gen/$SUBSTRATEOS_ISO_BASENAME \
      $FCOS_INSTALLER_ISO

  cd -
}

# write_os_resources_overlay_service() {
#   # bind resources volume
#   # save resources
#   # these should be ready at boot
#   # include them in the table used by substrate at runtime and spawn.
# }

# write_os_resources_overlay() {
#   # for each service, if there's anything to fetch, run them with fetch to apply
#   #   # write_os_resources_overlay_service
# }

write_resourcesets_overlay() {
  # for each resourceset,
  # build and run each resourceset, mounting the appropriate folder
  # we can do this as a docker compose run type thing ... mounting a lot of folders...
  # give each resourceset a secondary id based on the hash of their inputs...
  return
}

write_os_containers_overlay() {
  # https://man.archlinux.org/man/containers-transports.5.en
  # https://www.redhat.com/sysadmin/image-stores-podman
  # https://github.com/rancher/os/issues/1449
  # https://github.com/coreos/rpm-ostree/issues/874
  # "Add container-images to the compose / treefile" https://github.com/coreos/rpm-ostree/issues/2675
  # "error: Not a regular file or symlink: node when adding node container image to the tree" https://github.com/ostreedev/ostree/issues/2310
  # "container: support splitting inputs" https://github.com/ostreedev/ostree-rs-ext/issues/69
  # "Support opinionated flow for injecting containers into /usr/lib/containers" https://github.com/ostreedev/ostree-rs-ext/issues/246
  # "Add opinionated container binding with podman" https://github.com/containers/bootc/issues/128

  if [ -z "$PODMAN" ]; then
    PODMAN=$(PATH=/opt/podman/bin:$PATH which podman)
  fi

  OVERLAY_BASEDIR=$1
  IMAGE_STORE_BASEDIR=usr/share/containers/storage
  SYSTEMD_CONTAINERS_BASEDIR=etc/containers/systemd
  LENSES_EXPR_PATH=usr/share/substrate/lenses.cue
  OVERLAY_IMAGE_STORE_BASEDIR=$OVERLAY_BASEDIR/$IMAGE_STORE_BASEDIR
  OVERLAY_SYSTEMD_CONTAINERS_BASEDIR=$OVERLAY_BASEDIR/$SYSTEMD_CONTAINERS_BASEDIR
  OVERLAY_LENSES_EXPR_PATH=$OVERLAY_BASEDIR/$LENSES_EXPR_PATH
  mkdir -p os/$OVERLAY_IMAGE_STORE_BASEDIR os/$OVERLAY_SYSTEMD_CONTAINERS_BASEDIR os/$(dirname $OVERLAY_LENSES_EXPR_PATH)

  # write_cue_dev_expr $CUE_DEV_EXPR_PATH
  write_rendered_cue_dev_expr_as_cue os/$OVERLAY_LENSES_EXPR_PATH -e "#out.#lenses"

  # populate images
  IMAGES=$(print_rendered_cue_dev_expr_as text -e '#out.image_references')
  echo IMAGES=$IMAGES
  PODMAN_LOCAL_REPO_OPTIONS=$($PODMAN info --format='overlay.mount_program={{ index .Store.GraphOptions "overlay.mount_program" "Executable" }}' || true)
  PODMAN_LOCAL_REPO=$($PODMAN info --format="containers-storage:[{{ .Store.GraphDriverName }}@{{ .Store.GraphRoot }}+{{ .Store.RunRoot }}:$PODMAN_LOCAL_REPO_OPTIONS]")
  for image in $IMAGES; do
    PODMAN_BUILD_OPTIONS=$(print_rendered_cue_dev_expr_as text -e "#out.image_podman_build_options[\"$image\"]" $TAG_ARGS)
    $PODMAN build --layers --tag $image $PODMAN_BUILD_OPTIONS
    $PODMAN pull --root os/$OVERLAY_IMAGE_STORE_BASEDIR ${PODMAN_LOCAL_REPO}$image
  done

  # populate associated systemd units
  UNITS=$(print_rendered_cue_dev_expr_as text -e '#out.systemd_container_basenames')
  echo UNITS=$UNITS
  for unit in $UNITS; do
    print_rendered_cue_dev_expr_as text -e "#out.systemd_containers[\"$unit\"]" $TAG_ARGS > os/$OVERLAY_SYSTEMD_CONTAINERS_BASEDIR/$unit
  done

  # init ostree repo if needed
  tmprepo=tmp/repo
  if [ ! -d "os/${tmprepo}" ]; then
    mkdir -p os/${tmprepo}
    ./tools/cosa shell ostree init --repo="/srv/${tmprepo}" --mode=archive
    # This archive repo is transient, so lower the compression
    # level to avoid burning excessive CPU.
    ./tools/cosa shell ostree --repo="/srv/${tmprepo}" config set archive.zlib-level 2
  fi

  # write our overlay to the ostree repo
  ./tools/cosa shell sudo ostree commit --repo="/srv/${tmprepo}" \
      --tree=dir="/srv/$OVERLAY_BASEDIR" -b "gen-overlay/containers" \
      --no-xattrs --no-bindings --parent=none \
      --mode-ro-executables
      # --timestamp "${git_timestamp}"
      # --statoverride <(sed -e '/^#/d' "${TMPDIR}/overlay/statoverride") \
      # --skip-list <(echo /statoverride)
  ./tools/cosa shell sudo chown -R builder:builder "/srv/${tmprepo}"
}

cosa_run() {
  IGNITION_FILE=.gen/substrate.ign
  mkdir -p os/$(dirname $IGNITION_FILE)
  print_rendered_cue_dev_expr_as yaml -e '#out.ignition' | butane --pretty --strict --files-dir=./ /dev/stdin --output os/$IGNITION_FILE
  $HERE/tools/cosa run --ignition "$IGNITION_FILE" "$@"
}

FCOS_STREAM=stable
QEMU_RAM=2048
QEMU_DISK=32G
SUBSTRATEOS_QCOW2_FILE_BASENAME=substrateos-qemu.qcow2
SUBSTRATEOS_ISO_BASENAME=substrateos.iso

case "$1" in
  cosa)
    shift
    $HERE/tools/cosa "$@"
    ;;
  cosa-run)
    shift
    cosa_run "$@"
    ;;
  os-make)
    shift
    ensure_dev_cue_expr

    write_os_containers_overlay .gen/overlay.d/containers
    docker build tools/nvidia-kmods/ --output type=local,dest=os/overrides/rpm

    # sudo chmod 0777 /dev/kvm

    ./tools/cosa fetch --with-cosa-overrides
    ./tools/cosa build

    ./tools/cosa buildextend-metal
    ./tools/cosa buildextend-metal4k
    ./tools/cosa buildextend-live

    cd os
    print_rendered_cue_dev_expr_as yaml -e '#out.ignition' | butane --pretty --strict --files-dir=./ /dev/stdin --output .gen/substrate.ign
    FCOS_INSTALLER_ISO=$(ls builds/latest/x86_64/*.iso)
    fcos_installer \
        iso customize \
        '--live-ignition=./.gen/substrate.ign' \
        '--force' \
        -o .gen/$SUBSTRATEOS_ISO_BASENAME \
        $FCOS_INSTALLER_ISO

    ;;
  # cosa-build-fast)
  #   shift

  #   write_container_quadlet_overlay os/src/config/overlay.d/50containers
  #   ./tools/cosa build-fast
  #   ;;
  cosa-build-fast-run)
    shift
    QEMU_IMAGE=$(cd os/.cosa; find -name '*-qemu.qcow2' | sort | tail -n 1)
    cosa_run --qemu-image .cosa/$QEMU_IMAGE
    ;;
  fcos-installer)
    shift
    fcos_installer "$@"
    ;;
  podman-machine-init-applehv)
    shift
    # If needed, download vfkit and put it in /opt/podman/qemu/bin/ https://github.com/crc-org/vfkit/releases/download/v0.5.0/vfkit
    CONTAINERS_MACHINE_PROVIDER="applehv" /opt/podman/bin/podman machine init --cpus 4 --rootful --memory 4096 --now podman-machine-applehv
    ;;
  os-qemu-reset)
    shift
    cd $HERE/os/fcos/
    rm .gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME
    ssh-keygen -R '[localhost]:2222'
    ;;
  os-qemu-run-iso)
    shift
    cd $HERE/os/fcos/
    mkdir -p .gen

    # if [ ! -f .gen/$SUBSTRATEOS_ISO_BASENAME ]; then
      os_make_install_iso
    # fi

    if [ ! -f .gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME ]; then
      cd .gen
      ssh-keygen -R '[localhost]:2222'
      qemu-img create \
          -f qcow2 \
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
      -cdrom .gen/$SUBSTRATEOS_ISO_BASENAME \
      -drive if=none,file=.gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME,id=nvm \
      -device nvme,serial=deadbeef,drive=nvm \
      -nic user,model=virtio,hostfwd=tcp::2222-:22,hostfwd=tcp::2280-:2280,hostfwd=tcp::2281-:2281,hostfwd=tcp::4222-:4222
    ;;
  os-qemu-run)
    shift
    ensure_dev_cue_expr
    cd $HERE/os/fcos/
    mkdir -p .gen .fetch
    IGNITION_FILE=.gen/substrate.ign
    print_rendered_cue_dev_expr_as yaml -e '#out.ignition' | butane --pretty --strict --files-dir=./ /dev/stdin --output $IGNITION_FILE
    if [ ! -f .gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME ]; then
      FCOS_QCOW2_XZ_FILE=$(fcos_installer download -s $FCOS_STREAM -p qemu -f qcow2.xz -C .fetch)
      FCOS_QCOW2_FILE_BASENAME=$(basename $FCOS_QCOW2_XZ_FILE .xz)
      FCOS_QCOW2_FILE=.gen/$FCOS_QCOW2_FILE_BASENAME
      if [ ! -f $FCOS_QCOW2_FILE ]; then
        unxz <$FCOS_QCOW2_XZ_FILE >$FCOS_QCOW2_FILE
      fi
      cd .gen
      ssh-keygen -R '[localhost]:2222'
      qemu-img create \
          -f qcow2 \
          -F qcow2 \
          -b $FCOS_QCOW2_FILE_BASENAME \
          $SUBSTRATEOS_QCOW2_FILE_BASENAME \
          $QEMU_DISK
      cd -
    fi
    # need qemu ≥ 7.1.0 for vmnet-bridge to work, but nixpkgs build still lacks it.
    qemu-system-x86_64 \
      -m $QEMU_RAM \
      -nographic \
      -cpu host \
      -M accel=hvf \
      -drive if=virtio,file=.gen/$SUBSTRATEOS_QCOW2_FILE_BASENAME \
      -fw_cfg name=opt/com.coreos/config,file=$IGNITION_FILE \
      -nic user,model=virtio,hostfwd=tcp::2222-:22,hostfwd=tcp::2280-:2280,hostfwd=tcp::2281-:2281,hostfwd=tcp::4222-:4222
    ;;
  # os-qemu-rebase)
  #   shift
  #   ensure_dev_cue_expr
  #   docker_compose_yml=$(make_docker_compose_yml os substrateos.docker_compose_build)
  #   docker_compose $docker_compose_yml build "os-rebase"
  #   REBASE_IMAGE=$(print_rendered_cue_dev_expr_as text -e '#out.substrateos.#rebase_image')
  #   docker image save $REBASE_IMAGE | ssh_qemu 'skopeo copy docker-archive:/dev/stdin ostree:$REBASE_IMAGE@/ostree/repo'
  #   ssh_qemu sudo rpm-ostree rebase --reboot --cache-only $REBASE_IMAGE
  #   ;;
  # os-qemu-update-containers)
  #   shift
  #   ensure_dev_cue_expr
  #   # re-render /etc
  #   mkdir -p $HERE/os/fcos/.gen/etc/containers/systemd
  #   # print_rendered_cue_dev_expr_as text -e '#out.systemd.containers["substrate-pull.image"].#text' > $HERE/os/fcos/.gen/etc/containers/systemd/substrate-pull.image
  #   print_rendered_cue_dev_expr_as text -e '#out.substrateos.systemd.containers["substrate.container"].#text' > $HERE/os/fcos/.gen/etc/containers/systemd/substrate.container
  #   # build
  #   docker_compose_yml=$(make_docker_compose_yml os substrateos.docker_compose_build)
  #   docker_compose $docker_compose_yml build
  #   # replace /etc
  #   tar -cv -C $HERE/os/fcos/.gen/etc . | ssh_qemu sudo tar xv --no-same-owner -C /etc
  #   # update
  #   IMAGES=$(print_rendered_cue_dev_expr_as text -e '#out.substrateos.docker_compose_build.#images')
  #   echo IMAGES=$IMAGES
  #   for image in $IMAGES; do
  #     docker image save $image | ssh_qemu sudo skopeo copy docker-archive:/dev/stdin containers-storage:$image
  #   done
  #   ssh_qemu sudo systemctl daemon-reload
  #   ssh_qemu sudo systemctl restart substrate
  #   ssh_qemu sudo journalctl -xlfeu substrate.service
  #   ;;
  os-qemu-ssh)
    shift
    ssh_qemu "$@"
    ;;
    
  expr-dump)
    shift
    print_cue_dev_expr
    ;;
  docker-compose-up)
    shift
    LENSES_EXPR_PATH=.gen/cue/$NAMESPACE-lenses.cue
    ROOT_SOURCE_DIR=$HERE
    PROBE_PREFIX="sh -c"
    HOST_DOCKER_SOCKET="/var/run/docker.sock"
    # ensure_dev_cue_expr
    write_rendered_cue_dev_expr_as_cue $LENSES_EXPR_PATH -e "#out.#lenses"
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose')
    docker_compose $DOCKER_COMPOSE_FILE --profile resourcedirs build
    docker_compose $DOCKER_COMPOSE_FILE --profile resourcedirs up
    docker_compose $DOCKER_COMPOSE_FILE --profile daemons build
    docker_compose $DOCKER_COMPOSE_FILE --profile daemons up \
        --always-recreate-deps \
        --remove-orphans \
        --force-recreate \
        "$@"
    ;;
  remote-docker-compose)
    shift
    DOCKER_HOST=$REMOTE_DOCKER_HOST docker_compose $(make_docker_compose_yml substrate '#out.docker_compose') "$@"
    ;;
  remote-docker-compose-up)
    shift
    ensure_dev_cue_expr
    LENSES_EXPR_PATH=.gen/cue/$NAMESPACE-lenses.cue
    write_rendered_cue_dev_expr_as_cue $LENSES_EXPR_PATH -e "#out.#lenses"
    ROOT_SOURCE_DIR=/tmp
    TAG_ARGS="-t root_source_directory=$ROOT_SOURCE_DIR -t lenses_expr_path=$LENSES_EXPR_PATH"
    if ! ssh $REMOTE_DOCKER_HOSTNAME nvidia-smi 2>&1 >/dev/null; then
      TAG_ARGS="$TAG_ARGS -t no_cuda=1"
    fi    
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose' $TAG_ARGS)
    DOCKER_HOST=$REMOTE_DOCKER_HOST docker_compose $DOCKER_COMPOSE_FILE --profile daemons --profile default build
    DOCKER_HOST=$REMOTE_DOCKER_HOST docker_compose $DOCKER_COMPOSE_FILE --profile daemons up \
        --always-recreate-deps \
        --remove-orphans \
        --force-recreate \
        "$@"
    ;;
  remote-service-ssh-tunnel)
    shift
    ensure_dev_cue_expr
    : ${REMOTE_SERVICE:=${1:-bridge}}
    : ${LOCAL_PORT:=${2:-8080}}
    REMOTE_PORT=$(print_rendered_cue_dev_expr_as text -e "#out.\"\(#namespace_host_port_offset + #service_host_port_offset[\"$REMOTE_SERVICE\"])\"")
    ssh -L$LOCAL_PORT:127.0.0.1:$REMOTE_PORT $REMOTE_DOCKER_HOSTNAME
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

    docker_compose_yml=$(make_docker_compose_yml substrate '#out.docker_compose')
    docker_compose $docker_compose_yml build "$lens"
    docker_compose $docker_compose_yml run \
        --rm \
        --interactive \
        --env PORT=$internal_port \
        -p $PORT:$internal_port \
        ${volume_args[@]} \
        "$lens"
    ;;
  *)
    echo >&2 "unknown command $1"
    exit 3
    ;;
esac


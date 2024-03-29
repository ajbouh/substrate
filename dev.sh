#!/bin/bash

set -exo pipefail

HERE=$(cd $(dirname $0); pwd)

: ${NAMESPACE:=substrate-nobody}

CUE_VERSION="0.7.0"
CUE_PREFIX=cue_v${CUE_VERSION}_
CUE_NATIVE_SUFFIX=$(uname -s | tr "[:upper:]" "[:lower:]")_$(uname -m)
# HACK use amd64
case "$CUE_NATIVE_SUFFIX" in
  linux_x86_64)
    CUE_NATIVE_SUFFIX=linux_amd64
    ;;
esac
CUE_NATIVE=$HERE/tools/cue/${CUE_PREFIX}${CUE_NATIVE_SUFFIX}

if [ -z "$PODMAN" ]; then
  PODMAN=$(PATH=/opt/podman/bin:$PATH which podman)
fi

if [ -z "$DOCKER" ]; then
  DOCKER=$(PATH=~/.docker/bin:$PATH which docker)
fi

CUE_DEV_EXPR_PATH=.gen/cue/$NAMESPACE-dev.cue
CUE_DEV_PACKAGE=github.com/ajbouh/substrate/defs

COREOS_ASSEMBLER_GIT=$HERE/images/coreos-assembler
COREOS_ASSEMBLER_CONTAINER="quay.io/coreos-assembler/coreos-assembler@sha256:4efbb019b571bfcf7ca5eeaf5444e9b7ba64f283e01247d105f36c13ca0813d9"

# See also https://www.itix.fr/blog/build-your-own-distribution-on-fedora-coreos/
cosa() {
  env | grep -E "^COREOS_ASSEMBLER|COSA" | sort || true
  # Disable "latest" check for now, since we've pinned so much.
  # local -r COREOS_ASSEMBLER_CONTAINER_LATEST="quay.io/coreos-assembler/coreos-assembler:latest"
  # if [[ -z ${COREOS_ASSEMBLER_CONTAINER} ]] && $($PODMAN image exists ${COREOS_ASSEMBLER_CONTAINER_LATEST}); then
  #   local -r cosa_build_date_str="$($PODMAN inspect -f "{{.Created}}" ${COREOS_ASSEMBLER_CONTAINER_LATEST} | awk '{print $1}')"
  #   local -r cosa_build_date="$(date -d ${cosa_build_date_str} +%s)"
  #   if [[ $(date +%s) -ge $((cosa_build_date + 60*60*24*7)) ]] ; then
  #     echo -e "\e[0;33m----" >&2
  #     echo "The COSA container image is more that a week old and likely outdated." >&2
  #     echo "You should pull the latest version with:" >&2
  #     echo "$PODMAN pull ${COREOS_ASSEMBLER_CONTAINER_LATEST}" >&2
  #     echo -e "----\e[0m" >&2
  #     sleep 10
  #   fi
  # fi
  set -x
  $PODMAN run --rm -ti --security-opt=label=disable --privileged                          \
    --uidmap=1000:0:1 --uidmap=0:1:1000 --uidmap=1001:1001:64536                          \
    -w /srv                                                                               \
    -v=${HERE}/os:/srv/ -v=${HERE}/.git:/srv/.git:ro -v=${HERE}/.git:/srv/src/config/.git:ro --device=/dev/kvm --device=/dev/fuse                                  \
    --tmpfs=/tmp -v=/var/tmp:/var/tmp                                         \
    -e COSA_NO_KVM -e COSA_DIR=. -e LIBGUESTFS_DEBUG=1 -e LIBGUESTFS_TRACE=1 \
    ${COREOS_ASSEMBLER_CONFIG_GIT:+-v=$COREOS_ASSEMBLER_CONFIG_GIT:/srv/src/config/:ro}   \
    ${COREOS_ASSEMBLER_GIT:+-v=$COREOS_ASSEMBLER_GIT/src/:/usr/lib/coreos-assembler/:ro}  \
    ${COREOS_ASSEMBLER_ADD_CERTS:+-v=/etc/pki/ca-trust:/etc/pki/ca-trust:ro}              \
    ${COREOS_ASSEMBLER_CONTAINER_RUNTIME_ARGS}                                            \
    ${COREOS_ASSEMBLER_CONTAINER:-$COREOS_ASSEMBLER_CONTAINER_LATEST} "$@"
  rc=$?; set +x; return $rc
}

cue() {
  # lazily unpack and download a native version of cue
  if [ ! -f $CUE_NATIVE ]; then
    CUE_ARTIFACT=$HERE/tools/cue/${CUE_PREFIX}${CUE_NATIVE_SUFFIX}.tar.gz
    if [ ! -f $CUE_ARTIFACT ]; then
      mkdir -p $(dirname $CUE_ARTIFACT)
      curl -L https://github.com/cue-lang/cue/releases/download/v$CUE_VERSION/$(basename $CUE_ARTIFACT) > $CUE_ARTIFACT
    fi
    if [ -f $CUE_ARTIFACT ]; then
      tar -xv --to-stdout -f $CUE_ARTIFACT cue > $CUE_NATIVE
      chmod +x $CUE_NATIVE
    fi
  fi

  if [ -f $CUE_NATIVE ]; then
    $CUE_NATIVE "$@"
  fi
}

detect_dev_cue_tag_args() {
  set +x
  if [ -n "$CUE_DEV_TAG_ARGS" ]; then
    set -x
    return
  fi

  CUE_DEV_TAG_ARGS=" "

  if [ -z "$NAMESPACE" ]; then
    echo >&2 "NAMESPACE not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t namespace=$NAMESPACE"

  if [ -z "$USE_VARSET" ]; then
    echo >&2 "USE_VARSET not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t use_varset=$USE_VARSET"

  if [ -z "$BUILD_SOURCE_DIRECTORY" ]; then
    echo >&2 "BUILD_SOURCE_DIRECTORY not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t build_source_directory=$BUILD_SOURCE_DIRECTORY"

  if [ -z "$CUE_DEV_DEFS" ]; then
    echo >&2 "CUE_DEV_DEFS not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t cue_defs=$CUE_DEV_DEFS"


  set -x
}

print_rendered_cue_dev_expr_as() {
  format=$1
  shift

  detect_dev_cue_tag_args

  cue export \
    --out $format \
    $CUE_DEV_TAG_ARGS \
    $CUE_DEV_PACKAGE \
    "$@"
}

write_rendered_cue_dev_expr_as() {
  format=$1
  dest=$2
  shift 2

  detect_dev_cue_tag_args

  mkdir -p $(dirname $dest)
  [ ! -e $docker_compose_yml ] || mv -f $docker_compose_yml $docker_compose_yml.old
  cue export --trace --all-errors --verbose \
    --out $format \
    --outfile $docker_compose_yml \
    $CUE_DEV_TAG_ARGS \
    $CUE_DEV_PACKAGE \
    "$@"
}

check_cue_dev_expr_as_cue() {
  detect_dev_cue_tag_args

  cue def --strict --trace --all-errors --verbose --inline-imports --simplify \
    $CUE_DEV_PACKAGE \
    $CUE_DEV_TAG_ARGS \
    "$@"
}

docker_compose() {
  docker_compose_yml=$1
  shift
  $DOCKER compose \
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

ensure_init_ostree_repo() {
  # init ostree repo if needed
  tmprepo=$1
  if [ ! -d "os/${tmprepo}/repo" ]; then
    mkdir -p os/${tmprepo}
    cosa shell ostree init --repo="/srv/${tmprepo}" --mode=archive
    # This archive repo is transient, so lower the compression
    # level to avoid burning excessive CPU.
    cosa shell ostree --repo="/srv/${tmprepo}" config set archive.zlib-level 2
  fi
}

commit_ostree_layer() {
  repo=$1
  layer_name=$2
  layer_basedir=$3

  ensure_init_ostree_repo $repo

  # write our overlay to the ostree repo
  cosa shell sudo ostree commit --repo="/srv/${repo}" \
      --tree=dir="/srv/$layer_basedir" -b $layer_name \
      --no-xattrs --no-bindings --parent=none \
      --mode-ro-executables
      # --timestamp "${git_timestamp}"
      # --statoverride <(sed -e '/^#/d' "${TMPDIR}/overlay/statoverride") \
      # --skip-list <(echo /statoverride)
  cosa shell sudo chown -R builder:builder "/srv/${repo}"
}

write_os_resourcedirs_overlay() {
  RESOURCEDIR_KEYS=$(print_rendered_cue_dev_expr_as text -e '#out.resourcedir_keys')
  echo RESOURCEDIR_KEYS=$RESOURCEDIR_KEYS
  for resourcedir_key in $RESOURCEDIR_KEYS; do
    PODMAN_BUILD_OPTIONS=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetch_podman_build_options[\"$resourcedir_key\"]")
    PODMAN_RUN_OPTIONS=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetch_podman_run_options[\"$resourcedir_key\"]")
    RESOURCEDIR_MKDIRS=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetch_dirs[\"$resourcedir_key\"]")
    $PODMAN build $PODMAN_BUILD_OPTIONS

    # podman won't automatically make these directories, so do it now.
    mkdir -p $RESOURCEDIR_MKDIRS
    $PODMAN run --rm $PODMAN_RUN_OPTIONS
  done
}

write_os_container_units_overlay() {
  OVERLAY_BASEDIR=$1
  SYSTEMD_CONTAINERS_BASEDIR=$2
  SYSTEMD_PRESET_BASEDIR=$3

  OVERLAY_SYSTEMD_CONTAINERS_BASEDIR=$OVERLAY_BASEDIR/$SYSTEMD_CONTAINERS_BASEDIR
  OVERLAY_SYSTEMD_PRESET_BASEDIR=$OVERLAY_BASEDIR/$SYSTEMD_PRESET_BASEDIR

  mkdir -p $OVERLAY_SYSTEMD_CONTAINERS_BASEDIR $OVERLAY_SYSTEMD_PRESET_BASEDIR

  # populate associated systemd units
  preset=$OVERLAY_SYSTEMD_PRESET_BASEDIR/50-containers.preset
  UNITS=$(print_rendered_cue_dev_expr_as text -e '#out.systemd_container_basenames')
  echo UNITS=$UNITS
  echo "# Autogenerated by dev.sh" > $preset
  for unit in $UNITS; do
    print_rendered_cue_dev_expr_as text -e "#out.systemd_container_contents[\"$unit\"]" > $OVERLAY_SYSTEMD_CONTAINERS_BASEDIR/$unit
    echo "enable $(basename $unit .container).service" >> $preset
  done
}

build_image() {
  image=$1
  PODMAN_BUILD_OPTIONS=$(print_rendered_cue_dev_expr_as text -e "#out.image_podman_build_options[\"$image\"]")
  $PODMAN build --layers --tag $image $PODMAN_BUILD_OPTIONS
}

build_images() {
  if [ $# -eq 0 ]; then
    # populate images
    IMAGES=$(print_rendered_cue_dev_expr_as text -e '#out.image_references')
    echo IMAGES=$IMAGES
    for image in $IMAGES; do
      build_image $image
    done
  else
    for image_name in $@; do
      image=$(print_rendered_cue_dev_expr_as text -e "#out.imagespecs[\"$image_name\"].image")
      build_image $image
    done
  fi
}

write_images_to_imagestore() {
  # https://man.archlinux.org/man/containers-transports.5.en
  # https://www.redhat.com/sysadmin/image-stores-podman
  # https://github.com/rancher/os/issues/1449
  # https://github.com/coreos/rpm-ostree/issues/874
  # "Add container-images to the compose / treefile" https://github.com/coreos/rpm-ostree/issues/2675
  # "error: Not a regular file or symlink: node when adding node container image to the tree" https://github.com/ostreedev/ostree/issues/2310
  # "container: support splitting inputs" https://github.com/ostreedev/ostree-rs-ext/issues/69
  # "Support opinionated flow for injecting containers into /usr/lib/containers" https://github.com/ostreedev/ostree-rs-ext/issues/246
  # "Add opinionated container binding with podman" https://github.com/containers/bootc/issues/128

  IMAGESTORE=$1
  shift

  IMAGES=$@

  PODMAN_LOCAL_REPO_OPTIONS=$($PODMAN info --format='overlay.mount_program={{ index .Store.GraphOptions "overlay.mount_program" "Executable" }}' || true)
  PODMAN_LOCAL_REPO=$($PODMAN info --format="containers-storage:[{{ .Store.GraphDriverName }}@{{ .Store.GraphRoot }}+{{ .Store.RunRoot }}:$PODMAN_LOCAL_REPO_OPTIONS]")

  for image in $IMAGES; do
    $PODMAN pull --root $IMAGESTORE ${PODMAN_LOCAL_REPO}$image
  done
}

set_os_vars() {
  CUE_DEV_DEFS="defs"
  USE_VARSET="substrateos"
  BUILD_SOURCE_DIRECTORY="$HERE"
}

set_docker_vars() {
  CUE_DEV_DEFS="defs"
  USE_VARSET="docker_compose"
  BUILD_SOURCE_DIRECTORY="$HERE"
}

systemd_logs() {
  journalctl -xfeu substrate.service
}

systemd_reload() {
  containers=$@

  check_cue_dev_expr_as_cue

  DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose')

  # TODO only build $containers
  build_images $containers

  # HACK should actually only be pulling the images we built...
  IMAGES=$(print_rendered_cue_dev_expr_as text -e '#out.image_references')
  for image in $IMAGES; do
    image_id=$($PODMAN image inspect $image -f '{{.ID}}')
    if ! sudo $PODMAN image exists $image_id; then
      $PODMAN save $image | sudo $PODMAN load
    fi
  done

  write_os_resourcedirs_overlay

  # show overrides before we replace anything (as a sort of poor man's backup)
  systemd-delta

  # reconstruct the parts of the overlay we can safely reload.
  RELOAD_OVERLAY_BASEDIR=os/gen/overlay.d/reload
  rm -rf $RELOAD_OVERLAY_BASEDIR
  mkdir -p $RELOAD_OVERLAY_BASEDIR

  write_os_container_units_overlay $RELOAD_OVERLAY_BASEDIR etc/containers/systemd etc/systemd/system-preset

  # /etc is writable so this is fine
  cp -r os/src/config/overlay.d/50substrateos/etc/. $RELOAD_OVERLAY_BASEDIR/etc/
  # systemd overrides go in /etc
  cp -r os/src/config/overlay.d/50substrateos/usr/lib/systemd/* $RELOAD_OVERLAY_BASEDIR/etc/systemd/

  sudo cp -r $RELOAD_OVERLAY_BASEDIR/* /

  sudo systemctl daemon-reload

  # show overrides
  systemd-delta

  # HB it would be better to run this on the overlay dir *before* we copy it. how do we do that?
  /usr/libexec/podman/quadlet --dryrun

  # HACK restart a few services by name. It would be much better to it based on what's changed...
  sudo systemctl restart substrate caddy nvidia-ctk-cdi-generate vscode-server
}

os_oob_make() {
  write_os_resourcedirs_overlay

  check_cue_dev_expr_as_cue
 
  build_images
  IMAGES=$(print_rendered_cue_dev_expr_as text -e '#out.image_references')

  sudo rm -rf os/gen/oob/imagestore
  mkdir -p os/gen/oob/imagestore
  write_images_to_imagestore os/gen/oob/imagestore $IMAGES
  
  mkdir -p os/src/config/live/oob
  cosa shell sudo mksquashfs gen/oob src/config/live/oob/oob.squashfs -noappend -wildcards -no-recovery -comp zstd
}

os_fetch() {
  $PODMAN build images/nvidia-kmods/ --output type=local,dest=os/overrides/rpm

  OS_OVERLAY_BASEDIR=gen/overlay.d/substrateos
  OVERLAY_BASEDIR=os/$OS_OVERLAY_BASEDIR
  rm -rf $OVERLAY_BASEDIR
  mkdir -p $OVERLAY_BASEDIR
  write_os_container_units_overlay $OVERLAY_BASEDIR usr/share/containers/systemd usr/lib/systemd/system-preset

  # These are static binaries that we want to embed directly in the OS
  $PODMAN build -f images/gotty/Dockerfile --target=gotty --output type=local,dest=$OVERLAY_BASEDIR/usr/bin/ .
  $PODMAN build -f images/caddy/Dockerfile --target=caddy --output type=local,dest=$OVERLAY_BASEDIR/usr/bin/ .

  commit_ostree_layer "tmp/repo" "gen-overlay/substrateos" $OS_OVERLAY_BASEDIR

  cosa fetch --with-cosa-overrides
}

os_make() {
  cosa build

  cosa buildextend-metal
  cosa buildextend-metal4k
  cosa buildextend-live
}

build_iso() {
  os_fetch
  os_oob_make
  os_make
}

write_latest_iso() {
  dst=$1
  if [ -z "$dst" ]; then
    echo >&2 "fatal: no destination device given"
    exit 1
  fi
  src=$(ls os/builds/latest/x86_64/*.x86_64.iso)
  sudo dd if=$src of=$dst bs=4M conv=fdatasync status=progress
}

case "$1" in
  cosa)
    shift
    cosa "$@"
    ;;
  cue)
    shift
    cue "$@"
    ;;
  expr-dump)
    shift
    print_cue_dev_expr
    ;;
  reload|systemd-reload)
    shift
    set_os_vars
    systemd_reload "$@"
    ;;
  systemd-logs)
    shift
    set_os_vars
    systemd_logs
    ;;
  systemd-reload-follow|srf)
    shift
    set_os_vars
    systemd_reload "$@"
    systemd_logs
    ;;
  build-iso)
    shift
    set_os_vars
    build_iso
    ;;
  write-latest-iso)
    shift
    write_latest_iso "$@"
    ;;
  oob-make|os-oob-make)
    shift
    set_os_vars
    os_oob_make
    ;;
  os-fetch)
    shift
    set_os_vars
    os_fetch
    ;;
  os-make)
    shift
    set_os_vars
    os_make
    ;;
  docker-compose-build)
    shift
    set_docker_vars
    check_cue_dev_expr_as_cue
 
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose')
    docker_compose $DOCKER_COMPOSE_FILE build "$@"
    ;;
  test)
    shift
    if [ $# -eq 0 ]; then
      COMPOSE_PROFILES="tests"
    else
      COMPOSE_PROFILES="tests.$1"
      shift
      for t in "$@"; do
        COMPOSE_PROFILES="$profiles,tests.$t"
      done
    fi

    set_docker_vars
    check_cue_dev_expr_as_cue
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose')
    export COMPOSE_PROFILES
    docker_compose $DOCKER_COMPOSE_FILE up \
      --always-recreate-deps \
      --remove-orphans \
      --force-recreate \
      --abort-on-container-exit	\
      --build
    ;;
  run-test)
    shift
    set_docker_vars
    check_cue_dev_expr_as_cue
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose')
    export COMPOSE_PROFILES
    docker_compose $DOCKER_COMPOSE_FILE run \
      --remove-orphans \
      --build \
      --rm \
      -it \
      tests.$1
    ;;
  docker-compose-up)
    shift
    set_docker_vars
    DOCKER_SERVICES=$@
    check_cue_dev_expr_as_cue
 
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate '#out.docker_compose')
    docker_compose $DOCKER_COMPOSE_FILE --profile daemons --profile default build
    docker_compose $DOCKER_COMPOSE_FILE --profile resourcedirs build
    docker_compose $DOCKER_COMPOSE_FILE --profile resourcedirs up
    docker_compose $DOCKER_COMPOSE_FILE --profile daemons up \
        --always-recreate-deps \
        --remove-orphans \
        --force-recreate \
        $DOCKER_SERVICES
    ;;
esac


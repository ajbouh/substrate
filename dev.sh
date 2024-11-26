#!/bin/bash

set -eo pipefail

HERE=$(cd $(dirname $0); pwd)

: ${NAMESPACE:=substrate-nobody}

CUE_VERSION="0.11.0-alpha.4"
CUE_PREFIX=cue_v${CUE_VERSION}_
CUE_NATIVE_SUFFIX=$(uname -s | tr "[:upper:]" "[:lower:]")_$(uname -m)
# HACK use amd64
case "$CUE_NATIVE_SUFFIX" in
  linux_x86_64)
    CUE_NATIVE_SUFFIX=linux_amd64
    ;;
esac
CUE_NATIVE=$HERE/tools/cue/${CUE_PREFIX}${CUE_NATIVE_SUFFIX}

BUILDX_VERSION="0.19.1"
BUILDX_PREFIX=buildx-v${BUILDX_VERSION}.
BUILDX_NATIVE_SUFFIX=$(uname -s | tr "[:upper:]" "[:lower:]")_$(uname -m)
# HACK use amd64
case "$BUILDX_NATIVE_SUFFIX" in
  linux_x86_64)
    BUILDX_NATIVE_SUFFIX=linux-amd64
    ;;
esac
BUILDX_NATIVE=$HERE/tools/buildx/${BUILDX_PREFIX}${BUILDX_NATIVE_SUFFIX}

TXTAR_VERSION="v0.0.0-20241009180824-f66d83c29e7c"
TXTAR_PREFIX=txtar-${TXTAR_VERSION}_
TXTAR_NATIVE_SUFFIX=$(uname -s | tr "[:upper:]" "[:lower:]")_$(uname -m)
TXTAR_NATIVE=$HERE/tools/txtar/${TXTAR_PREFIX}${TXTAR_NATIVE_SUFFIX}

if [ -z "$PODMAN" ]; then
  PODMAN=$(PATH=/opt/podman/bin:$PATH which podman)
fi

if [ -z "$DOCKER" ]; then
  DOCKER=$(PATH=~/.docker/bin:$PATH which docker)
fi

# TODO don't hardcode this here.
SUBSTRATEOS_IMAGE=ghcr.io/ajbouh/substrate:substrate-substrateos
SUBSTRATEOS_OVERLAY_IMAGE=ghcr.io/ajbouh/substrate:substrate-substrateos-overlay

ensure_cue() {
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
}

CUE_DEV_DIR=./defs

cue() {
  ensure_cue
  cd >/dev/null $CUE_DEV_DIR
  if [ -f $CUE_NATIVE ]; then
    $CUE_NATIVE "$@"
  fi
  cd >/dev/null -
}

ensure_txtar() {
  if [ ! -f $TXTAR_NATIVE ]; then
    $PODMAN build \
      -f $HERE/images/txtar/Dockerfile \
      --target=txtar \
      --build-arg=TXTAR_VERSION=$TXTAR_VERSION \
      --build-arg=TXTAR_BASENAME=$(basename $TXTAR_NATIVE) \
      --output type=local,dest=$(dirname $TXTAR_NATIVE) \
      $HERE
    chmod +x $TXTAR_NATIVE
  fi
}

txtar() {
  ensure_txtar
  $TXTAR_NATIVE "$@"
}

ensure_buildx() {
  # lazily unpack and download a native version of buildx
  if [ ! -f $BUILDX_NATIVE ]; then
    mkdir -p $(dirname $BUILDX_NATIVE)
    curl -L https://github.com/docker/buildx/releases/download/v$BUILDX_VERSION/$(basename $BUILDX_NATIVE) > $BUILDX_NATIVE
    chmod +x $BUILDX_NATIVE
  fi
}

buildx() {
  ensure_buildx
  $BUILDX_NATIVE "$@"
}

sudo_buildx() {
  ensure_buildx
  sudo env DOCKER_HOST=unix:///run/podman/podman.sock $BUILDX_NATIVE "$@"
}

. $HERE/tools/functions/cue.sh

docker_compose() {
  docker_compose_yml=$1
  shift
  $DOCKER compose \
    -p $(basename $docker_compose_yml .yml) \
    --project-directory $HERE \
    -f $docker_compose_yml "$@"
}

pick_docker_compose_yml() {
  suffix=$1
  echo $HERE/.gen/docker/$NAMESPACE-$suffix.yml
}

build_images_while_blocking() {
  docker_compose_file="$1"
  shift

  buildx_bake_output_arg=$1
  shift

  blocking=$1
  shift

  images="$@"

  # regenerate the docker_compose file without these "blocked" tags
  write_rendered_cue_dev_expr_as yaml $docker_compose_file \
    -t "buildx_bake_docker_compose_block_tags=$blocking" \
    -t "buildx_bake_docker_compose_focus=$images" \
    -e 'overlay.buildx_bake_docker_compose'

  sudo_buildx bake \
    --progress=tty \
    -f $docker_compose_file \
    --metadata-file=${docker_compose_file}.metadata.json \
    "$buildx_bake_output_arg" \
    >&2
}

build_imagespecs() {
  docker_compose_file="$1"
  shift

  buildx_bake_output_arg=$1
  shift
  
  images="$@"

  # `buildx bake`` is a very fast tool for building images, but it needlessly sends the tarball to the docker socket no matter what, even if already present.
  # We should be using a more intelligent incremental loading approach, but we don't have that right now.

  # In the meantime, we avoid loading resourcedir images whose tags are already present in our image store. This can result in unexpected behavior if
  # the contents of a resourcedir image tag change at all from build to build. Ideally the tag name captures all information used to construct the
  # resourcedir so this should happen rarely if at all. This edge case will be avoided completely once we use a proper incremental loading
  # strategy.

  resourcedir_image_tags=$(print_cue_dev_expr_as_text_lines " " 'overlay.resourcedir_image_tags' \
    -t "buildx_bake_docker_compose_focus=$images")

  # accumulate ones that are present as "blocked"
  for image_tag in $resourcedir_image_tags; do
    if ! sudo $PODMAN image exists $image_tag 1>&2; then
      # build needed resourcedirs one by one directly via podman
      # this avoids starving resourcedir fetches of bandwidth and avoids the wasted copies in the buildx bake approach
      podman build $(print_cue_dev_expr_as text \
        -e "overlay.imagespec_by_image_tag[\"$image_tag\"].#podman_build_options" )
    fi
  done

  # build everything else in parallel without resourcedirs
  build_images_while_blocking $docker_compose_file $buildx_bake_output_arg "$resourcedir_image_tags" "$images"
}

set_os_vars() {
  CUE_DEV_DEFS="defs"
  USE_VARSET="substrateos"
  BUILD_SOURCE_DIRECTORY="$HERE"
  SUBSTRATE_USER=$(id -un)
  SUBSTRATE_GROUP=$(id -gn)
  SUBSTRATE_HOME="$HOME"
  SUBSTRATE_SOURCE="$HERE"
  SUBSTRATE_LIVE_EDIT=false
}

set_live_edit_vars() {
  SUBSTRATE_LIVE_EDIT=true
}

set_docker_vars() {
  CUE_DEV_DEFS="defs"
  USE_VARSET="docker_compose"
  BUILD_SOURCE_DIRECTORY="$HERE"
  SUBSTRATE_LIVE_EDIT=false
}

systemd_logs() {
  journalctl -xfeu substrate.service
}

write_image_id_files() {
  dst=$1
  buildx_bake_metadata_file="$2"
  set +x
  print_cue_dev_expr_as text -t "buildx_bake_metadata=$(cat $buildx_bake_metadata_file)" -e 'overlay.buildx_bake_image_ids_txtar.#out' | tee /dev/stderr | (cd $dst; txtar -x)
  set -x
}

write_ready_file() {
  echo 1>&2 "write_ready_file()"
  touch $CUE_DEV_DIR/ready
}

build_images() {
  docker_compose_file=$1
  shift

  images=$@

  # This is less efficient than we'd like, but it works. We don't want to reload all tarballs on every build.
  build_imagespecs $docker_compose_file '--set=*.output=type=docker,oci-mediatypes=true' $images
}

systemd_reload() {
  # always include substrateos-overlay, since that's how we (re)generate systemd units
  images="$@"
  if [ -n "$images" ]; then
    images="substrateos-overlay $images"
  fi

  check_cue_dev_expr_as_cue

  docker_compose_file=$(pick_docker_compose_yml substrate)
  build_images $docker_compose_file $images
  write_image_id_files $PWD "$docker_compose_file.metadata.json"

  # show overrides before we replace anything (as a sort of poor man's backup)
  systemd-delta --no-pager

  # reconstruct the parts of the overlay we can safely reload.
  RELOAD_OVERLAY_BASEDIR=images/substrateos/gen/reload
  rm -rf $RELOAD_OVERLAY_BASEDIR
  mkdir -p $RELOAD_OVERLAY_BASEDIR
  
  # Export just the files we can load into an existing system
  # NOTE in the future we might want to use the tmp mount /usr override that bootc can provide.
  SUBSTRATEOS_OVERLAY_IMAGE_DIR=$(sudo $PODMAN image mount $SUBSTRATEOS_OVERLAY_IMAGE)

  stage_dir() {
    src=$1
    dst=$2

    mkdir -p ${RELOAD_OVERLAY_BASEDIR}${dst}
    cp -r ${SUBSTRATEOS_OVERLAY_IMAGE_DIR}$src ${RELOAD_OVERLAY_BASEDIR}${dst}
  }

  # /etc is writable so this is fine
  stage_dir /etc/. /etc/

  # systemd overrides go in /etc
  stage_dir /usr/share/containers/systemd/. /etc/containers/systemd/

  stage_dir '/usr/lib/systemd/*' /etc/systemd/

  sudo $PODMAN image unmount $SUBSTRATEOS_OVERLAY_IMAGE

  # use rsync to avoid writing files that don't change.
  sudo rsync -i -a --no-times --checksum $RELOAD_OVERLAY_BASEDIR/* /

  sudo systemctl daemon-reload

  # show overrides
  systemd-delta --no-pager

  # HB it would be better to run this on the overlay dir *before* we copy it. how do we do that?
  /usr/libexec/podman/quadlet --dryrun

  # after writing our presets, ask systemd to respect them!
  sudo systemctl preset-all

  systemctl_start_units="$(print_cue_dev_expr_as text \
      -t "buildx_bake_docker_compose_focus=$images" \
      -e "overlay.systemd_units_to_start_text")"
  if [ -n "$systemctl_start_units" ]; then
    sudo systemctl start $systemctl_start_units
  fi

  set +x
  write_ready_file

  echo "Visit: https://$(hostname -f)"
}

os_installer() {
  OS_BUNDLED_IMAGES="events tool-call nvml sigar new-space spaceview mdns template-treehouse"
  docker_compose_file=$(pick_docker_compose_yml substrate)
  build_images $docker_compose_file $OS_BUNDLED_IMAGES

  sudo podman build \
    --build-arg "NAMESPACE=$NAMESPACE" \
    --build-arg "SUBSTRATE_LIVE_EDIT=$SUBSTRATE_LIVE_EDIT" \
    --build-arg "CUE_DEV_DEFS=$CUE_DEV_DEFS" \
    --build-arg "SUBSTRATE_USER=$SUBSTRATE_USER" \
    --build-arg "SUBSTRATE_GROUP=$SUBSTRATE_GROUP" \
    --build-arg "SUBSTRATE_HOME=$SUBSTRATE_HOME" \
    --build-arg "SUBSTRATE_SOURCE=$SUBSTRATE_SOURCE" \
    --build-arg "SUBSTRATE_BUILD_FOCUS=$OS_BUNDLED_IMAGES" \
    --target dist \
    -t $SUBSTRATEOS_IMAGE \
    -f images/substrateos/Containerfile \
    .

  export OS_IMAGE_TAG=$SUBSTRATEOS_IMAGE
  exec sudo images/substrateos/overlay/usr/bin/substrateos-installer "$@"
}

set +x
case "$1" in
  buildx)
    shift
    buildx "$@"
    ;;
  cue)
    shift
    cue "$@"
    ;;
  txtar)
    shift
    txtar "$@"
    ;;
  expr-dump)
    shift
    set_os_vars
    set_live_edit_vars
    set +x
    print_cue_dev_expr_as cue -e "$@"
    ;;
  reload|systemd-reload)
    shift
    set_os_vars
    set_live_edit_vars
    systemd_reload "$@"
    ;;
  systemd-logs)
    shift
    set_os_vars
    set_live_edit_vars
    systemd_logs
    ;;
  systemd-reload-follow|srf)
    shift
    set_os_vars
    set_live_edit_vars
    systemd_reload "$@"
    systemd_logs
    ;;
  oob-make|os-oob-make)
    shift
    set_os_vars
    os_oob_make
    ;;
  os-shell)
    shift
    set_os_vars
    os_installer shell "$@"
    ;;
  os-install)
    shift
    set_os_vars

    os_installer install "$@"
    ;;
  buildx-bake)
    shift
    set_docker_vars
    check_cue_dev_expr_as_cue
 
    DOCKER_COMPOSE_FILE=$(pick_docker_compose_yml substrate)
    write_rendered_cue_dev_expr_as yaml $DOCKER_COMPOSE_FILE -e 'overlay.buildx_bake_docker_compose'
    sudo_buildx bake \
      --progress=tty \
      -f $DOCKER_COMPOSE_FILE "$@"
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
    DOCKER_COMPOSE_FILE=$(pick_docker_compose_yml substrate)
    write_rendered_cue_dev_expr_as yaml $DOCKER_COMPOSE_FILE -e 'overlay.docker_compose'
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
    DOCKER_COMPOSE_FILE=$(make_docker_compose_yml substrate 'overlay.docker_compose')
    export COMPOSE_PROFILES
    docker_compose $DOCKER_COMPOSE_FILE run \
      --remove-orphans \
      --build \
      --rm \
      -it \
      tests.$1
    ;;
esac

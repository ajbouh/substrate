#!/bin/bash

set -eo pipefail

HERE=$(cd $(dirname $0); pwd)

: ${NAMESPACE:=substrate-nobody}

# TODO Try EvalV3 again in the next cuelang release after v0.11.0-alpha.4
# export CUE_EXPERIMENT=evalv3
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

BUILDX_VERSION="0.16.2"
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

CUE_DEV_EXPR_PATH=.gen/cue/$NAMESPACE-dev.cue
CUE_DEV_PACKAGE=github.com/ajbouh/substrate/defs
CUE_DEV_DIR=./defs

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
      -f images/txtar/Dockerfile \
      --target=txtar \
      --build-arg=TXTAR_VERSION=$TXTAR_VERSION \
      --build-arg=TXTAR_BASENAME=$(basename $TXTAR_NATIVE) \
      --output type=local,dest=$(dirname $TXTAR_NATIVE) \
      .
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

  if [ -z "$SUBSTRATE_LIVE_EDIT" ]; then
    echo >&2 "SUBSTRATE_LIVE_EDIT not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t live_edit=$SUBSTRATE_LIVE_EDIT"

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
}

print_rendered_cue_dev_expr_as() {
  set +x
  format=$1
  shift

  detect_dev_cue_tag_args

  cue export \
    --out $format \
    $CUE_DEV_TAG_ARGS \
    $CUE_DEV_PACKAGE \
    "$@"
  status=$?
  if [ $status -ne 0 ]; then
    exit $status
  fi
  set -x
}

write_rendered_cue_dev_expr_as() {
  set +x
  format=$1
  dest=$2
  shift 2

  detect_dev_cue_tag_args

  mkdir -p $(dirname $dest)
  [ ! -e $dest ] || mv -f $dest $dest.old
  cue export --trace --all-errors --verbose \
    --out $format \
    --outfile $dest \
    $CUE_DEV_TAG_ARGS \
    $CUE_DEV_PACKAGE \
    "$@"
  set -x
}

check_cue_dev_expr_as_cue() {
  set +x
  detect_dev_cue_tag_args
  cue def --strict --trace --all-errors --verbose --inline-imports --simplify \
    $CUE_DEV_PACKAGE \
    $CUE_DEV_TAG_ARGS \
    "$@" > /dev/null
  set -x
}

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

write_directory_from_cue_txtar() {
  basedir=$1
  shift

  print_rendered_cue_dev_expr_as text "$@" | (cd $basedir; txtar -x)
}

built_image_refs_from_metadata() {
  set +x
  buildx_bake_metadata_file="$1"
  print_rendered_cue_dev_expr_as text -t "buildx_bake_metadata=$(cat $buildx_bake_metadata_file)" -e '#out.buildx_bake_image_refs'
  set -x
}

built_image_ids_from_metadata() {
  set +x
  buildx_bake_metadata_file="$1"
  print_rendered_cue_dev_expr_as text -t "buildx_bake_metadata=$(cat $buildx_bake_metadata_file)" -e '#out.buildx_bake_image_ids'
  set -x
}

built_imagespecs_from_metadata_and_image_ids() {
  # set +x
  buildx_bake_metadata_file="$1"
  shift
  print_rendered_cue_dev_expr_as text -t "buildx_bake_metadata=$(cat $buildx_bake_metadata_file)" -t "buildx_bake_needed_image_ids=$@" -e '#out.buildx_bake_imagespecs'
  # set -x
}

# write_os_resourcedirs_overlay() {
#   RESOURCEDIR_KEYS=$(print_rendered_cue_dev_expr_as text -e '#out.resourcedir_keys')
#   echo RESOURCEDIR_KEYS=$RESOURCEDIR_KEYS
#   for resourcedir_key in $RESOURCEDIR_KEYS; do
#     RESOURCEDIR_TARGET_DIR=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetches[\"$resourcedir_key\"].target")
#     if [ ! -e $RESOURCEDIR_TARGET_DIR ]; then
#       RESOURCEDIR_BUILD_DIR=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetch_dirs[\"$resourcedir_key\"]")
#       PODMAN_BUILD_OPTIONS=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetch_podman_build_options[\"$resourcedir_key\"]")
#       PODMAN_RUN_OPTIONS=$(print_rendered_cue_dev_expr_as text -e "#out.resourcedir_fetch_podman_run_options[\"$resourcedir_key\"]")
#       $PODMAN build $PODMAN_BUILD_OPTIONS

#       # podman won't automatically make these directories, so do it now.
#       mkdir -p $RESOURCEDIR_BUILD_DIR
#       $PODMAN run --rm $PODMAN_RUN_OPTIONS
#       mv $RESOURCEDIR_BUILD_DIR $RESOURCEDIR_TARGET_DIR
#     fi
#   done
# }

build_images() {
  docker_compose_file="$1"
  shift

  # `buildx bake`` is a very fast tool for building images, but it needlessly sends the tarball to the docker socket no matter what, even if already present.
  # We should be using a more intelligent incremental loading approach, but we don't have that right now.

  # In the meantime, we avoid loading resourcedir images whose tags are already present in our image store. This can result in unexpected behavior if
  # the contents of a resourcedir image tag change at all from build to build. Ideally the tag name captures all information used to construct the
  # resourcedir so this should happen rarely if at all. This edge case will be avoided completely once we use a proper incremental loading
  # strategy.

  # list resourcedir tags we might build
  RESOURCEDIR_IMAGE_TAGS=$(print_rendered_cue_dev_expr_as text -e '#out.resourcedir_image_tags_text')

  # accumulate ones that are present as "blocked"
  existing_image_tags=()
  for image_id in $RESOURCEDIR_IMAGE_TAGS; do
    if sudo $PODMAN image exists $image_id 1>&2; then
      existing_image_tags+=("$image_id")
    fi
  done

  # regenerate the docker_compose file without these "blocked" tags
  write_rendered_cue_dev_expr_as yaml $docker_compose_file -t "buildx_bake_docker_compose_block_tags=$(echo "${existing_image_tags[@]}")" -e '#out.buildx_bake_docker_compose'

  sudo_buildx bake \
    --progress=tty \
    -f $docker_compose_file \
    --metadata-file=${docker_compose_file}.metadata.json \
    "$@" >&2

  status=$?
  if [ $status -ne 0 ]; then
    exit $status
  fi
}

write_images_to_root_imagestore() {
  docker_compose_file="$1"
  buildx_bake_metadata_file="$2"
  shift 2

  needed_image_ids=()

  IMAGE_IDS=$@
  for image_id in $IMAGE_IDS; do
    if ! sudo $PODMAN image exists $image_id 1>&2; then
      needed_image_ids+=("$image_id")
    fi
  done

  if [ ${#needed_image_ids[@]} -gt 0 ]; then
    # figure out which images are missing
    needed_images=$(built_imagespecs_from_metadata_and_image_ids "$buildx_bake_metadata_file" "${needed_image_ids[@]}")

    # expect a noop to for the build, but now we need to load them into podman
    # try loading them in with the same type we had
    # use oci-mediatypes=true to get the same digest from build_images.
    sudo_buildx bake \
      --progress=tty \
      -f "$docker_compose_file" \
      '--set=*.output=type=docker,oci-mediatypes=true,compression=uncompressed' \
      $needed_images

    # and then print
    for needed_image in $needed_images; do
      echo $needed_image
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
  # NB(adamb) TEMPORARY, remove after 2024-10-20
  # we used to write all image_ids to a single file. we no longer do that, but we need to proactively remove that file now.
  # otherwise we will generate a conflict. writing individual files allows us to only rebuild specific
  rm -f defs/image_ids.cue
  buildx_bake_metadata_file="$1"
  set +x
  print_rendered_cue_dev_expr_as text -t "buildx_bake_metadata=$(cat $buildx_bake_metadata_file)" -e '#out.buildx_bake_image_ids_file' | tee /dev/stderr | txtar -x
  set -x
}

write_ready_file() {
  echo 1>&2 "write_ready_file()"
  touch $CUE_DEV_DIR/ready
}

systemd_reload() {
  containers=$@

  check_cue_dev_expr_as_cue

  docker_compose_file=$(pick_docker_compose_yml substrate)

  # This is less efficient than we'd like, but it works. We don't want to reload all tarballs on every build.
  build_images $docker_compose_file '--set=*.output=type=docker,oci-mediatypes=true' $containers

  write_image_id_files "$docker_compose_file.metadata.json"

  # show overrides before we replace anything (as a sort of poor man's backup)
  systemd-delta --no-pager

  # reconstruct the parts of the overlay we can safely reload.
  RELOAD_OVERLAY_BASEDIR=os/gen/overlay.d/reload
  rm -rf $RELOAD_OVERLAY_BASEDIR
  mkdir -p $RELOAD_OVERLAY_BASEDIR
  
  write_directory_from_cue_txtar \
    $RELOAD_OVERLAY_BASEDIR \
    -t "systemd_overlay_quadlets_dir=etc/containers/systemd" \
    -t "systemd_overlay_units_dir=etc/systemd/system" \
    -t "systemd_overlay_presets_dir=etc/systemd/system-preset" \
    -e '#out.systemd_overlay_txtar'

  # /etc is writable so this is fine
  cp -r os/src/config/overlay.d/50substrateos/etc/. $RELOAD_OVERLAY_BASEDIR/etc/
  # systemd overrides go in /etc
  cp -r os/src/config/overlay.d/50substrateos/usr/lib/systemd/* $RELOAD_OVERLAY_BASEDIR/etc/systemd/

  # use rsync to avoid writing files that don't change.
  sudo rsync -i -a --no-times --checksum $RELOAD_OVERLAY_BASEDIR/* /

  sudo systemctl daemon-reload

  # show overrides
  systemd-delta --no-pager

  # HB it would be better to run this on the overlay dir *before* we copy it. how do we do that?
  /usr/libexec/podman/quadlet --dryrun

  # after writing our presets, ask systemd to respect them!
  sudo systemctl preset-all

  sudo systemctl start $(print_rendered_cue_dev_expr_as text -e "#out.systemd_units_to_start_text")

  write_ready_file
}

os_oob_make() {
  check_cue_dev_expr_as_cue

  docker_compose_file=$(pick_docker_compose_yml substrate)
  write_rendered_cue_dev_expr_as yaml $docker_compose_file -e '#out.buildx_bake_docker_compose'
  build_images $docker_compose_file '--set=*.output=type=image,store=true,name-canonical=true'
  built_image_refs=$(built_image_refs_from_metadata "$docker_compose_file.metadata.json")

  sudo rm -rf os/gen/oob/imagestore
  mkdir -p os/gen/oob/imagestore
  write_images_to_imagestore os/gen/oob/imagestore $built_image_refs
  
  mkdir -p os/src/config/live/oob
  cosa shell sudo mksquashfs gen/oob src/config/live/oob/oob.squashfs -noappend -wildcards -no-recovery -comp zstd
}

os_fetch() {
  $PODMAN build images/nvidia-kmods/ --output type=local,dest=os/overrides/rpm

  OS_OVERLAY_BASEDIR=gen/overlay.d/substrateos
  OVERLAY_BASEDIR=os/$OS_OVERLAY_BASEDIR
  rm -rf $OVERLAY_BASEDIR
  mkdir -p $OVERLAY_BASEDIR

  write_directory_from_cue_txtar \
    $OVERLAY_BASEDIR \
    -t "systemd_overlay_quadlets_dir=usr/share/containers/systemd" \
    -t "systemd_overlay_units_dir=usr/lib/systemd/system" \
    -t "systemd_overlay_presets_dir=usr/lib/systemd/system-preset" \
    -e '#out.systemd_overlay_txtar'

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

set +x
case "$1" in
  cosa)
    shift
    cosa "$@"
    ;;
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
    print_rendered_cue_dev_expr_as cue -e "$@"
    ;;
  write-image-ids)
    shift
    set_os_vars
    set_live_edit_vars
    docker_compose_file=$(pick_docker_compose_yml substrate)
    write_image_id_files "$docker_compose_file.metadata.json"
    write_ready_file
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
  buildx-bake)
    shift
    set_docker_vars
    check_cue_dev_expr_as_cue
 
    DOCKER_COMPOSE_FILE=$(pick_docker_compose_yml substrate)
    write_rendered_cue_dev_expr_as yaml $DOCKER_COMPOSE_FILE -e '#out.buildx_bake_docker_compose'
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
    write_rendered_cue_dev_expr_as yaml $DOCKER_COMPOSE_FILE -e '#out.docker_compose'
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
esac

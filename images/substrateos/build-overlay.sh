#!/bin/bash

set -exo pipefail

cue() {
  cd >/dev/null $CUE_DEV_DIR
  $CUE_NATIVE "$@"
  cd >/dev/null -
}

txtar() {
  $TXTAR_NATIVE "$@"
}

. /tmp/tools/functions/cue.sh

mkdir -p /overlay

write_directory_from_cue_txtar \
    /overlay/ \
    -t "namespace=$NAMESPACE" \
    -t "live_edit=$SUBSTRATE_LIVE_EDIT" \
    -t "cue_defs=$CUE_DEV_DEFS" \
    -t "resolve_image_ids=false" \
    -t "host_user=$SUBSTRATE_USER" \
    -t "host_group=$SUBSTRATE_GROUP" \
    -t "host_home_directory=$SUBSTRATE_HOME" \
    -t "host_source_directory=$SUBSTRATE_SOURCE" \
    -t "buildx_bake_docker_compose_focus=$SUBSTRATE_BUILD_FOCUS" \
    -e 'overlay.overlay_txtar.#out'

# Include all the images we've built as logically bound images
cd  /overlay
mkdir -p usr/lib/bootc/bound-images.d/
for image in $(find usr/share/containers/systemd -iname '*.image'); do
  ln -s "/$image" usr/lib/bootc/bound-images.d/
done
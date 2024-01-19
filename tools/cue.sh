#!/bin/bash

set -eo pipefail
set +x

HERE=$(cd $(dirname $0)/..; pwd)

CUE_VERSION="0.7.0"
CUE_PREFIX=cue_v${CUE_VERSION}_
NATIVE_SUFFIX=$(uname -s | tr "[:upper:]" "[:lower:]")_$(uname -m)
# HACK use amd64
case "$NATIVE_SUFFIX" in
    linux_x86_64)
    NATIVE_SUFFIX=linux_amd64
    ;;
esac
NATIVE=$HERE/tools/cue/${CUE_PREFIX}${NATIVE_SUFFIX}
ARTIFACT=$HERE/tools/cue/${CUE_PREFIX}${NATIVE_SUFFIX}.tar.gz
if [ ! -f $NATIVE ]; then
    if [ ! -f $ARTIFACT ]; then
        mkdir -p $(dirname $ARTIFACT)
        curl -L https://github.com/cue-lang/cue/releases/download/v$CUE_VERSION/$(basename $ARTIFACT) > $ARTIFACT
    fi
    if [ -f $ARTIFACT ]; then
        tar -xv --to-stdout -f $ARTIFACT cue > $NATIVE
        chmod +x $NATIVE
    fi
fi

if [ -f $NATIVE ]; then
    exec $NATIVE "$@"
fi

exec podman run -i --rm \
    -v "$HERE:/cue" \
    -w /cue \
    docker.io/cuelang/cue:$CUE_VERSION \
    "$@"

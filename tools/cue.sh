#!/bin/bash

set -eo pipefail
set -x

HERE=$(cd $(dirname $0)/..; pwd)

CUE_PREFIX=cue_v0.6.0-
NATIVE_SUFFIX=$(uname -s | tr "[:upper:]" "[:lower:]")-$(uname -m)
NATIVE=$HERE/tools/cue/${CUE_PREFIX}${NATIVE_SUFFIX}
ARTIFACT=$HERE/tools/cue/${CUE_PREFIX}${NATIVE_SUFFIX}.tar.gz
if [ ! -f $NATIVE ]; then
    if [ -f $ARTIFACT ]; then
        tar -xv --to-stdout -f $ARTIFACT cue > $NATIVE
        chmod +x $NATIVE
    fi
fi

if [ -f $NATIVE ]; then
    exec $NATIVE "$@"
fi

exec docker run -i --rm \
    -v "$HERE:/cue" \
    -w /cue \
    cuelang/cue:0.6.0 \
    "$@"

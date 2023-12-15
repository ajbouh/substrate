#!/bin/bash

set -eo pipefail
# set -x

HERE=$(cd $(dirname $0)/..; pwd)

: ${NAMESPACE:=substrate-nobody}

format=$1
shift

case "$format" in
  # cue)
    # exec $HERE/tools/cue.sh def \
    #   -t "namespace=$NAMESPACE" \
    #   --simplify \
    #   --inline-imports \
    #   $entry \
    #   "$@"
    # ;;
  cue)
    exec $HERE/tools/cue.sh eval \
      -t "namespace=$NAMESPACE" \
      --simplify \
      "$@"
    ;;
  *)
    exec $HERE/tools/cue.sh export \
      --out $format \
      -t "namespace=$NAMESPACE" \
      "$@"
    ;;
esac

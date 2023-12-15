#!/bin/bash

set -eo pipefail
# set -x

HERE=$(cd $(dirname $0)/..; pwd)

: ${NAMESPACE:=substrate-nobody}

format=$1
entry=$2
expr=$3
shift 3

case "$format" in
  cue)
    exec $HERE/tools/cue.sh def \
      $entry \
      -t "namespace=$NAMESPACE" \
      --simplify \
      --inline-imports \
      "$@" \
      -e "$expr"
    ;;
  # cue)
  #   exec $HERE/tools/cue.sh eval \
  #     $entry \
  #     -t "namespace=$NAMESPACE" \
  #     --simplify \
  #     "$@" \
  #     -e "$expr"
  #   ;;
  *)
    exec $HERE/tools/cue.sh export \
      --out $format \
      $entry \
      -t "namespace=$NAMESPACE" \
      "$@" \
      -e "$expr"
    ;;
esac

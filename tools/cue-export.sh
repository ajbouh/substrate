#!/bin/bash

set -eo pipefail
# set -x

HERE=$(cd $(dirname $0)/..; pwd)

: ${NAMESPACE:=substrate-nobody}

format=$1
entry=$2
expr=$3
shift 3

if [ "$format" = "toml" ]; then
  $HERE/tools/cue export --out json $entry --inject=namespace=$NAMESPACE -e "$expr" "$@" | $HERE/tools/dasel -r json -w $format
else
  $HERE/tools/cue export --out $format $entry --inject=namespace=$NAMESPACE -e "$expr" "$@"
fi

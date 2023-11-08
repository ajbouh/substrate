#!/bin/bash

set -eo pipefail
# set -x

HERE=$(cd $(dirname $0)/..; pwd)

: ${NAMESPACE:=substrate-nobody}

format=$1
entry=$2
expr=$3
shift 3

$HERE/tools/cue.sh export --out $format $entry --inject=namespace=$NAMESPACE -e "$expr" "$@"

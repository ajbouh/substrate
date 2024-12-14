# TODO Try EvalV3 again in the next cuelang release after v0.11.0
# export CUE_EXPERIMENT=evalv3

CUE_DEV_PACKAGE=github.com/ajbouh/substrate/defs

detect_dev_cue_tag_args() {
  if [ -n "$CUE_DEV_TAG_ARGS" ]; then
    return
  fi

  CUE_DEV_TAG_ARGS=" -t overlay"

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

  if [ -z "$SUBSTRATE_USE_BOOTC_STORAGE" ]; then
    echo >&2 "SUBSTRATE_USE_BOOTC_STORAGE not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t use_bootc_storage=$SUBSTRATE_USE_BOOTC_STORAGE"

  if [ -z "$CUE_DEV_DEFS" ]; then
    echo >&2 "CUE_DEV_DEFS not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t cue_defs=$CUE_DEV_DEFS"

  if [ -z "$SUBSTRATE_USER" ]; then
    echo >&2 "SUBSTRATE_USER not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t host_user=$SUBSTRATE_USER"

  if [ -z "$SUBSTRATE_GROUP" ]; then
    echo >&2 "SUBSTRATE_GROUP not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t host_group=$SUBSTRATE_GROUP"

  if [ -z "$SUBSTRATE_HOME" ]; then
    echo >&2 "SUBSTRATE_HOME not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t host_home_directory=$SUBSTRATE_HOME"

  if [ -z "$SUBSTRATE_SOURCE" ]; then
    echo >&2 "SUBSTRATE_SOURCE not set"
    exit 2
  fi
  CUE_DEV_TAG_ARGS="$CUE_DEV_TAG_ARGS -t host_source_directory=$SUBSTRATE_SOURCE"
}

print_cue_dev_expr_as_text_lines() {
  set +x
  delim=$1
  expr=$2
  shift 2

  if ! print_cue_dev_expr_as text "$@" -e "strings.Join($expr, \"\\n\")"; then
    echo >&2 "error with strings.Join of $expr"
    print_cue_dev_expr_as >&2 cue "$@" -e "$expr"
    return 1
  fi
}

print_cue_dev_expr_as() {
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

write_directory_from_cue_txtar() {
  basedir=$1
  shift

  # print_cue_dev_expr_as cue "$@"
  print_cue_dev_expr_as text "$@" | (cd $basedir; tee >(cat >&2) | txtar -x)
}

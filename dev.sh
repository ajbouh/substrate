#!/bin/bash

set -e

HERE=$(cd $(dirname $0); pwd)

: ${NAMESPACE:=substrate-nobody}

cue_export() {
  NAMESPACE=$NAMESPACE $HERE/tools/cue-export.sh "$@"
}

CUE_MODULE=github.com/ajbouh/substrate

docker_compose() {
  docker_compose_yml=$1
  shift
  docker compose \
    -p $(basename $docker_compose_yml .yml) \
    --project-directory $HERE \
    -f $docker_compose_yml "$@"
}

make_docker_compose_yml() {
  suffix=$1
  expr=$2
  docker_compose_yml=$HERE/.gen/docker/docker-compose-$NAMESPACE-$suffix.yml
  mkdir -p $(dirname $docker_compose_yml)
  cue_export yaml $CUE_MODULE:dev $expr > $docker_compose_yml
  echo $docker_compose_yml
}

fcos_installer() {
  docker run \
    --security-opt label=disable \
    --pull=always \
    --rm \
    -v $HERE/os/fcos:/data \
    -w /data \
    quay.io/coreos/coreos-installer:release "$@"
}

butane() {
  docker run \
    --interactive \
    --rm \
    quay.io/coreos/butane:release "$@"
}

FCOS_VERSION=38.20230918.3.0

case "$1" in
  fcos-iso-install)
    shift
    butane --pretty --strict < $HERE/os/fcos/substrate.bu > $HERE/os/fcos/substrate.ign
    fcos_installer download -s stable -p metal -f iso
    fcos_installer \
      iso customize \
      '--dest-device=/dev/nvme0n1' \
      '--dest-ignition=./substrate.ign' \
      '--dest-console=tty0' \
      -o substrate-install-fcos-$FCOS_VERSION.x86_64.iso \
      fedora-coreos-$FCOS_VERSION-live.x86_64.iso
    ;;
  up)
    shift
    # docker_compose down || true
    docker_compose $(make_docker_compose_yml dev docker_compose) up \
        --always-recreate-deps \
        --remove-orphans \
        --force-recreate \
        --build "$@"
    ;;
  test-lens)
    cd $HERE/tests; go test -v ./...
    ;;
  run-lens)
    shift
    lens=$1
    shift
    if [ -z $lens ]; then
      echo >&2 "usage: $0 <lens> [<data-dir> ...]"
      exit 1
    fi

    set -x

    volume_args=()
    for viewspec in "$@"; do
      if [[ $viewspec != *=* ]]; then
        viewspec="data=$viewspec"
      fi

      viewname=${viewspec%=*}
      localdir_raw=${viewspec#*=}

      if [[ $localdir_raw != ','* ]]; then
        localdir=$localdir_raw

        if [[ $localdir != *:* ]]; then
          mode=ro
        else
          mode=${localdir#*:}
          localdir=${localdir%:*}
        fi
        # echo "localdir_raw=$localdir_raw mode=$mode localdir=$localdir"
        
        volume_args+=("-v" "$(cd $localdir; pwd):/spaces/$viewname/tree:$mode")
      else
        localdirs=(${localdir_raw//,/ })
        localdirid=0
        for localdir_elt in ${localdirs[@]}; do
          if [ -z "$localdir_elt" ]; then
            continue
          fi

          localdir=$localdir_elt

          if [[ $localdir != *:* ]]; then
            mode=ro
          else
            mode=${localdir#*:}
            localdir=${localdir%:*}
          fi

          # echo "localdir_raw=$localdir_raw localdir_elt=$localdir_elt mode=$mode localdir=$localdir"

          volume_args+=("-v" "$(cd $localdir; pwd):/spaces/$viewname/sp-$localdirid/tree:$mode")
          localdirid=$((localdirid+1))
        done
      fi
    done

    : ${PORT:=8080}
    internal_port=8080

    docker_compose_yml=$(make_docker_compose_yml dev-lenses docker_compose_lenses)
    docker_compose $docker_compose_yml build "lens-$lens"
    docker_compose $docker_compose_yml run \
        --rm \
        --interactive \
        --env PORT=$internal_port \
        -p $PORT:$internal_port \
        ${volume_args[@]} \
        "lens-$lens"
    ;;
  *) docker_compose $(make_docker_compose_yml dev docker_compose) "$@"
esac


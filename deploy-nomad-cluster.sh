#!/bin/bash

set -ex

HERE=$(cd $(dirname $0); pwd)

cue() {
  docker run -i --rm \
      -v "$HERE:/cue" \
      -w /cue \
      cuelang/cue -- \
      "$@"
}

: ${NAMESPACE:=substrate-nobody}

cue_export_text() {
  expr=$1
  shift
  cue export --out text services.cue --inject=namespace=$NAMESPACE -e "$expr" "$@"
}

# For now we install nomad onto the drone itself.
DRONE_IP=$(cue_export_text '#deployment.#external.tailscale.drone_ip')
NOMAD_SERVER_HOSTNAME=$DRONE_IP
NOMAD_SERVER_SSH_USER=ubuntu
NOMAD_SERVER_SSH_KEY=~/.ssh/id_lambdalabs_rsa

hashi-up nomad install \
  --ssh-target-addr $NOMAD_SERVER_HOSTNAME \
  --ssh-target-key $NOMAD_SERVER_SSH_KEY \
  --ssh-target-user $NOMAD_SERVER_SSH_USER \
  --config-file $HERE/services/nomad/server.hcl

package compose

import (
  "github.com/ajbouh/substrate/defs/docker/compose:config"
  "github.com/ajbouh/substrate/defs/docker/compose:network"
  "github.com/ajbouh/substrate/defs/docker/compose:secret"
  "github.com/ajbouh/substrate/defs/docker/compose:service"
  "github.com/ajbouh/substrate/defs/docker/compose:volume"
)

let #compose = {
  services !: [string]: service

  networks ?: [string]: network

  volumes ?: [string]: volume

  configs ?: [string]: config

  secrets ?: [string]: secret
}

#compose

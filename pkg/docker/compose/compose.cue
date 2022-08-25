package compose

import (
  "github.com/ajbouh/substrate/pkg/docker/compose:config"
  "github.com/ajbouh/substrate/pkg/docker/compose:network"
  "github.com/ajbouh/substrate/pkg/docker/compose:secret"
  "github.com/ajbouh/substrate/pkg/docker/compose:service"
  "github.com/ajbouh/substrate/pkg/docker/compose:volume"
)

let #compose = {
  version: string | *"3.8"

  services !: [string]: service

  networks ?: [string]: network

  volumes ?: [string]: volume

  configs ?: [string]: config

  secrets ?: [string]: secret
}

#compose

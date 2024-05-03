package defs

import (
    "list"
)

enable: "nvml": true

imagespecs: "nvml": {
  build: dockerfile: "images/nvml/Dockerfile"
}

services: "nvml": {
  instances: [string]: {
    ephemeral: true

    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX

  }
}

system: nvml: _

system: #cuda_memory_total_mb: int | *0

if system.nvml.devices != _|_ {
    system: #cuda_memory_total_mb: list.Sum([ for uuid, device in system.nvml.devices { device.memory.total_mb } ])
}

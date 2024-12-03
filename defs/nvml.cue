package defs

import (
    "list"
)

enable: "nvml": true

imagespecs: "nvml": {
  image: "\(#var.image_prefix)nvml"
  build: dockerfile: "images/nvml/Dockerfile"
}

services: "nvml": {
  instances: [string]: {
    ephemeral: true
    privileged: true

    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    exports: data: {
      devices: [string]: { memory: { total_mb: number, ... }, ... }
      ...
    }
  }
}

// A bit of an awkward pattern, but this ensures nvml exports are available for other defs.
services: "nvml": instances: "nvml": pinned: true
system: {
  nvml: services.nvml.instances["nvml"].exports.data

  #cuda_memory_total_mb: number | *0

  if nvml.devices != _|_ {
      #cuda_memory_total_mb: list.Sum([ for uuid, device in nvml.devices { device.memory.total_mb } ])
  }
}

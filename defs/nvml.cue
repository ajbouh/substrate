package defs

import (
    "list"
)

enable: "nvml": true

imagespecs: "nvml": {
    build: dockerfile: "images/nvml/Dockerfile"
}

services: "nvml": {
  spawn: {
    ephemeral: true
  }
}

system: nvml: _

system: #cuda_memory_total_mb: int | *0

if system.nvml.devices != _|_ {
    system: #cuda_memory_total_mb: list.Sum([ for uuid, device in system.nvml.devices { device.memory.total_mb } ])
}

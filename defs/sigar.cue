package defs

enable: "sigar": true

imagespecs: "sigar": {
    build: dockerfile: "images/sigar/Dockerfile"
}

services: "sigar": {
  spawn: {
    ephemeral: true
    mounts: [
      { source: "/proc", destination: "/hostproc", mode: "ro" },
    ]
  }
}

system: sigar: {memory: {total_mb: int, used_mb: int, free_mb: int, actual_free_mb: int, actual_used_mb: int}} | *{memory: {total_mb: 0, used_mb: 0, free_mb: 0, actual_free_mb: 0, actual_used_mb: 0}}

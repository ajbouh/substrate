package defs

enable: "sys": true

imagespecs: "sys": {
    build: dockerfile: "images/sys/Dockerfile"
}

services: "sys": {
  instances: [string]: {
    ephemeral: true
    mounts: [
      { source: "/sys", destination: "/hostsys", mode: "ro" },
    ]
  }
}

system: sys: _

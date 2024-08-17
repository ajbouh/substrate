package defs

enable: "sys": true

imagespecs: "sys": {
  image: "\(#var.image_prefix)sys"
  build: dockerfile: "images/sys/Dockerfile"
}

services: "sys": {
  instances: [string]: {
    ephemeral: true

    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    mounts: [
      { source: "/sys", destination: "/hostsys", mode: "ro" },
    ]
  }
}

system: sys: _

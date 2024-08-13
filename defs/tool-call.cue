package defs

enable: "tool-call": true

imagespecs: "tool-call": {}

services: "tool-call": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
}


live_edit: "tool-call": bool

if live_edit["tool-call"] {
  services: "tool-call": instances: [string]: {
    mounts: [
      { source: "\(#var.host_source_directory)/images/tool-call/prompts", destination: "/go/src/github.com/ajbouh/substrate/images/tool-call/prompts", mode: "ro" },
    ]
  }
}

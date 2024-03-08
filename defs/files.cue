package defs

enable: "files": true

imagespecs: "files": {}

services: "files": {
  spawn: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
    ephemeral: true
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
  spawn: parameters: data: type: "space"
}

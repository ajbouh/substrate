package defs

enable: "events": true

imagespecs: "events": {
  image: "\(#var.image_prefix)events"
  build: dockerfile: "images/events/Dockerfile"
}

services: "events": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
      // TODO should we put this file somewhere? should we parameterize it with an optional id?
      EVENTS_DATABASE_FILE: "/spaces/data/events/default.sqlite"
      EVENTS_DATA_BASE_DIR: "/spaces/data/events/data"
    }
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    parameters: data: type: "space"
  }
}

live_edit: "events": bool

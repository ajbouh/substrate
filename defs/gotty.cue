package defs

enable: "gotty": true

imagespecs: "gotty": {
  image: "\(#var.image_prefix)gotty"
  build: dockerfile: "images/gotty/Dockerfile"
  build: target: "dist-alpine"
}

services: "gotty": {
  instances: [string]: {
    url_prefix: "/gotty"
    environment: {
      PORT: string
      ORIGIN: string
      GOTTY_PATH: "/gotty"
      GOTTY_PORT: PORT
      GOTTY_WS_ORIGIN: ORIGIN
    }

    parameters: {
      data: {
        type: "space"
      }
    }
  }

  // TODO make it a command, parameterize on space and with image to run within gotty
  activities: {
    terminal: {
      activity: "user:open"
      label: "open terminal"
      request: interactive: true
    }
  }
}

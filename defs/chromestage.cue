package defs

enable: "chromestage": true

imagespecs: "chromestage": {
  image: "\(#var.image_prefix)chromestage"
  build: dockerfile: "images/chromestage/Dockerfile"
}

services: "chromestage": {
  instances: [string]: {
    parameters: {
      w: {
        type: "string"
        value: string | *"800"
      }
      h: {
        type: "string"
        value: string | *"600"
      }
      id: {
        type: "string"
      }
    }

    url_prefix: environment.SUBSTRATE_URL_PREFIX
    environment: {
      SUBSTRATE_URL_PREFIX: string
      XVNC_GEOMETRY: "\(parameters.w.value)x\(parameters.h.value)"
      CHROMIUM_WINDOW_SIZE: "\(parameters.w.value),\(parameters.h.value)"
      CHROMIUM_START_URL: "about:blank"
      DINIT_LOG_LEVEL: "debug"
    }
  }
}

package defs

enable: "chromestage": true

imagespecs: "chromestage": {}

services: "chromestage": {
  instances: [string]: {
    parameters: {
      w: {
        type: "string"
        value: string | *"1280"
      }
      h: {
        type: "string"
        value: string | *"720"
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
    }
  }
}

package defs

enable: "chromestage": true

imagespecs: "chromestage": {
  image: "\(#var.image_prefix)chromestage"
  build: dockerfile: "images/chromestage/Dockerfile"
}

services: "chromestage": {
  instances: [string]: {
    parameters: {
      id: {
        type: "string"
      }
    }

    url_prefix: environment.SUBSTRATE_URL_PREFIX
    environment: {
      let w = "640"
      let h = "480"
      SUBSTRATE_URL_PREFIX: string
      XVNC_GEOMETRY: "\(w)x\(h)"
      CHROMIUM_WINDOW_SIZE: "\(w),\(h)"
      CHROMIUM_START_URL: "about:blank"
      DINIT_LOG_LEVEL: "debug"
    }
  }
}

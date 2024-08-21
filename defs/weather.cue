package defs

enable: "weather": true

imagespecs: "weather": {
  image: "\(#var.image_prefix)weather"
  build: dockerfile: "images/weather/Dockerfile"
}

services: "weather": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
}

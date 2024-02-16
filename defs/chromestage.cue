package defs

enable: "chromestage": true

imagespecs: "chromestage": {}

// HACK force amd64 because we need to build on apple silicon but on arm we get: "E: Unable to locate package google-chrome-stable"
#out: "docker_compose": services: "chromestage": platform: "linux/amd64"

"lenses": "chromestage": {
  spawn: {
    url_prefix: environment.SUBSTRATE_URL_PREFIX
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
  }
}

package defs

enable: "datasette": true

imagespecs: "datasette": {
  image: "\(#var.image_prefix)datasette"
  build: dockerfile: "images/datasette/Dockerfile"
  build: args: VERSION: "1.0a16"
}

services: "datasette": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
      // TODO should we put this file somewhere? should we parameterize it with an optional id?
      DATASETTE_DB: "/spaces/space/\(parameters.file.value)"
      DATASETTE_BASE_URL: "\(SUBSTRATE_URL_PREFIX)/"
    }

    url_prefix: environment.SUBSTRATE_URL_PREFIX
    parameters: space: type: "space"
    parameters: file: type: "string"
  }
}

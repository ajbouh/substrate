package defs

enable: "v2": true
enable: "registry": true

imagespecs: "registry": {
  image: "\(#var.image_prefix)registry"
  build: dockerfile: "images/registry/Dockerfile"
}

services: "v2": {
  instances: [string]: {
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    image_tag: imagespecs["registry"].image

    environment: {
      PORT: string
      ORIGIN: string
      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: "/var/lib/registry"
      REGISTRY_HTTP_ADDR: "0.0.0.0:\(PORT)"

      REGISTRY_HTTP_HOST: "\(ORIGIN)"
      REGISTRY_HTTP_SECRET: "somesecret"
    }

    mounts: {
      "/var/lib/registry": { source: "/var/lib/registry", mode: "rw" }
    }
  }
}

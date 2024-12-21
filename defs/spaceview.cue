package defs

enable: "spaceview": true

imagespecs: "spaceview": {
  image: "\(#var.image_prefix)spaceview"
  build: dockerfile: "images/spaceview/Dockerfile"
}

#var: host_docker_socket: string

services: "spaceview": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
      SPACE_ID: parameters.space.value
    }
    ephemeral: true
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    parameters: space: type: "space"

    environment: {
      #docker_socket: "/var/run/docker.sock"
      "DOCKER_HOST": "unix://\(#docker_socket)"
    }

    mounts: {
      (environment.#docker_socket): {source: #var.host_docker_socket}
    }
  }
}

package daemon

import (
  "strings"

  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
  quadlet "github.com/ajbouh/substrate/pkg/podman:quadlet"
  systemd "github.com/ajbouh/substrate/pkg/systemd"
)

let #def = {
  #var: {
    namespace: string
    image: string
  }

  name: string

  command ?: [...string]

  build: {
    dockerfile !: string | *"services/\(name)/Dockerfile"
    image !: string
    args ?: [string]: string
    context ?: string
    target ?: string
  }

  environment: [string]: string

  secrets: [string]: string

  mounts: [
    ...{
      source: string
      destination: string
    }
  ] | *[]

  #host: string
  #internal_host: string

  #podman_quadlet_container ?: quadlet.#Container & {
    Container: Volume: [
      for mount in mounts {
        "\(mount.source):\(mount.destination):rw"
      }
    ]
  }
  
  // #podman_quadlet_image ?: quadlet.#Image

  // if #podman_quadlet_container != _|_ {
  //   #podman_quadlet_image: {
  //     Image: Image: #var.image
  //   }
  // }

  #systemd_units: {
    [string]: systemd.#Unit
    [=~"\\.image$"]: quadlet.#Image
    [=~"\\.container$"]: #podman_quadlet_container
  } & {
    // if #podman_quadlet_image != _|_ {
    //   "\(name).image": #podman_quadlet_image
    // }
    if #podman_quadlet_container != _|_ {
      "\(name).container": #podman_quadlet_container
    }
  }

  #docker_compose_service: docker_compose_service & {
    volumes: [
      for mount in mounts {
        "\(mount.source):\(mount.destination):rw"
      }
    ]

    if command != _|_ { "command": command }

    "build": build

    "environment": {
      environment
      secrets
    }
  }

  #docker_compose_volumes: {
    [string]: _

    for mount in mounts {
      if !strings.HasPrefix(mount.source, "/") && !strings.HasPrefix(mount.source, ".") {
        "\(mount.source)": {}
      }
    }
  }
}

#def

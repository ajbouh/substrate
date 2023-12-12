package daemon

import (
  "strings"

  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
  quadlet "github.com/ajbouh/substrate/pkg/podman:quadlet"
  systemd "github.com/ajbouh/substrate/pkg/systemd"
)

let #Daemon = {
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

  mounts: [
    ...{
      source: string
      destination: string
      mode: string | *"rw"
    }
  ] | *[]

  #host: string
  #internal_host: string

  #systemd_units: "\(name).container" ?: Container: {
    Pull: string | *"never"
    Image: build.image
    // HACK this might create a shell escaping issue...
    if command != _|_ {
      Exec: strings.Join(command, " ")
    }
    Volume: [
      for mount in mounts {
        "\(mount.source):\(mount.destination):\(mount.mode)",
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
    [=~"\\.network$"]: quadlet.#Network
    [=~"\\.image$"]: quadlet.#Image
    [=~"\\.container$"]: quadlet.#Container
  // } & {
    // if #podman_quadlet_image != _|_ {
    //   "\(name).image": #podman_quadlet_image
    // }
  }

  #docker_compose_service: docker_compose_service & {
    volumes: [
      for mount in mounts {
        "\(mount.source):\(mount.destination):\(mount.mode)",
      }
    ]

    if command != _|_ { "command": command }
    if build.image != _|_ { image: build.image }
    if build.args != _|_ { "build": args: build.args }
    if build.dockerfile != _|_ { "build": dockerfile: build.dockerfile }
    if build.target != _|_ { "build": target: build.target }
    if build.context != _|_ { "build": context: build.context }

    "environment": {
      environment
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

#Daemon

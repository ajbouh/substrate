package containerspec

import (
  "strings"

  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
  systemd "github.com/ajbouh/substrate/pkg/systemd"
  quadlet "github.com/ajbouh/substrate/pkg/podman:quadlet"
)

let #ContainerSpec = {
  name !: string
  disabled: bool | *false

  command ?: [...string]

  image: string
  build: {
    dockerfile !: string
    args: {[string]: string} | *{}
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

  if build != _|_ {
    #podman_build_options: strings.Join([
      "--file", build.dockerfile,
      if build.target != _|_ {
        "--target=\(build.target)",
      }
      for k, v in build.args {
        "--build-arg=\(k)=\(v)",
      }
      if build.context != _|_ {
        build.context,
      }
      if build.context == _|_ {
        ".",
      }
    ], " ")
  }

  #systemd_units: "\(name).container" ?: Container: {
    Pull: string | *"never"
    Image: image
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

  #systemd_units: {
    [string]: systemd.#Unit
    [=~"\\.network$"]: quadlet.#Network
    [=~"\\.image$"]: quadlet.#Image
    [=~"\\.container$"]: quadlet.#Container
  }

  #docker_compose_service: docker_compose_service & {
    volumes: [
      for mount in mounts {
        "\(mount.source):\(mount.destination):\(mount.mode)",
      }
    ]

    "image": image
    if command != _|_ { "command": command }
    if build != _|_ { "build": build }

    "environment": { environment }
  }

  #docker_compose_secrets: {
    [string]: _
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

#ContainerSpec
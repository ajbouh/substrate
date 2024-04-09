package containerspec

import (
  "strings"

  systemd "github.com/ajbouh/substrate/defs/systemd"
  quadlet "github.com/ajbouh/substrate/defs/podman:quadlet"
)

#Mount: {
  source: string
  destination: string
  mode: string | *"rw"
}

#ContainerSpec: {
  command ?: [...string]

  image: string

  environment: [string]: string

  mounts ?: [...#Mount]
}

#SystemdUnits: {
  #containerspec: #ContainerSpec
  #name: string

  #out: {
    if #containerspec.#systemd_units != _|_ {
      #containerspec.#systemd_units
    }

    [string]: systemd.#Unit
    [=~"\\.network$"]: quadlet.#Network
    [=~"\\.image$"]: quadlet.#Image
    [=~"\\.container$"]: quadlet.#Container

    "\(#name).container" ?: Container: {
      Pull: string | *"never"
      Image: #containerspec.image
      ContainerName: #name
      // HACK this might create a shell escaping issue...
      if #containerspec.command != _|_ {
        Exec: strings.Join(#containerspec.command, " ")
      }
      if #containerspec.mounts != _|_ {
        Volume: [
          for mount in #containerspec.mounts {
            "\(mount.source):\(mount.destination):\(mount.mode)",
          }
        ]
      }
    }
  }
}

#PodmanRunOptions: {
  #containerspec: #ContainerSpec

  #out: strings.Join([
    for k, v in #containerspec.environment {
      "--env=\(k)=\(v)",
    }
    if #containerspec.mounts != _|_ {
      for mount in #containerspec.mounts {
        "--volume=\(mount.source):\(mount.destination):\(mount.mode)",
      }
    }
    #containerspec.image,
    for e in #containerspec.command {
      e,
    }
  ], " ")
}

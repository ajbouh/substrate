package containerspec

import (
  "strings"

  systemd "github.com/ajbouh/substrate/defs/systemd"
  quadlet "github.com/ajbouh/substrate/defs/podman:quadlet"
)

#Mount: {
  type: string | *"bind"
  source ?: string
  destination: string
  mode: string | *"rw"
}

#ContainerSpec: {
  command ?: [...string]

  image: string

  environment: [string]: string

  mounts ?: [...#Mount]

  image_tag ?: string

  #systemd_units ?: [string]: systemd.#Unit
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

    "\(#name).container": Container: {
      Pull: string | *"never"
      Image: #containerspec.image
      ContainerName: #name
      // HACK this might create a shell escaping issue...
      if #containerspec.command != _|_ {
        Exec: strings.Join(#containerspec.command, " ")
      }
      if #containerspec.mounts != _|_ {
        Mount: [
          for mount in #containerspec.mounts {
            strings.Join([
              if mount.type != _|_ {
                "type=\(mount.type)",
              }
              if mount.source != _|_ {
                "source=\(mount.source)",
              }
              if mount.destination != _|_ {
                "destination=\(mount.destination)",
              }
              if mount.mode == "rw" {
                "rw=true",
              }
              if mount.mode == "ro" {
                "ro=true",
              }
            ], ",")
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
        strings.Join([
          if mount.type != _|_ {
            "type=\(mount.type)",
          }
          if mount.source != _|_ {
            "source=\(mount.source)",
          }
          if mount.destination != _|_ {
            "destination=\(mount.destination)",
          }
          if mount.mode == "rw" {
            "rw=true",
          }
          if mount.mode == "ro" {
            "ro=true",
          }
        ], ","),
      }
    }
    #containerspec.image,
    for e in #containerspec.command {
      e,
    }
  ], " ")
}

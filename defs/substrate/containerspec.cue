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
  mode: [...string] | *["rw"]
}

#ContainerSpec: {
  command ?: [...string]

  image: string

  environment: [string]: string

  mounts ?: [destination=string]: #Mount & {"destination": destination}

  image_tag ?: string

  #systemd_quadlet_units ?: [basename=string]: systemd.#Unit
}

#SystemdUnitWatcherUnits: {
  #name: string
  #target_unit: string
  #path_changed: [...string]
  #path_modified: [...string]

  #out: {
    [string]: systemd.#Unit

    "\(#name).service": {
      Unit: Description: "\(#target_unit) restarter"

      Service: {
        Type: "oneshot"
        ExecStart: "/usr/bin/systemctl restart \(#target_unit)"
      }

      Install: WantedBy: ["multi-user.target"]
    }

    "\(#name).path": {
      if #path_changed != _|_ {
        Path: PathChanged: #path_changed
      }
      if #path_modified != _|_ {
        Path: PathModified: #path_modified
      }
      Path: Unit: "\(#name).service"
      Install: WantedBy: ["multi-user.target"]
    }
  }
}

#SystemdQuadletUnits: {
  #containerspec: #ContainerSpec
  #name: string

  #out: {
    if #containerspec.#systemd_quadlet_units != _|_ {
      #containerspec.#systemd_quadlet_units
    }

    [string]: systemd.#Unit
    [=~"\\.network$"]: quadlet.#Network
    [=~"\\.image$"]: quadlet.#Image
    [=~"\\.container$"]: quadlet.#Container

    "\(#name).container": {
      #systemd_service_name: "\(#name).service"
      Container: {
        Pull: string | *"never"

        // So we can use bootc logically-bound images. See also: https://containers.github.io/bootc/logically-bound-images.html
        "PodmanArgs": ["--storage-opt=additionalimagestore=/usr/lib/bootc/storage"]

        // Image: "\(#name).image"
        Image: #containerspec.image
        ContainerName: #name
        // HACK this might create a shell escaping issue...
        if #containerspec.command != _|_ {
          Exec: strings.Join(#containerspec.command, " ")
        }
        if #containerspec.mounts != _|_ {
          Mount: [
            for _, mount in #containerspec.mounts {
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
                strings.Join([
                  for mode in mount.mode {
                    if mode == "rw" {
                      "rw=true",
                    }
                    if mode == "ro" {
                      "ro=true",
                    }
                  }
                ], ",")
              ], ",")
            }
          ]
        }
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
      for _, mount in #containerspec.mounts {
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
          strings.Join([
            for mode in mount.mode {
              if mode == "rw" {
                "rw=true",
              }
              if mode == "ro" {
                "ro=true",
              }
            }
          ], ",")
        ], ","),
      }
    }
    #containerspec.image,
    for e in #containerspec.command {
      e,
    }
  ], " ")
}

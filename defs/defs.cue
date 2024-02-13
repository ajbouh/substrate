package defs

import (
  "strings"
  "encoding/hex"
  cryptosha256 "crypto/sha256"

  systemd "github.com/ajbouh/substrate/defs/systemd"
  lens "github.com/ajbouh/substrate/defs/substrate:lens"
  imagespec "github.com/ajbouh/substrate/defs/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/defs/substrate:containerspec"
  docker_compose "github.com/ajbouh/substrate/defs/docker/compose:compose"
)

#Varset: {
  namespace: string @tag(namespace)
  cue_defs: string @tag(cue_defs)
  build_source_directory: string | *"" @tag(build_source_directory)
  use_varset: string @tag(use_varset)

  host_substratefs_root: string
  host_source_directory: string
  image_prefix: string | *"ghcr.io/ajbouh/substrate:substrate-"
  host_resourcedirs_root: string
  host_resourcedirs_path: string
  build_resourcedirs_root: string

  host_docker_socket: string | *"/var/run/docker.sock"
  // host_docker_socket: "/var/run/podman/podman.sock"
  // host_docker_socket: "/run/user/1001/podman/podman.sock"

  substrate: {
    internal_port: int | *8080

    network_name_prefix: string | *""
    internal_host: "substrate:\(internal_port)"
    internal_protocol: "http:"
    internal_network_name: "substrate-internal"
    external_network_name: "substrate-external"
    resourcedirs_root: "/var/lib/substrate/resourcedirs"
  }
}

#varsets: [string]: #Varset

#varsets: substrateos: {
  build_source_directory: string
  host_source_directory: "/var/home/core/source"
  host_substratefs_root: "/var/lib/substratefs"
  host_docker_socket: "/var/run/podman/podman.sock"
  host_resourcedirs_root: "/var/lib/resourcedirs"
  host_resourcedirs_path: "/run/media/oob/resourcedirs"
  build_resourcedirs_root: "\(build_source_directory)/os/gen/oob/resourcedirs"
}

#varsets: docker_compose: {
  namespace: string
  build_source_directory: string
  host_source_directory: build_source_directory

  host_substratefs_root: "\(build_source_directory)/substratefs"
  host_resourcedirs_path: ""
  host_resourcedirs_root: "\(build_source_directory)/os/gen/oob/resourcedirs"
  host_docker_socket: "/var/run/docker.sock"
  build_resourcedirs_root: host_resourcedirs_root

  substrate: {
    network_name_prefix ?: "\(namespace)-substrate_"
  }
}

#var: #Varset

#use_varset: "substrateos" | "docker_compose" @tag(use_varset)
#var: #varsets[#use_varset]

enable: [string]: bool

live_edit: [string]: bool | *false

#TestDef: {
  imagespec
  containerspec.#ContainerSpec

  depends_on: [string]: true
}

test_templates: [string]: #TestDef

tests: [key=string]: [suitealias=string]: #TestDef

imagespecs: [key=string]: imagespec & {
  image: "\(#var.image_prefix)\(key)"
  build: dockerfile: string | *"images/\(key)/Dockerfile"
}

resourcedirs: [id=string]: {
  #containerspec: containerspec.#ContainerSpec
  #imagespec: imagespec
}

lenses: [key=string]: lens & {"name": key}

daemons: [key=string]: containerspec.#ContainerSpec

#out: {
  // HACK so `cue def` works with less rewriting...
  #lenses: [string]: lens

  imagespecs: [string]: imagespec
  daemons: [string]: containerspec.#ContainerSpec
  systemd_containers: [string]: systemd.#Unit
  systemd_container_contents: [string]: string
  systemd_container_basenames: string
  image_references: string
  image_podman_build_options: [string]: string
  "docker_compose": docker_compose

  "resourcedir_fetches": [alias=string]: {
    sha256: string
    #containerspec: containerspec.#ContainerSpec
    #imagespec: imagespec
  }
  "resourcedir_keys": string
  resourcedir_fetch_podman_build_options: [string]: string
  resourcedir_fetch_podman_run_options: [string]: string
}

#out: "imagespecs": {
  for key, def in imagespecs {
    if (enable[key]) {
      (key): def
    }
  }
}

for key, def in #out.#lenses {
  if def.spawn != _|_ {
    for alias, rddef in def.spawn.resourcedirs {
      resourcedirs: (rddef.id): _
      #out: resourcedir_fetches: (rddef.id): {
        sha256: rddef.sha256
        #containerspec: (resourcedirs[rddef.id].#containerspec & {
          image: resourcedirs[rddef.id].#imagespec.image
          mounts: [{source: "\(#var.build_resourcedirs_root)/\(rddef.sha256)", "destination": "/res", "mode": "Z"}]
        })
        #imagespec: resourcedirs[rddef.id].#imagespec
      }
    }
  }
}

#out: "resourcedir_keys": strings.Join([
  for key, def in #out.resourcedir_fetches {
    key,
  }
], "\n")

#out: #lenses: {
  for key, def in lenses {
    if (enable[key]) {
      (key): def & {
        if def.spawn != _|_ {
          spawn: {
            "image": string | *#out.imagespecs[key].image
            "resourcedirs": [alias=string]: {
              id: string
              sha256: hex.Encode(cryptosha256.Sum256(id))
            }
          }
        }
      }
    }
  }
}

for key, def in daemons {
  if (enable[key]) {
    #out: "daemons": (key): def
    #out: "daemons": (key): image: #out.imagespecs[key].image
  }
}

for key, def in #out.daemons {
  #out: "systemd_containers": (containerspec.#SystemdUnits & {#name: key, #containerspec: def}).#out
}

for basename, unit in #out.systemd_containers {
  #out: "systemd_container_contents": (basename): (systemd.#render & {#unit: unit}).#out
}

#out: "systemd_container_basenames": strings.Join([
  for key, def in #out.systemd_containers { key }
], "\n")

#out: "image_references": strings.Join([
  for key, def in #out.imagespecs { def.image }
], "\n")

for key, def in #out.imagespecs {
  #out: "image_podman_build_options": (def.image): def.#podman_build_options
}

for key, def in #out.resourcedir_fetches {
  #out: "resourcedir_fetch_podman_build_options": (key): def.#imagespec.#podman_build_options
  #out: "resourcedir_fetch_dirs": (key): strings.Join([def.#containerspec.mounts[0].source], " ")
  #out: "resourcedir_fetch_podman_run_options": (key): (containerspec.#PodmanRunOptions & {
    #containerspec: def.#containerspec
  }).#out
}

#out: docker_compose_profiles: {
  // Everything is in default
  [string]: "default": true

  for key, def in #out.daemons {
    (key): "daemons": true
  }

  for key, def in #out.imagespecs {
    (key): {}
  }

  for key, def in #out.#lenses {
    (key): {}
  }

  for testkey, testsuites in tests {
    for suitealias, suitedef in testsuites {
      "tests.\(testkey).\(suitealias)": {
        "tests": true
        "tests.\(testkey)": true
        "tests.\(testkey).\(suitealias)": true
      }

      for depkey, b in suitedef.depends_on {
        (depkey): {
          "tests": true
          "tests.\(testkey)": true
          "tests.\(testkey).\(suitealias)": true
        }
      }
    }
  }

  for key, def in #out.resourcedir_fetches {
    "resourcedir-\(def.sha256)": "resourcedirs": true
  }
}

#out: "docker_compose": {
  // Remap
  services: [key=string]: profiles: [ for p, b in #out.docker_compose_profiles[key] { p } ]

  for key, def in #out.resourcedir_fetches {
    services: "resourcedir-\(def.sha256)": {
      (containerspec.#DockerComposeService & {
        #containerspec: def.#containerspec
        #imagespec: def.#imagespec
      }).#out
    }

    volumes: (containerspec.#DockerComposeVolumes & {
      #containerspec: def.#containerspec
    }).#out
  }

  for key, def in #out.imagespecs {
    services: (key): (containerspec.#DockerComposeService & {
      #imagespec: def
    }).#out
  }

  for testkey, testsuites in tests {
    for suitealias, suitedef in testsuites {
      let key = "tests.\(testkey).\(suitealias)"
      volumes: (containerspec.#DockerComposeVolumes & {#containerspec: suitedef}).#out
      services: (key): {
        // Use build platform instead of linux/amd64 default from elsewhere
        platform: ""
        (containerspec.#DockerComposeService & {#containerspec: suitedef, #imagespec: suitedef}).#out
        if suitedef.depends_on != _|_ {
          depends_on: [ for dep, b in suitedef.depends_on { dep } ]
        }
      }
    }
  }

  for key, def in #out.daemons {
    services: (key): (containerspec.#DockerComposeService & {#containerspec: def}).#out
    volumes: (containerspec.#DockerComposeVolumes & {#containerspec: def}).#out
    networks: (containerspec.#DockerComposeNetworks & {#containerspec: def}).#out
  }

  for key, def in #out.#lenses {
    if def.spawn != _|_ {
      services: (key): {
        environment: PORT: "8080"
        environment: ORIGIN: "localhost:8080"
        ports: [
          "127.0.0.1:8081:\(environment.PORT)",
        ]
        if def.spawn.#docker_compose_service != _|_ {
          def.spawn.#docker_compose_service
        }
        (containerspec.#DockerComposeService & {
          #containerspec: {
            "environment": def.spawn.environment
            "command": def.spawn.command
            "image": def.spawn.image
            mounts: [
              for alias, rddef in def.spawn.resourcedirs {
                {source: "\(#var.build_resourcedirs_root)/\(rddef.sha256)", "destination": "/res/\(alias)", "mode": "Z"}
              }
            ]
          }
        }).#out
      }
    }
  }

  services: {
    "substrate": {
      ports: [
        "127.0.0.1:\(environment.PORT):\(environment.PORT)",
      ]

      environment: {
        "PORT": "8080"
        ...
      }
    }
  }
}

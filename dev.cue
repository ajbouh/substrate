package dev

import (
  "strings"
  "encoding/hex"
  cryptosha256 "crypto/sha256"

  systemd "github.com/ajbouh/substrate/pkg/systemd"
  lens "github.com/ajbouh/substrate/pkg/substrate:lens"
  imagespec "github.com/ajbouh/substrate/pkg/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/pkg/substrate:containerspec"
  docker_compose "github.com/ajbouh/substrate/pkg/docker/compose:compose"
)

#no_cuda: string | *"" @tag(no_cuda)

#var: {
  "namespace": string @tag(namespace)
  "root_source_directory": string | *"" @tag(root_source_directory)
  "image_prefix": "ghcr.io/ajbouh/substrate:substrate-"
  "no_cuda": #no_cuda != ""
  "build_lenses_expr_path": string | *"" @tag(build_lenses_expr_path)
  "secrets": {
    "substrate": {
      "session_secret": "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
    }
  }
  "host_resourcedirs_root": string | *"" @tag(host_resourcedirs_root)
  "host_resourcedirs_path": string | *"" @tag(host_resourcedirs_path)
  "build_resourcedirs_root": string | *"" @tag(build_resourcedirs_root)
  "host_docker_socket": string | *"/var/run/docker.sock" @tag(host_docker_socket)
  // host_docker_socket: "/var/run/podman/podman.sock"
  // host_docker_socket: "/run/user/1001/podman/podman.sock"
  "substrate": {
    internal_port: 8080
    "docker_compose_prefix": "\(#var.namespace)-substrate_"
    "external_origin": "https://substrate.home.arpa"
    "internal_host": "substrate:\(internal_port)"
    "internal_protocol": "http:"
    "internal_network_name": "substrate-internal"
    "external_network_name": "substrate-external"
    "resourcedirs_root": "/var/lib/substrate/resourcedirs"
  }
}

enable: [string]: bool

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
  if def.spawn != null {
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
        if def.spawn != null {
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

#out: "docker_compose": {
  for key, def in #out.imagespecs {
    services: (key): profiles: [
      if #out.daemons[key] != _|_ {
        "daemons",
      }
      "default",
    ]
  }

  // need to profiles for lenses too, as not all lenses have their own imagespec.
  for key, def in #out.#lenses {
    services: (key): profiles: [
      if #out.daemons[key] != _|_ {
        "daemons",
      }
      "default",
    ]
  }

  for key, def in #out.resourcedir_fetches {
    services: "resourcedir-\(def.sha256)": {
      profiles: [
        "resourcedirs",
        "default",
      ]

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

  for key, def in #out.daemons {
    services: (key): (containerspec.#DockerComposeService & {#containerspec: def}).#out
    volumes: (containerspec.#DockerComposeVolumes & {#containerspec: def}).#out
    networks: (containerspec.#DockerComposeNetworks & {#containerspec: def}).#out
  }

  for key, def in #out.#lenses {
    if def.spawn != null {
      services: (key): {
        (containerspec.#DockerComposeService & {
          #containerspec: {
            "environment": def.spawn.environment
            "command": def.spawn.command
          }
        }).#out
        if def.spawn.image != _|_  {
          image: def.spawn.image
          command: def.spawn.command
        }
      }
    }
  }

  services: {
    "substrate": {
      ports: [
        "127.0.0.1:\(environment.PORT):\(environment.PORT)",
      ]

      environment: {
        // PORT: "\(#namespace_host_port_offset + #service_host_port_offset["substrate"] + 1)"
        "PORT": "8080"
        // "ORIGIN": "http://localhost:\(environment.PORT)"
        // if #lenses["ui"] != _|_ {
        //   EXTERNAL_UI_HANDLER: "http://ui:\(services.ui.environment.PORT)"
        // }
        ...
      }
    }
  }
}

package services

import (
  "strings"
  "github.com/ajbouh/substrate/pkg/systemd"

  lens "github.com/ajbouh/substrate/pkg/substrate:lens"
  containerspec "github.com/ajbouh/substrate/pkg/substrate:containerspec"
  daemon "github.com/ajbouh/substrate/pkg/substrate:daemon"
  docker_compose "github.com/ajbouh/substrate/pkg/docker/compose:compose"
  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
)

#var: {
  namespace: string
  image_prefix: string
  substrate: internal_network_name: string
}

containerspecs: [key=string]: containerspec & {
  "name": key
  image: "\(#var.image_prefix)\(key)"
  build: dockerfile: "services/\(key)/Dockerfile"
}

lenses: [key=string]: lens & {
  // no mounts allowed for lenses
  // containerspec: mounts: []

  "name": key

  spawn ?: "image": containerspecs[key].image
  spawn ?: "environment": containerspecs[key].environment
}

daemons: [key=string]: daemon & {
  "name": key
  "containerspec": containerspecs[key]
}

#enabled_lenses: [string]: lens
for name, def in lenses {
  if (!def.disabled) {
    #enabled_lenses: "\(name)": def
  }
}

#enabled_daemons: [string]: daemon
for name, def in daemons {
  if (!def.containerspec.disabled) {
    #enabled_daemons: "\(name)": def
  }
}

#enabled_containerspecs: [string]: containerspec
for name, def in containerspecs {
  if (!def.disabled) {
    #enabled_containerspecs: "\(name)": def
  }
}

#systemd_containers: [string]: systemd.#Unit
for name, def in #enabled_daemons {
  if def.containerspec.#systemd_units != _|_ {
    for unit_name, unit in def.containerspec.#systemd_units {
      if unit_name =~ "\\.(image|container|volume|network)$" {
        #systemd_containers: "\(unit_name)": unit & {
          #text: (systemd.#render & {#unit: unit}).#out
        }
      }
    }
  }
}

#systemd_container_units: strings.Join([
  for name, def in #systemd_containers {
    name,
  }
], "\n")

#images: strings.Join([
  for name, def in #enabled_containerspecs {
    def.image
  }
], "\n")

#image_podman_build_options: {
  for name, def in #enabled_containerspecs {
    "\(def.image)": def.#podman_build_options
  }
}

#docker_compose: docker_compose & {
  #docker_compose_prefix: "\(#var.namespace)-substrate_"

  services: [string]: docker_compose_service

  for name, def in #enabled_containerspecs {
    services: "\(name)": {
      profiles: [
        if daemons[name] != _|_ {
          "daemons",
        }
        if lenses[name] != _|_ {
          "lenses",
        }
      ]

      def.#docker_compose_service
    }

    if def.#docker_compose_volumes != _|_ {
      volumes: def.#docker_compose_volumes
    }
  }

  // HACK disaable until we can figure out what this strange character device in the base image is
  // services: "tool-cosa": {
  //   profiles: ["tools"]
  //   image: "\(#var.image_prefix)tool-cosa"
  //   build: {
  //     dockerfile: "Dockerfile.cosa" 
  //     context: "tools"
  //   }
  // }

  services: "substrate": {
    environment: {
      SUBSTRATE_DOCKER_NETWORK: "\(#docker_compose_prefix)\(#var.substrate.internal_network_name)"
    }
  }

  networks: "\(#var.substrate.internal_network_name)": {
    // internal: true
    attachable: true
    driver: "bridge"
    driver_opts: {
      "com.docker.network.bridge.enable_icc": "true"
      "com.docker.network.bridge.enable_ip_masquerade": "true"
      "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0"
    }
    ipam: {
      driver: "default"
      config: [
        {
          subnet: "192.168.2.0/24"
        },
      ]
    }
  }
}

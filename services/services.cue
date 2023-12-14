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

lenses: {
  [key=string]: lens & {
    // no mounts allowed for lenses
    // containerspec: mounts: []

    "name": key

    spawn ?: "image": containerspecs[key].image
    spawn ?: "environment": containerspecs[key].environment
  }
}

daemons: {
  [key=string]: daemon & {
    "name": key
    "containerspec": containerspecs[key]
  }
}

#systemd_containers: {
  for name, def in daemons {
    if def.#systemd_units != _|_ {
      for unit_name, unit in def.#systemd_units {
        if unit_name =~ "\\.(image|container|volume|network)$" {
          "\(unit_name)": unit & {
            #text: (systemd.#render & {#unit: unit}).#out
          }
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

#enabled_containerspecs: {
  for name, def in containerspecs {
    if (!def.disabled) {
      "\(def.image)": def
    }
  }
}

#images: strings.Join([
  for image, def in #enabled_containerspecs {
    image
  }
], "\n")

#image_podman_build_options: {
  for image, def in #enabled_containerspecs {
    "\(image)": def.#podman_build_options
  }
}

#docker_compose: docker_compose & {
  #docker_compose_prefix: "\(#var.namespace)-substrate_"

  services: [string]: docker_compose_service

  for name, def in containerspecs {
    if (!def.disabled) {
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

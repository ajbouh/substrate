package services

import (
  "strings"
  "github.com/ajbouh/substrate/pkg/systemd"

  lens "github.com/ajbouh/substrate/pkg/substrate:lens"
  daemon "github.com/ajbouh/substrate/pkg/substrate:daemon"
  docker_compose "github.com/ajbouh/substrate/pkg/docker/compose:compose"
  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
)

#var: {
  namespace: string
  image_prefix: string
  substrate: internal_network_name: string
}

lenses: {
  [name=string]: lens & {
    if name != "substrate" {
      build: dockerfile: "services/\(name)/Dockerfile"
      spawn: image: "\(#var.image_prefix)lens-\(name)"
    }
  }
}

daemons: {
  [name=string]: daemon & {
    build: {
      dockerfile: "services/\(name)/Dockerfile"
      image: "\(#var.image_prefix)daemon-\(name)"
    }
  }
}

#systemd_containers: {
  for name, def in daemons {
    if def.#systemd_units != _|_ {
      for unit_name, unit in def.#systemd_units {
        if unit_name =~ "\\.(image|container|volume|network)$" {
          "\(unit_name)": unit & {
            #text: (systemd.#render & {#unit: unit}).#out
            #environment_file_text ?: string
          }
        }

        // A hack to allow large environment variables that are improperly escaped by quadlet
        if unit_name =~ "\\.container$" && (unit.Container.#Environment != _|_) {
          "\(unit_name)": #environment_file_text: strings.Join([
            // Use json.Marshal to properly encode newlines
            for k, v in unit.Container.#Environment { "\(k)=\(json.Marshal(v))" }
          ], "\n")
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

#docker_compose: docker_compose & {
  #docker_compose_prefix: "\(#var.namespace)-substrate_"

  for name, def in daemons {
    services: "daemon-\(name)": {
      profiles: ["daemons"]
      def.#docker_compose_service
    }
    volumes: {
      if def.#docker_compose_volumes != _|_ {
        def.#docker_compose_volumes
      }
    }
  }

  for name, def in lenses {
    if (name != "substrate") && (!def.disabled) {
      services: "lens-\(name)": {
        profiles: ["lenses"]
        build: dockerfile: def.build.dockerfile
        if def.spawn != _|_ { image: def.spawn.image }
        if def.build.context != _|_ { "build": context: def.build.context }
        if def.build.args != _|_ { "build": args: def.build.args }
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

  services: "daemon-substrate": {
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

  services: [string]: docker_compose_service

  #images: strings.Join([
    for name, def in services {
      def.image
    }
  ], "\n")

  #service_podman_build_options: {
    for name, def in services {
      "\(def.image)": strings.Join([
        "--file", def.build.dockerfile,
        if def.build.target != _|_ {
          "--target=\(def.build.target)",
        }
        if def.build.args != _|_ {
          for k, v in def.build.args {
            "--build-arg=\(k)=\(v)",
          }
        }
        if def.build.context != _|_ {
          def.build.context,
        }
        if def.build.context == _|_ {
          ".",
        }
      ], " ")
    }
  }
}

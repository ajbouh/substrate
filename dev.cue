package dev

import (
  "encoding/json"
  "strings"

  "github.com/ajbouh/substrate:external"

  "github.com/ajbouh/substrate/pkg/podman:quadlet"

  build_services "github.com/ajbouh/substrate/services"

  build_lenses "github.com/ajbouh/substrate/lenses"
)

#namespace: string @tag(namespace)

#services: (build_services & {
  #var: {
    "namespace": "\(#namespace)-dev"
    "hostprefix": "\(#namespace)-dev-"
    "lenses": (build_lenses & {
      #var: {
        "namespace": #namespace
        "image_prefix": "\(external.jamsocket.registry)/\(external.jamsocket.account)-lens-"
      }
    })
    "secrets": {
      "substrate": {
        "session_secret": "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      }
    }
    "substrate": {
      // internal_port: 443
      // origin: "https://\(#namespace)-substrate.tail87070.ts.net"
      internal_port: 8080
      // origin: "http://127.0.0.1:18080"
    }
    "plane_drone_substratefs_mountpoint": "/mnt/substrate"
  }
})

lens_images: {
  #lens_images: [
    for service, def in #services.#var.lenses if def.spawn != _|_ {
      def.spawn.jamsocket.image
    }
  ]

  #out: strings.Join(#lens_images, "\n")
}

systemd: {
  containers: {
    [=~".*\\.container$"]: quadlet.#Quadlet
  }
}

systemd: {
  containers: {
    "substrate.container": {
      Unit: {
        Requires: ["network-online.target", "substrate-pull.service", "podman.socket"]
        After: ["network-online.target", "substrate-pull.service", "podman.socket"]
      }
      Install: {
        WantedBy: ["multi-user.target"]
      }
      Container: {
        ContainerName: "substrate"
        Image: "ghcr.io/ajbouh/substrate:substrate"
        SecurityLabelDisable: true
        PublishPort: [
          "8081:\(#Environment.PLANE_PROXY__HTTP_PORT)",
          "2280:\(#Environment.PORT)",
          "4222:\(#Environment.NATS_PORT)"
        ]
        Volume: [
          "substrate_data:/var/lib/substrate:rw",
          "/var/run/podman/podman.sock:/var/run/docker.sock:rw",
          "plane:/system/shared:rw",
        ]
        Pull: "never"
        EnvironmentFile: "substrate.env"
        #Environment: {
          DEBUG: "1"
          PORT: "2280"
          SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
          PLANE_DRONE_SUBSTRATEFS_MOUNTPOINT: "/mnt/substrate"
          ORIGIN: "http://127-0-0-1.my.local-ip.co:\(#Environment.PORT)"
          PLANE_CLUSTER_DOMAIN: "127-0-0-1.my.local-ip.co"
          PLANE_AGENT__IP: "127.0.0.1"
          // PLANE_DATA_DIR: "/system/shared"
          PLANE_DATA_DIR: "/tmp"
          // PLANE_ACME__ADMIN_EMAIL: "paul@driftingin.space"
          // PLANE_ACME__SERVER: "https://acme-v02.api.letsencrypt.org/directory"
          NATS_PORT: "4222"
          PLANE_AGENT__DOCKER__CONNECTION__SOCKET: "/var/run/docker.sock"
          PLANE_AGENT__DOCKER__EXTRA_HOSTS: "127-0-0-1.my.local-ip.co:10.0.2.15"
          PLANE_PROXY__BIND_IP: "0.0.0.0"
          PLANE_PROXY__HTTP_PORT: "8081"
          PLANE_PROXY__HTTPS_PORT: "4333"
          SESSION_SECRET: "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
          LENSES: json.Marshal(#services.#var.lenses)
        }
      }
    }
  }
}

docker_compose_lenses: {
  "services": {
    for name, lens in #services.#var.lenses {
      if lens.#build != null {
        "lens-\(name)": {
          image: lens.spawn.jamsocket.image
          build: dockerfile: lens.#build.dockerfile
          if lens.#build.args != _|_ {
            build: args: lens.#build.args
          }
        }
      }
    }
  }
}

docker_compose: {
  "volumes": {
    for name, def in docker_compose.services {
      if #services[name].#docker_compose_volumes != _|_ {
        #services[name].#docker_compose_volumes
      }
    }
  }

  "services": {
    // [name=string]: {
    //   if #services[name].#docker_compose_service != _|_ {
    //     #services[name].#docker_compose_service
    //   }
    // }

    datasette: {
      let lens = #services.#var.lenses["datasette"]
      build: dockerfile: "lenses/\(lens.name)/Dockerfile"
      build: args: lens.#build.args

      environment: {
        PORT: "8081"
      }

      ports: [
        "18083:\(environment.PORT)",
      ]

      // Mount the same volumes as substrate, so we can spy on the database
      environment: DATASETTE_DB: substrate.environment.SUBSTRATE_DB

      volumes: substrate.volumes
    }

    ui: {
      let lens = #services.#var.lenses["ui"]
      build: target: "dev"
      build: dockerfile: "lenses/\(lens.name)/Dockerfile"

      volumes: [
        "./lenses/\(lens.name)/static:/app/static:ro",
        "./lenses/\(lens.name)/src:/app/src:ro",
      ]

      environment: {
        if lens.env != _|_ {
          lens.env
        }

        PORT: "8080"
        // ORIGIN: substrate.environment.ORIGIN
        // ORIGIN: "https://\(#services.#var.namespace)-substrate.tail87070.ts.net"
        ORIGIN: "http://127-0-0-1.my.local-ip.co"
        PUBLIC_EXTERNAL_ORIGIN: ORIGIN
      }
    }
    substrate: {
      #services["substrate"].#docker_compose_service

      ports: [
        // "80:8080",
        "443:8443",
        "80:80",
        "14222:4222",
      ]

      environment: {
        ORIGIN: "http://127-0-0-1.my.local-ip.co"
        EXTERNAL_UI_HANDLER: "http://ui:\(ui.environment.PORT)"
        PLANE_AGENT__IP: "100.85.122.130"
      }
    }
  }
}

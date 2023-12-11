package services

import (
  "strings"

  "github.com/ajbouh/substrate/pkg:svg"
  quadlet "github.com/ajbouh/substrate/pkg/podman:quadlet"
)

#var: {
  namespace: string
  image_prefix: string
  lenses_expr: string
  
  host_docker_socket: string

  no_cuda: bool | *false

  substrate: internal_network_name: string
  substrate: internal_port: int
  substrate: origin: string
  substrate: bind_mounts: [...{
    source: string
    destination: string
  }]

  secrets: substrate: session_secret: string
}

"daemons": {
  "substrate": {
    name: "substrate"

    secrets: {
      SESSION_SECRET: #var.secrets.substrate.session_secret
    }

    environment: {
      DEBUG: "1"
      PORT: string | *"\(#var.substrate.internal_port)"
      SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
      ORIGIN: #var.substrate.origin
      SUBSTRATE_LENSES_EXPR: #var.lenses_expr
      SUBSTRATE_NAMESPACE: #var.namespace
      SUBSTRATE_DOCKER_NETWORK: string | *#var.substrate.internal_network_name

      EXTERNAL_UI_HANDLER ?: string

      #docker_socket: "/var/run/docker.sock"

      DOCKER_HOST: "unix://\(#docker_socket)"

      if len(#var.substrate.bind_mounts) > 0 {
        SUBSTRATE_SERVICE_DOCKER_MOUNTS: strings.Join([
          for bind in #var.substrate.bind_mounts {
            "\(bind.source):\(bind.destination)"
          }
        ], ",")
      }
    }

    #docker_compose_service: {
      if !#var.no_cuda {
        deploy: resources: reservations: devices: [{driver: "nvidia", count: "all", capabilities: ["gpu"]}]
      }
      networks: [#var.substrate.internal_network_name]
    }

    mounts: [
      {source: "\(#var.namespace)-substrate_data", destination: "/var/lib/substrate"},
      {source: #var.host_docker_socket, destination: environment.#docker_socket},
    ]

    #systemd_units: {
      "substrate.network": quadlet.#Network & {
        Network: {
          Driver: "bridge"
          NetworkName: #var.substrate.internal_network_name
          IPAMDriver: "host-local"
        }
      }

      "substrate.container": {
        Unit: {
          Requires: ["podman.socket"]
          After: ["podman.socket"]
        }
        Install: {
          WantedBy: ["multi-user.target", "default.target"]
        }
        Container: {
          ContainerName: "daemon-\(name)"
          SecurityLabelDisable: true
          PublishPort: [
            // To make localhost forwarding work (e.g. qemu, publish on the same port)
            "\(#Environment.PORT):\(#Environment.PORT)",
          ]
          AddDevice: ["nvidia.com/gpu=all"]
          Network: ["substrate.network"]
          EnvironmentFile: "substrate.env"
          #Environment: {
            SUBSTRATE_DB: "/var/lib/substrate/substrate.sqlite"
            SESSION_SECRET: "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"

            environment
          }
        }
      }
    }
  }
}

"lenses": "substrate": {
  name: "substrate"

  activities: {
    // attach: {
    //   request: {
    //     path: "/api/v1/collections/:owner/:name/lensspecs/:lensspec"
    //     method: "POST"
    //     schema: {
    //       owner: {
    //         type: "owner"
    //       }
    //       name: {
    //         type: "?"
    //       }
    //       lensspec: {
    //         type: "?"
    //       }
    //     }
    //   }
    // }
    new: {
      activity: "user:new-space"
      image: (svg.#SVGImageData & {
        #src: """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
        </svg>
        """
      }).#out

      label: "Create new space"
      request: {
        path: "/api/v1/spaces"
        method: "POST"
      }
      response: {
        schema: {
          space: type: "space"
        }
      }
    }
    fork: {
      activity: "user:new-space"
      image: (svg.#SVGImageData & {
        // Heroicon name: mini/document-duplicate
        #src: """
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
            <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
          </svg>
        """
      }).#out

      label: "fork space"
      request: {
        path: "/api/v1/spaces"
        method: "POST"
        schema: {
          space_base_ref: {
            type: "space"
            body: ["space_base_ref"]
          }
        }
      }
      response: {
        schema: {
          space: type: "space"
        }
      }
    }
  }
}
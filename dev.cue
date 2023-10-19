package dev

import (
  "strings"

  "github.com/ajbouh/substrate/pkg/systemd"

  fcos_ignition "github.com/ajbouh/substrate/os/fcos:ignition"
  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"

  build_daemons "github.com/ajbouh/substrate/services:daemons"

  build_lenses "github.com/ajbouh/substrate/services:lenses"
)

#namespace: string @tag(namespace)

#lenses: (build_lenses & {
  #var: {
    "namespace": #namespace
    "image_prefix": "ghcr.io/ajbouh/substrate:substrate-lens-"
  }
})

#daemons: (build_daemons & {
  #var: {
    "namespace": "\(#namespace)-dev"
    "hostprefix": "\(#namespace)-dev-"
    "image_prefix": "ghcr.io/ajbouh/substrate:substrate-daemon-"
    "lenses": #lenses
    "secrets": {
      "substrate": {
        "session_secret": "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      }
    }
    "substrate": {
      // internal_port: 443
      // origin: "https://\(#namespace)-substrate.tail87070.ts.net"
      internal_port: 2280
      // origin: "http://127.0.0.1:18080"
    }
  }
})

"substrateos": {
  #rebase_image: "ghcr.io/ajbouh/substrate:substrateos"

  "ignition": fcos_ignition & {#var: {
    rebase_image: #rebase_image
  }}

  "systemd": containers: {
    for name, def in #daemons {
      if def.#systemd_units != _|_ {
        for unit_name, unit in def.#systemd_units {
          if unit_name =~ "\\.(image|container|volume|network)$" {
            "\(unit_name)": unit & {
              #text: (systemd.#render & {#unit: unit}).#out

              if unit_name =~ "\\.container$" {
                if unit.Container.#Environment != _|_ {
                  #environment_file_text: strings.Join([
                    for k, v in unit.Container.#Environment {
                      "\(k)=\(v)",
                    }
                  ], "\n")
                }
              }
            }
          }
        }
      }
    }
  }

  docker_compose_build: {
    services: {
      "rebase": {
        build: {
          image: "ghcr.io/ajbouh/substrate:substrateos"
        }
      }
      for name, daemon in #daemons {
        if daemon.build != null {
          "daemon-\(name)": {
            if daemon.build.image != _|_ { image: daemon.build.image }
            if daemon.build.args != _|_ { build: args: daemon.build.args }
            if daemon.build.dockerfile != _|_ { build: dockerfile: daemon.build.dockerfile }
            if daemon.build.target != _|_ { build: target: daemon.build.target }
            if daemon.build.context != _|_ { build: context: daemon.build.context }
          }
        }
      }

      for name, lens in #daemons.#var.lenses {
        if lens.#build != null {
          "lens-\(name)": {
            if lens.spawn != _|_ {
              image: lens.spawn.jamsocket.image
            }
            build: dockerfile: lens.#build.dockerfile
            if lens.#build.args != _|_ {
              build: args: lens.#build.args
            }
          }
        }
      }
    }

    #images: strings.Join([
      for name, def in services if def.image != _|_ {
        def.image
      }
    ], "\n")
  }
}

"bridge": {
  docker_compose: {
    services: [string]: docker_compose_service

    services: {
      bridge: {
        #lenses["bridge"].#docker_compose_service
        environment: {
          BRIDGE_TRANSCRIPTION: "http://asr-faster-whisper:8000/v1/transcribe"
          BRIDGE_TRANSLATOR_text_eng_en: "http://asr-seamlessm4t:8000/v1/transcribe"
          BRIDGE_ASSISTANT_Bridge: "http://chat-llama-cpp-python:8000/v1"
          // BRIDGE_TRANSLATOR_audio_en: "http://asr-faster-whisper:8000/v1/transcribe"
          // TRANSCRIPTION_SERVICE: "http://asr-whisperx:8000/transcribe"
          // TRANSLATOR_SERVICE: "http://asr-seamlessm4t:8000/translate"
        }
        depends_on: [
          "chat-llama-cpp-python",
          "asr-faster-whisper",
          "asr-seamlessm4t",
        ]
      }
      
      "chat-llama-cpp-python": #lenses["chat-llama-cpp-python"].#docker_compose_service
      "asr-faster-whisper": #lenses["asr-faster-whisper"].#docker_compose_service
      "asr-seamlessm4t": #lenses["asr-seamlessm4t"].#docker_compose_service
    }
  }

  // HACK hardcode these for now.
  volumes: "torch-cache": {}
  volumes: "huggingface-cache": {}
  services: [string]: {
    volumes: [
      "torch-cache:/cache/torch",
      "huggingface-cache:/cache/huggingface",
    ]

    deploy: resources: reservations: devices: [{driver: "nvidia", count: "all", capabilities: ["gpu"]}]
  }
}

"substrate": {
  docker_compose: {
    "volumes": {
      for name, def in docker_compose.services {
        if #daemons[name].#docker_compose_volumes != _|_ {
          #daemons[name].#docker_compose_volumes
        }
      }
    }

    services: [string]: docker_compose_service

    services: {
      if #lenses["datasette"] != _|_ {
        datasette: {
          build: dockerfile: "services/\(#lenses["datasette"].name)/Dockerfile"
          build: args: #lenses["datasette"].#build.args

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
      }
      if #lenses["ui"] != _|_ {
        ui: {
          build: target: "dev"
          build: dockerfile: "services/\(#lenses["ui"].name)/Dockerfile"

          volumes: [
            "./services/\(#lenses["ui"].name)/static:/app/static:ro",
            "./services/\(#lenses["ui"].name)/src:/app/src:ro",
          ]

          environment: {
            if #lenses["ui"].env != _|_ {
              #lenses["ui"].env
            }

            PORT: "8080"
            // ORIGIN: substrate.environment.ORIGIN
            // ORIGIN: "https://\(#daemons.#var.namespace)-substrate.tail87070.ts.net"
            ORIGIN: "http://127-0-0-1.my.local-ip.co"
            PUBLIC_EXTERNAL_ORIGIN: ORIGIN
          }
        }
      }
      substrate: {
        #daemons["substrate"].#docker_compose_service

        ports: [
          // "80:8080",
          "443:8443",
          "80:80",
          "14222:4222",
        ]

        environment: {
          ORIGIN: "http://127-0-0-1.my.local-ip.co"
          if #lenses["ui"] != _|_ {
            EXTERNAL_UI_HANDLER: "http://ui:\(services.ui.environment.PORT)"
          }
          // PLANE_AGENT__IP: "100.85.122.130"
        }
      }
    }
  }
}

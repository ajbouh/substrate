package service

import (
  "strings"

  fly_app "github.com/ajbouh/substrate/pkg/fly:app"
  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
)

let #def = {
  #var: {
    namespace: string
  }

  name: string

  image: string

  command ?: [...string]

  build: {
    dockerfile: string | *"services/\(name)/Dockerfile"
    args ?: [string]: string
    context ?: string
    target ?: string
  }

  environment: [string]: string

  secrets: [string]: string

  mounts: [
    ...{
      source: string
      destination: string
    }
  ] | *[]

  #host: string
  #internal_host: string

  #fly_app: fly_app & {
    app: #host

    #secrets: secrets
    "build": "image": "registry.fly.io/\(app):\(#var.namespace)-latest"
    "env": environment
    "mounts": mounts
  }

  #docker_compose_service: docker_compose_service & {
    volumes: [
      for mount in mounts {
        "\(mount.source):\(mount.destination):rw"
      }
    ]

    if command != _|_ { "command": command }

    "build": build

    "environment": {
      environment
      secrets
    }
  }

  #docker_compose_volumes: {
    [string]: _

    for mount in mounts {
      if !strings.HasPrefix(mount.source, "/") && !strings.HasPrefix(mount.source, ".") {
        "\(mount.source)": {}
      }
    }
  }

  #nomad_task: {
    #nomad_taskgroup: {
      networks: [...] | *[]
    }

    "name": name
    driver: "docker"

    "env": {
      environment
      secrets
    }

    "resources": {
      cores ?: int
      memorymb ?: int
    }

    "config": {
      // Default to an image name, but expect to override it before deploy.
      "image": string | *"ghcr.io/ajbouh/\(name):\(#var.namespace)-latest"

      "mount": [
        for mount in mounts {
          if !strings.HasPrefix(mount.source, "/") && !strings.HasPrefix(mount.source, ".") {
            type: "volume"
          }
          if strings.HasPrefix(mount.source, "/") || strings.HasPrefix(mount.source, ".") {
            type: "bind"
            if mount.propagation != _|_ {
              bind_options: {
                propagation: mount.propagation
              }
            }
          }

          target: mount.destination
          source: mount.source
          readonly: false
        }
      ]
    }
  }
}

#def

package deploy

import (
  "list"

  "github.com/ajbouh/substrate:external"

  "github.com/ajbouh/substrate/pkg:jamsocket"

  build_services "github.com/ajbouh/substrate/services"

  build_lenses "github.com/ajbouh/substrate/lenses"
)

#namespace: string @tag(namespace)

#services: (build_services & {
  #var: {
    "namespace": #namespace
    "lenses": (build_lenses & {
        #var: {
          "namespace": #namespace
        }
      })
    "substratefs": {
      #var: {
        "namespace": #namespace
        source: "\(nomad.jobs.substratefs_redis.#tasks["substratefs-redis"].#out.url)/4"
        namesuffix: "-4"
        storage: "s3"
        bucket: "https://s3.\(external.aws.AWS_REGION).amazonaws.com/\(external.aws.S3_BUCKET)/"
        secret_key: external.aws.AWS_SECRET_ACCESS_KEY
        access_key: external.aws.AWS_ACCESS_KEY_ID
      }
    }
    "substrate": {
      "internal_port": 8080
      "origin": "https://\(#namespace)-substrate.fly.dev"
    }

    "plane_drone_substratefs_mountpoint": #services["substratefs-mount"].#out.mountpoint
    
    "secrets": {
      "substrate": {
        "session_secret": "ZY26eu01TPYC7Ief90x6QIQQurPvN7YPdpK21u3aGsRPiLPDSO2EW43R2xOlUsBWvfI59Eum10XpwsRPp0qCQ"
      }
      "substratefs-redis": {
        "password": "GCwHz7fELHgH8phWFMzrpIYhUzAETIeEPD9Os5lJqxnw32fsuJj9MURrK0"
      }
    }
  }
})

fly: apps: {
  [name=string]: {
    #services[name].#fly_app

    #regions: "app": [external.fly.default_region]
  }

  "substrate": {}
}

nomad: jobs: {
  [jobid=string]: {
    id: jobid
    #tasks: [name=string]: #services[name].#nomad_task & {
      #fqdn: external.tailscale.drone_ip
    }
  }

  substratefs_redis: {
    #tasks: {
      "substratefs-redis": {}
    }

    datacenters: ["dc1"]
    type: "service"

    taskgroups: [
      {
        name: "redis"
        count: 1

        tasks: [
          #tasks["substratefs-redis"],
        ]

        networks: list.Concat([
          for task in tasks {
            [for network in task.#nomad_taskgroup.networks { network } ]
          }
        ])
      }
    ]
  }

  jamsocket_drone: {
    #tasks: {
      "substratefs-mount": {}
      "plane-drone": {}
    }

    datacenters: ["dc1"]
    type: "service"

    taskgroups: [
      {
        name: "jamsocket"
        count: 1

        tasks: [
          #tasks["substratefs-mount"],
          #tasks["plane-drone"],
        ]

        networks: list.Concat([
          for task in tasks {
            [for network in task.#nomad_taskgroup.networks { network } ]
          }
        ])
      }
    ]
  }
}

"jamsocket": #services_delta: jamsocket.#services_delta & {
  #var: {
    "lenses": {
      for name, def in #services.#var.lenses {
        if def.spawn.jamsocket != _|_ {
          "\(name)": def
        }
      }
    }
    "existing": string
  }
}

// Just for building...
docker_compose: {
  "services": {
    for name, lens in #services.#var.lenses {
      if lens.#build != null {
        "lens-\(name)": {
          image: "\(external.jamsocket.registry)/\(external.jamsocket.account)/\(lens.spawn.jamsocket.service)"
          build: dockerfile: lens.#build.dockerfile
          if lens.#build.args != _|_ {
            build: args: lens.#build.args
          }
        }
      }
    }

    [name=string]: {
      if #services[name].build != _|_ { build: #services[name].build }
    }

    // These are deployed via nomad, so we need to use the proper nomad task
    "substratefs-mount": image: nomad.jobs.jamsocket_drone.#tasks["substratefs-mount"].config.image
    "plane-drone": image: nomad.jobs.jamsocket_drone.#tasks["plane-drone"].config.image

    "substratefs-redis": image: nomad.jobs.substratefs_redis.#tasks["substratefs-redis"].config.image

    // These are deployed to fly, so we need to use the proper fly image name
    "substrate": image: fly.apps["substrate"].build.image
  }
}

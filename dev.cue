package dev

import (
  "github.com/ajbouh/substrate:external"

  "github.com/ajbouh/substrate:deploy"

  build_services "github.com/ajbouh/substrate/services"

  build_lenses "github.com/ajbouh/substrate/lenses"
)

#namespace: string @tag(namespace)

// HACK this is not so good... we're reusing state from deploy while in dev...?
// let namespace = #namespace
let hack_deploy_var = (deploy & {#namespace: "substrate-adamb"}).#services.#var

#services: (build_services & {
  #var: {
    "namespace": "\(#namespace)-dev"
    "hostprefix": "\(#namespace)-dev-"
    "lenses": (build_lenses & {
      #var: {
        "namespace": #namespace
      }
    })
    "secrets": {
      "substrate": {
        "session_secret": "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      }
    }
    "substrate": {
      internal_port: 443
    }
    "plane_drone_substratefs_mountpoint": hack_deploy_var["plane_drone_substratefs_mountpoint"]
    "substratefs": hack_deploy_var["substratefs"]
    // "substratefs": {
    //   #var: {
    //     "namespace": #namespace
    //     source: "\(fly.apps["substratefs-redis"].#out.url)/1"
    //     storage: "s3"
    //     bucket: "https://\(external.aws.S3_BUCKET).s3.\(external.aws.AWS_REGION).amazonaws.com/4/fs"
    //     secret_key: external.aws.AWS_SECRET_ACCESS_KEY
    //     access_key: external.aws.AWS_ACCESS_KEY_ID
    //   }
    // }
  }
})

docker_compose_lenses: {
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
        ORIGIN: "https://\(#services.#var.namespace)-substrate.tail87070.ts.net"
        PUBLIC_EXTERNAL_ORIGIN: ORIGIN
      }
    }
    substrate: {
      #services["substrate"].#docker_compose_service

      environment: {
        EXTERNAL_UI_HANDLER: "http://ui:\(ui.environment.PORT)"
      }
    }

    // "substratefs-mount": {}
    // "substratefs-redis": {}
    // "plane-drone": {}
    // "nats": {}
    // "plane-controller": {}
  }
}

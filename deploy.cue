package deploy

import (

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
    "substrate": {
      "internal_port": 8080
      "origin": "https://\(#namespace)-substrate.fly.dev"
    }

    
    "secrets": {
      "substrate": {
        "session_secret": "ZY26eu01TPYC7Ief90x6QIQQurPvN7YPdpK21u3aGsRPiLPDSO2EW43R2xOlUsBWvfI59Eum10XpwsRPp0qCQ"
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


    // These are deployed to fly, so we need to use the proper fly image name
    "substrate": image: fly.apps["substrate"].build.image
  }
}

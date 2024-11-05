package defs

enable: "quickjs": true

imagespecs: "quickjs": {
  image: "\(#var.image_prefix)quickjs"
  build: dockerfile: "images/quickjs/Dockerfile"
}

services: "quickjs": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
}

commands: "quickjs": {
  "eval": {
    description: ""
    parameters: {
      source: type: "string"
      execute_timeout: type: "number"
      max_stack_size: type: "number"
      memory_limit: type: "number"
      gc_threshold: type: "number"
      globals: type: "object"
      arguments: type: "array"
    }
    returns: {
      result: type: "object"
    }

    run: http: {
      "parameters": {
        for parameter, v in parameters {
          (parameter): path: "request.body.parameters.\(parameter)"
        }
      }
      "returns": {
        for return, v in returns {
          (return): path: "response.body.\(return)"
        }
      }
      request: {
        method: "POST"
        url: "/quickjs/"
        headers: "Content-Type": ["application/json"]
        body: {
          command: "eval"
          parameters: [string]: _
        }
      }
    }

  }
}

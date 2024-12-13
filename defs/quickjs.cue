package defs

import (
  command "github.com/ajbouh/substrate/defs/substrate:command"
)

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
    meta: {
      "#/data/parameters/source": {type: "string"}
      "#/data/parameters/execute_timeout": {type: "number"}
      "#/data/parameters/max_stack_size": {type: "number"}
      "#/data/parameters/memory_limit": {type: "number"}
      "#/data/parameters/gc_threshold": {type: "number"}
      "#/data/parameters/globals": {type: "object"}
      "#/data/parameters/arguments": {type: "array"}

      "#/data/returns/result": {type: "object"}
    }

    command.ViaHTTP
    #msg_request_body_parameter_prefix: "parameters/"

    msg: data: request: {
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

package defs

import (
  command "github.com/ajbouh/substrate/defs/substrate:command"
)

enable: "tool-call": true

#var: {
  host_source_directory: string
}

imagespecs: "tool-call": {
  image: "\(#var.image_prefix)tool-call"
  build: dockerfile: "images/tool-call/Dockerfile"
}

services: "tool-call": {
  instances: [string]: {
    environment: {
      SUBSTRATE_URL_PREFIX: string
    }
    url_prefix: environment.SUBSTRATE_URL_PREFIX
  }
}


live_edit: "tool-call": bool

if live_edit["tool-call"] {
  services: "tool-call": instances: [string]: {
    mounts: {
      "/go/src/github.com/ajbouh/substrate/images/tool-call/prompts": { source: "\(#var.host_source_directory)/images/tool-call/prompts", mode: ["ro"] }
      "/go/src/github.com/ajbouh/substrate/images/tool-call/js": { source: "\(#var.host_source_directory)/images/tool-call/js", mode: ["ro"] }
    }
  }
}

commands: "tool-call": {
  "suggest": {
    meta: {
      "#/data/parameters/input": {type: "string"}
      "#/data/parameters/commands": {type: "map[string]command.Def"}

      "#/data/returns/prompt": {type: "string"}
      "#/data/returns/choices": {type: "[]command.Request"}
    }

    command.ViaHTTP
    #msg_request_body_parameter_prefix: "parameters/"

    msg: data: request: {
      method: "POST"
      url: "/tool-call/"
      headers: "Content-Type": ["application/json"]
      body: {
        command: "suggest"
        parameters: {}
      }
    }
  }
}

package defs

enable: "tool-call": true

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
    parameters: input: type: "string"
    parameters: commands: type: "map[string]command.Def"

    returns: prompt: type: "string"
    returns: choices: type: "[]command.Request"

    run: http: {
      "parameters": {
        for parameter, v in parameters {
          (parameter): path: "request.body.\(parameter)"
        }
      }
      "returns": {
        for return, v in returns {
          (return): path: "response.body.\(return)"
        }
      }
      request: {
        method: "POST"
        url: "/"
        headers: "Content-Type": ["application/json"]
        body: {}
      }
    }
  }
}

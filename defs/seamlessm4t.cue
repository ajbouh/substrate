package defs

import (
  asr "github.com/ajbouh/substrate/defs/asr"
)

enable: "seamlessm4t": true

live_edit: "seamlessm4t": bool

tests: "seamlessm4t": translate: {
  test_templates["translator"]

  environment: URL: "http://substrate:8080/seamlessm4t/v1/transcribe"
  depends_on: "substrate": true
}

tests: "seamlessm4t": transcribe: {
  test_templates["transcriber"]

  environment: URL: "http://substrate:8080/seamlessm4t/v1/transcribe"
  depends_on: "substrate": true
}

imagespecs: "seamlessm4t": {
  image: "\(#var.image_prefix)seamlessm4t"
  build: dockerfile: "images/seamlessm4t/Dockerfile"
}

resourcedirs: "huggingface:model:facebook/seamless-m4t-v2-large:f9c8e845d2655d96ed6377dc48efbcfdd97c410f": _

services: "seamlessm4t": {
  instances: [string]: {
    environment: {
      MODEL: "/res/model/huggingface/local"
      PORT: string
      // MODEL_DEVICE: "cuda"
      // MODEL_COMPUTE_TYPE: "float32"
      LOG_LEVEL: "debug"
    }
    resourcedirs: {
      model: "huggingface:model:facebook/seamless-m4t-v2-large:f9c8e845d2655d96ed6377dc48efbcfdd97c410f"
    }

    command: ["--port", environment.PORT]

    if live_edit["seamlessm4t"] {
      mounts: {
        "/app/": { source: "\(#var.host_source_directory)/images/seamlessm4t", mode: "ro" }
      }
    }
  }
}

commands: "seamlessm4t": {
  let transcribe = {
    description: ""
    parameters: {
      source_language: type: "string"
      target_language: type: "string"
      ...
    }
    returns: {
      source_language: type: "string"
      target_language: type: "string"
      duration: type: "float"
      segments: type: "object"
    }
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
        url: "/seamlessm4t/v1/transcribe"
        headers: "Content-Type": ["application/json"]
        body: {}
      }
    }
  }

  "translate": transcribe & {
    parameters: text: type: "string"
  }
  "transcribe-data": transcribe & {
    parameters: audio_metadata: type: "object"
    parameters: audio_data: type: "string"
  }
  "transcribe-url": transcribe & {
    parameters: audio_metadata: type: "object"
    parameters: audio_url: type: "string"
  }
}

calls: "seamlessm4t": {
  transcribe: {
    request: {
      url: path: "/seamlessm4t/v1/transcribe"
      // headers: "Content-Type": "application/json"
      body: asr.#Request
      body: {
        source_language ?: string
        target_language !: string
        text ?: string
        if source_language != _|_ {
          target_language: != source_language
        }
      }
    }
    response: {
      // headers: "Content-Type": "application/json"
      body: asr.#Response
    }
  }
}

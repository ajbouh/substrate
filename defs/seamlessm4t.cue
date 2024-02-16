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

imagespecs: "seamlessm4t": {}

"lenses": "seamlessm4t": {
  spawn: {
    environment: {
      MODEL: "/res/model/huggingface/local"
      PORT: string
      // MODEL_DEVICE: "cuda"
      // MODEL_COMPUTE_TYPE: "float32"
      LOG_LEVEL: "debug"
    }
    resourcedirs: {
      model: {
        id: "huggingface:model:facebook/seamless-m4t-v2-large:f9c8e845d2655d96ed6377dc48efbcfdd97c410f"
      }
    }

    command: [
      "--log-level", "debug",
      "--port", environment.PORT,
      "--reload", "--reload-dir", "/app",
      "--access-log",
    ]

    if live_edit["seamlessm4t"] {
      mounts: [
        { source: "\(#var.host_source_directory)/images/seamlessm4t", destination: "/app/", mode: "ro" },
      ]
    }
  }

  calls: [
    {
      request: {
        url: path: "/v1/transcribe"
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
  ]
}

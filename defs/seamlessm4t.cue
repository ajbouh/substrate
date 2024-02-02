package defs

import (
  asr "github.com/ajbouh/substrate/defs/asr"
)

enable: "seamlessm4t": true

imagespecs: "seamlessm4t": {}

"lenses": "seamlessm4t": {
  spawn: {}
  spawn: environment: {
    MODEL: "/res/model/huggingface/local"
    // MODEL_DEVICE: "cuda"
    // MODEL_COMPUTE_TYPE: "float32"
  }

  spawn: resourcedirs: {
    model: {
      id: "huggingface:model:facebook/seamless-m4t-v2-large:f9c8e845d2655d96ed6377dc48efbcfdd97c410f"
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
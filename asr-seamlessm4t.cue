package dev

import (
  asr "github.com/ajbouh/substrate/pkg/asr"
)

enable: "asr-seamlessm4t": true

imagespecs: "asr-seamlessm4t": {}

"lenses": "asr-seamlessm4t": {
  spawn: {}
  spawn: environment: {
    MODEL: "/res/model/local/pytorch_model.bin"
    MODEL_DEVICE: "cuda"
    MODEL_COMPUTE_TYPE: "float32"
  }

  spawn: resourcedirs: {
    model: {
      id: "huggingface:model:facebook/hf-seamless-m4t-large:b8a4df80dce9b34bd3d9b4a82f4abe579f6160a0"
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

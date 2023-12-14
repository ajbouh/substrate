package services

import (
  asr "github.com/ajbouh/substrate/pkg/asr"
)

containerspecs: "asr-seamlessm4t": {
  disabled: true
}

"lenses": "asr-seamlessm4t": {
  spawn: {}
  spawn: environment: {
    MODEL_SIZE: "seamlessM4T_large"
    MODEL_DEVICE: "cuda"
    MODEL_COMPUTE_TYPE: "float32"
    TORCH_HOME: "/cache/torch"
    HF_HOME: "/cache/huggingface"
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

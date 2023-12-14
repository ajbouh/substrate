package services

import (
  lens "github.com/ajbouh/substrate/pkg/substrate:lens"
  asr "github.com/ajbouh/substrate/pkg/asr"
)

containerspecs: "asr-faster-whisper": {}

"lenses": "asr-faster-whisper": lens & {
  spawn: {}
  spawn: environment: {
    if spawn.parameters.cuda_memory_total.resource.quantity > 0 {
      MODEL_SIZE: "large-v2"
      MODEL_DEVICE: "cuda"
      MODEL_COMPUTE_TYPE: "float16"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      CUDA_VISIBLE_DEVICES: "0"
    }
    if spawn.parameters.cuda_memory_total.resource.quantity == 0 {
      MODEL_SIZE: "tiny"
      MODEL_DEVICE: "cpu"
      MODEL_COMPUTE_TYPE: "int8"
    }

    TORCH_HOME: "/cache/torch"
    HF_HOME: "/cache/huggingface"
  }

  calls: [
    {
      request: {
        url: path: "/v1/transcribe"
        // headers: "Content-Type": "application/json"
        body: asr.#Request
        body: audio_data !: bytes | string
      }
      response: {
        // headers: "Content-Type": "application/json"
        // body: asr.#Response
      }
    }
  ]
}

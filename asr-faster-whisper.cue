package dev

import (
  asr "github.com/ajbouh/substrate/pkg/asr"
)

enable: "asr-faster-whisper": true

imagespecs: "asr-faster-whisper": {}

// default model choices are
// "Systran/faster-whisper-tiny",
// "Systran/faster-whisper-tiny.en",
// "Systran/faster-whisper-base",
// "Systran/faster-whisper-base.en,",
// "Systran/faster-whisper-small",
// "Systran/faster-whisper-small.en",
// "Systran/faster-whisper-medium",
// "Systran/faster-whisper-medium.en",
// "Systran/faster-whisper-large-v1",
// "Systran/faster-whisper-large-v2",
// "Systran/faster-whisper-large-v3",

// resourcesets: "asr-faster-whisper": [
//   {
//     imagespecs["huggingface-cli"]
//     command: ["download", "--repo-type", "model", "--cache-dir", "/rs/hf/cache", "Systran/faster-whisper-tiny"]
//     mounts: [{destination: "/rs"}]
//   },
//   {
//     imagespecs["huggingface-cli"]
//     command: ["download", "--repo-type", "model", "--cache-dir", "/rs/hf/cache", "Systran/faster-whisper-large-v3"]
//     mounts: [{destination: "/rs"}]
//   },
// ]

lenses: "asr-faster-whisper": {
  spawn: {}
  spawn: {
    environment: {
      HF_HOME: "/rs/hf/cache"
    }

    environment: {
      MODEL_REPO: string
    }

    parameters: _
    let p = parameters
    if p.cuda_memory_total.resource.quantity > 0 {
      environment: {
        MODEL_REPO: "Systran/faster-whisper-large-v3"
        MODEL_DEVICE: "cuda"
        MODEL_COMPUTE_TYPE: "float16"
        CUDA_DEVICE_ORDER: "PCI_BUS_ID"
        CUDA_VISIBLE_DEVICES: "0"
      }
    }
    if p.cuda_memory_total.resource.quantity == 0 {
      environment: {
        MODEL_REPO: "Systran/faster-whisper-tiny"
        MODEL_DEVICE: "cpu"
        MODEL_COMPUTE_TYPE: "int8"
      }
    }

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


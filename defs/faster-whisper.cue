package defs

import (
  asr "github.com/ajbouh/substrate/defs/asr"
)

enable: "faster-whisper": true

tests: "faster-whisper": transcribe: {
  test_templates["transcriber"]

  environment: URL: "http://substrate:8080/faster-whisper/v1/transcribe"
  depends_on: "substrate": true
}

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

imagespecs: "faster-whisper": {}

services: "faster-whisper": {
  instances: [string]: {
    environment: {
      MODEL_REPO: string
      PORT: string
    }

    command: ["--port", environment.PORT]

    resourcedirs: {
      tiny: {
        id: "huggingface:model:Systran/faster-whisper-tiny:d90ca5fe260221311c53c58e660288d3deb8d356"
      }
      // "large-v2": {
      //   id: "huggingface:model:Systran/faster-whisper-large-v2:f0fe81560cb8b68660e564f55dd99207059c092e"
      // }
      "large-v3": {
        id: "huggingface:model:Systran/faster-whisper-large-v3:edaa852ec7e145841d8ffdb056a99866b5f0a478"
      }
    }

    if system.#cuda_memory_total_mb > 0 {
      environment: {
        MODEL_REPO: "/res/large-v3/huggingface/local"
        MODEL_DEVICE: "cuda"
        MODEL_COMPUTE_TYPE: "float16"
        CUDA_DEVICE_ORDER: "PCI_BUS_ID"
        CUDA_VISIBLE_DEVICES: "0"
      }
    }
    if system.#cuda_memory_total_mb == 0 {
      environment: {
        MODEL_REPO: "/res/tiny/huggingface/local"
        MODEL_DEVICE: "cpu"
        MODEL_COMPUTE_TYPE: "int8"
      }
    }
  }
}

calls: "faster-whisper": {
  transcribe: {
    request: {
      url: path: "/faster-whisper/v1/transcribe"
      // headers: "Content-Type": "application/json"
      body: asr.#Request
      body: audio_data !: bytes | string
    }
    response: {
      // headers: "Content-Type": "application/json"
      // body: asr.#Response
      ...
    }
  }
}


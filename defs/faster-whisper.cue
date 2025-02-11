package defs

import (
  command "github.com/ajbouh/substrate/defs/substrate:command"
  asr "github.com/ajbouh/substrate/defs/asr"
)

enable: "faster-whisper": true

live_edit: "faster-whisper": bool

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

imagespecs: "faster-whisper": {
  image: "\(#var.image_prefix)faster-whisper"
  build: dockerfile: "images/faster-whisper/Dockerfile"
}

resourcedirs: "huggingface:model:Systran/faster-whisper-tiny:d90ca5fe260221311c53c58e660288d3deb8d356": _
resourcedirs: "huggingface:model:Systran/faster-whisper-large-v3:edaa852ec7e145841d8ffdb056a99866b5f0a478": _

services: "faster-whisper": {
  instances: [string]: {
    environment: {
      MODEL_REPO: string
      PORT: string
    }

    command: ["--port", environment.PORT]

    resourcedirs: {
      tiny: "huggingface:model:Systran/faster-whisper-tiny:d90ca5fe260221311c53c58e660288d3deb8d356"
      // "large-v2": "huggingface:model:Systran/faster-whisper-large-v2:f0fe81560cb8b68660e564f55dd99207059c092e"
      "large-v3": "huggingface:model:Systran/faster-whisper-large-v3:edaa852ec7e145841d8ffdb056a99866b5f0a478"
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

    if live_edit["faster-whisper"] {
      mounts: {
        "/app/": { source: "\(#var.host_source_directory)/images/faster-whisper", mode: ["ro"] }
      }
    }
  }
}


commands: "faster-whisper": {
  let transcribe = {
    meta: {
        "#/data/parameters/audio_metadata": {type: "object"}
        "#/data/parameters/source_language": {type: "string"}
        "#/data/parameters/task": {type: "string"}

        "#/data/returns/source_language": {type: "string"}
        "#/data/returns/source_language_prob": {type: "float"}
        "#/data/returns/target_language": {type: "string"}
        "#/data/returns/duration": {type: "float"}
        // "#/data/returns/all_language_probs": {type: "map[string,float]"}
        "#/data/returns/segments": {type: "object"}
    }
    command.ViaHTTP
    msg: http: request: {
      method: "POST"
      url: "/faster-whisper/v1/transcribe"
      headers: "Content-Type": ["application/json"]
      body: {}
    }
  }

  "transcribe-data": transcribe & {
    meta: {
      "#/data/parameters/audio_data": {type: "string"}
    }
  }
  "transcribe-url": transcribe & {
    meta: {
      "#/data/parameters/audio_url": {type: "string"}
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

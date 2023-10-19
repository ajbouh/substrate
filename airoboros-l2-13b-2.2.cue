package dev

import (
  // "github.com/ajbouh/substrate/pkg/asr"
  "github.com/ajbouh/substrate/pkg/chat:chat_completion"
)

enable: "llama-cpp-python": true
enable: "airoboros-l2-13b-2.2": true

imagespecs: "llama-cpp-python": {}

"lenses": "airoboros-l2-13b-2.2": {
  spawn: {
    image: imagespecs["llama-cpp-python"].image
    environment: {
      USE_MLOCK: "0"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      // CUDA_VISIBLE_DEVICES: "1,0"
    }

    resourcedirs: {
      airoboros: {
        id: "huggingface:model:TheBloke/Airoboros-L2-13B-2.2-GGUF:fc16805be8a5a90b7ea4e614711a23b96981521d:airoboros-l2-13b-2.2.Q5_K_M.gguf"
      }
    }

    command: [
      "--model=/res/airoboros/huggingface/local/airoboros-l2-13b-2.2.Q5_K_M.gguf",
      "--n_gpu_layers=43",
    ]
  }

  calls: [
    {
      request: {
        url: path: "/v1/chat/completions"
        // headers: "Content-Type": ["application/json"]
        body: chat_completion.#Request
      }
      response: {
        // headers: "Content-Type": "application/json"
        // body: chat_completion.#Response
      }
    },
    // {
    //   request: {
    //     body: asr.#Request
    //     body: {
    //       source_language ?: string
    //       target_language !: string
    //       text ?: string
    //       if source_language != _|_ {
    //         target_language: != source_language
    //       }
    //     }
    //   }
    //   // branches: [
    //   //   {
    //   //     call: {
    //   //       "request": {
    //   //         // headers: "Content-Type": "application/json"
    //   //         body: chat_completion.#Request
    //   //         body: messages: [{
    //   //           role: "system"
    //   //           content: """
    //   //               you are a translator for the \(request.body.target_language) language.
    //   //               respond to each message with the \(request.body.target_language) translation.
    //   //               """
    //   //         }]
    //   //       }
    //   //       "response": {
    //   //         body: chat_completion.#Response
    //   //       }
    //   //     }
    //   //     "yield": {
    //   //       response: {
    //   //         body: asr.#Response
    //   //       }
    //   //     }
    //   //   },
    //   // ]
    // },
  ]
}

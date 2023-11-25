package services

import (
  "github.com/ajbouh/substrate/pkg/asr"
  "github.com/ajbouh/substrate/pkg/chat:chat_completion"
)

"lenses": "llama-cpp-python": {
  name: "llama-cpp-python"
  disabled: true

  spawn: environment: {
    USE_MLOCK: "0"
    TORCH_HOME: "/cache/torch"
    CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    CUDA_VISIBLE_DEVICES: "1,0"
    HF_HOME: "/cache/huggingface"
  }

  calls: [
    {
      request: {
        url: path: "/v1/chat/completions"
        // headers: "Content-Type": "application/json"
        body: chat_completion.#Request
      }
      response: {
        // headers: "Content-Type": "application/json"
        body: chat_completion.#Response
      }
    },
    {
      request: {
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
      // branches: [
      //   {
      //     call: {
      //       "request": {
      //         // headers: "Content-Type": "application/json"
      //         body: chat_completion.#Request
      //         body: messages: [{
      //           role: "system"
      //           content: """
      //               you are a translator for the \(request.body.target_language) language.
      //               respond to each message with the \(request.body.target_language) translation.
      //               """
      //         }]
      //       }
      //       "response": {
      //         body: chat_completion.#Response
      //       }
      //     }
      //     "yield": {
      //       response: {
      //         body: asr.#Response
      //       }
      //     }
      //   },
      // ]
    },
  ]
}

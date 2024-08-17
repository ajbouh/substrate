package defs

import (
  // "github.com/ajbouh/substrate/defs/asr"
  "github.com/ajbouh/substrate/defs/chat:chat_completion"
)

enable: "airoboros-l2-13b-2.2": true

tests: "airoboros-l2-13b-2.2": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/airoboros-l2-13b-2.2/v1"
  depends_on: "substrate": true
}

imagespecs: "airoboros-l2-13b-2.2": imagespecs["vllm"]

services: "airoboros-l2-13b-2.2": {
  instances: [string]: {
    environment: {
      // USE_MLOCK: "0"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      // CUDA_VISIBLE_DEVICES: "1,0"
    }

    resourcedirs: {
      model: {
        id: "huggingface:model:TheBloke/airoboros-l2-13b-gpt4-2.0-AWQ:cd4642fa384abee24063063644a06bbb4119102a"
      }
    }

    command: [
      "--host", "0.0.0.0",
      "--port", "8080",
      "--model=/res/model/huggingface/local",
      "--enforce-eager",
      "--dtype=half",
      "--quantization=awq",
    ]
  }
}

calls: "airoboros-l2-13b-2.2": {
  v1_chat_completion: {
    request: {
      url: path: "/airoboros-l2-13b-2.2/v1/chat/completions"
      // headers: "Content-Type": ["application/json"]
      body: chat_completion.#Request
    }
    response: {
      // headers: "Content-Type": "application/json"
      // body: chat_completion.#Response
      ...
    }
  }
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
}

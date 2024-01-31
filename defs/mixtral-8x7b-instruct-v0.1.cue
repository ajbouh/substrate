package defs

enable: "llama-cpp-python": true
enable: "mixtral-8x7b-instruct-v0.1": true

imagespecs: "llama-cpp-python": {}

"lenses": "mixtral-8x7b-instruct-v0.1": {
  spawn: {
    image: imagespecs["llama-cpp-python"].image
    environment: {
      MODEL: "/res/gguf/huggingface/local/mixtral-8x7b-instruct-v0.1.Q5_K_M.gguf"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      gguf: {
        id: "huggingface:model:TheBloke/Mixtral-8x7B-Instruct-v0.1-GGUF:fa1d3835c5d45a3a74c0b68805fcdc133dba2b6a:mixtral-8x7b-instruct-v0.1.Q5_K_M.gguf"
      }
    }

    command: [
      "--n_gpu_layers=9999",
    ]
  }

  // calls: [
  //   {
  //     request: {
  //       url: path: "/v1/chat/completions"
  //       // headers: "Content-Type": ["application/json"]
  //       body: chat_completion.#Request
  //     }
  //     response: {
  //       // headers: "Content-Type": "application/json"
  //       // body: chat_completion.#Response
  //     }
  //   },
  // ]
}

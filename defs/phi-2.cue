package defs

enable: "llama-cpp-python": true
enable: "phi-2": true

imagespecs: "llama-cpp-python": {}

"lenses": "phi-2": {
  spawn: {
    image: imagespecs["llama-cpp-python"].image
    environment: {
      MODEL: "/res/gguf/huggingface/local/phi-2.Q5_K_M.gguf"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      gguf: {
        id: "huggingface:model:TheBloke/phi-2-GGUF:5a454d977c6438bb9fb2df233c8ca70f21c87420:phi-2.Q5_K_M.gguf"
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

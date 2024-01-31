package defs

enable: "llama-cpp-python": true
enable: "wizardcoder-python-34b-v1.0": true

imagespecs: "llama-cpp-python": {}

"lenses": "wizardcoder-python-34b-v1.0": {
  spawn: {
    image: imagespecs["llama-cpp-python"].image
    environment: {
      MODEL: "/res/gguf/huggingface/local/wizardcoder-python-34b-v1.0.Q5_K_M.gguf"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      gguf: {
        id: "huggingface:model:TheBloke/WizardCoder-Python-34B-V1.0-GGUF:19e229180b810e370d279a6d751becc664c65138:wizardcoder-python-34b-v1.0.Q5_K_M.gguf"
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

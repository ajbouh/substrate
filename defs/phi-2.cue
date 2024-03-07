package defs

enable: "phi-2": true

tests: "phi-2": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/phi-2/v1"
  depends_on: "substrate": true
  depends_on: "phi-2": true
}

// HACK force amd64 because we need to build on apple silicon but llama-cpp-python doesn't seem to work on it.
// #out: "docker_compose": services: "llama-cpp-python": build: platforms: ["linux/amd64"]

services: "phi-2": {
  spawn: {
    image: images["llama-cpp-python"]

    environment: {
      USE_MLOCK: "0"
      MODEL: "/res/gguf/huggingface/local/phi-2.Q5_K_M.gguf"
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      gguf: {
        id: "huggingface:model:TheBloke/phi-2-GGUF:5a454d977c6438bb9fb2df233c8ca70f21c87420:phi-2.Q5_K_M.gguf"
      }
    }

    command: [
      if system.#cuda_memory_total_mb > 0 {
          "--n_gpu_layers=9999",
      }
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

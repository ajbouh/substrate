package defs

enable: "gemma-3-12b-it": true

resourcedirs: "huggingface:model:ggml-org/gemma-3-12b-it-GGUF:ec0cbabd8dbff316f659876a50202295c3c4a314:gemma-3-12b-it-Q4_K_M.gguf": _
resourcedirs: "huggingface:model:ggml-org/gemma-3-12b-it-GGUF:ec0cbabd8dbff316f659876a50202295c3c4a314:mmproj-model-f16.gguf": _

services: "gemma-3-12b-it": {
  instances: [string]: {
    image_tag: imagespecs["llama-server"].image

    resourcedirs: {
      model: "huggingface:model:ggml-org/gemma-3-12b-it-GGUF:ec0cbabd8dbff316f659876a50202295c3c4a314:gemma-3-12b-it-Q4_K_M.gguf"
      mmproj: "huggingface:model:ggml-org/gemma-3-12b-it-GGUF:ec0cbabd8dbff316f659876a50202295c3c4a314:mmproj-model-f16.gguf"
    }

    environment: {
      LLAMA_ARG_MODEL: "/res/model/huggingface/local/gemma-3-12b-it-Q4_K_M.gguf"
      // LLAMA_ARG_MAIN_GPU: "0"
      LLAMA_ARG_SPLIT_MODE: "none"
      LLAMA_ARG_MMPROJ: "/res/mmproj/huggingface/local/mmproj-model-f16.gguf"
      LLAMA_ARG_PORT: environment["PORT"]
      LLAMA_ARG_HOST: "0.0.0.0"
      LLAMA_ARG_N_GPU_LAYERS: "999"
    }
  }
}

commands: "gemma-3-12b-it": {
  "chat_completion": (#commands["llama-server"]["chat_completion"] & {#base_url: ""})
}

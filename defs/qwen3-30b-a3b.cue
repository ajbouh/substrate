package defs

enable: "qwen-30b-a3b": true

resourcedirs: "huggingface:model:Qwen/Qwen3-30B-A3B-GGUF:e4d4bafdfb96a411a163846265362aceb0b9c63a:Qwen3-30B-A3B-Q8_0.gguf": _

services: "qwen-30b-a3b": {
  instances: [string]: {
    image_tag: imagespecs["llama-server"].image

    resourcedirs: {
      model: "huggingface:model:Qwen/Qwen3-30B-A3B-GGUF:e4d4bafdfb96a411a163846265362aceb0b9c63a:Qwen3-30B-A3B-Q8_0.gguf"
    }

    environment: {
      LLAMA_ARG_MODEL: "/res/model/huggingface/local/Qwen3-30B-A3B-Q8_0.gguf"
      LLAMA_ARG_PORT: environment["PORT"]
      LLAMA_ARG_HOST: "0.0.0.0"
      LLAMA_ARG_N_GPU_LAYERS: "999"
    }
  }
}

commands: "qwen-30b-a3b": {
  "chat_completion": (#commands["llama-server"]["chat_completion"] & {#base_url: ""})
}

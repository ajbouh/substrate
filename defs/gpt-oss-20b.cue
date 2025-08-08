package defs

enable: "gpt-oss-20b": true
resourcedirs: "huggingface:model:ggml-org/gpt-oss-20b-GGUF:b148c1bccb1500267bc93c8c6976e58f48c23b5e": _

services: "gpt-oss-20b": {
  instances: [string]: {
    image_tag: imagespecs["llama-server"].image

    resourcedirs: {
      model: "huggingface:model:ggml-org/gpt-oss-20b-GGUF:b148c1bccb1500267bc93c8c6976e58f48c23b5e"
    }

    environment: {
      LLAMA_ARG_MODEL: "/res/model/huggingface/local/gpt-oss-20b-mxfp4.gguf"
      // LLAMA_ARG_MAIN_GPU: "0"
      LLAMA_ARG_CTX_SIZE: "0"
      LLAMA_ARG_FLASH_ATTN: "1"
      LLAMA_ARG_JINJA: "1"
      LLAMA_ARG_THINK: "none"
      LLAMA_ARG_SPLIT_MODE: "none"
      LLAMA_ARG_PORT: environment["PORT"]
      LLAMA_ARG_HOST: "0.0.0.0"
      LLAMA_ARG_N_GPU_LAYERS: "999"
    }
  }
}

commands: "gpt-oss-20b": {
  "chat_completion": (#commands["llama-server"]["chat_completion"] & {#base_url: ""})
}

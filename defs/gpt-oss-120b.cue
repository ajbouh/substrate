package defs

enable: "gpt-oss-120b": true
resourcedirs: "huggingface:model:ggml-org/gpt-oss-120b-GGUF:a48e247410f0cc543e586c661ce63d82e79f2ad6": _

services: "gpt-oss-120b": {
  instances: [string]: {
    image_tag: imagespecs["llama-server"].image

    resourcedirs: {
      model: "huggingface:model:ggml-org/gpt-oss-120b-GGUF:a48e247410f0cc543e586c661ce63d82e79f2ad6"
    }

    environment: {
      LLAMA_ARG_MODEL: "/res/model/huggingface/local/gpt-oss-120b-mxfp4-00001-of-00003.gguf"
      // LLAMA_ARG_MAIN_GPU: "0"
      LLAMA_ARG_CTX_SIZE: "20000" // "0" would be better, but not enough CUDA memory
      LLAMA_ARG_FLASH_ATTN: "1"
      LLAMA_ARG_JINJA: "1"
      LLAMA_ARG_THINK: "none"
      // LLAMA_ARG_SPLIT_MODE: "none"
      LLAMA_ARG_PORT: environment["PORT"]
      LLAMA_ARG_HOST: "0.0.0.0"
      LLAMA_ARG_N_GPU_LAYERS: "999"
    }
  }
}

commands: "gpt-oss-120b": {
  "chat_completion": (#commands["llama-server"]["chat_completion"] & {#base_url: ""})
}

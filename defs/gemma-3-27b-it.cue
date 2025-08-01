package defs

enable: "gemma-3-27b-it": true

// gemma-3-27b-it-Q5_K_L.gguf

resourcedirs: "huggingface:model:bartowski/google_gemma-3-27b-it-GGUF:d840db5b4d0e4e0b87c2e673e90c8e6813815223:google_gemma-3-27b-it-Q6_K_L.gguf": _
resourcedirs: "huggingface:model:bartowski/google_gemma-3-27b-it-GGUF:d840db5b4d0e4e0b87c2e673e90c8e6813815223:mmproj-google_gemma-3-27b-it-f32.gguf": _

services: "gemma-3-27b-it": {
  instances: [string]: {
    image_tag: imagespecs["llama-server"].image

    resourcedirs: {
      model: "huggingface:model:bartowski/google_gemma-3-27b-it-GGUF:d840db5b4d0e4e0b87c2e673e90c8e6813815223:google_gemma-3-27b-it-Q6_K_L.gguf"
      mmproj: "huggingface:model:bartowski/google_gemma-3-27b-it-GGUF:d840db5b4d0e4e0b87c2e673e90c8e6813815223:mmproj-google_gemma-3-27b-it-f32.gguf"
    }

    environment: {
      LLAMA_ARG_MODEL: "/res/model/huggingface/local/google_gemma-3-27b-it-Q6_K_L.gguf"
      // LLAMA_ARG_MAIN_GPU: "0"
      // LLAMA_ARG_SPLIT_MODE: "none"
      LLAMA_ARG_MMPROJ: "/res/mmproj/huggingface/local/mmproj-google_gemma-3-27b-it-f32.gguf"
      LLAMA_ARG_PORT: environment["PORT"]
      LLAMA_ARG_HOST: "0.0.0.0"
      LLAMA_ARG_N_GPU_LAYERS: "999"
    }
  }
}

commands: "gemma-3-27b-it": {
  "chat_completion": (#commands["llama-server"]["chat_completion"] & {#base_url: ""})
}

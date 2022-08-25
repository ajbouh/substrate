package lens

name: "asr-seamlessm4t"

#build: {
  dockerfile: "./services/asr-seamlessm4t/Dockerfile"
}

spawn: jamsocket: env: {
  MODEL_SIZE: "seamlessM4T_large"
  MODEL_DEVICE: "cuda"
  MODEL_COMPUTE_TYPE: "float32"
  TORCH_HOME: "/cache/torch"
  HF_HOME: "/cache/huggingface"
}

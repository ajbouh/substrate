package lens

name: "chat-llama-cpp-python"

#build: {
  dockerfile: "docker/cuda_simple/Dockerfile"
  context: "./services/chat-llama-cpp-python"
  args: {
    MODEL_ACCOUNT: "TheBloke"
    MODEL_TAG: "llama"
  }
}

command: [
  "--hf_model=TheBloke/Airoboros-L2-13B-2.2-GGUF/airoboros-l2-13b-2.2.Q5_K_M.gguf",
  "--n_gpu_layers=43",
]

spawn: jamsocket: env: {
  USE_MLOCK: "0"
  TORCH_HOME: "/cache/torch"
  CUDA_DEVICE_ORDER: "PCI_BUS_ID"
  CUDA_VISIBLE_DEVICES: "1,0"
  HF_HOME: "/cache/huggingface"
}

volumes: [
  "torch-cache:/cache/torch",
  "huggingface-cache:/cache/huggingface",
]

deploy: resources: reservations: devices: [{driver: "nvidia", count: "all", capabilities: ["gpu"]}]

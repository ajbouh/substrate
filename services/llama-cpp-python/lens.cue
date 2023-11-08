package lens

name: "llama-cpp-python"

spawn: env: {
  USE_MLOCK: "0"
  TORCH_HOME: "/cache/torch"
  CUDA_DEVICE_ORDER: "PCI_BUS_ID"
  CUDA_VISIBLE_DEVICES: "1,0"
  HF_HOME: "/cache/huggingface"
}

package defs

enable: "llama-3-8b-instruct": true

tests: "llama-3-8b-instruct": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/llama-3-8b-instruct/v1"
  depends_on: "substrate": true
}

image_tags: "llama-3-8b-instruct": image_tags["vllm"]

services: "llama-3-8b-instruct": {
  spawn: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      model: {
        id: "huggingface:model:unsloth/llama-3-8b-Instruct:67c72164837acade483ce50f80b7cc27e94c9668"
      }
    }

    command: [
      "--host", "0.0.0.0",
      "--port", "8080",
      "--model=/res/model/huggingface/local",
      "--enforce-eager",
    ]
  }
}

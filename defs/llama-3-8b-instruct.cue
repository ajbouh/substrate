package defs

enable: "llama-3-8b-instruct": true

tests: "llama-3-8b-instruct": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/llama-3-8b-instruct/v1"
  depends_on: "substrate": true
}

resourcedirs: "huggingface:model:unsloth/llama-3-8b-Instruct:67c72164837acade483ce50f80b7cc27e94c9668": _

services: "llama-3-8b-instruct": {
  instances: [string]: {
    image_tag: imagespecs["vllm"].image

    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      model: "huggingface:model:unsloth/llama-3-8b-Instruct:67c72164837acade483ce50f80b7cc27e94c9668"
    }

    command: [
      "--host", "0.0.0.0",
      "--port", "8080",
      "--model=/res/model/huggingface/local",
      "--enforce-eager",
    ]
  }
}

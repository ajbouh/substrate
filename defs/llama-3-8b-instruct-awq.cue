package defs

enable: "llama-3-8b-instruct-awq": true

tests: "llama-3-8b-instruct-awq": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/llama-3-8b-instruct-awq/v1"
  depends_on: "substrate": true
}

image_tags: "llama-3-8b-instruct-awq": image_tags["vllm"]

services: "llama-3-8b-instruct-awq": {
  instances: [string]: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      model: {
        id: "huggingface:model:casperhansen/llama-3-8b-instruct-awq:f7fbeb24da38e1dff1e2b01278d60c6cc074c5af"
      }
    }

    command: [
      "--host", "0.0.0.0",
      "--port", "8080",
      "--model=/res/model/huggingface/local",
      "--enforce-eager",
      "--dtype=half",
      "--quantization=awq",
    ]
  }
}

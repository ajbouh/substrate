package defs

enable: "llama-3-70b-instruct-awq": true

tests: "llama-3-70b-instruct-awq": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/llama-3-70b-instruct-awq/v1"
  depends_on: "substrate": true
}

imagespecs: "llama-3-70b-instruct-awq": imagespecs["vllm"]

services: "llama-3-70b-instruct-awq": {
  instances: [string]: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      model: {
        id: "huggingface:model:casperhansen/llama-3-70b-instruct-awq:e578178ea893ca5e3326afd15da5aefa37e84d69"
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

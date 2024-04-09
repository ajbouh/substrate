package defs

enable: "mixtral-8x7b-instruct": true

tests: "mixtral-8x7b-instruct": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/mixtral-8x7b-instruct/v1"
  depends_on: "substrate": true
}

image_tags: "mixtral-8x7b-instruct": image_tags["vllm"]

services: "mixtral-8x7b-instruct": {
  instances: [string]: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      model: {
        id: "huggingface:model:casperhansen/mixtral-instruct-awq:0a898130957afe22021bbaf807f50f6bbce88201"
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

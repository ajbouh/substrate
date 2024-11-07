package defs

enable: "phi-2": true

tests: "phi-2": assister: {
  test_templates["assister"]

  environment: URL: "http://substrate:8080/phi-2/v1"
  depends_on: "substrate": true
}

resourcedirs: "huggingface:model:microsoft/phi-2:b10c3eba545ad279e7208ee3a5d644566f001670": _

commands: "phi-2": {
  (#commands["vllm"] & {[string]: #base_url: "/phi-2"})
}

services: "phi-2": {
  instances: [string]: {
    image_tag: imagespecs["vllm"].image

    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
    }

    resourcedirs: {
      model: "huggingface:model:microsoft/phi-2:b10c3eba545ad279e7208ee3a5d644566f001670"
    }

    command: [
      "--host", "0.0.0.0",
      "--port", "8080",
      "--model=/res/model/huggingface/local",
      "--enforce-eager",
    ]
  }
}

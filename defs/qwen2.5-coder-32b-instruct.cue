package defs

enable: "qwen2.5-coder-32b-instruct": true

resourcedirs: "huggingface:model:Qwen/Qwen2.5-Coder-32B-Instruct-GGUF:6ad0cdf97c9a3cfd154faf15a973c93044ba5c7e:qwen2.5-coder-32b-instruct-q6_k.gguf": _

services: "qwen2.5-coder-32b-instruct": {
  instances: [string]: {
    image_tag: imagespecs["llamafile"].image

    resourcedirs: {
      model: "huggingface:model:Qwen/Qwen2.5-Coder-32B-Instruct-GGUF:6ad0cdf97c9a3cfd154faf15a973c93044ba5c7e:qwen2.5-coder-32b-instruct-q6_k.gguf"
    }

    url_prefix: environment.SUBSTRATE_URL_PREFIX

    environment: {
      LLAMAFILE_GGUF: "/res/model/huggingface/local/qwen2.5-coder-32b-instruct-q6_k.gguf"
      SUBSTRATE_URL_PREFIX: string
      LLAMAFILE_URL_PREFIX: SUBSTRATE_URL_PREFIX
    }
  }
}

commands: "qwen2.5-coder-32b-instruct": {
  "chat_completion": (#commands["llamafile"]["chat_completion"] & {#base_url: "/qwen2.5-coder-32b-instruct"})
  "completion": (#commands["llamafile"]["completion"] & {#base_url: "/qwen2.5-coder-32b-instruct"})
}

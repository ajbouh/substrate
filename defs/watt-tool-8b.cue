package defs

enable: "watt-tool-8b": true

resourcedirs: "huggingface:model:Nekuromento/watt-tool-8B-Q8_0-GGUF:1f40446643f317895f0d806df47fb1d7365a37b9:watt-tool-8b-q8_0.gguf": _

services: "watt-tool-8b": {
  instances: [string]: {
    image_tag: imagespecs["llamafile"].image

    resourcedirs: {
      model: "huggingface:model:Nekuromento/watt-tool-8B-Q8_0-GGUF:1f40446643f317895f0d806df47fb1d7365a37b9:watt-tool-8b-q8_0.gguf"
    }

    url_prefix: environment.SUBSTRATE_URL_PREFIX

    environment: {
      LLAMAFILE_GGUF: "/res/model/huggingface/local/watt-tool-8b-q8_0.gguf"
      SUBSTRATE_URL_PREFIX: string
      LLAMAFILE_URL_PREFIX: SUBSTRATE_URL_PREFIX
    }
  }
}

commands: "watt-tool-8b": {
  "chat_completion": (#commands["llamafile"]["chat_completion"] & {#base_url: "/watt-tool-8b"})
  "completion": (#commands["llamafile"]["completion"] & {#base_url: "/watt-tool-8b"})
}

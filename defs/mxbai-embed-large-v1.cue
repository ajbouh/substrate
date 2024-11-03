package defs

enable: "mxbai-embed-large-v1": true

resourcedirs: "huggingface:model:mixedbread-ai/mxbai-embed-large-v1:7130e2d16051fdf3e0157e841f8b5a8d0d5e63ef:gguf/mxbai-embed-large-v1-f16.gguf": _

commands: "mxbai-embed-large-v1": {
  (#commands["llamafile"] & {[string]: run: http: request: #base_url: "/mxbai-embed-large-v1"})
}

services: "mxbai-embed-large-v1": {
  instances: [string]: {
    image_tag: imagespecs["llamafile"].image

    resourcedirs: {
      model: "huggingface:model:mixedbread-ai/mxbai-embed-large-v1:7130e2d16051fdf3e0157e841f8b5a8d0d5e63ef:gguf/mxbai-embed-large-v1-f16.gguf"
    }

    environment: {
      LLAMAFILE_GGUF: "/res/model/huggingface/local/gguf/mxbai-embed-large-v1-f16.gguf"
    }
  }
}

commands: "mxbai-embed-large-v1": {
  "embedding": (#commands["llamafile"]["embedding"] & {run: http: request: #base_url: "/mxbai-embed-large-v1"})
  "tokenize": (#commands["llamafile"]["tokenize"] & {run: http: request: #base_url: "/mxbai-embed-large-v1"})
}

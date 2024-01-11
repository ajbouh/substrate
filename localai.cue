package dev

enable: "localai": true

imagespecs: "localai": {
  build: {
    context: "./services/localai"
    dockerfile: "Dockerfile"
  }
}

"lenses": "localai": {
  spawn: {}
  spawn: environment: {
    MODELS_PATH: "/res/model/huggingface/cache/models--TheBloke--Airoboros-L2-13B-2.1-GGML/blobs"
    ADDRESS: ":8000"
    DEBUG: "1"
  }

  spawn: resourcedirs: {
    model: {
      id: "huggingface:model:TheBloke/Airoboros-L2-13B-2.1-GGML:612c3d3bf2ab1064441b3bdb5f9867260294c21c:airoboros-l2-13b-2.1.ggmlv3.Q4_K_S.bin"
    }
  }

  
}

package defs
enable: "parler-tts": true
imagespecs: "parler-tts": {
  image: "\(#var.image_prefix)parler-tts"
  build: dockerfile: "images/parler-tts/Dockerfile"
}

resourcedirs: "huggingface:model:parler-tts/parler-tts-large-v1:afaf5fe6c64c7b8c9f17f99b98572244a63dcd03": _
resourcedirs: "huggingface:model:parler-tts/parler-tts-mini-v1:05cb0d26c3df4425d42f51de1afe15b4ebdfa2e3": _

services: "parler-tts": {
  instances: [string]: {
    environment: {
      MODEL_REPO: string
      PORT: string
    }

    command: ["--port", environment.PORT]

    resourcedirs: {
      large: "huggingface:model:parler-tts/parler-tts-large-v1:afaf5fe6c64c7b8c9f17f99b98572244a63dcd03"
      mini: "huggingface:model:parler-tts/parler-tts-mini-v1:05cb0d26c3df4425d42f51de1afe15b4ebdfa2e3"
    }

    if (true) {
      environment: {
        MODEL_REPO: "/res/mini/huggingface/local"
      }
    }
  }
}
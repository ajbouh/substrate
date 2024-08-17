package defs

enable: "diarizer": true

imagespecs: "diarizer": {
  image: "\(#var.image_prefix)diarizer"
  build: dockerfile: "images/diarizer/Dockerfile"
}

services: "diarizer": {
  instances: [string]: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      PORT: string
    }
  }
}

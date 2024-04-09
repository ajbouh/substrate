package defs

enable: "diarizer": true

imagespecs: "diarizer": {}

services: "diarizer": {
  instances: [string]: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      PORT: string
    }
  }
}

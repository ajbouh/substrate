package defs

enable: "diarizer": true

imagespecs: "diarizer": {}

services: "diarizer": {
  spawn: {
    environment: {
      CUDA_DEVICE_ORDER: "PCI_BUS_ID"
      PORT: string
    }
    resourcedirs: {
    }
  }
}

package services

"lenses": "ui": {
  name: "ui"

  disabled: true

  spawn: {
    env: {
      PORT ?: string

      PUBLIC_EXTERNAL_ORIGIN ?: string
      ORIGIN ?: string
    }
  }
}

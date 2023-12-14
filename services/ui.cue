package services

containerspecs: "ui": {
  disabled: true
}

"lenses": "ui": {
  spawn: {}
  spawn: env: {
    PORT ?: string

    PUBLIC_EXTERNAL_ORIGIN ?: string
    ORIGIN ?: string
  }
}

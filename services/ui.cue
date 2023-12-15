package services

containerspecs: "ui": {
  disabled: true
}

"lenses": "ui": {
  disabled: true
  spawn: {}
  spawn: environment: {
    "PORT" ?: string

    PUBLIC_EXTERNAL_ORIGIN ?: string
    ORIGIN ?: string
  }
}

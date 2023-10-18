package lens

name: "ui"

spawn: {
  env: {
    PORT ?: string

    PUBLIC_EXTERNAL_ORIGIN ?: string
    ORIGIN ?: string
  }
}

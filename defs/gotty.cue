package defs

enable: "gotty": true

imagespecs: "gotty": {
  build: target: "dist-alpine"
}

"lenses": "gotty": {
  spawn: {
    url_prefix: "/gotty"
    environment: {
      PORT: string
      ORIGIN: string
      GOTTY_PATH: "/gotty"
      GOTTY_PORT: PORT
      GOTTY_WS_ORIGIN: ORIGIN
    }

    parameters: {
      data: {
        type: "space"
      }
    }
  }

  activities: {
    previewTerminal: {
      activity: "system:preview:activity:gotty"
      request: interactive: true
      request: path: "/"
      priority: 10
    }
    terminal: {
      activity: "user:open"
      label: "open terminal"
      request: interactive: true
    }
  }
}

package services

"lenses": "gotty": {
  name: "gotty"

  spawn: schema: {
    data: {
      type: "space"
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

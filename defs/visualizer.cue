package defs

enable: "visualizer": true

imagespecs: "visualizer": {}

services: "visualizer": {
  spawn: {
    ephemeral: true
  }
  spawn: parameters: data: type: "space"

  activities: {
    previewFiles: {
      activity: "system:preview:space"
      request: interactive: true
      request: path: "/"
      priority: 1
    }
  }
}

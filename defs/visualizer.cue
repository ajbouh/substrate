package defs

enable: "visualizer": true

imagespecs: "visualizer": {
  image: "\(#var.image_prefix)visualizer"
  build: dockerfile: "images/visualizer/Dockerfile"
}

services: "visualizer": {
  instances: [string]: {
    ephemeral: true
    parameters: data: type: "space"
  }

  activities: {
    previewFiles: {
      activity: "system:preview:space"
      request: interactive: true
      request: path: "/"
      priority: 1
    }
  }
}

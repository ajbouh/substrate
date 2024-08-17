package defs

enable: "jupyverse": true

imagespecs: "jupyverse": {
  image: "\(#var.image_prefix)jupyverse"
  build: dockerfile: "images/jupyverse/Dockerfile"
}

services: "jupyverse": {
  instance: parameters: data: type: "space"

  space: {
    preview: "index.ipynb"
  }

  activities: {
    open: {
      activity: "user:open"
      priority: 10

      request: {
        interactive: true
        path: "/retro/notebooks/:path"
        schema: file: {
          type: "file"
          path: ":path"
          default: "index.ipynb"
        }
      }

      label: "open notebook with Jupyverse"
    }
  }
}

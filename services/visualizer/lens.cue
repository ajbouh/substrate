package lens

import (
  // "github.com/ajbouh/substrate/pkg:svg"
)

name: "visualizer"

spawn: schema: data: type: "space"

activities: {
  previewFiles: {
    activity: "system:preview:space"
    request: interactive: true
    request: path: "/"
    priority: 1
  }
}

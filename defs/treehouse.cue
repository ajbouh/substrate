package defs

enable: "treehouse": true

imagespecs: "treehouse": {}

lenses: "treehouse": {
  spawn: {
    environment: PORT: string
    command: ["--port", environment.PORT]
  }
}

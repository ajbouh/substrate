package defs

enable: "bb": true

tests: "bb": go: {
  build: {
    target: "test"
    dockerfile: "images/bb/Dockerfile"
  }
  command: [
    "go", "test",
    "github.com/ajbouh/substrate/images/bb/...",
  ]
}

imagespecs: "bb": {}

lenses: "bb": {
  spawn: {}
}

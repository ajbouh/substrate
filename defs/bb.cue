package defs

enable: "bb": true

tests: "bb": transcribe: {
  test_templates["transcriber"]

  environment: URL: "http://substrate:8080/bb/"
  depends_on: "bb": true
  depends_on: "substrate": true
}

tests: "bb": translate: {
  test_templates["translator"]

  environment: URL: "http://substrate:8080/bb/"
  depends_on: "bb": true
  depends_on: "substrate": true
}

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

imagespecs: "bb": {
  image: "\(#var.image_prefix)bb"
  build: dockerfile: "images/bb/Dockerfile"
}

services: "bb": {
  instances: [string]: {}
}

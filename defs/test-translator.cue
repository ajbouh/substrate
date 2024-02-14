package defs

test_templates: translator: {
  build: {
    target: "test"
    dockerfile: "images/tests/translator/Dockerfile"
  }

  mounts: [
    { source: "\(#var.host_source_directory)/images/tests/translator", destination: "/test" },
  ]
  command: [ "go", "run", "/test/test.go" ]

  environment: URL: string
}

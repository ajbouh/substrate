package defs

test_templates: transcriber: {
  build: {
    target: "test"
    dockerfile: "images/tests/transcriber/Dockerfile"
  }

  mounts: [
    { source: "\(#var.host_source_directory)/images/tests/transcriber", destination: "/test" },
  ]
  command: [ "go", "run", "/test/test.go" ]

  environment: URL: string
}

package defs

test_templates: assister: {
  build: {
    target: "test"
    dockerfile: "images/tests/assister/Dockerfile"
  }

  mounts: [
    { source: "\(#var.host_source_directory)/images/tests/assister", destination: "/test" },
  ]
  command: [ "/venv/bin/python", "/test/fcheck.py" ]

  environment: URL: string
}

package defs

test_templates: assister: {
  build: {
    target: "test"
    dockerfile: "images/tests/assister/Dockerfile"
  }

  mounts: {
    "/test": { source: "\(#var.host_source_directory)/images/tests/assister"}
  }
  command: [ "/venv/bin/python", "/test/fcheck.py" ]

  environment: URL: string
}

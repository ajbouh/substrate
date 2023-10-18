package service

volumes ?: [...string]
command ?: [...string]

image ?: string

build ?: {
  target ?: string
  context ?: string
  dockerfile ?: string
}

environment ?: [string]: string

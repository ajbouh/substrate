package secret

let #secret = {
  file ?: string

  environment ?: string

  external ?: bool

  name ?: string
}

#secret
package volume

// https://docs.docker.com/compose/compose-file/07-volumes/

let #volume = {
  driver ?: string

  driver_opts ?: [string]: _

  external ?: bool

  labels ?: [string]: _

  name ?: string
}

#volume

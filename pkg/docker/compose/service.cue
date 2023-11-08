package service

let #service = {
  volumes ?: [...string]
  command ?: [...string]

  image ?: string

  build ?: {
    target ?: string
    context ?: string
    dockerfile ?: string
  }

  environment ?: [string]: string

  ports ?: [...string]

  depends_on ?: [...string]

  deploy ?: resources ?: reservations ?: devices ?: [...{driver: string, count: string, capabilities: [...string]}]

  networks ?: [...string]

  network_mode ?: "host" | string
}

#service

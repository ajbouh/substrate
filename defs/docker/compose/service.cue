package service

let #service = close({
  volumes ?: [...string]
  command ?: [...string]

  image ?: string

  build ?: close({
    target ?: string
    args ?: [string]: string
    context ?: string
    dockerfile ?: string
  })

  platform ?: string

  profiles ?: [...string]

  environment ?: [string]: string

  ports ?: [...string]

  depends_on ?: [...string]

  cap_drop ?: [...string]

  cap_add ?: [...string]

  deploy ?: resources ?: reservations ?: devices ?: [...{driver: string, count: string, capabilities: [...string]}]

  networks ?: [...string]

  network_mode ?: "host" | string

  security_opt ?: [...string]

  privileged ?: bool
})

#service

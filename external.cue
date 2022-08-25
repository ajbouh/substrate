package external


#namespace: string @tag(namespace)

jamsocket: {
  registry: string
  api: string
  nats_hosts: string
  nats_username: string
  nats_password: string

  registry_username: string
  registry_password: string

  api_token: string
  account: string

  cluster_domain: string
}

fly: {
  // From https://fly.io/docs/reference/regions/
  org: "personal"
  default_region: *"dfw" | "ams" |  "cdg" |  "den" |  "dfw" |  "ewr" |  "fra" |  "gru" |  "hkg" |  "iad" |  "jnb" |  "lax" |  "lhr" |  "maa" |  "mad" |  "mia" |  "nrt" |  "ord" |  "otp" |  "scl" |  "sea" |  "sin" |  "sjc" |  "syd" |  "waw" |  "yul" |  "yyz"
}

nomad: {
  server: "100.64.51.49"
}

tailscale: {
  drone_ip: "100.64.51.49"
  TAILSCALE_AUTHKEY: string
}

github: {
  [string]: {
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string

    registry_username: string
    registry_password: string
  }
}

aws: {
  S3_BUCKET: "mieco-dev-adamb-us-east-2"
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  AWS_REGION: "us-east-2"
}

package service

name: string

#host: string

#var: {
  password: string
  internal_port: int | *6379
  source_volume_name: string | *"redis"
}

build: {
  dockerfile: "services/redis/Dockerfile"
}

secrets: {
  REDIS_PASSWORD: #var.password
}

environment: {
  PORT: "\(#var.internal_port)"

  // From https://redis.io/docs/reference/eviction/
  MAXMEMORY_POLICY: *"noeviction" | "allkeys-lru" | "allkeys-lfu" | "volatile-lru" | "volatile-lfu" | "allkeys-random" | "volatile-random" | "volatile-ttl"
}

mounts: [
  {destination: "/data", source: #var.source_volume_name},
]

#fly_app: {
  #fqdn: string
  #external_port: 6379

  #out: {
    // TODO this should be over tailscale
    url: "redis://:\(#var.password)@\(#fqdn):\(#external_port)"
  }

  metrics: { port: 9091, path: "/metrics" }
  services: [
    {
      internal_port: #var.internal_port
      protocol: "tcp"
      ports: [{ port: "\(#external_port)" }]
      tcp_checks: [{ interval: "10s",  timeout: "2s" }]
    },
  ]
}

#nomad_task: {
  #fqdn: string
  #external_port: 6379

  #nomad_taskgroup: {
    networks: [
      {
        reservedports: [
          { label: "redis", value: #external_port, hostnetwork: "tailscale" },
        ]
      },
    ]
  }

  #out: {
    // TODO this should be over tailscale
    url: "redis://:\(#var.password)@\(#fqdn):\(#external_port)"
  }

  resources: {
    cores: 2
    memorymb: 2048
  }
  config: {
    ports: ["redis"]
  }
}


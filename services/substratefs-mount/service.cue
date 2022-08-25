package service

import (
  substratefs "github.com/ajbouh/substrate/resources/substratefs:resource"
)

name: "substratefs-mount"

#var: {
  host_cache_dir: "/opt/jfscache"
  cache_dir: "/jfscache"
  mountpoint: "/mnt/substrate"

  "substratefs": substratefs & {
    #var: {
      "mountpoint": mountpoint
      "cache_dir": cache_dir
    }
  }
}

build: {
  args: {
    JUICEFS_CE_VERSION: "v1.0.3"
  }
}

environment: {
  DEBUG: "1"
  #var.substratefs.#out.environment
}

secrets: {
  #var.substratefs.#out.secrets
}

mounts: [
  {
    source: "/dev/fuse"
    destination: "/dev/fuse",
  },
  {
    source: #var.host_cache_dir
    destination: #var.cache_dir
  },
  {
    // TODO this could be... less aggressive :)
    source: "/mnt"
    destination: "/mnt"
    propagation: "rshared"
  },
]

#out: {
  mountpoint: #var.substratefs.#out.mountpoint
}

#nomad_task: {
  config: {
    // TODO figure out how to not need privileged: true below and just use cap_add and friends
    privileged: true
    // cap_add: [
    //   "sys_admin",
    // ]
  }

  resources: {
    cores: 8
    memorymb: 2048
  }
}

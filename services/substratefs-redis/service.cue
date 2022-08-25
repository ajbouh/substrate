package service

import (
  service_redis "github.com/ajbouh/substrate/services/redis:service"
)

service_redis

name: "substratefs-redis"

#var: {
  source_volume_name: "substratefs_redis"
}

environment: {
  MAXMEMORY_POLICY: *"noeviction" | "allkeys-lru" | "allkeys-lfu" | "volatile-lru" | "volatile-lfu" | "allkeys-random" | "volatile-random" | "volatile-ttl"

  // From https://juicefs.com/docs/community/redis_best_practices/
  APPENDONLY: "yes"
  SAVE: "1 1000"
  HOST: "0.0.0.0 ::"
}

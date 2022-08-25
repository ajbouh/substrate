#!/bin/sh

set -ex

sysctl vm.overcommit_memory=1 || true
sysctl net.core.somaxconn=1024 || true

if [[ -z "${REDIS_PASSWORD}" ]]; then
  echo "The REDIS_PASSWORD environment variable is required"
  exit 1
fi

# Set maxmemory-policy to 'allkeys-lru' for caching servers that should always evict old keys
: ${MAXMEMORY_POLICY:="volatile-lru"}
: ${APPENDONLY:="no"}
: ${FLY_VM_MEMORY_MB:=512}
: ${SAVE:="60 1000"}
: ${HOST:="::"}

# Set maxmemory to 10% of available memory
MAXMEMORY=$(($FLY_VM_MEMORY_MB*90/100))

redis-server --requirepass $REDIS_PASSWORD \
  --port ${PORT} \
  --dir /data/ \
  --maxmemory "${MAXMEMORY}mb" \
  --maxmemory-policy $MAXMEMORY_POLICY \
  --appendonly $APPENDONLY \
  --save ${SAVE} \
  --bind ${HOST}

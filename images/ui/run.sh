#!/bin/sh

: ${ORIGIN:=$JAMSOCKET_URL}

# https://v3.vitejs.dev/guide/troubleshooting.html#dev-server
echo 16384 > /proc/sys/fs/inotify/max_queued_events
echo 8192 > /proc/sys/fs/inotify/max_user_instances
echo 524288 > /proc/sys/fs/inotify/max_user_watches

exec node /app/index.js "$@"

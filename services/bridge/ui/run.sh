#!/bin/sh

: ${ORIGIN:=$JAMSOCKET_URL}

exec node /app/index.js "$@"

#!/bin/bash

set -exo pipefail


# TODO make this a container with network=host
cp /tmp/caddy/caddy /usr/bin/caddy
setcap cap_net_bind_service=+ep /usr/bin/caddy

# This isn't a container because we want to run new processes against the host shell itself
cp /tmp/gotty/gotty /usr/bin/gotty

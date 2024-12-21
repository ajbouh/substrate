#!/bin/bash

set -exo pipefail

# This isn't a container because we want to run new processes against the host shell itself
cp /tmp/gotty/gotty /usr/bin/gotty

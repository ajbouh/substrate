#!/bin/bash

HERE=$(cd $(dirname $0); pwd)

exec $HERE/jamsocket/node_modules/.bin/jamsocket "$@"

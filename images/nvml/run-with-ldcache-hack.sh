#!/bin/sh

# HACK this is so gross. This is something that the nvidia ctk hooks are supposed to do automatically
echo /usr/lib64 >> /etc/ld.so.conf
/sbin/ldconfig -v
exec "$@"

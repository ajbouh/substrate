#!/bin/bash

set -exo pipefail

# TODO do we have to set a target disk image size?
#   +size: 100

# TODO do we need to set the karg pcie_aspm=off still? how?
# +    # https://askubuntu.com/questions/1401726/pcieport-0000001d-0-aer-corrected-error-received-00000400-0
# +    # https://www.reddit.com/r/linuxquestions/comments/g8pbku/any_undesirable_side_effects_of_pcinommconf/
# +    - pcie_aspm=off

rpm-ostree install \
    bootc \
    ipmitool \
    tailscale

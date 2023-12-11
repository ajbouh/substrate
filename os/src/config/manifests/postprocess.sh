#!/usr/bin/env bash
set -xeuo pipefail

# Enable Nvidia CDI integration for podman to support --device=nvidia.com/gpu=all
systemctl enable nvidia-ctk-cdi-generate

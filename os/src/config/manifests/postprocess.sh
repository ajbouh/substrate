#!/usr/bin/env bash
set -xeuo pipefail

# Enable Nvidia CDI integration for podman to support --device=nvidia.com/gpu=all

cat > /usr/lib/systemd/system/nvidia-ctk-cdi-generate.service <<'EOF'
[Unit]
ConditionPathExists=!/etc/cdi/nvidia.yaml

[Service]
Type=oneshot
ExecStart=nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target default.target
EOF

chmod 644 /usr/lib/systemd/system/nvidia-ctk-cdi-generate.service

# Enable the corresponding unit
systemctl enable nvidia-ctk-cdi-generate.service

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
systemctl enable nvidia-ctk-cdi-generate.service


# Mount OOB data from ISO if it's present

mkdir -p /run/oob
cat > /usr/lib/systemd/system/run-oob-iso-oob-oob.squashfs.mount <<'EOF'
[Unit]
ConditionPathExists=/run/media/iso/oob/oob.squashfs
RequiresMountsFor=/run/media/iso

[Mount]
What=/run/media/iso/oob/oob.squashfs
Where=/run/oob
Type=squashfs
Options=nofail

[Install]
WantedBy=substrate.service
EOF

chmod 644 /usr/lib/systemd/system/run-oob-iso-oob-oob.squashfs.mount
systemctl enable run-oob-iso-oob-oob.squashfs.mount

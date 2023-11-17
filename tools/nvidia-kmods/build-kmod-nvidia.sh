#!/bin/sh

set -oeux pipefail

RELEASE="$(rpm -E '%fedora.%_arch')"

cd /tmp

dnf install -y \
    akmod-nvidia*:*.fc${RELEASE}

# Either successfully build and install the kernel modules, or fail early with debug output
rpm -qa |grep nvidia
KERNEL_VERSION="$(rpm -q kernel --queryformat '%{VERSION}-%{RELEASE}.%{ARCH}')"
NVIDIA_AKMOD_VERSION="$(basename "$(rpm -q "akmod-nvidia" --queryformat '%{VERSION}-%{RELEASE}')" ".fc${RELEASE%%.*}")"

cat <<EOF > $1/nvidia-vars
KERNEL_VERSION=${KERNEL_VERSION}
RELEASE=${RELEASE}
NVIDIA_AKMOD_VERSION=${NVIDIA_AKMOD_VERSION}
EOF

akmods --force --kernels "${KERNEL_VERSION}" --kmod "nvidia"

modinfo /usr/lib/modules/${KERNEL_VERSION}/extra/nvidia/nvidia{,-drm,-modeset,-peermem,-uvm}.ko.xz > /dev/null || \
(cat /var/cache/akmods/nvidia/${NVIDIA_AKMOD_VERSION}-for-${KERNEL_VERSION}.failed.log && exit 1)

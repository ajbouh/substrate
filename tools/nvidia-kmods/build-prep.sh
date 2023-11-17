#!/bin/sh

set -oeux pipefail


### PREPARE REPOS
ARCH="$(rpm -E '%_arch')"
RELEASE="$(rpm -E '%fedora')"

sed -i 's@enabled=1@enabled=0@g' /etc/yum.repos.d/fedora-cisco-openh264.repo

# repo for nvidia builds
curl -sL --output-dir /etc/yum.repos.d --remote-name \
    https://negativo17.org/repos/fedora-nvidia.repo

# enable testing repos if not enabled on testing stream
if [[ "testing" == "${COREOS_VERSION}" ]]; then
for REPO in $(ls /etc/yum.repos.d/fedora-updates-testing{,-modular}.repo); do
  if [[ "$(grep enabled=1 ${REPO} > /dev/null; echo $?)" == "1" ]]; then
    echo "enabling $REPO" && \
    sed -i '0,/enabled=0/{s/enabled=0/enabled=1/}' ${REPO};
  fi;
done;
fi


# enable RPMs with alternatives to create them in this image build
mkdir -p /var/lib/alternatives

find /tmp/
rpm-ostree install \
    fedora-repos-archive


### PREPARE BUILD ENV
# stuff for akmods
rpm-ostree install \
    akmods \
    dnf \
    mock

# stuff for dkms
rpm-ostree install \
    autoconf \
    automake \
    dkms \
    git \
    libtool \
    ncompress

if [[ ! -s "/tmp/certs/private_key.priv" ]]; then
    echo "WARNING: Using test signing key. Run './generate-akmods-key' for production builds."
    cp /tmp/certs/private_key.priv{.test,}
    cp /tmp/certs/public_key.der{.test,}
fi

install -Dm644 /tmp/certs/public_key.der   /etc/pki/akmods/certs/public_key.der
install -Dm644 /tmp/certs/private_key.priv /etc/pki/akmods/private/private_key.priv

# protect against incorrect permissions in tmp dirs which can break akmods builds
chmod 1777 /tmp /var/tmp

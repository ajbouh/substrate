# ARG SOURCE_IMAGE="${SOURCE_IMAGE:-fedora-coreos}"
# ARG BASE_IMAGE="quay.io/fedora/${SOURCE_IMAGE}"
# ARG COREOS_VERSION="${COREOS_VERSION:-stable}"

# FROM ${BASE_IMAGE}:${COREOS_VERSION} AS builder
# ARG COREOS_VERSION="${COREOS_VERSION:-stable}"

# COPY build*.sh /tmp
# COPY certs /tmp/certs

# RUN /tmp/build-prep.sh

# RUN /tmp/build-kmod-nvidia.sh /
# RUN find /var/cache/akmods/nvidia/

FROM scratch

# COPY --from=builder /var/cache/akmods/nvidia/ /
# COPY --from=builder /nvidia-vars /

COPY --from=ghcr.io/ublue-os/ucore-kmods:stable-20231201 /rpms/kmods/nvidia/*.rpm /

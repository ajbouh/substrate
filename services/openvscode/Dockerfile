# Based on https://github.com/gitpod-io/openvscode-releases/tree/dea59eb70f4a9b9be5bbf4de0a2c1a0bd1afbed3

FROM quay.io/fedora/fedora:39

RUN dnf install -y \
    git-core \
    libatomic1 \
    wget \
    podman \
    fuse \
    fuse-libs \
    openssh \
  && dnf clean all \
  && rm -rf /var/cache/yum

WORKDIR /home/

ARG RELEASE_TAG
ARG RELEASE_ORG="gitpod-io"
ARG OPENVSCODE_SERVER_ROOT="/home/.openvscode-server"

# Downloading the latest VSC Server release and extracting the release archive
# Rename `openvscode-server` cli tool to `code` for convenience
RUN if [ -z "${RELEASE_TAG}" ]; then \
        echo "The RELEASE_TAG build arg must be set." >&2 && \
        exit 1; \
    fi && \
    arch=$(uname -m) && \
    if [ "${arch}" = "x86_64" ]; then \
        arch="x64"; \
    elif [ "${arch}" = "aarch64" ]; then \
        arch="arm64"; \
    elif [ "${arch}" = "armv7l" ]; then \
        arch="armhf"; \
    fi && \
    wget https://github.com/${RELEASE_ORG}/openvscode-server/releases/download/${RELEASE_TAG}/${RELEASE_TAG}-linux-${arch}.tar.gz && \
    tar -xzf ${RELEASE_TAG}-linux-${arch}.tar.gz && \
    mv -f ${RELEASE_TAG}-linux-${arch} ${OPENVSCODE_SERVER_ROOT} && \
    cp ${OPENVSCODE_SERVER_ROOT}/bin/remote-cli/openvscode-server ${OPENVSCODE_SERVER_ROOT}/bin/remote-cli/code && \
    rm -f ${RELEASE_TAG}-linux-${arch}.tar.gz

ARG USERNAME=openvscode-server
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Creating the user and usergroup
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USERNAME -m -s /bin/bash $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

RUN chmod g+rw /home && \
    mkdir -p /home/workspace && \
    chown -R $USERNAME:$USERNAME /home/workspace && \
    chown -R $USERNAME:$USERNAME ${OPENVSCODE_SERVER_ROOT}

USER $USERNAME

WORKDIR /home/workspace/

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    HOME=/home/workspace \
    EDITOR=code \
    VISUAL=code \
    GIT_EDITOR="code --wait" \
    OPENVSCODE_SERVER_ROOT=${OPENVSCODE_SERVER_ROOT}

# Default exposed port if none is specified
EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c", "exec ${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server --host 0.0.0.0 --without-connection-token \"${@}\"", "--" ]

# See also:
# - https://github.com/gitpod-io/openvscode-server
# - https://github.com/gitpod-io/openvscode-releases/

# USER root # to get permissions to install packages and such
# RUN # the installation process for software needed
# USER openvscode-server # to restore permissions for the web interface

# ENV OPENVSCODE_SERVER_ROOT="/home/.openvscode-server"
# ENV OPENVSCODE="${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server"

# SHELL ["/bin/bash", "-c"]
# RUN \
#     # Direct download links to external .vsix not available on https://open-vsx.org/
#     # The two links here are just used as example, they are actually available on https://open-vsx.org/
#     urls=(\
#         https://github.com/rust-lang/rust-analyzer/releases/download/2022-12-26/rust-analyzer-linux-x64.vsix \
#         https://github.com/VSCodeVim/Vim/releases/download/v1.24.3/vim-1.24.3.vsix \
#     )\
#     # Create a tmp dir for downloading
#     && tdir=/tmp/exts && mkdir -p "${tdir}" && cd "${tdir}" \
#     # Download via wget from $urls array.
#     && wget "${urls[@]}" && \
#     # List the extensions in this array
#     exts=(\
#         # From https://open-vsx.org/ registry directly
#         gitpod.gitpod-theme \
#         # From filesystem, .vsix that we downloaded (using bash wildcard '*')
#         "${tdir}"/* \
#     )\
#     # Install the $exts
#     && for ext in "${exts[@]}"; do ${OPENVSCODE} --install-extension "${ext}"; done

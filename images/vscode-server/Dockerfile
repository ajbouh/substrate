# syntax=docker/dockerfile:experimental

# Based on https://github.com/coder/code-server/blob/d9fe46a6be2baeb056a4cfadf4046c3ed03390e9/ci/release-image/Dockerfile

ARG BASE=debian:12

FROM docker.io/library/alpine:latest AS dl

FROM dl AS dl-vscode
WORKDIR /dl/
RUN wget https://github.com/coder/code-server/releases/download/v4.20.1/code-server_4.20.1_amd64.deb
RUN wget https://github.com/coder/code-server/releases/download/v4.20.1/code-server_4.20.1_arm64.deb

FROM dl AS dl-go
WORKDIR /dl/
RUN wget https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
RUN wget https://go.dev/dl/go1.21.6.linux-arm64.tar.gz

# FROM scratch AS dl-extensions
# ADD https://marketplace.visualstudio.com/_apis/public/gallery/publishers/golang/vsextensions/Go/0.40.3/vspackage /dl/

FROM $BASE

RUN apt-get update \
  && apt-get install -y \
    curl \
    dumb-init \
    git \
    git-lfs \
    htop \
    locales \
    lsb-release \
    man-db \
    nano \
    openssh-client \
    procps \
    sudo \
    vim-tiny \
    wget \
    zsh \
    podman \
  && git lfs install \
  && rm -rf /var/lib/apt/lists/*

# https://wiki.debian.org/Locale#Manually
RUN sed -i "s/# en_US.UTF-8/en_US.UTF-8/" /etc/locale.gen \
  && locale-gen
ENV LANG=en_US.UTF-8

# RUN adduser --gecos '' --disabled-password coder \
#   && echo "coder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd

RUN ARCH="$(dpkg --print-architecture)" \
  && curl -fsSL "https://github.com/boxboat/fixuid/releases/download/v0.6.0/fixuid-0.6.0-linux-$ARCH.tar.gz" | tar -C /usr/local/bin -xzf - \
  && chown root:root /usr/local/bin/fixuid \
  && chmod 4755 /usr/local/bin/fixuid \
  && mkdir -p /etc/fixuid \
  # && printf "user: coder\ngroup: coder\n" > /etc/fixuid/config.yml
  && true

COPY images/vscode-server/entrypoint.sh /usr/bin/entrypoint.sh
RUN --mount=from=dl-vscode,src=/dl,dst=/dl dpkg -i /dl/code-server*$(dpkg --print-architecture).deb

# Add go to /usr/local/go
WORKDIR /usr/local
RUN --mount=from=dl-go,src=/dl,dst=/dl \
    tar -xvf /dl/go*$(dpkg --print-architecture).tar.gz \
    && ln -s /usr/local/go/bin/* /usr/bin/

# TODO switch to using fetched extension package and vendored tools.
RUN code-server --install-extension golang.Go \
  && export GOPATH=/var/home/core/go \
  && go install golang.org/x/tools/gopls@latest \
  && go install github.com/cweill/gotests/gotests@v1.6.0 \
  && go install github.com/fatih/gomodifytags@v1.16.0 \
  && go install github.com/josharian/impl@v1.1.0 \
  && go install github.com/haya14busa/goplay/cmd/goplay@v1.0.0 \
  && go install github.com/go-delve/delve/cmd/dlv@latest \
  && go install honnef.co/go/tools/cmd/staticcheck@latest

# TODO switch to using fetched extension package and vendored tools.
RUN code-server --install-extension cuelang.cue

# Allow users to have scripts run on container startup to prepare workspace.
# https://github.com/coder/code-server/issues/5177
ENV ENTRYPOINTD=${HOME}/entrypoint.d

EXPOSE 8080
# # This way, if someone sets $DOCKER_USER, docker-exec will still work as
# # the uid will remain the same. note: only relevant if -u isn't passed to
# # docker-run.
# USER 1000
# ENV USER=coder
WORKDIR /home/workspace
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

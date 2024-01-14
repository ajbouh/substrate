FROM docker.io/library/golang:1.21 as build

RUN --mount=type=cache,target=/root/.cache/go-build \
  --mount=type=cache,target=/go/pkg \
  CGO_ENABLED=0 GOOS=linux go install \
  -v \
  github.com/sorenisanerd/gotty@latest

FROM scratch as gotty
COPY --from=build /go/bin/gotty /

FROM ubuntu:22.04 AS dist
RUN apt update && \
  apt install -y -V --no-install-recommends \
  git \
  emacs-nox micro nano vim \
  screen tmux \
  openssh-client \
  bash zsh \
  wget curl \
  ca-certificates && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

ENV PORT 8080

COPY --from=build --chown=nonroot:nonroot /go/bin/gotty /bin/

ENTRYPOINT ["/bin/gotty", "-w", "/bin/bash"]

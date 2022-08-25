# TODO adjust this to compile *our* driver

FROM golang:1.19 as substratefsbuilder

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/services/substratefs-mount
ADD services/substratefs-mount/go.mod services/substratefs-mount/go.sum ./
RUN go mod download
COPY services/substratefs-mount/. .

RUN --mount=type=cache,target=/root/.cache/go-build \
  --mount=type=cache,target=/go/pkg \
  CGO_ENABLED=0 GOOS=linux go build \
  -v \
  -installsuffix 'static' \
  -o /bin/substratefs ./cmd

FROM golang:1.19 as juicefscebuilder

ARG GOPROXY
ARG JUICEFS_CE_VERSION

ENV GOPROXY=${GOPROXY:-"https://proxy.golang.org,direct"}
RUN apt-get update && apt-get install -y curl musl-tools tar gzip

WORKDIR /workspace
ENV JUICEFS_CE_VERSION=${JUICEFS_CE_VERSION:-"main"}
RUN curl -fsSL -o juicefs-${JUICEFS_CE_VERSION}.tar.gz \
  https://github.com/juicedata/juicefs/archive/${JUICEFS_CE_VERSION}.tar.gz \
  && mkdir juicefs \
  && tar -xf juicefs-${JUICEFS_CE_VERSION}.tar.gz --strip-components=1 -C juicefs \
  && cd juicefs && STATIC=1 make

# FROM golang:1.19 as juicefseebuilder
# RUN apt-get update && apt-get install -y curl musl-tools tar gzip
# RUN curl -fsSL -o /juicefs-ee https://s.juicefs.com/static/juicefs \
#   && chmod +x /juicefs-ee

# FROM gcr.io/distroless/static AS dist
FROM ubuntu:22.04 AS dist
RUN apt update && \
  apt install -y -V --no-install-recommends \
  fuse \
  ca-certificates && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*
USER root:root
# RUN mkdir -p /run/docker/plugins
COPY --from=substratefsbuilder /bin/substratefs /bin/
COPY --from=juicefscebuilder /workspace/juicefs/juicefs /bin/juicefs-ce
# COPY --from=juicefseebuilder /juicefs-ee /bin/
# RUN /bin/juicefs-ce version && /bin/juicefs-ee version
RUN /bin/juicefs-ce version
CMD ["/bin/substratefs"]

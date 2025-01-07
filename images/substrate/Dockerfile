# FROM cgr.dev/chainguard/go:latest-dev AS source 
# (go 1.24.5)
FROM cgr.dev/chainguard/go:latest-dev@sha256:e494d603a72a6a2f503574f8e33a809178eca31153d5752d1bf6e950211ae50a AS source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/cueloader/
COPY pkg/cueloader/go.mod pkg/cueloader/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/substrate
ADD images/substrate/go.mod images/substrate/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  GOPRIVATE=github.com/progrium/go-vscode,github.com/ajbouh/go-vscode go mod download

WORKDIR /go/src/
COPY pkg/cueloader/. github.com/ajbouh/substrate/pkg/cueloader/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/substrate/. github.com/ajbouh/substrate/images/substrate/

WORKDIR /go/src/github.com/ajbouh/substrate/images/substrate/

FROM source AS build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  GOPRIVATE=github.com/progrium/go-vscode,github.com/ajbouh/go-vscode \
  go build \
  -tags "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp"\
  -v \
  -o /substrate ./cmd

RUN touch /tmp/ready
  
FROM source AS test

FROM docker.io/tianon/toybox:latest AS toybox

FROM cgr.dev/chainguard/wolfi-base AS dist

ARG CUE_DEFS_SOURCE
ARG CUE_DEFS_TARGET

COPY --from=build /substrate /app/substrate

# Enable when we want to debug
# COPY --from=toybox /usr/bin/. /usr/bin/
COPY $CUE_DEFS_SOURCE $CUE_DEFS_TARGET
COPY --from=build /tmp/ready $CUE_DEFS_TARGET/ready

WORKDIR /data

ENTRYPOINT ["/app/substrate"]

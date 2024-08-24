
FROM docker.io/library/golang:1.22-bookworm AS golang

FROM ghcr.io/selkies-project/selkies-gstreamer/gstreamer:main-ubuntu24.04 AS source
# COPY --from=selkies-gstreamer /opt/gstreamer /opt/gstreamer

COPY --from=golang /usr/local/go /usr/local/go
COPY --from=golang /go /go
ENV PATH /usr/local/go/bin:$PATH

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/gstreamer-pipeline
ADD images/gstreamer-pipeline/go.mod images/gstreamer-pipeline/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/gstreamer-pipeline/. github.com/ajbouh/substrate/images/gstreamer-pipeline/

WORKDIR /go/src/github.com/ajbouh/substrate/images/gstreamer-pipeline/

FROM source AS build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  env PKG_CONFIG_PATH=/opt/gstreamer/lib/x86_64-linux-gnu/pkgconfig:/lib/x86_64-linux-gnu/pkgconfig \
  go build \
  -v \
  -o /app/gstreamer-pipeline ./cmd/gstreamer-pipeline

# FROM source AS test

# # Used when we want to debug
# FROM docker.io/tianon/toybox:latest AS toybox

# FROM gcr.io/distroless/base-nossl-debian12 AS dist
# COPY --from=toybox /bin/bash /bin/
# COPY --from=build /gstreamer-pipeline /app/gstreamer-pipeline
# COPY --from=build /opt/gstreamer /opt/gstreamer
COPY images/gstreamer-pipeline/run.sh /app/run.sh

ENTRYPOINT ["/app/run.sh", "/app/gstreamer-pipeline"]

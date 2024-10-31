FROM docker.io/library/golang:1.23-bookworm AS source

RUN echo "deb http://deb.debian.org/debian trixie main" >>/etc/apt/sources.list
RUN set -x && apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y libsqlite3-dev/trixie

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/events
ADD images/events/go.mod images/events/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/events/. github.com/ajbouh/substrate/images/events/

WORKDIR /go/src/github.com/ajbouh/substrate/images/events/

FROM source AS build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  go build \
  -v \
  -o /events ./cmd/events

FROM source AS test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest AS toybox

FROM gcr.io/distroless/base-nossl-debian12 AS dist

COPY --from=build /events /app/events

ENTRYPOINT ["/app/events"]

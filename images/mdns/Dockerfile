FROM docker.io/library/golang:1.22-bookworm AS source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/mdns
ADD images/mdns/go.mod images/mdns/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/mdns/. github.com/ajbouh/substrate/images/mdns/

WORKDIR /go/src/github.com/ajbouh/substrate/images/mdns/

FROM source AS build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  go build \
  -v \
  -o /substrated-mdns ./cmd/mdns

FROM source AS test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest AS toybox

FROM gcr.io/distroless/base-nossl-debian12 AS dist

COPY --from=build /substrated-mdns /app/substrated-mdns

ENTRYPOINT ["/app/substrated-mdns"]

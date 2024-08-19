FROM docker.io/library/golang:1.22-bookworm AS source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/sigar
ADD images/sigar/go.mod images/sigar/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/sigar/. github.com/ajbouh/substrate/images/sigar/

WORKDIR /go/src/github.com/ajbouh/substrate/images/sigar/

FROM source AS build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go build \
  -v \
  -o /substrated-defs-sigar ./cmd/sigar

FROM source AS test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest AS toybox

FROM gcr.io/distroless/base-nossl-debian12 AS dist

COPY --from=build /substrated-defs-sigar /app/substrated-defs-sigar

ENTRYPOINT ["/app/substrated-defs-sigar"]

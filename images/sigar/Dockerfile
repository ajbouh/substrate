FROM docker.io/library/golang:1.22-bookworm as source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/cueloader/
COPY pkg/cueloader/go.mod pkg/cueloader/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/exports/
COPY pkg/exports/go.mod pkg/exports/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/httpframework/
COPY pkg/httpframework/go.mod pkg/httpframework/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/sigar
ADD images/sigar/go.mod images/sigar/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/cueloader/. github.com/ajbouh/substrate/pkg/cueloader/
COPY pkg/exports/. github.com/ajbouh/substrate/pkg/exports/
COPY pkg/httpframework/. github.com/ajbouh/substrate/pkg/httpframework/
COPY images/sigar/. github.com/ajbouh/substrate/images/sigar/

WORKDIR /go/src/github.com/ajbouh/substrate/images/sigar/

FROM source as build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go build \
  -v \
  -o /substrated-defs-sigar ./cmd/sigar

FROM source as test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest as toybox

FROM gcr.io/distroless/base-nossl-debian12 as dist

COPY --from=build /substrated-defs-sigar /app/substrated-defs-sigar

ENTRYPOINT ["/app/substrated-defs-sigar"]

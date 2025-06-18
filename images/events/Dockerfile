# FROM cgr.dev/chainguard/go:latest-dev AS source 
# (go 1.24.5)
FROM cgr.dev/chainguard/go:latest-dev@sha256:e494d603a72a6a2f503574f8e33a809178eca31153d5752d1bf6e950211ae50a AS source

RUN apk add --no-cache sqlite-dev

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

FROM cgr.dev/chainguard/wolfi-base AS dist
# FROM cgr.dev/chainguard/static AS dist

RUN apk add --no-cache \
  sqlite-libs \
  glibc

COPY --from=build /events /app/events

ENTRYPOINT ["/app/events"]

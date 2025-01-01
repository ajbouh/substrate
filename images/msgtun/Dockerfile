# FROM node:20-alpine AS duplex-build

# WORKDIR /src/
# COPY pkg/duplex ./
# RUN yarn add esbuild
# RUN yarn

FROM docker.io/library/golang:1.23-bookworm AS source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/duplex/
COPY pkg/duplex/go.mod pkg/duplex/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download
  
WORKDIR /go/src/github.com/ajbouh/substrate/images/msgtun
ADD images/msgtun/go.mod images/msgtun/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/duplex/. github.com/ajbouh/substrate/pkg/duplex/
COPY images/msgtun/. github.com/ajbouh/substrate/images/msgtun/

WORKDIR /go/src/github.com/ajbouh/substrate/images/msgtun/

FROM source AS build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  go build \
  -v \
  -o /substrate-msgtun ./cmd

FROM source AS test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest AS toybox

FROM gcr.io/distroless/base-nossl-debian12 AS dist

# So we can live edit
COPY pkg/duplex/. /go/src/github.com/ajbouh/substrate/pkg/duplex/
COPY --from=build /substrate-msgtun /app/substrate-msgtun

ENTRYPOINT ["/app/substrate-msgtun"]

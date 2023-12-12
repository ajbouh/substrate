FROM docker.io/library/golang:1.21 as build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/services/substrate
ADD services/substrate/go.mod services/substrate/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/services/substrate
COPY services/substrate/. .

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
# RUN --mount=type=cache,target=/go/pkg/mod \
#   --mount=type=cache,target=/root/.cache/go-build \
RUN go build \
  -v \
  -o /app .

# WORKDIR /data
# ENTRYPOINT ["/app"]

FROM gcr.io/distroless/base-nossl-debian12 as dist

ARG LENSES_EXPR_SOURCE
ARG LENSES_EXPR_TARGET
# USER root:root
# ENV PORT 8080

# WORKDIR /app
COPY --from=build /app /app/app
COPY $LENSES_EXPR_SOURCE $LENSES_EXPR_TARGET

WORKDIR /data
ENTRYPOINT ["/app/app"]

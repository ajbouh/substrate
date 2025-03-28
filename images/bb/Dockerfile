FROM docker.io/library/golang:1.22 AS source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/cueloader/
COPY pkg/cueloader/go.mod pkg/cueloader/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/bb/
COPY images/bb/go.mod images/bb/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/cueloader/. github.com/ajbouh/substrate/pkg/cueloader/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/bb/. github.com/ajbouh/substrate/images/bb/

WORKDIR /go/src/github.com/ajbouh/substrate/images/bb/

FROM source AS test

FROM source AS build
RUN --mount=type=cache,target=/go/pkg/mod \
  CGO_ENABLED=0 go build \
  -o /bb ./cmd/bb


FROM gcr.io/distroless/static-debian12 AS dist
WORKDIR /app
COPY --from=build /bb ./bb
CMD ["/app/bb"]

FROM docker.io/library/golang:1.22 AS build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/files/
COPY images/files/go.mod images/files/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/files/. github.com/ajbouh/substrate/images/files/

WORKDIR /go/src/github.com/ajbouh/substrate/images/files

RUN CGO_ENABLED=0 GOOS=linux go build \
  -v \
  -ldflags "-X main.version=1.6.1" \
  -installsuffix 'static' \
  -o /app .

FROM gcr.io/distroless/static AS dist

# USER nonroot:nonroot
ENV PORT 8080

COPY --from=build --chown=nonroot:nonroot /app /app
WORKDIR /data

ENTRYPOINT ["/app"]

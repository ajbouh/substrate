FROM docker.io/library/golang:1.21 as build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/images/screenshot
ADD images/screenshot/go.mod images/screenshot/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY images/screenshot/. .

RUN CGO_ENABLED=0 GOOS=linux go build \
  -v \
  -installsuffix 'static' \
  -o /app ./

# FROM gcr.io/distroless/static AS dist
FROM chromedp/headless-shell AS dist

# USER nonroot:nonroot
ENV PORT 8080

COPY --from=build --chown=nonroot:nonroot /app /app
WORKDIR /data

ENTRYPOINT ["/app"]

FROM golang:1.19 as build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/lenses/screenshot
ADD lenses/screenshot/go.mod lenses/screenshot/go.sum ./
RUN go mod download
COPY lenses/screenshot/. .

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

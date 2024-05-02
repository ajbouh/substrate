FROM docker.io/library/golang:1.22 as build

WORKDIR /go/src/github.com/ajbouh/substrate/images/files
COPY images/files/. .

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

FROM docker.io/library/golang:1.22 AS go-build
WORKDIR /caddy
COPY images/caddy/. .
RUN  --mount=type=cache,target=/go/pkg/mod \
  go build

FROM scratch AS caddy
COPY --from=go-build /caddy/caddy /

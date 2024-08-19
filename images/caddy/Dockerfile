FROM docker.io/library/golang:1.22 AS go-build
WORKDIR /caddy
COPY images/caddy/. .
RUN go build

FROM scratch AS caddy
COPY --from=go-build /caddy/caddy /

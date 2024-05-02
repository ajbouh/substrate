FROM docker.io/library/golang:1.22 as go-build
WORKDIR /caddy
COPY images/caddy/. .
RUN go build

FROM scratch as caddy
COPY --from=go-build /caddy/caddy /

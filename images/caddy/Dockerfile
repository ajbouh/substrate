FROM golang:1.21 as go-build
WORKDIR /caddy
COPY . .
RUN go build

FROM scratch as caddy
COPY --from=go-build /caddy/caddy /

FROM golang:1.19 as gobuild

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/services/substrate
ADD services/substrate/go.mod services/substrate/go.sum ./
RUN go mod download
COPY services/substrate/. .

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  GOOS=linux go build \
  -v \
  --ldflags '-linkmode external -extldflags "-static"' \
  -installsuffix 'static' \
  -o /app ./cmd

FROM rust:1.70.0-buster as planebuild

ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH}

WORKDIR /work

COPY services/plane .

RUN cargo build --bin=plane-drone --release 
RUN cargo build --bin=plane-controller --release 


FROM gcr.io/distroless/cc-debian11 as ccbuild

FROM alpine:latest as tailscale
WORKDIR /app
ENV TSFILE=tailscale_1.34.1_amd64.tgz
RUN wget https://pkgs.tailscale.com/stable/${TSFILE} && \
  tar xzf ${TSFILE} --strip-components=1

# https://github.com/istio/istio/blob/master/pilot/docker/Dockerfile.proxyv2#L10
# This image is a custom built debian11 distroless image with multiarchitecture support.
# It is built on the base distroless image, with iptables binary and libraries added
# The source can be found at https://github.com/istio/distroless/tree/iptables
# This version is from commit a8b3fb577adb785211ce704fdf892983fc268b11.
FROM gcr.io/istio-release/iptables@sha256:dda02a0b385785d3042d075889a56fcf0ab00f201be0a4a725563fbfcff9938a as distroless

USER root:root
ENV PORT 8080

COPY --from=tailscale /app/tailscaled /app/tailscale /app/
COPY --from=gobuild /app /app/app

COPY --from=planebuild \
  /work/target/release/plane-drone \
  /work/target/release/plane-controller \
  /bin/

COPY --from=ccbuild \
  /usr/lib/x86_64-linux-gnu/libgomp.so.1 \
  /usr/lib/x86_64-linux-gnu/libgomp.so.1.0.0 \
  /usr/lib/x86_64-linux-gnu/libstdc++.so.6 \
  /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28 \
  /usr/lib/x86_64-linux-gnu/
COPY --from=ccbuild \
  /lib/x86_64-linux-gnu/libgcc_s.so.1 \
  /lib/x86_64-linux-gnu/
COPY --from=ccbuild \
  /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1 \
  /usr/lib/x86_64-linux-gnu/libssl.so.1.1 \
  /usr/lib/x86_64-linux-gnu/
COPY --from=ccbuild \
  /usr/lib/ssl \
  /usr/lib/ssl

WORKDIR /data

ENTRYPOINT ["/app/app"]

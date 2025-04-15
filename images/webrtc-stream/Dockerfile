FROM docker.io/library/golang:1.22.2 AS builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  pkg-config \
  libopus-dev \
  libopusfile-dev \
  libasound2-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/webrtc-stream/
COPY images/webrtc-stream/go.mod images/webrtc-stream/go.sum ./
RUN --mount=type=cache,target=/go/pkg \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/webrtc-stream/. github.com/ajbouh/substrate/images/webrtc-stream/

WORKDIR /go/src/github.com/ajbouh/substrate/images/webrtc-stream/
RUN --mount=type=cache,target=/go/pkg/mod \
  go build \
  -o /webrtc-stream ./cmd/webrtc-stream \
  && ldd /webrtc-stream \
  && true

FROM gcr.io/distroless/static-debian12 AS dist
WORKDIR /app
COPY --from=builder /lib64/ld-linux-x86-64.so.2 /lib64/
COPY --from=builder /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libopus.so.0 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libopusfile.so.0 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libasound.so.2 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libogg.so.0 /lib/x86_64-linux-gnu/
COPY --from=builder /webrtc-stream ./webrtc-stream

CMD ["/app/webrtc-stream"]

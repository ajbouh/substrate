FROM docker.io/library/golang:1.22.2 as builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  pkg-config \
  libopus-dev \
  libopusfile-dev \
  libasound2-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/commands/
COPY pkg/commands/go.mod pkg/commands/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/bridge2/
COPY images/bridge2/go.mod images/bridge2/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/commands/. github.com/ajbouh/substrate/pkg/commands/
COPY images/bridge2/. github.com/ajbouh/substrate/images/bridge2/

WORKDIR /go/src/github.com/ajbouh/substrate/images/bridge2/
RUN go build \
  -o /bridge2 ./cmd/bridge \
  && ldd /bridge2 \
  && true

FROM gcr.io/distroless/static-debian12 as dist
WORKDIR /app
COPY --from=builder /lib64/ld-linux-x86-64.so.2 /lib64/
COPY --from=builder /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libopus.so.0 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libopusfile.so.0 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libasound.so.2 /lib/x86_64-linux-gnu/
COPY --from=builder /lib/x86_64-linux-gnu/libogg.so.0 /lib/x86_64-linux-gnu/
COPY --from=builder /bridge2 ./bridge2

CMD ["/app/bridge2"]

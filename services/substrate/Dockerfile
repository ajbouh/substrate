FROM docker.io/library/golang:1.21 as build

RUN apt update \
  && apt install -y --no-install-recommends \
    libbtrfs-dev \
    libgpgme-dev \
    libdevmapper-dev \
    libassuan-dev \
    libgpg-error-dev \
    libpcre2-dev \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
	&& rm -rf /var/lib/apt/lists/*;

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/services/substrate
ADD services/substrate/go.mod services/substrate/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/services/substrate
COPY services/substrate/. .

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
# RUN --mount=type=cache,target=/go/pkg/mod \
#   --mount=type=cache,target=/root/.cache/go-build \
RUN go build \
  -v \
  -o /substrate .

# RUN ldd /substrate; false

# WORKDIR /data
# ENTRYPOINT ["/app"]

FROM gcr.io/distroless/base-nossl-debian12 as dist

ARG LENSES_EXPR_SOURCE
ARG LENSES_EXPR_TARGET
# USER root:root
# ENV PORT 8080

# WORKDIR /app
COPY --from=build /substrate /app/substrate
COPY --from=build \
  /lib/x86_64-linux-gnu/libgpgme.so.11 \
  /lib/x86_64-linux-gnu/libdevmapper.so.1.02.1 \
  /lib/x86_64-linux-gnu/libassuan.so.0 \
  /lib/x86_64-linux-gnu/libgpg-error.so.0 \
  /lib/x86_64-linux-gnu/libselinux.so.1 \
  /lib/x86_64-linux-gnu/libudev.so.1 \
  /lib/x86_64-linux-gnu/libpcre2-8.so.0 \
  /lib/x86_64-linux-gnu/
COPY $LENSES_EXPR_SOURCE $LENSES_EXPR_TARGET
ENV LD_LIBRARY_PATH=/lib/x86_64-linux-gnu/
WORKDIR /data
ENTRYPOINT ["/app/substrate"]

FROM docker.io/library/golang:1.21-bookworm as source

RUN apt update \
  && apt install -y --no-install-recommends \
    dash \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
	&& rm -rf /var/lib/apt/lists/*;

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/substrate
ADD images/substrate/go.mod images/substrate/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/images/substrate
COPY images/substrate/*.go .

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
# RUN --mount=type=cache,target=/go/pkg/mod \
#   --mount=type=cache,target=/root/.cache/go-build \
FROM source as build
RUN go build \
  -tags "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp"\
  -v \
  -o /substrate .

FROM source as test
RUN go test \
  -tags "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp"\
  github.com/ajbouh/substrate/pkg/... github.com/ajbouh/substrate/images/substrate/...

# Used when we want to debug
FROM docker.io/tianon/toybox:latest as toybox

FROM gcr.io/distroless/base-nossl-debian12 as dist

ARG LENSES_EXPR_SOURCE
ARG LENSES_EXPR_TARGET
# USER root:root
# ENV PORT 8080

COPY --from=build /substrate /app/substrate
# Enable when we want to debug
# COPY --from=toybox /usr/bin/. /usr/bin/
COPY $LENSES_EXPR_SOURCE $LENSES_EXPR_TARGET
WORKDIR /data

# HACK use run-with-ldcache-hack.sh to run ldconfig before substrate starts. delete this when
# we can figure out how to get the nvidia-container-toolkit logic to do it properly for this container
# HACK this is needed because both this script and nvidia-container-toolkit rely on it
COPY --from=build /sbin/ldconfig /sbin/ldconfig
COPY --from=build /bin/dash /bin/sh
COPY images/substrate/run-with-ldcache-hack.sh /app
ENTRYPOINT ["/app/run-with-ldcache-hack.sh", "/app/substrate"]

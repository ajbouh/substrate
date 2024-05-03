FROM docker.io/library/golang:1.22-bookworm as source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/nvml
ADD images/nvml/go.mod images/nvml/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/nvml/. github.com/ajbouh/substrate/images/nvml/

WORKDIR /go/src/github.com/ajbouh/substrate/images/nvml/

FROM source as build
RUN apt update \
  && apt install -y --no-install-recommends \
    dash \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
	&& rm -rf /var/lib/apt/lists/*;

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go build \
  -tags "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp"\
  -v \
  -o /substrated-defs-nvml ./cmd/nvml

FROM source as test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest as toybox

FROM gcr.io/distroless/base-nossl-debian12 as dist

# HACK use run-with-ldcache-hack.sh to run ldconfig before substrate starts. delete this when
# we can figure out how to get the nvidia-container-toolkit logic to do it properly for this container
# HACK this is needed because both this script and nvidia-container-toolkit rely on it
COPY --from=build /sbin/ldconfig /sbin/ldconfig
COPY --from=build /bin/dash /bin/sh
COPY images/nvml/run-with-ldcache-hack.sh /app/
COPY --from=build /substrated-defs-nvml /app/substrated-defs-nvml
ENTRYPOINT ["/app/run-with-ldcache-hack.sh", "/app/substrated-defs-nvml"]

FROM fedora as fedora-build

RUN mkdir /scratchroot \
  && mkdir -p /scratchroot/tmp \
  && dnf install \
    -y \
    --installroot /scratchroot \
    --releasever 40 \
    glibc-minimal-langpack \
    ca-certificates \
    tzdata \
    systemd \
    --nodocs \
    --setopt install_weak_deps=False \
  && dnf clean all -y --installroot /scratchroot --releasever 40

FROM docker.io/library/golang:1.22-bookworm as source

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/sys
ADD images/sys/go.mod images/sys/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/sys/. github.com/ajbouh/substrate/images/sys/

WORKDIR /go/src/github.com/ajbouh/substrate/images/sys/

FROM source as build

# With the trick below, Go's build cache is kept between builds.
# https://github.com/golang/go/issues/27719#issuecomment-514747274
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go build \
  -v \
  -o /substrated-defs-sys ./cmd/sys

FROM source as test

# Used when we want to debug
FROM docker.io/tianon/toybox:latest as toybox

FROM scratch as dist
COPY --from=fedora-build /scratchroot /
COPY --from=build /substrated-defs-sys /app/substrated-defs-sys

ENTRYPOINT ["/app/substrated-defs-sys"]

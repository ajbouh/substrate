FROM docker.io/library/golang:1.22-bookworm AS source

RUN apt update && \
  apt install -y -V --no-install-recommends \
  git-lfs && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/spaceview/
COPY images/spaceview/go.mod images/spaceview/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  GOPRIVATE=github.com/*/go-vscode go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/spaceview/. github.com/ajbouh/substrate/images/spaceview/

WORKDIR /go/src/github.com/ajbouh/substrate/images/spaceview

FROM source AS build

RUN --mount=type=cache,target=/go/pkg/mod \
  GOPRIVATE=github.com/*/go-vscode \
  CGO_ENABLED=0 GOOS=linux go build \
  -tags "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp"\
  -v \
  -installsuffix 'static' \
  -o /spaceview ./cmd/spaceview

FROM gcr.io/distroless/static AS dist

# USER nonroot:nonroot
ENV PORT 8080

COPY --from=build /spaceview /spaceview
WORKDIR /data

ENTRYPOINT ["/spaceview"]

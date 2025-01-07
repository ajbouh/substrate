FROM node:20-alpine AS vscode-web-source
ARG VERSION=1.92.1
RUN apk add -u krb5-dev libx11-dev libxkbfile-dev libsecret-dev git build-base python3 zip
RUN git clone --depth 1 https://github.com/microsoft/vscode.git -b ${VERSION}
WORKDIR /vscode

# FROM vscode-web-source AS vscode-web-build-unpatched
# RUN yarn
# RUN yarn gulp vscode-web-min

# # Rename node_modules under output to modules.
# # Some CDNs and hosts strip node_modules.
# RUN mv /vscode-web/node_modules /vscode-web/modules

# FROM scratch AS vscode-web-dist-unpatched
# COPY --from=vscode-web-build-unpatched /vscode-web/. /
# COPY pkg/go-vscode/assets/vscode-web/index.html ./dist/

FROM vscode-web-source AS vscode-web-build

# Apply our patched files
COPY pkg/go-vscode/assets/vscode-web/patched/extensionHostWorker.ts ./src/vs/workbench/api/worker/extensionHostWorker.ts
COPY pkg/go-vscode/assets/vscode-web/patched/webWorkerExtensionHostIframe.html ./src/vs/workbench/services/extensions/worker/webWorkerExtensionHostIframe.html
RUN yarn
RUN yarn gulp vscode-web-min

# Rename node_modules under output to modules.
# Some CDNs and hosts strip node_modules.
RUN mv /vscode-web/node_modules /vscode-web/modules
COPY pkg/go-vscode/assets/vscode-web/patched/index.html ./vscode-web/
COPY pkg/go-vscode/assets/vscode-web/patched/workbench.json ./vscode-web/
RUN zip -r /vscode-web.zip /vscode-web

FROM node:20-alpine AS vscode-web-fetch
ARG VSCODE_ARTIFACT_URL=https://github.com/progrium/vscode-web/releases/download/v1/vscode-web-1.92.1-patched.zip
RUN apk add -u curl
RUN curl -qLo /vscode-web.zip ${VSCODE_ARTIFACT_URL}

# FROM cgr.dev/chainguard/go:latest-dev AS source 
# (go 1.24.5)
FROM cgr.dev/chainguard/go:latest-dev@sha256:e494d603a72a6a2f503574f8e33a809178eca31153d5752d1bf6e950211ae50a AS source
RUN apk add --no-cache git-lfs

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/go-vscode/
COPY pkg/go-vscode/go.mod pkg/go-vscode/go.sum ./
COPY --from=vscode-web-fetch /vscode-web.zip ./assets/
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/spaceview/
COPY images/spaceview/go.mod images/spaceview/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/go-vscode/. github.com/ajbouh/substrate/pkg/go-vscode/
COPY images/spaceview/. github.com/ajbouh/substrate/images/spaceview/

WORKDIR /go/src/github.com/ajbouh/substrate/images/spaceview

FROM source AS build

RUN --mount=type=cache,target=/go/pkg/mod \
  CGO_ENABLED=0 GOOS=linux go build \
  -tags "remote exclude_graphdriver_btrfs btrfs_noversion exclude_graphdriver_devicemapper containers_image_openpgp"\
  -v \
  -installsuffix 'static' \
  -o /spaceview ./cmd/spaceview

FROM cgr.dev/chainguard/static AS dist

# USER nonroot:nonroot
ENV PORT 8080

COPY pkg/go-vscode/extension/. /go/src/github.com/ajbouh/substrate/pkg/go-vscode/extension/
COPY --from=build /spaceview /spaceview
WORKDIR /data

ENTRYPOINT ["/spaceview"]

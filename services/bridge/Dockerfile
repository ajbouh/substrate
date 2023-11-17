FROM alpine:latest as node
ENV NODE_VERSION 18.13.0
RUN addgroup -g 1000 node \
  && adduser -u 1000 -G node -s /bin/sh -D node \
  && apk add --no-cache \
  libstdc++ \
  && apk add --no-cache --virtual .build-deps \
  curl \
  && ARCH= && alpineArch="$(apk --print-arch)" \
  && case "${alpineArch##*-}" in \
  x86_64) \
  ARCH='x64' \
  CHECKSUM="96973d2cf66fd5c1b0a02b9eeaa248b8e8a29e93cfc79d73fb99c396ec41eac7" \
  ;; \
  *) ;; \
  esac \
  && if [ -n "${CHECKSUM}" ]; then \
  set -eu; \
  curl -fsSLO --compressed "https://unofficial-builds.nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz"; \
  echo "$CHECKSUM  node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs; \
  else \
  echo "Building from source" \
  # backup build
  && apk add --no-cache --virtual .build-deps-full \
  binutils-gold \
  g++ \
  gcc \
  gnupg \
  libgcc \
  linux-headers \
  make \
  python3 \
  # gpg keys listed at https://github.com/nodejs/node#release-keys
  && for key in \
  4ED778F539E3634C779C87C6D7062848A1AB005C \
  141F07595B7B3FFE74309A937405533BE57C7D57 \
  74F12602B6F1C4E913FAA37AD3A89613643B6201 \
  61FC681DFB92A079F1685E77973F295594EC4689 \
  8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
  C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  890C08DB8579162FEE0DF9DB8BEAB4DFCF555EF4 \
  C82FA3AE1CBEDC6BE46B9360C43CEC45C17AB93C \
  108F52B48DB57BB0CC439B2997B01419BD92F80A \
  ; do \
  gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "$key" || \
  gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "$key" ; \
  done \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.xz" \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xf "node-v$NODE_VERSION.tar.xz" \
  && cd "node-v$NODE_VERSION" \
  && ./configure \
  && make -j$(getconf _NPROCESSORS_ONLN) V= \
  && make install \
  && apk del .build-deps-full \
  && cd .. \
  && rm -Rf "node-v$NODE_VERSION" \
  && rm "node-v$NODE_VERSION.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt; \
  fi \
  && rm -f "node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" \
  && apk del .build-deps \
  # smoke tests
  && node --version \
  && npm --version


FROM node as uideps
WORKDIR /app
# COPY services/bridge/ui/patches ./patches
COPY services/bridge/ui/package.json services/bridge/ui/package-lock.json ./
RUN npm i


FROM uideps as uibuild
COPY services/bridge/ui/src ./src
COPY services/bridge/ui/static ./static
COPY services/bridge/ui/*.sh services/bridge/ui/*.js services/bridge/ui/*.json services/bridge/ui/*.cjs services/bridge/ui/.npmrc ./
RUN npm run build

FROM docker.io/library/golang:1.21 as builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    pkg-config \
    libopus-dev \
    libopusfile-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/services/bridge
COPY services/bridge/go.mod services/bridge/go.sum .
COPY services/bridge/thirdparty thirdparty
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/services/bridge
COPY services/bridge/pkg pkg
COPY services/bridge/cmd cmd
RUN go build \
  -ldflags "-linkmode external -extldflags '-static -lopus -logg -lm'" \
  -o /main ./cmd


FROM gcr.io/distroless/static-debian11 as dist
WORKDIR /app
COPY --from=builder /main ./main
COPY ./services/bridge/cmd/config.toml ./config.toml
COPY --from=uibuild /app/build ./ui/.
EXPOSE 8088
CMD ["/app/main"]

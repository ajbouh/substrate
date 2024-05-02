FROM docker.io/node:18.19.0-alpine3.18 as uideps
WORKDIR /app
# COPY images/bridge/ui/patches ./patches
COPY images/bridge/ui/package.json images/bridge/ui/package-lock.json ./
RUN npm i


FROM uideps as uibuild
COPY images/bridge/ui/src ./src
COPY images/bridge/ui/static ./static
COPY images/bridge/ui/*.sh images/bridge/ui/*.js images/bridge/ui/*.json images/bridge/ui/*.cjs images/bridge/ui/.npmrc ./
RUN npm run build


FROM docker.io/library/golang:1.22 as builder
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    pkg-config \
    libopus-dev \
    libopusfile-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /go/src/github.com/ajbouh/substrate/images/bridge
COPY images/bridge/go.mod images/bridge/go.sum .
COPY images/bridge/thirdparty thirdparty
RUN go mod download

COPY images/bridge/pkg pkg
COPY images/bridge/cmd cmd
RUN go build \
  -ldflags "-linkmode external -extldflags '-static -lopus -logg -lm'" \
  -o /bridge ./cmd


FROM gcr.io/distroless/static-debian12 as dist
WORKDIR /app
COPY --from=builder /bridge ./bridge
COPY ./images/bridge/cmd/config.toml ./config.toml
COPY --from=uibuild /app/build ./ui/.
CMD ["/app/bridge"]

FROM docker.io/node:18.19.0-alpine3.18 as uideps
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


FROM gcr.io/distroless/static-debian12 as dist
WORKDIR /app
COPY --from=builder /main ./main
COPY ./services/bridge/cmd/config.toml ./config.toml
COPY --from=uibuild /app/build ./ui/.
EXPOSE 8088
CMD ["/app/main"]

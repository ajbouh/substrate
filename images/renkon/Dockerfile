FROM docker.io/node:20.11-bookworm-slim AS npm-base

FROM npm-base AS npm-deps
WORKDIR /app
COPY images/renkon/package.json images/renkon/package-lock.json ./
RUN npm install

FROM npm-deps AS npm-build
COPY images/renkon/. .
RUN npm run build-lib

FROM docker.io/library/golang:1.22 AS go-build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/renkon/
COPY images/renkon/go.mod images/renkon/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
  go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/renkon/. github.com/ajbouh/substrate/images/renkon/

WORKDIR /go/src/github.com/ajbouh/substrate/images/renkon

COPY --from=npm-build /app/dist/renkon.js ./dist/

RUN --mount=type=cache,target=/go/pkg/mod \
  CGO_ENABLED=0 GOOS=linux go build \
  -v \
  -installsuffix 'static' \
  -o /app/renkon .

  FROM gcr.io/distroless/static AS dist

COPY --from=go-build /app/renkon /app/renkon

ENTRYPOINT ["/app/renkon"]

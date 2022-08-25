FROM golang:1.19 as build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg
ADD pkg/go.mod pkg/go.sum ./
RUN go mod download
COPY pkg/. .

WORKDIR /go/src/github.com/ajbouh/substrate/lenses/git-export
ADD lenses/git-export/go.mod lenses/git-export/go.sum ./
RUN go mod download
COPY lenses/git-export/. .

RUN --mount=type=cache,target=/root/.cache/go-build \
  --mount=type=cache,target=/go/pkg \
  CGO_ENABLED=0 GOOS=linux go build \
  -v \
  -installsuffix 'static' \
  -o /app/main ./

FROM ubuntu:22.04 AS dist
RUN apt update && \
  apt install -y -V --no-install-recommends \
  git \
  openssh-client \
  bash \
  ca-certificates && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

ENV PORT 8080

COPY --from=build --chown=nonroot:nonroot /app/main /app/main
COPY lenses/git-export/run.sh /app/

ENTRYPOINT ["/app/main"]

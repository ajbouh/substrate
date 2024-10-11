FROM docker.io/library/golang:1.22 AS go-build
ARG TXTAR_VERSION
RUN  --mount=type=cache,target=/go/pkg/mod \
go install golang.org/x/exp/cmd/txtar@${TXTAR_VERSION}

FROM scratch AS txtar
ARG TXTAR_BASENAME
COPY --from=go-build /go/bin/txtar /${TXTAR_BASENAME}

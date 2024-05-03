FROM docker.io/library/golang:1.22.2 as build

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/tool-call/
COPY images/tool-call/go.mod images/tool-call/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/tool-call/. github.com/ajbouh/substrate/images/tool-call/

WORKDIR /go/src/github.com/ajbouh/substrate/images/tool-call

RUN CGO_ENABLED=0 GOOS=linux go build \
  -v \
  -o /app .

FROM gcr.io/distroless/static AS dist

# USER nonroot:nonroot
ENV PORT 8080

COPY --from=build --chown=nonroot:nonroot /app /app
WORKDIR /data

ENTRYPOINT ["/app"]

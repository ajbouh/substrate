FROM docker.io/library/node:16 AS js-build
WORKDIR /gotty
COPY images/gotty/js/. /gotty/js
COPY images/gotty/Makefile /gotty/
RUN make bindata/static/js/gotty.js.map

FROM docker.io/library/golang:1.20 AS go-build
WORKDIR /gotty
COPY images/gotty/. /gotty
COPY --from=js-build /gotty/js/node_modules /gotty/js/node_modules
COPY --from=js-build /gotty/bindata/static/js /gotty/bindata/static/js
RUN touch /gotty/bindata/static/js/* && CGO_ENABLED=0 make

FROM scratch AS gotty
COPY --from=go-build /gotty/gotty /

FROM alpine:latest AS dist-alpine
RUN apk update && \
    apk upgrade && \
    apk --no-cache add ca-certificates bash
WORKDIR /root
COPY --from=go-build /gotty/gotty /usr/bin/
CMD ["gotty",  "-w", "bash"]

FROM ubuntu:22.04 AS dist-ubuntu
RUN apt update && \
  apt install -y -V --no-install-recommends \
  git \
  emacs-nox micro nano vim \
  screen tmux \
  openssh-client \
  bash zsh \
  wget curl \
  ca-certificates && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*
ENV PORT 8080
COPY --from=go-build --chown=nonroot:nonroot /gotty/gotty /bin/
ENTRYPOINT ["/bin/gotty", "-w", "/bin/bash"]

FROM docker.io/library/golang:1.22-bookworm as dinit-builder
RUN go install gitlab.com/tozd/dinit/cmd/dinit@latest

FROM docker.io/library/golang:1.22-bookworm as builder

WORKDIR /go/src/github.com/ajbouh/substrate/pkg/toolkit/
COPY pkg/toolkit/go.mod pkg/toolkit/go.sum ./
RUN go mod download

WORKDIR /go/src/github.com/ajbouh/substrate/images/chromestage/
COPY images/chromestage/go.mod images/chromestage/go.sum ./
RUN go mod download

WORKDIR /go/src/
COPY pkg/toolkit/. github.com/ajbouh/substrate/pkg/toolkit/
COPY images/chromestage/. github.com/ajbouh/substrate/images/chromestage/

WORKDIR /go/src/github.com/ajbouh/substrate/images/chromestage/

RUN CGO_ENABLED=0 go build -o /chromestage ./cmd/chromestage

#########

FROM docker.io/library/debian:bookworm
ENV LANG="C.UTF-8"

# install utilities
RUN apt update \
  && apt install -y --fix-missing \
    wget gnupg \
    xorg tigervnc-standalone-server tigervnc-tools xterm dbus-x11 xfonts-100dpi xfonts-75dpi fonts-liberation2 fonts-noto-color-emoji \
    pulseaudio ffmpeg \
    ca-certificates tzdata \
    runit \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

RUN adduser root pulse-access

# install chrome
RUN apt-get update \
  && apt-get -y install --fix-missing \
    chromium \
  && apt clean \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -r chromium \
  && useradd -r -g chromium -G audio,video,pulse-access chromium \
  && mkdir -p /home/chromium/Downloads && chown -R chromium:chromium /home/chromium

ENV DISPLAY=:99
ENV XVNC_GEOMETRY=1280x720
ENV CHROMIUM_WINDOW_SIZE=1280,720

COPY images/chromestage/vnc /vnc
COPY --from=builder /chromestage /bin/chromestage
COPY --from=dinit-builder /go/bin/dinit /bin/dinit
COPY images/chromestage/service /etc/service

ENV DINIT_JSON_STDOUT 0
ENV DINIT_DIR /etc/service

# Run as non privileged user
USER chromium
WORKDIR /home/chromium
ENTRYPOINT ["/bin/dinit"]

FROM docker.io/library/golang:1.22-bookworm as builder
WORKDIR /chromestage

COPY images/chromestage/go.mod .
COPY images/chromestage/go.sum .

# RUN apk add --no-cache ca-certificates git

# Get dependancies - will also be cached if we won't change mod/sum
RUN go mod download

COPY images/chromestage/cmd cmd
COPY images/chromestage/commands commands
RUN CGO_ENABLED=0 go install -installsuffix "static" ./cmd/chromestage

#########

FROM docker.io/library/debian:bookworm
ENV LANG="C.UTF-8"

# install utilities
RUN apt update \
  && apt install -y --fix-missing \
    wget gnupg \
    xorg tigervnc-standalone-server tigervnc-tools xterm dbus-x11 xfonts-100dpi xfonts-75dpi fonts-liberation2 \
    pulseaudio ffmpeg \
    ca-certificates tzdata \
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
COPY --from=builder /go/bin/chromestage /bin/chromestage
COPY images/chromestage/start.sh /home/chromium/start.sh
RUN chmod +x /home/chromium/start.sh

# Run as non privileged user
USER chromium
WORKDIR /home/chromium
ENTRYPOINT ["/home/chromium/start.sh"]

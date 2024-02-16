FROM golang:1.21-alpine as builder
WORKDIR /chromestage

COPY go.mod .
COPY go.sum .

RUN apk add --no-cache ca-certificates git

# Get dependancies - will also be cached if we won't change mod/sum
RUN go mod download

COPY ./cmd/chromestage .
RUN CGO_ENABLED=0 GOARCH=amd64 go install -installsuffix "static" .

#########

FROM ubuntu:jammy
ENV LANG="C.UTF-8"

# install utilities
RUN apt update \
  && apt install -y --fix-missing \
    wget gnupg \
    xvfb xorg x11vnc xterm dbus-x11 xfonts-100dpi xfonts-75dpi xfonts-cyrillic \
    pulseaudio ffmpeg \
    ca-certificates tzdata \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

RUN adduser root pulse-access

# install chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
  && apt-get update \
  && apt-get -y install --fix-missing \
    google-chrome-stable \
  && apt clean \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -r chromium \
  && useradd -r -g chromium -G audio,video,pulse-access chromium \
  && mkdir -p /home/chromium/Downloads && chown -R chromium:chromium /home/chromium

ENV DISPLAY=:99
ENV XVFB_WHD=1280x720x24

# VNC
EXPOSE 5900
# chromedp
EXPOSE 9222
# chomestage+chromedp+novnc
EXPOSE 8000

COPY ./vnc /vnc
COPY --from=builder /go/bin /bin
COPY /start.sh /home/chromium/start.sh
RUN chmod +x /home/chromium/start.sh

# Run as non privileged user
USER chromium
WORKDIR /home/chromium
ENTRYPOINT ["/home/chromium/start.sh"]

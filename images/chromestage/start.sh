#!/bin/bash


_cleanup() {
  kill -TERM $chromestage
  wait $chromestage
  kill -TERM $chromium
  wait $chromium
  kill -TERM $xvnc
  wait $xvnc
}

# Setup a trap to catch SIGTERM and relay it to child processes
trap _cleanup SIGTERM

env | sort

# echo "starting dbus..."
mkdir -p /run/dbus/
export DBUS_FATAL_WARNINGS=0
dbus-daemon --system

stream_url="${1:-}"
default_start='about:blank'
start_page="${2:-"$default_start"}"
vncpassword="chromestage"

echo "$vncpassword" | vncpasswd -f ./vncpassword

echo "starting xvnc..."
Xvnc $DISPLAY \
  -AlwaysShared \
  -geometry $XVNC_GEOMETRY \
  -depth 24 \
  -PasswordFile=./vncpassword \
  -rfbauth ./vncpassword \
  -rfbport 5900 \
  -SecurityTypes=None,Plain,VncAuth \
  &
xvnc=$!

echo "starting pulseaudio..."
pulseaudio -D --verbose --exit-idle-time=-1 --disallow-exit

# mkdir -p ~/.config
# ln -s ~/.config/chromium $CHROMIUM_PROFILE_DIR

# echo "starting xterm..."
# xterm -maximized &
echo "starting chrome..."
# Need remote-allow-origins option to avoid:
# Rejected an incoming WebSocket connection from the http://127.0.0.1:8083 origin. Use the command line flag --remote-allow-origins=http://127.0.0.1:8083 to allow connections from this origin or --remote-allow-origins=* to allow all origins.
chromium \
  --disable-sandbox \
  --no-default-browser-check \
  --remote-allow-origins=* \
  --remote-debugging-port=9222 \
  --window-position=0,0 \
  --window-size=$CHROMIUM_WINDOW_SIZE \
  --no-first-run \
  --kiosk \
	--autoplay-policy=no-user-gesture-required \
	--disable-background-networking=true \
	--enable-features="NetworkService,NetworkServiceInProcess" \
	--disable-background-timer-throttling=true \
	--disable-backgrounding-occluded-windows=true \
	--disable-breakpad=true \
	--disable-client-side-phishing-detection=true \
	--disable-default-apps=true \
	--disable-dev-shm-usage=true \
	--disable-extensions=true \
	--disable-features="site-per-process,Translate,BlinkGenPropertyTrees" \
	--disable-hang-monitor=true \
	--disable-ipc-flooding-protection=true \
	--disable-popup-blocking=true \
	--disable-prompt-on-repost=true \
	--disable-renderer-backgrounding=true \
	--disable-sync=true \
	--force-color-profile="srgb" \
	--metrics-recording-only=true \
	--safebrowsing-disable-auto-update=true \
	--password-store="basic" \
	--use-mock-keychain=true \
  $start_page & # --start-maximized --start-fullscreen
chromium=$!

echo "starting chromestage..."
/bin/chromestage "$start_page" &
chromestage=$!

if [ -n "$stream_url" ]; then
  echo "starting ffmpeg..."
  # ffmpeg \
  #   -f x11grab -video_size 1280x720 -framerate 30 -i $DISPLAY \
  #   -f alsa -i pulse -ac 2 \
  #   -c:v libx264 -preset veryfast \
  #   -c:a aac -strict experimental \
  #   -copyts \
  #   -f flv "$stream_url"
  ffmpeg -re \
    -f x11grab -video_size 1280x720 -framerate 30 -i $DISPLAY \
    -vcodec libvpx -cpu-used 5 -deadline 1 -g 10 -error-resilient 1 -auto-alt-ref 1 \
    -f rtp "$stream_url"':5004?pkt_size=1200' &
  #  -sample_fmt s16p \
  ffmpeg \
    -f alsa -i pulse -ac 2 \
    -c:a libopus -b:a 48000 \
    -ssrc 1 -payload_type 111 \
    -f rtp -max_delay 0 -application lowdelay "$stream_url"':5006?pkt_size=1200'
else
  wait $chromium
fi

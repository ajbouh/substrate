package defs

enable: "mediamtx": true

live_edit: "mediamtx": bool

imagespecs: "mediamtx": {
  image: "\(#var.image_prefix)mediamtx"
  build: dockerfile: "images/mediamtx/Dockerfile"
}

daemons: "mediamtx": {
  environment: {
    PORT: string
    // Set MTX_WEBRTCADDITIONALHOSTS to additional IP addresses
    // MTX_WEBRTCADDITIONALHOSTS: string
  }

  #systemd_units: {
    "mediamtx.container": {
      Install: {
        WantedBy: ["multi-user.target", "default.target"]
      }
      Container: {
        Network: ["host"]
      }
    }
  }
}

services: [key=string]: instances: [string]: {
  environment: {
    ORIGIN_HOSTNAME: string
    SUBSTRATE_PARAMETERS_DIGEST: string
    MTX_RTSP_INTERNAL_ADDRESS_PREFIX: "rtsp://host.containers.internal:8554/\(key)--\(SUBSTRATE_PARAMETERS_DIGEST)"
    MTX_RTSP_ADDRESS_PREFIX: "rtsp://\(ORIGIN_HOSTNAME):8554/\(key)--\(SUBSTRATE_PARAMETERS_DIGEST)"
    MTX_RTP_INTERNAL_ADDRESS_PREFIX: "rtp://host.containers.internal:8000/\(key)--\(SUBSTRATE_PARAMETERS_DIGEST)"
    MTX_RTP_ADDRESS_PREFIX: "rtp://\(ORIGIN_HOSTNAME):8000/\(key)--\(SUBSTRATE_PARAMETERS_DIGEST)"
    MTX_WEB_ADDRESS_PREFIX: "https://\(ORIGIN_HOSTNAME):48889/\(key)--\(SUBSTRATE_PARAMETERS_DIGEST)/"
    MTX_WEB_INTERNAL_ADDRESS_PREFIX: "http://host.containers.internal:8889/\(key)--\(SUBSTRATE_PARAMETERS_DIGEST)/"
    MTX_WEB_ADDRESS_QUERY: "?controls=false"
  }
}

package defs

enable: "gstreamer-pipeline": true

live_edit: "gstreamer-pipeline": bool

imagespecs: "gstreamer-pipeline": {
  image: "\(#var.image_prefix)gstreamer-pipeline"
  build: dockerfile: "images/gstreamer-pipeline/Dockerfile"
}

services: "gstreamer-pipeline": {
  instances: [string]: {
    environment: {
      PORT: string
      GST_DEBUG: "2"
    }

    // HACK we need to do this because /dev/dri devices require the container's
    // group to be either video or render. We can *almost* achieve this using
    // the run.oci.keep_original_groups annotation, but for that to work we need
    // the user starting the container to be in these groups. We don't directly
    // control the user starting this container because we're using the
    // systemd-managed podman.socket. So in the interest of forward progress
    // we're using this.

    privileged: true

    mounts: [
      { source: "/dev/dri", destination: "/dev/dri", mode: "rw" },
    ]
  }
}

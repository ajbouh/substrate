package defs

enable: "sigar": true

imagespecs: "sigar": {
  image: "\(#var.image_prefix)sigar"
  build: dockerfile: "images/sigar/Dockerfile"
}

services: "sigar": {
  instances: [string]: {
    ephemeral: true

    environment: [string]: string
    url_prefix: environment.SUBSTRATE_URL_PREFIX

    mounts: {
      "/hostproc": { source: "/proc", mode: "ro" }
    }

    exports: data: {
      system: {
        memory: {
          total_mb: number
          used_mb: number
          free_mb: number
          actual_free_mb: number
          actual_used_mb: number
          ...
        }
        ...
      }
      ...
    }
  }
}

// A bit of an awkward pattern, but this ensures sigar exports are available for other defs.
services: "sigar": instances: "sigar": pinned: true
system: sigar: services.sigar.instances["sigar"].exports.data

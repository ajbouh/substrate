package quadlet

// Documentation https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html
// see rendered unit with /usr/libexec/podman/quadlet -dryrun

import (
  systemd "github.com/ajbouh/substrate/pkg/systemd"
)

// https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#container-units-container
#Container: systemd.#Unit & {
  "Install" ?: {
    Alias ?: string
    WantedBy ?: [...string]
    RequiredBy ?: [...string]
  }
  "Container": {
    Volumes ?: [...string]
    // command ?: [...string]

    #Environment ?: [string]: string
    Environment ?: [string]: string
    EnvironmentFile ?: string
    Pull ?: string

    ContainerName: string
    Image: string

    PublishPort ?: [...string]
  }
  ...
}

// https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#image-units-image
#Image: systemd.#Unit & {
  // "Image": {
  //   AllTags ?: bool
  //   Arch ?: string
  //   AuthFile ?: string
  //   CertDir ?: string
  //   ContainersConfModule ?: string
  //   Creds ?: =~"^(.*):(.*)$"
  //   DecryptionKey ?: string
  //   GlobalArgs ?: string
  //   "Image" ?: string
  //   OS ?: string
  //   PodmanArgs ?: string
  //   TLSVerify ?: bool
  //   Variant ?: string
  // }
  ...
}

// https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#volume-units-volume
#Volume: systemd.#Unit

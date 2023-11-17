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


    AddCapability ?: string // CAP
    AddDevice ?: [...string] // /dev/foo
    Annotation ?: [...string] // ”XYZ”
    AutoUpdate ?: string // registry
    ContainersConfModule ?:  [...string] // /etc/nvd.conf
    DNS ?: [...string] // 192.168.55.1
    DNSSearch ?: [...string] // foo.com
    DNSOption ?: [...string] // ndots:1
    DropCapability ?: [...string] // CAP
    EnvironmentHost ?: bool
    Exec ?: string // /usr/bin/command
    ExposeHostPort ?: [...string] // 50-59
    GIDMap ?: [...string] // 0:10000:10
    GlobalArgs ?: [...string]
    Group ?: string // 1234
    HealthCmd ?: string // ”/usr/bin/command”
    HealthInterval ?: string // 2m
    HealthOnFailure ?: string // kill
    HealthRetries ?: string // 5
    HealthStartPeriod ?: string // 1m
    HealthStartupCmd ?: string // ”command”
    HealthStartupInterval ?: string // 1m
    HealthStartupRetries ?: string // 8
    HealthStartupSuccess ?: string // 2
    HealthStartupTimeout ?: string // 1m33s
    HealthTimeout ?: string // 20s
    HostName ?: string // new-host-name
    IP ?: string // 192.5.0.1
    IP6 ?: string // 2001:db8::1
    Label ?: [...string] // ”XYZ”
    LogDriver ?: string // journald
    Mount ?: [...string] // type=…
    Network ?: [...string] // host
    NoNewPrivileges ?: string // true
    Rootfs ?: string // /var/lib/rootfs
    Notify ?: bool // true
    PidsLimit ?: string // 10000
    Pod ?: string // pod-name
    PodmanArgs ?: [...string]
    ReadOnly ?: bool // true
    ReadOnlyTmpfs ?: bool // true
    RunInit ?: bool // true
    SeccompProfile ?: string // /tmp/s.json
    SecurityLabelDisable ?: bool // true
    SecurityLabelFileType ?: string // usr_t
    SecurityLabelLevel ?: string // s0:c1,c2
    SecurityLabelNested ?: bool // true
    SecurityLabelType ?: string // spc_t
    ShmSize ?: string // 100m
    SubGIDMap ?: string // gtest
    SubUIDMap ?: string // utest
    Sysctl ?: [...string] // name ?: string // value
    Timezone ?: string // local
    Tmpfs ?: [...string] // /work
    UIDMap ?: [...string] // 0:10000:10
    Ulimit ?: string // nofile=1000:10000
    User ?: string // bin
    UserNS ?: string // keep-id:uid=200,gid=210
    WorkingDir ?: string // $HOME
  }
  ...
}

// https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html#network-units-network
#Network: systemd.#Unit & {
  "Network" ?: {
    ContainersConfModule ?: string
    DisableDNS ?: bool
    DNS ?: string
    Driver ?: string
    Gateway ?: string
    GlobalArgs ?: string
    Internal ?: bool
    IPAMDriver ?: string
    IPRange ?: string
    IPv6 ?: bool
    Label ?: string
    NetworkName ?: string
    Options ?: string
    PodmanArgs ?: string
    Subnet ?: string
  }
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

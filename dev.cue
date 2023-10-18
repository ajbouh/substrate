package dev

import (
  "strings"

  "github.com/ajbouh/substrate:external"

  "github.com/ajbouh/substrate/pkg/systemd"
  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"

  build_daemons "github.com/ajbouh/substrate/services:daemons"

  build_lenses "github.com/ajbouh/substrate/services:lenses"
)

#namespace: string @tag(namespace)

#lenses: (build_lenses & {
  #var: {
    "namespace": #namespace
    "image_prefix": "\(external.jamsocket.registry)/\(external.jamsocket.account)-lens-"
  }
})

#daemons: (build_daemons & {
  #var: {
    "namespace": "\(#namespace)-dev"
    "hostprefix": "\(#namespace)-dev-"
    "image_prefix": "\(external.jamsocket.registry)/\(external.jamsocket.account)-daemon-"
    "lenses": #lenses
    "secrets": {
      "substrate": {
        "session_secret": "NhnxMMlvBM7PuNgZ6sAaSqnkoAso8LlMBqnHZsQjxDFoclD5RREDRROk"
      }
    }
    "substrate": {
      // internal_port: 443
      // origin: "https://\(#namespace)-substrate.tail87070.ts.net"
      internal_port: 2280
      // origin: "http://127.0.0.1:18080"
    }
  }
})

lens_images: {
  #lens_images: [
    for lens, def in #daemons.#var.lenses if def.spawn != _|_ {
      def.spawn.jamsocket.image
    }
  ]

  #out: strings.Join(#lens_images, "\n")
}

"fcos": ignition: {
// https://coreos.github.io/butane/config-fcos-v1_5/
  variant: "fcos"
  version: "1.5.0"
  passwd: users: [
    {
      name: "substrate"
      password_hash: "$y$j9T$zK4DDIlSx4fT3sjXMxklf.$JaBgIM8q9CXCcfgVa5ScYdp9/6Dg.wSk/dfYm3Uvo0B"
      groups: [
        "sudo",
        "wheel",
        "docker",
      ]
      ssh_authorized_keys_local: [
        "adamb-ssh-key.pub",
      ]
    }
  ]
  storage: {
    disks: [
      {
        device: "/dev/disk/by-id/coreos-boot-disk"
        wipe_table: false
        partitions: [
          {
            number: 4
            label: "root"
            size_mib: 8192
            resize: true
          },
          {
            label: "var"
            size_mib: 0
          }
        ]
      }
    ]
    filesystems: [
      {
        path: "/var"
        device: "/dev/disk/by-partlabel/var"
        format: "btrfs"
        with_mount_unit: true
      }
    ]
    files: [
      {
        path: "/etc/ostree/auth.json"
        mode: 0o600
        contents: {
          inline: """
             {
                 "auths": {
                       "quay.io": {
                           "auth": "..."
                       }
                 }
             }
             """
        }
      }
    ]
  }
  systemd: {
    units: [
      {
        name: "getty@tty0.service"
        dropins: [
          {
            name: "autologin-substrate.conf"
            contents: """
              [Service]
              # Override Execstart in main unit
              ExecStart=
              # Add new Execstart with `-` prefix to ignore failure
              ExecStart=-/usr/sbin/agetty --autologin substrate --noclear %I $TERM
              TTYVTDisallocate=no
              """
          }
        ]
      },
      {
        name: "docker.service"
        mask: true
      },
      // {
      //   name: "serial-getty@ttyS0.service"
      //   dropins: {
      //     name: "autologin-substrate.conf"
      //     contents: """
      //       [Service]
      //       # Override Execstart in main unit
      //       ExecStart=
      //       # Add new Execstart with `-` prefix to ignore failure
      //       ExecStart=-/usr/sbin/agetty --autologin substrate --noclear %I $TERM
      //       TTYVTDisallocate=no
      //     """
      //   }
      // },
      {
        name: "substrateos-autorebase.service"
        enabled: true
        contents: """
          [Unit]
          Description=SubstrateOS autorebase to OCI and reboot
          ConditionFirstBoot=true
          After=network-online.target
          [Service]
          After=ignition-firstboot-complete.service
          Type=oneshot
          RemainAfterExit=yes
          ExecStart=rpm-ostree rebase --reboot ostree-unverified-registry:ghcr.io/ajbouh/substrate:substrateos
          [Install]
          WantedBy=multi-user.target
          """
      }
    ]
  }
}


"systemd": containers: {
  for name, def in #daemons {
    if def.#systemd_units != _|_ {
      for unit_name, unit in def.#systemd_units {
        if unit_name =~ "\\.(image|container)$" {
          "\(unit_name)": unit & {
            #text: (systemd.#render & {#unit: unit}).#out

            if unit_name =~ "\\.container$" {
              if unit.Container.#Environment != _|_ {
                #environment_file_text: strings.Join([
                  for k, v in unit.Container.#Environment {
                    "\(k)=\(v)",
                  }
                ], "\n")
              }
            }
          }
        }
      }
    }
  }
}

"systemd": containers: {
  "substrate.container": {
    Container: {
      #Environment: {
        PLANE_AGENT__IP: "127.0.0.1"
      }
    }
  }
}

docker_compose_build: {
  services: {
    for name, daemon in #daemons {
      if daemon.build != null {
        "daemon-\(name)": {
          if daemon.build.image != _|_ { image: daemon.build.image }
          if daemon.build.args != _|_ { build: args: daemon.build.args }
          if daemon.build.dockerfile != _|_ { build: dockerfile: daemon.build.dockerfile }
          if daemon.build.target != _|_ { build: target: daemon.build.target }
          if daemon.build.context != _|_ { build: context: daemon.build.context }
        }
      }
    }

    for name, lens in #daemons.#var.lenses {
      if lens.#build != null {
        "lens-\(name)": {
          if lens.spawn != _|_ {
            image: lens.spawn.jamsocket.image
          }
          build: dockerfile: lens.#build.dockerfile
          if lens.#build.args != _|_ {
            build: args: lens.#build.args
          }
        }
      }
    }
  }

  #images: strings.Join([
    for name, def in services if def.image != _|_ {
      def.image
    }
  ], "\n")
}

docker_compose: {
  "volumes": {
    for name, def in docker_compose.services {
      if #daemons[name].#docker_compose_volumes != _|_ {
        #daemons[name].#docker_compose_volumes
      }
    }
  }

  services: [string]: docker_compose_service

  services: {
    if #lenses["datasette"] != _|_ {
      datasette: {
        build: dockerfile: "services/\(#lenses["datasette"].name)/Dockerfile"
        build: args: #lenses["datasette"].#build.args

        environment: {
          PORT: "8081"
        }

        ports: [
          "18083:\(environment.PORT)",
        ]

        // Mount the same volumes as substrate, so we can spy on the database
        environment: DATASETTE_DB: substrate.environment.SUBSTRATE_DB

        volumes: substrate.volumes
      }
    }
    if #lenses["ui"] != _|_ {
      ui: {
        build: target: "dev"
        build: dockerfile: "services/\(#lenses["ui"].name)/Dockerfile"

        volumes: [
          "./services/\(#lenses["ui"].name)/static:/app/static:ro",
          "./services/\(#lenses["ui"].name)/src:/app/src:ro",
        ]

        environment: {
          if #lenses["ui"].env != _|_ {
            #lenses["ui"].env
          }

          PORT: "8080"
          // ORIGIN: substrate.environment.ORIGIN
          // ORIGIN: "https://\(#daemons.#var.namespace)-substrate.tail87070.ts.net"
          ORIGIN: "http://127-0-0-1.my.local-ip.co"
          PUBLIC_EXTERNAL_ORIGIN: ORIGIN
        }
      }
    }
    substrate: {
      #daemons["substrate"].#docker_compose_service

      ports: [
        // "80:8080",
        "443:8443",
        "80:80",
        "14222:4222",
      ]

      environment: {
        ORIGIN: "http://127-0-0-1.my.local-ip.co"
        if #lenses["ui"] != _|_ {
          EXTERNAL_UI_HANDLER: "http://ui:\(services.ui.environment.PORT)"
        }
        // PLANE_AGENT__IP: "100.85.122.130"
      }
    }
  }
}

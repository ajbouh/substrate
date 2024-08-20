package defs

#var: {
  host_docker_socket: string
  host_substratefs_root: string
}

enable: "vscode-server": true

imagespecs: "vscode-server": {
  image: "\(#var.image_prefix)vscode-server"
  build: {
    dockerfile: "images/vscode-server/Dockerfile"
  }
}

"daemons": "vscode-server": {
  #user: "core"
  #group: "core"
  #home: "/var/home/\(#user)"

  environment: {
    #workspace: string | *#home
    #docker_socket: "/var/run/docker.sock"
    PORT: "3001"
    DOCKER_HOST: "unix://\(#docker_socket)"

    LANG: "C.UTF-8"
    LC_ALL: "C.UTF-8"
    HOME: #home
    EDITOR: "code"
    VISUAL: "code"
    GIT_EDITOR: "code --wait"
  }

  command: [
    "--disable-telemetry",
    "--disable-getting-started-override",
    "--disable-workspace-trust",

    // TODO switch to binding a socket instead.
    "--bind-addr", "0.0.0.0:\(environment.PORT)",
    "--disable-telemetry",
    "--disable-update-check",
    "--auth", "none",

    #home,
  ]

  mounts: {
    (#home): {source: #home}
    (environment.#docker_socket): {source: #var.host_docker_socket}
    (#var.host_substratefs_root): {source: #var.host_substratefs_root}
  }

  #systemd_quadlet_units: {
    "vscode-server.container": {
      Unit: {
        Requires: ["podman.socket"]
        After: ["podman.socket"]
      }
      Install: {
        WantedBy: ["multi-user.target", "default.target"]
      }
      Container: {
        AddDevice: ["/dev/kvm", "/dev/fuse"]
        SecurityLabelDisable: true
        PublishPort: [
          // To make localhost forwarding work (e.g. qemu, publish on the same port)
          "\(environment.PORT):\(environment.PORT)",
        ]
        User: #user
        Group: #group
        Environment: {
          environment
        }
      }
    }
  }
}

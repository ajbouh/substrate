datacenter = "dc1"
data_dir   = "/opt/nomad"
addresses {
  http = "100.64.51.49"
  rpc  = "100.64.51.49"
  serf = "100.64.51.49"
}
server {
  enabled          = true
  bootstrap_expect = 1
  server_join {
    retry_join = ["100.64.51.49"]
  }
}

client {
  enabled = true
  server_join {
    retry_join = ["100.64.51.49"]
  }

  host_network "tailscale" {
    // Pulled from tailscale dashboard
    cidr = "100.64.51.49/32"
    reserved_ports = "22"
  }
}

plugin "docker" {
  config {
    volumes {
      enabled      = true
    }

    allow_privileged = true

    allow_caps = [
      "audit_write",
      "chown",
      "dac_override",
      "fowner",
      "fsetid",
      "kill",
      "mknod",
      "net_bind_service",
      "setfcap",
      "setgid",
      "setpcap",
      "setuid",
      "sys_chroot",
      "sys_admin",
     ]
  }
}

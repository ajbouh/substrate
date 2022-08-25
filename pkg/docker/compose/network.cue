package network

let #network = {
  driver ?: "host" | "none" | string

  driver_opts ?: [string]: _

  attachable ?: bool

  enable_ipv6 ?: bool

  external ?: bool

  ipam ?: {
    driver ?: string
    config: [...{
      subnet ?: string // Subnet in CIDR format that represents a network segment
      ip_range ?: string // Range of IPs from which to allocate container IPs
      gateway ?: string // IPv4 or IPv6 gateway for the master subnet
      aux_addresses ?: [string]: string /// Auxiliary IPv4 or IPv6 addresses used by Network driver, as a mapping from hostname to IP
      options ?: [string]: _
    }]
  }

  internal ?: bool

  name ?: string

  labels ?: [string]: string
}

#network

package app

import (
  "strings"
)

"experimental": {
  "allowed_public_ports"?: [..._]
  "auto_rollback": bool | *false
  "private_network"?: bool | *true
}
"kill_signal": "SIGINT"
"kill_timeout": 5

"env": { [string]: string }

app: string

"metrics" ?: {
  port: int
  path: string
}

"checks" ?: [string]: {
  grace_period: string
  interval: string
  method: string
  path: string
  port: number
  timeout: string
  type: string
}

mounts: [
  ...{
    destination: string
    source: string
  }
] | *[]

"statics" ?: [
  ...{
    "guest_path": string
    "url_prefix": string
  }
]

"build" ?: {
  "args"?: { [string]: string }
  "image" ?: string
  "dockerfile" ?: string
  "build-target" ?: string
}

processes ?: [string]: string

"deploy" ?: {
  "release_command" ?: string
  "strategy" ?: *"canary" | "rolling" | "bluegreen" |"immediate"
}

"services": [
  ...{
    "processes" ?: [...string]
    "concurrency" ?: {
      "hard_limit": number
      "soft_limit": number
      "type": string | "connections"
    }
    "http_checks" ?: []
    "tcp_checks" ?: [
      ...{
        grace_period ?: string
        interval: string
        restart_limit ?: number
        timeout: string
      }
    ]
    "internal_port" ?: number

    "ports" ?: [...{handlers?: [...string], port: string}]
    "protocol" ?: string | "tcp"
    "script_checks" ?: []
  }
] | *[]

#fqdn: "\(app).fly.dev"

#groups: [...string] | *["app"]
if processes != _|_ {
  #groups: [
    for group, command in processes {
      group
    }
  ]
}

for group in #groups {
  #regions: "\(group)": [...string]
  #scale: "\(group)": {}
}

#regions: {
  [string]: [...string]
}
#scale: {
  [string]: {
    vm: string | *"dedicated-cpu-1x"
    count: string | *"1"
  }
}

#secrets: [string]: string

#out: {
  #scale_count_cli_expr: strings.Join([
    for group, scale in #scale {
      "\(group)=\(scale.count)"
    }
  ], " ")
  #groups_expr: strings.Join(#groups, " ")
  #secrets_import_expr: strings.Join([
    for k, v in #secrets {
      "\(k)=\(v)"
    }
  ], "\n")

  #app_volume_mounts: {
    #var: {
      existing: [
        ...{
            "id": string
            "App": {
                "Name": string
                ...
            }
            "Name": string
            ...
        }
      ]
    }

    #existing_set: {[string]: bool}
    for mount in #var.existing {
      #existing_set: "\(mount.Name)": true
    }

    #out: {
      missing: [
        for mount in mounts if #existing_set[mount.source] == _|_ {
          mount.source
        }
      ]

      missing_lines: strings.Join(missing, "\n")
    }
  }
}
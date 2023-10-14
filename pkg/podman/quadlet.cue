package quadlet

// Documentation https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html
// see rendered unit with /usr/libexec/podman/quadlet -dryrun

import (
  "strings"
)

#Section: [string]: (bool | number | string | [...string] | {[string]: string})

#Quadlet: [string]: #Section

#Quadlet: {
  Container: {
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

  Unit ?: {
    Requires ?: [...string]
    After ?: [...string]
  }

  Install ?: {
    WantedBy ?: [...string]
  }

  #render_section: {
    #section_name: string
    #section: #Section
    #out: strings.Join([
      "[\(#section_name)]",
      for k, v in #section {
        if (v & string) != _|_ || (v & bool) != _|_ || (v & number) != _|_ {
          "\(k)=\(v)"
        },
        if (v & [...string]) != _|_ {
          strings.Join([
            for e in v {
              "\(k)=\(e)",
            }
          ], "\n")
        },
        if (v & {[string]: string}) != _|_ {
          strings.Join([
            for ek, ev in v {
              "\(k)=\(ek)=\(ev)",
            }
          ], "\n")
        },
      },
      ""
    ], "\n")
  }

  #text: strings.Join([
    if Unit != _|_ {
      (#render_section & {
        #section: Unit
        #section_name: "Unit"
      }).#out
    }
    if Install != _|_ {
      (#render_section & {
        #section: Install
        #section_name: "Install"
      }).#out
    }
    if Container != _|_ {
      (#render_section & {
        #section: Container
        #section_name: "Container"
      }).#out
    }
  ], "\n")

  if Container.#Environment != _|_ {
    #environment_file_text: strings.Join([
      for k, v in Container.#Environment {
        "\(k)=\(v)"
      },
    ], "\n")
  }
}
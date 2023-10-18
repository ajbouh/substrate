package systemd

import (
  "strings"
)

#Section: [string]: (bool | number | string | [...string] | {[string]: string})

#Unit: {[string]: #Section} & {
  Unit ?: {
    Requires ?: [...string]
    After ?: [...string]
  }

  Install ?: {
    WantedBy ?: [...string]
  }

  ...
}

#render_section: {
  #section_name: string
  #section: #Section

  #out: strings.Join([
    "[\(#section_name)]",
    for k, v in #section {
      if ((v & string) != _|_) || ((v & bool) != _|_) || ((v & number) != _|_) {
        "\(k)=\(v)",
      }
      if (v & [...string]) != _|_ {
        strings.Join([
          for e in v {
            "\(k)=\(e)",
          }
        ], "\n")
      }
      if (v & {[string]: string}) != _|_ {
        strings.Join([
          for ek, ev in v {
            "\(k)=\(ek)=\(ev)",
          }
        ], "\n")
      }
    },
    ""
  ], "\n")
}

#render: {
  #unit: #Unit

  #out: strings.Join([
    for section_name, section in #unit {
      (#render_section & {
        #section_name: section_name
        #section: section
      }).#out,
    }
  ], "\n")
}

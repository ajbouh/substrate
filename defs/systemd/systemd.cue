package systemd

import (
  "strings"
)

#Section: [string]: (bool | number | string | [...string] | {[string]: string})

#Unit: {[string]: #Section} & {
  Unit ?: {
    Requires ?: [...string]
    After ?: [...string]
    ...
  }

  Install ?: {
    WantedBy ?: [...string]
    ...
  }

  ...
}

// Three different directives are understood:
// - "enable" may be used to enable units by default,
// - "disable" to disable units by default, and
// - "ignore" to ignore units and leave existing configuration intact.
#Preset: [unitpattern=string]: "enable" | "disable" | "ignore"

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

#render_unit: {
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

// https://man.archlinux.org/man/systemd.preset.5.en
#render_preset: {
  #header: string
  #preset: #Preset

  #out: strings.Join([
    #header,
    for unitpattern, directive in #preset {
      "\(directive) \(unitpattern)"
    }
  ], "\n")
}

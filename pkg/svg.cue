package svg

import (
  // "html"
  "strings"
)

#SVGImageData: {
  #src: string
  #out: string

  #out: strings.Join([
    "data:image/svg+xml;utf8",
    strings.Replace(strings.Replace(#src, "  ", "", -1), "\n", "", -1),
  ], ",")
}

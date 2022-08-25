package resources

import (
  resource_substratefs "github.com/ajbouh/substrate/resources/substratefs:resource"
)

let all = [
  resource_substratefs,
]

for #resource in all {
  "\(#resource.name)": #resource
}

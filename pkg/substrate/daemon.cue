package daemon

import (
  containerspec "github.com/ajbouh/substrate/pkg/substrate:containerspec"
)

let #Daemon = containerspec & {
  #var: {
    namespace: string
    image: string
  }
  #host: string
  #internal_host: string

  "containerspec": containerspec & {
    image: #var.image
  }
}

#Daemon

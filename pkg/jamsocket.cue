package jamsocket

import (
  "strings"
)

#services_delta: {
  #var: {
    lenses: [string]: {
      spawn: {
        jamsocket: {
          service: string
          ...
        }
        ...
      }
      ...
    }
    existing: string
  }

  #existing_set: {[string]: bool}
  for service in strings.Split(#var.existing, "\n") {
    #existing_set: "\(service)": true
  }

  #missing_services: [
    for service, def in #var.lenses if #existing_set[def.spawn.jamsocket.service] == _|_ {
      def.spawn.jamsocket.service
    }
  ]

  #out: strings.Join(#missing_services, "\n")
}

package service

import (
  "encoding/hex"
  "encoding/json"
  cryptosha256 "crypto/sha256"
)

#ServiceDefSpawnParameter: {
  type: "space" | "spaces" | "string"
  // if type == "spaces" {
  //   // Default attributes to be used if we use a collection
  //   collection: attributes: {[string]: _}
  // }

  if type == "space" {
    space: {
      uses_preview ?: string
      // is_read_only: bool
    }
  }
  if type == "spaces" {
    spaces: [...string]
  }

  value: string
  description ?: string
  optional ?: bool
}

{
  name: string

  instances: [string]: {
    parameters: [string]: #ServiceDefSpawnParameter
    parameters_digest: string | *"unknown"
    _parameters_json: json.Marshal(parameters)
    if _parameters_json == _|_ {
      parameters_digest: "invalid"
    }
    if _parameters_json != _|_ {
      parameters_digest: hex.Encode(cryptosha256.Sum256(_parameters_json))
    }
  
    ephemeral ?: bool | *false
    privileged ?: bool | *false
    init ?: bool | *false
    pinned ?: bool | *false

    service ?: string

    image: string
    environment: [string]: string
    environment: {
      PORT: string | *"8080"
      SUBSTRATE_PARAMETERS_DIGEST: parameters_digest
      INTERNAL_SUBSTRATE_ORIGIN: string | *"http://substrate:8080"
      SUBSTRATE_VIEWSPEC: string | *"unknown"
      INTERNAL_SUBSTRATE_EXPORTS_URL: "\(INTERNAL_SUBSTRATE_ORIGIN)/substrate/v1/activities/\(SUBSTRATE_VIEWSPEC)/\(parameters_digest)/exports"
    }
    command ?: [...string]

    url_prefix ?: string

    resourcedirs: [alias=string]: string
    resourcedirs: {...}

    mounts: [destination=string]: {
      type: string | *"bind"
      source ?: string
      "destination": string & destination
      mode: string | *"rw"
    }

    exports ?: {
      commands ?: _
      data ?: _
      claims ?: _
    }

    // for name, parameter in parameters {
    //   if parameter.type == "space" {
    //     if parameter.space.is_read_only {
    //       environment["JAMSOCKET_SPACE_\(name)_readonly"] = 1
    //     }
    //   }
    // }
  }
}

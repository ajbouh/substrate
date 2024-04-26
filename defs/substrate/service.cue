package service

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

#ActivityDefRequestSchema: {
  [string]: {
    type: "space" | "collection" | "file"
    body ?: [...[...string]] | [...string]  // If true, set body to it. If a string[], set those top-level JSON fields with it. If string[][], set those JSON field selections to it.
    path ?: true | string // If true, replace path with it. If a string, replace string in path with file
    query ?: string | [...string] // Name OR list of names of query parameter
    if type == "file" {
      default ?: string
    }
  }
}

#ActivityDefResponseSchema: {
  [key=string]: {
    type: "space" | "collection" | "file"
    from: "header" | *"body"
    if from == "body" {
      path: [...string] | *[key]
    }
    if from == "header" {
      path: [string]
    }
  }
}

#ActivityDef: {
  activity: "user:new-space" | "user:open" | "user:fork" | "user:collection:space" | "system:preview:space" | =~ "^system:preview:activity:[^:]+$"

  label ?: string
  description ?: string
  after ?: [...string]
  priority ?: int
  image ?: string

  request ?: {
    interactive ?: bool
    path ?: string
    method: string | *"GET"

    schema ?: #ActivityDefRequestSchema
  }

  response ?: {
    schema ?: #ActivityDefResponseSchema
  }
}

{
  name: string
  spawn?: {
    parameters: [string]: #ServiceDefSpawnParameter
    ephemeral ?: bool | *false
    image: string
    environment: [string]: string
    environment: PORT: string | *"8080"
    command ?: [...string]

    url_prefix ?: string

    resourcedirs: [alias=string]: {
      id: string
      sha256: string
      // todo include containerspec so it can be fetched at runtime
    }

    // for name, parameter in parameters {
    //   if parameter.type == "space" {
    //     if parameter.space.is_read_only {
    //       environment["JAMSOCKET_SPACE_\(name)_readonly"] = 1
    //     }
    //   }
    // }
  }

  activities: [string]: #ActivityDef
}

package lens

import (
  docker_compose_service "github.com/ajbouh/substrate/pkg/docker/compose:service"
)

#ServiceDefSpawnSchema: {
  [string]: {
    type: "space" | "spaces" | "string"
    if type == "spaces" {
      // Default attributes to be used if we use a collection
      collection: attributes: {[string]: _}
    }
    if type == "string" {
      environment_variable_name: string
    }
    description?: string
    optional?: bool
  }
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
  [name=string]: {
    type: "space" | "collection" | "file"
    from: "header" | *"body"
    if from == "body" {
      path: [...string] | *[name]
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

let #ServiceDef = close({
  name!: string

  #build: null | *{
    dockerfile?: string
    context?: string
    args?: {[string]: string}
  }

  #docker_compose_service: docker_compose_service & {
    if #build != null { build: #build }
    if spawn.env != _|_ { environment: spawn.env }
  }

  activities ?: [string]: #ActivityDef

  space?: {
    preview ?: string
  }

  // Configuration for spawn
  spawn?: {
    image!: string
    env ?: {[string]: string}

    schema?: #ServiceDefSpawnSchema
  }
})

#ServiceDef

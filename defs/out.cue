package defs

import (
  "strings"
  "encoding/json"

  docker_compose "github.com/ajbouh/substrate/defs/docker/compose:compose"
  service "github.com/ajbouh/substrate/defs/substrate:service"
  systemd "github.com/ajbouh/substrate/defs/systemd"
  imagespec "github.com/ajbouh/substrate/defs/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/defs/substrate:containerspec"
)

#out: {
  services: [string]: service

  daemons: [string]: containerspec.#ContainerSpec
  systemd_containers: [string]: systemd.#Unit
  systemd_container_contents: [string]: string
  systemd_container_basenames: string
  image_podman_build_options: [string]: string

  "resourcedir_fetches": [alias=string]: {
    sha256: string
    #containerspec: containerspec.#ContainerSpec
    #imagespec: imagespec.#ImageSpec
  }
  "resourcedir_keys": string
  resourcedir_fetch_podman_build_options: [string]: string
  resourcedir_fetch_podman_run_options: [string]: string
}

let buildx_bake_metadata_image_digest_key = "containerimage.config.digest"
#out: buildx_bake_metadata_raw: string | *"" @tag(buildx_bake_metadata)
#out: buildx_bake_needed_image_ids_raw: string | *"" @tag(buildx_bake_needed_image_ids)

let dedupe_strings = {
  list: [...string]
  _set: {for i, e in list { (e): true }}
  #out: [for e, b in _set { e, }]
}

// buildx_bake_metadata ?: {
//   "buildx.build.warnings": _
//   [string]: {
//     "buildx.build.provenance": _
//     "buildx.build.ref": string
//     "containerimage.config.digest": string // only seems to be present if we load or push.
//     "containerimage.descriptor": {
//       "annotations": {
//         "config.digest": string
//         "org.opencontainers.image.created": string
//       }
//       "digest": string
//       "mediaType": string
//       "size": int
//     }
//     "containerimage.digest": string
//   }
// }

if #out.buildx_bake_metadata_raw != "" {
  #out: buildx_bake_metadata: json.Unmarshal(#out.buildx_bake_metadata_raw)
  #out: buildx_bake_image_refs: strings.Join([
    for key, def in #out.buildx_bake_metadata if imagespecs[key] != _|_ {
      imagespecs[key].image,
    }
  ], "\n")
  #out: buildx_bake_image_ids: strings.Join((dedupe_strings & {list: [
    for key, def in #out.buildx_bake_metadata if imagespecs[key] != _|_ {
      def[buildx_bake_metadata_image_digest_key],
    }
  ]}).#out, "\n")

  if #out.buildx_bake_needed_image_ids_raw != "" {
    #out: buildx_bake_needed_image_ids: strings.Split(#out.buildx_bake_needed_image_ids_raw, " ")
    #out: buildx_bake_imagespecs: strings.Join([
      for i, image_id in #out.buildx_bake_needed_image_ids {
        for key, def in #out.buildx_bake_metadata {
          if def[buildx_bake_metadata_image_digest_key] == image_id {
            key,
          }
        }
      }
    ], "\n")
  }

  #out: buildx_bake_image_ids_file: strings.Join([
    "package defs",
    for key, def in imagespecs if (enable[key]) {
       "image_ids: \"\(def.image)\": \"\(#out.buildx_bake_metadata[key][buildx_bake_metadata_image_digest_key])\"",
    }
  ], "\n")
}

#out: "buildx_bake_docker_compose": docker_compose & {

  for key, def in imagespecs if (enable[key]) {
    services: (key): (imagespec.#DockerComposeService & {#imagespec: def}).#out
  }
}

for key, def in services if (enable[key]) && ((def.instances & {"":_})[""] != _|_) {
  if ((def.instances & {"":_})[""] != _|_) {
    for alias, rddef in (def.instances & {"":_})[""].resourcedirs {
      resourcedirs: (rddef.id): _
      #out: resourcedir_fetches: (rddef.id): {
        sha256: rddef.sha256
        target: "\(#var.build_resourcedirs_root)/\(rddef.sha256)"
        #containerspec: (resourcedirs[rddef.id].#containerspec & {
          image: resourcedirs[rddef.id].#imagespec.image
          // write to .build directory first
          mounts: [{source: "\(#var.build_resourcedirs_root)/\(rddef.sha256).build", "destination": "/res", "mode": "Z"}]
        })
        #imagespec: resourcedirs[rddef.id].#imagespec
      }
    }
  }
}

#out: "resourcedir_keys": strings.Join([
  for key, def in #out.resourcedir_fetches {
    key,
  }
], "\n")

for key, def in daemons {
  if (enable[key]) {
    #out: "daemons": (key): def
    #out: "daemons": (key): image: imagespecs[key].image
  }
}

for key, def in #out.daemons {
  #out: "systemd_containers": (containerspec.#SystemdUnits & {#name: key, #containerspec: def}).#out
}

for basename, unit in #out.systemd_containers {
  #out: "systemd_container_contents": (basename): (systemd.#render & {#unit: unit}).#out
}

#out: "systemd_container_basenames": strings.Join([
  for key, def in #out.systemd_containers { key }
], "\n")

for key, def in imagespecs if (enable[key]) {
  #out: "image_podman_build_options": (def.image): def.#podman_build_options
}

for key, def in #out.resourcedir_fetches {
  #out: "resourcedir_fetch_podman_build_options": (key): def.#imagespec.#podman_build_options
  #out: "resourcedir_fetch_dirs": (key): strings.Join([def.#containerspec.mounts[0].source], " ")
  #out: "resourcedir_fetch_podman_run_options": (key): (containerspec.#PodmanRunOptions & {
    #containerspec: def.#containerspec
  }).#out
}

#out: "calls": calls

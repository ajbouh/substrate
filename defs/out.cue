package defs

import (
  "encoding/json"
  "list"
  "strings"

  docker_compose "github.com/ajbouh/substrate/defs/docker/compose:compose"
  systemd "github.com/ajbouh/substrate/defs/systemd"
  imagespec "github.com/ajbouh/substrate/defs/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/defs/substrate:containerspec"
)

#out: {
  systemd_quadlets: [string]: systemd.#Unit
  systemd_quadlet_contents: [string]: string
  systemd_quadlet_basenames: string

  systemd_units: [string]: systemd.#Unit
  systemd_unit_contents: [string]: string
  systemd_unit_basenames: string

  systemd_presets: [string]: systemd.#Preset
  systemd_preset_contents: [string]: string
  systemd_preset_basenames: string

  #out: systemd_units_to_start: [string]: true
  #out: systemd_units_to_start_text: string

  resourcedir_ids: [...string]
  resourcedir_image_tags_text: string
}

let buildx_bake_metadata_image_digest_key = "containerimage.config.digest"

#out: buildx_bake_metadata_raw: string | *"" @tag(buildx_bake_metadata)
#out: buildx_bake_needed_image_ids_raw: string | *"" @tag(buildx_bake_needed_image_ids)

#out: buildx_bake_docker_compose_focus_raw: string @tag(buildx_bake_docker_compose_focus)
if #out.buildx_bake_docker_compose_focus_raw != _|_ {
  #out: buildx_bake_docker_compose_focus: { for key in strings.Split(#out.buildx_bake_docker_compose_focus_raw, " ") { (key): true } }
}

#out: buildx_bake_docker_compose_block_tags_raw: string @tag(buildx_bake_docker_compose_block_tags)
if #out.buildx_bake_docker_compose_block_tags_raw != _|_ {
  #out: buildx_bake_docker_compose_block_tags: { for key in strings.Split(#out.buildx_bake_docker_compose_block_tags_raw, " ") { (key): true } }
}

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

#out: "resourcedir_ids": list.Concat([
  for key, def in services if (enable[key]) {
    let instancedef = (def.instances & {"":_})[""]
    if (instancedef != _|_) {
      [for rdalias, rdid in instancedef["resourcedirs"] { rdid }]
    }
  }
])

#out: resourcedir_image_tags_text: strings.Join([
  for resourcedir_id in #out.resourcedir_ids {
    resourcedirs[resourcedir_id].image_tag
  }
], "\n")

#out: "buildx_bake_docker_compose": docker_compose & {
  // if we have nothing to focus on, include everything not blocked
  if #out.buildx_bake_docker_compose_focus == _|_ {
    for key, def in imagespecs if (enable[key]) {
      if #out.buildx_bake_docker_compose_block_tags[def.image_tag] == _|_ {
        "services": (key): (imagespec.#DockerComposeService & {#imagespec: def}).#out
      }
    }

    for i, resourcedir_id in #out.resourcedir_ids {
      let def = resourcedirs[resourcedir_id]
      let key = "resourcedir-\(def.sha256)"
      if #out.buildx_bake_docker_compose_block_tags[def.image_tag] == _|_ {
        "services": (key): (imagespec.#DockerComposeService & {#imagespec: def.#imagespec}).#out
      }
    }
  }

  // if we have something to focus on, include those unless blocked
  if #out.buildx_bake_docker_compose_focus != _|_ {
    for key, def in imagespecs if (enable[key]) {
      if #out.buildx_bake_docker_compose_focus[key] != _|_ &&  #out.buildx_bake_docker_compose_block_tags[def.image_tag] == _|_ {
        "services": (key): (imagespec.#DockerComposeService & {#imagespec: def}).#out
      }
    }

    for i, resourcedir_id in #out.resourcedir_ids {
      let def = resourcedirs[resourcedir_id]
      let key = "resourcedir-\(def.sha256)"
      if #out.buildx_bake_docker_compose_focus[key] != _|_ &&  #out.buildx_bake_docker_compose_block_tags[def.image_tag] == _|_ {
        "services": (key): (imagespec.#DockerComposeService & {#imagespec: def.#imagespec}).#out
      }
    }
  }
}

let quadlet_basedirs = [
  "/etc/containers/systemd",
  "/usr/share/containers/systemd",
]

for key, def in daemons if (enable[key]) {
  let quadlets = (containerspec.#SystemdQuadletUnits & {#name: key, #containerspec: def}).#out
  let quadlet_service = "\(key).service"

  #out: systemd_quadlets: quadlets
  #out: systemd_units_to_start: (quadlet_service): true

  // Add a watcher service to restart whenever the quadlets change
  let watcher_units = (containerspec.#SystemdUnitWatcherUnits & {
    #name: "\(key)-liveedit"
    #target_unit: quadlet_service
    #path_changed: list.Concat([
      for quadlet_basedir in quadlet_basedirs {
        [
          for basename, quadlet in quadlets {
            "\(quadlet_basedir)/\(basename)",
          }
        ]
      }
    ])
  }).#out
  #out: systemd_units: watcher_units

  // add a preset enabling liveedit .path
  #out: systemd_presets: "60-liveedit-paths.preset": {
    ("\(key)-liveedit.path"): "enable"
    ("\(key)-liveedit.service"): "enable"
  }

  #out: systemd_units_to_start: ("\(key)-liveedit.path"): true
}

// add a preset enabling all our .container files
for basename, quadlet in #out.systemd_quadlets {
  if basename =~ "\\.container$" {
    #out: systemd_presets: "50-containers.preset": (quadlet.#systemd_service_name): "enable"
  }
}

#out: systemd_quadlet_basenames: strings.Join([for basename, unit in #out.systemd_quadlets { basename }], "\n")
#out: systemd_quadlet_contents: { for basename, unit in #out.systemd_quadlets { (basename): (systemd.#render_unit & {#unit: unit}).#out } }

#out: systemd_unit_basenames: strings.Join([for basename, unit in #out.systemd_units { basename }], "\n")
#out: systemd_unit_contents: { for basename, unit in #out.systemd_units { (basename): (systemd.#render_unit & {#unit: unit}).#out } }

#out: systemd_preset_basenames: strings.Join([for basename, lines in #out.systemd_presets { basename }], "\n")
#out: systemd_preset_contents: {
  let preset_header = "Autogenerated by out.cue"
  for basename, preset in #out.systemd_presets {
    (basename): (systemd.#render_preset & {#preset: preset, #header: preset_header}).#out
  }
}

#out: systemd_units_to_start_text: strings.Join([for unit, b in #out.systemd_units_to_start if b { unit }], "\n")

#out: "calls": calls

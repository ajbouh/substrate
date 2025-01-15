@if(overlay)
package defs

import (
  "encoding/json"
  "encoding/toml"
  "list"
  "strings"

  docker_compose "github.com/ajbouh/substrate/defs/docker/compose:compose"
  systemd "github.com/ajbouh/substrate/defs/systemd"
  imagespec "github.com/ajbouh/substrate/defs/substrate:imagespec"
  containerspec "github.com/ajbouh/substrate/defs/substrate:containerspec"
)

let txtar = {
  #files: {[string]: string} | *{}
  #lines: [
    for name, content in #files {
      """
        -- \(name) --
        \(strings.TrimSuffix(content, "\n"))
        """,
    }
  ]

  if len(#lines) == 0 {
    #out: ""
  }
  if len(#lines) > 0 {
    #out: strings.Join(#lines, "\n")
  }
}

overlay: {
  // a focus key can be the key of services, imagespecs, or a resourcedir image_tag
  // focus keys do not enable things for which enabled[focus_key]: false
  focus_keys_raw: *"" | string @tag(buildx_bake_docker_compose_focus)
  focus_keys: [...string]
  if focus_keys_raw == "" { focus_keys: [] }
  if focus_keys_raw != "" { focus_keys: strings.Split(focus_keys_raw, " ") }

  block_image_tags_raw: *"" | string @tag(buildx_bake_docker_compose_block_tags)
  block_image_tags: {[string]: true}
  if block_image_tags_raw != "" {
    block_image_tags: { for key in strings.Split(block_image_tags_raw, "\n") { (key): true } }
  }

  buildx_bake_metadata_raw: *"" | string @tag(buildx_bake_metadata)
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
  let buildx_bake_metadata_image_digest_key = "containerimage.config.digest"
  if buildx_bake_metadata_raw != "" {
    buildx_bake_metadata: json.Unmarshal(buildx_bake_metadata_raw)
    buildx_bake_image_ids_txtar: (txtar & {
      #files: {
        for key, buildx_bake_metadata_entry in buildx_bake_metadata if (enable[key] == _|_) || enable[key] {
          "defs/image_id_\(key).cue": """
            package defs
            image_ids: \"\(imagespecs[key].image)\": \"\(buildx_bake_metadata_entry[buildx_bake_metadata_image_digest_key])\"
            """,
        }
      }
    })
  }

  systemd_daemon_quadlets: [string]: _
  systemd_image_quadlets: [string]: systemd.#Unit
  systemd_units: [string]: systemd.#Unit
  systemd_presets: [string]: systemd.#Preset

  systemd_units_to_start: {[string]: true}
  systemd_units_to_start_text: string

  daemon_keyset: [key=string]: key
  service_keyset: [key=string]: key
  imagespec_keyset: [key=string]: key
  resourcedir_keyset: [key=string]: key

  resourcedir_image_tags: [...string]

  imagespec_by_image_tag: {
    for ikey, idef in imagespecs {
      (idef.image): idef
    }
      for rdid, rddef in resourcedirs {
      (resourcedirs[rdid].image_tag): rddef.#imagespec
    }
  }

  if len(focus_keys) > 0 {
    daemon_keyset: {
      for focus_key in focus_keys if (enable[focus_key] != _|_) && (enable[focus_key]) && (daemons[focus_key] != _|_) {
        (focus_key): focus_key
      }
    }

    imagespec_keyset: {
      for focus_key in focus_keys if (enable[focus_key] != _|_) && (enable[focus_key]) && (imagespecs[focus_key] != _|_) {
        (focus_key): focus_key
      }
    }

    service_keyset: {
      for focus_key in focus_keys if (enable[focus_key] != _|_) && (enable[focus_key]) && (services[focus_key] != _|_) {
        (focus_key): focus_key
      }
    }

    resourcedir_keyset: {
      for rdid, rddef in resourcedirs {
        for focus_key in focus_keys if rddef.image_tag == focus_key {
          (rdid): rdid
        }
      }
    }
  }

  if len(focus_keys) == 0 {
    daemon_keyset: {for key, def in daemons if (enable[key]) { (key): key }}
    imagespec_keyset: {for key, def in imagespecs if (enable[key]) { (key): key }}
    service_keyset: {for key, def in services if (enable[key]) { (key): key }}
  }

  for key in service_keyset {
    let def = services[key]
    let instancedef = (def.instances & {"":_})[""]
    if (instancedef != _|_) {
      for ikey, idef in imagespecs {
        if instancedef.image_tag == idef.image {
          imagespec_keyset: (ikey): ikey
        }
      }

      for rdalias, rdid in instancedef["resourcedirs"] {
        resourcedir_keyset: (rdid): rdid
      }
    }
  }

  resourcedir_image_tags: [
    for rdid, rddef in resourcedir_keyset {
      resourcedirs[rdid].image_tag
    }
  ]

  "buildx_bake_docker_compose": docker_compose & {
    for key in imagespec_keyset {
      let def = imagespecs[key]
      if block_image_tags[def.image_tag] == _|_ {
        "services": (key): (imagespec.#DockerComposeService & {#imagespec: def}).#out
      }
    }

    for rdid in resourcedir_keyset {
      let rddef = resourcedirs[rdid]
      let key = "resourcedir-\(rddef.sha256)"
      if block_image_tags[rddef.image_tag] == _|_ {
        "services": (key): (imagespec.#DockerComposeService & {#imagespec: rddef.#imagespec}).#out
      }
    }
  }

  systemd_daemon_quadlets: {...} & {
    for key in daemon_keyset {
      let def = daemons[key]
      let quadlets = (containerspec.#SystemdQuadletUnits & {#name: key, #containerspec: def}).#out
      for basename, quadlet in quadlets {
        (key): (basename): quadlet
      }
    }
  }

  let quadlet_basedirs = [
    "/etc/containers/systemd",
    "/usr/share/containers/systemd",
  ]
  for daemon_key in daemon_keyset {
    let def = daemons[daemon_key]
    let quadlets = (containerspec.#SystemdQuadletUnits & {#name: daemon_key, #containerspec: def}).#out
    let quadlet_service = "\(daemon_key).service"

    systemd_units_to_start: (quadlet_service): true

    // Add a watcher service to restart whenever the quadlets change
    let watcher_units = (containerspec.#SystemdUnitWatcherUnits & {
      #name: "\(daemon_key)-liveedit"
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
    systemd_units: watcher_units

    // add a preset enabling liveedit .path
    systemd_presets: "60-liveedit-\(daemon_key)-paths.preset": {
      ("\(daemon_key)-liveedit.path"): "enable"
      ("\(daemon_key)-liveedit.service"): "enable"
    }

    systemd_units_to_start: ("\(daemon_key)-liveedit.path"): true
  }

  // Emit .image units so we can have locally-bound images. Don't actually reference them from .container units.
  systemd_image_quadlets: {
    for key in imagespec_keyset {
      let def = imagespecs[key]
      "\(key).image": "Image": {
        "Image": def.image
      }
    }

    for rdid in resourcedir_keyset {
      let rddef = resourcedirs[rdid]
      let key = "resourcedir-\(rddef.sha256)"
      "\(key).image": "Image": {
        "Image": rddef.image_tag
      }
    }
  }

  // add a preset enabling all our .container files
  for key, quadlets in systemd_daemon_quadlets {
    for basename, quadlet in quadlets {
      if basename =~ "\\.container$" {
        systemd_presets: "50-containers-\(quadlet.#systemd_service_name).preset": (quadlet.#systemd_service_name): "enable"
      }
    }
  }

  final_systemd_units: {
      for basename, unit in systemd_image_quadlets {
        "usr/share/containers/systemd/\(basename)": unit
      }
      for key, quadlets in systemd_daemon_quadlets {
        for basename, unit in quadlets {
          "usr/share/containers/systemd/\(basename)": unit
        }
      }
      for basename, unit in systemd_units {
        "usr/lib/systemd/system/\(basename)": unit
      }
  }

  overlay_txtar: (txtar & {
    #files: {
      for path, unit in final_systemd_units {
        (path): (systemd.#render_unit & {#unit: unit}).#out
      }

      let preset_header = "Autogenerated by overlay.cue"
      for basename, preset in systemd_presets {
        "usr/lib/systemd/system-preset/\(basename)": (systemd.#render_preset & {#preset: preset, #header: preset_header}).#out
      }

      "etc/containers/storage.conf": toml.Marshal(podman_storage_conf)
    }
  })

  systemd_units_to_start_text: strings.Join([for unit, b in systemd_units_to_start { unit }], "\n")
}

// #out: "calls": calls

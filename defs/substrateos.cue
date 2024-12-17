package defs

enable: "substrateos-overlay": true
enable: "substrateos": true

imagespecs: "substrateos-overlay": {
  image: "\(#var.image_prefix)substrateos-overlay"
  build: dockerfile: "images/substrateos/Containerfile"
  build: target: "overlay"
  
  build: args: {
    #use_bootc_storage: string @tag(use_bootc_storage)

    NAMESPACE: string @tag(namespace)
    CUE_DEV_DEFS: string @tag(cue_defs)
    SUBSTRATE_LIVE_EDIT: string @tag(live_edit)
    "SUBSTRATE_USE_BOOTC_STORAGE": "\(#use_bootc_storage)"
    SUBSTRATE_USER: string @tag(host_user)
    SUBSTRATE_GROUP: string @tag(host_group)
    SUBSTRATE_HOME: string @tag(host_home_directory)
    SUBSTRATE_SOURCE: string @tag(host_source_directory)
    SUBSTRATE_BUILD_FOCUS: string @tag(buildx_bake_docker_compose_focus)
  }
}

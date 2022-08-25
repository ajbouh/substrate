package lenses

import (
  lens_ui "github.com/ajbouh/substrate/services/ui:lens"
  lens_datasette "github.com/ajbouh/substrate/services/datasette:lens"
  lens_files "github.com/ajbouh/substrate/services/files:lens"
  lens_gotty "github.com/ajbouh/substrate/services/gotty:lens"
  // lens_jupyverse "github.com/ajbouh/substrate/services/jupyverse:lens"
  lens_screenshot "github.com/ajbouh/substrate/services/screenshot:lens"
  lens_substrate "github.com/ajbouh/substrate/services/substrate:lens"
  lens_visualizer "github.com/ajbouh/substrate/services/visualizer:lens"
  lens_bridge "github.com/ajbouh/substrate/services/bridge:lens"

  lens_asr_faster_whisper "github.com/ajbouh/substrate/services/asr-faster-whisper:lens"
  lens_asr_pyannote_audio "github.com/ajbouh/substrate/services/asr-pyannote-audio:lens"
  lens_asr_seamlessm4t "github.com/ajbouh/substrate/services/asr-seamlessm4t:lens"
  lens_chat_llama_cpp_python "github.com/ajbouh/substrate/services/chat-llama-cpp-python:lens"

  // lens_fastcups "github.com/ajbouh/substrate/services/fastcups:lens"
  // lens_gitexport "github.com/ajbouh/substrate/services/git-export:lens"
  // lens_redbean "github.com/ajbouh/substrate/services/redbean:lens"
  // lens_silverbullet "github.com/ajbouh/substrate/services/silverbullet:lens"
  // lens_openplayground "github.com/ajbouh/substrate/services/openplayground:lens"
  // lens_lmql_model "github.com/ajbouh/substrate/services/lmql/src/lmql/model:lens"
  // lens_lmql_live "github.com/ajbouh/substrate/services/lmql/src/lmql/ui/live:lens"
  // lens_lmql_playgroud "github.com/ajbouh/substrate/services/lmql/src/lmql/ui/playground:lens"
)

#var: {
  namespace: string
  image_prefix: string
}

#filter: {[string]: bool} | *null

// #filter: {
//   bridge: true
// }

let all = [
  lens_substrate,
  lens_ui,
  lens_files,
  lens_datasette,
  lens_gotty,
  lens_screenshot,
  lens_visualizer,
  lens_bridge,

  lens_asr_faster_whisper,
  lens_asr_pyannote_audio,
  lens_asr_seamlessm4t,
  lens_chat_llama_cpp_python,

  // lens_jupyverse,
  // lens_fastcups,
  // lens_redbean,
  // lens_gitexport,
  // lens_silverbullet,
  // lens_openplayground,
  // lens_lmql_model,
  // lens_lmql_live,
  // lens_lmql_playgroud,
]

for #lens in all {
  if #filter == null || #filter[#lens.name] != _|_ {
    "\(#lens.name)": #lens & {
      if #lens.#build != null {
        #build: dockerfile: string | *"services/\(#lens.name)/Dockerfile"

        spawn: jamsocket: {
          service: "\(#var.namespace)-\(#lens.name)"
          image: "\(#var.image_prefix)\(#lens.name)"
        }
      }
    }
  }
}

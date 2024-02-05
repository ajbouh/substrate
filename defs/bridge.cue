package defs

enable: "bridge": true

imagespecs: "bridge": {}

#var: substrate: internal_host: string

"lenses": "bridge": {
  spawn: {}
  spawn: environment: {
    BRIDGE_TRANSCRIPTION: "http://\(#var.substrate.internal_host)/bb"
    BRIDGE_TRANSLATOR_text_eng_en: "http://\(#var.substrate.internal_host)/bb"
    BRIDGE_ASSISTANT_Bridge: "http://\(#var.substrate.internal_host)/bb/v1"
  }
}

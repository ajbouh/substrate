package services


containerspecs: "bridge": {}

"lenses": "bridge": {
  spawn: {}
  spawn: environment: {
    // BRIDGE_TRANSCRIPTION: "http://substrate:8080/gw/asr-faster-whisper/v1/transcribe"
    // BRIDGE_TRANSLATOR_text_eng_en: "http://substrate:8080/gw/asr-seamlessm4t/v1/transcribe"
    // BRIDGE_ASSISTANT_Bridge: "http://substrate:8080/gw/llama-cpp-python/v1"
    BRIDGE_TRANSCRIPTION: "http://daemon-substrate:8080/bb"
    BRIDGE_TRANSLATOR_text_eng_en: "http://daemon-substrate:8080/bb"
    BRIDGE_ASSISTANT_Bridge: "http://daemon-substrate:8080/bb/v1"
  }
}

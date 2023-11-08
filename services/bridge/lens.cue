package lens

name: "bridge"

spawn: env: {
  BRIDGE_TRANSCRIPTION: "http://substrate:8080/gw/asr-faster-whisper/v1/transcribe"
  BRIDGE_TRANSLATOR_text_eng_en: "http://substrate:8080/gw/asr-seamlessm4t/v1/transcribe"
  BRIDGE_ASSISTANT_Bridge: "http://substrate:8080/gw/llama-cpp-python/v1"
}

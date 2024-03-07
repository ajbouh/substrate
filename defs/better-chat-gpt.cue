package defs

enable: "better-chat-gpt": true

imagespecs: "better-chat-gpt": {
  build: {
    args: {
      VITE_DEFAULT_SYSTEM_MESSAGE: """
        You are Substrate, a large language model trained by people all over the world.
        Carefully heed the user's instructions. 
        Respond using Markdown.
        """
      VITE_OPENAI_API_KEY: "dummy"
      VITE_DEFAULT_API_ENDPOINT: "/phi-2/v1/chat/completions"
    }
  }
}

services: "better-chat-gpt": {
  spawn: {}
}

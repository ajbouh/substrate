package defs

import (
  command "github.com/ajbouh/substrate/defs/substrate:command"
)

enable: "llamafile": true

imagespecs: "llamafile": {
    image: "\(#var.image_prefix)llamafile"
    build: dockerfile: "images/llamafile/Dockerfile"
    build: target: "llamafile-gguf"
}

#commands: "llamafile": [string]: {
    #base_url: string
    command.#ViaHTTP
    msg: data: request: {
        method: "POST"
        headers: "Accept": ["application/json"]
        headers: "Content-Type": ["application/json"]
        body: {}
    }
}

#commands: "llamafile": "tokenize": {
    #base_url: string
    meta: {
        "#/data/parameters/prompt": {type: "string"}
        
        "#/data/returns/add_special": {type: "bool"}
        "#/data/returns/parse_special": {type: "bool"}
        "#/data/returns/tokens": {type: "[]string"}
    }
    msg: data: request: url: "\(#base_url)/tokenize"
}

#commands: "llamafile": "embedding": {
    #base_url: string
    meta: {
        "#/data/parameters/content": {type: "string"}
        "#/data/parameters/image_data": {type: "[]{data: bytes, id: number}"}

        "#/data/returns/add_special": {type: "bool"}
        "#/data/returns/parse_special": {type: "bool"}
        "#/data/returns/tokens_provided": {type: "number"}
        "#/data/returns/tokens_used": {type: "number"}
        "#/data/returns/embedding": {type: "[]float"}
    }
    msg: data: request: url: "\(#base_url)/embedding"
}

#commands: "llamafile": "chat_completion": {
    #base_url: string
    // https://github.com/Mozilla-Ocho/llamafile/blob/main/llamafile/server/doc/v1_chat_completions.md
    meta: {
        "#/data/parameters/model": {type: "string"}
        "#/data/parameters/stream": {
            type: "bool"
            description: #"If this field is optionally set to true, then this endpoint will return a text/event-stream using HTTP chunked transfer encoding. This allows your chatbot to rapidly show text as it's being genearted. The standard JSON response is slightly modified so that its message field will be named delta instead. It's assumed the client will reconstruct the full conversation."#
        }
        "#/data/parameters/messages": {type: "array<object<role:string, content:string>>"}
        "#/data/parameters/max_tokens": {type: "integer"}
        "#/data/parameters/max_completion_tokens": {type: "integer"}
        "#/data/parameters/top_p": {type: "integer"}
        "#/data/parameters/temperature": {type: "integer"}
        "#/data/parameters/seed": {type: "integer"}
        "#/data/parameters/presence_penalty": {type: "number"}
        "#/data/parameters/frequency_penalty": {type: "number"}
        "#/data/parameters/user": {type: "string"}
        "#/data/parameters/stop": {type: "string|array<string>"}
        "#/data/parameters/response_format": {type: "string|object"}

        "#/data/returns/choices": {type: "array<object<finish_reason:string, index:integer, logprobs:null, message:object<content:string, role:string>>>"}
        "#/data/returns/created": {type: "number"}
        "#/data/returns/id": {type: "string"}
        "#/data/returns/model": {type: "string"}
        "#/data/returns/object": {type: "string"}
        "#/data/returns/system_fingerprint": {type: "string"}
        "#/data/returns/usage": {type: "object<completion_tokens:integer, prompt_tokens:integer, total_tokens:integer>>"}
    }

    // Hardcode this to false since msgs don't support streaming yet.
    data: parameters: stream: false
    data: parameters: model: "model"

    msg: data: request: url: "\(#base_url)/v1/chat/completions"
}

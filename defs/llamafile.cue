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

package defs

import (
  command "github.com/ajbouh/substrate/defs/substrate:command"
)

enable: "vllm": true

imagespecs: "vllm": {
    image: "\(#var.image_prefix)vllm-cuda"
    build: dockerfile: "images/vllm/Dockerfile.cuda"
}

#commands: "vllm": "completion": {
    #base_url: string

    meta: {
        "#/data/parameters/model": {type: "string"}
        "#/data/parameters/prompt": {type: "string"}
        "#/data/parameters/max_tokens": {type: "int"}
        "#/data/parameters/temperature": {type: "float"}
        "#/data/parameters/top_p": {type: "float"}
        "#/data/parameters/n": {type: "int"}
        "#/data/parameters/logprobs": {type: "int"}
        "#/data/parameters/echo": {type: "bool"}
        "#/data/parameters/stop": {type: "[]string"}
        "#/data/parameters/presence_penalty": {type: "float"}
        "#/data/parameters/frequency_penalty": {type: "float"}
        "#/data/parameters/best_of": {type: "int"}
        "#/data/parameters/logit_bias": {type: "map[string]int"}

        "#/data/returns/id": {type: "string"}
        "#/data/returns/choices": {type: "[]object"}
        "#/data/returns/created": {type: "int"}
        "#/data/returns/usage": {type: "object"}
    }
    data: {
        parameters: {
            model: "/res/model/huggingface/local"
        }
    }

    command.#ViaHTTP
    msg: data: request: {
        method: "POST"
        headers: "Accept": ["application/json"]
        headers: "Content-Type": ["application/json"]
        body: {}
        url: "\(#base_url)/v1/completions"
    }
}

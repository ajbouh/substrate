package defs

enable: "llamafile": true

imagespecs: "llamafile": {
    image: "\(#var.image_prefix)llamafile"
    build: dockerfile: "images/llamafile/Dockerfile"
    build: target: "llamafile-gguf"
}

#commands: "llamafile": [string]: {
    parameters: [string]: _
    returns: [string]: _
    run: http: {
        "parameters": {
            for parameter, v in parameters {
                (parameter): path: "request.body.\(parameter)"
            }
        }
        "returns": {
            for return, v in returns {
                (return): path: "response.body.\(return)"
            }
        }
        request: {
            #base_url: string
            headers: "Accept": ["application/json"]
            headers: "Content-Type": ["application/json"]
            body: {}
        }
    }
}

#commands: "llamafile": "tokenize": {
    parameters: {
        "prompt": type: "string"
    }
    returns: {
        "add_special": type: "bool"
        "parse_special": type: "bool"
        "tokens": type: "[]string"
    }
    run: http: {
        request: {
            #base_url: string
            url: "\(#base_url)/tokenize"
            method: "POST"
        }
    }
}

#commands: "llamafile": "embedding": {
    parameters: {
        "content": type: "string"
        "image_data": type: "[]{data: bytes, id: number}"
    }
    returns: {
        "add_special": type: "bool"
        "parse_special": type: "bool"
        "tokens_provided": type: "number"
        "tokens_used": type: "number"
        "embedding": type: "[]float"
    }
    run: http: {
        request: {
            #base_url: string
            url: "\(#base_url)/embedding"
            method: "POST"
        }
    }
}

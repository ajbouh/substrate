package defs

enable: "vllm": true

imagespecs: "vllm": {
    image: "\(#var.image_prefix)vllm-cuda"
    build: dockerfile: "images/vllm/Dockerfile.cuda"
}

#commands: "vllm": "completion": {
    parameters: {
        model: type: "string"
        prompt: type: "string"
        max_tokens: type: "int"
        temperature: type: "float"
        top_p: type: "float"
        n: type: "int"
        logprobs: type: "int"
        echo: type: "bool"
        stop: type: "[]string"
        presence_penalty: type: "float"
        frequency_penalty: type: "float"
        best_of: type: "int"
        logit_bias: type: "map[string]int"
    }
    returns: {
        id: type: "string"
        choices: type: "[]object"
        created: type: "int"
        usage: type: "object"
    }
    run: bind: {
        parameters: {
            model: "/res/model/huggingface/local"
        }
    }
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
            method: "POST"
            headers: "Accept": ["application/json"]
            headers: "Content-Type": ["application/json"]
            body: {}
            url: "\(#base_url)/v1/completions"
        }
    }
}

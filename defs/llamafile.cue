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
    command.ViaHTTP
    msg: http: request: {
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
    msg: http: request: url: "\(#base_url)/tokenize"
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
    msg: http: request: url: "\(#base_url)/embedding"
}

#commands: "llamafile": "completion": {
    #base_url: string
    msg: http: request: url: "\(#base_url)/v1/completions"

    // Hardcode this to false since msgs don't support streaming yet.
    data: parameters: stream: false
    data: parameters: model: "model"

    meta: {
        "#/data/parameters/model": {type: "string"}
        "#/data/parameters/prompt": {type: "string", description: #"Provide the prompt for this completion as a string or as an array of strings or numbers representing tokens. Internally, the prompt is compared to the previous completion and only the "unseen" suffix is evaluated. If the prompt is a string or an array with the first element given as a string, a bos token is inserted in the front like main does."#}
        "#/data/parameters/temperature": {type: "number", description: "Adjust the randomness of the generated text (default: 0.8)."}
        "#/data/parameters/top_k": {type: "number", description: "Limit the next token selection to the K most probable tokens (default: 40)."}
        "#/data/parameters/top_p": {type: "number", description: "Limit the next token selection to a subset of tokens with a cumulative probability above a threshold P (default: 0.95)."}
        "#/data/parameters/min_p": {type: "number", description: "The minimum probability for a token to be considered, relative to the probability of the most likely token (default: 0.05)."}
        "#/data/parameters/n_predict": {type: "number", description: "Set the maximum number of tokens to predict when generating text. Note: May exceed the set limit slightly if the last token is a partial multibyte character. When 0, no tokens will be generated but the prompt is evaluated into the cache. (default: -1, -1 = infinity)."}
        "#/data/parameters/n_keep": {type: "number", description: "Specify the number of tokens from the prompt to retain when the context size is exceeded and tokens need to be discarded. By default, this value is set to 0 (meaning no tokens are kept). Use -1 to retain all tokens from the prompt."}
        "#/data/parameters/stream": {type: "bool", description: "It allows receiving each predicted token in real-time instead of waiting for the completion to finish. To enable this, set to true."}
        "#/data/parameters/stop": {type: "[]string", description: "Specify a JSON array of stopping strings. These words will not be included in the completion, so make sure to add them to the prompt for the next iteration (default: [])."}
        "#/data/parameters/tfs_z": {type: "number", description: "Enable tail free sampling with parameter z (default: 1.0, 1.0 = disabled)."}
        "#/data/parameters/typical_p": {type: "number", description: "Enable locally typical sampling with parameter p (default: 1.0, 1.0 = disabled)."}
        "#/data/parameters/repeat_penalty": {type: "number", description: "Control the repetition of token sequences in the generated text (default: 1.1)."}
        "#/data/parameters/repeat_last_n": {type: "number", description: "Last n tokens to consider for penalizing repetition (default: 64, 0 = disabled, -1 = ctx-size)."}
        "#/data/parameters/penalize_nl": {type: "bool", description: "Penalize newline tokens when applying the repeat penalty (default: true)."}
        "#/data/parameters/presence_penalty": {type: "number", description: "Repeat alpha presence penalty (default: 0.0, 0.0 = disabled)."}
        "#/data/parameters/frequency_penalty": {type: "number", description: "Repeat alpha frequency penalty (default: 0.0, 0.0 = disabled);"}
        "#/data/parameters/penalty_prompt": {type: "null | string | []number", description: "This will replace the prompt for the purpose of the penalty evaluation. Can be either null, a string or an array of numbers representing tokens (default: null = use the original prompt)."}
        "#/data/parameters/mirostat": {type: "number", description: "Enable Mirostat sampling, controlling perplexity during text generation (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0)."}
        "#/data/parameters/mirostat_tau": {type: "number", description: "Set the Mirostat target entropy, parameter tau (default: 5.0)."}
        "#/data/parameters/mirostat_eta": {type: "number", description: "Set the Mirostat learning rate, parameter eta (default: 0.1)."}
        "#/data/parameters/grammar": {type: "string", description: "Set grammar for grammar-based sampling (default: no grammar)"}
        "#/data/parameters/seed": {type: "number", description: "Set the random number generator (RNG) seed (default: -1, -1 = random seed)."}
        "#/data/parameters/ignore_eos": {type: "bool", description: "Ignore end of stream token and continue generating (default: false)."}
        "#/data/parameters/logit_bias": {type: "array", description: #"Modify the likelihood of a token appearing in the generated text completion. For example, use "logit_bias": [[15043,1.0]] to increase the likelihood of the token 'Hello', or "logit_bias": [[15043,-1.0]] to decrease its likelihood. Setting the value to false, "logit_bias": [[15043,false]] ensures that the token Hello is never produced (default: [])."#}
        "#/data/parameters/logit_bias/*": {type: "tuple"}
        "#/data/parameters/logit_bias/*/0": {type: "number", description: "token id to modify the likelihood of"}
        "#/data/parameters/logit_bias/*/1": {type: "number", description: #"likelihood for the given token. For example, use 1.0 to increase the likelihood of the token, or -1.0 to decrease its likelihood. Setting the value to false ensures that the token is never produced."#}
        "#/data/parameters/n_probs": {type: "number", description: "If greater than 0, the response also contains the probabilities of top N tokens for each generated token (default: 0)"}
        "#/data/parameters/image_data": {
            type: #"[]{"image_data": [{"data": "<BASE64_STRING>", "id": 12}]}"#
            description: #"An array of objects to hold base64-encoded image data and its ids to be reference in prompt. You can determine the place of the image in the prompt as in the following: USER:[img-12]Describe the image in detail.\nASSISTANT:. In this case, [img-12] will be replaced by the embeddings of the image with id 12 in the following image_data array: {..., "image_data": [{"data": "<BASE64_STRING>", "id": 12}]}. Use image_data only with multimodal models, e.g., LLaVA."#
        }
        "#/data/parameters/image_data/*/id": {type: "number", description: "image id to be referenced in the prompt"}
        "#/data/parameters/image_data/*/data": {type: "string", description: "Base64-encoded image data", encoding: "base64"}
        "#/data/parameters/slot_id": {type: "number", description: "Assign the completion task to an specific slot. If is -1 the task will be assigned to a Idle slot (default: -1)"}
        "#/data/parameters/cache_prompt": {type: "bool", description: "Save the prompt and generation for avoid reprocess entire prompt if a part of this isn't change (default: false)"}
        "#/data/parameters/system_prompt": {type: "string", description: "Change the system prompt (initial prompt of all slots), this is useful for chat applications. See more"}

        // Note: When using streaming mode (stream) only content and stop will be returned until end of completion.
        //     "#/data/returns/completion_probabilities": An array of token probabilities for each completion. The array's length is n_predict. Each item in the array has the following structure:
        // {
        //   "content": "<the token selected by the model>",
        //   "probs": [
        //     {
        //       "prob": float,
        //       "tok_str": "<most likely token>"
        //     },
        //     {
        //       "prob": float,
        //       "tok_str": "<second most likely tonen>"
        //     },
        //     ...
        //   ]
        // },
        // Notice that each probs is an array of length n_probs.

        "#/data/returns/content": {description: "Completion result as a string (excluding stopping_word if any). In case of streaming mode, will contain the next token as a string."}
        "#/data/returns/stop": {description: "Boolean for use with stream to check whether the generation has stopped (Note: This is not related to stopping words array stop from input options)"}
        "#/data/returns/generation_settings": {description: "The provided options above excluding prompt but including n_ctx, model"}
        "#/data/returns/model": {description: "The path to the model loaded with -m"}
        "#/data/returns/prompt": {description: "The provided prompt"}
        "#/data/returns/stopped_eos": {description: "Indicating whether the completion has stopped because it encountered the EOS token"}
        "#/data/returns/stopped_limit": {description: "Indicating whether the completion stopped because n_predict tokens were generated before stop words or EOS was encountered"}
        "#/data/returns/stopped_word": {description: "Indicating whether the completion stopped due to encountering a stopping word from stop JSON array provided"}
        "#/data/returns/stopping_word": {description: #"The stopping word encountered which stopped the generation (or "" if not stopped due to a stopping word)"#}
        "#/data/returns/timings": {description: "Hash of timing information about the completion such as the number of tokens predicted_per_second"}
        "#/data/returns/tokens_cached": {description: "Number of tokens from the prompt which could be re-used from previous completion (n_past)"}
        "#/data/returns/tokens_evaluated": {description: "Number of tokens evaluated in total from the prompt"}
        "#/data/returns/truncated": {description: "Boolean indicating if the context size was exceeded during generation, i.e. the number of tokens provided in the prompt (tokens_evaluated) plus tokens generated (tokens predicted) exceeded the context size (n_ctx)"}
    }
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
        "#/data/parameters/messages/*/role": {type: "string"}
        "#/data/parameters/messages/*/content": {type: "string"}
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

    msg: http: request: url: "\(#base_url)/v1/chat/completions"
}

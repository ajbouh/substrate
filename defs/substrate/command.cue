package command

import (
    "strings"
)

Fields: [string]: _

Path: [...(string|int)]

Meta: [string]: {
    description ?: string
    type ?: string
    ...
}

Msg: {
    #name: string

    msg ?: Msg
    cap ?: string

    msg_in ?: [dstpointer=string]: string
    msg_out ?: [dstpointer=string]: string

    description ?: string
    data ?: Fields
    meta ?: Meta
}

Command: Msg

HTTPRequest: {
    url: string
    query ?: [string]: [...string]
    path ?: [string]: string

    method: string
    headers ?: [string]: [...string]
    body ?: _
}

HTTPResponse: {
    headers ?: [string]: [...string]
    body ?: _
}

ViaHTTP: (Msg & {
    // We use this to generate in and out bindings

    meta: Meta

    cap: "msg"

    msg: {
        http: {
            request: HTTPRequest
            response: HTTPResponse
        }

        cap: "http"
    }

    #msg_request_body_parameter_prefix: string | *""

    "msg_in": {
        // loop over meta to define incoming bindings
        for path, m in meta {
            if strings.HasPrefix(path, "#/data/parameters/") {
                let subpath = strings.TrimPrefix(path, "#/data/parameters/")
                "#/msg/http/request/body/\(#msg_request_body_parameter_prefix)\(subpath)": path
            }
        }
    }
    "msg_out": {
        // loop over meta to define outgoing bindings
        for path, m in meta {
            if strings.HasPrefix(path, "#/data/returns/") {
                let subpath = strings.TrimPrefix(path, "#/data/returns/")
                (path): "#/msg/http/response/body/\(subpath)"
            }
        }
    }
})

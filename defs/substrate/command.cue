package command

#Command: {
    #name: string

    description ?: string

    parameters ?: [field=string]: {
        type ?: string
        description ?: string
    }
    returns ?: [field=string]: {
        type ?: string
        description ?: string
    }
    run: {
        http: {
            parameters ?: [field=string]: {
                path: string | *"request.body.parameters.\(field)"
                value ?: _
                // path: request.query.x # only with get
                // path: request.headers.x
            }
            returns ?: [field=string]: {
                path: string | *"response.body.\(field)"
                value ?: _
            }
            request: {
                url ?: string
                method ?: string | *"POST"
                headers ?: [string]: [...string]
                if method != "GET" && method != "HEAD" {
                    body ?: {
                        "command": #name
                        "parameters": _
                    }
                }
                // this is not fully descriptive
                query ?: [string]: string
            }
        }
    } | *{
        http: {
            parameters
            request: {
                method: "POST"
                headers: "Content-Type": ["application/json"]
                body: {
                    "command": #name
                    "parameters": [string]: _
                }
            }
        }
    }
}

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
        bind: {
            parameters ?: [field=string]: _
            returns ?: [field=string]: _
        }
        http: {
            parameters ?: [field=string]: {
                path: string | *"request.body.parameters.\(field)"
                // path: request.query.x # only with get
                // path: request.headers.x
            }
            returns ?: [field=string]: {
                path: string | *"response.body.\(field)"
            }
            request: {
                url ?: string
                method ?: string | *"POST"
                headers ?: [string]: [...string]
                // this is not fully descriptive
                query ?: [string]: string
                body: _
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

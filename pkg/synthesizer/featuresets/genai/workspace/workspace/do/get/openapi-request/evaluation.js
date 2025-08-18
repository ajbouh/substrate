import jsonpointer from '@workspace/lib/jsonpointer.js'

function renderPath(url, params) {
    if (!params) {
        return url
    }

    const u = new URL(url)
    let pathname = decodeURIComponent(u.pathname)
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const placeholder = `{${key}}`;
            const value = encodeURIComponent(params[key]);
            pathname = pathname.replace(placeholder, value);
        }
    }
    u.pathname = pathname

    return u.toString();
}

function renderQuery(url, query) {
    if (!query) {
        return url
    }

    const queryEntries = Object.entries(query)
    if (queryEntries.length > 0) {
        const u = new URL(url)
        for (const [k, v] of queryEntries) {
            // query entries don't make much sense when null. so skip if they are.
            if (v == null) {
                continue
            }
            u.searchParams.set(k, v)
        }
        url = u.toString()
    }
    return url
}

const fetchRequestFromInputs = ({baseRequest, queryInputs, pathInputs, bodyInput, inputs}) => {
    const request = structuredClone(baseRequest)

    if (queryInputs) {
        for (const key of queryInputs) {
            const v = inputs[key]
            if (v !== undefined) {
                request.query[key] = v
            }
        }
    }

    if (pathInputs) {
        for (const key of pathInputs) {
            const v = inputs[key]
            if (v !== undefined) {
                request.path[key] = v
            }
        }
    }

    let url = request.url
    url = renderPath(url, request.path)
    url = renderQuery(url, request.query)

    let body
    if (baseRequest.body || typeof bodyInput === 'string') {
        body = JSON.stringify({
            ...baseRequest.body,
            ...(bodyInput.length
                ? inputs[bodyInput]
                : inputs),
        })
    }

    return {
        url,
        request: {
            method: request.method,
            headers: request.headers,
            body,
        },
    }
}

const outputsFromFetchResponse = async ({demandStatus, outputsFromResponse, errorsFromResponse, response}) => {
    if (demandStatus === undefined) {
        if (!response.ok) {
            const t = await response.text()
            throw new Error(`response was not ok; status=${response.status} body=${t}`)
        }
    } else {
        if (demandStatus !== response.status) {
            const t = await response.text()
            throw new Error(`response status was not ${demandStatus}; status=${response.status} body=${t}`)
        }
    }

    let body
    const contentType = response.headers.get('Content-Type')

    if (!contentType) {
        body = await response.text()
    } else if (contentType.startsWith('application/json')) {
        body = await response.json()
    } else if (contentType.startsWith('text/')) {
        body = await response.text()
    } else {
        body = await response.blob()
    }

    if (!outputsFromResponse) {
        return body
    }

    const headers = Object.fromEntries(response.headers.entries())

    const responseObj = {
        url: response.url,
        headers,
        redirected: response.redirected,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        type: response.type,
        body,
    }

    if (errorsFromResponse) {
        for (const pointer of errorsFromResponse) {
            const errorValue = jsonpointer.get(responseObj, pointer)
            if (errorValue) {
                const errorText = typeof errorValue === 'string' ? errorValue : JSON.stringify(errorValue)
                throw new Error(`response body indicated an error: ${errorText}`)
            }
        }
    }

    let outputs = {}
    for (const [outputKey, responsePointer] of Object.entries(outputsFromResponse)) {
        outputs[outputKey] = jsonpointer.get(responseObj, responsePointer)
    }

    return outputs
}

export default async ({unit: {source}, workspace}) => {
    const {baseRequest, queryInputs, pathInputs, bodyInput, demandStatus, outputsFromResponse, errorsFromResponse} = JSON.parse(source)
    return async (inputs={}) => {
        if (typeof inputs !== 'object') {
            throw new Error(`expected object with keys: ${[...queryInputs, ...pathInputs, bodyInput].filter(_ => _).join(", ")}`)
        }
        const {url, request} = fetchRequestFromInputs({baseRequest, queryInputs, pathInputs, bodyInput, inputs})
        const response = await fetch(url, request)
        const outputs = await outputsFromFetchResponse({ demandStatus, outputsFromResponse, errorsFromResponse, response})
        return outputs
    }
}


// import {testFetchJSONLoader} from './backend-fetch-json-test.js'

// export const test = async t => await testFetchJSONLoader(t, {fetchLoader})

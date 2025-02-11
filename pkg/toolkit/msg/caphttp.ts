import type { Caps } from './cap.ts'

async function demandResponseIsOK(response: Response) {
  if (!response.ok) {
    throw new Error(`response is not ok; status="${response.status} ${response.statusText}"; body=${JSON.stringify(await response.text())}`)
  }
}

export const CapWithURLBase: Caps['with-urlbase'] = async (env, msg) => {
  const urlbase = msg.urlbase
  return env.new({
    'read-urlbase': async (env, msg) => ({urlbase}),
  }).apply(null, {
    ...msg,
    cap: 'msg',
  } as any)
}

export const CapHTTP: Caps['http'] = async (env, msg) => {
  const {http: {request}} = msg
  let {method, body, headers, query, path, url} = request
  let input = url
  
  if (path) {
    const pathEntries = Object.entries(path)
    if (pathEntries.length > 0) {
      for (const [k, v] of pathEntries) {
        // path entries don't make much sense when null. so throw if we see one.
        if (v == null) {
          throw new Error(`got null path segment for {${k}}; url=${url}; request=${JSON.stringify(request)}`)
        }
        let t = `{${k}}`
        if (input.includes(t)) {
          input = input.replaceAll(t, encodeURIComponent(v))
        }
        t = `{${k}...}`
        if (input.includes(t)) {
          input = input.replaceAll(t, v)
        }
      }
    }
  }

  const {
    urlbase,
  } = await env.apply(null, {cap: 'read-urlbase'})
  
  input = new URL(input, urlbase).toString()
  
  if (query) {
    // set query if we have any
    const queryEntries = Object.entries(query)
    if (queryEntries.length > 0) {
      const u = new URL(input)
      for (const [k, v] of queryEntries) {
        // query entries don't make much sense when null. so skip if they are.
        if (v == null) {
          continue
        }
        u.searchParams.set(k, v)
      }
      input = u.toString()
    }
  }
  
  const headersEntries = Object.entries(headers || {}).flatMap(([k, vs]) => vs.map(v => [k, v] as [string, string]))

  let init: RequestInit = {
    method: method,
    headers: headersEntries,
  }
  
  // assume JSON for now.
  if (body) {
    init.body = JSON.stringify(body)
  }
  const returns = async (d: Response) => {
    await demandResponseIsOK(d)
    return {
      status: d.status,
      url: d.url,
      headers: Object.fromEntries(Array.from(d.headers.entries())),
      body: await d.json(),
    }
  }
  
  // console.log("http", {input, init, returns})
  return {
    ...msg,
    http: {
      ...msg.http,
      response: await returns(await fetch(input, init)),
    }
  }
}

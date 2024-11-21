export class StaticCommands {
  constructor(commands) {
    const index = {},
      runners = {};
    for (const [
      name,
      { description, parameters, returns, run },
    ] of Object.entries(commands)) {
      runners[name] = (parameters) => run(parameters);
      index[name] = { description, parameters, returns };
    }
    this.index = Promise.resolve(index);
    this.runners = runners;
  }
  async run(command, parameters) {
    return await this.runners[command](parameters);
  }
}

export class Msg {
  constructor(name, msg, {basehref}={}) {
    this.name = name
    this.msg = msg
    this.basehref = basehref
  }

  async run(parameters) {
    return (await run({msg: this.msg, data: {parameters}, basehref: this.basehref}))?.returns
  }
}

const urlSymbol = Symbol('url')

export class Reflector {
  constructor(url) {
    this.url = url || window.location.href;
  }

  get index() {
    return fetch(this.url, { method: "REFLECT" }).then(async (resp) => {
      await demandResponseIsOK(resp)
      const body = await resp.json()
      const commands = body.commands
      commands[urlSymbol] = resp.url
      return commands
    })
  }

  async reflect() {
    const index = await this.index
    return Object.fromEntries(Object.entries(index).map(([a, b]) => [a, new Msg(a, b, {basehref: index[urlSymbol]})]))
  }
}

export const ReflectCommands = Reflector

export async function reflect(url) {
  return await (new Reflector(url)).reflect()
}

function parsePointer(p) {
  if (p[0] !== "#" || p[1] !== "/") {
    throw new Error(`invalid pointer, must start with "#/", got: ${p}`)
  }
  return p.substring(2).split('/').map(s => s.replaceAll("~1", "/").replaceAll("~0", "~"))
}

function get(o, path) {
  const fragments = parsePointer(path)
  const v = fragments.reduce((acc, fragment) => acc && (Array.isArray(acc) ? acc[+fragment] : acc[fragment]), o)
  // console.log("get", o, path, "->", v)
  return v
}

function set(o, path, v) {
  const fragments = parsePointer(path)
  const last = fragments[fragments.length - 1]
  for (const fragment of fragments.slice(0, fragments.length - 1)) {
    if (!(fragment in o)) {
      o[fragment] = (/^[0-9]/.test(fragment)) ? [] : {}
    }
    o = o[fragment]
  }
  // console.log("set", o, path, "<-", v)
  o[last] = v
}

async function demandResponseIsOK(response) {
  if (!response.ok) {
    throw new Error(`response is not ok; status="${response.status} ${response.statusText}"; body=${JSON.stringify(await response.text())}`)
  }
}

function merge(dst, src, keypath=() => []) {
  // console.log("merge", dst, src)
  if (src !== undefined) {
    if (typeof src !== `object`) {
      throw new Error(`cannot merge keypath=${JSON.stringify([...keypath(), key])} dst=${JSON.stringify(dst)}; src=${JSON.stringify(src)}`)
    }

    for (let [key, srcVal] of Object.entries(src)) {
      const dstVal = dst[key]
      if (dstVal !== undefined) {
        srcVal = merge(dstVal, srcVal, () => [...keypath(), key])
      }
      dst[key] = srcVal
    }
  }
  return dst
}

function clone(o) {
  return structuredClone(o)
}

function pluck(bindings, src) {
  const dst = {}
  if (bindings) {
    for (const [dstPath, srcPath] of Object.entries(bindings)) {
      set(dst, dstPath, get(src, srcPath))
    }
  }

  console.log("pluck", dst, {bindings, src})
  return dst
}

async function runWithCtx(ctx, msg, data) {
    console.log("run", {msg, data})
    data = merge(msg.data ? clone(msg.data) : {}, data)

    if (msg.cap) {
      const cap = ctx.caps[msg.cap]
      if (!cap) {
        throw new Error(`cannot run: unknown capability; cap=${msg.cap}; msg=${JSON.stringify(msg)}`)
      }

      let {via, data: postData} = await cap(ctx, data)

      // Do we have something to recurse on? Do it!
      if (via) {
        postData = await runWithCtx(ctx, via, postData)
      }
      return postData
    } else if (msg.msg) {
      const preData = pluck(msg.msg_in, {data})?.msg?.data
      const postData = await runWithCtx(ctx, msg.msg, preData)
      // console.log({postData, 'msg.msg_out': msg.msg_out})
      return pluck(msg.msg_out, {msg: {data: postData}})?.data
    }
}

async function run({caps={http: HTTPCapability}, msg, data, basehref}) {
  return await runWithCtx({basehref, caps}, msg, data)
}

async function HTTPCapability(ctx, {request}) {
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
          input = input.replaceAll(t, v)
        }
        t = `{${k}...}`
        if (input.includes(t)) {
          input = input.replaceAll(t, encodeURIComponent(v))
        }
      }
    }
  }

  input = new URL(input, ctx.basehref).toString()

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

  let init = {
    method: method,
    headers: Object.entries(headers || {}).flatMap(([k, vs]) => vs.map(v => [k, v])),
  }

  // assume JSON for now.
  if (body) {
    init.body = JSON.stringify(body)
  }
  const returns = async d => {
    await demandResponseIsOK(d)
    return {
      status: d.status,
      headers: Object.fromEntries(Array.from(d.headers.entries())),
      body: await d.json(),
    }
  }

  // console.log("http", {input, init, returns})

  return {
    data: {
      response: await returns(await fetch(input, init))
    }
  }
}

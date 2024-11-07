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
  constructor(name, msg) {
    this.name = name
    this.msg = msg
  }

  async run(parameters) {
    return (await run({msg: this.msg, data: {parameters}}))?.returns
  }
}

export class Reflector {
  constructor(url) {
    this.url = url || window.location.href;
  }

  get index() {
    return fetch(this.url, { method: "REFLECT" }).then(async (resp) => {
      await demandResponseIsOK(resp)
      const body = await resp.json()
      return body.commands
    })
  }

  async reflect() {
    const index = await this.index
    return Object.fromEntries(Object.entries(index).map(([a, b]) => [a, new Msg(a, b)]))
  }
}

export const ReflectCommands = Reflector

export async function reflect(url) {
  return await (new Reflector(url)).reflect()
}

function parsePointer(p) {
  if (p[0] !== "#" || p[1] !== "/") {
    throw new Exception(`invalid pointer, must start with "#/", got: ${p}`)
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

function merge(dst, src) {
  // console.log("merge", dst, src)
  if (src) {
    for (const [key, val] of Object.entries(src)) {
      if (val !== null && typeof val === `object`) {
        dst[key] ??=new val.__proto__.constructor()
        merge(dst[key], val)
      } else {
        dst[key] = val
      }
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

  // console.log("pluck", dst, {bindings, src})
  return dst
}

async function runWithCaps(caps, msg, data) {
    // console.log("run", {msg, data})
    data = merge(msg.data ? clone(msg.data) : {}, data)

    if (msg.cap) {
      const cap = caps[msg.cap]
      if (!cap) {
        throw new Exception(`cannot run: unknown capability; cap=${msg.cap}; msg=${JSON.stringify(msg)}`)
      }

      let {via, data: postData} = await cap(data)

      // Do we have something to recurse on? Do it!
      if (via) {
        postData = await runWithCaps(caps, via, postData)
      }
      return postData
    } else if (msg.msg) {
      const preData = pluck(msg.msg_in, {data})?.msg?.data
      const postData = await runWithCaps(caps, msg.msg, preData)
      // console.log({postData, 'msg.msg_out': msg.msg_out})
      return pluck(msg.msg_out, {msg: {data: postData}})?.data
    }
}

async function run({caps={http: HTTPCapability}, msg, data}) {
  return await runWithCaps(caps, msg, data)
}

async function HTTPCapability({request: {method, body, headers, query, path, url: input}}) {
  if (path) {
    const pathEntries = Object.entries(path)
    if (pathEntries.length > 0) {
      for (const [k, v] of pathEntries) {
        let t = `{${k}}`
        if (input.contains(t)) {
          input = input.replaceAll(t, v)
        }
        t = `{${k}...}`
        if (input.contains(t)) {
          input = input.replaceAll(t, encodeURIComponent(v))
        }
      }
    }
  }

  if (query) {
    // set query if we have any
    const queryEntries = Object.entries(query)
    if (queryEntries.length > 0) {
      const u = new URL(input)
      for (const [k, v] of queryEntries) {
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

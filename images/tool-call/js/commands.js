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

export class ReflectCommand {
  constructor(name, def) {
    this.name = name
    this.parameters = {}
    this.def = def

    if (def.parameters) {
      const bound = def.run?.bind?.parameters
      for (const key in def.parameters) {
        if (!bound || typeof bound[key] === "undefined") {
          this.parameters[key] = def.parameters[key]
        }
      }
    }
  }

  async run(parameters) {
    return await run({command: this.def, parameters})
  }
}

export class ReflectCommands {
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
    return Object.fromEntries(Object.entries(index).map(([a, b]) => [a, new ReflectCommand(a, b)]))
  }

  async run(command, parameters) {
    return await run({url: this.url, command, parameters})
  }
}

function get(o, path) {
  const v = path.split('.').reduce((acc, fragment) => acc && acc[fragment], o)
  console.log("get", o, path, "->", v)
  return v
}

function set(o, path, v) {
  const fragments = path.split(".")
  const last = fragments[fragments.length - 1]
  for (const fragment of fragments.slice(0, fragments.length - 1)) {
    o = o[fragment] || {}
  }
  console.log("set", o, path, "<-", v)
  o[last] = v
}

async function demandResponseIsOK(response) {
  if (!response.ok) {
    throw new Error(`response is not ok; status="${response.status} ${response.statusText}"; body=${JSON.stringify(await response.text())}`)
  }
}

function prepareFetch({url, parameters={}, run: {bind = {}, http = {}} = {}}) {
  let returns = async d => (await demandResponseIsOK(d), await d.json())
  let input = http.request?.url || url
  let scope = {
    request: {
      method: http.request?.method || "POST",
      body: http.request?.body,
      headers: http.request?.headers || {},
      query: http.request?.query || {},
    },
  }

  console.log("before", {scope, http, parameters})

  // deep clone scope so we can modify as needed.
  scope = JSON.parse(JSON.stringify(scope))
  const bound = bind?.parameters || {}
  for (const pname in parameters) {
    if (!(pname in http.parameters)) {
      continue
    }
    set(scope, http.parameters[pname].path, bound[pname] !== undefined ? bound[pname] : parameters[pname])
  }

  for (const pname in bound) {
    set(scope, http.parameters[pname].path, bound[pname])
  }

  console.log("after", scope)

  if (http.returns) {
    returns = async (response) => {
      await demandResponseIsOK(response)
      const body = await response.json()
      const slotWithResponse = {...scope, response: {body}}
      const bound = bind?.returns || {}
      return Object.fromEntries(Object.entries(http.returns).map(([k, v]) => {
        return [k, bound[k] !== undefined ? bound[k] : get(slotWithResponse, v.path)]
      }))
    }
  }

  // set query if we have any
  const queryEntries = Object.entries(scope.request.query)
  if (queryEntries.length > 0) {
    const u = new URL(input)
    for (const [k, v] of queryEntries) {
      u.searchParams.set(k, v)
    }
    input = u.toString()
  }

  // assume JSON for now.
  let init = {
    method: scope.request.method,
    headers: Object.entries(scope.request.headers || {}).flatMap(([k, vs]) => vs.map(v => [k, v])),
    body: JSON.stringify(scope.request.body),
  }

  return [input, init, returns]
}

export async function run({url, command, parameters={}}) {
  var input, init, returns
  if (typeof command === 'string') {
    input = url
    init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, parameters }),
    }
    returns = async (d) => (await demandResponseIsOK(d), await d.json())
  } else if (command?.run?.http !== null) {
    [input, init, returns] = prepareFetch({url, parameters, run: command.run})
  } else {
    throw new Error(`invalid commands argument, must be string or {parameters, returns, run}: ${command}`)
  }

  console.log({input, init, returns})

  return await returns(await fetch(input, init));
}

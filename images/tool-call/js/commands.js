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
    this.def = def
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
    return fetch(this.url, { method: "REFLECT" }).then((resp) => resp.json()).then(body => body.commands);
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

function prepareFetch({url, parameters, def}) {
  let returns = async d => await d.json()
  let input = def.request?.url || url
  let scope = {
    request: {
      method: def.request?.method || "POST",
      body: def.request?.body,
      headers: def.request?.headers || {},
      query: def.request?.query || {},
    },
  }

  console.log("before", scope)

  if (def.parameters) {
    // deep clone scope so we can modify as needed.
    scope = JSON.stringify(JSON.parse(scope))
    for (const [pname, p] of Object.entries(def.parameters || {})) {
      set(scope, p.path, p.value !== undefined ? p.value : parameters[pname])
    }
  }

  console.log("after", scope)

  if (def.returns) {
    returns = async (response) => {
      const body = await response.json()
      const slotWithResponse = {...scope, response: {body}}
      return Object.fromEntries(Object.entries(def.returns).map(([k, v]) => {
        return [k, v.value !== undefined ? v.value : get(slotWithResponse, v.path)]
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

export async function run({url, command, parameters}) {
  var input, init, returns
  if (typeof command === 'string') {
    input = url
    init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, parameters }),
    }
    returns = async (d) => await d.json()
  } else if (command?.run?.http !== null) {
    [input, init, returns] = prepareFetch({url, parameters, def: command.run.http})
  } else {
    throw new Error(`invalid commands argument, must be string or {parameters, returns, run}: ${command}`)
  }

  console.log({input, init, returns})

  return await returns(await fetch(input, init));
}

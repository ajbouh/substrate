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

export class ReflectCommands {
  constructor(url) {
    this.url = url || window.location.href;
  }

  get index() {
    return fetch(this.url, { method: "REFLECT" }).then((resp) => resp.json());
  }

  async run(command, parameters) {
    return await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, parameters }),
    }).then((resp) => resp.json());
  }
}

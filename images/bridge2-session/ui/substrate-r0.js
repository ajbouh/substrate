export class StaticCommands {
    constructor(commands) {
        const index = {}, runners = {}
        for (const [name, {parameters, returns, run}] of Object.entries(commands)) {
            runners[name] = (parameters) => run(parameters) // TODO just set = run directly?
            index[name] = {parameters, returns}
        }
        this.index = Promise.resolve(index)
        this.runners = runners
    }
    async run(command, parameters) {
        return await this.runners[command](parameters)
    }
}

export class ReflectCommands {
    constructor(url) {
        this.url = url || window.location.href
    }

    get index() {
        return fetch(this.url, { method: "REFLECT" }).then(resp => resp.json());
    }

    async run(command, parameters) {
        return await fetch(this.url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ command, parameters }),
        }).then(resp => resp.json());
    }
}

// TODO chaining to combine static & dynamic commands, or multiples of each

window.substrate = {
    r0: {
        commands: {
            index: Promise.resolve({}),
            async run(command, parameters) { throw new Error("No commands available") },
        },
        setCommands(commands) {
            this.commands = new StaticCommands(commands)
        },
    }
}

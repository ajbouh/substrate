window.substrate = {
    r0: {
        commands: {
            index: {},
            runners: {},
            run(command, parameters) { return this.runners[command](parameters) },
        },
        setCommands(commands) {
            const index = {}, runners = {}
            for (const [name, {parameters, returns, run}] of Object.entries(commands)) {
                runners[name] = (parameters) => run(parameters)
                index[name] = {parameters, returns}
            }
            this.commands.index = index
            this.commands.runners = runners
        },
    }
}

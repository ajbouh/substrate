import type { DefIndex, Def, Args } from './defs.ts';

export interface Commands {
	index: Promise<DefIndex>;
	run: (command: string, args: Args) => Promise<any>;
}

type RunFunc = (parameters: any) => Promise<any>;
type Command = Def & { run: RunFunc };

export class StaticCommands implements Commands {
	index: Promise<DefIndex>;
	runners: Record<string, RunFunc>;

	constructor(commands: Record<string, Command>) {
		const index: DefIndex = {};
		const runners: Record<string, RunFunc> = {};
		for (const [name, { description, parameters, returns, run }] of Object.entries(commands)) {
			runners[name] = run;
			index[name] = { description, parameters, returns };
		}
		this.index = Promise.resolve(index);
		this.runners = runners;
	}

	async run(command: string, parameters: Args) {
		return await this.runners[command](parameters);
	}
}

export class ReflectCommands implements Commands {
	url: string;

	constructor(url: string) {
		this.url = url;
	}

	get index() {
		return fetch(this.url, { method: 'REFLECT' }).then((resp) => resp.json());
	}

	async run(command: string, parameters: Args) {
		return await fetch(this.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ command, parameters })
		}).then((resp) => resp.json());
	}
}

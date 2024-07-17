async function runCommand(command, parameters) {
	const resp = await fetch(window.location.href, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({ command, parameters }),
	});
	return await resp.json();
}

export const commands = {
	addAssistant: {
		parameters: {
			name: { description: "assistant name" },
			prompt_template: { description: "assistant prompt template" },
		},
		run({name, prompt_template}) {
			return runCommand("assistant:add", {name, prompt_template});
		},
	},
	removeAssistant: {
		parameters: {
			name: { description: "assistant name" },
		},
		run({name}) {
			return runCommand("assistant:remove", {name});
		},
	},

	reflect: {
		parameters: {},
		async run() {
			const resp = await fetch(window.location.href, {
				method: "REFLECT",
			});
			return await resp.json();
		},
	},

	workingSetAddURL: {
		parameters: {
			url: { description: "url" },
		},
		run({url}) {
			return runCommand("workingset:add_url", {url});
		},
	},
	workingSetList: {
		parameters: {},
		run() {
			return runCommand("workingset:list");
		},
	},
}

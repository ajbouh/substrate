export const commands = {
	addAssistant: {
		parameters: {
			name: { description: "assistant name" },
			prompt_template: { description: "assistant prompt template" },
		},
		run({name, prompt_template}) {
			return fetch(
				window.location.href + "/assistants/" + encodeURIComponent(name), {
				method: "POST",
				headers: {"Content-Type": "application/x-www-form-urlencoded"},
				body: new URLSearchParams({prompt_template}).toString(),
			});
		},
	},
	removeAssistant: {
		parameters: {
			name: { description: "assistant name" },
		},
		run({name}) {
			return fetch(
				window.location.href + "/assistants/" + encodeURIComponent(name), {
				method: "DELETE",
			});
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
			return fetch(window.location.href, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					command: "working_set_add_url",
					parameters: {url},
				}),
			});
		},
	},
	workingSetList: {
		parameters: {},
		async run() {
			const resp = await fetch(window.location.href, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					command: "working_set_list",
				}),
			});
			return await resp.json();
		},
	},
}

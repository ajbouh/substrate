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
}

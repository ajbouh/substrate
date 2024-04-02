export const commands = {
	addAssistant: {
		parameters: {
			name: { description: "assistant name" },
			system_prompt: { description: "assistant system prompt" },
		},
		run({name, system_prompt}) {
			return fetch(
				window.location.href + "/assistants/" + encodeURIComponent(name), {
				method: "POST",
				headers: {"Content-Type": "application/x-www-form-urlencoded",},
				body: new URLSearchParams({"system_prompt": prompt}).toString(),
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

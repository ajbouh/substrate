export class StaticCommands {
	constructor(commands) {
		const index = {},
			runners = {};
		for (const [name, { description, parameters, returns, run }] of Object.entries(commands)) {
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
		return fetch(this.url, { method: 'REFLECT' }).then((resp) => resp.json());
	}

	async run(command, parameters) {
		return await fetch(this.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ command, parameters })
		}).then((resp) => resp.json());
	}
}

export class IFrameCommands {
	constructor(expectedOrigin, iframe) {
		this.expectedOrigin = expectedOrigin;
		this.iframe = iframe;
		const resolver = new MessageResolver((msg) => {
			iframe.contentWindow.postMessage(msg, expectedOrigin);
		});
		this.resolver = resolver;
		this.cancelMessage = onWindowMessage(expectedOrigin, (msg) => {
			if (msg.source == iframe.contentWindow) {
				resolver.onMessage(msg);
			}
		});
	}

	close() {
		this.cancelMessage();
	}

	get index() {
		return this.resolver.send({ index: true });
	}

	async run(command, parameters) {
		return await this.resolver.send({ run: { command, parameters } });
	}
}

export function provideCommandsToIFrameParent(expectedOrigin, commands) {
	return messageChannelResponder(expectedOrigin, async (msg) => {
		if (msg.index != null) {
			return await commands.index;
		}
		if (msg.run != null) {
			const { command, parameters } = msg.run;
			return await commands.run(command, parameters);
		}
		// XXX or do we just ignore unrecognized messages?
		throw new Error(`Unrecognized message`);
	});
}

function onWindowMessage(expectedOrigin, run) {
	const cb = async (msg) => {
		if (msg.origin === expectedOrigin) {
			run(msg);
		}
	};
	window.addEventListener('message', cb, false);
	return () => window.removeEventListener('message', cb, false);
}

function messageChannelResponder(expectedOrigin, run) {
	return onWindowMessage(expectedOrigin, async (msg) => {
		const { id, message } = msg.data;
		try {
			const value = await run(message);
			msg.source.postMessage({ resolve: { id, value } }, expectedOrigin);
		} catch (reason) {
			msg.source.postMessage({ reject: { id, reason } }, expectedOrigin);
		}
	});
}

class MessageResolver {
	constructor(sendMessage) {
		this.msgID = 0;
		this.pending = {};
		this.sendMessage = sendMessage;
	}

	send(message) {
		const id = ++this.msgID;
		this.sendMessage({ id, message });
		return new Promise((resolve, reject) => {
			this.pending[id] = { resolve, reject };
		});
	}

	onMessage(msg) {
		if (msg.data.resolve) {
			const { id, value } = msg.data.resolve;
			const { resolve } = this.pending[id];
			delete this.pending[id];
			resolve(value);
		} else if (msg.data.reject) {
			const { id, reason } = msg.data.reject;
			const { reject } = this.pending[id];
			delete this.pending[id];
			reject(reason);
		}
	}
}

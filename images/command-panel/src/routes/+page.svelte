<script lang="ts">
	import type { DefIndex, Call } from '$lib/defs.ts';
	import { CommandPanel, ReflectCommands, IFrameCommands } from '$lib';

	let toolCall = new ReflectCommands('https://substrate.home.arpa/tool-call/commands');
	async function suggest(input: string, commands: DefIndex) {
		if (!input) {
			return Object.entries(commands).map(([key, def]) => [key, def, {}]);
		}
		const r = await toolCall.run('suggest', { input, commands });
		return r.choices.flatMap((call: Call) => {
			const def = commands[call.command];
			if (!def) return [];
			return [[call.command, def, call.parameters]];
		});
	}

	let commands = $state();
	let iframe;
	let iframeReady = $state(false);
	$effect(() => {
		if (!iframe || iframeReady) {
			return;
		}
		iframeReady = true;
		iframe.addEventListener('load', () => {
			// TODO when loading a new page, we should reset the commands
			commands = new IFrameCommands(expectedOrigin, iframe);
		});
	});
	let location = $state('');
	let expectedOrigin = $derived.by(() => {
		try {
			const url = new URL(location);
			return url.origin;
		} catch (e) {
			return '';
		}
	});
</script>

<section>
	<input type="text" bind:value={location} /><button
		disabled={!iframeReady}
		onclick={() => {
			iframe.src = location;
		}}>Go</button
	>
	<iframe bind:this={iframe} width="100%" height="400"></iframe>

	<CommandPanel {commands} />
</section>

<style>
	:global(body) {
		background: blue;
	}
</style>

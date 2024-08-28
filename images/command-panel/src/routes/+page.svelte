<script lang="ts">
	import type { DefIndex, Call } from '$lib/defs.ts';
	import { CommandPanel, ReflectCommands } from '$lib';

	let toolCall = new ReflectCommands('https://substrate.home.arpa/tool-call/commands');
	async function toolSuggest(input: string, commands: DefIndex) {
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

	let location = $state('http://localhost:8081');
	let iframe_src = $state(location);
	let commands = $derived.by(() => {
		if (!iframe_src) {
			return null;
		}
		return new ReflectCommands(iframe_src);
	});

	let suggest = toolSuggest;
</script>

<section>
	<input type="text" bind:value={location} /><button
		onclick={() => {
			iframe_src = location;
		}}>Go</button
	>
	<iframe src={iframe_src} width="100%" height="400"></iframe>
</section>

<section>
	<CommandPanel {commands} {suggest} expand />
</section>

<style>
	section {
		height: 50dvh;
	}
</style>

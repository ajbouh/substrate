<svelte:options customElement="command-panel" />

<script lang="ts">
	import type { Commands, Def, DefIndex, Call } from '$lib/defs.ts';
	import { ReflectCommands } from './substrate-r0.js';
	import Command from './Command.svelte';
	import Prompt from './Prompt.svelte';
	let { commands = null as Commands | null, open = $bindable(false) } = $props();
	let results: { command: string; properties: Record<string, any>; result: any }[] = $state([]);
	async function run(command: string, properties: Record<string, any>) {
		if (!commands) return;
		let result = commands.run(command, properties);
		results.push({ command, properties, result });
	}
	let index = $state({} as DefIndex);
	$effect(() => {
		commands?.index.then((x) => {
			index = x;
		});
	});
	let search = $state('');
	function filter(key: string, def: Def) {
		if (!search) return true;
		let lower = search.toLowerCase();
		return key.toLowerCase().includes(lower) || def.description.toLowerCase().includes(lower);
	}
	let items = $derived.by(() => {
		// TODO can use the search as a natural-language input to AI-matcher
		// this can return richer results, ranking, filling props, etc.
		return Object.entries(index).filter(([key, value]) => filter(key, value));
	});
	let toolCall = new ReflectCommands('https://substrate.home.arpa/tool-call/commands');
	async function suggest(input: string): Call[] {
		if (!input) return [];
		const r = await toolCall.run('suggest', { input, commands: index });
		return r.choices;
	}
	let suggestions = $derived.by(async () => {
		const choices = await suggest(search);
		const top = choices.flatMap((call) => {
			const def = index[call.command];
			if (!def) return [];
			return [[call.command, def, call.parameters]];
		});
		const rest = Object.entries(index)
			.filter(([key]) => !top.some(([k]) => k === key))
			.map(([key, def]) => [key, def, {}]);
		return top.concat(rest);
	});
</script>

<div class="command-panel" class:open>
	<Prompt bind:search items={suggestions}>
		{#snippet row([key, def, defaults], selected)}
			<div class:selected>
				<Command name={key} {def} {defaults} run={(props) => run(key, props)} />
			</div>
		{/snippet}
	</Prompt>

	<div>
		{#each results as result (result.command)}
			<div>
				<b>{result.command}</b>(<tt>{JSON.stringify(result.properties, null, 2)}</tt>)
				<pre>
					{#await result.result}
						(Running...)
					{:then value}
						{JSON.stringify(value, null, 2)}
					{:catch error}
						Failed: {error.message}
					{/await}
				</pre>
			</div>
		{/each}
	</div>
</div>

<style>
	.command-panel {
		background: white;
		color: black;

		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 0;
		padding: 1em;
		overflow: auto;
	}
	.command-panel.open {
		height: 80%;
		width: 80%;
	}
	.command-panel.open .commands {
		display: block;
	}
	.commands {
		display: none;
	}
</style>

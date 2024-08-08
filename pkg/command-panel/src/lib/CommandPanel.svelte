<svelte:options customElement="command-panel" />

<script lang="ts">
	import type { Commands, Def, DefIndex } from '$lib/defs.ts';
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
</script>

<div class="command-panel" class:open>
	<Prompt bind:search {items}>
		{#snippet row([key, def], selected)}
			<Command name={key} {def} run={(props) => run(key, props)} />
				{selected}
		{/snippet}
	</Prompt>

	{#each results as result}
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

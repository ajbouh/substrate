<svelte:options customElement="command-panel" />

<script lang="ts">
	import type { Commands, Def, DefIndex, Call } from '$lib/defs.ts';
	import Command from './Command.svelte';
	import Prompt from '$lib/Prompt.svelte';

	function filter(key: string, def: Def) {
		if (!search) return true;
		let lower = search.toLowerCase();
		return key.toLowerCase().includes(lower) || def.description.toLowerCase().includes(lower);
	}
	async function simpleSuggest(search: string, commands: DefIndex) {
		return Object.entries(commands)
			.filter(([key, def]) => filter(key, def))
			.map(([key, def]) => [key, def, {}] as [string, Def, Record<string, any>]);
	}

	let { expand = false, commands = null as Commands | null, suggest = simpleSuggest } = $props();

	let search = $state('');
	let focused = $state(false);
	let open = $derived(expand || focused || search);

	let results: { prompt: string; command: string; properties: Record<string, any>; result: any }[] =
		$state([]);
	async function run(command: string, properties: Record<string, any>) {
		if (!commands) return;
		let prompt = $state.snapshot(search);
		let result = commands.run(command, properties);
		results.unshift({ prompt, command, properties, result });
		search = '';
	}
	let index = $state({} as DefIndex);
	$effect(() => {
		commands?.index.then((x) => {
			index = x;
		});
	});
	let suggestions = $derived(suggest(search, index));
	let numitems = $state(0);
	$effect(() => {
		suggestions.then((s) => {
			numitems = s.length;
		});
	});
	let selected = $state(0);
	$inspect('selected', selected)
	let currCommand = $state() as Command | null;
</script>

<div class="command-panel" class:open class:overlay={!expand}>
	{#snippet row([key, def, defaults], selected)}
		<div class="command" class:selected>
			{#if selected}
				<Command
					bind:this={currCommand}
					name={key}
					{def}
					{defaults}
					onrun={(props) => run(key, props)}
				/>
			{:else}
				<Command name={key} {def} {defaults} onrun={(props) => run(key, props)} />
			{/if}
		</div>
	{/snippet}

	<Prompt
		bind:search
		bind:selected
		{numitems}
		onenter={() => {
			currCommand?.run();
		}}
		onfocus={() => focused = true}
		onblur={() => focused = false}
	/>

	{#if open}
		{#await suggestions then items}
			{#each items as item, idx (item)}
				{@render row(item, idx === selected)}
			{/each}
		{/await}

		<div>
			{#each results as result}
				<div>
					<hr>
					{#if result.prompt}
						{'>'} <em>{result.prompt}</em><br />
					{/if}
					<tt
						>{result.command}({JSON.stringify(result.properties, null, 2)})</tt>
						{#await result.result}
							(Running...)
						{:then value}
							<pre>{JSON.stringify(value, null, 2)}</pre>
						{:catch error}
							Failed: {error.message}
						{/await}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.command-panel {
		background: white;
		color: black;
		padding: 1em;
		overflow: auto;
		height: 100%;
	}
	.command-panel.overlay {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 10em;
		height: auto;
		border: 1px solid black;
	}
	.command-panel.overlay.open {
		width: 80%;
		height: 80%;
	}
	.command.selected {
		background: #b5e9b7;
	}
</style>

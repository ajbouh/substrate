<svelte:options customElement="command-panel" />

<script lang="ts">
	import type { Commands, Def, DefIndex, Call } from '$lib/defs.ts';
	import Command from './Command.svelte';

	function filter(key: string, def: Def) {
		if (!search) return true;
		let lower = search.toLowerCase();
		return key.toLowerCase().includes(lower) || def.description.toLowerCase().includes(lower);
	}
	function simpleSuggest(search: string, commands: DefIndex) {
		return Object.entries(commands)
			.filter(([key, def]) => filter(key, def))
			.map(([key, def]) => [key, def, {}] as [string, Def, Record<string, any>]);
	}

	let { commands = null as Commands | null, suggest = simpleSuggest } = $props();

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
	let suggestions = $derived(suggest(search, index));
	let focused = $state(false);
	let open = $derived(focused || search);
</script>

<div class="command-panel" class:open>
	{#snippet row([key, def, defaults], selected)}
		<div class:selected>
			<Command name={key} {def} {defaults} run={(props) => run(key, props)} />
		</div>
	{/snippet}

	<div class="search">
		<input
			size={open ? 100 : 20}
			type="search"
			bind:value={search}
			placeholder="Search commands..."
			onfocus={() => {
				focused = true;
			}}
			onblur={() => {
				focused = false;
			}}
		/>
	</div>

	{#if open}
		{#await suggestions then items}
			{#each items as item, idx (item)}
				{@render row(item, false)}
			{/each}
		{/await}

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
	{/if}
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

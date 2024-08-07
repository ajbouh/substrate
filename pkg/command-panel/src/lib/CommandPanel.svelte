<svelte:options customElement="command-panel" />

<script lang="ts">
	import type { Commands, Def, DefIndex } from '$lib/defs.ts';
	import Command from './Command.svelte';
	let { commands = null }: { commands: Commands | null } = $props();
	let results: { command: string; properties: Record<string, any>; result: any }[] = $state([]);
	async function run(command: string, properties: Record<string, any>) {
		if (!commands) return;
		let result = commands.run(command, properties);
		results.push({ command, properties, result });
	}
	let index = $derived(commands?.index || new Promise<DefIndex>(() => {}));
	let search = $state('');
	function filter(key: string, def: Def) {
		if (!search) return true;
		let lower = search.toLowerCase();
		return key.toLowerCase().includes(lower) || def.description.toLowerCase().includes(lower);
	}
	let focused = $state(false);
	let open = $derived(focused || search);
</script>

<div class="command-panel" class:open>
	<div class="search">
		<input
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

	<div class="commands">
		{#await index}
			<p>Loading...</p>
		{:then index}
			{#each Object.keys(index) as key}
				{#if filter(key, index[key])}
					<Command name={key} def={index[key]} run={(props) => run(key, props)} />
				{/if}
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
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

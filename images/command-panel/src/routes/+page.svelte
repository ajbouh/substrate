<script lang="ts">
	import type { DefIndex, Call } from '$lib/defs.ts';
	import { CommandPanel, ReflectCommands, IFrameCommands } from '$lib';
	import Command from '$lib/Command.svelte';
	import Prompt from '$lib/Prompt.svelte';

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

	let suggest = toolSuggest;

	let results: { prompt: string; command: string; properties: Record<string, any>; result: any }[] =
		$state([]);
	async function run(command: string, properties: Record<string, any>) {
		if (!commands) return;
		let prompt = $state.snapshot(search);
		let result = commands.run(command, properties);
		results.push({ prompt, command, properties, result });
		search = '';
	}
	let index = $state({} as DefIndex);
	$effect(() => {
		commands?.index.then((x) => {
			index = x;
		});
	});
	let search = $state('');
	let suggestions = $derived(suggest(search, index));
	let numitems = $state(0);
	$effect(() => {
		suggestions.then((s) => {
			numitems = s.length;
		});
	});
	let selected = $state(0);
	let currCommand = $state();
	$inspect(currCommand);
</script>

<section>
	<input type="text" bind:value={location} /><button
		onclick={() => {
			iframe_src = location;
		}}>Go</button
	>
	<iframe src={iframe_src} width="100%" height="400"></iframe>

	<!-- <CommandPanel {commands} /> -->
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

	<div>
		{#each results as result}
			<div>
				{#if result.prompt}
					{'>'} <em>{result.prompt}</em><br />
				{/if}
				<tt
					>{result.command}(<tt>{JSON.stringify(result.properties, null, 2)}</tt>)
					{#await result.result}
						(Running...)
					{:then value}
						<pre>{JSON.stringify(value, null, 2)}</pre>
					{:catch error}
						Failed: {error.message}
					{/await}
				</tt>
			</div>
		{/each}
	</div>

	<Prompt
		bind:search
		bind:selected
		{numitems}
		onenter={() => {
			currCommand?.run();
		}}
	/>

	{#await suggestions then items}
		{#each items as item, idx (item)}
			{@render row(item, idx === selected)}
		{/each}
	{/await}
</section>

<style>
	input[type='search'] {
		width: 100%;
	}
	.command.selected {
		background: #b5e9b7;
	}
</style>

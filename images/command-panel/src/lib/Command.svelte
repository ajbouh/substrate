<script lang="ts">
	import type { Def } from '$lib/defs.ts';
	let {
		name,
		def,
		defaults,
		run
	}: {
		name: string;
		def: Def;
		defaults: Record<string, any>;
		run: (props: Record<string, any>) => void;
	} = $props();
	let paramDefs = $derived(def.parameters ? Object.values(def.parameters) : []);
	let zeros = $derived(Object.fromEntries(paramDefs.map(({ name }) => [name, null])));
	let defined = $state({ ...defaults } as { [key: string]: any });
	let params = $derived({ ...zeros, ...defined });
</script>

<div>
	<hr />
	<p>
		<button onclick={() => run(params)}>{name}</button>
		{def.description}
	</p>
	<tt>{'{'}</tt>
	{#each paramDefs as param (param.name)}
		<p>
			<tt>{JSON.stringify(param.name)}: </tt>
			{#if param.type === 'boolean'}
				<input type="checkbox" bind:checked={defined[param.name]} />
			{:else if param.type === 'number'}
				<input type="number" bind:value={defined[param.name]} />
			{:else}
				<input type="text" bind:value={defined[param.name]} />
			{/if}
			[{param.type}]: {param.description}
		</p>
	{/each}
	<tt>{'} -> {'}</tt>
	{#each Object.values(def.returns) as ret}
		<p><tt>{JSON.stringify(ret.name)}:</tt> [{ret.type}]: {ret.description}</p>
	{/each}
	<tt>{'}'}</tt>
</div>

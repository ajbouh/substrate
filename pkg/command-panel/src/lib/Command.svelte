<script lang="ts">
	import type { Def } from '$lib/defs.ts';
	let { name, def, run }: { name: string; def: Def; run: (props: Record<string, any>) => void } =
		$props();
	let paramDefs = $derived(def.parameters ? Object.values(def.parameters) : []);
	let defaults = $derived(Object.fromEntries(paramDefs.map(({ name }) => [name, null])));
	let defined = $state({} as { [key: string]: any });
	let params = $derived({ ...defaults, ...defined });
</script>

<div>
	<h2>
		{name}
	</h2>
	<p>{def.description}</p>
	<h3>Parameters</h3>
	<button onclick={() => run(params)}>Call</button>
	<pre>{JSON.stringify(params)}</pre>
	{#each paramDefs as param (param.name)}
		<p>
			{#if param.type === 'boolean'}
				<input type="checkbox" bind:checked={defined[param.name]} />
			{:else if param.type === 'number'}
				<input type="number" bind:value={defined[param.name]} />
			{:else}
				<input type="text" bind:value={defined[param.name]} />
			{/if}
			{param.name} [{param.type}]: {param.description}
		</p>
	{/each}
	<h3>Returns</h3>
	{#each Object.values(def.returns) as ret}
		<p>{ret.name} [{ret.type}]: {ret.description}</p>
	{/each}
</div>

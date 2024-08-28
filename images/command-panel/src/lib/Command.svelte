<script lang="ts">
	import type { Def } from '$lib/defs.ts';
	let {
		name,
		def,
		defaults,
		onrun
	}: {
		name: string;
		def: Def;
		defaults: Record<string, any>;
		onrun: (props: Record<string, any>) => void;
	} = $props();
	let paramDefs = $derived(def.parameters ? Object.values(def.parameters) : []);
	let zeros = $derived(Object.fromEntries(paramDefs.map(({ name }) => [name, null])));
	let defined = $state({ ...defaults } as { [key: string]: any });
	let params = $derived({ ...zeros, ...defined });
	export function run() {
		onrun(params);
	}
</script>

<div>
	<tt title={def.description}>{name}{'({'}</tt>
	{#each paramDefs as param, index (param.name)}
		<tt title="[{param.type}] {param.description}">
			{#if index > 0},
			{/if}
			{JSON.stringify(param.name)}:
		</tt>
		{#if param.type === 'boolean'}
			<input type="checkbox" bind:checked={defined[param.name]} />
		{:else if param.type === 'number'}
			<input type="number" bind:value={defined[param.name]} />
		{:else}
			<input type="text" bind:value={defined[param.name]} />
		{/if}
	{/each}
	<tt>{'})'}</tt>
</div>

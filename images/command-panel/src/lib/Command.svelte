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
	let paramDefs = $derived(def.parameters ? Object.entries(def.parameters) : []);
	let zeros = $derived(Object.fromEntries(paramDefs.map(([name]) => [name, null])));
	let defined = $state({ ...defaults } as { [key: string]: any });
	let params = $derived({ ...zeros, ...defined });
	export function run() {
		onrun(params);
	}
</script>

<div>
	<tt title={def.description}>{name}{'({'}</tt>
	{#each paramDefs as [paramName, param], index (paramName)}
		<tt title="[{param.type}] {param.description}">
			{#if index > 0},
			{/if}
			{JSON.stringify(paramName)}:
		</tt>
		{#if param.type === 'boolean'}
			<input type="checkbox" bind:checked={defined[paramName]} />
		{:else if param.type === 'number'}
			<input type="number" bind:value={defined[paramName]} />
		{:else}
			<input type="text" bind:value={defined[paramName]} />
		{/if}
	{/each}
	<tt>{'})'}</tt>
</div>

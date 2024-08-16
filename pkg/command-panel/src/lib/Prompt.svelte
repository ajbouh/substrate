<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	let {
		search = $bindable(''),
		selected = $bindable(null),
		items,
		row
	}: {
		search: string;
		selected: number | null;
		items: Promise<T[]>;
		row: Snippet<[T, boolean]>;
	} = $props();
	// TODO keyboard nav
	let numitems = 0;
	$effect(() => {
		items.then((x) => {
			numitems = x.length;
		});
	});
	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				if (numitems == 0) {
					selected = null;
					return;
				}
				if (selected === null) {
					selected = numitems - 1;
				} else {
					selected = (selected - 1 + numitems) % numitems;
				}
				break;
			case 'ArrowDown':
				if (numitems == 0) {
					selected = null;
					return;
				}
				if (selected === null) {
					selected = 0;
				} else {
					selected = (selected + 1) % numitems;
				}
				break;
			default:
				break;
		}
	}
</script>

<div class="search">
	<input {onkeydown} type="search" bind:value={search} placeholder="Search commands..." />
</div>

{#await items then items}
	{#each items as item, idx (item)}
		{@render row(item, selected === idx)}
	{/each}
{/await}

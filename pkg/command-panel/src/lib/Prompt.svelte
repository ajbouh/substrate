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
		items: T[];
		row: Snippet<[T, bool]>;
	} = $props();
	// TODO keyboard nav
	function onkeydown(event: KeyboardEvent) {
		console.log(event.key);
		switch (event.key) {
			case 'ArrowUp':
				if (items.length == 0) {
					selected = null;
					return;
				}
				if (selected === null) {
					selected = items.length - 1;
				} else {
					selected = (selected - 1 + items.length) % items.length;
				}
				break;
			case 'ArrowDown':
				if (items.length == 0) {
					selected = null;
					return;
				}
				if (selected === null) {
					selected = 0;
				} else {
					selected = (selected + 1) % items.length;
				}
				break;
			default:
				break;
		}
	}
</script>

<div class="search">
	<input {onkeydown} type="search" bind:value={search} placeholder="Search commands..." />
	{selected}
</div>

{#each items as item, idx (item)}
	{@render row(item, selected === idx)}
{/each}

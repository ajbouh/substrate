<script lang="ts" generics="T">
	let {
		search = $bindable(''),
		selected = $bindable(null),
		numitems,
		onenter = () => {}
	}: {
		search: string;
		selected: number | null;
		numitems: number;
		onenter: (selected: number) => void;
	} = $props();
	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
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
				event.preventDefault();
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
			case 'Enter':
				event.preventDefault();
				if (selected !== null) {
					onenter(selected);
				}
			default:
				break;
		}
	}
</script>

<div class="search">
	<input {onkeydown} type="search" bind:value={search} />
</div>

<style>
	input {
		width: 100%;
	}
</style>

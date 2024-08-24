<script lang="ts">
	import { goto } from '$app/navigation'
	import "../app.css";
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'

	export let data

	const user$ = writable(data.user)
	setContext('user', user$)

	let command$ = writable()
	setContext('command', command$)

	$: console.log({$command$, data})
</script>
<slot />

<script lang="ts">
	import { goto } from '$app/navigation'
	import "../app.css";
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import CommandPalette2 from '$lib/CommandPalette2.svelte'
	import type { CommandSelection } from '$lib/activities'
	import { getCommandSet } from '$lib/activities'

	export let data

	const user$ = writable(data.user)
	setContext('user', user$)

	let command$ = writable()
	setContext('command', command$)


	function getCommands(commandSelection?: CommandSelection) {
		const { context, commands } = getCommandSet(data.services, commandSelection)
		return commands
	}

	$: console.log({$command$, data})
</script>
<slot />
<CommandPalette2
	bind:this={$command$}
	{getCommands}
	on:selected={async ({detail}) => {
		const action = detail.action

		if (action.children?.length) {
			return
		}

		(async () => {
			if (action.request.href) {
				goto(await action.request.href())
			} else {
				const response = await action.request.run({fetch: (a, b) => window.fetch(a, b)})
				console.log({response})
			}
		})()

		$command$.close()
	}}
	/>

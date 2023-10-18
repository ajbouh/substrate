<script lang="ts">
	import type { CommandSelection } from '$lib/activities'
  // import { NinjaKeys } from 'ninja-keys'
	import type { INinjaAction } from 'ninja-keys'
	
	import { tick, onMount, createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	export let getCommands: (commandSelection?: CommandSelection) => INinjaAction[]

	let nk

	export function open(commandSelection?: CommandSelection) {
		if (!nk) {
			return
		}
		nk.data = getCommands(commandSelection)
		nk.open()
	}

	export function close() {
		if (!nk) {
			return
		}
		nk.close()
	}

	function onEvent(ev) {
		dispatch(ev.type, ev.detail)
	}

	onMount(() => {
		(async () => {
			await import('ninja-keys')
			await tick()
	
			nk.addEventListener('change', onEvent)
			nk.addEventListener('selected', onEvent)
		})()
		
		return () => {
			if (!nk) {
				return
			}
			nk.removeEventListener('change', onEvent)
			nk.removeEventListener('selected', onEvent)
		}
	})

</script>

<ninja-keys noAutoLoadMdIcons bind:this={nk}></ninja-keys>

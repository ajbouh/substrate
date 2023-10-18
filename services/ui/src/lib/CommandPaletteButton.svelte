<script lang="ts">
  import type { CommandSelection } from '$lib/activities'
  import { getContext } from 'svelte'

	const command$: any = getContext('command')

  let className = ''
  export { className as class }
  export let selection: CommandSelection | undefined = undefined
</script>
<span class={className}>
  <button
    on:click={() => $command$.open(selection)}
    class="flex items-center rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
  >⌘
  </button>
</span>

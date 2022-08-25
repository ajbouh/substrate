<script lang="ts">
	import { createMenu } from 'svelte-headlessui'
	import Transition from 'svelte-transition'

  import EllipsisVertical from '$lib/icons/EllipsisVertical.svelte'

  // import Archive from './Archive.svelte'
	// import ChevronDown from './ChevronDown.svelte'
	// import Delete from './Delete.svelte'
	// import Duplicate from './Duplicate.svelte'
	// import Edit from './Edit.svelte'
	// import Move from './Move.svelte'

	const menu = createMenu({ label: 'Actions' })

  $: console.log({ $menu })

	function onSelect(e: Event) {
		console.log('select', (e as CustomEvent).detail)
	}

	// prettier-ignore
	export let groups: {icon: any, text?: string, value?: any, props?: Record<string, unknown>}[][] = [
		[
		// 	{ icon: Edit, text: `Edit` },
		// 	{ icon: Duplicate, text: `Duplicate` },
		// ], [
		// 	{ icon: Archive, text: `Archive` },
		// 	{ icon: Move, text: `Move` },
		// ], [
		// 	{ icon: Delete, text: `Delete` },
		],
	]

  let className = "flex items-center rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
  export { className as class }

  export let iconClass = ''
  export let iconInactiveClass = ""
  export let iconActiveClass = ""
</script>

<div
    class="relative inline-block text-left"
    >
  <div>
    <button
        type="button"
        class={className}
        use:menu.button
        on:select={onSelect}
        >
      <EllipsisVertical class="h-5 w-5" />
    </button>
  </div>
  <Transition
    show={$menu.expanded}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <div
      use:menu.items
      class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
      {#each groups as group}
        <div class="px-1 py-1">
          {#each group as option, i}
            {@const active = $menu.active === option.value}
            <button
              use:menu.item={{value: option.value}}
              class="rounded-md items-center w-full {active ? 'text-gray-900 bg-gray-100' : 'text-gray-700'}"
              >
              <!-- {/*class="group flex  w-full px-2 py-2 text-sm {active ? 'bg-violet-500 text-white' : 'text-gray-900'}"*/} -->
              <svelte:component this={option.icon} class="w-5 h-5 mr-2 {iconClass} {active ? iconActiveClass : iconInactiveClass}" {...option.props}/>
              {#if option.text}{option.text}{/if}
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </Transition>
</div>

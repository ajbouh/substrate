<script lang="ts">
  import { getContext } from 'svelte'
  import CommandPaletteButton from '$lib/CommandPaletteButton.svelte'
  import Ago from '$lib/Ago.svelte'
  import Star from '$lib/icons/Star.svelte'
  import { urls } from '$lib/activities'

  export let data
  $: ({
    owner,
    created_at,
    forked_from_id,
    space,
    spaceColor = 'unset',
    memberships,
  } = data)

  // function fmtDate(date) {
  //   return new Intl.DateTimeFormat('en-US', {
  //       day: '2-digit',
  //       month: 'short',
  //       year: 'numeric',
  //     }).format(date)
  // }
  const user$ = getContext('user')

  $: isThisMine = owner == $user$

  $: starCount = (memberships || []).reduce((acc, o) => o.collection_name === 'user:starred' ? acc + 1 : acc, 0)

</script>

<div>
  <div class="group">
    <div style="border-color: {spaceColor};" class="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 border-2 group-hover:scale-105 group-hover:transition-all group-hover:shadow-md group-hover:shadow-2xl">
      <a href="{urls.ui.space({space})}">
        <img src="{urls.api.thumbnailPreviewURL({space})}" alt="" class="object-cover object-center">
      </a>
    </div>
  </div>
  <div class="mt-4 flex items-center justify-between space-x-2 text-base font-medium text-gray-900">
    <h3 class="overflow-hidden truncate">
      <a
        href="{urls.ui.space({space})}"
        class="truncate text-ellipsis"
        >{space}</a>
    </h3>
    <CommandPaletteButton
      selection={{user: $user$, space: data}}
    />
  </div>
  <div class="flex">
    <p class="flex-grow mt-1 font-medium text-sm text-gray-700"><a href="{urls.ui.user({user: owner})}">{isThisMine ? 'You' : owner}</a></p>
  </div>
  <div class="flex text-sm">
    <span class="text-gray-500"><Ago time={created_at}/></span>
    <span class="text-gray-300 mx-2">&middot;</span>
    <span class="inline-flex items-center text-gray-400 font-medium text-sm">{#if starCount > 0}<Star outline={false} class="mr-1 -ml-0.5 w-4 h-4 inline text-gray-400" /> {starCount}{/if}</span>
  </div>
  <p class="mt-1 text-sm text-gray-400 truncate">{#if forked_from_id && forked_from_id !== "scratch"}Fork of <a href="{urls.ui.space({space: forked_from_id})}" class="truncate">{forked_from_id}</a>{:else}&nbsp;{/if}</p>
</div>

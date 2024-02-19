<script lang="ts">
  import { getContext } from 'svelte'
  import CommandPaletteButton from '$lib/CommandPaletteButton.svelte'
  import { urls } from '$lib/activities'

  export let data


  // function fmtDate(date) {
  //   return new Intl.DateTimeFormat('en-US', {
  //       day: '2-digit',
  //       month: 'short',
  //       year: 'numeric',
  //     }).format(date)
  // }
  const user$ = getContext('user')

  // $: isThisMine = owner == $user$

</script>

<div>
  <div class="group">
    <div class="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 border-2 group-hover:scale-105 group-hover:transition-all group-hover:shadow-md group-hover:shadow-2xl">
      <a href="{urls.ui.service({name: data.name})}">
        <!-- <img src="{urls.api.thumbnailPreviewURL({space})}" alt="" class="object-cover object-center"> -->
      </a>
    </div>
  </div>
  <div class="mt-4 flex items-center justify-between space-x-2 text-base font-medium text-gray-900">
    <h3 class="overflow-hidden truncate">
      <a
        href="{urls.ui.service({name: data.name})}"
        class="truncate text-ellipsis"
        >{data.label}</a>
    </h3>
    <CommandPaletteButton
      selection={{user: $user$, service: data}}
    />
  </div>
</div>

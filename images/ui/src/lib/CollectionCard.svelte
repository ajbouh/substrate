<script lang="ts">
  import { getContext } from 'svelte'
  import { urls } from '$lib/activities'

  export let data
  $: ({
    owner,
    name,
    label,
    members,
  } = data)

  const user$ = getContext('user')

  $: isThisMine = owner == $user$

</script>

<div>
  <div class="group">
    <div class="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 border-2 group-hover:scale-105 group-hover:transition-all group-hover:shadow-md group-hover:shadow-2xl">
      <a href="{urls.ui.collection({owner, name})}">
        <!-- <img src="{urls.api.thumbnailPreviewURL({space})}" alt="" class="object-cover object-center"> -->
        <div class="object-cover object-center"></div>
      </a>
    </div>
  </div>
  <div class="mt-4 flex items-center justify-between space-x-2 text-base font-medium text-gray-900">
    <h3 class="overflow-hidden truncate">
      <a href="{urls.ui.collection({owner, name})}">
        <span class="overflow-hidden truncate font-medium">
          {label}
        </span>
        <span class="text-gray-400 font-medium">
          ({members.length})
        </span>
      </a>
    </h3>
  </div>
  <div class="flex">
    <p class="flex-grow mt-1 font-medium text-sm text-gray-700"><a href="{urls.ui.user({user: owner})}">{isThisMine ? 'You' : owner}</a></p>
  </div>
</div>

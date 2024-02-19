<script>
  import { getContext } from 'svelte'
  import { urls } from '$lib/activities'

  const user$ = getContext('user')

  $: isThisMine = data.owner == $user$

  export let data

  console.log({ data })

  $: console.log({ isThisMine })

</script>

<iframe class="mx-auto px-6 max-w-7xl flex-grow w-full" src="{urls.api.spaceExploreURL({ space: data.space })}"></iframe>

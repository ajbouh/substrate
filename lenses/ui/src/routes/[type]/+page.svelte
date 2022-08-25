<script>
  import EntitySelections from '$lib/EntitySelections.svelte'
  export let data

  $: console.log({ route: "[type]/+page.svelte", data })
</script>
<EntitySelections selections={data.selections} />

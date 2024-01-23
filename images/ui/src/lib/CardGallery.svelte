<script lang="ts">
  export let Card

  export let cards: Record<string, any>[] = []
  export let sortCardsBy: string | undefined = undefined
  let sortedCards: typeof cards

  $: if (sortCardsBy) {
    sortedCards = [...cards]
    sortedCards.sort((a, b) => b[sortCardsBy] - a[sortCardsBy])
  } else {
    sortedCards = cards
  }

  $: console.log({ sortedCards, sortCardsBy })
</script>

<div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
  {#each sortedCards as card}
    <svelte:component this={Card} data={card} />
  {/each}
</div>

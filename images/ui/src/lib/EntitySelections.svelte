<script lang="ts">
  import type {
    EntitySelection,
    CollectionSelection,
    ServiceSelection,
    SpaceSelection,
    EventSelection,
  } from '$lib/entities'
  import CardGallery from '$lib/CardGallery.svelte'
  import ServiceCard from '$lib/ServiceCard.svelte'
  import CollectionCard from '$lib/CollectionCard.svelte'
  import SpaceCard from '$lib/SpaceCard.svelte'
  import EventFeed from '$lib/EventFeed.svelte'

  const galleryConfig = {
    "collection": {
      component: CardGallery,
      props: (entities: CollectionSelection[]) => ({
        Card: CollectionCard,
        sortCardsBy: "label",
        cards: entities,
      })
    },
    "service": {
      component: CardGallery,
      props: (entities: ServiceSelection[]) => ({
        Card: ServiceCard,
        sortCardsBy: "label",
        cards: entities,
      }),
    },
    "space": {
      component: CardGallery,
      props: (entities: SpaceSelection[]) => ({
        Card: SpaceCard,
        sortCardsBy: "created_at",
        cards: entities,
      }),
    },
    "event": {
      component: EventFeed,
      props: (entities: EventSelection[]) => ({
        // sortCardsBy: "created_at",
        events: entities,
      }),
    },
  }

  export let selections: EntitySelection[]
</script>
{#each selections as selection}
  {@const config = galleryConfig[selection.entityType]}
  <div class="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 w-full">
    <div class="md:flex md:items-center md:justify-between pb-4 border-b">
      <!-- <h2 class="mt-2 mb-8 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Feed</h2> -->
      <h2 class="text-2xl font-bold tracking-tight text-gray-900">{selection.label}</h2>
      {#if selection.truncation}
        <a href="{selection.truncation.seeAllHref}" class="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block">
          {selection.truncation.seeAllLabel}
          <span aria-hidden="true"> &rarr;</span>
        </a>
      {/if}
    </div>
    <svelte:component
      this={config.component}
      {...config.props(selection.entities)}
      />
  </div>
{/each}

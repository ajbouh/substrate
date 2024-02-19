<script lang="ts">
import Ago from '$lib/Ago.svelte'
import ShortEvent from '$lib/events/ShortEvent.svelte'
import { urls } from '$lib/activities'

function pastParticiple(type: string) {
  switch (type) {
    case 'spawn':
      return 'created'
    case 'fork':
      return 'forked'
    default:
      return type
  }
}

function extractSpaces(event: any) {
  const spaces = []
  for (const value of Object.values(event.spaces)) {
    const space = (value.single || value.multi || {}).space
    if (!space) {
      continue
    }
    spaces.push({space, label: space, href: urls.ui.space({space: event.space})})
  }

  return spaces
}

export let events = []
</script>

<div class="flow-root">
  <ul class="-mb-8 mt-8">
    {#each events as event, i}
    <li>
      <div class="relative pb-8">
        {#if i !== events.length - 1}<span class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />{/if}
        <div class="relative flex items-start space-x-3">
      <ShortEvent>
        <div slot="icon" class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
          <!-- Heroicon name: mini/user-circle -->
          <svg class="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
          </svg>
        </div>
        <span>
          <a href="{urls.ui.user({user: event.user})}" class="font-medium text-gray-900">{event.user}</a>
          {pastParticiple(event.type)}
          {#each extractSpaces(event) as {space, label, href}}
            <a href="{href}" class="font-medium text-gray-900">{label}</a>
          {/each}
          {#if event.type === "fork"}
            from
            <a href="{urls.ui.space({space: event.forked_from_id})}" class="font-medium text-gray-900">{event.forked_from_id}</a>
          {/if}
          via {event.service}
          <span class="whitespace-nowrap"><Ago time={new Date(event.ts)} /></span>
        </span>

      </ShortEvent>
      </div>
      </div>
    </li>
    {/each}

  </ul>
</div>

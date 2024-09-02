<script lang="ts">
import Ago from '$lib/Ago.svelte'
import ShortEvent from '$lib/events/ShortEvent.svelte'
import { urls } from '$lib/activities'

function extractSpaces(event: any) {
  const created = []
  const accessed = []
  const parameters = event.spawn_response?.resolution?.parameters || event.Response?.ServiceSpawnResolution?.parameters

  if (parameters) {
    for (const value of Object.values(parameters)) {
      let spaces = value.spaces || (value.space ? [value.space] : [])
      if (spaces.length === 0) {
        spaces = value.Spaces || (value.Space ? [value.Space] : [])
      }
      for (const space of spaces) {
        let tip = (space.tip || space.Tip) || space.space_id
        tip = tip.startsWith("sp-") ? tip.substring(0, tip.length-4) : tip
        if (space.creation) {
          created.push({
            space: tip,
            label: tip,
            href: urls.ui.space({space: tip}),
            base: space.creation.base,
          })
        } else {
          accessed.push({
            space: tip,
            label: tip,
            href: urls.ui.space({space: tip}),
          })
        }
      }
    }
  }

  return {created, accessed}
}

export let events = []
</script>

<div class="flow-root">
  <ul class="-mb-8 mt-8">
    {#each events as event, i}
    {@const {created, accessed} = extractSpaces(event)}
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
          <!-- <a href="{urls.ui.user({user: event.user})}" class="font-medium text-gray-900">{event.user}</a> -->
          <a class="font-medium text-gray-900" href="{urls.gateway.activity({activityspec: event.viewspec})}">{event.service}</a>
          {#if created.length}
            created
            {#each created as {space, label, href, base}, i}
              <a href="{href}" class="font-medium text-gray-900">{label}</a>
              {#if base}
                (from <a href="{urls.ui.space({space: event.forked_from_id})}" class="font-medium text-gray-900">{event.forked_from_id}</a>)
              {/if}
            {/each}
          {/if}
          {#if accessed.length}
            accessed
            {#each accessed as {space, label, href}}
              <a href="{href}" class="font-medium text-gray-900">{label}</a>
            {/each}
          {/if}
          <span class="whitespace-nowrap"><Ago time={new Date(event.ts)} /></span>
        </span>
      </ShortEvent>
      </div>
      </div>
    </li>
    {/each}

  </ul>
</div>

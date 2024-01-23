<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  export let data

  let status = data.resume.status || { state: "Unknown" }
  let state = data.resume.status?.state
  let latestMessage = 'unset'
  $: console.log({ status, data })

  let sse: EventSource | undefined
  if (browser) {
    if (state !== 'Ready') {
      onMount(() => {
        sse = new EventSource(data.resume.status_stream_url)
        sse.addEventListener('message', (message) => {
          if (!message.isTrusted) {
            return
          }
          status = JSON.parse(message.data)

          state = status.state
          latestMessage = JSON.stringify(status)
        })

        return () => {
          sse!.close()
        }
      })
    }
  }

  let iframeSrc: string
  $: if (state === 'Ready') {
    iframeSrc = data.resume.url
  }
</script>

{#if state === 'Ready'}
  <iframe class="flex-grow w-full" src="{iframeSrc}"></iframe>
{:else}
  {JSON.stringify(status)}
{/if}

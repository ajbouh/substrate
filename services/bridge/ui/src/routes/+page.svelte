<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { readable, writable, readonly } from 'svelte/store'
  import { getMic, audioInputDeviceStore, getMedia } from '$lib/media'
  import { Client, BridgeEvent } from "$lib/client";
  import TranscriptContainer from '$lib/TranscriptContainer.svelte'
  import type {
    TranscriptDocument,
  } from '$lib/transcript'
  import {
    renderableTranscriptSession,
  } from '$lib/transcript'

  let client: Client
  let micEnabled = readable(false)
  let audioInputDevices = readable([])

  let toggleMic = () => {}
  let setMicTrack = async (deviceId: string) => {}

  let transcriptionWr = writable<TranscriptDocument[]>([])
  let transcription = readonly(transcriptionWr)

  let participants

  let transcriptElt

  function onBridgeEvent(ev: BridgeEvent) {
    switch (ev.type) {
      case 'status':
        ({participants} = ev.detail);
        break
      case 'transcription':
        let added = false
        const transcription = ev.detail
        transcriptionWr.update(arr => {
          const next = []
          for (const ex of arr) {
            if (ex.id === transcription.id) {
              next.push(transcription)
              added = true
            } else {
              next.push(ex)
            }
          }
          if (!added) {
            next.push(transcription)
            added = true
          }

          return next
        });
      break
    }
  }

  onMount(() => {
    let mediaDevices

    if (typeof navigator !== 'undefined') {
      mediaDevices = navigator.mediaDevices
    }

    const queryString = typeof window === 'undefined' ? '' : window.location.search;
    const params = new URLSearchParams(queryString);
    const room = params.get("room") || "test";
    const noSub = params.get("noSub") || false;
    const noPub = params.get("noPub") || false;

    console.log(noPub);
    let useDockerWs = false

    let u = new URL('ws', window.location.href)
    u.protocol = 'ws:'
    let url = u.toString()

    if (useDockerWs) {
      url = "ws://host.docker.internal:8088/ws";
    }

    if (!noPub) {
      getMedia(mediaDevices).then(stream => {
        console.log(stream.getTracks());

        client = new Client(stream, noPub, noSub, room, url, onBridgeEvent);
        micEnabled = client.micEnabled
        toggleMic = () => client.toggleMic()
        setMicTrack = async (deviceId) => {
          const mic = await getMic(mediaDevices, deviceId)
          client.setMicTrack(mic)
        }

        audioInputDevices = audioInputDeviceStore(mediaDevices)
        return client.join();
      })
    }
  })

  $: audioInputDevicesDisabled = !($audioInputDevices && $audioInputDevices.length > 1)

  $: console.log({$transcription})
  // $: text = $transcription.transcribedText + $transcription.currentTranscription

  $: console.log({$audioInputDevices, audioInputDevicesDisabled})

  $: ($transcription, tick().then(() => transcriptElt && transcriptElt.lastChild.scrollIntoView({ block: "end", behavior: 'smooth' })))
</script>
<div class="flex flex-col mx-auto h-screen w-full" style="">
  <div class="flex flex-wrap px-6 py-4">
    <h1 class="px-6 py-4 text-3xl font-bold text-white grow">bridge</h1>
    <div class="grow">&nbsp;</div>
    <div class="flex space-x-2">
      <select name="mic" id="mic"
        class="py-2 px-3 pr-9 border border-gray-600 rounded-md text-md focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-gray-400"
        on:select={async ev => setMicTrack(ev.target.value)}
        disabled={audioInputDevicesDisabled}>
        {#each $audioInputDevices as device}
          <option value={device.deviceId}>{device.label}</option>
        {:else}
          <option selected disabled>Choose your mic</option>
        {/each}
      </select>

      <button name="mic-mute" id="mic-mute"
        disabled={!client}
        on:click={toggleMic}
        class="p-2 border border-gray-600 rounded-md text-md focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-gray-400">
        {$micEnabled ? 'Mute' : 'Unmute'}
      </button>
    </div>
  </div>
  <div class="grow px-6 mt-4 overflow-scroll" bind:this={transcriptElt}>
    <TranscriptContainer
        sessions={[renderableTranscriptSession($transcription)]}
        />
  </div>
  <!-- <div class="flex flex-col px-6">
    <h2 class="text-sm font-semibold my-4 uppercase text-white">Transcription</h2>
    <pre id="transcriptions"
      class="text-lg text-gray-400 p-4 border-2 border-gray-700 rounded-md whitespace-break-spaces">{text}</pre>
    <audio id="saturday-audio" hidden autoplay></audio>
  </div> -->
</div>
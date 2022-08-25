<div class="container">
  {#each sessions as session}
    <TranscriptSession {...session}/>
  {/each}
</div>
<script>
  import TranscriptSession from '$lib/TranscriptSession.svelte'
  export let sessions = []
  $: console.log({ sessions })
</script>
<style>
  @font-face {
    font-family: "Storyboarder Sans";
    src: url("/storyboarder-sans-VF.ttf.woff2") format("woff2");
  }

  :root {
    font-family: "Storyboarder Sans", sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  :global(body) {
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
    max-width: 800px;
  }
</style>
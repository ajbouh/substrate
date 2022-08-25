{#if precedingSilenceClass}
  <div class="entry silence {precedingSilenceClass}">
    <div class="left" />
    <div class="line">
      <svg>
        <line
          vector-effect="non-scaling-stroke"
          style="opacity: 0.3;"
          stroke="{lineColor}"
          stroke-width="300"
          stroke-dasharray="10 5"
          x1="0"
          y1="0"
          x2="0"
          y2="150"
        />
      </svg>
    </div>
    <div class="right">
      <div class="elapsed">{formatDuration(precedingSilence)}</div>
    </div>
  </div>
{/if}
<div class="entry">
  <div class="left">
    <div class="time">{formatTime(time)}</div>
    <div class="session-time">{formatSessionTime(sessionTime)}</div>
  </div>
  <div class="line" style="background-color: {lineColor}" />
  <div class="right" class:assistant={isAssistant}>
    <div class="name">{speakerLabel}</div>
    <div class="text" class:text-gray-400={!final}>
      {#if words}
        {#each words as word}
          <span on:click={() => console.log({word})}>{word.word}</span>
        {/each}
      {:else}
        {text || ''}
      {/if}
    </div>
  </div>
</div>
<script context="module">
  const timeFmt = new Intl.DateTimeFormat("en-us", {timeStyle: "medium"})
</script>
<script>
import { getContext } from 'svelte'

let lineColor = getContext('lineColor') || 'green';

export let time = new Date()
export let sessionTime = 2
export let speakerLabel = 'Eva'
export let language = 'en'
export let isAssistant = true
export let text = ``
export let words = []
export let final = true
export let precedingSilence = 0

$: precedingSilenceClass = precedingSilence <= 0.5
  ? ''
  : precedingSilence > 1200
    ? 'very-long'
    : precedingSilence > 300
      ? 'long'
      : 'short'

function formatDuration(seconds) {
  if (seconds > 59 * 60) {
    return `${Math.round(seconds / 3600)} hour${seconds > (3600 * 1.5) ? 's': ''}`
  }

  if (seconds > 45) {
    return `${Math.round(seconds / 60)} minute${seconds > 90 ? 's': ''}`
  }

  return `${Math.round(seconds)} seconds`
}

function formatTime(time) {
  return timeFmt.format(time)
}

function formatSessionTime(seconds) {
  let hours = Math.floor(seconds / 3600)
  seconds -= hours * 3600
  let minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
</script>
<style>
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

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }
  a:hover {
    color: #535bf2;
  }

  .entry {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    text-align: center;
    align-items: center;
    height: min-content;
  }

  .entry .line {
    align-self: stretch;
    min-width: 15px;
    margin: 0 30px;
    padding: 0;
    position: relative;
  }

  .entry .line svg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
  }

  .entry .left {
    font-size: 0.7em;
    min-width: 100px;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    text-align: left;
    padding-right: 20px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 200;
  }

  .entry .right {
    width: 100%;

    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: left;
    text-align: left;
  }

  .entry .right.assistant {
    color: #45deff;
  }

  .entry .right .text {
    font-size: 1.5em;
    font-weight: 300;
  }

  .entry .right .name {
    font-size: 1em;
    font-weight: 600;
    opacity: 0.6;
  }

  .entry.silence .right {
    padding: 20px 0;
  }

  .entry.silence.long .right {
    padding: 40px 0;
  }

  .entry.silence.very-long .right {
    padding: 80px 0;
  }

  .entry.summary .right {
    padding: 60px 0;
  }

  .entry.summary .date {
    font-size: 0.8em;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.4);
  }

  .entry.summary .headline {
    font-size: 3em;
    font-weight: 700;
    margin-bottom: 10px;
    line-height: 1em;
  }

  .entry.summary .summary {
    font-size: 1.2em;
    font-weight: 200;
    margin-bottom: 10px;
    line-height: 1.5em;
    color: rgba(255, 255, 255, 0.6);
  }

  .entry .right .elapsed {
    font-size: 0.8em;
    margin: 10px 0;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 200;
  }

  .entry.silence.short .right {
    padding: 20px 0;
  }

  .entry.silence.long .right {
    padding: 40px 0;
  }

  .entry.silence.very-long .right {
    padding: 80px 0;
  }
</style>

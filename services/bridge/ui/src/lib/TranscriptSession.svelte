<div class="session">
  <div class="entry summary">
    <div class="left" />

    <div class="line" style="background-color: {lineColor};" />

    <div class="right">
      <div class="date">
        {date}
      </div>
      <div class="headline">
        {headline}
      </div>
      <div class="summary">
        {summary}
      </div>
      <div class="participants">Participants: {participants.join(', ')}</div>
      <div class="related">{related}</div>
      <div class="stats">{statistics}</div>
    </div>
  </div>
  {#each entries as entry, i}
    <TranscriptEntry {...entry} />
  {/each}
</div>
<script>
  import { setContext } from 'svelte'
  import TranscriptEntry from '$lib/TranscriptEntry.svelte'
  export let participants = []
  export let related = 'Related sessions, documents, etc.'
  export let statistics = '15 minutes / 45 words'
  export let summary = `Brainstorming is a creative process where people come together to
        generate a lot of ideas quickly. It's all about quantity over quality
        at first. You throw out any idea, no matter how wild or crazy, without
        judging it. The goal is to spark creativity and come up with something
        new that might not surface in a more structured discussion. After the
        brainstorming session, you can sift through the ideas, pick the best
        ones, and develop them further. It's a great way to get past creative
        blocks and find innovative solutions to problems.`
  export let headline = 'Brainstorm Session about Ideas and Other things.'
  export let date = '7:03pm, Wednesday, August 9th, 2023 // 2 weeks ago.'
  export let entries = [
    // {time: '7:01pm', sessionTime: '+0:00:00', speakerLabel: 'Charles', text: `Hello. How's it going?`},
    // {time: '7:01pm', sessionTime: '+0:00:00', speakerLabel: 'Charles', text: `My name is Charles. I'm working on Storyboarder, which is a tool to
    //       help people to tell stories. I'm really excited about it.`},
  ]
  export let lineColor = 'red'
  setContext('lineColor', lineColor)
</script>
<style>
  .session {
    width: 100%;
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

</style>
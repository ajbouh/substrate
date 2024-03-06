---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  /* text-align: center; */
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>Substrate Primers</h1>
  <h2>Primers are an initial step towards a new and experimental form of media:</h2>

- a simulator for intricate substrate-to-substrate interactions
- a storytelling platform, to explain multiuser-based scenarios
- a integration test platform for substrate functionality
- media production tool to showcase substrate capabilities and benefits

A casual user sees a primer as a set of templated scenes that show one or more characters in a specific situation interacting with each other and one or more devices. We present different camera angles for each scene according to an event sequence described that primer's source code. We also allow forward and backward "scrubbing" of events to make it easier explore and dissect what is happening at any given point.

</div>

<div class="grid grid-cols-2" style="">
  <div class="card">

## Under the hood

This implementation is based on @observablehq/framework npm package.

They also make use of chromestage and substrate commands to directly embed and automate various interactions.

Real screen contents are composited into the scene by finding and replacing SVG shapes on-the-fly. To keep this simple, we assign each screen a solid and unique fill color and refer to it using color.

Screen contents are backed by real, dynamic and optionally interactive streams of virtual framebuffers are actually running the code in question.

  </div>
  <div class="card">

## Future possibilities

- make these screen streams easy to record and replay
- allow screens to export audio to each other and the user
- allow "export" of a primer as a traditional video
- allow primers to "self edit" during their execution
- allow users to "fork" the execution and "pop out" individual screens
- fully nest all state of substrate itself, including fs and bb defs

  </div>
</div>

---

## Examples

<div class="grid grid-cols-4">
  <div class="card">
    <a href="A2/">A student uses Substrate during a lecture</a>
  </div>
</div>

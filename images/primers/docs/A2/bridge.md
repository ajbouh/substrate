---
title: A2
---

```js
import {
  newSVGView,
  newBlenderSceneView,
  defineWebstage,
  formatDuration,
  setupScrubber,
  substrateURL,
} from "../components/template.js";
```

```js
setWidth(width);
```

```js
display(viewports.v1.element)
```

```js
display(scrubber)
```

<div style="display: block; padding-left: 0.2em; padding-right: 0.2em;">${fieldAt('notes')[0]}</div>

```js
const lang = 'spa'; // 'en'
const bridge = `${substrateURL}/bridge2;sessions=sp-01HY167MKHFZVEDSQFXC25QPHJ;lang=${lang}/sessions/cp34s9ukfv4c739romt0`;
// note the /present instead of /edit in the google slides URL
const lecture = `https://docs.google.com/presentation/d/1dOoCTw5RMtn7NqhM4pNCiWILfK1ba5eJqZRztNKePWM/present?slide=id.g2dd541add94_5_`
```

```js
const scene = await (await fetch("https://substrate.taild72f5.ts.net/primer-scene;d=sp-01HXFRX22F9AMJ8FVMRJTV86R1;mainfile=A2_grad_v03.blend/v1/shots")).json()
```

```js
const {fieldAt, scrubber, setWidth, viewports} = setupScrubber({
  autoplay: false,
  viewports: {
    // v1: newSVGView({
    v1: newBlenderSceneView({
      scene,
      aspectRatio: 16/9,
      surfaceDefs: {
        "SCREEN_1 AR:1.001": defineWebstage({
          // aspect ratio 3:2
          width: 1920,
          height: 1280,
        }),
        "SCREEN_2 AR:1.6": defineWebstage({
          // aspect ratio 16:9
          width: 1280,
          height: 720,
        }),
      },
    }),
  },
  events: [
    {
      "SCREEN_1 AR:1.001": {
        keyframe: {
          url: bridge,
        },
      },
      "SCREEN_2 AR:1.6": {
        keyframe: {
          url: lecture,
          // youtube: {
          //   currentTime: 1000,
          //   playbackRate: 1,
          //   playing: true,
          // },
        },
      },
      'v1': {'angle': 'CamWIDE'},
      'dur': 5000,
      'notes': `Liv sits at her desk. She is watching a live presentation.`
    },
    {
      'v1': {'angle': 'CamBIGSCREEN'},
      'dur': 4000,
      'notes': `She is using Bridge on another display.`
    },
    {
      'v1': {'angle': 'CamLAPTOP'},
      'dur': 3000,
      'notes': `Bridge displays a live transcript along with its Spanish translation.`
    },
    {
      'v1': {'angle': 'CamWIDE'},
      'dur': 4000,
      'notes': `She can follow along without worrying that she missed something and won't understand.`
    },
  ],
});
```

```js
viewports
```

```js
async function debuggingUIForSurface(surfaceName, surface) {
  const debuggingLinks = await surface.debuggingLinks()
  return html`<div>${surfaceName} ${Object.entries(debuggingLinks).map(([text, href]) => html`<a target="_blank" href="${href}">${text}</a> `)}</div>`
}

async function debuggingUIForViewport(viewportName, viewport) {
  const uis = await viewport.mapSurfaces(async (sel, surface) => await debuggingUIForSurface(sel, surface))
  return html`<h4>${viewportName}</h4>${uis}`
}

async function debuggingUIForViewports(viewports) {
  const mapped = Object.entries(viewports).map(async ([viewportName, viewport]) => await debuggingUIForViewport(viewportName, viewport))
  const uis = await Promise.all(mapped)
  return html`${uis}`
}
```

<details>${debuggingUIForViewports(viewports)}</details>

```js
html`<a target="_blank" href="${bridge}">Bridge</a>`
```

```js
html`<a target="_blank" href="${lecture}">Presentation</a>`
```

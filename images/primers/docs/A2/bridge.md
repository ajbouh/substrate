---
title: A2
---

```js
import {
  newView,
  defineDOMSurface,
  formatDuration,
  setupScrubber,
  substrateURL,
  useChromestage,
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
const {fieldAt, scrubber, setWidth, viewports} = setupScrubber({
  autoplay: false,
  viewports: {
    v1: newView({
      aspectRatio: 16/9,
      surfaceDefs: {
        "[fill='#00FF00']": defineDOMSurface({
          // aspect ratio 3:2
          width: 1920,
          height: 1280,
          useChromestage,
        }),
        "[fill='#FF00F5']": defineDOMSurface({
          // aspect ratio 16:9
          width: 1280,
          height: 720,
          useChromestage,
        }),
      },
      angles: Object.fromEntries(await Promise.all([
        ['grad_011_ovr', FileAttachment('../templates/v2/grad_011_ovr.svg')],
        ['grad_020_scr', FileAttachment('../templates/v2/grad_020_scr.svg')],
        ['grad_021_scr', FileAttachment('../templates/v2/grad_021_scr.svg')],
        ['A2_grad_101', FileAttachment('../templates/v2/A2_grad_101.svg')],
      ].map(async ([k, fa]) => [k, await fa.text()]))),
    }),
  },
  events: [
    {
      "[fill='#00FF00']": {
        keyframe: {
          url: bridge,
        },
      },
      "[fill='#FF00F5']": {
        keyframe: {
          url: lecture,
          // youtube: {
          //   currentTime: 1000,
          //   playbackRate: 1,
          //   playing: true,
          // },
        },
      },
      'v1': {'angle': 'grad_021_scr'},
      'dur': 5000,
      'notes': `Liv sits at her desk. She is watching a live presentation.`
    },
    {
      'v1': {'angle': 'grad_011_ovr'},
      'dur': 4000,
      'notes': `She is using Bridge on another display.`
    },
    {
      'v1': {'angle': 'grad_020_scr'},
      'dur': 3000,
      'notes': `Bridge displays a live transcript along with its Spanish translation.`
    },
    {
      'v1': {'angle': 'grad_011_ovr'},
      'dur': 4000,
      'notes': `She can follow along without worrying that she missed something and won't understand.`
    },
    {
      'v1': {'angle': 'A2_grad_101'},
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

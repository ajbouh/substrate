---
title: A2
---

```js
import {
  newView,
  defineDOMSurface,
  defineVoiceSurface,
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
const {fieldAt, scrubber, setWidth, viewports} = setupScrubber({
  autoplay: false,
  viewports: {
    v1: newView({
      aspectRatio: 16/9,
      surfaceDefs: {
        "[fill='#00FF00']": defineDOMSurface({
          width: 1920,
          height: 1280,
          useChromestage,
        }),
        "[fill='#FF00F5']": defineDOMSurface({
          width: 1280,
          height: 720,
          useChromestage,
        }),
        "#audioLiv": defineVoiceSurface({
          url: "/styletts2/v1/speech",
        }),
      },
      angles: Object.fromEntries(await Promise.all([
        ['grad_010_ovr', FileAttachment("../templates/grad_010_ovr.svg")],
        ['grad_011_ovr', FileAttachment("../templates/grad_011_ovr.svg")],
        ['grad_020_scr', FileAttachment("../templates/grad_020_scr.svg")],
        ['grad_021_scr', FileAttachment("../templates/grad_021_scr.svg")],
        ['grad_030_cha', FileAttachment("../templates/grad_030_cha.svg")],
        ['grad_031_cha', FileAttachment("../templates/grad_031_cha.svg")],
        ['grad_032_cha', FileAttachment("../templates/grad_032_cha.svg")],
        ['grad_033_cu', FileAttachment("../templates/grad_033_CU.svg")],
        ['grad_034_cu', FileAttachment("../templates/grad_034_CU.svg")],
        ['grad_035_cu', FileAttachment("../templates/grad_035_CU.svg")],
        ['grad_036_cu', FileAttachment("../templates/grad_036_CU.svg")],
        ['grad_037_cu', FileAttachment("../templates/grad_037_CU.svg")],
        ['grad_038_cha', FileAttachment("../templates/grad_038_cha.svg")],
      ].map(async ([k, fa]) => [k, await fa.text()]))),
    }),
  },
  events: [
    {
      "[fill='#00FF00']": {
        keyframe: {
          url: `${substrateURL}/bridge2;sessions=sp-01HR5B0SC9AT42Q3CC0S8C77S1`
        },
      },
      "[fill='#FF00F5']": {
        keyframe: {
          url: `https://www.youtube.com/embed/0Qa5QvB40q4`,
          youtube: {
            currentTime: 1000,
            playbackRate: 1,
            playing: true,
          },
        },
      },
      "#audioLiv": {
        keyframe: {
          text: "hack the planet!",
          currentTime: 0,
          playing: true,
        },
      },
      'v1': {'angle': 'grad_010_ovr'},
      'dur': 5000,
      'notes': `Liv sits at her desk. She is typing up a class project as she watches her lecture for the day.`
    },
  ],
});
```

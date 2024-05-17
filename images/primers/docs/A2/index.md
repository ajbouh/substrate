---
title: A2
---

```js
import {
  newView,
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
const {fieldAt, scrubber, setWidth, viewports} = setupScrubber({
  autoplay: false,
  viewports: {
    v1: newView({
      aspectRatio: 16/9,
      surfaceDefs: {
        "[fill='#00FF00']": defineWebstage({
          // aspect ratio 3:2
          width: 1920,
          height: 1280,
        }),
        "[fill='#FF00F5']": defineWebstage({
          // aspect ratio 16:9
          width: 1280,
          height: 720,
        }),
      },
      angles: Object.fromEntries(await Promise.all([
        ['grad_010_ovr', FileAttachment("../templates/v1/grad_010_ovr.svg")],
        ['grad_011_ovr', FileAttachment("../templates/v1/grad_011_ovr.svg")],
        ['grad_020_scr', FileAttachment("../templates/v1/grad_020_scr.svg")],
        ['grad_021_scr', FileAttachment("../templates/v1/grad_021_scr.svg")],
        ['grad_030_cha', FileAttachment("../templates/v1/grad_030_cha.svg")],
        ['grad_031_cha', FileAttachment("../templates/v1/grad_031_cha.svg")],
        ['grad_032_cha', FileAttachment("../templates/v1/grad_032_cha.svg")],
        ['grad_033_cu', FileAttachment("../templates/v1/grad_033_CU.svg")],
        ['grad_034_cu', FileAttachment("../templates/v1/grad_034_CU.svg")],
        ['grad_035_cu', FileAttachment("../templates/v1/grad_035_CU.svg")],
        ['grad_036_cu', FileAttachment("../templates/v1/grad_036_CU.svg")],
        ['grad_037_cu', FileAttachment("../templates/v1/grad_037_CU.svg")],
        ['grad_038_cha', FileAttachment("../templates/v1/grad_038_cha.svg")],
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
      'v1': {'angle': 'grad_010_ovr'},
      'dur': 5000,
      'notes': `Liv sits at her desk. She is typing up a class project as she watches her lecture for the day.`
    },
    {
      'v1': {'angle': 'grad_021_scr'},
      'dur': 4000,
      'notes': `The lecture is a video. It’s shown full screen on her secondary monitor.`
    },
    {
      'v1': {'angle': 'grad_020_scr'},
      'dur': 3000,
      'notes': `Focusing in on the lecture video, we see the subject matter is dense and requires external sources to be referenced.`
    },
    {
      'v1': {'angle': 'grad_033_cu'},
      'dur': 5000,
      'notes': `Liv is typing in her document on her laptop screen. We see her trying her best to keep up with the lecture, feverishly taking notes and trying to absorb all the information.`
    },
    {
      'v1': {'angle': 'grad_038_cha'},
      'dur': 2500,
      'notes': `A close-up of Liv’s face. She is visibly stressed from the effort she’s exerting.`,
    },
    {
      'v1': {'angle': 'grad_030_cha'},
      'dur': 7000,
      'notes': `Liv continues to type, but then she realizes that getting Bridge's help would be a good idea.`,
      'dialog': {
        'Liv': `Bridge, take note of specific people and events mentioned so I can follow up on them later`
      }
    },
    {
      'v1': {'angle': 'grad_033_cu'},
      'dur': 3500,
      'notes': `We see the relief on Liv's face as Bridge begins collecting relevant information for her.`,
    },
    {
      'v1': {'angle': 'grad_031_cha'},
      'dur': 5500,
      'notes': `Liv sits back in her seat in a more relaxed pose. Her cup of coffee, which was sitting on her desk, is now in her hands. Popup windows on the screens show what Bridge is doing.`,
    },
    {
      'v1': {'angle': 'grad_011_ovr'},
      'dur': 3500,
      'notes': `Now, in an overhead shot, we continue to see Bridge working, pulling up information as the speaker in the video lecture is talking.`,
    },
    {
      'v1': {'angle': 'grad_037_cu'},
      'dur': 2000,
      'notes': `Further emphasizing that Liv is now taking a more passive role in the research gathering, we see a close-up shot of her cup of coffee in hand.`,
    },
    {
      'v1': {'angle': 'grad_036_cu'},
      'dur': 2000,
      'notes': `A close-up shot of her face, she’s now watching the lecture on her second monitor instead of typing notes.`,
    },
    {
      'v1': {'angle': 'grad_031_cha'},
      'dur': 5000,
      'notes': `A final shot to once again show Liv's engagement in the video instead of trying to keep up with taking notes. She’s still sitting back, watching the lecture, and keenly listening in a comfortable seated position with her cup of coffee.`,
    },
  ],
});
```

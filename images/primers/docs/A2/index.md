---
title: A2
---
```js
import {
  newView,
  defineSurface,
  fieldAt,
  set,
  stepForTick,
  Scrubber,
  formatDuration,
} from "../components/template.js";
```

```js
const angles = Object.fromEntries(await Promise.all(
  Object.entries({
    grad_010_ovr: FileAttachment("templates/grad_010_ovr.svg"),
    grad_011_ovr: FileAttachment("templates/grad_011_ovr.svg"),
    grad_020_scr: FileAttachment("templates/grad_020_scr.svg"),
    grad_021_scr: FileAttachment("templates/grad_021_scr.svg"),
    grad_030_cha: FileAttachment("templates/grad_030_cha.svg"),
    grad_031_cha: FileAttachment("templates/grad_031_cha.svg"),
    grad_032_cha: FileAttachment("templates/grad_032_cha.svg"),
    grad_033_CU: FileAttachment("templates/grad_033_CU.svg"),
    grad_034_CU: FileAttachment("templates/grad_034_CU.svg"),
    grad_035_CU: FileAttachment("templates/grad_035_CU.svg"),
    grad_036_CU: FileAttachment("templates/grad_036_CU.svg"),
    grad_037_CU: FileAttachment("templates/grad_037_CU.svg"),
    grad_038_cha: FileAttachment("templates/grad_038_cha.svg"),
  }).map(async ([k, fa]) => [k, await fa.text()])
));
```

```js
// const angle = fieldAt(events, step, 'angle');
// Instead of using angle directly, use a select so it can be overridden.
const angle = view(Inputs.select(Object.keys(angles), {value: fieldAt(events, step, 'angle')}));
```

```js
const useChromestage = true;
```

```js
const substrateURL = useChromestage ? `http://substrate:8080` : `http://localhost:8080`;
```

```js
const surfaceDefs = {
  '#00FF00': defineSurface({
    width: 1920,
    height: 1280,
    useChromestage,
  }),
  '#FF00F5': defineSurface({
    width: 1280,
    height: 720,
    useChromestage,
  }),
};
```

```js
const v = newView({
  aspectRatio: 16/9,
  style: {
    overflow: `clip`,
    position: `relative`,
    userSelect: 'none',
  },
  surfaceDefs,
  angles,
  svgStyle: {
    // must be relative so the SVG sits atop the videos.
    position: 'relative',
  },
});
```


```js
v.render({width, angle});
```

```js
const updatedSurface = await v.eachSurface(async (fill, surface) => {
  await surface.applyKeyframe((...k) => fieldAt(events, step, fill, 'keyframe', ...k))
});
```

```js
v.element
```

```js
const step = Mutable(0)

let scrubber
const setStep = (s) => (step.value = s, console.log("step ->", s))
const nextStep = () => (step.value < events.length) && scrubber.set(eventStarts[step.value+1])
const prevStep = () => scrubber.set((step.value > 0) ? eventStarts[step.value-1] : 0)
const frameTime = 20
const eventStarts = events.reduce((acc, event) => (acc.push(acc[acc.length-1] + (event.dur / frameTime)), acc), [0])
const scrubberTicks = Array.from({length: events.reduce((acc, event) => acc + (event.dur / frameTime), 0)}, (_, i) => frameTime*i)
scrubber = Scrubber(scrubberTicks, {
  delay: frameTime,
  loop: false,
  playLabel: "⏵",
  pauseLabel: "⏸",
  format: value => `${formatDuration(value)} / ${formatDuration(scrubberTicks[scrubberTicks.length - 1])}`,
  newForm: (values, initial) => html`<form style="font: 12px var(--sans-serif); font-variant-numeric: tabular-nums; align-items: center;">
  <label style="display: flex; align-items: center; width: 100%">
    <input name=i type=range min=0 max=${values.length - 1} value=${initial} step=1 style="width: 180px; flex: 1">
  </label>
  <div style="margin-left: 0.4em; margin-top: 1em;">
  <button name=b type=button style="width: 2em; font-size: 1.5em; padding-top: 0.2em; margin-right: 0.4em;"></button>
  <button type=button onclick=${prevStep} style="font-size: 1.5em; padding-top: 0.2em;">⏮</button>
  <button type=button onclick=${nextStep} style="font-size: 1.5em; padding-top: 0.2em;">⏭</button>
  <output name=o style="margin-left: 0.4em;"></output>
  </div>
</form>`,
})
const tick = view(scrubber)
console.log({scrubberTicks, eventStarts})
```

```js
html`<div style="display: block; width: 100%; padding-left: 0.2em; padding-right: 0.2em; text-wrap: wrap; white-space: pre;">${fieldAt(events, step, 'text')}</div>`
```

```js
{
  const s = stepForTick(events, tick)
  if (s !== step) {
    setStep(s)
  }
};
```

```js
const events = [
  {
    '#00FF00': {
      keyframe: {
        url: `${substrateURL}/bridge2;sessions=sp-01HR5B0SC9AT42Q3CC0S8C77S1`
      },
    },
    '#FF00F5': {
      keyframe: {
        url: `https://www.youtube.com/embed/yJDv-zdhzMY`,
        youtube: {
          currentTime: 600,
          playbackRate: 1,
          playing: false,
        },
      },
    },
    'angle': 'grad_010_ovr',
    'dur': 3000,
    'text': `Liv sits at her desk. She is typing up a class project as she watches her lecture for the day.`
  },
  {
    '#FF00F5': {
      keyframe: {
        youtube: {
          currentTime: 1800,
          playing: false,
        },
      }
    },
    'angle': 'grad_021_scr',
    'dur': 3000,
    'text': `Liv sits at her desk. She is typing up a class project as she's watches her lecture for the day.`
  },
  {
    'angle': 'grad_020_scr',
    'dur': 3000,
    'text': `Focusing in on the lecture video, we see the subject matter is dense and requires external sources to be referenced.`
  },
  {
    'angle': 'grad_033_CU',
    'dur': 3000,
    'text': `Liv is still typing her document, trying her best to keep pace with the lecture as well as taking vigorous notes.`
  },
  {
    'angle': 'grad_038_cha',
    'dur': 3000,
    'text': `Liv is still typing her document, trying her best to keep pace with the lecture as well as taking vigorous notes.`,
  }
];
```
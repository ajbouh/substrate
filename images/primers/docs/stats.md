---
title: Stats Primer
---

```js
function eventSourceMutable(url, fn) {
  const history = Mutable([])
  const latest = Mutable()
  const es = new EventSource(url)
  if (!fn) {
    fn = d => d
  }
  es.onmessage = (e) => {
    const v = fn(JSON.parse(e.data))
    history.value.push(v)
    history.value = history.value
    latest.value = v
  }
  invalidation.then(() => es.close())
  return [history, latest]
}
```

```js
const [nvml_raw_history, nvml_raw_latest] = eventSourceMutable("/nvml", d => ({...d.data, ts: Date(d.start_us / 1000)}))
```

```js
const [sys_raw_history, sys_raw_latest] = eventSourceMutable("/sys", d => ({...d.data, ts: Date(d.start_us / 1000)}))
```

```js
const [sigar_raw_history, sigar_raw_latest] = eventSourceMutable("/sigar", d => ({...d.data, ts: Date(d.start_us / 1000)}))
```

```js
const [_, exports_latest] = eventSourceMutable("/substrate/v1/exports", d => d)
```

exports_latest
```js
exports_latest
```

```js
const instances_latest = exports_latest.data.instances
```

```js
const instanceExports = Object.fromEntries(Object.entries(instances_latest).map(([key, instance]) => [key, instance.exports]))
const multimediaExports = Object.fromEntries(Object.entries(instanceExports).filter(([key, fields]) => fields).map(([key, fields]) => [key, fields?.data?.multimedia]))
```

```js
console.log({instances_latest, instanceExports})
```

sys_raw_history
```js
sys_raw_history
```

sys_raw_latest
```js
sys_raw_latest
```

sigar_raw_history
```js
sigar_raw_history
```

nvml_raw_history
```js
nvml_raw_history
```

```js
const allCards = Object.entries(sys_raw_latest?.root?.class?.drm?.cards || {})
const allConnectors = allCards.flatMap(([cardName, card]) => Object.entries(card.connectors).flatMap(([connectorName, connector]) => ({name: connectorName, card: {name: cardName, ...card}, ...connector})))
const connectedConnectors = allConnectors.filter(({status}) => status === "connected")
```

connectedConnectors
```js
connectedConnectors
```

instances_latest
```js
instances_latest
```

instanceExports
```js
instanceExports
```

multimediaExports
```js
multimediaExports
```

```js
const framebuffer = view(Inputs.select(Object.entries(multimediaExports).map(([key, mm]) => ({name: key, ...mm})), {format: d => d.name, label: "framebuffer"}))
```

```js
const rotation = view(Inputs.select([
  "none",
  "clockwise",
  "rotate-180",
  "counterclockwise",
  "horizontal-flip",
  "vertical-flip",
  "upper-left-diagonal",
  "upper-right-diagonal",
  "automatic",
], {label: "rotation"}))
```

```js
const monitor = view(Inputs.select(connectedConnectors, {format: d => d.name, label: "monitor", value: connectedConnectors[0]}))
```

monitor
```js
monitor
```

framebuffer
```js
framebuffer
```

```js
framebuffer?.embed && html`<iframe src="${framebuffer?.embed}" style="border: 0;" />`
```


```js
// none (0) – Identity (no rotation)
// clockwise (1) – Rotate clockwise 90 degrees
// rotate-180 (2) – Rotate 180 degrees
// counterclockwise (3) – Rotate counter-clockwise 90 degrees
// horizontal-flip (4) – Flip horizontally
// vertical-flip (5) – Flip vertically
// upper-left-diagonal (6) – Flip across upper left/lower right diagonal
// upper-right-diagonal (7) – Flip across upper right/lower left diagonal
// automatic (8) – Select flip method based on image-orientation tag

const send = view(Inputs.button("send", {
  value: null,
  reduce: (...a) => {
    fetch("/gstreamer-pipeline/", {
      method: "PATCH",
      body: JSON.stringify({
        definition: `rtspsrc location=${JSON.stringify(framebuffer.rtsp_internal)} ! decodebin ! videoconvert ! videoflip method=${rotation} ! kmssink connector-id=${monitor.connector_id}`,
        state: "playing",
      }),
    })
  },
}))
```

```js
function memoryPlot(data, {height, free_mb, used_mb, reserved_mb, total_mb}) {
  const mostRecent = data[data.length-1]

  data = data.flatMap(d => [
    {ts: d.ts, resource: "memory.reserved_mb", value: 100*reserved_mb(d)/total_mb(d)},
    {ts: d.ts, resource: "memory.free_mb", value: 100*free_mb(d)/total_mb(d)},
    {ts: d.ts, resource: "memory.used_mb", value: 100*used_mb(d)/total_mb(d)},
  ])

  console.log("memoryPlot", data)

  return Plot.plot({
    height,
    title: mostRecent ? `Memory: ${used_mb(mostRecent)}MB / ${total_mb(mostRecent)}MB` : `Memory`,
    y: {axis: null},
    x: {axis: null, label: null},
    marks: [
      Plot.areaY(data, {y: "value", x: "ts", fill: "resource"}),
    ]
  })
}
```

```js
function temperaturePlot(data, {height, temperature}) {
  const mostRecent = data[data.length-1]
  return Plot.plot({
    insetRight: 10,
    height,
    y: {axis: null, label: null},
    x: {axis: null, label: null},
    title: mostRecent ? `Temp: ${temperature(mostRecent)}°C` : `Temp`,
    marks: [
      () => htl.svg`<defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="20%" stop-color="red" stop-opacity="0.5" />
          <stop offset="100%" stop-color="blue" stop-opacity="0" />
        </linearGradient>
      </defs>`,
      Plot.areaY(data, {x: "ts", y: temperature, fill: "url(#gradient)"}),
      Plot.lineY(data, {x: "ts", y: temperature}),
      Plot.dot(data, Plot.selectLast({x: "ts", y: temperature, r: 3, fill: "black"})),
      Plot.text(data, Plot.selectLast({x: "ts", y: temperature, text: d => `${d.value}°C`, lineAnchor: "bottom", dx: 18, })),
    ]
  })
}

function fanSpeedPlot(data, {height, speed}) {
  const mostRecent = data[data.length-1]
  return Plot.plot({
    title: `Fan speeds`,
    height,
    y: {axis: null, label: null},
    x: {axis: null, label: null},
    marks: [
      Plot.lineY(data, {x: "ts", y: speed, strokeWidth: 2}),
    ]
  })
}

function powerPlot(data, {height, power, max_power}) {
  const bands = 10
  const step = +(d3.max(data, (d) => Math.max(power(d), max_power(d))) / bands).toPrecision(2)
  const mostRecent = data[data.length-1]
  const fmt = d => `${Math.round(d / 1000)}W`
  const powerData = data.flatMap(d => new Array(Math.ceil(power(d) / step)).fill(0).map((_, i) => ({ts: d.ts, y: power(d) - (step * i), z: `${i}`})))
  console.log({powerData, bands, step, mostRecent})
  return Plot.plot({
    title: `Power: ${fmt(power(mostRecent))} / ${fmt(max_power(mostRecent))}`,
    height,
    y: {domain: [0, step], axis: null},
    x: {axis: null, label: null},
    color: {
      type: "ordinal",
      scheme: "Greens",
    },
    marks: [
      // Plot.lineY(data, {x: "ts", y: d => d.power.power_usage_milliw, curve:'step'}),
      d3.range(bands).map((band) => Plot.areaY(data, {x: "ts", y: (d) => power(d) - band * step, fill: band, clip: true})),
      Plot.lineY(
        powerData, {
          x: "ts",
          y: "y",
          stroke: "black",
          z: d => d.z,
          strokeWidth: 2,
        }),
    ]
  })
}

function devicePlots(data, devices) {
  return html`<div>${devices.map(device => {
    data = data.filter(d => d.devices && d.devices[device])
    return html`<div style="display: flex">
  <div>${powerPlot(data, {
    height: 100,
    power: d => d.devices[device].power.power_usage_milliw,
    max_power: d => d.devices[device].power.enforced_power_limit_milliw,
  })}</div>
  <div>${memoryPlot(data, {
    height: 100,
    free_mb: d => d.devices[device].memory.free_mb,
    used_mb: d => d.devices[device].memory.used_mb,
    reserved_mb: d => d.devices[device].memory.reserved_mb,
    total_mb: d => d.devices[device].memory.total_mb,
  })}</div>
  <div>${temperaturePlot(data, {
    height: 100,
    temperature: d => d.devices[device].thermals.temperature,
  })}</div>
  <div>${fanSpeedPlot(data, {
    height: 100,
    speed: d => d.devices[device].thermals.fans["0"].speed,
  })}</div>
  </div>
  `
})}
</div>
`
}

```

```js
// GPU stats
view(devicePlots(
  nvml_raw_history.filter((d, i, a) => a.length - i < 30),
  Array.from(new Set(nvml_raw_history.flatMap(d => Object.keys(d && d.devices || {}))))
))
```

```js
// System memory
view(memoryPlot(sigar_raw_history, {
  height: 100,
  free_mb: d => d.system.memory.actual_free_mb,
  used_mb: d => d.system.memory.actual_used_mb,
  reserved_mb: d => 0,
  total_mb: d => d.system.memory.total_mb,
}))
```

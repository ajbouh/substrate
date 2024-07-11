import "npm:path-data-polyfill@1.0.4";
import numeric from "npm:numeric@1.2.6";
import {Generators, Mutable} from "npm:@observablehq/stdlib";
import {disposal} from "npm:@observablehq/inputs";
import {html} from "npm:htl";

export const useChromestage = true;

export const substrateURL = useChromestage ? `http://substrate:8080` : new URL(`/`, import.meta.url).toString();

export function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

// TODO blending modes:
// https://stackoverflow.com/questions/13669491/are-there-ways-to-use-additive-color-mixing-in-web-development
// https://stackoverflow.com/questions/57776682/css-blending-mode-to-replicate-additive-blending

let overlayCount = 0

export function setupScrubber({events, viewports, autoplay = true}) {
  let step = 0
  const fieldAtM = new Mutable((...k) => fieldAt(events, step, ...k))

  const frameTime = 20
  const eventStartFrames = events.reduce((acc, event) => (acc.push(acc[acc.length-1] + (event.dur / frameTime)), acc), [0])

  let scrubber
  const surfaceGetAgo = (...a) => {
    const t = scrubber ? scrubber.value : 0
    const [v, i] = fieldAtM.value(...a)
    return [v, (t - (eventStartFrames[i] * frameTime)), i]
  }

  let width
  const update = async () => {
    const running = scrubber ? scrubber.running() : autoplay
    for (const k in viewports) {
      const viewportGet = (...a) => fieldAtM.value(k, ...a)[0]
      viewports[k].update({viewportGet, surfaceGetAgo, running, width})
    }
  }

  const setWidth = w => {
    width = w
    update()
  }

  const setStep = (s) => {
    if (s === step) {
      return
    }
    console.log("step ->", s)
    step = s
    fieldAtM.value = fieldAtM.value
    update()
  }
  const nextStep = () => {
    const wasPlaying = scrubber ? scrubber.running() : autoplay
    if (step < events.length) {
      if (wasPlaying) { scrubber.stop() }
      scrubber.set(eventStartFrames[step+1])
      if (wasPlaying) { scrubber.start() }
    }
  }
  const prevStep = () => {
    const wasPlaying = scrubber ? scrubber.running() : autoplay
    if (wasPlaying) { scrubber.stop() }
    scrubber.set((step > 0) ? eventStartFrames[step-1] : 0)
    if (wasPlaying) { scrubber.start() }
  }
  const scrubberTicks = Array.from({length: events.reduce((acc, event) => acc + (event.dur / frameTime), 0)}, (_, i) => frameTime*i)
  console.log({scrubberTicks})
  scrubber = Scrubber(scrubberTicks, {
    delay: frameTime,
    autoplay,
    loop: false,
    playLabel: "⏵",
    pauseLabel: "⏸",
    onStart: update,
    onStop: update,
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

  scrubber.addEventListener('input', (ev) => setStep(stepForTick(events, scrubber.value)))
  update()

  return {
    fieldAt: fieldAtM,
    scrubber,
    setWidth,
    viewports,
  }
}

export function newView({angles, surfaceDefs, aspectRatio}) {
  const div = document.createElement('div')
  div.style.position = 'relative'
  div.style.overflow = 'clip'
  div.style.position = 'relative'
  div.style.userSelect = 'none'
  
  const svgWrap = document.createElement('div')
  // must be relative so the SVG sits atop the videos.
  svgWrap.style.position = 'relative'
  div.appendChild(svgWrap)

  const svgs = {}
  const dimensions = {}
  const quads = {}

  const tmp = document.createElement('div')
  for (const [angle, svgText] of Object.entries(angles)) {
    tmp.innerHTML = svgText
    const svg = tmp.firstChild
    svg.style.position = 'absolute'
    svg.style.top = '0'
    svg.style.left = '0'
    svg.style.visibility = 'hidden'
    svg.style.pointerEvents = 'none'

    svgWrap.appendChild(svg)

    const svgOuterWidth = +svg.attributes.width.value
    const svgOuterHeight = +svg.attributes.height.value

    // give any patterns in the svg with a new id. this is to avoid conflicts.
    overlayCount++
    const idPrefix = `overlay_${overlayCount}_`
    const allFilled = []
    for (const pattern of svg.querySelectorAll('defs pattern')) {
      if (pattern.id) {
        const newId = idPrefix + pattern.id
        for (const filled of svg.querySelectorAll(`*[fill='url(#${pattern.id})']`)) {
          // console.log({filled})
          filled.setAttribute('fill', `url(#${newId})`)
          allFilled.push(filled)
        }
        // rename
        pattern.id = newId
      }
    }

    let svgInnerWidth = svgOuterWidth
    let svgInnerHeight = svgOuterHeight
    let svgInnerTranslateXRatio = 0

    // use first filled renderRect for svg translate
    const renderRect = allFilled.find(elt => elt.nodeName === 'rect')

    if (renderRect) {
      if (renderRect.attributes.width) {
        svgInnerWidth = +renderRect.attributes.width.value
      }
      if (renderRect.attributes.height) {
        svgInnerHeight = +renderRect.attributes.height.value
      }
      if (renderRect.attributes.x) {
        svgInnerTranslateXRatio = -renderRect.attributes.x.value / svgOuterWidth
      }
    }

    const svgExcessWidthRatio = svgOuterWidth / svgInnerWidth
    const innerAspectRatio = svgInnerWidth/svgInnerHeight
    const svgOuterAspectRatio = svgOuterWidth / svgOuterHeight

    svgs[angle] = svg
    dimensions[angle] = {innerAspectRatio, svgInnerWidth, svgInnerHeight, svgInnerTranslateXRatio, svgExcessWidthRatio, svgOuterAspectRatio}
    quads[angle] = {}

    for (const sel of Object.keys(surfaceDefs)) {
      const masks = svg.querySelectorAll(sel)
      if (masks.length === 0) {
        continue
      }
      if (masks.length > 1) {
        console.warn(`multiple masks found for ${sel}; only using the first one.`)
      }
      const mask = masks[0]
      mask.setAttribute('opacity', '0')
      quads[angle][sel] = pointsFromPath({mask}).points
    }
  }

  const surfaces = {}
  for (const [sel, createSurface] of Object.entries(surfaceDefs)) {
    const surface = createSurface()
    if (surface.element) {
      svgWrap.insertBefore(surface.element, svgWrap.firstChild)
    }
    surfaces[sel] = surface
  }

  let quadBySelector, svg, svgInnerWidth, svgInnerHeight, svgInnerTranslateXRatio, svgExcessWidthRatio, svgOuterAspectRatio, innerAspectRatio

  return {
    element: div,
    mapSurfaces(cb) {
      return Promise.all(Object.entries(surfaces).map(([sel, surface]) => cb(sel, surface)))
    },
    eachSurface(cb) {
      this.mapSurface(cb)
    },
    update({width, viewportGet, surfaceGetAgo, running}) {
      div.style.height = `${width/aspectRatio}px`
      div.style.width = `${width}px`
      svgWrap.style.top = `-${width/2 - (width/aspectRatio/2)}px`

      // if we have an angle, update it
      const angle = viewportGet('angle')
      if (!(angle in svgs)) {
        throw new Error(`unknown angle: ${angle}`)
      }

      svg = svgs[angle];
      ({svgInnerWidth, svgInnerHeight, svgInnerTranslateXRatio, svgExcessWidthRatio, svgOuterAspectRatio, innerAspectRatio} = dimensions[angle]);
      quadBySelector = quads[angle]

      for (const [a, svg] of Object.entries(svgs)) {
        svg.style.visibility = (a === angle) ? 'visible' : 'hidden'
      }

      if (svg && width !== undefined) {
        svg.style.width = `${svgExcessWidthRatio * width}px`
        // scale SVG height down by its existing aspect ratio
        svg.style.height = `${svgExcessWidthRatio * width / svgOuterAspectRatio}px`
        svg.style.left = `${svgInnerTranslateXRatio * svgExcessWidthRatio * width}px`
      }

      if (quadBySelector) {
        for (let [sel, surface] of Object.entries(surfaces)) {
          const quad = quadBySelector && quadBySelector[sel]
            surface.update({
              quad: (quad && width)
                ? [quad[3], quad[0], quad[1], quad[2]].map(({x, y}) => [width*x/svgInnerWidth + (svgInnerTranslateXRatio*width*svgExcessWidthRatio), (width/innerAspectRatio)*y/svgInnerHeight])
                : null,
              getAgo: (...k) => surfaceGetAgo(sel, 'keyframe', ...k),
              running,
            })
        }
      }

      return div
    }
  }
}

let ID = 0

export function defineAudioSurface({}) {
  return function createSurface() {
    const audio = new Audio()
    // track the last step we were on and don't mess with the current time if we're on the same step we were last time.
    let lastAgoStep
    return {
      async debuggingLinks() {
        return {}
      },
      async update({getAgo, running}) {
        const get = (...a) => getAgo(...a)[0]
        const nowPlaying = running && get('playing')
        const wasPlaying = !audio.paused && !audio.ended && (audio.readyState > 2) && (audio.currentTime > 0)
        let [currentTime, ago, agoStep] = getAgo('currentTime')
        currentTime += (ago / 1000.0)
        const src = get('src')
        if (audio.src !== src) {
          audio.src = src
        }
        if (nowPlaying !== wasPlaying || lastAgoStep != agoStep) {
          audio.currentTime = currentTime
        }
        if (nowPlaying !== wasPlaying) {
          if (nowPlaying && currentTime < audio.duration) {
            await audio.play()
          } else {
            audio.pause()
          }
        }

        lastAgoStep = agoStep
      },
    }
  }
}

export function defineVoiceSurface({url}) {
  async function speak({text}) {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "input": text,
      }),
    })

    if (r.status !== 200) {
      const t = await r.text()
      throw new Error(`non-200 http status: ${t}`)
    }

    return {
      src: URL.createObjectURL(await r.blob()),
    }
  }
  
  return function createSurface() {
    const audio = new Audio()
    // track the last step we were on and don't mess with the current time if we're on the same step we were last time.
    let lastAgoStep
    let lastText
    return {
      async update({getAgo, running}) {
        const get = (...a) => getAgo(...a)[0]
        const nowPlaying = running && get('playing')
        const wasPlaying = !audio.paused && !audio.ended && (audio.readyState > 2) && (audio.currentTime > 0)
        let [currentTime, ago, agoStep] = getAgo('currentTime')
        currentTime += (ago / 1000.0)
        const text = get('text')
        if (lastText !== text) {
          lastText = text
          audio.src = (await speak({text})).src
        }
        if (nowPlaying !== wasPlaying || lastAgoStep != agoStep) {
          audio.currentTime = currentTime
        }
        if (nowPlaying !== wasPlaying) {
          if (nowPlaying && currentTime < audio.duration) {
            await audio.play()
          } else {
            audio.pause()
          }
        }

        lastAgoStep = agoStep
      },
    }
  }
}

async function fetchChromestageDebuggerURL(chromestageURL) {
  const r = await fetch(chromestageURL + "/json/version")
  const {
    webSocketDebuggerUrl,
  } = await r.json()
  
  const ws = new URL(webSocketDebuggerUrl)
  ws.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  ws.hostname = window.location.hostname
  ws.port = window.location.port
  console.log({websocketURL: ws.toString()})

  const devtools = new URL(webSocketDebuggerUrl)
  devtools.protocol = window.location.protocol
  devtools.hostname = window.location.hostname
  devtools.port = window.location.port
  devtools.pathname = '/' + devtools.pathname.split('/')[1] + "/devtools/inspector.html"
  devtools.searchParams.append(ws.protocol === 'wss:' ? 'wss' : 'ws', ws.toString().slice(ws.protocol.length + 2))

  const o = {ws: ws.toString(), devtools: devtools.toString()}
  console.log(o.devtools)
  return o.devtools
}

export function defineDOMSurface({width, height, useChromestage}) {
  // TODO useChromestage
  return function createSurface() {
    const composited = document.createElement('div')
    composited.style.backgroundColor = 'black'
    composited.style.position = 'absolute'
    composited.style.top = '0'
    composited.style.left = '0'
    composited.style.transformOrigin = '0 0'
    const iframe = document.createElement('iframe')
    iframe.width = width
    iframe.height = height
    iframe.style.margin = '0'
    composited.style.width = width
    composited.style.height = height
    composited.appendChild(iframe)

    // console.log("defining", {width, height, useChromestage})

    let run
    let debuggingLinks
    if (useChromestage) {
        let id = ID++
        const chromestageURL = new URL(`/chromestage;id=${id};w=${width};h=${height}`, import.meta.url).toString()
        console.log(`chromestage ${id}`, chromestageURL)
        fetchChromestageDebuggerURL(chromestageURL)

        const chromstageCommands = chromestageURL + "/commands"
        const chromstageVNC = chromestageURL + "/vnc/"
        iframe.src = chromstageVNC

        run = async (command, parameters) => {
          // console.log("running...", {command, parameters})
          const r = await fetch(chromstageCommands, {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
              command,
              parameters,
            }),
          })

          const t = await r.text()

          if (r.status !== 200) {
            throw new Error(`non-200 http status: ${t}`)
          }

          // console.log("result", JSON.parse(t))
          // console.log(t)
          const o = JSON.parse(t)
          console.log(`command ${command}`, {parameters, result: o})
          return o
        }
        debuggingLinks = async function() {
          return {
            "vnc": chromstageVNC,
            "debugger": await fetchChromestageDebuggerURL(chromestageURL),
          }
        }
      } else {
      let _url
      debuggingLinks = async function() {
        return {}
      }
      run = async (command, parameters) => {
        switch (command) {
        case "tab:navigate":
          if (parameters.url === _url) {
            return
          }

          // console.log("setting src", parameters.url)
          iframe.src = parameters.url
          _url = parameters.url
          break
        default:
          throw new Error(`unknown command ${command}`)
        }
      }
    }

    return {
      element: composited,
      run,
      debuggingLinks,
      async runTabEvaluate(fn, args) {
        const t = await run("tab:evaluate", {js: `(${fn})(${JSON.stringify(args)});`})
        // console.log("runTabEvaluate", fn, args, t)
        return t
      },
      async runYouTubeTabEvaluate(args) {
        // console.log("runYouTubeTabEvaluate")
        return await this.runTabEvaluate(async function({playing, currentTime, playbackRate}) {
          const video = document.querySelector('video')
          if (!video) {
            return
          }

          const wasPlaying = !video.paused && !video.ended && (video.readyState > 2) && (video.currentTime > 0)
          function updateProps() {
            if (currentTime != null) {
              video.currentTime = currentTime
            }
            if (playbackRate != null) {
              video.playbackRate = playbackRate
            }
          }

          if (playing != null) {
            if (playing !== wasPlaying) {
              if (playing) {
                updateProps()
                const p = document.querySelector('button[aria-label="Play"]')
                await p.click()
                // await video.play()
                return {"action": "play"}
              } else {
                video.pause()
                for (const e of document.querySelectorAll('.ytp-pause-overlay')) {
                  e.remove()
                }
                updateProps()
                return {"action": "pause"}
              }
            } else {
              updateProps()
              return {"action": "noop"}
            }
          } else {
            updateProps()
          }
        }, args)
      },
      async applyKeyframeURL({get}) {
        // console.log("applyKeyframeURL")
        const url = get('url')
        await run("tab:navigate", {url, lazy: true})
        return url
      },
      async applyKeyframeYouTube({get, getAgo, running}) {
        // console.log("applyKeyframeYouTube")
        const playbackRate = get('playbackRate')
        let [currentTime, ago] = getAgo('currentTime')
        currentTime += playbackRate * (ago / 1000.0)
        return await this.runYouTubeTabEvaluate({
          playing: running && get('playing'),
          currentTime: currentTime,
          playbackRate: playbackRate,
        })
      },
      async update({quad, getAgo, running}) {
        console.log("update")

        if (!quad) {
          composited.style.visibility = 'hidden'
          composited.style.transform = undefined
          return
        }
        
        composited.style.visibility = 'visible'
        composited.style.transform = matrix3d(
          [[0, 0], [width, 0], [width, height], [0, height]],
          quad,
        )

        const get = (...a) => getAgo(...a)[0]
        const url = await this.applyKeyframeURL({get, running})
        if (url.startsWith("https://www.youtube.com/")) {
          await this.applyKeyframeYouTube({
            get: (...k) => get('youtube', ...k),
            getAgo: (...k) => getAgo('youtube', ...k),
            running,
          })
        }
      },
    }
  }
}


export function browserWindow(html, location, contents, {height='auto', style=''}={}) {
  let maxHeight = 'auto'
  let minHeight = '240pt'
  let contentStyle = ''
  let className = 'bg-white'
    return html`
    <div class="window shadow-lg shadow-xl w-full flex flex-col" style="max-height: ${maxHeight}; min-height: ${minHeight}; height: ${height}; overflow: hidden; ${style}">
    <header class="toolbar toolbar-header relative grow-0 shrink-0">
      <div class="toolbar-actions" style="text-align:center">
        <ul class="window-buttons" style="position:absolute;left:0">
          <li class="close"></li>
          <li class="minimize"></li>
          <li class="maximize"></li>
        </ul>
        <button
            class="btn btn-default"
            style="width:50%;margin:5px auto 0 auto">${location}</button>
      </div>
    </header>
    <main id="window-content" class="window-content relative grow ${className}" style="overflow: auto; ${contentStyle}">${contents}</main>
  </div>
  `
}

// https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/
// https://gist.github.com/fta2012/bd63f7fd9f385870efc0
const getTransform = function(from, to) {
    var A, H, b, h, i, k_i, lhs, rhs, _i, _j, _k, _ref;
    console.assert((from.length === (_ref = to.length) && _ref === 4));
    A = [];
    for (i = _i = 0; _i < 4; i = ++_i) {
      A.push([from[i].x, from[i].y, 1, 0, 0, 0, -from[i].x * to[i].x, -from[i].y * to[i].x]);
      A.push([0, 0, 0, from[i].x, from[i].y, 1, -from[i].x * to[i].y, -from[i].y * to[i].y]);
    }
    b = [];
    for (i = _j = 0; _j < 4; i = ++_j) {
      b.push(to[i].x);
      b.push(to[i].y);
    }
    h = numeric.solve(A, b);
    H = [[h[0], h[1], 0, h[2]], [h[3], h[4], 0, h[5]], [0, 0, 1, 0], [h[6], h[7], 0, 1]];
    for (i = _k = 0; _k < 4; i = ++_k) {
      lhs = numeric.dot(H, [from[i].x, from[i].y, 0, 1]);
      k_i = lhs[3];
      rhs = numeric.dot(k_i, [to[i].x, to[i].y, 0, 1]);
      console.assert(numeric.norm2(numeric.sub(lhs, rhs)) < 1e-9, "Not equal:", lhs, rhs);
    }
    return H;
  };

  const matrix3d = function(originalPos, targetPos) {
    var H, from, i, j, p, to;
    from = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = originalPos.length; _i < _len; _i++) {
        p = originalPos[_i];
        _results.push({
          x: p[0] - originalPos[0][0],
          y: p[1] - originalPos[0][1]
        });
      }
      return _results;
    })();
    to = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = targetPos.length; _i < _len; _i++) {
        p = targetPos[_i];
        _results.push({
          x: p[0] - originalPos[0][0],
          y: p[1] - originalPos[0][1]
        });
      }
      return _results;
    })();
    H = getTransform(from, to);
    return "matrix3d(" + (((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 4; i = ++_i) {
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (j = _j = 0; _j < 4; j = ++_j) {
              _results1.push(H[j][i].toFixed(20));
            }
            return _results1;
          })());
        }
        return _results;
      })()).join(',')) + ")";
  };

function pointsFromPath({mask}) {
  const points = []

  if (mask.nodeName === 'rect') {
    const attr = mask.attributes
    const x = +attr.x.value
    const y = +attr.y.value
    const width = +attr.width.value
    const height = +attr.height.value
    points.push(
      {x: x + width, y: y},
      {x: x + width, y: y + height},
      {x: x, y: y + height},
      {x: x, y: y},
    )
    return {points}
  }
  // assume nodeName is 'path'

  const path = mask
  const d = path.attributes['d']

  const r = path.getPathData()

  let x, y
  loop:
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands
  for (const {type, values} of path.getPathData()) {
      switch (type) {
      case 'M':
          ([x, y] = values);
          break
      case 'm':
          x += values[0]
          y += values[1]
          break
      case 'L':
          ([x, y] = values);
          points.push({x, y})
          break;
      case 'l':
          x += values[0]
          y += values[1]
          points.push({x, y})
          break;
      case 'H':
          x = values[0];
          points.push({x, y})
          break;
      case 'h':
          x += values[0];
          points.push({x, y})
          break;
      case 'V':
          y = values[0];
          points.push({x, y})
          break;
      case 'v':
          y += values[0];
          points.push({x, y})
          break;
      case 'Z':
      case 'z':
          break loop
      }
  }

  return {r, points}
}

export function fieldAt(e, t, ...fields) {
  for (let i = t; i >= 0; --i) {
    const o = e[i]
    const value = fields.reduce((acc, field) => {
      return acc !== undefined ? acc[field] : undefined
    }, o)
    if (value !== undefined) {
      return [value, i]
    }
  }

  throw new Error(`no field .${fields.join('.')} found for t=${t}`)
}

// From https://observablehq.com/@mbostock/scrubber
export function Scrubber(values, {
  format = value => value,
  newForm = (values, initial) => html`<form style="font: 12px var(--sans-serif); font-variant-numeric: tabular-nums; display: flex; height: 33px; align-items: center;">
  <button name=b type=button style="margin-right: 0.4em; width: 5em;"></button>
  <label style="display: flex; align-items: center;">
    <input name=i type=range min=0 max=${values.length - 1} value=${initial} step=1 style="width: 180px;">
    <output name=o style="margin-left: 0.4em;"></output>
  </label>
</form>`,
  initial = 0,
  direction = 1,
  delay = null,
  autoplay = true,
  loop = true,
  loopDelay = null,
  alternate = false,
  playLabel = "Play",
  pauseLabel = "Pause",
  onStop = () => {},
  onStart = () => {},
} = {}) {
  values = Array.from(values);
  const form = newForm(values, initial);
  let frame = null;
  let timer = null;
  let interval = null;
  function start() {
    form.b.textContent = pauseLabel;
    if (delay === null) frame = requestAnimationFrame(tick);
    else interval = setInterval(tick, delay);
    if (onStart !== null) onStart(form.i.valueAsNumber)
  }
  function stop() {
    form.b.textContent = playLabel;
    if (frame !== null) cancelAnimationFrame(frame), frame = null;
    if (timer !== null) clearTimeout(timer), timer = null;
    if (interval !== null) clearInterval(interval), interval = null;
    if (onStop !== null) onStop(form.i.valueAsNumber)
  }
  function running() {
    return frame !== null || timer !== null || interval !== null;
  }
  function tick() {
    if (form.i.valueAsNumber === (direction > 0 ? values.length - 1 : direction < 0 ? 0 : NaN)) {
      if (!loop) return stop();
      if (alternate) direction = -direction;
      if (loopDelay !== null) {
        if (frame !== null) cancelAnimationFrame(frame), frame = null;
        if (interval !== null) clearInterval(interval), interval = null;
        timer = setTimeout(() => (step(), start()), loopDelay);
        return;
      }
    }
    if (delay === null) frame = requestAnimationFrame(tick);
    step();
  }
  function step() {
    form.i.valueAsNumber = (form.i.valueAsNumber + direction + values.length) % values.length;
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
  }
  form.i.oninput = event => {
    if (event && event.isTrusted && running()) stop();
    form.value = values[form.i.valueAsNumber];
    if (form.o) {
      form.o.value = format(form.value, form.i.valueAsNumber, values);
    }
  };
  form.b.onclick = () => {
    if (running()) return stop();
    direction = alternate && form.i.valueAsNumber === values.length - 1 ? -1 : 1;
    form.i.valueAsNumber = (form.i.valueAsNumber + direction) % values.length;
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
    start();
  };
  form.i.oninput();
  form.set = function(i) {
    console.log("set", i)
    form.i.valueAsNumber = i
    form.i.dispatchEvent(new CustomEvent("input", {bubbles: true}));
    form.i.oninput();
  }
  form.running = running
  form.stop = stop
  form.start = start
  if (autoplay) start();
  else stop();
  disposal(form).then(stop);
  return form;
}

export function stepForTick(events, tick) {
  let i = 0, t = tick
  while (i < events.length) {
    const event = events[i]
    if (t < event.dur) {
      return i
    }
    t -= event.dur
    ++i
  }

  return events.length - 1
}

export function set(input, value) {
  input.value = value;
  input.dispatchEvent(new Event("input", {bubbles: true}));
}

export function formatDuration(ms) {
  let s = Math.floor(ms / 1000)

  if (s < 10) {
    return `0:0${s}`
  }

  if (s < 60) {
    return `0:${s}`
  }

  let m = Math.floor(s / 60)
  s = s - (m * 60)

  return `${m}:${s}`
}

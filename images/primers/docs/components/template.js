import "npm:path-data-polyfill@1.0.4";
import numeric from "npm:numeric@1.2.6";
import {Generators} from "npm:@observablehq/stdlib";
import {disposal} from "npm:@observablehq/inputs";
import {html} from "npm:htl";

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

function applyStyle(e, style) {
  if (!style) {
    return
  }
  for (const [k, v] of Object.entries(style)) {
    e.style[k] = v
  }
}

export function newView({style, svgStyle, angles, surfaceDefs, aspectRatio}) {
  const div = document.createElement('div')
  div.style.position = 'relative'
  applyStyle(div, style)
  
  const svgWrap = document.createElement('div')
  applyStyle(svgWrap, svgStyle)
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
    dimensions[angle] = {aspectRatio, innerAspectRatio, svgInnerWidth, svgInnerHeight, svgInnerTranslateXRatio, svgExcessWidthRatio, svgOuterAspectRatio}
    quads[angle] = {}

    for (const fill of Object.keys(surfaceDefs)) {
      const masks = svg.querySelectorAll(`*[fill='${fill}']`)
      for (const mask of masks) {
        mask.setAttribute('opacity', '0')
      }
      quads[angle][fill] = Array.from(masks, mask => pointsFromPath({mask}).points)
    }
  }

  const surfaces = {}
  for (const [fill, createSurface] of Object.entries(surfaceDefs)) {
    const surface = createSurface()
    svgWrap.insertBefore(surface.element, svgWrap.firstChild)
    surfaces[fill] = surface
  }

  return {
    element: div,
    eachSurface(cb) {
      return Promise.all(Object.entries(surfaces).map(([fill, surface]) => cb(fill, surface)))
    },
    render({width, angle}) {
      if (!(angle in svgs)) {
        throw new Error(`unknown angle: ${angle}`)
      }
      const svg = svgs[angle]
      const {aspectRatio, svgInnerWidth, svgInnerHeight, svgInnerTranslateXRatio, svgExcessWidthRatio, svgOuterAspectRatio, innerAspectRatio} = dimensions[angle]

      div.style.height = `${width/aspectRatio}px`
      div.style.width = `${width}px`
  
      svgWrap.style.top = `-${width/2 - (width/aspectRatio/2)}px`

      svg.style.width = (svgExcessWidthRatio * width) + 'px'
      // scale SVG height down by its existing aspect ratio
      svg.style.height = (svgExcessWidthRatio * width / svgOuterAspectRatio) + 'px'
      svg.style.left = (svgInnerTranslateXRatio * svgExcessWidthRatio * width) + 'px'
      
      const quadsByFill = quads[angle]

      for (const [a, svg] of Object.entries(svgs)) {
        // todo maybe play with visibility instead of display?
        svg.style.visibility = (a === angle) ? 'visible' : 'hidden'
      }

      for (let [fill, surface] of Object.entries(surfaces)) {
        const quads = quadsByFill[fill]
        if (quads.length === 0) {
          surface.renderAt({quad: null})
          continue
        }
    
        for (const quad of quads) {
          surface.renderAt({quad: [quad[3], quad[0], quad[1], quad[2]].map(({x, y}) => [width*x/svgInnerWidth + (svgInnerTranslateXRatio*width*svgExcessWidthRatio), (width/innerAspectRatio)*y/svgInnerHeight])})
        }
      }
      return div
    }
  }
}

let ID = 0

export function defineSurface({width, height, useChromestage}) {
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
    if (useChromestage) {
        let id = ID++
        const chromestageURL = `http://localhost:8080/chromestage;id=${id};w=${width};h=${height}`
        const chromstageCommands = chromestageURL + "/commands"
        const chromstageVNC = chromestageURL + "/vnc/"
        iframe.src = chromstageVNC
        // const url = "http://substrate:8080/bridge2;sessions=sp-01HR5B0SC9AT42Q3CC0S8C77S1"

        run = async (command, parameters) => {
          // console.log("run", {command, parameters})
          const r = await fetch(chromstageCommands, {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({
              Command: command,
              Parameters: parameters,
            }),
          })

          const t = await r.text()

          if (r.status !== 200) {
            throw new Error(`non-200 http status: ${t}`)
          }

          // console.log(t)
          return JSON.parse(t)
        }
    } else {
      let _url
      run = (command, parameters) => {
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
      async applyKeyframeURL(get) {
        const url = get('url')
        await run("tab:navigate", {url, lazy: true})
        return url
      },
      async applyKeyframeYouTube(get) {
        await run("tab:evaluate", {js: `(${function({playing, currentTime, playbackRate}) {
          const video = document.querySelector('video')

          const wasPlaying = !video.paused && !video.ended && (video.readyState > 2) && (video.currentTime > 0)
          function updateProps() {
            video.currentTime = currentTime
            video.playbackRate = playbackRate
          }

          if (playing !== wasPlaying) {
            if (playing) {
              const play = document.querySelector('button[aria-label="Play"]')
              if (play) {
                play.click()
              } else {
                video.play()
              }
              updateProps()
              return {"action": "play"}
            } else {
              video.pause()
              updateProps()
              return {"action": "pause"}
            }
          } else {
            updateProps()
            return {"action": "noop"}
          }
        }})(${JSON.stringify({
          playing: get('playing'),
          currentTime: get('currentTime'),
          playbackRate: get('playbackRate'),
        })});`})
      },
      async applyKeyframe(get) {
        const url = await this.applyKeyframeURL(get)
        if (url.startsWith("https://www.youtube.com/")) {
          await this.applyKeyframeYouTube((...k) => get('youtube', ...k))
        }
      },
      renderAt({quad}) {
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
      return value
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
  pauseLabel = "Pause"
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
  }
  function stop() {
    form.b.textContent = playLabel;
    if (frame !== null) cancelAnimationFrame(frame), frame = null;
    if (timer !== null) clearTimeout(timer), timer = null;
    if (interval !== null) clearInterval(interval), interval = null;
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
      break
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

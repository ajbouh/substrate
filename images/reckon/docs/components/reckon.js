import {
  EditorView,
  keymap,
  Compartment,
  StateEffect,
  StateField,
  Decoration,
  mapField,
  syntaxTree,
  WidgetType,
  ViewPlugin,
  ViewUpdate,
  MatchDecorator,
} from "./codemirror.js"

import {
  llama,
} from "./llama.js"

export const addRegion = StateEffect.define({
  map: ({srcFrom, srcTo, dstFrom, dstTo}, change) => ({
    srcFrom: change.mapPos(srcFrom),
    srcTo: change.mapPos(srcTo),
    dstFrom: change.mapPos(dstFrom),
    dstTo: change.mapPos(dstTo),
  })
})

export const removeRegion = StateEffect.define({
  map: ({from, to}, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  })
})

function operationButtons(view) {
  return Decoration.set(mapField(view.state, underlineField, (iter) => iter.value.spec.attributes['data-role'] == 'dst' ? Decoration.widget({
    widget: new OperationWidget({
      id: iter.value.spec.attributes['data-id'],
      operationText: iter.value.spec.attributes['data-operation-text'],
    }),
    side: 1,
  }).range(iter.from) : undefined))
}

class OperationWidget extends WidgetType {
  constructor({id, operationText}) {
    super()
    this.id = id
    this.operationText = operationText
  }
  eq(other) { return other.operationText === this.operationText && other.id === this.id }
  toDOM() {
    let wrap = document.createElement("button")
    wrap.setAttribute("aria-hidden", "true") // do we want this?
    wrap.className = "cm-operation-text"
    wrap.setAttribute("data-id", this.id)
    // TODO switch to innerText
    wrap.innerHTML = `&#10227; ${this.operationText}`
    return wrap
  }
  ignoreEvent() { return false }
}

const operationPlugin = ViewPlugin.fromClass(class {
  constructor(view) {
    this.decorations = operationButtons(view)
  }

  update(update) {
    if (update.docChanged || update.viewportChanged ||
      update.startState.field(underlineField, false) !== update.state.field(underlineField, false)) {
      this.decorations = operationButtons(update.view)
    }
  }
}, {
  decorations: v => v.decorations,

  eventHandlers: {
    click: (e, view) => {
      let target = e.target
      if (target.nodeName == "BUTTON" &&
          target.classList.contains("cm-operation-text")) {
        const id = target.attributes['data-id'].value
        console.log("target.attributes['data-id']", target.attributes['data-id'])
        regenerateRegionsThat({
          view,
          pred: iter => iter.value.spec.attributes['data-id'] === id,
        })
      }
    }
  }
})

let underlineId = 0
function nextRegion() {
  const n = underlineId++
  const color = colors[n % colors.length]
  return {
    id: `underline${n}`,
    color: color,
  }
}

const colors = [
  {name: "green", light: "lightgreen", dark: "green"},
  {name: "red", light: "pink", dark: "red"},
  {name: "blue", light: "lightblue", dark: "blue"},
  {name: "pink", light: "lightpink", dark: "pink"},
  {name: "salmon", light: "lightsalmon", dark: "salmon"},
  {name: "seagreen", light: "lightseagreen", dark: "seagreen"},
  {name: "skyblue", light: "lightskyblue", dark: "skyblue"},
  {name: "steelblue", light: "lightsteelblue", dark: "steelblue"},
  {name: "yellow", light: "lightyellow", dark: "yellow"},
  {name: "cyan", light: "lightcyan", dark: "cyan"},
  {name: "purple", light: "lavender", dark: "purple"},
]
export const underlineField = StateField.define({
  create() {
    return Decoration.none
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes)
    for (let e of tr.effects) {
      if (e.is(addRegion)) {
        const {id, color} = nextRegion()
        underlines = underlines.update({
          add: [
            ...(e.value.srcFrom == null ? [] : [Decoration.mark({
              class: "cm-underline",
              attributes: {
                "data-role": "src",
                "data-id": id,
                "data-color": color.name,
                "data-operation-text": e.value.operationText,
              },
            }).range(e.value.srcFrom, e.value.srcTo)]),
            Decoration.mark({
              class: "cm-underline",
              attributes: {
                "data-role": "dst",
                "data-id": id,
                "data-color": color.name,
                "data-operation-text": e.value.operationText,
              },
            }).range(e.value.dstFrom, e.value.dstTo),
          ]
        })
      } else if (e.is(removeRegion)) {
        underlines = underlines.update({
          filter: (f, t, value) => !(f === e.value.from && t === e.value.to),
        })
      }
    }
    return underlines
  },
  provide: f => EditorView.decorations.from(f),
})

const underlineTheme = EditorView.baseTheme({
  ".cm-underline::selection": {
    backgroundColor: "inherit",
  },
  ".cm-operation-text": {
    right: "2em",
    float: "right",
    // position: "absolute",
    // position: "sticky",
    // width: "max-content",
    userSelect: "none",
  },
  ...Object.fromEntries(colors.map(color =>
    [`[data-color="${color.name}"][data-role="dst"]`, {
      backgroundColor: color.light
    }]
  )),
  ...Object.fromEntries(colors.map(color =>
    [`[data-color="${color.name}"][data-role="src"]`, {
      backgroundColor: `color-mix(in srgb, ${color.light} 50%, white)`
    }]
  )),
})

let abortControllers = []

function newAbortController() {
  const ac = new AbortController()
  abortControllers.push(ac)
  return ac
}

function removeAbortController(ac) {
  abortControllers = abortControllers.filter(a => a !== ac)
}

function abort(reason) {
  for (const ac of abortControllers) {
    ac.abort(reason)
  }
  abortControllers = []
}

async function regenerateRegionsThat({view, pred}) {
  const dsts = mapField(view.state, underlineField, (iter) => {
    if (pred(iter)) {
      if (iter.value.spec.attributes['data-role'] === 'dst') {
        return {
          id: iter.value.spec.attributes['data-id'],
          operationText: iter.value.spec.attributes['data-operation-text'],
          from: iter.from,
          to: iter.to,
        }
      }
    }
  })

  for (const dst of dsts) {
    const [src] = mapField(view.state, underlineField, (iter) => {
      if (iter.value.spec.attributes['data-id'] === dst.id
          && iter.value.spec.attributes['data-role'] === 'src') {
        return {
          from: iter.from,
          to: iter.to,
        }
      }
    })

    return await runOperationText({
      view,
      state: view.state,
      operationText: dst.operationText,
      input: src ? view.state.doc.sliceString(src.from, src.to) : undefined,
      srcFrom: src?.from ?? null,
      srcTo: src?.to ?? null,
      dstFrom: dst.from,
      dstTo: dst.to,
    })
  }
}

export function underlineExtension() {
  const underlineKeymap = keymap.of(
    [
      {
        key: "Escape",
        preventDefault: true,
        run: (view) => {
          console.log("esc")
          abort("user pressed escape")
          return true
        },
      },
      {
        key: "Mod-Shift-Enter",
        preventDefault: true,
        run: async (view) => {
          // TODO should re-run the operation and replace the output region
          let selection = view.state.selection.main

          regenerateRegionsThat({
            view,
            pred: (iter) => (selection.from >= iter.from && selection.from < iter.to) ||
              (selection.to >= iter.from && selection.to < iter.to),
          })
        },
      },
      {
        key: "Mod-Enter",
        preventDefault: true,
        run: async (view) => {
          let selection = view.state.selection.main
          let operationText = defaultOperation
  
          if (selection.head) {
            const possibleOperationLine = view.state.doc.lineAt(selection.head)
            if (possibleOperationLine) {
              const possibleOperation = possibleOperationLine.text
  
              // a operation is a line that starts with a colon
              if (possibleOperation.match(/^\s*:+/)) {
                operationText = possibleOperation.trim().slice(1)

                // remove the operation from the text
                view.dispatch({
                  changes: {
                    from: possibleOperationLine.from,
                    to: possibleOperationLine.to,
                    insert: "",
                  },
                })
                // and refresh our selection
                selection = view.state.selection.main
              }  
            }
          }
  
          // if no selection, use the whole document
          // take operation from the line we're on
          let from = 0
          let to = selection.to
          if (selection.from !== selection.to) {
            from = selection.from
          }
          let input = view.state.doc.sliceString(from, to)
  
          const out = runOperationText({view, state: view.state, operationText, srcFrom: from, srcTo: to, input})
  
          console.log({out})
          return out
        },
      }
    ],
  )

  return [
    underlineKeymap,
    underlineTheme,
    underlineField,
    operationPlugin,
    placeholders,
  ]
}

async function runOperationText({view, state, operationText, input, srcFrom, srcTo, dstFrom, dstTo, updateSelection, scrollIntoView}) {
  const resolved = Object.create(defaultOperations)
  // TODO operation should really be a pipeline list with operation and args for each...
  let pipeline
  let missingAttempts = {
    // Avoid a loop.
    missing: true,
  }
  while (!pipeline) {
    try {
      pipeline = resolvePipeline({
        state: view.state,
        resolved,
        view,
        operationText,
        srcFrom,
        srcTo,
        dstFrom,
        dstTo,
        updateSelection,
        scrollIntoView,
      }, ...parseOperationPipeline(operationText))
    } catch (e) {
      if (!(e instanceof MissingOperationError)) {
        throw e
      }

      console.log(e)

      if (missingAttempts[e.operation]) {
        console.log(`already tried ${e.operation}, will not try again`)
        throw e
      }

      // only try once for each operation during a single resolution.
      missingAttempts[e.operation] = true

      // insert operation template.
      view.dispatch({
        changes: {
          from: view.state.doc.length,
          insert: ["", "---", "", `# [[${e.operation}]]`, "", "", "---", ""].join("\n"),
        },
      })
      const dstFrom = view.state.doc.length - 6

      const missingOperationText = `missing ${e.operation}`
      console.log(`attempting to run missing for ${e.operation}`)
      await runOperationText({
        state,
        view,
        operationText: missingOperationText,
        srcFrom: null,
        srcTo: null,
        dstFrom,
        scrollIntoView: false,
        updateSelection: false,
      },  ...parseOperationPipeline(missingOperationText))
    }
  }

  return await pipeline({input})
}

class MissingOperationError extends Error {
  constructor(operation, have) {
    super(`no such operation ${operation}; have ${have}`)
    this.operation = operation
  }
}

export const defaultOperation = 'complete | insert'

function resolve(state, resolved, operation) {
  console.log("resolve", {resolved, operation})
  if (operation in resolved) {
    return resolved[operation]
  }

  const def = discoverOperationDef(state, operation)
  if (!def) {
    throw new MissingOperationError(operation, Object.keys(resolved))
  }
  resolved[operation] = def

  for (const other of def.rest) {
    resolve(state, resolved, other.operation)
  }

  return def
}

function resolvePipeline(config, head, ...rest) {
  const {state, resolved} = config
  const h = resolve(state, resolved, head.operation)
  if (!h) {
    throw new Error(`can't resolve head ${head.operation} in ${Object.keys(resolved)}`)
  }

  const r = [
    h.run({...config, args: head.args}),
    ...(h.rest
      ? h.rest.map((call) => resolvePipeline(config, call))
      : []),
    ...rest.map((call) => resolvePipeline(config, call)),
  ]
  return async (input) => {
    let o = input
    for (const stage of r) {
      console.log({stage})
      o = await stage(o)
    }
    return o
  }
}

// foo $baz $bar | other | cmd
function parseOperationPipeline(def) {
  const split = def.split(" ")
  const pipeline = [{operation: undefined, args: []}]
  for (const s of split) {
    if (s == "|") {
      pipeline.push({operation: undefined, args: []})
      continue
    }

    const p = pipeline[pipeline.length - 1]
    if (p.operation === undefined) {
      p.operation = s
      continue
    }


    p.args.push(s)
  }

  return pipeline
}

function inputAsString(input) {
  console.log("inputAsString", input)
  return input
}

function inputAsGenerator(input) {
  if (typeof input === 'string') {
    return (function*() { yield input })()
  }

  return input
}

function childText(state, node, type, start = 0, end = 0) {
  const c = type ? node.getChild(type) : node
  return c ? state.doc.sliceString(c.from + start, c.to + end) : undefined
}

function discoverOperationDef(state, name) {
  const tree = syntaxTree(state)
  const top = tree.topNode

  // operation definitions live between # headings and --- separators. find 
  // these boundaries and sort them so we can properly delimit our searches.
  const boundaries = [...top.getChildren('ATXHeading1'), ...top.getChildren('HorizontalRule')]
  boundaries.sort((a, b) => a.from - b.from)

  for (let i = 0; i < boundaries.length; ++i) {
    const boundary = boundaries[i]
    if (boundary.name !== 'ATXHeading1') {
      continue
    }
    const nextBoundary = boundaries[i + 1]
    const heading = boundary

    let operationDef = childText(state, heading, 'InlineCode', 1, -1)
    if (!operationDef) {
      const maybeOperationDef = childText(state, heading, null);
      const [,operationDef0, operationDefRest] = maybeOperationDef.match(/\[\[([a-zA-Z0-9\.\-_  ]+)\]\](.*)$/) || [];
      operationDef = `${operationDef0}${operationDefRest||''}`
    }
    if (!operationDef) { continue }
    console.log({operationDef, name})
    if (!operationDef.startsWith(name)) {
      continue
    }

    let from = heading.to

    let restText = 'template | complete | insert'
    if (heading.nextSibling?.name === 'Blockquote') {
      const p = childText(state, heading.nextSibling, 'Paragraph')
      if (p) {
        restText = p.split('\n')[0]
        from = heading.nextSibling.getChild('Paragraph').from + restText.length + 1 // include newline
      }
    }

    const parsed = parseOperationPipeline(operationDef)
    const rest = parseOperationPipeline(restText)
    let to = nextBoundary?.from
    let source = state.doc.sliceString(from, to)

    if (to === undefined) {
      to = from + source.length
    }
    
    return {
      head: parsed[0],
      rest,
      run({view, args}) {
        return async function({input}) {
          return {
            from,
            to,
            source,
            tree,
            state,
            input,
            args,
            head: parsed[0],
          }
        }
      },
    }
  }
}

export const defaultOperations = {
  'complete-via': {
    run({view, args}) {
      const config = {
        url: args[0],
        controller: newAbortController(),
        params: {
          model: "/res/model/huggingface/local",
          max_tokens: 1000,
        },
      }

      return async ({input}) => {
        async function *stream({config, params, input}) {
          try {
            const s = await inputAsString(input)
            console.log("complete starting. prompt:", s)
            for await (const r of llama(s, {...config.params, ...params}, config)) {
              // first try openai standard, then try llama.cpp standard
              yield r.data.choices ? r.data.choices[0]?.text : r.data.content
            }
            console.log("complete done")
          } finally {
            removeAbortController(config.controller)
          }
        }

        return {
          input: stream({config, input}),
        }
      }
    },
  },
  'template': {
    doc: `substitute {} and any provided arguments`,
    run({view}) {
      return async ({input, args, head, source}) => {
        // first substitue {}, then substitute each arg provided
        const replacement = await inputAsString(input)
        if (replacement === undefined) {
          input = source
        } else {
          if (source.includes('{}')) {
            input = source.replace('{}', replacement)
          } else {
            // if there is no {} then just insert it after a newline.
            input = source + "\n" + replacement
          }
        }
        if (input.endsWith('\n')) {
          input = input.substring(0, input.length - 1)
        }
        input = args.reduce(
          (acc, arg, i) => acc.replace(head.args[i], arg),
          input,
        )
        return {
          input,
        }
      }
    }
  },
  'insert': {
    doc: `insert the input after the dstFrom`,
    run({view, args, operationText, srcFrom, srcTo, dstFrom, dstTo, updateSelection = true, scrollIntoView = true}) {
      // carry the dstFrom along with our insertions unless the user moves it.

      if (dstTo === undefined) {
        if (dstFrom === undefined) {
          const selection = view.state.selection
          dstFrom = selection.main.to
        }

        // using multiple "…" characters is a hack so we can:
        // 1) keep inserting into the current region. (we will remove the last one once we're done inserting)
        // 2) show that we've started generating a completion

        dstTo = dstFrom + 2
        view.dispatch({
          changes: {from: dstFrom, insert: "……"},
          selection: updateSelection ? {anchor: dstFrom + 2} : undefined,
          effects: [
            addRegion.of({
              operationText,
              srcFrom,
              srcTo,
              dstFrom,
              dstTo,
            }),
          ],
        })

        // leave a trailing character to start, assume it will be cleaned up at the end!
        dstTo--
      } else {
        view.dispatch({
          changes: {from: dstFrom, to: dstTo, insert: "……"},
        })

        // leave a trailing character to start, assume it will be cleaned up at the end!
        dstTo = dstFrom + 1
      }

      return async ({input}) => {
        for await (const s of inputAsGenerator(input)) {
          const t = view.state.update({
            changes: {from: dstFrom, to: dstTo, insert: s},
            scrollIntoView,
          })
          dstFrom += s.length
          // only insert over a span the first time, after that we just insert at dstFrom
          if (dstTo !== dstFrom) {
            dstTo = dstFrom
          }
          if (t) {
            view.dispatch(t)
          }
        }

        view.dispatch({
          changes: {from: dstFrom, to: dstFrom + 1, insert: ""},
        })
      }
    },
  },
  'eval': {
    doc: `find the codefence and execute it, passing its output forward`,
    run({view}) {
      return async ({input, state, tree, from, to, args}) => {
        console.log({from, to, input})

        let fencedCode
        for (let child = tree.topNode.childAfter(from); child.from <= to; child = child.nextSibling) {
          if (child.name === 'FencedCode') {
            fencedCode = child
          }
        }
        if (!fencedCode) {
          throw new Error(`no fenced code found between ${from} and ${to}`)
        }
  
        console.log({fencedCode})

        const info = childText(state, fencedCode, 'CodeInfo')
        const text = childText(state, fencedCode, 'CodeText')

        console.log({info, text})

        if (info === 'js' || info === 'javascript') {
          // execute javascript code
          const fn = eval(`(() => ${text})()`)
          return await fn({view, args})({input})
        } else {
          throw new Error(`unsupported language: ${info}`)
        }
      }
    }
  }
}

class PlaceholderWidget extends WidgetType {
  constructor({operationText}) {
    super()
    this.operationText = operationText
  }
  eq(other) { return other.operationText === this.operationText }
  toDOM(view) {
    let wrap = document.createElement("button")
    wrap.className = "cm-operation-def"
    wrap.innerText = this.operationText
    wrap.setAttribute("data-operation-text", this.operationText)
    // wrap.style.userSelect = 'none'
    wrap.style.marginLeft = '0.25em'
    wrap.style.marginRight = '0.25em'
    wrap.style.fontSize = 'inherit'
    wrap.onmousedown = e => e.preventDefault()
    wrap.onclick = e => {
      let selection = view.state.selection.main
      // if no selection, use the whole document
      // take operation from the line we're on
      let from = 0
      let to = selection.to
      let dstFrom
      if (selection.from !== selection.to) {
        from = selection.from
      } else {
        const [underline] = mapField(
          view.state,
          underlineField,
          (iter) => (selection.from >= iter.from && selection.from < iter.to) ? ({
            from: iter.from,
            to: iter.to,
          }) : undefined,
        )
        if (underline) {
          from = underline.from
          to = underline.to
          dstFrom = underline.to
        }
      }
      if (dstFrom === undefined) {
        dstFrom = to
      }
      let input = view.state.doc.sliceString(from, to)

      const operationText = e.target.attributes['data-operation-text'].value
      const out = runOperationText({
        view,
        state: view.state,
        operationText,
        srcFrom: from,
        srcTo: to,
        input,
        dstFrom,
      })
      console.log({out})
    }
    return wrap
  }
}

const placeholderMatcher = new MatchDecorator({
  regexp: /\[\[([a-zA-Z0-9\.\-_ ]+)\]\]/g,
  decoration: match => Decoration.replace({
    widget: new PlaceholderWidget({operationText: match[1]}),
  })
})

const placeholders = ViewPlugin.fromClass(class {
  constructor(view) {
    this.placeholders = placeholderMatcher.createDeco(view)
  }
  update(update) {
    this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
  }
}, {
  decorations: instance => instance.placeholders,
  provide: plugin => EditorView.atomicRanges.of(view => {
    return view.plugin(plugin)?.placeholders || Decoration.none
  }),
})

// TODO add code folding
// TODO add operation that will "read" the implementation of another operation
// TODO add operation that will execute another operation
//  You can be extended by defining operations that operate on input text. An operation has a name, an underlying prompt. The prompts use a placeholder like:
export const defaultValue = `there is a park
:haiku

:fetch http://localhost:8080/bridge2;sessions=sp-01HRDXSC0ZZEA42EP0RDXMZPGC/sessions/cnl7bt7p0ons73b0b0hg/text

---

# [[complete]]
> phi-2

---

# [[phi-2]]
> complete-via /phi-2/v1/completions

---

# [[mixtral-8x7b-instruct]]
> complete-via /mixtral-8x7b-instruct/v1/completions

---

# [[local-llamafile]]
> complete-via http://localhost:8080/completion

---

# [[airoboros-l2-13b-2.2]]
> complete-via /airoboros-l2-13b-2.2/v1/completions

---

# [[fetch]]
> eval | insert

${"```"}js
function ({view, args}) {
  const url = args[0]
  return async ({input, args}) => {
    const r = await fetch(url)
    return {
      input: await r.text(),
    }
  }
}
${"```"}

---

# [[missing]] $operation
> template | complete | insert
You are a professional, extensible, LLM-powered text editor. Your task is to generate a generic, reusable prompt for the $operation operation. Use {} as a placeholder for input.

Stop after you output the prompt. Do not evaluate the prompt. Do not mention the prompt or operation itself.

Prompt:

---
`







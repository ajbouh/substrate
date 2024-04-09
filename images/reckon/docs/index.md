---
title: Reckon
---

```js
import {
  CodeMirror,
  EditorView,
  keymap,
  StateEffect,
  StateField,
  Decoration,
  fieldView,
  history,
  historyKeymap,
  // basicSetup,
  markdown, markdownKeymap,
  languages,

} from "./components/codemirror.js"

import {
  regionExtension,
  removeUnderline,
  regionField,
  defaultValue,
} from "./components/reckon.js"
```

```js
const [regionView, region] = fieldView(regionField, (view, iter) => ({
    from: iter.from,
    to: iter.to,
    "iter.value.spec": iter.value.spec,
    slice: ev.state.doc.sliceString(iter.from, iter.to),
    remove() {
      console.log("removing", this.slice)
      ev.dispatch({
        effects: [
          removeUnderline.of({from: this.from, to: this.to}),
        ],
      })
    },
  }))

const {container: e, view: ev} = CodeMirror(defaultValue, {
  extensions: [
    myDefaultTheme,
    regionExtension(),
    regionView,
    history({
      minDepth: 1000,
    }),
    // basicSetup,
    markdown({
      codeLanguages: languages,
    }),

    EditorView.lineWrapping,
  ],
  keymaps: [
    keymap.of(historyKeymap),
  ],
})
```
```js
const editor = view(e);
window.editor = ev
```

```js
display(editor)
```

```js
const myDefaultTheme = EditorView.theme({
  '&': {
    fontFamily: 'Consolas, "Roboto Mono", monospace',
    fontSize: '14px',
    height: '80vh',
    border: '1px solid #ddd',
  },
})
```

```js

```

```js
html`${region.map(u => {
  return html`<div><a href="#" onmousedown=${(e) => e.preventDefault()} onclick=${(e) => {u.remove(); e.preventDefault()}}>&#x2718;</a>&nbsp;&nbsp;${u.slice}</div>`
})}`
```

```js
display(region)
```

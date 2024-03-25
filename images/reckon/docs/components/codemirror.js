import { Mutable } from "npm:@observablehq/stdlib";
import { html } from "npm:htl";
import { Compartment, EditorState, StateField, StateEffect } from 'npm:@codemirror/state'
import { EditorView, Decoration, keymap, ViewUpdate, ViewPlugin, WidgetType, MatchDecorator } from 'npm:@codemirror/view'
import { defaultKeymap, history, historyKeymap } from 'npm:@codemirror/commands'
import { defaultHighlightStyle, syntaxHighlighting, syntaxTree } from 'npm:@codemirror/language'
import { markdown, markdownKeymap } from "npm:@codemirror/lang-markdown"
import { languages } from "npm:@codemirror/language-data"

export {
    Compartment,
    EditorState,
    EditorView, keymap,
    StateEffect,
    Decoration,
    StateField,
    syntaxTree,
    ViewUpdate, ViewPlugin,
    WidgetType,
    MatchDecorator,
    // basicSetup,
    markdown, markdownKeymap,
    languages,
    defaultKeymap, history, historyKeymap,
    defaultHighlightStyle, syntaxHighlighting,
}

const calcChange = (previous, next, selection) => {
  // Find where to start inserting
  for (
    var insertOffset = 0;
    insertOffset < selection.ranges[0].from;
    insertOffset++
  ) {
    if (previous[insertOffset] !== next[insertOffset]) break;
  }

  // Find where the insert ends
  for (
    var endOffset = 0;
    endOffset < previous.length - selection.ranges[0].from;
    endOffset++
  ) {
    if (
      previous[previous.length - endOffset - 1] !==
      next[next.length - endOffset - 1]
    )
      break;
  }
  const insert = next.substring(insertOffset, next.length - endOffset);
  const cursor = Math.min(insertOffset + insert.length, next.length);
  return {
    changes: [
      {
        from: insertOffset,
        to: previous.length - endOffset,
        insert
      }
    ],
    selection: {
      anchor: cursor,
      head: cursor
    }
  };
}

export const CodeMirror = (doc = "", config = {}) => {
  const extensions = config.extensions ?? [];
  const keymaps = config.keymaps ?? [];

  const updateViewOf = EditorView.updateListener.of((update) => {
    const s = update.state.doc.toString()
    if (doc !== s) {
      doc = s;
      container.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  const view = new EditorView({
    doc,
    extensions: [updateViewOf, ...extensions, ...keymaps]
  });
  const el = view.dom;
  const container = html`<div><span onInput=${(evt) => evt.stopPropagation()}>${el}`;
  Object.defineProperty(container, "value", {
    enumerable: true,
    get: () => ({
      content: doc,
      get state() { return view.state },
    }),
    set: ({content = ""}) => {
      const change = calcChange(doc, newContent, view.state.selection);
      doc = content;
      view.dispatch(change);
    }
  });

  return {view, container};
}

export function mapField(state, field, mapFn) {
  const v = []
  let f = state.field(field, false)
  if (!f) {
    return v
  }

  const iter = f.iter()
  while (iter.value) {
    const e = mapFn(iter)
    if (e) {
      v.push(e)
    }
    iter.next()
  }

  return v
}
  
export function fieldView(field, mapFn) {
  const m = Mutable()

  const updateViewOf = EditorView.updateListener.of((update) => {
    m.value = mapField(update.state, field, iter => mapFn(update.view, iter))
  })

  return [updateViewOf, m]
}

// text-editor
// group these together so we can delay init until they are all loaded and available.

Events.send(ready, true);

const mirror = window.CodeMirror;
const editor = new mirror.EditorView({
    doc: Events.once(recordData),
    extensions: [
        mirror.basicSetup,
        mirror.EditorView.lineWrapping,
        mirror.EditorView.editorAttributes.of({
            "class": "editor",
            "style": "height: 100vh",
        }),
        mirror.keymap.of([mirror.indentWithTab])
    ],
});

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const recordData = Events.select(
    undefined,
    Events.change(records[0]), (now, record) => {
        console.log("recordData", record)
        if (record.data_url) {
            return fetch(record.data_url).then(r => r.text())
        }
        return ""
    },
);
console.log({recordData});

((recordData, editor) => {
    const from = 0
    const to = editor.state.doc.length
    const insert = recordData
    editor.dispatch(editor.state.update({changes: {from, to, insert}}))
})(recordData, editor);

((editor, focused) => {
    editor.focus()
})(editor, focused);

((editor) => {
    document.body.appendChild(editor.dom)

    Events.send(menuOptions, [
        {value: "save", label: "save"},
    ])
})(Events.once(editor));

((menuSelection) => {
    console.log({menuSelection})
})(menuSelection);
// text-editor
// group these together so we can delay init until they are all loaded and available.

const modules = Behaviors.resolvePart({
    cm: import("./blocks/codemirror/codemirror.js"),
})
const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const synthRecords = Behaviors.collect([], recordsUpdated, (now, {records: {incremental, records}}) => incremental ? [...now, ...records] : records);
const synthRecord = synthRecords[0] ?? false
const synthRecordData = Events.select(
    undefined,
    Events.change(synthRecord), (now, record) => {
        if (record?.data_url) {
            return fetch(record.data_url).then(r => r.text())
        }
        return ""
    },
);

const {
    EditorSelection,
    EditorView,
    Compartment,
    keymap,
    basicSetup,
    indentWithTab,
} = modules.cm

const keymapCompartment = new Compartment();

const editor = new EditorView({
    doc: "",
    extensions: [
        basicSetup,
        EditorView.lineWrapping,
        EditorView.editorAttributes.of({
            "class": "editor",
            "style": "height: 100vh",
        }),
        keymap.of([
            indentWithTab,
        ]),
        keymapCompartment.of(keymap.of([])),
    ],
});

const commands = Behaviors.gather(/Command$/)

editor.dispatch({
    effects: keymapCompartment.reconfigure(keymap.of(Object.values(commands)))
});

((record, recordData, editor) => {
    const from = 0
    const to = editor.state.doc.length
    const insert = recordData
    let selection
    try {
        selection = record.fields?.selection ? EditorSelection.fromJSON(record.fields?.selection) : undefined
    } catch (e) {
        console.error(e, {record})
    }
    editor.dispatch(editor.state.update({
        changes: {from, to, insert},
        selection,
    }))
})(synthRecord, synthRecordData, editor);

((editor, focused) => {
    editor.focus()
})(editor, focused);

((editor) => {
    document.body.appendChild(editor.dom)
})(Events.once(editor));

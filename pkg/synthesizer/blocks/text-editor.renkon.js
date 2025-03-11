// text-editor
// group these together so we can delay init until they are all loaded and available.

const modules = Behaviors.resolvePart({
    cm: import("./blocks/codemirror/codemirror.js"),
})
const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const synthRecords = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);
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

const synthSaveData = (data) => {
    const latest = {fields: {...synthRecord?.fields}, data}
    Events.send(recordsWrite, [latest])
    return {data, latest}
};

const {
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

const saveCommand = {
    key: "Mod-s",
    run: (editor) => {
        synthSaveData(editor.state.doc.toString())
        return true;
    }
};

editor.dispatch({
    effects: keymapCompartment.reconfigure(keymap.of([saveCommand]))
});

((recordData, editor) => {
    const from = 0
    const to = editor.state.doc.length
    const insert = recordData
    editor.dispatch(editor.state.update({changes: {from, to, insert}}))
})(synthRecordData, editor);

((editor, focused) => {
    editor.focus()
})(editor, focused);

((editor) => {
    document.body.appendChild(editor.dom)
})(Events.once(editor));

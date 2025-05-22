// text-editor
// group these together so we can delay init until they are all loaded and available.

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const synthRecords = Behaviors.collect([], recordsUpdated, (now, {records: {incremental, records}={}}) => records ? incremental ? [...now, ...records] : records : now);
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

console.log({modules});

const {criteriaMatcher} = modules.recordsMatcher

const {
    EditorSelection,
    EditorView,
    Compartment,
    keymap,
    basicSetup,
    indentWithTab,
} = modules.codemirror

const extensionsCompartment = new Compartment();

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
        extensionsCompartment.of([]),
    ],
});

const componentsUpdated = Events.resolvePart(Events.collect(
    undefined,
    recordsUpdated, componentsUpdatedFromRecordsUpdated(/^components($|\/)/)));

// for now we only process components/extensions
const extensionComponentPromises = Behaviors.collect(
    undefined,
    componentsUpdated, componentPromisesBehavior("components/extensions"));
// Behaviors.resolvePart would be better but seems to swallow updates in some cases
const extensionComponentMaybes = Promise.all(extensionComponentPromises.promises)
const extensionComponents = extensionComponentMaybes.filter(entry => entry.component)

// an efficient way to save the current record
const saver = Events.receiver();
((saver, synthRecord) => {
    const writes = saver(synthRecord)
    console.log({saver, writes, synthRecord})
    if (writes?.length) {
        Events.send(recordsWrite, writes);
    }
})(saver, synthRecord);

const extensions = extensionComponents.map(
    ({component, record}) =>
        component({
            modules,
            sendRecordsWrite: (writes) => Events.send(recordsWrite, writes),
            sendPanelEmit: (writes) => Events.send(panelEmit, writes),
            sendSaver: (fn) => Events.send(saver, fn)
        }, record.id));

const extensionsWithMatchers = Object.values(extensions).map(
    ({criteria, extension}) => ({matcher: criteriaMatcher(criteria), criteria, extension}));

((record, extensionsWithMatchers) => {
    const filtered = extensionsWithMatchers.filter(({matcher}) => !matcher || matcher(record))
    editor.dispatch({
        effects: extensionsCompartment.reconfigure(filtered),
    });
})(synthRecord, extensionsWithMatchers);

((record, recordData, editor) => {
    const from = 0
    const to = editor.state.doc.length
    if (editor.state.doc.toString() === recordData) {
        // this is a bit of a hack as it doesn't account for selection changes.
        return
    }

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

const focusEditor = ((editor, focused) => {
    editor.focus()
})(editor, focused);

const appendEditor = ((editor) => {
    document.body.appendChild(editor.dom)
})(Events.once(editor));


function allPointers(o, parentPath = "", visited = new Set()) {
    let pointers = [];
  
    if (typeof o !== 'object' || o === null || visited.has(o)) {
        return pointers;
    }
    visited.add(o); // Add current object to this path's visited set
  
    for (const k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k)) {
            const pointer = parentPath ? `${parentPath}/${k}` : k;
            pointers.push(pointer);

            const v = o[k];
            if (typeof v === 'object' && v !== null) {
                pointers = pointers.concat(allPointers(v, pointer, new Set(visited)));
            }
        }
    }
    
    return pointers;
}
// calculate allPointers for record
// populate a select with all the pointers in the object
// including data
// when a pointer is selected, update the current value of the record and then swap to the newly chosen pointer
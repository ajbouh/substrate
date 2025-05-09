const synthSaveData = (data, moreFields) => {
    const latest = {fields: {...synthRecord?.fields, ...moreFields}, data}
    Events.send(recordsWrite, [latest])
    return {data, latest}
};

const saveCommand = {
    key: "Mod-s",
    run: (editor) => {
        synthSaveData(editor.state.doc.toString(), {selection: editor.state.selection.toJSON()})
        return true;
    }
};

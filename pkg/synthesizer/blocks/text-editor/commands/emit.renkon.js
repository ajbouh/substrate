const emitCommand = {
    key: "Mod-e",
    run: (editor) => {
        const content = editor.state.doc.toString()
        const selections = editor.state.selection.ranges.every(range => range.empty)
            ? [content]
            : editor.state.selection.ranges.map(({from, to}) => content.substring(from, to))

        Events.send(panelEmit, [{fields: {selections}}])
        return true;
    }
};

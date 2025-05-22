export function component({
    modules,
    sendRecordsWrite,
    sendPanelEmit,
}) {
    const {
        keymap,
    } = modules.codemirror

    const extension = keymap.of([
        {
            key: "Mod-e",
            run: (editor) => {
                const content = editor.state.doc.toString()
                const selections = editor.state.selection.ranges.every(range => range.empty)
                    ? [content]
                    : editor.state.selection.ranges.map(({from, to}) => content.substring(from, to))

                sendPanelEmit([{fields: {selections}}])
                return true;
            },
        },
    ])

    return {
        extension,
    }
}

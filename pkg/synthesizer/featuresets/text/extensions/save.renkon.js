export function component({
    modules,
    sendSaver,
}) {
    const {
        keymap,
    } = modules.codemirror

    const extension = keymap.of([
        {
            key: "Mod-s",
            run: (editor) => {
                const state = editor.state
                sendSaver((latest) => {
                    return [
                        {
                            data: state.doc.toString(),
                            fields: {
                                ...latest.fields,
                                selection: state.selection.toJSON(),
                            },
                        },
                    ]
                })
                return true;
            },
        },
    ])

    return {
        extension,
    }
}

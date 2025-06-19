export function component({
    modules,
    panel,
    sendRecordsWrite,
}) {
    const {
        EditorView,
    } = modules.codemirror

    function genchars(length) {
        let result = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charsLength = chars.length;
        for ( let i = 0; i < length; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    }

    const declareSelection = (selection) => {
        if (!selection) {
            if (panel.fields.selectionQuery) {
                return [
                    {
                        fields: {
                            ...panel.fields,
                            selectionQuery: undefined,
                        },
                    },
                ]
            } else {
                return undefined
            }
        }

        const selectionid = genchars(10)
        console.log('declareSelection', {selection, selectionid})

        const selectionQuery = {basis_criteria: {where: {selectionid: [{compare: '=', value: selectionid}]}}}
        console.log("declaring selection", selection)

        return [
            {
                fields: {
                    type: 'selection',
                    selectionid,
                    selection,
                }
            },
            {
                fields: {
                    ...panel.fields,
                    selectionQuery,
                },
            },
        ]
    }

    const extension = EditorView.updateListener.of((update) => {
        if (update.selectionSet) {
            const writes = declareSelection(
                update.state.selection.ranges.some(range => !range.empty)
                    ? update.state.selection.toJSON()
                    : undefined)
            if (writes?.length) {
                sendRecordsWrite(writes)
            }
        }
    })

    return {
        extension,
    }
}

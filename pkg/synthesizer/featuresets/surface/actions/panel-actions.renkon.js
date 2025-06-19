export function component({
    recordRead,
}) {
    const offers = [
        {
            verb: 'close',
            group: 'panel',
            key: 'panel-close',
            label: "✕",
            criteria: {type: [{compare: '=', value: 'panel'}]},
            description: '',
            act: ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}, keys}}}}) => {
                const panels = records
                const panelKeys = new Set([...(panels || []).map(panel => panel.fields.key), ...(keys || [])])
                console.log('panel-close', panelKeys)
                return [...panelKeys].flatMap(key => panelWrite(sender, {target: key, close: true}))
            },
        },
        {
            // verb: '',
            group: 'panel',
            key: 'panel-modify',
            criteria: {type: [{compare: '=', value: 'panel'}]},
            description: '',
            act: ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}, layout, fields}}}}) => {
                const panels = records
                const panelKeys = panels.map(panel => panel.fields.key)
                return panelKeys.flatMap(key => panelWrite(sender, {target: key, panel: fields, layout}))
            },
        },
        {
            verb: 'navigate-back',
            group: 'panel',
            key: 'panel-navigate-back',
            label: "⏴",
            criteria: {type: [{compare: '=', value: 'panel'}]},
            enabled: {back: [{compare: 'is not', value: null}]},
            description: '',
            act: async ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}}}}}) => {
                const panels = records
                const panelKeys = panels.map(panel => panel.fields.key)
                const targetKeys = metaKey ? panelKeys.map(_ => null) : panelKeys
                const historicals = await Promise.all(panels.map(panel => panel.fields?.back && recordRead(panel.fields?.back)))
                console.log('panel-navigate-back', {records, panelKeys, targetKeys, historicals})
                const writes = await Promise.all(historicals.map(
                    (read, i) => read
                        ? panelWrite(sender, {
                            target: targetKeys[i],
                            panel: {
                                queryset: undefined,
                                selectionQuery: undefined,
                                ...read.fields,
                                next: panels[i].id,
                            },
                        })
                        : []
                    ))
                return writes.flat(1)
            },
        },
        {
            verb: 'navigate-forward',
            group: 'panel',
            key: 'panel-navigate-forward',
            label: "⏵",
            criteria: {type: [{compare: '=', value: 'panel'}]},
            enabled: {next: [{compare: 'is not', value: null}]},
            description: '',
            act: async ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}}}}}) => {
                console.log('panel-navigate-forward', records)
                const panels = records
                const panelKeys = panels.map(panel => panel.fields.key)
                const targetKeys = metaKey ? panelKeys.map(_ => null) : panelKeys
                const historicals = await Promise.all(panels.map(panel => panel.fields?.next && recordRead(panel.fields?.next)))
                const writes = await Promise.all(historicals.map(
                    (read, i) => read
                        ? panelWrite(sender, {
                            target: targetKeys[i],
                            panel: {
                                queryset: undefined,
                                selectionQuery: undefined,
                                ...read.fields,
                                back: panels[i].id,
                                next: undefined,
                            },
                        })
                        : []
                    ))
                return writes.flat(1)
            }
        },
    ];

    return {
        offers,
    }
}

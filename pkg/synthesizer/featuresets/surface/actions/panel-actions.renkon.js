export function component({
    recordRead,
}) {
    const offers = [
        {
            // verb: '',
            key: 'panel-start',
            description: '',
            act: ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}, layout, fields}}}}) => {
                const panelKeys = [null]
                return panelKeys.flatMap(key => panelWrite(sender, {target: key, panel: {block: 'start', ...fields}, layout}))
            },
        },
        {
            verb: 'close',
            key: 'panel-close',
            criteria: {},
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
            key: 'panel-navigate-back',
            criteria: {type: [{compare: '=', value: 'panel'}]},
            description: '',
            act: async ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}}}}}) => {
                console.log('panel-navigate-back', records)
                const panels = records
                const panelKeys = panels.map(panel => panel.fields.key)
                const targetKeys = metaKey ? panelKeys.map(_ => null) : panelKeys
                const historicals = await Promise.all(panels.map(panel => panel.fields?.back && recordRead(panel.fields?.back)))
                const writes = await Promise.all(historicals.map(
                    (read, i) => read
                        ? panelWrite(sender, {
                            target: targetKeys[i],
                            panel: {
                                queryset: undefined,
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
            key: 'panel-navigate-forward',
            criteria: {type: [{compare: '=', value: 'panel'}]},
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

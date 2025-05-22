export function component({
}) {
    const offers = [
        {
            verb: 'open',
            criteria: {
                type: [{compare: "=", value: 'block'}]
            },

            // description,
            act: ({panelWrite, records, cue: {fields: {query, panel, dat: {event: {metaKey} = {}} = {}}}}) => {
                const record = records?.[0]
                const target = metaKey ? undefined : 'self'
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: record?.fields?.block,
                    }
                })
            },
        },
    ]

    return {
        offers,
    }
}

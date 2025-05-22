export function component({
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-global-explorer',
            // criteria,
            description: 'start global explorer',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? undefined : 'self'
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'explorer',
                        queryset: {
                            records: {
                                global: true
                            }
                        }
                    }
                })
            },
        },
        {
            verb: 'start',
            key: 'start-surface-explorer',
            // criteria,
            description: 'start surface explorer',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? undefined : 'self'
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'explorer',
                    }
                })
            },
        },
    ];

    return {
        offers,
    }
}

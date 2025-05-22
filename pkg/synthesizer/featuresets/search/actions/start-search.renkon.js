export function component({
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-demo-echo',
            // criteria,
            description: 'start demo echo',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? undefined : 'self'
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'demo-echo',
                    }
                })
            },
        },
        {
            verb: 'start',
            key: 'start-search',
            // criteria,
            description: 'start search',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? undefined : 'self'
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'search',
                    }
                })
            },
        },
    ];

    return {
        offers,
    }
}

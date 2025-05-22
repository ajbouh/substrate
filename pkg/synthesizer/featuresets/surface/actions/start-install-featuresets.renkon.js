export function component({
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-install-featuresets',
            // criteria: false,
            description: 'install featuresets',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                console.log("start-install-featuresets", panel)
                const target = metaKey ? undefined : 'self'
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'featuresets',
                    }
                })
            },
        },
    ];

    return {
        offers,
    }
}

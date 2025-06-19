export function component({
    genpath,
    withActionCueRecord,
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-new-text-draft',
            // criteria,
            description: 'start new text ...',
            label: 'start new text ...',
            act: ({ribbonControl, cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.txt`
                ribbonControl({draft: {key: 'start-new-text', panel, parameters: {path}}})
                return []
            },
        },
        {
            verb: '',
            key: 'start-new-text',
            // criteria,
            description: 'start new text',
            act: ({cue: {fields: {query, panel, dat, parameters} = {}}}) => {
                const path = parameters?.path ?? `${genpath()}.txt`
                const start = {
                    fields: {
                        path,
                        self: ['path'],
                        type: "text",
                        schema: {
                            data: {format: "text/plain"},
                        },
                    },
                    data: `sample data for ${path}`,
                }
                return withActionCueRecord([start], {verb: 'edit', panel, dat})
            },
        },
    ];

    return {
        offers,
    }
}

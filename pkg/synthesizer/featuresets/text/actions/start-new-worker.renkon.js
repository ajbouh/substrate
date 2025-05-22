export function component({
    genpath,
    withActionCueRecord,
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-new-text',
            // criteria,
            description: 'start new text',
            act: ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.txt`
                const start = {
                    fields: {
                        path,
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

export function component({
    genpath,
    withActionCueRecord,
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-new-action',
            // criteria,
            description: 'start new action',
            act: ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.renkon.js`
                const start = {
                    fields: {
                        path,
                        type: "action",
                        action: path,
                        schema: {
                            data: {format: "text/javascript"},
                        },
                    },
                    data: `export function component() {
    // write your new action here!
}`,
                }
                return withActionCueRecord([start], {verb: 'edit', panel, dat})
            },
        },
    ];

    return {
        offers,
    }
}

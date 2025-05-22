export function component({
    // todo pass in ability to query records
    genpath,
    withActionCueRecord,
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-new-facet',
            // criteria,
            description: 'start new facet',
            act: ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.facet`
                const start = {
                    fields: {
                        path,
                        type: "facet",
                        schema: {
                            data: {format: "text/plain"},
                        },
                    },
                    data: `https://substratehost.local/substrate/v1/msgindex`,
                }
                return withActionCueRecord([start], {verb: 'edit', panel, dat})
            },
        },
    ];

    return {
        offers,
    }
}

export function component({
    // todo pass in ability to query records
    genpath,
    withActionCueRecord,
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-new-uri-list',
            // criteria,
            description: 'start new uri-list file',
            act: ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.uri`
                const start = {fields: {path, type: "text/plain"}, data: `https://substratehost.local/substrate/v1/msgindex`}
                return withActionCueRecord([start], {verb: 'edit', panel, dat})
            },
        },
    ];

    return {
        offers,
    }
}

export function component({
    // todo pass in ability to query records
    genpath,
    withActionCueRecord,
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-new-msgtxt-file',
            // criteria,
            description: 'new msgtxt file',
            act: ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.msgtxt`
                const start = {fields: {path, type: "text/plain"}, data: ``}
                return withActionCueRecord([start], {verb: 'edit', panel, dat})
            },
        },
    ];

    return {
        offers,
    }
}

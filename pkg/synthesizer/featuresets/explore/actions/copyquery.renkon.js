export function component() {
    const offers = [
        {
            verb: 'copy query',
            criteria: {
                path: [{compare: "like", value: '/%'}]
            },
            act: async ({cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(JSON.stringify(query))
                return []
            }
        },
        {
            verb: 'copy records query',
            criteria: {
                path: [{compare: "like", value: '/%'}]
            },
            act: async ({cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(JSON.stringify({records: query}))
                return []
            }
        },
    ]

    return {
        offers,
    }
}

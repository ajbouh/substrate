export function component() {
    const offers = [
        {
            verb: 'copy query',
            criteria: {},
            act: async ({cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(JSON.stringify(query))
                return []
            }
        },
        {
            verb: 'copy records query',
            criteria: {},
            act: async ({cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(JSON.stringify({records: query}))
                return []
            }
        },
        {
            verb: 'copy data url',
            criteria: {},
            act: async ({records, cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(records.map(record => record.data_url).join("\n"))
                return []
            }
        },
        {
            verb: 'copy fields jsonl',
            criteria: {},
            act: async ({records, cue: {fields: {query}}}) => {
                const jsonl = records.map(record => JSON.stringify(record.fields)).join("\n")
                console.log('copying jsonl ...', jsonl)
                await navigator.clipboard.writeText(jsonl)
                return []
            }
        },
        {
            verb: 'dump to console log',
            criteria: {},
            act: async ({records, cue: {fields: {query}}}) => {
                console.log({records})
                return []
            }
        },
    ]

    return {
        offers,
    }
}

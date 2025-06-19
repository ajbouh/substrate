export function component() {
    const offers = [
        {
            verb: 'copy query',
            group: 'dev',
            criteria: {},
            act: async ({cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(JSON.stringify(query))
                return []
            }
        },
        {
            verb: 'copy records query',
            group: 'dev',
            criteria: {},
            act: async ({cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(JSON.stringify({records: query}))
                return []
            }
        },
        {
            verb: 'copy data url',
            group: 'dev',
            criteria: {},
            act: async ({records, cue: {fields: {query}}}) => {
                console.log('copying query ...', query)
                await navigator.clipboard.writeText(records.map(record => record.data_url).join("\n"))
                return []
            }
        },
        {
            verb: 'copy fields jsonl',
            group: 'dev',
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
            group: 'dev',
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

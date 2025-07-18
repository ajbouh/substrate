export function component() {
    const offers = [
        {
            verb: 'delete',
            criteria: {
                path: [{compare: "like", value: '/%'}]
            },
            scopes: ['external'],
            act: ({records}) => records
                    .filter(record => record.fields?.path)
                    .map(record => ({fields: {path: record.fields?.path, deleted: true}})),
        },
    ]

    return {
        offers,
    }
}

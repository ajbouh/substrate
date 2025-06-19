export function component({
    genpath,
    withActionCueRecord,
}) {
    function actionComponent({
        actionRecord,
    }) {
        const recordDigest = record => record.fields.self
            ? {self: record.fields.self, ...(Object.fromEntries(record.fields.self.map(field => [field, record.fields[field]])))}
            : {self: ["id"], id: record.id}

        const offers = [
            {
                verb: `include in context ${actionRecord.fields.context.path}`,
                criteria: {
                    // need a way to reference it
                    // self: [{compare: "is not", value: null}]
                },
                scopes: ['focus'],
                // description,
                act: ({records, cue: {fields: {query, panel, dat: {event: {metaKey} = {}} = {}}}}) => {
                    return [
                        ...records.map(record => ({
                            fields: {
                                self: ["type", "context", "record"],
                                type: "link",
                                context: actionRecord.fields.context,
                                record: recordDigest(record),
                                // HACK just to make these easy to see and delete
                                path: `/links/context${actionRecord.fields.context.path}/record${record.fields.path}`,
                            },
                        })),
                    ]
                },
            },
        ]

        return {
            offers,
        }
    }

    const recordDigest = record => record.fields.self
        ? {self: record.fields.self, ...(Object.fromEntries(record.fields.self.map(field => [field, record.fields[field]])))}
        : {self: ["id"], id: record.id}

    const offers = [
        {
            verb: 'start',
            key: 'start-new-context',
            // criteria,
            description: 'start new context',
            act: ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `/contexts${genpath()}`
                const context = {
                    fields: {
                        self: ["type", "path"],
                        type: "context",
                        path,
                    },
                }
                const action = {
                    fields: {
                        type: 'action',
                        action: `${path}/actions/include`,
                        schema: {'data': {format: 'text/javascript'}},
                        path: `${path}/actions/include`,
                        context: recordDigest(context),
                    },
                    data: actionComponent.toString().replace(/^function actionComponent/, 'export function component')
                }
                return withActionCueRecord([context, action], {verb: 'open', panel, path, dat})
            },
        },
    ];

    return {
        offers,
    }
}

export function component({
    recordRead,
}) {

    const offers = [
        {
            verb: 'redo',
            criteria: {
                // this key syntax is based on sqlite json_extract path syntax. we compare to 1 because that's how sqlite represents true.
                'links.cause.attributes."eventref:redo"': [{compare: "=", value: 1}],
            },

            act: ({records, cue: {fields: {panel, dat: {event}={}}}}) => {
                const record = records[0]
                const id = record.fields.links.cause.attributes['eventref:event']
                if (!id) {
                    return false
                }
                return recordRead(id).then(cause => {
                    const write = {
                        fields: {
                            ...cause.fields,
                            dat: {
                                ...cause.fields.dat,
                                event,
                            },
                            panel,
                            redo: record.id,
                            actor: undefined, // do not reuse the previous actor value
                        }
                    }
                    return [write]
                })
            },
        },
    ]

    return {
        offers,
    }
}

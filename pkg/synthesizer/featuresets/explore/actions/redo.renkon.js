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

            act: ({records}) => {
                const id = records[0].fields.links.cause.attributes['eventref:event']
                console.log({id})
                if (!id) {
                    return false
                }
                return recordRead(id).then(cause => {
                    const write = {
                        fields: {
                            ...cause.fields,
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

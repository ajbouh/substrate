const redoAction = (() => {
    const recordRead = id => new Promise((resolve, reject) => {
        const ch = new window.MessageChannel()
        ch.port2.onmessage = ({data: {records: [record]}}) => {
            // console.log("recordRead", id, record)
            resolve(record)
        }
        ch.port2.onmessageerror = (evt) => reject(evt)
        Events.send(recordsQuery, {
            ns: [`recordread-hack-${+new Date()}`], // this approach to ns is a hack :(
            port: ch.port1,
            global: true,
            queryset: {records: {basis_criteria: {where: {id: [{compare: "=", value: id}]}}}},
            [Renkon.app.transferSymbol]: [ch.port1],
        })
    })
    
    return {
        verb: 'redo',
        criteria: {
            // this key syntax is based on sqlite json_extract path syntax. we compare to 1 because that's how sqlite represents true.
            'links.cause.attributes."eventref:redo"': [{compare: "=", value: 1}],
        },
        act: ({records, msgtxtParser, msg, cue}) => {
            const id = records[0].fields.links.cause.attributes['eventref:event']
            console.log({id})
            if (!id) {
                return false
            }
            recordRead(id).then(cause => {
                const write = {
                    fields: {
                        ...cause.fields,
                        actor: undefined, // do not reuse the previous actor value
                    }
                }
                Events.send(recordsWrite, [write])
            })
            return true
        },
    }
})()

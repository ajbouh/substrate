const sendmsgAction = (() => {
    const fetchText = url => url ? fetch(url).then(response => response.text()) : Promise.resolve('')

    const fetchRecords = queryset => new Promise((resolve, reject) => {
        const ch = new window.MessageChannel()
        ch.port2.onmessage = ({data}) => {
            // console.log("recordRead", id, record)
            resolve(data)
        }
        ch.port2.onmessageerror = (evt) => reject(evt)
        Events.send(recordsQuery, {
            ns: [`fetchrecords-hack-${+new Date()}`], // this approach to ns is a hack :(
            port: ch.port1,
            global: true,
            queryset,
            [Renkon.app.transferSymbol]: [ch.port1],
        })
    })

    // ['id', id] // becomes id lookup
    // ['path', path] // becomes path lookup
    const queryAndReducerFromRefSelector = ([head, ...rest]) => {
        const fieldLookup = async (o, field) => o?.[field] ?? (
            (field === 'data' && 'data_url' in o)
            ? await fetchText(o.data_url)
            : undefined
        )
        const fieldsReduce = async (acc, selector) => {
            console.log("fieldsReduce", {acc, selector})
            for (const field of selector) {
                acc = await fieldLookup(acc, field)
            }
            return acc
        }
        switch (head) {
        case 'id':
            return {
                query: {basis_criteria: {where: {id: [{compare: "=", value: rest[0]}]}}},
                reduce: async records => await fieldsReduce(records?.[0], rest.slice(1))
            }
        case 'path':
            return {
                query: {basis_criteria: {where: {path: [{compare: "=", value: rest[0]}]}}, view: "group-by-path-max-id"},
                reduce: async records => await fieldsReduce(records?.[0], rest.slice(1))
            }
        default:
            throw new Error(`unknown refselector ${JSON.stringify([head, ...rest])}`)
        }
    }

    const resolveRefs = async ({msg, r, pre}) => {
        const queriesAndReducers = pre.map(([dst, src]) => [dst, queryAndReducerFromRefSelector(src)])
        const queryset = queriesAndReducers.map(([_, {query}], i) => [`${i}`, query])
        const refRecords = await fetchRecords(Object.fromEntries(queryset))

        const refResults = await Promise.all(
            Object.entries(refRecords).map(async ([i, records]) => {
                const [dst, {reduce}] = queriesAndReducers[+i]
                console.log("refRecords", {i, records, dst, reduce})
                return [dst, await reduce(records)]
            })
        )

        for (const [dst, val] of refResults) {
            msg.setPath(r, dst, val)
        }

        console.log("resolveRefs", {pre, refResults, r, refRecords, queryset})
        return r
    }

    return {
        verb: 'run',
        criteria: {
            path: [{compare: "like", value: '%.msgtxt'}]
            // how to check if the record has data?
            // && record.data_url
        },
        act: ({records, msgtxtParser, msg, cue}) => {
            const {fields: {panel}} = cue
            const record = records?.[0]
            fetchText(record.data_url).then(data => {
                const {input, value, next} = msgtxtParser.parse(data).toMsg()

                // input becomes pre
                const pre = input.map(({src, dst}) => [dst, src])

                // value becomes ret
                const ret = next ? next.input.map(({src, dst}) => [dst, src]) : undefined

                return resolveRefs({msg, r: value, pre}).then(({target, command, description, parameters}) => {
                    const sendmsg = msg.sender()
                    sendmsg({
                        cap: 'reflectedmsg',
                        description,
                        url: target,
                        name: command,
                    }, {parameters}).then(result => {
                        // todo support outputting an array of records

                        let write = {
                            fields: {
                                type: 'msgreceipt',
                                path: record?.fields?.path.replace(/(\.msgtxt)?$/, '.msgreceipt'),
                                panel,
                                links: {
                                    "cause": {
                                        rel: "eventref",
                                        attributes: {
                                            "eventref:event": cue.id,
                                            "eventref:redo": true,
                                        },
                                    },
                                },
                            },
                        }

                        let r = write.fields
                        if (!ret) {
                            r.result = result
                        } else {
                            for (const [dst, src] of ret) {
                                r = msg.setPath(r, dst, msg.getPath(result, src))
                            }
                        }

                        console.log({target, command, parameters, result, pre, ret, write})
                        Events.send(recordsWrite, [write])
                    })
                })
            })
        },
    }
})()

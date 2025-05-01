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
            for (const field of selector) {
                acc = await fieldLookup(acc, field)
            }
            return acc
        }
        switch (head) {
        case 'id':
            return {
                query: {basis_criteria: {where: {id: [{compare: "=", value: rest[0]}]}}},
                reduce: async records => await fieldsReduce(records, rest.slice(1))
            }
        case 'path':
            return {
                query: {basis_criteria: {where: {path: [{compare: "=", value: rest[0]}]}}, view: "group-by-path-max-id"},
                reduce: async records => await fieldsReduce(records, rest.slice(1))
            }
        default:
            throw new Error(`unknown refselector ${JSON.stringify([head, ...rest])}`)
        }
    }

    const resolveEnvForRefs = async refs => {
        const obj = Object.fromEntries(refs)
        const queriesAndReducers = Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, queryAndReducerFromRefSelector(v)])
        )
        const queryset = Object.fromEntries(
            Object.entries(queriesAndReducers).map(([k, {query}]) => [k, query])
        )
        const refRecords = await fetchRecords(queryset)

        const refResults = Object.fromEntries(
            await Promise.all(Object.entries(refRecords).map(async ([k, records]) => [k, await queriesAndReducers[k].reduce(records)]))
        )

        return {
            lookup: k => {
                const v = refResults[k]
                return v
            }
        }
    }

    return {
        label: 'sendmsg',
        criteria: {
            path: [{compare: "like", value: '%.msgtxt'}]
            // how to check if the record has data?
            // && record.data_url
        },
        act: ({record, msgtxtParser, sender, event}) => {
            fetchText(record.data_url).then(data => {
                console.log({data})

                const evl = msgtxtParser.makeEval(resolveEnvForRefs)
                return evl(data).then(({target, command, description, parameters}) => {
                    const sendmsg = sender()
                    sendmsg({
                        cap: 'reflectedmsg',
                        description,
                        url: target,
                        name: command,
                    }, {parameters}).then(result => {
                        Events.send(recordsWrite, [{
                            fields: {
                                type: 'msgreceipt',
                                path: record?.fields?.path.replace(/(\.msgtxt)?$/, '.msgreceipt'),
                                result,
                            }
                        }])
                    })
                })
            })
        },
    }
})()

const recordsUpdated = Events.receiver()

const recordsPhase = Behaviors.collect("pre-ready", ready, (now, _) => "ready")

// const recordsQueryset = queryset;
const recordsQueryset = Behaviors.collect(
    undefined,
    Events.or(queryset, recordsPhase), (_, e) => recordsPhase === "ready"
        ? queryset
        : Object.fromEntries(
            Object.entries(queryset).filter(([_, query]) => query.phase === recordsPhase)
        ),
)

const recordsQueryGeneration = Date.now()
const recordsUpdatedChannel = new window.MessageChannel()
const recordsUpdatedNS = ["records", recordsQueryGeneration]
const recordsUpdatedObserve = Events.observe(notify => {
    recordsUpdatedChannel.port2.onmessage = ({data: notification}) => notify(notification)
})
const recordsUpdatedEventsSend = Events.collect(
    {},
    recordsUpdatedObserve, (now, ru) => {
        Events.send(recordsUpdated, ru)
        return now
    },
);
const recordsUpdatedRegister = Behaviors.collect(
    undefined,
    recordsQueryset, (now, queryset) => {
        const request = {
            ns: recordsUpdatedNS,
            queryset,
            stream: true,
        }

        if (!now) {
            request.port = recordsUpdatedChannel.port1
            request[Renkon.app.transferSymbol] = [recordsUpdatedChannel.port1]
        }
        Events.send(recordsQuery, request)
        return true
    })

const noncer = (() => {
    let nonce = 0
    return () => nonce++
})()

const recordRead = id => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data: {records: [record]}}) => {
        // console.log("recordRead", id, record)
        resolve(record)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsQuery, {
        ns: [`recordread-${noncer()}`],
        port: ch.port1,
        queryset: {records: {global: true, basis_criteria: {where: {id: [{compare: "=", value: id}]}}}},
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const recordsSubscribe = (notify, props, impl) => {
    const ch = new window.MessageChannel()
    const ns = [`recordsubscribe-${noncer()}`]
    ch.port2.onmessage = ({data}) => {
        notify(data)
    }
    if (!impl) {
        impl = {
            recordsQuery: q => Events.send(recordsQuery, q),
            close: c => Events.send(close, c),
        }
    }
    impl.recordsQuery({
        ns,
        port: ch.port1,
        stream: true,
        ...props,
        [Renkon.app.transferSymbol]: [ch.port1],
    })
    return () => impl.close({ns})
}

const recordsRead = queryset => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data}) => {
        // console.log("recordRead", id, record)
        resolve(data)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsQuery, {
        ns: [`recordsread-${noncer()}`],
        port: ch.port1,
        queryset,
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const recordsExportQuery = (query, name) => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data}) => {
        resolve(data)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsExport, {
        ns: [`recordsexport-${noncer}`],
        port: ch.port1,
        query,
        name,
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const recordsUpdatedBehavior = (key, xform) => (now, {[key]: {incremental, records}={}}) => {
    if (!records) {
        return now
    }
    if (xform) {
        records = records.map(record => xform(record))
    }
    return incremental ? [...now, ...records] : records
}


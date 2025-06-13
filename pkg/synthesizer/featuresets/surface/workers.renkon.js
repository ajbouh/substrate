console.log({internalRecordsUpdated})

const workerComponentImpl = modules.workerComponent.component
const workerComponent = Renkon.component(workerComponentImpl)

const workerRecords = Behaviors.collect(undefined, internalRecordsUpdated, recordsUpdatedBehavior("workers"));

const workerControlRecords = Events.collect(
    undefined,
    internalRecordsUpdated, recordsUpdatedBehavior("workers/control", record => ({[record.fields.key]: record})));

const workers = Object.fromEntries(workerRecords.map((worker) => [worker.fields.key, worker]))

const workerKeys = workerRecords.map((worker) => worker.fields.key)

const workerKey = worker => worker?.fields?.key

const workerKeysDelta = Events.collect(
    undefined,
    workerRecords, (prev, workerRecords) => {
        const next = new Set()
        const deleted = new Set(prev)
        for (const worker of workerRecords) {
            const k = workerKey(worker)
            next.add(k)
            deleted.delete(k)
        }

        if (deleted.size) {
            return {deleted}
        }

        return undefined
    },
);

((workerKeysDelta) => {
    for (const key of workerKeysDelta.deleted) {
        sendClose({ns: [key]})
    }
})(workerKeysDelta);

const eqArrays = (a, b) => {
    if (a?.length !== b?.length) {
        return false
    }
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

const workerScripts = Behaviors.collect(
    undefined,
    workerRecords, (prev, workerRecords) => {
        const next = {}
        for (const worker of workerRecords) {
            const k = workerKey(worker)
            const scripts = worker.fields?.scripts
            const prevValue = prev?.[k]
            next[k] = prevValue && eqArrays(scripts, prevValue.scripts) ? prevValue : {scripts}
        }
        return next
    }
)

const workerBehaviors = {
    surface: self,
    self: workers,
}

const workerMessage = Events.receiver({queued: true})
console.log({workerMessage})

const workerEvents = Events.some(
    workerMessage,
    workerControlRecords,
    Events.or(Events.change(workerScripts), Events.change(workerBehaviors)), // helps bootstrap
)

const workerReceivers = [
    {name: "surface", keyed: false, type: "behavior"},
    {name: "self", keyed: true, type: "behavior"},

    {name: "close", keyed: true, queued: true, type: "event"},
    {name: "query", keyed: true, queued: true, type: "event"},
    {name: "write", keyed: true, queued: true, type: "event"},
]

const ensureWorkerField =
    (workerValue, pending) => pending.fields?.worker
        ? pending
        : {...pending, fields: {...pending.fields, worker: workerValue}};

const workerNotifierWrite = (key, recordses) => {
    sendRecordsWrite(recordses.flatMap(
        records => records.map(record => ensureWorkerField({key}, record))))
}
const workerNotifierQuery = (key, queries) => queries.forEach(({ns, ...q}) => sendRecordsQuery({...q, ns: [key, ...ns], [Renkon.app.transferSymbol]: q.port ? [q.port] : []}))
const workerNotifierClose = (key, closes) => closes.forEach(c => sendClose({ns: [key, ...c.ns]}))
const onWorkerMessage = (key, message) => Events.send(workerMessage, {[key]: message})

const workerNotifiers = {
    write: workerNotifierWrite,
    query: workerNotifierQuery,
    close: workerNotifierClose,
};

const workerInstances = Behaviors.collect(
    undefined,
    Events.or(workerKeys, workerComponent, workerScripts, workerNotifiers, workerBehaviors, workerEvents, workerReceivers), (prev, _) => {
        const next = new Set()
        const stale = new Set(prev)
        for (const key of workerKeys) {
            const worker = workerComponent({
                key,
                debug: true,
                scripts: workerScripts,
                notifiers: workerNotifiers,
                behaviors: workerBehaviors,
                events: workerEvents,
                receivers: workerReceivers,
                onWorkerMessage: onWorkerMessage,
            }, key).worker
            next.add(worker)
            stale.delete(worker)
        }

        console.log({stale, next})

        for (const worker of stale) {
            console.log("terminating worker", worker)
            worker.terminate()
        }

        return next
    }
)

console.log({workerInstances})
// console.log({workerComponentImpl})
console.log({workerComponent})
// console.log({workerRecords})
// console.log({workers})
// console.log({workerKeys})
// console.log({workerScripts})
// console.log({workerBehaviors})
// console.log({workerEvents})
// console.log({workerReceivers})
// console.log({workerReceivers})

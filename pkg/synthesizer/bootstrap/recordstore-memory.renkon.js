const recordsWrite = Events.receiver({queued: true})
const close = Events.receiver({queued: true});
const recordsQuery = Events.receiver({queued: true});

const prng = detectPRNG(window)

// TODO include data_sha256

const dataSizeForEncoding = (data, encoding) => {
    return encoding
        ? encoding === 'base64'
            ? (data.length/4)*3
            : undefined
        : data.length
}

const recordDataForWrite = ({data, fields: {type} = {}, encoding}) => {
    return data === undefined
        ? undefined
        : encoding
            ? {data: `data:${type || ''};${encoding},${data}`, data_size: dataSizeForEncoding(data, encoding)}
            : {data: `data:${type || ''},${encodeURIComponent(data)}`, data_size: dataSizeForEncoding(data, encoding)}
}

// if there are ongoing queries, we should pass our writes and the new records to them. they can postMessage and Events.send(close) as needed.
// a more refined implementation might store queries and records in the same structure and prune single-shot queries

// todo support group-by-path-max-id view, including deleted: true

const records = Behaviors.select(
    [],
    recordsWrite, (now, writes) => {
        return [
            ...now,
            ...writes.map(
                (write) => ({
                    fields: {...write.fields},
                    ...recordDataForWrite(write),
                    id: ulid(Date.now(), prng),
                })
            ),
        ]
    },
)

const newStreamingQuery = ({key, query, url, port}) => {
    const eventSource = new window.EventSource(url)
    const entry = {
        key,
        url,
        query,
        eventSource,
        port,
        close: () => eventSource.close(),
    }
    const listener = (evt) => {
        const data = JSON.parse(evt.data)
        const until = data.until
        const notification = Object.fromEntries(
            Object.entries(data.updates).map(
                ([k, {incremental, events}]) => [k, {until, incremental, records: events.map(ensureDataURL)}])
        )
        // console.log("notifying port", key, port, notification)
        port.postMessage(notification)
    }
    eventSource.addEventListener("message", listener)
    return entry
}

const newQuery = ({key, query, url, port}, onresult) => {
    const abort = new window.AbortController()
    const request = fetch(url, {signal: abort.signal})
    const entry = {
        key,
        url,
        query,
        abort,
        port,
        close: () => {
            console.log("aborting query")
            abort.abort()
            onresult(undefined)
        },
    }
    request.then(response => {
        response.json().then(records => {
            const notification = Object.fromEntries(Object.entries(records).map(([k, records]) => [k, records.map(record => ensureDataURL(record))]))
            // console.log("notifying port", key, port, notification)
            port.postMessage(notification)
            onresult(undefined)
        }, onresult)
    })

    return entry
}

const watchKey = raw => {
    const s = JSON.stringify(raw)
    return s.slice(0, s.length-1) // remove trailing ]
}

const recordsQueries = Events.select(
    {map: new Map()},
    recordsQuery, (now, queries) => {
        const added = []
        for (const {ns, queryset, port, stream} of queries) {
            const key = watchKey(ns)
            const url = renderRecordStreamQueryURL(queryset)
            const nowP = now.map.get(key)
            if (nowP?.url !== url) {
                console.log("new eventSource for", key, url, queryset)
                added.push(stream
                    ? newStreamingQuery({key, queryset, url, port: port ?? nowP.port})
                    : newQuery({key, queryset, url, port}, () => {
                        console.log("cleaning up read", ns)
                        Events.send(close, {ns})
                    }))
            } else {
                console.log("reusing existing eventSource for", key, nowP.url, queryset)
            }
        }
        if (added.length === 0) {
            return now
        }

        const map = now.map
        for (const add of added) {
            const nowP = map.get(add.key)
            if (nowP) {
                console.log("closing pre-existing eventSource for", add.key, nowP.url, nowP.queryset)
                nowP.close()
            }
            map.set(add.key, add)
        }
        return {map}
    },
    close, (now, closes) => {
        const del = []
        for (const {ns} of closes) {
            const key = watchKey(ns)
            const existing = Array.from(now.map.keys().filter(k => k.startsWith(key)))
            del.push(...existing)
        }

        if (del.length === 0) {
            return now
        }
            
        const map = now.map
        for (const k of del) {
            const nowP = map.get(k)
            if (nowP) {
                console.log("closing existing eventSource for", k, nowP.url, nowP.queryset)
                nowP.close()
                map.delete(k)
            }
        }
        return {map}
    },
)
// console.log({recordsQueries});

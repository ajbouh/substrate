const recordsWrite = Events.receiver({queued: true})
const close = Events.receiver({queued: true});
const recordsQuery = Events.receiver({queued: true});
const recordsExport = Events.receiver({queued: true});
const recordsImport = Events.receiver({queued: true});

const renderRecordStreamQueryURL = (recordQuerySet) => {
    const url = new URL(`${recordStoreBaseURL}/stream/events`)
    url.searchParams.set("querysetjson", JSON.stringify(recordQuerySet))
    return url.toString()
}

const writeRecordsURL = `${recordStoreBaseURL}/`
const writeRecords = async (records) => {
    return await fetch(writeRecordsURL, {method: 'POST', body: JSON.stringify({
        command: "events:write",
        parameters: {
            "events": records,
        },
    })})
}
console.log({recordsWrite});
const recordsWriteResponse = ((recordses) => writeRecords(recordses.flatMap(r => r)))(recordsWrite);

const readRecordDataURL = id => `${recordStoreBaseURL}/events/${id}/data`
const exportRecordsURL = (query, name) => {
    const url = new URL(`${recordStoreBaseURL}/events/export`)
    url.searchParams.set("queryjson", JSON.stringify(query))
    if (name) {
        url.searchParams.set("name", name)
    }
    return url.toString()
}
const importRecordsURL = (fields) => {
    const url = new URL(`${recordStoreBaseURL}/events/import`)
    url.searchParams.set("fieldsjson", JSON.stringify(fields))
    return url.toString()
}
const ensureDataURL = record => record.data_sha256 ? {...record, data_url: readRecordDataURL(record.id)} : record
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
            abort.abort("close")
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

const recordsExports = Events.select(
    undefined,
    recordsExport, (now, exports) => {
        for (let {name, query, ns, port} of exports) {
            console.log({'exportRecordsURL(query, name)': exportRecordsURL(query, name)})
            port.postMessage(exportRecordsURL(query, name))
        }
    },
)

const recordsImports = Events.select(
    undefined,
    recordsImport, (now, imports) => {
        for (let {ns, port, fields, readable} of imports) {
            fetch(importRecordsURL(fields), {
                method: 'POST',
                body: readable,
                duplex: 'half',
                headers: {
                    'Content-Type': 'application/zip',
                },
            }).then(res => port.postMessage({status: res.status}))
            console.log('recordsImports', {ns, port, fields, readable})
        }
    },
)

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

const recordsWrite = Events.receiver({queued: true})
const close = Events.receiver({queued: true});
const recordsQuery = Events.receiver({queued: true});
const recordsExport = Events.receiver({queued: true});


console.log({recordsWrite});
const recordsWriteResponse = ((recordses) => recordStore.writeRecords(recordses.flatMap(r => r)))(recordsWrite);

const watchKey = (raw) => {
    const s = JSON.stringify(raw)
    return s.slice(0, s.length-1) // remove trailing ]
}

const recordsExports = Events.select(
    undefined,
    recordsExport, (now, exports) => {
        for (let {name, query, ns, port} of exports) {
            console.log({'this.exportRecordsURL(query, name)': recordStore.renderExportRecordsURL(query, name)})
            port.postMessage(recordStore.renderExportRecordsURL(query, name))
        }
    },
)

const recordsQueries = Events.select(
    {map: new Map()},
    recordsQuery, (now, queries) => {
        let added = 0
        const close = []
        for (const {ns, queryset, port, stream} of queries) {
            const key = watchKey(ns)
            const url = recordStore.renderRecordStreamQueryURL(queryset)
            const nowP = now.map.get(key)
            if (nowP?.url !== url) {
                console.log("new eventSource for", key, url, queryset)
                let add
                if (stream) {
                    add = recordStore.newStreamingQuery({key, queryset, url, port: port ?? nowP.port})
                    added++
                    if (nowP) {
                        close.push(nowP)
                    }
                } else {
                    const entry = recordStore.newQuery({key, queryset, url})
                    add = entry
                    added++
                    entry.promise.then((notification) => {
                        port.postMessage(notification)
                    }).finally(() => {
                        Events.send(close, {ns})
                    })
                }
                now.map.set(add.key, add)
            } else {
                console.log("reusing existing eventSource for", key, nowP.url, queryset)
            }
        }
        if (added === 0) {
            return now
        }

        for (const entry of close) {
            console.log("closing pre-existing eventSource for", entry.url, entry.queryset)
            entry.close()
        }
        return {map: now.map}
    },
    close, (now, closes) => {
        const del = []
        for (const {ns} of closes) {
            const key = watchKey(ns)
            const existing = [...now.map.keys()].filter(k => k.startsWith(key))
            del.push(...existing)
        }

        if (del.length === 0) {
            return now
        }
            
        const map = now.map
        for (const k of del) {
            const nowP = map.get(k)
            if (nowP) {
                console.log("closing existing eventSource for", k, nowP.url, nowP)
                nowP.close()
                map.delete(k)
            }
        }
        return {map}
    },
)
// console.log({recordsQueries});

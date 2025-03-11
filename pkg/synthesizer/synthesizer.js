// http://localhost:9998/?host=substrate-b95b.local&proto=https&recordstore=https://substrate-b95b.local/events;data=substrate-bootstrap-dev
// subscribe to events on a particular url

// in all cases, the iframe source is actually loaded from a record
// list of iframes -> opened in a horizontal flex position
// each iframe has a "record filter" which is a live subscription to matching records
// postmessage to iframe:
// - {
//     methods it can call {
//       filter:write (modifies the current filter),
//       records:write (writes a record to "container"),
//       records:query (does a direct query, possibly separate from the current filter)
//     }
//     filter:value {text, fields}
//     records:value [record]
// }

export function synthesizer() {
    // group these together so we can delay init until they are all loaded and available.
    const bootstrapModules = Behaviors.resolvePart({
        msg: import("./msg.js"),
        blocks: import("./blocks.js"),
        mm: import("./mm.js"),
    });
    const {reflect, sender} = bootstrapModules.msg

    // This is like Renkon.merge, but works with text
    const synthesizerBlock = bootstrapModules.blocks.synthesizerBlock()
    Renkon.setupProgram([...Renkon.scripts, ...synthesizerBlock.scripts]);

    const baseURI = document.baseURI
    const recordStoreBaseURL = (async () => {
        const sendmsg = sender()
        const queryLinks0 = async (url, query) => {
            const msgindex = await reflect(url)
            const linksQuery = msgindex['links:query']
            if (!linksQuery) {
                return undefined
            }
            const result = await sendmsg(linksQuery, query)
            return result.data.returns.links
        }
        const queryLinks = async (...a) => {
            const r = await queryLinks0(...a)
            // console.log("queryLinks", ...a, "=>", r)
            return r
        }
    
        const resolveURL = async () => {
            const url = new URL(baseURI);
            const recordstore = url.searchParams.get("eventstore") || url.searchParams.get("recordstore");
            if (recordstore) {
                return recordstore
            }
        
            const baseLinks = await queryLinks(baseURI)
            const spaceURL = baseLinks['space']?.href
            const atopURL = baseLinks['atop']?.href
            const eventstoreURL = baseLinks['eventstore']?.href
    
            let atopLinks
            let atopSpaceURL
            let atopEventstoreURL
            if (atopURL) {
                atopLinks = await queryLinks(atopURL);
                atopEventstoreURL = atopLinks['eventstore']?.href
                if (atopEventstoreURL) {
                    return atopEventstoreURL
                }
    
                atopSpaceURL = atopLinks['space']?.href
                if (atopSpaceURL) {
                    const atopSpaceLinks = await queryLinks(spaceURL)
                    return atopSpaceLinks['eventstore']?.href
                }
            }
    
            if (eventstoreURL) {
                return eventstoreURL
            }
    
            const spaceLinks = await queryLinks(spaceURL)
            return spaceLinks['eventstore']?.href
        }

        return await resolveURL()
    })();

    const renderRecordStreamQueryURL = (recordQuery) => {
        const url = new URL(`${recordStoreBaseURL}/stream/events`)
        url.searchParams.set("queryjson", JSON.stringify(recordQuery))
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

    const recordsWrite = Events.receiver()
    const recordsWriteResponse = ((records) => writeRecords(records))(recordsWrite);

    const close = Events.receiver({queued: true});
    const recordsQuery = Events.receiver({queued: true});

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
            const readRecordDataURL = id => `${recordStoreBaseURL}/events/${id}/data`
            const data = JSON.parse(evt.data)
            const latest = data.events.map(record => record.data_sha256 ? {...record, data_url: readRecordDataURL(record.id)} : record)
            port.postMessage({until: data.until, incremental: data.incremental, records: latest})
        }
        eventSource.addEventListener("message", listener)
        return entry
    }

    const newQuery = ({key, query, url, port}, onresult) => {
        const abort = new AbortController()
        const request = fetch(url, {signal: abort.signal})
        const entry = {
            key,
            url,
            query,
            abort,
            port,
            close: () => abort.abort(),
        }
        request.then(response => {
            response.json().then(records => {
                const notification = {records}
                console.log("notifying port", port, notification)
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
    const recordsQueries = Behaviors.select(
        bootstrapModules.mm.mmNew(),
        recordsQuery, (now, queries) => {
            const added = []
            for (const {key: keyRaw, query, port, stream} of queries) {
                const key = watchKey(keyRaw)
                const url = renderRecordStreamQueryURL(query)
                const nowP = now.get(key)
                if (nowP?.url !== url) {
                    console.log("new eventSource for", key, url)
                    added.push(stream
                        ? newStreamingQuery({key, query, url, port})
                        : newQuery({key, query, url, port}, () => Events.send(close, {key: keyRaw})))
                } else {
                    console.log("reusing existing eventSource for", key, nowP.url, url)
                }
            }
            if (added.length === 0) {
                return now
            }
    
            return now.update(map => {
                for (const add of added) {
                    const nowP = map.get(add.key)
                    if (nowP) {
                        console.log("closing pre-existing eventSource for", add.key, nowP.url)
                        nowP.close()
                    }
                    map.set(add.key, add)
                }
            })
        },
        close, (now, closes) => {
            for (const {key: keyRaw} of closes) {
                const key = watchKey(keyRaw)
                const deleted = Array.from(now.map.keys().filter(k => k.startsWith(key)))
                if (deleted.length === 0) {
                    return now
                }
                return now.update(map => {
                    for (const k of deleted) {
                        const nowP = map.get(k)
                        if (nowP) {
                            console.log("closing existing eventSource for", k, nowP.url)
                            nowP.close()
                            map.delete(k)
                        }
                    }
                })
            }
        },
    )
    console.log({recordsQueries});

    return [];
}

/* globals Events Behaviors Renkon */

export class RecordStoreRemote {
    constructor(url) {
        this.url = url
    }

    renderRecordStreamQueryURL(recordQuerySet) {
        const url = new URL(`${this.url}/stream/events`)
        url.searchParams.set("querysetjson", JSON.stringify(recordQuerySet))
        return url.toString()
    }

    
    renderReadRecordDataURL(id) {
        return `${this.url}/events/${id}/data`
    }

    renderExportRecordsURL(query, name) {
        const url = new URL(`${this.url}/events/export`)
        url.searchParams.set("queryjson", JSON.stringify(query))
        if (name) {
            url.searchParams.set("name", name)
        }
        return url.toString()
    }

    renderImportRecordsURL(fields) {
        const url = new URL(`${this.url}/events/import`)
        url.searchParams.set("fieldsjson", JSON.stringify(fields))
        return url.toString()
    }

    async writeRecords(records) {
        const writeRecordsURL = `${this.url}/`
        if (records.find(({data_url}) => data_url)) {
            records = await Promise.all(records.map(async record => {
                return record.data_url
                    ? {...record, data: await (await fetch(record.data_url)).text()}
                    : record
            }))
        }

        // if any are imports, separate them out and do them first.
        // it would be better if we could atomically write new records and do an import but
        // we need a different HTTP API to be able to do that.
        if (records.find(({import: o}) => o)) {
            imports = records.filter(({import: o}) => o)
            records = records.filter(({import: o}) => !o)

            await Promise.all(imports.map(o => this.importRecords(o)))
        }

        return await fetch(writeRecordsURL, {method: 'POST', body: JSON.stringify({
            command: "events:write",
            parameters: {
                "events": records,
            },
        })})
    }
    
    importRecords({fields, readable}) {
        return fetch(this.renderImportRecordsURL(fields), {
            method: 'POST',
            body: readable,
            duplex: 'half',
            headers: {
                'Content-Type': 'application/zip',
            },
        })
    }

    ensureDataURL(record) {
        return record.data_sha256 ? {...record, data_url: this.renderReadRecordDataURL(record.id)} : record
    }

    // TODO don't use port here. probably use a generator instead. or just a callback.
    newStreamingQuery({key, query, url, port}) {
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
                    ([k, {incremental, events}]) => [k, {until, incremental, records: events.map(record => this.ensureDataURL(record))}])
            )
            // console.log("notifying port", key, port, notification)
            port.postMessage(notification)
        }
        eventSource.addEventListener("message", listener)
        return entry
    }

    newQuery({key, query, url}) {
        const abort = new window.AbortController()
        const request = fetch(url, {signal: abort.signal})
        let resolve, reject
        let promise = new Promise((res, rej) => (resolve = res, reject = rej))
        const entry = {
            key,
            url,
            query,
            abort,
            promise,
            close: () => {
                console.log("aborting query")
                abort.abort("close")
                reject("close")
            },
        }
        request.then(response => {
            response.json().then(records => {
                const notification = Object.fromEntries(Object.entries(records).map(([k, records]) => [k, records.map(record => this.ensureDataURL(record))]))
                // console.log("notifying port", key, port, notification)
                resolve(notification)
            }, reject)
        })

        return entry
    } 
}

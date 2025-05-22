const componentsUpdatedFromRecordsUpdated = querykeyPattern => (now, recordsUpdated) => {
    const entries = Object.entries(recordsUpdated)
        .filter(([querykey]) => querykeyPattern.test(querykey))
    if (entries.length === 0) {
        return undefined
    }

    return Object.fromEntries(entries.map(
        ([key, {records, incremental}]) => [
            key,
            {
                incremental,
                components: records.map(record => ({
                    key,
                    record,
                    importComponent: async () => {
                        if (!record?.data_url) {
                            console.warn(`no data_url for record`, record)
                            return undefined
                        }

                        const module = await import(record.data_url)

                        if (!module.component) {
                            console.warn(`no component export in module at ${record.data_url}`)
                            return undefined
                        }
                        if (typeof module.component !== 'function') {
                            console.warn(`component export is not a function in module at ${record.data_url}`, module)
                            return undefined
                        }

                        return Renkon.component(module.component)
                    },
                })),
            },
        ]
    ))
}

const componentsUpdatedEvent = (key, xform) => (now, {[key]: {incremental, components}={}}) => {
    if (!components) {
        return undefined
    }
    return {incremental, components: xform ? components.map(component => xform(component)) : components}
}

const componentPromisesBehavior = (key) => (prev, {[key]: {incremental, components}={}}) => {
    if (!components) {
        return prev
    }

    if (!prev) {
        prev = {
            entries: {},
            promises: [],
        }
    }

    const next = {
        entries: incremental ? {...prev.entries} : {},
        promises: incremental ? [...prev.promises] : [],
    }

    for (const componentEntry of components) {
        const id = componentEntry.record.id
        let prevEntry = prev.entries[id]
        if (prevEntry) {
            next.entries[id] = prevEntry
            next.promises.push(prevEntry.promise)
        } else {
            const promise = componentEntry.importComponent().then(component => ({...componentEntry, component}))
            next.entries[id] = {...componentEntry, promise}
            next.promises.push(promise)
        }
    }

    if (next.promises.length !== prev.promises.length) {
        return next
    }

    for (let i = 0; i < next.promises.length; ++i) {
        if (next.promises[i] !== prev.promises[i]) {
            return next
        }
    }

    return prev
}

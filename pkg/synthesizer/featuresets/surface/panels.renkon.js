const blockComponentImpl = modules.blockComponent.component
const blockComponent = Renkon.component(blockComponentImpl)

const panelRecords = Behaviors.collect(
    undefined,
    internalRecordsUpdated, (now, {panels: {incremental, records}={}}) => (records ? (incremental ? [...now, ...records] : records) : now)
);

const blockDefs = Behaviors.collect(
    undefined,
    internalRecordsUpdated, (now, {
        blocks: {incremental, records}={},
        surfaces: {incremental: surfaces_incremental, records: surfaces_records}={},
    }) => {
        if (!records && !surfaces_records) {
            return now
        }
        const next = {...now}
        if (records) {
            for (const record of records) {
                const blockKey = record.fields.block
                // ignore the block that is the surface itself.
                if (blockKey === surfacePath) {
                    continue
                }
                next[blockKey] = record
            }
        }
        if (surfaces_records) {
            for (const record of surfaces_records) {
                const blockKey = record.fields.block
                // ignore the block that is the surface itself.
                if (blockKey === surfacePath) {
                    continue
                }
                next[blockKey] = record
            }
        }
        return eq(next, now) ? now : next
    },
);

const blockScriptsRecordsUpdated = Events.observe(notify => recordsSubscribe(notify, {
    // HACK... this causes us to only see results that our surface has written.
    // it would be better to properly handle records we haven't processed yet but skip ones we have.
    self: true,
    queryset: blockScriptsQueryset,
}, {
    recordsQuery: sendRecordsQuery,
    close: sendClose,
}));

const raise = err => { throw err }
const fetchTextData = record => record.data_url
    ? fetch(record.data_url).then(response => response.ok
        ? response.text()
        : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}; record=${JSON.stringify(record)}"`)))
    : ''

const blockScriptsEntries = Behaviors.collect(
    [],
    blockScriptsRecordsUpdated, (now, ru) => Promise.all(Object.entries(ru).map(async ([k, {incremental, records}]) =>
        [k, await Promise.all(records.map(record => fetchTextData(record))).then(datas => incremental ? [...now[k], ...datas] : datas)]
    ))
)

const blockScripts = Behaviors.collect(
    undefined,
    blockScriptsEntries, (now, entries) => {
        const next = {...now}
        const bsr = Object.fromEntries(entries)
        const keys = Object.keys(bsr)
        const blockKeys = Object.groupBy(keys, key => key.split("/", 2)[0])
        for (const blockName in blockKeys) {
            const keys = blockKeys[blockName]
            next[blockName] = keys.flatMap(key => bsr[key])
        }
        return next
    },
);

const blockScriptsQueryset = Behaviors.collect(
    undefined,
    blockDefs, (now, blockDefs) => Object.fromEntries(
        Object.entries(blockDefs).flatMap(([blockName, blockDef]) => {
            const scriptQueries = Object.entries(blockDef.fields.queryset || {}).filter(([querykey]) => /^scripts($|\/)/.test(querykey))
            return scriptQueries.map(([querykey, query]) => [`${blockName}/${querykey}`, query])
        })
    )
)

const panelMap = Object.fromEntries(panelRecords.map((panel) => [panel.fields.key, panel]))
console.log({panelMap})

const panelKey = panel => panel?.fields?.key

const panelID = panel => panel.id

const panelQuerySet = (panel) => {
    const userQuery = panel.fields?.queryset
    const blockQuery = blockDefs[panel.fields?.block]?.fields?.queryset
    return mergeRecordQueries({}, userQuery, blockQuery)
}

// simple implementation of structural equality
const eq = (a, b) => (a === b) || (JSON.stringify(a) === JSON.stringify(b))

// clean up closed namespaces
const panelNamespaces = Behaviors.collect(
    undefined,
    panelRecords, (prev, panelRecords) => {
        const next = new Set()
        const deleted = new Set(prev)
        for (const panel of panelRecords) {
            const k = panelKey(panel)
            next.add(k)
            deleted.delete(k)
        }

        for (const key of deleted) {
            sendClose({ns: [key]})
        }

        return next
    },
);

const panelBlocks = Behaviors.collect(
    {},
    panelRecords, (prev, panelRecords) => {
        const next = {}
        let any = true
        for (const panel of panelRecords) {
            const k = panelKey(panel)
            const v = blockDefs[panel.fields?.block] || null
            next[k] = v
            if (!eq(prev?.[k], v)) {
                any = true
            }
        }

        return next
    },
);

const panelQuerysets = Behaviors.collect(
    {map: undefined, updates: undefined},
    panelRecords, (now, panelRecords) => {
        const {map} = now
        const nextMap = new Map()
        const deleted = new Set(map?.keys())
        const updates = {}
        let any = map ? 0 : 1
        for (const panel of panelRecords) {
            const k = panelKey(panel)
            const v = panelQuerySet(panel)
            nextMap.set(k, v)
            deleted.delete(k)
            if (!eq(map?.get(k), v)) {
                updates[k] = v
                any++
            }
        }
        if (deleted.length === 0 && any === 0) {
            return now
        }

        return {map: nextMap, updates: any ? updates : undefined}
    },
);

const mergeBlockScripts = (block, ...scriptses) => {
    const scripts = []
    if (block?.fields?.scripts) {
        scripts.push(...block.fields.scripts)
    }
    const baseURI = block?.fields?.baseURI
    for (const s of scriptses) {
        if (s) {
            scripts.push(...s)
        }
    }

    return {scripts, baseURI}
}

const panelBlockScripts = Behaviors.collect(
    {},
    Events.some(Events.change(panelRecords), Events.change(blockDefs), Events.change(blockScripts)), (now, _) => {
        const next = {}
        let any = 0
        for (const panel of panelRecords) {
            const k = panelKey(panel)
            const blockName = panel.fields?.block
            const v = mergeBlockScripts(blockDefs?.[blockName], blockScripts[blockName])
            const was = now[k]
            if (!eq(was, v)) {
                next[k] = v
                any++;
            } else {
                next[k] = was
            }
        }
        if (panelRecords.length !== now.size) {
            any++;
        }
        return any ? next : now
    },
);

const blockBehaviors = {
    surface: self,
    self: panelMap,
    block: panelBlocks,
}

const blockEvents = Events.some(
    windowMessages,
    Events.or(Events.change(panelKeys), Events.change(panelBlockScripts), Events.change(blockBehaviors)),
)

const panelKeys = (() => {
    const surfacePanels = layout.fields?.panels
    const set = new Set(Array.isArray(surfacePanels) ? surfacePanels : undefined)
    for (const key of Object.keys(panelMap)) {
        set.add(key)
    }
    return set
})();

const panelReceivers = [
    {name: "surface", keyed: false, type: "behavior"},
    {name: "self", keyed: true, type: "behavior"},
    {name: "block", keyed: true, type: "behavior"},

    {name: "close", keyed: true, queued: true, type: "event"},
    {name: "recordsQuery", keyed: true, queued: true, type: "event"},
    {name: "recordsExport", keyed: true, queued: true, type: "event"}, // merge with query ... process an export field in query, return it as a result
    {name: "recordsWrite", keyed: true, queued: true, type: "event"},
]

const panelNotifiers = {
    recordsWrite: (key, recordses) => {
        sendRecordsWrite(recordses.flatMap(
            records => records.map(record => ensurePanelField({key}, record))))
    },
    recordsQuery: (key, queries) => queries.forEach(({ns, ...q}) => sendRecordsQuery({...q, ns: [key, ...ns], [Renkon.app.transferSymbol]: q.port ? [q.port] : []})),
    recordsExport: (key, exports) => exports.forEach(({ns, ...q}) => sendRecordsExport({...q, ns: [key, ...ns], [Renkon.app.transferSymbol]: q.port ? [q.port] : []})),
    close: (key, closes) => closes.forEach(c => sendClose({ns: [key, ...c.ns]})),
}

const activePanelKeys = [...panelKeys].filter(key => panelMap[key])

const panelIframeProps = Behaviors.keep(((activePanelKeys, blockComponent, panelBlockScripts, panelNotifiers, blockEvents, panelReceivers) => {
    const next = {}
    for (const key of activePanelKeys) {
        next[key] = blockComponent({
            key,
            debug: false,
            scripts: panelBlockScripts,
            notifiers: panelNotifiers,
            behaviors: blockBehaviors,
            events: blockEvents,
            receivers: panelReceivers,
        }, key).iframeProps
    }
    return next
})(activePanelKeys, blockComponent, panelBlockScripts, panelNotifiers, blockEvents, panelReceivers));

const newPanelWriter = (panelPathPrefix) => {
    function genchars(length) {
        let result = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charsLength = chars.length;
        for ( let i = 0; i < length; i++ ) {
          result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    }
      
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const builder = {
        new: ({now, ...fields}={}) => {
            const key = `${formatDate(now ?? new Date())}-${genchars(4)}`
            return {
                fields: {
                    ...fields,
                    type: "panel",
                    key,
                    path: `${panelPathPrefix}${key}`
                },            
            }
        },
        update(panel, fields) {
            return {
                fields: {
                    ...panel.fields,
                    ...fields,
                },
            }
        },
        delete(panel) {
            return {
                fields: {
                    path: panel?.fields?.path,
                    deleted: true,
                },
            }
        },
    }

    const prepareLayoutWrite = (write) => {
        console.log('prepareLayoutWrite', {write})
        let layoutFields = layout.fields
        if (write.op?.startsWith('surface:')) {
            switch (write.op) {
                case 'surface:direction': {
                    layoutFields = {
                        ...layoutFields,
                        direction: write.direction,
                    }
                }
            }    
        }
        if (write.op?.startsWith('panel:')) {
            const panels = Array.isArray(layoutFields.panels) ? structuredClone(layoutFields.panels) : []
            switch (write.op) {
            case 'panel:remove': {
                const {keys} = write

                let i = panels.length;
                while (i--) {
                    if (keys.includes(panels[i])) {
                        panels.splice(i, 1);
                    }
                }
                break;
            }
            case 'panel:ensure-after': {
                const {after, before} = write;

                let i = panels.length;
                while (i--) {
                    if (after.includes(panels[i])) {
                        panels.splice(i, 1);
                    }
                }

                const beforeIndex = panels.indexOf(before);
                if (before && beforeIndex > -1) {
                    panels.splice(beforeIndex + 1, 0, ...after);
                } else {
                    panels.push(...after);
                }

                break;
            }
            default:
                return []
            }
            layoutFields = {
                ...layoutFields,
                panels,
            };
        }
        return [{fields: layoutFields}]
    };

    return (sender, {target, panel: panelRequest, close}) => {
        const key = sender?.key
        console.log('preparePanelWrite', {key, target, panelRequest, close})

        // if target == null, we mean new
        if (target === undefined) {
            target = key
        }

        if (target !== null && !target) {
            console.warn("discarding panelWrite to an unknown panel key", key)
            return []
        }

        const writeNew = !target && !close
        const panel = panelMap[key]
        console.log({key, target, panel, writeNew, panelMap})
        if (!panel && !writeNew && !close) {
            console.warn("discarding panel write to an unknown panel key", key, ":", JSON.stringify(panelRequest), {panelMap, panel})
            return []
        }

        const write = writeNew
            ? builder.new({back: panel ? panelID(panel) : undefined, ...panelRequest})
            : close
                ? builder.delete(panel)
                : builder.update(panel, {back: panelID(panel), ...panelRequest})

        const writes = [write]

        if (writeNew) {
            writes.push(...prepareLayoutWrite({op: 'panel:ensure-after', before: panel ? panelKey(panel) : undefined, after: [write.fields.key]}))
        }

        if (close) {
            writes.push(...prepareLayoutWrite({op: 'panel:remove', keys: [target]}))
        }

        console.log('preparedPanelWrite', {writes})

        return writes
    }
};

const panelWrite = newPanelWriter(`${surfacePath}/panels/`)

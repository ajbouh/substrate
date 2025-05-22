// surface

const {mergeRecordQueries} = modules.recordsQueryMerge

// ensure pending records include a surface field.
// in the future this should be a ref to the surface record.
// that way we don't interfere with record schemas as much.
const ensureSurfaceField =
    (surfaceValue, pending) => pending.fields?.surface
        ? pending
        : {...pending, fields: {...pending.fields, surface: surfaceValue}};

const ensureActorField =
    (actorValue, pending) => pending.fields?.actor && !pending.import // skipping if this is an import is a bit of a shortcut. need more thinking about if it makes sense.
        ? pending
        : {...pending, fields: {...pending.fields, actor: actorValue}};

const surfaceCriteria = (path) => ({
    basis_criteria: {
        where: {surface: [{compare: "=", value: path}]},
    },
    global: true,
});

const actorCriteria = (value) => ({
    view_criteria: {
        where: {actor: [{compare: "=", value: value}]},
        limit: 1,
        bias: 1,
    },
});

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});

const layoutUpdated = Events.collect(undefined, recordsUpdated, (now, {layout: {incremental, records}={}}) => records ? records?.[0] : now);
const layout = Behaviors.keep(layoutUpdated);

const selfUpdated = Events.collect(undefined, recordsUpdated, (now, {self: {incremental, records}={}}) => records ? records?.[0] : now);
const self = Behaviors.keep(selfUpdated);

const structuredClone = window.structuredClone

const ensureRecordWriteTransfers = write =>
    (write.port || write.readable)
        ? {
            ...write,
            [Renkon.app.transferSymbol]: [...(write.port ? [write.port] : []), ...(write.readable ? [write.readable] : [])],
        }
        : write;

const sendRecordsWrite = (writes) => {
    writes = writes.map(record => ensureRecordWriteTransfers(ensureActorField(actor, ensureSurfaceField(surfacePath, record))))
    Events.send(recordsWrite, writes)
}

const sendRecordsExport = (exports) => {
    for (let {name, query, ns, port} of exports) {
        query = query.global ? query : mergeRecordQueries({...query, global: true}, surfaceCriteria(surfacePath))
        Events.send(recordsExport, {
            query,
            name,
            ns,
            port,
            [Renkon.app.transferSymbol]: port ? [port] : [],
        })
    }
};
const sendRecordsQuery = (query) => {
    const impliedCriteria = (querykey, query) => [
        ...(!query?.global && query?.self ? [actorCriteria(actor)] : []),
        ...(!query?.global && querykey === 'offers' ? [actorCriteria(actor)] : []),
        ...(!query || query?.global ? [] : [surfaceCriteria(surfacePath)]),
    ]
    for (let {queryset: queryset0, stream, ns, port} of [query]) {
        const queryset = Object.fromEntries(
            Object.entries(queryset0).map(
                ([k, query]) => [k, mergeRecordQueries(query, ...impliedCriteria(k, query))],
            )
        )
        Events.send(recordsQuery, {
            queryset,
            stream,
            ns,
            port,
            [Renkon.app.transferSymbol]: port ? [port] : [],
        })
    }
};

const sendClose = (c) => Events.send(close, c);

const blockComponentImpl = modules.blockComponent.component
const blockComponent = Renkon.component(blockComponentImpl)

const init = Events.once(modules);

((init) => {
    Events.send(ready, true);
})(init);

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

const componentsUpdated = Events.resolvePart(Events.collect(
    undefined,
    internalRecordsUpdated, componentsUpdatedFromRecordsUpdated(/^components($|\/)/)));

const layoutComponentPromises = Behaviors.collect(
    undefined,
    componentsUpdated, componentPromisesBehavior("components/layout"));
// Behaviors.resolvePart would be better but seems to swallow updates in some cases
const layoutComponentMaybes = Promise.all(layoutComponentPromises.promises)
const layoutComponents = layoutComponentMaybes.filter(entry => entry.component)

// Consider having some sort of fallback in case we load a broken one
const layoutComponentEntry = Behaviors.collect(
    undefined,
    layoutComponents, (now, layoutComponents) => {
        const entry = layoutComponents?.[0]
        if (!entry) {
            console.log("returning early")
            return now
        }
        console.log("replacing!")
        return o => entry.component(o, entry.key)
    },
)

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

const panelKey = panel => panel?.fields?.key

const panelID = panel => panel.id

const panelQuerySet = (panel) => {
    const userQuery = panel.fields?.queryset
    const blockQuery = blockDefs[panel.fields?.block]?.fields?.queryset
    return mergeRecordQueries({}, userQuery, blockQuery)
}

// simple implementation of structural equality
const eq = (a, b) => (a === b) || (JSON.stringify(a) === JSON.stringify(b))

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

        for (const key of deleted) {
            sendClose({ns: [key]})
        }

        return {map: nextMap, updates: any ? updates : undefined}
    },
);


const panelQuerysetsUpdates = Events.collect(
    undefined,
    panelQuerysets, (_, {updates}) => updates);

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

const blockSurfaceUpdated = Events.select(undefined,
    selfUpdated, (now, su) => su,
    panelQuerysetsUpdates, (now, _) => now,
)

const blockEvents = Events.some(
    windowMessages,
    Events.or(Events.change(panelKeys), Events.change(panelBlockScripts)),
    panelQuerysetsUpdates,
    blockSurfaceUpdated,
    Events.change(panelMap),
)

const surfacePath = self?.fields.path

const panelWrite = newPanelWriter(`${surfacePath}/panels/`)

const sendPanelEmit = (key, emits) => {
    // HACK using the same path for all emits means they will overwrite each other. So only inject it if we have a single thing to emit.
    let path = emits.length <= 1 ? panelMap[key]?.fields?.path : undefined
    if (path) {
        path = path + '.emit'
    }
    emits = emits.map(emit => ({...emit, fields: {...emit.fields, panel: key, path}}))
    sendRecordsWrite(emits)
}

const panelKeys = (() => {
    const surfacePanels = layout.fields?.panels
    const set = new Set(Array.isArray(surfacePanels) ? surfacePanels : undefined)
    for (const key of Object.keys(panelMap)) {
        set.add(key)
    }
    return set
})();

const internalRecordsUpdated = Events.observe(notify => recordsSubscribe(notify, {
    queryset: {
        panels: {
            view_criteria: {
                where: {type: [{compare: "=", value: "panel"}]},
            },
            view: "group-by-path-max-id",
        },
        blocks: {
            view_criteria: {
                where: {type: [{compare: "=", value: "block"}]},
            },
            view: "group-by-path-max-id",
        },
        surfaces: {
            global: true,
            view_criteria: {
                where: {
                    type: [{compare: "=", value: "block"}],
                    path: [
                        // {compare: "!=", value: path},
                        {compare: "like", value: "%.surface"},
                    ],
                },
            },
            view: "group-by-path-max-id",
        },

        "components/actions": {
            view_criteria: {
                where: {
                    type: [{compare: "=", value: "action"}],
                },
            },
            view: "group-by-path-max-id",
        },
        "components/layout": {
            view_criteria: {
                where: {
                    type: [{compare: "=", value: "layout/component"}],
                },
            },
            view: "group-by-path-max-id",
            bias: 1,
        },
    },
}, {
    recordsQuery: sendRecordsQuery,
    close: sendClose,
}));

const ensurePanelField =
    (panelValue, pending) => pending.fields?.panel
        ? pending
        : {...pending, fields: {...pending.fields, panel: panelValue}};

const panelReceivers = [
    {name: "queryset", keyed: true, type: "behavior"},
    {name: "surface", keyed: false, type: "behavior"},

    {name: "panel", keyed: true, queued: false, type: "behavior"},

    {name: "close", keyed: true, queued: true, type: "event"},
    {name: "recordsQuery", keyed: true, queued: true, type: "event"},
    {name: "recordsExport", keyed: true, queued: true, type: "event"},
    {name: "recordsWrite", keyed: true, queued: true, type: "event"},
    {name: "panelWrite", keyed: true, queued: true, type: "event"},
    {name: "panelEmit", keyed: true, queued: true, type: "event"},
]

const panelNotifiers = {
    panelEmit: (key, requests) => (requests.forEach(request => sendPanelEmit(key, request))),
    recordsWrite: (key, recordses) => {
        sendRecordsWrite(recordses.flatMap(
            records => records.map(record => ensurePanelField({key, id: panelMap?.[key]?.id}, record))))
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
            events: blockEvents,
            receivers: panelReceivers,
        }, key).iframeProps
    }
    return next
})(activePanelKeys, blockComponent, panelBlockScripts, panelNotifiers, blockEvents, panelReceivers));

const pick = (o, ...keys) => {
    const v = {}
    for (const k of keys) {
        v[k] = o[k]
    }
    return v
}

const cuePanelAction = (arg) => {
    const {panelTarget, panelSender, panelFields, panelKeys, actionVerb, actionKey, inputEvent} = arg
    let write = {
        fields: {
            type: "action/cue",
            query: panelTarget
                ? {
                    view: "group-by-path-max-id",
                    view_criteria: {where: {
                        type: [{compare: "=", value: "panel"}],
                        key: [{compare: "=", value: panelTarget}],
                    }},
                }
                : undefined,
            dat: {
                event: inputEvent ? pick(inputEvent, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button") : {},
                fields: panelFields,
                keys: panelKeys,
            },
            verb: actionVerb,
            key: actionKey,
        },
    }
    write = ensurePanelField(panelSender, write)
    sendRecordsWrite([write])
}

const {
    render: renderLayout,
} = layoutComponentEntry({
    preact0: modules.preact,
    cuePanelAction0: cuePanelAction,
    act0: act,
    blockDefs0: blockDefs,
    layout0: layout,
    panelMap0: panelMap,
    panelIframeProps0: panelIframeProps,
    panelKeys0: panelKeys,
})

const rendered = renderLayout(document.body)
console.log({rendered})

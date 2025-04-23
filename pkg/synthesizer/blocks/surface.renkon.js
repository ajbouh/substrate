// surface

// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
    records: import("./records.js"),
    blocks: import("./blocks.js"),
    blockComponent: import("./block.renkon.component.js"),
});
const {
    fetchPanelsBlock,
    recordsUpdatedScripts,
    mergeBlockScripts,
} = modules.blocks
const {h, html, render} = modules.preact
const {
    mergeRecordQueries,
} = modules.records

const blockComponent = Renkon.component(modules.blockComponent.component)

const panelsBlock = fetchPanelsBlock();
((panelsBlock) => {
    Events.send(ready, true);
})(panelsBlock);

// ensure pending records include a surface field.
// in the future this should be a ref to the surface record.
// that way we don't interfere with record schemas as much.
const ensureSurfaceField =
    (surfaceValue, pending) => pending.fields?.surface
        ? pending
        : {...pending, fields: {...pending.fields, surface: surfaceValue}};

const surfaceCriteria = (path) => ({
    view_criteria: {
        where: {surface: [{compare: "=", value: path}]},
    },
});

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});

const surfaceUpdated = Events.collect(undefined, recordsUpdated, (now, {surface: {incremental, records}={}}) => records ? records?.[0] : now);
const surface = Behaviors.keep(surfaceUpdated)

const panelsKey = "panelsKey"
// const panelsScriptsUpdates = Events.collect(undefined, surfaceUpdated, (now, surface) => ({[panelsKey]: mergeBlockScripts(panelsBlock, recordsUpdatedScripts)}))
const panelsQuerysetUpdates = Events.collect(undefined, surfaceUpdated, (now, surface) => ({[panelsKey]: panelsBlock.fields.queryset}))
const panelsScriptsUpdates = {[panelsKey]: mergeBlockScripts(panelsBlock, recordsUpdatedScripts)}
// const panelsQuerysetUpdates = {[panelsKey]: panelsBlock.fields.queryset}
const panelsEvents = Events.some(windowMessages, Events.change([panelsKey]), panelsQuerysetUpdates, surfaceUpdated)

const structuredClone = window.structuredClone

const bc = blockComponent({
    key: panelsKey,
    style: `
        position: absolute;
        inset: 0;
        width: 100vw;
        height: 100vh;
        border: 0;
    `,
    scripts: panelsScriptsUpdates,
    notifiers: {
        recordsWrite: (key, recordses) => {
            const records = recordses.flatMap(
                records => records.map(record => ensureSurfaceField(surface.fields?.path, record)))
            Events.send(recordsWrite, records)
        },
        recordsQuery: (key, queries) => {
            for (let {queryset: queryset0, stream, ns, port} of queries) {
                const queryset = Object.fromEntries(
                    Object.entries(queryset0).map(
                        ([k, query]) => [k, query.global ? query : mergeRecordQueries({...query, global: true}, surfaceCriteria(surface.fields?.path))],
                    )
                )
                Events.send(recordsQuery, {
                    queryset,
                    stream,
                    ns: [key, ...ns],
                    port,
                    [Renkon.app.transferSymbol]: port ? [port] : [],
                })
            }
        },
        close: (key, closes) => closes.forEach(c => Events.send(close, {ns: [key, ...c.ns]})),
        surfaceWrite: (key, writes) => {
            let surfaceFields = surface.fields
            for (const write of writes) {
                if (write.op?.startsWith('surface:')) {
                    switch (write.op) {
                        case 'surface:direction': {
                            surfaceFields = {
                                ...surfaceFields,
                                direction: write.direction,
                            }
                        }
                    }    
                }
                if (write.op?.startsWith('panel:')) {
                    const panels = Array.isArray(surfaceFields.panels) ? structuredClone(surfaceFields.panels) : []
                    switch (write.op) {
                    case 'panel:remove': {
                        const {ids} = write

                        let i = panels.length;
                        while (i--) {
                            if (ids.includes(panels[i])) {
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
                        continue
                    }
                    surfaceFields = {
                        ...surfaceFields,
                        panels,
                    };
                }
            }
            Events.send(recordsWrite, [{fields: surfaceFields}]);
        },
    },
    events: panelsEvents,
    defineExtraEvents: [
        {name: "querysetUpdated", keyed: true},
        {name: "surfaceUpdated", keyed: false},
    ],
    eventsReceivers: ["querysetUpdated", "surfaceUpdated"],
    eventsReceiversQueued: ["recordsQuery", "close", "recordsWrite", "surfaceWrite"],
}, panelsKey);

render(
    h('iframe', bc.iframeProps),
    document.body,
)

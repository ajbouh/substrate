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
    mergeRecordQuerysets,
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

const ensureActorField =
    (actorValue, pending) => pending.fields?.actor
        ? pending
        : {...pending, fields: {...pending.fields, actor: actorValue}};

const surfaceCriteria = (path) => ({
    view_criteria: {
        where: {surface: [{compare: "=", value: path}]},
    },
});

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});

const surfaceUpdated = Events.collect(undefined, recordsUpdated, (now, {surface: {incremental, records}={}}) => records ? records?.[0] : now);
const surface = Behaviors.keep(surfaceUpdated)

const panelsKey = "panelsKey"
const panelsQuerysetUpdates = Events.collect(
    undefined,
    surfaceUpdated, (now, surface) => ({
        [panelsKey]: mergeRecordQuerysets(
            panelsBlock.fields.queryset,
            {cues: {basis_criteria: {where: {actor: [{compare: "=", value: actor}]}}},
        })
    }),
)
const panelsScriptsUpdates = {[panelsKey]: mergeBlockScripts(panelsBlock, recordsUpdatedScripts)}
const panelsEvents = Events.some(windowMessages, Events.change([panelsKey]), panelsQuerysetUpdates, surfaceUpdated, actionOffersUpdated)

const structuredClone = window.structuredClone

// a randomly generated value that uniquely identifies this particular view and distinguishes it from
// all others. specific to this runtime instance of the surface block.
function genchars(length) {
    let result = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    for ( let i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
}

// use a unique value on every boot. this allows us to only act on actions that were written by this runtime instance.
const actor = genchars(10)

const actionsOffer = Events.receiver();
console.log({actionsOffer});

const actionOffersUpdated = Events.select(
    {},
    actionsOffer, (now, offerses) => {
        const addOffers = {}
        for (const offers of offerses) {
            console.log({offers})
            for (const {ns, label, verb, description, criteria} of offers) {
                const key = JSON.stringify(ns)
                addOffers[key] = {key, ns, label, verb, description, criteria}
            }
        }
        return {
            ...now,
            ...addOffers,
        }
    },
)

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
                records => records.map(record => ensureActorField(actor, ensureSurfaceField(surface.fields?.path, record))))
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
        // actionsOffer is very similar to recordswrite, but is not persisted. switch it to recordsWrite once we figure
        // out how to avoid stale action offers.
        actionsOffer: (key, offers) => {
            Events.send(actionsOffer, offers)
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
        {name: "actionOffersUpdated", keyed: false},
    ],
    eventsReceivers: ["querysetUpdated", "surfaceUpdated", "actionOffersUpdated"],
    eventsReceiversQueued: ["recordsQuery", "close", "recordsWrite", "actionsOffer", "surfaceWrite"],
}, panelsKey);

render(
    h('iframe', bc.iframeProps),
    document.body,
)

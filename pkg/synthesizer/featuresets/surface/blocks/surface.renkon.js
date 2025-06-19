// surface

const surfaceCriteria = (path) => ({
    basis_criteria: {
        where: {surface: [{compare: "=", value: path}]},
    },
    global: true,
});

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});

const layoutUpdated = Events.collect(undefined, recordsUpdated, (now, {layout: {incremental, records}={}}) => records ? records?.[0] : now);
const layout = Behaviors.keep(layoutUpdated);

const selfUpdated = Events.collect(undefined, recordsUpdated, (now, {self: {incremental, records}={}}) => records ? records?.[0] : now);
((selfUpdated) => {
    Events.send(self, selfUpdated);
})(selfUpdated);

const surfacePath = self.fields?.path

const sendRecordsWrite = (() => {
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

    const ensureRecordWriteTransfers = write =>
        (write.port || write.readable)
            ? {
                ...write,
                [Renkon.app.transferSymbol]: [...(write.port ? [write.port] : []), ...(write.readable ? [write.readable] : [])],
            }
            : write;


    return (writes) => {
        writes = writes.map(record => ensureRecordWriteTransfers(ensureActorField(actor, ensureSurfaceField(surfacePath, record))))
        Events.send(recordsWrite, writes)
    }
})();

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
const sendRecordsQuery = (() => {
    const actorCriteria = (value) => ({
        view_criteria: {
            where: {actor: [{compare: "=", value: value}]},
            limit: 1,
            bias: 1,
        },
    });

    return (query) => {
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
})();

const sendClose = (c) => Events.send(close, c);

const init = Events.once(modules);

((init) => {
    Events.send(ready, true);
})(init);

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

const internalRecordsUpdated = Events.observe(notify => recordsSubscribe(notify, {
    queryset: {
        panels: {
            view_criteria: {
                where: {type: [{compare: "=", value: "panel"}]},
            },
            view: "group-by-path-max-id",
        },
        workers: {
            view_criteria: {
                where: {type: [{compare: "=", value: "worker"}]},
            },
            view: "group-by-path-max-id",
        },
        "workers/control": {
            self: true,
            view_criteria: {
                where: {type: [{compare: "=", value: "worker-control"}]},
            },
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

const actionKeyDownEvent = Events.listener(document, 'keydown', event => (event.key === 'k' && (event.metaKey || event.ctrlKey)) ? (event.preventDefault(), event) : undefined);
console.log({actionKeyDownEvent});

const surfaceRecordsRead = queryset => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data}) => {
        // console.log("recordRead", id, record)
        resolve(data)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    sendRecordsQuery({
        ns: [`recordsread-${noncer()}`],
        port: ch.port1,
        queryset,
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const surfaceAct = (() => {
    return ({verb, key, query, records, event, panel, dat, parameters}) => {
        const write = {
            fields: {
                type: "action/cue",
                // records: [record],
                query: query || recordsToQuery(records),
                dat: {
                    event: event ? pick(event, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button") : undefined,
                    ...dat,
                },
                verb,
                key,
                panel,
                parameters,
            },
        }
        sendRecordsWrite([write])
    }
})();

const activeMetaSelectionKeyEvent = Events.receiver() // {tabs: {[tabKey]: key, ...}, active: [tabKey]}
const activeMetaSelectionKey = Behaviors.collect(
    {shownTab: '["surface"]', selections: {}},
    activeMetaSelectionKeyEvent, (prev, {showTab, setSelections}) => {
        return {
            selections: {
                ...prev.selections,
                ...setSelections,
            },
            shownTab: showTab ?? prev.shownTab,
        }
    });

const sendActiveMetaSelectionKeyEvent = value => {
    Events.send(activeMetaSelectionKeyEvent, value);
}
// console.log({activeMetaSelectionKeyEvent})

const focusedPanel = panelMap[activeMetaSelectionKey[`["surface","panel"]`]];
const focusedPanelSelectionQuery = focusedPanel?.fields?.selectionQuery;
console.log({focusedPanel});
console.log({focusedPanelSelectionQuery});

((panelKey) => {
    document.getElementById(`panel_${panelKey}`)?.focus();
    Events.send(activeMetaSelectionKeyEvent, ({setSelections: {[`["surface","panel"]`]: panelKey}}));
})(panelFocusedEvent);

const panelFocusedEvent = Events.receiver();

const sendPanelFocused = ({key, time}) => {
    Events.send(panelFocusedEvent, key);
}

// a gross hack
const ribbonControl = Behaviors.receiver();
console.log('outside', {ribbonControl});
((init) => {
    Events.send(ribbonControl, null);
})(init);
const sendRibbonControl = (kind) => {
    Events.send(ribbonControl, kind);
}
// switch (kind) {
// case 'draft command':
// }

const metaSelectionTabs = (() => {
    const panelSelectionKey = `["surface","panel"]`
    const panelKey = activeMetaSelectionKey.selections[panelSelectionKey] ?? Object.keys(panelMap)[0]
    const panel = panelMap[panelKey];

    const recordsQuerysetSelectionKeyFor = (panelKey) => panelKey ? `["surface","panel",${JSON.stringify(panelKey)},"records","queryset"]` : undefined
    const recordsQuerysetSelectionKey = recordsQuerysetSelectionKeyFor(panelKey)
    const recordsQuerysetKey = activeMetaSelectionKey.selections[recordsQuerysetSelectionKey] ?? (panel?.fields?.queryset ? Object.keys(panel?.fields?.queryset)?.[0] : undefined)

    return [
        {
            key: `["surface"]`,
            label: '',
            nextBoundary: 'child',
            options: [
                {
                    token: {
                        showTab: `["surface"]`,
                    },
                    title: 'surface',
                    scopes: ['internal'],
                    records: [self],
                },
            ],
        },
        {
            key: `["surface","panel"]`,
            label: 'panel',
            prevBoundary: 'parent',
            nextBoundary: (panel?.fields?.queryset || panel?.fields?.selectionQuery)
                ? 'child'
                : undefined,
            showSingleOptions: true,
            selectedOption: panelKey,
            options: Object.entries(panelMap).map(
                ([panelKey, panel]) => ({
                    token: {
                        setSelections: {
                            [`["surface","panel"]`]: panelKey,
                        }
                    },
                    key: panelKey,
                    panel: {key: panel.fields.key},
                    label: panelKey,
                    scopes: ['internal'],
                    records: [panel],
                })),
        },
        {
            key: `["surface","panel","records"]`,
            label: 'records',
            prevBoundary: 'parent',
            nextBoundary: 'sibling',
            selectedOption: recordsQuerysetKey,
            options: panel?.fields?.selectionQuery
                ? []
                : Object.entries(panel?.fields?.queryset || {}).map(
                    ([querykey, query]) => ({
                        token: {
                            setSelections: {
                                [recordsQuerysetSelectionKey]: querykey,
                            }
                        },
                        key: querykey,
                        label: querykey,
                        scopes: ['internal', 'focus'],
                        panel: {key: panel.fields.key},
                        query,
                    })),
        },
        {
            key: `["surface","panel","records","selection"]`,
            label: 'selection',
            prevBoundary: 'sibling',
            options: panel?.fields?.selectionQuery
                    ? (console.log('selectionQuery', panel?.fields?.selectionQuery), [{
                        panel: {key: panel.fields.key},
                        query: panel.fields.selectionQuery,
                        scopes: ['external', 'focus'],
                    }])
                    : [],
        },
    ]
})()

const activeMetaSelectionOptions = metaSelectionTabs.map(tab => tab?.options?.find(({key}, index) => tab.selectedOption ? key === tab.selectedOption : index === 0) ?? null);

const activeMetaSelectionForOption = (async (activeMetaSelectionOption) => {
    let {token, key, panel, query, scopes, records} = activeMetaSelectionOption || {}
    if (!records && query) {
        records = (await surfaceRecordsRead({records: query}))?.records;
    }
    if (records && !query) {
        query = recordsToQuery(records)
    }
    let groupedVerbs = {}
    if (records) {
        groupedVerbs = groupedVerbsForRecords(records, scopes)
    }
    const actionFields = {panel, query, records}
    const r = {token, key, panel, query, records, groupedVerbs, actionFields}
    return r
});

const activeMetaSelections = Promise.all(activeMetaSelectionOptions.map(option => activeMetaSelectionForOption(option)))

const {
    render: renderLayout,
} = layoutComponentEntry({
    preact0: modules.preact,
    cuePanelAction0: cuePanelAction,
    act0: surfaceAct,
    blockDefs0: blockDefs,
    surface0: self,
    layout0: layout,
    panelMap0: panelMap,
    panelIframeProps0: panelIframeProps,
    panelKeys0: panelKeys,
    msgtxtParser0: msgtxtParser,
    msgtxtFormatter0: msgtxtFormatter,
    ribbonControl0: ribbonControl,
    sendRibbonControl0: sendRibbonControl,

    activeMetaSelectionKey0: activeMetaSelectionKey,
    sendActiveMetaSelectionKeyEvent0: sendActiveMetaSelectionKeyEvent,
    metaSelectionTabs0: metaSelectionTabs,
    activeMetaSelectionOptions0: activeMetaSelectionOptions,
    activeMetaSelections0: activeMetaSelections,
})

const rendered = renderLayout(document.body)
console.log({rendered})

// panels

// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
    records: import("./records.js"),
    inputs: import("./inputs.js"),
    blocks: import("./blocks.js"),
    blockComponent: import("./block.renkon.component.js"),
});
const {
    plumbingForRecord,
    blocks,
    plumbing,
    recordsUpdatedScripts,
    mergeBlockScripts,
} = modules.blocks
const {h, html, render} = modules.preact
const {
    mergeRecordQueries,
    recordWriteFromFile,
} = modules.records
const {makeInputs} = modules.inputs
const {select, textinput, button} = makeInputs({h});

const blockComponent = Renkon.component(modules.blockComponent.component)

const init = Events.once(modules);
const blockDefs = blocks();

((blockDefs) => {
    Events.send(ready, true);
})(blockDefs);

const newPanelBuilder = (surface) => {
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

    return {
        new: ({now, ...fields}={}) => {
            const key = `${formatDate(now ?? new Date())}-${genchars(4)}`
            return {
                fields: {
                    ...fields,
                    type: "panel",
                    key,
                    path: `${surface.path}/panels/${key}`
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
};

const surface = Behaviors.keep(surfaceUpdated);
console.log({surface})

const panelRecords = Behaviors.collect(undefined, recordsUpdated, (now, {panels: {incremental, records}={}}) => (records ? (incremental ? [...now, ...records] : records) : now));

const panelMap = new Map(panelRecords.map((panel) => [panel.fields.key, panel]))

const panelBuilder = newPanelBuilder(surface?.fields)

const panelKey = panel => panel?.fields?.key

const panelID = panel => panel.id

const panelQuerySet = (panel) => {
    const userQuery = panel.fields?.queryset
    const blockQuery = blockDefs[panel.fields?.block]?.fields?.queryset
    return mergeRecordQueries({}, userQuery, blockQuery)
}

const panelClose = (panel, key) => {
    if (panel) {
        Events.send(recordsWrite, [panelBuilder.delete(panel)])
    }
    Events.send(surfaceWrite, {op: 'panel:remove', ids: [key]})
}

const panelSetBlock = (panel, block) =>
    Events.send(recordsWrite, [panelBuilder.update(panel, {back: panelID(panel), block})])

const panelSetQuery = (panel, value) =>
    Events.send(recordsWrite, [panelBuilder.update(panel, {back: panelID(panel), queryset: JSON.parse(value)})])

const panelNavigateBack = (target, panel) => panel.fields?.back && recordRead(panel.fields?.back).then(({fields}) => {
    const write = target === 'self'
        ? {fields: {...fields, next: panelID(panel)}}
        : panelBuilder.new({...fields})
    Events.send(recordsWrite, [write])
    if (target !== 'self') {
        Events.send(surfaceWrite, {op: 'panel:ensure-after', before: panelKey(panel), after: [write.fields.key]})
    }
})

const panelNavigateForward = (target, panel) => panel.fields?.next && recordRead(panel.fields?.next).then(({fields}) => {
    const write = target === 'self'
        ? {fields: {...fields, back: panelID(panel)}}
        : panelBuilder.new({...fields, back: panelID(panel)})
    Events.send(recordsWrite, [write])
    if (target !== 'self') {
        Events.send(surfaceWrite, {op: 'panel:ensure-after', before: panelKey(panel), after: [write.fields.key]})
    }
})

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
            Events.send(close, {ns: [key]})
        }

        return {map: nextMap, updates: any ? updates : undefined}
    },
);

const panelQuerysetsUpdates = Events.collect(
    undefined,
    panelQuerysets, (_, {updates}) => updates);

const panelBlockScripts = Behaviors.collect(
    {},
    Events.or(panelRecords, blockDefs), (now, _) => {
        const next = {}
        let any = 0
        for (const panel of panelRecords) {
            const k = panelKey(panel)
            const v = mergeBlockScripts(blockDefs?.[panel.fields?.block], recordsUpdatedScripts)
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

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});

// TODO write separator logic... look at presenter.html
// TODO add support for rearranging, accept writes of "after" or "swap" and do the right thing

const blockEvents = Events.some(windowMessages, Events.change(panelKeys), panelQuerysetsUpdates)

const panelWrite = (key, {target, panel: {blockForRecord, recordQuery, ...panelRequest}}) => {
    const panel = panelMap.get(key)
    if (blockForRecord) {
        const {block, querykey} = plumbingForRecord(plumbing, blockForRecord) || {}
        if (!panelRequest.block) {
            panelRequest.block = block
        }

        if (recordQuery) {
            panelRequest.queryset = mergeRecordQueries(
                panelRequest.queryset || {},
                {[querykey]: recordQuery},
            )
        }
    }

    const write = (panel && (target === 'self'))
        ? panelBuilder.update(panel, {back: panelID(panel), ...panelRequest, next: undefined})
        : panelBuilder.new({back: panel ? panelID(panel) : undefined, ...panelRequest, next: undefined})
    Events.send(recordsWrite, [write])
    if ((target !== 'self')) {
        Events.send(surfaceWrite, {op: 'panel:ensure-after', before: panel ? panelKey(panel) : undefined, after: [write.fields.key]})
    }
}

const panelEmit = (key, emits) => {
    // HACK using the same path for all emits means they will overwrite each other. So only inject it if we have a single thing to emit.
    let path = emits.length <= 1 ? panelMap.get(key)?.fields?.path : undefined
    if (path) {
        path = path + '.emit'
    }
    emits = emits.map(emit => ({...emit, fields: {...emit.fields, panel: key, path}}))
    console.log({emits})
    Events.send(recordsWrite, emits)
}

const panelKeys = (() => {
    const surfacePanels = surface.fields?.panels
    const set = new Set(Array.isArray(surfacePanels) ? surfacePanels : undefined)
    for (const key of panelMap.keys()) {
        set.add(key)
    }
    return set
})();

// console.log({panelQuerysetsUpdates});
// console.log({panelKeys});
// console.log({panelMap});
// console.log({panelRecords});
// console.log({recordsUpdated});

const panelVDOMs = Array.from(panelKeys, (key) => {
    const panel = panelMap.get(key)
    const style = `
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border: 0;
        border-bottom: 1px solid black;
    `

    if (!panel) {
        return {
            iframeProps: {key, style},
            key,
        }
    }

    const bc = blockComponent({
        key,
        style,
        scripts: panelBlockScripts,
        notifiers: {
            panelWrite: (key, requests) => (requests.forEach(request => panelWrite(key, request))),
            panelEmit: (key, requests) => (requests.forEach(request => panelEmit(key, request))),
            recordsWrite: (key, recordses) => Events.send(recordsWrite, recordses.flatMap(records => records)),
            recordsQuery: (key, queries) => queries.forEach(({ns, ...q}) => Events.send(recordsQuery, {...q, ns: [key, ...ns], [Renkon.app.transferSymbol]: q.port ? [q.port] : []})),
            close: (key, closes) => closes.forEach(c => Events.send(close, {ns: [key, ...c.ns]})),
        },
        events: blockEvents,
        defineExtraEvents: [
            {name: "querysetUpdated", keyed: true},
        ],
        eventsReceivers: ["querysetUpdated"],
        eventsReceiversQueued: ["close", "recordsQuery", "recordsWrite", "panelWrite", "panelEmit"],
    }, key);

    return {
        iframeProps: bc.iframeProps,
        key,
        panel,
    };
}).filter(_ => _);

const recordRead = id => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data: {records: [record]}}) => {
        // console.log("recordRead", id, record)
        resolve(record)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsQuery, {
        ns: [`recordread-hack-${+new Date()}`], // this approach to ns is a hack :(
        port: ch.port1,
        global: true,
        queryset: {records: {basis_criteria: {where: {id: [{compare: "=", value: id}]}}}},
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const importFilesAsRecordWrites = ({fields, pathPrefix}) =>
    new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async () => {
        const files = input.files;
        if (!files) return resolve([]);
        try {
          resolve(Promise.all(Array.from(files, file => recordWriteFromFile({...fields, path: pathPrefix + file.name}, file))));
        } catch (error) {
          reject(error);
        }
      };
      input.click();
    });

const fileImportPathPrefix = "/"

const panelControls = ({key, panel, recordQuerySet, blockType}) =>
    h('div', {
        style: {
            padding: "0.25em",
            fontFamily: 'system-ui',
            fontSize: '0.8rem',
        },
    }, [
        h('div', {}, [
            h('div', {
                style: {
                    flexGrow: '1',
                    position: 'relative',
                },
            }, blockDefs[blockType]?.fields?.queryset !== null
                ? [
                    textinput(
                        JSON.stringify(recordQuerySet),
                        (value) => panelSetQuery(panel, value),
                        {style: {
                            paddingTop: '0.2em',
                            paddingBottom: '0.25em',
                            // paddingRight: '1.8em',
                            width: '-webkit-fill-available',
                        }},
                    ),
                ]
                : '',
            ),
            h('div', {
                style: {
                    backgroundColor: 'lightgray',
                    paddingLeft: '0.25em',
                    paddingRight: '0.25em',
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em',
                    marginTop: '0.25em',
                    marginBottom: '0.25em',
                },
            }, blockDefs[blockType]?.fields?.queryset !== null
                ? JSON.stringify(blockDefs[blockType]?.fields?.queryset)
                : ''),
        ]),
        h('div', {
            style: {
                display: 'flex',
                alignItems: "end",
            },
        }, [
            key,
            h('div', {style: {flex: '1'}}),
            select(
                (value) => panelSetBlock(panel, value),
                Object.keys(blockDefs).map(t => ({value: t, label: t, selected: t === blockType})),
            ),
            h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
            button(
                (evt) => panelNavigateBack(evt.metaKey ? undefined : 'self', panel),
                "⏴",
                {disabled: !panel?.fields?.back},
            ),
            button(
                (evt) => panelNavigateForward(evt.metaKey ? undefined : 'self', panel),
                "⏵",
                {disabled: !panel?.fields?.next},
            ),
            h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
            button(
                () => panelClose(panel, key),
                "✕",
            ),
        ])
    ]);

const panelsH = h('div', {
    style: `
        display: flex;
        flex-direction: ${surface.fields?.direction ?? 'row'};
        gap: 1em;
        flex-grow: 1;
        height: 100vh;
        overflow-x: auto;
        scrollbar-width: none;
    `,
}, [
    ...panelVDOMs.map(
        ({iframeProps, panel, key}) => h('div', {
            style: `
                display: flex;
                flex-direction: column;
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                margin-left: 0.5em;
                margin-right: 0.5em;
                min-width: calc(50vw - (3em));
                overflow: auto;
                flex: 1 1 min-content;
                border: 1px solid black;
                border-radius: 0.2em;
            `,
            key,
        }, [
            h('iframe', iframeProps),
            panelControls({
                key,
                panel,
                recordQuerySet: panel?.fields?.queryset,
                blockType: panel?.fields?.block,
            }),
        ])
    ),
    h('div', {
        style: `
            display: flex;
            flex-direction: ${surface.fields?.direction === 'row' ? 'column' : 'row'};
        `,
    }, [
        button(
            () => panelWrite(undefined, {panel: {block: 'start'}}),
            '+',
            {style: 'width: 2em; height: 2em;'}
        ),
        button(
            () => Events.send(surfaceWrite, {op: 'surface:direction', direction: surface.fields?.direction  === 'row' ? 'column' : 'row'}),
            '⤺',
            {style: 'width: 2em; height: 2em;'}
        ),
        button(
            () => importFilesAsRecordWrites({fields: {}, pathPrefix: fileImportPathPrefix}).then(records => Events.send(recordsWrite, records)),
            "📂",
            {style: 'width: 2em; height: 2em;'}
        ),
        h('div', {style: {flex: '1'}}),
    ]),
]);

render(panelsH, document.body);

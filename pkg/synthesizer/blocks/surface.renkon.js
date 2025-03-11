// surface

Events.send(ready, true);

// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    // msg: import(spaceURL("/esbuild/pkg/toolkit/msg/mod.ts")),
    msg: import("./msg.js"), // https://substrate-b95b.local/spaceview;space=image:source/esbuild/pkg/toolkit/msg/
    preact: import("./preact.standalone.module.js"),
    records: import("./records.js"),
    inputs: import("./inputs.js"),
    blocks: import("./blocks.js"),
    blockComponent: import("../block.renkon.component.js"),
    mm: import("./mm.js"),
});
const {
    blockDefForType,
    blocks,
    plumbing,
} = modules.blocks
const {h, html, render} = modules.preact
const {reflect, sender} = modules.msg
const {
    sampleRecordQueries,
    panelQuery,
    makeRecordBuilder,
    mergeRecordQueries,
} = modules.records
const {makeInputs} = modules.inputs
const {mmNew} = modules.mm
const {select, textinput, button} = makeInputs({h});
const recordBuilder = makeRecordBuilder();

const blockComponent = Renkon.component(modules.blockComponent.component)

const init = Events.once(modules)

const panels = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => (incremental ? [...now, ...records] : records).sort((a, b) => a?.fields?.path.localeCompare(b?.fields?.path)));
// const panels = [
//     ...new Map(records.filter(p => p?.fields && !p?.fields?.closed).map(p => [p.id, p])).values()
// ].sort((a, b) => a?.fields?.path.localeCompare(b?.fields?.path))
console.log({panels})

const newPanelRecordsQuery = (key, query) => {
    const ch = new window.MessageChannel()
    const portSend = ch.port1
    const portRecv = ch.port2

    const entry = {
        key,
        query,
        notification: undefined,
        notifier: undefined,
        ch,
        portSend,
        portRecv,
        setNotifier(notifier) {
            const notifierChanged = this.notifier !== notifier
            this.notifier = notifier

            if (this.notification !== undefined && notifierChanged) {
                this.notifier(this.notification)
            }

            let done = false
            return () => {
                if (!done && this.notifier === notifier) {
                    this.notifier = undefined
                }
                done = true
            }
        },
    }
    portRecv.onmessage = ({data: notification}) => {
        entry.notification = notification
        if (entry.notifier) {
            entry.notifier(notification)
        }
    }

    return entry
}

const panelRecordsEventSourceMux = Behaviors.collect(
    mmNew(),
    panels, (now, panels) => {
        console.log("inside panelRecordsEventSourceMux", {now, panels});
        const deletedIds = new Set(now.map.keys())
        const added = []
        for (const p of panels) {
            const key = p.fields.path
            deletedIds.delete(key)
            const userQuery = p.fields.query
            const blockQuery = blockDefs[p.fields.block]?.fields?.query
            const query = mergeRecordQueries({}, userQuery, blockQuery)
            const nowP = now.get(key)
            if (!nowP || JSON.stringify(nowP.query) !== JSON.stringify(query)) {
                added.push(newPanelRecordsQuery(key, query))
            }
        }
        if (deletedIds.length === 0 && added.length === 0) {
            return now
        }

        return now.update(map => {
            for (const key of deletedIds) {
                Events.send(close, {key: [key]})
            }

            for (const add of added) {
                Events.send(recordsQuery, {key: [add.key], query: add.query, port: add.portSend, stream: true, [Renkon.app.transferSymbol]: [add.portSend]})
                map.set(add.key, add)
            }
        })
    },
);

const panelBlockRecordsUpdatesQueued = Events.observe((notify) => {
    const cleanups = []
    panelRecordsEventSourceMux.map.forEach((entry, id) => {
        cleanups.push(entry.setNotifier((records) => notify({[id]: records})))
    })
    if (panelRecordsEventSourceMux.map.size === 0) {
        notify({})
    }
    return () => cleanups.forEach(f => f())
}, {queued: true});

const panelBlockRecordsUpdates = Events.collect(
    undefined,
    panelBlockRecordsUpdatesQueued, (_, queued) => Object.assign({}, ...queued));

// TODO can simplify
const panelBlockScripts = Events.collect(
    {map: new Map(), updated: undefined},
    Events.or(Events.change(panels), Events.change(blockDefs)), ({map}, _) => {
        const nextMap = new Map()
        const updates = {}
        let any = 0
        for (const panel of panels) {
            const k = panel.fields.path
            const v = blockDefs[panel.fields.block]
            nextMap.set(k, v)
            if (map.get(k) !== v) {
                updates[k] = v
                any++;
            }
        }
        return {map: nextMap, updates: any ? updates : undefined}
    },
);

const panelBlockScriptsUpdates = Events.collect(
    undefined,
    panelBlockScripts, (_, {updates}) => updates);

const panelBlockConfigUpdates = Events.collect(
    undefined,
    panelBlockScripts, (_, {updates}) => updates && Object.fromEntries(Object.keys(updates).map(k => [k, {}])));

const windowMessages = Events.observe(notify => {
    const listener = (evt) => notify(evt)
    window.addEventListener("message", listener)
    return () => window.removeEventListener("message", listener)
}, {queued: true});

const blockDefsReload = Events.receiver()
const blockDefs0 = Behaviors.collect(
    undefined,
    Events.or(init, blockDefsReload), () => blocks(),
);
const blockDefs = blockDefs0
// console.log({blockDefs});

// TODO write separator logic... look at presenter.html
// TODO add support for rearranging, accept writes of "after" or "swap" and do the right thing
// TODO write 

Events.collect(
    undefined,
    panelWrite, (_, {key, target, panel: panelRequest}) => {
        const panel = panels.find(({fields: {path}}) => path === key)
        if (!panel) {
            console.log("skipping blockEmitPanelWrite; could not find panel for key", key)
            return
        }

        if (!panelRequest.block && panelRequest.blockForType) {
            panelRequest.block = blockDefForType(plumbing, panelRequest.blockForType) || 'record inspector'
        }

        Events.send(recordsWrite, [
            target === 'self'
                ? recordBuilder.update(panel, {...panelRequest, back: panel.id, next: undefined})
                : recordBuilder.newPanel({...panelRequest, back: panel.id, next: undefined}),
        ])
    },
);

const panelEvents = Events.some(windowMessages, panelBlockScriptsUpdates, panelBlockRecordsUpdates, panelBlockConfigUpdates)//, panelBlockScripts)

const panelVDOMs = [...panels.map((panelRecord) => {
    const key = panelRecord.fields.path

    const {
        iframeProps,
    } = blockComponent({
        key,
        style: `
            flex-grow: 1;
            width: 100%;
            height: 100%;
            border: 0;
            border-bottom: 1px solid black;
        `,
        notifiers: {
            // focused: (key, focused) => Events.send(blockEmitFocused, [key, focused]),
            panelWrite: (key, v) => Events.send(panelWrite, {...v, key}),
            recordsWrite: (key, records) => Events.send(recordsWrite, records),
            recordsQuery: (key, queries) => queries.forEach(query => Events.send(recordsQuery, {...query, key: [key, ...query.key], [Renkon.app.transferSymbol]: [query.port]})),
            close: (key, closes) => closes.forEach(c => Events.send(close, {key: [key, ...c.key]})),
        },
        h,
        events: panelEvents,
    }, key);

    return {
        iframeProps,
        key,
        panelRecord,
    };
})]

const recordRead = id => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data: {records: [record]}}) => {
        console.log("recordRead", id, record)
        resolve(record)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsQuery, {key: ["dummy"], port: ch.port1, query: {basis_criteria: {compare: {id: [{compare: "=", value: id}]}}}, [Renkon.app.transferSymbol]: [ch.port1]})
})

const panelControls = ({key, panelRecord, recordQuery, blockType}) =>
    h('div', {
        style: {
            padding: "0.25em",
            // backgroundColor: blockCurrentFocusKey === key ? 'lightblue' : '',
        },
        // onmousedown: (evt) => {
        //     if (blockCurrentFocusKey === key) {
        //         return
        //     }
        //     if (['SELECT', 'INPUT', 'BUTTON'].includes(evt.target.nodeName)) {
        //         return
        //     }
        //     Events.send(blockDOMRefFocus, key)
        // },
    }, [
        h('div', {
            style: {
                display: 'flex',
                flexDirection: "row",
                alignItems: 'center',
                gap: '1ex',
                marginBottom: '0.25em',
            },
        }, [
            h('div', {
                style: {backgroundColor: 'lightgray'}
            }, [
                select(
                    (value) => Events.send(recordsWrite, [recordBuilder.update(panelRecord, {back: panelRecord.id, block: value})]),
                    Object.keys(blockDefs).map(t => ({value: t, label: t, selected: t === blockType})),
                ),
                h('div', {}, blockDefs[blockType]?.fields?.query !== null
                    ? JSON.stringify(blockDefs[blockType]?.fields?.query)
                    : ''),
            ]),
            h('div', {
                style: {
                    flexGrow: '1',
                    position: 'relative',
                },
            }, blockDefs[blockType]?.fields?.query !== null
                ? [
                    textinput(
                        JSON.stringify(recordQuery),
                        (value) => Events.send(recordsWrite, [recordBuilder.update(panelRecord, {back: panelRecord.id, query: JSON.parse(value)})]),
                        {style: {paddingTop: '0.2em', paddingBottom: '0.25em', paddingRight: '1.8em', width: '-webkit-fill-available'}},
                    ),
                    select(
                        (value) => Events.send(recordsWrite, [recordBuilder.update(panelRecord, {back: panelRecord.id, query: value})]),
                        sampleRecordQueries.map(t => ({value: t, label: JSON.stringify(t), selected: JSON.stringify(t) === JSON.stringify(recordQuery)})),
                        {style: {width: '1.35em', position: 'absolute', right: '0.3em', top: '0.2em'}},
                    ),
                ]
                : '',
            ),
        ]),
        h('div', {
            style: {
                display: 'flex',
                alignItems: "end",
                fontFamily: 'system-ui',
            },
        }, [
            key,
            h('div', {style: {flex: '1'}}),
            // button(
            //     () => Events.send(recordsWrite, [recordStore.update(panelRecord, {order: moveOrder.moveDown})]),
            //     "←",
            //     {disabled: moveOrder.moveDown === undefined},
            // ),
            // button(
            //     () => Events.send(recordsWrite, [recordStore.update(panelRecord, {order: moveOrder.moveUp})]),
            //     "→",
            //     {disabled: moveOrder.moveUp === undefined},
            // ),
            h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
            button(
                () => panelRecord.fields.back && recordRead(panelRecord.fields.back).then(({fields}) => {
                    Events.send(recordsWrite, [{fields: {...fields, next: panelRecord.id}}])
                }),
                "⏴",
                {disabled: !panelRecord.fields.back},
            ),
            button(
                () => panelRecord.fields.next && recordRead(panelRecord.fields.next).then(({fields}) => {
                    Events.send(recordsWrite, [{fields, back: panelRecord.id}])
                }),
                "⏵",
                {disabled: !panelRecord.fields.next},
            ),
            h('span', {style: {width: '0.5em', display: 'inline-block'}}, ' '),
            button(
                () => Events.send(recordsWrite, [recordBuilder.delete(panelRecord)]),
                "✕",
            ),
        ])
    ]);

const panelsH = h('div', {
    style: {
        display: 'flex',
        flexDirection: "row",
        gap: '1em',
        flexGrow: '1',
        height: '100vh',
        overflowX: 'auto',
        scrollbarWidth: 'none',
    },
}, panelVDOMs.map(
    ({iframeProps, panelRecord, key}) => h('div', {
        style: {
            display: 'flex',
            flexDirection: 'column',
            // padding: "1ex",
            marginTop: "0.5em",
            marginBottom: "0.5em",
            marginLeft: "0.5em",
            marginRight: "0.5em",
            minWidth: "calc(50vw - (1em + 1em))",
            overflow: "auto",
            flex: '1 1 min-content',
            border: "1px solid black",
            borderRadius: "0.2em",
        },
        key,
    }, [
        h('iframe', iframeProps),
        panelControls({
            key,
            panelRecord,
            recordQuery: panelRecord.fields.query,
            blockType: panelRecord.fields.block,
        }),
    ])
));

render(panelsH, document.body);

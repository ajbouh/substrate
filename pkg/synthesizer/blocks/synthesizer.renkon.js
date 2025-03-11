// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    msg: import("./msg.js"),
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
const {mmNew} = modules.mm
const {h, html, render} = modules.preact
const {
    panelQuery,
    makeRecordBuilder,
    mergeRecordQueries,
} = modules.records
const {makeInputs} = modules.inputs

const init = Events.once(modules)

const {select, textinput, button} = makeInputs({h});
const recordBuilder = makeRecordBuilder();

const blockDefsReload = Events.receiver()
const blockDefs0 = Behaviors.collect(
    undefined,
    Events.or(init, blockDefsReload), () => blocks(),
);
const blockDefs = blockDefs0;

((blockDefs) => {
    console.log("READY!!!!")
    Events.send(ready, true);
})(blockDefs);

const key = "surface"
const panelsAnnounce = Events.observe((notify) => {
    const ch = new window.MessageChannel()
    const send = ch.port1
    const recv = ch.port2
    recv.onmessage = ({data: notification}) => notify(notification)
    Events.send(recordsQuery, {key: [key], query: panelQuery, stream: true, port: send, [Renkon.app.transferSymbol]: [send]}) // if we nest this, need [transferSymbol]: [send]
    return () => {
        recv.onmessage = undefined
        Events.send(close, {key: [key]})
    }
})
console.log({panelsAnnounce})

const newPanelOptions = [
    {label: 'panels', disabled: true, selected: true},
    {label: 'add a panel', options: [
        ...Object.keys(blockDefs).map(blockDefKey => ({
            value: {addPanel: {block: blockDefKey, query: {}}},
            label: blockDefKey,
        }))
    ]},
];

const windowMessages = Events.observe(notify => {
    const listener = (evt) => notify(evt)
    window.addEventListener("message", listener)
    return () => window.removeEventListener("message", listener)
}, {queued: true});
console.log({windowMessages});

const blockComponent = Renkon.component(modules.blockComponent.component)

const surfaceRecordsUpdates = Events.collect(undefined, panelsAnnounce, (now, panelsAnnounce) => ({[key]: panelsAnnounce}))
const surfaceScriptsUpdates = Events.collect(undefined, blockDefs, (now, blockDefs) => ({[key]: blockDefs['surface']}))
const surfaceEvents = Events.some(windowMessages, surfaceScriptsUpdates, surfaceRecordsUpdates);

const surfaceBlock = blockComponent({
    key,
    style: `
        flex-grow: 1;
        width: 100%;
        height: 100%;
        border: 0;
        border-bottom: 1px solid black;
    `,
    notifiers: {
        focused: (key, focused) => Events.send(blockEmitFocused, [key, focused]),
        recordsWrite: (key, records) => Events.send(recordsWrite, records),
        recordsQuery: (key, queries) => queries.forEach(query => Events.send(recordsQuery, {...query, key: [key, ...query.key], [Renkon.app.transferSymbol]: [query.port]})),
        close: (key, closes) => closes.forEach(c => Events.send(close, {key: [key, ...c.key]})),
    },
    h,
    events: surfaceEvents,
}, key);

const synthesizerH = h('div', {
    style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
}, [
    h('iframe', surfaceBlock.iframeProps),
    h('div', {
        style: {
            display: 'flex',
            flexDirection: 'row',
            gap: '1em',
            width: '100vw',
            placeItems: 'center',
        },
    }, [
        h('div', {
            style: {
                marginLeft: '0.5em',
                paddingTop: '0.5em',
                paddingBottom: '0.5em',
            },
        }, "synthesizer"),
        button(
            () => Events.send(blockDefsReload, "reload"),
            '↻',
        ),
        h('div', {style: {flex: '1'}}),
        select(
            (value, evt) => {
                const {addPanel, focusPanel} = value;
                if (addPanel) {
                    const {block, query} = addPanel
                    Events.send(recordsWrite, [recordBuilder.newPanel({block, query})])
                }
                if (focusPanel) {
                    Events.send(blockDOMRefFocus, focusPanel);
                }
                evt.preventDefault();
            },
            newPanelOptions,
            {style: {marginRight: '0.5em'}},
        ),
    ]),
]);
render(synthesizerH, document.body);

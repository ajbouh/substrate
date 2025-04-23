// record-browser
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
    blocks: import("./blocks.js"),
    blockComponent: import("./block.renkon.component.js"),
});
const {
    plumbingForRecord,
    plumbing,
    blocks,
} = modules.blocks
const init = Events.once(modules)

const blockDefs0 = Behaviors.collect(
    undefined,
    init, () => blocks(),
);
const blockDefs = blockDefs0;

((blockDefs) => {
    console.log("READY!!!!")
    Events.send(ready, true);
})(blockDefs);

const {h, html, render} = modules.preact

const blockComponent = Renkon.component(modules.blockComponent.component)

// todo accept all incoming records, show them all grouped by other information

const records = Behaviors.collect(undefined, recordsUpdated, (now, {records: {incremental, records}}) => incremental ? [...now, ...records] : records);

const recordBlockKey = record => record.id // TODO make this 
const blockRecords = Object.groupBy(records, recordBlockKey)

// console.log({recordsUpdated});
const blockKeys = Behaviors.select(
    {set: new Set()},
    recordsUpdated, (now, {records: {incremental, records}}) => {
        // console.log("{incremental, records}", {incremental, records})
        let set = now.set
        let size = set.size
        if (!incremental) {
            set = new Set()
            size = -1
        }

        for (const record of records) {
            const k = recordBlockKey(record)
            set.add(k)
        }
        return (set.size === size) ? now : {set}
    });
// console.log({blockKeys});

const blockRecordsEvent = Events.select(
    undefined,
    recordsUpdated, (now, {records: {incremental, records}}) => {
        const o = Object.groupBy(records, recordBlockKey)
        const entries = Array.from(Object.entries(o), ([k, v]) => [k, {records: {incremental, records: v}}]);
        return Object.fromEntries(entries)
    });
console.log({blockRecordsEvent})

const mapObject = (o, f) => Object.fromEntries(Object.entries(o).map(f))

const blockTypeUpdates = Events.select(
    undefined,
    blockRecordsEvent, (now, updates) => {
        return mapObject(updates, ([key, {records: {records: [record]}}]) => [key, plumbingForRecord(plumbing, record, 'view')?.block || 'record inspector'])
    });
// console.log({blockTypeUpdates})

const blockScriptsUpdates = Behaviors.select(
    undefined,
    blockTypeUpdates, (now, updates) => {
        return mapObject(updates, ([key, type]) => ([key, blockDefs[type]]))
    });
// console.log({blockScriptsUpdates});

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});
// console.log({windowMessages});

const blockEvents = Events.some(windowMessages, Events.change(blockKeys), blockRecordsEvent);

const blockComponents = Array.from(blockKeys.set, key => ({
    key,
    iframeProps: blockComponent({
        key,
        style: `
            pointer-events: none;
            border: 0;
            width: 100%;
            height: calc(100% - 1.5em);
        `,
        scripts: blockScriptsUpdates,
        defineExtraEvents: [
            {name: "recordsUpdated", keyed: true},
        ],
        eventsReceivers: ["recordsUpdated", "panelWrite"],
        eventsReceiversQueued: ["close", "recordsQuery"],
        notifiers: {},
        events: blockEvents,
    }, key).iframeProps
}))

render(
    h('div', {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gridAutoRows: 'minmax(100px, auto)',
            height: '100vh',
        },
    }, blockComponents.map(({iframeProps, key}) => h('div', {
        key,
        style: {
            border: '1px solid gray',
            borderRadius: '0.25em',
            margin: '0.25em',
            userSelect: 'none',
        },
        onclick: (evt) => {
            console.log("single click!")
        },
        ondblclick: (evt) => {
            console.log("double click!")
            console.log(evt)
            evt.preventDefault()
        },
    }, [
        h('div', {
            style: {
                backgroundColor: 'lightgray',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                borderTopRightRadius: '0.25em',
                borderTopLeftRadius: '0.25em',
                padding: '0.25em 0.5em',
                fontFamily: 'system-ui',
                display: 'block',
                cursor: 'pointer',
                height: '1em',
            },
        }, [
            key,
        ]),
        h('iframe', iframeProps),
    ]))),
    document.body,
);

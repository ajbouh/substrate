// record-browser
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    blocks: import("../blocks.js"),
    blockComponent: import("../block.renkon.component.js"),
});
const {
    blockDefForType,
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

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const recordBlockKey = record => record.id // TODO make this 
const blockRecords = Object.groupBy(records, recordBlockKey)

// console.log({recordsUpdated});
const blockKeys = Behaviors.select(
    {set: new Set()},
    recordsUpdated, (now, {incremental, records}) => {
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
    recordsUpdated, (now, {incremental, records}) => {
        const o = Object.groupBy(records, recordBlockKey)
        const entries = Array.from(Object.entries(o), ([k, v]) => [k, {incremental, records: v}]);
        return Object.fromEntries(entries)
    });
// console.log({blockRecordsEvent})

const mapObject = (o, f) => Object.fromEntries(Object.entries(o).map(f))

const blockTypeUpdates = Events.select(
    undefined,
    blockRecordsEvent, (now, updates) => {
        return mapObject(updates, ([key, {records: [record]}]) => [key, blockDefForType(plumbing, record?.fields?.type, 'view') || 'record inspector'])
    });
// console.log({blockTypeUpdates})

const blockScriptsUpdates = Events.select(
    undefined,
    blockTypeUpdates, (now, updates) => {
        return mapObject(updates, ([key, type]) => ([key, blockDefs[type]]))
    });
// console.log({blockScriptsUpdates});

// const blockScripts = Object.fromEntries(blockTypes.entries().map(([k, v]) => [k, blockDefs[v]]))

const windowMessages = Events.observe(notify => {
    const listener = (evt) => notify(evt)
    window.addEventListener("message", listener)
    return () => window.removeEventListener("message", listener)
}, {queued: true});
// console.log({windowMessages});

const blockEvents = Events.some(windowMessages, blockScriptsUpdates, blockRecordsEvent);
// console.log({blockEvents});
// console.log({init});
// console.log({windowMessages});
// console.log({blockRecordsUpdates});
// console.log({blockRecords});

const blockComponents = Array.from(blockKeys.set, key => ({
    key,
    iframeProps: blockComponent({
        key,
        style: `
            pointer-events: none;
            border: 0;
            width: calc(100% - 0.5em);
            paddingLeft: 0.25em;
            paddingRight: 0.25em;
            paddingTop: 0.25em;
            paddingBottom: 0.25em;
            height: calc(100% - 2em);
        `,
        notifiers: {},
        events: blockEvents,
    }, key).iframeProps
}))
console.log({blockComponents})

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

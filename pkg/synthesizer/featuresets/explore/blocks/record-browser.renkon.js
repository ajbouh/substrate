// record-browser
// group these together so we can delay init until they are all loaded and available.

const {criteriaMatcher} = modules.recordsMatcher
const {h, html, render} = modules.preact

const blockComponent = Renkon.component(modules.blockComponent.component)

const init = Events.once(modules);

((init) => {
    Events.send(ready, true);
})(init);

const internalRecordsUpdated = Events.observe(notify => recordsSubscribe(notify, {
    queryset: {
        blocks: {
            view_criteria: {
                where: {type: [{compare: "=", value: "block"}]},
            },
            view: "group-by-path-max-id",
        },
        plumbing: {
            view_criteria: {
                where: {type: [{compare: "=", value: "plumbing"}]},
            },
            view: "group-by-path-max-id",
        },
    },
}));

const blockDefs = Behaviors.collect(
    undefined,
    internalRecordsUpdated, (now, {
        blocks: {incremental, records}={},
    }) => {
        if (!records) {
            return now
        }
        const next = {...now}

        for (const record of records) {
            const blockKey = record.fields.block
            next[blockKey] = record
        }

        return next
    },
);

const plumbing = Behaviors.collect(undefined, internalRecordsUpdated, (now, {plumbing: {incremental, records}={}}) => records ? incremental ? [...now, ...records] : records : now);

const plumbingForRecord = (plumbing, records, verb) => {
    const candidates = plumbing.flatMap(
        ({fields: plumb}) => ((!verb || plumb.verb === verb) && plumb.criteria && records.every(record => criteriaMatcher(plumb.criteria)(record)))
            ? [{q: 1, ...plumb}]
            : []);
    candidates.sort((a, b) => a.q - b.q)
    console.log("plumbingForRecord", {plumbing, records, verb, candidates})
    return candidates[0]
}

// todo accept all incoming records, show them all grouped by other information

const recordBlockKey = record => record.id // TODO make this 

console.log('record browser', {blockRecords})
console.log('record browser', {blockKeys})
console.log('record browser', {plumbing})
console.log('record browser', {internalRecordsUpdated})

// console.log({recordsUpdated});
const blockKeys = Behaviors.select(
    {set: new Set()},
    recordsUpdated, (now, {records: {incremental, records}={}}) => {
        if (!records) {
            return now
        }
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

const blockRecordsEvent = Events.select(
    undefined,
    recordsUpdated, (now, {records: {incremental, records}={}}) => {
        if (!records) {
            return now
        }
        const o = Object.groupBy(records, recordBlockKey)
        const entries = Array.from(Object.entries(o), ([k, v]) => [k, {records: {incremental, records: v}}]);
        return Object.fromEntries(entries)
    });
console.log('record browser', {blockRecordsEvent})

const blockRecordsRaw = Behaviors.collect(
    undefined,
    blockRecordsEvent, (now, updates) => {
        const next = {...now}
        for (const [blockKey, {records: {incremental, records}}] of Object.entries(updates)) {
            next[blockKey] = incremental ? [...next[blockKey], ...records] : records
        }
        return next
    });
console.log('record browser', {blockRecordsRaw})

const mapObject = (o, f) => Object.fromEntries(Object.entries(o).map(f))

const recordBlockForRecords = (records) => {
    const p = plumbingForRecord(plumbing, records, 'view')
    const b = p?.block || 'record inspector'
    const blockDef = blockDefs[b]

    return {
        records,
        plumbing: p,
        block: b,
        blockDef,
        scripts: blockDef?.fields?.scripts,
        queryset: blockDef?.fields?.queryset,
    }
}

const blockRecords = Behaviors.select(
    undefined,
    Events.or(blockRecordsRaw, blockDefs, plumbing), (now, _) => {
        const next = {...now}
        for (const [key, records] of Object.entries(blockRecordsRaw)) {
            next[key] = recordBlockForRecords(records)
        }
        console.log("Events.or(blockDefs, plumbing)", "next", next, "now", now)
        return next
    },
);
console.log('record browser', {blockRecords});

const blockScripts = mapObject(blockRecords, ([key, {scripts}]) => [key, scripts])
console.log('record browser', {blockScripts});

const blockQuerysets = mapObject(blockRecords, ([key, {queryset}]) => [key, queryset])
console.log('record browser', {blockQuerysets});

const windowMessages = Events.listener(window, "message", evt => evt, {queued: true});
console.log('record browser', {windowMessages});

const blockEvents = Events.some(windowMessages, Events.change(blockKeys), Events.change(blockQuerysets), blockRecordsEvent);
console.log('record browser', {blockEvents});

const receivers = [
    {name: "queryset", keyed: true, type: "behavior"},
    {name: "recordsUpdated", keyed: true, type: "event", nodeclare: true},

    {name: "close", keyed: true, queued: true, type: "event"},
    {name: "recordsQuery", keyed: true, queued: true, type: "event"},
    {name: "panelWrite", keyed: true, type: "event"},
]

const notifiers = {}

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
        scripts: blockScripts,
        debug: true,
        receivers,
        notifiers,
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

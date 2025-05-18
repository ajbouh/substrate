// ---
// query: view: "group-by-path-max-id"
// ---
// tree-editor
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
    ulid: import("./ulid.js"),
    msg: import("./msg.js"),
    msgtxt: import("./msgtxt.js"),
    ohm: import("./ohm.js"),
    records: import("./records.js"),
});
const {h, html, render} = modules.preact
const {decodeTime} = modules.ulid
const {sender, reflect} = modules.msg
const {criteriaMatcher} = modules.records

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const sortRecords = records => records.sort((a, b) => a.fields?.path?.localeCompare(b.fields?.path))

const records = Behaviors.collect(undefined, recordsUpdated, (now, {records: {incremental, records}={}}) => records ? sortRecords(incremental ? [...now, ...records] : records) : now);

const facets = Behaviors.gather(/Facet$/)
const facetsAndMatchers = Object.values(facets).map(facet => [criteriaMatcher(facet.criteria), facet])
const facetsForRecord = record => facetsAndMatchers.map(v => v[0](record) ? v[1] : undefined)

const actionOffers = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {offers: {incremental, records: offers}={}}) => {
        return offers
            ? (incremental
                ? [...now, ...offers]
                : offers)
            : now ?? []
    })
const actionsAndMatchers = actionOffers.flatMap(({fields: {offerset}}) => Object.values(offerset).map(offer => [criteriaMatcher(offer.criteria), offer]))
const verbsForRecord = record => [...new Set(actionsAndMatchers.filter(v => v[0](record)).map(v => v[1].verb))]

const commonInput = {h, decodeTime}

const queryRecords = Behaviors.collect(undefined, querysetUpdated, (now, {records}) => records);
console.log({queryRecords})

const act = ({verb, record, event}) => {
    const write = {fields: {
        type: "action/cue",
        // records: [record],
        query: {
            global: true,
            view: "group-by-path-max-id",
            basis_criteria: { where: {path: [{compare: "=", value: record?.fields?.path}]} },
        },
        dat: {
            event: pick(event, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button"),
        },
        verb,
    }}
    console.log("act", write)
    Events.send(recordsWrite, [write])
}

const pick = (o, ...keys) => {
    const v = {}
    for (const k of keys) {
        v[k] = o[k]
    }
    return v
}

const recordsExportQuery = (query, name) => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data}) => {
        resolve(data)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsExport, {
        ns: [`recordsexport-hack-${Date.now()}`], // this approach to ns is a hack :(
        port: ch.port1,
        query,
        name,
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const downloadURL = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
};
  
render(
    h('div', {}, [
        // todo make this a list of actions that apply to all records
        h('a', {href: '#', onclick: (event) => {
            const name = `export-${Date.now()}.synth`
            recordsExportQuery(queryRecords, name).then(url => downloadURL(url, name))
        }}, 'export'),
        h('div', {}, records.map(record => {
            const input = {...commonInput, record}

            return h('div', {
                style: {
                    textWrap: 'nowrap',
                },
            }, [
                h('input', {type: 'checkbox'}),
                h('pre', {style: {display: 'inline'}}, [
                    ...facetsForRecord(record).map(facet => [' ', facet.render({...input})]),
                    ...verbsForRecord(record).map(verb => [
                        ' ',
                        h('a', {href: '#', onclick: (event) => act({verb, record, event})}, verb)
                    ]),
                ]),
            ])
        })),
    ]),
    document.body,
)

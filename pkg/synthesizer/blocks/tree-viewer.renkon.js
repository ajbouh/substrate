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
const {makeParser} = modules.msgtxt
const msgtxtParser = makeParser({ohm: modules.ohm.default})

console.log({modules})

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const sortRecords = records => records.sort((a, b) => a.fields?.path?.localeCompare(b.fields?.path))

const records = Behaviors.collect(undefined, recordsUpdated, (now, {records: {incremental, records}}) => sortRecords(incremental ? [...now, ...records] : records));

const facets = Behaviors.gather(/Facet$/)
const facetsAndMatchers = Object.values(facets).map(facet => [criteriaMatcher(facet.criteria), facet])
const facetsForRecord = record => facetsAndMatchers.map(v => v[0](record) ? v[1] : undefined)

const actions = Behaviors.gather(/Action$/)
const actionsAndMatchers = Object.values(actions).map(action => [criteriaMatcher(action.criteria), action])
const actionsForRecord = record => actionsAndMatchers.filter(v => v[0](record)).map(v => v[1])

const commonInput = {h, decodeTime, sender, reflect, msgtxtParser}

render(
    h('div', {},
        records.map(record => {
            const input = {...commonInput, record}

            return h('div', {
                style: {
                    textWrap: 'nowrap',
                },
            }, [
                h('input', {type: 'checkbox'}),
                h('pre', {style: {display: 'inline'}}, [
                    ...facetsForRecord(record).map(facet => [' ', facet.render({...input})]),
                    ...actionsForRecord(record).map(action => [
                        ' ',
                        h('a', {href: '#', onclick: (event) => action.act({...input, event})}, action.label)
                    ]),
                ]),
            ])
        })),
    document.body,
)

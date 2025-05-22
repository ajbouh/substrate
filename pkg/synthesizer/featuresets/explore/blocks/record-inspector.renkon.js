// record-inspector
// group these together so we can delay init until they are all loaded and available.

const {h, html, render} = modules.preact
const {makeInspectors} = modules.inspect
const {newInspector} = modules.inspector
const {criteriaMatcher} = modules.recordsMatcher

const init = Events.once(modules);

((init) => {
    Events.send(ready, true);
})(init);

const inspectors = makeInspectors({h, newInspector});

const records = Behaviors.collect([], recordsUpdated, (now, {records: {incremental, records}={}}) => records ? incremental ? [...now, ...records] : records : now);

const verbs = verbsForRecords(records)

render(
    h('div', {
        style: `
            display: flex;
            flex-direction: column;
            height: 100vh;
        `,
    }, [
        h('div', {
            style: `
                padding: 0.5rem;
                box-sizing: border-box;
            `,
        }, [
            ...verbs.flatMap(verb => [
                ' ',
                h('button', {onclick: (event) => act({verb, records, event})}, verb)
            ]),
        ]),
        h('div', {
            style: `
                flex-grow: 1;
                overflow: auto;
            `
        }, records.map(r => inspectors.auto(r))),
    ]),
    document.body,
)

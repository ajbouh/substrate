const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    blocks: import("./blocks.js"),
});

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const {h, html, render} = modules.preact
const {
    blocks,
    plumbing,
    starts,
} = modules.blocks

const blockDefs = Behaviors.collect(
    undefined,
    init, () => blocks(),
);

// make a "new panel" block

// use verb new in plumb

// it should show blocks that don't need a specific input, or that we can write a record for and then open

// no specific input
// tree viewer
// record browser
// X import files
// X text editor


// // write new record
// renkon editor
// bridge session

// -
// // search first:
// - field inspector
// - record inspector
// - pdf viewer
// - media viewer
// - record browser

// get all blockNames for verb 'start'
// put buttons to open them in a list

const startBlocks = Object.keys(blockDefs).filter(name => name !== 'start').map(blockDefKey => ({
    value: {block: blockDefKey, query: {}, records: () => {}},
    label: `open ${blockDefKey}`,
}))

const startRecords = starts.map(({block, label, start}) => ({
    value: {block, start},
    label,
}))


render(
    h('div', {
        style: `
        display: flex;
        flex-direction: column;
        height: 100%;
        flex-wrap: wrap;
        place-content: center;
        gap: 1em;
        `,
    }, [
        ...startBlocks.map(({label, value}) =>
            h('button', {
                onclick: (evt) => {
                    const {block, query} = value
                    Events.send(panelWrite, {target: evt.metaKey ? undefined : 'self', panel: {block, query}})
                },
            }, label),
        ),
        ...startRecords.map(({label, value}) =>
            h('button', {
                onclick: (evt) => {
                    const {block, start} = value
                    const {query, records} = start()
                    if (records) {
                        Events.send(recordsWrite, records)
                    }
                    Events.send(panelWrite, {target: evt.metaKey ? undefined : 'self', panel: {block, query}})
                },
            }, label),
        ),
    ]),
    document.body,
)
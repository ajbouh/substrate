// record-inspector
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
    inspect: import("./inspect.js"),
});
const {h, html, render} = modules.preact
const {makeInspectors} = modules.inspect

const init = Events.once(modules);

((init) => {
    Events.send(ready, true);
})(init);

const inspectors = makeInspectors({h, Renkon});

const records = Behaviors.collect([], recordsUpdated, (now, {records: {incremental, records}}) => incremental ? [...now, ...records] : records);

render(
    records.map(r => inspectors.auto(r)),
    document.body,
)

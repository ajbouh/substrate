// field-inspector
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    inspect: import("../inspect.js"),
});
const {h, html, render} = modules.preact
const {makeInspectors} = modules.inspect
const inspectors = makeInspectors({h, Renkon});

Events.send(ready, true);

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

render(
    records.map(r => inspectors.auto(r.fields)),
    document.body,
)

// context

// todo context is the first record
// use that to query for links back to context
// show visualization of everything in context in html

const {h, html, render} = modules.preact

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const contexts = Behaviors.collect(undefined, recordsUpdated, recordsUpdatedBehavior('records'))

console.log('in context', {contexts})

const recordDigest = record => record.fields.self
    ? {self: record.fields.self, ...(Object.fromEntries(record.fields.self.map(field => [field, record.fields[field]])))}
    : {self: ["id"], id: record.id}

const linkRecordsSubscription = {
    // HACK... this causes us to only see results that our surface has written.
    // it would be better to properly handle records we haven't processed yet but skip ones we have.
    queryset: {
        links: {
            view: "group-by-path-max-id",
            view_criteria: {
                where: {
                    type: [{compare: "=", value: "link"}],
                    context: [{compare: "in", value: contexts.map(context => recordDigest(context))}],
                },
            },
        },
    },
}
console.log('in context', {linkRecordsSubscription})

const linkRecordsUpdated = Events.observe(notify => recordsSubscribe(notify, linkRecordsSubscription));
console.log('in context', {linkRecordsUpdated})

const linkRecords = Behaviors.collect(undefined, linkRecordsUpdated, recordsUpdatedBehavior('links'));
console.log('in context', {linkRecords})

render(
    h('div', {}, linkRecords.map(o =>
        h('div', {
            style: `
                border: 1px solid black;
            `,
        }, h('pre', {style: `text-wrap: auto;`}, JSON.stringify(o))))
    ),
    document.body,
);

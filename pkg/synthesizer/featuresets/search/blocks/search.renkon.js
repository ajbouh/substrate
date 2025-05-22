const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
});
const {h, html, render} = modules.preact

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

// write search query
function genchars(length) {
    let result = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    for ( let i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
}

const querysetInit = Events.once(queryset);
((querysetInit) => {
    Events.send(searchChange, "i am hungry")
})(querysetInit);

// change this every time we make a new query.
// also mark the old one as stale so other components stop investing resources in it
const searchid = Events.collect(
    undefined,
    search, ({current}={}, search) => ({stale: current ? [current] : undefined, current: genchars(10)})
)

Events.send(recordsWrite, [{fields: {search, searchid: searchid.current}}])

// emit information marking the old one as stale so other components stop investing resources in it
// this is an example where we don't care about a "path", but we want to be able to "update" a previously written object to no longer appear in queries
(() => {
    if (searchid.stale) {
        Events.send(recordsWrite, searchid.stale.map(searchid => ({fields: {search, searchid}})))
    }
})();

const results = Behaviors.collect(undefined,
    recordsUpdated, (now, {"results": {incremental, records}={}}) =>
        records
        ? incremental
            ? [...now, ...records]
            : records
        : now,
);

// update the query for this panel.
// watch for anything with this searchid in it
Events.send(recordsWrite, [{
    fields: {
        ...self.fields,
        queryset: {
            ...queryset,
            "results": {
                basis_criteria: {
                    where: {
                        match: [{compare: "like", value: "%"}],
                        searchid: [{compare: "=", value: searchid.current}],
                    },
                },
            },
        },
    },
}])

const searchChange = Events.receiver()
const search = Behaviors.keep(searchChange);

// each thing that has the searchid in it should get included as a result
render(
    h('div', {
        style: `
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 1em;
        max-width: calc(100cqi - 2em);
        margin: auto;
        padding: 1em;
        `,
    }, [
        h('input', {
            type: 'text',
            ref: (dom) => {
                if (!dom) {
                    return
                }
                dom.value = search
            },
            onkeydown: (evt) => {
                if (evt.key === "Enter") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    Events.send(searchChange, evt.target.value);
                }
                if (evt.key === "Escape") {
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.target.value = search
                }
            },
        }),
        h('hr'),
        h('div', {}, results.map(result => h('pre', {style: `text-wrap: auto;`}, JSON.stringify(result)))),
    ]),
    document.body,
)

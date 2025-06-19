// an echo component
Events.send(ready, true);

const activeSearchesRecords = Events.observe(notify => recordsSubscribe(notify, {
    // HACK... this causes us to only see results that our surface has written.
    // it would be better to properly handle records we haven't processed yet but skip ones we have.
    queryset: {
        records: {
            self: true,
            basis_criteria: {
                where: {
                    type: [{compare: "=", value: "search"}],
                    search: [{compare: "is not", value: null}],
                    searchid: [{compare: "is not", value: null}],
                },
            },
        },
    },
}));

const searchUpdates = Events.collect(
    undefined,
    activeSearchesRecords, (now, {records: {records, incremental}={}}) => {
        if (!records) {
            return undefined
        }
        return Object.fromEntries(records.map(record => [record.fields.searchid, {search: record.fields.search, record}]))
    },
)

const resultsUpdates = Events.receiver({queued: true})

const recordsQueryForSearch = search => ({
    records: {
        view_criteria: {
            where: {
                // avoid a loop
                "type": [{compare: "is not", value: "match"}],
                "": [{compare: "like", value: `%${search}%`}],
            },
            limit: 10,
        },
    }
})

console.log('in demo-search-like searchUpdates', {searchUpdates})
const pendingSearches = Behaviors.collect(
    undefined,
    searchUpdates, (now, searchUpdates) => {
        const next = {...now}
        for (const [searchid, {search}] of Object.entries(searchUpdates)) {
            const existing = next[searchid]
            if (existing) {
                existing()
            }
            next[searchid] = recordsSubscribe(
                data => Events.send(resultsUpdates, {[searchid]: data}),
                {queryset: recordsQueryForSearch(search)},
            )
        }
        return next
    },
);

((resultsUpdates) => {
    console.log('in demo-search-like results updates', {resultsUpdates})
})(resultsUpdates);


((resultsUpdateses) => {
    const writes = resultsUpdateses.flatMap(resultsUpdates => Object.entries(resultsUpdates).map(([searchid, {records}]) => ({
        fields: {
            type: "match",
            searchid,
            records,
        }})))
    console.log('in demo-search-like results', {writes})
    Events.send(recordsWrite, writes)
})(resultsUpdates);

// todo query for a msgindex in the same surface
// todo resolve embedding from that msgindex
// todo write manifold

// let m = await r['events:write'].run({
//     events: [
//         {
//             conflict_keys: ["type", "dimensions", "dtype", "metric", "model"],
//             fields: {type: "vector_manifold", dimensions: 1024, dtype: "float", metric: "l2", model: "mxbai-embed-large-v1"}
//         }
//     ]
// });

// todo query for anything with a path
// if it has data, fetch that data and embed it (sendmsg with 'mxbai-embed-large-v1/embedding' content: ${text})
// write that embedding as a vector in a record

// when there is a search embed it (sendmsg with 'mxbai-embed-large-v1/embedding' content: ${text})
// query records for that search
// write the results with the proper searchid

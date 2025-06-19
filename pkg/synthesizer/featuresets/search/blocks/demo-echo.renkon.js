// an echo component
Events.send(ready, true);

const activeSearches = Events.observe(notify => recordsSubscribe(notify, {
    // HACK... this causes us to only see results that our surface has written.
    // it would be better to properly handle records we haven't processed yet but skip ones we have.
    queryset: {
        records: {
            self: true,
            basis_criteria: {
                where: {
                    search: [{compare: "like", value: "%"}],
                    searchid: [{compare: "like", value: "%"}],
                },
            },
        },
    },
}));

console.log('demo-echo', {activeSearches});
// write back an echo result

(({records: {records}={}}) => {
    if (!records) {
        return
    }
    const writes = records.map(({id, fields: {searchid, search}}) => ({fields: {searchid, match: id, matchText: search}}))
    console.log('demo-echo activeSearches', {writes})
    Events.send(recordsWrite, writes)
})(activeSearches);

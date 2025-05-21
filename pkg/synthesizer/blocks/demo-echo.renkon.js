// an echo component
Events.send(ready, true);

const recordsSubscribe = (notify, props) => {
    console.log("recordsSubscribe", {props})
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data}) => {
        notify(data)
    }
    const ns = [`recordsubscribe-hack-${Date.now()}`] // this approach to ns is a hack :(
    Events.send(recordsQuery, {
        ns,
        port: ch.port1,
        stream: true,
        ...props,
        [Renkon.app.transferSymbol]: [ch.port1],
    })
    return () => Events.send(close, {ns})
}

const echoResults = Events.observe(notify => recordsSubscribe(notify, {
    global: true,
    // HACK... this causes us to only see results that our surface has written.
    // it would be better to properly handle records we haven't processed yet but skip ones we have.
    self: true,
    queryset: {records: {basis_criteria: {where: {search: [{compare: "like", value: "%"}]}}}}
}));

console.log({echoResults});
// write back an echo result

(({records: {records}={}}) => {
    if (!records) {
        return
    }
    const writes = records.map(({id, fields: {searchid, search}}) => ({fields: {searchid, match: id, matchText: search}}))
    console.log('echoResults', {writes})
    Events.send(recordsWrite, writes)
})(echoResults);

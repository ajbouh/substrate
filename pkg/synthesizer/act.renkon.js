const act = (() => {
    const pick = (o, ...keys) => {
        const v = {}
        for (const k of keys) {
            v[k] = o[k]
        }
        return v
    }

    return ({verb, key, records, event, panel, parameters, dat}) => {
        const write = {
            fields: {
                type: "action/cue",
                // records: [record],
                query: recordsToQuery(records),
                dat: {
                    event: event ? pick(event, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button") : undefined,
                    ...dat,
                },
                verb,
                key,
                panel,
                parameters,
            },
        }
        Events.send(recordsWrite, [write])
    }
})();

const assets = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {assets: {incremental, records}={}}) => {
        if (!records) {
            return now
        }
        const next = {...now}
        for (const record of records) {
            next[record.fields.name] = record.data_url
        }
        return next
    },
);

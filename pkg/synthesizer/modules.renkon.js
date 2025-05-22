const moduleImports = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {modules: {incremental, records}={}}) => {
        if (!records) {
            return now
        }
        const next = {...now}
        for (const record of records) {
            next[record.fields.module || record.fields.name] = import(record.data_url)
        }
        return next
    },
);
const modules = Behaviors.resolvePart(moduleImports);

const recordsToQuery = (() => {
    const recordsAllHavePath = (records) => records.every(record => record.fields.path)
    return (records) => records?.length
        ? recordsAllHavePath(records)
            ? {
                view: "group-by-path-max-id",
                basis_criteria: {
                    where: {
                        path: [{compare: "in", value: records.map(record => record.fields.path)}]
                    },
                }
            }
            : {
                global: true,
                basis_criteria: {
                    where: {
                        id: [{compare: "in", value: records.map(record => record.id)}],
                    },
                },
            }
        : undefined;
})();

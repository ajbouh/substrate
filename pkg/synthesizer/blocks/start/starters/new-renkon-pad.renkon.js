const renkonPadStarter = {
    label: 'new renkon pad',
    start: ({genpath, path=`${genpath()}.renkon`}={}) => ({
        block: 'renkon pad',
        queryset: {records: {view: "group-by-path-max-id", basis_criteria: {where: {path: [{compare: "=", value: path}]}}}},
        write: [{fields: {path}}],
    }),
}

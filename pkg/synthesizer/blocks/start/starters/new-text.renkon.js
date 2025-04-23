const textStarter = {
    label: 'new text file',
    start: ({genpath, path=`${genpath()}.txt`}={}) => ({
        block: 'text editor',
        queryset: {records: {view: "group-by-path-max-id", basis_criteria: {where: {path: [{compare: "=", value: path}]}}}},
        write: [{fields: {path, type: "text/plain"}, data: `sample data for ${path}`}],
    }),
}

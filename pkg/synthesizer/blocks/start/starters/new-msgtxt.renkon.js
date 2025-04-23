const msgtxtStarter = {
    label: 'new msgtxt file',
    start: ({genpath, path=`${genpath()}.msgtxt`}={}) => ({
        block: 'text editor',
        queryset: {records: {view: "group-by-path-max-id", basis_criteria: {where: {path: [{compare: "=", value: path}]}}}},
        write: [{fields: {path, type: "text/plain"}, data: ``}],
    }),
}

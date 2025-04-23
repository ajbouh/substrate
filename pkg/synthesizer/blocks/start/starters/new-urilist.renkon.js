const urilistStarter = {
    label: 'new uri-list file',
    start: ({genpath, path=`${genpath()}.uri`}={}) => ({
        block: 'text editor',
        queryset: {records: {view: "group-by-path-max-id", basis_criteria: {where: {path: [{compare: "=", value: path}]}}}},
        write: [{fields: {path, type: "text/uri-list"}, data: `https://substratehost.local/substrate/v1/msgindex`}],
    }),
}

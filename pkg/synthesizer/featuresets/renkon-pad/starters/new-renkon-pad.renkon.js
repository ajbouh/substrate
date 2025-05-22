const renkonPadStarter = {
    label: 'new renkon pad',
    start: ({genpath, path=`${genpath()}.renkon`}={}) => ({
        verb: 'edit',
        write: [{fields: {path}}],
    }),
}

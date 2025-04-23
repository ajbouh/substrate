const deleteAction = (() => {
    const deleteRecord = record => {
        if (!record.fields?.path) {
            return
        }
        Events.send(recordsWrite, [{fields: {path: record.fields?.path, deleted: true}}])
    }
    
    return {
        label: '[x]',
        criteria: {
            path: [{compare: "like", value: '/%'}]
        },
        act: ({record, event}) => {
            deleteRecord(record)
            return false
        },
    }
})()

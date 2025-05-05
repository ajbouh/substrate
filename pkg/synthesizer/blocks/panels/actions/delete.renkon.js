const deleteAction = (() => {
    const deleteRecords = records => {
        const deletes = records
            .filter(record => record.fields?.path)
            .map(record => ({fields: {path: record.fields?.path, deleted: true}}));
        if (deletes.length === 0) {
            return;
        }
        Events.send(recordsWrite, deletes);
    }
    
    return {
        verb: 'delete',
        criteria: {
            path: [{compare: "like", value: '/%'}]
        },
        act: ({records, event}) => {
            deleteRecords(records)
            return true
        },
    }
})()

const pathFacet = (() => {
    const openRecord = (record, newPanel) => {
        console.log("openRecord", record)
        Events.send(panelWrite, {
            target: newPanel ? 'blank' : 'self', // should we support named targets? if so how do we handle these "keywords"?
            panel: {
                blockForRecord: record,
                recordQuery: {
                    global: true,
                    view: "group-by-path-max-id",
                    basis_criteria: {where: {path: [{compare: "=", value: record.fields.path}]}},
                },
            }
        })
    }
    return {
        label: 'path',
        priority: 100,
        render: ({h, record}) => h('a', {
            href: '#',
            onclick: (evt) => {
                console.log(evt);
                openRecord(record, evt.metaKey);
                evt.preventDefault();
                return false;
            },
        }, record.fields.path)    ,
    }
})()

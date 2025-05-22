const pathFacet = (() => {
    const pick = (o, ...keys) => {
        const v = {}
        for (const k of keys) {
            v[k] = o[k]
        }
        return v
    }

    const openRecord = (record, event) => {
        console.log("openRecord", record)
        Events.send(recordsWrite, [{
            fields: {
                type: "action/cue",
                // records: [record],
                query: {
                    global: true,
                    view: "group-by-path-max-id",
                    basis_criteria: {where: {path: [{compare: "=", value: record.fields.path}]}},
                },
                verb: 'view',
                dat: {
                    event: pick(event, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button"),
                },
            },
        }])
    }
    return {
        label: 'Path',
        priority: 100,
        align: 'left',
        render: ({h, record}) => h('a', {
            href: '#',
            onclick: (evt) => {
                console.log(evt);
                openRecord(record, evt);
                evt.preventDefault();
                return false;
            },
        }, record.fields.path),
    }
})()

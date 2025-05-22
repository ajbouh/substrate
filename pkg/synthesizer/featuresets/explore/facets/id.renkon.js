const idFacet = {
    label: 'ID',
    filterable: (record) => ({id: [{compare: "=", value: record.id}]}),
    render: ({record}) => record.id
}

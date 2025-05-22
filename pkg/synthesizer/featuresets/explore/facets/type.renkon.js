const typeFacet = {
    label: 'Type',
    filterable: (record) => ({type: [{compare: "=", value: record.fields.type}]}),
    render: ({record}) => record.fields.type
}

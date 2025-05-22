const surfaceFacet = {
    label: 'Surface',
    filterable: (record) => ({surface: [{compare: "=", value: record.fields.surface}]}),
    render: ({record}) => record.fields.surface
}

const featuresetFacet = {
    label: 'Featureset',
    filterable: (record) => ({featureset: [{compare: "=", value: record.fields.featureset}]}),
    render: ({record}) => record.fields.featureset
}

export function component() {

    const fetchText = url => url ? fetch(url).then(response => response.text()) : Promise.resolve('')

    const offers = [
        {
            verb: 'reflect',
            criteria: {
                type: [{compare: "=", value: 'text/uri-list'}]
                // how to check if the record has data?
                // && record.data_url
            },
            act: ({msg, records, event}) => {
                const record = records?.[0]
                return fetchText(record.data_url).then(data => {
                    const uri = data.split('\n').find(line => !line.startsWith('#'))
                    return msg.reflect(uri).then((msgindex) => {
                        return [{
                            fields: {
                                type: 'msgindex',
                                path: record?.fields?.path.replace(/(\.uri)?$/, '.msgindex'),
                                msgindex,
                            }
                        }]
                    })
                })
            },
        },
    ]

    return {
        offers,
    }
}

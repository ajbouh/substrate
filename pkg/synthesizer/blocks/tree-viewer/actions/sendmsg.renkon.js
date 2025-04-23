const sendmsgAction = (() => {
    const fetchText = url => url ? fetch(url).then(response => response.text()) : Promise.resolve('')

    return {
        label: 'sendmsg',
        criteria: {
            path: [{compare: "like", value: '%.msgtxt'}]
            // how to check if the record has data?
            // && record.data_url
        },
        act: ({record, msgtxtParser, sender, event}) => {
            fetchText(record.data_url).then(data => {
                console.log({data})
                const {target, command, description, parameters} = msgtxtParser.parse(data)({})
                const sendmsg = sender()
                sendmsg({
                    cap: 'reflectedmsg',
                    description,
                    url: target,
                    name: command,
                }, {parameters}).then(result => {
                    Events.send(recordsWrite, [{
                        fields: {
                            type: 'msgreceipt',
                            path: record?.fields?.path.replace(/(\.msgtxt)?$/, '.msgreceipt'),
                            result,
                        }
                    }])
                })
            })
            return false
        },
    }
})()

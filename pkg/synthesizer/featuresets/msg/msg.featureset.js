const description = `Support for developing new featuresets`

const recordTypeLike = pattern => ({type: [{compare: "like", value: pattern}]})
const recordPathLike = pattern => ({path: [{compare: "like", value: pattern}]})
const anything = ({})

const raise = err => { throw err }
const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

async function records({path}) {
    return [
            ...[
            {
                self: ['path'],
                type: 'plumbing',
                verb: 'view',
                criteria: recordPathLike("%.msgindex"),
                block: 'msgindex viewer',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-msgindex`,
            },

            {
                self: ['type', 'block'],
                type: 'block',
                block: 'msgindex viewer',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/msgindex-viewer`,
                queryset: {
                    records: {
                        view_criteria: {where: {type: [{compare: "=", value: "msgindex"}]}},
                    },
                },
                scripts: [
                    await fetchText('./blocks/msgindex-viewer.renkon.js'),
                    await fetchText('../../block.renkon.js'),
                    await fetchText('../../records-query-merge.js'),
                    await fetchText('../../records-updated.renkon.js'),
                ],
            },
        ].map(fields => ({fields})),
        {
            fields: {
                type: 'text/javascript',
                name: 'records-matcher.js',
                path: `/blocks/msgindex-viewer/modules/records-matcher.js`,
            },
            data: await fetchText(`../../records-matcher.js`),
        },
        ...await Promise.all([
            'start-new-msgtxt',
            'start-new-uri-list',
        ].map(async name => ({
            fields: {
                self: ['type', 'action'],
                type: 'action',
                action: name,
                schema: {'data': {format: 'text/javascript'}},
                path: `/actions/${name}`,
            },
            data: await fetchText(`./actions/${name}.renkon.js`),
        }))),
    ]
}

export const featureset = {
    title: 'msg featureset',
    name: 'msg',
    description,
    records,
    url: import.meta.url,
}

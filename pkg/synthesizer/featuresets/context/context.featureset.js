const description = `Support for gathering records together based on criteria`

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
                fields: {
                    type: 'plumbing',
                    verb: 'open',
                    criteria: recordTypeLike("context"),
                    block: 'context',
                    querykey: 'records',
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/plumbing/open-context`,
                },
            },

            {
                fields: {
                    type: 'block',
                    block: 'context',
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/blocks/context`,
                    surface: path,
                    scripts: [
                        await fetchText('./blocks/context.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                    ],
                    queryset: {
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            basis_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/context/modules/%`}],
                                },
                            },
                        },
                    },
                },
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'preact',
                    path: `/blocks/context/modules/preact.js`,
                },
                data: await fetchText(`../../preact.standalone.module.js`),
            },
        ],
        ...await Promise.all([
            'start-new-context',
        ].map(async name => ({
            fields: {
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
    title: 'context featureset',
    description,
    records,
    url: import.meta.url,
}

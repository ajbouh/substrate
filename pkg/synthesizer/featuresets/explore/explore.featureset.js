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
                verb: 'inspect',
                criteria: anything,
                block: 'record inspector',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/inspect-record`,
            },
        ].map(fields => ({fields})),
        ...await Promise.all([
            "block",
            "copy",
            "delete",
            "redo",
            "reflect",
            "sendmsg",
            "plumbing",
            // "selection",
            'start-explorer',
            // "selection",
        ].map(async action => ({
                fields: {
                    self: ['type', 'action'],
                    type: 'action',
                    schema: {'data': {format: 'text/javascript'}},
                    action,
                    path: `/actions/${action}`,
                },
                data: await fetchText(`./actions/${action}.renkon.js`),
            }))),
        ...[
            {
                fields: {
                    self: ['type', 'block'],
                    type: 'block',
                    block: 'record inspector',
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/blocks/record-inspector`,
                    queryset: {
                        offers: {
                            view_criteria: {
                                where: {type: [{compare: "=", value: "action/offers"}]},
                            },
                        },
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/record-inspector/modules/%`}],
                                },
                            },
                        },
                    },
                    scripts: [
                        await fetchText('./blocks/record-inspector.renkon.js'),
                        await fetchText('../../verbs.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                    ]
                },
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'inspect',
                    path: `/blocks/record-inspector/modules/inspect.js`,
                },
                data: await fetchText(`./inspect.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'inspector',
                    path: `/blocks/record-inspector/modules/inspector.js`,
                },
                data: await fetchText(`./inspector.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'preact',
                    path: `/blocks/record-inspector/modules/preact.js`,
                },
                data: await fetchText(`../../preact.standalone.module.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'recordsMatcher',
                    path: `/blocks/record-inspector/modules/records-matcher.js`,
                },
                data: await fetchText(`../../records-matcher.js`),
            },

            {
                fields: {
                    self: ['type', 'block'],
                    type: 'block',
                    block: 'explorer',
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/blocks/explorer`,
                    queryset: {
                        records: {},
                        offers: {
                            view_criteria: {
                                where: {type: [{compare: "=", value: "action/offers"}]},
                            },
                        },
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/explorer/modules/%`}],
                                },
                            },
                        },
                        "scripts/facets": {
                            view_criteria: {
                                where: {
                                    type: [{compare: "=", value: "facet"}],
                                },
                            },
                            view: "group-by-path-max-id",
                        }
                    },
                    scripts: [
                        await fetchText('./blocks/explorer.renkon.js'),
                        await fetchText('../../verbs.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                    ],
                },
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'preact',
                    path: `/blocks/explorer/modules/preact.js`,
                },
                data: await fetchText(`../../preact.standalone.module.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'ulid',
                    path: `/blocks/explorer/modules/ulid.js`,
                },
                data: await fetchText(`../../ulid.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'recordsMatcher',
                    path: `/blocks/explorer/modules/records-matcher.js`,
                },
                data: await fetchText(`../../records-matcher.js`),
            },
        ],
        ...await Promise.all([
            'age',
            'id',
            'fingerprint',
            'path',
            'size',
            'surface',
            'featureset',
            'type',
        ].map(async name => ({
            fields: {
                self: ['type', 'facet'],
                type: 'facet',
                facet: name,
                schema: {'data': {format: 'text/renkon'}},
                path: `/facets/${name}`,
            },
            data: await fetchText(`./facets/${name}.renkon.js`),
        }))),
    // todo move this "surface injection" to the install-side
     ].map(write => ({...write, fields: {...write?.fields, surface: path}}))
}

export const featureset = {
    title: 'explore featureset',
    name: 'explore',
    description,
    records,
    url: import.meta.url,
}

const description = `System-level functionality to start surfaces and panels.`

const raise = err => { throw err }
const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

async function records({path}) {
    return [
        ...[
            {
                fields: {
                    type: 'layout/model',
                    path: `${path}/layout-model`,
                    direction: "row",
                    panels: [],
                },
                conflict_keys: ["type", "path", "surface"],
            },
            {
                fields: {
                    type: 'block',
                    block: path,
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path,
                    queryset: {
                        self: {
                            global: true,
                            view_criteria: {
                                where: {path: path ? [{compare: "=", value: path}] : []},
                            },
                            view: "group-by-path-max-id",
                        },
                        layout: {
                            global: true,
                            view_criteria: {
                                where: {type: [{compare: "=", value: "layout/model"}]},
                            },
                            view: "group-by-path-max-id",
                            bias: 1,
                        },
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/surface/modules/%`}],
                                },
                            },
                        },
                    },
                    scripts: [
                        await fetchText('./blocks/surface.renkon.js'),
                        await fetchText('./actions.renkon.js'),
                        await fetchText('./panels.renkon.js'),
                        await fetchText('./workers.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                        await fetchText('../../components.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                    ],
                },
            },
            {
                fields: {
                    type: 'layout/component',
                    schema: {'data': {format: 'text/javascript'}},
                    path: `/layout.renkon.component.js`,
                },
                data: await fetchText(`./layout.renkon.component.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'blockComponent',
                    path: `/blocks/surface/modules/block.renkon.component.js`,
                },
                data: await fetchText(`../../block.renkon.component.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'workerComponent',
                    path: `/blocks/surface/modules/worker.renkon.component.js`,
                },
                data: await fetchText(`../../worker.renkon.component.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'preact',
                    path: `/blocks/surface/modules/preact.js`,
                },
                data: await fetchText(`../../preact.standalone.module.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'recordsMatcher',
                    path: `/blocks/surface/modules/records-matcher.js`,
                },
                data: await fetchText(`../../records-matcher.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'msg',
                    path: `/blocks/surface/modules/msg.js`,
                },
                data: await fetchText(`../../msg.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'msgtxt',
                    path: `/blocks/surface/modules/msgtxt.js`,
                },
                data: await fetchText(`../../msgtxt.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'ohm',
                    path: `/blocks/surface/modules/ohm.js`,
                },
                data: await fetchText(`../../ohm.js`),
            },

            {
                fields: {
                    type: 'block',
                    block: 'start',
                    // self: ['type', 'block', 'surface'],
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/blocks/start`,
                    queryset: {
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/start/modules/%`}],
                                },
                            },
                        },
                        offers: {
                            view_criteria: {
                                where: {type: [{compare: "=", value: "action/offers"}]},
                            },
                        },
                    },
                    scripts: [
                        await fetchText('./blocks/start.renkon.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                        await fetchText('../../verbs.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                    ],
                },
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'preact',
                    path: `/blocks/start/modules/preact.js`,
                },
                data: await fetchText(`../../preact.standalone.module.js`),
            },

            {
                fields: {
                    type: 'block',
                    block: 'featuresets',
                    path: `/blocks/featuresets`,
                    queryset: {
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/featuresets/modules/%`}],
                                },
                            },
                        },
                    },
                    scripts: [
                        await fetchText('./blocks/featuresets.renkon.js'),
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
                    path: `/blocks/featuresets/modules/preact.js`,
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
        ],
        ...await Promise.all([
            'worker-actions',
            'surface-actions',
            'panel-actions',
            'start-install-featuresets',
            'start-new-surface',
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
    title: 'surface featureset',
    name: 'surface',
    description,
    records,
    url: import.meta.url,
}

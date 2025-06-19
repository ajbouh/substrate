const description = `Support for working with text`

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
                criteria: recordTypeLike("text/%"),
                block: 'text editor',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-text`,
            },
            {
                self: ['path'],
                type: 'plumbing',
                verb: 'edit',
                criteria: recordTypeLike("text/%"),
                block: 'text editor',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/edit-text`,
            },
            {
                self: ['path'],
                type: 'plumbing',
                verb: 'view',
                criteria: {
                    'schema.data.format': [{compare: "like", value: "text/%"}],
                },
                block: 'text editor',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-text-data`,
            },
            {
                self: ['path'],
                type: 'plumbing',
                verb: 'edit',
                criteria: {
                    'schema.data.format': [{compare: "like", value: "text/%"}],
                },
                block: 'text editor',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/edit-text-data`,
            },
            {
                self: ['path'],
                type: 'plumbing',
                verb: 'view',
                criteria: recordTypeLike("text/markdown"),
                block: 'markdown viewer',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-markdown`,
                weight: 2,
            },
            {
                self: ['path'],
                type: 'plumbing',
                verb: 'view',
                criteria: {
                    'schema.data.format': [{compare: "like", value: "text/markdown"}],
                },
                block: 'markdown viewer',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-markdown-data`,
                weight: 2,
            },
        ].map(fields => ({fields})),
        ...[
            {
                fields: {
                    self: ['type', 'block'],
                    type: 'block',
                    block: 'text editor',
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/blocks/text-editor`,
                    queryset: {
                        records: {
                            view: "group-by-path-max-id",
                            view_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
                        },
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/text-editor/modules/%`}],
                                },
                            },
                        },
                        "components/extensions": {
                            view: "group-by-path-max-id",
                            view_criteria: {where: {type: [{compare: "=", value: "component/text-editor-extension"}]}},
                        },
                    },
                    scripts: [
                        await fetchText('./blocks/text-editor.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                        await fetchText('../../components.renkon.js'),
                    ],
                },
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'codemirror',
                    path: `/blocks/text-editor/modules/codemirror.js`,
                },
                data: await fetchText(`./codemirror/codemirror.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'recordsMatcher',
                    path: `/blocks/text-editor/modules/records-matcher.js`,
                },
                data: await fetchText(`../../records-matcher.js`),
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
                    self: ['type', 'block'],
                    type: 'block',
                    block: 'markdown viewer',
                    // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                    path: `/blocks/markdown-viewer`,
                    queryset: {
                        records: {
                            view: "group-by-path-max-id",
                            view_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
                        },
                        modules: {
                            phase: "pre-ready",
                            view: "group-by-path-max-id",
                            view_criteria: {
                                where: {
                                    path: [{compare: "like", value: `/blocks/markdown-viewer/modules/%`}],
                                },
                            },
                        },
                    },
                    scripts: [
                        await fetchText('./blocks/markdown-viewer.renkon.js'),
                        await fetchText('../../block.renkon.js'),
                        await fetchText('../../records-query-merge.js'),
                        await fetchText('../../records-updated.renkon.js'),
                        await fetchText('../../modules.renkon.js'),
                        await fetchText('../../components.renkon.js'),
                    ],
                },
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'markdownIt',
                    path: `/blocks/markdown-viewer/modules/markdown-it.js`,
                },
                data: await fetchText(`./markdown-it.min.js`),
            },
            {
                fields: {
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'preact',
                    path: `/blocks/markdown-viewer/modules/preact.js`,
                },
                data: await fetchText(`../../preact.standalone.module.js`),
            },
        ],
        ...await Promise.all([
            'save',
            'javascript',
            'emit',
        ].map(async name => ({
            fields: {
                type: 'component/text-editor-extension',
                extension: name,
                schema: {'data': {format: 'text/javascript'}},
                path: `/extensions/${name}`,
            },
            data: await fetchText(`./extensions/${name}.renkon.js`),
        }))),
        ...await Promise.all([
            'start-new-action',
            'start-new-text',
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

        ...await Promise.all([
            'renkon.md',
        ].map(async name => ({
            fields: {
                self: ['path'],
                type: 'documentation',
                action: name,
                schema: {'data': {format: 'text/markdown'}},
                path: `/docs/${name}`,
            },
            data: await fetchText(`./docs/${name}`),
        }))),
    ]
}

export const featureset = {
    title: 'text featureset',
    name: 'text',
    description,
    records,
    url: import.meta.url,
}

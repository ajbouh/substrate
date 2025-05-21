

const recordTypeLike = pattern => ({type: [{compare: "like", value: pattern}]})
const recordPathLike = pattern => ({path: [{compare: "like", value: pattern}]})
const anything = ({})

export const plumbing = [
    {verb: 'view', criteria: recordTypeLike("image/%"), block: 'media viewer', querykey: 'records'},
    {verb: 'view', criteria: recordTypeLike("video/%"), block: 'media viewer', querykey: 'records'},
    {verb: 'view', criteria: recordTypeLike("audio/%"), block: 'media viewer', querykey: 'records'},
    {verb: 'view', criteria: recordTypeLike("application/pdf"), block: 'pdf viewer', querykey: 'records'},
    {verb: 'view', criteria: recordTypeLike("text/%"), block: 'text editor', querykey: 'records'},
    {verb: 'edit', criteria: recordTypeLike("text/%"), block: 'text editor', querykey: 'records'},
    {verb: 'view', criteria: recordPathLike("%.renkon"), block: 'renkon pad runner', querykey: 'records'},
    {verb: 'view', criteria: recordPathLike("%.msgindex"), block: 'msgindex viewer', querykey: 'records'},
    {verb: 'view', criteria: recordPathLike("%.surface"), block: 'surface', querykey: 'surface'},
    {verb: 'view', criteria: anything, block: 'record inspector', querykey: 'records'},
]

const fetchText = url => fetch(url).then(response => response.text())
    
export const recordsUpdatedScripts = [
`
const queryset = Behaviors.keep(querysetUpdated)
const recordsUpdated = Events.receiver()

const recordsQueryGeneration = +new Date()
const recordsUpdatedChannel = new window.MessageChannel()
const recordsUpdatedNS = ["records", recordsQueryGeneration]
const recordsUpdatedRecv = (() => {
    recordsUpdatedChannel.port2.onmessage = ({data: notification}) => {
        Events.send(recordsUpdated, notification)
    }
})();
const recordsUpdatedRegister = Behaviors.collect(
    undefined,
    querysetUpdated, (now, queryset) => {
        const request = {
            ns: recordsUpdatedNS,
            queryset,
            stream: true,
        }

        if (!now) {
            request.port = recordsUpdatedChannel.port1
            request[Renkon.app.transferSymbol] = [recordsUpdatedChannel.port1]
        }
        Events.send(recordsQuery, request)
        return true
    })
    `,
]

export const mergeBlockScripts = (block, ...scriptses) => {
    const scripts = []
    if (block?.scripts) {
        scripts.push(...block.scripts)
    }
    const baseURI = block?.baseURI
    for (const s of scriptses) {
        scripts.push(...s)
    }

    return {scripts, baseURI}
}

// this is repeated in new-surface.renkon.js
const surfaceQuery = (path) => ({
    global: true,
    basis_criteria: {
        where: {path: path ? [{compare: "=", value: path}] : []},
    },
    view_criteria: {
        where: {type: [{compare: "=", value: "surface"}]},
    },
    view: "group-by-path-max-id",
})

export const fetchSurfaceBlock = async () => ({
    fields: {queryset: {surface: surfaceQuery()}},
    scripts: [await fetchText(new URL('./blocks/surface.renkon.js', import.meta.url).toString())],
})

export const surfaceBlockBootstrap = async () => {
    const sb = await fetchSurfaceBlock()
    return mergeBlockScripts(
        sb,
        recordsUpdatedScripts,
        [
            await fetchText(new URL('./blocks/bootstrap-surface.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/bootstrap-recordstore-remote.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/bootstrap-recordstore-address.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/new-surface.renkon.js', import.meta.url).toString()),
        ],
    )
}

export const fetchPanelsBlock = async () => ({
    fields: {queryset: {
        panels: {
            view_criteria: {
                where: {type: [{compare: "=", value: "panel"}]},
            },
            view: "group-by-path-max-id",
        },
        cues: {
            view_criteria: {
                where: {type: [{compare: "=", value: "action/cue"}]},
            },
        },
        offers: {
            view_criteria: {
                where: {type: [{compare: "=", value: "action/offers"}]},
            },
        },
    }},
    scripts: [
        await fetchText(new URL('./blocks/panels.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/panels/actions.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/panels/actions/redo.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/panels/actions/sendmsg.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/panels/actions/delete.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/panels/actions/reflect.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/panels/actions/plumbing.renkon.js', import.meta.url).toString()),
    ],
});

const fetchTreeViewerBlock = async () => ({
    fields: {
        queryset: {
            records: {
                view: "group-by-path-max-id",
                basis_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
            },
            offers: {
                view_criteria: {
                    where: {type: [{compare: "=", value: "action/offers"}]},
                },
            },
        },
    },
    scripts: [
        await fetchText(new URL('./blocks/tree-viewer.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/tree-viewer/facets/age.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/tree-viewer/facets/path.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/tree-viewer/facets/size.renkon.js', import.meta.url).toString()),
        await fetchText(new URL('./blocks/tree-viewer/facets/type.renkon.js', import.meta.url).toString()),
    ],
})

export const blocks = async () => ({
    'record browser': {
        fields: {queryset: {records: {global: true, view_criteria: {limit: 10}}}},
        scripts: [await fetchText(new URL('./blocks/record-browser.renkon.js', import.meta.url).toString())],
    },
    'surface': await fetchSurfaceBlock(),
    'panels': await fetchPanelsBlock(),
    'start': {
        fields: {queryset: null},
        scripts: [
            await fetchText(new URL('./blocks/start.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/browse-tree.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/new-msgtxt.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/new-renkon-pad.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/new-surface.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/search.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/new-text.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/start/starters/new-urilist.renkon.js', import.meta.url).toString()),
        ],
    },
    'record inspector (surface)': {
        scripts: [await fetchText(new URL('./blocks/record-inspector.renkon.js', import.meta.url).toString())],
    },
    'record inspector': {
        fields: {
            queryset: {
                records: {
                    global: true,
                },
            },
        },
        scripts: [await fetchText(new URL('./blocks/record-inspector.renkon.js', import.meta.url).toString())],
    },
    'bridge simple transcript': {
        fields: {queryset: {records: {
            global: true,
            view_criteria: {where: {type: [{compare: "=", value: "example"}]}},
        }}},
        scripts: [await fetchText(new URL('./blocks/bridge-simple-transcript.renkon.js', import.meta.url).toString())],
    },
    'transcript': {
        fields: {queryset: {records: {
            global: true,
            basis_criteria: {
                bias: -1,
                where: { path: [{ compare: "like", value: "/bridge-demo/%" }] }
            },
        }}},
        scripts: [await fetchText(new URL("./blocks/transcript.renkon.js", import.meta.url).toString())],
    },
    'msgindex viewer': {
        fields: {queryset: {records: {
            view_criteria: {where: {type: [{compare: "=", value: "msgindex"}]}},
        }}},
        scripts: [await fetchText(new URL('./blocks/msgindex-viewer.renkon.js', import.meta.url).toString())],
    },
    'renkon pad': {
        fields: {queryset: {records: {
            global: true,
            view_criteria: {where: {path: [{compare: "like", value: "%.renkon"}]}},
        }}},
        baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/renkon-pad-editor.renkon.js', import.meta.url).toString())],
    },
    'renkon pad runner': {
        baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/renkon-pad-runner.renkon.js', import.meta.url).toString())],
    },
    'media viewer': {
        scripts: [await fetchText(new URL('./blocks/media-viewer.renkon.js', import.meta.url).toString())],
    },
    'search': {
        scripts: [await fetchText(new URL('./blocks/search.renkon.js', import.meta.url).toString())],
    },
    'demo-echo': {
        scripts: [await fetchText(new URL('./blocks/demo-echo.renkon.js', import.meta.url).toString())],
    },
    'pdf viewer': {
        baseURI: new URL('./blocks/pdfjs/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/pdf-viewer.renkon.js', import.meta.url).toString())],
    },
    'tree viewer': await fetchTreeViewerBlock(),
    // todo tree house????
    // 'renkon-pad': {
    //     // todo actually implement
    //     scripts: [await fetchText(new URL('./blocks/renkon-pad.renkon.js', import.meta.url).toString())],
    // },
    // 'field editor': {
    //     scripts: [await fetchText(new URL('./blocks/field-editor.renkon.js', import.meta.url).toString())],
    // },
    'text editor': {
        fields: {
            queryset: {
                records: {
                    view: "group-by-path-max-id",
                    basis_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
                },
            },
        },
        scripts: [
            await fetchText(new URL('./blocks/text-editor.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/text-editor/commands/save.renkon.js', import.meta.url).toString()),
            await fetchText(new URL('./blocks/text-editor/commands/emit.renkon.js', import.meta.url).toString()),
        ],
    },
})

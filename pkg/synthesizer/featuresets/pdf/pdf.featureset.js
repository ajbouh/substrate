const description = `Support for viewing PDF files`

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
                type: 'plumbing',
                verb: 'view',
                criteria: recordTypeLike("application/pdf"),
                block: 'pdf viewer',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-pdf`,
                surface: path,
            },

            {
                type: 'block',
                block: 'pdf viewer',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/pdf-viewer`,
                surface: path,
                // baseURI: new URL('./pdfjs/', document.baseURI).toString(),
                scripts: [
                    await fetchText('./blocks/pdf-viewer.renkon.js'),
                    await fetchText('../../block.renkon.js'),
                    await fetchText('../../records-query-merge.js'),
                    await fetchText('../../records-updated.renkon.js'),
                    await fetchText('../../modules.renkon.js'),
                    await fetchText('../../assets.renkon.js'),
                ],
                queryset: {
                    assets: {
                        phase: "pre-ready",
                        view: "group-by-path-max-id",
                        view_criteria: {
                            where: {
                                path: [{compare: "like", value: `/blocks/pdf-viewer/assets/%`}],
                            },
                        },
                    },
                    modules: {
                        phase: "pre-ready",
                        view: "group-by-path-max-id",
                        view_criteria: {
                            where: {
                                path: [{compare: "like", value: `/blocks/pdf-viewer/modules/%`}],
                            },
                        },
                    },
                }
            },
        ].map(fields => ({fields})),
        {
            fields: {
                type: 'text/javascript',
                module: 'pdfjsLib',
                path: `/blocks/pdf-viewer/modules/pdf.min.mjs`,
            },
            data: await fetchText(`./pdfjs/pdf.min.mjs`),
        },
        {
            fields: {
                type: 'text/javascript',
                name: 'pdf.worker.min.mjs',
                path: `/blocks/pdf-viewer/assets/pdf.worker.min.mjs`,
            },
            data: await fetchText(`./pdfjs/pdf.worker.min.mjs`),
        },
    ]
}

export const featureset = {
    title: 'pdf featureset',
    name: 'pdf',
    description,
    records,
    url: import.meta.url,
}

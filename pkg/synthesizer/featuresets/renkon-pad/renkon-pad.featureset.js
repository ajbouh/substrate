const description = `Support for Renkon Pad and .renkon files`

const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.text())
const recordTypeLike = pattern => ({type: [{compare: "like", value: pattern}]})
const recordPathLike = pattern => ({path: [{compare: "like", value: pattern}]})
const anything = ({})

async function records({path}) {
    return [
        ...[
            {
                type: 'plumbing',
                verb: 'view',
                criteria: recordPathLike("%.renkon"),
                block: 'renkon pad runner',
                querykey: 'records',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/plumbing/view-renkon`,
            },


            {
                type: 'block',
                block: 'renkon pad',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/renkon-pad`,
                queryset: {
                    records: {
                        global: true,
                        view_criteria: {where: {path: [{compare: "like", value: "%.renkon"}]}},
                    },
                },
                baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
                scripts: [
                    await fetchText('./blocks/renkon-pad-editor.renkon.js'),
                ],
            },
            {
                type: 'block',
                block: 'renkon pad runner',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/renkon-pad-runner`,
                baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
                scripts: [
                    await fetchText('./blocks/renkon-pad-runner.renkon.js'),
                ],
            },
        ].map(fields => ({fields})),
        ...await Promise.all([
            'start-new-renkon-pad',
        ].map(async name => ({
            fields: {
                type: 'action',
                path: `/actions/${name}`,
                surface: path,
            },
            data: await fetchText(`./actions/${name}.renkon.js`),
        }))),
    ]
}

export const featureset = {
    title: 'renkon-pad featureset',
    description,
    records,
    url: import.meta.url,
}

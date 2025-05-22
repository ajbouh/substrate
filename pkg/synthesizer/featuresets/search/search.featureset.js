const description = `Demonstrate how search might work`

const raise = err => { throw err }
const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

async function records({path}) {
    return [
        ...[
            {
                type: 'block',
                block: 'search',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/search`,
                surface: path,
                scripts: [
                    await fetchText('./blocks/search.renkon.js'),
                    await fetchText('../../../block.renkon.js'),
                    await fetchText('../../../records-updated.renkon.js'),
                ],
            },
            {
                type: 'block',
                block: 'demo-echo',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/demo-echo`,
                surface: path,
                scripts: [
                    await fetchText('./blocks/demo-echo.renkon.js'),
                    await fetchText('../../../block.renkon.js'),
                    await fetchText('../../../records-updated.renkon.js'),
                ],
            },
            {
                type: 'block',
                block: 'demo-search-like',
                // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
                path: `/blocks/demo-search-like`,
                surface: path,
                scripts: [
                    await fetchText('./blocks/demo-search-like.renkon.js'),
                    await fetchText('../../../block.renkon.js'),
                    await fetchText('../../../records-updated.renkon.js'),
                ],
            },
        ].map(fields => ({fields})),
        ...await Promise.all([
            'start-search',
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
    title: 'search featureset',
    description,
    records,
    url: import.meta.url,
}

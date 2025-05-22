const description = `Demonstrate how a simple version of bridge might work`

const raise = err => { throw err }
const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

async function records({path}) {
    return [
        {
            block: 'bridge-simple-transcript',
            // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
            path: `/blocks/bridge simple transcript`,
            queryset: {
                records: {
                    global: true,
                    view_criteria: {where: {type: [{compare: "=", value: "example"}]}},
            }},
            scripts: [
                await fetchText('./blocks/bridge-simple-transcript.renkon.js'),
            ],
        },
    ].map(fields => ({fields}))
}

export const featureset = {
    title: 'bridge-simple featureset',
    description,
    records,
    url: import.meta.url,
}

const description = `Demonstrate how a more advanced version of bridge might work`

const raise = err => { throw err }
const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

export async function records({path}) {
    return [
        {
            block: 'transcript',
            // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
            path: `/blocks/transcript`,
            queryset: {
                records: {
                    global: true,
                    basis_criteria: {
                        bias: -1,
                        where: { path: [{ compare: "like", value: "/bridge-demo/%" }] }
                    },
                },
            },
            scripts: [
                await fetchText('./blocks/transcript.renkon.js'),
            ],
        },
    ].map(fields => ({fields}))
}

export const featureset = {
    title: 'bridge-advanced featureset',
    description,
    records,
    url: import.meta.url,
}

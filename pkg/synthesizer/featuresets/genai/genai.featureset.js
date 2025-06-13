const description = `Support for working with genai`

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
                    self: ['type', 'module'],
                    type: 'module',
                    schema: {'data': {format: 'text/javascript'}},
                    module: 'ax',
                    path: `/modules/ax.js`,
                    description: await fetchText(`./ax/README.md`),
                },
                data: await fetchText(`./ax/ax.js`),
            },
        ],
    ]
}

export const featureset = {
    title: 'genai featureset',
    name: 'genai',
    description,
    records,
    url: import.meta.url,
}

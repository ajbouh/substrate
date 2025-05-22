const description = `Support for viewing video, audio, and images`

const raise = err => { throw err }
const fetchText = url => fetch(new URL(url, import.meta.url).toString()).then(response => response.ok
    ? response.text()
    : raise(new Error(`response is not ok; status="${response.status} ${response.statusText}"`)))

const recordTypeLike = pattern => ({type: [{compare: "like", value: pattern}]})
const recordPathLike = pattern => ({path: [{compare: "like", value: pattern}]})
const anything = ({})

async function records({path}) {
    return [
        {
            type: 'block',
            block: 'media viewer',
            // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
            path: `/blocks/media-viewer`,
            surface: path,
            scripts: [
                await fetchText('./blocks/media-viewer.renkon.js'),
                await fetchText('../../block.renkon.js'),
                await fetchText('../../records-query-merge.js'),
                await fetchText('../../records-updated.renkon.js'),
            ],
        },

        {
            type: 'plumbing',
            verb: 'view',
            criteria: recordTypeLike("image/%"),
            block: 'media viewer',
            querykey: 'records',
            // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
            path: `/plumbing/view-image`,
            surface: path,
        },
        {
            type: 'plumbing',
            verb: 'view',
            criteria: recordTypeLike("video/%"),
            block: 'media viewer',
            querykey: 'records',
            // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
            path: `/plumbing/view-video`,
            surface: path,
        },
        {
            type: 'plumbing',
            verb: 'view',
            criteria: recordTypeLike("audio/%"),
            block: 'media viewer',
            querykey: 'records',
            // HACK we don't really want path, we're just using it because that's currently the only way to get "latest-by" semantics
            path: `/plumbing/view-audio`,
            surface: path,
        },
    ].map(fields => ({fields}))
}

export const featureset = {
    title: 'media featureset',
    name: 'media',
    description,
    records,
    url: import.meta.url,
}

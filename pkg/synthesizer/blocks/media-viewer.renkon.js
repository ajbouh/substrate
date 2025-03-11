// media-viewer

const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
});
const {h, html, render} = modules.preact

Events.send(ready, true);

const style = {
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100vh',
}
const viewerForRecord = record => {
    const type = record?.fields?.type
    if (type) {
        if (type.match(/^image/)) {
            return h('img', {src: record.data_url, style})
        }
        if (type.match(/^video/)) {
            return h('video', {controls: true, src: record.data_url, style})
        }
        if (type.match(/^audio/)) {
            return h('audio', {controls: true, src: record.data_url, style})
        }
        return h('pre', {}, ["record ", record.id, " has unknown record type: ", type])
    } else {
        return h('pre', {}, ["record ", record.id, " has has no type field: ", JSON.stringify(record)])
    }
}

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

render(
    h('div', {
        style: {
            display: 'grid',
            height: '100vh',
            placeItems: 'center',
        },
    }, records.map(r => viewerForRecord(r))),
    document.body,
)

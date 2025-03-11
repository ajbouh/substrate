// ---
// query: view: "group-by-path-max-id"
// ---
// tree-editor
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    inspect: import("../inspect.js"),
});
const {h, html, render} = modules.preact
const {makeInspectors} = modules.inspect

Events.send(ready, true);

const inspectors = makeInspectors({h, Renkon});

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const openRecord = (record, newPanel) => {
    console.log("openRecord", record)
    Events.send(panelWrite, {
        target: newPanel ? 'blank' : 'self', // should we support named targets? if so how do we handle these "keywords"?
        panel: {
            blockForType: record.fields.type,
            query: {
                view: "group-by-path-max-id",
                basis_criteria: {compare: {path: [{compare: "=", value: record.fields.path}]}},
            },
        }
    })
}

const formatSize = (bytes, decimals) => {
    if (bytes == 0) return '0 bytes'
    const k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
      i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
  
render(
    h('div', {},
        records.map(r =>
            h('div', {
                style: {
                    textWrap: 'nowrap',
                },
            }, [
                h('input', {type: 'checkbox'}),
                h('pre', {style: {display: 'inline'}}, [
                    h('a', {
                        href: '#',
                        onclick: (evt) => {
                            console.log(evt);
                            openRecord(r, evt.metaKey);
                            evt.preventDefault();
                            return false;
                        },
                     }, r.fields.path),
                    ' ', r.fields.type,
                    ' ', r.data_size !== undefined ? formatSize(r.data_size) : '',
                ]),
            ]))),
    document.body,
)

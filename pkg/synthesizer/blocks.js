
export const blockNameForRecord = (plumbing, record, verb) => {
    const candidates = plumbing.flatMap(
        (plumb) => ((!verb || plumb.verb === verb) && plumb.match && plumb.match(record))
            ? [{q: 1, ...plumb}]
            : []);
    candidates.sort((a, b) => a.q - b.q)
    return candidates[0]?.block
}

const matchRecordType = pattern => record => record?.fields?.type?.match(pattern)
const matchRecordPath = pattern => record => record?.fields?.path?.match(pattern)

export const plumbing = [
    {verb: 'view', match: matchRecordType(/^image/), block: 'media viewer'},
    {verb: 'view', match: matchRecordType(/^video/), block: 'media viewer'},
    {verb: 'view', match: matchRecordType(/^audio/), block: 'media viewer'},
    {verb: 'view', match: matchRecordType(/^application\/pdf$/), block: 'pdf viewer'},
    {verb: 'edit', match: matchRecordType(/^text/), block: 'text editor'},
    {verb: 'view', match: matchRecordPath(/\.renkon$/), block: 'renkon pad runner'},
]

function genchars(length) {
    let result = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    for ( let i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
}
  
function fmtdate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const genpath = (now) => `/${fmtdate(now ?? new Date())}-${genchars(7)}`

export const starts = [
    // {block: 'record browser', query: {view: "group-by-path-max-id"}},
    // {block: 'files import'},
    // {block: 'tree viewer'},
    {
        block: 'renkon pad',
        label: 'new renkon pad',
        start: ({path=`${genpath()}.renkon`}={}) => ({
            query: {view: "group-by-path-max-id", basis_criteria: {where: {path: [{compare: "=", value: path}]}}},
            records: [{fields: {path}}]
        }),
    },
    {
        block: 'text editor',
        label: 'new text file',
        start: ({path=`${genpath()}.txt`}={}) => ({
            query: {view: "group-by-path-max-id", basis_criteria: {where: {path: [{compare: "=", value: path}]}}},
            records: [{fields: {path, type: "text/plain"}, data: `sample data for ${path}`}]
        }),
    },
]

const fetchText = url => fetch(url).then(response => response.text())

export const panelQuery = {
    basis_criteria: {
        where: {path: [{compare: "like", value: "/%"}]},
    },
    view_criteria: {
        where: {type: [{compare: "=", value: "panel"}]},
    },
    view: "group-by-path-max-id",
}

export const surfaceBlock = async () => ({
    fields: {query: panelQuery},
    scripts: [await fetchText(new URL('./blocks/surface.renkon.js', import.meta.url).toString())],
})

export const blocks = async () => ({
    // TODO make accepts a separate data structure so we can experiment with bindings
    // separately from block definitions.
    'record browser': {
        fields: {query: {view_criteria: {limit: 10}}},
        scripts: [await fetchText(new URL('./blocks/record-browser.renkon.js', import.meta.url).toString())],
    },
    'surface': await surfaceBlock(),
    'start': {
        scripts: [await fetchText(new URL('./blocks/start.renkon.js', import.meta.url).toString())],
    },
    'record inspector': {
        scripts: [await fetchText(new URL('./blocks/record-inspector.renkon.js', import.meta.url).toString())],
    },
    'bridge simple transcript': {
        fields: {query: {
            view_criteria: {where: {type: [{compare: "=", value: "example"}]}},
        }},
        scripts: [await fetchText(new URL('./blocks/bridge-simple-transcript.renkon.js', import.meta.url).toString())],
    },
    'msgindex viewer': {
        scripts: [await fetchText(new URL('./blocks/msgindex-viewer.renkon.js', import.meta.url).toString())],
    },
    'renkon pad': {
        fields: {query: {
            view_criteria: {where: {path: [{compare: "like", value: "%.renkon"}]}},
        }},
        baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/renkon-pad-editor.renkon.js', import.meta.url).toString())],
    },
    'renkon pad runner': {
        baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/renkon-pad-runner.renkon.js', import.meta.url).toString())],
    },
    'field inspector': {
        scripts: [await fetchText(new URL('./blocks/field-inspector.renkon.js', import.meta.url).toString())],
    },
    'media viewer': {
        scripts: [await fetchText(new URL('./blocks/media-viewer.renkon.js', import.meta.url).toString())],
    },
    'pdf viewer': {
        baseURI: new URL('./blocks/pdfjs/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/pdf-viewer.renkon.js', import.meta.url).toString())],
    },
    'tree viewer': {
        fields: {
            query: {
                view: "group-by-path-max-id",
                basis_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
            },
        },
        scripts: [await fetchText(new URL('./blocks/tree-viewer.renkon.js', import.meta.url).toString())],
    },
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
            query: {
                view: "group-by-path-max-id",
                basis_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
            },
        },
        scripts: [await fetchText(new URL('./blocks/text-editor.renkon.js', import.meta.url).toString())],
    },
    'record add': {
        fields: {query: null},
        scripts: [await fetchText(new URL('./blocks/record-add.renkon.js', import.meta.url).toString())],
    },
    'files import': {
        fields: {query: null},
        scripts: [await fetchText(new URL('./blocks/import-files.renkon.js', import.meta.url).toString())],
    },
})

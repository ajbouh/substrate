
export const blockDefForType = (plumbing, type, verb) => {
    const candidates = plumbing.flatMap(
        (plumb) => ((!verb || plumb.verb === verb) && (type && type.match(plumb.type)))
            ? [{q: 1, ...plumb}]
            : []);
    candidates.sort((a, b) => a.q - b.q)
    return candidates[0]?.block
}

export const plumbing = [
    {verb: 'view', type: /^image/, block: 'media viewer'},
    {verb: 'view', type: /^video/, block: 'media viewer'},
    {verb: 'view', type: /^audio/, block: 'media viewer'},
    {verb: 'view', type: /^application\/pdf$/, block: 'pdf viewer'},
    {verb: 'edit', type: /^text/, block: 'text editor'},
]

const fetchText = url => fetch(url).then(response => response.text())

export const synthesizerBlock = async () => ({
    scripts: [await fetchText(new URL('./blocks/synthesizer.renkon.js', import.meta.url).toString())],
})

export const blocks = async () => ({
    // TODO make accepts a separate data structure so we can experiment with bindings
    // separately from block definitions.
    'record browser': {
        fields: {query: {limit: 100}},
        scripts: [await fetchText(new URL('./blocks/record-browser.renkon.js', import.meta.url).toString())],
    },
    'synthesizer': await synthesizerBlock(),
    'surface': {
        fields: {query: {
            "view_criteria": {"compare": {"type": [{"compare": "=", "value": "panel"}]}},
        }},
        scripts: [await fetchText(new URL('./blocks/surface.renkon.js', import.meta.url).toString())],
    },
    'record inspector': {
        scripts: [await fetchText(new URL('./blocks/record-inspector.renkon.js', import.meta.url).toString())],
    },
    'bridge simple transcript': {
        fields: {query: {
            "view_criteria": {"compare": {"type": [{"compare": "=", "value": "transcription"}]}},
        }},
        scripts: [await fetchText(new URL('./blocks/bridge-simple-transcript.renkon.js', import.meta.url).toString())],
    },
    'bridge simple': {
        fields: {query: {
            "view_criteria": {"compare": {"type": [{"compare": "=", "value": "transcription"}]}},
        }},
        scripts: [await fetchText(new URL('./blocks/bridge-simple.renkon.js', import.meta.url).toString())],
    },
    'renkon pad': {
        scripts: [await fetchText(new URL('./blocks/renkon-pad-editor.renkon.js', import.meta.url).toString())],
    },
    'renkon pad runner': {
        baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
        scripts: [await fetchText(new URL('./blocks/renkon-pad-runner.renkon.js', import.meta.url).toString())],
    },
    'field inspector': {
        baseURI: new URL('./blocks/renkon-pad/', document.baseURI).toString(),
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
                basis_criteria: {prefix: {path: [{prefix: "/"}]}},
            },
        },
        scripts: [await fetchText(new URL('./blocks/tree-viewer.renkon.js', import.meta.url).toString())],
    },
    // todo tree house????
    // 'renkon-pad': {
    //     // todo actually implement
    //     scripts: [await fetchText(new URL('./blocks/renkon-pad.renkon.js', import.meta.url).toString())],
    // },
    'field editor': {
        scripts: [await fetchText(new URL('./blocks/field-editor.renkon.js', import.meta.url).toString())],
    },
    'text editor': {
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

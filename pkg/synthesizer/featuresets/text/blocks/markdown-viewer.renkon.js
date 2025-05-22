const {h, html, render} = modules.preact
const {default: markdownit} = modules.markdownIt

console.log({modules})

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const md = markdownit()

const fetchText = async url => url ? await fetch(url).then(response => response.text()) : ''
const fetchAndRender = async (url) => fetchText(url).then(text => md.render(text))

console.log('in markdown', {queryset})
console.log('in markdown', {recordsData})
console.log('in markdown', {recordsUpdated})
console.log('in markdown', {recordsDataResolved})
console.log('in markdown', {rendered})

const recordsData = Behaviors.collect(
    undefined,
    recordsUpdated,
    (now, {records: {incremental, records}={}}) => {
        console.log('in markdown', {records})
        if (!records) {
            return now
        }
        const fetches = records.map(record => fetchAndRender(record.data_url))
        console.log('in markdown', {fetches})
        return incremental
            ? [...now, ...fetches]
            : fetches
    },
);

const selection = Events.listener(document, 'selectionchange', (evt) => document.getSelection())
const validSelection = selection.isCollapsed ? undefined : selection

console.log('in markdown', {selection})
console.log('in markdown', {validSelection})

// const recordsDataResolved = Behaviors.resolvePart(recordsData)
const recordsDataResolved = Promise.all(recordsData)

const rendered = html(recordsDataResolved)

render(
    h('div', {}, rendered),
    document.body,
)

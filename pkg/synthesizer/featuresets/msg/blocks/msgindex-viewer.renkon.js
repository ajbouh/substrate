// record-browser
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
    msgview: import("./featuresets/msg/msgview.js"),
    jsonpointer: import("./featuresets/msg/jsonpointer.js"),
    markdownIt: import("./featuresets/msg/markdown-it.min.js"),
});
const init = Events.once(modules);

const msgname = Behaviors.receiver();
console.log({msgname});

((init) => {
    Events.send(ready, true);
    Events.send(msgname, null)
})(init);

const records = Behaviors.collect(undefined, recordsUpdated, (now, {records: {incremental, records}={}}) => incremental ? [...now, ...records] : records);

const msgindex = records[0]?.fields?.msgindex

const msg = msgname ? msgindex?.[msgname] : null
const msgname1 = msgname
console.log({msg})
const msgentries = Object.entries(msgindex)
console.log({msgentries})

const {h, html, render} = modules.preact
const {default: markdownit} = modules.markdownIt
const jsonpointer = modules.jsonpointer
const md = markdownit()
const msgview = modules.msgview.dom({h, html, jsonpointer, md})

render(
    h('div', {
        style: {
            height: '100%',
            display: 'flex',
        },
    }, [
        h('select', {
            size: msgentries.length + 1,
            style: `
                height: 100%;
                padding-top: 2em;
                width: max-content;
                overflow: scroll;
                border: 0;
                flex-shrink: 0;
                // flex-grow: 1;
                resize: horizontal;
                height: 100vh;
            `,
            onchange: (ev) => {
                Events.send(msgname, ev.target.value)
            },
        }, msgentries.map(([name, msg]) => {
            return h('option', {value: name}, `\xa0\xa0${name}\xa0\xa0`)
        })),
        msgview({
            msg,
            msgname: msgname1,
            style: 'overflow-y: scroll; flex-grow: 1; padding-left: 1em;',
        }),
    ]),
    document.body,
);
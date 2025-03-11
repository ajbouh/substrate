// record-browser
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    msgview: import("./blocks/msgindex/msgview.js"),
    jsonpointer: import("./blocks/msgindex/jsonpointer.js"),
    markdownIt: import("./blocks/msgindex/markdown-it.min.js"),
});
const init = Events.once(modules);

const msgname = Behaviors.receiver();
console.log({msgname});

((init) => {
    Events.send(ready, true);
    Events.send(msgname, null)
})(init);

const msgindex = Behaviors.collect(undefined, msgindexUpdated, (now, {msgindex}) => msgindex)

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
        h('style', {}, `
.fieldDescription > .field {
    padding: 1em;
    border-radius: 0.2em;
    border: 1px #ccc solid;
}
.field {
    border-bottom: 1px #ccc solid;
    border-collapse: collapse;
    margin-top: 1ex;
    padding-bottom: 1ex;
}
.fieldName {
    font-weight: 700;
    color: #111;
    font-family: monospace;
}
.fieldType {
    font-weight: 200;
    color: #777;
    margin-left: 1ex;
    font-size: 0.9em;
}
.fieldDescription {
    color: #555;
    padding-top: 1ex;
    padding-bottom: 1ex;
}
.fieldRequired {
    font-weight: 700;
    color: #f95;
    margin-left: 1ex;
    font-size: 0.9em;
}
.example {
    background: #fcfcfc;
    border-radius: 0.25em;
    border: 1px solid #ccc;
}
.example .name {
    background: #ddd;
    color: #444;
    font-weight: 700;
    padding-left: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
}
.example code {
    padding: 1em;
    display: block;
    color: #333;
}

        `),
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
const modules = Behaviors.resolvePart({
    preact: import("./preact.standalone.module.js"),
});

const init = Events.once(modules);
((init) => {
    Events.send(ready, true);
})(init);

const {h, html, render} = modules.preact
const {
    blocks,
    plumbing,
} = modules.blocks

const starts = Object.values(Behaviors.gather(/Starter$/))


// it should show blocks that don't need a specific input, or that we can write a record for and then open

// no specific input
// tree viewer
// record browser
// X import files
// X text editor


// // write new record
// renkon editor
// bridge session

// -
// // search first:
// - field inspector
// - record inspector
// - pdf viewer
// - media viewer
// - record browser

// get all blockNames for verb 'start'
// put buttons to open them in a list

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


const startRecords = starts.map(({label, start}) => ({value: start, label}))

render(
    h('div', {
        style: `
        display: flex;
        flex-direction: column;
        height: 100%;
        flex-wrap: wrap;
        place-content: center;
        gap: 1em;
        `,
    }, [
        ...startRecords.map(({label, value}) =>
            h('button', {
                onclick: (evt) => {
                    const start = value
                    const {block, scripts, queryset, write} = start({genpath})
                    if (write) {
                        Events.send(recordsWrite, write)
                    }
                    Events.send(panelWrite, {
                        target: evt.metaKey ? undefined : 'self',
                        panel: {block, queryset, scripts},
                    })
                },
            }, label),
        ),
    ]),
    document.body,
)
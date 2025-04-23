// we can't put this directly in renkon-pad-editor because it will create confusing warnings about missing definitions until pad.js is loaded.
export function extensions() {
    const synthWriteRequest = Events.receiver();
    const padButtonWrite = h('button', {class: "menuButton", onclick: () => Events.send(synthWriteRequest, Date.now())}, 'write');
    
    // from here onwards should really be integrated "upstream" into renkon pad itself. it would be simpler there.
    const buttonCntr0 = Events.observe(notify => {
        const buttonBox = renkon.querySelector("#buttonBox")
        const e = document.createElement("div")
        buttonBox.appendChild(e)
        notify(e)
        return () => e.remove()
    });
    const buttonCntr = Behaviors.keep(buttonCntr0);
    
    const buttonRender = render(
        h('div', {}, Object.values(Behaviors.gather(/^padButton\w+/))),
        buttonCntr,
    )

    const synthSaveData = (data) => {
        const latest = {fields: {...synthRecord?.fields}, data}
        Events.send(recordsWrite, [latest])
        return {data, latest}
    };

    const synthLoadRequest = ((recordData) => {
        try {
            loadData(recordData, null);  // from pad.js
        } catch (e) {
            console.error(e)
        }
    })(synthRecordData, Events.or(Events.once(init), Events.change(synthRecordData)));

    const synthSaveRequest = (() => synthSaveData(synthSnapshotter()))(synthWriteRequest);

    // we should simplify the upstream saver in renkon pad. it should just give a string we *could* save and then we can have separate logic for doing the download.
    const synthSnapshotter = ((windows, positions, zIndex, titles, windowContents, windowTypes, padTitle, windowEnabled) => () => {
        const code = new Map([...windowContents.map].filter(([_id, editor]) => editor.state).map(([id, editor]) => ([id, editor.state.doc.toString()])));
        const myTitles = new Map([...titles.map].map(([id, obj]) => ([id, {...obj, state: false}])));
        const data1 = stringify({
            version: 2,
            windows,
            positions,
            zIndex,
            titles: {map: myTitles},
            windowTypes,
            padTitle,
            windowEnabled
        });

        const data2 = stringifyCodeMap(code);
        return data1 + data2
    })(windows, positions, zIndex, titles, windowContents, windowTypes, padTitle, windowEnabled);

    return []
}

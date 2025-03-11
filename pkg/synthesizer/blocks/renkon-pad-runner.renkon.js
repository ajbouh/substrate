// Based on bootstrap in renkon-pad/index.html

Events.send(ready, true);

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const renkonPadLoadRecord = records[0];
const renkonPadLoadData = fetch(renkonPadLoadRecord.data_url).then(r => r.text());
const docName = renkonPadLoadRecord.id;

console.log({'Renkon.app.persistentScripts': Renkon.app.persistentScripts});

((result) => {
    const index = result.indexOf("{__codeMap: true, value:");
    let code;
    if (index < 0) {
        const json = JSON.parse(result);
        if (json.version !== 1) {
            console.log("unknown type of data");
        }
        code = JSON.parse(result).code.values;
    } else {
        const data2 = result.slice(index);
        const array = eval("(" + data2 + ")");
        code = array.value;
    }
    Renkon.updateProgram([
        ...Renkon.app.persistentScripts,
        ...code.map((pair) => ({blockId: pair[0], code: pair[1]})),
    ], docName);
    // if (Renkon.evaluatorRunning === 0) {
    //     Renkon.evaluator();
    // }
})(renkonPadLoadData);

// Based on bootstrap in renkon-pad/index.html
const {pad} = import("./blocks/renkon-pad/pad.js");
console.log("default renkon-pad is starting");
Renkon.merge(pad);

Events.send(ready, true);

const records = Behaviors.collect([], recordsUpdated, (now, {incremental, records}) => incremental ? [...now, ...records] : records);

const renkonPadLoadRecord = records[0];
const renkonPadLoadData = fetch(renkonPadLoadRecord.data_url).then(r => r.text());
((result) => {
    loadData(result, null);
})(renkonPadLoadData);

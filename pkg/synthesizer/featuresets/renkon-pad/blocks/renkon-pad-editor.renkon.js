// Based on bootstrap in renkon-pad/index.html
const bootstrapModules = Behaviors.resolvePart({
    pad: import("./blocks/renkon-pad/pad.js"),
    padExtenions: import("./blocks/renkon-pad/pad-extensions.js"),
});

const bootstrapInit = Events.once(bootstrapModules);

(() => {
    Events.send(ready, true);
})(bootstrapInit);

const synthRecords = Behaviors.collect(undefined, recordsUpdated, (now, {records: {incremental, records}={}}) => records ? incremental ? [...now, ...records] : records : now);
const synthRecord = synthRecords[0] ?? false

const synthRecordDataChanged = Events.select(
    undefined,
    synthRecord, (now, record) => {
        if (record?.data_url) {
            return fetch(record.data_url).then(r => r.text())
        }
        return "{}"
    },
);
const synthRecordData = Behaviors.keep(synthRecordDataChanged);
const synthRecordDataInit = Behaviors.collect(undefined, synthRecordDataChanged, (now, _) => now === undefined);

// Only load renkon-pad once, after we have our first data.
((init) => {
    if (!init) {
        return
    }
    Renkon.merge(
        bootstrapModules.pad.pad,
        bootstrapModules.padExtenions.extensions,
    );
})(synthRecordDataInit);

// record-add
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    records: import("../records.js"),
    inputs: import("../inputs.js"),
});
const {h, html, render} = modules.preact
const {makeInputs} = modules.inputs
const {sampleRecords} = modules.records
const {select, textinput, button} = makeInputs({h});

Events.send(ready, true);

const recordInputUpdate = Events.receiver()
const recordInput = Behaviors.select(
    "",
    recordInputUpdate, (now, value) => value,
);

const importFiles = () =>
    new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async () => {
        const files = input.files;
        if (!files) return resolve([]);
        try {
          const buffers = await Promise.all(
            Array.from(files).map(
              (file) =>
                new Promise((res, rej) => {
                  const reader = new FileReader();
                  reader.onload = () => res(reader.result);
                  reader.onerror = rej;
                  reader.readAsArrayBuffer(file);
                })
            )
          );
          resolve(buffers);
        } catch (error) {
          reject(error);
        }
      };
      input.click();
    });

render(
    h('div', {
        flex: '1',
    }, [
        textinput(
            recordInput,
            (value) => Events.send(recordInputUpdate, value),
        ),
        select(
            value => Events.send(recordInputUpdate, JSON.stringify(value)),
            sampleRecords.map(t => ({value: t, label: JSON.stringify(t)})),
            {style: {width: '5em'}},
        ),
        button(
            () => Events.send(recordsWrite, [JSON.parse(recordInput)]),
            "add record",
        ),
    ]),
    document.body,
);

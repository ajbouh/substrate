// import-files
// group these together so we can delay init until they are all loaded and available.
const modules = Behaviors.resolvePart({
    preact: import("../preact.standalone.module.js"),
    inputs: import("../inputs.js"),
});
const {h, html, render} = modules.preact
const {makeInputs} = modules.inputs
const {select, textinput, button} = makeInputs({h});

Events.send(ready, true);

const recordWriteFromDataURL = (fields, dataURL) => {
  function splitBase64(dataString) {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataString);
    return match
      ? { type: match[1], data: match[2] }
      : null;
  }

  const {type, data} = splitBase64(dataURL)
  return {
    fields: {
      type: type !== '*/*' ? type : undefined,
      ...fields,
    },
    data,
    encoding: 'base64',
  }
}

const recordWriteFromFile = (fields, file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(recordWriteFromDataURL(fields, reader.result));
    reader.onerror = reject;
    // if we wanted an ArrayBuffer, we would use .readAsArrayBuffer(file);
    reader.readAsDataURL(file);
  })

const importFilesAsRecordWrites = ({fields, pathPrefix}) =>
    new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = async () => {
        const files = input.files;
        if (!files) return resolve([]);
        try {
          resolve(Promise.all(Array.from(files, file => recordWriteFromFile({...fields, path: pathPrefix + file.name}, file))));
        } catch (error) {
          reject(error);
        }
      };
      input.click();
    });

const pathPrefixUpdate = Events.receiver()
const pathPrefix = Behaviors.select(
    "/foo/",
    pathPrefixUpdate, (now, value) => (value.endsWith("/") ? value.replace(/\/+$/, '') : value) + "/",
);

render(
    h('div', {
        flex: '1',
    }, [
      textinput(
        pathPrefix,
        (value) => Events.send(pathPrefixUpdate, value),
      ),
      button(
            () => importFilesAsRecordWrites({fields: {}, pathPrefix}).then(records => Events.send(recordsWrite, records)),
            "import files",
        ),
    ]),
    document.body,
);

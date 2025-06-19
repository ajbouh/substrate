export function component({
    recordsExportQuery,
}) {
    const downloadURL = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    };

    const recordWriteFromDataURL = (fields, dataURL) => {
        function splitBase64(dataString) {
            const match = /^data:([^;]+);base64,/.exec(dataString);
            return match
                ? { type: match[1], data: dataString.slice(match[0].length) }
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

    const importFilesAsSnapshots = ({fields}) =>
        new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = async () => {
                const files = input.files;
                if (!files) return resolve([]);
                try {
                    resolve(Array.from(files, file => {
                        const readable = file.stream()
                        return {fields, import: true, readable, ns: [], [Renkon.app.transferSymbol]: [readable]}
                    }));
                } catch (error) {
                    reject(error);
                }
            };
            input.click();
        });

    const fileImportPathPrefix = "/"

    const offers = [
        {
            verb: 'draft command',
            key: 'surface-draft-command',
            description: '',
            label: '$ _',
            criteria: {
                path: [{compare: 'like', value: '%.surface'}],
            },
            act: ({ribbonControl, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}, layout, fields}}}}) => {
                ribbonControl({draft: {}})
                return []
            },
        },
        {
            verb: 'start panel',
            key: 'surface-start-panel',
            description: '',
            label: '➕',
            criteria: {
                path: [{compare: 'like', value: '%.surface'}],
            },
            act: ({panelWrite, records, cue: {fields: {query, panel: sender, dat: {event: {metaKey} = {}, layout, fields}}}}) => {
                const panelKeys = [null]
                return panelKeys.flatMap(key => panelWrite(sender, {target: key, panel: {block: 'start', ...fields}, layout}))
            },
        },
        {
            verb: 'export snapshot',
            group: 'transit',
            key: 'surface-export-snapshot',
            description: '',
            criteria: {},
            act: ({cue: {fields: {query}}}) => {
                const name = `export-${Date.now()}.synth`
                return recordsExportQuery(query, name).then(url => downloadURL(url, name))
            },
        },
        {
            verb: 'import files',
            // group: 'transit',
            key: 'surface-import-files',
            description: '',
            criteria: {
                path: [{compare: 'like', value: '%.surface'}],
            },
            act: () => importFilesAsRecordWrites({fields: {}, pathPrefix: fileImportPathPrefix}),
        },
        {
            verb: 'import snapshot',
            // group: 'transit',
            key: 'surface-import-snapshots',
            description: '',
            criteria: {
                path: [{compare: 'like', value: '%.surface'}],
            },
            act: () => importFilesAsSnapshots({fields: {}}),
        },
    ];

    return {
        offers,
    }
}

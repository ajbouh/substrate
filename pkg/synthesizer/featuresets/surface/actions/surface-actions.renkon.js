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
            verb: 'export',
            key: 'surface-export-snapshot',
            description: '',
            criteria: {},
            act: ({cue: {fields: {query}}}) => {
                const name = `export-${Date.now()}.synth`
                return recordsExportQuery(query, name).then(url => downloadURL(url, name))
            },
        },
        {
            // verb: '',
            key: 'surface-import-files',
            description: '',
            act: () => importFilesAsRecordWrites({fields: {}, pathPrefix: fileImportPathPrefix}),
        },
        {
            // verb: '',
            key: 'surface-import-snapshots',
            description: '',
            act: () => importFilesAsSnapshots({fields: {}}),
        },
    ];

    return {
        offers,
    }
}

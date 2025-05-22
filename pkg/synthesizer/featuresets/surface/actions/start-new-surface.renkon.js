export function component({
    genpath,
    withActionCueRecord,
    recordsRead,
}) {

    const adjustSurfaceRecord = (path, record) => ({
        fields: {
            ...record.fields,
            queryset: {
                ...record.fields.queryset,
                // must track what's in surface.featureset.js
                surface: {
                    global: true,
                    view_criteria: {
                        where: {path: [{compare: "=", value: path}]},
                    },
                    view: "group-by-path-max-id",
                }
            },
            block: path,
            path,
            surface: path,
            panels: [],
        }
    })


    const offers = [
        {
            verb: 'start',
            key: 'start-new-surface',
            description: 'new surface',
            act: async ({cue: {fields: {query, panel, dat} = {}}}) => {
                const path = `${genpath()}.surface`

                const {records: featuresetSurfaceRecords} = await recordsRead({
                    records: {
                        view_criteria: {
                            where: {featureset: [{compare: "=", value: "surface"}]},
                        },
                        view: "group-by-path-max-id",
                    },
                });
                const existingSurfaceRecord = featuresetSurfaceRecords.find(({fields}) => fields.type === "block" && fields.block.endsWith(".surface"))
                console.log({existingSurfaceRecord})
                const existingSurfacePath = existingSurfaceRecord.fields.path
                const newSurfaceRecord = adjustSurfaceRecord(path, existingSurfaceRecord)
                console.log({existingSurfacePath})
                console.log({featuresetSurfaceRecords})
                
                const writes = featuresetSurfaceRecords.map(record =>
                    record === existingSurfaceRecord
                    ? newSurfaceRecord
                    : {
                        data: record.data,
                        data_url: record.data_url,
                        fields: {
                            ...record.fields,
                            surface: path,
                            path: typeof record.fields?.path === 'string' && record.fields.path.startsWith(existingSurfacePath)
                                ? path + record.fields.path.substring(existingSurfacePath.length)
                                : record.fields?.path,
                        }
                    })
                console.log('new surface writes', writes)
                return withActionCueRecord(writes, {verb: 'open', path, panel, dat})
            },
        },
    ]

    return {
        offers,
    }
}

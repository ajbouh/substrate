const surfaceStarter = (() => {
    const newSurface = ({path}) => {
        return {
            fields: {
                type: "surface",
                path,
                direction: "row",
                panels: [],
            },
        }
    }
    
    // this is repeated in blocks.js
    const surfaceQuery = (path) => ({
        global: true,
        basis_criteria: {
            where: {path: path ? [{compare: "=", value: path}] : []},
        },
        view_criteria: {
            where: {type: [{compare: "=", value: "surface"}]},
        },
        view: "group-by-path-max-id",
    })

    return {
        label: 'new surface',
        start: ({genpath, path=`/surfaces${genpath()}.surface`}={}) => ({
            block: 'surface',
            queryset: {surface: surfaceQuery(path)},
            write: [newSurface({path})],
        }),
    }
})()

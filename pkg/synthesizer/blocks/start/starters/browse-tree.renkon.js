const browseGlobalTreeStarter = {
    label: 'browse global tree',
    start: () => ({
        block: 'tree viewer',
        queryset: {
            records: {
                global: true,
            },
        },
    }),
}

const browseSurfaceTreeStarter = {
    label: 'browse surface tree',
    start: () => ({
        block: 'tree viewer',
    }),
}

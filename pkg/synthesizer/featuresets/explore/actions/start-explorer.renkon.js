export function component({
}) {
    const offers = [
        {
            verb: 'start',
            key: 'start-global-explorer',
            // criteria,
            description: 'start global explorer',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? null : undefined
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'explorer',
                        queryset: {
                            records: {
                                global: true,
                                view: "group-by-path-max-id",
                                basis_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
                            }
                        }
                    }
                })
            },
        },
        {
            verb: 'start',
            key: 'start-surface-explorer',
            // criteria,
            description: 'start surface explorer',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? null : undefined
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'explorer',
                        queryset: {
                            records: {
                                view: "group-by-path-max-id",
                                basis_criteria: {where: {path: [{compare: "like", value: "/%"}]}},
                            }
                        },
                    },
                })
            },
        },
        {
            verb: 'start',
            key: 'start-surface-timeline',
            // criteria,
            description: 'start surface timeline',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? null : undefined
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'explorer',
                        queryset: {
                            records: {
                                view_criteria: {
                                    limit: 100,
                                    bias: 1,
                                },
                            },
                        },
                    },
                })
            },
        },
        {
            verb: 'start',
            key: 'start-global-timeline',
            // criteria,
            description: 'start global timeline',
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}}}}}) => {
                const target = metaKey ? null : undefined
                return panelWrite(panel, {
                    target,
                    panel: {
                        block: 'explorer',
                        queryset: {
                            records: {
                                global: true,
                                view_criteria: {
                                    limit: 100,
                                    bias: 1,
                                },
                            },
                        },
                    },
                })
            },
        },
    ];

    return {
        offers,
    }
}

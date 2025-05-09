const plumbingActions = plumbing.map(rule => {
    const {verb, criteria, description, block, querykey} = rule
    return {
        verb,
        criteria,
        description,
        act: ({cue: {fields: {query, panel, dat: {event: {metaKey} = {}} = {}}}}) => {
            const target = metaKey ? undefined : 'self'
            panelWrite(panel, {
                target,
                panel: {
                    block,
                    queryset: {[querykey]: query},
                }
            })
            return true
        },
    }
});

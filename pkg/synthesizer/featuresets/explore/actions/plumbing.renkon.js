export function component({
    key,
    recordsSubscribe,
    sendRecordsUpdated,

    // todo define these as a workaround
    recordsUpdated,
}) {
    const recordsSubscribe0 = Behaviors.keep(recordsSubscribe)
    const sendRecordsUpdated0 = Behaviors.keep(sendRecordsUpdated)
    const key0 = Behaviors.keep(key)
    const recordsUpdated0 = Behaviors.keep(recordsUpdated)

    const plumbingQueryset = Behaviors.keep({
        plumbing: {
            view_criteria: {
                where: {type: [{compare: "=", value: "plumbing"}]},
            },
            view: "group-by-path-max-id",
        },
    })
    const plumbingUpdatedNotifier = recordsSubscribe0(recordsUpdated => sendRecordsUpdated0({key: key0, recordsUpdated}), {
        queryset: plumbingQueryset,
    });

    const plumbing = Behaviors.collect(
        undefined,
        recordsUpdated0, (now, {plumbing: {incremental, records}={}}) => (records ? (incremental ? [...now, ...records] : records) : now)
    );

    const plumbingOfferFn = Behaviors.keep(({fields: rule}) => {
        const {verb, group, criteria, weight, description, block, querykey} = rule
        return {
            verb,
            group,
            criteria,
            description,
            weight,
            scopes: ['external'],
            act: ({panelWrite, cue: {fields: {query, panel, dat: {event: {metaKey} = {}} = {}}}}) => {
                const target = metaKey ? null : undefined
                return panelWrite(panel, {
                    target,
                    panel: {
                        block,
                        queryset: {[querykey]: query},
                        selectionQuery: undefined,
                    }
                })
            },
        }
    })
    const offers = plumbing.map(plumbingOfferFn);

    return {
        offers,
    }
}

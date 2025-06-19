// needs criteriaMatcher and actionOffersets

const actionsAndMatchers = actionOffersets.flatMap(
    offerset => Object.values(offerset).map(offer => ({
        matcher: criteriaMatcher(offer.criteria),
        offer,
        checkEnabled: offer.enabled ? criteriaMatcher(offer.enabled) : () => true,
    }))
)

const groupedVerbsForRecords = (records, scopes) => {
    const everyMatcher = matcher => records => {
        const r = matcher ? (records?.length && records.every(matcher)) : !records?.length
        return r
    }

    const verbOffers = Object.groupBy(
        actionsAndMatchers
            .filter(({matcher, offer}) =>
                offer.verb?.length &&
                ((scopes && offer.scopes) ? offer.scopes.every(scope => scopes.includes(scope)) : true) &&
                everyMatcher(matcher)(records)
            )
            .map(({offer, checkEnabled}) => {
                const enabled = everyMatcher(checkEnabled)(records)
                return {
                    ...offer,
                    enabled,
                }
            }),
        ({verb}) => verb)
    const verbGroups = Object.groupBy(
        Object.values(verbOffers).map(([{group, verb, label, enabled}]) => ({group, verb, label, enabled})), // todo should be the highest priority offer
        ({group}) => group || "")
    return verbGroups
}

const offersForVerb = verb => actionOffersets.flatMap(offerset => Object.values(offerset).filter(offer => offer.verb === verb))

const act = (() => {
    const pick = (o, ...keys) => {
        const v = {}
        for (const k of keys) {
            v[k] = o[k]
        }
        return v
    }

    return ({verb, key, records, event, panel, parameters, dat}) => {
        const write = {
            fields: {
                type: "action/cue",
                // records: [record],
                query: recordsToQuery(records),
                dat: {
                    event: event ? pick(event, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button") : undefined,
                    ...dat,
                },
                verb,
                key,
                panel,
                parameters,
            },
        }
        Events.send(recordsWrite, [write])
    }
})();

const actions = Behaviors.gather(/Actions?$/)
const offers = Object.entries(actions).flatMap(
    ([key, action]) => Array.isArray(action)
        ? action.map((action, i) => ({...action, ns: [key, i]}))
        : [{...action, ns: [key]}]
)
const offersAndMatchers = offers
    .map(({act, ...offer}) => ({
        offer,
        act,
        matchRecords: everyMatcher(criteriaMatcher(offer.criteria)),
        matchVerb: verb => verb === offer.verb,
    }))

const actionsOfferSends = Behaviors.select(
    undefined,
    offers, (now, offers) => Events.send(actionsOffer, offers.map(({act, ns, ...offer}) => ({ns, offer}))),
)

const recordsQueryRead = query => new Promise((resolve, reject) => {
    const ch = new window.MessageChannel()
    ch.port2.onmessage = ({data: {records}}) => {
        resolve(records)
    }
    ch.port2.onmessageerror = (evt) => reject(evt)
    Events.send(recordsQuery, {
        ns: [`recordsqueryread-hack-${+new Date()}`], // this approach to ns is a hack :(
        port: ch.port1,
        global: true,
        queryset: {records: query},
        [Renkon.app.transferSymbol]: [ch.port1],
    })
})

const actDefaults = {msgtxtParser, msg: modules.msg}

const actionCues = Events.select(
    {},
    recordsUpdated, (now, updates) => {
        if (updates.cues) {
            const {records: cues} = updates.cues

            for (const cue of cues) {
                let {query, verb} = cue.fields

                if (!verb) {
                    // should use description to impute verb, if we can
                    verb = 'view'
                }

                // todo also allow an action to be cued directly by its key

                recordsQueryRead(query).then(records => {
                    const candidates = offersAndMatchers.filter(
                        ({matchVerb, matchRecords}) => matchVerb(verb) && matchRecords(records));
                    const winner = candidates.find(({act}) => act({...actDefaults, records, cue}))
                    console.log({winner})
                })
            }
        }

        return now
    },
);

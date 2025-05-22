// needs criteriaMatcher

const actionOffers = Behaviors.collect(
    undefined,
    recordsUpdated, (now, {offers: {incremental, records: offers}={}}) => {
        return offers ?? now
    })
const actionsAndMatchers = actionOffers.flatMap(({fields: {offerset}}) => Object.values(offerset).map(offer => [criteriaMatcher(offer.criteria), offer]))

console.log({actionsAndMatchers});
const verbsForRecords = records => [...new Set(actionsAndMatchers.filter(v => v[1].verb?.length && records.every(record => v[0] && v[0](record))).map(v => v[1].verb))]

const offersForVerb = verb => actionOffers.flatMap(({fields: {offerset}}) => Object.values(offerset).filter(offer => offer.verb === verb))

const act = ({verb, records, event}) => {
    const write = {fields: {
        type: "action/cue",
        // records: [record],
        query: {
            global: true,
            view: "group-by-path-max-id",
            basis_criteria: { where: {path: [{compare: "in", value: records.map(record => record?.fields?.path)}]} },
        },
        dat: {
            event: pick(event, "metaKey", "shiftKey", "ctrlKey", "altKey", "repeat", "key", "code", "button"),
        },
        verb,
    }}
    Events.send(recordsWrite, [write])
}

const pick = (o, ...keys) => {
    const v = {}
    for (const k of keys) {
        v[k] = o[k]
    }
    return v
}

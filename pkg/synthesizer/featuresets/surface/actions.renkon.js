const {criteriaMatcher} = modules.recordsMatcher
const {sender, reflect} = modules.msg
const {makeParser} = modules.msgtxt
const msgtxtParser = makeParser({ohm: modules.ohm.default})

const actionComponentPromises = Behaviors.collect(
    undefined,
    componentsUpdated, componentPromisesBehavior("components/actions"));
// Behaviors.resolvePart would be better but seems to swallow updates in some cases
const actionComponentMaybes = Promise.all(actionComponentPromises.promises)
const actionComponents = actionComponentMaybes.filter(entry => entry.component)

const genpath = (now) => {
    function genchars(length) {
        let result = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charsLength = chars.length;
        for ( let i = 0; i < length; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    }
    
    function fmtdate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return `/${fmtdate(now ?? new Date())}-${genchars(7)}`
}

const actionCueRecord = ({records, dat, path, panel, verb}) => ({
    fields: {
        type: "action/cue",
        query: {
            global: true,
            view: "group-by-path-max-id",
            basis_criteria: {
                where: {
                    path: [{compare: "in", value: path ? [path] : records.filter(record => record?.fields?.path).map(record => record?.fields?.path)}]
                },
            },
        },
        panel,
        dat,
        verb,
    },
})

const withActionCueRecord = (records, {dat, path, panel, verb}) => [
    ...records,
    actionCueRecord({records, dat, panel, path, verb})
]

const actionRecordsUpdated = Events.receiver({queued: true})

const actionComponentCommonInput = {
    genpath,
    withActionCueRecord,
    recordsRead,
    recordRead,
    recordsExportQuery,
    recordsUpdated: {}, // empty by default
    sendRecordsUpdated: aru => Events.send(actionRecordsUpdated, aru),
    recordsSubscribe: Object.assign((notify, props, impl) => recordsSubscribe(notify, props, impl ?? {
        recordsQuery: sendRecordsQuery,
        close: sendClose,
    }), {id: Date.now()}),
}

const actionOffers = Behaviors.select(
    undefined,
    actionRecordsUpdated, (now, arus) => {
        if (!now) {
            return now
        }
        const next = {...now}
        let any = false
        for (const {key, recordsUpdated} of arus) {
            const current = next[key]
            // console.log("actionRecordsUpdated", {key, recordsUpdated, current, next})
            if (!current) {
                continue
            }
            const {record, component} = current

            let offers = undefined
            try {
                offers = component({
                    ...actionComponentCommonInput,
                    key,
                    recordsUpdated,
                    actionRecord: current.record,
                }, key).offers
            } catch (e) {
                console.error(e, "error gathering action offers", {record, component})
            }

            if (current.offers === offers) {
                continue
            }

            next[key] = {...current, offers}
            any = true
        }

        return any ? next : now
    },
    actionComponents, (prev, actionComponents) => {
        let any = false
        const next = {}
        for (const entry of actionComponents) {
            const {record, component, key: componentKey} = entry
            const key = `${componentKey}/${record.fields.action}`

            let offers = undefined
            try {
                offers = component({
                    ...actionComponentCommonInput,
                    key,
                    actionRecord: record,
                }, key).offers
            } catch (e) {
                console.error(e, "error gathering action offers", {record, component})
            }

            const current = prev?.[key]

            if (current &&
                current.offers === offers &&
                current.component === component &&
                current.record === record) {
                continue
            }

            next[key] = {
                component,
                record,
                offers
            }
            any = true
        }

        return any ? next : prev
    })

const offers = Object.entries(actionOffers).flatMap(
    ([key, {offers}]) => offers
        ? offers.map((offer, i) => ({...offer, ns: [key, offer.key || i]}))
        : []
)

const everyMatcher = matcher => records => matcher ? (records && records.every(matcher)) : !records

const offersAndMatchers = offers
    .map(({act, ...offer}) => ({
        offer,
        weight: offer.weight ?? 0,
        act,
        matchRecords: everyMatcher(criteriaMatcher(offer.criteria)),
        matchVerb: verb => !verb || (verb === offer.verb),
        matchKey: key => !key || (key === offer.key),
    }))

const actionsOffer = Behaviors.select(
    undefined,
    offers, (now, offers) => offers.map(({act, ns, ...offer}) => ({ns, offer})),
)

// use a unique value on every boot. this allows us to only act on actions that were written by this runtime instance.
const actor = (() => {
    function genchars(length) {
        let result = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charsLength = chars.length;
        for ( let i = 0; i < length; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    }

    return genchars(10)
})();

const actionOffersUpdated = Events.select(
    {},
    actionsOffer, (now, offers) => {
        const addOffers = {}
        for (const {ns, offer} of offers) {
            const key = JSON.stringify(ns)
            addOffers[key] = offer
        }
        return {
            ...now,
            ...addOffers,
        }
    },
);

((actionOffersUpdated) => {
    sendRecordsWrite([{
        fields: {
            type: 'action/offers',
            offerset: actionOffersUpdated
        },
    }])
})(actionOffersUpdated);

const actionCuesUpdated = Events.observe(notify => recordsSubscribe(notify, {
    queryset: {
        cues: {
            // HACK... this causes us to only see results that our surface has written.
            // it would be better to properly handle records we haven't processed yet but skip ones we have.
            self: true,
            view_criteria: {
                where: {
                    type: [{compare: "=", value: "action/cue"}],
                }
            },
        },
    },
}, {
    recordsQuery: sendRecordsQuery,
    close: sendClose,
}));

// console.log('in surface', self.fields.path, {actionCuesUpdated});

const actDefaults = {msgtxtParser, msg: modules.msg, panelWrite}

const queryThenActOn = (cue) => recordsRead({records: cue.fields.query}).then((o) => act({cue, records: o.records}))

const act = ({cue, records}) => {
    let {verb, key} = cue.fields

    console.log({cue, records})

    if (!key && !verb) {
        // should we use description to impute verb, if we can?
        // if we do this it would be async and need to happen outside this
        verb = 'view'
    }

    console.log({records})
    console.log({offersAndMatchers})
    let candidates = offersAndMatchers.filter(
        ({matchKey, matchVerb}) => matchKey(key) && matchVerb(verb));
    candidates.sort((a, b) => b.weight - a.weight)
    
    // if there's only one candidate, no need to fetch records
    if (candidates.length > 1) {
        candidates = candidates.filter(({matchRecords}) => matchRecords(records))
    }

    console.log({candidates})
    let writes
    for (const candidate of candidates) {
        writes = candidate.act({...actDefaults, records, cue})
        if (writes) {
            break
        }
    }
    console.log({writes})
    if (writes) {
        if (writes.length) {
            return sendRecordsWrite(writes)
        } else if (writes instanceof Promise) {
            return writes.then(writes => writes?.length && sendRecordsWrite(writes))
        }
    }
}

const actionCues = Events.select(
    undefined,
    actionCuesUpdated, (now, {cues: {incremental, records}={}}) => {
        console.log('high water mark is', now)

        if (!records) {
            return now
        }

        for (const cue of records) {
            if (now && (cue.id <= now)) {
                console.log("ignoring cue we've already seen", cue.id)
                continue
            }

            if (!now || (cue.id > now)) {
                now = cue.id
            }

            // ignore stale cues
            if (cue.fields.actor !== actor) {
                console.log('ignoring cue for someone else', cue.fields.actor, 'is not', actor, '(me)')
                continue
            }

            console.log('processing cue', cue.id, {cue, actor})

            queryThenActOn(cue)
        }

        console.log('updating high water mark to', now)

        return now
    },
);

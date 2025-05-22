// this is adaptive based on how old the newest record is

const ageMax = Behaviors.receiver();

// todo need to recalc this interval once it crosses from seconds -> minutes, hours -> days
const ageNowInterval = ((ms) => {
    const minutes = ms / 60_000
    if (minutes < 1) { return 1000 } // refresh seconds every second
    const hours = minutes / 60
    if (hours < 1) { return 10_000 } // refresh minutes every 10 seconds
    const days = hours / 24
    if (days < 1) { return 10 * 60_000 } // refresh hours every 10 minutes
    return 3_600_000 // refresh everything else every hour
})(ageMax);

console.log({ageNowInterval});

console.log({ageMax});

const ageNowTime = Events.timer(ageNowInterval)

const ageNow = Behaviors.select(
    undefined,
    // update "now" either when we see a new record or at the specified interval.
    Events.or(ageNowTime, recordsUpdated), (prev, _) => Date.now(),
)

const ageFacetDomain = (records, {decodeTime}) => {
    const now = Date.now()
    const max = records.reduce((acc, record) => Math.max(acc, decodeTime(record.id)), 0)
    Events.send(ageMax, now - max)
}

const ageFacet = (() => {
    const formatDuration = (ms) => {
        if (ms == null || isNaN(ms)) {
            return '-'
        }
        if (ms === Infinity || ms === -Infinity) {
            return 'forever'
        }
        if (ms < 1000) {
            return `${ms.toFixed(0)} ms`
        }
        const s = ms / 1000
        if (s < 60) {
            return `${s.toFixed(0)} s`
        }
        const m = s / 60
        if (m < 60) {
            return `${m.toFixed(0)} min`
        }
        const h = m / 60
        if (h < 60) {
            return `${h.toFixed(0)} hours`
        }
        const d = h / 24
        return `${d.toFixed(1)} days`
    }

    return {
        label: 'Age',
        render: ({decodeTime, record}) => `${formatDuration(ageNow - decodeTime(record.id))} ago`,
    }
})();

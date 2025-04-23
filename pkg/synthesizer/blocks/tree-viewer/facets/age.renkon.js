// TODO make this adaptive based on how old the newest record is
const ageNowTime = Events.timer(5*60*1000)

const ageNow = Behaviors.select(
    undefined,
    // update "now" either when we see a new record or at the specified interval.
    Events.or(ageNowTime, recordsUpdated), (now, _) => +new Date(),
)

const ageFacet = (() => {
    const formatDuration = (ms) => {
        if (ms == null || isNaN(ms)) {
            return '-'
        }
        if (ms === Infinity || ms === -Infinity) {
            return 'forever'
        }
        if (ms < 1000) {
            return `${ms.toFixed(1)} ms`
        }
        const s = ms / 1000
        if (s < 60) {
            return `${s.toFixed(2)} s`
        }
        const m = s / 60
        if (m < 60) {
            return `${m.toFixed(1)} min`
        }
        const h = m / 60
        if (h < 60) {
            return `${h.toFixed(1)} hours`
        }
        const d = h / 24
        return `${d.toFixed(1)} days`
    }

    return {
        label: 'age',
        render: ({decodeTime, record}) => `${formatDuration(ageNow - decodeTime(record.id))} ago`,
    }
})();

<script>
import {onMount} from 'svelte'
import dayjs from './dayjs'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

// `setTimeout()` would enter an infinite cycle when interval is a `MONTH`.
// https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
const SET_TIMEOUT_MAX_DELAY = 2147483647

const INTERVALS = [{
  interval: MINUTE
}, {
  threshold: HOUR,
  interval: 10 * MINUTE
}, {
  threshold: 12 * HOUR,
  interval: 20 * MINUTE
}, {
  threshold: DAY,
  interval: 3 * HOUR
}, {
  threshold: 7 * DAY,
  interval: 6 * HOUR
}, {
  threshold: MONTH,
  interval: 5 * DAY
}, {
  threshold: 3 * MONTH,
  interval: 10 * DAY
}, {
  threshold: YEAR,
  interval: MONTH
}]

export let getNow = () => dayjs()
export let time

$: dt = time == null ? time : dayjs(time)

function getNextAutoUpdateDelay() {
  const diff = Math.abs(+now - +dt)

  let _interval
  for (const { interval, threshold } of INTERVALS) {
    if (threshold && diff < threshold) {
      continue
    }
    _interval = interval
  }
  return Math.min(_interval, SET_TIMEOUT_MAX_DELAY)
}

let scheduled
function cancelNextTick() {
  if (scheduled) {
    clearTimeout(scheduled)
    scheduled = undefined
  }
}

function scheduleNextTick() {
  cancelNextTick()
  scheduled = setTimeout(
    () => (now = getNow(), scheduleNextTick()),
    getNextAutoUpdateDelay(),
  )
}

onMount(() => {
  dt && scheduleNextTick()
  return cancelNextTick
})

let now = getNow()
$: (dt, scheduled && (now = getNow(), scheduleNextTick()))

let className = '';
export { className as class };
export let style = '';
</script>

<span class={className} {style}>{#if dt}{dt.from(now)}{/if}</span>

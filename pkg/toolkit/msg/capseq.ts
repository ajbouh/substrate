import type { Caps } from './cap.ts'
import { pluckInto } from './pluck.ts'
import { get } from './pointer.ts'

export const CapSeq: Caps['seq'] = async (env, msg) => {
  for (let i = 0; i < msg.seq.length; ++i) {
    let step = msg.seq[i]

    msg.seq[i] = step = pluckInto(step.pre, step, msg)

    if (step.par) {
      const batchEntries = Object.entries(step.par)
      let batchEnv = env
      let batchAbort = new AbortController()
      if (batchEntries.length > 1) {
        batchEnv = env.new({}, batchAbort.signal)
      }

      // Promise.race over these until all are done *or* we see true for break
      let remaining = new Map(batchEntries.map(
          ([taskName, taskMsg]) => [taskName, batchEnv.apply(null, taskMsg as any).then(v => [taskName, v])]))

      while (remaining.size > 0) {
        const [taskName, taskOut] = await Promise.race(remaining.values())

        remaining.delete(taskName)
        step.par[taskName] = taskOut

        // if break is given, check it!
        if (step.break) {
          // give all the `break` probes a chance
          const brks = step.break.filter(({and}) => and.every(p => get(step, p)))

          if (brks.length) {
            for (const brk of brks) {
              if (brk.out) {
                msg = pluckInto(brk.out, msg, step)
              }
            }

            if (batchAbort) {
              batchAbort.abort('msgs break')
            }
            break
          }
        }
      }
    }
    
    if (step.out) {
      msg = pluckInto(step.out, msg, step)
    }
  }

  return pluckInto(msg.ret, {}, msg)
}

import { Caps, Env } from "./cap.ts"

export function environment(parent: Env | null, caps: Partial<Caps>={}, abortSignal?: AbortSignal): Env {
  if (!parent && !abortSignal) {
    // initializing it this way means we can't cancel it, so it's
    // not a great idea, but it also means we can guarantee it's
    // non-null later.
    abortSignal = new AbortController().signal
  }
  return {
    get abortSignal() {
      if (!abortSignal && parent) {
        return parent.abortSignal
      }

      return abortSignal!
    },
    new(caps, abortSignal?) {
      return environment(this, caps, abortSignal)
    },
    async apply(env, msg) {
      if (!env) {
        env = this
      }

      const capname = msg.cap
      if (capname) {
        const cap = caps[capname]
        if (cap) {
          const result = await cap(env!, msg as any) as any
          return result
        }
      }
      if (parent) {
        return await parent.apply(env, msg)
      }

      throw new Error(`cannot run: unknown capability, top-level caps: ${Object.keys(caps)}; cap=${msg.cap}; msg=${JSON.stringify(msg)}`)
    },
  }
}

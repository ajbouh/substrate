import { caps } from "./caps.ts"
import { environment } from "./environment.ts"
import { merge } from "./merge.ts"
import { Msg } from "./msg.ts"

export function sender(): (msg: Msg, data?: Msg) => Promise<any> {
  const root = environment(null, caps)
  // note that merge will always fully clone msg, so it is safe for caps to modify.
  return async (msg, data) => await root.apply(null, merge(msg, {data}) as any)
}

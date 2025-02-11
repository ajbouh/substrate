import { caps } from "./caps"
import { environment } from "./environment"
import { merge } from "./merge"
import { Msg } from "./msg"

export function sender(): (msg: Msg, data?: Msg) => Promise<any> {
  const root = environment(null, caps)
  // note that merge will always fully clone msg, so it is safe for caps to modify.
  return async (msg, data) => await root.apply(null, merge(msg, {data}) as any)
}

import { MsgBindings } from "./cap"
import { get, Pointer, set } from "./pointer"

export function pluck(bindings: MsgBindings | undefined, src: any) {
  return pluckInto(bindings, {}, src)
}

export function pluckInto(bindings: MsgBindings | undefined, dst: any, src: any) {
  if (bindings) {
    for (const dstPath in bindings) {
      const srcPath = bindings[dstPath]
      dst = set(dst, dstPath as Pointer, get(src, srcPath))
    }
  }
  return dst
}

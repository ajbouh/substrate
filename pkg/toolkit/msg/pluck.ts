import { MsgBindings } from "./cap.ts"
import { get, Pointer, set } from "./pointer.ts"

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

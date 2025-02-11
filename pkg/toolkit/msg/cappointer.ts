import type { Caps } from './cap.ts'
import { formatPointer, parsePointer, Pointer } from './pointer.ts'

export const CapPtr: Caps['ptr'] = async (env, msg: {cap: 'ptr'} &({pointer: Pointer} | {path: Array<string>})) => {
  if ('pointer' in msg) {
    return {...msg, path: parsePointer(msg.pointer)}
  }

  if ('path' in msg) {
    return {...msg, pointer: formatPointer(msg.path)}
  }

  throw new Error('must either specify pointer or path')
}

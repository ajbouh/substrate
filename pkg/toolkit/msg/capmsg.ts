import type { Caps } from './cap.ts'
import { pluckInto } from './pluck.ts'

export const CapMsg: Caps['msg'] = async (env, msg) => {
  msg = pluckInto(msg.pre ?? msg.msg_in, msg, msg)

  if (msg.msg) {
    msg = {
      ...msg,
      msg: await env.apply(env, msg.msg as any),
    }
  }
  
  return pluckInto(msg.ret ?? msg.msg_out, {}, msg)
}

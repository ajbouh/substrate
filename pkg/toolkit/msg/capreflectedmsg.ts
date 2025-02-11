import type { Caps } from './cap.ts'
import { Msg } from './msg.ts'

// Can we figure out how to write a cap as a sort of "syntactic sugar" that doesn't require recursion?
export const CapReflectedMsg: Caps['reflectedmsg'] = async (env, msg) => {
  return await env.apply(null, reflectedmsg(msg.url, msg.name, msg.data) as any)
}

export function reflectedmsg(url: string, name: string, data: Record<string, any>): Msg {
  return {
    cap: 'seq',
    tmp: { // for storage
      url,
      name,
      data,
    },
    ret: {
      '#': '#/seq/1/par/0',
    },
    seq: [
      {
        pre: {
          "#/par/0/url": '#/tmp/url',
          "#/par/1/path/2": '#/tmp/name',
        },
        var: {
          dataptr: '#/tmp/data',
        },
        par: {
          0: {cap: 'reflect'},
          1: {cap: 'ptr', path: ['tmp', 'msgindex', null]},
        },
        out: {
          '#/tmp/msgindex': '#/par/0/msgindex',
          '#/seq/1/pre/#~1par~10': '#/par/1/pointer',
          '#/seq/1/pre/#~1par~10~1data': '#/var/dataptr',
        },
      },
      {
        par: {
          0: null,
        },
      },
    ],
  }
}

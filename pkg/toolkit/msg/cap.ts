import { Msg } from "./msg.ts"
import { Pointer } from "./pointer.ts"

export type MsgBindings = Record<Pointer, Pointer>

export type MsgIndex = Record<string, Msg>

export type Cap<In extends Msg, Out extends Msg> = (env: Env, msg: In) => Promise<Out>

export type CapName = "http" | "reflectedmsg" | "msg" | "seq" | "reflect" | "ptr" | "with-urlbase" | "read-urlbase"

export type Caps = {
  [Name in CapName]: Cap<CapIn[Name], CapOut[Name]>
}

export interface Env {
  apply: <Name extends CapName, M extends CapIn[Name]>(env: Env | null, msg: M) => Promise<CapOut[M['cap']]>
  new: (caps: Partial<Caps>, signal?: AbortSignal) => Env
  get abortSignal(): AbortSignal
}

export type CapIn = {[Name in CapName]: Msg} & {
  // can be implemented in terms of msgs
  "msg": {
    cap: "msg"
    msg: Msg

    // deprecated: use "pre" instead
    msg_in?: MsgBindings

    // deprecated: use "ret" instead
    msg_out?: MsgBindings

    pre?: MsgBindings
    ret?: MsgBindings
  }
  // this handles sync, async, args, and races
  "seq": {
    cap: "seq"

    // for scratch
    tmp?: Record<string, any>

    // always copy these out
    ret: MsgBindings

    // timeout_ms?: number

    // do these in order until we hit a break
    seq: Array<{
      // set up msgs before applying them in parallel
      pre?: MsgBindings

      // each Msg under a name
      par?: Record<string, Msg>

      // timeout_ms?: number

      // if set, the first time we encounter `all` true pointers, use out and abort
      break?: Array<{
        and: Array<Pointer> // if all pointer exist and are non null, non-false
        out: MsgBindings // apply these msg bindings
      }>

      // always copy these out
      out: MsgBindings
    }>
  }
  "ptr": {cap: "ptr"} & ({
    path: Array<string>
  } | {
    pointer: Pointer
  }),
  "reflectedmsg": {
    cap: "reflectedmsg"
    url: string
    name: string
    parameters?: Record<string, any>
  }
  "reflect": {
    cap: "reflect"
    url: string
  }
  "with-urlbase": {
    cap: "with-urlbase"
    urlbase: string
    msg: Msg
  }
  "read-urlbase": {
    cap: "read-urlbase"
  }
  "http": {
    cap: "http"
    http: {
      request: {
        url: string
        method: string
        body ?: any
        headers ?: Record<string, string[]>
        query ?: Record<string, any>
        path ?: Record<string, any>
      }
    }
  }
}

export type CapOut = {[Name in CapName]: Msg} & {
  "msg": Msg
  "seq": Msg
  "ptr": {
    pointer: Pointer
    path: Array<string>
  }
  "reflectedmsg": Msg
  "reflect": CapIn["reflect"] & {
    msgindex: MsgIndex
  }
  "with-urlbase": Msg
  "read-urlbase": {
    urlbase: string | undefined
  }
  "http": CapIn["http"] & {
    http: {
      response: {
        status: number
        url: string
        headers: Record<string, string>
        body: any
      }
    }
  }
}

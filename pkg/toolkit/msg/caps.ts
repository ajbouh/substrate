import { Caps } from "./cap.ts";
import { CapHTTP, CapWithURLBase } from "./caphttp.ts";
import { CapMsg } from "./capmsg.ts";
import { CapSeq } from "./capseq.ts";
import { CapPtr } from "./cappointer.ts";
import { CapReflect } from "./capreflect.ts";
import { CapReflectedMsg } from "./capreflectedmsg.ts";

export const caps: Caps = {
  // core
  'http': CapHTTP,
  'ptr': CapPtr,
  'msg': CapMsg,
  'seq': CapSeq,

  'reflect': CapReflect,

  // internal, needed in practice but not part of external contract or compatibility guarantee
  'with-urlbase': CapWithURLBase,
  'read-urlbase': typeof document !== 'undefined'
      ? async (env, msg) => ({urlbase: document.baseURI})
      : async (env, msg) => ({urlbase: undefined}),

  // deprecated, to be replaced with syntactic sugar
  'reflectedmsg': CapReflectedMsg,
}

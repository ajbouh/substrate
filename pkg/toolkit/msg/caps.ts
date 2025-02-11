import { Caps } from "./cap";
import { CapHTTP, CapWithURLBase } from "./caphttp";
import { CapMsg } from "./capmsg";
import { CapSeq } from "./capseq";
import { CapPtr } from "./cappointer";
import { CapReflect } from "./capreflect";
import { CapReflectedMsg } from "./capreflectedmsg";

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

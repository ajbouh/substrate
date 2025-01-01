// @ts-ignore
import * as rpc from "../rpc/mod.ts";

export function methodProxy(caller: rpc.Caller): any {
  function pathBuilder(path: string, callable: (p: string, a: any[]) => any): CallableFunction {
    return new Proxy(Object.assign(() => {}, {path, callable}), {
      get(t: any, prop: string, rcvr: any) {
        if (prop.startsWith("__")) return Reflect.get(t, prop, rcvr);
        return pathBuilder(t.path ? `${t.path}.${prop}`: prop, t.callable);
      },
      apply(pc, thisArg, args = []) {
        return pc.callable(pc.path, args);
      }
    })
  }
  return pathBuilder("", caller.call.bind(caller));
}
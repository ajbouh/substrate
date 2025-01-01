// @ts-ignore
import * as rpc from "../rpc/mod.ts";

export function handlerFrom(v: any): rpc.Handler {
  if (v instanceof Function) {
    return handlerFromFunc(v);
  }
  return handlerFromObj(v);
}

function handlerFromObj(obj: any): rpc.Handler {
  const handler = new rpc.RespondMux();
  for (const prop of getObjectProps(obj)) {
    if (["constructor", "respondRPC"].includes(prop) || prop.startsWith("_")) {
      continue;
    }
    if (obj[prop] instanceof Function) {
      let h = handlerFromFunc(obj[prop], obj);
      if (obj[`_${prop}RPC`] instanceof Function) {
        h = {"respondRPC": obj[`_${prop}RPC`].bind(obj)};
      }
      handler.handle(prop, h);
    } else if (obj[prop] && obj[prop]["respondRPC"]) {
      // the property is itself already a handler (object)
      handler.handle(prop, obj[prop]);
    }
  }
  if (obj["respondRPC"]) {
    // if the obj implements respondRPC add it as the catchall
    handler.handle("/", obj);
  }
  return handler;
}

function handlerFromFunc(fn: Function, thisArg?: any): rpc.Handler {
  return rpc.HandlerFunc(async (r: rpc.Responder, c: rpc.Call) => {
    try {
      const ret = fn.apply(thisArg, await c.receive());
      if (ret instanceof Promise) {
        const v = await ret;
        r.return(v);
      } else {
        r.return(ret);
      }
    } catch (e: any) {
      if (typeof e === "string") {
        r.return(new Error(e));
        return;
      }
      r.return(e);
    }
  });
}

// gets own properties and those of all prototypes up to Object
function getObjectProps(v: any): string[] {
  const names = new Set<string>();
  Object.getOwnPropertyNames(v).forEach(n => names.add(n));
  for (let p = v ; p != null ; p = Object.getPrototypeOf(p)) {
    if (p.constructor.name !== "Object") {
      Object.getOwnPropertyNames(p).forEach(n => names.add(n));
    }
  }
  return [...names];
}
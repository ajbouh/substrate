// @ts-ignore
import * as rpc from "./mod.ts";

export interface Handler {
  respondRPC(r: rpc.Responder, c: rpc.Call): void;
}

export function HandlerFunc(fn: (r: rpc.Responder, c: rpc.Call) => void): Handler {
  return {respondRPC: fn}
}

export function NotFoundHandler(): Handler {
  return HandlerFunc((r: rpc.Responder, c: rpc.Call) => {
    r.return(new Error(`not found: ${c.selector}`));
  });
}

function cleanSelector(s: string): string {
  if (s === "") {
    return "/";
  }
  if (s[0] != "/") {
    s = "/"+s;
  }
  s = s.replace(".", "/");
  return s.toLowerCase();
}


interface Matcher {
  match(selector: string): Handler|null;
}

export class RespondMux {
  handlers: {[index: string]: Handler};

  constructor() {
    this.handlers = {};
  }

  async respondRPC(r: rpc.Responder, c: rpc.Call) {
    const h = this.handler(c);
    await h.respondRPC(r, c);
  }

  handler(c: rpc.Call): Handler {
    const h = this.match(c.selector);
    if (!h) {
      return NotFoundHandler();
    }
    return h;
  }

  remove(selector: string): Handler|null {
    selector = cleanSelector(selector);
    const h = this.match(selector);
    delete this.handlers[selector];
    return h || null;
  }

  match(selector: string): Handler|null {
    selector = cleanSelector(selector);

    if (this.handlers.hasOwnProperty(selector)) {
      return this.handlers[selector];
    }

    const patterns = Object.keys(this.handlers).filter(pattern => pattern.endsWith("/"))
    patterns.sort((a, b) => b.length - a.length);
    for (const pattern of patterns) {
      if (selector.startsWith(pattern)) {
        const handler = this.handlers[pattern];
        const matcher = handler as unknown as Matcher;
        if (matcher.match && matcher.match instanceof Function) {
          return matcher.match(selector.slice(pattern.length));
        }
        return handler;
      }
    }

    return null;
  }

  handle(selector: string, handler: Handler) {
    if (selector === "") {
      throw "handle: invalid selector";
    }
    let pattern = cleanSelector(selector);
    const matcher = handler as unknown as Matcher;
    if (matcher["match"] && matcher["match"] instanceof Function && !pattern.endsWith("/")) {
      pattern = pattern + "/";
    }

    if (!handler) {
      throw "handle: invalid handler";
    }
    if (this.match(pattern)) {
      throw "handle: selector already registered";
    }
    this.handlers[pattern] = handler;
  }
}


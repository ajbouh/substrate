// /spaceview;space=image:source/esbuild/pkg/toolkit/msg
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// caphttp.ts
async function demandResponseIsOK(response) {
  if (!response.ok) {
    throw new Error(`response is not ok; status="${response.status} ${response.statusText}"; body=${JSON.stringify(await response.text())}`);
  }
}
__name(demandResponseIsOK, "demandResponseIsOK");
var CapWithURLBase = /* @__PURE__ */ __name(async (env, msg) => {
  const urlbase = msg.urlbase;
  return env.new({
    "read-urlbase": /* @__PURE__ */ __name(async (env2, msg2) => ({ urlbase }), "read-urlbase")
  }).apply(null, {
    ...msg,
    cap: "msg"
  });
}, "CapWithURLBase");
var CapHTTP = /* @__PURE__ */ __name(async (env, msg) => {
  const { http: { request } } = msg;
  let { method, body, headers, query, path, url } = request;
  let input = url;
  if (path) {
    const pathEntries = Object.entries(path);
    if (pathEntries.length > 0) {
      for (const [k, v] of pathEntries) {
        if (v == null) {
          throw new Error(`got null path segment for {${k}}; url=${url}; request=${JSON.stringify(request)}`);
        }
        let t = `{${k}}`;
        if (input.includes(t)) {
          input = input.replaceAll(t, encodeURIComponent(v));
        }
        t = `{${k}...}`;
        if (input.includes(t)) {
          input = input.replaceAll(t, v);
        }
      }
    }
  }
  const {
    urlbase
  } = await env.apply(null, { cap: "read-urlbase" });
  input = new URL(input, urlbase).toString();
  if (query) {
    const queryEntries = Object.entries(query);
    if (queryEntries.length > 0) {
      const u = new URL(input);
      for (const [k, v] of queryEntries) {
        if (v == null) {
          continue;
        }
        u.searchParams.set(k, v);
      }
      input = u.toString();
    }
  }
  const headersEntries = Object.entries(headers || {}).flatMap(([k, vs]) => vs.map((v) => [k, v]));
  let init = {
    method,
    headers: headersEntries
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  const returns = /* @__PURE__ */ __name(async (d) => {
    await demandResponseIsOK(d);
    return {
      status: d.status,
      url: d.url,
      headers: Object.fromEntries(Array.from(d.headers.entries())),
      body: await d.json()
    };
  }, "returns");
  return {
    ...msg,
    http: {
      ...msg.http,
      response: await returns(await fetch(input, init))
    }
  };
}, "CapHTTP");

// merge.ts
function mergeInPlace(dst, src, keypath = () => []) {
  if (src !== void 0) {
    if (typeof src !== `object`) {
      throw new Error(`cannot merge keypath=${JSON.stringify([...keypath()])} dst=${JSON.stringify(dst)}; src=${JSON.stringify(src)}`);
    }
    for (let [key, srcVal] of Object.entries(src)) {
      const dstVal = dst[key];
      if (dstVal !== void 0) {
        srcVal = mergeInPlace(dstVal, srcVal, () => [...keypath(), key]);
      }
      dst[key] = srcVal;
    }
  }
  return dst;
}
__name(mergeInPlace, "mergeInPlace");
function merge(dst, src) {
  return mergeInPlace(dst ? clone(dst) : {}, src);
}
__name(merge, "merge");
function clone(o) {
  return structuredClone(o);
}
__name(clone, "clone");

// pointer.ts
function parsePointer(p) {
  if (p[0] !== "#" || p.length > 1 && p[1] !== "/") {
    throw new Error(`invalid pointer, must start with "#/", got: ${p}`);
  }
  return p.substring(2).split("/").map((s) => s.replaceAll("~1", "/").replaceAll("~0", "~"));
}
__name(parsePointer, "parsePointer");
function formatPointer(p) {
  return `#/${p.map((s) => s.replaceAll("~", "~0").replaceAll("/", "~1")).join("/")}`;
}
__name(formatPointer, "formatPointer");
function get(o, path) {
  const fragments = parsePointer(path);
  return getPath(o, fragments);
}
__name(get, "get");
function getPath(o, fragments) {
  const v = fragments.reduce(
    (acc, fragment) => fragment !== void 0 ? acc && (Array.isArray(acc) ? acc[+fragment] : acc[fragment]) : acc,
    o
  );
  return v;
}
__name(getPath, "getPath");
function set(r, path, v) {
  const fragments = parsePointer(path);
  return setPath(r, fragments, v);
}
__name(set, "set");
function setPath(r, fragments, v) {
  const last = fragments[fragments.length - 1];
  if (fragments.length === 1 && last === "") {
    return mergeInPlace(r, v);
  }
  let o = r;
  for (const fragment of fragments.slice(0, fragments.length - 1)) {
    if (o === void 0 && v === void 0) {
      return;
    }
    if (!(fragment in o)) {
      o[fragment] = /^[0-9]/.test(fragment) ? [] : {};
    }
    o = o[fragment];
  }
  if (o === void 0 && v === void 0) {
    return;
  }
  const tv = typeof v;
  if (v !== void 0) {
    const ol = o[last];
    if (ol != null && typeof ol === "object" && tv === "object") {
      mergeInPlace(ol, v);
    } else {
      o[last] = v;
    }
  }
  return r;
}
__name(setPath, "setPath");

// pluck.ts
function pluck(bindings, src) {
  return pluckInto(bindings, {}, src);
}
__name(pluck, "pluck");
function pluckInto(bindings, dst, src) {
  if (bindings) {
    for (const dstPath in bindings) {
      const srcPath = bindings[dstPath];
      dst = set(dst, dstPath, get(src, srcPath));
    }
  }
  return dst;
}
__name(pluckInto, "pluckInto");

// capmsg.ts
var CapMsg = /* @__PURE__ */ __name(async (env, msg) => {
  msg = pluckInto(msg.pre ?? msg.msg_in, msg, msg);
  if (msg.msg) {
    msg = {
      ...msg,
      msg: await env.apply(env, msg.msg)
    };
  }
  return pluckInto(msg.ret ?? msg.msg_out, {}, msg);
}, "CapMsg");

// capseq.ts
var CapSeq = /* @__PURE__ */ __name(async (env, msg) => {
  for (let i = 0; i < msg.seq.length; ++i) {
    let step = msg.seq[i];
    msg.seq[i] = step = pluckInto(step.pre, step, msg);
    if (step.par) {
      const batchEntries = Object.entries(step.par);
      let batchEnv = env;
      let batchAbort = new AbortController();
      if (batchEntries.length > 1) {
        batchEnv = env.new({}, batchAbort.signal);
      }
      let remaining = new Map(batchEntries.map(
        ([taskName, taskMsg]) => [taskName, batchEnv.apply(null, taskMsg).then((v) => [taskName, v])]
      ));
      while (remaining.size > 0) {
        const [taskName, taskOut] = await Promise.race(remaining.values());
        remaining.delete(taskName);
        step.par[taskName] = taskOut;
        if (step.break) {
          const brks = step.break.filter(({ and }) => and.every((p) => get(step, p)));
          if (brks.length) {
            for (const brk of brks) {
              if (brk.out) {
                msg = pluckInto(brk.out, msg, step);
              }
            }
            if (batchAbort) {
              batchAbort.abort("msgs break");
            }
            break;
          }
        }
      }
    }
    if (step.out) {
      msg = pluckInto(step.out, msg, step);
    }
  }
  return pluckInto(msg.ret, {}, msg);
}, "CapSeq");

// cappointer.ts
var CapPtr = /* @__PURE__ */ __name(async (env, msg) => {
  if ("pointer" in msg) {
    return { ...msg, path: parsePointer(msg.pointer) };
  }
  if ("path" in msg) {
    return { ...msg, pointer: formatPointer(msg.path) };
  }
  throw new Error("must either specify pointer or path");
}, "CapPtr");

// http/linkheader.ts
var MAX_HEADER_LENGTH = 2e3;
var THROW_ON_MAX_HEADER_LENGTH_EXCEEDED = false;
function createObjects(acc, p) {
  const m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
  if (m) acc[m[1]] = m[2];
  return acc;
}
__name(createObjects, "createObjects");
function parseLink(link) {
  try {
    const m = link.match(/<?([^>]*)>(.*)/);
    if (!m) {
      return null;
    }
    const linkUrl = m[1];
    const parts = m[2].split(";");
    parts.shift();
    const info = parts.reduce(createObjects, {});
    info.url = linkUrl;
    return info;
  } catch {
    return null;
  }
}
__name(parseLink, "parseLink");
function checkHeader(linkHeader, options) {
  if (!linkHeader) return false;
  options = options || {};
  const maxHeaderLength = options.maxHeaderLength || MAX_HEADER_LENGTH;
  const throwOnMaxHeaderLengthExceeded = options.throwOnMaxHeaderLengthExceeded || THROW_ON_MAX_HEADER_LENGTH_EXCEEDED;
  if (linkHeader.length > maxHeaderLength) {
    if (throwOnMaxHeaderLengthExceeded) {
      throw new Error("Input string too long, it should be under " + maxHeaderLength + " characters.");
    } else {
      return false;
    }
  }
  return true;
}
__name(checkHeader, "checkHeader");
function parseLinkHeader(linkHeader, options) {
  if (!checkHeader(linkHeader, options)) return null;
  return linkHeader.split(/,\s*</).map(parseLink).filter((o) => o !== null);
}
__name(parseLinkHeader, "parseLinkHeader");

// capreflect.ts
var ReflectionWalk = class {
  constructor(env) {
    this.env = env;
    this.reflections = /* @__PURE__ */ new Map();
    this.causes = /* @__PURE__ */ new Map();
  }
  static {
    __name(this, "ReflectionWalk");
  }
  reflections;
  causes;
  recordCause(url, causeURL, causedLink) {
    let map = this.causes.get(url);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      this.causes.set(url, map);
    }
    map.set(causeURL, causedLink);
  }
  async reflect(url) {
    if (this.reflections.has(url)) {
      return await this.reflections.get(url);
    }
    const r = this.reflect0(url).then(async (reflection) => {
      if (reflection.links) {
        await Promise.all(reflection.links.map(async (link) => {
          if (link.rel === "reflect" && link.url) {
            this.recordCause(link.url, url, link);
            await this.reflect(link.url);
          }
        }));
      }
      return reflection;
    });
    this.reflections.set(url, r);
    return r;
  }
  async reflect0(url) {
    const {
      http: {
        response: {
          headers,
          url: responseURL,
          body: {
            commands: msgindex
          }
        }
      }
    } = await this.env.apply(this.env, {
      cap: "http",
      http: {
        request: {
          method: "REFLECT",
          url
        }
      }
    });
    for (const k in msgindex) {
      msgindex[k] = {
        cap: "with-urlbase",
        urlbase: responseURL,
        msg: msgindex[k],
        pre: {
          "#/msg/data": "#/data"
        },
        ret: {
          "#": "#/msg"
        }
      };
    }
    return {
      links: parseLinkHeader(headers["Link"]),
      msgindex
    };
  }
};
var CapReflect = /* @__PURE__ */ __name(async (env, msg) => {
  const walk = new ReflectionWalk(env);
  return { ...msg, ...await walk.reflect(msg.url) };
}, "CapReflect");

// capreflectedmsg.ts
var CapReflectedMsg = /* @__PURE__ */ __name(async (env, msg) => {
  return await env.apply(null, reflectedmsg(msg));
}, "CapReflectedMsg");
function reflectedmsg({ url, name, data }) {
  return {
    cap: "seq",
    tmp: {
      // for storage
      url,
      name,
      data
    },
    ret: {
      "#": "#/seq/1/par/0"
    },
    seq: [
      {
        pre: {
          "#/par/0/url": "#/tmp/url",
          "#/par/1/path/2": "#/tmp/name"
        },
        var: {
          dataptr: "#/tmp/data"
        },
        par: {
          0: { cap: "reflect" },
          1: { cap: "ptr", path: ["tmp", "msgindex", null] }
        },
        out: {
          "#/tmp/msgindex": "#/par/0/msgindex",
          "#/seq/1/pre/#~1par~10": "#/par/1/pointer",
          "#/seq/1/pre/#~1par~10~1data": "#/var/dataptr"
        }
      },
      {
        par: {
          0: null
        }
      }
    ]
  };
}
__name(reflectedmsg, "reflectedmsg");

// caps.ts
var caps = {
  // core
  "http": CapHTTP,
  "ptr": CapPtr,
  "msg": CapMsg,
  "seq": CapSeq,
  "reflect": CapReflect,
  // internal, needed in practice but not part of external contract or compatibility guarantee
  "with-urlbase": CapWithURLBase,
  "read-urlbase": typeof document !== "undefined" ? async (env, msg) => ({ urlbase: document.baseURI }) : async (env, msg) => ({ urlbase: void 0 }),
  // deprecated, to be replaced with syntactic sugar
  "reflectedmsg": CapReflectedMsg
};

// environment.ts
function environment(parent, caps2 = {}, abortSignal) {
  if (!parent && !abortSignal) {
    abortSignal = new AbortController().signal;
  }
  return {
    get abortSignal() {
      if (!abortSignal && parent) {
        return parent.abortSignal;
      }
      return abortSignal;
    },
    new(caps3, abortSignal2) {
      return environment(this, caps3, abortSignal2);
    },
    async apply(env, msg) {
      if (!env) {
        env = this;
      }
      const capname = msg.cap;
      if (capname) {
        const cap = caps2[capname];
        if (cap) {
          const result = await cap(env, msg);
          return result;
        }
      }
      if (parent) {
        return await parent.apply(env, msg);
      }
      throw new Error(`cannot run: unknown capability, top-level caps: ${Object.keys(caps2)}; cap=${msg.cap}; msg=${JSON.stringify(msg)}`);
    }
  };
}
__name(environment, "environment");

// sender.ts
function sender() {
  const root = environment(null, caps);
  return async (msg, data) => await root.apply(null, merge(msg, { data }));
}
__name(sender, "sender");

// reflect.ts
async function reflect(url) {
  const { msgindex } = await sender()({ cap: "reflect", url });
  return msgindex;
}
__name(reflect, "reflect");
export {
  formatPointer,
  get,
  getPath,
  pluck,
  pluckInto,
  reflect,
  reflectedmsg,
  sender,
  set,
  setPath
};

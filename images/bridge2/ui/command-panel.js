var Nn = Object.defineProperty;
var Rt = (e) => {
  throw TypeError(e);
};
var Ln = (e, t, n) => t in e ? Nn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Y = (e, t, n) => Ln(e, typeof t != "symbol" ? t + "" : t, n), Nt = (e, t, n) => t.has(e) || Rt("Cannot " + n);
var q = (e, t, n) => (Nt(e, t, "read from private field"), n ? n.call(e) : t.get(e)), tt = (e, t, n) => t.has(e) ? Rt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), nt = (e, t, n, r) => (Nt(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
const qn = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(qn);
const Oe = 1, pt = 2, Dn = 4, Wt = 8, In = 16, st = 64, Pn = 2, Mn = 2, zt = "[", gt = "[!", wt = "]", He = {}, ke = Symbol(), Fn = ["touchstart", "touchmove", "touchend"];
function Jt(e) {
  console.warn("hydration_mismatch");
}
let y = !1;
function J(e) {
  y = e;
}
let x;
function Z(e) {
  return x = e;
}
function De() {
  if (x === null)
    throw Jt(), He;
  return x = /** @type {TemplateNode} */
  x.nextSibling;
}
function V(e) {
  y && (x = e);
}
function ut() {
  for (var e = 0, t = x; ; ) {
    if (t.nodeType === 8) {
      var n = (
        /** @type {Comment} */
        t.data
      );
      if (n === wt) {
        if (e === 0) return t;
        e -= 1;
      } else (n === zt || n === gt) && (e += 1);
    }
    var r = (
      /** @type {TemplateNode} */
      t.nextSibling
    );
    t.remove(), t = r;
  }
}
const fe = 2, Gt = 4, Ie = 8, Zt = 16, W = 32, yt = 64, be = 128, Ve = 256, j = 512, re = 1024, Ee = 2048, ae = 4096, xe = 8192, Hn = 16384, bt = 32768, Bn = 1 << 18, D = Symbol("$state"), Qt = Symbol("$state.frozen"), Yn = Symbol("");
var Et = Array.isArray, jn = Array.from, Ke = Object.keys, Xt = Object.isFrozen, Re = Object.defineProperty, ot = Object.getOwnPropertyDescriptor, Un = Object.prototype, Vn = Array.prototype, Kn = Object.getPrototypeOf;
const Wn = () => {
};
function zn(e) {
  return typeof (e == null ? void 0 : e.then) == "function";
}
function en(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
const Jn = typeof requestIdleCallback > "u" ? (e) => setTimeout(e, 1) : requestIdleCallback;
let We = !1, ze = !1, ft = [], at = [];
function tn() {
  We = !1;
  const e = ft.slice();
  ft = [], en(e);
}
function nn() {
  ze = !1;
  const e = at.slice();
  at = [], en(e);
}
function xt(e) {
  We || (We = !0, queueMicrotask(tn)), ft.push(e);
}
function Gn(e) {
  ze || (ze = !0, Jn(nn)), at.push(e);
}
function Zn() {
  We && tn(), ze && nn();
}
function rn(e) {
  return e === this.v;
}
function Qn(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Xn(e) {
  return !Qn(e, this.v);
}
function er() {
  throw new Error("effect_update_depth_exceeded");
}
function tr() {
  throw new Error("hydration_failed");
}
function nr(e) {
  throw new Error("props_invalid_value");
}
function rr() {
  throw new Error("state_unsafe_mutation");
}
// @__NO_SIDE_EFFECTS__
function H(e) {
  return {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: rn,
    version: 0
  };
}
// @__NO_SIDE_EFFECTS__
function Ne(e) {
  var n;
  const t = /* @__PURE__ */ H(e);
  return t.equals = Xn, L !== null && L.l !== null && ((n = L.l).s ?? (n.s = [])).push(t), t;
}
function N(e, t) {
  return A !== null && Ge() && A.f & fe && rr(), e.equals(t) || (e.v = t, e.version = an(), ln(e, re), Ge() && b !== null && b.f & j && !(b.f & W) && (S !== null && S.includes(e) ? (B(b, re), Xe(b)) : ne === null ? sr([e]) : ne.push(e))), t;
}
function ln(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = Ge(), i = n.length, l = 0; l < i; l++) {
      var s = n[l], u = s.f;
      u & re || !r && s === b || (B(s, t), u & (j | be) && (u & fe ? ln(
        /** @type {Derived} */
        s,
        Ee
      ) : Xe(
        /** @type {Effect} */
        s
      )));
    }
}
// @__NO_SIDE_EFFECTS__
function pe(e) {
  let t = fe | re;
  b === null && (t |= be);
  const n = {
    deps: null,
    deriveds: null,
    equals: rn,
    f: t,
    first: null,
    fn: e,
    last: null,
    reactions: null,
    v: (
      /** @type {V} */
      null
    ),
    version: 0
  };
  if (A !== null && A.f & fe) {
    var r = (
      /** @type {Derived} */
      A
    );
    r.deriveds === null ? r.deriveds = [n] : r.deriveds.push(n);
  }
  return n;
}
function sn(e) {
  Ct(e);
  var t = e.deriveds;
  if (t !== null) {
    e.deriveds = null;
    for (var n = 0; n < t.length; n += 1)
      ir(t[n]);
  }
}
function un(e) {
  sn(e);
  var t = cn(e), n = ($e || e.f & be) && e.deps !== null ? Ee : j;
  B(e, n), e.equals(t) || (e.v = t, e.version = an());
}
function ir(e) {
  sn(e), Ze(e, 0), B(e, xe), e.first = e.last = e.deps = e.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
  e.fn = null;
}
const on = 0, lr = 1;
let Be = on, Le = !1, ge = !1;
function Lt(e) {
  ge = e;
}
let se = [], we = 0, A = null;
function Je(e) {
  A = e;
}
let b = null;
function qt(e) {
  b = e;
}
let S = null, R = 0, ne = null;
function sr(e) {
  ne = e;
}
let fn = 0, $e = !1, L = null;
function Dt(e) {
  L = e;
}
function an() {
  return fn++;
}
function Ge() {
  return L !== null && L.l === null;
}
function Pe(e) {
  var s, u;
  var t = e.f;
  if (t & re)
    return !0;
  if (t & Ee) {
    var n = e.deps;
    if (n !== null) {
      var r = (t & be) !== 0, i;
      if (t & Ve) {
        for (i = 0; i < n.length; i++)
          ((s = n[i]).reactions ?? (s.reactions = [])).push(e);
        e.f ^= Ve;
      }
      for (i = 0; i < n.length; i++) {
        var l = n[i];
        if (Pe(
          /** @type {Derived} */
          l
        ) && un(
          /** @type {Derived} */
          l
        ), l.version > e.version)
          return !0;
        r && !$e && !((u = l == null ? void 0 : l.reactions) != null && u.includes(e)) && (l.reactions ?? (l.reactions = [])).push(e);
      }
    }
    B(e, j);
  }
  return !1;
}
function ur(e, t, n) {
  throw e;
}
function cn(e) {
  var t = S, n = R, r = ne, i = A, l = $e;
  S = /** @type {null | Value[]} */
  null, R = 0, ne = null, A = e.f & (W | yt) ? null : e, $e = !ge && (e.f & be) !== 0;
  try {
    var s = (
      /** @type {Function} */
      (0, e.fn)()
    ), u = e.deps;
    if (S !== null) {
      var o, f;
      if (u !== null) {
        var c = R === 0 ? S : u.slice(0, R).concat(S), a = c.length > 16 ? new Set(c) : null;
        for (f = R; f < u.length; f++)
          o = u[f], (a !== null ? !a.has(o) : !c.includes(o)) && dn(e, o);
      }
      if (u !== null && R > 0)
        for (u.length = R + S.length, f = 0; f < S.length; f++)
          u[R + f] = S[f];
      else
        e.deps = u = S;
      if (!$e)
        for (f = R; f < u.length; f++) {
          o = u[f];
          var v = o.reactions;
          v === null ? o.reactions = [e] : v[v.length - 1] !== e && !v.includes(e) && v.push(e);
        }
    } else u !== null && R < u.length && (Ze(e, R), u.length = R);
    return s;
  } finally {
    S = t, R = n, ne = r, A = i, $e = l;
  }
}
function dn(e, t) {
  const n = t.reactions;
  let r = 0;
  if (n !== null) {
    r = n.length - 1;
    const i = n.indexOf(e);
    i !== -1 && (r === 0 ? t.reactions = null : (n[i] = n[r], n.pop()));
  }
  r === 0 && t.f & fe && (B(t, Ee), t.f & (be | Ve) || (t.f ^= Ve), Ze(
    /** @type {Derived} **/
    t,
    0
  ));
}
function Ze(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t === 0 ? null : n.slice(0, t), i = /* @__PURE__ */ new Set(), l = t; l < n.length; l++) {
      var s = n[l];
      i.has(s) || (i.add(s), (r === null || !r.includes(s)) && dn(e, s));
    }
}
function Ct(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    var r = n.next;
    Te(n, t), n = r;
  }
}
function Qe(e) {
  var t = e.f;
  if (!(t & xe)) {
    B(e, j);
    var n = e.ctx, r = b, i = L;
    b = e, L = n;
    try {
      t & Zt || Ct(e), $n(e);
      var l = cn(e);
      e.teardown = typeof l == "function" ? l : null, e.version = fn;
    } catch (s) {
      ur(
        /** @type {Error} */
        s
      );
    } finally {
      b = r, L = i;
    }
  }
}
function vn() {
  we > 1e3 && (we = 0, er()), we++;
}
function _n(e) {
  var t = e.length;
  if (t !== 0) {
    vn();
    var n = ge;
    ge = !0;
    try {
      for (var r = 0; r < t; r++) {
        var i = e[r];
        if (i.first === null && !(i.f & W))
          It([i]);
        else {
          var l = [];
          hn(i, l), It(l);
        }
      }
    } finally {
      ge = n;
    }
  }
}
function It(e) {
  var t = e.length;
  if (t !== 0)
    for (var n = 0; n < t; n++) {
      var r = e[n];
      !(r.f & (xe | ae)) && Pe(r) && (Qe(r), r.deps === null && r.first === null && r.nodes === null && (r.teardown === null ? mn(r) : r.fn = null));
    }
}
function or() {
  if (Le = !1, we > 1001)
    return;
  const e = se;
  se = [], _n(e), Le || (we = 0);
}
function Xe(e) {
  Be === on && (Le || (Le = !0, queueMicrotask(or)));
  for (var t = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (n & W) {
      if (!(n & j)) return;
      B(t, Ee);
    }
  }
  se.push(t);
}
function hn(e, t) {
  var n = e.first, r = [];
  e: for (; n !== null; ) {
    var i = n.f, l = (i & (xe | ae)) === 0, s = i & W, u = (i & j) !== 0, o = n.first;
    if (l && (!s || !u)) {
      if (s && B(n, j), i & Ie) {
        if (!s && Pe(n) && (Qe(n), o = n.first), o !== null) {
          n = o;
          continue;
        }
      } else if (i & Gt)
        if (s || u) {
          if (o !== null) {
            n = o;
            continue;
          }
        } else
          r.push(n);
    }
    var f = n.next;
    if (f === null) {
      let v = n.parent;
      for (; v !== null; ) {
        if (e === v)
          break e;
        var c = v.next;
        if (c !== null) {
          n = c;
          continue e;
        }
        v = v.parent;
      }
    }
    n = f;
  }
  for (var a = 0; a < r.length; a++)
    o = r[a], t.push(o), hn(o, t);
}
function ue(e) {
  var t = Be, n = se;
  try {
    vn();
    const i = [];
    Be = lr, se = i, Le = !1, _n(n);
    var r = e == null ? void 0 : e();
    return Zn(), (se.length > 0 || i.length > 0) && ue(), we = 0, r;
  } finally {
    Be = t, se = n;
  }
}
function p(e) {
  var t = e.f;
  if (t & xe)
    return e.v;
  if (A !== null) {
    var n = A.deps;
    S === null && n !== null && n[R] === e ? R++ : (n === null || R === 0 || n[R - 1] !== e) && (S === null ? S = [e] : S[S.length - 1] !== e && S.push(e)), ne !== null && b !== null && b.f & j && !(b.f & W) && ne.includes(e) && (B(b, re), Xe(b));
  }
  if (t & fe) {
    var r = (
      /** @type {Derived} */
      e
    );
    Pe(r) && un(r);
  }
  return e.v;
}
function fr(e) {
  const t = A;
  try {
    return A = null, e();
  } finally {
    A = t;
  }
}
const ar = ~(re | Ee | j);
function B(e, t) {
  e.f = e.f & ar | t;
}
function cr(e) {
  return typeof e == "object" && e !== null && typeof /** @type {Value<V>} */
  e.f == "number";
}
function Tt(e, t = !1, n) {
  L = {
    p: L,
    c: null,
    e: null,
    m: !1,
    s: e,
    x: null,
    l: null
  }, t || (L.l = {
    s: null,
    u: null,
    r1: [],
    r2: /* @__PURE__ */ H(!1)
  });
}
function kt(e) {
  const t = L;
  if (t !== null) {
    e !== void 0 && (t.x = e);
    const r = t.e;
    if (r !== null) {
      t.e = null;
      for (var n = 0; n < r.length; n++)
        _r(r[n]);
    }
    L = t.p, t.m = !0;
  }
  return e || /** @type {T} */
  {};
}
function k(e) {
  return cr(e) ? p(e) : e;
}
function Pt(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Ce(e, t, n, r = !0) {
  var i = (e & yt) !== 0, l = {
    ctx: L,
    deps: null,
    nodes: null,
    f: e | re,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: i ? null : b,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (n) {
    var s = ge;
    try {
      Lt(!0), Qe(l), l.f |= Hn;
    } catch (o) {
      throw Te(l), o;
    } finally {
      Lt(s);
    }
  } else t !== null && Xe(l);
  var u = n && l.deps === null && l.first === null && l.nodes === null && l.teardown === null;
  return !u && !i && r && (b !== null && Pt(l, b), A !== null && A.f & fe && Pt(l, A)), l;
}
function dr(e) {
  const t = Ce(Ie, null, !1);
  return B(t, j), t.teardown = e, t;
}
function vr(e) {
  const t = Ce(yt, e, !0);
  return () => {
    Te(t);
  };
}
function _r(e) {
  return Ce(Gt, e, !1);
}
function et(e) {
  return Ce(Ie, e, !0);
}
function me(e) {
  return et(e);
}
function St(e, t = 0) {
  return Ce(Ie | Zt | t, e, !0);
}
function G(e, t = !0) {
  return Ce(Ie | W, e, !0, t);
}
function $n(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = A;
    Je(null);
    try {
      t.call(null);
    } finally {
      Je(n);
    }
  }
}
function Te(e, t = !0) {
  var n = !1;
  if ((t || e.f & Bn) && e.nodes !== null) {
    for (var r = e.nodes.start, i = e.nodes.end; r !== null; ) {
      var l = r === i ? null : (
        /** @type {TemplateNode} */
        r.nextSibling
      );
      r.remove(), r = l;
    }
    n = !0;
  }
  if (Ct(e, t && !n), Ze(e, 0), B(e, xe), e.transitions)
    for (const u of e.transitions)
      u.stop();
  $n(e);
  var s = e.parent;
  s !== null && e.f & W && s.first !== null && mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.parent = e.fn = e.nodes = null;
}
function mn(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function ye(e, t) {
  var n = [];
  At(e, n, !0), pn(n, () => {
    Te(e), t && t();
  });
}
function pn(e, t) {
  var n = e.length;
  if (n > 0) {
    var r = () => --n || t();
    for (var i of e)
      i.out(r);
  } else
    t();
}
function At(e, t, n) {
  if (!(e.f & ae)) {
    if (e.f ^= ae, e.transitions !== null)
      for (const s of e.transitions)
        (s.is_global || n) && t.push(s);
    for (var r = e.first; r !== null; ) {
      var i = r.next, l = (r.f & bt) !== 0 || (r.f & W) !== 0;
      At(r, t, l ? n : !1), r = i;
    }
  }
}
function oe(e) {
  gn(e, !0);
}
function gn(e, t) {
  if (e.f & ae) {
    e.f ^= ae, Pe(e) && Qe(e);
    for (var n = e.first; n !== null; ) {
      var r = n.next, i = (n.f & bt) !== 0 || (n.f & W) !== 0;
      gn(n, i ? t : !1), n = r;
    }
    if (e.transitions !== null)
      for (const l of e.transitions)
        (l.is_global || t) && l.in();
  }
}
function Se(e, t = null, n) {
  if (typeof e == "object" && e != null && !Xt(e) && !(Qt in e)) {
    if (D in e) {
      const i = (
        /** @type {ProxyMetadata<T>} */
        e[D]
      );
      if (i.t === e || i.p === e)
        return i.p;
    }
    const r = Kn(e);
    if (r === Un || r === Vn) {
      const i = new Proxy(e, hr);
      return Re(e, D, {
        value: (
          /** @type {ProxyMetadata} */
          {
            s: /* @__PURE__ */ new Map(),
            v: /* @__PURE__ */ H(0),
            a: Et(e),
            p: i,
            t: e
          }
        ),
        writable: !0,
        enumerable: !1
      }), i;
    }
  }
  return e;
}
function Mt(e, t = 1) {
  N(e, e.v + t);
}
const hr = {
  defineProperty(e, t, n) {
    if (n.value) {
      const r = e[D], i = r.s.get(t);
      i !== void 0 && N(i, Se(n.value, r));
    }
    return Reflect.defineProperty(e, t, n);
  },
  deleteProperty(e, t) {
    const n = e[D], r = n.s.get(t), i = n.a, l = delete e[t];
    if (i && l) {
      const s = n.s.get("length"), u = e.length - 1;
      s !== void 0 && s.v !== u && N(s, u);
    }
    return r !== void 0 && N(r, ke), l && Mt(n.v), l;
  },
  get(e, t, n) {
    var l;
    if (t === D)
      return Reflect.get(e, D);
    const r = e[D];
    let i = r.s.get(t);
    if (i === void 0 && (!(t in e) || (l = ot(e, t)) != null && l.writable) && (i = /* @__PURE__ */ H(Se(e[t], r)), r.s.set(t, i)), i !== void 0) {
      const s = p(i);
      return s === ke ? void 0 : s;
    }
    return Reflect.get(e, t, n);
  },
  getOwnPropertyDescriptor(e, t) {
    const n = Reflect.getOwnPropertyDescriptor(e, t);
    if (n && "value" in n) {
      const i = e[D].s.get(t);
      i && (n.value = p(i));
    }
    return n;
  },
  has(e, t) {
    var l;
    if (t === D)
      return !0;
    const n = e[D], r = Reflect.has(e, t);
    let i = n.s.get(t);
    return (i !== void 0 || b !== null && (!r || (l = ot(e, t)) != null && l.writable)) && (i === void 0 && (i = /* @__PURE__ */ H(r ? Se(e[t], n) : ke), n.s.set(t, i)), p(i) === ke) ? !1 : r;
  },
  set(e, t, n, r) {
    const i = e[D];
    let l = i.s.get(t);
    l === void 0 && (fr(() => r[t]), l = i.s.get(t)), l !== void 0 && N(l, Se(n, i));
    const s = i.a, u = !(t in e);
    if (s && t === "length")
      for (let f = n; f < e.length; f += 1) {
        const c = i.s.get(f + "");
        c !== void 0 && N(c, ke);
      }
    var o = Reflect.getOwnPropertyDescriptor(e, t);
    if (o != null && o.set ? o.set.call(r, n) : e[t] = n, u) {
      if (s) {
        const f = i.s.get("length"), c = e.length;
        f !== void 0 && f.v !== c && N(f, c);
      }
      Mt(i.v);
    }
    return !0;
  },
  ownKeys(e) {
    const t = e[D];
    return p(t.v), Reflect.ownKeys(e);
  }
};
var Ft;
function wn() {
  if (Ft === void 0) {
    Ft = window;
    var e = Element.prototype;
    e.__click = void 0, e.__className = "", e.__attributes = null, e.__e = void 0, Text.prototype.__t = void 0;
  }
}
function Me() {
  return document.createTextNode("");
}
function K(e) {
  if (!y)
    return e.firstChild;
  var t = (
    /** @type {TemplateNode} */
    x.firstChild
  );
  return t === null && (t = x.appendChild(Me())), Z(t), t;
}
function ct(e, t) {
  if (!y) {
    var n = (
      /** @type {DocumentFragment} */
      e.firstChild
    );
    return n instanceof Comment && n.data === "" ? n.nextSibling : n;
  }
  return x;
}
function O(e, t = !1) {
  if (!y)
    return (
      /** @type {TemplateNode} */
      e.nextSibling
    );
  var n = (
    /** @type {TemplateNode} */
    x.nextSibling
  ), r = n.nodeType;
  if (t && r !== 3) {
    var i = Me();
    return n == null || n.before(i), Z(i), i;
  }
  return Z(n), /** @type {TemplateNode} */
  n;
}
function yn(e) {
  e.textContent = "";
}
const bn = /* @__PURE__ */ new Set(), dt = /* @__PURE__ */ new Set();
function $r(e, t, n, r) {
  function i(l) {
    if (r.capture || Ae.call(t, l), !l.cancelBubble)
      return n.call(this, l);
  }
  return e.startsWith("pointer") || e === "wheel" ? xt(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function Ht(e, t, n, r, i) {
  var l = { capture: r, passive: i }, s = $r(e, t, n, l);
  (t === document.body || t === window || t === document) && dr(() => {
    t.removeEventListener(e, s, l);
  });
}
function mr(e) {
  for (var t = 0; t < e.length; t++)
    bn.add(e[t]);
  for (var n of dt)
    n(e);
}
function Ae(e) {
  var m;
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = ((m = e.composedPath) == null ? void 0 : m.call(e)) || [], l = (
    /** @type {null | Element} */
    i[0] || e.target
  ), s = 0, u = e.__root;
  if (u) {
    var o = i.indexOf(u);
    if (o !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var f = i.indexOf(t);
    if (f === -1)
      return;
    o <= f && (s = o);
  }
  if (l = /** @type {Element} */
  i[s] || e.target, l !== t) {
    Re(e, "currentTarget", {
      configurable: !0,
      get() {
        return l || n;
      }
    });
    try {
      for (var c, a = []; l !== null; ) {
        var v = l.parentNode || /** @type {any} */
        l.host || null;
        try {
          var h = l["__" + r];
          if (h !== void 0 && !/** @type {any} */
          l.disabled)
            if (Et(h)) {
              var [d, ..._] = h;
              d.apply(l, [e, ..._]);
            } else
              h.call(l, e);
        } catch (g) {
          c ? a.push(g) : c = g;
        }
        if (e.cancelBubble || v === t || v === null)
          break;
        l = v;
      }
      if (c) {
        for (let g of a)
          queueMicrotask(() => {
            throw g;
          });
        throw c;
      }
    } finally {
      e.__root = t, l = t;
    }
  }
}
function pr(e) {
  var t = document.createElement("template");
  return t.innerHTML = e, t.content;
}
function qe(e, t) {
  b.nodes ?? (b.nodes = { start: e, end: t });
}
// @__NO_SIDE_EFFECTS__
function Q(e, t) {
  var n = (t & Mn) !== 0, r, i = !e.startsWith("<!>");
  return () => {
    if (y)
      return qe(x, null), x;
    r || (r = pr(i ? e : "<!>" + e), r = /** @type {Node} */
    r.firstChild);
    var l = (
      /** @type {TemplateNode} */
      n ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    return qe(l, l), l;
  };
}
function vt() {
  if (y)
    return qe(x, null), x;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = Me();
  return e.append(t, n), qe(t, n), e;
}
function I(e, t) {
  if (y) {
    b.nodes.end = x, De();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function he(e, t) {
  (e.__t ?? (e.__t = e.nodeValue)) !== t && (e.nodeValue = e.__t = t);
}
function En(e, t) {
  const n = t.anchor ?? t.target.appendChild(Me());
  return xn(e, { ...t, anchor: n });
}
function gr(e, t) {
  t.intro = t.intro ?? !1;
  const n = t.target, r = y, i = x;
  try {
    for (var l = (
      /** @type {TemplateNode} */
      n.firstChild
    ); l && (l.nodeType !== 8 || /** @type {Comment} */
    l.data !== zt); )
      l = /** @type {TemplateNode} */
      l.nextSibling;
    if (!l)
      throw He;
    J(!0), Z(
      /** @type {Comment} */
      l
    ), De();
    const s = xn(e, { ...t, anchor: l });
    if (x.nodeType !== 8 || /** @type {Comment} */
    x.data !== wt)
      throw Jt(), He;
    return J(!1), /**  @type {Exports} */
    s;
  } catch (s) {
    if (s === He)
      return t.recover === !1 && tr(), wn(), yn(n), J(!1), En(e, t);
    throw s;
  } finally {
    J(r), Z(i);
  }
}
const _e = /* @__PURE__ */ new Map();
function xn(e, { target: t, anchor: n, props: r = {}, events: i, context: l, intro: s = !0 }) {
  wn();
  var u = /* @__PURE__ */ new Set(), o = (a) => {
    for (var v = 0; v < a.length; v++) {
      var h = a[v];
      if (!u.has(h)) {
        u.add(h);
        var d = Fn.includes(h);
        t.addEventListener(h, Ae, { passive: d });
        var _ = _e.get(h);
        _ === void 0 ? (document.addEventListener(h, Ae, { passive: d }), _e.set(h, 1)) : _e.set(h, _ + 1);
      }
    }
  };
  o(jn(bn)), dt.add(o);
  var f = void 0, c = vr(() => (G(() => {
    if (l) {
      Tt({});
      var a = (
        /** @type {ComponentContext} */
        L
      );
      a.c = l;
    }
    i && (r.$$events = i), y && qe(
      /** @type {TemplateNode} */
      n,
      null
    ), f = e(n, r) || {}, y && (b.nodes.end = x), l && kt();
  }), () => {
    for (var a of u) {
      t.removeEventListener(a, Ae);
      var v = (
        /** @type {number} */
        _e.get(a)
      );
      --v === 0 ? (document.removeEventListener(a, Ae), _e.delete(a)) : _e.set(a, v);
    }
    dt.delete(o), _t.delete(f);
  }));
  return _t.set(f, c), f;
}
let _t = /* @__PURE__ */ new WeakMap();
function wr(e) {
  const t = _t.get(e);
  t == null || t();
}
const rt = 0, Fe = 1, it = 2;
function yr(e, t, n, r, i) {
  y && De();
  var l = e, s = Ge(), u = L, o, f, c, a, v = s ? /* @__PURE__ */ H(
    /** @type {V} */
    void 0
  ) : /* @__PURE__ */ Ne(
    /** @type {V} */
    void 0
  ), h = s ? /* @__PURE__ */ H(void 0) : /* @__PURE__ */ Ne(void 0), d = !1;
  function _(g, E) {
    d = !0, E && (qt(m), Je(m), Dt(u)), g === rt && n && (f ? oe(f) : f = G(() => n(l))), g === Fe && r && (c ? oe(c) : c = G(() => r(l, v))), g === it && i && (a ? oe(a) : a = G(() => i(l, h))), g !== rt && f && ye(f, () => f = null), g !== Fe && c && ye(c, () => c = null), g !== it && a && ye(a, () => a = null), E && (Dt(null), Je(null), qt(null), ue());
  }
  var m = St(() => {
    if (o !== (o = t())) {
      if (zn(o)) {
        var g = o;
        d = !1, g.then(
          (E) => {
            g === o && (N(v, E), _(Fe, !0));
          },
          (E) => {
            g === o && (N(h, E), _(it, !0));
          }
        ), y ? n && (f = G(() => n(l))) : Promise.resolve().then(() => {
          d || _(rt, !0);
        });
      } else
        N(v, o), _(Fe, !1);
      return Wn;
    }
  });
  y && (l = x);
}
function ht(e, t, n, r = null, i = !1) {
  y && De();
  var l = e, s = null, u = null, o = null, f = i ? bt : 0;
  St(() => {
    if (o === (o = !!t())) return;
    let c = !1;
    if (y) {
      const a = (
        /** @type {Comment} */
        l.data === gt
      );
      o === a && (l = ut(), Z(l), J(!1), c = !0);
    }
    o ? (s ? oe(s) : s = G(() => n(l)), u && ye(u, () => {
      u = null;
    })) : (u ? oe(u) : r && (u = G(() => r(l))), s && ye(s, () => {
      s = null;
    })), c && J(!0);
  }, f), y && (l = x);
}
let lt = null;
function Cn(e, t) {
  return t;
}
function br(e, t, n, r) {
  for (var i = [], l = t.length, s = 0; s < l; s++)
    At(t[s].e, i, !0);
  var u = l > 0 && i.length === 0 && n !== null;
  if (u) {
    var o = (
      /** @type {Element} */
      /** @type {Element} */
      n.parentNode
    );
    yn(o), o.append(
      /** @type {Element} */
      n
    ), r.clear(), te(e, t[0].prev, t[l - 1].next);
  }
  pn(i, () => {
    for (var f = 0; f < l; f++) {
      var c = t[f];
      u || (r.delete(c.k), te(e, c.prev, c.next)), Te(c.e, !u);
    }
  });
}
function $t(e, t, n, r, i, l = null) {
  var s = e, u = { flags: t, items: /* @__PURE__ */ new Map(), first: null }, o = (t & Wt) !== 0;
  if (o) {
    var f = (
      /** @type {Element} */
      e
    );
    s = y ? Z(
      /** @type {Comment | Text} */
      f.firstChild
    ) : f.appendChild(Me());
  }
  y && De();
  var c = null;
  St(() => {
    var a = n(), v = Et(a) ? a : a == null ? [] : Array.from(a), h = v.length, d = u.flags;
    d & st && !Xt(v) && !(Qt in v) && !(D in v) && (d ^= st, d & Dn && !(d & Oe) && (d ^= Oe));
    let _ = !1;
    if (y) {
      var m = (
        /** @type {Comment} */
        s.data === gt
      );
      m !== (h === 0) && (s = ut(), Z(s), J(!1), _ = !0);
    }
    if (y) {
      for (var g = null, E, $ = 0; $ < h; $++) {
        if (x.nodeType === 8 && /** @type {Comment} */
        x.data === wt) {
          s = /** @type {Comment} */
          x, _ = !0, J(!1);
          break;
        }
        var w = v[$], T = r(w, $);
        E = Tn(x, u, g, null, w, T, $, i, d), u.items.set(T, E), g = E;
      }
      h > 0 && Z(ut());
    }
    y || Er(v, u, s, i, d, r), l !== null && (h === 0 ? c ? oe(c) : c = G(() => l(s)) : c !== null && ye(c, () => {
      c = null;
    })), _ && J(!0);
  }), y && (s = x);
}
function Er(e, t, n, r, i, l) {
  var ce, de, U, ve;
  var s = (i & In) !== 0, u = (i & (Oe | pt)) !== 0, o = e.length, f = t.items, c = t.first, a = c, v = /* @__PURE__ */ new Set(), h = null, d = /* @__PURE__ */ new Set(), _ = [], m = [], g, E, $, w;
  if (s)
    for (w = 0; w < o; w += 1)
      g = e[w], E = l(g, w), $ = f.get(E), $ !== void 0 && ((ce = $.a) == null || ce.measure(), d.add($));
  for (w = 0; w < o; w += 1) {
    if (g = e[w], E = l(g, w), $ = f.get(E), $ === void 0) {
      var T = a ? (
        /** @type {EffectNodes} */
        a.e.nodes.start
      ) : n;
      h = Tn(
        T,
        t,
        h,
        h === null ? t.first : h.next,
        g,
        E,
        w,
        r,
        i
      ), f.set(E, h), _ = [], m = [], a = h.next;
      continue;
    }
    if (u && xr($, g, w, i), $.e.f & ae && (oe($.e), s && ((de = $.a) == null || de.unfix(), d.delete($))), $ !== a) {
      if (v.has($)) {
        if (_.length < m.length) {
          var C = m[0], P;
          h = C.prev;
          var M = _[0], X = _[_.length - 1];
          for (P = 0; P < _.length; P += 1)
            Bt(_[P], C, n);
          for (P = 0; P < m.length; P += 1)
            v.delete(m[P]);
          te(t, M.prev, X.next), te(t, h, M), te(t, X, C), a = C, h = X, w -= 1, _ = [], m = [];
        } else
          v.delete($), Bt($, a, n), te(t, $.prev, $.next), te(t, $, h === null ? t.first : h.next), te(t, h, $), h = $;
        continue;
      }
      for (_ = [], m = []; a !== null && a.k !== E; )
        v.add(a), m.push(a), a = a.next;
      if (a === null)
        continue;
      $ = a;
    }
    _.push($), h = $, a = $.next;
  }
  const ie = Array.from(v);
  for (; a !== null; )
    ie.push(a), a = a.next;
  var le = ie.length;
  if (le > 0) {
    var ee = i & Wt && o === 0 ? n : null;
    if (s) {
      for (w = 0; w < le; w += 1)
        (U = ie[w].a) == null || U.measure();
      for (w = 0; w < le; w += 1)
        (ve = ie[w].a) == null || ve.fix();
    }
    br(t, ie, ee, f);
  }
  s && xt(() => {
    var Ot;
    for ($ of d)
      (Ot = $.a) == null || Ot.apply();
  }), b.first = t.first && t.first.e, b.last = h && h.e;
}
function xr(e, t, n, r) {
  r & Oe && N(e.v, t), r & pt ? N(
    /** @type {Value<number>} */
    e.i,
    n
  ) : e.i = n;
}
function Tn(e, t, n, r, i, l, s, u, o) {
  var f = lt;
  try {
    var c = (o & Oe) !== 0, a = (o & st) === 0, v = c ? a ? /* @__PURE__ */ Ne(i) : /* @__PURE__ */ H(i) : i, h = o & pt ? /* @__PURE__ */ H(s) : s, d = {
      i: h,
      v,
      k: l,
      a: null,
      // @ts-expect-error
      e: null,
      prev: n,
      next: r
    };
    return lt = d, d.e = G(() => u(e, v, h), y), d.e.prev = n && n.e, d.e.next = r && r.e, n === null ? t.first = d : (n.next = d, n.e.next = d.e), r !== null && (r.prev = d, r.e.prev = d.e), d;
  } finally {
    lt = f;
  }
}
function Bt(e, t, n) {
  for (var r = e.next ? (
    /** @type {EffectNodes} */
    e.next.e.nodes.start
  ) : n, i = t ? (
    /** @type {EffectNodes} */
    t.e.nodes.start
  ) : n, l = (
    /** @type {EffectNodes} */
    e.e.nodes.start
  ); l !== r; ) {
    var s = (
      /** @type {TemplateNode} */
      l.nextSibling
    );
    i.before(l), l = s;
  }
}
function te(e, t, n) {
  t === null ? e.first = n : (t.next = n, t.e.next = n && n.e), n !== null && (n.prev = t, n.e.prev = t && t.e);
}
var Yt = /* @__PURE__ */ new Set();
function Cr(e, t) {
  {
    if (Yt.has(t)) return;
    Yt.add(t);
  }
  xt(() => {
    var n = e.getRootNode(), r = (
      /** @type {ShadowRoot} */
      n.host ? (
        /** @type {ShadowRoot} */
        n
      ) : (
        /** @type {Document} */
        n.head ?? /** @type {Document} */
        n.ownerDocument.head
      )
    );
    if (!r.querySelector("#" + t.hash)) {
      const i = document.createElement("style");
      i.id = t.hash, i.textContent = t.code, r.appendChild(i);
    }
  });
}
let jt = !1;
function kn() {
  jt || (jt = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        var t;
        if (!e.defaultPrevented)
          for (
            const n of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            (t = n.__on_r) == null || t.call(n);
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possiblity of stopPropagation)
    { capture: !0 }
  ));
}
function Ye(e) {
  if (y) {
    var t = !1, n = () => {
      if (!t) {
        if (t = !0, e.hasAttribute("value")) {
          var r = e.value;
          Ut(e, "value", null), e.value = r;
        }
        if (e.hasAttribute("checked")) {
          var i = e.checked;
          Ut(e, "checked", null), e.checked = i;
        }
      }
    };
    e.__on_r = n, Gn(n), kn();
  }
}
function Ut(e, t, n) {
  n = n == null ? null : n + "";
  var r = e.__attributes ?? (e.__attributes = {});
  y && (r[t] = e.getAttribute(t), t === "src" || t === "href" || t === "srcset") || r[t] !== (r[t] = n) && (t === "loading" && (e[Yn] = n), n === null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Tr(e, t, n) {
  n ? e.classList.add(t) : e.classList.remove(t);
}
function Sn(e, t, n, r = n) {
  e.addEventListener(t, n);
  const i = e.__on_r;
  i ? e.__on_r = () => {
    i(), r();
  } : e.__on_r = r, kn();
}
function mt(e, t, n) {
  Sn(e, "input", () => {
    n(Vt(e) ? Kt(e.value) : e.value);
  }), et(() => {
    var r = t();
    if (y && e.defaultValue !== e.value) {
      n(e.value);
      return;
    }
    Vt(e) && r === Kt(e.value) || e.type === "date" && !r && !e.value || (e.value = r ?? "");
  });
}
function kr(e, t, n) {
  Sn(e, "change", () => {
    var r = e.checked;
    n(r);
  }), t() == null && n(!1), et(() => {
    var r = t();
    e.checked = !!r;
  });
}
function Vt(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function Kt(e) {
  return e === "" ? null : +e;
}
function je(e, t, n, r) {
  var d;
  var i = (n & Pn) !== 0, l = (
    /** @type {V} */
    e[t]
  ), s = (d = ot(e, t)) == null ? void 0 : d.set, u = (
    /** @type {V} */
    r
  ), o = () => u;
  l === void 0 && r !== void 0 && (s && i && nr(), l = o(), s && s(l));
  var f;
  if (f = () => {
    var _ = (
      /** @type {V} */
      e[t]
    );
    return _ === void 0 ? o() : _;
  }, s) {
    var c = e.$$legacy;
    return function(_, m) {
      return arguments.length > 0 ? ((!m || c) && s(m ? f() : _), _) : f();
    };
  }
  var a = !1, v = /* @__PURE__ */ Ne(l), h = /* @__PURE__ */ pe(() => {
    var _ = f(), m = p(v);
    return a ? (a = !1, m) : v.v = _;
  });
  return function(_, m) {
    var g = p(h);
    if (arguments.length > 0) {
      const E = m ? p(h) : _;
      return h.equals(E) || (a = !0, N(v, E), p(h)), _;
    }
    return g;
  };
}
function Sr(e) {
  return new Ar(e);
}
var z, F;
class Ar {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * 	immutable?: boolean;
   * 	hydrate?: boolean;
   * 	recover?: false;
   * }} options
   */
  constructor(t) {
    /** @type {any} */
    tt(this, z);
    /** @type {Record<string, any>} */
    tt(this, F);
    var n = /* @__PURE__ */ new Map(), r = (l, s) => {
      var u = /* @__PURE__ */ Ne(s);
      return n.set(l, u), u;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(l, s) {
          return p(n.get(s) ?? r(s, Reflect.get(l, s)));
        },
        has(l, s) {
          return p(n.get(s) ?? r(s, Reflect.get(l, s))), Reflect.has(l, s);
        },
        set(l, s, u) {
          return N(n.get(s) ?? r(s, u), u), Reflect.set(l, s, u);
        }
      }
    );
    nt(this, F, (t.hydrate ? gr : En)(t.component, {
      target: t.target,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover
    })), ue(), nt(this, z, i.$$events);
    for (const l of Object.keys(q(this, F)))
      l === "$set" || l === "$destroy" || l === "$on" || Re(this, l, {
        get() {
          return q(this, F)[l];
        },
        /** @param {any} value */
        set(s) {
          q(this, F)[l] = s;
        },
        enumerable: !0
      });
    q(this, F).$set = /** @param {Record<string, any>} next */
    (l) => {
      Object.assign(i, l);
    }, q(this, F).$destroy = () => {
      wr(q(this, F));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    q(this, F).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, n) {
    q(this, z)[t] = q(this, z)[t] || [];
    const r = (...i) => n.call(this, ...i);
    return q(this, z)[t].push(r), () => {
      q(this, z)[t] = q(this, z)[t].filter(
        /** @param {any} fn */
        (i) => i !== r
      );
    };
  }
  $destroy() {
    q(this, F).$destroy();
  }
}
z = new WeakMap(), F = new WeakMap();
let An;
typeof HTMLElement == "function" && (An = class extends HTMLElement {
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {*} use_shadow_dom
   */
  constructor(t, n, r) {
    super();
    /** The Svelte component constructor */
    Y(this, "$$ctor");
    /** Slots */
    Y(this, "$$s");
    /** @type {any} The Svelte component instance */
    Y(this, "$$c");
    /** Whether or not the custom element is connected */
    Y(this, "$$cn", !1);
    /** @type {Record<string, any>} Component props data */
    Y(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    Y(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    Y(this, "$$p_d", {});
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    Y(this, "$$l", {});
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    Y(this, "$$l_u", /* @__PURE__ */ new Map());
    /** @type {any} The managed render effect for reflecting attributes */
    Y(this, "$$me");
    this.$$ctor = t, this.$$s = n, r && this.attachShadow({ mode: "open" });
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(t, n, r) {
    if (this.$$l[t] = this.$$l[t] || [], this.$$l[t].push(n), this.$$c) {
      const i = this.$$c.$on(t, n);
      this.$$l_u.set(n, i);
    }
    super.addEventListener(t, n, r);
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  removeEventListener(t, n, r) {
    if (super.removeEventListener(t, n, r), this.$$c) {
      const i = this.$$l_u.get(n);
      i && (i(), this.$$l_u.delete(n));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(i) {
        return (l) => {
          const s = document.createElement("slot");
          i !== "default" && (s.name = i), I(l, s);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const n = {}, r = Or(this);
      for (const i of this.$$s)
        i in r && (i === "default" && !this.$$d.children ? (this.$$d.children = t(i), n.default = !0) : n[i] = t(i));
      for (const i of this.attributes) {
        const l = this.$$g_p(i.name);
        l in this.$$d || (this.$$d[l] = Ue(l, i.value, this.$$p_d, "toProp"));
      }
      for (const i in this.$$p_d)
        !(i in this.$$d) && this[i] !== void 0 && (this.$$d[i] = this[i], delete this[i]);
      this.$$c = Sr({
        component: this.$$ctor,
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$host: this
        }
      }), this.$$me = et(() => {
        var i;
        this.$$r = !0;
        for (const l of Ke(this.$$c)) {
          if (!((i = this.$$p_d[l]) != null && i.reflect)) continue;
          this.$$d[l] = this.$$c[l];
          const s = Ue(
            l,
            this.$$d[l],
            this.$$p_d,
            "toAttribute"
          );
          s == null ? this.removeAttribute(this.$$p_d[l].attribute || l) : this.setAttribute(this.$$p_d[l].attribute || l, s);
        }
        this.$$r = !1;
      });
      for (const i in this.$$l)
        for (const l of this.$$l[i]) {
          const s = this.$$c.$on(i, l);
          this.$$l_u.set(l, s);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  /**
   * @param {string} attr
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(t, n, r) {
    var i;
    this.$$r || (t = this.$$g_p(t), this.$$d[t] = Ue(t, r, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [t]: this.$$d[t] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), Te(this.$$me), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(t) {
    return Ke(this.$$p_d).find(
      (n) => this.$$p_d[n].attribute === t || !this.$$p_d[n].attribute && n.toLowerCase() === t
    ) || t;
  }
});
function Ue(e, t, n, r) {
  var l;
  const i = (l = n[e]) == null ? void 0 : l.type;
  if (t = i === "Boolean" && typeof t != "boolean" ? t != null : t, !r || !n[e])
    return t;
  if (r === "toAttribute")
    switch (i) {
      case "Object":
      case "Array":
        return t == null ? null : JSON.stringify(t);
      case "Boolean":
        return t ? "" : null;
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  else
    switch (i) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      case "Number":
        return t != null ? +t : t;
      default:
        return t;
    }
}
function Or(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function On(e, t, n, r, i, l) {
  let s = class extends An {
    constructor() {
      super(e, n, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Ke(t).map(
        (u) => (t[u].attribute || u).toLowerCase()
      );
    }
  };
  return Ke(t).forEach((u) => {
    Re(s.prototype, u, {
      get() {
        return this.$$c && u in this.$$c ? this.$$c[u] : this.$$d[u];
      },
      set(o) {
        var f;
        o = Ue(u, o, t), this.$$d[u] = o, (f = this.$$c) == null || f.$set({ [u]: o });
      }
    });
  }), r.forEach((u) => {
    Re(s.prototype, u, {
      get() {
        var o;
        return (o = this.$$c) == null ? void 0 : o[u];
      }
    });
  }), e.element = /** @type {any} */
  s, s;
}
var Rr = (e, t, n) => t()(p(n)), Nr = /* @__PURE__ */ Q('<input type="checkbox">'), Lr = /* @__PURE__ */ Q('<input type="number">'), qr = /* @__PURE__ */ Q('<input type="text">'), Dr = /* @__PURE__ */ Q("<p><!> </p>"), Ir = /* @__PURE__ */ Q("<p> </p>"), Pr = /* @__PURE__ */ Q("<div><h2> </h2> <p> </p> <h3>Parameters</h3> <button>Call</button> <pre> </pre> <!> <h3>Returns</h3> <!></div>");
function Rn(e, t) {
  Tt(t, !0);
  let n = je(t, "name", 7), r = je(t, "def", 7), i = je(t, "run", 7), l = /* @__PURE__ */ pe(() => r().parameters ? Object.values(r().parameters) : []), s = /* @__PURE__ */ pe(() => Object.fromEntries(p(l).map(({ name: T }) => [T, null]))), u = /* @__PURE__ */ H(Se({})), o = /* @__PURE__ */ pe(() => ({ ...p(s), ...p(u) }));
  var f = Pr(), c = K(f), a = K(c);
  V(c);
  var v = O(O(c, !0)), h = K(v);
  V(v);
  var d = O(O(v, !0)), _ = O(O(d, !0));
  _.__click = [Rr, i, o];
  var m = O(O(_, !0)), g = K(m);
  me(() => he(g, JSON.stringify(p(o)))), V(m);
  var E = O(O(m, !0));
  $t(E, 69, () => p(l), (T, C) => k(T).name, (T, C, P) => {
    var M = Dr(), X = K(M);
    ht(
      X,
      () => k(C).type === "boolean",
      (le) => {
        var ee = Nr();
        Ye(ee), kr(ee, () => p(u)[k(C).name], (ce) => p(u)[k(C).name] = ce), I(le, ee);
      },
      (le) => {
        var ee = vt(), ce = ct(ee);
        ht(
          ce,
          () => k(C).type === "number",
          (de) => {
            var U = Lr();
            Ye(U), mt(U, () => p(u)[k(C).name], (ve) => p(u)[k(C).name] = ve), I(de, U);
          },
          (de) => {
            var U = qr();
            Ye(U), mt(U, () => p(u)[k(C).name], (ve) => p(u)[k(C).name] = ve), I(de, U);
          },
          !0
        ), I(le, ee);
      }
    );
    var ie = O(X, !0);
    V(M), me(() => he(ie, ` ${k(C).name ?? ""} [${k(C).type ?? ""}]: ${k(C).description ?? ""}`)), I(T, M);
  });
  var $ = O(O(E, !0)), w = O(O($, !0));
  return $t(w, 65, () => Object.values(r().returns), Cn, (T, C, P) => {
    var M = Ir(), X = K(M);
    V(M), me(() => he(X, `${k(C).name ?? ""} [${k(C).type ?? ""}]: ${k(C).description ?? ""}`)), I(T, M);
  }), V(f), me(() => {
    he(a, n()), he(h, r().description);
  }), I(e, f), kt({
    get name() {
      return n();
    },
    set name(T) {
      n(T), ue();
    },
    get def() {
      return r();
    },
    set def(T) {
      r(T), ue();
    },
    get run() {
      return i();
    },
    set run(T) {
      i(T), ue();
    }
  });
}
mr(["click"]);
On(Rn, { name: {}, def: {}, run: {} }, [], [], !0);
var Mr = /* @__PURE__ */ Q('<p style="color: red"> </p>'), Fr = /* @__PURE__ */ Q("<p>Loading...</p>"), Hr = /* @__PURE__ */ Q('<div class="command-panel svelte-1mm37qn"><div class="search"><input type="search" placeholder="Search commands..."></div> <div class="commands svelte-1mm37qn"><!></div></div>');
const Br = {
  hash: "svelte-1mm37qn",
  code: `
	.command-panel.svelte-1mm37qn {
		background: white;
		color: black;

		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 0;
		padding: 1em;
		overflow: auto;
	}
	.command-panel.open.svelte-1mm37qn {
		height: 80%;
		width: 80%;
	}
	.command-panel.open.svelte-1mm37qn .commands:where(.svelte-1mm37qn) {
		display: block;
	}
	.commands.svelte-1mm37qn {
		display: none;
	}
`
};
function Yr(e, t) {
  Tt(t, !0), Cr(e, Br);
  let n = je(t, "commands", 7, null);
  async function r(d, _) {
    if (!n()) return;
    let m = await n().run(d, _);
    console.log("ran", d, _, m);
  }
  let i = /* @__PURE__ */ pe(() => {
    var d;
    return ((d = n()) == null ? void 0 : d.index) || new Promise(() => {
    });
  }), l = /* @__PURE__ */ H("");
  function s(d, _) {
    if (!p(l)) return !0;
    let m = p(l).toLowerCase();
    return d.toLowerCase().includes(m) || _.description.toLowerCase().includes(m);
  }
  let u = /* @__PURE__ */ H(!1), o = /* @__PURE__ */ pe(() => p(u) || p(l));
  var f = Hr(), c = K(f), a = K(c);
  Ye(a), V(c);
  var v = O(O(c, !0)), h = K(v);
  return yr(
    h,
    () => p(i),
    (d) => {
      var _ = Fr();
      I(d, _);
    },
    (d, _) => {
      var m = vt(), g = ct(m);
      $t(g, 65, () => Object.keys(p(_)), Cn, (E, $, w) => {
        var T = vt(), C = ct(T);
        ht(C, () => s(k($), p(_)[k($)]), (P) => {
          Rn(P, {
            get name() {
              return k($);
            },
            get def() {
              return p(_)[k($)];
            },
            run: (M) => r(k($), M)
          });
        }), I(E, T);
      }), I(d, m);
    },
    (d, _) => {
      var m = Mr(), g = K(m);
      V(m), me(() => he(g, p(_).message)), I(d, m);
    }
  ), V(v), V(f), me(() => Tr(f, "open", p(o))), mt(a, () => p(l), (d) => N(l, d)), Ht(
    "focus",
    a,
    () => {
      N(u, !0);
    },
    !1
  ), Ht(
    "blur",
    a,
    () => {
      N(u, !1);
    },
    !1
  ), I(e, f), kt({
    get commands() {
      return n();
    },
    set commands(d = null) {
      n(d), ue();
    }
  });
}
On(Yr, { commands: {} }, [], [], !0);
export {
  Yr as CommandPanel
};

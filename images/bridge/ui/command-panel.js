var Yn = Object.defineProperty;
var Mt = (e) => {
  throw TypeError(e);
};
var Vn = (e, t, n) => t in e ? Yn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Z = (e, t, n) => Vn(e, typeof t != "symbol" ? t + "" : t, n), Pt = (e, t, n) => t.has(e) || Mt("Cannot " + n);
var Y = (e, t, n) => (Pt(e, t, "read from private field"), n ? n.call(e) : t.get(e)), lt = (e, t, n) => t.has(e) ? Mt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), ot = (e, t, n, r) => (Pt(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
const Un = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Un);
const qe = 1, bt = 2, Jn = 4, tn = 8, Wn = 16, dt = 64, zn = 2, Kn = 1, Gn = 2, nn = "[", xt = "[!", Ct = "]", Ve = {}, Me = Symbol(), Zn = ["touchstart", "touchmove", "touchend"];
function rn(e) {
  console.warn("hydration_mismatch");
}
let b = !1;
function ue(e) {
  b = e;
}
let T;
function ne(e) {
  return T = e;
}
function Oe() {
  if (T === null)
    throw rn(), Ve;
  return T = /** @type {TemplateNode} */
  T.nextSibling;
}
function N(e) {
  b && (T = e);
}
function Qn() {
  b && Oe();
}
function vt() {
  for (var e = 0, t = T; ; ) {
    if (t.nodeType === 8) {
      var n = (
        /** @type {Comment} */
        t.data
      );
      if (n === Ct) {
        if (e === 0) return t;
        e -= 1;
      } else (n === nn || n === xt) && (e += 1);
    }
    var r = (
      /** @type {TemplateNode} */
      t.nextSibling
    );
    t.remove(), t = r;
  }
}
const ge = 2, sn = 4, Re = 8, un = 16, re = 32, Tt = 64, ye = 128, ze = 256, Q = 512, _e = 1024, Ne = 2048, pe = 4096, Le = 8192, Xn = 16384, St = 32768, er = 1 << 18, V = Symbol("$state"), ln = Symbol("$state.frozen"), tr = Symbol("");
var kt = Array.isArray, nr = Array.from, Ke = Object.keys, on = Object.isFrozen, Fe = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, rr = Object.prototype, sr = Array.prototype, ir = Object.getPrototypeOf;
const an = () => {
};
function ur(e) {
  return typeof (e == null ? void 0 : e.then) == "function";
}
function fn(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
const lr = typeof requestIdleCallback > "u" ? (e) => setTimeout(e, 1) : requestIdleCallback;
let Ge = !1, Ze = !1, ht = [], mt = [];
function cn() {
  Ge = !1;
  const e = ht.slice();
  ht = [], fn(e);
}
function dn() {
  Ze = !1;
  const e = mt.slice();
  mt = [], fn(e);
}
function At(e) {
  Ge || (Ge = !0, queueMicrotask(cn)), ht.push(e);
}
function or(e) {
  Ze || (Ze = !0, lr(dn)), mt.push(e);
}
function ar() {
  Ge && cn(), Ze && dn();
}
function vn(e) {
  return e === this.v;
}
function fr(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function cr(e) {
  return !fr(e, this.v);
}
function dr(e) {
  throw new Error("effect_in_teardown");
}
function vr() {
  throw new Error("effect_in_unowned_derived");
}
function _r(e) {
  throw new Error("effect_orphan");
}
function hr() {
  throw new Error("effect_update_depth_exceeded");
}
function mr() {
  throw new Error("hydration_failed");
}
function $r(e) {
  throw new Error("props_invalid_value");
}
function gr() {
  throw new Error("state_unsafe_mutation");
}
// @__NO_SIDE_EFFECTS__
function U(e) {
  return {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: vn,
    version: 0
  };
}
// @__NO_SIDE_EFFECTS__
function je(e) {
  var n;
  const t = /* @__PURE__ */ U(e);
  return t.equals = cr, O !== null && O.l !== null && ((n = O.l).s ?? (n.s = [])).push(t), t;
}
function D(e, t) {
  return A !== null && Xe() && A.f & ge && gr(), e.equals(t) || (e.v = t, e.version = pn(), _n(e, _e), Xe() && y !== null && y.f & Q && !(y.f & re) && (L !== null && L.includes(e) ? (G(y, _e), rt(y)) : de === null ? yr([e]) : de.push(e))), t;
}
function _n(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = Xe(), s = n.length, i = 0; i < s; i++) {
      var u = n[i], l = u.f;
      l & _e || !r && u === y || (G(u, t), l & (Q | ye) && (l & ge ? _n(
        /** @type {Derived} */
        u,
        Ne
      ) : rt(
        /** @type {Effect} */
        u
      )));
    }
}
// @__NO_SIDE_EFFECTS__
function Te(e) {
  let t = ge | _e;
  y === null && (t |= ye);
  const n = {
    deps: null,
    deriveds: null,
    equals: vn,
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
  if (A !== null && A.f & ge) {
    var r = (
      /** @type {Derived} */
      A
    );
    r.deriveds === null ? r.deriveds = [n] : r.deriveds.push(n);
  }
  return n;
}
function hn(e) {
  Rt(e);
  var t = e.deriveds;
  if (t !== null) {
    e.deriveds = null;
    for (var n = 0; n < t.length; n += 1)
      pr(t[n]);
  }
}
function mn(e) {
  hn(e);
  var t = wn(e), n = (xe || e.f & ye) && e.deps !== null ? Ne : Q;
  G(e, n), e.equals(t) || (e.v = t, e.version = pn());
}
function pr(e) {
  hn(e), tt(e, 0), G(e, Le), e.first = e.last = e.deps = e.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
  e.fn = null;
}
const $n = 0, wr = 1;
let Ue = $n, He = !1, Se = !1, Ot = !1;
function qt(e) {
  Se = e;
}
function Ft(e) {
  Ot = e;
}
let me = [], ke = 0, A = null;
function Qe(e) {
  A = e;
}
let y = null;
function jt(e) {
  y = e;
}
let L = null, M = 0, de = null;
function yr(e) {
  de = e;
}
let gn = 0, xe = !1, O = null;
function Ht(e) {
  O = e;
}
function pn() {
  return gn++;
}
function Xe() {
  return O !== null && O.l === null;
}
function Be(e) {
  var u, l;
  var t = e.f;
  if (t & _e)
    return !0;
  if (t & Ne) {
    var n = e.deps;
    if (n !== null) {
      var r = (t & ye) !== 0, s;
      if (t & ze) {
        for (s = 0; s < n.length; s++)
          ((u = n[s]).reactions ?? (u.reactions = [])).push(e);
        e.f ^= ze;
      }
      for (s = 0; s < n.length; s++) {
        var i = n[s];
        if (Be(
          /** @type {Derived} */
          i
        ) && mn(
          /** @type {Derived} */
          i
        ), i.version > e.version)
          return !0;
        r && !xe && !((l = i == null ? void 0 : i.reactions) != null && l.includes(e)) && (i.reactions ?? (i.reactions = [])).push(e);
      }
    }
    G(e, Q);
  }
  return !1;
}
function Er(e, t, n) {
  throw e;
}
function wn(e) {
  var t = L, n = M, r = de, s = A, i = xe;
  L = /** @type {null | Value[]} */
  null, M = 0, de = null, A = e.f & (re | Tt) ? null : e, xe = !Se && (e.f & ye) !== 0;
  try {
    var u = (
      /** @type {Function} */
      (0, e.fn)()
    ), l = e.deps;
    if (L !== null) {
      var o, a;
      if (l !== null) {
        var _ = M === 0 ? L : l.slice(0, M).concat(L), f = _.length > 16 ? new Set(_) : null;
        for (a = M; a < l.length; a++)
          o = l[a], (f !== null ? !f.has(o) : !_.includes(o)) && yn(e, o);
      }
      if (l !== null && M > 0)
        for (l.length = M + L.length, a = 0; a < L.length; a++)
          l[M + a] = L[a];
      else
        e.deps = l = L;
      if (!xe)
        for (a = M; a < l.length; a++) {
          o = l[a];
          var v = o.reactions;
          v === null ? o.reactions = [e] : v[v.length - 1] !== e && !v.includes(e) && v.push(e);
        }
    } else l !== null && M < l.length && (tt(e, M), l.length = M);
    return u;
  } finally {
    L = t, M = n, de = r, A = s, xe = i;
  }
}
function yn(e, t) {
  const n = t.reactions;
  let r = 0;
  if (n !== null) {
    r = n.length - 1;
    const s = n.indexOf(e);
    s !== -1 && (r === 0 ? t.reactions = null : (n[s] = n[r], n.pop()));
  }
  r === 0 && t.f & ge && (G(t, Ne), t.f & (ye | ze) || (t.f ^= ze), tt(
    /** @type {Derived} **/
    t,
    0
  ));
}
function tt(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t === 0 ? null : n.slice(0, t), s = /* @__PURE__ */ new Set(), i = t; i < n.length; i++) {
      var u = n[i];
      s.has(u) || (s.add(u), (r === null || !r.includes(u)) && yn(e, u));
    }
}
function Rt(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    var r = n.next;
    Ie(n, t), n = r;
  }
}
function nt(e) {
  var t = e.f;
  if (!(t & Le)) {
    G(e, Q);
    var n = e.ctx, r = y, s = O;
    y = e, O = n;
    try {
      t & un || Rt(e), Tn(e);
      var i = wn(e);
      e.teardown = typeof i == "function" ? i : null, e.version = gn;
    } catch (u) {
      Er(
        /** @type {Error} */
        u
      );
    } finally {
      y = r, O = s;
    }
  }
}
function En() {
  ke > 1e3 && (ke = 0, hr()), ke++;
}
function bn(e) {
  var t = e.length;
  if (t !== 0) {
    En();
    var n = Se;
    Se = !0;
    try {
      for (var r = 0; r < t; r++) {
        var s = e[r];
        if (s.first === null && !(s.f & re))
          Bt([s]);
        else {
          var i = [];
          xn(s, i), Bt(i);
        }
      }
    } finally {
      Se = n;
    }
  }
}
function Bt(e) {
  var t = e.length;
  if (t !== 0)
    for (var n = 0; n < t; n++) {
      var r = e[n];
      !(r.f & (Le | pe)) && Be(r) && (nt(r), r.deps === null && r.first === null && r.nodes === null && (r.teardown === null ? Sn(r) : r.fn = null));
    }
}
function br() {
  if (He = !1, ke > 1001)
    return;
  const e = me;
  me = [], bn(e), He || (ke = 0);
}
function rt(e) {
  Ue === $n && (He || (He = !0, queueMicrotask(br)));
  for (var t = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (n & re) {
      if (!(n & Q)) return;
      G(t, Ne);
    }
  }
  me.push(t);
}
function xn(e, t) {
  var n = e.first, r = [];
  e: for (; n !== null; ) {
    var s = n.f, i = (s & (Le | pe)) === 0, u = s & re, l = (s & Q) !== 0, o = n.first;
    if (i && (!u || !l)) {
      if (u && G(n, Q), s & Re) {
        if (!u && Be(n) && (nt(n), o = n.first), o !== null) {
          n = o;
          continue;
        }
      } else if (s & sn)
        if (u || l) {
          if (o !== null) {
            n = o;
            continue;
          }
        } else
          r.push(n);
    }
    var a = n.next;
    if (a === null) {
      let v = n.parent;
      for (; v !== null; ) {
        if (e === v)
          break e;
        var _ = v.next;
        if (_ !== null) {
          n = _;
          continue e;
        }
        v = v.parent;
      }
    }
    n = a;
  }
  for (var f = 0; f < r.length; f++)
    o = r[f], t.push(o), xn(o, t);
}
function le(e) {
  var t = Ue, n = me;
  try {
    En();
    const s = [];
    Ue = wr, me = s, He = !1, bn(n);
    var r = e == null ? void 0 : e();
    return ar(), (me.length > 0 || s.length > 0) && le(), ke = 0, r;
  } finally {
    Ue = t, me = n;
  }
}
function p(e) {
  var t = e.f;
  if (t & Le)
    return e.v;
  if (A !== null) {
    var n = A.deps;
    L === null && n !== null && n[M] === e ? M++ : (n === null || M === 0 || n[M - 1] !== e) && (L === null ? L = [e] : L[L.length - 1] !== e && L.push(e)), de !== null && y !== null && y.f & Q && !(y.f & re) && de.includes(e) && (G(y, _e), rt(y));
  }
  if (t & ge) {
    var r = (
      /** @type {Derived} */
      e
    );
    Be(r) && mn(r);
  }
  return e.v;
}
function xr(e) {
  const t = A;
  try {
    return A = null, e();
  } finally {
    A = t;
  }
}
const Cr = ~(_e | Ne | Q);
function G(e, t) {
  e.f = e.f & Cr | t;
}
function Tr(e) {
  return typeof e == "object" && e !== null && typeof /** @type {Value<V>} */
  e.f == "number";
}
function Nt(e, t = !1, n) {
  O = {
    p: O,
    c: null,
    e: null,
    m: !1,
    s: e,
    x: null,
    l: null
  }, t || (O.l = {
    s: null,
    u: null,
    r1: [],
    r2: /* @__PURE__ */ U(!1)
  });
}
function Lt(e) {
  const t = O;
  if (t !== null) {
    e !== void 0 && (t.x = e);
    const r = t.e;
    if (r !== null) {
      t.e = null;
      for (var n = 0; n < r.length; n++)
        Cn(r[n]);
    }
    O = t.p, t.m = !0;
  }
  return e || /** @type {T} */
  {};
}
function k(e) {
  return Tr(e) ? p(e) : e;
}
function Sr(e) {
  y === null && A === null && _r(), A !== null && A.f & ye && vr(), Ot && dr();
}
function Yt(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function De(e, t, n, r = !0) {
  var s = (e & Tt) !== 0, i = {
    ctx: O,
    deps: null,
    nodes: null,
    f: e | _e,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: s ? null : y,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (n) {
    var u = Se;
    try {
      qt(!0), nt(i), i.f |= Xn;
    } catch (o) {
      throw Ie(i), o;
    } finally {
      qt(u);
    }
  } else t !== null && rt(i);
  var l = n && i.deps === null && i.first === null && i.nodes === null && i.teardown === null;
  return !l && !s && r && (y !== null && Yt(i, y), A !== null && A.f & ge && Yt(i, A)), i;
}
function kr(e) {
  const t = De(Re, null, !1);
  return G(t, Q), t.teardown = e, t;
}
function Ar(e) {
  Sr();
  var t = y !== null && (y.f & Re) !== 0 && // TODO do we actually need this? removing them changes nothing
  O !== null && !O.m;
  if (t) {
    var n = (
      /** @type {ComponentContext} */
      O
    );
    (n.e ?? (n.e = [])).push(e);
  } else {
    var r = Cn(e);
    return r;
  }
}
function Or(e) {
  const t = De(Tt, e, !0);
  return () => {
    Ie(t);
  };
}
function Cn(e) {
  return De(sn, e, !1);
}
function st(e) {
  return De(Re, e, !0);
}
function K(e) {
  return st(e);
}
function Dt(e, t = 0) {
  return De(Re | un | t, e, !0);
}
function oe(e, t = !0) {
  return De(Re | re, e, !0, t);
}
function Tn(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Ot, r = A;
    Ft(!0), Qe(null);
    try {
      t.call(null);
    } finally {
      Ft(n), Qe(r);
    }
  }
}
function Ie(e, t = !0) {
  var n = !1;
  if ((t || e.f & er) && e.nodes !== null) {
    for (var r = e.nodes.start, s = e.nodes.end; r !== null; ) {
      var i = r === s ? null : (
        /** @type {TemplateNode} */
        r.nextSibling
      );
      r.remove(), r = i;
    }
    n = !0;
  }
  if (Rt(e, t && !n), tt(e, 0), G(e, Le), e.transitions)
    for (const l of e.transitions)
      l.stop();
  Tn(e);
  var u = e.parent;
  u !== null && e.f & re && u.first !== null && Sn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.parent = e.fn = e.nodes = null;
}
function Sn(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ae(e, t) {
  var n = [];
  It(e, n, !0), kn(n, () => {
    Ie(e), t && t();
  });
}
function kn(e, t) {
  var n = e.length;
  if (n > 0) {
    var r = () => --n || t();
    for (var s of e)
      s.out(r);
  } else
    t();
}
function It(e, t, n) {
  if (!(e.f & pe)) {
    if (e.f ^= pe, e.transitions !== null)
      for (const u of e.transitions)
        (u.is_global || n) && t.push(u);
    for (var r = e.first; r !== null; ) {
      var s = r.next, i = (r.f & St) !== 0 || (r.f & re) !== 0;
      It(r, t, i ? n : !1), r = s;
    }
  }
}
function $e(e) {
  An(e, !0);
}
function An(e, t) {
  if (e.f & pe) {
    e.f ^= pe, Be(e) && nt(e);
    for (var n = e.first; n !== null; ) {
      var r = n.next, s = (n.f & St) !== 0 || (n.f & re) !== 0;
      An(n, s ? t : !1), n = r;
    }
    if (e.transitions !== null)
      for (const i of e.transitions)
        (i.is_global || t) && i.in();
  }
}
function ce(e, t = null, n) {
  if (typeof e == "object" && e != null && !on(e) && !(ln in e)) {
    if (V in e) {
      const s = (
        /** @type {ProxyMetadata<T>} */
        e[V]
      );
      if (s.t === e || s.p === e)
        return s.p;
    }
    const r = ir(e);
    if (r === rr || r === sr) {
      const s = new Proxy(e, Rr);
      return Fe(e, V, {
        value: (
          /** @type {ProxyMetadata} */
          {
            s: /* @__PURE__ */ new Map(),
            v: /* @__PURE__ */ U(0),
            a: kt(e),
            p: s,
            t: e
          }
        ),
        writable: !0,
        enumerable: !1
      }), s;
    }
  }
  return e;
}
function Vt(e, t = 1) {
  D(e, e.v + t);
}
const Rr = {
  defineProperty(e, t, n) {
    if (n.value) {
      const r = e[V], s = r.s.get(t);
      s !== void 0 && D(s, ce(n.value, r));
    }
    return Reflect.defineProperty(e, t, n);
  },
  deleteProperty(e, t) {
    const n = e[V], r = n.s.get(t), s = n.a, i = delete e[t];
    if (s && i) {
      const u = n.s.get("length"), l = e.length - 1;
      u !== void 0 && u.v !== l && D(u, l);
    }
    return r !== void 0 && D(r, Me), i && Vt(n.v), i;
  },
  get(e, t, n) {
    var i;
    if (t === V)
      return Reflect.get(e, V);
    const r = e[V];
    let s = r.s.get(t);
    if (s === void 0 && (!(t in e) || (i = _t(e, t)) != null && i.writable) && (s = /* @__PURE__ */ U(ce(e[t], r)), r.s.set(t, s)), s !== void 0) {
      const u = p(s);
      return u === Me ? void 0 : u;
    }
    return Reflect.get(e, t, n);
  },
  getOwnPropertyDescriptor(e, t) {
    const n = Reflect.getOwnPropertyDescriptor(e, t);
    if (n && "value" in n) {
      const s = e[V].s.get(t);
      s && (n.value = p(s));
    }
    return n;
  },
  has(e, t) {
    var i;
    if (t === V)
      return !0;
    const n = e[V], r = Reflect.has(e, t);
    let s = n.s.get(t);
    return (s !== void 0 || y !== null && (!r || (i = _t(e, t)) != null && i.writable)) && (s === void 0 && (s = /* @__PURE__ */ U(r ? ce(e[t], n) : Me), n.s.set(t, s)), p(s) === Me) ? !1 : r;
  },
  set(e, t, n, r) {
    const s = e[V];
    let i = s.s.get(t);
    i === void 0 && (xr(() => r[t]), i = s.s.get(t)), i !== void 0 && D(i, ce(n, s));
    const u = s.a, l = !(t in e);
    if (u && t === "length")
      for (let a = n; a < e.length; a += 1) {
        const _ = s.s.get(a + "");
        _ !== void 0 && D(_, Me);
      }
    var o = Reflect.getOwnPropertyDescriptor(e, t);
    if (o != null && o.set ? o.set.call(r, n) : e[t] = n, l) {
      if (u) {
        const a = s.s.get("length"), _ = e.length;
        a !== void 0 && a.v !== _ && D(a, _);
      }
      Vt(s.v);
    }
    return !0;
  },
  ownKeys(e) {
    const t = e[V];
    return p(t.v), Reflect.ownKeys(e);
  }
};
var Ut;
function On() {
  if (Ut === void 0) {
    Ut = window;
    var e = Element.prototype;
    e.__click = void 0, e.__className = "", e.__attributes = null, e.__e = void 0, Text.prototype.__t = void 0;
  }
}
function we() {
  return document.createTextNode("");
}
function P(e) {
  if (!b)
    return e.firstChild;
  var t = (
    /** @type {TemplateNode} */
    T.firstChild
  );
  return t === null && (t = T.appendChild(we())), ne(t), t;
}
function $t(e, t) {
  if (!b) {
    var n = (
      /** @type {DocumentFragment} */
      e.firstChild
    );
    return n instanceof Comment && n.data === "" ? n.nextSibling : n;
  }
  return T;
}
function S(e, t = !1) {
  if (!b)
    return (
      /** @type {TemplateNode} */
      e.nextSibling
    );
  var n = (
    /** @type {TemplateNode} */
    T.nextSibling
  ), r = n.nodeType;
  if (t && r !== 3) {
    var s = we();
    return n == null || n.before(s), ne(s), s;
  }
  return ne(n), /** @type {TemplateNode} */
  n;
}
function Rn(e) {
  e.textContent = "";
}
const Nn = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new Set();
function Nr(e, t, n, r) {
  function s(i) {
    if (r.capture || Pe.call(t, i), !i.cancelBubble)
      return n.call(this, i);
  }
  return e.startsWith("pointer") || e === "wheel" ? At(() => {
    t.addEventListener(e, s, r);
  }) : t.addEventListener(e, s, r), s;
}
function Jt(e, t, n, r, s) {
  var i = { capture: r, passive: s }, u = Nr(e, t, n, i);
  (t === document.body || t === window || t === document) && kr(() => {
    t.removeEventListener(e, u, i);
  });
}
function Lr(e) {
  for (var t = 0; t < e.length; t++)
    Nn.add(e[t]);
  for (var n of gt)
    n(e);
}
function Pe(e) {
  var E;
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, s = ((E = e.composedPath) == null ? void 0 : E.call(e)) || [], i = (
    /** @type {null | Element} */
    s[0] || e.target
  ), u = 0, l = e.__root;
  if (l) {
    var o = s.indexOf(l);
    if (o !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var a = s.indexOf(t);
    if (a === -1)
      return;
    o <= a && (u = o);
  }
  if (i = /** @type {Element} */
  s[u] || e.target, i !== t) {
    Fe(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || n;
      }
    });
    try {
      for (var _, f = []; i !== null; ) {
        var v = i.parentNode || /** @type {any} */
        i.host || null;
        try {
          var d = i["__" + r];
          if (d !== void 0 && !/** @type {any} */
          i.disabled)
            if (kt(d)) {
              var [$, ...m] = d;
              $.apply(i, [e, ...m]);
            } else
              d.call(i, e);
        } catch (h) {
          _ ? f.push(h) : _ = h;
        }
        if (e.cancelBubble || v === t || v === null)
          break;
        i = v;
      }
      if (_) {
        for (let h of f)
          queueMicrotask(() => {
            throw h;
          });
        throw _;
      }
    } finally {
      e.__root = t, i = t;
    }
  }
}
function Dr(e) {
  var t = document.createElement("template");
  return t.innerHTML = e, t.content;
}
function ve(e, t) {
  y.nodes ?? (y.nodes = { start: e, end: t });
}
// @__NO_SIDE_EFFECTS__
function X(e, t) {
  var n = (t & Kn) !== 0, r = (t & Gn) !== 0, s, i = !e.startsWith("<!>");
  return () => {
    if (b)
      return ve(T, null), T;
    s || (s = Dr(i ? e : "<!>" + e), n || (s = /** @type {Node} */
    s.firstChild));
    var u = (
      /** @type {TemplateNode} */
      r ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    if (n) {
      var l = (
        /** @type {TemplateNode} */
        u.firstChild
      ), o = (
        /** @type {TemplateNode} */
        u.lastChild
      );
      ve(l, o);
    } else
      ve(u, u);
    return u;
  };
}
function Wt() {
  if (!b) {
    var e = we();
    return ve(e, e), e;
  }
  var t = T;
  return t.nodeType !== 3 && (t.before(t = we()), ne(t)), ve(t, t), t;
}
function Ln() {
  if (b)
    return ve(T, null), T;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = we();
  return e.append(t, n), ve(t, n), e;
}
function F(e, t) {
  if (b) {
    y.nodes.end = T, Oe();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function te(e, t) {
  (e.__t ?? (e.__t = e.nodeValue)) !== t && (e.nodeValue = e.__t = t);
}
function Dn(e, t) {
  const n = t.anchor ?? t.target.appendChild(we());
  return In(e, { ...t, anchor: n });
}
function Ir(e, t) {
  t.intro = t.intro ?? !1;
  const n = t.target, r = b, s = T;
  try {
    for (var i = (
      /** @type {TemplateNode} */
      n.firstChild
    ); i && (i.nodeType !== 8 || /** @type {Comment} */
    i.data !== nn); )
      i = /** @type {TemplateNode} */
      i.nextSibling;
    if (!i)
      throw Ve;
    ue(!0), ne(
      /** @type {Comment} */
      i
    ), Oe();
    const u = In(e, { ...t, anchor: i });
    if (T.nodeType !== 8 || /** @type {Comment} */
    T.data !== Ct)
      throw rn(), Ve;
    return ue(!1), /**  @type {Exports} */
    u;
  } catch (u) {
    if (u === Ve)
      return t.recover === !1 && mr(), On(), Rn(n), ue(!1), Dn(e, t);
    throw u;
  } finally {
    ue(r), ne(s);
  }
}
const be = /* @__PURE__ */ new Map();
function In(e, { target: t, anchor: n, props: r = {}, events: s, context: i, intro: u = !0 }) {
  On();
  var l = /* @__PURE__ */ new Set(), o = (f) => {
    for (var v = 0; v < f.length; v++) {
      var d = f[v];
      if (!l.has(d)) {
        l.add(d);
        var $ = Zn.includes(d);
        t.addEventListener(d, Pe, { passive: $ });
        var m = be.get(d);
        m === void 0 ? (document.addEventListener(d, Pe, { passive: $ }), be.set(d, 1)) : be.set(d, m + 1);
      }
    }
  };
  o(nr(Nn)), gt.add(o);
  var a = void 0, _ = Or(() => (oe(() => {
    if (i) {
      Nt({});
      var f = (
        /** @type {ComponentContext} */
        O
      );
      f.c = i;
    }
    s && (r.$$events = s), b && ve(
      /** @type {TemplateNode} */
      n,
      null
    ), a = e(n, r) || {}, b && (y.nodes.end = T), i && Lt();
  }), () => {
    for (var f of l) {
      t.removeEventListener(f, Pe);
      var v = (
        /** @type {number} */
        be.get(f)
      );
      --v === 0 ? (document.removeEventListener(f, Pe), be.delete(f)) : be.set(f, v);
    }
    gt.delete(o), pt.delete(a);
  }));
  return pt.set(a, _), a;
}
let pt = /* @__PURE__ */ new WeakMap();
function Mr(e) {
  const t = pt.get(e);
  t == null || t();
}
const at = 0, Ye = 1, ft = 2;
function zt(e, t, n, r, s) {
  b && Oe();
  var i = e, u = Xe(), l = O, o, a, _, f, v = u ? /* @__PURE__ */ U(
    /** @type {V} */
    void 0
  ) : /* @__PURE__ */ je(
    /** @type {V} */
    void 0
  ), d = u ? /* @__PURE__ */ U(void 0) : /* @__PURE__ */ je(void 0), $ = !1;
  function m(h, g) {
    $ = !0, g && (jt(E), Qe(E), Ht(l)), h === at && n && (a ? $e(a) : a = oe(() => n(i))), h === Ye && r && (_ ? $e(_) : _ = oe(() => r(i, v))), h === ft && s && (f ? $e(f) : f = oe(() => s(i, d))), h !== at && a && Ae(a, () => a = null), h !== Ye && _ && Ae(_, () => _ = null), h !== ft && f && Ae(f, () => f = null), g && (Ht(null), Qe(null), jt(null), le());
  }
  var E = Dt(() => {
    if (o !== (o = t())) {
      if (ur(o)) {
        var h = o;
        $ = !1, h.then(
          (g) => {
            h === o && (D(v, g), m(Ye, !0));
          },
          (g) => {
            h === o && (D(d, g), m(ft, !0));
          }
        ), b ? n && (a = oe(() => n(i))) : Promise.resolve().then(() => {
          $ || m(at, !0);
        });
      } else
        D(v, o), m(Ye, !1);
      return an;
    }
  });
  b && (i = T);
}
function wt(e, t, n, r = null, s = !1) {
  b && Oe();
  var i = e, u = null, l = null, o = null, a = s ? St : 0;
  Dt(() => {
    if (o === (o = !!t())) return;
    let _ = !1;
    if (b) {
      const f = (
        /** @type {Comment} */
        i.data === xt
      );
      o === f && (i = vt(), ne(i), ue(!1), _ = !0);
    }
    o ? (u ? $e(u) : u = oe(() => n(i)), l && Ae(l, () => {
      l = null;
    })) : (l ? $e(l) : r && (l = oe(() => r(i))), u && Ae(u, () => {
      u = null;
    })), _ && ue(!0);
  }, a), b && (i = T);
}
let ct = null;
function Pr(e, t) {
  return t;
}
function qr(e, t, n, r) {
  for (var s = [], i = t.length, u = 0; u < i; u++)
    It(t[u].e, s, !0);
  var l = i > 0 && s.length === 0 && n !== null;
  if (l) {
    var o = (
      /** @type {Element} */
      /** @type {Element} */
      n.parentNode
    );
    Rn(o), o.append(
      /** @type {Element} */
      n
    ), r.clear(), fe(e, t[0].prev, t[i - 1].next);
  }
  kn(s, () => {
    for (var a = 0; a < i; a++) {
      var _ = t[a];
      l || (r.delete(_.k), fe(e, _.prev, _.next)), Ie(_.e, !l);
    }
  });
}
function et(e, t, n, r, s, i = null) {
  var u = e, l = { flags: t, items: /* @__PURE__ */ new Map(), first: null }, o = (t & tn) !== 0;
  if (o) {
    var a = (
      /** @type {Element} */
      e
    );
    u = b ? ne(
      /** @type {Comment | Text} */
      a.firstChild
    ) : a.appendChild(we());
  }
  b && Oe();
  var _ = null;
  Dt(() => {
    var f = n(), v = kt(f) ? f : f == null ? [] : Array.from(f), d = v.length, $ = l.flags;
    $ & dt && !on(v) && !(ln in v) && !(V in v) && ($ ^= dt, $ & Jn && !($ & qe) && ($ ^= qe));
    let m = !1;
    if (b) {
      var E = (
        /** @type {Comment} */
        u.data === xt
      );
      E !== (d === 0) && (u = vt(), ne(u), ue(!1), m = !0);
    }
    if (b) {
      for (var h = null, g, c = 0; c < d; c++) {
        if (T.nodeType === 8 && /** @type {Comment} */
        T.data === Ct) {
          u = /** @type {Comment} */
          T, m = !0, ue(!1);
          break;
        }
        var w = v[c], J = r(w, c);
        g = Mn(T, l, h, null, w, J, c, s, $), l.items.set(J, g), h = g;
      }
      d > 0 && ne(vt());
    }
    b || Fr(v, l, u, s, $, r), i !== null && (d === 0 ? _ ? $e(_) : _ = oe(() => i(u)) : _ !== null && Ae(_, () => {
      _ = null;
    })), m && ue(!0);
  }), b && (u = T);
}
function Fr(e, t, n, r, s, i) {
  var ae, ee, Ee, W;
  var u = (s & Wn) !== 0, l = (s & (qe | bt)) !== 0, o = e.length, a = t.items, _ = t.first, f = _, v = /* @__PURE__ */ new Set(), d = null, $ = /* @__PURE__ */ new Set(), m = [], E = [], h, g, c, w;
  if (u)
    for (w = 0; w < o; w += 1)
      h = e[w], g = i(h, w), c = a.get(g), c !== void 0 && ((ae = c.a) == null || ae.measure(), $.add(c));
  for (w = 0; w < o; w += 1) {
    if (h = e[w], g = i(h, w), c = a.get(g), c === void 0) {
      var J = f ? (
        /** @type {EffectNodes} */
        f.e.nodes.start
      ) : n;
      d = Mn(
        J,
        t,
        d,
        d === null ? t.first : d.next,
        h,
        g,
        w,
        r,
        s
      ), a.set(g, d), m = [], E = [], f = d.next;
      continue;
    }
    if (l && jr(c, h, w, s), c.e.f & pe && ($e(c.e), u && ((ee = c.a) == null || ee.unfix(), $.delete(c))), c !== f) {
      if (v.has(c)) {
        if (m.length < E.length) {
          var j = E[0], R;
          d = j.prev;
          var C = m[0], x = m[m.length - 1];
          for (R = 0; R < m.length; R += 1)
            Kt(m[R], j, n);
          for (R = 0; R < E.length; R += 1)
            v.delete(E[R]);
          fe(t, C.prev, x.next), fe(t, d, C), fe(t, x, j), f = j, d = x, w -= 1, m = [], E = [];
        } else
          v.delete(c), Kt(c, f, n), fe(t, c.prev, c.next), fe(t, c, d === null ? t.first : d.next), fe(t, d, c), d = c;
        continue;
      }
      for (m = [], E = []; f !== null && f.k !== g; )
        v.add(f), E.push(f), f = f.next;
      if (f === null)
        continue;
      c = f;
    }
    m.push(c), d = c, f = c.next;
  }
  const I = Array.from(v);
  for (; f !== null; )
    I.push(f), f = f.next;
  var q = I.length;
  if (q > 0) {
    var B = s & tn && o === 0 ? n : null;
    if (u) {
      for (w = 0; w < q; w += 1)
        (Ee = I[w].a) == null || Ee.measure();
      for (w = 0; w < q; w += 1)
        (W = I[w].a) == null || W.fix();
    }
    qr(t, I, B, a);
  }
  u && At(() => {
    var H;
    for (c of $)
      (H = c.a) == null || H.apply();
  }), y.first = t.first && t.first.e, y.last = d && d.e;
}
function jr(e, t, n, r) {
  r & qe && D(e.v, t), r & bt ? D(
    /** @type {Value<number>} */
    e.i,
    n
  ) : e.i = n;
}
function Mn(e, t, n, r, s, i, u, l, o) {
  var a = ct;
  try {
    var _ = (o & qe) !== 0, f = (o & dt) === 0, v = _ ? f ? /* @__PURE__ */ je(s) : /* @__PURE__ */ U(s) : s, d = o & bt ? /* @__PURE__ */ U(u) : u, $ = {
      i: d,
      v,
      k: i,
      a: null,
      // @ts-expect-error
      e: null,
      prev: n,
      next: r
    };
    return ct = $, $.e = oe(() => l(e, v, d), b), $.e.prev = n && n.e, $.e.next = r && r.e, n === null ? t.first = $ : (n.next = $, n.e.next = $.e), r !== null && (r.prev = $, r.e.prev = $.e), $;
  } finally {
    ct = a;
  }
}
function Kt(e, t, n) {
  for (var r = e.next ? (
    /** @type {EffectNodes} */
    e.next.e.nodes.start
  ) : n, s = t ? (
    /** @type {EffectNodes} */
    t.e.nodes.start
  ) : n, i = (
    /** @type {EffectNodes} */
    e.e.nodes.start
  ); i !== r; ) {
    var u = (
      /** @type {TemplateNode} */
      i.nextSibling
    );
    s.before(i), i = u;
  }
}
function fe(e, t, n) {
  t === null ? e.first = n : (t.next = n, t.e.next = n && n.e), n !== null && (n.prev = t, n.e.prev = t && t.e);
}
var Gt = /* @__PURE__ */ new Set();
function Hr(e, t) {
  {
    if (Gt.has(t)) return;
    Gt.add(t);
  }
  At(() => {
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
      const s = document.createElement("style");
      s.id = t.hash, s.textContent = t.code, r.appendChild(s);
    }
  });
}
let Zt = !1;
function Pn() {
  Zt || (Zt = !0, document.addEventListener(
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
function Je(e) {
  if (b) {
    var t = !1, n = () => {
      if (!t) {
        if (t = !0, e.hasAttribute("value")) {
          var r = e.value;
          yt(e, "value", null), e.value = r;
        }
        if (e.hasAttribute("checked")) {
          var s = e.checked;
          yt(e, "checked", null), e.checked = s;
        }
      }
    };
    e.__on_r = n, or(n), Pn();
  }
}
function yt(e, t, n) {
  n = n == null ? null : n + "";
  var r = e.__attributes ?? (e.__attributes = {});
  b && (r[t] = e.getAttribute(t), t === "src" || t === "href" || t === "srcset") || r[t] !== (r[t] = n) && (t === "loading" && (e[tr] = n), n === null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Qt(e, t, n) {
  n ? e.classList.add(t) : e.classList.remove(t);
}
function qn(e, t, n, r = n) {
  e.addEventListener(t, n);
  const s = e.__on_r;
  s ? e.__on_r = () => {
    s(), r();
  } : e.__on_r = r, Pn();
}
function Et(e, t, n) {
  qn(e, "input", () => {
    n(Xt(e) ? en(e.value) : e.value);
  }), st(() => {
    var r = t();
    if (b && e.defaultValue !== e.value) {
      n(e.value);
      return;
    }
    Xt(e) && r === en(e.value) || e.type === "date" && !r && !e.value || (e.value = r ?? "");
  });
}
function Br(e, t, n) {
  qn(e, "change", () => {
    var r = e.checked;
    n(r);
  }), t() == null && n(!1), st(() => {
    var r = t();
    e.checked = !!r;
  });
}
function Xt(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function en(e) {
  return e === "" ? null : +e;
}
function Ce(e, t, n, r) {
  var $;
  var s = (n & zn) !== 0, i = (
    /** @type {V} */
    e[t]
  ), u = ($ = _t(e, t)) == null ? void 0 : $.set, l = (
    /** @type {V} */
    r
  ), o = () => l;
  i === void 0 && r !== void 0 && (u && s && $r(), i = o(), u && u(i));
  var a;
  if (a = () => {
    var m = (
      /** @type {V} */
      e[t]
    );
    return m === void 0 ? o() : m;
  }, u) {
    var _ = e.$$legacy;
    return function(m, E) {
      return arguments.length > 0 ? ((!E || _) && u(E ? a() : m), m) : a();
    };
  }
  var f = !1, v = /* @__PURE__ */ je(i), d = /* @__PURE__ */ Te(() => {
    var m = a(), E = p(v);
    return f ? (f = !1, E) : v.v = m;
  });
  return function(m, E) {
    var h = p(d);
    if (arguments.length > 0) {
      const g = E ? p(d) : m;
      return d.equals(g) || (f = !0, D(v, g), p(d)), m;
    }
    return h;
  };
}
function Yr(e) {
  return new Vr(e);
}
var ie, z;
class Vr {
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
    lt(this, ie);
    /** @type {Record<string, any>} */
    lt(this, z);
    var n = /* @__PURE__ */ new Map(), r = (i, u) => {
      var l = /* @__PURE__ */ je(u);
      return n.set(i, l), l;
    };
    const s = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(i, u) {
          return p(n.get(u) ?? r(u, Reflect.get(i, u)));
        },
        has(i, u) {
          return p(n.get(u) ?? r(u, Reflect.get(i, u))), Reflect.has(i, u);
        },
        set(i, u, l) {
          return D(n.get(u) ?? r(u, l), l), Reflect.set(i, u, l);
        }
      }
    );
    ot(this, z, (t.hydrate ? Ir : Dn)(t.component, {
      target: t.target,
      props: s,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover
    })), le(), ot(this, ie, s.$$events);
    for (const i of Object.keys(Y(this, z)))
      i === "$set" || i === "$destroy" || i === "$on" || Fe(this, i, {
        get() {
          return Y(this, z)[i];
        },
        /** @param {any} value */
        set(u) {
          Y(this, z)[i] = u;
        },
        enumerable: !0
      });
    Y(this, z).$set = /** @param {Record<string, any>} next */
    (i) => {
      Object.assign(s, i);
    }, Y(this, z).$destroy = () => {
      Mr(Y(this, z));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    Y(this, z).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, n) {
    Y(this, ie)[t] = Y(this, ie)[t] || [];
    const r = (...s) => n.call(this, ...s);
    return Y(this, ie)[t].push(r), () => {
      Y(this, ie)[t] = Y(this, ie)[t].filter(
        /** @param {any} fn */
        (s) => s !== r
      );
    };
  }
  $destroy() {
    Y(this, z).$destroy();
  }
}
ie = new WeakMap(), z = new WeakMap();
let Fn;
typeof HTMLElement == "function" && (Fn = class extends HTMLElement {
  /**
   * @param {*} $$componentCtor
   * @param {*} $$slots
   * @param {*} use_shadow_dom
   */
  constructor(t, n, r) {
    super();
    /** The Svelte component constructor */
    Z(this, "$$ctor");
    /** Slots */
    Z(this, "$$s");
    /** @type {any} The Svelte component instance */
    Z(this, "$$c");
    /** Whether or not the custom element is connected */
    Z(this, "$$cn", !1);
    /** @type {Record<string, any>} Component props data */
    Z(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    Z(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    Z(this, "$$p_d", {});
    /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
    Z(this, "$$l", {});
    /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
    Z(this, "$$l_u", /* @__PURE__ */ new Map());
    /** @type {any} The managed render effect for reflecting attributes */
    Z(this, "$$me");
    this.$$ctor = t, this.$$s = n, r && this.attachShadow({ mode: "open" });
  }
  /**
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean | AddEventListenerOptions} [options]
   */
  addEventListener(t, n, r) {
    if (this.$$l[t] = this.$$l[t] || [], this.$$l[t].push(n), this.$$c) {
      const s = this.$$c.$on(t, n);
      this.$$l_u.set(n, s);
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
      const s = this.$$l_u.get(n);
      s && (s(), this.$$l_u.delete(n));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(s) {
        return (i) => {
          const u = document.createElement("slot");
          s !== "default" && (u.name = s), F(i, u);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const n = {}, r = Ur(this);
      for (const s of this.$$s)
        s in r && (s === "default" && !this.$$d.children ? (this.$$d.children = t(s), n.default = !0) : n[s] = t(s));
      for (const s of this.attributes) {
        const i = this.$$g_p(s.name);
        i in this.$$d || (this.$$d[i] = We(i, s.value, this.$$p_d, "toProp"));
      }
      for (const s in this.$$p_d)
        !(s in this.$$d) && this[s] !== void 0 && (this.$$d[s] = this[s], delete this[s]);
      this.$$c = Yr({
        component: this.$$ctor,
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$host: this
        }
      }), this.$$me = st(() => {
        var s;
        this.$$r = !0;
        for (const i of Ke(this.$$c)) {
          if (!((s = this.$$p_d[i]) != null && s.reflect)) continue;
          this.$$d[i] = this.$$c[i];
          const u = We(
            i,
            this.$$d[i],
            this.$$p_d,
            "toAttribute"
          );
          u == null ? this.removeAttribute(this.$$p_d[i].attribute || i) : this.setAttribute(this.$$p_d[i].attribute || i, u);
        }
        this.$$r = !1;
      });
      for (const s in this.$$l)
        for (const i of this.$$l[s]) {
          const u = this.$$c.$on(s, i);
          this.$$l_u.set(i, u);
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
    var s;
    this.$$r || (t = this.$$g_p(t), this.$$d[t] = We(t, r, this.$$p_d, "toProp"), (s = this.$$c) == null || s.$set({ [t]: this.$$d[t] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), Ie(this.$$me), this.$$c = void 0);
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
function We(e, t, n, r) {
  var i;
  const s = (i = n[e]) == null ? void 0 : i.type;
  if (t = s === "Boolean" && typeof t != "boolean" ? t != null : t, !r || !n[e])
    return t;
  if (r === "toAttribute")
    switch (s) {
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
    switch (s) {
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
function Ur(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function jn(e, t, n, r, s, i) {
  let u = class extends Fn {
    constructor() {
      super(e, n, s), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Ke(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return Ke(t).forEach((l) => {
    Fe(u.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(o) {
        var a;
        o = We(l, o, t), this.$$d[l] = o, (a = this.$$c) == null || a.$set({ [l]: o });
      }
    });
  }), r.forEach((l) => {
    Fe(u.prototype, l, {
      get() {
        var o;
        return (o = this.$$c) == null ? void 0 : o[l];
      }
    });
  }), e.element = /** @type {any} */
  u, u;
}
var Jr = (e, t, n) => t()(p(n)), Wr = /* @__PURE__ */ X('<input type="checkbox">'), zr = /* @__PURE__ */ X('<input type="number">'), Kr = /* @__PURE__ */ X('<input type="text">'), Gr = /* @__PURE__ */ X("<p><tt> </tt> <!> </p>"), Zr = /* @__PURE__ */ X("<p><tt> </tt> </p>"), Qr = /* @__PURE__ */ X("<div><hr> <p><button> </button> </p> <tt> </tt> <!> <tt> </tt> <!> <tt> </tt></div>");
function Hn(e, t) {
  Nt(t, !0);
  let n = Ce(t, "name", 7), r = Ce(t, "def", 7), s = Ce(t, "defaults", 7), i = Ce(t, "run", 7), u = /* @__PURE__ */ Te(() => r().parameters ? Object.values(r().parameters) : []), l = /* @__PURE__ */ Te(() => Object.fromEntries(p(u).map(({ name: C }) => [C, null]))), o = /* @__PURE__ */ U(ce({ ...s() })), a = /* @__PURE__ */ Te(() => ({ ...p(l), ...p(o) }));
  var _ = Qr(), f = P(_), v = S(S(f, !0)), d = P(v);
  d.__click = [Jr, i, a];
  var $ = P(d);
  N(d);
  var m = S(d, !0);
  N(v);
  var E = S(S(v, !0)), h = P(E);
  h.nodeValue = "{", N(E);
  var g = S(S(E, !0));
  et(g, 69, () => p(u), (C, x) => k(C).name, (C, x, I) => {
    var q = Gr(), B = P(q), ae = P(B);
    K(() => te(ae, `${JSON.stringify(k(x).name) ?? ""}:`)), N(B);
    var ee = S(S(B, !0));
    wt(
      ee,
      () => k(x).type === "boolean",
      (W) => {
        var H = Wr();
        Je(H), Br(H, () => p(o)[k(x).name], (se) => p(o)[k(x).name] = se), F(W, H);
      },
      (W) => {
        var H = Ln(), se = $t(H);
        wt(
          se,
          () => k(x).type === "number",
          (it) => {
            var he = zr();
            Je(he), Et(he, () => p(o)[k(x).name], (ut) => p(o)[k(x).name] = ut), F(it, he);
          },
          (it) => {
            var he = Kr();
            Je(he), Et(he, () => p(o)[k(x).name], (ut) => p(o)[k(x).name] = ut), F(it, he);
          },
          !0
        ), F(W, H);
      }
    );
    var Ee = S(ee, !0);
    N(q), K(() => te(Ee, ` [${k(x).type ?? ""}]: ${k(x).description ?? ""}`)), F(C, q);
  });
  var c = S(S(g, !0)), w = P(c);
  w.nodeValue = "} -> {", N(c);
  var J = S(S(c, !0));
  et(J, 65, () => Object.values(r().returns), Pr, (C, x, I) => {
    var q = Zr(), B = P(q), ae = P(B);
    K(() => te(ae, `${JSON.stringify(k(x).name) ?? ""}:`)), N(B);
    var ee = S(B, !0);
    N(q), K(() => te(ee, ` [${k(x).type ?? ""}]: ${k(x).description ?? ""}`)), F(C, q);
  });
  var j = S(S(J, !0)), R = P(j);
  return R.nodeValue = "}", N(j), N(_), K(() => {
    te($, n()), te(m, ` ${r().description ?? ""}`);
  }), F(e, _), Lt({
    get name() {
      return n();
    },
    set name(C) {
      n(C), le();
    },
    get def() {
      return r();
    },
    set def(C) {
      r(C), le();
    },
    get defaults() {
      return s();
    },
    set defaults(C) {
      s(C), le();
    },
    get run() {
      return i();
    },
    set run(C) {
      i(C), le();
    }
  });
}
Lr(["click"]);
jn(Hn, { name: {}, def: {}, defaults: {}, run: {} }, [], [], !0);
var Xr = /* @__PURE__ */ X("<div><!></div>"), es = /* @__PURE__ */ X(
  `
							(Running...)
						`,
  1
), ts = /* @__PURE__ */ X(`<div><b> </b>(<tt> </tt>) <pre>
					<!>
				</pre></div>`), ns = /* @__PURE__ */ X("<!> <div></div>", 1), rs = /* @__PURE__ */ X('<div class="command-panel svelte-1mm37qn"><div class="search"><input type="search" placeholder="Search commands..."></div> <!></div>');
const ss = {
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
	/* (unused) .command-panel.open .commands {
		display: block;
	}*/
	/* (unused) .commands {
		display: none;
	}*/
`
};
function is(e, t) {
  Nt(t, !0), Hr(e, ss);
  function n(h, g) {
    if (!p(a)) return !0;
    let c = p(a).toLowerCase();
    return h.toLowerCase().includes(c) || g.description.toLowerCase().includes(c);
  }
  function r(h, g) {
    return Object.entries(g).filter(([c, w]) => n(c, w)).map(([c, w]) => [c, w, {}]);
  }
  let s = Ce(t, "commands", 7, null), i = Ce(t, "suggest", 7, r), u = /* @__PURE__ */ U(ce([]));
  async function l(h, g) {
    if (!s()) return;
    let c = s().run(h, g);
    p(u).push({ command: h, properties: g, result: c });
  }
  let o = /* @__PURE__ */ U(ce({}));
  Ar(() => {
    var h;
    (h = s()) == null || h.index.then((g) => {
      D(o, ce(g));
    });
  });
  let a = /* @__PURE__ */ U(""), _ = /* @__PURE__ */ Te(() => i()(p(a), p(o))), f = /* @__PURE__ */ U(!1), v = /* @__PURE__ */ Te(() => p(f) || p(a));
  var d = rs();
  {
    const h = (g, c, w = an) => {
      let J = () => c == null ? void 0 : c()[0], j = () => c == null ? void 0 : c()[1], R = () => c == null ? void 0 : c()[2];
      var C = Xr(), x = P(C);
      Hn(x, {
        get name() {
          return J();
        },
        get def() {
          return j();
        },
        get defaults() {
          return R();
        },
        run: (I) => l(J(), I)
      }), N(C), K(() => Qt(C, "selected", w())), F(g, C);
    };
    var $ = P(d), m = P($);
    Je(m), N($);
    var E = S(S($, !0));
    wt(E, () => p(v), (g) => {
      var c = ns(), w = $t(c);
      zt(w, () => p(_), null, (j, R) => {
        var C = Ln(), x = $t(C);
        et(x, 70, () => p(R), (I, q) => k(I), (I, q, B) => {
          h(I, () => k(q), () => !1);
        }), F(j, C);
      });
      var J = S(S(w, !0));
      et(J, 77, () => p(u), (j, R) => k(j).command, (j, R, C) => {
        var x = ts(), I = P(x), q = P(I);
        N(I);
        var B = S(S(I, !0)), ae = P(B);
        K(() => te(ae, JSON.stringify(k(R).properties, null, 2))), N(B);
        var ee = S(S(B, !0)), Ee = S(P(ee));
        zt(
          Ee,
          () => k(R).result,
          (W) => {
            var H = es();
            F(W, H);
          },
          (W, H) => {
            var se = Wt();
            K(() => te(se, `
							${JSON.stringify(p(H), null, 2) ?? ""}
						`)), F(W, se);
          },
          (W, H) => {
            var se = Wt();
            K(() => te(se, `
							Failed: ${p(H).message ?? ""}
						`)), F(W, se);
          }
        ), Qn(), N(ee), N(x), K(() => te(q, k(R).command)), F(j, x);
      }), N(J), F(g, c);
    }), N(d), K(() => yt(m, "size", p(v) ? 100 : 20)), Et(m, () => p(a), (g) => D(a, g)), Jt(
      "focus",
      m,
      () => {
        D(f, !0);
      },
      !1
    ), Jt(
      "blur",
      m,
      () => {
        D(f, !1);
      },
      !1
    );
  }
  return K(() => Qt(d, "open", p(v))), F(e, d), Lt({
    get commands() {
      return s();
    },
    set commands(h = null) {
      s(h), le();
    },
    get suggest() {
      return i();
    },
    set suggest(h = r) {
      i(h), le();
    }
  });
}
customElements.define("command-panel", jn(is, { commands: {}, suggest: {} }, [], [], !0));
class as {
  constructor(t) {
    const n = {}, r = {};
    for (const [s, { description: i, parameters: u, returns: l, run: o }] of Object.entries(t))
      r[s] = (a) => o(a), n[s] = { description: i, parameters: u, returns: l };
    this.index = Promise.resolve(n), this.runners = r;
  }
  async run(t, n) {
    return await this.runners[t](n);
  }
}
class fs {
  constructor(t) {
    this.url = t || window.location.href;
  }
  get index() {
    return fetch(this.url, { method: "REFLECT" }).then((t) => t.json());
  }
  async run(t, n) {
    return await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: t, parameters: n })
    }).then((r) => r.json());
  }
}
class cs {
  constructor(t, n) {
    this.expectedOrigin = t, this.iframe = n;
    const r = new ls((s) => {
      n.contentWindow.postMessage(s, t);
    });
    this.resolver = r, this.cancelMessage = Bn(t, (s) => {
      s.source == n.contentWindow && r.onMessage(s);
    });
  }
  close() {
    this.cancelMessage();
  }
  get index() {
    return this.resolver.send({ index: !0 });
  }
  async run(t, n) {
    return await this.resolver.send({ run: { command: t, parameters: n } });
  }
}
function ds(e, t) {
  return us(e, async (n) => {
    if (n.index != null)
      return await t.index;
    if (n.run != null) {
      const { command: r, parameters: s } = n.run;
      return await t.run(r, s);
    }
    throw new Error("Unrecognized message");
  });
}
function Bn(e, t) {
  const n = async (r) => {
    r.origin === e && t(r);
  };
  return window.addEventListener("message", n, !1), () => window.removeEventListener("message", n, !1);
}
function us(e, t) {
  return Bn(e, async (n) => {
    const { id: r, message: s } = n.data;
    try {
      const i = await t(s);
      n.source.postMessage({ resolve: { id: r, value: i } }, e);
    } catch (i) {
      n.source.postMessage({ reject: { id: r, reason: i } }, e);
    }
  });
}
class ls {
  constructor(t) {
    this.msgID = 0, this.pending = {}, this.sendMessage = t;
  }
  send(t) {
    const n = ++this.msgID;
    return this.sendMessage({ id: n, message: t }), new Promise((r, s) => {
      this.pending[n] = { resolve: r, reject: s };
    });
  }
  onMessage(t) {
    if (t.data.resolve) {
      const { id: n, value: r } = t.data.resolve, { resolve: s } = this.pending[n];
      delete this.pending[n], s(r);
    } else if (t.data.reject) {
      const { id: n, reason: r } = t.data.reject, { reject: s } = this.pending[n];
      delete this.pending[n], s(r);
    }
  }
}
export {
  is as CommandPanel,
  cs as IFrameCommands,
  fs as ReflectCommands,
  as as StaticCommands,
  ds as provideCommandsToIFrameParent
};

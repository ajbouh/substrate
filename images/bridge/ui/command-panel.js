var Bn = Object.defineProperty;
var It = (e) => {
  throw TypeError(e);
};
var Yn = (e, t, n) => t in e ? Bn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Y = (e, t, n) => Yn(e, typeof t != "symbol" ? t + "" : t, n), Pt = (e, t, n) => t.has(e) || It("Cannot " + n);
var V = (e, t, n) => (Pt(e, t, "read from private field"), n ? n.call(e) : t.get(e)), lt = (e, t, n) => t.has(e) ? It("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), ot = (e, t, n, r) => (Pt(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
const Vn = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Vn);
const Fe = 1, bt = 2, Un = 4, tn = 8, Jn = 16, dt = 64, Kn = 2, zn = 1, Wn = 2, nn = "[", xt = "[!", Tt = "]", Ve = {}, Ie = Symbol(), Gn = ["touchstart", "touchmove", "touchend"];
function rn(e) {
  console.warn("hydration_mismatch");
}
let b = !1;
function ue(e) {
  b = e;
}
let C;
function ne(e) {
  return C = e;
}
function Oe() {
  if (C === null)
    throw rn(), Ve;
  return C = /** @type {TemplateNode} */
  C.nextSibling;
}
function N(e) {
  b && (C = e);
}
function Zn() {
  b && Oe();
}
function vt() {
  for (var e = 0, t = C; ; ) {
    if (t.nodeType === 8) {
      var n = (
        /** @type {Comment} */
        t.data
      );
      if (n === Tt) {
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
const ge = 2, sn = 4, Re = 8, un = 16, re = 32, Ct = 64, we = 128, ze = 256, Q = 512, _e = 1024, Ne = 2048, pe = 4096, Le = 8192, Qn = 16384, St = 32768, Xn = 1 << 18, U = Symbol("$state"), ln = Symbol("$state.frozen"), er = Symbol("");
var kt = Array.isArray, tr = Array.from, We = Object.keys, on = Object.isFrozen, Me = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, nr = Object.prototype, rr = Array.prototype, ir = Object.getPrototypeOf;
const fn = () => {
};
function sr(e) {
  return typeof (e == null ? void 0 : e.then) == "function";
}
function an(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
const ur = typeof requestIdleCallback > "u" ? (e) => setTimeout(e, 1) : requestIdleCallback;
let Ge = !1, Ze = !1, ht = [], mt = [];
function cn() {
  Ge = !1;
  const e = ht.slice();
  ht = [], an(e);
}
function dn() {
  Ze = !1;
  const e = mt.slice();
  mt = [], an(e);
}
function At(e) {
  Ge || (Ge = !0, queueMicrotask(cn)), ht.push(e);
}
function lr(e) {
  Ze || (Ze = !0, ur(dn)), mt.push(e);
}
function or() {
  Ge && cn(), Ze && dn();
}
function vn(e) {
  return e === this.v;
}
function fr(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function ar(e) {
  return !fr(e, this.v);
}
function cr(e) {
  throw new Error("effect_in_teardown");
}
function dr() {
  throw new Error("effect_in_unowned_derived");
}
function vr(e) {
  throw new Error("effect_orphan");
}
function _r() {
  throw new Error("effect_update_depth_exceeded");
}
function hr() {
  throw new Error("hydration_failed");
}
function mr(e) {
  throw new Error("props_invalid_value");
}
function $r() {
  throw new Error("state_unsafe_mutation");
}
// @__NO_SIDE_EFFECTS__
function J(e) {
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
function He(e) {
  var n;
  const t = /* @__PURE__ */ J(e);
  return t.equals = ar, O !== null && O.l !== null && ((n = O.l).s ?? (n.s = [])).push(t), t;
}
function D(e, t) {
  return A !== null && Xe() && A.f & ge && $r(), e.equals(t) || (e.v = t, e.version = pn(), _n(e, _e), Xe() && w !== null && w.f & Q && !(w.f & re) && (L !== null && L.includes(e) ? (Z(w, _e), rt(w)) : de === null ? yr([e]) : de.push(e))), t;
}
function _n(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = Xe(), i = n.length, s = 0; s < i; s++) {
      var u = n[s], l = u.f;
      l & _e || !r && u === w || (Z(u, t), l & (Q | we) && (l & ge ? _n(
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
function Ce(e) {
  let t = ge | _e;
  w === null && (t |= we);
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
      gr(t[n]);
  }
}
function mn(e) {
  hn(e);
  var t = yn(e), n = (xe || e.f & we) && e.deps !== null ? Ne : Q;
  Z(e, n), e.equals(t) || (e.v = t, e.version = pn());
}
function gr(e) {
  hn(e), tt(e, 0), Z(e, Le), e.first = e.last = e.deps = e.reactions = // @ts-expect-error `signal.fn` cannot be `null` while the signal is alive
  e.fn = null;
}
const $n = 0, pr = 1;
let Ue = $n, je = !1, Se = !1, Ot = !1;
function Ft(e) {
  Se = e;
}
function Mt(e) {
  Ot = e;
}
let me = [], ke = 0, A = null;
function Qe(e) {
  A = e;
}
let w = null;
function Ht(e) {
  w = e;
}
let L = null, I = 0, de = null;
function yr(e) {
  de = e;
}
let gn = 0, xe = !1, O = null;
function jt(e) {
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
      var r = (t & we) !== 0, i;
      if (t & ze) {
        for (i = 0; i < n.length; i++)
          ((u = n[i]).reactions ?? (u.reactions = [])).push(e);
        e.f ^= ze;
      }
      for (i = 0; i < n.length; i++) {
        var s = n[i];
        if (Be(
          /** @type {Derived} */
          s
        ) && mn(
          /** @type {Derived} */
          s
        ), s.version > e.version)
          return !0;
        r && !xe && !((l = s == null ? void 0 : s.reactions) != null && l.includes(e)) && (s.reactions ?? (s.reactions = [])).push(e);
      }
    }
    Z(e, Q);
  }
  return !1;
}
function wr(e, t, n) {
  throw e;
}
function yn(e) {
  var t = L, n = I, r = de, i = A, s = xe;
  L = /** @type {null | Value[]} */
  null, I = 0, de = null, A = e.f & (re | Ct) ? null : e, xe = !Se && (e.f & we) !== 0;
  try {
    var u = (
      /** @type {Function} */
      (0, e.fn)()
    ), l = e.deps;
    if (L !== null) {
      var o, f;
      if (l !== null) {
        var _ = I === 0 ? L : l.slice(0, I).concat(L), a = _.length > 16 ? new Set(_) : null;
        for (f = I; f < l.length; f++)
          o = l[f], (a !== null ? !a.has(o) : !_.includes(o)) && wn(e, o);
      }
      if (l !== null && I > 0)
        for (l.length = I + L.length, f = 0; f < L.length; f++)
          l[I + f] = L[f];
      else
        e.deps = l = L;
      if (!xe)
        for (f = I; f < l.length; f++) {
          o = l[f];
          var v = o.reactions;
          v === null ? o.reactions = [e] : v[v.length - 1] !== e && !v.includes(e) && v.push(e);
        }
    } else l !== null && I < l.length && (tt(e, I), l.length = I);
    return u;
  } finally {
    L = t, I = n, de = r, A = i, xe = s;
  }
}
function wn(e, t) {
  const n = t.reactions;
  let r = 0;
  if (n !== null) {
    r = n.length - 1;
    const i = n.indexOf(e);
    i !== -1 && (r === 0 ? t.reactions = null : (n[i] = n[r], n.pop()));
  }
  r === 0 && t.f & ge && (Z(t, Ne), t.f & (we | ze) || (t.f ^= ze), tt(
    /** @type {Derived} **/
    t,
    0
  ));
}
function tt(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t === 0 ? null : n.slice(0, t), i = /* @__PURE__ */ new Set(), s = t; s < n.length; s++) {
      var u = n[s];
      i.has(u) || (i.add(u), (r === null || !r.includes(u)) && wn(e, u));
    }
}
function Rt(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    var r = n.next;
    qe(n, t), n = r;
  }
}
function nt(e) {
  var t = e.f;
  if (!(t & Le)) {
    Z(e, Q);
    var n = e.ctx, r = w, i = O;
    w = e, O = n;
    try {
      t & un || Rt(e), Cn(e);
      var s = yn(e);
      e.teardown = typeof s == "function" ? s : null, e.version = gn;
    } catch (u) {
      wr(
        /** @type {Error} */
        u
      );
    } finally {
      w = r, O = i;
    }
  }
}
function En() {
  ke > 1e3 && (ke = 0, _r()), ke++;
}
function bn(e) {
  var t = e.length;
  if (t !== 0) {
    En();
    var n = Se;
    Se = !0;
    try {
      for (var r = 0; r < t; r++) {
        var i = e[r];
        if (i.first === null && !(i.f & re))
          Bt([i]);
        else {
          var s = [];
          xn(i, s), Bt(s);
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
function Er() {
  if (je = !1, ke > 1001)
    return;
  const e = me;
  me = [], bn(e), je || (ke = 0);
}
function rt(e) {
  Ue === $n && (je || (je = !0, queueMicrotask(Er)));
  for (var t = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (n & re) {
      if (!(n & Q)) return;
      Z(t, Ne);
    }
  }
  me.push(t);
}
function xn(e, t) {
  var n = e.first, r = [];
  e: for (; n !== null; ) {
    var i = n.f, s = (i & (Le | pe)) === 0, u = i & re, l = (i & Q) !== 0, o = n.first;
    if (s && (!u || !l)) {
      if (u && Z(n, Q), i & Re) {
        if (!u && Be(n) && (nt(n), o = n.first), o !== null) {
          n = o;
          continue;
        }
      } else if (i & sn)
        if (u || l) {
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
        var _ = v.next;
        if (_ !== null) {
          n = _;
          continue e;
        }
        v = v.parent;
      }
    }
    n = f;
  }
  for (var a = 0; a < r.length; a++)
    o = r[a], t.push(o), xn(o, t);
}
function le(e) {
  var t = Ue, n = me;
  try {
    En();
    const i = [];
    Ue = pr, me = i, je = !1, bn(n);
    var r = e == null ? void 0 : e();
    return or(), (me.length > 0 || i.length > 0) && le(), ke = 0, r;
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
    L === null && n !== null && n[I] === e ? I++ : (n === null || I === 0 || n[I - 1] !== e) && (L === null ? L = [e] : L[L.length - 1] !== e && L.push(e)), de !== null && w !== null && w.f & Q && !(w.f & re) && de.includes(e) && (Z(w, _e), rt(w));
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
function br(e) {
  const t = A;
  try {
    return A = null, e();
  } finally {
    A = t;
  }
}
const xr = ~(_e | Ne | Q);
function Z(e, t) {
  e.f = e.f & xr | t;
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
    r2: /* @__PURE__ */ J(!1)
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
        Tn(r[n]);
    }
    O = t.p, t.m = !0;
  }
  return e || /** @type {T} */
  {};
}
function k(e) {
  return Tr(e) ? p(e) : e;
}
function Cr(e) {
  w === null && A === null && vr(), A !== null && A.f & we && dr(), Ot && cr();
}
function Yt(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function De(e, t, n, r = !0) {
  var i = (e & Ct) !== 0, s = {
    ctx: O,
    deps: null,
    nodes: null,
    f: e | _e,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: i ? null : w,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (n) {
    var u = Se;
    try {
      Ft(!0), nt(s), s.f |= Qn;
    } catch (o) {
      throw qe(s), o;
    } finally {
      Ft(u);
    }
  } else t !== null && rt(s);
  var l = n && s.deps === null && s.first === null && s.nodes === null && s.teardown === null;
  return !l && !i && r && (w !== null && Yt(s, w), A !== null && A.f & ge && Yt(s, A)), s;
}
function Sr(e) {
  const t = De(Re, null, !1);
  return Z(t, Q), t.teardown = e, t;
}
function kr(e) {
  Cr();
  var t = w !== null && (w.f & Re) !== 0 && // TODO do we actually need this? removing them changes nothing
  O !== null && !O.m;
  if (t) {
    var n = (
      /** @type {ComponentContext} */
      O
    );
    (n.e ?? (n.e = [])).push(e);
  } else {
    var r = Tn(e);
    return r;
  }
}
function Ar(e) {
  const t = De(Ct, e, !0);
  return () => {
    qe(t);
  };
}
function Tn(e) {
  return De(sn, e, !1);
}
function it(e) {
  return De(Re, e, !0);
}
function G(e) {
  return it(e);
}
function Dt(e, t = 0) {
  return De(Re | un | t, e, !0);
}
function oe(e, t = !0) {
  return De(Re | re, e, !0, t);
}
function Cn(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = Ot, r = A;
    Mt(!0), Qe(null);
    try {
      t.call(null);
    } finally {
      Mt(n), Qe(r);
    }
  }
}
function qe(e, t = !0) {
  var n = !1;
  if ((t || e.f & Xn) && e.nodes !== null) {
    for (var r = e.nodes.start, i = e.nodes.end; r !== null; ) {
      var s = r === i ? null : (
        /** @type {TemplateNode} */
        r.nextSibling
      );
      r.remove(), r = s;
    }
    n = !0;
  }
  if (Rt(e, t && !n), tt(e, 0), Z(e, Le), e.transitions)
    for (const l of e.transitions)
      l.stop();
  Cn(e);
  var u = e.parent;
  u !== null && e.f & re && u.first !== null && Sn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.parent = e.fn = e.nodes = null;
}
function Sn(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ae(e, t) {
  var n = [];
  qt(e, n, !0), kn(n, () => {
    qe(e), t && t();
  });
}
function kn(e, t) {
  var n = e.length;
  if (n > 0) {
    var r = () => --n || t();
    for (var i of e)
      i.out(r);
  } else
    t();
}
function qt(e, t, n) {
  if (!(e.f & pe)) {
    if (e.f ^= pe, e.transitions !== null)
      for (const u of e.transitions)
        (u.is_global || n) && t.push(u);
    for (var r = e.first; r !== null; ) {
      var i = r.next, s = (r.f & St) !== 0 || (r.f & re) !== 0;
      qt(r, t, s ? n : !1), r = i;
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
      var r = n.next, i = (n.f & St) !== 0 || (n.f & re) !== 0;
      An(n, i ? t : !1), n = r;
    }
    if (e.transitions !== null)
      for (const s of e.transitions)
        (s.is_global || t) && s.in();
  }
}
function ce(e, t = null, n) {
  if (typeof e == "object" && e != null && !on(e) && !(ln in e)) {
    if (U in e) {
      const i = (
        /** @type {ProxyMetadata<T>} */
        e[U]
      );
      if (i.t === e || i.p === e)
        return i.p;
    }
    const r = ir(e);
    if (r === nr || r === rr) {
      const i = new Proxy(e, Or);
      return Me(e, U, {
        value: (
          /** @type {ProxyMetadata} */
          {
            s: /* @__PURE__ */ new Map(),
            v: /* @__PURE__ */ J(0),
            a: kt(e),
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
function Vt(e, t = 1) {
  D(e, e.v + t);
}
const Or = {
  defineProperty(e, t, n) {
    if (n.value) {
      const r = e[U], i = r.s.get(t);
      i !== void 0 && D(i, ce(n.value, r));
    }
    return Reflect.defineProperty(e, t, n);
  },
  deleteProperty(e, t) {
    const n = e[U], r = n.s.get(t), i = n.a, s = delete e[t];
    if (i && s) {
      const u = n.s.get("length"), l = e.length - 1;
      u !== void 0 && u.v !== l && D(u, l);
    }
    return r !== void 0 && D(r, Ie), s && Vt(n.v), s;
  },
  get(e, t, n) {
    var s;
    if (t === U)
      return Reflect.get(e, U);
    const r = e[U];
    let i = r.s.get(t);
    if (i === void 0 && (!(t in e) || (s = _t(e, t)) != null && s.writable) && (i = /* @__PURE__ */ J(ce(e[t], r)), r.s.set(t, i)), i !== void 0) {
      const u = p(i);
      return u === Ie ? void 0 : u;
    }
    return Reflect.get(e, t, n);
  },
  getOwnPropertyDescriptor(e, t) {
    const n = Reflect.getOwnPropertyDescriptor(e, t);
    if (n && "value" in n) {
      const i = e[U].s.get(t);
      i && (n.value = p(i));
    }
    return n;
  },
  has(e, t) {
    var s;
    if (t === U)
      return !0;
    const n = e[U], r = Reflect.has(e, t);
    let i = n.s.get(t);
    return (i !== void 0 || w !== null && (!r || (s = _t(e, t)) != null && s.writable)) && (i === void 0 && (i = /* @__PURE__ */ J(r ? ce(e[t], n) : Ie), n.s.set(t, i)), p(i) === Ie) ? !1 : r;
  },
  set(e, t, n, r) {
    const i = e[U];
    let s = i.s.get(t);
    s === void 0 && (br(() => r[t]), s = i.s.get(t)), s !== void 0 && D(s, ce(n, i));
    const u = i.a, l = !(t in e);
    if (u && t === "length")
      for (let f = n; f < e.length; f += 1) {
        const _ = i.s.get(f + "");
        _ !== void 0 && D(_, Ie);
      }
    var o = Reflect.getOwnPropertyDescriptor(e, t);
    if (o != null && o.set ? o.set.call(r, n) : e[t] = n, l) {
      if (u) {
        const f = i.s.get("length"), _ = e.length;
        f !== void 0 && f.v !== _ && D(f, _);
      }
      Vt(i.v);
    }
    return !0;
  },
  ownKeys(e) {
    const t = e[U];
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
function ye() {
  return document.createTextNode("");
}
function P(e) {
  if (!b)
    return e.firstChild;
  var t = (
    /** @type {TemplateNode} */
    C.firstChild
  );
  return t === null && (t = C.appendChild(ye())), ne(t), t;
}
function $t(e, t) {
  if (!b) {
    var n = (
      /** @type {DocumentFragment} */
      e.firstChild
    );
    return n instanceof Comment && n.data === "" ? n.nextSibling : n;
  }
  return C;
}
function S(e, t = !1) {
  if (!b)
    return (
      /** @type {TemplateNode} */
      e.nextSibling
    );
  var n = (
    /** @type {TemplateNode} */
    C.nextSibling
  ), r = n.nodeType;
  if (t && r !== 3) {
    var i = ye();
    return n == null || n.before(i), ne(i), i;
  }
  return ne(n), /** @type {TemplateNode} */
  n;
}
function Rn(e) {
  e.textContent = "";
}
const Nn = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new Set();
function Rr(e, t, n, r) {
  function i(s) {
    if (r.capture || Pe.call(t, s), !s.cancelBubble)
      return n.call(this, s);
  }
  return e.startsWith("pointer") || e === "wheel" ? At(() => {
    t.addEventListener(e, i, r);
  }) : t.addEventListener(e, i, r), i;
}
function Jt(e, t, n, r, i) {
  var s = { capture: r, passive: i }, u = Rr(e, t, n, s);
  (t === document.body || t === window || t === document) && Sr(() => {
    t.removeEventListener(e, u, s);
  });
}
function Nr(e) {
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
  ), r = e.type, i = ((E = e.composedPath) == null ? void 0 : E.call(e)) || [], s = (
    /** @type {null | Element} */
    i[0] || e.target
  ), u = 0, l = e.__root;
  if (l) {
    var o = i.indexOf(l);
    if (o !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var f = i.indexOf(t);
    if (f === -1)
      return;
    o <= f && (u = o);
  }
  if (s = /** @type {Element} */
  i[u] || e.target, s !== t) {
    Me(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || n;
      }
    });
    try {
      for (var _, a = []; s !== null; ) {
        var v = s.parentNode || /** @type {any} */
        s.host || null;
        try {
          var d = s["__" + r];
          if (d !== void 0 && !/** @type {any} */
          s.disabled)
            if (kt(d)) {
              var [$, ...m] = d;
              $.apply(s, [e, ...m]);
            } else
              d.call(s, e);
        } catch (h) {
          _ ? a.push(h) : _ = h;
        }
        if (e.cancelBubble || v === t || v === null)
          break;
        s = v;
      }
      if (_) {
        for (let h of a)
          queueMicrotask(() => {
            throw h;
          });
        throw _;
      }
    } finally {
      e.__root = t, s = t;
    }
  }
}
function Lr(e) {
  var t = document.createElement("template");
  return t.innerHTML = e, t.content;
}
function ve(e, t) {
  w.nodes ?? (w.nodes = { start: e, end: t });
}
// @__NO_SIDE_EFFECTS__
function X(e, t) {
  var n = (t & zn) !== 0, r = (t & Wn) !== 0, i, s = !e.startsWith("<!>");
  return () => {
    if (b)
      return ve(C, null), C;
    i || (i = Lr(s ? e : "<!>" + e), n || (i = /** @type {Node} */
    i.firstChild));
    var u = (
      /** @type {TemplateNode} */
      r ? document.importNode(i, !0) : i.cloneNode(!0)
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
function Kt() {
  if (!b) {
    var e = ye();
    return ve(e, e), e;
  }
  var t = C;
  return t.nodeType !== 3 && (t.before(t = ye()), ne(t)), ve(t, t), t;
}
function Ln() {
  if (b)
    return ve(C, null), C;
  var e = document.createDocumentFragment(), t = document.createComment(""), n = ye();
  return e.append(t, n), ve(t, n), e;
}
function M(e, t) {
  if (b) {
    w.nodes.end = C, Oe();
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
  const n = t.anchor ?? t.target.appendChild(ye());
  return qn(e, { ...t, anchor: n });
}
function Dr(e, t) {
  t.intro = t.intro ?? !1;
  const n = t.target, r = b, i = C;
  try {
    for (var s = (
      /** @type {TemplateNode} */
      n.firstChild
    ); s && (s.nodeType !== 8 || /** @type {Comment} */
    s.data !== nn); )
      s = /** @type {TemplateNode} */
      s.nextSibling;
    if (!s)
      throw Ve;
    ue(!0), ne(
      /** @type {Comment} */
      s
    ), Oe();
    const u = qn(e, { ...t, anchor: s });
    if (C.nodeType !== 8 || /** @type {Comment} */
    C.data !== Tt)
      throw rn(), Ve;
    return ue(!1), /**  @type {Exports} */
    u;
  } catch (u) {
    if (u === Ve)
      return t.recover === !1 && hr(), On(), Rn(n), ue(!1), Dn(e, t);
    throw u;
  } finally {
    ue(r), ne(i);
  }
}
const be = /* @__PURE__ */ new Map();
function qn(e, { target: t, anchor: n, props: r = {}, events: i, context: s, intro: u = !0 }) {
  On();
  var l = /* @__PURE__ */ new Set(), o = (a) => {
    for (var v = 0; v < a.length; v++) {
      var d = a[v];
      if (!l.has(d)) {
        l.add(d);
        var $ = Gn.includes(d);
        t.addEventListener(d, Pe, { passive: $ });
        var m = be.get(d);
        m === void 0 ? (document.addEventListener(d, Pe, { passive: $ }), be.set(d, 1)) : be.set(d, m + 1);
      }
    }
  };
  o(tr(Nn)), gt.add(o);
  var f = void 0, _ = Ar(() => (oe(() => {
    if (s) {
      Nt({});
      var a = (
        /** @type {ComponentContext} */
        O
      );
      a.c = s;
    }
    i && (r.$$events = i), b && ve(
      /** @type {TemplateNode} */
      n,
      null
    ), f = e(n, r) || {}, b && (w.nodes.end = C), s && Lt();
  }), () => {
    for (var a of l) {
      t.removeEventListener(a, Pe);
      var v = (
        /** @type {number} */
        be.get(a)
      );
      --v === 0 ? (document.removeEventListener(a, Pe), be.delete(a)) : be.set(a, v);
    }
    gt.delete(o), pt.delete(f);
  }));
  return pt.set(f, _), f;
}
let pt = /* @__PURE__ */ new WeakMap();
function qr(e) {
  const t = pt.get(e);
  t == null || t();
}
const ft = 0, Ye = 1, at = 2;
function zt(e, t, n, r, i) {
  b && Oe();
  var s = e, u = Xe(), l = O, o, f, _, a, v = u ? /* @__PURE__ */ J(
    /** @type {V} */
    void 0
  ) : /* @__PURE__ */ He(
    /** @type {V} */
    void 0
  ), d = u ? /* @__PURE__ */ J(void 0) : /* @__PURE__ */ He(void 0), $ = !1;
  function m(h, g) {
    $ = !0, g && (Ht(E), Qe(E), jt(l)), h === ft && n && (f ? $e(f) : f = oe(() => n(s))), h === Ye && r && (_ ? $e(_) : _ = oe(() => r(s, v))), h === at && i && (a ? $e(a) : a = oe(() => i(s, d))), h !== ft && f && Ae(f, () => f = null), h !== Ye && _ && Ae(_, () => _ = null), h !== at && a && Ae(a, () => a = null), g && (jt(null), Qe(null), Ht(null), le());
  }
  var E = Dt(() => {
    if (o !== (o = t())) {
      if (sr(o)) {
        var h = o;
        $ = !1, h.then(
          (g) => {
            h === o && (D(v, g), m(Ye, !0));
          },
          (g) => {
            h === o && (D(d, g), m(at, !0));
          }
        ), b ? n && (f = oe(() => n(s))) : Promise.resolve().then(() => {
          $ || m(ft, !0);
        });
      } else
        D(v, o), m(Ye, !1);
      return fn;
    }
  });
  b && (s = C);
}
function yt(e, t, n, r = null, i = !1) {
  b && Oe();
  var s = e, u = null, l = null, o = null, f = i ? St : 0;
  Dt(() => {
    if (o === (o = !!t())) return;
    let _ = !1;
    if (b) {
      const a = (
        /** @type {Comment} */
        s.data === xt
      );
      o === a && (s = vt(), ne(s), ue(!1), _ = !0);
    }
    o ? (u ? $e(u) : u = oe(() => n(s)), l && Ae(l, () => {
      l = null;
    })) : (l ? $e(l) : r && (l = oe(() => r(s))), u && Ae(u, () => {
      u = null;
    })), _ && ue(!0);
  }, f), b && (s = C);
}
let ct = null;
function Ir(e, t) {
  return t;
}
function Pr(e, t, n, r) {
  for (var i = [], s = t.length, u = 0; u < s; u++)
    qt(t[u].e, i, !0);
  var l = s > 0 && i.length === 0 && n !== null;
  if (l) {
    var o = (
      /** @type {Element} */
      /** @type {Element} */
      n.parentNode
    );
    Rn(o), o.append(
      /** @type {Element} */
      n
    ), r.clear(), ae(e, t[0].prev, t[s - 1].next);
  }
  kn(i, () => {
    for (var f = 0; f < s; f++) {
      var _ = t[f];
      l || (r.delete(_.k), ae(e, _.prev, _.next)), qe(_.e, !l);
    }
  });
}
function et(e, t, n, r, i, s = null) {
  var u = e, l = { flags: t, items: /* @__PURE__ */ new Map(), first: null }, o = (t & tn) !== 0;
  if (o) {
    var f = (
      /** @type {Element} */
      e
    );
    u = b ? ne(
      /** @type {Comment | Text} */
      f.firstChild
    ) : f.appendChild(ye());
  }
  b && Oe();
  var _ = null;
  Dt(() => {
    var a = n(), v = kt(a) ? a : a == null ? [] : Array.from(a), d = v.length, $ = l.flags;
    $ & dt && !on(v) && !(ln in v) && !(U in v) && ($ ^= dt, $ & Un && !($ & Fe) && ($ ^= Fe));
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
        if (C.nodeType === 8 && /** @type {Comment} */
        C.data === Tt) {
          u = /** @type {Comment} */
          C, m = !0, ue(!1);
          break;
        }
        var y = v[c], K = r(y, c);
        g = In(C, l, h, null, y, K, c, i, $), l.items.set(K, g), h = g;
      }
      d > 0 && ne(vt());
    }
    b || Fr(v, l, u, i, $, r), s !== null && (d === 0 ? _ ? $e(_) : _ = oe(() => s(u)) : _ !== null && Ae(_, () => {
      _ = null;
    })), m && ue(!0);
  }), b && (u = C);
}
function Fr(e, t, n, r, i, s) {
  var fe, ee, Ee, z;
  var u = (i & Jn) !== 0, l = (i & (Fe | bt)) !== 0, o = e.length, f = t.items, _ = t.first, a = _, v = /* @__PURE__ */ new Set(), d = null, $ = /* @__PURE__ */ new Set(), m = [], E = [], h, g, c, y;
  if (u)
    for (y = 0; y < o; y += 1)
      h = e[y], g = s(h, y), c = f.get(g), c !== void 0 && ((fe = c.a) == null || fe.measure(), $.add(c));
  for (y = 0; y < o; y += 1) {
    if (h = e[y], g = s(h, y), c = f.get(g), c === void 0) {
      var K = a ? (
        /** @type {EffectNodes} */
        a.e.nodes.start
      ) : n;
      d = In(
        K,
        t,
        d,
        d === null ? t.first : d.next,
        h,
        g,
        y,
        r,
        i
      ), f.set(g, d), m = [], E = [], a = d.next;
      continue;
    }
    if (l && Mr(c, h, y, i), c.e.f & pe && ($e(c.e), u && ((ee = c.a) == null || ee.unfix(), $.delete(c))), c !== a) {
      if (v.has(c)) {
        if (m.length < E.length) {
          var H = E[0], R;
          d = H.prev;
          var T = m[0], x = m[m.length - 1];
          for (R = 0; R < m.length; R += 1)
            Wt(m[R], H, n);
          for (R = 0; R < E.length; R += 1)
            v.delete(E[R]);
          ae(t, T.prev, x.next), ae(t, d, T), ae(t, x, H), a = H, d = x, y -= 1, m = [], E = [];
        } else
          v.delete(c), Wt(c, a, n), ae(t, c.prev, c.next), ae(t, c, d === null ? t.first : d.next), ae(t, d, c), d = c;
        continue;
      }
      for (m = [], E = []; a !== null && a.k !== g; )
        v.add(a), E.push(a), a = a.next;
      if (a === null)
        continue;
      c = a;
    }
    m.push(c), d = c, a = c.next;
  }
  const q = Array.from(v);
  for (; a !== null; )
    q.push(a), a = a.next;
  var F = q.length;
  if (F > 0) {
    var B = i & tn && o === 0 ? n : null;
    if (u) {
      for (y = 0; y < F; y += 1)
        (Ee = q[y].a) == null || Ee.measure();
      for (y = 0; y < F; y += 1)
        (z = q[y].a) == null || z.fix();
    }
    Pr(t, q, B, f);
  }
  u && At(() => {
    var j;
    for (c of $)
      (j = c.a) == null || j.apply();
  }), w.first = t.first && t.first.e, w.last = d && d.e;
}
function Mr(e, t, n, r) {
  r & Fe && D(e.v, t), r & bt ? D(
    /** @type {Value<number>} */
    e.i,
    n
  ) : e.i = n;
}
function In(e, t, n, r, i, s, u, l, o) {
  var f = ct;
  try {
    var _ = (o & Fe) !== 0, a = (o & dt) === 0, v = _ ? a ? /* @__PURE__ */ He(i) : /* @__PURE__ */ J(i) : i, d = o & bt ? /* @__PURE__ */ J(u) : u, $ = {
      i: d,
      v,
      k: s,
      a: null,
      // @ts-expect-error
      e: null,
      prev: n,
      next: r
    };
    return ct = $, $.e = oe(() => l(e, v, d), b), $.e.prev = n && n.e, $.e.next = r && r.e, n === null ? t.first = $ : (n.next = $, n.e.next = $.e), r !== null && (r.prev = $, r.e.prev = $.e), $;
  } finally {
    ct = f;
  }
}
function Wt(e, t, n) {
  for (var r = e.next ? (
    /** @type {EffectNodes} */
    e.next.e.nodes.start
  ) : n, i = t ? (
    /** @type {EffectNodes} */
    t.e.nodes.start
  ) : n, s = (
    /** @type {EffectNodes} */
    e.e.nodes.start
  ); s !== r; ) {
    var u = (
      /** @type {TemplateNode} */
      s.nextSibling
    );
    i.before(s), s = u;
  }
}
function ae(e, t, n) {
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
      const i = document.createElement("style");
      i.id = t.hash, i.textContent = t.code, r.appendChild(i);
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
          wt(e, "value", null), e.value = r;
        }
        if (e.hasAttribute("checked")) {
          var i = e.checked;
          wt(e, "checked", null), e.checked = i;
        }
      }
    };
    e.__on_r = n, lr(n), Pn();
  }
}
function wt(e, t, n) {
  n = n == null ? null : n + "";
  var r = e.__attributes ?? (e.__attributes = {});
  b && (r[t] = e.getAttribute(t), t === "src" || t === "href" || t === "srcset") || r[t] !== (r[t] = n) && (t === "loading" && (e[er] = n), n === null ? e.removeAttribute(t) : e.setAttribute(t, n));
}
function Qt(e, t, n) {
  n ? e.classList.add(t) : e.classList.remove(t);
}
function Fn(e, t, n, r = n) {
  e.addEventListener(t, n);
  const i = e.__on_r;
  i ? e.__on_r = () => {
    i(), r();
  } : e.__on_r = r, Pn();
}
function Et(e, t, n) {
  Fn(e, "input", () => {
    n(Xt(e) ? en(e.value) : e.value);
  }), it(() => {
    var r = t();
    if (b && e.defaultValue !== e.value) {
      n(e.value);
      return;
    }
    Xt(e) && r === en(e.value) || e.type === "date" && !r && !e.value || (e.value = r ?? "");
  });
}
function jr(e, t, n) {
  Fn(e, "change", () => {
    var r = e.checked;
    n(r);
  }), t() == null && n(!1), it(() => {
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
function Te(e, t, n, r) {
  var $;
  var i = (n & Kn) !== 0, s = (
    /** @type {V} */
    e[t]
  ), u = ($ = _t(e, t)) == null ? void 0 : $.set, l = (
    /** @type {V} */
    r
  ), o = () => l;
  s === void 0 && r !== void 0 && (u && i && mr(), s = o(), u && u(s));
  var f;
  if (f = () => {
    var m = (
      /** @type {V} */
      e[t]
    );
    return m === void 0 ? o() : m;
  }, u) {
    var _ = e.$$legacy;
    return function(m, E) {
      return arguments.length > 0 ? ((!E || _) && u(E ? f() : m), m) : f();
    };
  }
  var a = !1, v = /* @__PURE__ */ He(s), d = /* @__PURE__ */ Ce(() => {
    var m = f(), E = p(v);
    return a ? (a = !1, E) : v.v = m;
  });
  return function(m, E) {
    var h = p(d);
    if (arguments.length > 0) {
      const g = E ? p(d) : m;
      return d.equals(g) || (a = !0, D(v, g), p(d)), m;
    }
    return h;
  };
}
function Br(e) {
  return new Yr(e);
}
var se, W;
class Yr {
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
    lt(this, se);
    /** @type {Record<string, any>} */
    lt(this, W);
    var n = /* @__PURE__ */ new Map(), r = (s, u) => {
      var l = /* @__PURE__ */ He(u);
      return n.set(s, l), l;
    };
    const i = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(s, u) {
          return p(n.get(u) ?? r(u, Reflect.get(s, u)));
        },
        has(s, u) {
          return p(n.get(u) ?? r(u, Reflect.get(s, u))), Reflect.has(s, u);
        },
        set(s, u, l) {
          return D(n.get(u) ?? r(u, l), l), Reflect.set(s, u, l);
        }
      }
    );
    ot(this, W, (t.hydrate ? Dr : Dn)(t.component, {
      target: t.target,
      props: i,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover
    })), le(), ot(this, se, i.$$events);
    for (const s of Object.keys(V(this, W)))
      s === "$set" || s === "$destroy" || s === "$on" || Me(this, s, {
        get() {
          return V(this, W)[s];
        },
        /** @param {any} value */
        set(u) {
          V(this, W)[s] = u;
        },
        enumerable: !0
      });
    V(this, W).$set = /** @param {Record<string, any>} next */
    (s) => {
      Object.assign(i, s);
    }, V(this, W).$destroy = () => {
      qr(V(this, W));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    V(this, W).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, n) {
    V(this, se)[t] = V(this, se)[t] || [];
    const r = (...i) => n.call(this, ...i);
    return V(this, se)[t].push(r), () => {
      V(this, se)[t] = V(this, se)[t].filter(
        /** @param {any} fn */
        (i) => i !== r
      );
    };
  }
  $destroy() {
    V(this, W).$destroy();
  }
}
se = new WeakMap(), W = new WeakMap();
let Mn;
typeof HTMLElement == "function" && (Mn = class extends HTMLElement {
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
        return (s) => {
          const u = document.createElement("slot");
          i !== "default" && (u.name = i), M(s, u);
        };
      };
      if (await Promise.resolve(), !this.$$cn || this.$$c)
        return;
      const n = {}, r = Vr(this);
      for (const i of this.$$s)
        i in r && (i === "default" && !this.$$d.children ? (this.$$d.children = t(i), n.default = !0) : n[i] = t(i));
      for (const i of this.attributes) {
        const s = this.$$g_p(i.name);
        s in this.$$d || (this.$$d[s] = Ke(s, i.value, this.$$p_d, "toProp"));
      }
      for (const i in this.$$p_d)
        !(i in this.$$d) && this[i] !== void 0 && (this.$$d[i] = this[i], delete this[i]);
      this.$$c = Br({
        component: this.$$ctor,
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$host: this
        }
      }), this.$$me = it(() => {
        var i;
        this.$$r = !0;
        for (const s of We(this.$$c)) {
          if (!((i = this.$$p_d[s]) != null && i.reflect)) continue;
          this.$$d[s] = this.$$c[s];
          const u = Ke(
            s,
            this.$$d[s],
            this.$$p_d,
            "toAttribute"
          );
          u == null ? this.removeAttribute(this.$$p_d[s].attribute || s) : this.setAttribute(this.$$p_d[s].attribute || s, u);
        }
        this.$$r = !1;
      });
      for (const i in this.$$l)
        for (const s of this.$$l[i]) {
          const u = this.$$c.$on(i, s);
          this.$$l_u.set(s, u);
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
    this.$$r || (t = this.$$g_p(t), this.$$d[t] = Ke(t, r, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [t]: this.$$d[t] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      !this.$$cn && this.$$c && (this.$$c.$destroy(), qe(this.$$me), this.$$c = void 0);
    });
  }
  /**
   * @param {string} attribute_name
   */
  $$g_p(t) {
    return We(this.$$p_d).find(
      (n) => this.$$p_d[n].attribute === t || !this.$$p_d[n].attribute && n.toLowerCase() === t
    ) || t;
  }
});
function Ke(e, t, n, r) {
  var s;
  const i = (s = n[e]) == null ? void 0 : s.type;
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
function Vr(e) {
  const t = {};
  return e.childNodes.forEach((n) => {
    t[
      /** @type {Element} node */
      n.slot || "default"
    ] = !0;
  }), t;
}
function Hn(e, t, n, r, i, s) {
  let u = class extends Mn {
    constructor() {
      super(e, n, i), this.$$p_d = t;
    }
    static get observedAttributes() {
      return We(t).map(
        (l) => (t[l].attribute || l).toLowerCase()
      );
    }
  };
  return We(t).forEach((l) => {
    Me(u.prototype, l, {
      get() {
        return this.$$c && l in this.$$c ? this.$$c[l] : this.$$d[l];
      },
      set(o) {
        var f;
        o = Ke(l, o, t), this.$$d[l] = o, (f = this.$$c) == null || f.$set({ [l]: o });
      }
    });
  }), r.forEach((l) => {
    Me(u.prototype, l, {
      get() {
        var o;
        return (o = this.$$c) == null ? void 0 : o[l];
      }
    });
  }), e.element = /** @type {any} */
  u, u;
}
var Ur = (e, t, n) => t()(p(n)), Jr = /* @__PURE__ */ X('<input type="checkbox">'), Kr = /* @__PURE__ */ X('<input type="number">'), zr = /* @__PURE__ */ X('<input type="text">'), Wr = /* @__PURE__ */ X("<p><tt> </tt> <!> </p>"), Gr = /* @__PURE__ */ X("<p><tt> </tt> </p>"), Zr = /* @__PURE__ */ X("<div><hr> <p><button> </button> </p> <tt> </tt> <!> <tt> </tt> <!> <tt> </tt></div>");
function jn(e, t) {
  Nt(t, !0);
  let n = Te(t, "name", 7), r = Te(t, "def", 7), i = Te(t, "defaults", 7), s = Te(t, "run", 7), u = /* @__PURE__ */ Ce(() => r().parameters ? Object.values(r().parameters) : []), l = /* @__PURE__ */ Ce(() => Object.fromEntries(p(u).map(({ name: T }) => [T, null]))), o = /* @__PURE__ */ J(ce({ ...i() })), f = /* @__PURE__ */ Ce(() => ({ ...p(l), ...p(o) }));
  var _ = Zr(), a = P(_), v = S(S(a, !0)), d = P(v);
  d.__click = [Ur, s, f];
  var $ = P(d);
  N(d);
  var m = S(d, !0);
  N(v);
  var E = S(S(v, !0)), h = P(E);
  h.nodeValue = "{", N(E);
  var g = S(S(E, !0));
  et(g, 69, () => p(u), (T, x) => k(T).name, (T, x, q) => {
    var F = Wr(), B = P(F), fe = P(B);
    G(() => te(fe, `${JSON.stringify(k(x).name) ?? ""}:`)), N(B);
    var ee = S(S(B, !0));
    yt(
      ee,
      () => k(x).type === "boolean",
      (z) => {
        var j = Jr();
        Je(j), jr(j, () => p(o)[k(x).name], (ie) => p(o)[k(x).name] = ie), M(z, j);
      },
      (z) => {
        var j = Ln(), ie = $t(j);
        yt(
          ie,
          () => k(x).type === "number",
          (st) => {
            var he = Kr();
            Je(he), Et(he, () => p(o)[k(x).name], (ut) => p(o)[k(x).name] = ut), M(st, he);
          },
          (st) => {
            var he = zr();
            Je(he), Et(he, () => p(o)[k(x).name], (ut) => p(o)[k(x).name] = ut), M(st, he);
          },
          !0
        ), M(z, j);
      }
    );
    var Ee = S(ee, !0);
    N(F), G(() => te(Ee, ` [${k(x).type ?? ""}]: ${k(x).description ?? ""}`)), M(T, F);
  });
  var c = S(S(g, !0)), y = P(c);
  y.nodeValue = "} -> {", N(c);
  var K = S(S(c, !0));
  et(K, 65, () => Object.values(r().returns), Ir, (T, x, q) => {
    var F = Gr(), B = P(F), fe = P(B);
    G(() => te(fe, `${JSON.stringify(k(x).name) ?? ""}:`)), N(B);
    var ee = S(B, !0);
    N(F), G(() => te(ee, ` [${k(x).type ?? ""}]: ${k(x).description ?? ""}`)), M(T, F);
  });
  var H = S(S(K, !0)), R = P(H);
  return R.nodeValue = "}", N(H), N(_), G(() => {
    te($, n()), te(m, ` ${r().description ?? ""}`);
  }), M(e, _), Lt({
    get name() {
      return n();
    },
    set name(T) {
      n(T), le();
    },
    get def() {
      return r();
    },
    set def(T) {
      r(T), le();
    },
    get defaults() {
      return i();
    },
    set defaults(T) {
      i(T), le();
    },
    get run() {
      return s();
    },
    set run(T) {
      s(T), le();
    }
  });
}
Nr(["click"]);
Hn(jn, { name: {}, def: {}, defaults: {}, run: {} }, [], [], !0);
var Qr = /* @__PURE__ */ X("<div><!></div>"), Xr = /* @__PURE__ */ X(
  `
							(Running...)
						`,
  1
), ei = /* @__PURE__ */ X(`<div><b> </b>(<tt> </tt>) <pre>
					<!>
				</pre></div>`), ti = /* @__PURE__ */ X("<!> <div></div>", 1), ni = /* @__PURE__ */ X('<div class="command-panel svelte-1mm37qn"><div class="search"><input type="search" placeholder="Search commands..."></div> <!></div>');
const ri = {
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
function ii(e, t) {
  Nt(t, !0), Hr(e, ri);
  function n(h, g) {
    if (!p(f)) return !0;
    let c = p(f).toLowerCase();
    return h.toLowerCase().includes(c) || g.description.toLowerCase().includes(c);
  }
  function r(h, g) {
    return Object.entries(g).filter(([c, y]) => n(c, y)).map(([c, y]) => [c, y, {}]);
  }
  let i = Te(t, "commands", 7, null), s = Te(t, "suggest", 7, r), u = /* @__PURE__ */ J(ce([]));
  async function l(h, g) {
    if (!i()) return;
    let c = i().run(h, g);
    p(u).push({ command: h, properties: g, result: c });
  }
  let o = /* @__PURE__ */ J(ce({}));
  kr(() => {
    var h;
    (h = i()) == null || h.index.then((g) => {
      D(o, ce(g));
    });
  });
  let f = /* @__PURE__ */ J(""), _ = /* @__PURE__ */ Ce(() => s()(p(f), p(o))), a = /* @__PURE__ */ J(!1), v = /* @__PURE__ */ Ce(() => p(a) || p(f));
  var d = ni();
  {
    const h = (g, c, y = fn) => {
      let K = () => c == null ? void 0 : c()[0], H = () => c == null ? void 0 : c()[1], R = () => c == null ? void 0 : c()[2];
      var T = Qr(), x = P(T);
      jn(x, {
        get name() {
          return K();
        },
        get def() {
          return H();
        },
        get defaults() {
          return R();
        },
        run: (q) => l(K(), q)
      }), N(T), G(() => Qt(T, "selected", y())), M(g, T);
    };
    var $ = P(d), m = P($);
    Je(m), N($);
    var E = S(S($, !0));
    yt(E, () => p(v), (g) => {
      var c = ti(), y = $t(c);
      zt(y, () => p(_), null, (H, R) => {
        var T = Ln(), x = $t(T);
        et(x, 70, () => p(R), (q, F) => k(q), (q, F, B) => {
          h(q, () => k(F), () => !1);
        }), M(H, T);
      });
      var K = S(S(y, !0));
      et(K, 77, () => p(u), (H, R) => k(H).command, (H, R, T) => {
        var x = ei(), q = P(x), F = P(q);
        N(q);
        var B = S(S(q, !0)), fe = P(B);
        G(() => te(fe, JSON.stringify(k(R).properties, null, 2))), N(B);
        var ee = S(S(B, !0)), Ee = S(P(ee));
        zt(
          Ee,
          () => k(R).result,
          (z) => {
            var j = Xr();
            M(z, j);
          },
          (z, j) => {
            var ie = Kt();
            G(() => te(ie, `
							${JSON.stringify(p(j), null, 2) ?? ""}
						`)), M(z, ie);
          },
          (z, j) => {
            var ie = Kt();
            G(() => te(ie, `
							Failed: ${p(j).message ?? ""}
						`)), M(z, ie);
          }
        ), Zn(), N(ee), N(x), G(() => te(F, k(R).command)), M(H, x);
      }), N(K), M(g, c);
    }), N(d), G(() => wt(m, "size", p(v) ? 100 : 20)), Et(m, () => p(f), (g) => D(f, g)), Jt(
      "focus",
      m,
      () => {
        D(a, !0);
      },
      !1
    ), Jt(
      "blur",
      m,
      () => {
        D(a, !1);
      },
      !1
    );
  }
  return G(() => Qt(d, "open", p(v))), M(e, d), Lt({
    get commands() {
      return i();
    },
    set commands(h = null) {
      i(h), le();
    },
    get suggest() {
      return s();
    },
    set suggest(h = r) {
      s(h), le();
    }
  });
}
customElements.define("command-panel", Hn(ii, { commands: {}, suggest: {} }, [], [], !0));
class ui {
  constructor(t) {
    Y(this, "index");
    Y(this, "runners");
    const n = {}, r = {};
    for (const [i, { description: s, parameters: u, returns: l, run: o }] of Object.entries(t))
      r[i] = o, n[i] = { description: s, parameters: u, returns: l };
    this.index = Promise.resolve(n), this.runners = r;
  }
  async run(t, n) {
    return await this.runners[t](n);
  }
}
class li {
  constructor(t) {
    Y(this, "url");
    this.url = t;
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
export {
  ii as CommandPanel,
  li as ReflectCommands,
  ui as StaticCommands
};

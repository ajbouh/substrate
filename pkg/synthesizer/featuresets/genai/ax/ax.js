var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../../../../ax/node_modules/dayjs/dayjs.min.js
var require_dayjs_min = __commonJS({
  "../../../../../../ax/node_modules/dayjs/dayjs.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
    }(exports, function() {
      "use strict";
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s10 = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s11 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s11 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s11 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s10, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D2 = {};
      D2[g] = M2;
      var p = "$isDayjsObject", S = function(t2) {
        return t2 instanceof _2 || !(!t2 || !t2[p]);
      }, w2 = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s11 = e2.toLowerCase();
          D2[s11] && (i2 = s11), n2 && (D2[s11] = n2, i2 = s11);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D2[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O2 = function(t2, e2) {
        if (S(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _2(n2);
      }, b2 = v;
      b2.l = w2, b2.i = S, b2.w = function(t2, e2) {
        return O2(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _2 = function() {
        function M3(t2) {
          this.$L = w2(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M3.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b2.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s11 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s11)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s11);
              }
            }
            return new Date(e2);
          }(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b2;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O2(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O2(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O2(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b2.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b2.u(e2) || e2, f2 = b2.p(t2), l2 = function(t3, e3) {
            var i2 = b2.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b2.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M4 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M4) : l2(0, M4 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D3 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D3 : m3 + (6 - D3), M4);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s10:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b2.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s10] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b2.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = b2.p(f2), y2 = function(t2) {
            var e2 = O2(l2);
            return b2.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c) return this.set(c, this.$M + r2);
          if ($2 === h) return this.set(h, this.$y + r2);
          if ($2 === a) return y2(1);
          if ($2 === o) return y2(7);
          var M4 = (d2 = {}, d2[s10] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M4;
          return b2.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b2.z(this), s11 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s12) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s12);
          }, d2 = function(t3) {
            return b2.s(s11 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, function(t3, r3) {
            return r3 || function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b2.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b2.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b2.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s11);
                case "HH":
                  return b2.s(s11, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s11, u2, true);
                case "A":
                  return $2(s11, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b2.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b2.s(e2.$s, 2, "0");
                case "SSS":
                  return b2.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            }(t3) || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M4 = b2.p(d2), m3 = O2(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D3 = function() {
            return b2.m(y2, m3);
          };
          switch (M4) {
            case h:
              $2 = D3() / 12;
              break;
            case c:
              $2 = D3();
              break;
            case f:
              $2 = D3() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s10:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b2.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D2[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = w2(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b2.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M3;
      }(), k = _2.prototype;
      return O2.prototype = k, [["$ms", r], ["$s", i], ["$m", s10], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
        k[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), O2.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _2, O2), t2.$i = true), O2;
      }, O2.locale = w2, O2.isDayjs = S, O2.unix = function(t2) {
        return O2(1e3 * t2);
      }, O2.en = D2[g], O2.Ls = D2, O2.p = {}, O2;
    });
  }
});

// ../../../../../../ax/node_modules/dayjs/plugin/customParseFormat.js
var require_customParseFormat = __commonJS({
  "../../../../../../ax/node_modules/dayjs/plugin/customParseFormat.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_customParseFormat = t();
    }(exports, function() {
      "use strict";
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s10 = {}, a = function(e2) {
        return (e2 = +e2) + (e2 > 68 ? 1900 : 2e3);
      };
      var f = function(e2) {
        return function(t2) {
          this[e2] = +t2;
        };
      }, h = [/[+-]\d\d:?(\d\d)?|Z/, function(e2) {
        (this.zone || (this.zone = {})).offset = function(e3) {
          if (!e3) return 0;
          if ("Z" === e3) return 0;
          var t2 = e3.match(/([+-]|\d\d)/g), n2 = 60 * t2[1] + (+t2[2] || 0);
          return 0 === n2 ? 0 : "+" === t2[0] ? -n2 : n2;
        }(e2);
      }], u = function(e2) {
        var t2 = s10[e2];
        return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
      }, d = function(e2, t2) {
        var n2, r2 = s10.meridiem;
        if (r2) {
          for (var i2 = 1; i2 <= 24; i2 += 1) if (e2.indexOf(r2(i2, 0, t2)) > -1) {
            n2 = i2 > 12;
            break;
          }
        } else n2 = e2 === (t2 ? "pm" : "PM");
        return n2;
      }, c = { A: [o, function(e2) {
        this.afternoon = d(e2, false);
      }], a: [o, function(e2) {
        this.afternoon = d(e2, true);
      }], Q: [n, function(e2) {
        this.month = 3 * (e2 - 1) + 1;
      }], S: [n, function(e2) {
        this.milliseconds = 100 * +e2;
      }], SS: [r, function(e2) {
        this.milliseconds = 10 * +e2;
      }], SSS: [/\d{3}/, function(e2) {
        this.milliseconds = +e2;
      }], s: [i, f("seconds")], ss: [i, f("seconds")], m: [i, f("minutes")], mm: [i, f("minutes")], H: [i, f("hours")], h: [i, f("hours")], HH: [i, f("hours")], hh: [i, f("hours")], D: [i, f("day")], DD: [r, f("day")], Do: [o, function(e2) {
        var t2 = s10.ordinal, n2 = e2.match(/\d+/);
        if (this.day = n2[0], t2) for (var r2 = 1; r2 <= 31; r2 += 1) t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
      }], w: [i, f("week")], ww: [r, f("week")], M: [i, f("month")], MM: [r, f("month")], MMM: [o, function(e2) {
        var t2 = u("months"), n2 = (u("monthsShort") || t2.map(function(e3) {
          return e3.slice(0, 3);
        })).indexOf(e2) + 1;
        if (n2 < 1) throw new Error();
        this.month = n2 % 12 || n2;
      }], MMMM: [o, function(e2) {
        var t2 = u("months").indexOf(e2) + 1;
        if (t2 < 1) throw new Error();
        this.month = t2 % 12 || t2;
      }], Y: [/[+-]?\d+/, f("year")], YY: [r, function(e2) {
        this.year = a(e2);
      }], YYYY: [/\d{4}/, f("year")], Z: h, ZZ: h };
      function l(n2) {
        var r2, i2;
        r2 = n2, i2 = s10 && s10.formats;
        for (var o2 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t2, n3, r3) {
          var o3 = r3 && r3.toUpperCase();
          return n3 || i2[r3] || e[r3] || i2[o3].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t3, n4) {
            return t3 || n4.slice(1);
          });
        })).match(t), a2 = o2.length, f2 = 0; f2 < a2; f2 += 1) {
          var h2 = o2[f2], u2 = c[h2], d2 = u2 && u2[0], l2 = u2 && u2[1];
          o2[f2] = l2 ? { regex: d2, parser: l2 } : h2.replace(/^\[|\]$/g, "");
        }
        return function(e2) {
          for (var t2 = {}, n3 = 0, r3 = 0; n3 < a2; n3 += 1) {
            var i3 = o2[n3];
            if ("string" == typeof i3) r3 += i3.length;
            else {
              var s11 = i3.regex, f3 = i3.parser, h3 = e2.slice(r3), u3 = s11.exec(h3)[0];
              f3.call(t2, u3), e2 = e2.replace(u3, "");
            }
          }
          return function(e3) {
            var t3 = e3.afternoon;
            if (void 0 !== t3) {
              var n4 = e3.hours;
              t3 ? n4 < 12 && (e3.hours += 12) : 12 === n4 && (e3.hours = 0), delete e3.afternoon;
            }
          }(t2), t2;
        };
      }
      return function(e2, t2, n2) {
        n2.p.customParseFormat = true, e2 && e2.parseTwoDigitYear && (a = e2.parseTwoDigitYear);
        var r2 = t2.prototype, i2 = r2.parse;
        r2.parse = function(e3) {
          var t3 = e3.date, r3 = e3.utc, o2 = e3.args;
          this.$u = r3;
          var a2 = o2[1];
          if ("string" == typeof a2) {
            var f2 = true === o2[2], h2 = true === o2[3], u2 = f2 || h2, d2 = o2[2];
            h2 && (d2 = o2[2]), s10 = this.$locale(), !f2 && d2 && (s10 = n2.Ls[d2]), this.$d = function(e4, t4, n3, r4) {
              try {
                if (["x", "X"].indexOf(t4) > -1) return new Date(("X" === t4 ? 1e3 : 1) * e4);
                var i3 = l(t4)(e4), o3 = i3.year, s11 = i3.month, a3 = i3.day, f3 = i3.hours, h3 = i3.minutes, u3 = i3.seconds, d3 = i3.milliseconds, c3 = i3.zone, m2 = i3.week, M3 = /* @__PURE__ */ new Date(), Y2 = a3 || (o3 || s11 ? 1 : M3.getDate()), p = o3 || M3.getFullYear(), v = 0;
                o3 && !s11 || (v = s11 > 0 ? s11 - 1 : M3.getMonth());
                var D2, w2 = f3 || 0, g = h3 || 0, y = u3 || 0, L2 = d3 || 0;
                return c3 ? new Date(Date.UTC(p, v, Y2, w2, g, y, L2 + 60 * c3.offset * 1e3)) : n3 ? new Date(Date.UTC(p, v, Y2, w2, g, y, L2)) : (D2 = new Date(p, v, Y2, w2, g, y, L2), m2 && (D2 = r4(D2).week(m2).toDate()), D2);
              } catch (e5) {
                return /* @__PURE__ */ new Date("");
              }
            }(t3, a2, r3, n2), this.init(), d2 && true !== d2 && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = /* @__PURE__ */ new Date("")), s10 = {};
          } else if (a2 instanceof Array) for (var c2 = a2.length, m = 1; m <= c2; m += 1) {
            o2[1] = a2[m - 1];
            var M2 = n2.apply(this, o2);
            if (M2.isValid()) {
              this.$d = M2.$d, this.$L = M2.$L, this.init();
              break;
            }
            m === c2 && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else i2.call(this, e3);
        };
      };
    });
  }
});

// ../../../../../../ax/node_modules/dayjs/plugin/timezone.js
var require_timezone = __commonJS({
  "../../../../../../ax/node_modules/dayjs/plugin/timezone.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_timezone = e();
    }(exports, function() {
      "use strict";
      var t = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, e = {};
      return function(n, i, o) {
        var r, a = function(t2, n2, i2) {
          void 0 === i2 && (i2 = {});
          var o2 = new Date(t2), r2 = function(t3, n3) {
            void 0 === n3 && (n3 = {});
            var i3 = n3.timeZoneName || "short", o3 = t3 + "|" + i3, r3 = e[o3];
            return r3 || (r3 = new Intl.DateTimeFormat("en-US", { hour12: false, timeZone: t3, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: i3 }), e[o3] = r3), r3;
          }(n2, i2);
          return r2.formatToParts(o2);
        }, u = function(e2, n2) {
          for (var i2 = a(e2, n2), r2 = [], u2 = 0; u2 < i2.length; u2 += 1) {
            var f2 = i2[u2], s11 = f2.type, m = f2.value, c = t[s11];
            c >= 0 && (r2[c] = parseInt(m, 10));
          }
          var d = r2[3], l = 24 === d ? 0 : d, h = r2[0] + "-" + r2[1] + "-" + r2[2] + " " + l + ":" + r2[4] + ":" + r2[5] + ":000", v = +e2;
          return (o.utc(h).valueOf() - (v -= v % 1e3)) / 6e4;
        }, f = i.prototype;
        f.tz = function(t2, e2) {
          void 0 === t2 && (t2 = r);
          var n2, i2 = this.utcOffset(), a2 = this.toDate(), u2 = a2.toLocaleString("en-US", { timeZone: t2 }), f2 = Math.round((a2 - new Date(u2)) / 1e3 / 60), s11 = 15 * -Math.round(a2.getTimezoneOffset() / 15) - f2;
          if (!Number(s11)) n2 = this.utcOffset(0, e2);
          else if (n2 = o(u2, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(s11, true), e2) {
            var m = n2.utcOffset();
            n2 = n2.add(i2 - m, "minute");
          }
          return n2.$x.$timezone = t2, n2;
        }, f.offsetName = function(t2) {
          var e2 = this.$x.$timezone || o.tz.guess(), n2 = a(this.valueOf(), e2, { timeZoneName: t2 }).find(function(t3) {
            return "timezonename" === t3.type.toLowerCase();
          });
          return n2 && n2.value;
        };
        var s10 = f.startOf;
        f.startOf = function(t2, e2) {
          if (!this.$x || !this.$x.$timezone) return s10.call(this, t2, e2);
          var n2 = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
          return s10.call(n2, t2, e2).tz(this.$x.$timezone, true);
        }, o.tz = function(t2, e2, n2) {
          var i2 = n2 && e2, a2 = n2 || e2 || r, f2 = u(+o(), a2);
          if ("string" != typeof t2) return o(t2).tz(a2);
          var s11 = function(t3, e3, n3) {
            var i3 = t3 - 60 * e3 * 1e3, o2 = u(i3, n3);
            if (e3 === o2) return [i3, e3];
            var r2 = u(i3 -= 60 * (o2 - e3) * 1e3, n3);
            return o2 === r2 ? [i3, o2] : [t3 - 60 * Math.min(o2, r2) * 1e3, Math.max(o2, r2)];
          }(o.utc(t2, i2).valueOf(), f2, a2), m = s11[0], c = s11[1], d = o(m).utcOffset(c);
          return d.$x.$timezone = a2, d;
        }, o.tz.guess = function() {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        }, o.tz.setDefault = function(t2) {
          r = t2;
        };
      };
    });
  }
});

// ../../../../../../ax/node_modules/dayjs/plugin/utc.js
var require_utc = __commonJS({
  "../../../../../../ax/node_modules/dayjs/plugin/utc.js"(exports, module) {
    !function(t, i) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i();
    }(exports, function() {
      "use strict";
      var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
      return function(s10, f, n) {
        var u = f.prototype;
        n.utc = function(t2) {
          var i2 = { date: t2, utc: true, args: arguments };
          return new f(i2);
        }, u.utc = function(i2) {
          var e2 = n(this.toDate(), { locale: this.$L, utc: true });
          return i2 ? e2.add(this.utcOffset(), t) : e2;
        }, u.local = function() {
          return n(this.toDate(), { locale: this.$L, utc: false });
        };
        var o = u.parse;
        u.parse = function(t2) {
          t2.utc && (this.$u = true), this.$utils().u(t2.$offset) || (this.$offset = t2.$offset), o.call(this, t2);
        };
        var r = u.init;
        u.init = function() {
          if (this.$u) {
            var t2 = this.$d;
            this.$y = t2.getUTCFullYear(), this.$M = t2.getUTCMonth(), this.$D = t2.getUTCDate(), this.$W = t2.getUTCDay(), this.$H = t2.getUTCHours(), this.$m = t2.getUTCMinutes(), this.$s = t2.getUTCSeconds(), this.$ms = t2.getUTCMilliseconds();
          } else r.call(this);
        };
        var a = u.utcOffset;
        u.utcOffset = function(s11, f2) {
          var n2 = this.$utils().u;
          if (n2(s11)) return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
          if ("string" == typeof s11 && (s11 = function(t2) {
            void 0 === t2 && (t2 = "");
            var s12 = t2.match(i);
            if (!s12) return null;
            var f3 = ("" + s12[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
            return 0 === u3 ? 0 : "+" === n3 ? u3 : -u3;
          }(s11), null === s11)) return this;
          var u2 = Math.abs(s11) <= 16 ? 60 * s11 : s11, o2 = this;
          if (f2) return o2.$offset = u2, o2.$u = 0 === s11, o2;
          if (0 !== s11) {
            var r2 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
            (o2 = this.local().add(u2 + r2, t)).$offset = u2, o2.$x.$localOffset = r2;
          } else o2 = this.utc();
          return o2;
        };
        var h = u.format;
        u.format = function(t2) {
          var i2 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return h.call(this, i2);
        }, u.valueOf = function() {
          var t2 = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * t2;
        }, u.isUTC = function() {
          return !!this.$u;
        }, u.toISOString = function() {
          return this.toDate().toISOString();
        }, u.toString = function() {
          return this.toDate().toUTCString();
        };
        var l = u.toDate;
        u.toDate = function(t2) {
          return "s" === t2 && this.$offset ? n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : l.call(this);
        };
        var c = u.diff;
        u.diff = function(t2, i2, e2) {
          if (t2 && this.$u === t2.$u) return c.call(this, t2, i2, e2);
          var s11 = this.local(), f2 = n(t2).local();
          return c.call(s11, f2, i2, e2);
        };
      };
    });
  }
});

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/version.js
var VERSION = "1.9.0";

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/internal/semver.js
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function _makeCompatibilityCheck(ownVersion) {
  var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
  var rejectedVersions = /* @__PURE__ */ new Set();
  var myVersionMatch = ownVersion.match(re);
  if (!myVersionMatch) {
    return function() {
      return false;
    };
  }
  var ownVersionParsed = {
    major: +myVersionMatch[1],
    minor: +myVersionMatch[2],
    patch: +myVersionMatch[3],
    prerelease: myVersionMatch[4]
  };
  if (ownVersionParsed.prerelease != null) {
    return function isExactmatch(globalVersion) {
      return globalVersion === ownVersion;
    };
  }
  function _reject(v) {
    rejectedVersions.add(v);
    return false;
  }
  function _accept(v) {
    acceptedVersions.add(v);
    return true;
  }
  return function isCompatible2(globalVersion) {
    if (acceptedVersions.has(globalVersion)) {
      return true;
    }
    if (rejectedVersions.has(globalVersion)) {
      return false;
    }
    var globalVersionMatch = globalVersion.match(re);
    if (!globalVersionMatch) {
      return _reject(globalVersion);
    }
    var globalVersionParsed = {
      major: +globalVersionMatch[1],
      minor: +globalVersionMatch[2],
      patch: +globalVersionMatch[3],
      prerelease: globalVersionMatch[4]
    };
    if (globalVersionParsed.prerelease != null) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major !== globalVersionParsed.major) {
      return _reject(globalVersion);
    }
    if (ownVersionParsed.major === 0) {
      if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    }
    if (ownVersionParsed.minor <= globalVersionParsed.minor) {
      return _accept(globalVersion);
    }
    return _reject(globalVersion);
  };
}
var isCompatible = _makeCompatibilityCheck(VERSION);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
var major = VERSION.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type, instance, diag, allowOverride) {
  var _a;
  if (allowOverride === void 0) {
    allowOverride = false;
  }
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
    version: VERSION
  };
  if (!allowOverride && api[type]) {
    var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
    diag.error(err.stack || err.message);
    return false;
  }
  if (api.version !== VERSION) {
    var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
    diag.error(err.stack || err.message);
    return false;
  }
  api[type] = instance;
  diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
  return true;
}
function getGlobal(type) {
  var _a, _b;
  var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
  if (!globalVersion || !isCompatible(globalVersion)) {
    return;
  }
  return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
  diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
  var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
  if (api) {
    delete api[type];
  }
}

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar2; i < l; i++) {
    if (ar2 || !(i in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i);
      ar2[i] = from[i];
    }
  }
  return to2.concat(ar2 || Array.prototype.slice.call(from));
};
var DiagComponentLogger = (
  /** @class */
  function() {
    function DiagComponentLogger2(props) {
      this._namespace = props.namespace || "DiagComponentLogger";
    }
    DiagComponentLogger2.prototype.debug = function() {
      var args = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        args[_i2] = arguments[_i2];
      }
      return logProxy("debug", this._namespace, args);
    };
    DiagComponentLogger2.prototype.error = function() {
      var args = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        args[_i2] = arguments[_i2];
      }
      return logProxy("error", this._namespace, args);
    };
    DiagComponentLogger2.prototype.info = function() {
      var args = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        args[_i2] = arguments[_i2];
      }
      return logProxy("info", this._namespace, args);
    };
    DiagComponentLogger2.prototype.warn = function() {
      var args = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        args[_i2] = arguments[_i2];
      }
      return logProxy("warn", this._namespace, args);
    };
    DiagComponentLogger2.prototype.verbose = function() {
      var args = [];
      for (var _i2 = 0; _i2 < arguments.length; _i2++) {
        args[_i2] = arguments[_i2];
      }
      return logProxy("verbose", this._namespace, args);
    };
    return DiagComponentLogger2;
  }()
);
function logProxy(funcName, namespace, args) {
  var logger = getGlobal("diag");
  if (!logger) {
    return;
  }
  args.unshift(namespace);
  return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
}

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/diag/types.js
var DiagLogLevel;
(function(DiagLogLevel2) {
  DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
  DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
  DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
  DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
  DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
  DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
  DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
  if (maxLevel < DiagLogLevel.NONE) {
    maxLevel = DiagLogLevel.NONE;
  } else if (maxLevel > DiagLogLevel.ALL) {
    maxLevel = DiagLogLevel.ALL;
  }
  logger = logger || {};
  function _filterFunc(funcName, theLevel) {
    var theFunc = logger[funcName];
    if (typeof theFunc === "function" && maxLevel >= theLevel) {
      return theFunc.bind(logger);
    }
    return function() {
    };
  }
  return {
    error: _filterFunc("error", DiagLogLevel.ERROR),
    warn: _filterFunc("warn", DiagLogLevel.WARN),
    info: _filterFunc("info", DiagLogLevel.INFO),
    debug: _filterFunc("debug", DiagLogLevel.DEBUG),
    verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
  };
}

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/api/diag.js
var __read2 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray2 = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar2; i < l; i++) {
    if (ar2 || !(i in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i);
      ar2[i] = from[i];
    }
  }
  return to2.concat(ar2 || Array.prototype.slice.call(from));
};
var API_NAME = "diag";
var DiagAPI = (
  /** @class */
  function() {
    function DiagAPI2() {
      function _logProxy(funcName) {
        return function() {
          var args = [];
          for (var _i2 = 0; _i2 < arguments.length; _i2++) {
            args[_i2] = arguments[_i2];
          }
          var logger = getGlobal("diag");
          if (!logger)
            return;
          return logger[funcName].apply(logger, __spreadArray2([], __read2(args), false));
        };
      }
      var self2 = this;
      var setLogger = function(logger, optionsOrLogLevel) {
        var _a, _b, _c;
        if (optionsOrLogLevel === void 0) {
          optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
        }
        if (logger === self2) {
          var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
          self2.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
          return false;
        }
        if (typeof optionsOrLogLevel === "number") {
          optionsOrLogLevel = {
            logLevel: optionsOrLogLevel
          };
        }
        var oldLogger = getGlobal("diag");
        var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
        if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
          var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
          oldLogger.warn("Current logger will be overwritten from " + stack);
          newLogger.warn("Current logger will overwrite one already registered from " + stack);
        }
        return registerGlobal("diag", newLogger, self2, true);
      };
      self2.setLogger = setLogger;
      self2.disable = function() {
        unregisterGlobal(API_NAME, self2);
      };
      self2.createComponentLogger = function(options) {
        return new DiagComponentLogger(options);
      };
      self2.verbose = _logProxy("verbose");
      self2.debug = _logProxy("debug");
      self2.info = _logProxy("info");
      self2.warn = _logProxy("warn");
      self2.error = _logProxy("error");
    }
    DiagAPI2.instance = function() {
      if (!this._instance) {
        this._instance = new DiagAPI2();
      }
      return this._instance;
    };
    return DiagAPI2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/context/context.js
function createContextKey(description) {
  return Symbol.for(description);
}
var BaseContext = (
  /** @class */
  /* @__PURE__ */ function() {
    function BaseContext2(parentContext) {
      var self2 = this;
      self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
      self2.getValue = function(key) {
        return self2._currentContext.get(key);
      };
      self2.setValue = function(key, value) {
        var context2 = new BaseContext2(self2._currentContext);
        context2._currentContext.set(key, value);
        return context2;
      };
      self2.deleteValue = function(key) {
        var context2 = new BaseContext2(self2._currentContext);
        context2._currentContext.delete(key);
        return context2;
      };
    }
    return BaseContext2;
  }()
);
var ROOT_CONTEXT = new BaseContext();

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var __read3 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray3 = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar2; i < l; i++) {
    if (ar2 || !(i in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i);
      ar2[i] = from[i];
    }
  }
  return to2.concat(ar2 || Array.prototype.slice.call(from));
};
var NoopContextManager = (
  /** @class */
  function() {
    function NoopContextManager2() {
    }
    NoopContextManager2.prototype.active = function() {
      return ROOT_CONTEXT;
    };
    NoopContextManager2.prototype.with = function(_context, fn2, thisArg) {
      var args = [];
      for (var _i2 = 3; _i2 < arguments.length; _i2++) {
        args[_i2 - 3] = arguments[_i2];
      }
      return fn2.call.apply(fn2, __spreadArray3([thisArg], __read3(args), false));
    };
    NoopContextManager2.prototype.bind = function(_context, target) {
      return target;
    };
    NoopContextManager2.prototype.enable = function() {
      return this;
    };
    NoopContextManager2.prototype.disable = function() {
      return this;
    };
    return NoopContextManager2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/api/context.js
var __read4 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray4 = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar2; i < l; i++) {
    if (ar2 || !(i in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i);
      ar2[i] = from[i];
    }
  }
  return to2.concat(ar2 || Array.prototype.slice.call(from));
};
var API_NAME2 = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
var ContextAPI = (
  /** @class */
  function() {
    function ContextAPI2() {
    }
    ContextAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new ContextAPI2();
      }
      return this._instance;
    };
    ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
      return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
    };
    ContextAPI2.prototype.active = function() {
      return this._getContextManager().active();
    };
    ContextAPI2.prototype.with = function(context2, fn2, thisArg) {
      var _a;
      var args = [];
      for (var _i2 = 3; _i2 < arguments.length; _i2++) {
        args[_i2 - 3] = arguments[_i2];
      }
      return (_a = this._getContextManager()).with.apply(_a, __spreadArray4([context2, fn2, thisArg], __read4(args), false));
    };
    ContextAPI2.prototype.bind = function(context2, target) {
      return this._getContextManager().bind(context2, target);
    };
    ContextAPI2.prototype._getContextManager = function() {
      return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
    };
    ContextAPI2.prototype.disable = function() {
      this._getContextManager().disable();
      unregisterGlobal(API_NAME2, DiagAPI.instance());
    };
    return ContextAPI2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
(function(TraceFlags2) {
  TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
  TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID = "0000000000000000";
var INVALID_TRACEID = "00000000000000000000000000000000";
var INVALID_SPAN_CONTEXT = {
  traceId: INVALID_TRACEID,
  spanId: INVALID_SPANID,
  traceFlags: TraceFlags.NONE
};

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var NonRecordingSpan = (
  /** @class */
  function() {
    function NonRecordingSpan2(_spanContext) {
      if (_spanContext === void 0) {
        _spanContext = INVALID_SPAN_CONTEXT;
      }
      this._spanContext = _spanContext;
    }
    NonRecordingSpan2.prototype.spanContext = function() {
      return this._spanContext;
    };
    NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
      return this;
    };
    NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
      return this;
    };
    NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
      return this;
    };
    NonRecordingSpan2.prototype.addLink = function(_link) {
      return this;
    };
    NonRecordingSpan2.prototype.addLinks = function(_links) {
      return this;
    };
    NonRecordingSpan2.prototype.setStatus = function(_status) {
      return this;
    };
    NonRecordingSpan2.prototype.updateName = function(_name) {
      return this;
    };
    NonRecordingSpan2.prototype.end = function(_endTime) {
    };
    NonRecordingSpan2.prototype.isRecording = function() {
      return false;
    };
    NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
    };
    return NonRecordingSpan2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
function getSpan(context2) {
  return context2.getValue(SPAN_KEY) || void 0;
}
function getActiveSpan() {
  return getSpan(ContextAPI.getInstance().active());
}
function setSpan(context2, span) {
  return context2.setValue(SPAN_KEY, span);
}
function deleteSpan(context2) {
  return context2.deleteValue(SPAN_KEY);
}
function setSpanContext(context2, spanContext) {
  return setSpan(context2, new NonRecordingSpan(spanContext));
}
function getSpanContext(context2) {
  var _a;
  return (_a = getSpan(context2)) === null || _a === void 0 ? void 0 : _a.spanContext();
}

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
  return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
  return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
function isSpanContextValid(spanContext) {
  return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
function wrapSpanContext(spanContext) {
  return new NonRecordingSpan(spanContext);
}

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
var contextApi = ContextAPI.getInstance();
var NoopTracer = (
  /** @class */
  function() {
    function NoopTracer2() {
    }
    NoopTracer2.prototype.startSpan = function(name, options, context2) {
      if (context2 === void 0) {
        context2 = contextApi.active();
      }
      var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
      if (root) {
        return new NonRecordingSpan();
      }
      var parentFromContext = context2 && getSpanContext(context2);
      if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
        return new NonRecordingSpan(parentFromContext);
      } else {
        return new NonRecordingSpan();
      }
    };
    NoopTracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
      var opts;
      var ctx;
      var fn2;
      if (arguments.length < 2) {
        return;
      } else if (arguments.length === 2) {
        fn2 = arg2;
      } else if (arguments.length === 3) {
        opts = arg2;
        fn2 = arg3;
      } else {
        opts = arg2;
        ctx = arg3;
        fn2 = arg4;
      }
      var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
      var span = this.startSpan(name, opts, parentContext);
      var contextWithSpanSet = setSpan(parentContext, span);
      return contextApi.with(contextWithSpanSet, fn2, void 0, span);
    };
    return NoopTracer2;
  }()
);
function isSpanContext(spanContext) {
  return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER = new NoopTracer();
var ProxyTracer = (
  /** @class */
  function() {
    function ProxyTracer2(_provider, name, version, options) {
      this._provider = _provider;
      this.name = name;
      this.version = version;
      this.options = options;
    }
    ProxyTracer2.prototype.startSpan = function(name, options, context2) {
      return this._getTracer().startSpan(name, options, context2);
    };
    ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
      var tracer = this._getTracer();
      return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
    };
    ProxyTracer2.prototype._getTracer = function() {
      if (this._delegate) {
        return this._delegate;
      }
      var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!tracer) {
        return NOOP_TRACER;
      }
      this._delegate = tracer;
      return this._delegate;
    };
    return ProxyTracer2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var NoopTracerProvider = (
  /** @class */
  function() {
    function NoopTracerProvider2() {
    }
    NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
      return new NoopTracer();
    };
    return NoopTracerProvider2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
var ProxyTracerProvider = (
  /** @class */
  function() {
    function ProxyTracerProvider2() {
    }
    ProxyTracerProvider2.prototype.getTracer = function(name, version, options) {
      var _a;
      return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options);
    };
    ProxyTracerProvider2.prototype.getDelegate = function() {
      var _a;
      return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
    };
    ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
      this._delegate = delegate;
    };
    ProxyTracerProvider2.prototype.getDelegateTracer = function(name, version, options) {
      var _a;
      return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
    };
    return ProxyTracerProvider2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var SpanKind;
(function(SpanKind2) {
  SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
  SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
  SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
  SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
  SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind || (SpanKind = {}));

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/context-api.js
var context = ContextAPI.getInstance();

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME3 = "trace";
var TraceAPI = (
  /** @class */
  function() {
    function TraceAPI2() {
      this._proxyTracerProvider = new ProxyTracerProvider();
      this.wrapSpanContext = wrapSpanContext;
      this.isSpanContextValid = isSpanContextValid;
      this.deleteSpan = deleteSpan;
      this.getSpan = getSpan;
      this.getActiveSpan = getActiveSpan;
      this.getSpanContext = getSpanContext;
      this.setSpan = setSpan;
      this.setSpanContext = setSpanContext;
    }
    TraceAPI2.getInstance = function() {
      if (!this._instance) {
        this._instance = new TraceAPI2();
      }
      return this._instance;
    };
    TraceAPI2.prototype.setGlobalTracerProvider = function(provider) {
      var success = registerGlobal(API_NAME3, this._proxyTracerProvider, DiagAPI.instance());
      if (success) {
        this._proxyTracerProvider.setDelegate(provider);
      }
      return success;
    };
    TraceAPI2.prototype.getTracerProvider = function() {
      return getGlobal(API_NAME3) || this._proxyTracerProvider;
    };
    TraceAPI2.prototype.getTracer = function(name, version) {
      return this.getTracerProvider().getTracer(name, version);
    };
    TraceAPI2.prototype.disable = function() {
      unregisterGlobal(API_NAME3, DiagAPI.instance());
      this._proxyTracerProvider = new ProxyTracerProvider();
    };
    return TraceAPI2;
  }()
);

// ../../../../../../ax/node_modules/@opentelemetry/api/build/esm/trace-api.js
var trace = TraceAPI.getInstance();

// ../../../../../../ax/src/ax/dist/index.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_customParseFormat = __toESM(require_customParseFormat(), 1);
var import_timezone = __toESM(require_timezone(), 1);
var import_utc = __toESM(require_utc(), 1);
function K({ model: s10, modelInfo: e, models: t }) {
  let n = t?.find((l) => l.key === s10), o = n && "model" in n ? n.model : s10, r = e.find((l) => l.name === s10);
  if (r) return r;
  let i = o.replace(/^(anthropic\.|openai\.)/, "").replace(/-latest$/, "").replace(/-\d{8}$/, "").replace(/-v\d+:\d+$/, "").replace(/@\d{8}$/, "").replace(/-\d{2,}(-[a-zA-Z0-9-]+)?$/, "").replace(/-v\d+@\d{8}$/, "").replace(/-v\d+$/, ""), a = e.find((l) => l.name === i);
  return a || null;
}
var So = (() => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID == "function") return globalThis.crypto;
  throw new Error("Web Crypto API with randomUUID support not available. Requires Node.js 16+ or modern browser.");
})();
function U() {
  return So.randomUUID();
}
async function bs(s10) {
  let e = new TextEncoder(), t = typeof s10 == "string" ? e.encode(s10) : s10, n = await So.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((i) => i.toString(16).padStart(2, "0")).join("");
}
var jt = class {
  data = "";
  update(e) {
    return this.data += e, this;
  }
  digest(e) {
    if (e !== "hex") throw new Error("Only hex encoding is supported");
    let n = new TextEncoder().encode(this.data), o = 0;
    for (let r = 0; r < n.length; r++) {
      let i = n[r];
      o = (o << 5) - o + i, o = o & o;
    }
    return Math.abs(o).toString(16).padStart(8, "0");
  }
  async digestAsync() {
    return bs(this.data);
  }
};
function nt(s10) {
  if (s10 !== "sha256") throw new Error("Only SHA-256 algorithm is supported");
  return new jt();
}
var ot = class extends TransformStream {
  buffer = "";
  currentEvent = { rawData: "" };
  dataParser;
  onError;
  constructor(e = {}) {
    super({ transform: (t, n) => this.handleChunk(t, n), flush: (t) => this.handleFlush(t) }), this.dataParser = e.dataParser || JSON.parse, this.onError = e.onError || ((t, n) => {
      console.warn("Failed to parse event data:", t), console.log("Raw data that failed to parse:", n);
    });
  }
  handleChunk(e, t) {
    this.buffer += e, this.processBuffer(t);
  }
  handleFlush(e) {
    this.processBuffer(e), this.currentEvent.rawData && this.processEvent(e);
  }
  processBuffer(e) {
    let n = this.buffer.replace(/\r\n|\r/g, `
`).split(`
`);
    this.buffer = n.pop() || "";
    for (let o of n) o === "" ? this.processEvent(e) : this.parseLine(o);
  }
  parseLine(e) {
    if (e.startsWith(":")) return;
    let t = e.indexOf(":");
    if (t === -1) {
      this.currentEvent.rawData += (this.currentEvent.rawData && !this.currentEvent.rawData.endsWith(`
`) ? `
` : "") + e.trim();
      return;
    }
    let n = e.slice(0, t).trim(), o = e.slice(t + 1).trim();
    switch (n) {
      case "event":
        this.currentEvent.event = o;
        break;
      case "data":
        this.currentEvent.rawData += (this.currentEvent.rawData && !this.currentEvent.rawData.endsWith(`
`) ? `
` : "") + o;
        break;
      case "id":
        this.currentEvent.id = o;
        break;
      case "retry": {
        let r = Number.parseInt(o, 10);
        Number.isNaN(r) || (this.currentEvent.retry = r);
        break;
      }
    }
  }
  processEvent(e) {
    if (this.currentEvent.rawData) {
      if (this.currentEvent.event || (this.currentEvent.event = "message"), this.currentEvent.rawData.trim() === "[DONE]") {
        this.currentEvent = { rawData: "" };
        return;
      }
      try {
        let t = this.dataParser(this.currentEvent.rawData);
        e.enqueue(t);
      } catch (t) {
        this.onError(t, this.currentEvent.rawData);
      }
      this.currentEvent = { rawData: "" };
    }
  }
};
var Ht = class {
  decoder;
  constructor() {
    this.decoder = new TextDecoder();
  }
  transform(e, t) {
    if (!(e instanceof ArrayBuffer || ArrayBuffer.isView(e))) throw new TypeError("Input data must be a BufferSource");
    let n = this.decoder.decode(e, { stream: true });
    n.length !== 0 && t.enqueue(n);
  }
  flush(e) {
    let t = this.decoder.decode();
    t.length !== 0 && e.enqueue(t);
  }
};
var rt = class extends TransformStream {
  constructor() {
    super(new Ht());
  }
};
var Rs = { maxRetries: 3, initialDelayMs: 1e3, maxDelayMs: 6e4, backoffFactor: 2, retryableStatusCodes: [500, 408, 429, 502, 503, 504] };
var Cs = globalThis.TextDecoderStream ?? rt;
var H = class extends Error {
  constructor(t, n, o, r, i = {}) {
    super(t);
    this.url = n;
    this.requestBody = o;
    this.responseBody = r;
    this.name = this.constructor.name, this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = U(), this.context = i, this.stack = this.toString();
  }
  timestamp;
  errorId;
  context;
  toString() {
    return [`${this.name}: ${this.message}`, `URL: ${this.url}`, `Request Body: ${JSON.stringify(this.requestBody, null, 2)}`, `Response Body: ${JSON.stringify(this.responseBody, null, 2)}`, `Context: ${JSON.stringify(this.context, null, 2)}`, `Timestamp: ${this.timestamp}`, `Error ID: ${this.errorId}`].join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](t, n) {
    return this.toString();
  }
};
var de = class extends H {
  constructor(t, n, o, r, i, a) {
    super(`HTTP ${t} - ${n}`, o, r, { httpStatus: t, httpStatusText: n, responseBody: i, ...a });
    this.status = t;
    this.statusText = n;
    this.name = this.constructor.name;
  }
};
var ne = class extends H {
  constructor(t, n, o, r, i) {
    super(`Network Error: ${t.message}`, n, o, r, { originalErrorName: t.name, originalErrorStack: t.stack, ...i });
    this.originalError = t;
    this.name = this.constructor.name, this.stack = t.stack;
  }
};
var oe = class extends H {
  constructor(e, t, n, o) {
    super(e, t, n, void 0, o), this.name = this.constructor.name;
  }
};
var Y = class extends H {
  constructor(t, n, o, r) {
    super("Stream terminated unexpectedly by remote host", t, n, void 0, { lastChunk: o, ...r });
    this.lastChunk = o;
    this.name = this.constructor.name;
  }
};
var me = class extends H {
  constructor(e, t, n, o) {
    super(`Request timed out after ${t}ms`, e, n, void 0, { timeoutMs: t, ...o }), this.name = this.constructor.name;
  }
};
var ye = class extends H {
  constructor(e, t, n, o) {
    super(`Request aborted${t ? `: ${t}` : ""}`, e, n, void 0, { abortReason: t, ...o }), this.name = this.constructor.name;
  }
};
var re2 = class extends H {
  constructor(e, t, n, o) {
    super("Authentication failed", e, t, n, o), this.name = this.constructor.name;
  }
};
var O = class extends Error {
  constructor(t, n, o) {
    super(`Model refused to fulfill request: ${t}`);
    this.refusalMessage = t;
    this.model = n;
    this.requestId = o;
    this.name = "AxAIRefusalError", this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = U();
  }
  timestamp;
  errorId;
  toString() {
    return [`${this.name}: ${this.message}`, `Refusal: ${this.refusalMessage}`, this.model ? `Model: ${this.model}` : "", this.requestId ? `Request ID: ${this.requestId}` : "", `Timestamp: ${this.timestamp}`, `Error ID: ${this.errorId}`].filter(Boolean).join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](t, n) {
    return this.toString();
  }
};
var V = class extends Error {
  constructor(t, n, o = false) {
    super(`${t} not supported by ${n}${o ? " (fallback available)" : ""}`);
    this.mediaType = t;
    this.provider = n;
    this.fallbackAvailable = o;
    this.name = "AxMediaNotSupportedError", this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = U();
  }
  timestamp;
  errorId;
  toString() {
    return [`${this.name}: ${this.message}`, `Media Type: ${this.mediaType}`, `Provider: ${this.provider}`, `Fallback Available: ${this.fallbackAvailable}`, `Timestamp: ${this.timestamp}`, `Error ID: ${this.errorId}`].join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](t, n) {
    return this.toString();
  }
};
var X = class extends Error {
  constructor(t, n, o) {
    super(`Failed to process ${n} during ${o}: ${t.message}`);
    this.originalError = t;
    this.contentType = n;
    this.processingStep = o;
    this.name = "AxContentProcessingError", this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = U();
  }
  timestamp;
  errorId;
  toString() {
    return [`${this.name}: ${this.message}`, `Content Type: ${this.contentType}`, `Processing Step: ${this.processingStep}`, `Original Error: ${this.originalError.message}`, `Timestamp: ${this.timestamp}`, `Error ID: ${this.errorId}`].join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](t, n) {
    return this.toString();
  }
};
async function vo(s10) {
  try {
    return s10.headers.get("content-type")?.includes("application/json") ? await s10.json() : await s10.clone().text();
  } catch (e) {
    return `[ReadableStream - read failed: ${e.message}]`;
  }
}
function Oo(s10, e) {
  return Math.min(e.maxDelayMs, e.initialDelayMs * e.backoffFactor ** s10) * (0.75 + Math.random() * 0.5);
}
function Ts() {
  return { startTime: Date.now(), retryCount: 0 };
}
function Mo(s10) {
  s10.retryCount++, s10.lastRetryTime = Date.now();
}
function ko(s10, e, t, n) {
  return t >= n.maxRetries ? false : e && n.retryableStatusCodes.includes(e) ? true : s10 instanceof ne && !(s10 instanceof re2);
}
var B = async (s10, e) => {
  if (s10.localCall) return await s10.localCall(e, s10.stream);
  if (!s10.url) throw new Error("API URL is required when localCall is not provided");
  let t = { ...Rs, ...s10.retry }, n = s10.timeout, o = Ts(), r, i = new URL(s10.url), a = `${[i.pathname, s10.name].filter(Boolean).join("/").replace(/\/+/g, "/")}${i.search}`, l = new URL(a, i);
  if (s10.corsProxy) {
    let u = l.href;
    l = new URL(`${s10.corsProxy}?url=${encodeURIComponent(u)}`);
  }
  let p = U();
  if (s10.validateRequest && !await s10.validateRequest(e)) throw new oe("Invalid request data", l.href, e, { validation: "request" });
  s10.span?.setAttributes({ "http.request.method": s10.put ? "PUT" : "POST", "url.full": l.href, "request.id": p, "request.startTime": o.startTime });
  let c = 0;
  for (; ; ) {
    let u = new AbortController();
    if (s10.abortSignal) {
      if (s10.abortSignal.aborted) throw new ye(l.href, s10.abortSignal.reason, e, { metrics: o });
      let d = () => {
        u.abort(s10.abortSignal.reason || "User aborted request");
      };
      s10.abortSignal.addEventListener("abort", d, { once: true });
      let m = u.abort.bind(u);
      u.abort = (g) => {
        s10.abortSignal.removeEventListener("abort", d), m(g);
      };
    }
    n && (r = setTimeout(() => {
      u.abort("Request timeout");
    }, n));
    try {
      let d = await (s10.fetch ?? fetch)(l, { method: s10.put ? "PUT" : "POST", headers: { "Content-Type": "application/json", "X-Request-ID": p, "X-Retry-Count": c.toString(), ...s10.headers }, body: JSON.stringify(e), signal: u.signal });
      if (r && clearTimeout(r), d.status === 401 || d.status === 403) {
        let x = await vo(d);
        throw new re2(l.href, e, x, { metrics: o });
      }
      if (d.status >= 400 && ko(new Error(), d.status, c, t)) {
        let x = Oo(c, t);
        c++, Mo(o), s10.span?.addEvent("retry", { attempt: c, delay: x, status: d.status, "metrics.startTime": o.startTime, "metrics.retryCount": o.retryCount, "metrics.lastRetryTime": o.lastRetryTime }), await new Promise((y) => setTimeout(y, x));
        continue;
      }
      if (d.status >= 400) {
        let x = await vo(d);
        throw new de(d.status, d.statusText, l.href, e, x, { metrics: o });
      }
      if (!s10.stream) {
        let x = await d.json();
        if (s10.validateResponse && !await s10.validateResponse(x)) throw new oe("Invalid response data", l.href, e, { validation: "response" });
        return s10.span?.setAttributes({ "response.time": Date.now() - o.startTime, "response.retries": o.retryCount }), x;
      }
      if (!d.body) throw new oe("Response body is null", l.href, e, { metrics: o });
      let m, g = 0;
      if (typeof window < "u" && typeof EventSource < "u") return new ReadableStream({ start(x) {
        let y = d.body.getReader(), v = new TextDecoder(), I = "";
        async function C() {
          try {
            for (; ; ) {
              let { done: k, value: S } = await y.read();
              if (k) {
                A = true, x.close();
                break;
              }
              I += v.decode(S, { stream: true });
              let z = I.split(`

`);
              I = z.pop() || "";
              for (let j of z) {
                if (!j.trim()) continue;
                let N = j.split(`
`), te = "", ue = "message";
                for (let $ of N) $.startsWith("data: ") ? te = $.slice(6) : $.startsWith("event: ") && (ue = $.slice(7));
                if (te) {
                  if (te === "[DONE]") {
                    x.close();
                    return;
                  }
                  try {
                    let $ = JSON.parse(te);
                    m = $, g++, o.streamChunks = g, o.lastChunkTime = Date.now(), console.log("!!!!>>>>>>>>>parsed", $), x.enqueue($), s10.span?.addEvent("stream.chunk", { "stream.chunks": g, "stream.duration": Date.now() - o.startTime, "response.retries": o.retryCount, "sse.event.type": ue });
                  } catch ($) {
                    s10.debug && console.warn("Skipping non-JSON SSE data:", te, $);
                  }
                }
              }
            }
          } catch (k) {
            let S = k, z = { ...o, streamDuration: Date.now() - o.startTime };
            S.name === "AbortError" || S.message?.includes("aborted") ? x.error(new Y(l.href, e, m, { streamMetrics: z })) : x.error(new ne(S, l.href, e, "[ReadableStream - consumed during streaming]", { streamMetrics: z }));
          } finally {
            y.releaseLock();
          }
        }
        C();
      } });
      let f = new TransformStream({ transform(x, y) {
        m = x, g++, o.streamChunks = g, o.lastChunkTime = Date.now(), y.enqueue(x), s10.span?.addEvent("stream.chunk", { "stream.chunks": g, "stream.duration": Date.now() - o.startTime, "response.retries": o.retryCount });
      } }), A = false;
      return new ReadableStream({ start(x) {
        let y = d.body.pipeThrough(new Cs()).pipeThrough(new ot()).pipeThrough(f).getReader();
        async function v() {
          try {
            for (; ; ) {
              let { done: I, value: C } = await y.read();
              if (I) {
                A || (A = true, x.close());
                break;
              }
              if (A) break;
              x.enqueue(C);
            }
          } catch (I) {
            let C = I, k = { ...o, streamDuration: Date.now() - o.startTime };
            throw C.name === "AbortError" || C.message?.includes("aborted") ? x.error(new Y(l.href, e, m, { streamMetrics: k })) : C instanceof TypeError && C.message.includes("cancelled") ? x.error(new Y(l.href, e, m, { streamMetrics: k, cancelReason: "Stream cancelled by client" })) : x.error(new ne(C, l.href, e, "[ReadableStream - consumed during streaming]", { streamMetrics: k })), C;
          } finally {
            r && clearTimeout(r), y.releaseLock();
          }
        }
        v();
      }, cancel() {
        A = true;
      } });
    } catch (d) {
      if (d instanceof Error && d.name === "AbortError") throw s10.abortSignal?.aborted ? new ye(l.href, s10.abortSignal.reason, e, { metrics: o }) : new me(l.href, n || 0, e, { metrics: o });
      if (s10.span?.isRecording() && (s10.span.recordException(d), s10.span.setAttributes({ "error.time": Date.now() - o.startTime, "error.retries": o.retryCount })), d instanceof ne && ko(d, void 0, c, t)) {
        let m = Oo(c, t);
        c++, Mo(o), s10.span?.addEvent("retry", { attempt: c, delay: m, error: d.message, "metrics.startTime": o.startTime, "metrics.retryCount": o.retryCount, "metrics.lastRetryTime": o.lastRetryTime }), await new Promise((g) => setTimeout(g, m));
        continue;
      }
      throw d instanceof H && (d.context.metrics = o), d;
    } finally {
      r !== void 0 && clearTimeout(r);
    }
  }
};
var M = { signatureStrict: true, tracer: void 0, meter: void 0, logger: void 0, optimizerLogger: void 0, functionResultFormatter: (s10) => typeof s10 == "string" ? s10 : s10 == null ? "" : JSON.stringify(s10, null, 2) };
var L = class {
  ANSI_WHITE_BRIGHT = "\x1B[97m";
  ANSI_GREEN_BRIGHT = "\x1B[92m";
  ANSI_BLUE_BRIGHT = "\x1B[94m";
  ANSI_RED_BRIGHT = "\x1B[91m";
  ANSI_YELLOW = "\x1B[93m";
  ANSI_RED = "\x1B[91m";
  ANSI_RESET = "\x1B[0m";
  ANSI_ORANGE = "\x1B[38;5;208m";
  ANSI_WHITE = "\x1B[37m";
  ANSI_CYAN_BRIGHT = "\x1B[96m";
  ANSI_MAGENTA_BRIGHT = "\x1B[95m";
  ANSI_GRAY = "\x1B[90m";
  ANSI_GREEN = "\x1B[32m";
  ANSI_CYAN = "\x1B[36m";
  ANSI_MAGENTA = "\x1B[35m";
  ANSI_BLUE = "\x1B[34m";
  ANSI_YELLOW_DIM = "\x1B[33m";
  colorize(e, t) {
    return `${t}${e}${this.ANSI_RESET}`;
  }
  whiteBright(e) {
    return this.colorize(e, this.ANSI_WHITE_BRIGHT);
  }
  greenBright(e) {
    return this.colorize(e, this.ANSI_GREEN_BRIGHT);
  }
  blueBright(e) {
    return this.colorize(e, this.ANSI_BLUE_BRIGHT);
  }
  redBright(e) {
    return this.colorize(e, this.ANSI_RED_BRIGHT);
  }
  white(e) {
    return this.colorize(e, this.ANSI_WHITE);
  }
  yellow(e) {
    return this.colorize(e, this.ANSI_YELLOW);
  }
  red(e) {
    return this.colorize(e, this.ANSI_RED);
  }
  orange(e) {
    return this.colorize(e, this.ANSI_ORANGE);
  }
  cyanBright(e) {
    return this.colorize(e, this.ANSI_CYAN_BRIGHT);
  }
  magentaBright(e) {
    return this.colorize(e, this.ANSI_MAGENTA_BRIGHT);
  }
  gray(e) {
    return this.colorize(e, this.ANSI_GRAY);
  }
  green(e) {
    return this.colorize(e, this.ANSI_GREEN);
  }
  cyan(e) {
    return this.colorize(e, this.ANSI_CYAN);
  }
  magenta(e) {
    return this.colorize(e, this.ANSI_MAGENTA);
  }
  blue(e) {
    return this.colorize(e, this.ANSI_BLUE);
  }
  yellowDim(e) {
    return this.colorize(e, this.ANSI_YELLOW_DIM);
  }
};
var Fa = new L();
var Eo = (s10) => {
  console.log(s10);
};
var Po = (s10, e, t) => {
  let n = (o, r) => t && r && r in t ? t[r](o) : o;
  switch (s10.role) {
    case "system":
      return `${n("[ SYSTEM ]", "magentaBright")}
${n(s10.content, "magenta")}`;
    case "function":
      return `${n("[ FUNCTION RESULT ]", "yellow")}
${n(s10.result ?? "[No result]", "yellowDim")}`;
    case "user": {
      let o = `${n("[ USER ]", "greenBright")}
`;
      if (typeof s10.content == "string") return o + n(s10.content, "green");
      let r = s10.content.map((i) => {
        if (i.type === "text") return n(i.text, "green");
        if (i.type === "image") {
          let a = e ? "[Image]" : `[Image: ${i.image}]`;
          return n(a, "green");
        }
        if (i.type === "audio") {
          let a = e ? "[Audio]" : `[Audio: ${i.data}]`;
          return n(a, "green");
        }
        return n("[Unknown content type]", "gray");
      });
      return o + r.join(`
`);
    }
    case "assistant": {
      let o = n("[ ASSISTANT", "cyanBright");
      s10.name && (o += ` ${s10.name}`), o += " ]";
      let r = `${o}
`;
      return s10.content && (r += `${n(s10.content, "cyan")}
`), s10.functionCalls && s10.functionCalls.length > 0 && (r += `${n("[ FUNCTION CALLS ]", "yellow")}
`, s10.functionCalls.forEach((i, a) => {
        let l = typeof i.function.params == "string" ? i.function.params : JSON.stringify(i.function.params, null, 2);
        r += n(`${a + 1}. ${i.function.name}(${l}) [id: ${i.id}]`, "yellowDim"), a < (s10.functionCalls?.length ?? 0) - 1 && (r += `
`);
      }), r += `
`), !s10.content && (!s10.functionCalls || s10.functionCalls.length === 0) && (r += n("[No content]", "gray")), r;
    }
    default:
      return `${n("[ UNKNOWN ]", "redBright")}
${n(JSON.stringify(s10), "gray")}`;
  }
};
var Fo = (s10 = Eo) => {
  let e = new L(), t = e.gray(`${"\u2500".repeat(60)}
`);
  return (n) => {
    let o = n, r = "";
    switch (o.name) {
      case "ChatRequestChatPrompt":
        r = `
${e.blueBright(`[ CHAT REQUEST Step ${o.step} ]`)}
${t}
`, o.value.forEach((i, a) => {
          r += Po(i, void 0, e), a < o.value.length - 1 && (r += `
${t}
`);
        }), r += `
${t}`;
        break;
      case "FunctionResults":
        r = `
${e.yellow("[ FUNCTION RESULTS ]")}
`, o.value.forEach((i, a) => {
          r += e.yellowDim(`Function: ${i.functionId}
Result: ${i.result}`), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "ChatResponseResults":
        r = `
${e.cyanBright("[ CHAT RESPONSE ]")}
`, o.value.forEach((i, a) => {
          r += e.cyan(i.content || "[No content]"), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "ChatResponseStreamingResult": {
        let i = o.value.delta || o.value.content || "";
        r = e.cyanBright(i);
        return;
      }
      case "ChatResponseStreamingDoneResult": {
        r = `
${e.cyanBright("[ CHAT RESPONSE ]")}
${t}
`, o.value.content && (r += e.cyanBright(o.value.content)), o.value.functionCalls && (r += e.cyanBright(JSON.stringify(o.value.functionCalls, null, 2)));
        break;
      }
      case "FunctionError":
        r = `
${e.redBright(`[ FUNCTION ERROR #${o.index} ]`)}
${t}
${e.white(o.fixingInstructions)}
${e.red(`Error: ${o.error}`)}`;
        break;
      case "ValidationError":
        r = `
${e.redBright(`[ VALIDATION ERROR #${o.index} ]`)}
${t}
${e.white(o.fixingInstructions)}
${e.red(`Error: ${o.error}`)}`;
        break;
      case "AssertionError":
        r = `
${e.redBright(`[ ASSERTION ERROR #${o.index} ]`)}
${t}
${e.white(o.fixingInstructions)}
${e.red(`Error: ${o.error}`)}`;
        break;
      case "ResultPickerUsed":
        r = `${e.greenBright("[ RESULT PICKER ]")}
${t}
${e.green(`Selected sample ${o.selectedIndex + 1} of ${o.sampleCount} (${o.latency.toFixed(2)}ms)`)}`;
        break;
      case "Notification":
        r = `${e.gray(`[ NOTIFICATION ${o.id} ]`)}
${t}
${e.white(o.value)}`;
        break;
      case "EmbedRequest":
        r = `${e.orange(`[ EMBED REQUEST ${o.embedModel} ]`)}
${t}
`, o.value.forEach((i, a) => {
          r += e.white(`Text ${a + 1}: ${i.substring(0, 100)}${i.length > 100 ? "..." : ""}`), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "EmbedResponse":
        r = `${e.orange(`[ EMBED RESPONSE (${o.totalEmbeddings} embeddings) ]`)}
${t}
`, o.value.forEach((i, a) => {
          r += e.white(`Embedding ${a + 1}: [${i.sample.join(", ")}${i.truncated ? ", ..." : ""}] (length: ${i.length})`), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      default:
        r = e.gray(JSON.stringify(o, null, 2));
    }
    s10(r);
  };
};
var _o = Fo();
var ws = (s10 = Eo) => {
  let e = "\u2500".repeat(60);
  return (t) => {
    let n = t, o = "";
    switch (n.name) {
      case "ChatRequestChatPrompt":
        o = `
[ CHAT REQUEST Step ${n.step} ]
${e}
`, n.value.forEach((r, i) => {
          o += Po(r), i < n.value.length - 1 && (o += `
${e}
`);
        }), o += `
${e}`;
        break;
      case "FunctionResults":
        o = `
[ FUNCTION RESULTS ]
${e}
`, n.value.forEach((r, i) => {
          o += `Function: ${r.functionId}
Result: ${r.result}`, i < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      case "ChatResponseResults":
        o = `
[ CHAT RESPONSE ]
`, n.value.forEach((r, i) => {
          o += r.content || "[No content]", i < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      case "ChatResponseStreamingResult":
        return;
      case "ChatResponseStreamingDoneResult": {
        o = `
[ CHAT RESPONSE ]
`, n.value.content && (o += n.value.content), n.value.functionCalls && (o += JSON.stringify(n.value.functionCalls, null, 2));
        break;
      }
      case "FunctionError":
        o = `
[ FUNCTION ERROR #${n.index} ]
${e}
${n.fixingInstructions}
Error: ${n.error}`;
        break;
      case "ValidationError":
        o = `
[ VALIDATION ERROR #${n.index} ]
${e}
${n.fixingInstructions}
Error: ${n.error}`;
        break;
      case "AssertionError":
        o = `
[ ASSERTION ERROR #${n.index} ]
${e}
${n.fixingInstructions}
Error: ${n.error}`;
        break;
      case "ResultPickerUsed":
        o = `[ RESULT PICKER ]
${e}
Selected sample ${n.selectedIndex + 1} of ${n.sampleCount} (${n.latency.toFixed(2)}ms)`;
        break;
      case "Notification":
        o = `[ NOTIFICATION ${n.id} ]
${e}
${n.value}`;
        break;
      case "EmbedRequest":
        o = `[ EMBED REQUEST ${n.embedModel} ]
${e}
`, n.value.forEach((r, i) => {
          o += `Text ${i + 1}: ${r.substring(0, 100)}${r.length > 100 ? "..." : ""}`, i < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      case "EmbedResponse":
        o = `[ EMBED RESPONSE (${n.totalEmbeddings} embeddings) ]
${e}
`, n.value.forEach((r, i) => {
          o += `Embedding ${i + 1}: [${r.sample.join(", ")}${r.truncated ? ", ..." : ""}] (length: ${r.length})`, i < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      default:
        o = JSON.stringify(n, null, 2);
    }
    s10(o);
  };
};
var T = { LLM_SYSTEM: "gen_ai.system", LLM_OPERATION_NAME: "gen_ai.operation.name", LLM_REQUEST_MODEL: "gen_ai.request.model", LLM_REQUEST_MAX_TOKENS: "gen_ai.request.max_tokens", LLM_REQUEST_TEMPERATURE: "gen_ai.request.temperature", LLM_REQUEST_TOP_K: "gen_ai.request.top_k", LLM_REQUEST_FREQUENCY_PENALTY: "gen_ai.request.frequency_penalty", LLM_REQUEST_PRESENCE_PENALTY: "gen_ai.request.presence_penalty", LLM_REQUEST_STOP_SEQUENCES: "gen_ai.request.stop_sequences", LLM_REQUEST_LLM_IS_STREAMING: "gen_ai.request.llm_is_streaming", LLM_REQUEST_TOP_P: "gen_ai.request.top_p", LLM_USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens", LLM_USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens", LLM_USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens", LLM_USAGE_THOUGHTS_TOKENS: "gen_ai.usage.thoughts_tokens", DB_SYSTEM: "db.system", DB_TABLE: "db.table", DB_NAMESPACE: "db.namespace", DB_ID: "db.id", DB_QUERY_TEXT: "db.query.text", DB_VECTOR: "db.vector", DB_OPERATION_NAME: "db.operation.name", DB_VECTOR_QUERY_TOP_K: "db.vector.query.top_k", DB_QUERY_EMBEDDINGS: "db.query.embeddings", DB_QUERY_RESULT: "db.query.result", DB_QUERY_EMBEDDINGS_VECTOR: "db.query.embeddings.vector", DB_QUERY_RESULT_ID: "db.query.result.id", DB_QUERY_RESULT_SCORE: "db.query.result.score", DB_QUERY_RESULT_DISTANCE: "db.query.result.distance", DB_QUERY_RESULT_METADATA: "db.query.result.metadata", DB_QUERY_RESULT_VECTOR: "db.query.result.vector", DB_QUERY_RESULT_DOCUMENT: "db.query.result.document" };
var Z = { GEN_AI_USER_MESSAGE: "gen_ai.user.message", GEN_AI_SYSTEM_MESSAGE: "gen_ai.system.message", GEN_AI_ASSISTANT_MESSAGE: "gen_ai.assistant.message", GEN_AI_TOOL_MESSAGE: "gen_ai.tool.message", GEN_AI_CHOICE: "gen_ai.choice", GEN_AI_USAGE: "gen_ai.usage" };
var Do = ((o) => (o.COMPLETION = "completion", o.CHAT = "chat", o.RERANK = "rerank", o.UNKNOWN = "unknown", o))(Do || {});
var Lo = ((r) => (r.WORKFLOW = "workflow", r.TASK = "task", r.AGENT = "agent", r.TOOL = "tool", r.UNKNOWN = "unknown", r))(Lo || {});
var Kt = class {
  buffer;
  doneCallback;
  transformFn;
  constructor(e, t) {
    this.transformFn = e, this.doneCallback = t, this.buffer = t ? [] : void 0;
  }
  async transform(e, t) {
    let n = this.transformFn(e);
    n && (t.enqueue(n), this.buffer?.push(n));
  }
  async flush(e) {
    await this.doneCallback?.(this.buffer ?? []), e.terminate();
  }
};
var st = class extends TransformStream {
  constructor(e, t) {
    super(new Kt(e, t));
  }
};
function it(s10, e) {
  for (let t of e) {
    let n = s10.find((o) => o.id === t.id);
    n ? (typeof t.function.name == "string" && t.function.name.length > 0 && (n.function.name += t.function.name), typeof t.function.params == "string" && t.function.params.length > 0 && (n.function.params += t.function.params), typeof t.function.params == "object" && (n.function.params = t.function.params)) : s10.push(t);
  }
}
var Go = (s10, e, t, n) => {
  let o = n ? s10.filter((i) => i.role !== "system") : [...s10];
  t({ name: "ChatRequestChatPrompt", step: e, value: o });
};
var No = (s10, e) => {
  if (!s10.results) return;
  let t = { name: "ChatResponseResults", value: s10.results };
  e(t);
};
var $o = (s10, e, t) => {
  t({ name: "ChatResponseStreamingResult", index: e, value: s10 });
};
function Uo(s10, e) {
  let t = /* @__PURE__ */ new Map();
  for (let n of s10) for (let o of n.results) {
    if (!o) continue;
    let r = t.get(o.index);
    r ? (o.content && (r.content = (r.content ?? "") + o.content), o.thought && (r.thought = (r.thought ?? "") + o.thought), o.finishReason && (r.finishReason = o.finishReason), o.functionCalls && (r.functionCalls ? it(r.functionCalls, structuredClone(o.functionCalls)) : r.functionCalls = structuredClone(o.functionCalls))) : (r = structuredClone(o), t.set(o.index, r));
  }
  for (let n of t.values()) {
    let o = { name: "ChatResponseStreamingDoneResult", index: n.index, value: n };
    e(o);
  }
}
var Bo = (s10, e) => {
  e({ name: "FunctionResults", value: s10 });
};
var qo = (s10, e, t, n) => {
  n({ name: "FunctionError", index: e, fixingInstructions: t, error: s10 });
};
var zo = (s10, e, t, n) => {
  n({ name: "ValidationError", index: e, fixingInstructions: t, error: s10 });
};
var jo = (s10, e, t, n) => {
  n({ name: "AssertionError", index: e, fixingInstructions: t, error: s10 });
};
var Ho = (s10, e, t) => {
  t({ name: "RefusalError", index: e, error: s10 });
};
var Ko = (s10, e, t) => {
  t({ name: "EmbedRequest", embedModel: e, value: s10 });
};
var Vo = (s10, e) => {
  let t = s10.slice(0, 3).map((o) => ({ length: o.length, sample: o.slice(0, 5), truncated: o.length > 5 })), n = { name: "EmbedResponse", totalEmbeddings: s10.length, value: t };
  e(n);
};
var Wo = (s10, e, t, n) => {
  n({ name: "ResultPickerUsed", sampleCount: s10, selectedIndex: e, latency: t });
};
var Vt = (s10) => {
  let e = {};
  for (let [t, n] of Object.entries(s10)) if (n != null) {
    let o = String(n);
    e[t] = o.length > 100 ? o.substring(0, 100) : o;
  }
  return e;
};
var at;
var Jo = (s10) => {
  if (at) return at;
  if (s10) return at = Ss(s10), at;
};
var Ss = (s10) => ({ latencyHistogram: s10.createHistogram("ax_llm_request_duration_ms", { description: "Duration of LLM requests in milliseconds", unit: "ms" }), errorCounter: s10.createCounter("ax_llm_errors_total", { description: "Total number of LLM request errors" }), requestCounter: s10.createCounter("ax_llm_requests_total", { description: "Total number of LLM requests" }), tokenCounter: s10.createCounter("ax_llm_tokens_total", { description: "Total number of LLM tokens consumed" }), inputTokenCounter: s10.createCounter("ax_llm_input_tokens_total", { description: "Total number of input/prompt tokens consumed" }), outputTokenCounter: s10.createCounter("ax_llm_output_tokens_total", { description: "Total number of output/completion tokens generated" }), errorRateGauge: s10.createGauge("ax_llm_error_rate", { description: "Current error rate as a percentage (0-100)" }), meanLatencyGauge: s10.createGauge("ax_llm_mean_latency_ms", { description: "Mean latency of LLM requests in milliseconds", unit: "ms" }), p95LatencyGauge: s10.createGauge("ax_llm_p95_latency_ms", { description: "95th percentile latency of LLM requests in milliseconds", unit: "ms" }), p99LatencyGauge: s10.createGauge("ax_llm_p99_latency_ms", { description: "99th percentile latency of LLM requests in milliseconds", unit: "ms" }), streamingRequestsCounter: s10.createCounter("ax_llm_streaming_requests_total", { description: "Total number of streaming LLM requests" }), functionCallsCounter: s10.createCounter("ax_llm_function_calls_total", { description: "Total number of function/tool calls made" }), functionCallLatencyHistogram: s10.createHistogram("ax_llm_function_call_latency_ms", { description: "Latency of function calls in milliseconds", unit: "ms" }), requestSizeHistogram: s10.createHistogram("ax_llm_request_size_bytes", { description: "Size of LLM request payloads in bytes", unit: "By" }), responseSizeHistogram: s10.createHistogram("ax_llm_response_size_bytes", { description: "Size of LLM response payloads in bytes", unit: "By" }), temperatureGauge: s10.createGauge("ax_llm_temperature_gauge", { description: "Temperature setting used for LLM requests" }), maxTokensGauge: s10.createGauge("ax_llm_max_tokens_gauge", { description: "Maximum tokens setting used for LLM requests" }), estimatedCostCounter: s10.createCounter("ax_llm_estimated_cost_total", { description: "Estimated cost of LLM requests in USD", unit: "$" }), promptLengthHistogram: s10.createHistogram("ax_llm_prompt_length_chars", { description: "Length of prompts in characters" }), contextWindowUsageGauge: s10.createGauge("ax_llm_context_window_usage_ratio", { description: "Context window utilization ratio (0-1)" }), timeoutsCounter: s10.createCounter("ax_llm_timeouts_total", { description: "Total number of timed out LLM requests" }), abortsCounter: s10.createCounter("ax_llm_aborts_total", { description: "Total number of aborted LLM requests" }), thinkingBudgetUsageCounter: s10.createCounter("ax_llm_thinking_budget_usage_total", { description: "Total thinking budget tokens used" }), multimodalRequestsCounter: s10.createCounter("ax_llm_multimodal_requests_total", { description: "Total number of multimodal requests (with images/audio)" }) });
var Qo = (s10, e, t, n, o) => {
  try {
    if (s10.latencyHistogram) {
      let r = Vt({ operation: e, ai_service: n, ...o ? { model: o } : {} });
      s10.latencyHistogram.record(t, r);
    }
  } catch (r) {
    console.warn("Failed to record latency metric:", r);
  }
};
var Yo = (s10, e, t, n, o, r, i) => {
  let a = { operation: e, ai_service: r, ...i ? { model: i } : {} };
  s10.meanLatencyGauge && s10.meanLatencyGauge.record(t, a), s10.p95LatencyGauge && s10.p95LatencyGauge.record(n, a), s10.p99LatencyGauge && s10.p99LatencyGauge.record(o, a);
};
var Xo = (s10, e, t, n) => {
  try {
    if (s10.errorCounter) {
      let o = Vt({ operation: e, ai_service: t, ...n ? { model: n } : {} });
      s10.errorCounter.add(1, o);
    }
  } catch (o) {
    console.warn("Failed to record error metric:", o);
  }
};
var Zo = (s10, e, t, n, o) => {
  s10.errorRateGauge && s10.errorRateGauge.record(t * 100, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var er = (s10, e, t, n) => {
  s10.requestCounter && s10.requestCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var Ie = (s10, e, t, n, o) => {
  try {
    let r = Vt({ ai_service: n, ...o ? { model: o } : {} });
    s10.tokenCounter && s10.tokenCounter.add(t, { token_type: e, ...r }), e === "input" && s10.inputTokenCounter && s10.inputTokenCounter.add(t, r), e === "output" && s10.outputTokenCounter && s10.outputTokenCounter.add(t, r);
  } catch (r) {
    console.warn("Failed to record token metric:", r);
  }
};
var tr = (s10, e, t, n, o) => {
  t && s10.streamingRequestsCounter && s10.streamingRequestsCounter.add(1, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var nr = (s10, e, t, n, o) => {
  let r = { function_name: e, ...n ? { ai_service: n } : {}, ...o ? { model: o } : {} };
  s10.functionCallsCounter && s10.functionCallsCounter.add(1, r), t && s10.functionCallLatencyHistogram && s10.functionCallLatencyHistogram.record(t, r);
};
var Wt = (s10, e, t, n, o) => {
  s10.requestSizeHistogram && s10.requestSizeHistogram.record(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var Jt = (s10, e, t, n, o) => {
  s10.responseSizeHistogram && s10.responseSizeHistogram.record(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var or = (s10, e, t, n, o) => {
  let r = { ...n ? { ai_service: n } : {}, ...o ? { model: o } : {} };
  e !== void 0 && s10.temperatureGauge && s10.temperatureGauge.record(e, r), t !== void 0 && s10.maxTokensGauge && s10.maxTokensGauge.record(t, r);
};
var Qt = (s10, e, t, n, o) => {
  s10.estimatedCostCounter && s10.estimatedCostCounter.add(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var rr = (s10, e, t, n) => {
  s10.promptLengthHistogram && s10.promptLengthHistogram.record(e, { ai_service: t, ...n ? { model: n } : {} });
};
var sr = (s10, e, t, n) => {
  s10.contextWindowUsageGauge && s10.contextWindowUsageGauge.record(e, { ai_service: t, ...n ? { model: n } : {} });
};
var ir = (s10, e, t, n) => {
  s10.timeoutsCounter && s10.timeoutsCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var ar = (s10, e, t, n) => {
  s10.abortsCounter && s10.abortsCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var lr = (s10, e, t, n) => {
  s10.thinkingBudgetUsageCounter && s10.thinkingBudgetUsageCounter.add(e, { ai_service: t, ...n ? { model: n } : {} });
};
var pr = (s10, e, t, n, o) => {
  (e || t) && s10.multimodalRequestsCounter && s10.multimodalRequestsCounter.add(1, { ai_service: n, has_images: e.toString(), has_audio: t.toString(), ...o ? { model: o } : {} });
};
var w = () => structuredClone({ temperature: 0, topK: 40, topP: 0.9 });
var _ = () => structuredClone({ temperature: 0.4, topP: 0.7, frequencyPenalty: 0.2 });
var E = class {
  constructor(e, { name: t, apiURL: n, headers: o, modelInfo: r, defaults: i, options: a = {}, supportFor: l, models: p }) {
    this.aiImpl = e;
    this.name = t, this.apiURL = n || "", this.headers = o, this.supportFor = l, this.tracer = a.tracer ?? M.tracer, this.meter = a.meter ?? M.meter, this.modelInfo = r, this.models = p, this.id = U();
    let c = this.getModel(i.model) ?? i.model, u = this.getEmbedModel(i.embedModel) ?? i.embedModel;
    if (this.defaults = { model: c, embedModel: u }, !i.model || typeof i.model != "string" || i.model === "") throw new Error("No model defined");
    this.setOptions(a), p && Os(p);
  }
  debug = false;
  rt;
  fetch;
  tracer;
  meter;
  timeout;
  excludeContentFromTrace;
  models;
  abortSignal;
  logger = M.logger ?? _o;
  corsProxy;
  modelInfo;
  modelUsage;
  embedModelUsage;
  defaults;
  lastUsedModelConfig;
  lastUsedChatModel;
  lastUsedEmbedModel;
  apiURL;
  name;
  id;
  headers;
  supportFor;
  metrics = { latency: { chat: { mean: 0, p95: 0, p99: 0, samples: [] }, embed: { mean: 0, p95: 0, p99: 0, samples: [] } }, errors: { chat: { count: 0, rate: 0, total: 0 }, embed: { count: 0, rate: 0, total: 0 } } };
  getMetricsInstruments() {
    return Jo(this.meter);
  }
  setName(e) {
    this.name = e;
  }
  getId() {
    return this.id;
  }
  setAPIURL(e) {
    this.apiURL = e;
  }
  setHeaders(e) {
    this.headers = e;
  }
  setOptions(e) {
    this.debug = e.debug ?? false, this.rt = e.rateLimiter, this.fetch = e.fetch, this.timeout = e.timeout, this.tracer = e.tracer ?? M.tracer, this.meter = e.meter ?? M.meter, this.excludeContentFromTrace = e.excludeContentFromTrace, this.abortSignal = e.abortSignal, this.logger = e.logger ?? M.logger ?? this.logger, this.corsProxy = e.corsProxy;
  }
  getOptions() {
    return { debug: this.debug, rateLimiter: this.rt, fetch: this.fetch, tracer: this.tracer, meter: this.meter, timeout: this.timeout, excludeContentFromTrace: this.excludeContentFromTrace, abortSignal: this.abortSignal, logger: this.logger, corsProxy: this.corsProxy };
  }
  getLogger() {
    return this.logger;
  }
  getModelList() {
    let e = [];
    for (let t of this.models ?? []) t.isInternal || ("model" in t && t.model && e.push({ key: t.key, description: t.description, model: t.model }), "embedModel" in t && t.embedModel && e.push({ key: t.key, description: t.description, embedModel: t.embedModel }));
    return e;
  }
  getName() {
    return this.name;
  }
  getFeatures(e) {
    return typeof this.supportFor == "function" ? this.supportFor(e ?? this.defaults.model) : this.supportFor;
  }
  getLastUsedChatModel() {
    return this.lastUsedChatModel;
  }
  getLastUsedEmbedModel() {
    return this.lastUsedEmbedModel;
  }
  getLastUsedModelConfig() {
    return this.lastUsedModelConfig;
  }
  calculatePercentile(e, t) {
    if (e.length === 0) return 0;
    let n = [...e].sort((r, i) => r - i), o = Math.ceil(t / 100 * n.length) - 1;
    return n[o] ?? 0;
  }
  updateLatencyMetrics(e, t) {
    let n = this.metrics.latency[e];
    n.samples.push(t), n.samples.length > 1e3 && n.samples.shift(), n.mean = n.samples.reduce((r, i) => r + i, 0) / n.samples.length, n.p95 = this.calculatePercentile(n.samples, 95), n.p99 = this.calculatePercentile(n.samples, 99);
    let o = this.getMetricsInstruments();
    if (o) {
      let r = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      Qo(o, e, t, this.name, r), Yo(o, e, n.mean, n.p95, n.p99, this.name, r);
    }
  }
  updateErrorMetrics(e, t) {
    let n = this.metrics.errors[e];
    n.total++, t && n.count++, n.rate = n.count / n.total;
    let o = this.getMetricsInstruments();
    if (o) {
      let r = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      er(o, e, this.name, r), t && Xo(o, e, this.name, r), Zo(o, e, n.rate, this.name, r);
    }
  }
  recordTokenUsage(e) {
    let t = this.getMetricsInstruments();
    if (t && e?.tokens) {
      let { promptTokens: n, completionTokens: o, totalTokens: r, thoughtsTokens: i } = e.tokens;
      n && Ie(t, "input", n, this.name, e.model), o && Ie(t, "output", o, this.name, e.model), r && Ie(t, "total", r, this.name, e.model), i && Ie(t, "thoughts", i, this.name, e.model);
    }
  }
  calculateRequestSize(e) {
    try {
      return new TextEncoder().encode(JSON.stringify(e)).length;
    } catch {
      return 0;
    }
  }
  calculateResponseSize(e) {
    try {
      return new TextEncoder().encode(JSON.stringify(e)).length;
    } catch {
      return 0;
    }
  }
  detectMultimodalContent(e) {
    let t = false, n = false;
    if (e.chatPrompt && Array.isArray(e.chatPrompt)) {
      for (let o of e.chatPrompt) if (o.role === "user" && Array.isArray(o.content)) for (let r of o.content) r.type === "image" ? t = true : r.type === "audio" && (n = true);
    }
    return { hasImages: t, hasAudio: n };
  }
  calculatePromptLength(e) {
    let t = 0;
    if (e.chatPrompt && Array.isArray(e.chatPrompt)) for (let n of e.chatPrompt) if (n.role === "system" || n.role === "assistant") n.content && (t += n.content.length);
    else if (n.role === "user") {
      if (typeof n.content == "string") t += n.content.length;
      else if (Array.isArray(n.content)) for (let o of n.content) o.type === "text" && (t += o.text.length);
    } else n.role === "function" && n.result && (t += n.result.length);
    return t;
  }
  calculateContextWindowUsage(e, t) {
    if (!t?.tokens?.promptTokens) return 0;
    let n = this.modelInfo.find((o) => o.name === e);
    return n?.contextWindow ? t.tokens.promptTokens / n.contextWindow : 0;
  }
  estimateCost(e, t) {
    if (!t?.tokens) return 0;
    let n = this.modelInfo.find((l) => l.name === e);
    if (!n || !n.promptTokenCostPer1M && !n.completionTokenCostPer1M) return 0;
    let { promptTokens: o = 0, completionTokens: r = 0 } = t.tokens, i = n.promptTokenCostPer1M || 0, a = n.completionTokenCostPer1M || 0;
    return o * i / 1e6 + r * a / 1e6;
  }
  estimateCostByName(e, t) {
    if (!t?.tokens) return 0;
    let n = this.modelInfo.find((l) => l.name === e);
    if (!n || !n.promptTokenCostPer1M && !n.completionTokenCostPer1M) return 0;
    let { promptTokens: o = 0, completionTokens: r = 0 } = t.tokens, i = n.promptTokenCostPer1M || 0, a = n.completionTokenCostPer1M || 0;
    return o * i / 1e6 + r * a / 1e6;
  }
  recordFunctionCallMetrics(e, t) {
    let n = this.getMetricsInstruments();
    if (!(!n || !e)) for (let o of e) o && typeof o == "object" && "function" in o && o.function && typeof o.function == "object" && "name" in o.function && nr(n, o.function.name, void 0, this.name, t);
  }
  recordTimeoutMetric(e) {
    let t = this.getMetricsInstruments();
    if (t) {
      let n = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      ir(t, e, this.name, n);
    }
  }
  recordAbortMetric(e) {
    let t = this.getMetricsInstruments();
    if (t) {
      let n = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      ar(t, e, this.name, n);
    }
  }
  recordChatMetrics(e, t, n) {
    let o = this.getMetricsInstruments();
    if (!o) return;
    let r = this.lastUsedChatModel, i = this.lastUsedModelConfig, a = i?.stream ?? false;
    tr(o, "chat", a, this.name, r);
    let { hasImages: l, hasAudio: p } = this.detectMultimodalContent(e);
    pr(o, l, p, this.name, r);
    let c = this.calculatePromptLength(e);
    rr(o, c, this.name, r), or(o, i?.temperature, i?.maxTokens, this.name, r), t?.thinkingTokenBudget && this.modelUsage?.tokens?.thoughtsTokens && lr(o, this.modelUsage.tokens.thoughtsTokens, this.name, r);
    let u = this.calculateRequestSize(e);
    if (Wt(o, "chat", u, this.name, r), n && !a) {
      let d = n, m = this.calculateResponseSize(d);
      if (Jt(o, "chat", m, this.name, r), d.results) for (let f of d.results) f.functionCalls && this.recordFunctionCallMetrics(f.functionCalls, this.lastUsedChatModel);
      let g = this.calculateContextWindowUsage(this.lastUsedChatModel, d.modelUsage);
      g > 0 && sr(o, g, this.name, r);
      let h = this.estimateCost(this.lastUsedChatModel, d.modelUsage);
      h > 0 && Qt(o, "chat", h, this.name, r);
    }
  }
  recordEmbedMetrics(e, t) {
    let n = this.getMetricsInstruments();
    if (!n) return;
    let o = this.lastUsedEmbedModel, r = this.calculateRequestSize(e);
    Wt(n, "embed", r, this.name, o);
    let i = this.calculateResponseSize(t);
    Jt(n, "embed", i, this.name, o);
    let a = this.estimateCostByName(o, t.modelUsage);
    a > 0 && Qt(n, "embed", a, this.name, o);
  }
  getMetrics() {
    return structuredClone(this.metrics);
  }
  async chat(e, t) {
    let n = performance.now(), o = false, r;
    try {
      return r = await this._chat1(e, t), r;
    } catch (i) {
      throw o = true, i instanceof Error && (i.message.includes("timeout") || i.name === "TimeoutError" ? this.recordTimeoutMetric("chat") : (i.message.includes("abort") || i.name === "AbortError") && this.recordAbortMetric("chat")), i;
    } finally {
      let i = performance.now() - n;
      this.updateLatencyMetrics("chat", i), this.updateErrorMetrics("chat", o), o || this.recordChatMetrics(e, t, r);
    }
  }
  async _chat1(e, t) {
    let n = this.getModel(e.model) ?? e.model ?? this.defaults.model;
    e.chatPrompt && Array.isArray(e.chatPrompt) && Yt(e.chatPrompt);
    let o = { ...this.aiImpl.getModelConfig(), ...e.modelConfig };
    if (t?.thinkingTokenBudget && !this.getFeatures(n).hasThinkingBudget) throw new Error(`Model ${n} does not support thinkingTokenBudget.`);
    if (t?.showThoughts && !this.getFeatures(n).hasShowThoughts) throw new Error(`Model ${n} does not support showThoughts.`);
    if (this.modelInfo.find((a) => a.name === n)?.isExpensive && t?.useExpensiveModel !== "yes") throw new Error(`Model ${n} is marked as expensive and requires explicit confirmation. Set useExpensiveModel: "yes" to proceed.`);
    return o.stream = (t?.stream !== void 0 ? t.stream : o.stream) ?? true, this.getFeatures(n).streaming || (o.stream = false), this.tracer ? await this.tracer.startActiveSpan("AI Chat Request", { kind: SpanKind.SERVER, attributes: { [T.LLM_SYSTEM]: this.name, [T.LLM_OPERATION_NAME]: "chat", [T.LLM_REQUEST_MODEL]: n, [T.LLM_REQUEST_MAX_TOKENS]: o.maxTokens ?? "Not set", [T.LLM_REQUEST_TEMPERATURE]: o.temperature, [T.LLM_REQUEST_TOP_P]: o.topP ?? "Not set", [T.LLM_REQUEST_TOP_K]: o.topK ?? "Not set", [T.LLM_REQUEST_FREQUENCY_PENALTY]: o.frequencyPenalty ?? "Not set", [T.LLM_REQUEST_PRESENCE_PENALTY]: o.presencePenalty ?? "Not set", [T.LLM_REQUEST_STOP_SEQUENCES]: o.stopSequences?.join(", ") ?? "Not set", [T.LLM_REQUEST_LLM_IS_STREAMING]: o.stream ?? "Not set" } }, t?.traceContext ?? context.active(), async (a) => await this._chat2(n, o, e, t, a)) : await this._chat2(n, o, e, t);
  }
  cleanupFunctionSchema(e) {
    let t = { ...e };
    if (t.parameters) {
      let n = { ...t.parameters };
      Array.isArray(n.required) && n.required.length === 0 && delete n.required, n.properties && Object.keys(n.properties).length === 0 && delete n.properties, Object.keys(n).length === 0 || Object.keys(n).length === 1 && n.type === "object" ? delete t.parameters : t.parameters = n;
    }
    return t;
  }
  async _chat2(e, t, n, o, r) {
    if (!this.aiImpl.createChatReq) throw new Error("generateChatReq not implemented");
    let i = o?.debug ?? this.debug, a;
    n.functions && n.functions.length > 0 && (a = n.functions.map((m) => this.cleanupFunctionSchema(m)));
    let l = { ...n, model: e, functions: a, modelConfig: t };
    this.lastUsedChatModel = e, this.lastUsedModelConfig = t;
    let p = async () => {
      let [m, g] = await this.aiImpl.createChatReq(l, o);
      return r?.isRecording() && vs(n, r, this.excludeContentFromTrace), await B({ name: m.name, url: this.apiURL, localCall: m.localCall, headers: await this.buildHeaders(m.headers), stream: t.stream, timeout: this.timeout, debug: i, fetch: this.fetch, span: r, abortSignal: o?.abortSignal ?? this.abortSignal, corsProxy: this.corsProxy }, g);
    };
    i && Go(l.chatPrompt, o?.stepIndex ?? 0, o?.logger ?? this.logger, o?.debugHideSystemPrompt);
    let c = o?.rateLimiter ?? this.rt, u = c ? await c(p, { modelUsage: this.modelUsage }) : await p();
    if (t.stream) {
      if (!this.aiImpl.createChatStreamResp) throw new Error("generateChatStreamResp not implemented");
      let m = this.aiImpl.createChatStreamResp.bind(this), g = (x) => (y) => {
        let v = m(y, x);
        if (v.sessionId = o?.sessionId, !v.modelUsage) {
          let I = this.aiImpl.getTokenUsage();
          I && (v.modelUsage = { ai: this.name, model: e, tokens: I });
        }
        if (this.modelUsage = v.modelUsage, this.recordTokenUsage(v.modelUsage), r?.isRecording() && dr(v, r, this.excludeContentFromTrace), i) for (let I of v.results) $o(I, I.index, o?.logger ?? this.logger);
        return v;
      }, h = async (x) => {
        r?.isRecording() && r.end(), i && Uo(x, o?.logger ?? this.logger);
      };
      if (typeof window < "u") {
        let x = u, y = {}, v = [];
        return new ReadableStream({ start(I) {
          let C = x.getReader();
          async function k() {
            try {
              for (; ; ) {
                let { done: S, value: z } = await C.read();
                if (S) {
                  h && await h(v), I.close();
                  break;
                }
                let j = g(y)(z);
                j && (v.push(j), I.enqueue(j));
              }
            } catch (S) {
              I.error(S);
            } finally {
              C.releaseLock();
            }
          }
          k();
        } });
      }
      return u.pipeThrough(new st(g({}), h));
    }
    if (!this.aiImpl.createChatResp) throw new Error("generateChatResp not implemented");
    let d = this.aiImpl.createChatResp(u);
    if (d.sessionId = o?.sessionId, !d.modelUsage) {
      let m = this.aiImpl.getTokenUsage();
      m && (d.modelUsage = { ai: this.name, model: e, tokens: m });
    }
    return d.modelUsage && (this.modelUsage = d.modelUsage, this.recordTokenUsage(d.modelUsage)), r?.isRecording() && (dr(d, r, this.excludeContentFromTrace), r.end()), i && No(d, o?.logger ?? this.logger), d;
  }
  async embed(e, t) {
    let n = performance.now(), o = false, r;
    try {
      return r = await this._embed1(e, t), r;
    } catch (i) {
      throw o = true, i instanceof Error && (i.message.includes("timeout") || i.name === "TimeoutError" ? this.recordTimeoutMetric("embed") : (i.message.includes("abort") || i.name === "AbortError") && this.recordAbortMetric("embed")), i;
    } finally {
      let i = performance.now() - n;
      this.updateLatencyMetrics("embed", i), this.updateErrorMetrics("embed", o), !o && r && this.recordEmbedMetrics(e, r);
    }
  }
  async _embed1(e, t) {
    let n = this.getEmbedModel(e.embedModel) ?? e.embedModel ?? this.defaults.embedModel;
    if (!n) throw new Error("No embed model defined");
    return this.tracer && await this.tracer?.startActiveSpan("AI Embed Request", { kind: SpanKind.SERVER, attributes: { [T.LLM_SYSTEM]: this.name, [T.LLM_OPERATION_NAME]: "embeddings", [T.LLM_REQUEST_MODEL]: n } }, t?.traceContext ?? context.active(), async (o) => {
      try {
        return await this._embed2(n, e, t, o);
      } finally {
        o.end();
      }
    }), this._embed2(n, e, t);
  }
  async _embed2(e, t, n, o) {
    if (!this.aiImpl.createEmbedReq) throw new Error("generateEmbedReq not implemented");
    if (!this.aiImpl.createEmbedResp) throw new Error("generateEmbedResp not implemented");
    let r = this.aiImpl.createEmbedReq, i = n?.debug ?? this.debug, a = { ...t, embedModel: e };
    this.lastUsedEmbedModel = e, i && Ko(a.texts ?? [], e, n?.logger ?? this.logger);
    let l = async () => {
      let [u, d] = await r(a);
      return await B({ name: u.name, url: this.apiURL, localCall: u.localCall, headers: await this.buildHeaders(u.headers), debug: i, fetch: this.fetch, timeout: this.timeout, span: o, abortSignal: n?.abortSignal ?? this.abortSignal, corsProxy: this.corsProxy }, d);
    }, p = this.rt ? await this.rt(l, { modelUsage: this.embedModelUsage }) : await l(), c = this.aiImpl.createEmbedResp?.(p);
    if (c.sessionId = n?.sessionId, !c.modelUsage) {
      let u = this.aiImpl.getTokenUsage();
      u && (c.modelUsage = { ai: this.name, model: e, tokens: u });
    }
    return this.embedModelUsage = c.modelUsage, this.recordTokenUsage(c.modelUsage), o?.isRecording() && c.modelUsage?.tokens && o.addEvent(Z.GEN_AI_USAGE, { [T.LLM_USAGE_INPUT_TOKENS]: c.modelUsage.tokens.promptTokens, [T.LLM_USAGE_OUTPUT_TOKENS]: c.modelUsage.tokens.completionTokens ?? 0, [T.LLM_USAGE_TOTAL_TOKENS]: c.modelUsage.tokens.totalTokens }), i && Vo(c.embeddings, n?.logger ?? this.logger), o?.end(), c;
  }
  async buildHeaders(e = {}) {
    return { ...e, ...await this.headers() };
  }
  getModelByKey(e) {
    return e ? this.models?.find((n) => n.key === e) : void 0;
  }
  getModel(e) {
    let t = this.getModelByKey(e);
    return t && "model" in t ? t.model : void 0;
  }
  getEmbedModel(e) {
    let t = this.getModelByKey(e);
    return t && "embedModel" in t ? t.embedModel : void 0;
  }
};
function vs(s10, e, t) {
  let n = [];
  if (s10.chatPrompt && Array.isArray(s10.chatPrompt) && s10.chatPrompt.length > 0) for (let r of s10.chatPrompt) switch (r.role) {
    case "system":
      if (r.content) {
        let i = {};
        t || (i.content = r.content), e.addEvent(Z.GEN_AI_SYSTEM_MESSAGE, i);
      }
      break;
    case "user":
      if (typeof r.content == "string") n.push(r.content);
      else if (Array.isArray(r.content)) for (let i of r.content) i.type === "text" && n.push(i.text);
      break;
    case "assistant": {
      let i = r.functionCalls?.map((a) => ({ id: a.id, type: a.type, function: a.function.name, arguments: a.function.params }));
      if (i && i.length > 0) {
        let a = { function_calls: JSON.stringify(i, null, 2) };
        !t && r.content && (a.content = r.content), e.addEvent(Z.GEN_AI_ASSISTANT_MESSAGE, a);
      } else if (r.content) {
        let a = {};
        t || (a.content = r.content), e.addEvent(Z.GEN_AI_ASSISTANT_MESSAGE, a);
      }
      break;
    }
    case "function": {
      let i = { id: r.functionId };
      t || (i.content = r.result), e.addEvent(Z.GEN_AI_TOOL_MESSAGE, i);
      break;
    }
  }
  let o = {};
  t || (o.content = n.join(`
`)), e.addEvent(Z.GEN_AI_USER_MESSAGE, o);
}
function dr(s10, e, t) {
  if (s10.modelUsage?.tokens) {
    let n = s10.modelUsage.tokens.thoughtsTokens ? { [T.LLM_USAGE_THOUGHTS_TOKENS]: s10.modelUsage.tokens.thoughtsTokens } : {};
    e.addEvent(Z.GEN_AI_USAGE, { [T.LLM_USAGE_INPUT_TOKENS]: s10.modelUsage.tokens.promptTokens, [T.LLM_USAGE_OUTPUT_TOKENS]: s10.modelUsage.tokens.completionTokens ?? 0, [T.LLM_USAGE_TOTAL_TOKENS]: s10.modelUsage.tokens.totalTokens, ...n });
  }
  if (s10.results) for (let n = 0; n < s10.results.length; n++) {
    let o = s10.results[n];
    if (!o || !o.content && !o.thought && !o.functionCalls?.length && !o.finishReason) continue;
    let r = o.functionCalls?.map((a) => ({ id: a.id, type: a.type, function: a.function.name, arguments: a.function.params })), i = {};
    r && r.length > 0 ? (t || (i.content = o.content), i.tool_calls = r) : t || (i.content = o.content ?? ""), e.addEvent(Z.GEN_AI_CHOICE, { finish_reason: o.finishReason, index: n, message: JSON.stringify(i, null, 2) });
  }
}
function Yt(s10) {
  for (let e = 0; e < s10.length; e++) {
    let t = s10[e];
    if (!t || typeof t != "object") throw new Error(`AxMessage array validation failed: Item at index ${e} is not a valid message object`);
    if ("content" in t && typeof t.content == "string" && t.content.trim() === "") throw new Error(`AxMessage array validation failed: Item at index ${e} has empty content`);
  }
}
function Os(s10) {
  let e = /* @__PURE__ */ new Set();
  for (let t of s10) {
    if (e.has(t.key)) throw new Error(`Duplicate model key detected: "${t.key}". Each model key must be unique.`);
    e.add(t.key);
  }
}
var lt = ((c) => (c.Claude4Opus = "claude-opus-4-20250514", c.Claude4Sonnet = "claude-sonnet-4-20250514", c.Claude37Sonnet = "claude-3-7-sonnet-latest", c.Claude35Sonnet = "claude-3-5-sonnet-latest", c.Claude35Haiku = "claude-3-5-haiku-latest", c.Claude3Opus = "claude-3-opus-latest", c.Claude3Sonnet = "claude-3-sonnet-20240229", c.Claude3Haiku = "claude-3-haiku-20240307", c.Claude21 = "claude-2.1", c.ClaudeInstant12 = "claude-instant-1.2", c))(lt || {});
var Xt = ((i) => (i.Claude37Sonnet = "claude-3-7-sonnet", i.Claude35Haiku = "claude-3-5-haiku", i.Claude35Sonnet = "claude-3-5-sonnet", i.Claude35SonnetV2 = "claude-3-5-sonnet-v2", i.Claude3Haiku = "claude-3-haiku", i.Claude3Opus = "claude-3-opus", i))(Xt || {});
var pt = [{ name: "claude-opus-4-20250514", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 32e3, hasThinkingBudget: true, hasShowThoughts: true }, { name: "claude-sonnet-4-20250514", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 64e3, hasThinkingBudget: true, hasShowThoughts: true }, { name: "claude-3-7-sonnet-latest", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 64e3, hasThinkingBudget: true, hasShowThoughts: true }, { name: "claude-3-5-sonnet-latest", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 8192 }, { name: "claude-3-5-haiku-latest", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 4, maxTokens: 8192 }, { name: "claude-3-opus-latest", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 4096 }, { name: "claude-3-sonnet-20240229", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 4096 }, { name: "claude-3-haiku-20240307", currency: "usd", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 1.25, maxTokens: 4096 }, { name: "claude-2.1", currency: "usd", promptTokenCostPer1M: 8, completionTokenCostPer1M: 25, maxTokens: 4096 }, { name: "claude-instant-1.2", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 2.24, maxTokens: 4096 }];
var Zt = (s10) => {
  if (!s10 || typeof s10 != "object") return s10;
  let e = { ...s10 };
  return delete e.additionalProperties, delete e.default, delete e.optional, delete e.oneOf, delete e.anyOf, delete e.allOf, e.properties && typeof e.properties == "object" && (e.properties = Object.fromEntries(Object.entries(e.properties).map(([t, n]) => [t, Zt(n)]))), e.items && (e.items = Zt(e.items)), e;
};
var gr = () => structuredClone({ model: "claude-3-7-sonnet-latest", maxTokens: 4e4, thinkingTokenBudgetLevels: { minimal: 1024, low: 5e3, medium: 1e4, high: 2e4, highest: 32e3 }, ...w() });
var Ms = () => structuredClone({ model: "claude-3-7-sonnet", maxTokens: 4e4, thinkingTokenBudgetLevels: { minimal: 1024, low: 5e3, medium: 1e4, high: 2e4, highest: 32e3 }, ...w() });
var en = class {
  constructor(e, t) {
    this.config = e;
    this.isVertex = t;
  }
  tokensUsed;
  currentPromptConfig;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens ?? 4096, temperature: e.temperature, topP: e.topP, topK: e.topK, stream: e.stream, stopSequences: e.stopSequences, endSequences: e.endSequences, presencePenalty: e.presencePenalty, frequencyPenalty: e.frequencyPenalty, n: e.n };
  }
  createChatReq = async (e, t) => {
    this.currentPromptConfig = t;
    let n = e.model, o = e.modelConfig?.stream ?? this.config.stream, r;
    this.isVertex ? r = { name: o ? `/models/${n}:streamRawPredict?alt=sse` : `/models/${n}:rawPredict` } : r = { name: "/messages" };
    let i;
    if (e.functionCall && e.functions && e.functions.length > 0) if (typeof e.functionCall == "string") switch (e.functionCall) {
      case "auto":
        i = { tool_choice: { type: "auto" } };
        break;
      case "required":
        i = { tool_choice: { type: "any" } };
        break;
      case "none":
        throw new Error("functionCall none not supported");
    }
    else if ("function" in e.functionCall) i = { tool_choice: { type: "tool", name: e.functionCall.function.name } };
    else throw new Error("Invalid function call type, must be string or object");
    let a = e.chatPrompt.filter((y) => y.role === "system").map((y) => ({ type: "text", text: y.content, ...y.cache ? { cache: { type: "ephemeral" } } : {} })), l = e.chatPrompt.filter((y) => y.role !== "system"), p = ks(l), c = e.functions?.map((y) => ({ name: y.name, description: y.description, input_schema: y.parameters ? Zt(y.parameters) : void 0 })), u = e.modelConfig?.maxTokens ?? this.config.maxTokens, d = e.modelConfig?.stopSequences ?? this.config.stopSequences, m = e.modelConfig?.temperature ?? this.config.temperature, g = e.modelConfig?.topP ?? this.config.topP, h = e.modelConfig?.topK ?? this.config.topK, f = e.modelConfig?.n ?? this.config.n;
    if (f && f > 1) throw new Error("Anthropic does not support sampling (n > 1)");
    let A;
    if (this.config.thinking?.budget_tokens && (A = this.config.thinking), t?.thinkingTokenBudget) {
      let y = this.config.thinkingTokenBudgetLevels;
      switch (t.thinkingTokenBudget) {
        case "none":
          A = void 0;
          break;
        case "minimal":
          A = { type: "enabled", budget_tokens: y?.minimal ?? 1024 };
          break;
        case "low":
          A = { type: "enabled", budget_tokens: y?.low ?? 5e3 };
          break;
        case "medium":
          A = { type: "enabled", budget_tokens: y?.medium ?? 1e4 };
          break;
        case "high":
          A = { type: "enabled", budget_tokens: y?.high ?? 2e4 };
          break;
        case "highest":
          A = { type: "enabled", budget_tokens: y?.highest ?? 32e3 };
          break;
      }
    }
    let x = { ...this.isVertex ? { anthropic_version: "vertex-2023-10-16" } : { model: n }, ...u ? { max_tokens: u } : {}, ...d && d.length > 0 ? { stop_sequences: d } : {}, ...m && !A ? { temperature: m } : {}, ...g && (!A || g >= 0.95) ? { top_p: g } : {}, ...h && !A ? { top_k: h } : {}, ...i, ...c && c.length > 0 ? { tools: c } : {}, ...o ? { stream: true } : {}, ...a ? { system: a } : {}, ...A ? { thinking: A } : {}, messages: p };
    return [r, x];
  };
  createChatResp = (e) => {
    if (e.type === "error") throw new O(e.error.message, void 0, void 0);
    let t = mr(e.stop_reason), n = this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false, o = e.content.map((r, i) => r.type === "tool_use" ? { index: i, id: r.id, functionCalls: [{ id: r.id, type: "function", function: { name: r.name, params: r.input } }], finishReason: t } : (r.type === "thinking" || r.type === "redacted_thinking") && n ? { index: i, thought: r.thinking, id: e.id, finishReason: t } : { index: i, content: r.type === "text" ? r.text : "", id: e.id, finishReason: t }).filter((r) => r.content !== "" || r.thought !== void 0 || r.functionCalls !== void 0);
    return this.tokensUsed = { promptTokens: e.usage.input_tokens, completionTokens: e.usage.output_tokens, totalTokens: e.usage.input_tokens + e.usage.output_tokens }, { results: o, remoteId: e.id };
  };
  createChatStreamResp = (e, t) => {
    if (!("type" in e)) throw new Error("Invalid Anthropic streaming event");
    let n = t;
    if (n.indexIdMap || (n.indexIdMap = {}), e.type === "error") {
      let { error: r } = e;
      throw new O(r.message, void 0, void 0);
    }
    let o = 0;
    if (e.type === "message_start") {
      let { message: r } = e, i = [{ index: o, content: "", id: r.id }];
      return this.tokensUsed = { promptTokens: r.usage?.input_tokens ?? 0, completionTokens: r.usage?.output_tokens ?? 0, totalTokens: (r.usage?.input_tokens ?? 0) + (r.usage?.output_tokens ?? 0) }, { results: i };
    }
    if (e.type === "content_block_start") {
      let { content_block: r } = e;
      if (r.type === "text") return { results: [{ index: o, content: r.text }] };
      if (r.type === "thinking") return this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false ? { results: [{ index: o, thought: r.thinking }] } : { results: [{ index: o, content: "" }] };
      if (r.type === "tool_use" && typeof r.id == "string" && typeof e.index == "number" && !n.indexIdMap[e.index]) {
        n.indexIdMap[e.index] = r.id;
        let i = [{ id: r.id, type: "function", function: { name: r.name, params: "" } }];
        return { results: [{ index: o, functionCalls: i }] };
      }
    }
    if (e.type === "content_block_delta") {
      let { delta: r } = e;
      if (r.type === "text_delta") return { results: [{ index: o, content: r.text }] };
      if (r.type === "thinking_delta") return this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false ? { results: [{ index: o, thought: r.thinking }] } : { results: [{ index: o, content: "" }] };
      if (r.type === "signature_delta") return { results: [{ index: o, content: "" }] };
      if (r.type === "input_json_delta") {
        let i = n.indexIdMap[e.index];
        if (!i) throw new Error(`invalid streaming index no id found: ${e.index}`);
        let a = [{ id: i, type: "function", function: { name: "", params: r.partial_json } }];
        return { results: [{ index: o, functionCalls: a }] };
      }
    }
    if (e.type === "message_delta") {
      let { delta: r, usage: i } = e;
      return this.tokensUsed = { promptTokens: 0, completionTokens: i.output_tokens, totalTokens: i.output_tokens }, { results: [{ index: o, content: "", finishReason: mr(r.stop_reason) }] };
    }
    return { results: [{ index: o, content: "" }] };
  };
};
var be = class s extends E {
  static create(e) {
    return new s(e);
  }
  constructor({ apiKey: e, projectId: t, region: n, config: o, options: r, models: i }) {
    let a = t !== void 0 && n !== void 0, l, p;
    if (a) {
      if (!e) throw new Error("Anthropic Vertex API key not set");
      if (typeof e != "function") throw new Error("Anthropic Vertex API key must be a function for token-based authentication");
      l = `https://${n}-aiplatform.googleapis.com/v1/projects/${t}/locations/${n}/publishers/anthropic/`, p = async () => ({ Authorization: `Bearer ${await e()}` });
    } else {
      if (!e) throw new Error("Anthropic API key not set");
      l = "https://api.anthropic.com/v1", p = async () => ({ "anthropic-version": "2023-06-01", "anthropic-beta": "prompt-caching-2024-07-31", "x-api-key": typeof e == "function" ? await e() : e });
    }
    let c = { ...gr(), ...o }, u = new en(c, a), d = (m) => {
      let g = K({ model: m, modelInfo: pt, models: i });
      return { functions: true, streaming: true, hasThinkingBudget: g?.hasThinkingBudget ?? false, hasShowThoughts: g?.hasShowThoughts ?? false, functionCot: true, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 5 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: false, formats: [], maxDuration: 0 }, files: { supported: false, formats: [], maxSize: 0, uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: true, types: ["ephemeral"] }, thinking: g?.hasThinkingBudget ?? false, multiTurn: true };
    };
    super(u, { name: "Anthropic", apiURL: l, headers: p, modelInfo: pt, defaults: { model: c.model }, options: r, supportFor: d, models: i });
  }
};
function ks(s10) {
  let e = s10.map((t) => {
    switch (t.role) {
      case "function":
        return { role: "user", content: [{ type: "tool_result", content: t.result, tool_use_id: t.functionId, ...t.isError ? { is_error: true } : {}, ...t.cache ? { cache: { type: "ephemeral" } } : {} }] };
      case "user":
        return typeof t.content == "string" ? { role: "user", content: t.content } : { role: "user", content: t.content.map((o) => {
          switch (o.type) {
            case "text":
              return { type: "text", text: o.text, ...o.cache ? { cache: { type: "ephemeral" } } : {} };
            case "image":
              return { type: "image", source: { type: "base64", media_type: o.mimeType, data: o.image }, ...o.cache ? { cache: { type: "ephemeral" } } : {} };
            default:
              throw new Error("Invalid content type");
          }
        }) };
      case "assistant": {
        let n = "";
        return typeof t.content == "string" && (n = t.content), typeof t.functionCalls < "u" && (n = t.functionCalls.map((o) => {
          let r = {};
          return typeof o.function.params == "string" ? r = JSON.parse(o.function.params) : typeof o.function.params == "object" && (r = o.function.params), { type: "tool_use", id: o.id, name: o.function.name, input: r, ...t.cache ? { cache: { type: "ephemeral" } } : {} };
        })), { role: "assistant", content: n };
      }
      default:
        throw new Error("Invalid role");
    }
  });
  return Es(e);
}
function Es(s10) {
  let e = [];
  for (let [t, n] of s10.entries()) {
    if (n.role !== "assistant") {
      e.push(n);
      continue;
    }
    if (t > 0 && s10.at(t - 1)?.role === "assistant") {
      let o = e.pop();
      e.push({ ...o || {}, ...n });
    } else e.push(n);
  }
  return e;
}
function mr(s10) {
  if (s10) switch (s10) {
    case "stop_sequence":
      return "stop";
    case "max_tokens":
      return "length";
    case "tool_use":
      return "function_call";
    case "end_turn":
      return "stop";
    default:
      return "stop";
  }
}
var ct = ((A) => (A.GPT4 = "gpt-4", A.GPT41 = "gpt-4.1", A.GPT41Mini = "gpt-4.1-mini", A.GPT4O = "gpt-4o", A.GPT4OMini = "gpt-4o-mini", A.GPT4ChatGPT4O = "chatgpt-4o-latest", A.GPT4Turbo = "gpt-4-turbo", A.GPT35Turbo = "gpt-3.5-turbo", A.GPT35TurboInstruct = "gpt-3.5-turbo-instruct", A.GPT35TextDavinci002 = "text-davinci-002", A.GPT3TextBabbage002 = "text-babbage-002", A.GPT3TextAda001 = "text-ada-001", A.O1 = "o1", A.O1Mini = "o1-mini", A.O3 = "o3", A.O3Mini = "o3-mini", A.O4Mini = "o4-mini", A))(ct || {});
var Re = ((n) => (n.TextEmbeddingAda002 = "text-embedding-ada-002", n.TextEmbedding3Small = "text-embedding-3-small", n.TextEmbedding3Large = "text-embedding-3-large", n))(Re || {});
var Ce = ((y) => (y.GPT4 = "gpt-4", y.GPT41 = "gpt-4.1", y.GPT41Mini = "gpt-4.1-mini", y.GPT4O = "gpt-4o", y.GPT4OMini = "gpt-4o-mini", y.GPT4ChatGPT4O = "chatgpt-4o-latest", y.GPT4Turbo = "gpt-4-turbo", y.GPT35Turbo = "gpt-3.5-turbo", y.GPT35TurboInstruct = "gpt-3.5-turbo-instruct", y.GPT35TextDavinci002 = "text-davinci-002", y.GPT3TextBabbage002 = "text-babbage-002", y.GPT3TextAda001 = "text-ada-001", y.O1Pro = "o1-pro", y.O1 = "o1", y.O1Mini = "o1-mini", y.O3Pro = "o3-pro", y.O3 = "o3", y.O3Mini = "o3-mini", y.O4Mini = "o4-mini", y))(Ce || {});
var Te = [{ name: "gpt-4", currency: "usd", promptTokenCostPer1M: 30, completionTokenCostPer1M: 60 }, { name: "gpt-4.1", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 8 }, { name: "gpt-4.1-mini", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1.6 }, { name: "gpt-4o", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4o-mini", currency: "usd", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.6 }, { name: "chatgpt-4o-latest", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4-turbo", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30 }, { name: "gpt-3.5-turbo", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "o1", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60 }, { name: "o1-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 14.4 }, { name: "o3", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60 }, { name: "o3-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4 }, { name: "o4-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4 }, { name: "text-embedding-ada-002", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "text-embedding-3-small", currency: "usd", promptTokenCostPer1M: 0.02, completionTokenCostPer1M: 0.02 }, { name: "text-embedding-3-large", currency: "usd", promptTokenCostPer1M: 0.13, completionTokenCostPer1M: 0.13 }];
var tn = [{ name: "gpt-4", currency: "usd", promptTokenCostPer1M: 30, completionTokenCostPer1M: 60 }, { name: "gpt-4.1", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 8 }, { name: "gpt-4.1-mini", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1.6 }, { name: "gpt-4o", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4o-mini", currency: "usd", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.6 }, { name: "chatgpt-4o-latest", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4-turbo", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30 }, { name: "gpt-3.5-turbo", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "o1-pro", currency: "usd", promptTokenCostPer1M: 150, completionTokenCostPer1M: 600, hasThinkingBudget: true, hasShowThoughts: true, isExpensive: true }, { name: "o1", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60, hasThinkingBudget: true, hasShowThoughts: true }, { name: "o3-pro", currency: "usd", promptTokenCostPer1M: 20, completionTokenCostPer1M: 80, hasThinkingBudget: true, hasShowThoughts: true, isExpensive: true }, { name: "o3", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60, hasThinkingBudget: true, hasShowThoughts: true }, { name: "o3-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4, hasThinkingBudget: true, hasShowThoughts: true }, { name: "o4-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4, hasThinkingBudget: true, hasShowThoughts: true }];
var Ps = (s10) => {
  let e = ["o1", "o1-mini", "o3", "o3-mini", "o4-mini", "o1-pro", "o3-pro"];
  return e.includes(s10) || e.includes(s10);
};
var ge = () => structuredClone({ model: "gpt-4.1", embedModel: "text-embedding-3-small", ...w() });
var on = () => structuredClone({ ...ge(), model: "gpt-4.1" });
var rn = () => structuredClone({ model: "gpt-4.1", embedModel: "text-embedding-3-small", ..._() });
var sn = () => ({ ...ge(), model: "gpt-4.1-mini" });
var nn = class {
  constructor(e, t, n) {
    this.config = e;
    this.streamingUsage = t;
    this.chatReqUpdater = n;
  }
  tokensUsed;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, presencePenalty: e.presencePenalty, frequencyPenalty: e.frequencyPenalty, stopSequences: e.stopSequences, endSequences: e.endSequences, topP: e.topP, n: e.n, stream: e.stream };
  }
  createChatReq(e, t) {
    let n = e.model;
    if (!e.chatPrompt || e.chatPrompt.length === 0) throw new Error("Chat prompt is empty");
    let o = { name: "/chat/completions" }, r = e.functions?.map((m) => ({ type: "function", function: { name: m.name, description: m.description, parameters: m.parameters } })), i = !e.functionCall && e.functions && e.functions.length > 0 ? "auto" : e.functionCall, a = Fs(e), l = e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, p = e.modelConfig?.stream ?? this.config.stream, c = this.config.store, u = Ps(n), d = { model: n, messages: a, response_format: this.config?.responseFormat ? { type: this.config.responseFormat } : void 0, tools: r, tool_choice: i, ...u ? {} : { max_completion_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_p: e.modelConfig?.topP ?? this.config.topP ?? 1, n: e.modelConfig?.n ?? this.config.n, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, ...l ? { frequency_penalty: l } : {} }, stop: e.modelConfig?.stopSequences ?? this.config.stop, logit_bias: this.config.logitBias, ...p && this.streamingUsage ? { stream: true, stream_options: { include_usage: true } } : {}, ...c ? { store: c } : {}, ...this.config.serviceTier ? { service_tier: this.config.serviceTier } : {}, ...this.config.user ? { user: this.config.user } : {} };
    if (this.config.reasoningEffort && (d.reasoning_effort = this.config.reasoningEffort), this.config.webSearchOptions && (d.web_search_options = { ...this.config.webSearchOptions.searchContextSize && { search_context_size: this.config.webSearchOptions.searchContextSize }, ...this.config.webSearchOptions.userLocation && { user_location: { approximate: { type: "approximate", ...this.config.webSearchOptions.userLocation.approximate.city && { city: this.config.webSearchOptions.userLocation.approximate.city }, ...this.config.webSearchOptions.userLocation.approximate.country && { country: this.config.webSearchOptions.userLocation.approximate.country }, ...this.config.webSearchOptions.userLocation.approximate.region && { region: this.config.webSearchOptions.userLocation.approximate.region }, ...this.config.webSearchOptions.userLocation.approximate.timezone && { timezone: this.config.webSearchOptions.userLocation.approximate.timezone } } } } }), t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        d.reasoning_effort = void 0;
        break;
      case "minimal":
        d.reasoning_effort = "low";
        break;
      case "low":
        d.reasoning_effort = "medium";
        break;
      case "medium":
        d.reasoning_effort = "high";
        break;
      case "high":
        d.reasoning_effort = "high";
        break;
      case "highest":
        d.reasoning_effort = "high";
        break;
    }
    return this.chatReqUpdater && (d = this.chatReqUpdater(d)), [o, d];
  }
  createEmbedReq(e) {
    let t = e.embedModel;
    if (!t) throw new Error("Embed model not set");
    if (!e.texts || e.texts.length === 0) throw new Error("Embed texts is empty");
    let n = { name: "/embeddings" }, o = { model: t, input: e.texts, dimensions: this.config.dimensions };
    return [n, o];
  }
  createChatResp(e) {
    let { id: t, usage: n, choices: o, error: r } = e;
    if (r) throw r;
    return this.tokensUsed = n ? { promptTokens: n.prompt_tokens, completionTokens: n.completion_tokens, totalTokens: n.total_tokens } : void 0, { results: o.map((a) => {
      if (a.message.refusal) throw new O(a.message.refusal, e.model, e.id);
      let l = hr(a.finish_reason), p = a.message.tool_calls?.map(({ id: c, function: { arguments: u, name: d } }) => ({ id: c, type: "function", function: { name: d, params: u } }));
      return { index: a.index, id: `${a.index}`, content: a.message.content ?? void 0, thought: a.message.reasoning_content, annotations: a.message.annotations, functionCalls: p, finishReason: l };
    }), remoteId: t };
  }
  createChatStreamResp(e, t) {
    let { id: n, usage: o, choices: r } = e;
    this.tokensUsed = o ? { promptTokens: o.prompt_tokens, completionTokens: o.completion_tokens, totalTokens: o.total_tokens } : void 0;
    let i = t;
    return i.indexIdMap || (i.indexIdMap = {}), { results: r.map(({ index: l, delta: { content: p, role: c, refusal: u, tool_calls: d, reasoning_content: m, annotations: g }, finish_reason: h }) => {
      if (u) throw new O(u, void 0, n);
      let f = hr(h), A = d?.map(({ id: x, index: y, function: { name: v, arguments: I } }) => {
        typeof x == "string" && typeof y == "number" && !i.indexIdMap[y] && (i.indexIdMap[y] = x);
        let C = i.indexIdMap[y];
        return C ? { id: C, type: "function", function: { name: v, params: I } } : null;
      }).filter((x) => x !== null);
      return { index: l, content: p ?? void 0, role: c, thought: m, annotations: g, functionCalls: A, finishReason: f, id: n };
    }) };
  }
  createEmbedResp(e) {
    let { data: t, usage: n } = e;
    return this.tokensUsed = n ? { promptTokens: n.prompt_tokens, completionTokens: n.completion_tokens, totalTokens: n.total_tokens } : void 0, { embeddings: t.map((o) => o.embedding) };
  }
};
var hr = (s10) => {
  switch (s10) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "error";
    case "tool_calls":
      return "function_call";
  }
};
function Fs(s10) {
  return s10.chatPrompt.map((t) => {
    switch (t.role) {
      case "system":
        return { role: "system", content: t.content };
      case "user": {
        let n = Array.isArray(t.content) ? t.content.map((o) => {
          switch (o.type) {
            case "text":
              return { type: "text", text: o.text };
            case "image":
              return { type: "image_url", image_url: { url: `data:${o.mimeType};base64,${o.image}`, details: o.details ?? "auto" } };
            case "audio":
              return { type: "input_audio", input_audio: { data: o.data, format: o.format === "wav" ? "wav" : void 0 } };
            default:
              throw new Error("Invalid content type");
          }
        }) : t.content;
        return { role: "user", ...t.name ? { name: t.name } : {}, content: n };
      }
      case "assistant": {
        let n = t.functionCalls?.map((o) => ({ id: o.id, type: "function", function: { name: o.function.name, arguments: typeof o.function.params == "object" ? JSON.stringify(o.function.params) : o.function.params } }));
        if (n && n.length > 0) return { role: "assistant", ...t.content ? { content: t.content } : {}, name: t.name, tool_calls: n };
        if (t.content === void 0) throw new Error("Assistant content is required when no tool calls are provided");
        return { role: "assistant", content: t.content, ...t.name ? { name: t.name } : {} };
      }
      case "function":
        return { role: "tool", content: t.result, tool_call_id: t.functionId };
      default:
        throw new Error("Invalid role");
    }
  });
}
var F = class extends E {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r, models: i, chatReqUpdater: a, supportFor: l }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    let p = new nn(t, n?.streamingUsage ?? true, a);
    super(p, { name: "OpenAI", apiURL: o || "https://api.openai.com/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: r, defaults: { model: t.model, embedModel: t.embedModel }, options: n, supportFor: l, models: i });
  }
};
var we = class extends F {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    r = [...Te, ...r ?? []];
    let i = (a) => {
      let l = K({ model: a, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: l?.hasThinkingBudget ?? false, hasShowThoughts: l?.hasShowThoughts ?? false, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 20 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: true, formats: ["wav", "mp3", "ogg"], maxDuration: 25 * 60 }, files: { supported: true, formats: ["text/plain", "application/pdf", "image/jpeg", "image/png"], maxSize: 512 * 1024 * 1024, uploadMethod: "upload" }, urls: { supported: false, webSearch: true, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: l?.hasThinkingBudget ?? false, multiTurn: true };
    };
    super({ apiKey: e, config: { ...ge(), ...t }, options: n, modelInfo: r, models: o, supportFor: i }), super.setName("OpenAI");
  }
};
var Ar = ge;
var _s = rn;
var Ds = sn;
var Ls = on;
var Se = class extends F {
  constructor({ apiKey: e, resourceName: t, deploymentName: n, version: o = "api-version=2024-02-15-preview", config: r, options: i, models: a, modelInfo: l }) {
    if (!e || e === "") throw new Error("Azure OpenAPI API key not set");
    if (!t || t === "") throw new Error("Azure OpenAPI resource name not set");
    if (!n || n === "") throw new Error("Azure OpenAPI deployment id not set");
    let p = { ...Ar(), ...r };
    l = [...Te, ...l ?? []];
    let c = (d) => {
      let m = K({ model: d, modelInfo: l, models: a });
      return { functions: true, streaming: true, hasThinkingBudget: m?.hasThinkingBudget ?? false, hasShowThoughts: m?.hasShowThoughts ?? false, functionCot: false, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 20 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: false, formats: [], maxDuration: 0 }, files: { supported: false, formats: [], maxSize: 0, uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: m?.hasThinkingBudget ?? false, multiTurn: true };
    };
    super({ apiKey: e, config: p, options: i, models: a, modelInfo: l, supportFor: c });
    let u = t.includes("://") ? t : `https://${t}.openai.azure.com/`;
    super.setName("Azure OpenAI"), super.setAPIURL(new URL(`/openai/deployments/${n}?api-version=${o}`, u).href), super.setHeaders(async () => ({ "api-key": e }));
  }
};
var an = class s2 {
  services;
  currentServiceIndex = 0;
  currentService;
  debug;
  initialBackoffMs;
  maxBackoffMs;
  maxRetries;
  serviceFailures = /* @__PURE__ */ new Map();
  constructor(e, t) {
    if (e.length === 0) throw new Error("No AI services provided.");
    Gs(e), this.services = [...e].sort(t?.comparator ?? s2.metricComparator);
    let n = this.services[this.currentServiceIndex];
    if (n === void 0) throw new Error("Error initializing the AI services.");
    this.currentService = n, this.debug = t?.debug ?? true, this.initialBackoffMs = t?.initialBackoffMs ?? 1e3, this.maxBackoffMs = t?.maxBackoffMs ?? 32e3, this.maxRetries = t?.maxRetries ?? 3;
  }
  static create(e, t) {
    return new s2(e, t);
  }
  getLastUsedChatModel() {
    return this.currentService.getLastUsedChatModel();
  }
  getLastUsedEmbedModel() {
    return this.currentService.getLastUsedEmbedModel();
  }
  getLastUsedModelConfig() {
    return this.currentService.getLastUsedModelConfig();
  }
  static inputOrderComparator = () => 0;
  static metricComparator = (e, t) => {
    let n = e.getMetrics(), o = t.getMetrics();
    return n.latency.chat.mean - o.latency.chat.mean;
  };
  getModelList() {
    return this.currentService.getModelList();
  }
  getNextService() {
    let e = this.services[++this.currentServiceIndex];
    return e === void 0 ? false : (this.currentService = e, true);
  }
  reset() {
    this.currentServiceIndex = 0;
    let e = this.services[this.currentServiceIndex];
    if (e === void 0) throw new Error("No AI services provided.");
    this.currentService = e;
  }
  getName() {
    return this.currentService.getName();
  }
  getId() {
    return this.currentService.getId();
  }
  getFeatures(e) {
    return this.currentService.getFeatures(e);
  }
  getMetrics() {
    return this.currentService.getMetrics();
  }
  canRetryService() {
    let e = this.serviceFailures.get(this.currentService.getId());
    if (!e) return true;
    let { retries: t, lastFailureTime: n } = e, o = Date.now() - n, r = Math.min(this.initialBackoffMs * 2 ** t, this.maxBackoffMs);
    return o >= r;
  }
  handleFailure() {
    let t = (this.serviceFailures.get(this.currentService.getId())?.retries ?? 0) + 1;
    if (this.serviceFailures.set(this.currentService.getId(), { retries: t, lastFailureTime: Date.now() }), this.debug && console.warn(`AxBalancer: Service ${this.currentService.getName()} failed (retry ${t}/${this.maxRetries})`), t >= this.maxRetries) {
      let n = this.getNextService();
      return this.debug && console.warn(`AxBalancer: Switching to service ${this.currentService.getName()}`), n;
    }
    return true;
  }
  handleSuccess() {
    this.serviceFailures.delete(this.currentService.getId());
  }
  async chat(e, t) {
    for (this.reset(); ; ) {
      if (!this.canRetryService()) {
        if (!this.getNextService()) throw new Error("All services exhausted");
        continue;
      }
      try {
        let n = await this.currentService.chat(e, t);
        return this.handleSuccess(), n;
      } catch (n) {
        if (!(n instanceof H)) throw n;
        switch (n.constructor) {
          case re2:
            throw n;
          case de:
            break;
          case ne:
            break;
          case oe:
            break;
          case Y:
            break;
          case me:
            break;
          default:
            throw n;
        }
        if (!this.handleFailure()) throw n;
      }
    }
  }
  async embed(e, t) {
    for (this.reset(); ; ) {
      if (!this.canRetryService()) {
        if (!this.getNextService()) throw new Error("All services exhausted");
        continue;
      }
      try {
        let n = await this.currentService.embed(e, t);
        return this.handleSuccess(), n;
      } catch (n) {
        if (!this.handleFailure()) throw n;
      }
    }
  }
  setOptions(e) {
    this.currentService.setOptions(e);
  }
  getOptions() {
    return this.currentService.getOptions();
  }
  getLogger() {
    return this.currentService.getLogger();
  }
};
function Gs(s10) {
  let e = s10.find((o) => o.getModelList() !== void 0);
  if (!e) return;
  let t = e.getModelList();
  if (!t) throw new Error("No model list found in any service.");
  let n = new Set(t.map((o) => o.key));
  for (let o = 0; o < s10.length; o++) {
    let r = s10[o];
    if (!r) throw new Error(`Service at index ${o} is undefined`);
    let i = r.getModelList();
    if (!i) throw new Error(`Service at index ${o} (${r.getName()}) has no model list while another service does.`);
    let a = new Set(i.map((l) => l.key));
    for (let l of n) if (!a.has(l)) throw new Error(`Service at index ${o} (${r.getName()}) is missing model "${l}"`);
    for (let l of a) if (!n.has(l)) throw new Error(`Service at index ${o} (${r.getName()}) has extra model "${l}"`);
  }
}
function he(s10) {
  let e = false, t = false, n = false, o = false, r = false, i = false, a = false, l = /* @__PURE__ */ new Set(), p = 0;
  if (s10.chatPrompt && Array.isArray(s10.chatPrompt)) for (let c of s10.chatPrompt) {
    if (c.role === "user" && Array.isArray(c.content)) for (let u of c.content) switch (l.add(u.type), u.type) {
      case "image":
        e = true, u.cache && (a = true), p += 85;
        break;
      case "audio":
        t = true, u.cache && (a = true), p += u.duration || 60;
        break;
      case "file":
        n = true, u.cache && (a = true), p += Math.ceil((u.extractedText?.length || 1e3) / 4);
        break;
      case "url":
        o = true, u.cache && (a = true), p += Math.ceil((u.cachedContent?.length || 2e3) / 4);
        break;
      case "text":
        u.cache && (a = true), p += Math.ceil(u.text.length / 4);
        break;
    }
    else "content" in c && typeof c.content == "string" && (p += Math.ceil(c.content.length / 4));
    "cache" in c && c.cache && (a = true);
  }
  return s10.functions && s10.functions.length > 0 && (r = true), s10.modelConfig?.stream === true && (i = true), s10.capabilities && (s10.capabilities.requiresImages && (e = true), s10.capabilities.requiresAudio && (t = true), s10.capabilities.requiresFiles && (n = true), s10.capabilities.requiresWebSearch && (o = true)), { hasImages: e, hasAudio: t, hasFiles: n, hasUrls: o, requiresFunctions: r, requiresStreaming: i, requiresCaching: a, contentTypes: l, estimatedTokens: p };
}
function xr(s10, e) {
  let t = s10.getFeatures(), n = [], o = [], r = [];
  if (e.hasImages && !t.media.images.supported && (n.push("Image support"), r.push("Use altText for images or imageToText service")), e.hasAudio && !t.media.audio.supported && (n.push("Audio support"), r.push("Pre-transcribe audio or use transcription field")), e.hasFiles && !t.media.files.supported && (n.push("File support"), r.push("Pre-extract text content or use extractedText field")), e.hasUrls && !t.media.urls.supported && (n.push("URL/Web search support"), r.push("Pre-fetch content or use cachedContent field")), e.requiresFunctions && !t.functions && n.push("Function calling"), e.requiresStreaming && !t.streaming && (n.push("Streaming responses"), r.push("Use non-streaming mode")), e.requiresCaching && !t.caching.supported && (n.push("Content caching"), r.push("Repeated content will not be cached")), e.hasImages && t.media.images.supported) {
    let a = t.media.images.maxSize;
    a && a < 10 * 1024 * 1024 && o.push(`Image size limit is ${Math.round(a / (1024 * 1024))}MB`);
  }
  if (e.hasAudio && t.media.audio.supported) {
    let a = t.media.audio.maxDuration;
    a && a < 600 && o.push(`Audio duration limit is ${Math.round(a / 60)} minutes`);
  }
  return { isSupported: n.length === 0, missingCapabilities: n, warnings: o, alternatives: r };
}
function ln(s10, e) {
  return s10.map((t) => {
    let n = t.getFeatures(), o = xr(t, e), r = 0, i = [];
    return r += 10, e.hasImages && n.media.images.supported && (r += 25, i.push("Images"), n.media.images.detailLevels?.includes("high") && (r += 5), n.media.images.maxSize && n.media.images.maxSize > 10 * 1024 * 1024 && (r += 3)), e.hasAudio && n.media.audio.supported && (r += 25, i.push("Audio"), n.media.audio.maxDuration && n.media.audio.maxDuration > 600 && (r += 5)), e.hasFiles && n.media.files.supported && (r += 25, i.push("Files"), n.media.files.uploadMethod === "cloud" && (r += 3)), e.hasUrls && n.media.urls.supported && (r += 25, i.push("URLs"), n.media.urls.webSearch && (r += 5)), e.requiresFunctions && n.functions && (r += 15, i.push("Functions"), n.functionCot && (r += 3)), e.requiresStreaming && n.streaming && (r += 10, i.push("Streaming")), e.requiresCaching && n.caching.supported && (r += 8, i.push("Caching"), n.caching.types.includes("persistent") && (r += 3)), n.thinking && (r += 2), n.multiTurn && (r += 2), n.hasThinkingBudget && (r += 1), n.hasShowThoughts && (r += 1), r -= o.missingCapabilities.length * 10, { provider: t, score: r, missingCapabilities: o.missingCapabilities, supportedCapabilities: i };
  }).sort((t, n) => n.score - t.score);
}
function pn(s10, e, t = {}) {
  if (e.length === 0) throw new Error("No providers available");
  let n = he(s10), o = ln(e, n);
  if (t.requireExactMatch) {
    let r = o.filter((i) => i.missingCapabilities.length === 0);
    if (r.length === 0) throw new Error(`No providers fully support the request requirements: ${o[0]?.missingCapabilities.join(", ") || "unknown requirements"}`);
    return r[0].provider;
  }
  if (!t.allowDegradation) {
    let r = o[0];
    if (r.missingCapabilities.length > 0) throw new Error(`Best available provider (${r.provider.getName()}) is missing: ${r.missingCapabilities.join(", ")}`);
  }
  return o[0].provider;
}
function Ns(s10, e) {
  let t = he(s10), n = ln(e, t), o = n[0]?.provider || null, r = [t.hasImages && "images", t.hasAudio && "audio", t.hasFiles && "files", t.hasUrls && "URLs", t.requiresFunctions && "functions", t.requiresStreaming && "streaming", t.requiresCaching && "caching"].filter(Boolean).length, i = o ? n[0].supportedCapabilities.length : 0, a = o ? `${o.getName()} supports ${i}/${r} requirements (${Math.round(i / Math.max(r, 1) * 100)}% compatibility)` : "No suitable providers found";
  return { requirements: t, providerScores: n, recommendedProvider: o, summary: a };
}
function $s(s10, e) {
  return s10.filter((t) => t.getFeatures().media[e].supported);
}
function Us(s10, e) {
  let t = {};
  for (let n of s10) {
    let r = n.getFeatures().media[e];
    if (r.supported) for (let i of r.formats) t[i] || (t[i] = []), t[i].push(n);
  }
  return t;
}
var ut = ((o) => (o.CommandRPlus = "command-r-plus", o.CommandR = "command-r", o.Command = "command", o.CommandLight = "command-light", o))(ut || {});
var dt = ((o) => (o.EmbedEnglishV30 = "embed-english-v3.0", o.EmbedEnglishLightV30 = "embed-english-light-v3.0", o.EmbedMultiLingualV30 = "embed-multilingual-v3.0", o.EmbedMultiLingualLightV30 = "embed-multilingual-light-v3.0", o))(dt || {});
var cn = [{ name: "command-r-plus", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "command-r", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "command", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "command-light", currency: "usd", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.6 }, { name: "embed-english-light-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-english-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-multilingual-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-multilingual-light-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }];
var yr = () => structuredClone({ model: "command-r-plus", embedModel: "embed-english-v3.0", ...w() });
var Bs = () => structuredClone({ model: "command-r", embedModel: "embed-english-v3.0", ..._() });
var un = class {
  constructor(e) {
    this.config = e;
  }
  tokensUsed;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, topP: e.topP, topK: e.topK, frequencyPenalty: e.frequencyPenalty, presencePenalty: e.presencePenalty, endSequences: e.endSequences, stopSequences: e.stopSequences, stream: e.stream, n: e.n };
  }
  createChatReq(e) {
    let t = e.model, n = e.chatPrompt.at(-1), o = e.chatPrompt.slice(0, -1), r;
    n && n.role === "user" && typeof n.content == "string" && (r = n?.content);
    let i = qs(o), a = e.functions?.map((u) => {
      let d = {};
      if (u.parameters?.properties) for (let [m, g] of Object.entries(u.parameters.properties)) d[m] = { description: g.description, type: g.type, required: u.parameters.required?.includes(m) ?? false };
      return { name: u.name, description: u.description, parameter_definitions: d };
    }), l = e.chatPrompt.filter((u) => u.role === "function").map((u) => {
      let d = a?.find((m) => m.name === u.functionId);
      if (!d) throw new Error("Function not found");
      return { call: { name: d.name, parameters: d.parameter_definitions }, outputs: [{ result: u.result ?? "" }] };
    }), p = { name: "/chat" }, c = { message: r, model: t, tools: a, ...l && !r ? { tool_results: l } : {}, chat_history: i, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, k: e.modelConfig?.topK ?? this.config.topK, p: e.modelConfig?.topP ?? this.config.topP, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, end_sequences: this.config.endSequences, stop_sequences: e.modelConfig?.stopSequences ?? this.config.stopSequences };
    return [p, c];
  }
  createEmbedReq = (e) => {
    let t = e.embedModel;
    if (!t) throw new Error("Embed model not set");
    if (!e.texts || e.texts.length === 0) throw new Error("Embed texts is empty");
    let n = { name: "/embed" }, o = { model: t, texts: e.texts ?? [], input_type: "classification", truncate: "" };
    return [n, o];
  };
  createChatResp = (e) => {
    this.tokensUsed = e.meta.billed_units ? { promptTokens: e.meta.billed_units.input_tokens, completionTokens: e.meta.billed_units.output_tokens, totalTokens: e.meta.billed_units.input_tokens + e.meta.billed_units.output_tokens } : void 0;
    let t;
    if ("finish_reason" in e) switch (e.finish_reason) {
      case "COMPLETE":
        t = "stop";
        break;
      case "MAX_TOKENS":
        t = "length";
        break;
      case "ERROR":
        throw new Error("Finish reason: ERROR");
      case "ERROR_TOXIC":
        throw new Error("Finish reason: CONTENT_FILTER");
      default:
        t = "stop";
        break;
    }
    let n;
    return "tool_calls" in e && (n = e.tool_calls?.map((r) => ({ id: r.name, type: "function", function: { name: r.name, params: r.parameters } }))), { results: [{ index: 0, id: e.generation_id, content: e.text, functionCalls: n, finishReason: t }], remoteId: e.response_id };
  };
  createChatStreamResp = (e, t) => {
    let n = t;
    e.event_type === "stream-start" && (n.generation_id = e.generation_id), this.tokensUsed = { promptTokens: 0, completionTokens: e.meta.billed_units?.output_tokens ?? 0, totalTokens: e.meta.billed_units?.output_tokens ?? 0 };
    let { results: o } = this.createChatResp(e), r = o[0];
    if (!r) throw new Error("No result");
    return r.id = n.generation_id ?? "", { results: o };
  };
  createEmbedResp(e) {
    return { remoteId: e.id, embeddings: e.embeddings };
  }
};
var ve = class extends E {
  constructor({ apiKey: e, config: t, options: n, models: o }) {
    if (!e || e === "") throw new Error("Cohere API key not set");
    let r = { ...yr(), ...t }, i = new un(r);
    super(i, { name: "Cohere", apiURL: "https://api.cohere.ai/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: cn, defaults: { model: r.model }, supportFor: { functions: true, streaming: true, media: { images: { supported: false, formats: [], maxSize: 0, detailLevels: [] }, audio: { supported: false, formats: [], maxDuration: 0 }, files: { supported: false, formats: [], maxSize: 0, uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, options: n, models: o });
  }
};
function qs(s10) {
  return s10.map((e) => {
    let t = "";
    if (e.role === "system" || e.role === "assistant" || e.role === "user") if (typeof e.content == "string") t = e.content;
    else throw new Error("Multi-modal content not supported");
    switch (e.role) {
      case "user":
        return { role: "USER", message: t };
      case "system":
        return { role: "SYSTEM", message: t };
      case "assistant": {
        let n = fr(e.functionCalls);
        return { role: "CHATBOT", message: t, tool_calls: n };
      }
      case "function": {
        let n = s10.map((i) => {
          if (i.role === "assistant") return i.functionCalls?.find((a) => a.id === e.functionId);
        }).filter((i) => i !== void 0), o = fr(n)?.at(0);
        if (!o) throw new Error("Function call not found");
        let r = [{ result: e.result }];
        return { role: "TOOL", tool_results: [{ call: o, outputs: r }] };
      }
      default:
        throw new Error("Unknown role");
    }
  });
}
function fr(s10) {
  return s10?.map((e) => {
    let t = typeof e.function.params == "string" ? JSON.parse(e.function.params) : e.function.params;
    return { name: e.function.name, parameters: t };
  });
}
var mt = ((n) => (n.DeepSeekChat = "deepseek-chat", n.DeepSeekCoder = "deepseek-coder", n.DeepSeekReasoner = "deepseek-reasoner", n))(mt || {});
var dn = [{ name: "deepseek-chat", currency: "USD", promptTokenCostPer1M: 0.27, completionTokenCostPer1M: 1.1 }, { name: "deepseek-reasoner", currency: "USD", promptTokenCostPer1M: 0.55, completionTokenCostPer1M: 2.19 }];
var Ir = () => structuredClone({ model: "deepseek-chat", ...w() });
var zs = () => structuredClone({ model: "deepseek-coder", ..._() });
var Oe = class extends F {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("DeepSeek API key not set");
    let i = { ...Ir(), ...t };
    r = [...dn, ...r ?? []], super({ apiKey: e, config: i, options: n, apiURL: "https://api.deepseek.com", modelInfo: r, supportFor: { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, models: o }), super.setName("DeepSeek");
  }
};
var gt = ((c) => (c.Gemini25Pro = "gemini-2.5-pro", c.Gemini25Flash = "gemini-2.5-flash", c.Gemini25FlashLite = "gemini-2.5-flash-lite", c.Gemini20Flash = "gemini-2.0-flash", c.Gemini20FlashLite = "gemini-2.0-flash-lite", c.Gemini1Pro = "gemini-1.0-pro", c.Gemini15Flash = "gemini-1.5-flash", c.Gemini15Flash002 = "gemini-1.5-flash-002", c.Gemini15Flash8B = "gemini-1.5-flash-8b", c.Gemini15Pro = "gemini-1.5-pro", c))(gt || {});
var mn = ((o) => (o.GeminiEmbedding = "gemini-embedding-exp", o.TextEmbeddingLarge = "text-embedding-large-exp-03-07", o.TextEmbedding004 = "text-embedding-004", o.TextEmbedding005 = "text-embedding-005", o))(mn || {});
var gn = ((o) => (o.HarmCategoryHarassment = "HARM_CATEGORY_HARASSMENT", o.HarmCategoryHateSpeech = "HARM_CATEGORY_HATE_SPEECH", o.HarmCategorySexuallyExplicit = "HARM_CATEGORY_SEXUALLY_EXPLICIT", o.HarmCategoryDangerousContent = "HARM_CATEGORY_DANGEROUS_CONTENT", o))(gn || {});
var hn = ((r) => (r.BlockNone = "BLOCK_NONE", r.BlockOnlyHigh = "BLOCK_ONLY_HIGH", r.BlockMediumAndAbove = "BLOCK_MEDIUM_AND_ABOVE", r.BlockLowAndAbove = "BLOCK_LOW_AND_ABOVE", r.BlockDefault = "HARM_BLOCK_THRESHOLD_UNSPECIFIED", r))(hn || {});
var br = ((l) => (l.SemanticSimilarity = "SEMANTIC_SIMILARITY", l.Classification = "CLASSIFICATION", l.Clustering = "CLUSTERING", l.RetrievalDocument = "RETRIEVAL_DOCUMENT", l.RetrievalQuery = "RETRIEVAL_QUERY", l.QuestionAnswering = "QUESTION_ANSWERING", l.FactVerification = "FACT_VERIFICATION", l.CodeRetrievalQuery = "CODE_RETRIEVAL_QUERY", l))(br || {});
var An = [{ name: "gemini-2.5-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 2.5, completionTokenCostPer1M: 15, hasThinkingBudget: true, hasShowThoughts: true }, { name: "gemini-2.5-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 15, completionTokenCostPer1M: 3.5, hasThinkingBudget: true, hasShowThoughts: true }, { name: "gemini-2.5-flash-lite", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.4, hasThinkingBudget: true, hasShowThoughts: true }, { name: "gemini-2.0-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.01, completionTokenCostPer1M: 0.4 }, { name: "gemini-2.0-flash-lite", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0, completionTokenCostPer1M: 0 }, { name: "gemini-1.5-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.075, completionTokenCostPer1M: 0.3 }, { name: "gemini-1.5-flash-8b", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.0375, completionTokenCostPer1M: 0.15 }, { name: "gemini-1.5-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 1.25, completionTokenCostPer1M: 5 }, { name: "gemini-1.0-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }];
var xn = (s10) => {
  if (!s10 || typeof s10 != "object") return s10;
  let e = { ...s10 };
  return delete e.additionalProperties, delete e.default, delete e.optional, delete e.maximum, delete e.oneOf, delete e.anyOf, e.properties && typeof e.properties == "object" && (e.properties = Object.fromEntries(Object.entries(e.properties).map(([t, n]) => [t, xn(n)]))), e.items && (e.items = xn(e.items)), e;
};
var Rr = [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }];
var Cr = () => structuredClone({ model: "gemini-2.5-flash", embedModel: "text-embedding-005", safetySettings: Rr, thinkingTokenBudgetLevels: { minimal: 200, low: 800, medium: 5e3, high: 1e4, highest: 24500 }, ...w() });
var js = () => structuredClone({ model: "gemini-2.0-flash", embedModel: "text-embedding-005", safetySettings: Rr, thinkingTokenBudgetLevels: { minimal: 200, low: 800, medium: 5e3, high: 1e4, highest: 24500 }, ..._() });
var fn = class {
  constructor(e, t, n, o, r) {
    this.config = e;
    this.isVertex = t;
    this.endpointId = n;
    this.apiKey = o;
    this.options = r;
    if (!this.isVertex && this.config.autoTruncate) throw new Error("Auto truncate is not supported for GoogleGemini");
  }
  tokensUsed;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, topP: e.topP, topK: e.topK, presencePenalty: e.presencePenalty, frequencyPenalty: e.frequencyPenalty, stopSequences: e.stopSequences, endSequences: e.endSequences, stream: e.stream, n: e.n };
  }
  createChatReq = async (e, t) => {
    let n = e.model, o = e.modelConfig?.stream ?? this.config.stream;
    if (!e.chatPrompt || e.chatPrompt.length === 0) throw new Error("Chat prompt is empty");
    let r;
    if (this.endpointId ? r = { name: o ? `/${this.endpointId}:streamGenerateContent?alt=sse` : `/${this.endpointId}:generateContent` } : r = { name: o ? `/models/${n}:streamGenerateContent?alt=sse` : `/models/${n}:generateContent` }, !this.isVertex) {
      let h = o ? "&" : "?", f = typeof this.apiKey == "function" ? await this.apiKey() : this.apiKey;
      r.name += `${h}key=${f}`;
    }
    let i = e.chatPrompt.filter((h) => h.role === "system").map((h) => h.content), a = i.length > 0 ? { role: "user", parts: [{ text: i.join(" ") }] } : void 0, l = e.chatPrompt.filter((h) => h.role !== "system").map((h, f) => {
      switch (h.role) {
        case "user":
          return { role: "user", parts: Array.isArray(h.content) ? h.content.map((x, y) => {
            switch (x.type) {
              case "text":
                return { text: x.text };
              case "image":
                return { inlineData: { mimeType: x.mimeType, data: x.image } };
              default:
                throw new Error(`Chat prompt content type not supported (index: ${y})`);
            }
          }) : [{ text: h.content }] };
        case "assistant": {
          let A = [];
          if (h.functionCalls) {
            if (A = h.functionCalls.map((x) => {
              let y = typeof x.function.params == "string" ? JSON.parse(x.function.params) : x.function.params;
              return { functionCall: { name: x.function.name, args: y } };
            }), !A) throw new Error("Function call is empty");
            return { role: "model", parts: A };
          }
          if (!h.content) throw new Error("Assistant content is empty");
          return A = [{ text: h.content }], { role: "model", parts: A };
        }
        case "function": {
          if (!("functionId" in h)) throw new Error(`Chat prompt functionId is empty (index: ${f})`);
          return { role: "user", parts: [{ functionResponse: { name: h.functionId, response: { result: h.result } } }] };
        }
        default:
          throw new Error(`Invalid role: ${JSON.stringify(h)} (index: ${f})`);
      }
    }), p = [];
    if (e.functions && e.functions.length > 0) {
      let h = e.functions.map((f) => ({ ...f, parameters: f.parameters ? xn(f.parameters) : void 0 }));
      p.push({ function_declarations: h });
    }
    this.options?.codeExecution && p.push({ code_execution: {} }), this.options?.googleSearchRetrieval && p.push({ google_search_retrieval: { dynamic_retrieval_config: this.options.googleSearchRetrieval } }), this.options?.googleSearch && p.push({ google_search: {} }), this.options?.urlContext && p.push({ url_context: {} }), p.length === 0 && (p = void 0);
    let c;
    if (e.functionCall) if (e.functionCall === "none") c = { function_calling_config: { mode: "NONE" } };
    else if (e.functionCall === "auto") c = { function_calling_config: { mode: "AUTO" } };
    else if (e.functionCall === "required") c = { function_calling_config: { mode: "ANY" } };
    else {
      let h = e.functionCall.function?.name ? { allowedFunctionNames: [e.functionCall.function.name] } : {};
      c = { function_calling_config: { mode: "ANY" }, ...h };
    }
    else p && p.length > 0 && (c = { function_calling_config: { mode: "AUTO" } });
    let u = {};
    if (this.config.thinking?.includeThoughts && (u.includeThoughts = true), this.config.thinking?.thinkingTokenBudget && (u.thinkingBudget = this.config.thinking.thinkingTokenBudget), t?.thinkingTokenBudget) {
      let h = this.config.thinkingTokenBudgetLevels;
      switch (t.thinkingTokenBudget) {
        case "none":
          u.thinkingBudget = 0, u.includeThoughts = false;
          break;
        case "minimal":
          u.thinkingBudget = h?.minimal ?? 200;
          break;
        case "low":
          u.thinkingBudget = h?.low ?? 800;
          break;
        case "medium":
          u.thinkingBudget = h?.medium ?? 5e3;
          break;
        case "high":
          u.thinkingBudget = h?.high ?? 1e4;
          break;
        case "highest":
          u.thinkingBudget = h?.highest ?? 24500;
          break;
      }
    }
    t?.showThoughts !== void 0 && t?.thinkingTokenBudget !== "none" && (u.includeThoughts = t.showThoughts);
    let d = { maxOutputTokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, topP: e.modelConfig?.topP ?? this.config.topP, topK: e.modelConfig?.topK ?? this.config.topK, frequencyPenalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, candidateCount: 1, stopSequences: e.modelConfig?.stopSequences ?? this.config.stopSequences, responseMimeType: "text/plain", ...Object.keys(u).length > 0 ? { thinkingConfig: u } : {} }, m = this.config.safetySettings;
    return [r, { contents: l, tools: p, toolConfig: c, systemInstruction: a, generationConfig: d, safetySettings: m }];
  };
  createEmbedReq = async (e) => {
    let t = e.embedModel;
    if (!t) throw new Error("Embed model not set");
    if (!e.texts || e.texts.length === 0) throw new Error("Embed texts is empty");
    let n, o;
    if (this.isVertex) this.endpointId ? n = { name: `/${this.endpointId}:predict` } : n = { name: `/models/${t}:predict` }, o = { instances: e.texts.map((r) => ({ content: r, ...this.config.embedType && { taskType: this.config.embedType } })), parameters: { autoTruncate: this.config.autoTruncate, outputDimensionality: this.config.dimensions } };
    else {
      let r = typeof this.apiKey == "function" ? this.apiKey() : this.apiKey;
      n = { name: `/models/${t}:batchEmbedContents?key=${r}` }, o = { requests: e.texts.map((i) => ({ model: `models/${t}`, content: { parts: [{ text: i }] }, outputDimensionality: this.config.dimensions, ...this.config.embedType && { taskType: this.config.embedType } })) };
    }
    return [n, o];
  };
  createChatResp = (e) => {
    let t = e.candidates?.map((n) => {
      let o = { index: 0 };
      switch (n.finishReason) {
        case "MAX_TOKENS":
          o.finishReason = "length";
          break;
        case "STOP":
          o.finishReason = "stop";
          break;
        case "SAFETY":
          throw new O("Content was blocked due to safety settings", void 0, void 0);
        case "RECITATION":
          throw new O("Content was blocked due to recitation policy", void 0, void 0);
        case "MALFORMED_FUNCTION_CALL":
          throw new O("Function call was malformed and blocked", void 0, void 0);
        case "UNEXPECTED_TOOL_CALL":
          throw new O("Unexpected tool call", void 0, void 0);
        case "FINISH_REASON_UNSPECIFIED":
          throw new O("Finish reason unspecified", void 0, void 0);
        case "BLOCKLIST":
          throw new O("Content was blocked due to blocklist", void 0, void 0);
        case "PROHIBITED_CONTENT":
          throw new O("Content was blocked due to prohibited content", void 0, void 0);
        case "SPII":
          throw new O("Content was blocked due to SPII", void 0, void 0);
        case "OTHER":
          throw new O("Other finish reason", void 0, void 0);
      }
      if (!n.content || !n.content.parts) return o;
      for (let r of n.content.parts) {
        if ("text" in r) {
          "thought" in r && r.thought ? o.thought = r.text : o.content = r.text;
          continue;
        }
        "functionCall" in r && (o.functionCalls = [{ id: U(), type: "function", function: { name: r.functionCall.name, params: r.functionCall.args } }]);
      }
      return o;
    });
    return e.usageMetadata && (this.tokensUsed = { totalTokens: e.usageMetadata.totalTokenCount, promptTokens: e.usageMetadata.promptTokenCount, completionTokens: e.usageMetadata.candidatesTokenCount, thoughtsTokens: e.usageMetadata.thoughtsTokenCount }), { results: t };
  };
  createChatStreamResp = (e) => this.createChatResp(e);
  createEmbedResp = (e) => {
    let t;
    return this.isVertex ? t = e.predictions.map((n) => n.embeddings.values) : t = e.embeddings.map((n) => n.values), { embeddings: t };
  };
};
var Me = class s3 extends E {
  static create(e) {
    return new s3(e);
  }
  constructor({ apiKey: e, projectId: t, region: n, endpointId: o, config: r, options: i, models: a, modelInfo: l }) {
    let p = t !== void 0 && n !== void 0, c, u;
    if (p) {
      if (!e) throw new Error("GoogleGemini Vertex API key not set");
      if (typeof e != "function") throw new Error("GoogleGemini Vertex API key must be a function for token-based authentication");
      let h;
      o ? h = "endpoints" : h = "publishers/google", c = `https://${n === "global" ? "aiplatform" : `${n}-aiplatform`}.googleapis.com/v1/projects/${t}/locations/${n}/${h}`, u = async () => ({ Authorization: `Bearer ${typeof e == "function" ? await e() : e}` });
    } else {
      if (!e) throw new Error("GoogleGemini AI API key not set");
      c = "https://generativelanguage.googleapis.com/v1beta", u = async () => ({});
    }
    let d = { ...Cr(), ...r }, m = new fn(d, p, o, e, i);
    l = [...An, ...l ?? []];
    let g = (h) => {
      let f = K({ model: h, modelInfo: l, models: a });
      return { functions: true, streaming: true, hasThinkingBudget: f?.hasThinkingBudget ?? false, hasShowThoughts: f?.hasShowThoughts ?? false, functionCot: false, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 20 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: true, formats: ["wav", "mp3", "aac", "ogg"], maxDuration: 9.5 * 60 }, files: { supported: true, formats: ["application/pdf", "text/plain", "text/csv", "text/html", "text/xml"], maxSize: 2 * 1024 * 1024 * 1024, uploadMethod: "cloud" }, urls: { supported: true, webSearch: true, contextFetching: true } }, caching: { supported: false, types: [] }, thinking: f?.hasThinkingBudget ?? false, multiTurn: true };
    };
    super(m, { name: "GoogleGeminiAI", apiURL: c, headers: u, modelInfo: l, defaults: { model: d.model, embedModel: d.embedModel }, options: i, supportFor: g, models: a });
  }
};
var Hs = new L();
var ke = class {
  options;
  maxTokens;
  refillRate;
  currentTokens;
  lastRefillTime;
  constructor(e, t, n) {
    this.maxTokens = e, this.refillRate = t, this.currentTokens = e, this.lastRefillTime = Date.now(), this.options = n;
  }
  refillTokens() {
    let e = Date.now(), n = (e - this.lastRefillTime) / 1e3 * this.refillRate;
    this.currentTokens = Math.min(this.maxTokens, this.currentTokens + n), this.lastRefillTime = e;
  }
  async waitUntilTokensAvailable(e) {
    if (this.refillTokens(), this.currentTokens >= e) {
      this.currentTokens -= e;
      return;
    }
    return this.options?.debug && console.log(Hs.red(`Rate limiter: Waiting for ${e - this.currentTokens} tokens`)), await new Promise((t) => setTimeout(t, 100)), this.waitUntilTokensAvailable(e);
  }
  async acquire(e) {
    await this.waitUntilTokensAvailable(e);
  }
};
var ht = ((o) => (o.Llama3_8B = "llama3-8b-8192", o.Llama33_70B = "llama-3.3-70b-versatile", o.Mixtral_8x7B = "mixtral-8x7b-32768", o.Gemma2_9B = "gemma2-9b-it", o))(ht || {});
var yn = [{ name: "gemma2-9b-it", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.2 }, { name: "llama-3.3-70b-versatile", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.59, completionTokenCostPer1M: 0.79 }, { name: "llama3-8b-8192", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.05, completionTokenCostPer1M: 0.08 }, { name: "mixtral-8x7b-32768", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.24, completionTokenCostPer1M: 0.24 }];
var Ks = () => structuredClone({ model: "llama-3.3-70b-versatile", ...w() });
var Ee = class extends F {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Groq API key not set");
    let i = { ...Ks(), ...t }, a = { ...n, streamingUsage: false };
    r = [...yn, ...r ?? []];
    let l = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    super({ apiKey: e, config: i, options: a, modelInfo: r, apiURL: "https://api.groq.com/openai/v1", models: o, supportFor: l }), super.setName("Groq"), this.setOptions(a);
  }
  setOptions = (e) => {
    let t = this.newRateLimiter(e);
    super.setOptions({ ...e, rateLimiter: t });
  };
  newRateLimiter = (e) => {
    if (e?.rateLimiter) return e.rateLimiter;
    let t = e?.tokensPerMinute ?? 4800, n = new ke(t, t / 60, { debug: e?.debug });
    return async (r, i) => {
      let a = i.modelUsage?.tokens?.totalTokens || 0;
      return await n.acquire(a), await r();
    };
  };
};
var In = [];
var bn = ((e) => (e.MetaLlama270BChatHF = "meta-llama/Llama-2-70b-chat-hf", e))(bn || {});
var Tr = () => structuredClone({ model: "meta-llama/Llama-2-70b-chat-hf", ...w() });
var Vs = () => structuredClone({ model: "meta-llama/Llama-2-70b-chat-hf", ..._() });
var Rn = class {
  constructor(e) {
    this.config = e;
  }
  tokensUsed;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, topP: e.topP, topK: e.topK, n: e.n, presencePenalty: e.presencePenalty };
  }
  createChatReq = (e) => {
    let t = e.model, n = e.functions ? `Functions:
${JSON.stringify(e.functions, null, 2)}
` : "", o = e.chatPrompt?.map((l) => {
      switch (l.role) {
        case "user":
          return `User: ${l.content}`;
        case "system":
          return `System: ${l.content}`;
        case "function":
          return `Function Result: ${l.result}`;
        case "assistant": {
          let p = l.functionCalls?.map((c) => {
            let u = typeof c.function.params == "string" ? c.function.params : JSON.stringify(c.function.params);
            return `${c.function.name}(${u})`;
          }).join(`
`);
          return p ? `Assistant: ${l.content}
 Functions:
${p}` : `Assistant: ${l.content}`;
        }
        default:
          throw new Error("Unknown role");
      }
    }).join(`
`), r = `${n} ${o}`.trim(), i = { name: "/models" }, a = { model: t, inputs: r, parameters: { max_new_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, repetition_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_p: e.modelConfig?.topP ?? this.config.topP, top_k: e.modelConfig?.topK ?? this.config.topK, return_full_text: this.config.returnFullText, num_return_sequences: this.config.n, do_sample: this.config.doSample, max_time: this.config.maxTime }, options: { use_cache: this.config.useCache, wait_for_model: this.config.waitForModel } };
    return [i, a];
  };
  createChatResp = (e) => ({ results: [{ index: 0, content: e.generated_text }] });
};
var Pe = class extends E {
  constructor({ apiKey: e, config: t, options: n, models: o }) {
    if (!e || e === "") throw new Error("HuggingFace API key not set");
    let r = { ...Tr(), ...t }, i = new Rn(r);
    super(i, { name: "HuggingFace", apiURL: "https://api-inference.huggingface.co", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: In, defaults: { model: r.model }, options: n, supportFor: { functions: false, streaming: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, models: o });
  }
};
var At = ((l) => (l.Mistral7B = "open-mistral-7b", l.Mistral8x7B = "open-mixtral-8x7b", l.MistralSmall = "mistral-small-latest", l.MistralNemo = "mistral-nemo-latest", l.MistralLarge = "mistral-large-latest", l.Codestral = "codestral-latest", l.OpenCodestralMamba = "open-codestral-mamba", l.OpenMistralNemo = "open-mistral-nemo-latest", l))(At || {});
var wr = ((e) => (e.MistralEmbed = "mistral-embed", e))(wr || {});
var Cn = [{ name: "open-mistral-7b", currency: "USD", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 0.25 }, { name: "open-mixtral-8x7b", currency: "USD", promptTokenCostPer1M: 0.7, completionTokenCostPer1M: 0.7 }, { name: "mistral-nemo-latest", currency: "USD", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.15 }, { name: "mistral-small-latest", currency: "USD", promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.6 }, { name: "mistral-large-latest", currency: "USD", promptTokenCostPer1M: 2, completionTokenCostPer1M: 6 }, { name: "codestral-latest", currency: "USD", promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.6 }, { name: "open-codestral-mamba", currency: "USD", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 0.25 }, { name: "open-mistral-nemo-latest", currency: "USD", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.3 }];
var Tn = () => structuredClone({ model: "mistral-small-latest", ...w(), topP: 1 });
var Ws = () => structuredClone({ ...Tn(), model: "mistral-large-latest" });
var Fe = class extends F {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Mistral API key not set");
    let i = { ...Tn(), ...t };
    r = [...Cn, ...r ?? []];
    let a = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, l = (p) => {
      let { max_completion_tokens: c, messages: u, ...d } = p;
      return { ...d, messages: this.updateMessages(u), max_tokens: c };
    };
    super({ apiKey: e, config: i, options: n, apiURL: "https://api.mistral.ai/v1", modelInfo: r, models: o, supportFor: a, chatReqUpdater: l }), super.setName("Mistral");
  }
  updateMessages(e) {
    let t = [];
    if (!Array.isArray(e)) return e;
    for (let n of e) if (n.role === "user" && Array.isArray(n.content)) {
      let o = n.content.map((r) => typeof r == "object" && r !== null && "image_url" in r ? { type: "image_url", image_url: { url: r.image_url?.url } } : r);
      t.push({ ...n, content: o });
    } else t.push(n);
    return t;
  }
};
var wn = class {
  constructor(e = {}) {
    this.config = e;
    this.config.id = this.config.id ?? U();
  }
  metrics = { latency: { chat: { mean: 0, p95: 0, p99: 0, samples: [] }, embed: { mean: 0, p95: 0, p99: 0, samples: [] } }, errors: { chat: { count: 0, rate: 0, total: 0 }, embed: { count: 0, rate: 0, total: 0 } } };
  getLastUsedChatModel() {
    return this.config.modelInfo?.name ?? "mock-model";
  }
  getLastUsedEmbedModel() {
    return this.config.embedModelInfo?.name ?? "mock-embed-model";
  }
  getLastUsedModelConfig() {
    return this.config.modelInfo ? { maxTokens: this.config.modelInfo.maxTokens, temperature: 0.7, stream: this.config.features?.streaming ?? false } : void 0;
  }
  getName() {
    return this.config.name ?? "mock-ai-service";
  }
  getId() {
    return this.config.id ?? "mock-ai-service-id";
  }
  getFeatures(e) {
    return { functions: this.config.features?.functions ?? false, streaming: this.config.features?.streaming ?? false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
  }
  getModelList() {
    return this.config.models;
  }
  getMetrics() {
    return this.metrics;
  }
  async chat(e, t) {
    if (this.config.latencyMs && await new Promise((n) => setTimeout(n, this.config.latencyMs)), this.config.shouldError) throw new Error(this.config.errorMessage ?? "Mock chat error");
    return this.updateMetrics("chat"), typeof this.config.chatResponse == "function" ? await this.config.chatResponse(e) : this.config.chatResponse ?? { results: [{ index: 0, content: "Mock response", finishReason: "stop" }], modelUsage: { ai: this.getName(), model: "mock-model", tokens: { promptTokens: 10, completionTokens: 5, totalTokens: 15 } } };
  }
  async embed(e, t) {
    if (this.config.latencyMs && await new Promise((n) => setTimeout(n, this.config.latencyMs)), this.config.shouldError) throw new Error(this.config.errorMessage ?? "Mock embed error");
    return this.updateMetrics("embed"), typeof this.config.embedResponse == "function" ? this.config.embedResponse(e) : this.config.embedResponse ?? { embeddings: [[0.1, 0.2, 0.3]], modelUsage: { ai: this.getName(), model: "mock-model", tokens: { promptTokens: 5, completionTokens: 0, totalTokens: 5 } } };
  }
  setOptions(e) {
    this.config.options = e;
  }
  getOptions() {
    return this.config.options ?? {};
  }
  getLogger() {
    return this.config.options?.logger ?? ((e) => {
      console.log(e);
    });
  }
  updateMetrics(e) {
    let t = this.config.latencyMs ?? 0;
    this.metrics.latency[e].samples.push(t);
    let n = this.metrics.latency[e].samples;
    if (this.metrics.latency[e].mean = n.reduce((o, r) => o + r, 0) / n.length, n.length > 0) {
      let o = [...n].sort((a, l) => a - l), r = Math.max(0, Math.floor(o.length * 0.95) - 1);
      this.metrics.latency[e].p95 = o[r] ?? t;
      let i = Math.max(0, Math.floor(o.length * 0.99) - 1);
      this.metrics.latency[e].p99 = o[i] ?? t;
    }
    if (this.config.shouldError) {
      this.metrics.errors[e].count++, this.metrics.errors[e].total++;
      let o = this.metrics.latency[e].samples.length;
      this.metrics.errors[e].rate = o > 0 ? this.metrics.errors[e].count / o : 0;
    }
  }
};
var Sn = class s4 {
  options;
  lastUsedService;
  services = /* @__PURE__ */ new Map();
  constructor(e) {
    if (e.length === 0) throw new Error("No AI services provided.");
    for (let [t, n] of e.entries()) if ("key" in n) {
      if (this.services.has(n.key)) throw new Error(`Duplicate model key: ${n.key}`);
      let { service: r, description: i, isInternal: a } = n;
      this.services.set(n.key, { service: r, description: i, isInternal: a });
    } else {
      let r = n.getModelList();
      if (!r) throw new Error(`Service ${t} \`${n.getName()}\` has no model list.`);
      for (let i of r) {
        if (this.services.has(i.key)) {
          let a = this.services.get(i.key)?.service;
          throw new Error(`Service ${t} \`${n.getName()}\` has duplicate model key: ${i.key} as service ${a?.getName()}`);
        }
        if ("model" in i && typeof i.model) this.services.set(i.key, { description: i.description, service: n, model: i.model });
        else if ("embedModel" in i && i.embedModel) this.services.set(i.key, { description: i.description, service: n, embedModel: i.embedModel });
        else throw new Error(`Key ${i.key} in model list for service ${t} \`${n.getName()}\` is missing a model or embedModel property.`);
      }
    }
  }
  static create(e) {
    return new s4(e);
  }
  getLastUsedChatModel() {
    return this.lastUsedService?.getLastUsedChatModel();
  }
  getLastUsedEmbedModel() {
    return this.lastUsedService?.getLastUsedEmbedModel();
  }
  getLastUsedModelConfig() {
    return this.lastUsedService?.getLastUsedModelConfig();
  }
  async chat(e, t) {
    let n = e.model;
    if (!n) throw new Error("Model key must be specified for multi-service");
    let o = this.services.get(n);
    if (!o) throw new Error(`No service found for model key: ${n}`);
    if (this.lastUsedService = o.service, !o.model) {
      let { model: r, ...i } = e;
      return await o.service.chat(i, t);
    }
    return await o.service.chat({ model: n, ...e }, t);
  }
  async embed(e, t) {
    let n = e.embedModel;
    if (!n) throw new Error("Embed model key must be specified for multi-service");
    let o = this.services.get(n);
    if (!o) throw new Error(`No service found for embed model key: ${n}`);
    if (this.lastUsedService = o.service, !o.model) {
      let { embedModel: r, ...i } = e;
      return await o.service.embed(i, t);
    }
    return await o.service.embed({ embedModel: n, ...e }, t);
  }
  getId() {
    return `MultiServiceRouter:${Array.from(this.services.values()).map((e) => e.service.getId()).join(",")}`;
  }
  getName() {
    return "MultiServiceRouter";
  }
  getModelList() {
    return Array.from(this.services).filter(([, e]) => !e.isInternal).map(([e, t]) => {
      if (t.model) return { key: e, description: t.description, model: t.model };
      if (t.embedModel) return { key: e, description: t.description, embedModel: t.embedModel };
      throw new Error(`Service ${e} has no model or embedModel`);
    });
  }
  getFeatures(e) {
    if (e) {
      let t = this.services.get(e);
      if (t) return t.service.getFeatures(e);
    }
    return { functions: false, streaming: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
  }
  getMetrics() {
    let e = this.lastUsedService;
    if (!e) {
      let t = this.services.values().next().value;
      t && (e = "service" in t ? t.service : t);
    }
    if (!e) throw new Error("No service available to get metrics.");
    return e.getMetrics();
  }
  setOptions(e) {
    for (let t of this.services.values()) t.service.setOptions(e);
    this.options = e;
  }
  getOptions() {
    return this.options ?? {};
  }
  getLogger() {
    let e = this.lastUsedService;
    if (!e) {
      let t = this.services.values().next().value;
      t && (e = t.service);
    }
    if (!e) throw new Error("No service available to get logger.");
    return e.getLogger();
  }
  setServiceEntry(e, t) {
    this.services.set(e, t);
  }
};
var Sr = () => structuredClone({ ...w(), model: "nous-hermes2", embedModel: "all-minilm" });
var Js = () => structuredClone({ ..._(), model: "nous-hermes2", embedModel: "all-minilm" });
var _e = class extends F {
  constructor({ apiKey: e = "not-set", url: t = "http://localhost:11434/v1", config: n, options: o, models: r }) {
    let i = { ...Sr(), ...n };
    super({ apiKey: e, options: o, config: i, apiURL: t, models: r, modelInfo: [], supportFor: { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true } }), super.setName("Ollama");
  }
};
var Qs = (s10) => ["o1", "o1-mini", "o1-pro", "o3", "o3-mini", "o3-pro", "o4-mini"].includes(s10);
var De = class {
  constructor(e, t, n) {
    this.config = e;
    this.streamingUsage = t;
    this.responsesReqUpdater = n;
  }
  tokensUsed;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, stopSequences: e.stopSequences, topP: e.topP, stream: e.stream };
  }
  mapInternalContentToResponsesInput(e) {
    return e.map((n) => {
      if (n.type === "text") return { type: "text", text: n.text };
      if (n.type === "image") return { type: "image_url", image_url: { url: `data:${n.mimeType};base64,${n.image}`, details: n.details ?? "auto" } };
      if (n.type === "audio") return { type: "input_audio", input_audio: { data: n.data, format: n.format === "wav" ? "wav" : void 0 } };
      let o = n;
      throw new Error(`Unsupported content part: ${JSON.stringify(o)}`);
    });
  }
  createResponsesReqInternalInput(e, t = false) {
    let n = [];
    for (let o of e) {
      if (t && o.role === "system") continue;
      let r;
      if (o.role === "system" || o.role === "user" || o.role === "assistant" && o.content) if (typeof o.content == "string") r = o.content;
      else if (Array.isArray(o.content)) r = this.mapInternalContentToResponsesInput(o.content);
      else {
        if (!(o.role === "assistant" && !o.content && o.functionCalls)) throw new Error(`Invalid content type for role ${o.role}`);
        r = "";
      }
      else o.role, r = "";
      switch (o.role) {
        case "system":
          n.push({ type: "message", role: "system", content: r });
          break;
        case "user":
          n.push({ type: "message", role: "user", content: r, name: o.name });
          break;
        case "assistant":
          if (o.content || o.functionCalls) {
            let i = { type: "message", role: "assistant", content: "" };
            if (o.content && (i.content = r), o.name && (i.name = o.name), o.content && n.push(i), o.functionCalls) for (let a of o.functionCalls) n.push({ type: "function_call", call_id: a.id, name: a.function.name, arguments: typeof a.function.params == "object" ? JSON.stringify(a.function.params) : a.function.params || "" });
          }
          break;
        case "function":
          n.push({ type: "function_call_output", call_id: o.functionId, output: o.result });
          break;
        default: {
          let i = o.role;
          throw new Error(`Invalid role in chat prompt: ${i}`);
        }
      }
    }
    return n;
  }
  createChatReq(e, t) {
    let n = e.model, o = { name: "/responses" }, r = null, i = false;
    if (e.chatPrompt) {
      for (let A of e.chatPrompt) if (A.role === "system" && typeof A.content == "string") {
        r = A.content, i = true;
        break;
      }
    }
    let a = r ?? this.config.systemPrompt ?? null, l = e.functions?.map((A) => ({ type: "function", name: A.name, description: A.description, parameters: A.parameters ?? {} })), p = [], c = Qs(n), u = this.config.reasoningSummary;
    t?.showThoughts ? u || (u = "auto") : u = void 0;
    let d = this.config.reasoningEffort;
    if (t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        d = void 0;
        break;
      case "minimal":
        d = "low";
        break;
      case "low":
        d = "medium";
        break;
      case "medium":
      case "high":
      case "highest":
        d = "high";
        break;
    }
    let m = { model: n, input: "", instructions: a, tools: l?.length ? l : void 0, tool_choice: e.functionCall === "none" || e.functionCall === "auto" || e.functionCall === "required" ? e.functionCall : typeof e.functionCall == "object" && e.functionCall.function ? { type: "function", name: e.functionCall.function.name } : void 0, ...c ? { max_output_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens ?? void 0 } : { temperature: e.modelConfig?.temperature ?? this.config.temperature ?? void 0, top_p: e.modelConfig?.topP ?? this.config.topP ?? void 0, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty ?? void 0, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty ?? void 0 }, stream: e.modelConfig?.stream ?? this.config.stream ?? false, background: void 0, include: p.length > 0 ? p : void 0, metadata: void 0, parallel_tool_calls: this.config.parallelToolCalls, previous_response_id: void 0, ...d ? { reasoning: { effort: d, summary: u } } : {}, service_tier: this.config.serviceTier, store: this.config.store, text: void 0, truncation: void 0, user: this.config.user, seed: this.config.seed };
    this.config.user && (m.user = this.config.user), this.config.parallelToolCalls !== void 0 && (m.parallel_tool_calls = this.config.parallelToolCalls), this.config.responseFormat && (m.text = { format: { type: this.config.responseFormat } }), this.config.seed && (m.seed = this.config.seed);
    let g = e.chatPrompt ? this.createResponsesReqInternalInput(e.chatPrompt, i) : [];
    if (g.length > 0) m.input = g;
    else if (e.chatPrompt && e.chatPrompt.length === 1 && e.chatPrompt[0]?.role === "user" && e.chatPrompt[0]?.content && typeof e.chatPrompt[0].content == "string" && !a) m.input = e.chatPrompt[0].content;
    else if (g.length === 0 && !a) throw new Error("Responses API request must have input or instructions.");
    let h = m.reasoning ?? {};
    if (this.config.reasoningEffort && (h = { ...h, effort: this.config.reasoningEffort }), t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        h = {};
        break;
      case "minimal":
        h = { ...h, effort: "low" };
        break;
      case "low":
        h = { ...h, effort: "medium" };
        break;
      case "medium":
      case "high":
      case "highest":
        h = { ...h, effort: "high" };
        break;
    }
    Object.keys(h).length > 0 && h.effort ? m.reasoning = h : m.reasoning = void 0;
    let f = m;
    return this.responsesReqUpdater && (f = this.responsesReqUpdater(f)), [o, f];
  }
  createChatResp(e) {
    let { id: t, output: n, usage: o } = e;
    o && (this.tokensUsed = { promptTokens: o.prompt_tokens, completionTokens: o.completion_tokens, totalTokens: o.total_tokens });
    let r = {};
    for (let i of n ?? []) switch (i.type) {
      case "message":
        r.id = i.id, r.content = vn(i.content, t), r.finishReason = i.status === "completed" ? "stop" : "content_filter";
        break;
      case "reasoning":
        r.id = i.id, i.encrypted_content ? r.thought = i.encrypted_content : r.thought = i.summary.map((a) => typeof a == "object" ? JSON.stringify(a) : a).join(`
`);
        break;
      case "file_search_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "file_search", params: { queries: i.queries, results: i.results } } }], r.finishReason = "function_call";
        break;
      case "web_search_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "web_search", params: { queries: i.queries } } }], r.finishReason = "function_call";
        break;
      case "computer_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "computer_use", params: { action: i.action } } }], r.finishReason = "function_call";
        break;
      case "code_interpreter_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "code_interpreter", params: { code: i.code, results: i.results } } }], r.finishReason = "function_call";
        break;
      case "image_generation_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "image_generation", params: { result: i.result } } }], r.finishReason = "function_call";
        break;
      case "local_shell_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "local_shell", params: { action: i.action } } }], r.finishReason = "function_call";
        break;
      case "mcp_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: "mcp", params: { name: i.name, args: i.args, serverLabel: i.server_label, output: i.output, error: i.error } } }], r.finishReason = "function_call";
        break;
      case "function_call":
        r.id = i.id, r.functionCalls = [{ id: i.id, type: "function", function: { name: i.name, params: i.arguments } }], r.finishReason = "function_call";
        break;
    }
    return { results: [{ ...r, index: 0 }], remoteId: t };
  }
  createChatStreamResp(e) {
    let t = e, n = { index: 0, id: "", content: "", finishReason: "stop" }, o;
    switch (t.type) {
      case "response.created":
      case "response.in_progress":
      case "response.queued":
        o = t.response.id, n.id = `${t.response.id}_res_0`;
        break;
      case "response.output_item.added":
        switch (t.item.type) {
          case "message":
            n.id = t.item.id, n.content = vn(t.item.content, t.item.id);
            break;
          case "function_call":
            n.id = t.item.id, n.functionCalls = [{ id: t.item.id, type: "function", function: { name: t.item.name, params: t.item.arguments } }];
            break;
          case "file_search_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "file_search", params: { queries: r.queries || [], results: r.results?.map((i) => ({ fileId: i.file_id, filename: i.filename, score: i.score, text: i.text, attributes: i.attributes })) } } }];
            }
            break;
          case "web_search_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "web_search", params: { queries: r.queries || [] } } }];
            }
            break;
          case "computer_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "computer_use", params: { action: r.action || {} } } }];
            }
            break;
          case "code_interpreter_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "code_interpreter", params: { code: r.code || "", results: r.results } } }];
            }
            break;
          case "image_generation_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "image_generation", params: { result: r.result } } }];
            }
            break;
          case "local_shell_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "local_shell", params: { action: r.action || {} } } }];
            }
            break;
          case "mcp_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "mcp", params: { name: r.name || "", args: r.args || "", serverLabel: r.server_label || "", output: r.output, error: r.error } } }];
            }
            break;
        }
        break;
      case "response.content_part.added":
        n.id = t.item_id, n.content = vn([t.part], t.item_id);
        break;
      case "response.output_text.delta":
        n.id = t.item_id, n.content = t.delta;
        break;
      case "response.output_text.done":
        break;
      case "response.function_call_arguments.delta":
        n.id = t.item_id, n.functionCalls = [{ id: t.item_id, type: "function", function: { name: "", params: t.delta } }];
        break;
      case "response.reasoning_summary_text.delta":
        n.id = t.item_id, n.thought = t.delta;
        break;
      case "response.file_search_call.in_progress":
      case "response.file_search_call.searching":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.file_search_call.completed":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.web_search_call.in_progress":
      case "response.web_search_call.searching":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.web_search_call.completed":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.image_generation_call.in_progress":
      case "response.image_generation_call.generating":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.image_generation_call.completed":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.image_generation_call.partial_image":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.mcp_call.in_progress":
        n.id = t.item_id, n.finishReason = "function_call";
        break;
      case "response.mcp_call.arguments.delta":
        n.id = t.item_id, n.functionCalls = [{ id: t.item_id, type: "function", function: { name: "", params: t.delta } }];
        break;
      case "response.mcp_call.arguments.done":
        n.id = t.item_id, n.functionCalls = [{ id: t.item_id, type: "function", function: { name: "", params: t.arguments } }];
        break;
      case "response.mcp_call.completed":
      case "response.mcp_call.failed":
        n.id = "mcp_call_event", n.finishReason = "function_call";
        break;
      case "response.mcp_list_tools.in_progress":
      case "response.mcp_list_tools.completed":
      case "response.mcp_list_tools.failed":
        n.id = "mcp_list_tools_event", n.finishReason = "function_call";
        break;
      case "response.output_item.done":
        switch (t.item.type) {
          case "message":
            n.id = t.item.id, n.finishReason = t.item.status === "completed" ? "stop" : "error";
            break;
          case "function_call":
          case "file_search_call":
          case "web_search_call":
          case "computer_call":
          case "code_interpreter_call":
          case "image_generation_call":
          case "local_shell_call":
          case "mcp_call":
            n.id = t.item.id, n.finishReason = "function_call";
            break;
        }
        break;
      case "response.completed":
        t.response.usage && (this.tokensUsed = { promptTokens: t.response.usage.prompt_tokens, completionTokens: t.response.usage.completion_tokens, totalTokens: t.response.usage.total_tokens }), o = t.response.id, n.id = `${t.response.id}_completed`, n.finishReason = "stop";
        break;
      case "response.failed":
        o = t.response.id, n.id = `${t.response.id}_failed`, n.finishReason = "error";
        break;
      case "response.incomplete":
        o = t.response.id, n.id = `${t.response.id}_incomplete`, n.finishReason = "length";
        break;
      case "error":
        n.id = "error", n.content = `Error: ${t.message}`, n.finishReason = "error";
        break;
      default:
        n.id = "unknown";
        break;
    }
    return { results: [n], remoteId: o };
  }
  createEmbedReq(e) {
    let t = e.embedModel;
    if (!t) throw new Error("Embed model not set");
    if (!e.texts || e.texts.length === 0) throw new Error("Embed texts is empty");
    let n = { name: "/embeddings" }, o = { model: t, input: e.texts, dimensions: this.config.dimensions };
    return [n, o];
  }
};
var vn = (s10, e) => {
  let t = s10.filter((n) => n.type === "refusal");
  if (t.length > 0) {
    let n = t.map((o) => o.refusal).join(`
`);
    throw new O(n, void 0, e);
  }
  return s10.filter((n) => n.type === "output_text").map((n) => n.text).join(`
`);
};
var ft = () => ({ model: "gpt-4o", embedModel: "text-embedding-ada-002", temperature: 0.7, topP: 1, stream: true });
var Ys = () => ({ ...ft(), model: "gpt-4o", temperature: 0.5 });
var Xs = () => ({ ...ft(), model: "gpt-4o", temperature: 0.9 });
var xt = class extends E {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r = [], models: i, responsesReqUpdater: a, supportFor: l = { functions: true, streaming: true, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true } }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    let p = new De(t, n?.streamingUsage ?? true, a), c = i;
    super(p, { name: "OpenAI", apiURL: o || "https://api.openai.com/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: r, defaults: { model: t.model, embedModel: t.embedModel }, options: n, supportFor: l, models: c });
  }
};
var Le = class extends xt {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    r = [...tn, ...r ?? []];
    let i = (a) => {
      let l = K({ model: a, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: l?.hasThinkingBudget ?? false, hasShowThoughts: l?.hasShowThoughts ?? false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    };
    super({ apiKey: e, config: { ...ft(), ...t }, options: n, modelInfo: r, models: o, supportFor: i });
  }
};
async function On(s10, e, t = {}) {
  if (typeof s10 == "string") return [{ type: "text", text: s10 }];
  if (!Array.isArray(s10)) return [{ type: "text", text: String(s10) }];
  let n = e.getFeatures(), o = [];
  for (let r of s10) try {
    switch (r.type) {
      case "text":
        o.push({ type: "text", text: r.text });
        break;
      case "image":
        if (n.media.images.supported) r.altText ? o.push({ type: "text", text: `[Image: ${r.altText}]` }) : o.push({ type: "text", text: "[Image content]" });
        else if (r.altText) o.push({ type: "text", text: r.altText });
        else if (t.imageToText) try {
          let i = await t.imageToText(r.image);
          o.push({ type: "text", text: i });
        } catch (i) {
          throw new X(i, "image", "vision analysis");
        }
        else switch (t.fallbackBehavior) {
          case "error":
            throw new V("Images", e.getName(), false);
          case "skip":
            continue;
          default:
            o.push({ type: "text", text: "[Image content not supported by this provider]" });
        }
        break;
      case "audio":
        if (n.media.audio.supported) r.transcription ? o.push({ type: "text", text: r.transcription }) : o.push({ type: "text", text: "[Audio content]" });
        else if (r.transcription) o.push({ type: "text", text: r.transcription });
        else if (t.audioToText) try {
          let i = await t.audioToText(r.data, r.format);
          o.push({ type: "text", text: i });
        } catch (i) {
          throw new X(i, "audio", "transcription");
        }
        else switch (t.fallbackBehavior) {
          case "error":
            throw new V("Audio", e.getName(), false);
          case "skip":
            continue;
          case "degrade":
            o.push({ type: "text", text: "[Audio content not supported by this provider]" });
        }
        break;
      case "file":
        if (n.media.files.supported) r.extractedText ? o.push({ type: "text", text: r.extractedText }) : o.push({ type: "text", text: `[File: ${r.filename}]` });
        else if (r.extractedText) o.push({ type: "text", text: r.extractedText });
        else if (t.fileToText) try {
          let i = await t.fileToText(r.data, r.mimeType);
          o.push({ type: "text", text: i });
        } catch (i) {
          throw new X(i, "file", "text extraction");
        }
        else switch (t.fallbackBehavior) {
          case "error":
            throw new V("Files", e.getName(), false);
          case "skip":
            continue;
          default:
            o.push({ type: "text", text: `[File: ${r.filename} - content not accessible by this provider]` });
        }
        break;
      case "url":
        if (n.media.urls.supported) r.cachedContent ? o.push({ type: "text", text: r.cachedContent }) : o.push({ type: "text", text: `[Link: ${r.url}${r.title ? ` - ${r.title}` : ""}]` });
        else if (r.cachedContent) o.push({ type: "text", text: r.cachedContent });
        else if (t.urlToText) try {
          let i = await t.urlToText(r.url);
          o.push({ type: "text", text: i });
        } catch (i) {
          throw new X(i, "url", "content fetching");
        }
        else switch (t.fallbackBehavior) {
          case "error":
            throw new V("URLs", e.getName(), false);
          case "skip":
            continue;
          case "degrade":
            o.push({ type: "text", text: `[Link: ${r.url}${r.title ? ` - ${r.title}` : ""}]` });
        }
        break;
      default:
        typeof r == "object" && r.text ? o.push({ type: "text", text: r.text }) : o.push({ type: "text", text: String(r) });
    }
  } catch (i) {
    throw i instanceof V || i instanceof X ? i : new X(i, r.type || "unknown", "content processing");
  }
  return o;
}
function Zs(s10) {
  let e = false, t = false, n = false, o = false;
  for (let r of s10) if (r.role === "user" && Array.isArray(r.content)) for (let i of r.content) switch (i.type) {
    case "image":
      e = true;
      break;
    case "audio":
      t = true;
      break;
    case "file":
      n = true;
      break;
    case "url":
      o = true;
      break;
  }
  return { hasImages: e, hasAudio: t, hasFiles: n, hasUrls: o };
}
var yt = ((n) => (n.RekaCore = "reka-core", n.RekaFlash = "reka-flash", n.RekaEdge = "reka-edge", n))(yt || {});
var Mn = [{ name: "reka-core", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "reka-flash", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 2 }, { name: "reka-edge", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1 }];
var It = () => structuredClone({ model: "reka-core", ...w() });
var ei = () => structuredClone({ ...It(), model: "reka-core" });
var ti = () => structuredClone({ model: "reka-core", ..._() });
var ni = () => ({ ...It(), model: "reka-flash" });
var kn = class {
  constructor(e) {
    this.config = e;
  }
  tokensUsed;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, presencePenalty: e.presencePenalty, frequencyPenalty: e.frequencyPenalty, stopSequences: e.stopSequences, topP: e.topP, n: e.n, stream: e.stream };
  }
  createChatReq = (e) => {
    let t = e.model;
    if (!e.chatPrompt || e.chatPrompt.length === 0) throw new Error("Chat prompt is empty");
    let n = { name: "/chat/completions" }, o = oi(e), r = e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, i = e.modelConfig?.stream ?? this.config.stream, a = { model: t, messages: o, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_k: e.modelConfig?.n ?? this.config.n, top_p: e.modelConfig?.topP ?? this.config.topP ?? 1, stop: e.modelConfig?.stopSequences ?? this.config.stop, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, ...r ? { frequency_penalty: r } : {}, ...i ? { stream: true } : {} };
    return [n, a];
  };
  createChatResp = (e) => {
    let { id: t, usage: n, responses: o } = e;
    return this.tokensUsed = n ? { promptTokens: n.input_tokens, completionTokens: n.output_tokens, totalTokens: n.input_tokens + n.output_tokens } : void 0, { results: o.map((i, a) => {
      let l = vr(i.finish_reason), p;
      return typeof i.message.content == "string" ? p = i.message.content : p = i.message.content.text, { index: a, id: `${t}`, content: p, finishReason: l };
    }), remoteId: t };
  };
  createChatStreamResp = (e) => {
    let { id: t, usage: n, responses: o } = e;
    return this.tokensUsed = n ? { promptTokens: n.input_tokens, completionTokens: n.output_tokens, totalTokens: n.input_tokens + n.output_tokens } : void 0, { results: o.map((i, a) => {
      let l = vr(i.finish_reason), p;
      return typeof i.chunk.content == "string" ? p = i.chunk.content : p = i.chunk.content.text, { index: a, id: `${t}`, content: p, finishReason: l };
    }) };
  };
};
var vr = (s10) => {
  switch (s10) {
    case "stop":
      return "stop";
    case "context":
      return "length";
    case "length":
      return "length";
  }
};
function oi(s10) {
  return s10.chatPrompt.map((e) => {
    switch (e.role) {
      case "system":
        return { role: "user", content: e.content };
      case "user":
        return Array.isArray(e.content) ? { role: "user", content: e.content.map((t) => {
          switch (t.type) {
            case "text":
              return { type: "text", text: t.text };
            case "image":
              throw new Error("Image type not supported");
            default:
              throw new Error("Invalid content type");
          }
        }) } : { role: "user", content: e.content };
      case "assistant":
        if (Array.isArray(e.content)) return { role: "assistant", content: e.content.map((t) => {
          switch (t.type) {
            case "text":
              return { type: "text", text: t.text };
            case "image":
              throw new Error("Image type not supported");
            default:
              throw new Error("Invalid content type");
          }
        }) };
        if (!e.content) throw new Error("Assistant content is empty");
        return { role: "user", content: e.content };
      default:
        throw new Error("Invalid role");
    }
  });
}
var Ge = class extends E {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r = Mn, models: i }) {
    if (!e || e === "") throw new Error("Reka API key not set");
    let a = { ...It(), ...t }, l = new kn(a);
    super(l, { name: "Reka", apiURL: o || "https://api.reka.ai/v1/chat", headers: async () => ({ "X-Api-Key": e }), modelInfo: r, defaults: { model: a.model }, options: n, supportFor: { functions: true, streaming: true, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, models: i });
  }
};
var En = class {
  providers;
  processingServices;
  config;
  constructor(e) {
    this.providers = [e.providers.primary, ...e.providers.alternatives], this.processingServices = e.processing, this.config = e.routing;
  }
  async chat(e, t = {}) {
    let n = await this.selectProviderWithDegradation(e, t.routingOptions || {}), o = await this.preprocessRequest(e, n.provider, t.processingOptions);
    try {
      return { response: await n.provider.chat(o, t), routing: n };
    } catch (r) {
      if (r instanceof V && t.fallbackProviders?.length) return await this.tryFallbackProviders(e, t.fallbackProviders, t);
      throw r;
    }
  }
  async preprocessRequest(e, t, n) {
    let o = { ...n, fallbackBehavior: n?.fallbackBehavior || "degrade", imageToText: n?.imageToText || this.processingServices.imageToText, audioToText: n?.audioToText || this.processingServices.audioToText, fileToText: n?.fileToText || this.processingServices.fileToText, urlToText: n?.urlToText || this.processingServices.urlToText }, r = [];
    for (let i of e.chatPrompt) if (i.role === "user" && Array.isArray(i.content)) {
      let a = await On(i.content, t, o);
      a.every((p) => p.type === "text") && a.length === 1 ? r.push({ ...i, content: a[0].text }) : r.push({ ...i, content: a.map((p) => ({ type: "text", text: p.text })) });
    } else r.push(i);
    return { ...e, chatPrompt: r };
  }
  async selectProviderWithDegradation(e, t) {
    let n = he(e), o = [], r = [], i = [];
    try {
      let a = pn(e, this.providers, { requireExactMatch: t.requireExactMatch ?? this.config.capability.requireExactMatch, allowDegradation: t.allowDegradation ?? this.config.capability.allowDegradation }), l = a.getFeatures();
      return n.hasImages && !l.media.images.supported && (r.push("Images will be converted to text descriptions"), o.push("Image-to-text conversion")), n.hasAudio && !l.media.audio.supported && (r.push("Audio will be transcribed to text"), o.push("Audio-to-text transcription")), n.hasFiles && !l.media.files.supported && (r.push("File content will be extracted to text"), o.push("File-to-text extraction")), n.hasUrls && !l.media.urls.supported && (r.push("URL content will be pre-fetched"), o.push("URL content fetching")), n.requiresStreaming && !l.streaming && i.push("Streaming not supported - will use non-streaming mode"), n.requiresCaching && !l.caching.supported && i.push("Content caching not supported"), { provider: a, processingApplied: o, degradations: r, warnings: i };
    } catch (a) {
      throw new Error(`Provider selection failed: ${a instanceof Error ? a.message : "Unknown error"}`);
    }
  }
  async tryFallbackProviders(e, t, n) {
    for (let o of t) try {
      let r = { provider: o, processingApplied: ["Fallback provider selection"], degradations: ["Using fallback provider due to primary provider failure"], warnings: [] }, i = await this.preprocessRequest(e, o, { fallbackBehavior: "degrade" });
      return { response: await o.chat(i, n), routing: r };
    } catch {
    }
    throw new Error("All fallback providers failed");
  }
  async getRoutingRecommendation(e) {
    return await this.selectProviderWithDegradation(e, {});
  }
  async validateRequest(e) {
    let t = he(e), n = [], o = [];
    try {
      let r = await this.selectProviderWithDegradation(e, {});
      return r.degradations.length > 0 && (n.push(...r.degradations), o.push("Consider using a provider that natively supports all media types")), r.warnings.length > 0 && n.push(...r.warnings), t.hasImages && this.processingServices.imageToText === void 0 && (this.providers.some((a) => a.getFeatures().media.images.supported) || (n.push("No image processing service available and no providers support images"), o.push("Add imageToText processing service or use image-capable provider"))), t.hasAudio && this.processingServices.audioToText === void 0 && (this.providers.some((a) => a.getFeatures().media.audio.supported) || (n.push("No audio processing service available and no providers support audio"), o.push("Add audioToText processing service or use audio-capable provider"))), { canHandle: n.length === 0 || r.degradations.length > 0, issues: n, recommendations: o };
    } catch (r) {
      return { canHandle: false, issues: [`Cannot route request: ${r instanceof Error ? r.message : "Unknown error"}`], recommendations: ["Add more providers or processing services to handle this request"] };
    }
  }
  getRoutingStats() {
    let e = {};
    for (let t of this.providers) {
      let n = t.getFeatures(), o = t.getName();
      n.functions && (e.Functions = e.Functions || [], e.Functions.push(o)), n.streaming && (e.Streaming = e.Streaming || [], e.Streaming.push(o)), n.media.images.supported && (e.Images = e.Images || [], e.Images.push(o)), n.media.audio.supported && (e.Audio = e.Audio || [], e.Audio.push(o)), n.media.files.supported && (e.Files = e.Files || [], e.Files.push(o)), n.media.urls.supported && (e.URLs = e.URLs || [], e.URLs.push(o)), n.caching.supported && (e.Caching = e.Caching || [], e.Caching.push(o));
    }
    return { totalProviders: this.providers.length, capabilityMatrix: e, recommendedProvider: this.providers[0]?.getName() || "None" };
  }
};
var Pn = [];
var Or = () => structuredClone({ model: "mistralai/Mixtral-8x7B-Instruct-v0.1", ...w() });
var Ne = class extends F {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Together API key not set");
    let i = { ...Or(), ...t };
    r = [...Pn, ...r ?? []];
    let a = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    super({ apiKey: e, config: i, options: n, apiURL: "https://api.together.xyz/v1", modelInfo: r, models: o, supportFor: a }), super.setName("Together");
  }
};
function Fn(s10) {
  let e = (n) => JSON.stringify(n, null, 2);
  if (!s10) throw new Error(`Chat request message item cannot be null or undefined, received: ${e(s10)}`);
  let t = s10?.role;
  if (!t) throw new Error(`Chat request message must have a role, received: ${e(t)}`);
  switch (t) {
    case "system": {
      let n = s10;
      if (!n.content || n.content.trim() === "") throw new Error(`System message content cannot be empty or whitespace-only, received: ${e(n.content)}`);
      break;
    }
    case "user": {
      let n = s10;
      if (!n.content) throw new Error(`User message content cannot be undefined, received: ${e(n.content)}`);
      if (typeof n.content == "string") {
        if (n.content.trim() === "") throw new Error(`User message content cannot be empty or whitespace-only, received: ${e(n.content)}`);
      } else if (Array.isArray(n.content)) {
        if (n.content.length === 0) throw new Error(`User message content array cannot be empty, received: ${e(n.content)}`);
        for (let o = 0; o < n.content.length; o++) {
          let r = n.content[o];
          if (!r || typeof r != "object") throw new Error(`User message content item at index ${o} must be an object, received: ${e(r)}`);
          let i = r?.type;
          if (!i) throw new Error(`User message content item at index ${o} must have a type, received: ${e(i)}`);
          switch (i) {
            case "text": {
              let a = r;
              if (!a.text || a.text.trim() === "") throw new Error(`User message text content at index ${o} cannot be empty or whitespace-only, received: ${e(a.text)}`);
              break;
            }
            case "image": {
              let a = r;
              if (!a.image || a.image.trim() === "") throw new Error(`User message image content at index ${o} cannot be empty, received: ${e(a.image)}`);
              if (!a.mimeType || a.mimeType.trim() === "") throw new Error(`User message image content at index ${o} must have a mimeType, received: ${e(a.mimeType)}`);
              break;
            }
            case "audio": {
              let a = r;
              if (!a.data || a.data.trim() === "") throw new Error(`User message audio content at index ${o} cannot be empty, received: ${e(a.data)}`);
              break;
            }
            default:
              throw new Error(`User message content item at index ${o} has unsupported type: ${e(i)}`);
          }
        }
      } else throw new Error(`User message content must be a string or array of content objects, received: ${e(n.content)}`);
      break;
    }
    case "assistant": {
      let n = s10;
      if (!n.content && !n.functionCalls) throw new Error(`Assistant message must have either content or function calls, received content: ${e(n.content)}, functionCalls: ${e(n.functionCalls)}`);
      if (n.content && typeof n.content != "string") throw new Error(`Assistant message content must be a string, received: ${e(n.content)}`);
      if (n.functionCalls && !Array.isArray(n.functionCalls)) throw new Error(`Assistant message function calls must be an array, received: ${e(n.functionCalls)}`);
      break;
    }
    case "function": {
      let n = s10;
      if (!n.functionId || n.functionId.trim() === "") throw new Error(`Function message must have a non-empty functionId, received: ${e(n.functionId)}`);
      if (n.result === void 0 || n.result === null) throw new Error(`Function message must have a result, received: ${e(n.result)}`);
      if (typeof n.result != "string") throw new Error(`Function message result must be a string, received: ${e(n.result)}`);
      break;
    }
    default:
      throw new Error(`Unsupported message role: ${e(t)}`);
  }
}
function _n(s10) {
  let e = (n) => JSON.stringify(n, null, 2), t = Array.isArray(s10) ? s10 : [s10];
  if (t.length === 0) throw new Error(`Chat response results cannot be empty, received: ${e(t)}`);
  for (let n = 0; n < t.length; n++) {
    let o = t[n];
    if (!o) throw new Error(`Chat response result at index ${n} cannot be null or undefined, received: ${e(o)}`);
    if (typeof o.index != "number") throw new Error(`Chat response result at index ${n} must have a numeric index, received: ${e(o.index)}`);
    if (o.index < 0) throw new Error(`Chat response result at index ${n} must have a non-negative index, received: ${e(o.index)}`);
    if (!o.content && !o.thought && !o.functionCalls && !o.finishReason) throw new Error(`Chat response result at index ${n} must have at least one of: content, thought, functionCalls, or finishReason, received: ${e({ content: o.content, thought: o.thought, functionCalls: o.functionCalls, finishReason: o.finishReason })}`);
    if (o.content !== void 0 && typeof o.content != "string") throw new Error(`Chat response result content at index ${n} must be a string, received: ${e(o.content)}`);
    if (o.thought !== void 0 && typeof o.thought != "string") throw new Error(`Chat response result thought at index ${n} must be a string, received: ${e(o.thought)}`);
    if (o.name !== void 0) {
      if (typeof o.name != "string") throw new Error(`Chat response result name at index ${n} must be a string, received: ${e(o.name)}`);
      if (o.name.trim() === "") throw new Error(`Chat response result name at index ${n} cannot be empty or whitespace-only, received: ${e(o.name)}`);
    }
    if (o.annotations !== void 0) {
      if (!Array.isArray(o.annotations)) throw new Error(`Chat response result annotations at index ${n} must be an array, received: ${e(o.annotations)}`);
      for (let r = 0; r < o.annotations.length; r++) {
        let i = o.annotations[r];
        if (!i || typeof i != "object") throw new Error(`Chat response result annotation at index ${n}[${r}] must be an object, received: ${e(i)}`);
        if (i.type !== "url_citation") throw new Error(`Chat response result annotation at index ${n}[${r}] must have type 'url_citation', received: ${e(i.type)}`);
        if (!i.url_citation || typeof i.url_citation != "object") throw new Error(`Chat response result annotation at index ${n}[${r}] must have a valid url_citation object, received: ${e(i.url_citation)}`);
        if (typeof i.url_citation.url != "string") throw new Error(`Chat response result annotation at index ${n}[${r}] url_citation.url must be a string, received: ${e(i.url_citation.url)}`);
      }
    }
    if (o.id !== void 0) {
      if (typeof o.id != "string") throw new Error(`Chat response result id at index ${n} must be a string, received: ${e(o.id)}`);
      if (o.id.trim() === "") throw new Error(`Chat response result id at index ${n} cannot be empty or whitespace-only, received: ${e(o.id)}`);
    }
    if (o.functionCalls !== void 0) {
      if (!Array.isArray(o.functionCalls)) throw new Error(`Chat response result functionCalls at index ${n} must be an array, received: ${e(o.functionCalls)}`);
      for (let r = 0; r < o.functionCalls.length; r++) {
        let i = o.functionCalls[r];
        if (!i) throw new Error(`Function call at index ${r} in result ${n} cannot be null or undefined, received: ${e(i)}`);
        if (!i.id || typeof i.id != "string" || i.id.trim() === "") throw new Error(`Function call at index ${r} in result ${n} must have a non-empty string id, received: ${e(i.id)}`);
        if (i.type !== "function") throw new Error(`Function call at index ${r} in result ${n} must have type 'function', received: ${e(i.type)}`);
        if (!i.function) throw new Error(`Function call at index ${r} in result ${n} must have a function object, received: ${e(i.function)}`);
        if (!i.function.name || typeof i.function.name != "string" || i.function.name.trim() === "") throw new Error(`Function call at index ${r} in result ${n} must have a non-empty function name, received: ${e(i.function.name)}`);
        if (i.function.params !== void 0 && typeof i.function.params != "string" && typeof i.function.params != "object") throw new Error(`Function call params at index ${r} in result ${n} must be a string or object, received: ${e(i.function.params)}`);
      }
    }
    if (o.finishReason !== void 0) {
      let r = ["stop", "length", "function_call", "content_filter", "error"];
      if (!r.includes(o.finishReason)) throw new Error(`Chat response result finishReason at index ${n} must be one of: ${r.join(", ")}, received: ${e(o.finishReason)}`);
    }
  }
}
var bt = ((d) => (d.Llama31_8B_Instruct = "Llama-3.1-8B-Instruct-q4f32_1-MLC", d.Llama31_70B_Instruct = "Llama-3.1-70B-Instruct-q4f16_1-MLC", d.Llama32_1B_Instruct = "Llama-3.2-1B-Instruct-q4f32_1-MLC", d.Llama32_3B_Instruct = "Llama-3.2-3B-Instruct-q4f32_1-MLC", d.Mistral7B_Instruct = "Mistral-7B-Instruct-v0.3-q4f32_1-MLC", d.Phi35_Mini_Instruct = "Phi-3.5-mini-instruct-q4f32_1-MLC", d.Gemma2_2B_Instruct = "gemma-2-2b-it-q4f32_1-MLC", d.Gemma2_9B_Instruct = "gemma-2-9b-it-q4f32_1-MLC", d.Qwen2_5_0_5B_Instruct = "Qwen2.5-0.5B-Instruct-q4f32_1-MLC", d.Qwen2_5_1_5B_Instruct = "Qwen2.5-1.5B-Instruct-q4f32_1-MLC", d.Qwen2_5_3B_Instruct = "Qwen2.5-3B-Instruct-q4f32_1-MLC", d.Qwen2_5_7B_Instruct = "Qwen2.5-7B-Instruct-q4f32_1-MLC", d))(bt || {});
var Dn = [{ name: "Llama-3.1-8B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 4096 }, { name: "Llama-3.1-70B-Instruct-q4f16_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 4096, isExpensive: true }, { name: "Llama-3.2-1B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 2048 }, { name: "Llama-3.2-3B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 2048 }, { name: "Mistral-7B-Instruct-v0.3-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 4096 }, { name: "Phi-3.5-mini-instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 4096 }, { name: "gemma-2-2b-it-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 8192, maxTokens: 2048 }, { name: "gemma-2-9b-it-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 8192, maxTokens: 2048 }, { name: "Qwen2.5-0.5B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 2048 }, { name: "Qwen2.5-1.5B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 2048 }, { name: "Qwen2.5-3B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 2048 }, { name: "Qwen2.5-7B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 4096 }];
var Mr = () => structuredClone({ model: "Llama-3.2-3B-Instruct-q4f32_1-MLC", ...w() });
var ri = () => structuredClone({ model: "Llama-3.2-3B-Instruct-q4f32_1-MLC", ..._() });
var Ln = class {
  constructor(e, t) {
    this.config = e;
    this.engine = t;
  }
  tokensUsed;
  engine;
  getTokenUsage() {
    return this.tokensUsed;
  }
  getModelConfig() {
    let { config: e } = this;
    return { maxTokens: e.maxTokens, temperature: e.temperature, topP: e.topP, topK: e.topK, presencePenalty: e.presencePenalty, frequencyPenalty: e.frequencyPenalty, stopSequences: e.stopSequences, endSequences: e.endSequences, stream: e.stream, n: e.n };
  }
  createChatReq(e) {
    let t = e.model, n = e.chatPrompt.map((a) => {
      if (a.role === "function") return { role: "function", name: a.functionId, content: typeof a.result == "string" ? a.result : JSON.stringify(a.result) };
      let l = "";
      typeof a.content == "string" ? l = a.content : Array.isArray(a.content) && (l = a.content.filter((c) => c.type === "text").map((c) => c.text).join(`
`));
      let p = { role: a.role, content: l };
      return a.role === "assistant" && a.functionCalls?.length ? { ...p, tool_calls: a.functionCalls.map((c) => ({ id: c.id, type: "function", function: { name: c.function.name, arguments: typeof c.function.params == "string" ? c.function.params : JSON.stringify(c.function.params || {}) } })) } : p;
    }), o = e.functions?.map((a) => ({ type: "function", function: { name: a.name, description: a.description, parameters: a.parameters || { type: "object", properties: {} } } })), r = { name: "/chat/completions", localCall: async (a, l) => {
      try {
        let p = await this.engine.chat.completions.create({ ...a, stream: l || false });
        return l ? new ReadableStream({ async start(c) {
          try {
            for await (let u of p) c.enqueue(u);
            c.close();
          } catch (u) {
            c.error(u);
          }
        } }) : p;
      } catch (p) {
        throw new Error(`WebLLM API error: ${p}`);
      }
    } }, i = { model: t, messages: n, ...o?.length ? { tools: o } : {}, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_p: e.modelConfig?.topP ?? this.config.topP, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, stop: e.modelConfig?.stopSequences ?? this.config.stopSequences, stream: e.modelConfig?.stream ?? this.config.stream, n: e.modelConfig?.n ?? this.config.n };
    return [r, i];
  }
  createEmbedReq = (e) => {
    throw new Error("WebLLM does not support embeddings");
  };
  createChatResp = (e) => (this.tokensUsed = { promptTokens: e.usage?.prompt_tokens ?? 0, completionTokens: e.usage?.completion_tokens ?? 0, totalTokens: e.usage?.total_tokens ?? 0 }, { results: e.choices.map((n, o) => {
    let r = "stop";
    switch (n.finish_reason) {
      case "stop":
        r = "stop";
        break;
      case "length":
        r = "length";
        break;
      case "tool_calls":
        r = "function_call";
        break;
      case "content_filter":
        r = "content_filter";
        break;
      default:
        r = "stop";
        break;
    }
    let i = n.message.tool_calls?.map((a) => ({ id: a.id, type: "function", function: { name: a.function.name, params: a.function.arguments } }));
    return { index: o, id: e.id, content: n.message.content || "", functionCalls: i, finishReason: r };
  }), remoteId: e.id });
  createChatStreamResp = (e, t) => {
    let n = t, o = e.choices[0];
    if (!o) throw new Error("No choice in WebLLM stream response");
    if (o.delta.content && (n.content = (n.content || "") + o.delta.content), o.delta.tool_calls) {
      n.toolCalls || (n.toolCalls = []);
      for (let l of o.delta.tool_calls) {
        let p = n.toolCalls[l.index];
        p ? l.function?.arguments && (p.function.arguments = (p.function?.arguments || "") + l.function.arguments) : n.toolCalls[l.index] = { id: l.id, type: l.type, function: { name: l.function?.name, arguments: l.function?.arguments || "" } };
      }
    }
    e.usage && (this.tokensUsed = { promptTokens: e.usage.prompt_tokens, completionTokens: e.usage.completion_tokens, totalTokens: e.usage.total_tokens });
    let r;
    if (o.finish_reason) switch (o.finish_reason) {
      case "stop":
        r = "stop";
        break;
      case "length":
        r = "length";
        break;
      case "tool_calls":
        r = "function_call";
        break;
      case "content_filter":
        r = "content_filter";
        break;
      default:
        r = "stop";
        break;
    }
    let i = n.toolCalls?.map((l) => ({ id: l.id || "", type: "function", function: { name: l.function?.name || "", params: l.function?.arguments || "" } }));
    return { results: [{ index: 0, id: e.id, content: n.content || "", functionCalls: i, finishReason: r }], remoteId: e.id };
  };
  createEmbedResp(e) {
    throw new Error("WebLLM does not support embeddings");
  }
};
var $e = class extends E {
  constructor({ engine: e, config: t, options: n, models: o }) {
    if (!e) throw new Error("WebLLM engine instance is required");
    let r = { ...Mr(), ...t }, i = new Ln(r, e);
    super(i, { name: "WebLLM", apiURL: void 0, headers: async () => ({}), modelInfo: Dn, defaults: { model: r.model }, supportFor: (a) => ({ functions: true, streaming: true, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }), options: n, models: o });
  }
};
var Rt = ((o) => (o.Grok3 = "grok-3", o.Grok3Mini = "grok-3-mini", o.Grok3Fast = "grok-3-fast", o.Grok3MiniFast = "grok-3-mini-fast", o))(Rt || {});
var kr = ((e) => (e.GrokEmbedSmall = "grok-embed-small", e))(kr || {});
var Gn = [{ name: "grok-3", currency: "USD", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "grok-3-mini", currency: "USD", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.5, hasThinkingBudget: true }, { name: "grok-3-fast", currency: "USD", promptTokenCostPer1M: 5, completionTokenCostPer1M: 25 }, { name: "grok-3-mini-fast", currency: "USD", promptTokenCostPer1M: 0.6, completionTokenCostPer1M: 4, hasThinkingBudget: true }];
var Nn = () => structuredClone({ model: "grok-3-mini", ...w() });
var si = () => structuredClone({ ...Nn(), model: "grok-3" });
var Ue = class extends F {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Grok API key not set");
    let i = { ...Nn(), ...t };
    r = [...Gn, ...r ?? []];
    let a = (p) => {
      let c = K({ model: p, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: c?.hasThinkingBudget ?? false, hasShowThoughts: c?.hasShowThoughts ?? false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    }, l = (p) => {
      if (n?.searchParameters) {
        let c = n.searchParameters;
        return { ...p, search_parameters: { mode: c.mode, return_citations: c.returnCitations, from_date: c.fromDate, to_date: c.toDate, max_search_results: c.maxSearchResults, sources: c.sources?.map((u) => ({ type: u.type, country: u.country, excluded_websites: u.excludedWebsites, allowed_websites: u.allowedWebsites, safe_search: u.safeSearch, x_handles: u.xHandles, links: u.links })) } };
      }
      return p;
    };
    super({ apiKey: e, config: i, options: n, apiURL: "https://api.x.ai/v1", modelInfo: r, models: o, supportFor: a, chatReqUpdater: l }), super.setName("Grok");
  }
};
function ii(s10) {
  return Ct.create(s10);
}
var Ct = class s5 {
  ai;
  static create(e) {
    return new s5(e);
  }
  constructor(e) {
    switch (e.name) {
      case "openai":
        this.ai = new we(e);
        break;
      case "openai-responses":
        this.ai = new Le(e);
        break;
      case "azure-openai":
        this.ai = new Se(e);
        break;
      case "grok":
        this.ai = new Ue(e);
        break;
      case "huggingface":
        this.ai = new Pe(e);
        break;
      case "groq":
        this.ai = new Ee(e);
        break;
      case "together":
        this.ai = new Ne(e);
        break;
      case "cohere":
        this.ai = new ve(e);
        break;
      case "google-gemini":
        this.ai = new Me(e);
        break;
      case "anthropic":
        this.ai = new be(e);
        break;
      case "mistral":
        this.ai = new Fe(e);
        break;
      case "deepseek":
        this.ai = new Oe(e);
        break;
      case "ollama":
        this.ai = new _e(e);
        break;
      case "reka":
        this.ai = new Ge(e);
        break;
      case "webllm":
        this.ai = new $e(e);
        break;
      default:
        throw new Error("Unknown AI");
    }
  }
  getName() {
    return this.ai.getName();
  }
  getId() {
    return this.ai.getId();
  }
  getFeatures(e) {
    return this.ai.getFeatures(e);
  }
  getModelList() {
    return this.ai.getModelList();
  }
  getLastUsedChatModel() {
    return this.ai.getLastUsedChatModel();
  }
  getLastUsedEmbedModel() {
    return this.ai.getLastUsedEmbedModel();
  }
  getLastUsedModelConfig() {
    return this.ai.getLastUsedModelConfig();
  }
  getMetrics() {
    return this.ai.getMetrics();
  }
  async chat(e, t) {
    return await this.ai.chat(e, t);
  }
  async embed(e, t) {
    return await this.ai.embed(e, t);
  }
  setOptions(e) {
    this.ai.setOptions(e);
  }
  getOptions() {
    return this.ai.getOptions();
  }
  getLogger() {
    return this.ai.getLogger();
  }
};
var W = class {
  name;
  fetch;
  tracer;
  _upsert;
  _batchUpsert;
  _query;
  constructor({ name: e, fetch: t, tracer: n }) {
    this.name = e, this.fetch = t, this.tracer = n;
  }
  async upsert(e, t) {
    if (!this._upsert) throw new Error("upsert() not implemented");
    return this.tracer ? await this.tracer.startActiveSpan("DB Upsert Request", { kind: SpanKind.SERVER, attributes: { [T.DB_SYSTEM]: this.name, [T.DB_OPERATION_NAME]: "upsert", [T.DB_TABLE]: e.table, [T.DB_NAMESPACE]: e.namespace, [T.DB_OPERATION_NAME]: t ? "update" : "insert" } }, async (n) => {
      try {
        return await this._upsert(e, t, { span: n });
      } finally {
        n.end();
      }
    }) : await this._upsert(e, t);
  }
  async batchUpsert(e, t) {
    if (!this._batchUpsert) throw new Error("batchUpsert() not implemented");
    if (e.length === 0) throw new Error("Batch request is empty");
    if (!e[0]) throw new Error("Batch request is invalid first element is undefined");
    return this.tracer ? await this.tracer.startActiveSpan("DB Batch Upsert Request", { kind: SpanKind.SERVER, attributes: { [T.DB_SYSTEM]: this.name, [T.DB_OPERATION_NAME]: "upsert", [T.DB_TABLE]: e[0].table, [T.DB_NAMESPACE]: e[0].namespace, [T.DB_OPERATION_NAME]: t ? "update" : "insert" } }, async (n) => {
      try {
        return await this._batchUpsert(e, t, { span: n });
      } finally {
        n.end();
      }
    }) : await this._batchUpsert(e, t);
  }
  async query(e) {
    if (!this._query) throw new Error("query() not implemented");
    return this.tracer ? await this.tracer.startActiveSpan("DB Query Request", { kind: SpanKind.SERVER, attributes: { [T.DB_SYSTEM]: this.name, [T.DB_OPERATION_NAME]: "upsert", [T.DB_TABLE]: e.table, [T.DB_NAMESPACE]: e.namespace, [T.DB_OPERATION_NAME]: "query" } }, async (t) => {
      try {
        return await this._query(e, { span: t });
      } finally {
        t.end();
      }
    }) : await this._query(e);
  }
};
var Un = "https://api.cloudflare.com/client/v4/accounts/";
var Be = class extends W {
  apiKey;
  accountId;
  constructor({ apiKey: e, accountId: t, fetch: n, tracer: o }) {
    if (!e || !t) throw new Error("Cloudflare credentials not set");
    super({ name: "Cloudflare", fetch: n, tracer: o }), this.apiKey = e, this.accountId = t;
  }
  _upsert = async (e, t, n) => {
    let o = await B({ url: new URL(`${this.accountId}/vectorize/indexes/${e.table}/upsert`, Un), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: n?.span }, { id: e.id, values: e.values, namespace: e.namespace, metadata: e.metadata });
    if (o.errors) throw new Error(`Cloudflare upsert failed: ${o.errors.map(({ message: r }) => r).join(", ")}`);
    return { ids: o.result.ids };
  };
  batchUpsert = async (e, t, n) => {
    if (t) throw new Error("Weaviate does not support batch update");
    if (e.length < 1) throw new Error("Batch request is empty");
    if (!e[0] || !e[0].table) throw new Error("Table name is empty");
    let o = e[0].table, r = await B({ url: new URL(`${this.accountId}/vectorize/indexes/${o}/upsert`, Un), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: n?.span }, e.map((i) => ({ id: i.id, values: i.values, namespace: i.namespace, metadata: i.metadata })));
    if (r.errors) throw new Error(`Cloudflare batch upsert failed: ${r.errors.map(({ message: i }) => i).join(", ")}`);
    return { ids: r.result.ids };
  };
  query = async (e, t) => {
    let n = await B({ url: new URL(`${this.accountId}/vectorize/indexes/${e.table}/query`, Un), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: t?.span }, { vector: e.values, topK: e.limit || 10, returnValues: true });
    if (n.errors) throw new Error(`Cloudflare query failed: ${n.errors.map(({ message: r }) => r).join(", ")}`);
    return { matches: n.result.matches.map(({ id: r, score: i, values: a, metadata: l }) => ({ id: r, score: i, values: a, metadata: l })) };
  };
};
var se = class extends W {
  state;
  constructor({ tracer: e } = {}) {
    super({ name: "Memory", tracer: e }), this.state = {};
  }
  _upsert = async (e, t, n) => {
    if (!this.state[e.table]) this.state[e.table] = { [e.id]: e };
    else {
      let o = this.state[e.table];
      if (!o) throw new Error(`Table not found: ${e.table}`);
      o[e.id] = e;
    }
    return { ids: [e.id] };
  };
  _batchUpsert = async (e, t, n) => {
    let o = [];
    for (let r of e) {
      let i = await this.upsert(r, t);
      o.push(...i.ids);
    }
    return { ids: o };
  };
  _query = async (e, t) => {
    let n = this.state[e.table];
    if (!n) return { matches: [] };
    let o = [];
    return Object.entries(n).forEach(([r, i]) => {
      if (e.values && i.values) {
        let a = ai(e.values, i.values);
        o.push({ id: r, score: a, metadata: i.metadata });
      }
    }), o.sort((r, i) => r.score - i.score), e.limit && (o.length = e.limit), { matches: o };
  };
  getDB = () => structuredClone(this.state);
  setDB = (e) => {
    this.state = structuredClone(e);
  };
  clearDB = () => {
    this.state = {};
  };
};
var ai = (s10, e) => {
  if (s10.length !== e.length) throw new Error("Vectors must be of the same length.");
  let t = 0, n = 0, o = 0, r = true, i = true, a = new Float64Array(s10), l = new Float64Array(e);
  for (let d = 0; d < a.length; d++) t += a[d] * l[d], n += a[d] * a[d], o += l[d] * l[d], a[d] !== 0 && (r = false), l[d] !== 0 && (i = false);
  if (r || i) return 1;
  let p = Math.sqrt(n), c = Math.sqrt(o);
  return 1 - t / (p * c);
};
var li = (s10) => ({ namespace: s10.namespace, topK: s10.limit || 10, filter: {}, includeValues: true, includeMetadata: true, vector: s10.values ?? [], id: s10.id });
var qe = class extends W {
  apiKey;
  apiURL;
  constructor({ apiKey: e, host: t, fetch: n, tracer: o }) {
    if (!e || e === "") throw new Error("Pinecone API key not set");
    super({ name: "Pinecone", fetch: n, tracer: o }), this.apiKey = e, this.apiURL = t;
  }
  _upsert = async (e, t, n) => (await this._batchUpsert([e], t, n), { ids: [e.id] });
  _batchUpsert = async (e, t, n) => {
    if (e.length === 0) throw new Error("Batch request is empty");
    return await B({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/vectors/upsert", fetch: this.fetch, span: n?.span }, e.map(({ id: o, values: r = [], metadata: i }) => ({ id: o, values: r, metadata: i }))), { ids: e.map(({ id: o }) => o) };
  };
  query = async (e, t) => {
    if (e.text) throw new Error("Pinecone does not support text");
    return { matches: (await B({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/query", fetch: this.fetch, span: t?.span }, li(e))).matches.map(({ id: r, score: i, values: a, metadata: l }) => ({ id: r, score: i, metadata: l, values: a })) };
  };
};
var ze = class extends W {
  apiKey;
  apiURL;
  constructor({ apiKey: e, host: t, fetch: n, tracer: o }) {
    if (!e || e === "") throw new Error("Weaviate API key not set");
    super({ name: "Weaviate", fetch: n, tracer: o }), this.apiKey = e, this.apiURL = t;
  }
  _upsert = async (e, t, n) => {
    let o = await B({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: `/v1/objects/${e.table}/${e.id}`, put: !!t, fetch: this.fetch, span: n?.span }, { id: e.id, class: e.table, tenant: e.namespace, vector: e.values, properties: e.metadata ?? {} });
    if (o?.result?.errors) throw new Error(`Weaviate upsert failed: ${o.result.errors.error.map(({ message: r }) => r).join(", ")}`);
    return { ids: [o.id] };
  };
  _batchUpsert = async (e, t, n) => {
    if (t) throw new Error("Weaviate does not support batch update");
    if (e.length === 0) throw new Error("Batch request is empty");
    let o = e.map((i) => ({ id: i.id, class: i.table, tenant: i.namespace, vector: i.values, properties: i.metadata ?? {} })), r = await B({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/v1/batch/objects", fetch: this.fetch, span: n?.span }, { objects: o });
    if (r?.some(({ result: i }) => i?.errors)) throw new Error(`Weaviate batch upsert failed: ${r.map(({ result: i }) => i?.errors?.error.map(({ message: a }) => a).join(", ")).join(", ")}`);
    return { ids: r.map(({ id: i }) => i) };
  };
  _query = async (e, t) => {
    let n = "";
    if (e.columns && e.columns.length === 0) throw new Error("Weaviate requires at least one column");
    if (e.values) n = `nearVector: {
            vector: [${e.values.join(",")}],
        }`;
    else if (e.text) n = `nearText: {
            concepts: ['${e.text}'],
        }`;
    else throw new Error("Weaviate requires either text or values");
    let o = await B({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/v1/graphql", fetch: this.fetch, span: t?.span }, { query: `{
          Get {
            ${e.table} (
              limit: ${e.limit || 10},
              ${n}
            ) {
                ${e.columns?.join(`
`)}
            }
          }
        }` });
    if (o.errors) throw new Error(`Weaviate query failed: ${o.errors.map(({ message: a }) => a).join(", ")}`);
    let r = o.data.Get[e.table];
    return r ? { matches: r.map((a) => ({ id: a.id, score: 1, metadata: a })) } : { matches: [] };
  };
};
var Bn = class {
  db;
  constructor(e) {
    switch (e.name) {
      case "weaviate":
        this.db = new ze(e);
        break;
      case "pinecone":
        this.db = new qe(e);
        break;
      case "cloudflare":
        this.db = new Be(e);
        break;
      case "memory":
        this.db = new se(e);
        break;
      default:
        throw new Error("Unknown DB");
    }
  }
  async upsert(e, t) {
    return await this.db.upsert(e, t);
  }
  async batchUpsert(e, t) {
    return await this.db.batchUpsert(e, t);
  }
  async query(e) {
    return await this.db.query(e);
  }
};
var qn = "_internal";
var zn = class {
  ai;
  db;
  chunker;
  rewriter;
  reranker;
  constructor({ ai: e, db: t, config: n }) {
    this.ai = e, this.db = t, this.chunker = n?.chunker ?? this.defaultChunker, this.reranker = n?.reranker, this.rewriter = n?.rewriter;
  }
  defaultChunker = (e) => e.split(/\n\n+/);
  insert = async (e, t) => {
    try {
      let n = Array.isArray(e) ? e.join(`

`) : e, o = this.chunker(n).filter((p) => p.length > 0), r = t?.maxWordsPerChunk, i = t?.minWordsPerChunk, a = pi({ initialChunks: o, minWordsPerChunk: i, maxWordsPerChunk: r }), l = t?.batchSize ?? 10;
      for (let p = 0; p < a.length; p += l) {
        let c = a.slice(p, p + l), d = (await this.ai.embed({ texts: c }, { abortSignal: t?.abortSignal })).embeddings.map((m, g) => ({ id: `chunk_${Date.now() + g}`, table: qn, values: m, metadata: { text: c[g] ?? "" } })).filter((m) => m.metadata?.text && m.metadata?.text.length > 0);
        await this.db.batchUpsert(d);
      }
    } catch (n) {
      throw new Error(`Error processing text: ${n}`);
    }
  };
  query = async (e, { topPercent: t, abortSignal: n } = {}) => {
    let o = Array.isArray(e) ? e : [e];
    if (typeof o[0] == "string" && this.rewriter) for (let [l, p] of o.entries()) {
      let { rewrittenQuery: c } = await this.rewriter.forward(this.ai, { query: p });
      o[l] = c;
    }
    let r;
    typeof o[0] == "string" ? r = (await this.ai.embed({ texts: o }, { abortSignal: n })).embeddings.map((p) => this.db.query({ table: qn, values: p })) : r = o.map((l) => this.db.query({ table: qn, values: l }));
    let i = await Promise.all(r), a = [];
    for (let { matches: l } of i) {
      let p = l.filter((d) => d.metadata?.text && d.metadata?.text.length > 0).map(({ score: d, metadata: m }) => ({ score: d, text: m?.text ?? "" })), c = t && t > 1 ? t / 100 : t, u = c ? ci(p, c) : p;
      if (this.reranker) {
        let { rankedItems: d } = await this.reranker.forward(this.ai, { query: o[0], items: u.map((g) => g.text) }), m = d.map((g) => u.find((h) => h.text === g)).filter((g) => g !== void 0);
        a.push(m);
      } else a.push(u);
    }
    return a;
  };
};
var pi = ({ initialChunks: s10, maxWordsPerChunk: e = 350, minWordsPerChunk: t = 250 }) => {
  let n = [], o = "", r = 0;
  return s10.forEach((i) => {
    let a = i.split(/\s+/), l = a.length;
    if (r + l <= e) o += `${i}

`, r += l;
    else if (r > 0 && r + l <= e * 1.5) o += `${i}

`, r += l;
    else if (r > t && (n.push(o.trim()), o = "", r = 0), l > e) {
      let p = a;
      for (; p.length > e * 1.5; ) {
        let c = p.splice(0, e);
        n.push(c.join(" "));
      }
      p.length > 0 && (o += `${p.join(" ")}

`, r += p.length);
    } else o = `${i}

`, r = l;
  }), (r > t || n.length === 0) && n.push(o.trim()), n;
};
var ci = (s10, e = 0.1) => {
  let t = [...s10].sort((o, r) => o.score - r.score), n = Math.ceil(t.length * e);
  return t.slice(0, n);
};
var je = class {
  data = [];
  addRequest(e, t) {
    this.data.push(...e.map((n) => {
      let o = structuredClone(n);
      return { role: n.role, chat: [{ index: t, value: o }] };
    }));
  }
  addFunctionResults(e) {
    let t = e.map(({ index: o, ...r }) => ({ index: o, value: structuredClone(r) })), n = this.getLast();
    n?.role === "function" ? n.chat.push(...t) : this.data.push({ role: "function", chat: t });
  }
  addResponse(e) {
    let t = e.map(({ index: n, ...o }) => ({ index: n, value: structuredClone(o) }));
    this.data.push({ role: "assistant", chat: t });
  }
  updateResult({ content: e, name: t, functionCalls: n, index: o }) {
    let r = this.data.at(-1);
    if (!r || r.role !== "assistant" || r.role === "assistant" && !r.updatable) {
      this.data.push({ role: "assistant", updatable: true, chat: [{ index: o, value: structuredClone({ content: e, name: t, functionCalls: n }) }] });
      return;
    }
    let i = r.chat.find((a) => a.index === o);
    if (!i) {
      r.chat.push({ index: o, value: structuredClone({ content: e, name: t, functionCalls: n }) });
      return;
    }
    typeof e == "string" && e.trim() !== "" && (i.value.content = e), typeof t == "string" && t.trim() !== "" && (i.value.name = t), Array.isArray(n) && n.length > 0 && (i.value.functionCalls = n);
  }
  addTag(e) {
    let t = this.data.at(-1);
    t && (t.tags || (t.tags = []), t.tags.includes(e) || t.tags.push(e));
  }
  rewindToTag(e) {
    let t = this.data.findIndex((n) => n.tags?.includes(e));
    if (t === -1) throw new Error(`Tag "${e}" not found`);
    return this.data.splice(t);
  }
  removeByTag(e) {
    let t = this.data.reduce((n, o, r) => (o.tags?.includes(e) && n.push(r), n), []);
    if (t.length === 0) throw new Error(`No items found with tag "${e}"`);
    return t.reverse().map((n) => this.data.splice(n, 1).at(0)).filter((n) => n !== void 0).reverse();
  }
  history(e) {
    let t = [];
    for (let { role: n, chat: o } of this.data) {
      let r;
      n === "function" ? r = o.filter((i) => i.index === e).map((i) => i.value) : r = o.find((i) => i.index === e)?.value, Array.isArray(r) && r.length > 0 ? t.push(...r.map((i) => ({ ...i, role: n }))) : typeof r == "object" && r !== null && t.push({ ...r, role: n });
    }
    return t;
  }
  getLast() {
    return this.data.at(-1);
  }
  reset() {
    this.data = [];
  }
};
var He = class {
  memories = /* @__PURE__ */ new Map();
  defaultMemory;
  constructor() {
    this.defaultMemory = new je();
  }
  getMemory(e) {
    return e ? (this.memories.has(e) || this.memories.set(e, new je()), this.memories.get(e)) : this.defaultMemory;
  }
  addRequest(e, t) {
    for (let n of e) Fn(n);
    this.getMemory(t).addRequest(e, 0);
  }
  addResponse(e, t) {
    _n(e), this.getMemory(t).addResponse(e);
  }
  addFunctionResults(e, t) {
    this.getMemory(t).addFunctionResults(e);
  }
  updateResult(e, t) {
    this.getMemory(t).updateResult(e);
  }
  addTag(e, t) {
    this.getMemory(t).addTag(e);
  }
  rewindToTag(e, t) {
    return this.getMemory(t).rewindToTag(e);
  }
  history(e, t) {
    return this.getMemory(t).history(e);
  }
  getLast(e) {
    return this.getMemory(e).getLast();
  }
  reset(e) {
    e ? this.memories.set(e, new je()) : this.defaultMemory.reset();
  }
};
var ie = class extends Error {
  constructor({ message: e }) {
    super(e), this.name = this.constructor.name;
  }
  getFixingInstructions = () => {
    let e = [], t = this.message.trim();
    return e.push({ name: "error", title: "Follow these instructions", description: t + (t.endsWith(".") ? "" : ".") }), e;
  };
  toString() {
    return `${this.name}: ${this.message}`;
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t) {
    return this.toString();
  }
};
var Tt = async (s10, e) => {
  for (let t of s10) {
    let { fn: n, message: o } = t, r = await n(e);
    if (r !== void 0 && !r) throw o ? new ie({ message: o }) : new Error("Assertion Failed: No message provided for assertion");
  }
};
var jn = async (s10, e, t, n = false) => {
  if (!e.currField || e.s === -1 || !s10 || s10.length === 0) return;
  let o = s10.filter((i) => i.fieldName === e.currField?.name);
  if (o.length === 0) return;
  let r = t.substring(e.s);
  for (let i of o) {
    let { message: a, fn: l } = i, p = await l(r, n);
    if (p !== void 0 && !p && a) throw new ie({ message: a });
  }
};
var Er = { enabled: true, enabledCategories: ["generation", "streaming", "functions", "errors", "performance"], maxLabelLength: 100, samplingRate: 1 };
var Ke;
var Hn = (s10) => {
  if (Ke) return Ke;
  let e = s10 ?? M.meter;
  if (e) return Ke = di(e), Ke;
};
var ui = () => {
  let s10 = [];
  return M.meter || s10.push("Global meter not initialized"), !Ke && M.meter && s10.push("Metrics instruments not created despite available meter"), { healthy: s10.length === 0, issues: s10 };
};
var di = (s10) => ({ generationLatencyHistogram: s10.createHistogram("ax_gen_generation_duration_ms", { description: "End-to-end duration of AxGen generation requests", unit: "ms" }), generationRequestsCounter: s10.createCounter("ax_gen_generation_requests_total", { description: "Total number of AxGen generation requests" }), generationErrorsCounter: s10.createCounter("ax_gen_generation_errors_total", { description: "Total number of failed AxGen generations" }), multiStepGenerationsCounter: s10.createCounter("ax_gen_multistep_generations_total", { description: "Total number of generations that required multiple steps" }), stepsPerGenerationHistogram: s10.createHistogram("ax_gen_steps_per_generation", { description: "Number of steps taken per generation" }), maxStepsReachedCounter: s10.createCounter("ax_gen_max_steps_reached_total", { description: "Total number of generations that hit max steps limit" }), validationErrorsCounter: s10.createCounter("ax_gen_validation_errors_total", { description: "Total number of validation errors encountered" }), assertionErrorsCounter: s10.createCounter("ax_gen_assertion_errors_total", { description: "Total number of assertion errors encountered" }), errorCorrectionAttemptsHistogram: s10.createHistogram("ax_gen_error_correction_attempts", { description: "Number of error correction attempts per generation" }), errorCorrectionSuccessCounter: s10.createCounter("ax_gen_error_correction_success_total", { description: "Total number of successful error corrections" }), errorCorrectionFailureCounter: s10.createCounter("ax_gen_error_correction_failure_total", { description: "Total number of failed error corrections" }), maxRetriesReachedCounter: s10.createCounter("ax_gen_max_retries_reached_total", { description: "Total number of generations that hit max retries limit" }), functionsEnabledGenerationsCounter: s10.createCounter("ax_gen_functions_enabled_generations_total", { description: "Total number of generations with functions enabled" }), functionCallStepsCounter: s10.createCounter("ax_gen_function_call_steps_total", { description: "Total number of steps that included function calls" }), functionsExecutedPerGenerationHistogram: s10.createHistogram("ax_gen_functions_executed_per_generation", { description: "Number of unique functions executed per generation" }), functionErrorCorrectionCounter: s10.createCounter("ax_gen_function_error_correction_total", { description: "Total number of function-related error corrections" }), fieldProcessorsExecutedCounter: s10.createCounter("ax_gen_field_processors_executed_total", { description: "Total number of field processors executed" }), streamingFieldProcessorsExecutedCounter: s10.createCounter("ax_gen_streaming_field_processors_executed_total", { description: "Total number of streaming field processors executed" }), streamingGenerationsCounter: s10.createCounter("ax_gen_streaming_generations_total", { description: "Total number of streaming generations" }), streamingDeltasEmittedCounter: s10.createCounter("ax_gen_streaming_deltas_emitted_total", { description: "Total number of streaming deltas emitted" }), streamingFinalizationLatencyHistogram: s10.createHistogram("ax_gen_streaming_finalization_duration_ms", { description: "Duration of streaming response finalization", unit: "ms" }), samplesGeneratedHistogram: s10.createHistogram("ax_gen_samples_generated", { description: "Number of samples generated per request" }), resultPickerUsageCounter: s10.createCounter("ax_gen_result_picker_usage_total", { description: "Total number of times result picker was used" }), resultPickerLatencyHistogram: s10.createHistogram("ax_gen_result_picker_duration_ms", { description: "Duration of result picker execution", unit: "ms" }), inputFieldsGauge: s10.createGauge("ax_gen_input_fields", { description: "Number of input fields in signature" }), outputFieldsGauge: s10.createGauge("ax_gen_output_fields", { description: "Number of output fields in signature" }), examplesUsedGauge: s10.createGauge("ax_gen_examples_used", { description: "Number of examples used in generation" }), demosUsedGauge: s10.createGauge("ax_gen_demos_used", { description: "Number of demos used in generation" }), promptRenderLatencyHistogram: s10.createHistogram("ax_gen_prompt_render_duration_ms", { description: "Duration of prompt template rendering", unit: "ms" }), extractionLatencyHistogram: s10.createHistogram("ax_gen_extraction_duration_ms", { description: "Duration of value extraction from responses", unit: "ms" }), assertionLatencyHistogram: s10.createHistogram("ax_gen_assertion_duration_ms", { description: "Duration of assertion checking", unit: "ms" }), stateCreationLatencyHistogram: s10.createHistogram("ax_gen_state_creation_duration_ms", { description: "Duration of state creation for multiple samples", unit: "ms" }), memoryUpdateLatencyHistogram: s10.createHistogram("ax_gen_memory_update_duration_ms", { description: "Duration of memory updates during generation", unit: "ms" }) });
var wt = Er;
var mi = (s10) => {
  wt = { ...wt, ...s10 };
};
var gi = () => ({ ...wt });
var J = (s10) => {
  let e = {};
  for (let [t, n] of Object.entries(s10)) if (n != null) {
    let o = String(n), r = wt.maxLabelLength;
    e[t] = o.length > r ? o.substring(0, r) : o;
  }
  return e;
};
var Pr = (s10, e, t, n, o, r) => {
  try {
    let i = J({ success: t.toString(), ...n ? { signature: n } : {}, ...o ? { ai_service: o } : {}, ...r ? { model: r } : {} });
    s10.generationLatencyHistogram && s10.generationLatencyHistogram.record(e, i), s10.generationRequestsCounter && s10.generationRequestsCounter.add(1, i), !t && s10.generationErrorsCounter && s10.generationErrorsCounter.add(1, i);
  } catch (i) {
    console.warn("Failed to record generation metric:", i);
  }
};
var St = (s10, e, t, n) => {
  try {
    let o = J({ ...n ? { signature: n } : {} });
    e > 1 && s10.multiStepGenerationsCounter && s10.multiStepGenerationsCounter.add(1, o), s10.stepsPerGenerationHistogram && s10.stepsPerGenerationHistogram.record(e, o), e >= t && s10.maxStepsReachedCounter && s10.maxStepsReachedCounter.add(1, o);
  } catch (o) {
    console.warn("Failed to record multi-step metric:", o);
  }
};
var Kn = (s10, e, t) => {
  try {
    let n = J({ error_type: e, ...t ? { signature: t } : {} });
    e === "validation" && s10.validationErrorsCounter && s10.validationErrorsCounter.add(1, n), e === "assertion" && s10.assertionErrorsCounter && s10.assertionErrorsCounter.add(1, n);
  } catch (n) {
    console.warn("Failed to record validation error metric:", n);
  }
};
var Fr = (s10, e) => {
  try {
    let t = J({ error_type: "refusal", ...e ? { signature: e } : {} });
    s10.validationErrorsCounter && s10.validationErrorsCounter.add(1, t);
  } catch (t) {
    console.warn("Failed to record refusal error metric:", t);
  }
};
var Vn = (s10, e, t, n, o) => {
  try {
    let r = J({ success: t.toString(), ...o ? { signature: o } : {} });
    s10.errorCorrectionAttemptsHistogram && s10.errorCorrectionAttemptsHistogram.record(e, r), t && s10.errorCorrectionSuccessCounter && s10.errorCorrectionSuccessCounter.add(1, r), t || (s10.errorCorrectionFailureCounter && s10.errorCorrectionFailureCounter.add(1, r), e >= n && s10.maxRetriesReachedCounter && s10.maxRetriesReachedCounter.add(1, r));
  } catch (r) {
    console.warn("Failed to record error correction metric:", r);
  }
};
var Wn = (s10, e, t, n, o = false, r) => {
  try {
    let i = J({ functions_enabled: e.toString(), had_function_calls: n.toString(), ...r ? { signature: r } : {} });
    e && s10.functionsEnabledGenerationsCounter && s10.functionsEnabledGenerationsCounter.add(1, i), n && s10.functionCallStepsCounter && s10.functionCallStepsCounter.add(1, i), t > 0 && s10.functionsExecutedPerGenerationHistogram && s10.functionsExecutedPerGenerationHistogram.record(t, i), o && s10.functionErrorCorrectionCounter && s10.functionErrorCorrectionCounter.add(1, i);
  } catch (i) {
    console.warn("Failed to record function calling metric:", i);
  }
};
var _r = (s10, e, t, n) => {
  try {
    let o = J({ ...n ? { signature: n } : {} });
    e > 0 && s10.fieldProcessorsExecutedCounter && s10.fieldProcessorsExecutedCounter.add(e, o), t > 0 && s10.streamingFieldProcessorsExecutedCounter && s10.streamingFieldProcessorsExecutedCounter.add(t, o);
  } catch (o) {
    console.warn("Failed to record field processing metric:", o);
  }
};
var Dr = (s10, e, t, n, o) => {
  try {
    let r = J({ is_streaming: e.toString(), ...o ? { signature: o } : {} });
    e && s10.streamingGenerationsCounter && s10.streamingGenerationsCounter.add(1, r), t > 0 && s10.streamingDeltasEmittedCounter && s10.streamingDeltasEmittedCounter.add(t, r), n && s10.streamingFinalizationLatencyHistogram && s10.streamingFinalizationLatencyHistogram.record(n, r);
  } catch (r) {
    console.warn("Failed to record streaming metric:", r);
  }
};
var Lr = (s10, e, t, n, o) => {
  try {
    let r = J({ result_picker_used: t.toString(), ...o ? { signature: o } : {} });
    s10.samplesGeneratedHistogram && s10.samplesGeneratedHistogram.record(e, r), t && s10.resultPickerUsageCounter && s10.resultPickerUsageCounter.add(1, r), n && s10.resultPickerLatencyHistogram && s10.resultPickerLatencyHistogram.record(n, r);
  } catch (r) {
    console.warn("Failed to record samples metric:", r);
  }
};
var Gr = (s10, e, t, n, o, r) => {
  try {
    let i = J({ ...r ? { signature: r } : {} });
    s10.inputFieldsGauge && s10.inputFieldsGauge.record(e, i), s10.outputFieldsGauge && s10.outputFieldsGauge.record(t, i), s10.examplesUsedGauge && s10.examplesUsedGauge.record(n, i), s10.demosUsedGauge && s10.demosUsedGauge.record(o, i);
  } catch (i) {
    console.warn("Failed to record signature complexity metrics:", i);
  }
};
var vt = (s10, e, t, n) => {
  try {
    let o = J({ metric_type: e, ...n ? { signature: n } : {} });
    switch (e) {
      case "prompt_render":
        s10.promptRenderLatencyHistogram && s10.promptRenderLatencyHistogram.record(t, o);
        break;
      case "extraction":
        s10.extractionLatencyHistogram && s10.extractionLatencyHistogram.record(t, o);
        break;
      case "assertion":
        s10.assertionLatencyHistogram && s10.assertionLatencyHistogram.record(t, o);
        break;
      case "state_creation":
        s10.stateCreationLatencyHistogram && s10.stateCreationLatencyHistogram.record(t, o);
        break;
      case "memory_update":
        s10.memoryUpdateLatencyHistogram && s10.memoryUpdateLatencyHistogram.record(t, o);
        break;
    }
  } catch (o) {
    console.warn("Failed to record performance metric:", o);
  }
};
var D = class extends Error {
  fields;
  constructor({ message: e, fields: t }) {
    super(e), this.fields = t, this.name = this.constructor.name;
  }
  getFixingInstructions = () => {
    let e = (t) => {
      let n = (() => {
        switch (t?.name) {
          case "string":
            return "string";
          case "number":
            return "number";
          case "boolean":
            return "boolean";
          case "date":
            return 'date ("YYYY-MM-DD" format)';
          case "datetime":
            return 'date time ("YYYY-MM-DD HH:mm Timezone" format)';
          case "json":
            return "JSON object";
          case "class":
            return "classification class";
          case "code":
            return "code";
          default:
            return "string";
        }
      })();
      return t?.isArray ? `json array of ${n} items` : n;
    };
    return this.fields.map((t) => ({ name: "outputError", title: "Output Correction Required", description: `The section labeled '${t.title}' does not match the expected format of '${e(t.type)}'. ${this.message} Please revise your response to ensure it conforms to the specified format.` }));
  };
  toString() {
    let e = (t) => {
      let n = (() => {
        switch (t?.name) {
          case "string":
            return "string";
          case "number":
            return "number";
          case "boolean":
            return "boolean";
          case "date":
            return 'date ("YYYY-MM-DD" format)';
          case "datetime":
            return 'date time ("YYYY-MM-DD HH:mm Timezone" format)';
          case "json":
            return "JSON object";
          case "class":
            return "classification class";
          case "code":
            return "code";
          default:
            return "string";
        }
      })();
      return t?.isArray ? `json array of ${n} items` : n;
    };
    return [`${this.name}: ${this.message}`, ...this.fields.map((t) => `  - ${t.title}: Expected format '${e(t.type)}'`)].join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](e, t) {
    return this.toString();
  }
};
var Nr = ({ error: s10, errCount: e, debug: t, logger: n, metricsInstruments: o, signatureName: r, span: i }) => {
  let a = s10.getFixingInstructions();
  if (t && n) {
    let l = a?.map((p) => p.title).join(", ") ?? "";
    zo(s10, e, l, n);
  }
  return o && Kn(o, "validation", r), i && i.addEvent("validation.error", { message: s10.toString(), fixing_instructions: a?.map((l) => l.title).join(", ") ?? "" }), a;
};
var $r = ({ error: s10, errCount: e, debug: t, logger: n, metricsInstruments: o, signatureName: r, span: i }) => {
  let a = s10.getFixingInstructions();
  if (t && n) {
    let l = a?.map((p) => p.title).join(", ") ?? "";
    jo(s10, e, l, n);
  }
  return o && Kn(o, "assertion", r), i && i.addEvent("assertion.error", { message: s10.toString(), fixing_instructions: a?.map((l) => l.title).join(", ") ?? "" }), a;
};
var Ur = ({ error: s10, errCount: e, debug: t, logger: n, metricsInstruments: o, signatureName: r, span: i }) => {
  t && n && Ho(s10, e, n), o && Fr(o, r), i && i.addEvent("refusal.error", { message: s10.toString() });
};
var Br = (s10) => {
  let e = [], t = (n, o = "") => {
    if (!n || typeof n != "object") return;
    let r = ["array", "integer", "number", "string", "boolean", "null", "object"];
    if (n.anyOf && Array.isArray(n.anyOf)) {
      n.anyOf.length === 0 && e.push({ path: o || "root", issue: "anyOf array is empty", fix: "Add at least one schema to the anyOf array", example: 'anyOf: [{ type: "string" }, { type: "null" }]' }), n.anyOf.forEach((i, a) => {
        t(i, `${o}anyOf[${a}].`);
      });
      return;
    }
    if (n.oneOf && Array.isArray(n.oneOf)) {
      n.oneOf.length === 0 && e.push({ path: o || "root", issue: "oneOf array is empty", fix: "Add at least one schema to the oneOf array", example: 'oneOf: [{ type: "string" }, { type: "number" }]' }), n.oneOf.forEach((i, a) => {
        t(i, `${o}oneOf[${a}].`);
      });
      return;
    }
    if (n.allOf && Array.isArray(n.allOf)) {
      n.allOf.length === 0 && e.push({ path: o || "root", issue: "allOf array is empty", fix: "Add at least one schema to the allOf array", example: 'allOf: [{ type: "object" }, { properties: { name: { type: "string" } } }]' }), n.allOf.forEach((i, a) => {
        t(i, `${o}allOf[${a}].`);
      });
      return;
    }
    if (n.type) {
      if (!r.includes(n.type)) {
        e.push({ path: o || "root", issue: `Invalid type '${n.type}'`, fix: `Change type to one of: ${r.join(", ")}`, example: '{ type: "string" } or { type: "object" }' });
        return;
      }
      if (n.type === "object") {
        if (n.properties) if (typeof n.properties != "object" || Array.isArray(n.properties)) e.push({ path: o || "root", issue: "properties must be an object, not an array or primitive", fix: "Change properties to be an object with property names as keys", example: 'properties: { name: { type: "string" }, age: { type: "number" } }' });
        else for (let i in n.properties) {
          let a = n.properties[i];
          if (a != null) {
            if (typeof a != "object") {
              e.push({ path: `${o}${i}`, issue: `Property schema must be an object, got ${typeof a}`, fix: "Define the property as a proper schema object", example: `${i}: { type: "string", description: "..." }` });
              continue;
            }
            t(a, `${o}${i}.`);
          }
        }
        if (n.required) {
          if (!Array.isArray(n.required)) e.push({ path: o || "root", issue: `'required' must be an array, got ${typeof n.required}`, fix: "Change required to be an array of property names", example: 'required: ["name", "email"] instead of required: "name,email"' });
          else if (n.required.length !== 0) {
            if (n.properties) for (let i of n.required) typeof i != "string" ? e.push({ path: `${o}required`, issue: `Required property names must be strings, got ${typeof i}`, fix: "Ensure all items in required array are strings", example: 'required: ["name", "email"] not required: [123, "email"]' }) : i in n.properties || e.push({ path: `${o}required`, issue: `Required property '${i}' is not defined in properties`, fix: `Either add '${i}' to properties or remove it from required`, example: `properties: { ${i}: { type: "string" } }` });
          }
        }
      }
      n.type === "array" && n.items && (typeof n.items != "object" ? e.push({ path: `${o}items`, issue: `Array items schema must be an object, got ${typeof n.items}`, fix: "Define items as a proper schema object", example: 'items: { type: "string" } or items: { type: "object", properties: {...} }' }) : t(n.items, `${o}items.`));
    }
  };
  if (t(s10), e.length > 0) {
    let n = ["JSON Schema validation failed:", "", ...e.map((o, r) => {
      let i = [`${r + 1}. Path: ${o.path}`, `   Issue: ${o.issue}`, `   Fix: ${o.fix}`];
      return o.example && i.push(`   Example: ${o.example}`), i.join(`
`);
    }), "", "Please fix these issues and try again."].join(`
`);
    throw new Error(n);
  }
};
var Ot = class extends Error {
  constructor(t) {
    super();
    this.fields = t;
    this.name = this.constructor.name;
  }
  getFields = () => this.fields;
  toString() {
    return [`${this.name}: Function validation error`, ...this.fields.map((t) => `  - ${t.field}: ${t.message}`)].join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](t, n) {
    return this.toString();
  }
};
var Mt = class extends Error {
  constructor(t, n, o) {
    super();
    this.fields = t;
    this.func = n;
    this.funcId = o;
  }
  getFunctionId = () => this.funcId;
  getFieldDescription(t) {
    if (!this.func.parameters?.properties?.[t]) return "";
    let n = this.func.parameters.properties[t], o = n.description;
    return n.enum?.length && (o += ` Allowed values are: ${n.enum.join(", ")}`), o;
  }
  getFixingInstructions = () => {
    let t = this.fields.map((n) => {
      let o = this.getFieldDescription(n.field) || "";
      return `- \`${n.field}\` - ${n.message} (${o}).`;
    });
    return `Errors In Function Arguments: Fix the following invalid arguments to '${this.func.name}'
${t.join(`
`)}`;
  };
  toString() {
    return [`${this.name}: Function execution error in '${this.func.name}'`, ...this.fields.map((t) => {
      let n = this.getFieldDescription(t.field);
      return `  - ${t.field}: ${t.message}${n ? ` (${n})` : ""}`;
    }), this.funcId ? `  Function ID: ${this.funcId}` : ""].join(`
`);
  }
  [Symbol.for("nodejs.util.inspect.custom")](t, n) {
    return this.toString();
  }
};
var kt = class {
  funcList = [];
  constructor(e) {
    this.funcList = e;
  }
  executeFunction = async (e, t, n) => {
    let o;
    typeof t.args == "string" && t.args.length > 0 ? o = JSON.parse(t.args) : o = t.args;
    let r = n ? { sessionId: n.sessionId, ai: n.ai } : void 0, i;
    return e.parameters ? i = e.func.length === 2 ? await e.func(o, r) : await e.func(o) : i = e.func.length === 1 ? await e.func(r) : await e.func(), (n?.functionResultFormatter ?? M.functionResultFormatter)(i);
  };
  execute = async (e, t) => {
    let n = this.funcList.find((o) => o.name.localeCompare(e.name) === 0);
    if (!n) throw new Error(`Function not found: ${e.name}`);
    if (!n.func) throw new Error(`No handler for function: ${e.name}`);
    try {
      return await this.executeFunction(n, e, t);
    } catch (o) {
      throw o instanceof Ot ? new Mt(o.getFields(), n, e.id) : o;
    }
  };
};
var Jn = (s10, e) => {
  if (s10.length === 0) return [...e ?? []];
  let t = s10.map((n) => "toFunction" in n ? n.toFunction() : n).flat();
  for (let n of t.filter((o) => o.parameters)) n.parameters && Br(n.parameters);
  return [...e ?? [], ...t];
};
var Qn = async ({ ai: s10, functionList: e, functionCalls: t, mem: n, sessionId: o, span: r, excludeContentFromTrace: i, index: a, functionResultFormatter: l, logger: p }) => {
  let c = new kt(e), u = /* @__PURE__ */ new Set(), d = t.map((h) => {
    if (!h.id) throw new Error(`Function ${h.name} did not return an ID`);
    return c.execute(h, { sessionId: o, ai: s10, functionResultFormatter: l }).then((A) => {
      if (u.add(h.name.toLowerCase()), r) {
        let x = { name: h.name };
        i || (x.args = h.args, x.result = A ?? ""), r.addEvent("function.call", x);
      }
      return { result: A ?? "", role: "function", functionId: h.id, index: a };
    }).catch((A) => {
      if (!(A instanceof Mt)) throw A;
      let x = A.getFixingInstructions();
      if (r) {
        let y = { name: h.name, message: A.toString() };
        i || (y.args = h.args, y.fixing_instructions = x), r.addEvent("function.error", y);
      }
      return s10.getOptions().debug && qo(A, a, x, p), { functionId: h.id, isError: true, index: a, result: x, role: "function" };
    });
  }), g = (await Promise.all(d)).filter((h) => h !== void 0);
  if (n.addFunctionResults(g, o), s10.getOptions().debug) {
    let h = g.filter((f) => !f.isError);
    h.length > 0 && Bo(h, p);
  }
  return g.some((h) => h.isError) && n.addTag("error", o), u;
};
function Yn(s10, e, t, n) {
  if (!e || e.length === 0) return;
  if (!s10.getFeatures(n).functions) throw new Error("Functions are not supported by the AI service");
  return e.map((r) => ({ id: r.id, name: r.function.name, args: r.function.params }));
}
function qr(s10, e, t) {
  let n = e;
  return !t && (n === "required" || typeof n == "function") ? { functions: [], functionCall: void 0 } : s10 ? { functions: s10.map((r) => "toFunction" in r ? r.toFunction() : r).flat(), functionCall: n } : { functions: [], functionCall: n };
}
import_dayjs.default.extend(import_utc.default);
import_dayjs.default.extend(import_timezone.default);
import_dayjs.default.extend(import_customParseFormat.default);
function zr(s10, e, t = false) {
  try {
    return fi(e);
  } catch (n) {
    if (s10.isOptional && !t) return;
    let o = n.message;
    throw new D({ fields: [s10], message: o, value: e });
  }
}
function fi(s10) {
  if (!(0, import_dayjs.default)(s10, "YYYY-MM-DD", true).isValid()) throw new Error('Invalid date format. Please provide the date in "YYYY-MM-DD" format.');
  return import_dayjs.default.utc(s10, "YYYY-MM-DD").startOf("day").toDate();
}
function jr(s10, e, t = false) {
  try {
    return yi(e);
  } catch (n) {
    if (s10.isOptional && !t) return;
    let o = n.message;
    throw new D({ fields: [s10], message: o, value: e });
  }
}
function yi(s10) {
  let e = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?) (.+)$/, t = s10.match(e);
  if (!t) throw new Error('Invalid date and time format. Please provide the date and time in "YYYY-MM-DD HH:mm" or "YYYY-MM-DD HH:mm:ss" format, followed by the timezone.');
  let [, n, o] = t;
  if (!n || !o) throw new Error('Invalid date and time format. Please provide the date and time in "YYYY-MM-DD HH:mm" or "YYYY-MM-DD HH:mm:ss" format, followed by the timezone.');
  try {
    let r = n.includes(":") && n.split(":").length === 3 ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm", i = import_dayjs.default.tz(n, r, o);
    if (!i.isValid()) throw new Error("Invalid date and time values. Please ensure all components are correct.");
    return i.utc().toDate();
  } catch {
    throw new Error(`Unrecognized time zone ${o}. Please provide a valid time zone name, abbreviation, or offset. For example, "America/New_York", or "EST".`);
  }
}
var Hr = (s10) => (0, import_dayjs.default)(s10).utc().format("YYYY-MM-DD HH:mm:ss [UTC]");
var Iu = new L();
var Et = (s10, e) => {
  let t = s10.type ?? { name: "string", isArray: false }, n = (p, c) => {
    switch (p) {
      case "class":
        return typeof c == "string";
      case "code":
        return typeof c == "string";
      case "string":
        return typeof c == "string";
      case "number":
        return typeof c == "number";
      case "boolean":
        return typeof c == "boolean";
      case "date":
        return c instanceof Date || typeof c == "string";
      case "datetime":
        return c instanceof Date || typeof c == "string";
      case "json":
        return typeof c == "object" || typeof c == "string";
      default:
        return false;
    }
  }, o = (p) => !(!p || typeof p != "object" || !("mimeType" in p) || !("data" in p));
  if (s10.type?.name === "image") {
    let p;
    if (Array.isArray(e)) {
      for (let c of e) if (!o(c)) {
        p = "object ({ mimeType: string; data: string })";
        break;
      }
    } else o(e) || (p = "object ({ mimeType: string; data: string })");
    if (p) throw new Error(`Validation failed: Expected '${s10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let r = (p) => !(!p || typeof p != "object" || !("data" in p));
  if (s10.type?.name === "audio") {
    let p;
    if (Array.isArray(e)) {
      for (let c of e) if (!r(c)) {
        p = "object ({ data: string; format?: string })";
        break;
      }
    } else r(e) || (p = "object ({ data: string; format?: string })");
    if (p) throw new Error(`Validation failed: Expected '${s10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let i = (p) => !(!p || typeof p != "object" || !("filename" in p) || !("mimeType" in p) || !("data" in p));
  if (s10.type?.name === "file") {
    let p;
    if (Array.isArray(e)) {
      for (let c of e) if (!i(c)) {
        p = "object ({ filename: string; mimeType: string; data: string })";
        break;
      }
    } else i(e) || (p = "object ({ filename: string; mimeType: string; data: string })");
    if (p) throw new Error(`Validation failed: Expected '${s10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let a = (p) => typeof p == "string" ? true : !(!p || typeof p != "object" || !("url" in p));
  if (s10.type?.name === "url") {
    let p;
    if (Array.isArray(e)) {
      for (let c of e) if (!a(c)) {
        p = "string or object ({ url: string; title?: string; description?: string })";
        break;
      }
    } else a(e) || (p = "string or object ({ url: string; title?: string; description?: string })");
    if (p) throw new Error(`Validation failed: Expected '${s10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let l = true;
  if (t.isArray) {
    if (!Array.isArray(e)) l = false;
    else for (let p of e) if (!n(t.name, p)) {
      l = false;
      break;
    }
  } else l = n(t.name, e);
  if (!l) {
    let p = Array.isArray(e) ? "array" : typeof e;
    throw new Error(`Validation failed: Expected '${s10.name}' to be a ${s10.type?.isArray ? "an array of " : ""}${t.name} instead got '${p}' (${JSON.stringify(e)})`);
  }
};
function Ve(s10) {
  let e = {};
  for (let t of s10) {
    let n = `${t.ai}:${t.model}`;
    if (!e[n]) {
      e[n] = { ...t };
      continue;
    }
    let o = e[n];
    if (o) {
      let r = o.tokens ?? { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
      r.promptTokens += t?.tokens?.promptTokens ?? 0, r.completionTokens += t?.tokens?.completionTokens ?? 0, r.totalTokens += t?.tokens?.totalTokens ?? 0, o.tokens = r;
    }
  }
  return Object.values(e);
}
var Kr = (s10) => {
  if (!s10.trim()) return [];
  let e = /* @__PURE__ */ new Set(["-", "*", "+"]), t = /^\d+[\s]*[.)\]]\s*/, n = s10.split(`
`), o = [];
  for (let r of n) {
    let i = r.trim();
    if (i) {
      if (i[0] && e.has(i[0])) o.push(i.slice(1).trim());
      else if (t.test(i)) o.push(i.replace(t, "").trim());
      else if (o.length !== 0) throw new Error("Could not parse markdown list: mixed content detected");
    }
  }
  if (o.length === 0) throw new Error("Could not parse markdown list: no valid list items found");
  return o;
};
function Zn(s10, e) {
  let { index: t, delta: n, version: o } = e, r = s10.find((i) => i.index === t)?.delta;
  if (!r) return s10.push({ index: t, delta: n, version: o }), s10;
  for (let i of Object.keys(n)) {
    let a = r[i], l = n[i];
    a === void 0 && Array.isArray(l) ? r[i] = [...l] : Array.isArray(a) && Array.isArray(l) ? r[i] = [...a, ...l] : (a === void 0 || typeof a == "string") && typeof l == "string" ? r[i] = `${a ?? ""}${l}` : r[i] = l;
  }
  return s10;
}
var Xn = class {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(e) {
    this.maxSize = e;
  }
  get(e) {
    let t = this.cache.get(e);
    return t && (this.cache.delete(e), this.cache.set(e, t)), t;
  }
  set(e, t) {
    if (this.cache.has(e)) this.cache.delete(e);
    else if (this.cache.size >= this.maxSize) {
      let n = this.cache.keys().next().value;
      n && this.cache.delete(n);
    }
    this.cache.set(e, t);
  }
};
var Ii = new Xn(500);
function eo(s10, e, t = 0, n = Ii) {
  if (/^```[a-zA-Z]*\s*$/.test(s10)) return -4;
  if (/^[\s`]*$/.test(s10)) return -3;
  let o = s10.indexOf(e, t);
  if (o !== -1) return o;
  let r = n.get(e) ?? Array.from({ length: e.length }, (a, l) => e.slice(0, l + 1));
  n.get(e) || n.set(e, r);
  let i = -1;
  for (let a = r.length - 1; a >= 0; a--) {
    let l = r[a];
    if (s10.endsWith(l)) {
      i = a;
      break;
    }
  }
  return i >= 0 ? -2 : -1;
}
var Jr = (s10, e, t, n = false) => {
  let o = { extractedFields: [], streamedIndex: {}, s: -1 };
  to(s10, e, o, t, { strictMode: n }), no(s10, e, o, t, n);
  for (let r of s10.getOutputFields()) r.isInternal && delete e[r.name];
};
var bi = (s10, e, t) => {
  let n = [];
  for (let o of t) o && !o.isOptional && e[o.name] === void 0 && n.push(o);
  if (n.length > 0) throw new D({ message: `Required ${n.length === 1 ? "field" : "fields"} not found`, fields: n });
};
var to = (s10, e, t, n, { strictMode: o, skipEarlyFail: r } = {}) => {
  let i = s10.getOutputFields(), a;
  for (let [l, p] of i.entries()) {
    if (l === t.currFieldIndex && !t.inAssumedField || p.name in e && !(l === t.currFieldIndex && t.inAssumedField)) continue;
    let u = `${(t.extractedFields.length === 0 ? "" : `
`) + p.title}:`, d = eo(n, u, t.s), m = u.length;
    switch (d) {
      case -1:
        if (r) continue;
        if (!o && i.length === 1 && t.currField === void 0) {
          t.inAssumedField = true, a = p, m = 0, d = 0;
          break;
        }
        if (t.currField === void 0 && t.extractedFields.length === 0) {
          if (o && !p.isOptional) throw new D({ message: "Expected (Required) field not found", fields: [p] });
          if (!o) {
            let g = false;
            for (let h = l; h < i.length; h++) {
              let f = i[h];
              if (!f) continue;
              let A = `${(t.extractedFields.length === 0 ? "" : `
`) + f.title}:`;
              if (eo(n, A, t.s) >= 0) {
                g = true;
                break;
              }
            }
            if (!g) {
              t.inAssumedField = true, a = p, m = 0, d = 0;
              break;
            }
          }
        }
        a = p.isOptional ? void 0 : p;
        continue;
      case -2:
        return true;
      case -3:
        return true;
      case -4:
        return t.inBlock = true, true;
    }
    if (a && a.name !== p.name) throw new D({ message: "Expected (Required) field not found", fields: [a] });
    if (t.currField !== void 0 && t.inAssumedField) {
      let g = n.substring(0, d).trim();
      if (g && t.currField.name === p.name) {
        let h = We(t.currField, g);
        h !== void 0 && (e[t.currField.name] = h);
      } else if (g) {
        let h = We(t.currField, g);
        h !== void 0 && (e[t.currField.name] = h);
      }
      t.inAssumedField = false, t.streamedIndex[t.currField.name] = 0, t.currField = void 0;
    }
    if (t.currField) {
      let g = n.substring(t.s, d).trim(), h = We(t.currField, g);
      h !== void 0 && (e[t.currField.name] = h), t.prevFields ? t.prevFields?.push({ field: t.currField, s: t.s, e: d }) : t.prevFields = [{ field: t.currField, s: t.s, e: d }];
    }
    t.s = d + m, t.currField = p, t.currFieldIndex = l, t.extractedFields.includes(p) || t.extractedFields.push(p), t.streamedIndex[p.name] === void 0 && (t.streamedIndex[p.name] = 0);
  }
};
var no = (s10, e, t, n, o = false) => {
  if (t.currField) {
    let r = n.substring(t.s).trim(), i = We(t.currField, r);
    i !== void 0 && (e[t.currField.name] = i);
  }
  if (o && !t.currField && t.extractedFields.length === 0 && n.trim()) {
    let a = s10.getOutputFields().find((l) => !l.isOptional);
    if (a) throw new D({ message: "Expected field not found", fields: [a] });
  }
  Ri(s10, e, n), bi(t, e, s10.getOutputFields());
};
var Ri = (s10, e, t) => {
  let n = s10.getOutputFields();
  for (let o of n) {
    if (!o.isOptional || o.name in e) continue;
    let r = `${o.title}:`, i = t.indexOf(r);
    if (i === -1) continue;
    let a = i + r.length, l = t.length;
    for (let c of n) {
      if (c.name === o.name) continue;
      let u = `${c.title}:`, d = t.indexOf(u, a);
      d !== -1 && d < l && (l = d);
    }
    let p = t.substring(a, l).trim();
    if (p) try {
      let c = We(o, p);
      c !== void 0 && (e[o.name] = c);
    } catch {
    }
  }
};
var Vr = (s10, e, t = false) => {
  switch (s10.type?.name) {
    case "code":
      return Qr(e);
    case "string":
      return e;
    case "number": {
      let n = Number(e);
      if (Number.isNaN(n)) {
        if (s10.isOptional && !t) return;
        throw new Error("Invalid number");
      }
      return n;
    }
    case "boolean": {
      if (typeof e == "boolean") return e;
      let n = e.toLowerCase();
      if (n === "true") return true;
      if (n === "false") return false;
      if (s10.isOptional && !t) return;
      throw new Error("Invalid boolean");
    }
    case "date":
      return zr(s10, e, t);
    case "datetime":
      return jr(s10, e, t);
    case "class": {
      let n = e;
      if (s10.type.options && !s10.type.options.includes(n)) {
        if (s10.isOptional) return;
        throw new Error(`Invalid class '${e}', expected one of the following: ${s10.type.options.join(", ")}`);
      }
      return n;
    }
    default:
      return e;
  }
};
function* Wr(s10, e, t, n, o, r) {
  let { name: i, isInternal: a } = e, { isArray: l, name: p } = e.type ?? {};
  if (a || l || p && p !== "string" && p !== "code") return;
  let c = o.streamedIndex[i] ?? 0, u = c === 0, d = s10.substring(t + c, n);
  if (d.length === 0) return;
  let m = d.replace(/\s+$/, "");
  o.currField?.type?.name === "code" && (m = m.replace(/\s*```\s*$/, ""));
  let g = u ? m.trimStart() : m;
  o.currField?.type?.name === "code" && (g = g.replace(/^[ ]*```[a-zA-Z0-9]*\n\s*/, "")), g.length > 0 && (yield { index: r, delta: { [i]: g } }, o.streamedIndex[i] = c + m.length);
}
function* oo(s10, e, t, n, o) {
  for (let i of n.prevFields ?? []) {
    let { field: a, s: l, e: p } = i;
    yield* Wr(e, a, l, p, n, o);
  }
  if (n.prevFields = void 0, !n.currField || n.currField.isInternal) return;
  yield* Wr(e, n.currField, n.s, e.length, n, o);
  let r = s10.getOutputFields();
  for (let i of Object.keys(t)) {
    let a = r.find((p) => p.name === i);
    if (!a || a.isInternal) continue;
    let l = t[i];
    if (Array.isArray(l)) {
      let p = n.streamedIndex?.[i] ?? 0, c = l.slice(p);
      c && c.length > 0 && (yield { index: o, delta: { [i]: c } }, n.streamedIndex[i] = p + c.length);
      continue;
    }
    n.streamedIndex[i] || (yield { index: o, delta: { [i]: l } }, n.streamedIndex[i] = 1);
  }
}
function We(s10, e) {
  if (!e || e === "" || /^(null|undefined)\s*$/i.test(e)) {
    if (s10.isOptional) return;
    throw new D({ message: "Required field is missing", fields: [s10], value: e });
  }
  let t;
  if (s10.type?.name === "json") try {
    let n = Qr(e);
    return t = JSON.parse(n), t;
  } catch (n) {
    throw new D({ message: `Invalid JSON: ${n.message}`, fields: [s10], value: e });
  }
  if (s10.type?.isArray) try {
    try {
      t = JSON.parse(e);
    } catch {
      t = Kr(e);
    }
    if (!Array.isArray(t)) throw new Error("Expected an array");
  } catch (n) {
    throw new D({ message: `Invalid Array: ${n.message}`, fields: [s10], value: e });
  }
  try {
    if (Array.isArray(t)) {
      for (let [n, o] of t.entries()) if (o !== void 0) {
        let r = typeof o == "string" ? o.trim() : o;
        t[n] = Vr(s10, r, true);
      }
    } else t = Vr(s10, e);
  } catch (n) {
    throw new D({ message: n.message, fields: [s10], value: e });
  }
  if (!(typeof t == "string" && t === "")) return t;
}
var Qr = (s10) => {
  let t = /```([A-Za-z]*)\n([\s\S]*?)\n```/g.exec(s10);
  return t ? t.length === 3 ? t[2] : t.length === 2 ? t[1] : s10 : s10;
};
async function ro(s10, e, t, n) {
  for (let o of s10) {
    if (e[o.field.name] === void 0) continue;
    let r = o.process, i = await r(e[o.field.name], { sessionId: n, values: e, done: true });
    Yr(o.field, t, i, n);
  }
}
async function so(s10, e, t, n, o, r, i = false) {
  for (let a of s10) {
    if (t.currField?.name !== a.field.name) continue;
    let l = e.substring(t.s);
    t.currField?.type?.name === "code" && (l = l.replace(/^[ ]*```[a-zA-Z0-9]*\n\s*/, ""), l = l.replace(/\s*```\s*$/, ""));
    let p = a.process, c = await p(l, { sessionId: r, values: o, done: i });
    Yr(t.currField, n, c, r);
  }
}
var Yr = (s10, e, t, n) => {
  if (t === void 0 || typeof t == "string" && (t === "" || /^(null|undefined)\s*$/i.test(t))) return;
  let o = JSON.stringify(t, (i, a) => typeof a == "bigint" ? Number(a) : a, 2), r = Ci(s10, o);
  e.addRequest([{ role: "user", content: [{ type: "text", text: r }] }], n), e.addTag("processor", n);
};
function Ci(s10, e) {
  let t = s10.type?.name === "code", n = s10.title;
  return t ? `Code in the field "${n}" was executed. The code execution produced the following output: ${e}` : `The field "${n}" was processed. The field contents were transformed into the following output: ${e}`;
}
async function* Xr({ res: s10, usage: e, states: t, ...n }) {
  let o = (n.ai.getFeatures().functionCot ?? false) && n.functions !== void 0 && n.functions.length > 0, r, i = s10.getReader();
  try {
    for (; ; ) {
      let { done: a, value: l } = await i.read();
      if (a) {
        r && e.push(r);
        break;
      }
      let p = l;
      p.modelUsage && (r = p.modelUsage);
      for (let c of p.results) {
        if ((!c.content || c.content === "") && (!c.thought || c.thought === "") && (!c.functionCalls || c.functionCalls.length === 0)) continue;
        let u = t.find((d) => d.index === c.index);
        if (!u) throw new Error(`No state found for result (index: ${c.index})`);
        yield* Ti({ ...n, result: c, skipEarlyFail: o, state: u });
      }
    }
  } finally {
    i.releaseLock();
  }
  for (let a of t) yield* wi({ ...n, state: a });
}
async function* Ti({ result: s10, mem: e, sessionId: t, strictMode: n, skipEarlyFail: o, state: r, signature: i, streamingFieldProcessors: a, thoughtFieldName: l, streamingAsserts: p, asserts: c }) {
  if (s10.functionCalls && s10.functionCalls.length > 0) it(r.functionCalls, s10.functionCalls), e.updateResult({ name: s10.name, content: s10.content, functionCalls: r.functionCalls, delta: s10.functionCalls?.[0]?.function?.params, index: s10.index }, t);
  else if (s10.content && s10.content.length > 0) {
    if (s10.thought && s10.thought.length > 0 && (yield { index: s10.index, delta: { [l]: s10.thought } }), r.content += s10.content, e.updateResult({ name: s10.name, content: r.content, delta: s10.content, index: s10.index }, t), to(i, r.values, r.xstate, r.content, { strictMode: n, skipEarlyFail: o })) return;
    p.length !== 0 && await jn(p, r.xstate, r.content), a.length !== 0 && await so(a, r.content, r.xstate, e, r.values, t), yield* oo(i, r.content, r.values, r.xstate, s10.index), await Tt(c, r.values);
  } else s10.thought && s10.thought.length > 0 && (r.values[l] = (r.values[l] ?? "") + s10.thought, yield { index: s10.index, delta: { [l]: s10.thought } });
  if (s10.finishReason === "length") throw new Error(`Max tokens reached before completion
Content: ${r.content}`);
}
async function* wi({ state: s10, signature: e, ai: t, model: n, functions: o, mem: r, sessionId: i, traceId: a, span: l, strictMode: p, excludeContentFromTrace: c, streamingAsserts: u, asserts: d, fieldProcessors: m, streamingFieldProcessors: g, functionResultFormatter: h, logger: f }) {
  let A = Yn(t, s10.functionCalls, s10.values, n);
  if (A) {
    if (!o) throw new Error("Functions are not defined");
    let x = await Qn({ ai: t, functionList: o, functionCalls: A, mem: r, sessionId: i, traceId: a, span: l, index: s10.index, excludeContentFromTrace: c, functionResultFormatter: h, logger: f });
    s10.functionsExecuted = /* @__PURE__ */ new Set([...s10.functionsExecuted, ...x]);
  } else no(e, s10.values, s10.xstate, s10.content, p), await jn(u, s10.xstate, s10.content, true), await Tt(d, s10.values), m.length && await ro(m, s10.values, r, i), g.length !== 0 && await so(g, s10.content, s10.xstate, r, s10.values, i, true), yield* oo(e, s10.content, s10.values, s10.xstate, s10.index);
}
async function* Zr({ ai: s10, res: e, mem: t, sessionId: n, traceId: o, functions: r, span: i, strictMode: a, states: l, usage: p, excludeContentFromTrace: c, asserts: u, fieldProcessors: d, thoughtFieldName: m, signature: g, functionResultFormatter: h, logger: f }) {
  let A = e.results ?? [];
  t.addResponse(A, n);
  for (let I of A) {
    let C = l[I.index];
    if (!C) throw new Error(`No state found for result (index: ${I.index})`);
    if (e.modelUsage && p.push(e.modelUsage), I.functionCalls?.length) {
      let k = Yn(s10, I.functionCalls, C.values);
      if (k) {
        if (!r) throw new Error("Functions are not defined");
        let S = await Qn({ ai: s10, functionList: r, functionCalls: k, mem: t, sessionId: n, traceId: o, span: i, excludeContentFromTrace: c, index: I.index, functionResultFormatter: h, logger: f });
        C.functionsExecuted = /* @__PURE__ */ new Set([...C.functionsExecuted, ...S]);
      }
    } else I.content && (I.thought && I.thought.length > 0 && (C.values[m] = I.thought), Jr(g, C.values, I.content, a), await Tt(u, C.values), d.length && await ro(d, C.values, t, n));
    if (I.finishReason === "length") throw new Error(`Max tokens reached before completion
Content: ${I.content}`);
  }
  let x = l.map((I) => I.values);
  for (let I of x) for (let C of g.getOutputFields()) C.isInternal && delete I[C.name];
  let y = g.getOutputFields(), v = x.map((I, C) => {
    let k = {};
    for (let S of y) S.isInternal || (k[S.name] = I[S.name]);
    return I[m] !== void 0 && (k[m] = I[m]), { index: C, delta: k };
  });
  for (let I of v) yield I;
}
function es(s10, e, t, n) {
  let o = s10.getLast(n);
  if (!o) return true;
  for (let [r, i] of t.entries()) {
    let a = e && i.functionsExecuted.has(e);
    if (!o.chat[r]) throw new Error(`No chat message found for result (index: ${r})`);
    let p = o.role === "function", c = o.tags ? o.tags.some((u) => u === "processor") : false;
    if (p && e && a || !(p || c)) return false;
  }
  return true;
}
var Je = class {
  reg;
  constructor() {
    this.reg = /* @__PURE__ */ new Set();
  }
  register(e) {
    this.reg.add(e);
  }
  *[Symbol.iterator]() {
    let e = Array.from(this.reg);
    for (let t = 0; t < e.length; t++) yield e[t];
  }
};
var R = class extends Error {
  constructor(t, n, o, r) {
    super(t);
    this.position = n;
    this.context = o;
    this.suggestion = r;
    this.name = "SignatureValidationError";
  }
};
var io = class {
  input;
  position;
  currentFieldName = null;
  currentSection = "description";
  constructor(e) {
    if (this.input = e.trim(), this.position = 0, !this.input) throw new R("Empty signature provided", 0, "", 'A signature must contain at least input and output fields separated by "->". Example: "userQuery:string -> aiResponse:string"');
  }
  parse() {
    try {
      this.skipWhitespace();
      let e = this.parseParsedString();
      this.skipWhitespace(), this.currentSection = "inputs";
      let t = this.parseFieldList(this.parseInputField.bind(this), "input");
      if (this.skipWhitespace(), this.position >= this.input.length) throw new R("Incomplete signature: Missing output section", this.position, this.getErrorContext(), 'Add "->" followed by output fields. Example: "-> responseText:string"');
      if (this.expectArrow(), this.skipWhitespace(), this.position >= this.input.length) throw new R('Incomplete signature: No output fields specified after "->"', this.position, this.getErrorContext(), 'Add at least one output field. Example: "-> responseText:string"');
      this.currentSection = "outputs";
      let n = this.parseFieldList(this.parseOutputField.bind(this), "output");
      if (this.skipWhitespace(), this.position < this.input.length) {
        let o = this.input.slice(this.position);
        throw new R(`Unexpected content after signature: "${o}"`, this.position, this.getErrorContext(), "Remove any extra content after the output fields");
      }
      return this.validateParsedSignature({ desc: e?.trim(), inputs: t, outputs: n }), { desc: e?.trim(), inputs: t, outputs: n };
    } catch (e) {
      if (e instanceof R) throw e;
      let t = e instanceof Error ? e.message : "Unknown error";
      throw new R(t, this.position, this.getErrorContext());
    }
  }
  validateParsedSignature(e) {
    let t = /* @__PURE__ */ new Set();
    for (let o of e.inputs) {
      if (t.has(o.name)) throw new R(`Duplicate input field name: "${o.name}"`, 0, "", "Each field name must be unique within the signature");
      t.add(o.name);
    }
    let n = /* @__PURE__ */ new Set();
    for (let o of e.outputs) {
      if (n.has(o.name)) throw new R(`Duplicate output field name: "${o.name}"`, 0, "", "Each field name must be unique within the signature");
      n.add(o.name);
    }
    for (let o of e.outputs) if (t.has(o.name)) throw new R(`Field name "${o.name}" appears in both inputs and outputs`, 0, "", "Use different names for input and output fields to avoid confusion");
    if (e.inputs.length === 0) throw new R("Signature must have at least one input field", 0, "", 'Add an input field before "->". Example: "userInput:string -> ..."');
    if (e.outputs.length === 0) throw new R("Signature must have at least one output field", 0, "", 'Add an output field after "->". Example: "... -> responseText:string"');
  }
  getErrorContext() {
    let e = Math.max(0, this.position - 25), t = Math.min(this.input.length, this.position + 25), n = this.input.slice(e, this.position), o = this.input.slice(this.position, t), r = `${" ".repeat(n.length)}^`;
    return [`Position ${this.position} in signature:`, `"${n}${o}"`, ` ${r}`].join(`
`);
  }
  parseFieldList(e, t) {
    let n = [];
    if (this.skipWhitespace(), this.position >= this.input.length) throw new R(`Empty ${t} section: Expected at least one field`, this.position, this.getErrorContext(), `Add a ${t} field. Example: ${t === "input" ? "userInput:string" : "responseText:string"}`);
    try {
      n.push(e());
    } catch (o) {
      throw o instanceof R ? o : new R(`Invalid first ${t} field: ${o instanceof Error ? o.message : "Unknown error"}`, this.position, this.getErrorContext());
    }
    for (this.skipWhitespace(); this.position < this.input.length && !(this.input[this.position] === "-" && this.position + 1 < this.input.length && this.input[this.position + 1] === ">"); ) if (this.match(",")) {
      if (this.skipWhitespace(), this.position >= this.input.length) throw new R(`Unexpected end of input after comma in ${t} section`, this.position, this.getErrorContext(), `Add another ${t} field after the comma`);
      try {
        n.push(e());
      } catch (o) {
        throw o instanceof R ? o : new R(`Invalid ${t} field after comma: ${o instanceof Error ? o.message : "Unknown error"}`, this.position, this.getErrorContext());
      }
      this.skipWhitespace();
    } else break;
    return n;
  }
  parseInputField() {
    this.skipWhitespace();
    let e = this.parseParsedIdentifier();
    this.currentFieldName = e, this.validateFieldName(e, "input");
    let t;
    for (; ; ) {
      if (this.match("?")) {
        t = true;
        continue;
      }
      if (this.match("!")) throw new R(`Input field "${e}" cannot use the internal marker "!"`, this.position - 1, this.getErrorContext(), "Internal markers (!) are only allowed on output fields");
      break;
    }
    let n;
    if (this.skipWhitespace(), this.match(":")) {
      if (this.skipWhitespace(), /^class\b/.test(this.input.slice(this.position))) throw new R(`Input field "${e}" cannot use the "class" type`, this.position, this.getErrorContext(), 'Class types are only allowed on output fields. Use "string" type for input classifications');
      try {
        let r = this.parseTypeNotClass(), i = this.match("[]");
        if (n = { name: r, isArray: i }, (r === "image" || r === "audio") && i) throw new R(`Input field "${e}": Arrays of ${r} are not supported`, this.position, this.getErrorContext(), `Use a single ${r} type instead: "${r}"`);
      } catch (r) {
        throw r instanceof R ? r : new R(`Input field "${e}": ${r instanceof Error ? r.message : "Unknown error"}`, this.position, this.getErrorContext());
      }
    }
    this.skipWhitespace();
    let o = this.parseParsedString();
    return { name: e, desc: o?.trim(), type: n, isOptional: t };
  }
  parseOutputField() {
    this.skipWhitespace();
    let e = this.parseParsedIdentifier();
    this.currentFieldName = e, this.validateFieldName(e, "output");
    let t = false, n = false;
    for (; ; ) {
      if (this.match("?")) {
        t = true;
        continue;
      }
      if (this.match("!")) {
        n = true;
        continue;
      }
      break;
    }
    let o;
    if (this.skipWhitespace(), this.match(":")) if (this.skipWhitespace(), this.match("class")) {
      let i = this.match("[]");
      this.skipWhitespace();
      let a = this.parseParsedString();
      if (!a) throw new R(`Output field "${e}": Missing class options after "class" type`, this.position, this.getErrorContext(), 'Add class names in quotes. Example: class "positive, negative, neutral"');
      let l = a.split(/[,|]/).map((p) => p.trim()).filter((p) => p.length > 0);
      if (l.length === 0) throw new R(`Output field "${e}": Empty class list provided`, this.position, this.getErrorContext(), 'Provide at least one class option. Example: "positive, negative"');
      o = { name: "class", isArray: i, options: l };
    } else try {
      let i = this.parseTypeNotClass(), a = this.match("[]");
      if (o = { name: i, isArray: a }, i === "image" && a) throw new R(`Output field "${e}": Arrays of images are not supported`, this.position, this.getErrorContext(), 'Use a single image type instead: "image"');
      if (i === "audio" && a) throw new R(`Output field "${e}": Arrays of audio are not supported`, this.position, this.getErrorContext(), 'Use a single audio type instead: "audio"');
      if (i === "image") throw new R(`Output field "${e}": Image type is not supported in output fields`, this.position, this.getErrorContext(), "Image types can only be used in input fields");
      if (i === "audio") throw new R(`Output field "${e}": Audio type is not supported in output fields`, this.position, this.getErrorContext(), "Audio types can only be used in input fields");
    } catch (i) {
      throw i instanceof R ? i : new R(`Output field "${e}": ${i instanceof Error ? i.message : "Unknown error"}`, this.position, this.getErrorContext());
    }
    this.skipWhitespace();
    let r = this.parseParsedString();
    return { name: e, desc: r?.trim(), type: o, isOptional: t, isInternal: n };
  }
  validateFieldName(e, t) {
    if (M.signatureStrict && ["text", "object", "image", "string", "number", "boolean", "json", "array", "datetime", "date", "time", "type", "class", "input", "output", "data", "value", "result", "response", "request", "item", "element"].includes(e.toLowerCase())) {
      let i = t === "input" ? ["userInput", "questionText", "documentContent", "messageText"] : ["responseText", "analysisResult", "categoryType", "summaryText"];
      throw new R(`Field name "${e}" is too generic`, this.position, this.getErrorContext(), `Use a more descriptive name. Examples: ${i.join(", ")}`);
    }
    let n = /^[a-z][a-zA-Z0-9]*$/, o = /^[a-z]+(_[a-z0-9]+)*$/;
    if (!n.test(e) && !o.test(e)) throw new R(`Invalid field name "${e}"`, this.position, this.getErrorContext(), 'Field names must be in camelCase (e.g., "userInput") or snake_case (e.g., "user_input")');
    if (e.length < 2) throw new R(`Field name "${e}" is too short`, this.position, this.getErrorContext(), "Field names must be at least 2 characters long");
    if (e.length > 50) throw new R(`Field name "${e}" is too long (${e.length} characters)`, this.position, this.getErrorContext(), "Field names should be 50 characters or less");
  }
  parseTypeNotClass() {
    let e = ["string", "number", "boolean", "json", "image", "audio", "file", "url", "datetime", "date", "code"], t = e.find((n) => this.match(n));
    if (!t) {
      let n = this.input.slice(this.position).match(/^\w+/)?.[0] || "", o = this.suggestType(n), r = `Invalid type "${n || "empty"}"`, i = o ? `. Did you mean "${o}"?` : "", a = `${r}${i}`;
      throw new R(a, this.position, this.getErrorContext(), `Expected one of: ${e.join(", ")}`);
    }
    return t;
  }
  suggestType(e) {
    return { str: "string", text: "string", int: "number", integer: "number", float: "number", double: "number", bool: "boolean", object: "json", dict: "json", timestamp: "datetime", time: "datetime", img: "image", picture: "image", sound: "audio", voice: "audio", classification: "class", category: "class" }[e.toLowerCase()] || null;
  }
  parseParsedIdentifier() {
    this.skipWhitespace();
    let e = /^[a-zA-Z_][a-zA-Z_0-9]*/.exec(this.input.slice(this.position));
    if (e) return this.position += e[0].length, e[0];
    let t = /^\S+/.exec(this.input.slice(this.position)), n = t ? t[0] : "";
    throw n === "" ? new R("Expected field name but found end of input", this.position, this.getErrorContext(), "Add a field name. Field names must start with a letter or underscore") : /^\d/.test(n) ? new R(`Invalid field name "${n}" - cannot start with a number`, this.position, this.getErrorContext(), 'Field names must start with a letter or underscore. Example: "userInput" or "_internal"') : new R(`Invalid field name "${n}"`, this.position, this.getErrorContext(), "Field names must start with a letter or underscore and contain only letters, numbers, or underscores");
  }
  parseParsedString() {
    let e = ["'", '"'];
    for (let t of e) if (this.match(t)) {
      let n = "", o = false, r = this.position - 1;
      for (; this.position < this.input.length; ) {
        let a = this.input[this.position];
        if (this.position++, o) n += a, o = false;
        else if (a === "\\") o = true;
        else {
          if (a === t) return n;
          n += a;
        }
      }
      let i = this.input.slice(r, Math.min(this.position, r + 20));
      throw new R(`Unterminated string starting at position ${r}`, r, this.getErrorContext(), `Add closing ${t} to complete the string: ${i}${t}`);
    }
  }
  skipWhitespace() {
    let e = /^[\s\t\r\n]+/.exec(this.input.slice(this.position));
    e && (this.position += e[0].length);
  }
  match(e) {
    let t;
    if (typeof e == "string") {
      if (this.input.startsWith(e, this.position)) return this.position += e.length, true;
    } else if (t = e.exec(this.input.slice(this.position)), t) return this.position += t[0].length, true;
    return false;
  }
  expectArrow() {
    if (!this.match("->")) {
      let e = this.input.slice(this.position, this.position + 10), t = e.includes(">") ? 'Use "->" (dash followed by greater-than)' : e.includes("-") ? 'Add ">" after the dash' : 'Add "->" to separate input and output fields';
      throw new R(`Expected "->" but found "${e}..."`, this.position, this.getErrorContext(), t);
    }
  }
};
function ts(s10) {
  return new io(s10).parse();
}
var Ft = class {
  inputFields = [];
  outputFields = [];
  desc;
  input(e, t, n = false) {
    let o = { name: e, type: { name: t.type, isArray: t.isArray, options: t.options ? [...t.options] : void 0 }, description: t.description, isOptional: t.isOptional, isInternal: t.isInternal };
    return n ? this.inputFields.unshift(o) : this.inputFields.push(o), this;
  }
  output(e, t, n = false) {
    let o = { name: e, type: { name: t.type, isArray: t.isArray, options: t.options ? [...t.options] : void 0 }, description: t.description, isOptional: t.isOptional, isInternal: t.isInternal };
    return n ? this.outputFields.unshift(o) : this.outputFields.push(o), this;
  }
  description(e) {
    return this.desc = e, this;
  }
  build() {
    let e = { description: this.desc, inputs: this.inputFields, outputs: this.outputFields };
    return new P(e);
  }
};
var G = class s6 {
  type;
  isArray;
  options;
  description;
  isOptional;
  isInternal;
  constructor(e) {
    this.type = e.type, this.isArray = e.isArray, this.options = e.options, this.description = e.description, this.isOptional = e.isOptional, this.isInternal = e.isInternal;
  }
  optional() {
    return new s6({ ...this, isOptional: true });
  }
  array() {
    return new s6({ ...this, isArray: true });
  }
  internal() {
    return new s6({ ...this, isInternal: true });
  }
};
var Qe = Object.assign(() => new Ft(), { string: (s10) => new G({ type: "string", isArray: false, description: s10 }), number: (s10) => new G({ type: "number", isArray: false, description: s10 }), boolean: (s10) => new G({ type: "boolean", isArray: false, description: s10 }), json: (s10) => new G({ type: "json", isArray: false, description: s10 }), datetime: (s10) => new G({ type: "datetime", isArray: false, description: s10 }), date: (s10) => new G({ type: "date", isArray: false, description: s10 }), class: (s10, e) => new G({ type: "class", isArray: false, options: s10, description: e }), image: (s10) => new G({ type: "image", isArray: false, description: s10 }), audio: (s10) => new G({ type: "audio", isArray: false, description: s10 }), file: (s10) => new G({ type: "file", isArray: false, description: s10 }), url: (s10) => new G({ type: "url", isArray: false, description: s10 }), code: (s10, e) => new G({ type: "code", isArray: false, description: e || s10 }), array: (s10) => ({ ...s10, isArray: true }), optional: (s10) => ({ ...s10, isOptional: true }), internal: (s10) => ({ ...s10, isInternal: true }), legacyArray: (s10) => ({ ...s10, isArray: true }), legacyOptional: (s10) => ({ ...s10, isOptional: true }), legacyInternal: (s10) => ({ ...s10, isInternal: true }) });
function Pt(s10) {
  return { type: { name: s10.type, isArray: s10.isArray, options: s10.options ? [...s10.options] : void 0 }, description: s10.description, isOptional: s10.isOptional, isInternal: s10.isInternal };
}
var b = class extends Error {
  constructor(t, n, o) {
    super(t);
    this.fieldName = n;
    this.suggestion = o;
    this.name = "AxSignatureValidationError";
  }
};
var P = class s7 {
  description;
  inputFields;
  outputFields;
  sigHash;
  sigString;
  validatedAtHash;
  constructor(e) {
    if (!e) {
      this.inputFields = [], this.outputFields = [], this.sigHash = "", this.sigString = "";
      return;
    }
    if (typeof e == "string") {
      let t;
      try {
        t = ts(e);
      } catch (n) {
        if (n instanceof Error) {
          let o = "suggestion" in n && typeof n.suggestion == "string" ? n.suggestion : 'Please check the signature format. Example: "userInput:string -> responseText:string"';
          throw new b(`Invalid Signature: ${n.message}`, void 0, o);
        }
        throw new b(`Invalid Signature: ${e}`, void 0, 'Please check the signature format. Example: "userInput:string -> responseText:string"');
      }
      this.description = t.desc, this.inputFields = t.inputs.map((n) => this.parseParsedField(n)), this.outputFields = t.outputs.map((n) => this.parseParsedField(n)), [this.sigHash, this.sigString] = this.updateHash();
    } else if (e instanceof s7) this.description = e.getDescription(), this.inputFields = structuredClone(e.getInputFields()), this.outputFields = structuredClone(e.getOutputFields()), this.sigHash = e.hash(), this.sigString = e.toString(), e.validatedAtHash === this.sigHash && (this.validatedAtHash = this.sigHash);
    else if (typeof e == "object" && e !== null) {
      if (!("inputs" in e) || !("outputs" in e)) throw new b("Invalid signature object: missing inputs or outputs", void 0, 'Signature object must have "inputs" and "outputs" arrays. Example: { inputs: [...], outputs: [...] }');
      if (!Array.isArray(e.inputs) || !Array.isArray(e.outputs)) throw new b("Invalid signature object: inputs and outputs must be arrays", void 0, 'Both "inputs" and "outputs" must be arrays of AxField objects');
      try {
        this.description = e.description, this.inputFields = e.inputs.map((t) => this.parseField(t)), this.outputFields = e.outputs.map((t) => this.parseField(t)), [this.sigHash, this.sigString] = this.updateHash();
      } catch (t) {
        throw t instanceof b ? t : new b(`Failed to create signature from object: ${t instanceof Error ? t.message : "Unknown error"}`, void 0, "Check that all fields in inputs and outputs arrays are valid AxField objects");
      }
    } else throw new b("Invalid signature argument type", void 0, "Signature must be a string, another AxSignature instance, or an object with inputs and outputs arrays");
  }
  static create(e) {
    return new s7(e);
  }
  parseParsedField = (e) => {
    if (!e.name || e.name.length === 0) throw new b("Field name is required", e.name, 'Every field must have a descriptive name. Example: "userInput", "responseText"');
    let t = this.toTitle(e.name);
    return { name: e.name, title: t, description: "desc" in e ? e.desc : void 0, type: e.type ?? { name: "string", isArray: false }, ..."isInternal" in e ? { isInternal: e.isInternal } : {}, ..."isOptional" in e ? { isOptional: e.isOptional } : {} };
  };
  parseField = (e) => {
    let t = !e.title || e.title.length === 0 ? this.toTitle(e.name) : e.title;
    if (e.type && (!e.type.name || e.type.name.length === 0)) throw new b("Field type name is required", e.name, "Specify a valid type. Available types: string, number, boolean, json, image, audio, file, url, date, datetime, class, code");
    return { ...e, title: t };
  };
  setDescription = (e) => {
    if (typeof e != "string") throw new b("Description must be a string", void 0, "Provide a string description for the signature");
    this.description = e, this.invalidateValidationCache(), this.updateHashLight();
  };
  addInputField = (e) => {
    try {
      let t = this.parseField(e);
      ee(t, "input");
      for (let n of this.inputFields) if (n.name === t.name) throw new b(`Duplicate input field name: "${t.name}"`, t.name, "Each field name must be unique within the signature");
      for (let n of this.outputFields) if (n.name === t.name) throw new b(`Field name "${t.name}" appears in both inputs and outputs`, t.name, "Use different names for input and output fields to avoid confusion");
      this.inputFields.push(t), this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof b ? t : new b(`Failed to add input field "${e.name}": ${t instanceof Error ? t.message : "Unknown error"}`, e.name);
    }
  };
  addOutputField = (e) => {
    try {
      let t = this.parseField(e);
      ee(t, "output");
      for (let n of this.outputFields) if (n.name === t.name) throw new b(`Duplicate output field name: "${t.name}"`, t.name, "Each field name must be unique within the signature");
      for (let n of this.inputFields) if (n.name === t.name) throw new b(`Field name "${t.name}" appears in both inputs and outputs`, t.name, "Use different names for input and output fields to avoid confusion");
      this.outputFields.push(t), this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof b ? t : new b(`Failed to add output field "${e.name}": ${t instanceof Error ? t.message : "Unknown error"}`, e.name);
    }
  };
  setInputFields = (e) => {
    if (!Array.isArray(e)) throw new b("Input fields must be an array", void 0, "Provide an array of field objects");
    try {
      let t = e.map((n) => {
        let o = this.parseField(n);
        return ee(o, "input"), o;
      });
      this.inputFields = t, this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof b ? t : new b(`Failed to set input fields: ${t instanceof Error ? t.message : "Unknown error"}`);
    }
  };
  setOutputFields = (e) => {
    if (!Array.isArray(e)) throw new b("Output fields must be an array", void 0, "Provide an array of field objects");
    try {
      let t = e.map((n) => {
        let o = this.parseField(n);
        return ee(o, "output"), o;
      });
      this.outputFields = t, this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof b ? t : new b(`Failed to set output fields: ${t instanceof Error ? t.message : "Unknown error"}`);
    }
  };
  getInputFields = () => this.inputFields;
  getOutputFields = () => this.outputFields;
  getDescription = () => this.description;
  appendInputField = (e, t) => {
    let n = new s7(this);
    return n.addInputField({ name: e, ...Pt(t) }), n;
  };
  prependInputField = (e, t) => {
    let n = new s7(this), o = { name: e, ...Pt(t) }, r = n.parseField(o);
    ee(r, "input");
    for (let i of n.inputFields) if (i.name === r.name) throw new b(`Duplicate input field name: "${r.name}"`, r.name, "Each field name must be unique within the signature");
    for (let i of n.outputFields) if (i.name === r.name) throw new b(`Field name "${r.name}" appears in both inputs and outputs`, r.name, "Use different names for input and output fields to avoid confusion");
    return n.inputFields.unshift(r), n.invalidateValidationCache(), n.updateHashLight(), n;
  };
  appendOutputField = (e, t) => {
    let n = new s7(this);
    return n.addOutputField({ name: e, ...Pt(t) }), n;
  };
  prependOutputField = (e, t) => {
    let n = new s7(this), o = { name: e, ...Pt(t) }, r = n.parseField(o);
    ee(r, "output");
    for (let i of n.outputFields) if (i.name === r.name) throw new b(`Duplicate output field name: "${r.name}"`, r.name, "Each field name must be unique within the signature");
    for (let i of n.inputFields) if (i.name === r.name) throw new b(`Field name "${r.name}" appears in both inputs and outputs`, r.name, "Use different names for input and output fields to avoid confusion");
    return n.outputFields.unshift(r), n.invalidateValidationCache(), n.updateHashLight(), n;
  };
  invalidateValidationCache = () => {
    this.validatedAtHash = void 0;
  };
  toTitle = (e) => {
    let t = e.replace(/_/g, " ");
    return t = t.replace(/([A-Z]|[0-9]+)/g, " $1").trim(), t.charAt(0).toUpperCase() + t.slice(1);
  };
  toJSONSchema = () => {
    let e = {}, t = [];
    for (let o of this.inputFields) {
      let r = o.type ? o.type.name : "string";
      o.type?.isArray ? e[o.name] = { description: o.description, type: "array", items: { type: r, description: o.description } } : e[o.name] = { description: o.description, type: r }, o.isOptional || t.push(o.name);
    }
    return { type: "object", properties: e, required: t };
  };
  updateHashLight = () => {
    try {
      return this.getInputFields().forEach((e) => {
        ee(e, "input");
      }), this.getOutputFields().forEach((e) => {
        ee(e, "output");
      }), this.sigHash = nt("sha256").update(JSON.stringify(this.inputFields)).update(JSON.stringify(this.outputFields)).digest("hex"), this.sigString = os(this.description, this.inputFields, this.outputFields), [this.sigHash, this.sigString];
    } catch (e) {
      throw e instanceof b ? e : new b(`Signature validation failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };
  updateHash = () => {
    try {
      return this.getInputFields().forEach((e) => {
        ee(e, "input");
      }), this.getOutputFields().forEach((e) => {
        ee(e, "output");
      }), this.validateSignatureConsistency(), this.sigHash = nt("sha256").update(this.description ?? "").update(JSON.stringify(this.inputFields)).update(JSON.stringify(this.outputFields)).digest("hex"), this.sigString = os(this.description, this.inputFields, this.outputFields), [this.sigHash, this.sigString];
    } catch (e) {
      throw e instanceof b ? e : new b(`Signature validation failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };
  validateSignatureConsistency() {
    let e = /* @__PURE__ */ new Set();
    for (let n of this.inputFields) {
      if (e.has(n.name)) throw new b(`Duplicate input field name: "${n.name}"`, n.name, "Each field name must be unique within the signature");
      e.add(n.name);
    }
    let t = /* @__PURE__ */ new Set();
    for (let n of this.outputFields) {
      if (t.has(n.name)) throw new b(`Duplicate output field name: "${n.name}"`, n.name, "Each field name must be unique within the signature");
      t.add(n.name);
    }
    for (let n of this.outputFields) if (e.has(n.name)) throw new b(`Field name "${n.name}" appears in both inputs and outputs`, n.name, "Use different names for input and output fields to avoid confusion");
    if (this.inputFields.length === 0) throw new b("Signature must have at least one input field", void 0, 'Add an input field. Example: "userInput:string -> ..."');
    if (this.outputFields.length === 0) throw new b("Signature must have at least one output field", void 0, 'Add an output field. Example: "... -> responseText:string"');
  }
  validate = () => {
    if (this.validatedAtHash === this.sigHash) return true;
    try {
      return this.updateHash(), this.validatedAtHash = this.sigHash, true;
    } catch (e) {
      throw this.validatedAtHash = void 0, e;
    }
  };
  hash = () => this.sigHash;
  toString = () => this.sigString;
  toJSON = () => ({ id: this.hash(), description: this.description, inputFields: this.inputFields, outputFields: this.outputFields });
};
function ns(s10) {
  let e = s10.name;
  return s10.isOptional && (e += "?"), s10.isInternal && (e += "!"), s10.type && (e += `:${s10.type.name}`, s10.type.isArray && (e += "[]"), s10.type.name === "class" && s10.type.options && (e += ` "${s10.type.options.join(" | ")}"`)), s10.description && s10.type?.name !== "class" && (e += ` "${s10.description}"`), e;
}
function os(s10, e, t) {
  let n = s10 ? `"${s10}" ` : "", o = e.map(ns).join(", "), r = t.map(ns).join(", ");
  return `${n}${o} -> ${r}`;
}
function Si(s10) {
  let e = /^[a-z][a-zA-Z0-9]*$/, t = /^[a-z]+(_[a-z0-9]+)*$/;
  return e.test(s10) || t.test(s10);
}
function ee(s10, e) {
  if (!s10.name || s10.name.length === 0) throw new b("Field name cannot be blank", s10.name, "Every field must have a descriptive name");
  if (!Si(s10.name)) throw new b(`Invalid field name '${s10.name}' - must be camelCase or snake_case`, s10.name, 'Use camelCase (e.g., "userInput") or snake_case (e.g., "user_input")');
  if (M.signatureStrict && ["text", "object", "image", "string", "number", "boolean", "json", "array", "datetime", "date", "time", "type", "class", "input", "output", "data", "value", "result", "response", "request", "item", "element"].includes(s10.name.toLowerCase())) {
    let n = e === "input" ? ["userInput", "questionText", "documentContent", "messageText", "queryString"] : ["responseText", "analysisResult", "categoryType", "summaryText", "outputData"];
    throw new b(`Field name '${s10.name}' is too generic`, s10.name, `Use a more descriptive name. Examples for ${e} fields: ${n.join(", ")}`);
  }
  if (s10.name.length < 2) throw new b(`Field name '${s10.name}' is too short`, s10.name, "Field names must be at least 2 characters long");
  if (s10.name.length > 50) throw new b(`Field name '${s10.name}' is too long (${s10.name.length} characters)`, s10.name, "Field names should be 50 characters or less");
  s10.type && vi(s10, e);
}
function vi(s10, e) {
  if (!s10.type) return;
  let { type: t } = s10;
  if (t.name === "image" || t.name === "audio" || t.name === "file" || t.name === "url") {
    if (e === "output") throw new b(`${t.name} type is not supported in output fields`, s10.name, `${t.name} types can only be used in input fields`);
    if (t.isArray && (t.name === "image" || t.name === "audio")) throw new b(`Arrays of ${t.name} are not supported`, s10.name, `Use a single ${t.name} type instead`);
  }
  if (t.name === "class") {
    if (e === "input") throw new b("Class type is not supported in input fields", s10.name, 'Class types are only allowed on output fields. Use "string" type for input classifications');
    if (!t.options || t.options.length === 0) throw new b("Class type requires options", s10.name, 'Provide class options. Example: class "positive, negative, neutral"');
    for (let o of t.options) {
      if (!o || o.trim().length === 0) throw new b("Empty class option found", s10.name, "All class options must be non-empty strings");
      let r = o.trim();
      if (r.includes(",") || r.includes("|")) throw new b(`Invalid class option "${r}"`, s10.name, "Class options cannot contain commas (,) or pipes (|) as they are used to separate options");
    }
    if (new Set(t.options.map((o) => o.trim().toLowerCase())).size !== t.options.length) throw new b("Duplicate class options found", s10.name, "Each class option must be unique (case-insensitive)");
  }
  if (t.name === "code" && t.isArray) throw new b("Arrays of code are not commonly supported", s10.name, "Consider using a single code field or an array of strings instead");
  if (s10.isInternal && e === "input") throw new b("Internal marker (!) is not allowed on input fields", s10.name, "Internal markers are only allowed on output fields");
}
var le = class {
  signature;
  sigHash;
  examples;
  examplesOptions;
  demos;
  trace;
  usage = [];
  traceLabel;
  key;
  children;
  constructor(e, t) {
    this.signature = new P(e), t?.description && this.signature.setDescription(t.description), t?.traceLabel && (this.traceLabel = t.traceLabel), e && this.signature.validate(), this.sigHash = this.signature?.hash(), this.children = new Je(), this.key = { id: this.signature.hash() };
  }
  getSignature() {
    return new P(this.signature);
  }
  setSignature(e) {
    this.signature = new P(e), e && this.signature.validate(), this.updateSignatureHash();
  }
  setInstruction(e) {
    this.setDescription(e);
  }
  setDescription(e) {
    this.signature.setDescription(e), this.updateSignatureHash();
  }
  updateSignatureHash() {
    this.sigHash = this.signature.hash(), this.key = { id: this.signature.hash() };
  }
  register(e) {
    this.key && e.setParentId(this.key.id), this.children.register(e);
  }
  setId(e) {
    this.key = { id: e, custom: true };
    for (let t of Array.from(this.children)) t?.setParentId(e);
  }
  setParentId(e) {
    this.key.custom || (this.key.id = [e, this.key.id].join("/"));
  }
  setExamples(e, t) {
    if (this._setExamples(e, t), "programId" in e) for (let n of Array.from(this.children)) n?.setExamples(e, t);
  }
  _setExamples(e, t) {
    let n = [];
    if ("programId" in e && e.programId === this.key.id && (n = e.traces), Array.isArray(e) && (n = e), n) {
      this.examplesOptions = t;
      let o = this.signature, r = [...o.getInputFields(), ...o.getOutputFields()];
      this.examples = n.map((i) => {
        let a = {};
        for (let l of r) {
          let p = i[l.name];
          p !== void 0 && (Et(l, p), a[l.name] = p);
        }
        return a;
      });
    }
  }
  getTraces() {
    let e = [];
    this.trace && e.push({ trace: this.trace, programId: this.key.id });
    for (let t of Array.from(this.children)) {
      let n = t?.getTraces();
      e = [...e, ...n ?? []];
    }
    return e;
  }
  getUsage() {
    let e = [...this.usage ?? []];
    for (let t of Array.from(this.children)) {
      let n = t?.getUsage();
      e = [...e, ...n ?? []];
    }
    return Ve(e);
  }
  resetUsage() {
    this.usage = [];
    for (let e of Array.from(this.children)) e?.resetUsage();
  }
  setDemos(e) {
    let t = Array.from(this.children).length > 0, n = e.some((o) => o.programId === this.key.id);
    if (t && !n) throw new Error(`Program with id '${this.key.id}' has children but no matching programId found in demos`);
    this.demos = e.filter((o) => o.programId === this.key.id).map((o) => o.traces).flat();
    for (let o of Array.from(this.children)) o?.setDemos(e);
  }
};
var Oi = `
## Function Call Instructions
- Complete the task, using the functions defined earlier in this prompt. 
- Output fields should only be generated after all functions have been called.
- Use the function results to generate the output fields.`;
var Mi = `
## Strict Output Formatting Rules
- Output must strictly follow the defined plain-text \`field name: value\` field format.
- Output field, values must strictly adhere to the specified output field formatting rules.
- No formatting rules should override these **Strict Output Formatting Rules**
- Do not add any text before or after the output fields, just the field name and value.
- Do not use code blocks.`;
var Ye = class {
  sig;
  fieldTemplates;
  task;
  thoughtFieldName;
  functions;
  constructor(e, t, n) {
    this.sig = e, this.fieldTemplates = n, this.thoughtFieldName = t?.thoughtFieldName ?? "thought", this.functions = t?.functions;
    let o = [], r = rs(this.sig.getInputFields()), i = rs(this.sig.getOutputFields());
    o.push(`You will be provided with the following fields: ${r}. Your task is to generate new fields: ${i}.`);
    let l = this.functions?.map((d) => "toFunction" in d ? d.toFunction() : d)?.flat()?.map((d) => `- \`${d.name}\`: ${_t(d.description)}`).join(`
`);
    l && l.length > 0 && o.push(`## Available Functions
${l}`);
    let p = ki(this.sig.getInputFields());
    o.push(`## Input Fields
${p}`);
    let c = Ei(this.sig.getOutputFields());
    o.push(`## Output Fields
${c}`), l && l.length > 0 && o.push(Oi.trim()), o.push(Mi.trim());
    let u = this.sig.getDescription();
    if (u) {
      let d = _t(u);
      o.push(d);
    }
    this.task = { type: "text", text: o.join(`

`) };
  }
  renderSingleValueUserContent = (e, t, n) => {
    let o = this.renderInputFields(e), i = (n ? o : [...t, ...o]).filter((a) => a !== void 0);
    return i.every((a) => a.type === "text") ? i.map((a) => a.text).join(`
`) : i.reduce(ss(`
`), []);
  };
  render = (e, { examples: t, demos: n }) => {
    let o = this.renderExamples([...t || [], ...n || []]), r = o.every((p) => p.type === "text"), i = this.task.text;
    if (r) {
      let p = [{ type: "text", text: i }, ...o.length > 0 ? [{ type: "text", text: `

## Examples
` }] : [], ...o];
      p.reduce(ss(""), []), p?.[0] && (i = p[0].text);
    }
    let a = { role: "system", content: i };
    if (Array.isArray(e)) {
      let p = [], c = e, u = true;
      for (let d of c) {
        let m;
        if (u ? (m = this.renderSingleValueUserContent(d.values, o, r), u = false) : m = this.renderSingleValueUserContent(d.values, [], false), d.role === "user") {
          p.push({ role: "user", content: m });
          continue;
        }
        if (d.role !== "assistant") throw new Error("Invalid message role");
        if (typeof m != "string") throw new Error("Assistant message cannot contain non-text content like images, files,etc");
        p.push({ role: "assistant", content: m });
      }
      return [a, ...p];
    }
    let l = this.renderSingleValueUserContent(e, o, r);
    return [a, { role: "user", content: l }];
  };
  renderExtraFields = (e) => {
    let t = [];
    if (!e || e.length === 0) return t;
    let n = e.reduce((r, i) => {
      let a = i.title;
      return r[a] || (r[a] = []), r[a].push(i), r;
    }, {});
    return Object.entries(n).map(([r, i]) => {
      if (i.length === 1) {
        let a = i[0];
        return { title: r, name: a.name, description: a.description };
      }
      if (i.length > 1) {
        let a = i.map((l) => `- ${l.description}`).join(`
`);
        return { title: r, name: i[0].name, description: a };
      }
    }).filter(Boolean).forEach((r) => {
      let i = this.fieldTemplates?.[r.name] ?? this.defaultRenderInField;
      t.push(...i(r, r.description));
    }), t;
  };
  renderExamples = (e) => {
    let t = [], n = { isExample: true };
    for (let [o, r] of e.entries()) {
      let i = this.sig.getInputFields().map((p) => this.renderInField(p, r, { ...n, isInputField: true })).filter((p) => p !== void 0).flat(), a = this.sig.getOutputFields().map((p) => this.renderInField(p, r, { ...n, isInputField: false })).filter((p) => p !== void 0).flat(), l = [...i, ...a];
      o > 0 && l.length > 0 && l[0]?.type === "text" && t.push({ type: "text", text: `---

` }), l.forEach((p) => {
        "text" in p && (p.text = `${p.text}
`), t.push(p);
      });
    }
    return t;
  };
  renderInputFields = (e) => {
    let t = this.sig.getInputFields().map((n) => this.renderInField(n, e, void 0)).filter((n) => n !== void 0).flat();
    return t.filter((n) => n.type === "text").forEach((n) => {
      n.text = `${n.text}
`;
    }), t;
  };
  renderInField = (e, t, n) => {
    let o = t[e.name];
    if (Fi(e, o, n)) return;
    e.type && Et(e, o);
    let r = Pi(e, o);
    return (this.fieldTemplates?.[e.name] ?? this.defaultRenderInField)(e, r);
  };
  defaultRenderInField = (e, t) => {
    if (e.type?.name === "image") {
      let o = (i) => {
        if (!i) throw new Error("Image field value is required.");
        if (typeof i != "object") throw new Error("Image field value must be an object.");
        if (!("mimeType" in i)) throw new Error("Image field must have mimeType");
        if (!("data" in i)) throw new Error("Image field must have data");
        return i;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("Image field value must be an array.");
        r = r.concat(t.map((i) => {
          let a = o(i);
          return { type: "image", mimeType: a.mimeType, image: a.data };
        }));
      } else {
        let i = o(t);
        r.push({ type: "image", mimeType: i.mimeType, image: i.data });
      }
      return r;
    }
    if (e.type?.name === "audio") {
      let o = (i) => {
        if (!i) throw new Error("Audio field value is required.");
        if (typeof i != "object") throw new Error("Audio field value must be an object.");
        if (!("data" in i)) throw new Error("Audio field must have data");
        return i;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("Audio field value must be an array.");
        r = r.concat(t.map((i) => {
          let a = o(i);
          return { type: "audio", format: a.format ?? "wav", data: a.data };
        }));
      } else {
        let i = o(t);
        r.push({ type: "audio", format: i.format ?? "wav", data: i.data });
      }
      return r;
    }
    if (e.type?.name === "file") {
      let o = (i) => {
        if (!i) throw new Error("File field value is required.");
        if (typeof i != "object") throw new Error("File field value must be an object.");
        if (!("filename" in i)) throw new Error("File field must have filename");
        if (!("mimeType" in i)) throw new Error("File field must have mimeType");
        if (!("data" in i)) throw new Error("File field must have data");
        return i;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("File field value must be an array.");
        r = r.concat(t.map((i) => {
          let a = o(i);
          return { type: "file", filename: a.filename, mimeType: a.mimeType, data: a.data };
        }));
      } else {
        let i = o(t);
        r.push({ type: "file", filename: i.filename, mimeType: i.mimeType, data: i.data });
      }
      return r;
    }
    if (e.type?.name === "url") {
      let o = (i) => {
        if (!i) throw new Error("URL field value is required.");
        if (typeof i == "string") return { url: i };
        if (typeof i != "object") throw new Error("URL field value must be a string or object.");
        if (!("url" in i)) throw new Error("URL field must have url property");
        return i;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("URL field value must be an array.");
        r = r.concat(t.map((i) => {
          let a = o(i);
          return { type: "url", url: a.url, ...a.title ? { title: a.title } : {}, ...a.description ? { description: a.description } : {} };
        }));
      } else {
        let i = o(t);
        r.push({ type: "url", url: i.url, ...i.title ? { title: i.title } : {}, ...i.description ? { description: i.description } : {} });
      }
      return r;
    }
    let n = [e.title, ": "];
    return Array.isArray(t) ? (n.push(`
`), n.push(t.map((o) => `- ${o}`).join(`
`))) : n.push(t), [{ type: "text", text: n.join("") }];
  };
};
var rs = (s10) => s10.map((e) => `\`${e.title}\``).join(", ");
var ki = (s10) => s10.map((t) => {
  let n = t.title, o = t.type?.name ? is(t.type) : "string", r = t.isOptional ? `This optional ${o} field may be omitted` : `A ${o} field`, i = t.description ? ` ${_t(t.description)}` : "";
  return `${n}: (${r})${i}`.trim();
}).join(`
`);
var Ei = (s10) => s10.map((t) => {
  let n = t.title, o = t.type?.name ? is(t.type) : "string", r = t.isOptional ? `Only include this ${o} field if its value is available` : `This ${o} field must be included`, i = "";
  return t.description && t.description.length > 0 && (i = ` ${t.type?.name === "class" ? t.description : _t(t.description)}`), t.type?.options && t.type.options.length > 0 && (i.length > 0 && (i += ". "), i += `Allowed values: ${t.type.options.join(", ")}`), `${n}: (${r})${i}`.trim();
}).join(`
`);
var Pi = (s10, e) => {
  if (s10.type?.name === "date" && e instanceof Date) {
    let t = e.toISOString();
    return t.slice(0, t.indexOf("T"));
  }
  return s10.type?.name === "datetime" && e instanceof Date ? Hr(e) : s10.type?.name === "image" && typeof e == "object" || s10.type?.name === "audio" && typeof e == "object" || s10.type?.name === "file" && typeof e == "object" || s10.type?.name === "url" && (typeof e == "string" || typeof e == "object") || typeof e == "string" ? e : JSON.stringify(e, null, 2);
};
var is = (s10) => {
  let e = (() => {
    switch (s10?.name) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean (true or false)";
      case "date":
        return 'date ("YYYY-MM-DD" format)';
      case "datetime":
        return 'date time ("YYYY-MM-DD HH:mm Timezone" format)';
      case "json":
        return "JSON object";
      case "class":
        return "classification class";
      case "code":
        return "code";
      case "file":
        return "file (with filename, mimeType, and data)";
      case "url":
        return "URL (string or object with url, title, description)";
      default:
        return "string";
    }
  })();
  return s10?.isArray ? `json array of ${e} items` : e;
};
function ss(s10) {
  return (e, t) => {
    if (t.type === "text") {
      let n = e.length > 0 ? e[e.length - 1] : null;
      n && n.type === "text" ? n.text += s10 + t.text : e.push(t);
    } else e.push(t);
    return e;
  };
}
var Fi = (s10, e, t) => {
  if (typeof e == "boolean") return false;
  if (!e || (Array.isArray(e) || typeof e == "string") && e.length === 0) {
    if (t?.isExample || s10.isOptional || s10.isInternal) return true;
    let n = t?.isInputField !== false ? "input" : "output";
    throw new Error(`Value for ${n} field '${s10.name}' is required.`);
  }
  return false;
};
function _t(s10) {
  let e = s10.trim();
  return e.length > 0 ? `${e.charAt(0).toUpperCase()}${e.slice(1)}${e.endsWith(".") ? "" : "."}` : "";
}
function _i(s10, e) {
  let t = s10.history(0, e), n = t.some((r) => r.role === "function");
  return t.some((r) => r.role === "assistant" && "functionCalls" in r && Array.isArray(r.functionCalls) && r.functionCalls.length > 0) && n;
}
function Di(s10, e) {
  let t = s10.history(0, e), n = [], o = t.filter((i) => i.role === "assistant" && "functionCalls" in i && Array.isArray(i.functionCalls) && i.functionCalls.length > 0), r = t.filter((i) => i.role === "function");
  for (let i of o) if ("functionCalls" in i && i.functionCalls) for (let a of i.functionCalls) {
    let l = r.find((p) => "functionId" in p && p.functionId === a.id);
    l && "result" in l && "functionId" in l && n.push({ index: n.length, functionName: a.function.name, functionId: a.id, args: a.function.params || "", result: String(l.result), isError: "isError" in l ? !!l.isError : false });
  }
  return n;
}
async function Dt(s10, e, t, n) {
  if (!e?.resultPicker || s10.length <= 1) return 0;
  let o = e.resultPicker;
  if ((t ? _i(t, n) : false) && t) {
    let l = Di(t, n), p = await o({ type: "function", results: l });
    if (p < 0 || p >= l.length) throw new Error(`Result picker returned invalid index: ${p}. Must be between 0 and ${l.length - 1}`);
    return p;
  }
  let i = s10.map((l, p) => ({ index: p, sample: l.delta })), a = await o({ type: "fields", results: i });
  if (a < 0 || a >= s10.length) throw new Error(`Result picker returned invalid index: ${a}. Must be between 0 and ${s10.length - 1}`);
  return a;
}
async function as(s10, e, t) {
  let n = s10?.getLast(e);
  if (!n || n.role !== "assistant" || n.chat.length <= 1) return 0;
  let o = n.chat.map((i) => ({ version: 0, index: i.index, delta: i.value }));
  return await Dt(o, t, s10, e);
}
var q = class extends le {
  asserts;
  streamingAsserts;
  options;
  functions;
  fieldProcessors = [];
  streamingFieldProcessors = [];
  excludeContentFromTrace = false;
  thoughtFieldName;
  constructor(e, t) {
    super(e, { description: t?.description, traceLabel: t?.traceLabel }), this.options = t, this.thoughtFieldName = t?.thoughtFieldName ?? "thought", this.asserts = this.options?.asserts ?? [], this.streamingAsserts = this.options?.streamingAsserts ?? [], this.excludeContentFromTrace = t?.excludeContentFromTrace ?? false, this.usage = [], t?.functions && (this.functions = Jn(t.functions));
  }
  getSignatureName() {
    return this.signature.getDescription() || "unknown_signature";
  }
  getMetricsInstruments() {
    return Hn();
  }
  updateMeter(e) {
    Hn(e);
  }
  createStates(e) {
    return Array.from({ length: e }, (t, n) => ({ index: n, functionCalls: [], values: {}, content: "", functionsExecuted: /* @__PURE__ */ new Set(), xstate: { extractedFields: [], streamedIndex: {}, s: -1 } }));
  }
  addAssert = (e, t) => {
    this.asserts.push({ fn: e, message: t });
  };
  addStreamingAssert = (e, t, n) => {
    this.streamingAsserts.push({ fieldName: e, fn: t, message: n });
  };
  addFieldProcessorInternal = (e, t, n = false) => {
    let o = this.signature.getOutputFields().find((r) => r.name === e);
    if (!o) throw new Error(`addFieldProcessor: field ${e} not found`);
    if (n) {
      let r = o.type?.name;
      if (!(!r || r === "string" || r === "code")) throw new Error(`addFieldProcessor: field ${e} is must be a text field`);
      this.streamingFieldProcessors.push({ field: o, process: t });
    } else this.fieldProcessors.push({ field: o, process: t });
  };
  addStreamingFieldProcessor = (e, t) => {
    this.addFieldProcessorInternal(e, t, true);
  };
  addFieldProcessor = (e, t) => {
    this.addFieldProcessorInternal(e, t, false);
  };
  async forwardSendRequest({ ai: e, mem: t, options: n, traceContext: o, functions: r, functionCall: i, stepIndex: a }) {
    let { sessionId: l, model: p, rateLimiter: c, stream: u, thinkingTokenBudget: d, showThoughts: m } = n ?? {}, g = await as(t, l, { resultPicker: n?.resultPicker }), h = t?.history(g, l) ?? [];
    if (h.length === 0) throw new Error("No chat prompt found");
    let f = { ...n?.modelConfig, ...n?.sampleCount ? { n: n.sampleCount } : {}, ...n?.sampleCount && n?.modelConfig?.temperature === 1 ? { temperature: 0.8 } : {} }, A = this.isDebug(e, n), x = a === 0, y = this.getLogger(e, n);
    return await e.chat({ chatPrompt: h, functions: r, functionCall: i, modelConfig: f, model: p }, { sessionId: l, rateLimiter: c, stream: u, debug: A, debugHideSystemPrompt: !x, thinkingTokenBudget: d, showThoughts: m, traceContext: o, abortSignal: n?.abortSignal, stepIndex: a, logger: y });
  }
  async *forwardCore({ ai: e, mem: t, options: n, stepIndex: o, span: r, traceContext: i }) {
    let { sessionId: a, functions: l } = n ?? {}, p = n?.functionCall ?? this.options?.functionCall, c = n?.strictMode ?? false, u = n.model, d = this.createStates(n.sampleCount ?? 1), m = this.usage, g = o === 0, h = this.getLogger(e, n), { functions: f, functionCall: A } = qr(l, p, g), x = await this.forwardSendRequest({ ai: e, mem: t, options: n, traceContext: i, functions: f, functionCall: A, stepIndex: o });
    x instanceof ReadableStream ? yield* Xr({ ai: e, model: u, res: x, mem: t, sessionId: a, functions: f, strictMode: c, span: r, states: d, usage: m, asserts: this.asserts, streamingAsserts: this.streamingAsserts, fieldProcessors: this.fieldProcessors, streamingFieldProcessors: this.streamingFieldProcessors, thoughtFieldName: this.thoughtFieldName, excludeContentFromTrace: this.excludeContentFromTrace, signature: this.signature, logger: h, functionResultFormatter: n?.functionResultFormatter ?? this.options?.functionResultFormatter }) : yield* Zr({ ai: e, model: u, res: x, mem: t, sessionId: a, functions: f, span: r, strictMode: c, states: d, usage: m, asserts: this.asserts, fieldProcessors: this.fieldProcessors, thoughtFieldName: this.thoughtFieldName, excludeContentFromTrace: this.excludeContentFromTrace, signature: this.signature, logger: h, functionResultFormatter: n?.functionResultFormatter ?? this.options?.functionResultFormatter });
  }
  async *_forward2(e, t, n, o, r, i) {
    let a = (o?.stopFunction ?? this.options?.stopFunction)?.toLowerCase(), l = o.maxRetries ?? this.options?.maxRetries ?? 10, p = o.maxSteps ?? this.options?.maxSteps ?? 10, c = o.mem ?? this.options?.mem ?? new He(), u, d = this.options?.promptTemplate ?? Ye, m = { functions: o.functions, thoughtFieldName: this.thoughtFieldName }, g = new d(this.signature, m), h, f = performance.now();
    Array.isArray(t) ? (Yt(t), h = g.render(t, { examples: this.examples, demos: this.demos })) : h = g.render(t, { examples: this.examples, demos: this.demos });
    let A = performance.now() - f, x = this.getMetricsInstruments();
    x && vt(x, "prompt_render", A, this.getSignatureName());
    let y = performance.now();
    c.addRequest(h, o.sessionId);
    let v = performance.now() - y;
    x && vt(x, "memory_update", v, this.getSignatureName());
    e: for (let I = 0; I < p; I++) {
      for (let k = 0; k < l; k++) try {
        let S = this.forwardCore({ options: o, ai: e, mem: c, stepIndex: I, span: r, traceContext: i });
        for await (let N of S) N !== void 0 && (yield { version: k, index: N.index, delta: N.delta });
        if (es(c, a, n, o?.sessionId)) {
          let N = this.getMetricsInstruments();
          N && St(N, I + 1, p, this.getSignatureName());
          continue e;
        }
        let j = this.getMetricsInstruments();
        if (j) {
          St(j, I + 1, p, this.getSignatureName());
          let N = /* @__PURE__ */ new Set();
          n.forEach((te) => {
            te.functionsExecuted.forEach((ue) => N.add(ue));
          }), N.size > 0 && Wn(j, true, N.size, true, false, this.getSignatureName()), _r(j, this.fieldProcessors.length, this.streamingFieldProcessors.length, this.getSignatureName());
        }
        return;
      } catch (S) {
        let z, j = this.isDebug(e, o), N = this.getLogger(e, o), te = this.getMetricsInstruments(), ue = this.getSignatureName(), $ = { error: S, errCount: k, logger: N, metricsInstruments: te, signatureName: ue, span: r, debug: j };
        if (r?.recordException(S), S instanceof D) z = Nr($), u = S;
        else if (S instanceof ie) z = $r($), u = S;
        else if (S instanceof O) Ur($);
        else if (!(S instanceof Y)) throw ao(S, e, this.signature);
        z && (c.addRequest([{ role: "user", content: g.renderExtraFields(z) }], o.sessionId), c.addTag("error", o.sessionId));
      }
      let C = this.getMetricsInstruments();
      throw C && Vn(C, l, false, l, this.getSignatureName()), ao(new Error(`Unable to fix validation error: ${u?.toString()}`), e, this.signature);
    }
    throw x && St(x, p, p, this.getSignatureName()), ao(new Error(`Max steps reached: ${p}`), e, this.signature);
  }
  async *_forward1(e, t, n) {
    let o = performance.now(), r = this.createStates(n.sampleCount ?? 1), i = performance.now() - o, a = this.getMetricsInstruments();
    a && vt(a, "state_creation", i, this.getSignatureName());
    let l = n?.tracer ?? this.options?.tracer ?? e.getOptions().tracer, p = this.functions;
    if (n?.functions && (p = Jn(n.functions, this.functions)), !l) {
      yield* this._forward2(e, t, r, { ...n, functions: p });
      return;
    }
    let c = p?.map((A) => A.name).join(","), u = { signature: JSON.stringify(this.signature.toJSON(), null, 2), ...this.examples ? { examples: JSON.stringify(this.examples, null, 2) } : {}, ...c ? { provided_functions: c } : {}, ...n?.model ? { model: n.model } : {}, ...n?.thinkingTokenBudget ? { thinking_token_budget: n.thinkingTokenBudget } : {}, ...n?.showThoughts ? { show_thoughts: n.showThoughts } : {}, ...n?.maxSteps ? { max_steps: n.maxSteps } : {}, ...n?.maxRetries ? { max_retries: n.maxRetries } : {} }, d = this.traceLabel && n.traceLabel ? `${this.traceLabel} > ${n.traceLabel}` : n.traceLabel ?? this.traceLabel, m = d ? `AxGen > ${d}` : "AxGen", g = l.startSpan(m, { kind: SpanKind.SERVER, attributes: u }), h = context.active(), f = trace.setSpan(h, g);
    try {
      if (this.excludeContentFromTrace || g.addEvent("input", { content: JSON.stringify(t, null, 2) }), yield* this._forward2(e, t, r, { ...n, functions: p }, g, f), !this.excludeContentFromTrace) {
        let A = r.map((y) => y.values), x = A.length === 1 ? A[0] : A;
        g.addEvent("output", { content: JSON.stringify(x, null, 2) });
      }
    } finally {
      g.end();
    }
  }
  async forward(e, t, n) {
    let o = performance.now(), r = this.getSignatureName(), i = n?.stream ?? false, a = false, l = 0, p = false, c = 0, u = false;
    try {
      let d = this.getMetricsInstruments();
      d && Gr(d, this.signature.getInputFields().length, this.signature.getOutputFields().length, this.examples?.length ?? 0, this.demos?.length ?? 0, r), p = !!(n?.functions || this.functions);
      let m = this._forward1(e, t, n ?? {}), g = [], h = 0, f = 0;
      for await (let C of m) C.version !== h && (g = []), h = C.version, g = Zn(g, C), f++;
      l = h;
      let A = performance.now();
      u = !!n?.resultPicker;
      let x = await Dt(g, { resultPicker: n?.resultPicker }, n?.mem, n?.sessionId), y = performance.now() - A, I = g[x]?.delta ?? {};
      if (this.trace = { ...t, ...I }, u && this.isDebug(e, n)) {
        let C = this.getLogger(e, n);
        Wo(g.length, x, y, C);
      }
      return a = true, d && (Lr(d, g.length, u, u ? y : void 0, r), Dr(d, i, f, void 0, r)), I;
    } catch (d) {
      throw a = false, d;
    } finally {
      let d = performance.now() - o, m = this.getMetricsInstruments();
      m && (Pr(m, d, a, r, e.getName(), n?.model ? String(n.model) : void 0), p && Wn(m, p, c, c > 0, false, r), l > 0 && Vn(m, l, a, n?.maxRetries ?? 10, r));
    }
  }
  async *streamingForward(e, t, n) {
    if (!n?.resultPicker) {
      yield* this._forward1(e, t, { ...n, stream: true });
      return;
    }
    let o = this._forward1(e, t, { ...n, stream: true }), r = [], i = 0;
    for await (let p of o) p.version !== i && (r = []), i = p.version, r = Zn(r, p);
    let a = await Dt(r, { resultPicker: n?.resultPicker }, n?.mem, n?.sessionId), l = r[a];
    l && (yield { version: i, index: a, delta: l.delta });
  }
  setExamples(e, t) {
    super.setExamples(e, t);
  }
  isDebug(e, t) {
    return t?.debug ?? this.options?.debug ?? e.getOptions().debug ?? false;
  }
  getLogger(e, t) {
    return t?.logger ?? this.options?.logger ?? M.logger ?? e.getLogger();
  }
};
var Lt = class extends Error {
  details;
  constructor(e, t, n) {
    super(e), this.name = "AxGenerateError", this.details = t, n?.cause && (this.cause = n.cause);
  }
};
function ao(s10, e, t) {
  let n = s10 instanceof Error ? s10 : new Error(String(s10)), o = e.getLastUsedChatModel(), r = e.getLastUsedModelConfig(), i = { model: o, maxTokens: r?.maxTokens, streaming: r?.stream ?? false, signature: { input: t.getInputFields(), output: t.getOutputFields(), description: t.getDescription() } };
  return new Lt("Generate failed", i, { cause: n });
}
var $i = (s10) => s10.replace(/^\W+|\W+$/g, "");
var Ui = (s10, e) => {
  let t = s10.search(e);
  if (t === -1) return [s10];
  let n = s10.match(e);
  if (!n) throw new Error("Match failed unexpectedly.");
  let o = s10.substring(0, t), r = s10.substring(t + n[0].length);
  return [o, r];
};
var Bi = (s10) => {
  let e = /* @__PURE__ */ new Set(), t = [];
  for (let n of s10) e.has(n) || (e.add(n), t.push(n));
  return t;
};
var qi = (s10) => {
  let e = s10.match(/^(\d+)[.,\s]+(.*)$/);
  if (!e || e.length < 3) throw new Error('line must start with a number, a dot and then text. e.g. "1. hello"');
  let t = Number.parseInt(e[1], 10), n = e[2].trim();
  return { id: t, text: n };
};
var zi = (s10) => {
  let e = s10.match(/^(\d+)[.,\s]+(.*)$/);
  return e && e[2] !== void 0 ? e[2].trim() : s10;
};
var ji = (s10, e) => {
  let t = [];
  for (let n = 0; n < s10.length; n += e) t.push(s10.slice(n, n + e));
  return t;
};
var lo = { trimNonAlphaNum: $i, splitIntoTwo: Ui, dedup: Bi, extractIdAndText: qi, extractIndexPrefixedText: zi, batchArray: ji };
var po = class extends q {
  constructor(e) {
    super(`"You are a re-ranker assistant tasked with evaluating a set of content items in relation to a specific question. Your role involves critically analyzing each content item to determine its relevance to the question and re-ranking them accordingly. This process includes assigning a relevance score from 0 to 10 to each content item based on how well it answers the question, its coverage of the topic, and the reliability of its information. This re-ranked list should start with the content item that is most relevant to the question and end with the least relevant. Output only the list."
    query: string, items: string[] -> rankedItems: string[] "list of id, 5-words Rationale, relevance score"`, e);
  }
  forward = async (e, t, n) => {
    let { rankedItems: o } = await super.forward(e, t, n), r = o.map((a) => {
      let { id: l } = lo.extractIdAndText(a);
      return l;
    });
    return { rankedItems: t.items.map((a, l) => {
      let p = r[l];
      return p !== void 0 ? t.items[p] : void 0;
    }).filter((a) => a !== void 0) };
  };
};
var co = class {
  tikaUrl;
  fetch;
  constructor(e) {
    let t = e ?? { url: "http://localhost:9998/" };
    this.tikaUrl = new URL("/tika", t.url), this.fetch = t.fetch;
  }
  async _convert(e, t) {
    if (!e) throw new Error("Failed to read file data");
    let n = t?.format === "html" ? "text/html" : "text/plain";
    try {
      let o = { body: e, headers: { Accept: n }, method: "PUT" };
      typeof window > "u" && typeof process < "u" && (o.duplex = "half");
      let r = await (this.fetch ?? fetch)(this.tikaUrl, o);
      if (!r.ok) throw new Error(`Failed to upload file: ${r.statusText}`);
      return await r.text();
    } catch (o) {
      throw new Error(`Error converting file: ${o}`);
    }
  }
  async convert(e, t) {
    let n = [], o = t?.batchSize ?? 10;
    for (let r = 0; r < e.length; r += o) {
      let a = e.slice(r, r + o).map((p) => this._convert(p, { format: t?.format })), l = await Promise.all(a);
      n.push(...l);
    }
    return n;
  }
};
var ls = new L();
var uo = class {
  name;
  context;
  constructor(e, t) {
    this.name = e, this.context = t;
  }
  getName() {
    return this.name;
  }
  getContext() {
    return this.context;
  }
};
var mo = class {
  ai;
  db;
  debug;
  constructor(e) {
    this.db = new se(), this.ai = e;
  }
  getState() {
    return this.db.getDB();
  }
  setState(e) {
    this.db.setDB(e);
  }
  setClasses = async (e, t) => {
    for (let n of e) {
      let o = await this.ai.embed({ texts: n.getContext() }, { abortSignal: t?.abortSignal });
      await this.db.upsert({ id: n.getName(), table: "classes", values: o.embeddings[0] });
    }
  };
  async forward(e, t) {
    let { embeddings: n } = await this.ai.embed({ texts: [e] }, { abortSignal: t?.abortSignal }), r = (await this.db.query({ table: "classes", values: n[0] })).matches;
    if (typeof t?.cutoff == "number") {
      let { cutoff: a } = t;
      r = r.filter((l) => l.score <= a);
    }
    this.debug && console.log(`${ls.whiteBright(`query: ${e}`)}
${ls.greenBright(JSON.stringify(r.map((a) => `${a.id}, ${a.score}`)))}`);
    let i = r.at(0);
    return i ? i.id : "";
  }
  setOptions(e) {
    typeof e.debug == "boolean" && (this.debug = e.debug);
  }
};
var ps = /* @__PURE__ */ new Set(["0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "don't", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadn't", "happens", "hardly", "has", "hasn", "hasnt", "hasn't", "have", "haven", "haven't", "having", "he", "hed", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "here's", "hereupon", "hers", "herself", "hes", "he's", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "how's", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "i'd", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "i'll", "im", "i'm", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isn't", "it", "itd", "it'd", "it'll", "its", "it's", "itself", "iv", "i've", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "let's", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightn't", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustn't", "my", "myself", "model", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "needn't", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shan't", "she", "shed", "she'd", "she'll", "shes", "she's", "should", "shouldn", "shouldn't", "should've", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "there's", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'd", "they'll", "theyre", "they're", "they've", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "t's", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasn't", "way", "we", "wed", "we'd", "welcome", "well", "we'll", "well-b", "went", "were", "we're", "weren", "werent", "weren't", "we've", "what", "whatever", "what'll", "whats", "what's", "when", "whence", "whenever", "when's", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "where's", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "who's", "whose", "why", "why's", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "won't", "words", "world", "would", "wouldn", "wouldnt", "wouldn't", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "you'd", "you'll", "your", "youre", "you're", "yours", "yourself", "yourselves", "you've", "yr", "ys", "yt", "z", "zero", "zi", "zz", "task"]);
function cs(s10, e) {
  return s10.filter((t) => !e.has(t));
}
function us(s10) {
  let e = {};
  for (let t of s10) e[t] = (e[t] || 0) + 1;
  return e;
}
function pe(s10) {
  let e = s10.normalize("NFD");
  return e = e.replace(/\b(a|an|the)\b/g, " "), e = e.split(/\s+/).join(" "), e = e.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, ""), e.toLowerCase();
}
function Hi(s10, e) {
  return pe(s10) === pe(e) ? 1 : 0;
}
function Ki(s10, e) {
  let t = pe(s10).split(" "), n = pe(e).split(" "), o = us(t), r = us(n), i = 0;
  for (let p in o) {
    let c = o[p] ?? 0, u = r[p] ?? 0;
    i += Math.min(c, u);
  }
  if (i === 0) return 0;
  let a = i / t.length, l = i / n.length;
  return 2 * a * l / (a + l);
}
function Vi(s10, e, t, n = false) {
  let o = pe(s10).split(" "), r = pe(e).split(" "), i = pe(t).split(" "), a = /* @__PURE__ */ new Set([...ps, ...o]);
  r = cs(r, a), i = cs(i, a);
  let l = 0, p = l / r.length, c = l / i.length, u = 2 * p * c / (p + c);
  return n ? c : u;
}
var Wi = { emScore: Hi, f1Score: Ki, novelF1ScoreOptimized: Vi };
var go = class {
  ai;
  program;
  examples;
  constructor({ ai: e, program: t, examples: n = [] }) {
    if (n.length === 0) throw new Error("No examples found");
    this.ai = e, this.program = t, this.examples = n;
  }
  async run(e) {
    let t = Date.now(), n = this.examples.length, o = 0;
    for (let i = 0; i < n; i++) {
      let a = this.examples[i];
      if (!a) throw new Error("Invalid example");
      try {
        let l = await this.program.forward(this.ai, a, { maxRetries: 1 }), p = await e({ prediction: l, example: a });
        o += p;
      } catch (l) {
        console.warn(`Program evaluation failed for example ${i}: ${l instanceof Error ? l.message : "Unknown error"}`);
      }
    }
    let r = n > 0 ? o / n : 0;
    console.log(`
Performance: `, o, "/", n, "Average Score: ", r, `
`);
  }
};
var ho = class {
  rows = [];
  baseUrl;
  dataset;
  split;
  config;
  options;
  constructor({ dataset: e, split: t, config: n, options: o }) {
    this.baseUrl = "https://datasets-server.huggingface.co/rows", this.dataset = e, this.split = t, this.config = n, this.options = o;
  }
  async fetchDataFromAPI(e) {
    try {
      let t = await fetch(e);
      if (!t.ok) throw new Error(`Error fetching data: ${t.statusText}`);
      let n = await t.json();
      if (!n?.rows) throw new Error("Invalid data format");
      return n.rows;
    } catch (t) {
      throw console.error("Error fetching data from API:", t), t;
    }
  }
  async loadData() {
    let e = this.options?.offset ?? 0, t = this.options?.length ?? 100, n = encodeURIComponent(this.dataset), o = `${this.baseUrl}?dataset=${n}&config=${this.config}&split=${this.split}&offset=${e}&length=${t}`;
    return console.log("Downloading data from API."), this.rows = await this.fetchDataFromAPI(o), this.rows;
  }
  setData(e) {
    this.rows = e;
  }
  getData() {
    return this.rows;
  }
  async getRows({ count: e, fields: t, renameMap: n }) {
    if (this.rows.length === 0) throw new Error("No data loaded, call loadData or setData first.");
    return this.rows.slice(0, e).map((r) => {
      let i = {};
      return t.forEach((a) => {
        let l = a.split("."), p = r.row;
        for (let u of l) Object.hasOwn(p, u) && (p = p[u]);
        if (!p) return;
        let c = n && a in n ? n[a] : a;
        if (!c) throw new Error(`Invalid field name: ${a}`);
        i[c] = p;
      }), i;
    }).filter((r) => Object.keys(r).length !== 0);
  }
};
var ds = (s10) => {
  console.log(s10);
};
var ms = (s10 = ds) => {
  let e = new L(), t = e.gray("\u2500".repeat(50)), n = e.gray("\u2501".repeat(50));
  return (o) => {
    let r = "";
    switch (o.name) {
      case "OptimizationStart":
        r = `
${e.blueBright("\u25CF ")}${e.whiteBright("Optimization Started")}
${t}
  ${e.white("Optimizer:")} ${e.cyan(o.value.optimizerType)}
  ${e.white("Examples:")} ${e.green(o.value.exampleCount.toString())} training, ${e.green(o.value.validationCount.toString())} validation
  ${e.white("Config:")} ${e.white(JSON.stringify(o.value.config).slice(0, 80))}${JSON.stringify(o.value.config).length > 80 ? "..." : ""}
${n}
`;
        break;
      case "RoundProgress":
        r = `${e.yellow("\u25CF ")}${e.whiteBright(`Round ${o.value.round}/${o.value.totalRounds}`)}
  ${e.white("Score:")} ${e.green(o.value.currentScore.toFixed(3))} ${e.white("(best:")} ${e.greenBright(o.value.bestScore.toFixed(3))}${e.white(")")}
`;
        break;
      case "EarlyStopping":
        r = `
${e.red("\u25CF ")}${e.whiteBright("Early Stopping")}
${t}
  ${e.white("Round:")} ${e.yellow(o.value.round.toString())}
  ${e.white("Reason:")} ${e.yellow(o.value.reason)}
  ${e.white("Final Score:")} ${e.green(o.value.finalScore.toFixed(3))}
${n}
`;
        break;
      case "OptimizationComplete":
        r = `
${e.green("\u25CF ")}${e.whiteBright("Optimization Complete")}
${t}
  ${e.white("Best Score:")} ${e.greenBright(o.value.bestScore.toFixed(3))}
  ${e.white("Best Config:")} ${e.cyan(JSON.stringify(o.value.bestConfiguration).slice(0, 80))}${JSON.stringify(o.value.bestConfiguration).length > 80 ? "..." : ""}
  ${e.white("Total Calls:")} ${e.white(o.value.stats.totalCalls?.toString() || "N/A")}
  ${e.white("Success Rate:")} ${e.green(`${((o.value.stats.successfulDemos || 0) / Math.max(o.value.stats.totalCalls || 1, 1) * 100).toFixed(1)}%`)}
${n}
`;
        break;
      case "ConfigurationProposal":
        r = `${e.magenta("\u25CF ")}${e.whiteBright(`${o.value.type} Proposals`)} ${e.white(`(${o.value.count})`)}
  ${e.white("Candidates:")} ${e.white(o.value.proposals.slice(0, 2).map((i) => typeof i == "string" ? `"${i.slice(0, 40)}..."` : `${JSON.stringify(i).slice(0, 40)}...`).join(", "))}
`;
        break;
      case "BootstrappedDemos":
        r = `${e.cyan("\u25CF ")}${e.whiteBright("Bootstrapped Demos")} ${e.white(`(${o.value.count})`)}
  ${e.white("Generated:")} ${e.green(o.value.count.toString())} demonstration examples
`;
        break;
      case "BestConfigFound":
        r = `${e.green("\u25CF ")}${e.whiteBright("Best Configuration Found")}
  ${e.white("Score:")} ${e.greenBright(o.value.score.toFixed(3))}
  ${e.white("Config:")} ${e.cyan(JSON.stringify(o.value.config).slice(0, 80))}${JSON.stringify(o.value.config).length > 80 ? "..." : ""}
`;
        break;
      default:
        r = `${e.red("\u25CF ")}${e.whiteBright("Unknown Event")}
  ${e.white(JSON.stringify(o).slice(0, 100))}${JSON.stringify(o).length > 100 ? "..." : ""}
`;
    }
    s10(r);
  };
};
var Ji = (s10 = ds) => {
  let e = "\u2500".repeat(60);
  return (t) => {
    let n = "";
    switch (t.name) {
      case "OptimizationStart":
        n = `[ OPTIMIZATION START: ${t.value.optimizerType} ]
${e}
Config: ${JSON.stringify(t.value.config, null, 2)}
Examples: ${t.value.exampleCount}, Validation: ${t.value.validationCount}
${e}`;
        break;
      case "RoundProgress":
        n = `[ ROUND ${t.value.round}/${t.value.totalRounds} ]
Current Score: ${t.value.currentScore.toFixed(3)}, Best: ${t.value.bestScore.toFixed(3)}
Config: ${JSON.stringify(t.value.configuration)}
${e}`;
        break;
      case "EarlyStopping":
        n = `[ EARLY STOPPING at Round ${t.value.round} ]
Reason: ${t.value.reason}
Final Score: ${t.value.finalScore.toFixed(3)}
${e}`;
        break;
      case "OptimizationComplete":
        n = `[ OPTIMIZATION COMPLETE ]
${e}
Best Score: ${t.value.bestScore.toFixed(3)}
Best Config: ${JSON.stringify(t.value.bestConfiguration)}
Stats: ${JSON.stringify(t.value.stats, null, 2)}
${e}`;
        break;
      case "ConfigurationProposal":
        n = `[ CONFIG PROPOSAL: ${t.value.type} ]
Count: ${t.value.count}
Proposals: ${JSON.stringify(t.value.proposals.slice(0, 3), null, 2)} ${t.value.proposals.length > 3 ? "... (truncated)" : ""}
${e}`;
        break;
      case "BootstrappedDemos":
        n = `[ BOOTSTRAPPED DEMOS ]
Count: ${t.value.count}
Demos: ${JSON.stringify(t.value.demos.slice(0, 2), null, 2)} ${t.value.demos.length > 2 ? "... (truncated)" : ""}
${e}`;
        break;
      case "BestConfigFound":
        n = `[ BEST CONFIG FOUND ]
Score: ${t.value.score.toFixed(3)}
Config: ${JSON.stringify(t.value.config)}
${e}`;
        break;
      default:
        n = `[ UNKNOWN OPTIMIZER EVENT ]
${JSON.stringify(t)}
${e}`;
    }
    s10(n);
  };
};
var Ao = ms();
var gs = { enabled: true, enabledCategories: ["optimization", "convergence", "resource_usage", "teacher_student", "checkpointing", "pareto"], maxLabelLength: 100, samplingRate: 1 };
var Gt;
var Qi = (s10) => {
  if (Gt) return Gt;
  if (s10) return Gt = Zi(s10), Gt;
};
var Nt = gs;
var Yi = (s10) => {
  Nt = { ...Nt, ...s10 };
};
var Xi = () => ({ ...Nt });
var Zi = (s10) => ({ optimizationLatencyHistogram: s10.createHistogram("ax_optimizer_optimization_duration_ms", { description: "End-to-end duration of optimization runs", unit: "ms" }), optimizationRequestsCounter: s10.createCounter("ax_optimizer_optimization_requests_total", { description: "Total number of optimization requests" }), optimizationErrorsCounter: s10.createCounter("ax_optimizer_optimization_errors_total", { description: "Total number of failed optimizations" }), convergenceRoundsHistogram: s10.createHistogram("ax_optimizer_convergence_rounds", { description: "Number of rounds until convergence" }), convergenceScoreGauge: s10.createGauge("ax_optimizer_convergence_score", { description: "Current best score during optimization" }), convergenceImprovementGauge: s10.createGauge("ax_optimizer_convergence_improvement", { description: "Improvement in score from baseline" }), stagnationRoundsGauge: s10.createGauge("ax_optimizer_stagnation_rounds", { description: "Number of rounds without improvement" }), earlyStoppingCounter: s10.createCounter("ax_optimizer_early_stopping_total", { description: "Total number of early stopping events" }), tokenUsageCounter: s10.createCounter("ax_optimizer_token_usage_total", { description: "Total tokens used during optimization" }), costUsageCounter: s10.createCounter("ax_optimizer_cost_usage_total", { description: "Total cost incurred during optimization", unit: "$" }), memoryUsageGauge: s10.createGauge("ax_optimizer_memory_usage_bytes", { description: "Peak memory usage during optimization", unit: "By" }), optimizationDurationHistogram: s10.createHistogram("ax_optimizer_duration_ms", { description: "Duration of optimization runs", unit: "ms" }), teacherStudentUsageCounter: s10.createCounter("ax_optimizer_teacher_student_usage_total", { description: "Total number of teacher-student interactions" }), teacherStudentLatencyHistogram: s10.createHistogram("ax_optimizer_teacher_student_latency_ms", { description: "Latency of teacher-student interactions", unit: "ms" }), teacherStudentScoreImprovementGauge: s10.createGauge("ax_optimizer_teacher_student_score_improvement", { description: "Score improvement from teacher-student interactions" }), checkpointSaveCounter: s10.createCounter("ax_optimizer_checkpoint_save_total", { description: "Total number of checkpoint saves" }), checkpointLoadCounter: s10.createCounter("ax_optimizer_checkpoint_load_total", { description: "Total number of checkpoint loads" }), checkpointSaveLatencyHistogram: s10.createHistogram("ax_optimizer_checkpoint_save_latency_ms", { description: "Latency of checkpoint save operations", unit: "ms" }), checkpointLoadLatencyHistogram: s10.createHistogram("ax_optimizer_checkpoint_load_latency_ms", { description: "Latency of checkpoint load operations", unit: "ms" }), paretoOptimizationsCounter: s10.createCounter("ax_optimizer_pareto_optimizations_total", { description: "Total number of Pareto optimizations" }), paretoFrontSizeHistogram: s10.createHistogram("ax_optimizer_pareto_front_size", { description: "Size of Pareto frontier" }), paretoHypervolumeGauge: s10.createGauge("ax_optimizer_pareto_hypervolume", { description: "Hypervolume of Pareto frontier" }), paretoSolutionsGeneratedHistogram: s10.createHistogram("ax_optimizer_pareto_solutions_generated", { description: "Number of solutions generated for Pareto optimization" }), programInputFieldsGauge: s10.createGauge("ax_optimizer_program_input_fields", { description: "Number of input fields in optimized program" }), programOutputFieldsGauge: s10.createGauge("ax_optimizer_program_output_fields", { description: "Number of output fields in optimized program" }), examplesCountGauge: s10.createGauge("ax_optimizer_examples_count", { description: "Number of training examples used" }), validationSetSizeGauge: s10.createGauge("ax_optimizer_validation_set_size", { description: "Size of validation set used" }), evaluationLatencyHistogram: s10.createHistogram("ax_optimizer_evaluation_latency_ms", { description: "Latency of program evaluations", unit: "ms" }), demoGenerationLatencyHistogram: s10.createHistogram("ax_optimizer_demo_generation_latency_ms", { description: "Latency of demo generation", unit: "ms" }), metricComputationLatencyHistogram: s10.createHistogram("ax_optimizer_metric_computation_latency_ms", { description: "Latency of metric computation", unit: "ms" }), optimizerTypeGauge: s10.createGauge("ax_optimizer_type", { description: "Type of optimizer being used" }), targetScoreGauge: s10.createGauge("ax_optimizer_target_score", { description: "Target score for optimization" }), maxRoundsGauge: s10.createGauge("ax_optimizer_max_rounds", { description: "Maximum rounds for optimization" }) });
var Q = (s10) => {
  let e = {};
  for (let [t, n] of Object.entries(s10)) if (n != null) {
    let o = String(n), r = Nt.maxLabelLength;
    e[t] = o.length > r ? o.substring(0, r) : o;
  }
  return e;
};
var ea = (s10, e, t, n, o) => {
  try {
    let r = Q({ success: t.toString(), optimizer_type: n, ...o ? { program_signature: o } : {} });
    s10.optimizationLatencyHistogram && s10.optimizationLatencyHistogram.record(e, r), s10.optimizationRequestsCounter && s10.optimizationRequestsCounter.add(1, r), !t && s10.optimizationErrorsCounter && s10.optimizationErrorsCounter.add(1, r);
  } catch (r) {
    console.warn("Failed to record optimization metric:", r);
  }
};
var ta = (s10, e, t, n, o, r) => {
  try {
    let i = Q({ optimizer_type: r });
    s10.convergenceRoundsHistogram && s10.convergenceRoundsHistogram.record(e, i), s10.convergenceScoreGauge && s10.convergenceScoreGauge.record(t, i), s10.convergenceImprovementGauge && s10.convergenceImprovementGauge.record(n, i), s10.stagnationRoundsGauge && s10.stagnationRoundsGauge.record(o, i);
  } catch (i) {
    console.warn("Failed to record convergence metric:", i);
  }
};
var na = (s10, e, t) => {
  try {
    let n = Q({ reason: e, optimizer_type: t });
    s10.earlyStoppingCounter && s10.earlyStoppingCounter.add(1, n);
  } catch (n) {
    console.warn("Failed to record early stopping metric:", n);
  }
};
var oa = (s10, e, t, n, o) => {
  try {
    let r = Q({ optimizer_type: n });
    s10.tokenUsageCounter && s10.tokenUsageCounter.add(e, r), s10.costUsageCounter && s10.costUsageCounter.add(t, r), o !== void 0 && s10.memoryUsageGauge && s10.memoryUsageGauge.record(o, r);
  } catch (r) {
    console.warn("Failed to record resource usage metric:", r);
  }
};
var ra = (s10, e, t) => {
  try {
    let n = Q({ optimizer_type: t });
    s10.optimizationDurationHistogram && s10.optimizationDurationHistogram.record(e, n);
  } catch (n) {
    console.warn("Failed to record optimization duration metric:", n);
  }
};
var sa = (s10, e, t, n) => {
  try {
    let o = Q({ optimizer_type: n });
    s10.teacherStudentUsageCounter && s10.teacherStudentUsageCounter.add(1, o), s10.teacherStudentLatencyHistogram && s10.teacherStudentLatencyHistogram.record(e, o), s10.teacherStudentScoreImprovementGauge && s10.teacherStudentScoreImprovementGauge.record(t, o);
  } catch (o) {
    console.warn("Failed to record teacher-student metric:", o);
  }
};
var ia = (s10, e, t, n, o) => {
  try {
    let r = Q({ operation: e, success: n.toString(), optimizer_type: o });
    e === "save" ? (s10.checkpointSaveCounter && s10.checkpointSaveCounter.add(1, r), s10.checkpointSaveLatencyHistogram && s10.checkpointSaveLatencyHistogram.record(t, r)) : (s10.checkpointLoadCounter && s10.checkpointLoadCounter.add(1, r), s10.checkpointLoadLatencyHistogram && s10.checkpointLoadLatencyHistogram.record(t, r));
  } catch (r) {
    console.warn("Failed to record checkpoint metric:", r);
  }
};
var aa = (s10, e, t, n, o) => {
  try {
    let r = Q({ optimizer_type: n });
    s10.paretoOptimizationsCounter && s10.paretoOptimizationsCounter.add(1, r), s10.paretoFrontSizeHistogram && s10.paretoFrontSizeHistogram.record(e, r), o !== void 0 && s10.paretoHypervolumeGauge && s10.paretoHypervolumeGauge.record(o, r), s10.paretoSolutionsGeneratedHistogram && s10.paretoSolutionsGeneratedHistogram.record(t, r);
  } catch (r) {
    console.warn("Failed to record Pareto metric:", r);
  }
};
var la = (s10, e, t, n, o, r) => {
  try {
    let i = Q({ optimizer_type: r });
    s10.programInputFieldsGauge && s10.programInputFieldsGauge.record(e, i), s10.programOutputFieldsGauge && s10.programOutputFieldsGauge.record(t, i), s10.examplesCountGauge && s10.examplesCountGauge.record(n, i), s10.validationSetSizeGauge && s10.validationSetSizeGauge.record(o, i);
  } catch (i) {
    console.warn("Failed to record program complexity metric:", i);
  }
};
var pa = (s10, e, t, n) => {
  try {
    let o = Q({ metric_type: e, optimizer_type: n });
    switch (e) {
      case "evaluation":
        s10.evaluationLatencyHistogram && s10.evaluationLatencyHistogram.record(t, o);
        break;
      case "demo_generation":
        s10.demoGenerationLatencyHistogram && s10.demoGenerationLatencyHistogram.record(t, o);
        break;
      case "metric_computation":
        s10.metricComputationLatencyHistogram && s10.metricComputationLatencyHistogram.record(t, o);
        break;
    }
  } catch (o) {
    console.warn("Failed to record optimizer performance metric:", o);
  }
};
var ca = (s10, e, t, n) => {
  try {
    let o = Q({ optimizer_type: e });
    s10.optimizerTypeGauge && s10.optimizerTypeGauge.record(1, o), t !== void 0 && s10.targetScoreGauge && s10.targetScoreGauge.record(t, o), n !== void 0 && s10.maxRoundsGauge && s10.maxRoundsGauge.record(n, o);
  } catch (o) {
    console.warn("Failed to record optimizer configuration metric:", o);
  }
};
var $t = class {
  tokenUsage = {};
  totalTokens = 0;
  costPerModel;
  maxCost;
  maxTokens;
  constructor(e) {
    this.costPerModel = e?.costPerModel ?? {}, this.maxCost = e?.maxCost, this.maxTokens = e?.maxTokens;
  }
  trackTokens(e, t) {
    this.tokenUsage[t] = (this.tokenUsage[t] || 0) + e, this.totalTokens += e;
  }
  getCurrentCost() {
    let e = 0;
    for (let [t, n] of Object.entries(this.tokenUsage)) {
      let o = this.costPerModel[t] || 1e-3;
      e += n / 1e3 * o;
    }
    return e;
  }
  getTokenUsage() {
    return { ...this.tokenUsage };
  }
  getTotalTokens() {
    return this.totalTokens;
  }
  isLimitReached() {
    return this.maxTokens !== void 0 && this.totalTokens >= this.maxTokens || this.maxCost !== void 0 && this.getCurrentCost() >= this.maxCost;
  }
  reset() {
    this.tokenUsage = {}, this.totalTokens = 0;
  }
};
var ce = class {
  studentAI;
  teacherAI;
  examples;
  validationSet;
  targetScore;
  minSuccessRate;
  onProgress;
  onEarlyStop;
  costTracker;
  seed;
  checkpointSave;
  checkpointLoad;
  checkpointInterval;
  resumeFromCheckpoint;
  logger;
  verbose;
  debugOptimizer;
  optimizerLogger;
  currentRound = 0;
  scoreHistory = [];
  configurationHistory = [];
  stats;
  metricsInstruments;
  constructor(e) {
    if (e.examples.length === 0) throw new Error("No examples found");
    this.studentAI = e.studentAI, this.teacherAI = e.teacherAI, this.examples = e.examples, this.validationSet = e.validationSet, this.targetScore = e.targetScore, this.minSuccessRate = e.minSuccessRate, this.onProgress = e.onProgress, this.onEarlyStop = e.onEarlyStop, this.seed = e.seed, this.checkpointSave = e.checkpointSave, this.checkpointLoad = e.checkpointLoad, this.checkpointInterval = e.checkpointInterval ?? 10, this.resumeFromCheckpoint = e.resumeFromCheckpoint, this.logger = e.logger, this.verbose = e.verbose;
    let t = new $t({ maxTokens: 1e6 });
    this.costTracker = e.costTracker ?? t, this.metricsInstruments = Qi(M.meter), this.stats = this.initializeStats(), this.debugOptimizer = e.debugOptimizer ?? false, this.optimizerLogger = e.optimizerLogger;
  }
  initializeStats() {
    return { totalCalls: 0, successfulDemos: 0, estimatedTokenUsage: 0, earlyStopped: false, resourceUsage: { totalTokens: 0, totalTime: 0, avgLatencyPerEval: 0, costByModel: {} }, convergenceInfo: { converged: false, finalImprovement: 0, stagnationRounds: 0, convergenceThreshold: 0.01 }, bestScore: 0, bestConfiguration: {} };
  }
  setupRandomSeed() {
    this.seed !== void 0 && (Math.random = (() => {
      let e = this.seed;
      return () => (e = (e * 9301 + 49297) % 233280, e / 233280);
    })());
  }
  checkCostLimits() {
    return this.costTracker?.isLimitReached() ?? false;
  }
  checkTargetScore(e) {
    return this.targetScore !== void 0 && e >= this.targetScore;
  }
  updateResourceUsage(e, t = 0) {
    this.stats.resourceUsage.totalTime = Date.now() - e, this.stats.resourceUsage.totalTokens += t, this.stats.totalCalls > 0 && (this.stats.resourceUsage.avgLatencyPerEval = this.stats.resourceUsage.totalTime / this.stats.totalCalls);
  }
  triggerEarlyStopping(e, t) {
    this.stats.earlyStopped = true, this.stats.earlyStopping = { bestScoreRound: t, patienceExhausted: e.includes("improvement"), reason: e }, this.recordEarlyStoppingMetrics(e, "unknown"), this.onEarlyStop && this.onEarlyStop(e, this.stats), this.getOptimizerLogger()?.({ name: "EarlyStopping", value: { reason: e, finalScore: this.stats.bestScore ?? 0, round: t } });
  }
  getValidationSet(e) {
    return e?.overrideValidationSet || this.validationSet || this.examples.slice(0, Math.floor(this.examples.length * 0.2));
  }
  getAIService(e = false, t) {
    return e && t?.overrideTeacherAI ? t.overrideTeacherAI : e && this.teacherAI ? this.teacherAI : this.studentAI;
  }
  hasTeacherAI(e) {
    return e?.overrideTeacherAI !== void 0 || this.teacherAI !== void 0;
  }
  getTeacherOrStudentAI(e) {
    return e?.overrideTeacherAI || this.teacherAI || this.studentAI;
  }
  async executeWithTeacher(e, t = true, n) {
    let o = this.getAIService(t, n);
    return await e(o);
  }
  async *compileStream(e, t, n) {
    let o = Date.now(), r = this.constructor.name, i = e.getSignature().toString();
    this.recordOptimizationStart(r, i);
    let a, l = (m, g, h, f, A, x, y, v = {}, I) => {
      this.getOptimizerLogger(I)?.({ name: "RoundProgress", value: { round: m, totalRounds: I?.maxIterations ?? 0, currentScore: g, bestScore: x, configuration: h } }), this.updateOptimizationProgress(m, g, h, f, A, x, y, v, I);
    }, p = (m, g) => {
      a = m, this.triggerEarlyStopping(m, this.currentRound);
    }, c = (m) => {
      this.onProgress?.(m), l(m.round, m.currentScore, m.currentConfiguration || {}, r, {}, m.bestScore, m.bestConfiguration, m.convergenceInfo, n);
    }, u = await this.compile(e, t, { ...n, overrideOnProgress: c, overrideOnEarlyStop: p }), d = Date.now() - o;
    return this.recordOptimizationComplete(d, true, r, i), a && this.getLogger(n)?.({ name: "Notification", id: "optimization_early_stop", value: `Optimization stopped early due to ${a}` }), { demos: u.demos, stats: u.stats, bestScore: u.bestScore, finalConfiguration: u.finalConfiguration, scoreHistory: u.scoreHistory, configurationHistory: u.configurationHistory };
  }
  async compilePareto(e, t, n) {
    let o = this.constructor.name, r = Date.now(), i = await this.generateWeightedSolutions(e, t, n), a = await this.generateConstraintSolutions(e, t, n), l = [...i, ...a], p = this.findParetoFrontier(l), c = this.calculateHypervolume(p);
    this.updateResourceUsage(r), this.stats.convergenceInfo.converged = true, this.recordParetoMetrics(p.length, l.length, "base_optimizer", c);
    let u = p.length > 0 ? Math.max(...p.map((d) => Math.max(...Object.values(d.scores)))) : 0;
    return { demos: p.length > 0 ? [...p[0].demos] : void 0, stats: this.stats, bestScore: u, paretoFront: p, hypervolume: c, paretoFrontSize: p.length, finalConfiguration: { paretoFrontSize: p.length, hypervolume: c, strategy: "weighted_combinations_and_constraints", numSolutions: l.length } };
  }
  async generateWeightedSolutions(e, t, n) {
    let o = [], r = this.examples[0], i = await e.forward(this.getAIService(false, n), r), a = await t({ prediction: i, example: r }), l = Object.keys(a), p = this.generateWeightCombinations(l);
    for (let c = 0; c < p.length; c++) {
      let u = p[c], d = async ({ prediction: m, example: g }) => {
        let h = await t({ prediction: m, example: g }), f = 0;
        for (let [A, x] of Object.entries(h)) f += x * (u[A] || 0);
        return f;
      };
      try {
        let m = await this.compile(e, d, { ...n, verbose: false }), g = await this.evaluateWithMultiObjective(e, m, t);
        o.push({ scores: g, demos: m.demos, configuration: { ...m.finalConfiguration, weights: u, strategy: "weighted_combination" } });
      } catch {
      }
    }
    return o;
  }
  async generateConstraintSolutions(e, t, n) {
    let o = [], r = this.examples[0], i = await e.forward(this.getAIService(false, n), r), a = await t({ prediction: i, example: r }), l = Object.keys(a);
    for (let p of l) {
      let c = async ({ prediction: u, example: d }) => {
        let m = await t({ prediction: u, example: d }), g = m[p] || 0, h = 0;
        for (let [f, A] of Object.entries(m)) f !== p && A < 0.3 && (h += (0.3 - A) * 2);
        return g - h;
      };
      try {
        let u = await this.compile(e, c, { ...n, verbose: false }), d = await this.evaluateWithMultiObjective(e, u, t);
        o.push({ scores: d, demos: u.demos, configuration: { ...u.finalConfiguration, primaryObjective: p, strategy: "constraint_based" } });
      } catch {
      }
    }
    return o;
  }
  generateWeightCombinations(e) {
    let t = [];
    for (let o of e) {
      let r = {};
      for (let i of e) r[i] = i === o ? 1 : 0;
      t.push(r);
    }
    let n = {};
    for (let o of e) n[o] = 1 / e.length;
    if (t.push(n), e.length === 2) {
      let [o, r] = e;
      for (let i = 0.1; i <= 0.9; i += 0.2) {
        let a = 1 - i;
        t.push({ [o]: i, [r]: a });
      }
    }
    if (e.length === 3) {
      let [o, r, i] = e;
      t.push({ [o]: 0.5, [r]: 0.3, [i]: 0.2 }, { [o]: 0.3, [r]: 0.5, [i]: 0.2 }, { [o]: 0.2, [r]: 0.3, [i]: 0.5 });
    }
    return t;
  }
  async evaluateWithMultiObjective(e, t, n) {
    let o = new q(e.getSignature());
    t.demos && o.setDemos(t.demos);
    let r = [];
    for (let c of this.examples) {
      let u = await o.forward(this.studentAI, c);
      r.push({ prediction: u, example: c });
    }
    let i = this.getValidationSet(), a = {}, l = i.slice(0, Math.min(5, i.length));
    for (let c of l) try {
      let u = await o.forward(this.studentAI, c), d = await n({ prediction: u, example: c });
      for (let [m, g] of Object.entries(d)) a[m] || (a[m] = []), a[m].push(g);
    } catch {
    }
    let p = {};
    for (let [c, u] of Object.entries(a)) p[c] = u.length > 0 ? u.reduce((d, m) => d + m, 0) / u.length : 0;
    return p;
  }
  findParetoFrontier(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let o = e[n], r = false, i = 0;
      for (let a = 0; a < e.length; a++) {
        if (n === a) continue;
        let l = e[a];
        if (this.dominates(l.scores, o.scores)) {
          r = true;
          break;
        }
        this.dominates(o.scores, l.scores) && i++;
      }
      r || t.push({ demos: o.demos || [], scores: o.scores, configuration: o.configuration, dominatedSolutions: i });
    }
    return t;
  }
  dominates(e, t) {
    let n = Object.keys(e), o = true, r = false;
    for (let i of n) {
      let a = e[i] || 0, l = t[i] || 0;
      if (a < l) {
        o = false;
        break;
      }
      a > l && (r = true);
    }
    return o && r;
  }
  calculateHypervolume(e) {
    if (e.length === 0) return;
    let t = e[0], n = Object.keys(t.scores);
    if (n.length === 2) {
      let [o, r] = n, i = 0, a = [...e].sort((p, c) => (c.scores[o] || 0) - (p.scores[o] || 0)), l = 0;
      for (let p of a) {
        let c = p.scores[o] || 0, u = p.scores[r] || 0;
        i += c * (u - l), l = Math.max(l, u);
      }
      return i;
    }
  }
  async saveCheckpoint(e, t, n, o, r = {}, i) {
    let a = i?.overrideCheckpointSave || this.checkpointSave;
    if (!a) return;
    let l = Date.now(), p = false, c;
    try {
      let u = { version: "1.0.0", timestamp: Date.now(), optimizerType: e, optimizerConfig: t, currentRound: this.currentRound, totalRounds: this.stats.resourceUsage.totalTime > 0 ? this.currentRound : 0, bestScore: n, bestConfiguration: o, scoreHistory: [...this.scoreHistory], configurationHistory: [...this.configurationHistory], stats: { ...this.stats }, optimizerState: r, examples: this.examples, validationSet: this.validationSet };
      c = await a(u), p = true;
    } catch (u) {
      throw p = false, u;
    } finally {
      let u = Date.now() - l;
      this.recordCheckpointMetrics("save", u, p, e);
    }
    return c;
  }
  async loadCheckpoint(e, t) {
    let n = t?.overrideCheckpointLoad || this.checkpointLoad;
    if (!n) return null;
    let o = Date.now(), r = false, i = null;
    try {
      i = await n(e), r = i !== null;
    } catch (a) {
      throw r = false, a;
    } finally {
      let a = Date.now() - o;
      this.recordCheckpointMetrics("load", a, r, "unknown");
    }
    return i;
  }
  restoreFromCheckpoint(e) {
    this.currentRound = e.currentRound, this.scoreHistory = [...e.scoreHistory], this.configurationHistory = [...e.configurationHistory], this.stats = { ...e.stats };
  }
  shouldSaveCheckpoint(e, t) {
    let n = t?.overrideCheckpointInterval || this.checkpointInterval;
    return n !== void 0 && e % n === 0;
  }
  async updateOptimizationProgress(e, t, n, o, r, i, a, l = {}, p) {
    this.currentRound = e, this.scoreHistory.push(t), this.configurationHistory.push(n), this.shouldSaveCheckpoint(e, p) && await this.saveCheckpoint(o, r, i, a, l, p), this.getOptimizerLogger(p)?.({ name: "RoundProgress", value: { round: e, totalRounds: p?.maxIterations ?? 0, currentScore: t, bestScore: i, configuration: n } });
  }
  async saveFinalCheckpoint(e, t, n, o, r = {}, i) {
    i?.saveCheckpointOnComplete !== false && await this.saveCheckpoint(e, t, n, o, { ...r, final: true }, i);
  }
  getLogger(e) {
    if (this.isLoggingEnabled(e)) return this.logger ? this.logger : this.studentAI.getLogger();
  }
  isLoggingEnabled(e) {
    return e?.verbose !== void 0 ? e.verbose : this.verbose ?? true;
  }
  recordOptimizationStart(e, t) {
    if (this.metricsInstruments) {
      if (t) {
        let n = (t.match(/input:/g) || []).length, o = (t.match(/output:/g) || []).length;
        la(this.metricsInstruments, n, o, this.examples.length, this.getValidationSet().length, e);
      }
      ca(this.metricsInstruments, e, this.targetScore, void 0);
    }
  }
  recordOptimizationComplete(e, t, n, o) {
    if (!this.metricsInstruments) return;
    ea(this.metricsInstruments, e, t, n, o), ra(this.metricsInstruments, e, n);
    let r = this.costTracker?.getCurrentCost() ?? 0, i = this.costTracker?.getTotalTokens() ?? 0;
    oa(this.metricsInstruments, i, r, n);
  }
  recordConvergenceMetrics(e, t, n, o, r) {
    this.metricsInstruments && ta(this.metricsInstruments, e, t, n, o, r);
  }
  recordEarlyStoppingMetrics(e, t) {
    this.metricsInstruments && na(this.metricsInstruments, e, t);
  }
  recordTeacherStudentMetrics(e, t, n) {
    this.metricsInstruments && sa(this.metricsInstruments, e, t, n);
  }
  recordCheckpointMetrics(e, t, n, o) {
    this.metricsInstruments && ia(this.metricsInstruments, e, t, n, o);
  }
  recordParetoMetrics(e, t, n, o) {
    this.metricsInstruments && aa(this.metricsInstruments, e, t, n, o);
  }
  recordPerformanceMetrics(e, t, n) {
    this.metricsInstruments && pa(this.metricsInstruments, e, t, n);
  }
  isOptimizerLoggingEnabled(e) {
    return this.debugOptimizer || (e?.verbose ?? this.verbose ?? false);
  }
  getOptimizerLogger(e) {
    if (this.isOptimizerLoggingEnabled(e)) return this.optimizerLogger ?? M.optimizerLogger ?? Ao;
  }
  getStats() {
    return { ...this.stats };
  }
  reset() {
    this.stats = this.initializeStats(), this.costTracker?.reset(), this.currentRound = 0, this.scoreHistory = [], this.configurationHistory = [];
  }
};
var Xe = class extends ce {
  maxRounds;
  maxDemos;
  maxExamples;
  batchSize;
  earlyStoppingPatience;
  costMonitoring;
  maxTokensPerGeneration;
  verboseMode;
  debugMode;
  traces = [];
  constructor(e) {
    super(e);
    let t = e.options || {};
    this.maxRounds = t.maxRounds ?? 3, this.maxDemos = t.maxDemos ?? 4, this.maxExamples = t.maxExamples ?? 16, this.batchSize = t.batchSize ?? 1, this.earlyStoppingPatience = t.earlyStoppingPatience ?? 0, this.costMonitoring = t.costMonitoring ?? false, this.maxTokensPerGeneration = t.maxTokensPerGeneration ?? 0, this.verboseMode = t.verboseMode ?? true, this.debugMode = t.debugMode ?? false;
  }
  async compileRound(e, t, n, o) {
    let r = Date.now(), i = o?.maxDemos ?? this.maxDemos, a = { modelConfig: { temperature: 0.7 } };
    this.maxTokensPerGeneration > 0 && (a.modelConfig.max_tokens = this.maxTokensPerGeneration);
    let l = da(this.examples, this.maxExamples), p = this.traces.length;
    for (let c = 0; c < l.length; c += this.batchSize) {
      c > 0 && (a.modelConfig.temperature = 0.7 + 1e-3 * c);
      let u = l.slice(c, c + this.batchSize);
      for (let d of u) {
        if (!d) continue;
        let m = l.filter((f) => f !== d);
        e.setExamples(m);
        let g = this.getTeacherOrStudentAI();
        this.stats.totalCalls++;
        let h;
        try {
          let f = { ...a, maxRetries: 1 };
          h = await e.forward(g, d, f), this.costMonitoring && (this.stats.estimatedTokenUsage += JSON.stringify(d).length / 4 + JSON.stringify(h).length / 4), await n({ prediction: h, example: d }) >= 0.5 && (this.traces = [...this.traces, ...e.getTraces()], this.stats.successfulDemos++);
        } catch (f) {
          (this.verboseMode || this.debugMode) && console.warn(`Student model failed during bootstrap: ${f instanceof Error ? f.message : "Unknown error"}`), h = {};
        }
        if (this.traces.length >= i) return;
      }
    }
    if (this.earlyStoppingPatience > 0) {
      let u = this.traces.length - p;
      if (!this.stats.earlyStopping) this.stats.earlyStopping = { bestScoreRound: u > 0 ? t : 0, patienceExhausted: false, reason: "No improvement detected" };
      else if (u > 0) this.stats.earlyStopping.bestScoreRound = t;
      else if (t - this.stats.earlyStopping.bestScoreRound >= this.earlyStoppingPatience) {
        this.stats.earlyStopping.patienceExhausted = true, this.stats.earlyStopped = true, this.stats.earlyStopping.reason = `No improvement for ${this.earlyStoppingPatience} rounds`;
        return;
      }
    }
  }
  async compile(e, t, n) {
    let o = n?.maxIterations ?? this.maxRounds;
    this.traces = [], this.reset();
    for (let a = 0; a < o && (await this.compileRound(e, a, t, n), !this.stats.earlyStopped); a++) ;
    if (this.traces.length === 0) throw new Error("No demonstrations found. Either provide more examples or improve the existing ones.");
    let r = ua(this.traces), i = 0;
    return this.traces.length > 0 && (i = this.stats.successfulDemos / Math.max(1, this.stats.totalCalls)), { demos: r, stats: this.stats, bestScore: i, finalConfiguration: { maxRounds: this.maxRounds, maxDemos: this.maxDemos, batchSize: this.batchSize, successRate: i } };
  }
};
function ua(s10) {
  let e = /* @__PURE__ */ new Map();
  for (let n of s10) if (e.has(n.programId)) {
    let o = e.get(n.programId);
    o && o.push(n.trace);
  } else e.set(n.programId, [n.trace]);
  let t = [];
  return e.forEach((n, o) => {
    t.push({ traces: n, programId: o });
  }), t;
}
var da = (s10, e) => {
  let t = [...s10];
  for (let n = t.length - 1; n > 0; n--) {
    let o = Math.floor(Math.random() * (n + 1)), r = t[n], i = t[o];
    if (!r || !i) throw new Error("Invalid array elements");
    [t[n], t[o]] = [i, r];
  }
  return t.slice(0, e);
};
var Ut = class {
  endpoint;
  timeout;
  retryAttempts;
  retryDelay;
  logger;
  constructor(e) {
    this.endpoint = e.endpoint.replace(/\/$/, ""), this.timeout = e.timeout ?? 3e4, this.retryAttempts = e.retryAttempts ?? 3, this.retryDelay = e.retryDelay ?? 1e3, this.logger = e.logger;
  }
  async healthCheck() {
    try {
      return (await this.fetchWithRetry("/health", { method: "GET" })).ok;
    } catch (e) {
      return this.logger?.({ name: "Notification", id: "health_check_failed", value: `Health check failed: ${e}` }), false;
    }
  }
  async createOptimizationJob(e) {
    let t = await this.fetchWithRetry("/optimize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to create optimization job: ${n}`);
    }
    return t.json();
  }
  async getJobStatus(e) {
    let t = await this.fetchWithRetry(`/jobs/${e}`, { method: "GET" });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to get job status: ${n}`);
    }
    return t.json();
  }
  async cancelJob(e) {
    let t = await this.fetchWithRetry(`/jobs/${e}`, { method: "DELETE" });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to cancel job: ${n}`);
    }
  }
  async suggestParameters(e) {
    let t = await this.fetchWithRetry(`/studies/${e}/suggest`, { method: "POST", headers: { "Content-Type": "application/json" } });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to suggest parameters: ${n}`);
    }
    return t.json();
  }
  async evaluateTrial(e) {
    let t = await this.fetchWithRetry(`/studies/${e.study_name}/evaluate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to evaluate trial: ${n}`);
    }
  }
  async getStudyResults(e) {
    let t = await this.fetchWithRetry(`/studies/${e}/results`, { method: "GET" });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to get study results: ${n}`);
    }
    return t.json();
  }
  async deleteStudy(e) {
    let t = await this.fetchWithRetry(`/studies/${e}`, { method: "DELETE" });
    if (!t.ok) {
      let n = await t.text();
      throw new Error(`Failed to delete study: ${n}`);
    }
  }
  async listStudies() {
    let e = await this.fetchWithRetry("/studies", { method: "GET" });
    if (!e.ok) {
      let t = await e.text();
      throw new Error(`Failed to list studies: ${t}`);
    }
    return e.json();
  }
  async waitForJobCompletion(e, t = 2e3, n = 3e5) {
    let o = Date.now();
    for (; Date.now() - o < n; ) {
      let r = await this.getJobStatus(e);
      if (["completed", "failed", "cancelled"].includes(r.status)) return r;
      this.logger?.({ name: "Notification", id: "job_status", value: `Job ${e} status: ${r.status}, waiting...` }), await this.sleep(t);
    }
    throw new Error(`Job ${e} did not complete within ${n}ms`);
  }
  async fetchWithRetry(e, t) {
    let n = `${this.endpoint}${e}`, o = null;
    for (let r = 0; r < this.retryAttempts; r++) try {
      let i = new AbortController(), a = setTimeout(() => i.abort(), this.timeout), l = await fetch(n, { ...t, signal: i.signal });
      return clearTimeout(a), l;
    } catch (i) {
      o = i, this.logger?.({ name: "Notification", id: "retry_attempt", value: `Attempt ${r + 1} failed: ${i}` }), r < this.retryAttempts - 1 && await this.sleep(this.retryDelay * Math.pow(2, r));
    }
    throw new Error(`Request failed after ${this.retryAttempts} attempts: ${o?.message}`);
  }
  sleep(e) {
    return new Promise((t) => setTimeout(t, e));
  }
};
var xo = class extends ce {
  maxBootstrappedDemos;
  maxLabeledDemos;
  numCandidates;
  initTemperature;
  numTrials;
  minibatch;
  minibatchSize;
  minibatchFullEvalSteps;
  programAwareProposer;
  dataAwareProposer;
  viewDataBatchSize;
  tipAwareProposer;
  fewshotAwareProposer;
  earlyStoppingTrials;
  minImprovementThreshold;
  bayesianOptimization;
  acquisitionFunction;
  explorationWeight;
  sampleCount;
  miproConfigHistory = [];
  surrogateModel = /* @__PURE__ */ new Map();
  pythonClient;
  constructor(e) {
    if (super(e), this.numCandidates = e.numCandidates ?? 5, this.initTemperature = e.initTemperature ?? 0.7, this.maxBootstrappedDemos = e.maxBootstrappedDemos ?? 3, this.maxLabeledDemos = e.maxLabeledDemos ?? 4, this.numTrials = e.numTrials ?? 30, this.minibatch = e.minibatch ?? true, this.minibatchSize = e.minibatchSize ?? 25, this.minibatchFullEvalSteps = e.minibatchFullEvalSteps ?? 10, this.programAwareProposer = e.programAwareProposer ?? true, this.dataAwareProposer = e.dataAwareProposer ?? true, this.viewDataBatchSize = e.viewDataBatchSize ?? 10, this.tipAwareProposer = e.tipAwareProposer ?? true, this.fewshotAwareProposer = e.fewshotAwareProposer ?? true, this.earlyStoppingTrials = e.earlyStoppingTrials ?? 5, this.minImprovementThreshold = e.minImprovementThreshold ?? 0.01, this.bayesianOptimization = e.bayesianOptimization ?? false, this.acquisitionFunction = e.acquisitionFunction ?? "expected_improvement", this.explorationWeight = e.explorationWeight ?? 0.1, this.sampleCount = e.sampleCount ?? 1, e.optimizerEndpoint) {
      let t = { endpoint: e.optimizerEndpoint, timeout: e.optimizerTimeout ?? 3e4, retryAttempts: e.optimizerRetries ?? 3, logger: (n) => {
        this.logger?.({ name: "Notification", id: "python_client", value: typeof n == "string" ? n : JSON.stringify(n) });
      } };
      this.pythonClient = new Ut(t);
    }
    this.stats.convergenceInfo.convergenceThreshold = this.minImprovementThreshold;
  }
  configureAuto(e) {
    switch (e) {
      case "light":
        this.numCandidates = 3, this.numTrials = 10, this.minibatch = true, this.minibatchSize = 20;
        break;
      case "medium":
        this.numCandidates = 5, this.numTrials = 20, this.minibatch = true, this.minibatchSize = 25;
        break;
      case "heavy":
        this.numCandidates = 7, this.numTrials = 30, this.minibatch = true, this.minibatchSize = 30;
        break;
    }
  }
  generateTips() {
    return ["Be very specific and detailed in your instructions.", "Focus on step-by-step reasoning in your instructions.", "Provide clear constraints and guidelines in your instructions.", "Keep your instructions concise and to the point.", "Emphasize accuracy and precision in your instructions.", "Include examples of good outputs in your instructions.", "Focus on handling edge cases in your instructions.", "Explicitly outline the reasoning process in your instructions."];
  }
  async generateProgramSummary(e, t) {
    let o = `
Analyze this language model program and provide a concise summary of its purpose and structure.

Program Signature: ${e.getSignature()}

Provide a 2-3 sentence summary focusing on:
1. The main task or purpose of this program
2. The input-output relationship
3. Any special constraints or requirements

Summary:`;
    try {
      let r = await t.chat({ chatPrompt: [{ role: "user", content: o }] });
      return "results" in r && r.results[0]?.content?.trim() || "General language model program";
    } catch {
      return "General language model program";
    }
  }
  async generateDatasetSummary(e, t) {
    if (e.length === 0) return "No examples available";
    let n = Math.min(this.viewDataBatchSize, e.length), i = `
Analyze this dataset and provide a concise summary of its characteristics.

Sample Examples:
${e.slice(0, n).map((a, l) => `Example ${l + 1}: ${JSON.stringify(a)}`).join(`
`)}

Provide a 2-3 sentence summary focusing on:
1. The type of data and domain
2. Common patterns or structures in the examples
3. Key challenges or requirements for processing this data

Dataset Summary:`;
    try {
      let a = await t.chat({ chatPrompt: [{ role: "user", content: i }] });
      return "results" in a && a.results[0]?.content?.trim() || "General dataset";
    } catch {
      return "General dataset";
    }
  }
  async generateInstruction({ tip: e, candidateIndex: t, ai: n, programSummary: o, datasetSummary: r, previousInstructions: i = [] }) {
    let a = "";
    this.programAwareProposer && o && (a += `
Program Context: ${o}`), this.dataAwareProposer && r && (a += `
Dataset Context: ${r}`), this.fewshotAwareProposer && i.length > 0 && (a += `
Previous Instructions (avoid repeating): ${i.slice(-3).join("; ")}`);
    let l = `
Generate a high-quality instruction for a language model program.

${a}

${e ? `Tip: ${e}` : ""}

Requirements:
1. Be specific and actionable
2. Focus on accuracy and clarity
3. Consider the program's purpose and data characteristics
4. Make the instruction distinct from previous ones
5. Keep it concise but comprehensive

Generate a single, well-crafted instruction:
Instruction:`;
    try {
      let u = await n.chat({ chatPrompt: [{ role: "user", content: l }] });
      if ("results" in u) {
        let d = u.results[0]?.content?.trim();
        if (d && d.length > 10) return d;
      }
    } catch {
    }
    let p = ["Analyze the input systematically and provide a precise, well-reasoned response.", "Think through this step-by-step, considering all relevant factors before responding.", "Examine the input carefully and generate an accurate, detailed answer.", "Process the information methodically and deliver a clear, comprehensive response.", "Consider the context thoroughly and provide a thoughtful, accurate answer."], c = p[t % p.length] || p[0];
    return e && (c = `${c} ${e}`), c;
  }
  async proposeInstructionCandidates(e, t) {
    let n = [], o = this.getTeacherOrStudentAI(t), r, i;
    this.dataAwareProposer && (i = await this.generateDatasetSummary(this.examples, o));
    let a = this.tipAwareProposer ? this.generateTips() : [];
    for (let l = 0; l < this.numCandidates; l++) {
      let p = a.length > 0 ? l % a.length : -1, c = p >= 0 ? a[p] : void 0, u = await this.generateInstruction({ tip: c, candidateIndex: l, ai: o, programSummary: r, datasetSummary: i, previousInstructions: n });
      n.push(u);
    }
    return n;
  }
  async bootstrapFewShotExamples(e, t) {
    return (await new Xe({ studentAI: this.studentAI, examples: this.examples, options: { maxDemos: this.maxBootstrappedDemos, maxRounds: 3, verboseMode: this.isLoggingEnabled() } }).compile(e, t, { maxDemos: this.maxBootstrappedDemos })).demos || [];
  }
  selectLabeledExamples() {
    let e = [], t = /* @__PURE__ */ new Set();
    for (; t.size < this.maxLabeledDemos && t.size < this.examples.length; ) {
      let n = Math.floor(Math.random() * this.examples.length);
      if (!t.has(n)) {
        t.add(n);
        let o = this.examples[n];
        o && e.push(o);
      }
    }
    return e;
  }
  async runOptimization(e, t, n, o, r, i, a) {
    let l = { instruction: o[0] || "", bootstrappedDemos: Math.min(1, t.length), labeledExamples: Math.min(1, n.length) }, p = 0, c = 0, u = [], d = 0;
    if (this.resumeFromCheckpoint) {
      let m = await this.loadCheckpoint(this.resumeFromCheckpoint, a);
      m && m.optimizerType === "MiPRO" && (this.restoreFromCheckpoint(m), d = m.currentRound, p = m.bestScore, l = m.bestConfiguration || l, c = m.stats.convergenceInfo?.stagnationRounds || 0);
    }
    for (let m = d; m < this.numTrials; m++) {
      let g;
      this.bayesianOptimization && this.miproConfigHistory.length > 2 ? g = await this.selectConfigurationViaBayesianOptimization(o, t, n) : g = { instruction: o[m % o.length] || o[0] || "", bootstrappedDemos: Math.min(Math.floor(Math.random() * (t.length + 1)), this.maxBootstrappedDemos), labeledExamples: Math.min(Math.floor(Math.random() * (n.length + 1)), this.maxLabeledDemos) };
      let h = await this.evaluateConfig(e, g, t, n, r, i, m + 1);
      this.updateSurrogateModel(g, h), u.push(h);
      let f = h - p;
      if (f > this.minImprovementThreshold ? (p = h, l = g, c = 0) : c++, await this.updateOptimizationProgress(m + 1, h, g, "MiPRO", this.getConfiguration(), p, l, { stagnationRounds: c, bootstrappedDemos: t.length, labeledExamples: n.length, instructions: o.length }, a), this.onProgress && this.onProgress({ round: m + 1, totalRounds: this.numTrials, currentScore: h, bestScore: p, tokensUsed: this.stats.resourceUsage.totalTokens, timeElapsed: Date.now(), successfulExamples: this.stats.successfulDemos, totalExamples: this.examples.length, currentConfiguration: g, convergenceInfo: { improvement: f, stagnationRounds: c, isConverging: c < this.earlyStoppingTrials } }), this.checkCostLimits()) {
        this.triggerEarlyStopping("Cost limit reached", m + 1);
        break;
      }
      if (c >= this.earlyStoppingTrials) {
        this.triggerEarlyStopping(`No improvement for ${this.earlyStoppingTrials} trials`, m - c + 1);
        break;
      }
      if (this.checkTargetScore(p)) {
        this.triggerEarlyStopping(`Target score ${this.targetScore} reached`, m + 1);
        break;
      }
    }
    return this.stats.convergenceInfo.stagnationRounds = c, this.stats.convergenceInfo.finalImprovement = u.length > 1 ? p - u[0] : 0, this.stats.convergenceInfo.converged = c < this.earlyStoppingTrials, { bestConfig: l, bestScore: p };
  }
  async evaluateConfig(e, t, n, o, r, i, a = 0) {
    let l = new q(e.getSignature());
    this.applyConfigToProgram(l, t, n, o);
    let p = 0, c = 0, u;
    if (this.minibatch) {
      let g = Math.min(this.minibatchSize, r.length);
      a % this.minibatchFullEvalSteps === 0 || a > this.numTrials * 0.8 ? u = Math.min(r.length, g * 2) : u = Math.max(3, Math.min(g, r.length));
    } else u = r.length;
    let m = this.shuffleArray([...Array(r.length).keys()]).slice(0, u).map((g) => r[g]);
    for (let g of m) try {
      let h = this.sampleCount > 1 ? { sampleCount: this.sampleCount, resultPicker: ma(), maxRetries: 1 } : { maxRetries: 1 }, f = await l.forward(this.studentAI, g, h), A = await i({ prediction: f, example: g });
      p += A, c++, this.stats.totalCalls++;
    } catch (h) {
      this.isLoggingEnabled() && console.warn(`Student model failed during evaluation: ${h instanceof Error ? h.message : "Unknown error"}`), this.stats.totalCalls++;
    }
    return c > 0 ? p / c : 0;
  }
  shuffleArray(e) {
    let t = [...e];
    for (let n = t.length - 1; n > 0; n--) {
      let o = Math.floor(Math.random() * (n + 1));
      [t[n], t[o]] = [t[o], t[n]];
    }
    return t;
  }
  applyConfigToProgram(e, t, n, o) {
    e.setInstruction && e.setInstruction(t.instruction), t.bootstrappedDemos > 0 && e.setDemos && e.setDemos(n.slice(0, t.bootstrappedDemos)), t.labeledExamples > 0 && e.setExamples && e.setExamples(o.slice(0, t.labeledExamples));
  }
  async compile(e, t, n) {
    let o = Date.now();
    this.setupRandomSeed();
    let r = n;
    if (r?.auto && this.configureAuto(r.auto), this.pythonClient) {
      if (!await this.pythonClient.healthCheck()) throw new Error("Python optimizer service is not available or unhealthy");
      return this.logger?.({ name: "Notification", id: "mipro_mode", value: "Using Python optimizer service for MiPRO optimization" }), await this.compilePython(e, t, n);
    }
    let i = this.getValidationSet(n) || (r?.validationExamples ?? this.examples.slice(0, Math.floor(this.examples.length * 0.2))), a = [];
    this.maxBootstrappedDemos > 0 && (a = await this.bootstrapFewShotExamples(e, t));
    let l = [];
    this.maxLabeledDemos > 0 && (l = this.selectLabeledExamples());
    let p = await this.proposeInstructionCandidates(e, n), { bestConfig: c, bestScore: u } = await this.runOptimization(e, a, l, p, i, t, n);
    this.checkTargetScore(u) && this.triggerEarlyStopping(`Target score ${this.targetScore} reached with score ${u}`, this.numTrials);
    let d;
    "getSignature" in e && typeof e.getSignature == "function" ? d = e.getSignature() : d = "input -> output";
    let m = new q(d);
    return this.applyConfigToAxGen(m, c, a, l), this.updateResourceUsage(o), this.stats.convergenceInfo.converged = true, this.stats.convergenceInfo.finalImprovement = u, await this.saveFinalCheckpoint("MiPRO", this.getConfiguration(), u, c, { bootstrappedDemos: a.length, labeledExamples: l.length, instructions: p.length, optimizedGen: !!m }, n), { demos: a, stats: this.stats, bestScore: u, optimizedGen: m, finalConfiguration: { instruction: c.instruction, bootstrappedDemos: c.bootstrappedDemos, labeledExamples: c.labeledExamples, numCandidates: this.numCandidates, numTrials: this.numTrials, sampleCount: this.sampleCount } };
  }
  applyConfigToAxGen(e, t, n, o) {
    "setInstruction" in e && typeof e.setInstruction == "function" && e.setInstruction(t.instruction), t.bootstrappedDemos > 0 && e.setDemos(n.slice(0, t.bootstrappedDemos)), t.labeledExamples > 0 && e.setExamples(o.slice(0, t.labeledExamples));
  }
  getConfiguration() {
    return { numCandidates: this.numCandidates, initTemperature: this.initTemperature, maxBootstrappedDemos: this.maxBootstrappedDemos, maxLabeledDemos: this.maxLabeledDemos, numTrials: this.numTrials, minibatch: this.minibatch, minibatchSize: this.minibatchSize, minibatchFullEvalSteps: this.minibatchFullEvalSteps, programAwareProposer: this.programAwareProposer, dataAwareProposer: this.dataAwareProposer, tipAwareProposer: this.tipAwareProposer, fewshotAwareProposer: this.fewshotAwareProposer, earlyStoppingTrials: this.earlyStoppingTrials, minImprovementThreshold: this.minImprovementThreshold, bayesianOptimization: this.bayesianOptimization, acquisitionFunction: this.acquisitionFunction, explorationWeight: this.explorationWeight, sampleCount: this.sampleCount };
  }
  updateConfiguration(e) {
    e.numCandidates !== void 0 && (this.numCandidates = e.numCandidates), e.initTemperature !== void 0 && (this.initTemperature = e.initTemperature), e.maxBootstrappedDemos !== void 0 && (this.maxBootstrappedDemos = e.maxBootstrappedDemos), e.maxLabeledDemos !== void 0 && (this.maxLabeledDemos = e.maxLabeledDemos), e.numTrials !== void 0 && (this.numTrials = e.numTrials), e.minibatch !== void 0 && (this.minibatch = e.minibatch), e.minibatchSize !== void 0 && (this.minibatchSize = e.minibatchSize), e.earlyStoppingTrials !== void 0 && (this.earlyStoppingTrials = e.earlyStoppingTrials), e.minImprovementThreshold !== void 0 && (this.minImprovementThreshold = e.minImprovementThreshold), e.sampleCount !== void 0 && (this.sampleCount = e.sampleCount);
  }
  reset() {
    super.reset(), this.miproConfigHistory = [], this.surrogateModel.clear(), this.stats.convergenceInfo.convergenceThreshold = this.minImprovementThreshold;
  }
  validateProgram(e) {
    let t = [], n = [];
    return this.examples.length < this.maxBootstrappedDemos + this.maxLabeledDemos && (t.push(`Not enough examples: need at least ${this.maxBootstrappedDemos + this.maxLabeledDemos}, got ${this.examples.length}`), n.push("Reduce maxBootstrappedDemos or maxLabeledDemos, or provide more examples")), this.getValidationSet().length < 5 && (t.push("Validation set too small for reliable MiPRO optimization"), n.push("Provide more examples or a larger validation set")), { isValid: t.length === 0, issues: t, suggestions: n };
  }
  encodeConfiguration(e) {
    return `${this.hashString(e.instruction)}_${e.bootstrappedDemos}_${e.labeledExamples}`;
  }
  hashString(e) {
    let t = 0;
    if (e.length === 0) return t.toString();
    for (let n = 0; n < e.length; n++) {
      let o = e.charCodeAt(n);
      t = (t << 5) - t + o, t = t & t;
    }
    return Math.abs(t).toString(16);
  }
  updateSurrogateModel(e, t) {
    this.miproConfigHistory.push({ config: { ...e }, score: t });
    let n = this.encodeConfiguration(e), o = this.miproConfigHistory.filter((r) => this.encodeConfiguration(r.config) === n);
    if (o.length > 0) {
      let r = o.map((l) => l.score), i = r.reduce((l, p) => l + p, 0) / r.length, a = r.length > 1 ? r.reduce((l, p) => l + (p - i) ** 2, 0) / (r.length - 1) : 0.1;
      this.surrogateModel.set(n, { mean: i, variance: a });
    }
  }
  predictPerformance(e) {
    let t = this.encodeConfiguration(e);
    if (this.surrogateModel.has(t)) return this.surrogateModel.get(t);
    if (this.miproConfigHistory.length > 0) {
      let n = this.miproConfigHistory.map((i) => {
        let a = Math.abs(i.config.bootstrappedDemos - e.bootstrappedDemos) + Math.abs(i.config.labeledExamples - e.labeledExamples);
        return { score: i.score, similarity: 1 / (1 + a) };
      }), o = n.reduce((i, a) => i + a.similarity, 0);
      return { mean: n.reduce((i, a) => i + a.score * a.similarity, 0) / o, variance: 0.2 };
    }
    return { mean: 0.5, variance: 0.3 };
  }
  calculateAcquisitionValue(e) {
    let t = this.predictPerformance(e), { mean: n, variance: o } = t, r = Math.sqrt(o), i = this.miproConfigHistory.length > 0 ? Math.max(...this.miproConfigHistory.map((a) => a.score)) : 0;
    switch (this.acquisitionFunction) {
      case "expected_improvement": {
        let a = n - i;
        if (r === 0) return Math.max(0, a);
        let l = a / r, p = 0.5 * (1 + this.erf(l / Math.sqrt(2))), c = Math.exp(-0.5 * l * l) / Math.sqrt(2 * Math.PI);
        return a * p + r * c;
      }
      case "upper_confidence_bound":
        return n + this.explorationWeight * r;
      case "probability_improvement": {
        let a = n - i;
        if (r === 0) return a > 0 ? 1 : 0;
        let l = a / r;
        return 0.5 * (1 + this.erf(l / Math.sqrt(2)));
      }
      default:
        return n;
    }
  }
  erf(e) {
    let t = 0.254829592, n = -0.284496736, o = 1.421413741, r = -1.453152027, i = 1.061405429, a = 0.3275911, l = e >= 0 ? 1 : -1, p = Math.abs(e), c = 1 / (1 + a * p), u = 1 - ((((i * c + r) * c + o) * c + n) * c + t) * c * Math.exp(-p * p);
    return l * u;
  }
  async selectConfigurationViaBayesianOptimization(e, t, n) {
    let o = [], r = Math.min(20, e.length * 3);
    for (let i = 0; i < r; i++) {
      let a = { instruction: e[i % e.length] || e[0] || "", bootstrappedDemos: Math.min(Math.floor(Math.random() * (t.length + 1)), this.maxBootstrappedDemos), labeledExamples: Math.min(Math.floor(Math.random() * (n.length + 1)), this.maxLabeledDemos) }, l = this.calculateAcquisitionValue(a);
      o.push({ config: a, acquisitionValue: l });
    }
    return o.sort((i, a) => a.acquisitionValue - i.acquisitionValue), o[0].config;
  }
  async compilePython(e, t, n) {
    if (!this.pythonClient) throw new Error("Python client not initialized");
    let o = `mipro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, r = { study_name: o, parameters: [{ name: "temperature", type: "float", low: 0.1, high: 2 }, { name: "bootstrappedDemos", type: "int", low: 0, high: this.maxBootstrappedDemos }], objective: { name: "score", direction: "maximize" }, n_trials: this.numTrials, sampler: "TPESampler", pruner: this.minibatch ? "MedianPruner" : void 0 }, i = await this.pythonClient.createOptimizationJob(r);
    this.logger?.({ name: "Notification", id: "python_job_started", value: `Started Python optimization job ${i.job_id}` });
    let a = Number.NEGATIVE_INFINITY, l = e, p = 0;
    for (let c = 0; c < this.numTrials; c++) try {
      let u = await this.pythonClient.suggestParameters(o), d = u.params.temperature, m = u.params.bootstrappedDemos, g = await this.evaluateConfiguration(e, t, { temperature: d, bootstrappedDemos: m }, this.minibatch ? this.examples.slice(0, this.minibatchSize) : this.examples);
      p++, await this.pythonClient.evaluateTrial({ study_name: o, trial_number: u.trial_number, value: g }), g > a && (a = g), this.logger?.({ name: "Notification", id: "python_trial_result", value: `Trial ${c + 1}: score=${g.toFixed(3)}, temp=${d.toFixed(2)}` }), this.onProgress?.({ round: c + 1, totalRounds: this.numTrials, currentScore: g, bestScore: a, tokensUsed: this.stats.estimatedTokenUsage, timeElapsed: Date.now() - Date.now(), successfulExamples: p, totalExamples: this.examples.length });
    } catch (u) {
      this.logger?.({ name: "Notification", id: "python_trial_error", value: `Trial ${c + 1} failed: ${u}` });
    }
    try {
      let c = await this.pythonClient.getStudyResults(o);
      this.logger?.({ name: "Notification", id: "python_results", value: `Python optimization completed with ${c.n_trials} trials` });
    } catch (c) {
      this.logger?.({ name: "Notification", id: "python_results_error", value: `Failed to get study results: ${c}` });
    }
    try {
      await this.pythonClient.deleteStudy(o);
    } catch {
    }
    return this.stats.bestScore = a, this.stats.totalCalls = p, { bestScore: a, stats: this.stats, optimizedGen: l };
  }
  async evaluateConfiguration(e, t, n, o) {
    let r = 0, i = 0, a = o.slice(0, Math.min(5, o.length));
    for (let l of a) try {
      let p = await e.forward(this.studentAI, l), c = await t({ prediction: p, example: l });
      typeof c == "number" && !Number.isNaN(c) && (r += c, i++);
    } catch {
    }
    return i > 0 ? r / i : 0;
  }
};
var ma = () => async (s10) => {
  if (s10.type === "fields") {
    let e = {};
    for (let { index: o, sample: r } of s10.results) {
      let i = JSON.stringify(r);
      e[i] || (e[i] = { count: 0, index: o }), e[i].count += 1;
    }
    let t, n = -1;
    for (let [o, r] of Object.entries(e)) r.count > n && (n = r.count, t = o);
    return e[t]?.index ?? 0;
  }
  return s10.results[0]?.index ?? 0;
};
function ga(s10) {
  return P.create(s10);
}
function fo(s10, e) {
  let t = P.create(s10);
  return new q(t, e);
}
var Ze = class {
  analyzeMappingDependencies(e, t) {
    if (!e || typeof e != "function") return [];
    let n = [];
    try {
      let o = e.toString(), r = Array.from(o.matchAll(/state\.(\w+)/g));
      for (let i of r) i[1] && !n.includes(i[1]) && n.push(i[1]);
      if (n.length === 0) try {
        let i = this.createDependencyTracker(n);
        e(i);
      } catch {
      }
    } catch (o) {
      console.debug("Dependency analysis failed:", o);
    }
    return n;
  }
  createTrackingProxy(e, t) {
    let n = this;
    return new Proxy(e, { get(o, r) {
      typeof r == "string" && !t.includes(r) && t.push(r);
      let i = o[r];
      return i && typeof i == "object" ? n.createTrackingProxy(i, t) : i;
    }, has(o, r) {
      return typeof r == "string" && !t.includes(r) && t.push(r), r in o;
    } });
  }
  parseStaticDependencies(e) {
    let t = [];
    try {
      let n = Array.from(e.matchAll(/state\.(\w+)/g));
      for (let i of n) i[1] && !t.includes(i[1]) && t.push(i[1]);
      let o = Array.from(e.matchAll(/\$\{state\.(\w+)\}/g));
      for (let i of o) i[1] && !t.includes(i[1]) && t.push(i[1]);
      let r = Array.from(e.matchAll(/\{\s*(\w+)(?:\s*,\s*(\w+))*\s*\}\s*=\s*state/g));
      for (let i of r) for (let a = 1; a < i.length; a++) i[a] && !t.includes(i[a]) && t.push(i[a]);
    } catch (n) {
      console.debug("Static dependency parsing failed:", n);
    }
    return t;
  }
  createDependencyTracker(e) {
    return new Proxy({}, { get(t, n) {
      return typeof n == "string" && !e.includes(n) && e.push(n), new Proxy({}, { get: () => {
      } });
    } });
  }
};
async function Ae(s10, e, t) {
  if (!t || t <= 0 || t >= s10.length) {
    let o = s10.map((r, i) => e(r, i));
    return Promise.all(o);
  }
  let n = new Array(s10.length);
  for (let o = 0; o < s10.length; o += t) {
    let i = s10.slice(o, o + t).map((l, p) => {
      let c = o + p;
      return e(l, c).then((u) => ({ result: u, originalIndex: c }));
    }), a = await Promise.all(i);
    for (let { result: l, originalIndex: p } of a) n[p] = l;
  }
  return n;
}
var et = class {
  steps = [];
  parallelGroups = [];
  analyzer = new Ze();
  initialFields = /* @__PURE__ */ new Set();
  addExecutionStep(e, t, n, o, r, i, a) {
    let l = [], p = [], c = o || "map";
    if (t && n) c = "execute", l = this.analyzer.analyzeMappingDependencies(n, t), p = [`${t}Result`];
    else if (c === "map" && r) p = this.analyzeMapTransformation(r), l = this.getAllProducedFields();
    else if (c === "parallel-map") {
      if (Array.isArray(r)) {
        let d = /* @__PURE__ */ new Set();
        for (let m of r) this.analyzeMapTransformation(m).forEach((h) => d.add(h));
        p = Array.from(d);
      } else r ? p = this.analyzeMapTransformation(r) : p = ["_parallelMapResult"];
      l = this.getAllProducedFields();
    } else if (c === "merge") {
      if (i?.resultKey) p = [i.resultKey];
      else {
        let m = this.analyzeBranchMergeFields();
        p = m.length > 0 ? m : ["_mergedResult"];
      }
      e.toString().includes("_parallelResults") ? l = ["_parallelResults"] : l = this.getAllProducedFields();
    } else if (c === "parallel") p = ["_parallelResults"], l = this.getAllProducedFields();
    else if (c === "derive") if (a?.outputFieldName && a?.inputFieldName) {
      p = [a.outputFieldName];
      let d = r ? this.analyzer.analyzeMappingDependencies(r, "derive") : [];
      l = [a.inputFieldName, ...d].filter((m, g, h) => h.indexOf(m) === g);
    } else p = ["_deriveResult"], l = this.getAllProducedFields();
    else e.toString().includes("transform(") ? (c = "map", l = this.getAllProducedFields(), p = ["_mapResult"]) : e.toString().includes("_parallelResults") && (p = ["_parallelResults"], l = this.getAllProducedFields());
    for (let d of l) this.getAllProducedFields().includes(d) || this.initialFields.add(d);
    let u = { type: c, nodeName: t, dependencies: l, produces: p, stepFunction: e, stepIndex: this.steps.length };
    this.steps.push(u);
  }
  analyzeStepFunctionProduction(e) {
    try {
      let t = this.analyzeStepFunctionSource(e);
      if (t.length > 0 && !t.includes("_stepResult")) return t;
    } catch (t) {
      console.debug("Step function source analysis failed:", t);
    }
    try {
      let t = this.createMockState(), n = Object.keys(t), r = e(t, { mainAi: { getOptions: () => ({ trace: false }), forward: () => Promise.resolve({ text: "mock" }) }, mainOptions: void 0 });
      if (r && typeof r == "object" && "then" in r) return this.analyzeStepFunctionSource(e);
      if (r && typeof r == "object" && !Array.isArray(r)) {
        let a = Object.keys(r).filter((l) => !n.includes(l));
        if (a.length > 0) return a;
      }
    } catch (t) {
      console.debug("Step function dynamic analysis failed:", t);
    }
    return this.analyzeStepFunctionSource(e);
  }
  analyzeStepFunctionSource(e) {
    try {
      let t = e.toString(), n = t.match(/\{\s*\.\.\.state\s*,\s*(\w+)\s*:/g);
      if (n) {
        let r = n.map((i) => {
          let a = i.match(/(\w+)\s*:/);
          return a ? a[1] : null;
        }).filter(Boolean);
        if (r.length > 0) return r;
      }
      let o = t.match(/state\.(\w+)\s*=/g);
      if (o) {
        let r = o.map((i) => {
          let a = i.match(/state\.(\w+)\s*=/);
          return a ? a[1] : null;
        }).filter(Boolean);
        if (r.length > 0) return r;
      }
    } catch (t) {
      console.debug("Step function source analysis failed:", t);
    }
    return ["_stepResult"];
  }
  analyzeMapTransformation(e) {
    try {
      let t = this.createMockState(), n = e(t);
      if (n && typeof n == "object" && !Array.isArray(n)) return Object.keys(n);
    } catch (t) {
      console.debug("Map transformation analysis failed:", t);
    }
    return ["_mapResult"];
  }
  createMockState() {
    let e = {};
    for (let t of this.initialFields) e[t] = this.createMockValue(t);
    for (let t of this.steps) for (let n of t.produces) n.endsWith("Result") ? e[n] = { text: "mockText", value: "mockValue", result: "mockResult", data: "mockData", processedText: "mockProcessedText", sentimentValue: "mockSentiment", confidenceScore: 0.8, isComplex: false, mockValue: "mockValue", responseText: "mockResponseText", inputText: "mockInputText" } : e[n] = this.createMockValue(n);
    return e;
  }
  createMockValue(e) {
    return e.includes("List") || e.includes("Array") || e.endsWith("s") ? ["mockItem1", "mockItem2"] : e.includes("count") || e.includes("Count") || e.includes("index") || e.includes("Index") ? 0 : e.includes("is") || e.includes("has") || e.includes("can") ? false : "mockValue";
  }
  analyzeBranchMergeFields() {
    let e = this.steps.slice(-5).filter((t) => t.type === "execute" && t.nodeName).flatMap((t) => t.produces);
    return e.length > 0 ? e : this.steps.filter((t) => t.type === "execute" && t.nodeName).flatMap((t) => t.produces);
  }
  setInitialFields(e) {
    this.initialFields = new Set(e), this.rebuildParallelGroups();
  }
  rebuildParallelGroups() {
    this.parallelGroups = [];
    let e = /* @__PURE__ */ new Set(), t = new Set(this.initialFields), n = 0;
    for (; e.size < this.steps.length; ) {
      let o = [];
      for (let r of this.steps) {
        if (e.has(r.stepIndex)) continue;
        if (r.dependencies.length === 0 || r.dependencies.every((a) => t.has(a))) {
          if (r.type === "merge" && o.length > 0) continue;
          if (o.push(r), e.add(r.stepIndex), r.type === "merge") break;
        }
      }
      if (o.length > 0) {
        for (let r of o) r.produces.forEach((i) => t.add(i));
        this.parallelGroups.push({ level: n, steps: o }), n++;
      } else {
        let r = this.steps.filter((i) => !e.has(i.stepIndex));
        if (r.length > 0) {
          let i = r[0];
          e.add(i.stepIndex), i.produces.forEach((a) => t.add(a)), this.parallelGroups.push({ level: n, steps: [i] }), n++;
        } else break;
      }
    }
  }
  getAllProducedFields() {
    let e = [];
    for (let t of this.steps) e.push(...t.produces);
    return e;
  }
  createOptimizedExecution(e) {
    let t = [];
    for (let n of this.parallelGroups) if (n.steps.length === 1) {
      let o = n.steps[0];
      o && t.push(o.stepFunction);
    } else if (n.steps.length > 1) {
      let o = async (r, i) => {
        let a = await Ae(n.steps, async (c) => await c.stepFunction(r, i), e);
        if (a.some((c) => c && typeof c == "object" && "_parallelResults" in c)) {
          let c = a.find((u) => u && typeof u == "object" && "_parallelResults" in u);
          return c || r;
        }
        let p = r;
        for (let c of a) p = { ...p, ...c };
        return p;
      };
      t.push(o);
    }
    return t;
  }
  getOptimizedExecutionSteps() {
    return this.parallelGroups.length === 0 && this.steps.length > 0 && this.rebuildParallelGroups(), this.createOptimizedExecution();
  }
  getExecutionPlan() {
    return this.parallelGroups.length === 0 && this.steps.length > 0 && this.rebuildParallelGroups(), { totalSteps: this.steps.length, parallelGroups: this.parallelGroups.length, maxParallelism: this.steps.length === 0 ? 1 : Math.max(...this.parallelGroups.map((e) => e.steps.length), 0), steps: this.steps, groups: this.parallelGroups };
  }
};
var hs = (s10) => {
  console.log(s10);
};
var xe = (s10, e = false) => {
  if (e) return "[State hidden]";
  let t = {};
  for (let [n, o] of Object.entries(s10)) if (typeof o == "string" && o.length > 100) t[n] = `${o.substring(0, 100)}...`;
  else if (Array.isArray(o) && o.length > 3) t[n] = [...o.slice(0, 3), `... (${o.length - 3} more)`];
  else if (typeof o == "object" && o !== null) {
    let r = JSON.stringify(o);
    r.length > 200 ? t[n] = `${r.substring(0, 200)}...` : t[n] = o;
  } else t[n] = o;
  return JSON.stringify(t, null, 2);
};
var fe = (s10) => s10 < 1e3 ? `${s10.toFixed(1)}ms` : s10 < 6e4 ? `${(s10 / 1e3).toFixed(2)}s` : `${(s10 / 6e4).toFixed(2)}min`;
var Bt = (s10 = hs) => {
  let e = new L(), t = e.gray(`${"\u2501".repeat(80)}
`), n = e.gray(`${"\u2500".repeat(40)}
`);
  return (o) => {
    let r = "";
    switch (o.name) {
      case "FlowStart":
        r = `
${e.blueBright("\u{1F504} [ AXFLOW START ]")}
${t}`, r += `${e.white("Input Fields:")} ${e.cyan(o.inputFields.join(", "))}
`, r += `${e.white("Total Steps:")} ${e.yellow(o.totalSteps.toString())}
`, r += `${e.white("Parallel Groups:")} ${e.yellow(o.parallelGroups.toString())}
`, r += `${e.white("Max Parallelism:")} ${e.yellow(o.maxParallelism.toString())}
`, r += `${e.white("Auto-Parallel:")} ${o.autoParallelEnabled ? e.green("enabled") : e.red("disabled")}
`, r += t;
        break;
      case "StepStart": {
        let i = o.stepType === "execute" ? "\u26A1" : o.stepType === "map" ? "\u{1F504}" : o.stepType === "merge" ? "\u{1F500}" : o.stepType === "parallel" ? "\u2696\uFE0F" : "\u{1F4CB}";
        r = `${e.greenBright(`${i} [ STEP ${o.stepIndex} START ]`)} ${e.white(`(${o.stepType})`)}`, o.nodeName && (r += ` ${e.cyanBright(`Node: ${o.nodeName}`)}`), r += `
`, o.dependencies.length > 0 && (r += `${e.white("Dependencies:")} ${e.gray(o.dependencies.join(", "))}
`), o.produces.length > 0 && (r += `${e.white("Produces:")} ${e.cyan(o.produces.join(", "))}
`), r += `${e.white("State:")} ${e.gray(xe(o.state, true))}
`, r += n;
        break;
      }
      case "StepComplete": {
        let i = (o.stepType === "execute" || o.stepType === "map" || o.stepType === "merge" || o.stepType === "parallel", "\u2705");
        r = `${e.greenBright(`${i} [ STEP ${o.stepIndex} COMPLETE ]`)} ${e.white(`(${o.stepType})`)}`, o.nodeName && (r += ` ${e.cyanBright(`Node: ${o.nodeName}`)}`), r += ` ${e.magenta(`in ${fe(o.executionTime)}`)}
`, o.newFields && o.newFields.length > 0 && (r += `${e.white("New Fields:")} ${e.green(o.newFields.join(", "))}
`), o.result && o.nodeName && (r += `${e.white("Result:")} ${e.yellow(JSON.stringify(o.result, null, 2))}
`), r += n;
        break;
      }
      case "ParallelGroupStart":
        r = `${e.blueBright("\u2696\uFE0F [ PARALLEL GROUP START ]")} ${e.white(`Level ${o.groupLevel}`)}
`, r += `${e.white("Steps:")} ${e.yellow(o.stepsCount.toString())} ${e.gray(`(${o.stepTypes.join(", ")})`)}
`, r += n;
        break;
      case "ParallelGroupComplete":
        r = `${e.blueBright("\u2705 [ PARALLEL GROUP COMPLETE ]")} ${e.white(`Level ${o.groupLevel}`)}`, r += ` ${e.magenta(`in ${fe(o.executionTime)}`)}
`, r += `${e.white("Steps Executed:")} ${e.yellow(o.stepsCount.toString())}
`, r += n;
        break;
      case "BranchEvaluation":
        r = `${e.yellow("\u{1F500} [ BRANCH EVALUATION ]")}
`, r += `${e.white("Branch Value:")} ${e.cyan(JSON.stringify(o.branchValue))}
`, r += `${e.white("Has Matching Branch:")} ${o.hasMatchingBranch ? e.green("yes") : e.red("no")}
`, o.hasMatchingBranch && (r += `${e.white("Branch Steps:")} ${e.yellow(o.branchStepsCount.toString())}
`), r += n;
        break;
      case "FlowComplete":
        r = `
${e.greenBright("\u2705 [ AXFLOW COMPLETE ]")}
${t}`, r += `${e.white("Total Time:")} ${e.magenta(fe(o.totalExecutionTime))}
`, r += `${e.white("Steps Executed:")} ${e.yellow(o.stepsExecuted.toString())}
`, r += `${e.white("Output Fields:")} ${e.green(o.outputFields.join(", "))}
`, r += `${e.white("Final State:")} ${e.gray(xe(o.finalState, true))}
`, r += t;
        break;
      case "FlowError":
        r = `
${e.redBright("\u274C [ AXFLOW ERROR ]")}
${t}`, o.stepIndex !== void 0 && (r += `${e.white("Step:")} ${e.yellow(o.stepIndex.toString())}`, o.stepType && (r += ` ${e.gray(`(${o.stepType})`)}`), o.nodeName && (r += ` ${e.cyan(`Node: ${o.nodeName}`)}`), r += `
`), r += `${e.white("Error:")} ${e.red(o.error)}
`, o.state && (r += `${e.white("State:")} ${e.gray(xe(o.state, true))}
`), r += t;
        break;
      default:
        r = e.gray(JSON.stringify(o, null, 2));
    }
    s10(r);
  };
};
var ha = (s10 = hs) => {
  let e = "=".repeat(80), t = "-".repeat(40);
  return (n) => {
    let o = "";
    switch (n.name) {
      case "FlowStart":
        o = `
[ AXFLOW START ]
${e}
`, o += `Input Fields: ${n.inputFields.join(", ")}
`, o += `Total Steps: ${n.totalSteps}
`, o += `Parallel Groups: ${n.parallelGroups}
`, o += `Max Parallelism: ${n.maxParallelism}
`, o += `Auto-Parallel: ${n.autoParallelEnabled ? "enabled" : "disabled"}
`, o += `${e}
`;
        break;
      case "StepStart":
        o = `[ STEP ${n.stepIndex} START ] (${n.stepType})`, n.nodeName && (o += ` Node: ${n.nodeName}`), o += `
`, n.dependencies.length > 0 && (o += `Dependencies: ${n.dependencies.join(", ")}
`), n.produces.length > 0 && (o += `Produces: ${n.produces.join(", ")}
`), o += `State: ${xe(n.state, true)}
`, o += `${t}
`;
        break;
      case "StepComplete":
        o = `[ STEP ${n.stepIndex} COMPLETE ] (${n.stepType})`, n.nodeName && (o += ` Node: ${n.nodeName}`), o += ` in ${fe(n.executionTime)}
`, n.newFields && n.newFields.length > 0 && (o += `New Fields: ${n.newFields.join(", ")}
`), n.result && n.nodeName && (o += `Result: ${JSON.stringify(n.result, null, 2)}
`), o += `${t}
`;
        break;
      case "ParallelGroupStart":
        o = `[ PARALLEL GROUP START ] Level ${n.groupLevel}
`, o += `Steps: ${n.stepsCount} (${n.stepTypes.join(", ")})
`, o += `${t}
`;
        break;
      case "ParallelGroupComplete":
        o = `[ PARALLEL GROUP COMPLETE ] Level ${n.groupLevel} in ${fe(n.executionTime)}
`, o += `Steps Executed: ${n.stepsCount}
`, o += `${t}
`;
        break;
      case "BranchEvaluation":
        o = `[ BRANCH EVALUATION ]
`, o += `Branch Value: ${JSON.stringify(n.branchValue)}
`, o += `Has Matching Branch: ${n.hasMatchingBranch ? "yes" : "no"}
`, n.hasMatchingBranch && (o += `Branch Steps: ${n.branchStepsCount}
`), o += `${t}
`;
        break;
      case "FlowComplete":
        o = `
[ AXFLOW COMPLETE ]
${e}
`, o += `Total Time: ${fe(n.totalExecutionTime)}
`, o += `Steps Executed: ${n.stepsExecuted}
`, o += `Output Fields: ${n.outputFields.join(", ")}
`, o += `Final State: ${xe(n.finalState, true)}
`, o += `${e}
`;
        break;
      case "FlowError":
        o = `
[ AXFLOW ERROR ]
${e}
`, n.stepIndex !== void 0 && (o += `Step: ${n.stepIndex}`, n.stepType && (o += ` (${n.stepType})`), n.nodeName && (o += ` Node: ${n.nodeName}`), o += `
`), o += `Error: ${n.error}
`, n.state && (o += `State: ${xe(n.state, true)}
`), o += `${e}
`;
        break;
      default:
        o = JSON.stringify(n, null, 2);
    }
    s10(o);
  };
};
var Aa = Bt();
var As = (s10) => {
  let e = /* @__PURE__ */ new Map();
  return { logger: s10, startTiming: (t) => {
    e.set(t, Date.now());
  }, endTiming: (t) => {
    let n = e.get(t);
    if (!n) return 0;
    let o = Date.now() - n;
    return e.delete(t), o;
  }, getCurrentTime: () => Date.now() };
};
var tt = class {
  constructor(e) {
    this.nodeGenerators = e;
  }
  steps = [];
  execute(e, t, n) {
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    return this.steps.push(async (r, i) => {
      let a = n?.ai ?? i.mainAi, l = n?.options ?? i.mainOptions, p = t(r), c = l?.traceLabel ? `Node:${e} (${l.traceLabel})` : `Node:${e}`, u;
      if ("forward" in o && typeof o.forward == "function") u = await o.forward(a, p, { ...l, traceLabel: c });
      else throw new Error(`Node program for '${e}' does not have a forward method`);
      return { ...r, [`${e}Result`]: u };
    }), this;
  }
  map(e) {
    return this.steps.push((t) => e(t)), this;
  }
  async executeSteps(e, t) {
    let n = e;
    for (let o of this.steps) n = await o(n, t);
    return n;
  }
};
var yo = class {
  constructor(e) {
    this.nodeGenerators = e;
  }
  steps = [];
  execute(e, t, n) {
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    return this.steps.push(async (r, i) => {
      let a = n?.ai ?? i.mainAi, l = n?.options ?? i.mainOptions, p = t(r), c = l?.traceLabel ? `Node:${e} (${l.traceLabel})` : `Node:${e}`, u;
      if ("forward" in o && typeof o.forward == "function") u = await o.forward(a, p, { ...l, traceLabel: c });
      else throw new Error(`Node program for '${e}' does not have a forward method`);
      return { ...r, [`${e}Result`]: u };
    }), this;
  }
  map(e) {
    return this.steps.push((t) => e(t)), this;
  }
  async executeSteps(e, t) {
    let n = e;
    for (let o of this.steps) n = await o(n, t);
    return n;
  }
};
var qt = class s8 {
  nodes = /* @__PURE__ */ new Map();
  flowDefinition = [];
  nodeGenerators = /* @__PURE__ */ new Map();
  loopStack = [];
  stepLabels = /* @__PURE__ */ new Map();
  branchContext = null;
  autoParallelConfig;
  executionPlanner = new et();
  program;
  nodeUsage = /* @__PURE__ */ new Map();
  nodeTraces = /* @__PURE__ */ new Map();
  flowLogger;
  timingLogger;
  toCamelCase(e) {
    return e.replace(/_([a-z])/g, (t, n) => n.toUpperCase());
  }
  async executeStepsWithLogging(e, t, n, o) {
    let r = { ...t }, i = 0;
    for (let a = 0; a < e.length; a++) {
      let l = e[a];
      if (!l) continue;
      let p = this.getStepType(l, a), c = this.getStepMetadata(l, a), u = Object.keys(r);
      this.flowLogger && this.flowLogger({ name: "StepStart", timestamp: Date.now(), stepIndex: a, stepType: p, nodeName: c.nodeName, dependencies: c.dependencies, produces: c.produces, state: { ...r } });
      let d = Date.now();
      this.timingLogger?.startTiming(`step-${a}`);
      try {
        r = await l(r, n), i++;
        let g = this.timingLogger?.endTiming(`step-${a}`) ?? Date.now() - d, f = Object.keys(r).filter((x) => !u.includes(x)), A;
        if (p === "execute" && c.nodeName && f.length > 0) {
          let x = `${c.nodeName}Result`;
          A = r[x];
        }
        this.flowLogger && this.flowLogger({ name: "StepComplete", timestamp: Date.now(), stepIndex: a, stepType: p, nodeName: c.nodeName, executionTime: g, state: { ...r }, newFields: f, result: A });
      } catch (m) {
        throw this.flowLogger && this.flowLogger({ name: "FlowError", timestamp: Date.now(), error: m instanceof Error ? m.message : String(m), stepIndex: a, stepType: p, nodeName: c.nodeName, state: { ...r } }), m;
      }
    }
    return { finalState: r, stepsExecuted: i };
  }
  getStepType(e, t) {
    let n = e.toString();
    return n.includes("nodeName") || n.includes("nodeProgram") ? "execute" : n.includes("_parallelResults") || n.includes("processBatches") ? "parallel" : n.includes("branchValue") || n.includes("branches.get") || n.includes("mergeFunction") ? "merge" : n.includes("transform(") || n.includes("...state,") ? "map" : n.includes("inputValue") && n.includes("transformFn") ? "derive" : n.includes("condition(") && n.includes("iterations") ? n.includes("while") ? "while" : "feedback" : n.includes("branchSteps") || n.includes("currentState") ? "branch" : "other";
  }
  getStepMetadata(e, t) {
    let o = this.executionPlanner.getExecutionPlan().steps.find((a) => a.stepIndex === t);
    if (o) return { nodeName: o.nodeName, dependencies: o.dependencies, produces: o.produces };
    let r = e.toString();
    return { nodeName: this.extractNodeNameFromSource(r), dependencies: [], produces: [] };
  }
  extractNodeNameFromSource(e) {
    let t = e.match(/nodeName['"]?\s*[=:]\s*['"](\w+)['"]/);
    if (t) return t[1];
    let n = e.match(/nodeProgram\.get\(['"](\w+)['"]\)/);
    if (n) return n[1];
  }
  inferSignatureFromFlow() {
    let e = this.executionPlanner.getExecutionPlan();
    if (this.nodeGenerators.size === 0 && e.steps.length === 0) return Qe().input("userInput", Qe.string("User input to the flow")).output("flowOutput", Qe.string("Output from the flow")).build();
    let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
    for (let c of e.steps) c.produces.forEach((u) => t.add(u)), c.dependencies.forEach((u) => n.add(u));
    let o = /* @__PURE__ */ new Set();
    for (let c of Array.from(n)) t.has(c) || o.add(c);
    let r = /* @__PURE__ */ new Set(), i = e.steps[e.steps.length - 1];
    if (i && (i.type === "map" || i.type === "merge")) {
      if (i.produces.forEach((c) => {
        c.startsWith("_") || r.add(c);
      }), i.type === "merge" && i.produces.includes("_mergedResult")) for (let c of e.steps) c.type === "execute" && c.produces.length > 0 && c.produces.forEach((u) => r.add(u));
    } else for (let c of Array.from(t)) {
      let u = false;
      for (let d of e.steps) if (d.dependencies.includes(c)) {
        u = true;
        break;
      }
      if (!u) if (c.endsWith("Result")) {
        let d = c.replace("Result", ""), m = this.nodeGenerators.get(d);
        if (m) {
          let h = m.getSignature().getOutputFields();
          for (let f of h) r.add(f.name);
        } else r.add(c);
      } else r.add(c);
    }
    if (o.size === 0 && r.size === 0) {
      let c = [], u = [];
      for (let [m, g] of Array.from(this.nodeGenerators)) {
        let h = g.getSignature();
        for (let f of h.getInputFields()) {
          let A = this.toCamelCase(`${m}_${f.name}`);
          c.push({ name: A, type: f.type, description: f.description, isOptional: f.isOptional, isInternal: f.isInternal });
        }
        for (let f of h.getOutputFields()) {
          let A = this.toCamelCase(`${m}_${f.name}`);
          u.push({ name: A, type: f.type, description: f.description, isOptional: f.isOptional, isInternal: f.isInternal });
        }
      }
      let d = new P();
      return c.length > 0 ? d.setInputFields(c) : d.addInputField({ name: "userInput", type: { name: "string" }, description: "User input to the flow" }), u.length > 0 ? d.setOutputFields(u) : d.addOutputField({ name: "flowOutput", type: { name: "string" }, description: "Output from the flow" }), d;
    }
    let a = new P(), l = [];
    for (let c of Array.from(o)) l.push({ name: c, type: { name: "string" }, description: `Input field: ${c}` });
    l.length === 0 && l.push({ name: "userInput", type: { name: "string" }, description: "User input to the flow" });
    let p = [];
    for (let c of Array.from(r)) c.startsWith("_") || p.push({ name: c, type: { name: "string" }, description: `Output field: ${c}` });
    return p.length === 0 && p.push({ name: "flowOutput", type: { name: "string" }, description: "Output from the flow" }), a.setInputFields(l), a.setOutputFields(p), a;
  }
  constructor(e) {
    this.autoParallelConfig = { enabled: e?.autoParallel !== false, batchSize: e?.batchSize || 10 }, e?.logger ? this.flowLogger = e.logger : e?.debug === true ? this.flowLogger = Bt() : this.flowLogger = void 0, this.timingLogger = this.flowLogger ? As(this.flowLogger) : void 0;
  }
  static create(e) {
    return new s8(e);
  }
  ensureProgram() {
    let e = this.inferSignatureFromFlow();
    this.program = new le(e);
  }
  setExamples(e, t) {
    this.ensureProgram(), this.program.setExamples(e, t);
  }
  setId(e) {
    this.ensureProgram(), this.program.setId(e);
  }
  setParentId(e) {
    this.ensureProgram(), this.program.setParentId(e);
  }
  getTraces() {
    let e = [];
    for (let [t, n] of Array.from(this.nodeTraces)) e.push(...n);
    return e;
  }
  setDemos(e) {
    this.ensureProgram(), this.program.setDemos(e);
  }
  getUsage() {
    let e = [];
    for (let [t, n] of Array.from(this.nodeUsage)) e.push(...n);
    return Ve(e);
  }
  resetUsage() {
    this.nodeUsage.clear();
    for (let [e, t] of Array.from(this.nodeGenerators)) t && "resetUsage" in t && t.resetUsage();
  }
  resetTraces() {
    this.nodeTraces.clear();
  }
  getUsageReport() {
    let e = {};
    for (let [t, n] of Array.from(this.nodeUsage)) e[t] = Ve(n);
    return e;
  }
  getTracesReport() {
    let e = {};
    for (let [t, n] of Array.from(this.nodeTraces)) e[t] = n;
    return e;
  }
  async *streamingForward(e, t, n) {
    yield { version: 1, index: 0, delta: await this.forward(e, t, n) };
  }
  async forward(e, t, n) {
    let o = Date.now();
    this.timingLogger?.startTiming("flow-execution");
    let r = {};
    try {
      this.resetUsage(), this.resetTraces();
      let i;
      if (Array.isArray(t)) {
        let c = t.filter((u) => u.role === "user").pop();
        if (!c) throw new Error("No user message found in values array");
        i = c.values;
      } else i = t;
      if (this.nodeGenerators.size > 0 && this.ensureProgram(), r = { ...i }, this.flowLogger) {
        let c = this.getExecutionPlan();
        this.flowLogger({ name: "FlowStart", timestamp: o, inputFields: Object.keys(i), totalSteps: c.totalSteps, parallelGroups: c.parallelGroups, maxParallelism: c.maxParallelism, autoParallelEnabled: c.autoParallelEnabled });
      }
      let a = { mainAi: e, mainOptions: n ? { ...n, model: n.model ? String(n.model) : void 0 } : void 0 }, l = n?.autoParallel !== false && this.autoParallelConfig.enabled, p = 0;
      if (l) {
        this.executionPlanner.setInitialFields(Object.keys(i));
        let c = this.executionPlanner.createOptimizedExecution(this.autoParallelConfig.batchSize), u = await this.executeStepsWithLogging(c, r, a, true);
        r = u.finalState, p = u.stepsExecuted;
      } else {
        let c = await this.executeStepsWithLogging(this.flowDefinition, r, a, false);
        r = c.finalState, p = c.stepsExecuted;
      }
      if (this.flowLogger) {
        let c = this.timingLogger?.endTiming("flow-execution") ?? Date.now() - o;
        this.flowLogger({ name: "FlowComplete", timestamp: Date.now(), totalExecutionTime: c, finalState: r, outputFields: Object.keys(r), stepsExecuted: p });
      }
      return r;
    } catch (i) {
      throw this.flowLogger && this.flowLogger({ name: "FlowError", timestamp: Date.now(), error: i instanceof Error ? i.message : String(i), state: r }), i;
    }
  }
  node(e, t) {
    if (typeof t == "string" || t instanceof P) {
      let n = t;
      if (!n) throw new Error(`Invalid signature for node '${e}': signature cannot be empty`);
      this.nodes.set(e, { inputs: {}, outputs: {} });
      let o = fo(n);
      this.nodeGenerators.set(e, o), this.ensureProgram(), this.program.register(o);
    } else if (typeof t == "function") {
      this.nodes.set(e, { inputs: {}, outputs: {} });
      let n = new t();
      this.nodeGenerators.set(e, n), this.ensureProgram(), this.program.register(n);
    } else if (t && typeof t == "object" && "forward" in t) {
      this.nodes.set(e, { inputs: {}, outputs: {} });
      let n = t;
      this.nodeGenerators.set(e, n), this.ensureProgram(), this.program.register(n);
    } else throw new Error(`Invalid second argument for node '${e}': expected string, AxSignature, AxProgrammable instance, or constructor function`);
    return this;
  }
  n(e, t) {
    return this.node(e, t);
  }
  map(e, t) {
    if (t?.parallel) {
      let n = Array.isArray(e) ? e : [e], o = async (r) => {
        let i = await Ae(n, async (a, l) => {
          let p = a(r);
          return Promise.resolve(p);
        }, this.autoParallelConfig.batchSize);
        return i[i.length - 1];
      };
      if (this.branchContext?.currentBranchValue !== void 0) {
        let r = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
        r.push(o), this.branchContext.branches.set(this.branchContext.currentBranchValue, r);
      } else this.flowDefinition.push(o), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(o, void 0, void 0, "parallel-map");
    } else {
      let n = async (o) => {
        if (Array.isArray(e)) throw new Error("Array of transforms requires parallel: true option");
        let r = e(o);
        return Promise.resolve(r);
      };
      if (this.branchContext?.currentBranchValue !== void 0) {
        let o = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
        o.push(n), this.branchContext.branches.set(this.branchContext.currentBranchValue, o);
      } else this.flowDefinition.push(n), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(n, void 0, void 0, "map", e);
    }
    return this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  m(e, t) {
    return this.map(e, t);
  }
  returns(e) {
    let t = async (n) => {
      let o = e(n);
      return Promise.resolve(o);
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let n = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      n.push(t), this.branchContext.branches.set(this.branchContext.currentBranchValue, n);
    } else this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t, void 0, void 0, "map", e);
    return this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  r(e) {
    return this.returns(e);
  }
  label(e) {
    if (this.branchContext?.currentBranchValue !== void 0) throw new Error("Cannot create labels inside branch blocks");
    return this.stepLabels.set(e, this.flowDefinition.length), this;
  }
  l(e) {
    return this.label(e);
  }
  execute(e, t, n) {
    if (!this.nodes.has(e)) throw new Error(`Node '${e}' not found. Make sure to define it with .node() first.`);
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    let r = async (i, a) => {
      let l = n?.ai ?? a.mainAi, p = n?.options ?? a.mainOptions, c = t(i), u = p?.traceLabel ? `Node:${e} (${p.traceLabel})` : `Node:${e}`, d;
      if ("forward" in o && typeof o.forward == "function") {
        if (d = await o.forward(l, c, { ...p, traceLabel: u }), "getUsage" in o && typeof o.getUsage == "function") {
          let m = o.getUsage();
          if (m && m.length > 0) {
            let g = this.nodeUsage.get(e) || [];
            this.nodeUsage.set(e, [...g, ...m]);
          }
        }
        if ("getTraces" in o && typeof o.getTraces == "function") {
          let m = o.getTraces();
          if (m && m.length > 0) {
            let g = this.nodeTraces.get(e) || [];
            this.nodeTraces.set(e, [...g, ...m]);
          }
        }
      } else throw new Error(`Node program for '${e}' does not have a forward method`);
      return { ...i, [`${e}Result`]: d };
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let i = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      i.push(r), this.branchContext.branches.set(this.branchContext.currentBranchValue, i);
    } else this.flowDefinition.push(r), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(r, e, t);
    return this.ensureProgram(), this;
  }
  e(e, t, n) {
    return this.execute(e, t, n);
  }
  branch(e) {
    if (this.branchContext) throw new Error("Nested branches are not supported");
    return this.branchContext = { predicate: (t) => e(t), branches: /* @__PURE__ */ new Map(), currentBranchValue: void 0 }, this;
  }
  b(e) {
    return this.branch(e);
  }
  when(e) {
    if (!this.branchContext) throw new Error("when() called without matching branch()");
    return this.branchContext.currentBranchValue = e, this.branchContext.branches.set(e, []), this;
  }
  w(e) {
    return this.when(e);
  }
  merge() {
    if (!this.branchContext) throw new Error("merge() called without matching branch()");
    let e = this.branchContext;
    this.branchContext = null;
    let t = async (n, o) => {
      let r = e.predicate(n), i = e.branches.get(r);
      if (!i) return n;
      let a = n;
      for (let l of i) a = await l(a, o);
      return a;
    };
    return this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t, void 0, void 0, "merge"), this.ensureProgram(), this;
  }
  mg() {
    return this.merge();
  }
  parallel(e) {
    let t = async (n, o) => {
      let r = await Ae(e, async (i, a) => {
        let l = new tt(this.nodeGenerators);
        return await i(l).executeSteps(n, o);
      }, this.autoParallelConfig.batchSize);
      return { ...n, _parallelResults: r };
    };
    return this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t, void 0, void 0, "parallel", void 0, void 0), this.ensureProgram(), { merge: (n, o) => {
      let r = (i) => {
        let a = i._parallelResults;
        if (!Array.isArray(a)) throw new Error("No parallel results found for merge");
        let l = o(...a), p = { ...i };
        return delete p._parallelResults, p[n] = l, p;
      };
      return this.flowDefinition.push(r), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(r, void 0, void 0, "merge", void 0, { resultKey: n, mergeFunction: o }), this.ensureProgram(), this;
    } };
  }
  p(e) {
    return this.parallel(e);
  }
  feedback(e, t, n = 10) {
    if (!this.stepLabels.has(t)) throw new Error(`Label '${t}' not found. Make sure to define it with .label() before the feedback point.`);
    let o = this.stepLabels.get(t), r = this.flowDefinition.length;
    return this.flowDefinition.push(async (i, a) => {
      let l = i, p = 1, c = `_feedback_${t}_iterations`;
      for (typeof l[c] != "number" && (l = { ...l, [c]: 1 }); e(l) && p < n; ) {
        p++, l = { ...l, [c]: p };
        for (let u = o; u < r; u++) {
          let d = this.flowDefinition[u];
          d && (l = await d(l, a));
        }
      }
      return l;
    }), this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  fb(e, t, n = 10) {
    return this.feedback(e, t, n);
  }
  while(e, t = 100) {
    let n = this.flowDefinition.length;
    this.loopStack.push(n);
    let o = Object.assign((r) => r, { _condition: e, _maxIterations: t, _isLoopStart: true });
    return this.flowDefinition.push(o), this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  wh(e, t = 100) {
    return this.while(e, t);
  }
  endWhile() {
    if (this.loopStack.length === 0) throw new Error("endWhile() called without matching while()");
    let e = this.loopStack.pop(), t = this.flowDefinition[e];
    if (!t || !("_isLoopStart" in t)) throw new Error("Loop start step not found or invalid");
    let n = t._condition, o = t._maxIterations, r = this.flowDefinition.splice(e + 1);
    return this.flowDefinition[e] = async (i, a) => {
      let l = i, p = 0;
      for (; n(l) && p < o; ) {
        p++;
        for (let c of r) l = await c(l, a);
      }
      if (p >= o && n(l)) throw new Error(`While loop exceeded maximum iterations (${o}). Consider increasing maxIterations or ensuring the loop condition eventually becomes false.`);
      return l;
    }, this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  end() {
    return this.endWhile();
  }
  derive(e, t, n, o) {
    let r = async (i) => {
      let a = i[t];
      if (a === void 0) throw new Error(`Input field '${t}' not found in state`);
      let l;
      if (Array.isArray(a)) if (this.autoParallelConfig.enabled) {
        let p = o?.batchSize || this.autoParallelConfig.batchSize;
        l = await Ae(a, async (c, u) => n(c, u, i), p);
      } else l = a.map((p, c) => n(p, c, i));
      else l = n(a, void 0, i);
      return { ...i, [e]: l };
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let i = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      i.push(r), this.branchContext.branches.set(this.branchContext.currentBranchValue, i);
    } else this.flowDefinition.push(r), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(r, void 0, void 0, "derive", n, void 0, { inputFieldName: t, outputFieldName: e, batchSize: o?.batchSize });
    return this.ensureProgram(), this;
  }
  getExecutionPlan() {
    let e = this.executionPlanner.getExecutionPlan();
    return { totalSteps: e.totalSteps, parallelGroups: e.parallelGroups, maxParallelism: e.maxParallelism, autoParallelEnabled: this.autoParallelConfig.enabled, steps: e.steps, groups: e.groups };
  }
  getSignature() {
    return this.ensureProgram(), this.program.getSignature();
  }
  nodeExtended(e, t, n) {
    let r = typeof t == "string" ? P.create(t) : t;
    if (n.prependInputs) for (let i of n.prependInputs) r = r.prependInputField(i.name, i.type);
    if (n.appendInputs) for (let i of n.appendInputs) r = r.appendInputField(i.name, i.type);
    if (n.prependOutputs) for (let i of n.prependOutputs) r = r.prependOutputField(i.name, i.type);
    if (n.appendOutputs) for (let i of n.appendOutputs) r = r.appendOutputField(i.name, i.type);
    return this.node(e, r);
  }
  nx(e, t, n) {
    return this.nodeExtended(e, t, n);
  }
  mapOutput(e) {
    let t = async (n) => {
      let o = e(n);
      return { ...n, ...o };
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let n = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      n.push(t), this.branchContext.branches.set(this.branchContext.currentBranchValue, n);
    } else this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t, void 0, void 0, "map", e);
    return this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  mo(e) {
    return this.mapOutput(e);
  }
};
function Io(s10) {
  return qt.create(s10);
}
var bo = class {
  apiUrl;
  containerId = null;
  constructor(e = "http://localhost:2375") {
    this.apiUrl = e;
  }
  async pullImage(e) {
    let t = await this.fetchDockerAPI(`/images/create?fromImage=${encodeURIComponent(e)}`, { method: "POST" });
    if (!t.ok) throw new Error(`Failed to pull image: ${t.statusText}`);
    await t.text();
  }
  async createContainer({ imageName: e, volumes: t = [], doNotPullImage: n, tag: o }) {
    let r = t.map((p) => `${p.hostPath}:${p.containerPath}`);
    n || await this.pullImage(e);
    let i = { Image: e, Tty: true, OpenStdin: false, AttachStdin: false, AttachStdout: false, AttachStderr: false, HostConfig: { Binds: r }, Labels: {} };
    o && (i.Labels["com.example.tag"] = o);
    let a = await this.fetchDockerAPI("/containers/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(i) });
    if (!a.ok) throw new Error(`Failed to create container: ${a.statusText}`);
    let l = await a.json();
    return this.containerId = l.Id, l;
  }
  async findOrCreateContainer({ imageName: e, volumes: t = [], doNotPullImage: n, tag: o }) {
    let i = (await this.listContainers(true)).filter((l) => l.Labels && l.Labels["com.example.tag"] === o);
    if (i && i.length > 0) {
      let l = Math.floor(Math.random() * i.length), p = i[l];
      if (p) return await this.connectToContainer(p.Id), { Id: p.Id, isNew: false };
    }
    return { Id: (await this.createContainer({ imageName: e, volumes: t, doNotPullImage: n, tag: o })).Id, isNew: true };
  }
  async startContainer() {
    if (!this.containerId) throw new Error("No container created or connected");
    let e = await this.fetchDockerAPI(`/containers/${this.containerId}/start`, { method: "POST" });
    if (!e.ok) throw new Error(`Failed to start container: ${e.statusText}`);
  }
  async connectToContainer(e) {
    let t = await this.fetchDockerAPI(`/containers/${e}/json`);
    if (!t.ok) throw new Error(`Failed to connect to container: ${t.statusText}`);
    this.containerId = e;
  }
  async stopContainers({ tag: e, remove: t, timeout: n = 10 }) {
    let o = [], r = await this.listContainers(true), i = e ? r.filter((a) => a.Labels["com.example.tag"] === e) : r;
    for (let a of i) {
      if (a.State.Status === "running") {
        let l = await this.fetchDockerAPI(`/containers/${a.Id}/stop?t=${n}`, { method: "POST" });
        if (!l.ok) {
          console.warn(`Failed to stop container ${a.Id}: ${l.statusText}`);
          continue;
        }
        o.push({ Id: a.Id, Action: "stopped" });
      }
      if (t) {
        let l = await this.fetchDockerAPI(`/containers/${a.Id}`, { method: "DELETE" });
        if (!l.ok) {
          console.warn(`Failed to remove container ${a.Id}: ${l.statusText}`);
          continue;
        }
        o.push({ Id: a.Id, Action: "removed" });
      }
    }
    return o;
  }
  async listContainers(e = false) {
    return (await this.fetchDockerAPI(`/containers/json?all=${e}`, { method: "GET" })).json();
  }
  async getContainerLogs() {
    if (!this.containerId) throw new Error("No container created or connected");
    return (await this.fetchDockerAPI(`/containers/${this.containerId}/logs?stdout=true&stderr=true`, { method: "GET" })).text();
  }
  async executeCommand(e) {
    if (console.log("Executing command:", e), !this.containerId) throw new Error("No container created or connected");
    (await this.getContainerInfo(this.containerId)).State.Status !== "running" && (await this.startContainer(), await this.waitForContainerToBeRunning(this.containerId));
    let n = await this.fetchDockerAPI(`/containers/${this.containerId}/exec`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Cmd: ["sh", "-c", e], AttachStdout: true, AttachStderr: true }) });
    if (!n.ok) throw new Error(`Failed to create exec instance: ${n.statusText}`);
    let o = await n.json(), r = await this.fetchDockerAPI(`/exec/${o.Id}/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Detach: false, Tty: false }) });
    if (!r.ok) throw new Error(`Failed to start exec instance: ${r.statusText}`);
    return await r.text();
  }
  async getContainerInfo(e) {
    let t = await this.fetchDockerAPI(`/containers/${e}/json`);
    if (!t.ok) throw new Error(`Failed to get container info: ${t.statusText}`);
    return t.json();
  }
  async waitForContainerToBeRunning(e, t = 3e4) {
    let n = Date.now();
    for (; Date.now() - n < t; ) {
      if ((await this.getContainerInfo(e)).State.Status === "running") return;
      await new Promise((r) => setTimeout(r, 1e3));
    }
    throw new Error("Timeout waiting for container to start");
  }
  async fetchDockerAPI(e, t) {
    let n = new URL(e, this.apiUrl).toString();
    return await fetch(n, t);
  }
  toFunction() {
    return { name: "commandExecution", description: "Use this function to execute shell commands, scripts, and programs. This function enables interaction with the file system, running system utilities, and performing tasks that require a shell interface.", parameters: { type: "object", properties: { command: { type: "string", description: 'Shell command to execute. eg. `ls -l` or `echo "Hello, World!"`.' } }, required: ["command"] }, func: async ({ command: e }) => await this.executeCommand(e) };
  }
};
var Ro = class {
  aiService;
  info;
  func;
  constructor({ ai: e, info: t, func: n }) {
    this.aiService = e, this.info = t, this.func = n;
  }
  async embedAdapter(e, t) {
    let o = (await this.aiService.embed({ texts: [e] }, { sessionId: t?.sessionId, abortSignal: t?.abortSignal })).embeddings.at(0);
    if (!o) throw new Error("Failed to embed text");
    return this.func.length === 2 ? this.func(o, t) : this.func(o);
  }
  toFunction() {
    return { name: this.info.name, description: this.info.description, parameters: { type: "object", properties: { text: { type: "string", description: this.info.argumentDescription } }, required: ["text"] }, func: ({ text: e }, t) => this.embedAdapter(e, t) };
  }
};
var Co = class {
  constructor(e, t = {}) {
    this.transport = e;
    this.options = t;
    this.logger = t.logger ?? ((n) => {
      console.log(typeof n == "string" ? n : JSON.stringify(n, null, 2));
    });
  }
  functions = [];
  activeRequests = /* @__PURE__ */ new Map();
  capabilities = {};
  logger;
  async init() {
    "connect" in this.transport && await this.transport.connect?.();
    let { result: e } = await this.sendRequest("initialize", { protocolVersion: "2024-11-05", capabilities: { roots: { listChanged: true }, sampling: {} }, clientInfo: { name: "AxMCPClient", version: "1.0.0" } }), t = "2024-11-05";
    if (e.protocolVersion !== t) throw new Error(`Protocol version mismatch. Expected ${t} but got ${e.protocolVersion}`);
    e.capabilities.tools && (this.capabilities.tools = true), e.capabilities.resources && (this.capabilities.resources = true), e.capabilities.prompts && (this.capabilities.prompts = true), await this.sendNotification("notifications/initialized"), await this.discoverFunctions();
  }
  async discoverFunctions() {
    if (!this.capabilities.tools) throw new Error("Tools are not supported");
    let { result: e } = await this.sendRequest("tools/list");
    this.functions = e.tools.map((t) => {
      let n = this.options.functionOverrides?.find((r) => r.name === t.name), o = t.inputSchema.properties ? { properties: t.inputSchema.properties, required: t.inputSchema.required ?? [], type: t.inputSchema.type } : void 0;
      return { name: n?.updates.name ?? t.name, description: n?.updates.description ?? t.description, parameters: o, func: async (r) => {
        let { result: i } = await this.sendRequest("tools/call", { name: t.name, arguments: r });
        return i;
      } };
    });
  }
  async ping(e = 3e3) {
    let t = this.sendRequest("ping"), n = new Promise((i, a) => setTimeout(() => a(new Error("Ping response timeout exceeded")), e)), o = await Promise.race([t, n]), { result: r } = o;
    if (typeof r != "object" || r === null || Object.keys(r).length !== 0) throw new Error(`Unexpected ping response: ${JSON.stringify(r)}`);
  }
  toFunction() {
    return this.functions;
  }
  cancelRequest(e) {
    if (this.activeRequests.has(e)) {
      this.sendNotification("notifications/cancelled", { requestId: e, reason: "Client cancelled request" });
      let t = this.activeRequests.get(e);
      t && t.reject(new Error(`Request ${e} cancelled`)), this.activeRequests.delete(e);
    }
  }
  async sendRequest(e, t = {}) {
    let n = U(), o = { jsonrpc: "2.0", id: n, method: e, params: t }, r = new Promise((a, l) => {
      this.activeRequests.set(n, { reject: l }), this.transport.send(o).then((p) => {
        if (this.activeRequests.delete(n), p !== null && typeof p == "object" && "error" in p) {
          let c = p;
          l(new Error(`RPC Error ${c.error.code}: ${c.error.message}`));
        } else p !== null && typeof p == "object" && "result" in p ? a({ result: p.result }) : l(new Error("Invalid response no result or error"));
      }).catch((p) => {
        this.activeRequests.delete(n), l(p);
      });
    }), { result: i } = await r;
    return { id: n, result: i };
  }
  async sendNotification(e, t = {}) {
    let n = { jsonrpc: "2.0", method: e, params: t }, { debug: o } = this.options;
    if (o) {
      let r = { name: "Notification", id: "mcp_notification", value: `Sending notification: ${JSON.stringify(n, null, 2)}` };
      this.logger(r);
    }
    await this.transport.sendNotification(n);
  }
};
var To = class {
  endpoint = null;
  sseUrl;
  eventSource;
  constructor(e) {
    this.sseUrl = e;
  }
  async connect() {
    return new Promise((e, t) => {
      this.eventSource = new EventSource(this.sseUrl), this.eventSource.addEventListener("endpoint", (n) => {
        try {
          let r = JSON.parse(n.data);
          if (!r.uri) throw new Error("Endpoint URI missing in SSE event data");
          this.endpoint = r.uri, e();
        } catch (o) {
          t(o);
        }
      }), this.eventSource.onerror = () => {
        t(new Error("Failed to establish SSE connection"));
      };
    });
  }
  async send(e) {
    if (!this.endpoint) throw new Error("HTTPTransport endpoint is not initialized. Call connect() first.");
    let t = await fetch(this.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
    if (!t.ok) throw new Error(`HTTP error ${t.status}: ${t.statusText}`);
    return t.json();
  }
  async sendNotification(e) {
    if (!this.endpoint) throw new Error("HTTPTransport endpoint is not initialized. Call connect() first.");
    await fetch(this.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
  }
};
var wo = class {
  mcpEndpoint;
  sessionId;
  eventSource;
  pendingRequests = /* @__PURE__ */ new Map();
  messageHandler;
  customHeaders;
  constructor(e, t) {
    this.mcpEndpoint = e, this.customHeaders = { ...t?.headers }, t?.authorization && (this.customHeaders.Authorization = t.authorization);
  }
  setHeaders(e) {
    this.customHeaders = { ...e };
  }
  setAuthorization(e) {
    this.customHeaders.Authorization = e;
  }
  getHeaders() {
    return { ...this.customHeaders };
  }
  buildHeaders(e) {
    let t = { ...this.customHeaders, ...e };
    return this.sessionId && (t["Mcp-Session-Id"] = this.sessionId), t;
  }
  setMessageHandler(e) {
    this.messageHandler = e;
  }
  async connect() {
    return Promise.resolve();
  }
  async openListeningStream() {
    return new Promise((e, t) => {
      let n = this.buildHeaders({ Accept: "text/event-stream" }), o = new URL(this.mcpEndpoint);
      if (Object.keys(this.customHeaders).length > 0) {
        this.openListeningStreamWithFetch(n).then(e).catch(t);
        return;
      }
      this.eventSource = new EventSource(o.toString()), this.eventSource.onopen = () => {
        e();
      }, this.eventSource.onmessage = (r) => {
        try {
          let i = JSON.parse(r.data);
          this.messageHandler && this.messageHandler(i);
        } catch (i) {
          console.error("Failed to parse SSE message:", i);
        }
      }, this.eventSource.onerror = () => {
        t(new Error("Failed to establish SSE connection"));
      };
    });
  }
  async openListeningStreamWithFetch(e) {
    let t = await fetch(this.mcpEndpoint, { method: "GET", headers: e });
    if (!t.ok) throw new Error(`Failed to open SSE stream: ${t.status} ${t.statusText}`);
    if (!t.body) throw new Error("No response body available for SSE stream");
    let n = t.body.getReader(), o = new TextDecoder(), r = "", i = async () => {
      try {
        let { done: a, value: l } = await n.read();
        if (a) {
          n.releaseLock();
          return;
        }
        r += o.decode(l, { stream: true });
        let p = r.split(`
`);
        r = p.pop() || "";
        for (let c of p) if (c.startsWith("data: ")) {
          let u = c.slice(6);
          if (u === "[DONE]") return;
          try {
            let d = JSON.parse(u);
            this.messageHandler && this.messageHandler(d);
          } catch (d) {
            console.error("Failed to parse SSE data:", d);
          }
        }
        await i();
      } catch (a) {
        throw n.releaseLock(), a;
      }
    };
    await i();
  }
  async send(e) {
    let t = this.buildHeaders({ "Content-Type": "application/json", Accept: "application/json, text/event-stream" }), n = await fetch(this.mcpEndpoint, { method: "POST", headers: t, body: JSON.stringify(e) });
    if (!n.ok) throw n.status === 404 && this.sessionId ? (this.sessionId = void 0, new Error("Session expired. Please reinitialize.")) : new Error(`HTTP error ${n.status}: ${n.statusText}`);
    let o = n.headers.get("Mcp-Session-Id");
    o && (this.sessionId = o);
    let r = n.headers.get("Content-Type");
    if (r?.includes("text/event-stream")) return this.handleSSEResponse(n, e.id);
    if (r?.includes("application/json")) return n.json();
    throw new Error(`Unexpected content type: ${r}`);
  }
  async handleSSEResponse(e, t) {
    return new Promise((n, o) => {
      let r = e.body?.getReader();
      if (!r) {
        o(new Error("No response body reader available"));
        return;
      }
      let i = new TextDecoder(), a = "", l = async () => {
        try {
          let { done: p, value: c } = await r.read();
          if (p) {
            r.releaseLock();
            return;
          }
          a += i.decode(c, { stream: true });
          let u = a.split(`
`);
          a = u.pop() || "";
          for (let d of u) if (d.startsWith("data: ")) {
            let m = d.slice(6);
            if (m === "[DONE]") return;
            try {
              let g = JSON.parse(m);
              if ("id" in g && g.id === t) {
                n(g);
                return;
              }
              this.messageHandler && this.messageHandler(g);
            } catch (g) {
              console.error("Failed to parse SSE data:", g);
            }
          }
          await l();
        } catch (p) {
          r.releaseLock(), o(p);
        }
      };
      l().catch(o);
    });
  }
  async sendNotification(e) {
    let t = this.buildHeaders({ "Content-Type": "application/json", Accept: "application/json, text/event-stream" }), n = await fetch(this.mcpEndpoint, { method: "POST", headers: t, body: JSON.stringify(e) });
    if (!n.ok) throw n.status === 404 && this.sessionId ? (this.sessionId = void 0, new Error("Session expired. Please reinitialize.")) : new Error(`HTTP error ${n.status}: ${n.statusText}`);
    n.status !== 202 && console.warn(`Unexpected status for notification: ${n.status}`);
  }
  async terminateSession() {
    if (this.sessionId) try {
      let e = this.buildHeaders({});
      (await fetch(this.mcpEndpoint, { method: "DELETE", headers: e })).status === 405 && console.info("Server does not support explicit session termination");
    } catch (e) {
      console.error("Failed to terminate session:", e);
    } finally {
      this.sessionId = void 0;
    }
  }
  close() {
    this.eventSource && (this.eventSource.close(), this.eventSource = void 0);
  }
};
function xa(s10, e, t, n, o) {
  let r = { ...s10 };
  if (r.parameters) {
    let i = r.parameters.properties ? Object.keys(r.parameters.properties) : [], l = t.filter((p) => i.includes(p)).filter((p) => p !== "model").filter((p) => !o.excludeFieldsFromPassthrough.includes(p));
    if (l.length > 0) {
      r.parameters = ya(r.parameters, l);
      let p = r.func;
      r.func = async (c, u) => {
        let d = {};
        if (Array.isArray(e)) {
          let g = e.filter((h) => h.role === "user").pop();
          g && (d = ys(g.values, l));
        } else d = ys(e, l);
        let m = { ...c, ...d };
        return await p(m, u);
      };
    }
    return r;
  }
  return n && !o.disableSmartModelRouting && o.canConfigureSmartModelRouting && (r.parameters = Is(r.parameters, n)), r;
}
var xs = new Error("Agent description must be at least 20 characters (explain in detail what the agent does)");
var fs = new Error("Agent definition is the prompt you give to the LLM for the agent. It must be detailed and at least 100 characters");
var zt = class s9 {
  ai;
  program;
  functions;
  agents;
  disableSmartModelRouting;
  excludeFieldsFromPassthrough;
  debug;
  name;
  func;
  constructor({ ai: e, name: t, description: n, definition: o, signature: r, agents: i, functions: a }, l) {
    let { disableSmartModelRouting: p, excludeFieldsFromPassthrough: c, debug: u } = l ?? {};
    if (this.ai = e, this.agents = i, this.functions = a, this.disableSmartModelRouting = p, this.excludeFieldsFromPassthrough = c ?? [], this.debug = u, !t || t.length < 5) throw new Error("Agent name must be at least 10 characters (more descriptive)");
    if (!n || n.length < 20) throw xs;
    if (o && o.length < 100) throw fs;
    this.program = new q(r, { ...l, description: o ?? n });
    for (let m of i ?? []) this.program.register(m);
    this.name = t, this.func = { name: fa(this.name), description: n, parameters: this.program.getSignature().toJSONSchema(), func: () => this.forward };
    let d = e?.getModelList();
    d && !this.disableSmartModelRouting && (this.func.parameters = Is(this.func.parameters, d));
  }
  static create(e, t) {
    let n = P.create(e), { ai: o, name: r, description: i, definition: a, agents: l, functions: p, ...c } = t;
    return new s9({ ai: o, name: r, description: i, definition: a, signature: n, agents: l, functions: p }, c);
  }
  setExamples(e, t) {
    this.program.setExamples(e, t);
  }
  setId(e) {
    this.program.setId(e);
  }
  setParentId(e) {
    this.program.setParentId(e);
  }
  getTraces() {
    return this.program.getTraces();
  }
  setDemos(e) {
    this.program.setDemos(e);
  }
  getUsage() {
    return this.program.getUsage();
  }
  resetUsage() {
    this.program.resetUsage();
  }
  getFunction() {
    let e = this.forward.bind(this), t = async (n, o) => {
      let { model: r, ...i } = n, a = this.ai ?? o?.ai;
      if (!a) throw new Error("AI service is required to run the agent");
      let l = await e(a, i, { ...o, model: r }), c = this.program.getSignature().getOutputFields();
      return Object.keys(l).map((d) => {
        let m = c.find((g) => g.name === d);
        return m ? `${m.title}: ${l[d]}` : `${d}: ${l[d]}`;
      }).join(`
`);
    };
    return { ...this.func, func: t };
  }
  getFeatures() {
    return { canConfigureSmartModelRouting: this.ai === void 0, excludeFieldsFromPassthrough: this.excludeFieldsFromPassthrough };
  }
  init(e, t, n) {
    let o = this.ai ?? e, r = o?.getModelList(), a = this.program.getSignature().getInputFields().map((u) => u.name), l = this.getDebug(o, n), p = this.agents?.map((u) => {
      let d = u.getFeatures(), m = { debug: l, disableSmartModelRouting: !!this.disableSmartModelRouting, excludeFieldsFromPassthrough: d.excludeFieldsFromPassthrough, canConfigureSmartModelRouting: d.canConfigureSmartModelRouting };
      return xa(u.getFunction(), t, a, r, m);
    }), c = [...n?.functions ?? this.functions ?? [], ...p ?? []];
    return { ai: o, functions: c, debug: l };
  }
  async forward(e, t, n) {
    let { ai: o, functions: r, debug: i } = this.init(e, t, n);
    return await this.program.forward(o, t, { ...n, debug: i, functions: r });
  }
  async *streamingForward(e, t, n) {
    let { ai: o, functions: r, debug: i } = this.init(e, t, n);
    return yield* this.program.streamingForward(o, t, { ...n, debug: i, functions: r });
  }
  setDescription(e) {
    if (!e || e.length < 20) throw xs;
    this.program.getSignature().setDescription(e), this.func.description = e;
  }
  setDefinition(e) {
    if (!e || e.length < 100) throw fs;
    this.program.setDescription(e), this.func.description = e;
  }
  getSignature() {
    return this.program.getSignature();
  }
  setSignature(e) {
    this.program.setSignature(e);
  }
  getDebug(e, t) {
    return t?.debug ?? this.debug ?? e?.getOptions()?.debug ?? false;
  }
};
function fa(s10) {
  return s10.split(/[^a-zA-Z0-9]/).map((n, o) => {
    let r = n.toLowerCase();
    return o > 0 && r && r[0] ? r[0].toUpperCase() + r.slice(1) : r;
  }).join("");
}
function Is(s10, e) {
  let t = s10 ? structuredClone(s10) : { type: "object", properties: {}, required: [] };
  if (t.properties?.model) return t;
  let n = { type: "string", enum: e.map((i) => i.key), description: `The AI model to use for this function call. Available options: ${e.map((i) => `\`${i.key}\` ${i.description}`).join(", ")}` }, o = { ...t.properties ?? {}, model: n }, r = [...t.required ?? [], "model"];
  return { ...t, properties: o, required: r };
}
function ya(s10, e) {
  let t = structuredClone(s10);
  if (t.properties) for (let n of e) delete t.properties[n];
  if (Array.isArray(t.required)) {
    let n = t.required.filter((o) => !e.includes(o));
    Object.defineProperty(t, "required", { value: n, writable: true, configurable: true });
  }
  return t;
}
function ys(s10, e) {
  let t = {};
  for (let n of e) n in s10 && (t[n] = s10[n]);
  return t;
}
function Ia(s10, e) {
  let t = P.create(s10), { ai: n, name: o, description: r, definition: i, agents: a, functions: l, ...p } = e;
  return new zt({ ai: n, name: o, description: r, definition: i, signature: t, agents: a, functions: l }, p);
}
var ba = (s10, e) => {
  let t = e?.maxHops ?? 3, n = e?.qualityThreshold ?? 0.8, o = e?.maxIterations ?? 2, r = e?.qualityTarget ?? 0.85, i = e?.disableQualityHealing ?? false;
  return Io({ logger: e?.logger, debug: e?.debug }).node("queryGenerator", "originalQuestion:string, previousContext?:string -> searchQuery:string, queryReasoning:string").node("contextualizer", "retrievedDocument:string, accumulatedContext?:string -> enhancedContext:string").node("qualityAssessor", "currentContext:string, originalQuestion:string -> completenessScore:number, missingAspects:string[]").node("questionDecomposer", "complexQuestion:string -> subQuestions:string[], decompositionReason:string").node("evidenceSynthesizer", "collectedEvidence:string[], originalQuestion:string -> synthesizedEvidence:string, evidenceGaps:string[]").node("gapAnalyzer", "synthesizedEvidence:string, evidenceGaps:string[], originalQuestion:string -> needsMoreInfo:boolean, focusedQueries:string[]").node("answerGenerator", "finalContext:string, originalQuestion:string -> comprehensiveAnswer:string, confidenceLevel:number").node("queryRefiner", "originalQuestion:string, currentContext:string, missingAspects:string[] -> refinedQuery:string").node("qualityValidator", "generatedAnswer:string, userQuery:string -> qualityScore:number, issues:string[]").node("answerHealer", "originalAnswer:string, healingDocument:string, issues?:string[] -> healedAnswer:string").map((a) => ({ ...a, maxHops: t, qualityThreshold: n, maxIterations: o, qualityTarget: r, disableQualityHealing: i, currentHop: 0, accumulatedContext: "", retrievedContexts: [], completenessScore: 0, searchQuery: a.originalQuestion, shouldContinue: true, iteration: 0, allEvidence: [], evidenceSources: [], needsMoreInfo: true, healingAttempts: 0, currentQuality: 0, shouldContinueHealing: true, currentAnswer: "", currentIssues: [] })).while((a) => a.currentHop < a.maxHops && a.completenessScore < a.qualityThreshold && a.shouldContinue).map((a) => ({ ...a, currentHop: a.currentHop + 1 })).execute("queryGenerator", (a) => ({ originalQuestion: a.originalQuestion, previousContext: a.accumulatedContext || void 0 })).map(async (a) => {
    let l = a.queryGeneratorResult?.searchQuery || a.searchQuery || a.originalQuestion, p = await s10(l);
    return { ...a, retrievalResult: { retrievedDocument: p, retrievalConfidence: 0.9 } };
  }).execute("contextualizer", (a) => ({ retrievedDocument: a.retrievalResult.retrievedDocument, accumulatedContext: a.accumulatedContext || void 0 })).execute("qualityAssessor", (a) => ({ currentContext: a.contextualizerResult.enhancedContext, originalQuestion: a.originalQuestion })).map((a) => ({ ...a, accumulatedContext: a.contextualizerResult.enhancedContext, retrievedContexts: [...a.retrievedContexts, a.retrievalResult.retrievedDocument], completenessScore: a.qualityAssessorResult.completenessScore, searchQuery: a.queryGeneratorResult.searchQuery, shouldContinue: a.qualityAssessorResult.completenessScore < a.qualityThreshold })).branch((a) => a.shouldContinue && a.currentHop < a.maxHops).when(true).execute("queryRefiner", (a) => ({ originalQuestion: a.originalQuestion, currentContext: a.accumulatedContext, missingAspects: a.qualityAssessorResult.missingAspects })).map((a) => ({ ...a, searchQuery: a.queryRefinerResult?.refinedQuery || a.searchQuery })).when(false).map((a) => a).merge().endWhile().map((a) => ({ ...a, allEvidence: a.retrievedContexts.length > 0 ? a.retrievedContexts : [] })).while((a) => a.iteration < a.maxIterations && a.needsMoreInfo).map((a) => ({ ...a, iteration: a.iteration + 1 })).branch((a) => a.iteration === 1).when(true).execute("questionDecomposer", (a) => ({ complexQuestion: a.originalQuestion })).map((a) => ({ ...a, currentQueries: a.questionDecomposerResult.subQuestions })).when(false).map((a) => ({ ...a, currentQueries: a.gapAnalyzerResult?.focusedQueries || [] })).merge().map(async (a) => {
    let l = a.currentQueries || [], p = l.length > 0 ? await Promise.all(l.filter(Boolean).map((c) => s10(c))) : [];
    return { ...a, retrievalResults: p };
  }).execute("evidenceSynthesizer", (a) => {
    let l = [...a.allEvidence || [], ...a.retrievalResults || []].filter(Boolean);
    return { collectedEvidence: l.length > 0 ? l : ["No evidence collected yet"], originalQuestion: a.originalQuestion };
  }).execute("gapAnalyzer", (a) => ({ synthesizedEvidence: a.evidenceSynthesizerResult.synthesizedEvidence, evidenceGaps: a.evidenceSynthesizerResult.evidenceGaps, originalQuestion: a.originalQuestion })).map((a) => ({ ...a, allEvidence: [...a.allEvidence, ...a.retrievalResults], evidenceSources: [...a.evidenceSources, `Iteration ${a.iteration} sources`], needsMoreInfo: a.gapAnalyzerResult.needsMoreInfo, synthesizedEvidence: a.evidenceSynthesizerResult.synthesizedEvidence })).endWhile().execute("answerGenerator", (a) => ({ finalContext: a.accumulatedContext || a.synthesizedEvidence || a.allEvidence.join(`
`), originalQuestion: a.originalQuestion })).branch((a) => !a.disableQualityHealing).when(true).execute("qualityValidator", (a) => ({ generatedAnswer: a.answerGeneratorResult.comprehensiveAnswer, userQuery: a.originalQuestion })).map((a) => ({ ...a, currentAnswer: a.answerGeneratorResult.comprehensiveAnswer, currentQuality: a.qualityValidatorResult.qualityScore, currentIssues: a.qualityValidatorResult.issues, shouldContinueHealing: a.qualityValidatorResult.qualityScore < a.qualityTarget })).while((a) => a.healingAttempts < 3 && a.shouldContinueHealing).map((a) => ({ ...a, healingAttempts: a.healingAttempts + 1 })).map(async (a) => {
    let l = a.currentIssues || [], p = l.length > 0 ? `${a.originalQuestion} addressing issues: ${l.join(", ")}` : `${a.originalQuestion} quality improvement`, c = await s10(p);
    return { ...a, healingResult: { healingDocument: c } };
  }).execute("answerHealer", (a) => ({ originalAnswer: a.currentAnswer, healingDocument: a.healingResult.healingDocument, issues: a.currentIssues })).execute("qualityValidator", (a) => ({ generatedAnswer: a.answerHealerResult.healedAnswer, userQuery: a.originalQuestion })).map((a) => ({ ...a, currentAnswer: a.answerHealerResult.healedAnswer, currentQuality: a.qualityValidatorResult.qualityScore, currentIssues: a.qualityValidatorResult.issues, shouldContinueHealing: a.qualityValidatorResult.qualityScore < a.qualityTarget })).endWhile().when(false).map((a) => ({ ...a, currentAnswer: a.answerGeneratorResult.comprehensiveAnswer, currentQuality: 1, currentIssues: [], shouldContinueHealing: false })).merge().returns((a) => ({ finalAnswer: a.currentAnswer, totalHops: a.currentHop, retrievedContexts: a.retrievedContexts, iterationCount: a.iteration, healingAttempts: a.healingAttempts, qualityAchieved: a.currentQuality }));
};
export {
  Ct as AxAI,
  be as AxAIAnthropic,
  lt as AxAIAnthropicModel,
  Xt as AxAIAnthropicVertexModel,
  Se as AxAIAzureOpenAI,
  ve as AxAICohere,
  dt as AxAICohereEmbedModel,
  ut as AxAICohereModel,
  Oe as AxAIDeepSeek,
  mt as AxAIDeepSeekModel,
  Me as AxAIGoogleGemini,
  mn as AxAIGoogleGeminiEmbedModel,
  br as AxAIGoogleGeminiEmbedTypes,
  gt as AxAIGoogleGeminiModel,
  gn as AxAIGoogleGeminiSafetyCategory,
  hn as AxAIGoogleGeminiSafetyThreshold,
  Ue as AxAIGrok,
  kr as AxAIGrokEmbedModels,
  Rt as AxAIGrokModel,
  Ee as AxAIGroq,
  ht as AxAIGroqModel,
  Pe as AxAIHuggingFace,
  bn as AxAIHuggingFaceModel,
  Fe as AxAIMistral,
  wr as AxAIMistralEmbedModels,
  At as AxAIMistralModel,
  _e as AxAIOllama,
  we as AxAIOpenAI,
  F as AxAIOpenAIBase,
  Re as AxAIOpenAIEmbedModel,
  ct as AxAIOpenAIModel,
  Le as AxAIOpenAIResponses,
  xt as AxAIOpenAIResponsesBase,
  De as AxAIOpenAIResponsesImpl,
  Ce as AxAIOpenAIResponsesModel,
  O as AxAIRefusalError,
  Ge as AxAIReka,
  yt as AxAIRekaModel,
  ye as AxAIServiceAbortedError,
  re2 as AxAIServiceAuthenticationError,
  H as AxAIServiceError,
  ne as AxAIServiceNetworkError,
  oe as AxAIServiceResponseError,
  de as AxAIServiceStatusError,
  Y as AxAIServiceStreamTerminatedError,
  me as AxAIServiceTimeoutError,
  Ne as AxAITogether,
  $e as AxAIWebLLM,
  bt as AxAIWebLLMModel,
  zt as AxAgent,
  co as AxApacheTika,
  ie as AxAssertionError,
  an as AxBalancer,
  E as AxBaseAI,
  ce as AxBaseOptimizer,
  Xe as AxBootstrapFewShot,
  X as AxContentProcessingError,
  Bn as AxDB,
  W as AxDBBase,
  Be as AxDBCloudflare,
  zn as AxDBManager,
  se as AxDBMemory,
  qe as AxDBPinecone,
  ze as AxDBWeaviate,
  $t as AxDefaultCostTracker,
  po as AxDefaultResultReranker,
  bo as AxDockerSession,
  Ro as AxEmbeddingAdapter,
  Wi as AxEvalUtil,
  qt as AxFlow,
  Ze as AxFlowDependencyAnalyzer,
  et as AxFlowExecutionPlanner,
  tt as AxFlowSubContextImpl,
  yo as AxFlowTypedSubContextImpl,
  G as AxFluentFieldType,
  Ot as AxFunctionError,
  kt as AxFunctionProcessor,
  q as AxGen,
  Lt as AxGenerateError,
  ho as AxHFDataLoader,
  Je as AxInstanceRegistry,
  Do as AxLLMRequestTypeValues,
  Co as AxMCPClient,
  To as AxMCPHTTPSSETransport,
  wo as AxMCPStreambleHTTPTransport,
  V as AxMediaNotSupportedError,
  He as AxMemory,
  xo as AxMiPRO,
  wn as AxMockAIService,
  Sn as AxMultiServiceRouter,
  le as AxProgram,
  Ye as AxPromptTemplate,
  En as AxProviderRouter,
  ke as AxRateLimiterTokenUsage,
  P as AxSignature,
  Ft as AxSignatureBuilder,
  mo as AxSimpleClassifier,
  uo as AxSimpleClassifierClass,
  Lo as AxSpanKindValues,
  lo as AxStringUtil,
  go as AxTestPrompt,
  Ia as agent,
  ii as ai,
  fo as ax,
  gr as axAIAnthropicDefaultConfig,
  Ms as axAIAnthropicVertexDefaultConfig,
  Ls as axAIAzureOpenAIBestConfig,
  _s as axAIAzureOpenAICreativeConfig,
  Ar as axAIAzureOpenAIDefaultConfig,
  Ds as axAIAzureOpenAIFastConfig,
  Bs as axAICohereCreativeConfig,
  yr as axAICohereDefaultConfig,
  zs as axAIDeepSeekCodeConfig,
  Ir as axAIDeepSeekDefaultConfig,
  Cr as axAIGoogleGeminiDefaultConfig,
  js as axAIGoogleGeminiDefaultCreativeConfig,
  si as axAIGrokBestConfig,
  Nn as axAIGrokDefaultConfig,
  Vs as axAIHuggingFaceCreativeConfig,
  Tr as axAIHuggingFaceDefaultConfig,
  Ws as axAIMistralBestConfig,
  Tn as axAIMistralDefaultConfig,
  Sr as axAIOllamaDefaultConfig,
  Js as axAIOllamaDefaultCreativeConfig,
  on as axAIOpenAIBestConfig,
  rn as axAIOpenAICreativeConfig,
  ge as axAIOpenAIDefaultConfig,
  sn as axAIOpenAIFastConfig,
  Ys as axAIOpenAIResponsesBestConfig,
  Xs as axAIOpenAIResponsesCreativeConfig,
  ft as axAIOpenAIResponsesDefaultConfig,
  ei as axAIRekaBestConfig,
  ti as axAIRekaCreativeConfig,
  It as axAIRekaDefaultConfig,
  ni as axAIRekaFastConfig,
  Or as axAITogetherDefaultConfig,
  ri as axAIWebLLMCreativeConfig,
  Mr as axAIWebLLMDefaultConfig,
  Zs as axAnalyzeChatPromptRequirements,
  he as axAnalyzeRequestRequirements,
  w as axBaseAIDefaultConfig,
  _ as axBaseAIDefaultCreativeConfig,
  ui as axCheckMetricsHealth,
  Fo as axCreateDefaultColorLogger,
  ms as axCreateDefaultOptimizerColorLogger,
  Ji as axCreateDefaultOptimizerTextLogger,
  ws as axCreateDefaultTextLogger,
  Bt as axCreateFlowColorLogger,
  ha as axCreateFlowTextLogger,
  Aa as axDefaultFlowLogger,
  Er as axDefaultMetricsConfig,
  Ao as axDefaultOptimizerLogger,
  gs as axDefaultOptimizerMetricsConfig,
  Ns as axGetCompatibilityReport,
  Us as axGetFormatCompatibility,
  gi as axGetMetricsConfig,
  Xi as axGetOptimizerMetricsConfig,
  $s as axGetProvidersWithMediaSupport,
  M as axGlobals,
  pt as axModelInfoAnthropic,
  cn as axModelInfoCohere,
  dn as axModelInfoDeepSeek,
  An as axModelInfoGoogleGemini,
  Gn as axModelInfoGrok,
  yn as axModelInfoGroq,
  In as axModelInfoHuggingFace,
  Cn as axModelInfoMistral,
  Te as axModelInfoOpenAI,
  tn as axModelInfoOpenAIResponses,
  Mn as axModelInfoReka,
  Pn as axModelInfoTogether,
  Dn as axModelInfoWebLLM,
  On as axProcessContentForProvider,
  ba as axRAG,
  ln as axScoreProvidersForRequest,
  pn as axSelectOptimalProvider,
  T as axSpanAttributes,
  Z as axSpanEvents,
  mi as axUpdateMetricsConfig,
  Yi as axUpdateOptimizerMetricsConfig,
  Fn as axValidateChatRequestMessage,
  _n as axValidateChatResponseResult,
  xr as axValidateProviderCapabilities,
  Qe as f,
  Io as flow,
  ga as s
};
//# sourceMappingURL=ax.js.map

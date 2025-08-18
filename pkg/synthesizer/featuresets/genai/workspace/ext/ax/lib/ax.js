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
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i10 = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v2 = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i11 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i11, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i11 = e2.clone().add(r2, c), s2 = n2 - i11 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
        return +(-(r2 + (n2 - i11) / (s2 ? i11 - u2 : u2 - i11)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i10, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D2 = {};
      D2[g] = M2;
      var p = "$isDayjsObject", S2 = function(t2) {
        return t2 instanceof _2 || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r2) {
        var i11;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D2[s2] && (i11 = s2), n2 && (D2[s2] = n2, i11 = s2);
          var u2 = e2.split("-");
          if (!i11 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D2[a2] = e2, i11 = a2;
        }
        return !r2 && i11 && (g = i11), i11 || !r2 && g;
      }, O2 = function(t2, e2) {
        if (S2(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _2(n2);
      }, b = v2;
      b.l = w, b.i = S2, b.w = function(t2, e2) {
        return O2(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _2 = function() {
        function M3(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M3.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($2);
              if (r2) {
                var i11 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i11, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i11, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
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
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i11 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i11 : i11.endOf(a);
          }, $3 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M4 = this.$M, m3 = this.$D, v3 = "set" + (this.$u ? "UTC" : "");
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
              return $3(v3 + "Hours", 0);
            case u:
              return $3(v3 + "Minutes", 1);
            case s:
              return $3(v3 + "Seconds", 2);
            case i10:
              return $3(v3 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i10] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $3 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($3), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($3);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $3 = b.p(f2), y2 = function(t2) {
            var e2 = O2(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($3 === c) return this.set(c, this.$M + r2);
          if ($3 === h) return this.set(h, this.$y + r2);
          if ($3 === a) return y2(1);
          if ($3 === o) return y2(7);
          var M4 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i10] = t, d2)[$3] || 1, m3 = this.$d.getTime() + r2 * M4;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i11 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i12, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i12[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $3 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, function(t3, r3) {
            return r3 || function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $3(s2, u2, true);
                case "A":
                  return $3(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i11;
              }
              return null;
            }(t3) || i11.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $3, y2 = this, M4 = b.p(d2), m3 = O2(r2), v3 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D3 = function() {
            return b.m(y2, m3);
          };
          switch (M4) {
            case h:
              $3 = D3() / 12;
              break;
            case c:
              $3 = D3();
              break;
            case f:
              $3 = D3() / 3;
              break;
            case o:
              $3 = (g2 - v3) / 6048e5;
              break;
            case a:
              $3 = (g2 - v3) / 864e5;
              break;
            case u:
              $3 = g2 / n;
              break;
            case s:
              $3 = g2 / e;
              break;
            case i10:
              $3 = g2 / t;
              break;
            default:
              $3 = g2;
          }
          return l2 ? $3 : b.a($3);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D2[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = w(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
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
      return O2.prototype = k, [["$ms", r], ["$s", i10], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
        k[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), O2.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _2, O2), t2.$i = true), O2;
      }, O2.locale = w, O2.isDayjs = S2, O2.unix = function(t2) {
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
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i10 = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s = {}, a = function(e2) {
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
        var t2 = s[e2];
        return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
      }, d = function(e2, t2) {
        var n2, r2 = s.meridiem;
        if (r2) {
          for (var i11 = 1; i11 <= 24; i11 += 1) if (e2.indexOf(r2(i11, 0, t2)) > -1) {
            n2 = i11 > 12;
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
      }], s: [i10, f("seconds")], ss: [i10, f("seconds")], m: [i10, f("minutes")], mm: [i10, f("minutes")], H: [i10, f("hours")], h: [i10, f("hours")], HH: [i10, f("hours")], hh: [i10, f("hours")], D: [i10, f("day")], DD: [r, f("day")], Do: [o, function(e2) {
        var t2 = s.ordinal, n2 = e2.match(/\d+/);
        if (this.day = n2[0], t2) for (var r2 = 1; r2 <= 31; r2 += 1) t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
      }], w: [i10, f("week")], ww: [r, f("week")], M: [i10, f("month")], MM: [r, f("month")], MMM: [o, function(e2) {
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
        var r2, i11;
        r2 = n2, i11 = s && s.formats;
        for (var o2 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t2, n3, r3) {
          var o3 = r3 && r3.toUpperCase();
          return n3 || i11[r3] || e[r3] || i11[o3].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t3, n4) {
            return t3 || n4.slice(1);
          });
        })).match(t), a2 = o2.length, f2 = 0; f2 < a2; f2 += 1) {
          var h2 = o2[f2], u2 = c[h2], d2 = u2 && u2[0], l2 = u2 && u2[1];
          o2[f2] = l2 ? { regex: d2, parser: l2 } : h2.replace(/^\[|\]$/g, "");
        }
        return function(e2) {
          for (var t2 = {}, n3 = 0, r3 = 0; n3 < a2; n3 += 1) {
            var i12 = o2[n3];
            if ("string" == typeof i12) r3 += i12.length;
            else {
              var s2 = i12.regex, f3 = i12.parser, h3 = e2.slice(r3), u3 = s2.exec(h3)[0];
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
        var r2 = t2.prototype, i11 = r2.parse;
        r2.parse = function(e3) {
          var t3 = e3.date, r3 = e3.utc, o2 = e3.args;
          this.$u = r3;
          var a2 = o2[1];
          if ("string" == typeof a2) {
            var f2 = true === o2[2], h2 = true === o2[3], u2 = f2 || h2, d2 = o2[2];
            h2 && (d2 = o2[2]), s = this.$locale(), !f2 && d2 && (s = n2.Ls[d2]), this.$d = function(e4, t4, n3, r4) {
              try {
                if (["x", "X"].indexOf(t4) > -1) return new Date(("X" === t4 ? 1e3 : 1) * e4);
                var i12 = l(t4)(e4), o3 = i12.year, s2 = i12.month, a3 = i12.day, f3 = i12.hours, h3 = i12.minutes, u3 = i12.seconds, d3 = i12.milliseconds, c3 = i12.zone, m2 = i12.week, M3 = /* @__PURE__ */ new Date(), Y2 = a3 || (o3 || s2 ? 1 : M3.getDate()), p = o3 || M3.getFullYear(), v2 = 0;
                o3 && !s2 || (v2 = s2 > 0 ? s2 - 1 : M3.getMonth());
                var D2, w = f3 || 0, g = h3 || 0, y = u3 || 0, L2 = d3 || 0;
                return c3 ? new Date(Date.UTC(p, v2, Y2, w, g, y, L2 + 60 * c3.offset * 1e3)) : n3 ? new Date(Date.UTC(p, v2, Y2, w, g, y, L2)) : (D2 = new Date(p, v2, Y2, w, g, y, L2), m2 && (D2 = r4(D2).week(m2).toDate()), D2);
              } catch (e5) {
                return /* @__PURE__ */ new Date("");
              }
            }(t3, a2, r3, n2), this.init(), d2 && true !== d2 && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = /* @__PURE__ */ new Date("")), s = {};
          } else if (a2 instanceof Array) for (var c2 = a2.length, m = 1; m <= c2; m += 1) {
            o2[1] = a2[m - 1];
            var M2 = n2.apply(this, o2);
            if (M2.isValid()) {
              this.$d = M2.$d, this.$L = M2.$L, this.init();
              break;
            }
            m === c2 && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else i11.call(this, e3);
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
      return function(n, i10, o) {
        var r, a = function(t2, n2, i11) {
          void 0 === i11 && (i11 = {});
          var o2 = new Date(t2), r2 = function(t3, n3) {
            void 0 === n3 && (n3 = {});
            var i12 = n3.timeZoneName || "short", o3 = t3 + "|" + i12, r3 = e[o3];
            return r3 || (r3 = new Intl.DateTimeFormat("en-US", { hour12: false, timeZone: t3, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: i12 }), e[o3] = r3), r3;
          }(n2, i11);
          return r2.formatToParts(o2);
        }, u = function(e2, n2) {
          for (var i11 = a(e2, n2), r2 = [], u2 = 0; u2 < i11.length; u2 += 1) {
            var f2 = i11[u2], s2 = f2.type, m = f2.value, c = t[s2];
            c >= 0 && (r2[c] = parseInt(m, 10));
          }
          var d = r2[3], l = 24 === d ? 0 : d, h = r2[0] + "-" + r2[1] + "-" + r2[2] + " " + l + ":" + r2[4] + ":" + r2[5] + ":000", v2 = +e2;
          return (o.utc(h).valueOf() - (v2 -= v2 % 1e3)) / 6e4;
        }, f = i10.prototype;
        f.tz = function(t2, e2) {
          void 0 === t2 && (t2 = r);
          var n2, i11 = this.utcOffset(), a2 = this.toDate(), u2 = a2.toLocaleString("en-US", { timeZone: t2 }), f2 = Math.round((a2 - new Date(u2)) / 1e3 / 60), s2 = 15 * -Math.round(a2.getTimezoneOffset() / 15) - f2;
          if (!Number(s2)) n2 = this.utcOffset(0, e2);
          else if (n2 = o(u2, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(s2, true), e2) {
            var m = n2.utcOffset();
            n2 = n2.add(i11 - m, "minute");
          }
          return n2.$x.$timezone = t2, n2;
        }, f.offsetName = function(t2) {
          var e2 = this.$x.$timezone || o.tz.guess(), n2 = a(this.valueOf(), e2, { timeZoneName: t2 }).find(function(t3) {
            return "timezonename" === t3.type.toLowerCase();
          });
          return n2 && n2.value;
        };
        var s = f.startOf;
        f.startOf = function(t2, e2) {
          if (!this.$x || !this.$x.$timezone) return s.call(this, t2, e2);
          var n2 = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
          return s.call(n2, t2, e2).tz(this.$x.$timezone, true);
        }, o.tz = function(t2, e2, n2) {
          var i11 = n2 && e2, a2 = n2 || e2 || r, f2 = u(+o(), a2);
          if ("string" != typeof t2) return o(t2).tz(a2);
          var s2 = function(t3, e3, n3) {
            var i12 = t3 - 60 * e3 * 1e3, o2 = u(i12, n3);
            if (e3 === o2) return [i12, e3];
            var r2 = u(i12 -= 60 * (o2 - e3) * 1e3, n3);
            return o2 === r2 ? [i12, o2] : [t3 - 60 * Math.min(o2, r2) * 1e3, Math.max(o2, r2)];
          }(o.utc(t2, i11).valueOf(), f2, a2), m = s2[0], c = s2[1], d = o(m).utcOffset(c);
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
    !function(t, i10) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = i10() : "function" == typeof define && define.amd ? define(i10) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i10();
    }(exports, function() {
      "use strict";
      var t = "minute", i10 = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
      return function(s, f, n) {
        var u = f.prototype;
        n.utc = function(t2) {
          var i11 = { date: t2, utc: true, args: arguments };
          return new f(i11);
        }, u.utc = function(i11) {
          var e2 = n(this.toDate(), { locale: this.$L, utc: true });
          return i11 ? e2.add(this.utcOffset(), t) : e2;
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
        u.utcOffset = function(s2, f2) {
          var n2 = this.$utils().u;
          if (n2(s2)) return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
          if ("string" == typeof s2 && (s2 = function(t2) {
            void 0 === t2 && (t2 = "");
            var s3 = t2.match(i10);
            if (!s3) return null;
            var f3 = ("" + s3[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
            return 0 === u3 ? 0 : "+" === n3 ? u3 : -u3;
          }(s2), null === s2)) return this;
          var u2 = Math.abs(s2) <= 16 ? 60 * s2 : s2, o2 = this;
          if (f2) return o2.$offset = u2, o2.$u = 0 === s2, o2;
          if (0 !== s2) {
            var r2 = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
            (o2 = this.local().add(u2 + r2, t)).$offset = u2, o2.$x.$localOffset = r2;
          } else o2 = this.utc();
          return o2;
        };
        var h = u.format;
        u.format = function(t2) {
          var i11 = t2 || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
          return h.call(this, i11);
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
        u.diff = function(t2, i11, e2) {
          if (t2 && this.$u === t2.$u) return c.call(this, t2, i11, e2);
          var s2 = this.local(), f2 = n(t2).local();
          return c.call(s2, f2, i11, e2);
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
  function _reject(v2) {
    rejectedVersions.add(v2);
    return false;
  }
  function _accept(v2) {
    acceptedVersions.add(v2);
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
  var i10 = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i10.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i10["return"])) m.call(i10);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i10 = 0, l = from.length, ar2; i10 < l; i10++) {
    if (ar2 || !(i10 in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i10);
      ar2[i10] = from[i10];
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
  var i10 = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i10.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i10["return"])) m.call(i10);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray2 = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i10 = 0, l = from.length, ar2; i10 < l; i10++) {
    if (ar2 || !(i10 in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i10);
      ar2[i10] = from[i10];
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
  var i10 = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i10.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i10["return"])) m.call(i10);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray3 = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i10 = 0, l = from.length, ar2; i10 < l; i10++) {
    if (ar2 || !(i10 in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i10);
      ar2[i10] = from[i10];
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
  var i10 = m.call(o), r, ar2 = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i10.next()).done) ar2.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i10["return"])) m.call(i10);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar2;
};
var __spreadArray4 = function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i10 = 0, l = from.length, ar2; i10 < l; i10++) {
    if (ar2 || !(i10 in from)) {
      if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i10);
      ar2[i10] = from[i10];
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
function W({ model: i10, modelInfo: e, models: t }) {
  let n = t?.find((l) => l.key === i10), o = n && "model" in n ? n.model : i10, r = e.find((l) => l.name === i10);
  if (r) return r;
  let s = o.replace(/^(anthropic\.|openai\.)/, "").replace(/-latest$/, "").replace(/-\d{8}$/, "").replace(/-v\d+:\d+$/, "").replace(/@\d{8}$/, "").replace(/-\d{2,}(-[a-zA-Z0-9-]+)?$/, "").replace(/-v\d+@\d{8}$/, "").replace(/-v\d+$/, ""), a = e.find((l) => l.name === s);
  return a || null;
}
var Eo = (() => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID == "function") return globalThis.crypto;
  throw new Error("Web Crypto API with randomUUID support not available. Requires Node.js 16+ or modern browser.");
})();
function B() {
  return Eo.randomUUID();
}
async function Ms(i10) {
  let e = new TextEncoder(), t = typeof i10 == "string" ? e.encode(i10) : i10, n = await Eo.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((s) => s.toString(16).padStart(2, "0")).join("");
}
var en = class {
  data = "";
  update(e) {
    return this.data += e, this;
  }
  digest(e) {
    if (e !== "hex") throw new Error("Only hex encoding is supported");
    let n = new TextEncoder().encode(this.data), o = 0;
    for (let r = 0; r < n.length; r++) {
      let s = n[r];
      o = (o << 5) - o + s, o = o & o;
    }
    return Math.abs(o).toString(16).padStart(8, "0");
  }
  async digestAsync() {
    return Ms(this.data);
  }
};
function pt(i10) {
  if (i10 !== "sha256") throw new Error("Only SHA-256 algorithm is supported");
  return new en();
}
var ut = class extends TransformStream {
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
var tn = class {
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
var ct = class extends TransformStream {
  constructor() {
    super(new tn());
  }
};
var ks = { maxRetries: 3, initialDelayMs: 1e3, maxDelayMs: 6e4, backoffFactor: 2, retryableStatusCodes: [500, 408, 429, 502, 503, 504] };
var Es = globalThis.TextDecoderStream ?? ct;
var j = class extends Error {
  constructor(t, n, o, r, s = {}) {
    super(t);
    this.url = n;
    this.requestBody = o;
    this.responseBody = r;
    this.name = this.constructor.name, this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = B(), this.context = s, this.stack = this.toString();
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
var de = class extends j {
  constructor(t, n, o, r, s, a) {
    super(`HTTP ${t} - ${n}`, o, r, { httpStatus: t, httpStatusText: n, responseBody: s, ...a });
    this.status = t;
    this.statusText = n;
    this.name = this.constructor.name;
  }
};
var oe = class extends j {
  constructor(t, n, o, r, s) {
    super(`Network Error: ${t.message}`, n, o, r, { originalErrorName: t.name, originalErrorStack: t.stack, ...s });
    this.originalError = t;
    this.name = this.constructor.name, this.stack = t.stack;
  }
};
var re2 = class extends j {
  constructor(e, t, n, o) {
    super(e, t, n, void 0, o), this.name = this.constructor.name;
  }
};
var Z = class extends j {
  constructor(t, n, o, r) {
    super("Stream terminated unexpectedly by remote host", t, n, void 0, { lastChunk: o, ...r });
    this.lastChunk = o;
    this.name = this.constructor.name;
  }
};
var me = class extends j {
  constructor(e, t, n, o) {
    super(`Request timed out after ${t}ms`, e, n, void 0, { timeoutMs: t, ...o }), this.name = this.constructor.name;
  }
};
var Te = class extends j {
  constructor(e, t, n, o) {
    super(`Request aborted${t ? `: ${t}` : ""}`, e, n, void 0, { abortReason: t, ...o }), this.name = this.constructor.name;
  }
};
var se = class extends j {
  constructor(e, t, n, o) {
    super("Authentication failed", e, t, n, o), this.name = this.constructor.name;
  }
};
var E = class extends Error {
  constructor(t, n, o) {
    super(`Model refused to fulfill request: ${t}`);
    this.refusalMessage = t;
    this.model = n;
    this.requestId = o;
    this.name = "AxAIRefusalError", this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = B();
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
    this.name = "AxMediaNotSupportedError", this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = B();
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
var ee = class extends Error {
  constructor(t, n, o) {
    super(`Failed to process ${n} during ${o}: ${t.message}`);
    this.originalError = t;
    this.contentType = n;
    this.processingStep = o;
    this.name = "AxContentProcessingError", this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = B();
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
async function Po(i10) {
  try {
    return i10.headers.get("content-type")?.includes("application/json") ? await i10.json() : await i10.clone().text();
  } catch (e) {
    return `[ReadableStream - read failed: ${e.message}]`;
  }
}
function Fo(i10, e) {
  return Math.min(e.maxDelayMs, e.initialDelayMs * e.backoffFactor ** i10) * (0.75 + Math.random() * 0.5);
}
function Ps() {
  return { startTime: Date.now(), retryCount: 0 };
}
function _o(i10) {
  i10.retryCount++, i10.lastRetryTime = Date.now();
}
function Do(i10, e, t, n) {
  return t >= n.maxRetries ? false : e && n.retryableStatusCodes.includes(e) ? true : i10 instanceof oe && !(i10 instanceof se);
}
var q = async (i10, e) => {
  if (i10.localCall) return await i10.localCall(e, i10.stream);
  if (!i10.url) throw new Error("API URL is required when localCall is not provided");
  let t = { ...ks, ...i10.retry }, n = i10.timeout, o = Ps(), r, s = new URL(i10.url), a = `${[s.pathname, i10.name].filter(Boolean).join("/").replace(/\/+/g, "/")}${s.search}`, l = new URL(a, s);
  if (i10.corsProxy) {
    let d = l.href;
    l = new URL(`${i10.corsProxy}?url=${encodeURIComponent(d)}`);
  }
  let p = B();
  if (i10.validateRequest && !await i10.validateRequest(e)) throw new re2("Invalid request data", l.href, e, { validation: "request" });
  i10.span?.setAttributes({ "http.request.method": i10.put ? "PUT" : "POST", "url.full": l.href, "request.id": p, "request.startTime": o.startTime });
  let u = 0;
  for (; ; ) {
    let d = new AbortController();
    if (i10.abortSignal) {
      if (i10.abortSignal.aborted) throw new Te(l.href, i10.abortSignal.reason, e, { metrics: o });
      let c = () => {
        d.abort(i10.abortSignal.reason || "User aborted request");
      };
      i10.abortSignal.addEventListener("abort", c, { once: true });
      let m = d.abort.bind(d);
      d.abort = (g) => {
        i10.abortSignal.removeEventListener("abort", c), m(g);
      };
    }
    n && (r = setTimeout(() => {
      d.abort("Request timeout");
    }, n));
    try {
      let c = await (i10.fetch ?? fetch)(l, { method: i10.put ? "PUT" : "POST", headers: { "Content-Type": "application/json", "X-Request-ID": p, "X-Retry-Count": u.toString(), ...i10.headers }, body: JSON.stringify(e), signal: d.signal });
      if (r && clearTimeout(r), c.status === 401 || c.status === 403) {
        let A = await Po(c);
        throw new se(l.href, e, A, { metrics: o });
      }
      if (c.status >= 400 && Do(new Error(), c.status, u, t)) {
        let A = Fo(u, t);
        u++, _o(o), i10.span?.addEvent("retry", { attempt: u, delay: A, status: c.status, "metrics.startTime": o.startTime, "metrics.retryCount": o.retryCount, "metrics.lastRetryTime": o.lastRetryTime }), await new Promise((I) => setTimeout(I, A));
        continue;
      }
      if (c.status >= 400) {
        let A = await Po(c);
        throw new de(c.status, c.statusText, l.href, e, A, { metrics: o });
      }
      if (!i10.stream) {
        let A = await c.json();
        if (i10.validateResponse && !await i10.validateResponse(A)) throw new re2("Invalid response data", l.href, e, { validation: "response" });
        return i10.span?.setAttributes({ "response.time": Date.now() - o.startTime, "response.retries": o.retryCount }), A;
      }
      if (!c.body) throw new re2("Response body is null", l.href, e, { metrics: o });
      let m, g = 0;
      if (typeof window < "u" && typeof EventSource < "u") return new ReadableStream({ start(A) {
        let I = c.body.getReader(), b = new TextDecoder(), y = "";
        async function R() {
          try {
            for (; ; ) {
              let { done: T, value: w } = await I.read();
              if (T) {
                f = true, A.close();
                break;
              }
              y += b.decode(w, { stream: true });
              let P = y.split(`

`);
              y = P.pop() || "";
              for (let k of P) {
                if (!k.trim()) continue;
                let F = k.split(`
`), K = "", be = "message";
                for (let z of F) z.startsWith("data: ") ? K = z.slice(6) : z.startsWith("event: ") && (be = z.slice(7));
                if (K) {
                  if (K === "[DONE]") {
                    A.close();
                    return;
                  }
                  try {
                    let z = JSON.parse(K);
                    m = z, g++, o.streamChunks = g, o.lastChunkTime = Date.now(), A.enqueue(z), i10.span?.addEvent("stream.chunk", { "stream.chunks": g, "stream.duration": Date.now() - o.startTime, "response.retries": o.retryCount, "sse.event.type": be });
                  } catch (z) {
                    i10.debug && console.warn("Skipping non-JSON SSE data:", K, z);
                  }
                }
              }
            }
          } catch (T) {
            let w = T, P = { ...o, streamDuration: Date.now() - o.startTime };
            w.name === "AbortError" || w.message?.includes("aborted") ? A.error(new Z(l.href, e, m, { streamMetrics: P })) : A.error(new oe(w, l.href, e, "[ReadableStream - consumed during streaming]", { streamMetrics: P }));
          } finally {
            I.releaseLock();
          }
        }
        R();
      } });
      let x = new TransformStream({ transform(A, I) {
        m = A, g++, o.streamChunks = g, o.lastChunkTime = Date.now(), I.enqueue(A), i10.span?.addEvent("stream.chunk", { "stream.chunks": g, "stream.duration": Date.now() - o.startTime, "response.retries": o.retryCount });
      } }), f = false;
      return new ReadableStream({ start(A) {
        let I = c.body.pipeThrough(new Es()).pipeThrough(new ut()).pipeThrough(x).getReader();
        async function b() {
          try {
            for (; ; ) {
              let { done: y, value: R } = await I.read();
              if (y) {
                f || (f = true, A.close());
                break;
              }
              if (f) break;
              A.enqueue(R);
            }
          } catch (y) {
            let R = y, T = { ...o, streamDuration: Date.now() - o.startTime };
            throw R.name === "AbortError" || R.message?.includes("aborted") ? A.error(new Z(l.href, e, m, { streamMetrics: T })) : R instanceof TypeError && R.message.includes("cancelled") ? A.error(new Z(l.href, e, m, { streamMetrics: T, cancelReason: "Stream cancelled by client" })) : A.error(new oe(R, l.href, e, "[ReadableStream - consumed during streaming]", { streamMetrics: T })), R;
          } finally {
            r && clearTimeout(r), I.releaseLock();
          }
        }
        b();
      }, cancel() {
        f = true;
      } });
    } catch (c) {
      if (c instanceof Error && c.name === "AbortError") throw i10.abortSignal?.aborted ? new Te(l.href, i10.abortSignal.reason, e, { metrics: o }) : new me(l.href, n || 0, e, { metrics: o });
      if (i10.span?.isRecording() && (i10.span.recordException(c), i10.span.setAttributes({ "error.time": Date.now() - o.startTime, "error.retries": o.retryCount })), c instanceof oe && Do(c, void 0, u, t)) {
        let m = Fo(u, t);
        u++, _o(o), i10.span?.addEvent("retry", { attempt: u, delay: m, error: c.message, "metrics.startTime": o.startTime, "metrics.retryCount": o.retryCount, "metrics.lastRetryTime": o.lastRetryTime }), await new Promise((g) => setTimeout(g, m));
        continue;
      }
      throw c instanceof j && (c.context.metrics = o), c;
    } finally {
      r !== void 0 && clearTimeout(r);
    }
  }
};
var M = { signatureStrict: true, tracer: void 0, meter: void 0, logger: void 0, optimizerLogger: void 0, functionResultFormatter: (i10) => typeof i10 == "string" ? i10 : i10 == null ? "" : JSON.stringify(i10, null, 2) };
var $ = class {
  ANSI_WHITE_BRIGHT = "\x1B[97m";
  ANSI_GREEN_BRIGHT = "\x1B[92m";
  ANSI_BLUE_BRIGHT = "\x1B[94m";
  ANSI_RED_BRIGHT = "\x1B[91m";
  ANSI_YELLOW_BRIGHT = "\x1B[93m";
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
  yellowBright(e) {
    return this.colorize(e, this.ANSI_YELLOW_BRIGHT);
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
var ja = new $();
var Lo = (i10) => {
  console.log(i10);
};
var No = (i10, e, t) => {
  let n = (o, r) => t && r && r in t ? t[r](o) : o;
  switch (i10.role) {
    case "system":
      return `${n("[ SYSTEM ]", "magentaBright")}
${n(i10.content, "magenta")}`;
    case "function":
      return `${n("[ FUNCTION RESULT ]", "yellow")}
${n(i10.result ?? "[No result]", "yellowDim")}`;
    case "user": {
      let o = `${n("[ USER ]", "greenBright")}
`;
      if (typeof i10.content == "string") return o + n(i10.content, "green");
      let r = i10.content.map((s) => {
        if (s.type === "text") return n(s.text, "green");
        if (s.type === "image") {
          let a = e ? "[Image]" : `[Image: ${s.image}]`;
          return n(a, "green");
        }
        if (s.type === "audio") {
          let a = e ? "[Audio]" : `[Audio: ${s.data}]`;
          return n(a, "green");
        }
        return n("[Unknown content type]", "gray");
      });
      return o + r.join(`
`);
    }
    case "assistant": {
      let o = n("[ ASSISTANT", "cyanBright");
      i10.name && (o += ` ${i10.name}`), o += " ]";
      let r = `${o}
`;
      return i10.content && (r += `${n(i10.content, "cyan")}
`), i10.functionCalls && i10.functionCalls.length > 0 && (r += `${n("[ FUNCTION CALLS ]", "yellow")}
`, i10.functionCalls.forEach((s, a) => {
        let l = typeof s.function.params == "string" ? s.function.params : JSON.stringify(s.function.params, null, 2);
        r += n(`${a + 1}. ${s.function.name}(${l}) [id: ${s.id}]`, "yellowDim"), a < (i10.functionCalls?.length ?? 0) - 1 && (r += `
`);
      }), r += `
`), !i10.content && (!i10.functionCalls || i10.functionCalls.length === 0) && (r += n("[No content]", "gray")), r;
    }
    default:
      return `${n("[ UNKNOWN ]", "redBright")}
${n(JSON.stringify(i10), "gray")}`;
  }
};
var Go = (i10 = Lo) => {
  let e = new $(), t = e.gray(`${"\u2500".repeat(60)}
`);
  return (n) => {
    let o = n, r = "";
    switch (o.name) {
      case "ChatRequestChatPrompt":
        r = `
${e.blueBright(`[ CHAT REQUEST Step ${o.step} ]`)}
${t}
`, o.value.forEach((s, a) => {
          r += No(s, void 0, e), a < o.value.length - 1 && (r += `
${t}
`);
        }), r += `
${t}`;
        break;
      case "FunctionResults":
        r = `
${e.yellow("[ FUNCTION RESULTS ]")}
`, o.value.forEach((s, a) => {
          r += e.yellowDim(`Function: ${s.functionId}
Result: ${s.result}`), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "ChatResponseResults":
        r = `
${e.cyanBright("[ CHAT RESPONSE ]")}
`, o.value.forEach((s, a) => {
          r += e.cyan(s.content || "[No content]"), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "ChatResponseStreamingResult": {
        let s = o.value.delta || o.value.content || "";
        r = e.cyanBright(s);
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
`, o.value.forEach((s, a) => {
          r += e.white(`Text ${a + 1}: ${s.substring(0, 100)}${s.length > 100 ? "..." : ""}`), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "EmbedResponse":
        r = `${e.orange(`[ EMBED RESPONSE (${o.totalEmbeddings} embeddings) ]`)}
${t}
`, o.value.forEach((s, a) => {
          r += e.white(`Embedding ${a + 1}: [${s.sample.join(", ")}${s.truncated ? ", ..." : ""}] (length: ${s.length})`), a < o.value.length - 1 && (r += `
${t}
`);
        });
        break;
      case "ChatResponseUsage": {
        r = `${e.greenBright(`
[ CHAT RESPONSE USAGE ]`)}
`;
        let s = o.value;
        r += `${e.white("AI:")} ${s.ai}
`, r += `${e.white("Model:")} ${s.model}
`, s.tokens && (r += `${e.white("Total Tokens:")} ${s.tokens.totalTokens}
`, r += `${e.white("Prompt Tokens:")} ${s.tokens.promptTokens}
`, r += `${e.white("Completion Tokens:")} ${s.tokens.completionTokens}
`, s.tokens.thoughtsTokens !== void 0 && (r += `${e.white("Thoughts Tokens:")} ${s.tokens.thoughtsTokens}
`), s.tokens.reasoningTokens !== void 0 && (r += `${e.white("Reasoning Tokens:")} ${s.tokens.reasoningTokens}
`), s.tokens.cacheCreationTokens !== void 0 && (r += `${e.white("Cache Creation Tokens:")} ${s.tokens.cacheCreationTokens}
`), s.tokens.cacheReadTokens !== void 0 && (r += `${e.white("Cache Read Tokens:")} ${s.tokens.cacheReadTokens}
`), s.tokens.serviceTier !== void 0 && (r += `${e.white("Service Tier:")} ${s.tokens.serviceTier}
`)), r += t;
        break;
      }
      case "ChatResponseCitations": {
        r = `${e.blueBright(`
[ CHAT RESPONSE CITATIONS ]`)}
`, o.value.forEach((s) => {
          r += `${e.white("- ")}${e.cyan(s.title || s.url)}
`, s.description && (r += `  ${e.gray(s.description)}
`);
        }), r += t;
        break;
      }
      default:
        r = e.gray(JSON.stringify(o, null, 2));
    }
    i10(r);
  };
};
var $o = Go();
var Fs = (i10 = Lo) => {
  let e = "\u2500".repeat(60);
  return (t) => {
    let n = t, o = "";
    switch (n.name) {
      case "ChatRequestChatPrompt":
        o = `
[ CHAT REQUEST Step ${n.step} ]
${e}
`, n.value.forEach((r, s) => {
          o += No(r), s < n.value.length - 1 && (o += `
${e}
`);
        }), o += `
${e}`;
        break;
      case "FunctionResults":
        o = `
[ FUNCTION RESULTS ]
${e}
`, n.value.forEach((r, s) => {
          o += `Function: ${r.functionId}
Result: ${r.result}`, s < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      case "ChatResponseResults":
        o = `
[ CHAT RESPONSE ]
`, n.value.forEach((r, s) => {
          o += r.content || "[No content]", s < n.value.length - 1 && (o += `
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
`, n.value.forEach((r, s) => {
          o += `Text ${s + 1}: ${r.substring(0, 100)}${r.length > 100 ? "..." : ""}`, s < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      case "EmbedResponse":
        o = `[ EMBED RESPONSE (${n.totalEmbeddings} embeddings) ]
${e}
`, n.value.forEach((r, s) => {
          o += `Embedding ${s + 1}: [${r.sample.join(", ")}${r.truncated ? ", ..." : ""}] (length: ${r.length})`, s < n.value.length - 1 && (o += `
${e}
`);
        });
        break;
      case "ChatResponseUsage": {
        o = `
[ CHAT RESPONSE USAGE ]
`;
        let r = n.value;
        o += `AI: ${r.ai}
`, o += `Model: ${r.model}
`, r.tokens && (o += `Total Tokens: ${r.tokens.totalTokens}
`, o += `Prompt Tokens: ${r.tokens.promptTokens}
`, o += `Completion Tokens: ${r.tokens.completionTokens}
`, r.tokens.thoughtsTokens !== void 0 && (o += `Thoughts Tokens: ${r.tokens.thoughtsTokens}
`), r.tokens.reasoningTokens !== void 0 && (o += `Reasoning Tokens: ${r.tokens.reasoningTokens}
`), r.tokens.cacheCreationTokens !== void 0 && (o += `Cache Creation Tokens: ${r.tokens.cacheCreationTokens}
`), r.tokens.cacheReadTokens !== void 0 && (o += `Cache Read Tokens: ${r.tokens.cacheReadTokens}
`), r.tokens.serviceTier !== void 0 && (o += `Service Tier: ${r.tokens.serviceTier}
`)), o += `${e}
`;
        break;
      }
      case "ChatResponseCitations": {
        o = `
[ CHAT RESPONSE CITATIONS ]
`, n.value.forEach((r) => {
          o += `- ${r.title || r.url}
`, r.description && (o += `  ${r.description}
`);
        }), o += `${e}
`;
        break;
      }
      default:
        o = JSON.stringify(n, null, 2);
    }
    i10(o);
  };
};
var v = { LLM_SYSTEM: "gen_ai.system", LLM_OPERATION_NAME: "gen_ai.operation.name", LLM_REQUEST_MODEL: "gen_ai.request.model", LLM_REQUEST_MAX_TOKENS: "gen_ai.request.max_tokens", LLM_REQUEST_TEMPERATURE: "gen_ai.request.temperature", LLM_REQUEST_TOP_K: "gen_ai.request.top_k", LLM_REQUEST_FREQUENCY_PENALTY: "gen_ai.request.frequency_penalty", LLM_REQUEST_PRESENCE_PENALTY: "gen_ai.request.presence_penalty", LLM_REQUEST_STOP_SEQUENCES: "gen_ai.request.stop_sequences", LLM_REQUEST_LLM_IS_STREAMING: "gen_ai.request.llm_is_streaming", LLM_REQUEST_TOP_P: "gen_ai.request.top_p", LLM_USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens", LLM_USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens", LLM_USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens", LLM_USAGE_THOUGHTS_TOKENS: "gen_ai.usage.thoughts_tokens", DB_SYSTEM: "db.system", DB_TABLE: "db.table", DB_NAMESPACE: "db.namespace", DB_ID: "db.id", DB_QUERY_TEXT: "db.query.text", DB_VECTOR: "db.vector", DB_OPERATION_NAME: "db.operation.name", DB_VECTOR_QUERY_TOP_K: "db.vector.query.top_k", DB_QUERY_EMBEDDINGS: "db.query.embeddings", DB_QUERY_RESULT: "db.query.result", DB_QUERY_EMBEDDINGS_VECTOR: "db.query.embeddings.vector", DB_QUERY_RESULT_ID: "db.query.result.id", DB_QUERY_RESULT_SCORE: "db.query.result.score", DB_QUERY_RESULT_DISTANCE: "db.query.result.distance", DB_QUERY_RESULT_METADATA: "db.query.result.metadata", DB_QUERY_RESULT_VECTOR: "db.query.result.vector", DB_QUERY_RESULT_DOCUMENT: "db.query.result.document" };
var te = { GEN_AI_USER_MESSAGE: "gen_ai.user.message", GEN_AI_SYSTEM_MESSAGE: "gen_ai.system.message", GEN_AI_ASSISTANT_MESSAGE: "gen_ai.assistant.message", GEN_AI_TOOL_MESSAGE: "gen_ai.tool.message", GEN_AI_CHOICE: "gen_ai.choice", GEN_AI_USAGE: "gen_ai.usage" };
var Uo = ((o) => (o.COMPLETION = "completion", o.CHAT = "chat", o.RERANK = "rerank", o.UNKNOWN = "unknown", o))(Uo || {});
var Bo = ((r) => (r.WORKFLOW = "workflow", r.TASK = "task", r.AGENT = "agent", r.TOOL = "tool", r.UNKNOWN = "unknown", r))(Bo || {});
var nn = class {
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
var dt = class extends TransformStream {
  constructor(e, t) {
    super(new nn(e, t));
  }
};
function mt(i10, e) {
  for (let t of e) {
    let n = i10.find((o) => o.id === t.id);
    n ? (typeof t.function.name == "string" && t.function.name.length > 0 && (n.function.name += t.function.name), typeof t.function.params == "string" && t.function.params.length > 0 && (n.function.params += t.function.params), typeof t.function.params == "object" && (n.function.params = t.function.params)) : i10.push(t);
  }
}
var qo = (i10, e, t, n) => {
  let o = n ? i10.filter((s) => s.role !== "system") : [...i10];
  t({ name: "ChatRequestChatPrompt", step: e, value: o });
};
var zo = (i10, e) => {
  if (!i10.results) return;
  let t = { name: "ChatResponseResults", value: i10.results };
  e(t);
};
var jo = (i10, e, t) => {
  t({ name: "ChatResponseStreamingResult", index: e, value: i10 });
};
function Ho(i10, e) {
  let t = /* @__PURE__ */ new Map();
  for (let n of i10) for (let o of n.results) {
    if (!o) continue;
    let r = t.get(o.index);
    r ? (o.content && (r.content = (r.content ?? "") + o.content), o.thought && (r.thought = (r.thought ?? "") + o.thought), o.finishReason && (r.finishReason = o.finishReason), o.functionCalls && (r.functionCalls ? mt(r.functionCalls, structuredClone(o.functionCalls)) : r.functionCalls = structuredClone(o.functionCalls))) : (r = structuredClone(o), t.set(o.index, r));
  }
  for (let n of t.values()) {
    let o = { name: "ChatResponseStreamingDoneResult", index: n.index, value: n };
    e(o);
  }
}
var Ko = (i10, e) => {
  e({ name: "FunctionResults", value: i10 });
};
var on = (i10, e, t, n) => {
  n({ name: "FunctionError", index: e, fixingInstructions: t, error: i10 });
};
var Wo = (i10, e, t, n) => {
  n({ name: "ValidationError", index: e, fixingInstructions: t, error: i10 });
};
var Vo = (i10, e, t, n) => {
  n({ name: "AssertionError", index: e, fixingInstructions: t, error: i10 });
};
var Jo = (i10, e, t) => {
  t({ name: "RefusalError", index: e, error: i10 });
};
var Qo = (i10, e, t) => {
  t({ name: "EmbedRequest", embedModel: e, value: i10 });
};
var Yo = (i10, e) => {
  let t = i10.slice(0, 3).map((o) => ({ length: o.length, sample: o.slice(0, 5), truncated: o.length > 5 })), n = { name: "EmbedResponse", totalEmbeddings: i10.length, value: t };
  e(n);
};
var Xo = (i10, e, t, n) => {
  n({ name: "ResultPickerUsed", sampleCount: i10, selectedIndex: e, latency: t });
};
var rn = (i10) => {
  let e = {};
  for (let [t, n] of Object.entries(i10)) if (n != null) {
    let o = String(n);
    e[t] = o.length > 100 ? o.substring(0, 100) : o;
  }
  return e;
};
var gt;
var Zo = (i10) => {
  if (gt) return gt;
  if (i10) return gt = _s(i10), gt;
};
var _s = (i10) => ({ latencyHistogram: i10.createHistogram("ax_llm_request_duration_ms", { description: "Duration of LLM requests in milliseconds", unit: "ms" }), errorCounter: i10.createCounter("ax_llm_errors_total", { description: "Total number of LLM request errors" }), requestCounter: i10.createCounter("ax_llm_requests_total", { description: "Total number of LLM requests" }), tokenCounter: i10.createCounter("ax_llm_tokens_total", { description: "Total number of LLM tokens consumed" }), inputTokenCounter: i10.createCounter("ax_llm_input_tokens_total", { description: "Total number of input/prompt tokens consumed" }), outputTokenCounter: i10.createCounter("ax_llm_output_tokens_total", { description: "Total number of output/completion tokens generated" }), errorRateGauge: i10.createGauge("ax_llm_error_rate", { description: "Current error rate as a percentage (0-100)" }), meanLatencyGauge: i10.createGauge("ax_llm_mean_latency_ms", { description: "Mean latency of LLM requests in milliseconds", unit: "ms" }), p95LatencyGauge: i10.createGauge("ax_llm_p95_latency_ms", { description: "95th percentile latency of LLM requests in milliseconds", unit: "ms" }), p99LatencyGauge: i10.createGauge("ax_llm_p99_latency_ms", { description: "99th percentile latency of LLM requests in milliseconds", unit: "ms" }), streamingRequestsCounter: i10.createCounter("ax_llm_streaming_requests_total", { description: "Total number of streaming LLM requests" }), functionCallsCounter: i10.createCounter("ax_llm_function_calls_total", { description: "Total number of function/tool calls made" }), functionCallLatencyHistogram: i10.createHistogram("ax_llm_function_call_latency_ms", { description: "Latency of function calls in milliseconds", unit: "ms" }), requestSizeHistogram: i10.createHistogram("ax_llm_request_size_bytes", { description: "Size of LLM request payloads in bytes", unit: "By" }), responseSizeHistogram: i10.createHistogram("ax_llm_response_size_bytes", { description: "Size of LLM response payloads in bytes", unit: "By" }), temperatureGauge: i10.createGauge("ax_llm_temperature_gauge", { description: "Temperature setting used for LLM requests" }), maxTokensGauge: i10.createGauge("ax_llm_max_tokens_gauge", { description: "Maximum tokens setting used for LLM requests" }), estimatedCostCounter: i10.createCounter("ax_llm_estimated_cost_total", { description: "Estimated cost of LLM requests in USD", unit: "$" }), promptLengthHistogram: i10.createHistogram("ax_llm_prompt_length_chars", { description: "Length of prompts in characters" }), contextWindowUsageGauge: i10.createGauge("ax_llm_context_window_usage_ratio", { description: "Context window utilization ratio (0-1)" }), timeoutsCounter: i10.createCounter("ax_llm_timeouts_total", { description: "Total number of timed out LLM requests" }), abortsCounter: i10.createCounter("ax_llm_aborts_total", { description: "Total number of aborted LLM requests" }), thinkingBudgetUsageCounter: i10.createCounter("ax_llm_thinking_budget_usage_total", { description: "Total thinking budget tokens used" }), multimodalRequestsCounter: i10.createCounter("ax_llm_multimodal_requests_total", { description: "Total number of multimodal requests (with images/audio)" }) });
var er = (i10, e, t, n, o) => {
  try {
    if (i10.latencyHistogram) {
      let r = rn({ operation: e, ai_service: n, ...o ? { model: o } : {} });
      i10.latencyHistogram.record(t, r);
    }
  } catch (r) {
    console.warn("Failed to record latency metric:", r);
  }
};
var tr = (i10, e, t, n, o, r, s) => {
  let a = { operation: e, ai_service: r, ...s ? { model: s } : {} };
  i10.meanLatencyGauge && i10.meanLatencyGauge.record(t, a), i10.p95LatencyGauge && i10.p95LatencyGauge.record(n, a), i10.p99LatencyGauge && i10.p99LatencyGauge.record(o, a);
};
var nr = (i10, e, t, n) => {
  try {
    if (i10.errorCounter) {
      let o = rn({ operation: e, ai_service: t, ...n ? { model: n } : {} });
      i10.errorCounter.add(1, o);
    }
  } catch (o) {
    console.warn("Failed to record error metric:", o);
  }
};
var or = (i10, e, t, n, o) => {
  i10.errorRateGauge && i10.errorRateGauge.record(t * 100, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var rr = (i10, e, t, n) => {
  i10.requestCounter && i10.requestCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var Re = (i10, e, t, n, o) => {
  try {
    let r = rn({ ai_service: n, ...o ? { model: o } : {} });
    i10.tokenCounter && i10.tokenCounter.add(t, { token_type: e, ...r }), e === "input" && i10.inputTokenCounter && i10.inputTokenCounter.add(t, r), e === "output" && i10.outputTokenCounter && i10.outputTokenCounter.add(t, r);
  } catch (r) {
    console.warn("Failed to record token metric:", r);
  }
};
var sr = (i10, e, t, n, o) => {
  t && i10.streamingRequestsCounter && i10.streamingRequestsCounter.add(1, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var ir = (i10, e, t, n, o) => {
  let r = { function_name: e, ...n ? { ai_service: n } : {}, ...o ? { model: o } : {} };
  i10.functionCallsCounter && i10.functionCallsCounter.add(1, r), t && i10.functionCallLatencyHistogram && i10.functionCallLatencyHistogram.record(t, r);
};
var sn = (i10, e, t, n, o) => {
  i10.requestSizeHistogram && i10.requestSizeHistogram.record(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var an = (i10, e, t, n, o) => {
  i10.responseSizeHistogram && i10.responseSizeHistogram.record(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var ar = (i10, e, t, n, o) => {
  let r = { ...n ? { ai_service: n } : {}, ...o ? { model: o } : {} };
  e !== void 0 && i10.temperatureGauge && i10.temperatureGauge.record(e, r), t !== void 0 && i10.maxTokensGauge && i10.maxTokensGauge.record(t, r);
};
var ln = (i10, e, t, n, o) => {
  i10.estimatedCostCounter && i10.estimatedCostCounter.add(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var lr = (i10, e, t, n) => {
  i10.promptLengthHistogram && i10.promptLengthHistogram.record(e, { ai_service: t, ...n ? { model: n } : {} });
};
var pr = (i10, e, t, n) => {
  i10.contextWindowUsageGauge && i10.contextWindowUsageGauge.record(e, { ai_service: t, ...n ? { model: n } : {} });
};
var ur = (i10, e, t, n) => {
  i10.timeoutsCounter && i10.timeoutsCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var cr = (i10, e, t, n) => {
  i10.abortsCounter && i10.abortsCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var dr = (i10, e, t, n) => {
  i10.thinkingBudgetUsageCounter && i10.thinkingBudgetUsageCounter.add(e, { ai_service: t, ...n ? { model: n } : {} });
};
var mr = (i10, e, t, n, o) => {
  (e || t) && i10.multimodalRequestsCounter && i10.multimodalRequestsCounter.add(1, { ai_service: n, has_images: e.toString(), has_audio: t.toString(), ...o ? { model: o } : {} });
};
function gr(i10) {
  try {
    return JSON.stringify(i10, null, 2);
  } catch {
    return String(i10);
  }
}
function J(i10, e = {}) {
  let t = [i10];
  throw e.fieldPath !== void 0 && t.push(`Field: ${e.fieldPath}`), e.value !== void 0 && t.push(`Value: ${gr(e.value)}`), e.note && t.push(`Note: ${e.note}`), e.item !== void 0 && t.push(`Chat item: ${gr(e.item)}`), new Error(t.join(`
`));
}
function Ce(i10) {
  let e = (n) => JSON.stringify(n, null, 2);
  if (!i10) throw new Error(`Chat request message item cannot be null or undefined, received: ${e(i10)}`);
  let t = typeof i10 == "object" && i10 !== null && "role" in i10 && typeof i10.role == "string" ? i10.role : void 0;
  if (!t) throw new Error(`Chat request message must have a role, received: ${e(t)}`);
  switch (t) {
    case "system": {
      let n = typeof i10 == "object" && i10 !== null && "content" in i10 && typeof i10.content == "string" ? i10.content : void 0;
      if (!n || n.trim() === "") throw new Error(`System message content cannot be empty or whitespace-only, received: ${e(n)}`);
      break;
    }
    case "user": {
      let n = typeof i10 == "object" && i10 !== null && "content" in i10 ? i10.content : void 0;
      if (n === void 0) throw new Error(`User message content cannot be undefined, received: ${e(n)}`);
      if (typeof n == "string") {
        if (n.trim() === "") throw new Error(`User message content cannot be empty or whitespace-only, received: ${e(n)}`);
      } else if (Array.isArray(n)) {
        if (n.length === 0) throw new Error(`User message content array cannot be empty, received: ${e(n)}`);
        for (let o = 0; o < n.length; o++) {
          let r = n[o];
          if (!r || typeof r != "object") throw new Error(`User message content item at index ${o} must be an object, received: ${e(r)}`);
          let s = typeof r == "object" && r !== null && "type" in r && typeof r.type == "string" ? r.type : void 0;
          if (!s) throw new Error(`User message content item at index ${o} must have a type, received: ${e(s)}`);
          switch (s) {
            case "text": {
              let a = "text" in r && typeof r.text == "string" ? r.text : void 0;
              if (!a || a.trim() === "") throw new Error(`User message text content at index ${o} cannot be empty or whitespace-only, received: ${e(a)}`);
              break;
            }
            case "image": {
              let a = "image" in r && typeof r.image == "string" ? r.image : void 0, l = "mimeType" in r && typeof r.mimeType == "string" ? r.mimeType : void 0;
              if (!a || a.trim() === "") throw new Error(`User message image content at index ${o} cannot be empty, received: ${e(a)}`);
              if (!l || l.trim() === "") throw new Error(`User message image content at index ${o} must have a mimeType, received: ${e(l)}`);
              break;
            }
            case "audio": {
              let a = "data" in r && typeof r.data == "string" ? r.data : void 0;
              if (!a || a.trim() === "") throw new Error(`User message audio content at index ${o} cannot be empty, received: ${e(a)}`);
              break;
            }
            case "file": {
              let a = "fileUri" in r && typeof r.fileUri == "string", l = "data" in r && typeof r.data == "string";
              if (!a && !l) throw new Error(`User message file content at index ${o} must have either 'data' or 'fileUri', received: ${e(r)}`);
              if (a && l) throw new Error(`User message file content at index ${o} cannot have both 'data' and 'fileUri', received: ${e(r)}`);
              if (a) {
                let u = r.fileUri;
                if (!u || u.trim() === "") throw new Error(`User message file content at index ${o} fileUri cannot be empty, received: ${e(u)}`);
              }
              if (l) {
                let u = r.data;
                if (!u || u.trim() === "") throw new Error(`User message file content at index ${o} data cannot be empty, received: ${e(u)}`);
              }
              let p = "mimeType" in r && typeof r.mimeType == "string" ? r.mimeType : null;
              if (!p || p.trim() === "") throw new Error(`User message file content at index ${o} must have a mimeType, received: ${e(p)}`);
              break;
            }
            case "url": {
              let a = "url" in r && typeof r.url == "string" ? r.url : void 0;
              if (!a || a.trim() === "") throw new Error(`User message url content at index ${o} cannot be empty, received: ${e(a)}`);
              break;
            }
            default:
              throw new Error(`User message content item at index ${o} has unsupported type: ${e(s)}`);
          }
        }
      } else throw new Error(`User message content must be a string or array of content objects, received: ${e(n)}`);
      break;
    }
    case "assistant": {
      let n = typeof i10 == "object" && i10 !== null && "content" in i10 ? i10.content : void 0, o = typeof i10 == "object" && i10 !== null && "functionCalls" in i10 ? i10.functionCalls : void 0, r = typeof n == "string" && n.trim() !== "", s = Array.isArray(o) && o.length > 0;
      if (!r && !s && J("Assistant message must include non-empty content or at least one function call", { fieldPath: "content | functionCalls", value: { content: n, functionCalls: o }, item: i10 }), n !== void 0 && typeof n != "string" && J("Assistant message content must be a string", { fieldPath: "content", value: n, item: i10 }), o !== void 0 && !Array.isArray(o) && J("Assistant message functionCalls must be an array when provided", { fieldPath: "functionCalls", value: o, item: i10 }), Array.isArray(o)) for (let a = 0; a < o.length; a++) {
        let l = o[a];
        if ((!l || typeof l != "object") && J("functionCalls entry must be an object", { fieldPath: `functionCalls[${a}]`, value: l, item: i10 }), (!("id" in l) || typeof l.id != "string" || l.id.trim() === "") && J("functionCalls entry must include a non-empty string id", { fieldPath: `functionCalls[${a}].id`, value: l.id, item: i10 }), (!("type" in l) || l.type !== "function") && J("functionCalls entry must have type 'function'", { fieldPath: `functionCalls[${a}].type`, value: l.type, item: i10 }), !("function" in l) || !l.function) J("functionCalls entry must include a function object", { fieldPath: `functionCalls[${a}].function`, value: l.function, item: i10 });
        else {
          let p = l.function;
          (!("name" in p) || typeof p.name != "string" || p.name.trim() === "") && J("functionCalls entry must include a non-empty function name", { fieldPath: `functionCalls[${a}].function.name`, value: p?.name, item: i10 }), p.params !== void 0 && typeof p.params != "string" && typeof p.params != "object" && J("functionCalls entry params must be a string or object when provided", { fieldPath: `functionCalls[${a}].function.params`, value: p.params, item: i10 });
        }
      }
      if (i10.name !== void 0) {
        let a = i10.name;
        (typeof a != "string" || a.trim() === "") && J("Assistant message name must be a non-empty string when provided", { fieldPath: "name", value: a, item: i10 });
      }
      break;
    }
    case "function": {
      let n = typeof i10 == "object" && i10 !== null && "functionId" in i10 && typeof i10.functionId == "string" ? i10.functionId : void 0, o = typeof i10 == "object" && i10 !== null && "result" in i10 ? i10.result : void 0;
      if (!n || n.trim() === "") throw new Error(`Function message must have a non-empty functionId, received: ${e(n)}`);
      if (o == null) throw new Error(`Function message must have a result, received: ${e(o)}`);
      if (typeof o != "string") throw new Error(`Function message result must be a string, received: ${e(o)}`);
      i10.isError !== void 0 && typeof i10.isError != "boolean" && J("Function message isError must be a boolean when provided", { fieldPath: "isError", value: i10.isError, item: i10 });
      break;
    }
    default:
      throw new Error(`Unsupported message role: ${e(t)}`);
  }
}
function pn(i10) {
  let e = (n) => JSON.stringify(n, null, 2), t = Array.isArray(i10) ? i10 : [i10];
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
        let s = o.annotations[r];
        if (!s || typeof s != "object") throw new Error(`Chat response result annotation at index ${n}[${r}] must be an object, received: ${e(s)}`);
        if (s.type !== "url_citation") throw new Error(`Chat response result annotation at index ${n}[${r}] must have type 'url_citation', received: ${e(s.type)}`);
        if (!s.url_citation || typeof s.url_citation != "object") throw new Error(`Chat response result annotation at index ${n}[${r}] must have a valid url_citation object, received: ${e(s.url_citation)}`);
        if (typeof s.url_citation.url != "string") throw new Error(`Chat response result annotation at index ${n}[${r}] url_citation.url must be a string, received: ${e(s.url_citation.url)}`);
      }
    }
    if (o.id !== void 0) {
      if (typeof o.id != "string") throw new Error(`Chat response result id at index ${n} must be a string, received: ${e(o.id)}`);
      if (o.id.trim() === "") throw new Error(`Chat response result id at index ${n} cannot be empty or whitespace-only, received: ${e(o.id)}`);
    }
    if (o.functionCalls !== void 0) {
      if (!Array.isArray(o.functionCalls)) throw new Error(`Chat response result functionCalls at index ${n} must be an array, received: ${e(o.functionCalls)}`);
      for (let r = 0; r < o.functionCalls.length; r++) {
        let s = o.functionCalls[r];
        if (!s) throw new Error(`Function call at index ${r} in result ${n} cannot be null or undefined, received: ${e(s)}`);
        if (!s.id || typeof s.id != "string" || s.id.trim() === "") throw new Error(`Function call at index ${r} in result ${n} must have a non-empty string id, received: ${e(s.id)}`);
        if (s.type !== "function") throw new Error(`Function call at index ${r} in result ${n} must have type 'function', received: ${e(s.type)}`);
        if (!s.function) throw new Error(`Function call at index ${r} in result ${n} must have a function object, received: ${e(s.function)}`);
        if (!s.function.name || typeof s.function.name != "string" || s.function.name.trim() === "") throw new Error(`Function call at index ${r} in result ${n} must have a non-empty function name, received: ${e(s.function.name)}`);
        if (s.function.params !== void 0 && typeof s.function.params != "string" && typeof s.function.params != "object") throw new Error(`Function call params at index ${r} in result ${n} must be a string or object, received: ${e(s.function.params)}`);
      }
    }
    if (o.finishReason !== void 0) {
      let r = ["stop", "length", "function_call", "content_filter", "error"];
      if (!r.includes(o.finishReason)) throw new Error(`Chat response result finishReason at index ${n} must be one of: ${r.join(", ")}, received: ${e(o.finishReason)}`);
    }
  }
}
var O = () => structuredClone({ temperature: 0 });
var N = () => structuredClone({ temperature: 0.4, frequencyPenalty: 0.2 });
var D = class {
  constructor(e, { name: t, apiURL: n, headers: o, modelInfo: r, defaults: s, options: a = {}, supportFor: l, models: p }) {
    this.aiImpl = e;
    this.name = t, this.apiURL = n || "", this.headers = o, this.supportFor = l, this.tracer = a.tracer ?? M.tracer, this.meter = a.meter ?? M.meter, this.modelInfo = r, this.models = p, this.id = B();
    let u = this.getModel(s.model) ?? s.model, d = this.getEmbedModel(s.embedModel) ?? s.embedModel;
    if (this.defaults = { model: u, embedModel: d }, !s.model || typeof s.model != "string" || s.model === "") throw new Error("No model defined");
    this.setOptions(a), p && Ls(p);
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
  logger = M.logger ?? $o;
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
    return Zo(this.meter);
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
    let n = [...e].sort((r, s) => r - s), o = Math.ceil(t / 100 * n.length) - 1;
    return n[o] ?? 0;
  }
  updateLatencyMetrics(e, t) {
    let n = this.metrics.latency[e];
    n.samples.push(t), n.samples.length > 1e3 && n.samples.shift(), n.mean = n.samples.reduce((r, s) => r + s, 0) / n.samples.length, n.p95 = this.calculatePercentile(n.samples, 95), n.p99 = this.calculatePercentile(n.samples, 99);
    let o = this.getMetricsInstruments();
    if (o) {
      let r = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      er(o, e, t, this.name, r), tr(o, e, n.mean, n.p95, n.p99, this.name, r);
    }
  }
  updateErrorMetrics(e, t) {
    let n = this.metrics.errors[e];
    n.total++, t && n.count++, n.rate = n.count / n.total;
    let o = this.getMetricsInstruments();
    if (o) {
      let r = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      rr(o, e, this.name, r), t && nr(o, e, this.name, r), or(o, e, n.rate, this.name, r);
    }
  }
  recordTokenUsage(e) {
    let t = this.getMetricsInstruments();
    if (t && e?.tokens) {
      let { promptTokens: n, completionTokens: o, totalTokens: r, thoughtsTokens: s } = e.tokens;
      n && Re(t, "input", n, this.name, e.model), o && Re(t, "output", o, this.name, e.model), r && Re(t, "total", r, this.name, e.model), s && Re(t, "thoughts", s, this.name, e.model);
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
    let { promptTokens: o = 0, completionTokens: r = 0 } = t.tokens, s = n.promptTokenCostPer1M || 0, a = n.completionTokenCostPer1M || 0;
    return o * s / 1e6 + r * a / 1e6;
  }
  estimateCostByName(e, t) {
    if (!t?.tokens) return 0;
    let n = this.modelInfo.find((l) => l.name === e);
    if (!n || !n.promptTokenCostPer1M && !n.completionTokenCostPer1M) return 0;
    let { promptTokens: o = 0, completionTokens: r = 0 } = t.tokens, s = n.promptTokenCostPer1M || 0, a = n.completionTokenCostPer1M || 0;
    return o * s / 1e6 + r * a / 1e6;
  }
  recordFunctionCallMetrics(e, t) {
    let n = this.getMetricsInstruments();
    if (!(!n || !e)) for (let o of e) o && typeof o == "object" && "function" in o && o.function && typeof o.function == "object" && "name" in o.function && ir(n, o.function.name, void 0, this.name, t);
  }
  recordTimeoutMetric(e) {
    let t = this.getMetricsInstruments();
    if (t) {
      let n = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      ur(t, e, this.name, n);
    }
  }
  recordAbortMetric(e) {
    let t = this.getMetricsInstruments();
    if (t) {
      let n = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      cr(t, e, this.name, n);
    }
  }
  recordChatMetrics(e, t, n) {
    let o = this.getMetricsInstruments();
    if (!o) return;
    let r = this.lastUsedChatModel, s = this.lastUsedModelConfig, a = s?.stream ?? false;
    sr(o, "chat", a, this.name, r);
    let { hasImages: l, hasAudio: p } = this.detectMultimodalContent(e);
    mr(o, l, p, this.name, r);
    let u = this.calculatePromptLength(e);
    lr(o, u, this.name, r), ar(o, s?.temperature, s?.maxTokens, this.name, r), t?.thinkingTokenBudget && this.modelUsage?.tokens?.thoughtsTokens && dr(o, this.modelUsage.tokens.thoughtsTokens, this.name, r);
    let d = this.calculateRequestSize(e);
    if (sn(o, "chat", d, this.name, r), n && !a) {
      let c = n, m = this.calculateResponseSize(c);
      if (an(o, "chat", m, this.name, r), c.results) for (let x of c.results) x.functionCalls && this.recordFunctionCallMetrics(x.functionCalls, this.lastUsedChatModel);
      let g = this.calculateContextWindowUsage(this.lastUsedChatModel, c.modelUsage);
      g > 0 && pr(o, g, this.name, r);
      let h = this.estimateCost(this.lastUsedChatModel, c.modelUsage);
      h > 0 && ln(o, "chat", h, this.name, r);
    }
  }
  recordEmbedMetrics(e, t) {
    let n = this.getMetricsInstruments();
    if (!n) return;
    let o = this.lastUsedEmbedModel, r = this.calculateRequestSize(e);
    sn(n, "embed", r, this.name, o);
    let s = this.calculateResponseSize(t);
    an(n, "embed", s, this.name, o);
    let a = this.estimateCostByName(o, t.modelUsage);
    a > 0 && ln(n, "embed", a, this.name, o);
  }
  getMetrics() {
    return structuredClone(this.metrics);
  }
  async chat(e, t) {
    let n = performance.now(), o = false, r, s = this.getModelByKey(e.model), a = { ...s ? { thinkingTokenBudget: s.thinkingTokenBudget, showThoughts: s.showThoughts, stream: s.stream, debug: s.debug, useExpensiveModel: s.useExpensiveModel } : void 0, ...t };
    try {
      return r = await this._chat1(e, a), r;
    } catch (l) {
      throw o = true, l instanceof Error && (l.message.includes("timeout") || l.name === "TimeoutError" ? this.recordTimeoutMetric("chat") : (l.message.includes("abort") || l.name === "AbortError") && this.recordAbortMetric("chat")), l;
    } finally {
      let l = performance.now() - n;
      this.updateLatencyMetrics("chat", l), this.updateErrorMetrics("chat", o), o || this.recordChatMetrics(e, a, r);
    }
  }
  async _chat1(e, t) {
    let n = this.getModel(e.model) ?? e.model ?? this.defaults.model;
    if (Array.isArray(e.chatPrompt)) for (let p of e.chatPrompt) Ce(p);
    let o = this.getModelByKey(e.model), r = { ...this.aiImpl.getModelConfig(), ...o ? o.modelConfig : void 0, ...e.modelConfig }, s = this.modelInfo.find((p) => p.name === n);
    if (s?.notSupported?.temperature && "temperature" in r && delete r.temperature, s?.notSupported?.topP && "topP" in r && delete r.topP, t?.thinkingTokenBudget && !this.getFeatures(n).hasThinkingBudget) throw new Error(`Model ${n} does not support thinkingTokenBudget.`);
    if (t?.showThoughts && !this.getFeatures(n).hasShowThoughts) throw new Error(`Model ${n} does not support showThoughts.`);
    if (this.modelInfo.find((p) => p.name === n)?.isExpensive && t?.useExpensiveModel !== "yes") throw new Error(`Model ${n} is marked as expensive and requires explicit confirmation. Set useExpensiveModel: "yes" to proceed.`);
    return r.stream = (t?.stream !== void 0 ? t.stream : r.stream) ?? true, this.getFeatures(n).streaming || (r.stream = false), this.tracer ? await this.tracer.startActiveSpan("AI Chat Request", { kind: SpanKind.SERVER, attributes: { [v.LLM_SYSTEM]: this.name, [v.LLM_OPERATION_NAME]: "chat", [v.LLM_REQUEST_MODEL]: n, [v.LLM_REQUEST_MAX_TOKENS]: r.maxTokens ?? "Not set", [v.LLM_REQUEST_TEMPERATURE]: r.temperature, [v.LLM_REQUEST_TOP_P]: r.topP ?? "Not set", [v.LLM_REQUEST_TOP_K]: r.topK ?? "Not set", [v.LLM_REQUEST_FREQUENCY_PENALTY]: r.frequencyPenalty ?? "Not set", [v.LLM_REQUEST_PRESENCE_PENALTY]: r.presencePenalty ?? "Not set", [v.LLM_REQUEST_STOP_SEQUENCES]: r.stopSequences?.join(", ") ?? "Not set", [v.LLM_REQUEST_LLM_IS_STREAMING]: r.stream ?? "Not set" } }, t?.traceContext ?? context.active(), async (p) => await this._chat2(n, r, e, t, p)) : await this._chat2(n, r, e, t);
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
    if (!this.aiImpl.createChatReq) throw new Error("createChatReq not implemented");
    let s = o?.debug ?? this.debug, a;
    n.functions && n.functions.length > 0 && (a = n.functions.map((m) => this.cleanupFunctionSchema(m)));
    let l = { ...n, model: e, functions: a, modelConfig: t };
    this.lastUsedChatModel = e, this.lastUsedModelConfig = t;
    let p = async () => {
      let [m, g] = await this.aiImpl.createChatReq(l, o);
      return r?.isRecording() && Ds(n, r, this.excludeContentFromTrace), await q({ name: m.name, url: this.apiURL, localCall: m.localCall, headers: await this.buildHeaders(m.headers), stream: t.stream, timeout: this.timeout, debug: s, fetch: this.fetch, span: r, abortSignal: o?.abortSignal ?? this.abortSignal, corsProxy: this.corsProxy }, g);
    };
    s && qo(l.chatPrompt, o?.stepIndex ?? 0, o?.logger ?? this.logger, o?.debugHideSystemPrompt);
    let u = o?.rateLimiter ?? this.rt, d = u ? await u(p, { modelUsage: this.modelUsage }) : await p();
    if (t.stream) {
      if (!this.aiImpl.createChatStreamResp) throw new Error("createChatStreamResp not implemented");
      let m = this.aiImpl.createChatStreamResp.bind(this), g = (A) => (I) => {
        let b = m(I, A);
        if (b.sessionId = o?.sessionId, !b.modelUsage) {
          let y = this.aiImpl.getTokenUsage();
          y && (b.modelUsage = { ai: this.name, model: e, tokens: y });
        }
        if (this.modelUsage = b.modelUsage, this.recordTokenUsage(b.modelUsage), r?.isRecording() && Ar(b, r, this.excludeContentFromTrace), s) for (let y of b.results) jo(y, y.index, o?.logger ?? this.logger);
        return b;
      }, h = async (A) => {
        r?.isRecording() && r.end(), s && Ho(A, o?.logger ?? this.logger);
      };
      if (typeof window < "u") {
        let A = d, I = {}, b = [], y = o?.abortSignal ?? this.abortSignal;
        return new ReadableStream({ start: (R) => {
          let T = A.getReader(), w = () => {
            try {
              T.cancel().catch(() => {
              });
            } catch {
            }
            try {
              this.recordAbortMetric("chat");
            } catch {
            }
            try {
              r?.isRecording() && r.end();
            } catch {
            }
            try {
              R.error(new DOMException("Aborted", "AbortError"));
            } catch {
              R.error(new Error("Aborted"));
            }
          };
          if (y) {
            if (y.aborted) {
              w();
              return;
            }
            y.addEventListener("abort", w, { once: true });
          }
          async function P() {
            try {
              for (; ; ) {
                let { done: k, value: F } = await T.read();
                if (k) {
                  h && await h(b), R.close();
                  break;
                }
                let K = g(I)(F);
                K && (b.push(K), R.enqueue(K));
              }
            } catch (k) {
              if (R.error(k), r?.isRecording()) try {
                r.end();
              } catch {
              }
            } finally {
              if (T.releaseLock(), y) try {
                y.removeEventListener("abort", w);
              } catch {
              }
            }
          }
          P();
        } });
      }
      return d.pipeThrough(new dt(g({}), h));
    }
    if (!this.aiImpl.createChatResp) throw new Error("createChatResp not implemented");
    let c = this.aiImpl.createChatResp(d);
    if (c.sessionId = o?.sessionId, !c.modelUsage) {
      let m = this.aiImpl.getTokenUsage();
      m && (c.modelUsage = { ai: this.name, model: e, tokens: m });
    }
    return c.modelUsage && (this.modelUsage = c.modelUsage, this.recordTokenUsage(c.modelUsage)), r?.isRecording() && (Ar(c, r, this.excludeContentFromTrace), r.end()), s && zo(c, o?.logger ?? this.logger), c;
  }
  async embed(e, t) {
    let n = performance.now(), o = false, r, s = this.getModelByKey(e.embedModel), a = { ...s ? { thinkingTokenBudget: s.thinkingTokenBudget, showThoughts: s.showThoughts, stream: s.stream, debug: s.debug, useExpensiveModel: s.useExpensiveModel } : void 0, ...t };
    try {
      return r = await this._embed1(e, a), r;
    } catch (l) {
      throw o = true, l instanceof Error && (l.message.includes("timeout") || l.name === "TimeoutError" ? this.recordTimeoutMetric("embed") : (l.message.includes("abort") || l.name === "AbortError") && this.recordAbortMetric("embed")), l;
    } finally {
      let l = performance.now() - n;
      this.updateLatencyMetrics("embed", l), this.updateErrorMetrics("embed", o), !o && r && this.recordEmbedMetrics(e, r);
    }
  }
  async _embed1(e, t) {
    let n = this.getEmbedModel(e.embedModel) ?? e.embedModel ?? this.defaults.embedModel;
    if (!n) throw new Error("No embed model defined");
    return this.tracer ? await this.tracer.startActiveSpan("AI Embed Request", { kind: SpanKind.SERVER, attributes: { [v.LLM_SYSTEM]: this.name, [v.LLM_OPERATION_NAME]: "embeddings", [v.LLM_REQUEST_MODEL]: n } }, t?.traceContext ?? context.active(), async (o) => await this._embed2(n, e, t, o)) : await this._embed2(n, e, t);
  }
  async _embed2(e, t, n, o) {
    if (!this.aiImpl.createEmbedReq) throw new Error("createEmbedReq not implemented");
    if (!this.aiImpl.createEmbedResp) throw new Error("createEmbedResp not implemented");
    let r = this.aiImpl.createEmbedReq, s = n?.debug ?? this.debug, a = { ...t, embedModel: e };
    this.lastUsedEmbedModel = e, s && Qo(a.texts ?? [], e, n?.logger ?? this.logger);
    let l = async () => {
      let [c, m] = await r(a);
      return await q({ name: c.name, url: this.apiURL, localCall: c.localCall, headers: await this.buildHeaders(c.headers), debug: s, fetch: this.fetch, timeout: this.timeout, span: o, abortSignal: n?.abortSignal ?? this.abortSignal, corsProxy: this.corsProxy }, m);
    }, p = n?.rateLimiter ?? this.rt, u = p ? await p(l, { modelUsage: this.embedModelUsage }) : await l(), d = this.aiImpl.createEmbedResp?.(u);
    if (d.sessionId = n?.sessionId, !d.modelUsage) {
      let c = this.aiImpl.getTokenUsage();
      c && (d.modelUsage = { ai: this.name, model: e, tokens: c });
    }
    return this.embedModelUsage = d.modelUsage, this.recordTokenUsage(d.modelUsage), o?.isRecording() && d.modelUsage?.tokens && o.addEvent(te.GEN_AI_USAGE, { [v.LLM_USAGE_INPUT_TOKENS]: d.modelUsage.tokens.promptTokens, [v.LLM_USAGE_OUTPUT_TOKENS]: d.modelUsage.tokens.completionTokens ?? 0, [v.LLM_USAGE_TOTAL_TOKENS]: d.modelUsage.tokens.totalTokens }), s && Yo(d.embeddings, n?.logger ?? this.logger), o?.end(), d;
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
function Ds(i10, e, t) {
  let n = [];
  if (i10.chatPrompt && Array.isArray(i10.chatPrompt) && i10.chatPrompt.length > 0) for (let r of i10.chatPrompt) switch (r.role) {
    case "system":
      if (r.content) {
        let s = {};
        t || (s.content = r.content), e.addEvent(te.GEN_AI_SYSTEM_MESSAGE, s);
      }
      break;
    case "user":
      if (typeof r.content == "string") n.push(r.content);
      else if (Array.isArray(r.content)) for (let s of r.content) s.type === "text" && n.push(s.text);
      break;
    case "assistant": {
      let s = r.functionCalls?.map((a) => ({ id: a.id, type: a.type, function: a.function.name, arguments: a.function.params }));
      if (s && s.length > 0) {
        let a = { function_calls: JSON.stringify(s, null, 2) };
        !t && r.content && (a.content = r.content), e.addEvent(te.GEN_AI_ASSISTANT_MESSAGE, a);
      } else if (r.content) {
        let a = {};
        t || (a.content = r.content), e.addEvent(te.GEN_AI_ASSISTANT_MESSAGE, a);
      }
      break;
    }
    case "function": {
      let s = { id: r.functionId };
      t || (s.content = r.result), e.addEvent(te.GEN_AI_TOOL_MESSAGE, s);
      break;
    }
  }
  let o = {};
  t || (o.content = n.join(`
`)), e.addEvent(te.GEN_AI_USER_MESSAGE, o);
}
function Ar(i10, e, t) {
  if (i10.modelUsage?.tokens) {
    let n = i10.modelUsage.tokens.thoughtsTokens ? { [v.LLM_USAGE_THOUGHTS_TOKENS]: i10.modelUsage.tokens.thoughtsTokens } : {};
    e.addEvent(te.GEN_AI_USAGE, { [v.LLM_USAGE_INPUT_TOKENS]: i10.modelUsage.tokens.promptTokens, [v.LLM_USAGE_OUTPUT_TOKENS]: i10.modelUsage.tokens.completionTokens ?? 0, [v.LLM_USAGE_TOTAL_TOKENS]: i10.modelUsage.tokens.totalTokens, ...n });
  }
  if (i10.results) for (let n = 0; n < i10.results.length; n++) {
    let o = i10.results[n];
    if (!o || !o.content && !o.thought && !o.functionCalls?.length && !o.finishReason) continue;
    let r = o.functionCalls?.map((a) => ({ id: a.id, type: a.type, function: a.function.name, arguments: a.function.params })), s = {};
    r && r.length > 0 ? (t || (s.content = o.content), s.tool_calls = r) : t || (s.content = o.content ?? ""), e.addEvent(te.GEN_AI_CHOICE, { finish_reason: o.finishReason, index: n, message: JSON.stringify(s, null, 2) });
  }
}
function xr(i10) {
  let e = 0;
  for (let t of i10) {
    if (!t || typeof t != "object") throw new Error(`AxMessage array validation failed: Item at index ${e} is not a valid message object`);
    if (t.role !== "user" && t.role !== "assistant") throw new Error(`AxMessage array validation failed: Item at index ${e} has invalid role: ${t.role}`);
    e++;
  }
}
function Ls(i10) {
  let e = /* @__PURE__ */ new Set();
  for (let t of i10) {
    if (e.has(t.key)) throw new Error(`Duplicate model key detected: "${t.key}". Each model key must be unique.`);
    e.add(t.key);
  }
}
var ht = ((d) => (d.Claude41Opus = "claude-opus-4-1-20250805", d.Claude4Opus = "claude-opus-4-20250514", d.Claude4Sonnet = "claude-sonnet-4-20250514", d.Claude37Sonnet = "claude-3-7-sonnet-latest", d.Claude35Sonnet = "claude-3-5-sonnet-latest", d.Claude35Haiku = "claude-3-5-haiku-latest", d.Claude3Opus = "claude-3-opus-latest", d.Claude3Sonnet = "claude-3-sonnet-20240229", d.Claude3Haiku = "claude-3-haiku-20240307", d.Claude21 = "claude-2.1", d.ClaudeInstant12 = "claude-instant-1.2", d))(ht || {});
var un = ((s) => (s.Claude37Sonnet = "claude-3-7-sonnet", s.Claude35Haiku = "claude-3-5-haiku", s.Claude35Sonnet = "claude-3-5-sonnet", s.Claude35SonnetV2 = "claude-3-5-sonnet-v2", s.Claude3Haiku = "claude-3-haiku", s.Claude3Opus = "claude-3-opus", s))(un || {});
var ft = [{ name: "claude-opus-4-1-20250805", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 32e3, supported: { thinkingBudget: true, showThoughts: true } }, { name: "claude-opus-4-20250514", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 32e3, supported: { thinkingBudget: true, showThoughts: true } }, { name: "claude-sonnet-4-20250514", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 64e3, supported: { thinkingBudget: true, showThoughts: true } }, { name: "claude-3-7-sonnet-latest", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 64e3, supported: { thinkingBudget: true, showThoughts: true } }, { name: "claude-3-5-sonnet-latest", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 8192 }, { name: "claude-3-5-haiku-latest", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 4, maxTokens: 8192 }, { name: "claude-3-opus-latest", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 4096 }, { name: "claude-3-sonnet-20240229", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 4096 }, { name: "claude-3-haiku-20240307", currency: "usd", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 1.25, maxTokens: 4096 }, { name: "claude-2.1", currency: "usd", promptTokenCostPer1M: 8, completionTokenCostPer1M: 25, maxTokens: 4096 }, { name: "claude-instant-1.2", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 2.24, maxTokens: 4096 }];
var At = (i10) => {
  if (!i10 || typeof i10 != "object") return i10;
  let e = { ...i10 };
  return delete e.additionalProperties, delete e.default, delete e.optional, delete e.oneOf, delete e.anyOf, delete e.allOf, e.properties && typeof e.properties == "object" && (e.properties = Object.fromEntries(Object.entries(e.properties).map(([t, n]) => [t, At(n)]))), e.items && (e.items = At(e.items)), e;
};
var Ir = () => structuredClone({ model: "claude-3-7-sonnet-latest", maxTokens: 4e4, thinkingTokenBudgetLevels: { minimal: 1024, low: 5e3, medium: 1e4, high: 2e4, highest: 32e3 }, ...O() });
var Ns = () => structuredClone({ model: "claude-3-7-sonnet", maxTokens: 4e4, thinkingTokenBudgetLevels: { minimal: 1024, low: 5e3, medium: 1e4, high: 2e4, highest: 32e3 }, ...O() });
var cn = class {
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
    let s;
    if (e.functionCall && e.functions && e.functions.length > 0) if (typeof e.functionCall == "string") switch (e.functionCall) {
      case "auto":
        s = { tool_choice: { type: "auto" } };
        break;
      case "required":
        s = { tool_choice: { type: "any" } };
        break;
      case "none":
        throw new Error("functionCall none not supported");
    }
    else if ("function" in e.functionCall) s = { tool_choice: { type: "tool", name: e.functionCall.function.name } };
    else throw new Error("Invalid function call type, must be string or object");
    let a = e.chatPrompt.filter((R) => R.role === "system").map((R) => ({ type: "text", text: R.content, ...R.cache ? { cache: { type: "ephemeral" } } : {} })), l = e.chatPrompt.filter((R) => R.role !== "system"), p = Gs(l), u = e.functions?.map((R) => ({ name: R.name, description: R.description, input_schema: R.parameters ? At(R.parameters) : void 0 })), c = (this.config.tools ?? []).map((R) => R && typeof R == "object" && "type" in R ? R : { name: R.name, description: R.description, input_schema: R.input_schema ? At(R.input_schema) : void 0, ...R.cache_control ? { cache_control: R.cache_control } : {} }), m = [...u ?? [], ...c];
    this.isVertex && m.length > 0 && (m = m.filter((R) => !(R && typeof R == "object" && "type" in R))), m.length === 0 && (m = void 0);
    let g = e.modelConfig?.maxTokens ?? this.config.maxTokens, h = e.modelConfig?.stopSequences ?? this.config.stopSequences, x = e.modelConfig?.temperature, f = e.modelConfig?.topP, A = e.modelConfig?.topK ?? this.config.topK, I = e.modelConfig?.n ?? this.config.n;
    if (I && I > 1) throw new Error("Anthropic does not support sampling (n > 1)");
    let b;
    if (this.config.thinking?.budget_tokens && (b = this.config.thinking), t?.thinkingTokenBudget) {
      let R = this.config.thinkingTokenBudgetLevels;
      switch (t.thinkingTokenBudget) {
        case "none":
          b = void 0;
          break;
        case "minimal":
          b = { type: "enabled", budget_tokens: R?.minimal ?? 1024 };
          break;
        case "low":
          b = { type: "enabled", budget_tokens: R?.low ?? 5e3 };
          break;
        case "medium":
          b = { type: "enabled", budget_tokens: R?.medium ?? 1e4 };
          break;
        case "high":
          b = { type: "enabled", budget_tokens: R?.high ?? 2e4 };
          break;
        case "highest":
          b = { type: "enabled", budget_tokens: R?.highest ?? 32e3 };
          break;
      }
    }
    let y = { ...this.isVertex ? { anthropic_version: "vertex-2023-10-16" } : { model: n }, ...g ? { max_tokens: g } : {}, ...h && h.length > 0 ? { stop_sequences: h } : {}, ...x !== void 0 && !b ? { temperature: x } : {}, ...f !== void 0 && (!b || f >= 0.95) ? { top_p: f } : {}, ...A && !b ? { top_k: A } : {}, ...s, ...m ? { tools: m } : {}, ...o ? { stream: true } : {}, ...a ? { system: a } : {}, ...b ? { thinking: b } : {}, messages: p };
    return [r, y];
  };
  createChatResp = (e) => {
    if (e.type === "error") throw new E(e.error.message, void 0, void 0);
    let t = yr(e.stop_reason), n = this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false, o = "", r = "", s = [], a = [];
    for (let u of e.content) switch (u.type) {
      case "text":
        if (o += u.text ?? "", Array.isArray(u.citations)) for (let d of u.citations) d?.url && a.push({ url: String(d.url), title: typeof d.title == "string" ? d.title : void 0, snippet: typeof d.cited_text == "string" ? d.cited_text : void 0 });
        break;
      case "thinking":
      case "redacted_thinking":
        n && (r += u.thinking ?? "");
        break;
      case "tool_use":
        s.push({ id: u.id, type: "function", function: { name: u.name, params: u.input } });
        break;
    }
    let l = { index: 0, id: e.id, finishReason: t };
    o && (l.content = o), r && (l.thought = r), s.length > 0 && (l.functionCalls = s), a.length > 0 && (l.citations = a);
    let p = [l];
    return this.tokensUsed = { promptTokens: e.usage.input_tokens, completionTokens: e.usage.output_tokens, totalTokens: e.usage.input_tokens + e.usage.output_tokens }, { results: p, remoteId: e.id };
  };
  createChatStreamResp = (e, t) => {
    if (!("type" in e)) throw new Error("Invalid Anthropic streaming event");
    let n = t;
    if (n.indexIdMap || (n.indexIdMap = {}), e.type === "error") {
      let { error: r } = e;
      throw new E(r.message, void 0, void 0);
    }
    let o = 0;
    if (e.type === "message_start") {
      let { message: r } = e, s = [{ index: o, content: "", id: r.id }];
      return this.tokensUsed = { promptTokens: r.usage?.input_tokens ?? 0, completionTokens: r.usage?.output_tokens ?? 0, totalTokens: (r.usage?.input_tokens ?? 0) + (r.usage?.output_tokens ?? 0) }, { results: s };
    }
    if (e.type === "content_block_start") {
      let { content_block: r } = e;
      if (r.type === "text") {
        let s = [];
        if (Array.isArray(r.citations)) for (let a of r.citations) a?.url && s.push({ url: String(a.url), title: typeof a.title == "string" ? a.title : void 0, snippet: typeof a.cited_text == "string" ? a.cited_text : void 0 });
        return { results: [{ index: o, content: r.text, ...s.length ? { citations: s } : {} }] };
      }
      if (r.type === "thinking") return this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false ? { results: [{ index: o, thought: r.thinking }] } : { results: [{ index: o, content: "" }] };
      if (r.type === "tool_use" && typeof r.id == "string" && typeof e.index == "number" && !n.indexIdMap[e.index]) {
        n.indexIdMap[e.index] = r.id;
        let s = [{ id: r.id, type: "function", function: { name: r.name, params: "" } }];
        return { results: [{ index: o, functionCalls: s }] };
      }
      if (r.type === "web_search_tool_result" || r.type === "server_tool_use") return { results: [{ index: o, content: "" }] };
    }
    if (e.type === "content_block_delta") {
      let { delta: r } = e;
      if (r.type === "citations_delta") {
        let s = r.citation;
        if (s && typeof s.url == "string" && s.url.length > 0) {
          let a = [{ url: String(s.url), title: typeof s.title == "string" ? s.title : void 0, snippet: typeof s.cited_text == "string" ? s.cited_text : void 0 }];
          return { results: [{ index: o, content: "", citations: a }] };
        }
        return { results: [{ index: o, content: "" }] };
      }
      if (r.type === "text_delta") {
        let s = [];
        if (Array.isArray(r.citations)) for (let a of r.citations) a?.url && s.push({ url: String(a.url), title: typeof a.title == "string" ? a.title : void 0, snippet: typeof a.cited_text == "string" ? a.cited_text : void 0 });
        return { results: [{ index: o, content: r.text, ...s.length ? { citations: s } : {} }] };
      }
      if (r.type === "thinking_delta") return this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false ? { results: [{ index: o, thought: r.thinking }] } : { results: [{ index: o, content: "" }] };
      if (r.type === "signature_delta") return { results: [{ index: o, content: "" }] };
      if (r.type === "input_json_delta") {
        let s = n.indexIdMap[e.index];
        if (!s) return { results: [{ index: o, content: "" }] };
        let a = [{ id: s, type: "function", function: { name: "", params: r.partial_json } }];
        return { results: [{ index: o, functionCalls: a }] };
      }
    }
    if (e.type === "message_delta") {
      let { delta: r, usage: s } = e;
      return this.tokensUsed = { promptTokens: 0, completionTokens: s.output_tokens, totalTokens: s.output_tokens }, { results: [{ index: o, content: "", finishReason: yr(r.stop_reason) }] };
    }
    return { results: [{ index: o, content: "" }] };
  };
};
var we = class i extends D {
  static create(e) {
    return new i(e);
  }
  constructor({ apiKey: e, projectId: t, region: n, config: o, options: r, models: s }) {
    let a = t !== void 0 && n !== void 0, l, p;
    if (a) {
      if (!e) throw new Error("Anthropic Vertex API key not set");
      if (typeof e != "function") throw new Error("Anthropic Vertex API key must be a function for token-based authentication");
      l = `https://${n}-aiplatform.googleapis.com/v1/projects/${t}/locations/${n}/publishers/anthropic/`, p = async () => ({ Authorization: `Bearer ${await e()}` });
    } else {
      if (!e) throw new Error("Anthropic API key not set");
      l = "https://api.anthropic.com/v1", p = async () => ({ "anthropic-version": "2023-06-01", "anthropic-beta": "prompt-caching-2024-07-31", "x-api-key": typeof e == "function" ? await e() : e });
    }
    let u = { ...Ir(), ...o }, d = new cn(u, a), c = (m) => {
      let g = W({ model: m, modelInfo: ft, models: s });
      return { functions: true, streaming: true, hasThinkingBudget: g?.supported?.thinkingBudget ?? false, hasShowThoughts: g?.supported?.showThoughts ?? false, functionCot: true, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 5 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: false, formats: [], maxDuration: 0 }, files: { supported: false, formats: [], maxSize: 0, uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: true, types: ["ephemeral"] }, thinking: g?.supported?.thinkingBudget ?? false, multiTurn: true };
    };
    super(d, { name: "Anthropic", apiURL: l, headers: p, modelInfo: ft, defaults: { model: u.model }, options: r, supportFor: c, models: s });
  }
};
function Gs(i10) {
  let e = i10.map((t) => {
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
  return $s(e);
}
function $s(i10) {
  let e = [];
  for (let [t, n] of i10.entries()) {
    if (n.role !== "assistant") {
      e.push(n);
      continue;
    }
    if (t > 0 && i10.at(t - 1)?.role === "assistant") {
      let o = e.pop();
      e.push({ ...o || {}, ...n });
    } else e.push(n);
  }
  return e;
}
function yr(i10) {
  if (i10) switch (i10) {
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
var xt = ((y) => (y.GPT4 = "gpt-4", y.GPT41 = "gpt-4.1", y.GPT41Mini = "gpt-4.1-mini", y.GPT4O = "gpt-4o", y.GPT4OMini = "gpt-4o-mini", y.GPT4ChatGPT4O = "chatgpt-4o-latest", y.GPT4Turbo = "gpt-4-turbo", y.GPT35Turbo = "gpt-3.5-turbo", y.GPT35TurboInstruct = "gpt-3.5-turbo-instruct", y.GPT35TextDavinci002 = "text-davinci-002", y.GPT3TextBabbage002 = "text-babbage-002", y.GPT3TextAda001 = "text-ada-001", y.GPT5 = "gpt-5", y.GPT5Nano = "gpt-5-nano", y.GPT5Mini = "gpt-5-mini", y.GPT5Chat = "gpt-5-chat", y.O1 = "o1", y.O1Mini = "o1-mini", y.O3 = "o3", y.O3Mini = "o3-mini", y.O4Mini = "o4-mini", y))(xt || {});
var Se = ((n) => (n.TextEmbeddingAda002 = "text-embedding-ada-002", n.TextEmbedding3Small = "text-embedding-3-small", n.TextEmbedding3Large = "text-embedding-3-large", n))(Se || {});
var ve = ((T) => (T.GPT4 = "gpt-4", T.GPT41 = "gpt-4.1", T.GPT41Mini = "gpt-4.1-mini", T.GPT4O = "gpt-4o", T.GPT4OMini = "gpt-4o-mini", T.GPT4ChatGPT4O = "chatgpt-4o-latest", T.GPT4Turbo = "gpt-4-turbo", T.GPT35Turbo = "gpt-3.5-turbo", T.GPT35TurboInstruct = "gpt-3.5-turbo-instruct", T.GPT35TextDavinci002 = "text-davinci-002", T.GPT3TextBabbage002 = "text-babbage-002", T.GPT3TextAda001 = "text-ada-001", T.GPT5 = "gpt-5", T.GPT5Nano = "gpt-5-nano", T.GPT5Mini = "gpt-5-mini", T.GPT5Chat = "gpt-5-chat", T.O1Pro = "o1-pro", T.O1 = "o1", T.O1Mini = "o1-mini", T.O3Pro = "o3-pro", T.O3 = "o3", T.O3Mini = "o3-mini", T.O4Mini = "o4-mini", T))(ve || {});
var Oe = [{ name: "gpt-4", currency: "usd", promptTokenCostPer1M: 30, completionTokenCostPer1M: 60 }, { name: "gpt-4.1", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 8 }, { name: "gpt-4.1-mini", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1.6 }, { name: "gpt-4o", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4o-mini", currency: "usd", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.6 }, { name: "chatgpt-4o-latest", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4-turbo", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30 }, { name: "gpt-3.5-turbo", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "gpt-5-nano", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5, notSupported: { temperature: true, topP: true } }, { name: "gpt-5-mini", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 6, notSupported: { temperature: true, topP: true } }, { name: "gpt-5", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30, notSupported: { temperature: true, topP: true } }, { name: "gpt-5-chat", currency: "usd", promptTokenCostPer1M: 12, completionTokenCostPer1M: 36, notSupported: { temperature: true, topP: true } }, { name: "gpt-5", currency: "usd", promptTokenCostPer1M: 20, completionTokenCostPer1M: 60, notSupported: { temperature: true, topP: true } }, { name: "o1", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60 }, { name: "o1-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 14.4 }, { name: "o3", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60 }, { name: "o3-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4 }, { name: "o4-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4 }, { name: "text-embedding-ada-002", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "text-embedding-3-small", currency: "usd", promptTokenCostPer1M: 0.02, completionTokenCostPer1M: 0.02 }, { name: "text-embedding-3-large", currency: "usd", promptTokenCostPer1M: 0.13, completionTokenCostPer1M: 0.13 }];
var dn = [{ name: "gpt-4", currency: "usd", promptTokenCostPer1M: 30, completionTokenCostPer1M: 60 }, { name: "gpt-4.1", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 8 }, { name: "gpt-4.1-mini", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1.6 }, { name: "gpt-4o", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4o-mini", currency: "usd", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.6 }, { name: "chatgpt-4o-latest", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4-turbo", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30 }, { name: "gpt-3.5-turbo", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "gpt-5-nano", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5, notSupported: { temperature: true, topP: true }, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gpt-5-mini", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 6, notSupported: { temperature: true, topP: true }, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gpt-5", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30, notSupported: { temperature: true, topP: true }, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gpt-5-chat", currency: "usd", promptTokenCostPer1M: 12, completionTokenCostPer1M: 36, notSupported: { temperature: true, topP: true }, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gpt-5", currency: "usd", promptTokenCostPer1M: 20, completionTokenCostPer1M: 60, notSupported: { temperature: true, topP: true }, supported: { thinkingBudget: true, showThoughts: true } }, { name: "o1-pro", currency: "usd", promptTokenCostPer1M: 150, completionTokenCostPer1M: 600, supported: { thinkingBudget: true, showThoughts: true }, isExpensive: true }, { name: "o1", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60, supported: { thinkingBudget: true, showThoughts: true } }, { name: "o3-pro", currency: "usd", promptTokenCostPer1M: 20, completionTokenCostPer1M: 80, supported: { thinkingBudget: true, showThoughts: true }, isExpensive: true }, { name: "o3", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60, supported: { thinkingBudget: true, showThoughts: true } }, { name: "o3-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4, supported: { thinkingBudget: true, showThoughts: true } }, { name: "o4-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4, supported: { thinkingBudget: true, showThoughts: true } }];
var Us = (i10) => {
  let e = ["o1", "o1-mini", "o3", "o3-mini", "o4-mini", "o1-pro", "o3-pro"];
  return e.includes(i10) || e.includes(i10);
};
var ge = () => structuredClone({ model: "gpt-5-mini", embedModel: "text-embedding-3-small", ...O() });
var gn = () => structuredClone({ ...ge(), model: "gpt-5" });
var hn = () => structuredClone({ model: "gpt-5-mini", embedModel: "text-embedding-3-small", ...N() });
var fn = () => ({ ...ge(), model: "gpt-5-nano" });
var mn = class {
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
    let o = { name: "/chat/completions" }, r = e.functions?.map((m) => ({ type: "function", function: { name: m.name, description: m.description, parameters: m.parameters } })), s = !e.functionCall && e.functions && e.functions.length > 0 ? "auto" : e.functionCall, a = Bs(e), l = e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, p = e.modelConfig?.stream ?? this.config.stream, u = this.config.store, d = Us(n), c = { model: n, messages: a, ...this.config?.responseFormat ? { response_format: { type: this.config.responseFormat } } : {}, ...r ? { tools: r } : {}, ...s ? { tool_choice: s } : {}, ...d ? {} : { ...(e.modelConfig?.maxTokens ?? this.config.maxTokens) !== void 0 ? { max_completion_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens } : {}, ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, ...e.modelConfig?.topP !== void 0 ? { top_p: e.modelConfig.topP } : {}, ...(e.modelConfig?.n ?? this.config.n) !== void 0 ? { n: e.modelConfig?.n ?? this.config.n } : {}, ...(e.modelConfig?.presencePenalty ?? this.config.presencePenalty) !== void 0 ? { presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty } : {}, ...l !== void 0 ? { frequency_penalty: l } : {} }, ...(e.modelConfig?.stopSequences ?? this.config.stop) && (e.modelConfig?.stopSequences ?? this.config.stop).length > 0 ? { stop: e.modelConfig?.stopSequences ?? this.config.stop } : {}, ...this.config.logitBias !== void 0 ? { logit_bias: this.config.logitBias } : {}, ...p && this.streamingUsage ? { stream: true, stream_options: { include_usage: true } } : {}, ...u ? { store: u } : {}, ...this.config.serviceTier ? { service_tier: this.config.serviceTier } : {}, ...this.config.user ? { user: this.config.user } : {} };
    if (this.config.reasoningEffort && (c.reasoning_effort = this.config.reasoningEffort), this.config.webSearchOptions && (c.web_search_options = { ...this.config.webSearchOptions.searchContextSize && { search_context_size: this.config.webSearchOptions.searchContextSize }, ...this.config.webSearchOptions.userLocation && { user_location: { approximate: { type: "approximate", ...this.config.webSearchOptions.userLocation.approximate.city && { city: this.config.webSearchOptions.userLocation.approximate.city }, ...this.config.webSearchOptions.userLocation.approximate.country && { country: this.config.webSearchOptions.userLocation.approximate.country }, ...this.config.webSearchOptions.userLocation.approximate.region && { region: this.config.webSearchOptions.userLocation.approximate.region }, ...this.config.webSearchOptions.userLocation.approximate.timezone && { timezone: this.config.webSearchOptions.userLocation.approximate.timezone } } } } }), t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        c.reasoning_effort = void 0;
        break;
      case "minimal":
        c.reasoning_effort = "minimal";
        break;
      case "low":
        c.reasoning_effort = "medium";
        break;
      case "medium":
        c.reasoning_effort = "high";
        break;
      case "high":
        c.reasoning_effort = "high";
        break;
      case "highest":
        c.reasoning_effort = "high";
        break;
    }
    return this.chatReqUpdater && (c = this.chatReqUpdater(c)), [o, c];
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
      if (a.message.refusal) throw new E(a.message.refusal, e.model, e.id);
      let l = br(a.finish_reason), p = a.message.tool_calls?.map(({ id: u, function: { arguments: d, name: c } }) => ({ id: u, type: "function", function: { name: c, params: d } }));
      return { index: a.index, id: `${a.index}`, content: a.message.content ?? void 0, thought: a.message.reasoning_content, citations: a.message.annotations?.filter((u) => u?.type === "url_citation" && u.url_citation).map((u) => ({ url: u.url_citation?.url, title: u.url_citation?.title, description: u.url_citation?.description })), functionCalls: p, finishReason: l };
    }), remoteId: t };
  }
  createChatStreamResp(e, t) {
    let { id: n, usage: o, choices: r } = e;
    this.tokensUsed = o ? { promptTokens: o.prompt_tokens, completionTokens: o.completion_tokens, totalTokens: o.total_tokens } : void 0;
    let s = t;
    return s.indexIdMap || (s.indexIdMap = {}), { results: r.map(({ index: l, delta: { content: p, role: u, refusal: d, tool_calls: c, reasoning_content: m, annotations: g }, finish_reason: h }) => {
      if (d) throw new E(d, void 0, n);
      let x = br(h), f = c?.map(({ id: A, index: I, function: { name: b, arguments: y } }) => {
        typeof A == "string" && typeof I == "number" && !s.indexIdMap[I] && (s.indexIdMap[I] = A);
        let R = s.indexIdMap[I];
        return R ? { id: R, type: "function", function: { name: b, params: y } } : null;
      }).filter((A) => A !== null);
      return { index: l, content: p ?? void 0, role: u, thought: m, citations: g?.filter((A) => A?.type === "url_citation" && A.url_citation).map((A) => ({ url: A.url_citation?.url, title: A.url_citation?.title, description: A.url_citation?.description })), functionCalls: f, finishReason: x, id: n };
    }) };
  }
  createEmbedResp(e) {
    let { data: t, usage: n } = e;
    return this.tokensUsed = n ? { promptTokens: n.prompt_tokens, completionTokens: n.completion_tokens, totalTokens: n.total_tokens } : void 0, { embeddings: t.map((o) => o.embedding) };
  }
};
var br = (i10) => {
  switch (i10) {
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
function Bs(i10) {
  return i10.chatPrompt.map((t) => {
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
var _ = class extends D {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r, models: s, chatReqUpdater: a, supportFor: l }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    let p = new mn(t, n?.streamingUsage ?? true, a);
    super(p, { name: "OpenAI", apiURL: o || "https://api.openai.com/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: r, defaults: { model: t.model, embedModel: t.embedModel }, options: n, supportFor: l, models: s });
  }
};
var Me = class extends _ {
  constructor({ apiKey: e, apiURL: t, config: n, options: o, models: r, modelInfo: s }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    s = [...Oe, ...s ?? []];
    let a = (l) => {
      let p = W({ model: l, modelInfo: s, models: r });
      return { functions: true, streaming: true, hasThinkingBudget: p?.supported?.thinkingBudget ?? false, hasShowThoughts: p?.supported?.showThoughts ?? false, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 20 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: true, formats: ["wav", "mp3", "ogg"], maxDuration: 25 * 60 }, files: { supported: true, formats: ["text/plain", "application/pdf", "image/jpeg", "image/png"], maxSize: 512 * 1024 * 1024, uploadMethod: "upload" }, urls: { supported: false, webSearch: true, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: p?.supported?.thinkingBudget ?? false, multiTurn: true };
    };
    super({ apiKey: e, apiURL: t, config: { ...ge(), ...n }, options: o, modelInfo: s, models: r, supportFor: a }), super.setName("OpenAI");
  }
};
var Tr = ge;
var qs = hn;
var zs = fn;
var js = gn;
var ke = class extends _ {
  constructor({ apiKey: e, resourceName: t, deploymentName: n, version: o = "api-version=2024-02-15-preview", config: r, options: s, models: a, modelInfo: l }) {
    if (!e || e === "") throw new Error("Azure OpenAPI API key not set");
    if (!t || t === "") throw new Error("Azure OpenAPI resource name not set");
    if (!n || n === "") throw new Error("Azure OpenAPI deployment id not set");
    let p = { ...Tr(), ...r };
    l = [...Oe, ...l ?? []];
    let u = (c) => {
      let m = W({ model: c, modelInfo: l, models: a });
      return { functions: true, streaming: true, hasThinkingBudget: m?.supported?.thinkingBudget ?? false, hasShowThoughts: m?.supported?.showThoughts ?? false, functionCot: false, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 20 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: false, formats: [], maxDuration: 0 }, files: { supported: false, formats: [], maxSize: 0, uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: m?.supported?.thinkingBudget ?? false, multiTurn: true };
    };
    super({ apiKey: e, config: p, options: s, models: a, modelInfo: l, supportFor: u });
    let d = t.includes("://") ? t : `https://${t}.openai.azure.com/`;
    super.setName("Azure OpenAI"), super.setAPIURL(new URL(`/openai/deployments/${n}?api-version=${o}`, d).href), super.setHeaders(async () => ({ "api-key": e }));
  }
};
var An = class i2 {
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
    Hs(e), this.services = [...e].sort(t?.comparator ?? i2.metricComparator);
    let n = this.services[this.currentServiceIndex];
    if (n === void 0) throw new Error("Error initializing the AI services.");
    this.currentService = n, this.debug = t?.debug ?? true, this.initialBackoffMs = t?.initialBackoffMs ?? 1e3, this.maxBackoffMs = t?.maxBackoffMs ?? 32e3, this.maxRetries = t?.maxRetries ?? 3;
  }
  static create(e, t) {
    return new i2(e, t);
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
        if (!(n instanceof j)) throw n;
        switch (n.constructor) {
          case se:
            throw n;
          case de:
            break;
          case oe:
            break;
          case re2:
            break;
          case Z:
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
function Hs(i10) {
  let e = i10.find((o) => o.getModelList() !== void 0);
  if (!e) return;
  let t = e.getModelList();
  if (!t) throw new Error("No model list found in any service.");
  let n = new Set(t.map((o) => o.key));
  for (let o = 0; o < i10.length; o++) {
    let r = i10[o];
    if (!r) throw new Error(`Service at index ${o} is undefined`);
    let s = r.getModelList();
    if (!s) throw new Error(`Service at index ${o} (${r.getName()}) has no model list while another service does.`);
    let a = new Set(s.map((l) => l.key));
    for (let l of n) if (!a.has(l)) throw new Error(`Service at index ${o} (${r.getName()}) is missing model "${l}"`);
    for (let l of a) if (!n.has(l)) throw new Error(`Service at index ${o} (${r.getName()}) has extra model "${l}"`);
  }
}
function he(i10) {
  let e = false, t = false, n = false, o = false, r = false, s = false, a = false, l = /* @__PURE__ */ new Set(), p = 0;
  if (i10.chatPrompt && Array.isArray(i10.chatPrompt)) for (let u of i10.chatPrompt) {
    if (u.role === "user" && Array.isArray(u.content)) for (let d of u.content) switch (l.add(d.type), d.type) {
      case "image":
        e = true, d.cache && (a = true), p += 85;
        break;
      case "audio":
        t = true, d.cache && (a = true), p += d.duration || 60;
        break;
      case "file":
        n = true, d.cache && (a = true), p += Math.ceil((d.extractedText?.length || 1e3) / 4);
        break;
      case "url":
        o = true, d.cache && (a = true), p += Math.ceil((d.cachedContent?.length || 2e3) / 4);
        break;
      case "text":
        d.cache && (a = true), p += Math.ceil(d.text.length / 4);
        break;
    }
    else "content" in u && typeof u.content == "string" && (p += Math.ceil(u.content.length / 4));
    "cache" in u && u.cache && (a = true);
  }
  return i10.functions && i10.functions.length > 0 && (r = true), i10.modelConfig?.stream === true && (s = true), i10.capabilities && (i10.capabilities.requiresImages && (e = true), i10.capabilities.requiresAudio && (t = true), i10.capabilities.requiresFiles && (n = true), i10.capabilities.requiresWebSearch && (o = true)), { hasImages: e, hasAudio: t, hasFiles: n, hasUrls: o, requiresFunctions: r, requiresStreaming: s, requiresCaching: a, contentTypes: l, estimatedTokens: p };
}
function Rr(i10, e) {
  let t = i10.getFeatures(), n = [], o = [], r = [];
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
function xn(i10, e) {
  return i10.map((t) => {
    let n = t.getFeatures(), o = Rr(t, e), r = 0, s = [];
    return r += 10, e.hasImages && n.media.images.supported && (r += 25, s.push("Images"), n.media.images.detailLevels?.includes("high") && (r += 5), n.media.images.maxSize && n.media.images.maxSize > 10 * 1024 * 1024 && (r += 3)), e.hasAudio && n.media.audio.supported && (r += 25, s.push("Audio"), n.media.audio.maxDuration && n.media.audio.maxDuration > 600 && (r += 5)), e.hasFiles && n.media.files.supported && (r += 25, s.push("Files"), n.media.files.uploadMethod === "cloud" && (r += 3)), e.hasUrls && n.media.urls.supported && (r += 25, s.push("URLs"), n.media.urls.webSearch && (r += 5)), e.requiresFunctions && n.functions && (r += 15, s.push("Functions"), n.functionCot && (r += 3)), e.requiresStreaming && n.streaming && (r += 10, s.push("Streaming")), e.requiresCaching && n.caching.supported && (r += 8, s.push("Caching"), n.caching.types.includes("persistent") && (r += 3)), n.thinking && (r += 2), n.multiTurn && (r += 2), n.hasThinkingBudget && (r += 1), n.hasShowThoughts && (r += 1), r -= o.missingCapabilities.length * 10, { provider: t, score: r, missingCapabilities: o.missingCapabilities, supportedCapabilities: s };
  }).sort((t, n) => n.score - t.score);
}
function yn(i10, e, t = {}) {
  if (e.length === 0) throw new Error("No providers available");
  let n = he(i10), o = xn(e, n);
  if (t.requireExactMatch) {
    let r = o.filter((s) => s.missingCapabilities.length === 0);
    if (r.length === 0) throw new Error(`No providers fully support the request requirements: ${o[0]?.missingCapabilities.join(", ") || "unknown requirements"}`);
    return r[0].provider;
  }
  if (!t.allowDegradation) {
    let r = o[0];
    if (r.missingCapabilities.length > 0) throw new Error(`Best available provider (${r.provider.getName()}) is missing: ${r.missingCapabilities.join(", ")}`);
  }
  return o[0].provider;
}
function Ks(i10, e) {
  let t = he(i10), n = xn(e, t), o = n[0]?.provider || null, r = [t.hasImages && "images", t.hasAudio && "audio", t.hasFiles && "files", t.hasUrls && "URLs", t.requiresFunctions && "functions", t.requiresStreaming && "streaming", t.requiresCaching && "caching"].filter(Boolean).length, s = o ? n[0].supportedCapabilities.length : 0, a = o ? `${o.getName()} supports ${s}/${r} requirements (${Math.round(s / Math.max(r, 1) * 100)}% compatibility)` : "No suitable providers found";
  return { requirements: t, providerScores: n, recommendedProvider: o, summary: a };
}
function Ws(i10, e) {
  return i10.filter((t) => t.getFeatures().media[e].supported);
}
function Vs(i10, e) {
  let t = {};
  for (let n of i10) {
    let r = n.getFeatures().media[e];
    if (r.supported) for (let s of r.formats) t[s] || (t[s] = []), t[s].push(n);
  }
  return t;
}
var yt = ((o) => (o.CommandRPlus = "command-r-plus", o.CommandR = "command-r", o.Command = "command", o.CommandLight = "command-light", o))(yt || {});
var It = ((o) => (o.EmbedEnglishV30 = "embed-english-v3.0", o.EmbedEnglishLightV30 = "embed-english-light-v3.0", o.EmbedMultiLingualV30 = "embed-multilingual-v3.0", o.EmbedMultiLingualLightV30 = "embed-multilingual-light-v3.0", o))(It || {});
var In = [{ name: "command-r-plus", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "command-r", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "command", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "command-light", currency: "usd", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.6 }, { name: "embed-english-light-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-english-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-multilingual-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-multilingual-light-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }];
var wr = () => structuredClone({ model: "command-r-plus", embedModel: "embed-english-v3.0", ...O() });
var Js = () => structuredClone({ model: "command-r", embedModel: "embed-english-v3.0", ...N() });
var bn = class {
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
    let s = Qs(o), a = e.functions?.map((d) => {
      let c = {};
      if (d.parameters?.properties) for (let [m, g] of Object.entries(d.parameters.properties)) c[m] = { description: g.description, type: g.type, required: d.parameters.required?.includes(m) ?? false };
      return { name: d.name, description: d.description, parameter_definitions: c };
    }), l = e.chatPrompt.filter((d) => d.role === "function").map((d) => {
      let c = a?.find((m) => m.name === d.functionId);
      if (!c) throw new Error("Function not found");
      return { call: { name: c.name, parameters: c.parameter_definitions }, outputs: [{ result: d.result ?? "" }] };
    }), p = { name: "/chat" }, u = { message: r, model: t, tools: a, ...l && !r ? { tool_results: l } : {}, chat_history: s, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, k: e.modelConfig?.topK ?? this.config.topK, ...e.modelConfig?.topP !== void 0 ? { p: e.modelConfig.topP } : {}, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, end_sequences: this.config.endSequences, stop_sequences: e.modelConfig?.stopSequences ?? this.config.stopSequences };
    return [p, u];
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
var Ee = class extends D {
  constructor({ apiKey: e, config: t, options: n, models: o }) {
    if (!e || e === "") throw new Error("Cohere API key not set");
    let r = { ...wr(), ...t }, s = new bn(r);
    super(s, { name: "Cohere", apiURL: "https://api.cohere.ai/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: In, defaults: { model: r.model }, supportFor: { functions: true, streaming: true, media: { images: { supported: false, formats: [], maxSize: 0, detailLevels: [] }, audio: { supported: false, formats: [], maxDuration: 0 }, files: { supported: false, formats: [], maxSize: 0, uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, options: n, models: o });
  }
};
function Qs(i10) {
  return i10.map((e) => {
    let t = "";
    if (e.role === "system" || e.role === "assistant" || e.role === "user") if (typeof e.content == "string") t = e.content;
    else throw new Error("Multi-modal content not supported");
    switch (e.role) {
      case "user":
        return { role: "USER", message: t };
      case "system":
        return { role: "SYSTEM", message: t };
      case "assistant": {
        let n = Cr(e.functionCalls);
        return { role: "CHATBOT", message: t, tool_calls: n };
      }
      case "function": {
        let n = i10.map((s) => {
          if (s.role === "assistant") return s.functionCalls?.find((a) => a.id === e.functionId);
        }).filter((s) => s !== void 0), o = Cr(n)?.at(0);
        if (!o) throw new Error("Function call not found");
        let r = [{ result: e.result }];
        return { role: "TOOL", tool_results: [{ call: o, outputs: r }] };
      }
      default:
        throw new Error("Unknown role");
    }
  });
}
function Cr(i10) {
  return i10?.map((e) => {
    let t = typeof e.function.params == "string" ? JSON.parse(e.function.params) : e.function.params;
    return { name: e.function.name, parameters: t };
  });
}
var bt = ((n) => (n.DeepSeekChat = "deepseek-chat", n.DeepSeekCoder = "deepseek-coder", n.DeepSeekReasoner = "deepseek-reasoner", n))(bt || {});
var Tn = [{ name: "deepseek-chat", currency: "USD", promptTokenCostPer1M: 0.27, completionTokenCostPer1M: 1.1 }, { name: "deepseek-reasoner", currency: "USD", promptTokenCostPer1M: 0.55, completionTokenCostPer1M: 2.19 }];
var Sr = () => structuredClone({ model: "deepseek-chat", ...O() });
var Ys = () => structuredClone({ model: "deepseek-coder", ...N() });
var Pe = class extends _ {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("DeepSeek API key not set");
    let s = { ...Sr(), ...t };
    r = [...Tn, ...r ?? []], super({ apiKey: e, config: s, options: n, apiURL: "https://api.deepseek.com", modelInfo: r, supportFor: { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, models: o }), super.setName("DeepSeek");
  }
};
var Tt = ((u) => (u.Gemini25Pro = "gemini-2.5-pro", u.Gemini25Flash = "gemini-2.5-flash", u.Gemini25FlashLite = "gemini-2.5-flash-lite", u.Gemini20Flash = "gemini-2.0-flash", u.Gemini20FlashLite = "gemini-2.0-flash-lite", u.Gemini1Pro = "gemini-1.0-pro", u.Gemini15Flash = "gemini-1.5-flash", u.Gemini15Flash002 = "gemini-1.5-flash-002", u.Gemini15Flash8B = "gemini-1.5-flash-8b", u.Gemini15Pro = "gemini-1.5-pro", u))(Tt || {});
var Rn = ((o) => (o.GeminiEmbedding = "gemini-embedding-exp", o.TextEmbeddingLarge = "text-embedding-large-exp-03-07", o.TextEmbedding004 = "text-embedding-004", o.TextEmbedding005 = "text-embedding-005", o))(Rn || {});
var Cn = ((o) => (o.HarmCategoryHarassment = "HARM_CATEGORY_HARASSMENT", o.HarmCategoryHateSpeech = "HARM_CATEGORY_HATE_SPEECH", o.HarmCategorySexuallyExplicit = "HARM_CATEGORY_SEXUALLY_EXPLICIT", o.HarmCategoryDangerousContent = "HARM_CATEGORY_DANGEROUS_CONTENT", o))(Cn || {});
var wn = ((r) => (r.BlockNone = "BLOCK_NONE", r.BlockOnlyHigh = "BLOCK_ONLY_HIGH", r.BlockMediumAndAbove = "BLOCK_MEDIUM_AND_ABOVE", r.BlockLowAndAbove = "BLOCK_LOW_AND_ABOVE", r.BlockDefault = "HARM_BLOCK_THRESHOLD_UNSPECIFIED", r))(wn || {});
var vr = ((l) => (l.SemanticSimilarity = "SEMANTIC_SIMILARITY", l.Classification = "CLASSIFICATION", l.Clustering = "CLUSTERING", l.RetrievalDocument = "RETRIEVAL_DOCUMENT", l.RetrievalQuery = "RETRIEVAL_QUERY", l.QuestionAnswering = "QUESTION_ANSWERING", l.FactVerification = "FACT_VERIFICATION", l.CodeRetrievalQuery = "CODE_RETRIEVAL_QUERY", l))(vr || {});
var Sn = [{ name: "gemini-2.5-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 2.5, completionTokenCostPer1M: 15, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gemini-2.5-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 15, completionTokenCostPer1M: 3.5, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gemini-2.5-flash-lite", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.4, supported: { thinkingBudget: true, showThoughts: true } }, { name: "gemini-2.0-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.01, completionTokenCostPer1M: 0.4 }, { name: "gemini-2.0-flash-lite", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0, completionTokenCostPer1M: 0 }, { name: "gemini-1.5-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.075, completionTokenCostPer1M: 0.3 }, { name: "gemini-1.5-flash-8b", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.0375, completionTokenCostPer1M: 0.15 }, { name: "gemini-1.5-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 1.25, completionTokenCostPer1M: 5 }, { name: "gemini-1.0-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }];
var vn = (i10) => {
  if (!i10 || typeof i10 != "object") return i10;
  let e = { ...i10 };
  return delete e.additionalProperties, delete e.default, delete e.optional, delete e.maximum, delete e.oneOf, delete e.anyOf, e.properties && typeof e.properties == "object" && (e.properties = Object.fromEntries(Object.entries(e.properties).map(([t, n]) => [t, vn(n)]))), e.items && (e.items = vn(e.items)), e;
};
var Or = [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }];
var Mr = () => structuredClone({ model: "gemini-2.5-flash", embedModel: "text-embedding-005", safetySettings: Or, thinkingTokenBudgetLevels: { minimal: 200, low: 800, medium: 5e3, high: 1e4, highest: 24500 }, ...O() });
var Xs = () => structuredClone({ model: "gemini-2.0-flash", embedModel: "text-embedding-005", safetySettings: Or, thinkingTokenBudgetLevels: { minimal: 200, low: 800, medium: 5e3, high: 1e4, highest: 24500 }, ...N() });
var On = class {
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
      let h = o ? "&" : "?", x = typeof this.apiKey == "function" ? await this.apiKey() : this.apiKey;
      r.name += `${h}key=${x}`;
    }
    let s = e.chatPrompt.filter((h) => h.role === "system").map((h) => h.content), a = s.length > 0 ? { role: "user", parts: [{ text: s.join(" ") }] } : void 0, l = e.chatPrompt.filter((h) => h.role !== "system").map((h, x) => {
      switch (h.role) {
        case "user":
          return { role: "user", parts: Array.isArray(h.content) ? h.content.map((A, I) => {
            switch (A.type) {
              case "text":
                return { text: A.text };
              case "image":
                return { inlineData: { mimeType: A.mimeType, data: A.image } };
              case "audio":
                return { inlineData: { mimeType: `audio/${A.format ?? "mp3"}`, data: A.data } };
              case "file":
                return "fileUri" in A ? { fileData: { mimeType: A.mimeType, fileUri: A.fileUri } } : { inlineData: { mimeType: A.mimeType, data: A.data } };
              default:
                throw new Error(`Chat prompt content type not supported (index: ${I})`);
            }
          }) : [{ text: h.content }] };
        case "assistant": {
          let f = [];
          if (h.functionCalls) {
            if (f = h.functionCalls.map((A) => {
              let I = typeof A.function.params == "string" ? JSON.parse(A.function.params) : A.function.params;
              return { functionCall: { name: A.function.name, args: I } };
            }), !f) throw new Error("Function call is empty");
            return { role: "model", parts: f };
          }
          if (!h.content) throw new Error("Assistant content is empty");
          return f = [{ text: h.content }], { role: "model", parts: f };
        }
        case "function": {
          if (!("functionId" in h)) throw new Error(`Chat prompt functionId is empty (index: ${x})`);
          return { role: "user", parts: [{ functionResponse: { name: h.functionId, response: { result: h.result } } }] };
        }
        default:
          throw new Error(`Invalid role: ${JSON.stringify(h)} (index: ${x})`);
      }
    }), p = [];
    if (e.functions && e.functions.length > 0) {
      let h = e.functions.map((x) => ({ ...x, parameters: x.parameters ? vn(x.parameters) : void 0 }));
      p.push({ function_declarations: h });
    }
    this.options?.codeExecution && p.push({ code_execution: {} }), this.options?.googleSearchRetrieval && p.push({ google_search_retrieval: { dynamic_retrieval_config: this.options.googleSearchRetrieval } }), this.options?.googleSearch && p.push({ google_search: {} }), this.options?.urlContext && p.push({ url_context: {} }), p.length === 0 && (p = void 0);
    let u;
    if (e.functionCall) if (e.functionCall === "none") u = { function_calling_config: { mode: "NONE" } };
    else if (e.functionCall === "auto") u = { function_calling_config: { mode: "AUTO" } };
    else if (e.functionCall === "required") u = { function_calling_config: { mode: "ANY" } };
    else {
      let h = e.functionCall.function?.name ? { allowedFunctionNames: [e.functionCall.function.name] } : {};
      u = { function_calling_config: { mode: "ANY" }, ...h };
    }
    else p && p.length > 0 && (u = { function_calling_config: { mode: "AUTO" } });
    let d = {};
    if (this.config.thinking?.includeThoughts && (d.includeThoughts = true), this.config.thinking?.thinkingTokenBudget && (d.thinkingBudget = this.config.thinking.thinkingTokenBudget), t?.thinkingTokenBudget) {
      let h = this.config.thinkingTokenBudgetLevels;
      switch (t.thinkingTokenBudget) {
        case "none":
          d.thinkingBudget = 0, d.includeThoughts = false;
          break;
        case "minimal":
          d.thinkingBudget = h?.minimal ?? 200;
          break;
        case "low":
          d.thinkingBudget = h?.low ?? 800;
          break;
        case "medium":
          d.thinkingBudget = h?.medium ?? 5e3;
          break;
        case "high":
          d.thinkingBudget = h?.high ?? 1e4;
          break;
        case "highest":
          d.thinkingBudget = h?.highest ?? 24500;
          break;
      }
    }
    t?.showThoughts !== void 0 && t?.thinkingTokenBudget !== "none" && (d.includeThoughts = t.showThoughts);
    let c = { maxOutputTokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, ...e.modelConfig?.topP !== void 0 ? { topP: e.modelConfig.topP } : {}, topK: e.modelConfig?.topK ?? this.config.topK, frequencyPenalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, candidateCount: 1, stopSequences: e.modelConfig?.stopSequences ?? this.config.stopSequences, responseMimeType: "text/plain", ...Object.keys(d).length > 0 ? { thinkingConfig: d } : {} }, m = this.config.safetySettings;
    return [r, { contents: l, tools: p, toolConfig: u, systemInstruction: a, generationConfig: c, safetySettings: m }];
  };
  createEmbedReq = async (e) => {
    let t = e.embedModel;
    if (!t) throw new Error("Embed model not set");
    if (!e.texts || e.texts.length === 0) throw new Error("Embed texts is empty");
    let n, o;
    if (this.isVertex) this.endpointId ? n = { name: `/${this.endpointId}:predict` } : n = { name: `/models/${t}:predict` }, o = { instances: e.texts.map((r) => ({ content: r, ...this.config.embedType && { taskType: this.config.embedType } })), parameters: { autoTruncate: this.config.autoTruncate, outputDimensionality: this.config.dimensions } };
    else {
      let r = typeof this.apiKey == "function" ? this.apiKey() : this.apiKey;
      n = { name: `/models/${t}:batchEmbedContents?key=${r}` }, o = { requests: e.texts.map((s) => ({ model: `models/${t}`, content: { parts: [{ text: s }] }, outputDimensionality: this.config.dimensions, ...this.config.embedType && { taskType: this.config.embedType } })) };
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
          throw new E("Content was blocked due to safety settings", void 0, void 0);
        case "RECITATION":
          throw new E("Content was blocked due to recitation policy", void 0, void 0);
        case "MALFORMED_FUNCTION_CALL":
          throw new E("Function call was malformed and blocked", void 0, void 0);
        case "UNEXPECTED_TOOL_CALL":
          throw new E("Unexpected tool call", void 0, void 0);
        case "FINISH_REASON_UNSPECIFIED":
          throw new E("Finish reason unspecified", void 0, void 0);
        case "BLOCKLIST":
          throw new E("Content was blocked due to blocklist", void 0, void 0);
        case "PROHIBITED_CONTENT":
          throw new E("Content was blocked due to prohibited content", void 0, void 0);
        case "SPII":
          throw new E("Content was blocked due to SPII", void 0, void 0);
        case "OTHER":
          throw new E("Other finish reason", void 0, void 0);
      }
      if (!n.content || !n.content.parts) return o;
      for (let s of n.content.parts) {
        if ("text" in s) {
          "thought" in s && s.thought ? o.thought = s.text : o.content = s.text;
          continue;
        }
        "functionCall" in s && (o.functionCalls = [{ id: B(), type: "function", function: { name: s.functionCall.name, params: s.functionCall.args } }]);
      }
      let r = n.citationMetadata?.citations;
      if (Array.isArray(r) && r.length) {
        let s = (a) => a ? `${a.year}-${String(a.month).padStart(2, "0")}-${String(a.day).padStart(2, "0")}` : void 0;
        o.citations = r.filter((a) => typeof a?.uri == "string").map((a) => ({ url: a.uri, title: a.title, license: a.license, publicationDate: s(a.publicationDate) }));
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
var Fe = class i3 extends D {
  static create(e) {
    return new i3(e);
  }
  constructor({ apiKey: e, projectId: t, region: n, endpointId: o, config: r, options: s, models: a, modelInfo: l }) {
    let p = t !== void 0 && n !== void 0, u, d;
    if (p) {
      if (!e) throw new Error("GoogleGemini Vertex API key not set");
      if (typeof e != "function") throw new Error("GoogleGemini Vertex API key must be a function for token-based authentication");
      let h;
      o ? h = "endpoints" : h = "publishers/google", u = `https://${n === "global" ? "aiplatform" : `${n}-aiplatform`}.googleapis.com/v1/projects/${t}/locations/${n}/${h}`, d = async () => ({ Authorization: `Bearer ${typeof e == "function" ? await e() : e}` });
    } else {
      if (!e) throw new Error("GoogleGemini AI API key not set");
      u = "https://generativelanguage.googleapis.com/v1beta", d = async () => ({});
    }
    let c = { ...Mr(), ...r }, m = new On(c, p, o, e, s);
    l = [...Sn, ...l ?? []];
    let g = (h) => {
      let x = W({ model: h, modelInfo: l, models: a });
      return { functions: true, streaming: true, hasThinkingBudget: x?.supported?.thinkingBudget ?? false, hasShowThoughts: x?.supported?.showThoughts ?? false, media: { images: { supported: true, formats: ["image/jpeg", "image/png", "image/gif", "image/webp"], maxSize: 20 * 1024 * 1024, detailLevels: ["high", "low", "auto"] }, audio: { supported: true, formats: ["wav", "mp3", "aac", "ogg"], maxDuration: 9.5 * 60 }, files: { supported: true, formats: ["application/pdf", "text/plain", "text/csv", "text/html", "text/xml"], maxSize: 2 * 1024 * 1024 * 1024, uploadMethod: "cloud" }, urls: { supported: true, webSearch: true, contextFetching: true } }, caching: { supported: false, types: [] }, thinking: x?.supported?.thinkingBudget ?? false, multiTurn: true };
    };
    super(m, { name: "GoogleGeminiAI", apiURL: u, headers: d, modelInfo: l, defaults: { model: c.model, embedModel: c.embedModel }, options: s, supportFor: g, models: a });
  }
};
var Zs = new $();
var _e = class {
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
    return this.options?.debug && console.log(Zs.red(`Rate limiter: Waiting for ${e - this.currentTokens} tokens`)), await new Promise((t) => setTimeout(t, 100)), this.waitUntilTokensAvailable(e);
  }
  async acquire(e) {
    await this.waitUntilTokensAvailable(e);
  }
};
var Rt = ((o) => (o.Llama3_8B = "llama3-8b-8192", o.Llama33_70B = "llama-3.3-70b-versatile", o.Mixtral_8x7B = "mixtral-8x7b-32768", o.Gemma2_9B = "gemma2-9b-it", o))(Rt || {});
var Mn = [{ name: "gemma2-9b-it", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.2 }, { name: "llama-3.3-70b-versatile", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.59, completionTokenCostPer1M: 0.79 }, { name: "llama3-8b-8192", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.05, completionTokenCostPer1M: 0.08 }, { name: "mixtral-8x7b-32768", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.24, completionTokenCostPer1M: 0.24 }];
var ei = () => structuredClone({ model: "llama-3.3-70b-versatile", ...O() });
var De = class extends _ {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Groq API key not set");
    let s = { ...ei(), ...t }, a = { ...n, streamingUsage: false };
    r = [...Mn, ...r ?? []];
    let l = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    super({ apiKey: e, config: s, options: a, modelInfo: r, apiURL: "https://api.groq.com/openai/v1", models: o, supportFor: l }), super.setName("Groq"), this.setOptions(a);
  }
  setOptions = (e) => {
    let t = this.newRateLimiter(e);
    super.setOptions({ ...e, rateLimiter: t });
  };
  newRateLimiter = (e) => {
    if (e?.rateLimiter) return e.rateLimiter;
    let t = e?.tokensPerMinute ?? 4800, n = new _e(t, t / 60, { debug: e?.debug });
    return async (r, s) => {
      let a = s.modelUsage?.tokens?.totalTokens || 0;
      return await n.acquire(a), await r();
    };
  };
};
var kn = [];
var En = ((e) => (e.MetaLlama270BChatHF = "meta-llama/Llama-2-70b-chat-hf", e))(En || {});
var kr = () => structuredClone({ model: "meta-llama/Llama-2-70b-chat-hf", ...O() });
var ti = () => structuredClone({ model: "meta-llama/Llama-2-70b-chat-hf", ...N() });
var Pn = class {
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
          let p = l.functionCalls?.map((u) => {
            let d = typeof u.function.params == "string" ? u.function.params : JSON.stringify(u.function.params);
            return `${u.function.name}(${d})`;
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
`), r = `${n} ${o}`.trim(), s = { name: "/models" }, a = { model: t, inputs: r, parameters: { max_new_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, repetition_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, ...e.modelConfig?.topP !== void 0 ? { top_p: e.modelConfig.topP } : {}, top_k: e.modelConfig?.topK ?? this.config.topK, return_full_text: this.config.returnFullText, num_return_sequences: this.config.n, do_sample: this.config.doSample, max_time: this.config.maxTime }, options: { use_cache: this.config.useCache, wait_for_model: this.config.waitForModel } };
    return [s, a];
  };
  createChatResp = (e) => ({ results: [{ index: 0, content: e.generated_text }] });
};
var Le = class extends D {
  constructor({ apiKey: e, config: t, options: n, models: o }) {
    if (!e || e === "") throw new Error("HuggingFace API key not set");
    let r = { ...kr(), ...t }, s = new Pn(r);
    super(s, { name: "HuggingFace", apiURL: "https://api-inference.huggingface.co", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: kn, defaults: { model: r.model }, options: n, supportFor: { functions: false, streaming: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, models: o });
  }
};
var Ct = ((l) => (l.Mistral7B = "open-mistral-7b", l.Mistral8x7B = "open-mixtral-8x7b", l.MistralSmall = "mistral-small-latest", l.MistralNemo = "mistral-nemo-latest", l.MistralLarge = "mistral-large-latest", l.Codestral = "codestral-latest", l.OpenCodestralMamba = "open-codestral-mamba", l.OpenMistralNemo = "open-mistral-nemo-latest", l))(Ct || {});
var Er = ((e) => (e.MistralEmbed = "mistral-embed", e))(Er || {});
var Fn = [{ name: "open-mistral-7b", currency: "USD", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 0.25 }, { name: "open-mixtral-8x7b", currency: "USD", promptTokenCostPer1M: 0.7, completionTokenCostPer1M: 0.7 }, { name: "mistral-nemo-latest", currency: "USD", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.15 }, { name: "mistral-small-latest", currency: "USD", promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.6 }, { name: "mistral-large-latest", currency: "USD", promptTokenCostPer1M: 2, completionTokenCostPer1M: 6 }, { name: "codestral-latest", currency: "USD", promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.6 }, { name: "open-codestral-mamba", currency: "USD", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 0.25 }, { name: "open-mistral-nemo-latest", currency: "USD", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.3 }];
var _n = () => structuredClone({ model: "mistral-small-latest", ...O(), topP: 1 });
var ni = () => structuredClone({ ..._n(), model: "mistral-large-latest" });
var Ne = class extends _ {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Mistral API key not set");
    let s = { ..._n(), ...t };
    r = [...Fn, ...r ?? []];
    let a = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, l = (p) => {
      let { max_completion_tokens: u, messages: d, ...c } = p;
      return { ...c, messages: this.updateMessages(d), max_tokens: u };
    };
    super({ apiKey: e, config: s, options: n, apiURL: "https://api.mistral.ai/v1", modelInfo: r, models: o, supportFor: a, chatReqUpdater: l }), super.setName("Mistral");
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
var Dn = class {
  constructor(e = {}) {
    this.config = e;
    this.config.id = this.config.id ?? B();
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
      let s = Math.max(0, Math.floor(o.length * 0.99) - 1);
      this.metrics.latency[e].p99 = o[s] ?? t;
    }
    if (this.config.shouldError) {
      this.metrics.errors[e].count++, this.metrics.errors[e].total++;
      let o = this.metrics.latency[e].samples.length;
      this.metrics.errors[e].rate = o > 0 ? this.metrics.errors[e].count / o : 0;
    }
  }
};
var Ln = class i4 {
  options;
  lastUsedService;
  services = /* @__PURE__ */ new Map();
  constructor(e) {
    if (e.length === 0) throw new Error("No AI services provided.");
    for (let [t, n] of e.entries()) if ("key" in n) {
      if (this.services.has(n.key)) throw new Error(`Duplicate model key: ${n.key}`);
      let { service: r, description: s, isInternal: a } = n;
      this.services.set(n.key, { service: r, description: s, isInternal: a });
    } else {
      let r = n.getModelList();
      if (!r) throw new Error(`Service ${t} \`${n.getName()}\` has no model list.`);
      for (let s of r) {
        if (this.services.has(s.key)) {
          let a = this.services.get(s.key)?.service;
          throw new Error(`Service ${t} \`${n.getName()}\` has duplicate model key: ${s.key} as service ${a?.getName()}`);
        }
        if ("model" in s && typeof s.model) this.services.set(s.key, { description: s.description, service: n, model: s.model });
        else if ("embedModel" in s && s.embedModel) this.services.set(s.key, { description: s.description, service: n, embedModel: s.embedModel });
        else throw new Error(`Key ${s.key} in model list for service ${t} \`${n.getName()}\` is missing a model or embedModel property.`);
      }
    }
  }
  static create(e) {
    return new i4(e);
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
      let { model: r, ...s } = e;
      return await o.service.chat(s, t);
    }
    return await o.service.chat({ model: n, ...e }, t);
  }
  async embed(e, t) {
    let n = e.embedModel;
    if (!n) throw new Error("Embed model key must be specified for multi-service");
    let o = this.services.get(n);
    if (!o) throw new Error(`No service found for embed model key: ${n}`);
    if (this.lastUsedService = o.service, !o.model) {
      let { embedModel: r, ...s } = e;
      return await o.service.embed(s, t);
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
var Pr = () => structuredClone({ ...O(), model: "nous-hermes2", embedModel: "all-minilm" });
var oi = () => structuredClone({ ...N(), model: "nous-hermes2", embedModel: "all-minilm" });
var Ge = class extends _ {
  constructor({ apiKey: e = "not-set", url: t = "http://localhost:11434/v1", config: n, options: o, models: r }) {
    let s = { ...Pr(), ...n };
    super({ apiKey: e, options: o, config: s, apiURL: t, models: r, modelInfo: [], supportFor: { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true } }), super.setName("Ollama");
  }
};
var ri = (i10) => ["o1", "o1-mini", "o1-pro", "o3", "o3-mini", "o3-pro", "o4-mini"].includes(i10);
var $e = class {
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
  mapInternalContentToResponsesInput(e, t) {
    let n = [];
    for (let o of e) {
      if (o.type === "text") {
        t === "assistant" ? n.push({ type: "output_text", text: o.text }) : n.push({ type: "input_text", text: o.text });
        continue;
      }
      if (t === "assistant") continue;
      if (o.type === "image") {
        let s = `data:${o.mimeType};base64,${o.image}`;
        n.push({ type: "input_image", image_url: { url: s, details: o.details ?? "auto" } });
        continue;
      }
      if (o.type === "audio") {
        n.push({ type: "input_audio", input_audio: { data: o.data, format: o.format === "wav" ? "wav" : void 0 } });
        continue;
      }
      let r = o;
      throw new Error(`Unsupported content part: ${JSON.stringify(r)}`);
    }
    return n;
  }
  createResponsesReqInternalInput(e, t = false) {
    let n = [];
    for (let o of e) {
      if (t && o.role === "system") continue;
      let r;
      if (o.role === "system" || o.role === "user" || o.role === "assistant" && o.content) if (typeof o.content == "string") o.role === "system" ? r = o.content : o.role === "assistant" ? r = [{ type: "output_text", text: o.content }] : r = [{ type: "input_text", text: o.content }];
      else if (Array.isArray(o.content)) r = this.mapInternalContentToResponsesInput(o.content, o.role === "assistant" ? "assistant" : "user");
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
            let s = { type: "message", role: "assistant", content: "" };
            if (o.content && (s.content = r), o.name && (s.name = o.name), o.content && n.push(s), o.functionCalls) for (let a of o.functionCalls) n.push({ type: "function_call", call_id: a.id, name: a.function.name, arguments: typeof a.function.params == "object" ? JSON.stringify(a.function.params) : a.function.params || "" });
          }
          break;
        case "function":
          n.push({ type: "function_call_output", call_id: o.functionId, output: o.result });
          break;
        default: {
          let s = o.role;
          throw new Error(`Invalid role in chat prompt: ${s}`);
        }
      }
    }
    return n;
  }
  createChatReq(e, t) {
    let n = e.model, o = { name: "/responses" }, r = null, s = false;
    if (e.chatPrompt) {
      for (let f of e.chatPrompt) if (f.role === "system" && typeof f.content == "string") {
        r = f.content, s = true;
        break;
      }
    }
    let a = r ?? this.config.systemPrompt ?? null, l = e.functions?.map((f) => ({ type: "function", name: f.name, description: f.description, parameters: f.parameters ?? {} })), p = [], u = ri(n), d = this.config.reasoningSummary;
    t?.showThoughts ? d || (d = "auto") : d = void 0;
    let c = this.config.reasoningEffort;
    if (t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        c = void 0;
        break;
      case "minimal":
        c = "minimal";
        break;
      case "low":
        c = "medium";
        break;
      case "medium":
      case "high":
      case "highest":
        c = "high";
        break;
    }
    let m = { model: n, input: "", instructions: a, tools: l?.length ? l : void 0, tool_choice: e.functionCall === "none" || e.functionCall === "auto" || e.functionCall === "required" ? e.functionCall : typeof e.functionCall == "object" && e.functionCall.function ? { type: "function", name: e.functionCall.function.name } : void 0, ...u ? { max_output_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens ?? void 0 } : { ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, ...e.modelConfig?.topP !== void 0 ? { top_p: e.modelConfig.topP } : {}, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty ?? void 0, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty ?? void 0, max_output_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens ?? void 0 }, stream: e.modelConfig?.stream ?? this.config.stream ?? false, background: void 0, include: p.length > 0 ? p : void 0, metadata: void 0, parallel_tool_calls: this.config.parallelToolCalls, previous_response_id: void 0, ...c ? { reasoning: { effort: c, summary: d } } : {}, service_tier: this.config.serviceTier, store: this.config.store, text: void 0, truncation: void 0, user: this.config.user, seed: this.config.seed };
    this.config.user && (m.user = this.config.user), this.config.parallelToolCalls !== void 0 && (m.parallel_tool_calls = this.config.parallelToolCalls), this.config.responseFormat && (m.text = { format: { type: this.config.responseFormat } }), this.config.seed && (m.seed = this.config.seed);
    let g = e.chatPrompt ? this.createResponsesReqInternalInput(e.chatPrompt, s) : [];
    if (g.length > 0) m.input = g;
    else if (e.chatPrompt && e.chatPrompt.length === 1 && e.chatPrompt[0]?.role === "user" && e.chatPrompt[0]?.content && typeof e.chatPrompt[0].content == "string" && !a) m.input = e.chatPrompt[0].content;
    else if (g.length === 0 && !a) throw new Error("Responses API request must have input or instructions.");
    let h = m.reasoning ?? {};
    if (this.config.reasoningEffort && (h = { ...h, effort: this.config.reasoningEffort }), t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        h = {};
        break;
      case "minimal":
        h = { ...h, effort: "minimal" };
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
    let x = m;
    return this.responsesReqUpdater && (x = this.responsesReqUpdater(x)), [o, x];
  }
  createChatResp(e) {
    let { id: t, output: n, usage: o } = e;
    o && (this.tokensUsed = { promptTokens: o.prompt_tokens, completionTokens: o.completion_tokens ?? o.output_tokens ?? 0, totalTokens: o.total_tokens });
    let r = {};
    for (let s of n ?? []) switch (s.type) {
      case "message":
        r.id = s.id, r.content = Nn(s.content, t), r.finishReason = s.status === "completed" ? "stop" : "content_filter", r.citations = wt(s.content);
        break;
      case "reasoning":
        r.id = s.id, s.encrypted_content ? r.thought = s.encrypted_content : r.thought = s.summary.map((a) => typeof a == "object" ? JSON.stringify(a) : a).join(`
`);
        break;
      case "file_search_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "file_search", params: { queries: s.queries, results: s.results } } }], r.finishReason = "function_call";
        break;
      case "web_search_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "web_search", params: { queries: s.queries } } }], r.finishReason = "function_call";
        break;
      case "computer_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "computer_use", params: { action: s.action } } }], r.finishReason = "function_call";
        break;
      case "code_interpreter_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "code_interpreter", params: { code: s.code, results: s.results } } }], r.finishReason = "function_call";
        break;
      case "image_generation_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "image_generation", params: { result: s.result } } }], r.finishReason = "function_call";
        break;
      case "local_shell_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "local_shell", params: { action: s.action } } }], r.finishReason = "function_call";
        break;
      case "mcp_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: "mcp", params: { name: s.name, args: s.args, serverLabel: s.server_label, output: s.output, error: s.error } } }], r.finishReason = "function_call";
        break;
      case "function_call":
        r.id = s.id, r.functionCalls = [{ id: s.id, type: "function", function: { name: s.name, params: s.arguments } }], r.finishReason = "function_call";
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
            n.id = t.item.id, n.content = Nn(t.item.content, t.item.id), n.citations = wt(t.item.content);
            break;
          case "function_call":
            n.id = t.item.id, n.functionCalls = [{ id: t.item.id, type: "function", function: { name: t.item.name, params: t.item.arguments } }];
            break;
          case "file_search_call":
            {
              let r = t.item;
              n.id = t.item.id, n.functionCalls = [{ id: r.id, type: "function", function: { name: "file_search", params: { queries: r.queries || [], results: r.results?.map((s) => ({ fileId: s.file_id, filename: s.filename, score: s.score, text: s.text, attributes: s.attributes })) } } }];
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
        n.id = t.item_id, n.content = Nn([t.part], t.item_id), n.citations = wt([t.part]);
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
            if (n.id = t.item.id, n.finishReason = t.item.status === "completed" ? "stop" : "error", !n.citations || n.citations.length === 0) {
              let r = wt(t.item.content || []);
              r && (n.citations = r);
            }
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
        t.response.usage && (this.tokensUsed = { promptTokens: t.response.usage.prompt_tokens, completionTokens: t.response.usage.completion_tokens ?? t.response.usage.output_tokens ?? 0, totalTokens: t.response.usage.total_tokens }), o = t.response.id, n.id = `${t.response.id}_completed`, n.finishReason = "stop";
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
var Nn = (i10, e) => {
  let t = i10.filter((n) => n.type === "refusal");
  if (t.length > 0) {
    let n = t.map((o) => o.refusal).join(`
`);
    throw new E(n, void 0, e);
  }
  return i10.filter((n) => n.type === "output_text").map((n) => n.text).join(`
`);
};
function wt(i10) {
  let e = [];
  for (let t of i10 ?? []) if (t?.type === "output_text" && Array.isArray(t.annotations)) for (let n of t.annotations) n && n.type === "url_citation" && typeof n.url == "string" && e.push({ url: n.url, title: n.title, description: n.description });
  return e.length ? e : void 0;
}
var vt = () => ({ model: "gpt-4o", embedModel: "text-embedding-ada-002", temperature: 0.7, topP: 1, stream: true });
var si = () => ({ ...vt(), model: "gpt-4o", temperature: 0.5 });
var ii = () => ({ ...vt(), model: "gpt-4o", temperature: 0.9 });
var St = class extends D {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r = [], models: s, responsesReqUpdater: a, supportFor: l = { functions: true, streaming: true, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true } }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    let p = new $e(t, n?.streamingUsage ?? true, a), u = s;
    super(p, { name: "OpenAI", apiURL: o || "https://api.openai.com/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: r, defaults: { model: t.model, embedModel: t.embedModel }, options: n, supportFor: l, models: u });
  }
};
var Ue = class extends St {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    r = [...dn, ...r ?? []];
    let s = (a) => {
      let l = W({ model: a, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: l?.supported?.thinkingBudget ?? false, hasShowThoughts: l?.supported?.showThoughts ?? false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    };
    super({ apiKey: e, config: { ...vt(), ...t }, options: n, modelInfo: r, models: o, supportFor: s });
  }
};
var Fr = () => structuredClone({ model: "openrouter/auto", ...O() });
var Be = class extends _ {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r, referer: s, title: a }) {
    if (!e || e === "") throw new Error("OpenRouter API key not set");
    let l = { ...Fr(), ...t }, p = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, u = r ?? [];
    super({ apiKey: e, config: l, options: n, apiURL: "https://openrouter.ai/api/v1", modelInfo: u, models: o, supportFor: p }), super.setName("OpenRouter"), super.setHeaders(async () => {
      let d = { Authorization: `Bearer ${e}` };
      return s && (d["HTTP-Referer"] = s), a && (d["X-Title"] = a), d;
    });
  }
};
async function Gn(i10, e, t = {}) {
  if (typeof i10 == "string") return [{ type: "text", text: i10 }];
  if (!Array.isArray(i10)) return [{ type: "text", text: String(i10) }];
  let n = e.getFeatures(), o = [];
  for (let r of i10) try {
    switch (r.type) {
      case "text":
        o.push({ type: "text", text: r.text });
        break;
      case "image":
        if (n.media.images.supported) r.altText ? o.push({ type: "text", text: `[Image: ${r.altText}]` }) : o.push({ type: "text", text: "[Image content]" });
        else if (r.altText) o.push({ type: "text", text: r.altText });
        else if (t.imageToText) try {
          let s = await t.imageToText(r.image);
          o.push({ type: "text", text: s });
        } catch (s) {
          throw new ee(s, "image", "vision analysis");
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
          let s = await t.audioToText(r.data, r.format);
          o.push({ type: "text", text: s });
        } catch (s) {
          throw new ee(s, "audio", "transcription");
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
          let s = await t.fileToText(r.data, r.mimeType);
          o.push({ type: "text", text: s });
        } catch (s) {
          throw new ee(s, "file", "text extraction");
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
          let s = await t.urlToText(r.url);
          o.push({ type: "text", text: s });
        } catch (s) {
          throw new ee(s, "url", "content fetching");
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
  } catch (s) {
    throw s instanceof V || s instanceof ee ? s : new ee(s, r.type || "unknown", "content processing");
  }
  return o;
}
function ai(i10) {
  let e = false, t = false, n = false, o = false;
  for (let r of i10) if (r.role === "user" && Array.isArray(r.content)) for (let s of r.content) switch (s.type) {
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
var Ot = ((n) => (n.RekaCore = "reka-core", n.RekaFlash = "reka-flash", n.RekaEdge = "reka-edge", n))(Ot || {});
var $n = [{ name: "reka-core", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "reka-flash", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 2 }, { name: "reka-edge", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1 }];
var Mt = () => structuredClone({ model: "reka-core", ...O() });
var li = () => structuredClone({ ...Mt(), model: "reka-core" });
var pi = () => structuredClone({ model: "reka-core", ...N() });
var ui = () => ({ ...Mt(), model: "reka-flash" });
var Un = class {
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
    let n = { name: "/chat/completions" }, o = ci(e), r = e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, s = e.modelConfig?.stream ?? this.config.stream, a = { model: t, messages: o, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, top_k: e.modelConfig?.n ?? this.config.n, ...e.modelConfig?.topP !== void 0 ? { top_p: e.modelConfig.topP } : {}, stop: e.modelConfig?.stopSequences ?? this.config.stop, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, ...r ? { frequency_penalty: r } : {}, ...s ? { stream: true } : {} };
    return [n, a];
  };
  createChatResp = (e) => {
    let { id: t, usage: n, responses: o } = e;
    return this.tokensUsed = n ? { promptTokens: n.input_tokens, completionTokens: n.output_tokens, totalTokens: n.input_tokens + n.output_tokens } : void 0, { results: o.map((s, a) => {
      let l = _r(s.finish_reason), p;
      return typeof s.message.content == "string" ? p = s.message.content : p = s.message.content.text, { index: a, id: `${t}`, content: p, finishReason: l };
    }), remoteId: t };
  };
  createChatStreamResp = (e) => {
    let { id: t, usage: n, responses: o } = e;
    return this.tokensUsed = n ? { promptTokens: n.input_tokens, completionTokens: n.output_tokens, totalTokens: n.input_tokens + n.output_tokens } : void 0, { results: o.map((s, a) => {
      let l = _r(s.finish_reason), p;
      return typeof s.chunk.content == "string" ? p = s.chunk.content : p = s.chunk.content.text, { index: a, id: `${t}`, content: p, finishReason: l };
    }) };
  };
};
var _r = (i10) => {
  switch (i10) {
    case "stop":
      return "stop";
    case "context":
      return "length";
    case "length":
      return "length";
  }
};
function ci(i10) {
  return i10.chatPrompt.map((e) => {
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
var qe = class extends D {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r = $n, models: s }) {
    if (!e || e === "") throw new Error("Reka API key not set");
    let a = { ...Mt(), ...t }, l = new Un(a);
    super(l, { name: "Reka", apiURL: o || "https://api.reka.ai/v1/chat", headers: async () => ({ "X-Api-Key": e }), modelInfo: r, defaults: { model: a.model }, options: n, supportFor: { functions: true, streaming: true, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }, models: s });
  }
};
var Bn = class {
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
    for (let s of e.chatPrompt) if (s.role === "user" && Array.isArray(s.content)) {
      let a = await Gn(s.content, t, o);
      a.every((p) => p.type === "text") && a.length === 1 ? r.push({ ...s, content: a[0].text }) : r.push({ ...s, content: a.map((p) => ({ type: "text", text: p.text })) });
    } else r.push(s);
    return { ...e, chatPrompt: r };
  }
  async selectProviderWithDegradation(e, t) {
    let n = he(e), o = [], r = [], s = [];
    try {
      let a = yn(e, this.providers, { requireExactMatch: t.requireExactMatch ?? this.config.capability.requireExactMatch, allowDegradation: t.allowDegradation ?? this.config.capability.allowDegradation }), l = a.getFeatures();
      return n.hasImages && !l.media.images.supported && (r.push("Images will be converted to text descriptions"), o.push("Image-to-text conversion")), n.hasAudio && !l.media.audio.supported && (r.push("Audio will be transcribed to text"), o.push("Audio-to-text transcription")), n.hasFiles && !l.media.files.supported && (r.push("File content will be extracted to text"), o.push("File-to-text extraction")), n.hasUrls && !l.media.urls.supported && (r.push("URL content will be pre-fetched"), o.push("URL content fetching")), n.requiresStreaming && !l.streaming && s.push("Streaming not supported - will use non-streaming mode"), n.requiresCaching && !l.caching.supported && s.push("Content caching not supported"), { provider: a, processingApplied: o, degradations: r, warnings: s };
    } catch (a) {
      throw new Error(`Provider selection failed: ${a instanceof Error ? a.message : "Unknown error"}`);
    }
  }
  async tryFallbackProviders(e, t, n) {
    for (let o of t) try {
      let r = { provider: o, processingApplied: ["Fallback provider selection"], degradations: ["Using fallback provider due to primary provider failure"], warnings: [] }, s = await this.preprocessRequest(e, o, { fallbackBehavior: "degrade" });
      return { response: await o.chat(s, n), routing: r };
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
var qn = [];
var Dr = () => structuredClone({ model: "mistralai/Mixtral-8x7B-Instruct-v0.1", ...O() });
var ze = class extends _ {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Together API key not set");
    let s = { ...Dr(), ...t };
    r = [...qn, ...r ?? []];
    let a = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    super({ apiKey: e, config: s, options: n, apiURL: "https://api.together.xyz/v1", modelInfo: r, models: o, supportFor: a }), super.setName("Together");
  }
};
var kt = ((c) => (c.Llama31_8B_Instruct = "Llama-3.1-8B-Instruct-q4f32_1-MLC", c.Llama31_70B_Instruct = "Llama-3.1-70B-Instruct-q4f16_1-MLC", c.Llama32_1B_Instruct = "Llama-3.2-1B-Instruct-q4f32_1-MLC", c.Llama32_3B_Instruct = "Llama-3.2-3B-Instruct-q4f32_1-MLC", c.Mistral7B_Instruct = "Mistral-7B-Instruct-v0.3-q4f32_1-MLC", c.Phi35_Mini_Instruct = "Phi-3.5-mini-instruct-q4f32_1-MLC", c.Gemma2_2B_Instruct = "gemma-2-2b-it-q4f32_1-MLC", c.Gemma2_9B_Instruct = "gemma-2-9b-it-q4f32_1-MLC", c.Qwen2_5_0_5B_Instruct = "Qwen2.5-0.5B-Instruct-q4f32_1-MLC", c.Qwen2_5_1_5B_Instruct = "Qwen2.5-1.5B-Instruct-q4f32_1-MLC", c.Qwen2_5_3B_Instruct = "Qwen2.5-3B-Instruct-q4f32_1-MLC", c.Qwen2_5_7B_Instruct = "Qwen2.5-7B-Instruct-q4f32_1-MLC", c))(kt || {});
var zn = [{ name: "Llama-3.1-8B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 4096 }, { name: "Llama-3.1-70B-Instruct-q4f16_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 4096, isExpensive: true }, { name: "Llama-3.2-1B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 2048 }, { name: "Llama-3.2-3B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 2048 }, { name: "Mistral-7B-Instruct-v0.3-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 4096 }, { name: "Phi-3.5-mini-instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 128e3, maxTokens: 4096 }, { name: "gemma-2-2b-it-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 8192, maxTokens: 2048 }, { name: "gemma-2-9b-it-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 8192, maxTokens: 2048 }, { name: "Qwen2.5-0.5B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 2048 }, { name: "Qwen2.5-1.5B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 2048 }, { name: "Qwen2.5-3B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 2048 }, { name: "Qwen2.5-7B-Instruct-q4f32_1-MLC", currency: "usd", promptTokenCostPer1M: 0, completionTokenCostPer1M: 0, contextWindow: 32768, maxTokens: 4096 }];
var Lr = () => structuredClone({ model: "Llama-3.2-3B-Instruct-q4f32_1-MLC", ...O() });
var di = () => structuredClone({ model: "Llama-3.2-3B-Instruct-q4f32_1-MLC", ...N() });
var jn = class {
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
      typeof a.content == "string" ? l = a.content : Array.isArray(a.content) && (l = a.content.filter((u) => u.type === "text").map((u) => u.text).join(`
`));
      let p = { role: a.role, content: l };
      return a.role === "assistant" && a.functionCalls?.length ? { ...p, tool_calls: a.functionCalls.map((u) => ({ id: u.id, type: "function", function: { name: u.function.name, arguments: typeof u.function.params == "string" ? u.function.params : JSON.stringify(u.function.params || {}) } })) } : p;
    }), o = e.functions?.map((a) => ({ type: "function", function: { name: a.name, description: a.description, parameters: a.parameters || { type: "object", properties: {} } } })), r = { name: "/chat/completions", localCall: async (a, l) => {
      try {
        let p = await this.engine.chat.completions.create({ ...a, stream: l || false });
        return l ? new ReadableStream({ async start(u) {
          try {
            for await (let d of p) u.enqueue(d);
            u.close();
          } catch (d) {
            u.error(d);
          }
        } }) : p;
      } catch (p) {
        throw new Error(`WebLLM API error: ${p}`);
      }
    } }, s = { model: t, messages: n, ...o?.length ? { tools: o } : {}, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, ...e.modelConfig?.temperature !== void 0 ? { temperature: e.modelConfig.temperature } : {}, ...e.modelConfig?.topP !== void 0 ? { top_p: e.modelConfig.topP } : {}, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, stop: e.modelConfig?.stopSequences ?? this.config.stopSequences, stream: e.modelConfig?.stream ?? this.config.stream, n: e.modelConfig?.n ?? this.config.n };
    return [r, s];
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
    let s = n.message.tool_calls?.map((a) => ({ id: a.id, type: "function", function: { name: a.function.name, params: a.function.arguments } }));
    return { index: o, id: e.id, content: n.message.content || "", functionCalls: s, finishReason: r };
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
    let s = n.toolCalls?.map((l) => ({ id: l.id || "", type: "function", function: { name: l.function?.name || "", params: l.function?.arguments || "" } }));
    return { results: [{ index: 0, id: e.id, content: n.content || "", functionCalls: s, finishReason: r }], remoteId: e.id };
  };
  createEmbedResp(e) {
    throw new Error("WebLLM does not support embeddings");
  }
};
var je = class extends D {
  constructor({ engine: e, config: t, options: n, models: o }) {
    if (!e) throw new Error("WebLLM engine instance is required");
    let r = { ...Lr(), ...t }, s = new jn(r, e);
    super(s, { name: "WebLLM", apiURL: void 0, headers: async () => ({}), modelInfo: zn, defaults: { model: r.model }, supportFor: (a) => ({ functions: true, streaming: true, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true }), options: n, models: o });
  }
};
var Et = ((o) => (o.Grok3 = "grok-3", o.Grok3Mini = "grok-3-mini", o.Grok3Fast = "grok-3-fast", o.Grok3MiniFast = "grok-3-mini-fast", o))(Et || {});
var Nr = ((e) => (e.GrokEmbedSmall = "grok-embed-small", e))(Nr || {});
var Hn = [{ name: "grok-3", currency: "USD", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "grok-3-mini", currency: "USD", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.5, supported: { thinkingBudget: true } }, { name: "grok-3-fast", currency: "USD", promptTokenCostPer1M: 5, completionTokenCostPer1M: 25 }, { name: "grok-3-mini-fast", currency: "USD", promptTokenCostPer1M: 0.6, completionTokenCostPer1M: 4, supported: { thinkingBudget: true } }];
var Kn = () => structuredClone({ model: "grok-3-mini", ...O() });
var mi = () => structuredClone({ ...Kn(), model: "grok-3" });
var He = class extends _ {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Grok API key not set");
    let s = { ...Kn(), ...t };
    r = [...Hn, ...r ?? []];
    let a = (p) => {
      let u = W({ model: p, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: u?.supported?.thinkingBudget ?? false, hasShowThoughts: u?.supported?.showThoughts ?? false, media: { images: { supported: false, formats: [] }, audio: { supported: false, formats: [] }, files: { supported: false, formats: [], uploadMethod: "none" }, urls: { supported: false, webSearch: false, contextFetching: false } }, caching: { supported: false, types: [] }, thinking: false, multiTurn: true };
    }, l = (p) => {
      if (n?.searchParameters) {
        let u = n.searchParameters;
        return { ...p, search_parameters: { mode: u.mode, return_citations: u.returnCitations, from_date: u.fromDate, to_date: u.toDate, max_search_results: u.maxSearchResults, sources: u.sources?.map((d) => ({ type: d.type, country: d.country, excluded_websites: d.excludedWebsites, allowed_websites: d.allowedWebsites, safe_search: d.safeSearch, x_handles: d.xHandles, links: d.links })) } };
      }
      return p;
    };
    super({ apiKey: e, config: s, options: n, apiURL: "https://api.x.ai/v1", modelInfo: r, models: o, supportFor: a, chatReqUpdater: l }), super.setName("Grok");
  }
};
function gi(i10) {
  return Pt.create(i10);
}
var Pt = class i5 {
  ai;
  static create(e) {
    return new i5(e);
  }
  constructor(e) {
    switch (e.name) {
      case "openai":
        this.ai = new Me(e);
        break;
      case "openai-responses":
        this.ai = new Ue(e);
        break;
      case "azure-openai":
        this.ai = new ke(e);
        break;
      case "grok":
        this.ai = new He(e);
        break;
      case "huggingface":
        this.ai = new Le(e);
        break;
      case "groq":
        this.ai = new De(e);
        break;
      case "together":
        this.ai = new ze(e);
        break;
      case "openrouter":
        this.ai = new Be(e);
        break;
      case "cohere":
        this.ai = new Ee(e);
        break;
      case "google-gemini":
        this.ai = new Fe(e);
        break;
      case "anthropic":
        this.ai = new we(e);
        break;
      case "mistral":
        this.ai = new Ne(e);
        break;
      case "deepseek":
        this.ai = new Pe(e);
        break;
      case "ollama":
        this.ai = new Ge(e);
        break;
      case "reka":
        this.ai = new qe(e);
        break;
      case "webllm":
        this.ai = new je(e);
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
var Q = class {
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
    return this.tracer ? await this.tracer.startActiveSpan("DB Upsert Request", { kind: SpanKind.SERVER, attributes: { [v.DB_SYSTEM]: this.name, [v.DB_OPERATION_NAME]: "upsert", [v.DB_TABLE]: e.table, [v.DB_NAMESPACE]: e.namespace, [v.DB_OPERATION_NAME]: t ? "update" : "insert" } }, async (n) => {
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
    return this.tracer ? await this.tracer.startActiveSpan("DB Batch Upsert Request", { kind: SpanKind.SERVER, attributes: { [v.DB_SYSTEM]: this.name, [v.DB_OPERATION_NAME]: "upsert", [v.DB_TABLE]: e[0].table, [v.DB_NAMESPACE]: e[0].namespace, [v.DB_OPERATION_NAME]: t ? "update" : "insert" } }, async (n) => {
      try {
        return await this._batchUpsert(e, t, { span: n });
      } finally {
        n.end();
      }
    }) : await this._batchUpsert(e, t);
  }
  async query(e) {
    if (!this._query) throw new Error("query() not implemented");
    return this.tracer ? await this.tracer.startActiveSpan("DB Query Request", { kind: SpanKind.SERVER, attributes: { [v.DB_SYSTEM]: this.name, [v.DB_OPERATION_NAME]: "upsert", [v.DB_TABLE]: e.table, [v.DB_NAMESPACE]: e.namespace, [v.DB_OPERATION_NAME]: "query" } }, async (t) => {
      try {
        return await this._query(e, { span: t });
      } finally {
        t.end();
      }
    }) : await this._query(e);
  }
};
var Vn = "https://api.cloudflare.com/client/v4/accounts/";
var Ke = class extends Q {
  apiKey;
  accountId;
  constructor({ apiKey: e, accountId: t, fetch: n, tracer: o }) {
    if (!e || !t) throw new Error("Cloudflare credentials not set");
    super({ name: "Cloudflare", fetch: n, tracer: o }), this.apiKey = e, this.accountId = t;
  }
  _upsert = async (e, t, n) => {
    let o = await q({ url: new URL(`${this.accountId}/vectorize/indexes/${e.table}/upsert`, Vn), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: n?.span }, { id: e.id, values: e.values, namespace: e.namespace, metadata: e.metadata });
    if (o.errors) throw new Error(`Cloudflare upsert failed: ${o.errors.map(({ message: r }) => r).join(", ")}`);
    return { ids: o.result.ids };
  };
  batchUpsert = async (e, t, n) => {
    if (t) throw new Error("Weaviate does not support batch update");
    if (e.length < 1) throw new Error("Batch request is empty");
    if (!e[0] || !e[0].table) throw new Error("Table name is empty");
    let o = e[0].table, r = await q({ url: new URL(`${this.accountId}/vectorize/indexes/${o}/upsert`, Vn), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: n?.span }, e.map((s) => ({ id: s.id, values: s.values, namespace: s.namespace, metadata: s.metadata })));
    if (r.errors) throw new Error(`Cloudflare batch upsert failed: ${r.errors.map(({ message: s }) => s).join(", ")}`);
    return { ids: r.result.ids };
  };
  query = async (e, t) => {
    let n = await q({ url: new URL(`${this.accountId}/vectorize/indexes/${e.table}/query`, Vn), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: t?.span }, { vector: e.values, topK: e.limit || 10, returnValues: true });
    if (n.errors) throw new Error(`Cloudflare query failed: ${n.errors.map(({ message: r }) => r).join(", ")}`);
    return { matches: n.result.matches.map(({ id: r, score: s, values: a, metadata: l }) => ({ id: r, score: s, values: a, metadata: l })) };
  };
};
var ie = class extends Q {
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
      let s = await this.upsert(r, t);
      o.push(...s.ids);
    }
    return { ids: o };
  };
  _query = async (e, t) => {
    let n = this.state[e.table];
    if (!n) return { matches: [] };
    let o = [];
    return Object.entries(n).forEach(([r, s]) => {
      if (e.values && s.values) {
        let a = hi(e.values, s.values);
        o.push({ id: r, score: a, metadata: s.metadata });
      }
    }), o.sort((r, s) => r.score - s.score), e.limit && (o.length = e.limit), { matches: o };
  };
  getDB = () => structuredClone(this.state);
  setDB = (e) => {
    this.state = structuredClone(e);
  };
  clearDB = () => {
    this.state = {};
  };
};
var hi = (i10, e) => {
  if (i10.length !== e.length) throw new Error("Vectors must be of the same length.");
  let t = 0, n = 0, o = 0, r = true, s = true, a = new Float64Array(i10), l = new Float64Array(e);
  for (let c = 0; c < a.length; c++) t += a[c] * l[c], n += a[c] * a[c], o += l[c] * l[c], a[c] !== 0 && (r = false), l[c] !== 0 && (s = false);
  if (r || s) return 1;
  let p = Math.sqrt(n), u = Math.sqrt(o);
  return 1 - t / (p * u);
};
var fi = (i10) => ({ namespace: i10.namespace, topK: i10.limit || 10, filter: {}, includeValues: true, includeMetadata: true, vector: i10.values ?? [], id: i10.id });
var We = class extends Q {
  apiKey;
  apiURL;
  constructor({ apiKey: e, host: t, fetch: n, tracer: o }) {
    if (!e || e === "") throw new Error("Pinecone API key not set");
    super({ name: "Pinecone", fetch: n, tracer: o }), this.apiKey = e, this.apiURL = t;
  }
  _upsert = async (e, t, n) => (await this._batchUpsert([e], t, n), { ids: [e.id] });
  _batchUpsert = async (e, t, n) => {
    if (e.length === 0) throw new Error("Batch request is empty");
    return await q({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/vectors/upsert", fetch: this.fetch, span: n?.span }, e.map(({ id: o, values: r = [], metadata: s }) => ({ id: o, values: r, metadata: s }))), { ids: e.map(({ id: o }) => o) };
  };
  query = async (e, t) => {
    if (e.text) throw new Error("Pinecone does not support text");
    return { matches: (await q({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/query", fetch: this.fetch, span: t?.span }, fi(e))).matches.map(({ id: r, score: s, values: a, metadata: l }) => ({ id: r, score: s, metadata: l, values: a })) };
  };
};
var Ve = class extends Q {
  apiKey;
  apiURL;
  constructor({ apiKey: e, host: t, fetch: n, tracer: o }) {
    if (!e || e === "") throw new Error("Weaviate API key not set");
    super({ name: "Weaviate", fetch: n, tracer: o }), this.apiKey = e, this.apiURL = t;
  }
  _upsert = async (e, t, n) => {
    let o = await q({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: `/v1/objects/${e.table}/${e.id}`, put: !!t, fetch: this.fetch, span: n?.span }, { id: e.id, class: e.table, tenant: e.namespace, vector: e.values, properties: e.metadata ?? {} });
    if (o?.result?.errors) throw new Error(`Weaviate upsert failed: ${o.result.errors.error.map(({ message: r }) => r).join(", ")}`);
    return { ids: [o.id] };
  };
  _batchUpsert = async (e, t, n) => {
    if (t) throw new Error("Weaviate does not support batch update");
    if (e.length === 0) throw new Error("Batch request is empty");
    let o = e.map((s) => ({ id: s.id, class: s.table, tenant: s.namespace, vector: s.values, properties: s.metadata ?? {} })), r = await q({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/v1/batch/objects", fetch: this.fetch, span: n?.span }, { objects: o });
    if (r?.some(({ result: s }) => s?.errors)) throw new Error(`Weaviate batch upsert failed: ${r.map(({ result: s }) => s?.errors?.error.map(({ message: a }) => a).join(", ")).join(", ")}`);
    return { ids: r.map(({ id: s }) => s) };
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
    let o = await q({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/v1/graphql", fetch: this.fetch, span: t?.span }, { query: `{
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
var Jn = class {
  db;
  constructor(e) {
    switch (e.name) {
      case "weaviate":
        this.db = new Ve(e);
        break;
      case "pinecone":
        this.db = new We(e);
        break;
      case "cloudflare":
        this.db = new Ke(e);
        break;
      case "memory":
        this.db = new ie(e);
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
var Qn = "_internal";
var Yn = class {
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

`) : e, o = this.chunker(n).filter((p) => p.length > 0), r = t?.maxWordsPerChunk, s = t?.minWordsPerChunk, a = Ai({ initialChunks: o, minWordsPerChunk: s, maxWordsPerChunk: r }), l = t?.batchSize ?? 10;
      for (let p = 0; p < a.length; p += l) {
        let u = a.slice(p, p + l), c = (await this.ai.embed({ texts: u }, { abortSignal: t?.abortSignal })).embeddings.map((m, g) => ({ id: `chunk_${Date.now() + g}`, table: Qn, values: m, metadata: { text: u[g] ?? "" } })).filter((m) => m.metadata?.text && m.metadata?.text.length > 0);
        await this.db.batchUpsert(c);
      }
    } catch (n) {
      throw new Error(`Error processing text: ${n}`);
    }
  };
  query = async (e, { topPercent: t, abortSignal: n } = {}) => {
    let o = Array.isArray(e) ? e : [e];
    if (typeof o[0] == "string" && this.rewriter) for (let [l, p] of o.entries()) {
      let { rewrittenQuery: u } = await this.rewriter.forward(this.ai, { query: p });
      o[l] = u;
    }
    let r;
    typeof o[0] == "string" ? r = (await this.ai.embed({ texts: o }, { abortSignal: n })).embeddings.map((p) => this.db.query({ table: Qn, values: p })) : r = o.map((l) => this.db.query({ table: Qn, values: l }));
    let s = await Promise.all(r), a = [];
    for (let { matches: l } of s) {
      let p = l.filter((c) => c.metadata?.text && c.metadata?.text.length > 0).map(({ score: c, metadata: m }) => ({ score: c, text: m?.text ?? "" })), u = t && t > 1 ? t / 100 : t, d = u ? xi(p, u) : p;
      if (this.reranker) {
        let { rankedItems: c } = await this.reranker.forward(this.ai, { query: o[0], items: d.map((g) => g.text) }), m = c.map((g) => d.find((h) => h.text === g)).filter((g) => g !== void 0);
        a.push(m);
      } else a.push(d);
    }
    return a;
  };
};
var Ai = ({ initialChunks: i10, maxWordsPerChunk: e = 350, minWordsPerChunk: t = 250 }) => {
  let n = [], o = "", r = 0;
  return i10.forEach((s) => {
    let a = s.split(/\s+/), l = a.length;
    if (r + l <= e) o += `${s}

`, r += l;
    else if (r > 0 && r + l <= e * 1.5) o += `${s}

`, r += l;
    else if (r > t && (n.push(o.trim()), o = "", r = 0), l > e) {
      let p = a;
      for (; p.length > e * 1.5; ) {
        let u = p.splice(0, e);
        n.push(u.join(" "));
      }
      p.length > 0 && (o += `${p.join(" ")}

`, r += p.length);
    } else o = `${s}

`, r = l;
  }), (r > t || n.length === 0) && n.push(o.trim()), n;
};
var xi = (i10, e = 0.1) => {
  let t = [...i10].sort((o, r) => o.score - r.score), n = Math.ceil(t.length * e);
  return t.slice(0, n);
};
var Je = class {
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
    let s = r.chat.find((a) => a.index === o);
    if (!s) {
      r.chat.push({ index: o, value: structuredClone({ content: e, name: t, functionCalls: n }) });
      return;
    }
    typeof e == "string" && e.trim() !== "" && (s.value.content = e), typeof t == "string" && t.trim() !== "" && (s.value.name = t), Array.isArray(n) && n.length > 0 && (s.value.functionCalls = n);
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
      n === "function" ? r = o.filter((s) => s.index === e).map((s) => s.value) : r = o.find((s) => s.index === e)?.value, Array.isArray(r) && r.length > 0 ? t.push(...r.map((s) => ({ ...s, role: n }))) : typeof r == "object" && r !== null && t.push({ ...r, role: n });
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
var Qe = class {
  memories = /* @__PURE__ */ new Map();
  defaultMemory;
  constructor() {
    this.defaultMemory = new Je();
  }
  getMemory(e) {
    return e ? (this.memories.has(e) || this.memories.set(e, new Je()), this.memories.get(e)) : this.defaultMemory;
  }
  addRequest(e, t) {
    for (let n of e) Ce(n);
    this.getMemory(t).addRequest(e, 0);
  }
  addResponse(e, t) {
    pn(e), this.getMemory(t).addResponse(e);
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
    e ? this.memories.set(e, new Je()) : this.defaultMemory.reset();
  }
};
var ae = class extends Error {
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
var Ft = async (i10, e) => {
  for (let t of i10) {
    let { fn: n, message: o } = t, r = await n(e);
    if (r !== void 0 && !r) throw o ? new ae({ message: o }) : new Error("Assertion Failed: No message provided for assertion");
  }
};
var Xn = async (i10, e, t, n = false) => {
  if (!e.currField || e.s === -1 || !i10 || i10.length === 0) return;
  let o = i10.filter((s) => s.fieldName === e.currField?.name);
  if (o.length === 0) return;
  let r = t.substring(e.s);
  for (let s of o) {
    let { message: a, fn: l } = s, p = await l(r, n);
    if (p !== void 0 && !p && a) throw new ae({ message: a });
  }
};
var Gr = { enabled: true, enabledCategories: ["generation", "streaming", "functions", "errors", "performance"], maxLabelLength: 100, samplingRate: 1 };
var Ye;
var Zn = (i10) => {
  if (Ye) return Ye;
  let e = i10 ?? M.meter;
  if (e) return Ye = Ii(e), Ye;
};
var yi = () => {
  let i10 = [];
  return M.meter || i10.push("Global meter not initialized"), !Ye && M.meter && i10.push("Metrics instruments not created despite available meter"), { healthy: i10.length === 0, issues: i10 };
};
var Ii = (i10) => ({ generationLatencyHistogram: i10.createHistogram("ax_gen_generation_duration_ms", { description: "End-to-end duration of AxGen generation requests", unit: "ms" }), generationRequestsCounter: i10.createCounter("ax_gen_generation_requests_total", { description: "Total number of AxGen generation requests" }), generationErrorsCounter: i10.createCounter("ax_gen_generation_errors_total", { description: "Total number of failed AxGen generations" }), multiStepGenerationsCounter: i10.createCounter("ax_gen_multistep_generations_total", { description: "Total number of generations that required multiple steps" }), stepsPerGenerationHistogram: i10.createHistogram("ax_gen_steps_per_generation", { description: "Number of steps taken per generation" }), maxStepsReachedCounter: i10.createCounter("ax_gen_max_steps_reached_total", { description: "Total number of generations that hit max steps limit" }), validationErrorsCounter: i10.createCounter("ax_gen_validation_errors_total", { description: "Total number of validation errors encountered" }), assertionErrorsCounter: i10.createCounter("ax_gen_assertion_errors_total", { description: "Total number of assertion errors encountered" }), errorCorrectionAttemptsHistogram: i10.createHistogram("ax_gen_error_correction_attempts", { description: "Number of error correction attempts per generation" }), errorCorrectionSuccessCounter: i10.createCounter("ax_gen_error_correction_success_total", { description: "Total number of successful error corrections" }), errorCorrectionFailureCounter: i10.createCounter("ax_gen_error_correction_failure_total", { description: "Total number of failed error corrections" }), maxRetriesReachedCounter: i10.createCounter("ax_gen_max_retries_reached_total", { description: "Total number of generations that hit max retries limit" }), functionsEnabledGenerationsCounter: i10.createCounter("ax_gen_functions_enabled_generations_total", { description: "Total number of generations with functions enabled" }), functionCallStepsCounter: i10.createCounter("ax_gen_function_call_steps_total", { description: "Total number of steps that included function calls" }), functionsExecutedPerGenerationHistogram: i10.createHistogram("ax_gen_functions_executed_per_generation", { description: "Number of unique functions executed per generation" }), functionErrorCorrectionCounter: i10.createCounter("ax_gen_function_error_correction_total", { description: "Total number of function-related error corrections" }), fieldProcessorsExecutedCounter: i10.createCounter("ax_gen_field_processors_executed_total", { description: "Total number of field processors executed" }), streamingFieldProcessorsExecutedCounter: i10.createCounter("ax_gen_streaming_field_processors_executed_total", { description: "Total number of streaming field processors executed" }), streamingGenerationsCounter: i10.createCounter("ax_gen_streaming_generations_total", { description: "Total number of streaming generations" }), streamingDeltasEmittedCounter: i10.createCounter("ax_gen_streaming_deltas_emitted_total", { description: "Total number of streaming deltas emitted" }), streamingFinalizationLatencyHistogram: i10.createHistogram("ax_gen_streaming_finalization_duration_ms", { description: "Duration of streaming response finalization", unit: "ms" }), samplesGeneratedHistogram: i10.createHistogram("ax_gen_samples_generated", { description: "Number of samples generated per request" }), resultPickerUsageCounter: i10.createCounter("ax_gen_result_picker_usage_total", { description: "Total number of times result picker was used" }), resultPickerLatencyHistogram: i10.createHistogram("ax_gen_result_picker_duration_ms", { description: "Duration of result picker execution", unit: "ms" }), inputFieldsGauge: i10.createGauge("ax_gen_input_fields", { description: "Number of input fields in signature" }), outputFieldsGauge: i10.createGauge("ax_gen_output_fields", { description: "Number of output fields in signature" }), examplesUsedGauge: i10.createGauge("ax_gen_examples_used", { description: "Number of examples used in generation" }), demosUsedGauge: i10.createGauge("ax_gen_demos_used", { description: "Number of demos used in generation" }), promptRenderLatencyHistogram: i10.createHistogram("ax_gen_prompt_render_duration_ms", { description: "Duration of prompt template rendering", unit: "ms" }), extractionLatencyHistogram: i10.createHistogram("ax_gen_extraction_duration_ms", { description: "Duration of value extraction from responses", unit: "ms" }), assertionLatencyHistogram: i10.createHistogram("ax_gen_assertion_duration_ms", { description: "Duration of assertion checking", unit: "ms" }), stateCreationLatencyHistogram: i10.createHistogram("ax_gen_state_creation_duration_ms", { description: "Duration of state creation for multiple samples", unit: "ms" }), memoryUpdateLatencyHistogram: i10.createHistogram("ax_gen_memory_update_duration_ms", { description: "Duration of memory updates during generation", unit: "ms" }) });
var _t = Gr;
var bi = (i10) => {
  _t = { ..._t, ...i10 };
};
var Ti = () => ({ ..._t });
var Y = (i10) => {
  let e = {};
  for (let [t, n] of Object.entries(i10)) if (n != null) {
    let o = String(n), r = _t.maxLabelLength;
    e[t] = o.length > r ? o.substring(0, r) : o;
  }
  return e;
};
var $r = (i10, e, t, n, o, r) => {
  try {
    let s = Y({ success: t.toString(), ...n ? { signature: n } : {}, ...o ? { ai_service: o } : {}, ...r ? { model: r } : {} });
    i10.generationLatencyHistogram && i10.generationLatencyHistogram.record(e, s), i10.generationRequestsCounter && i10.generationRequestsCounter.add(1, s), !t && i10.generationErrorsCounter && i10.generationErrorsCounter.add(1, s);
  } catch (s) {
    console.warn("Failed to record generation metric:", s);
  }
};
var Dt = (i10, e, t, n) => {
  try {
    let o = Y({ ...n ? { signature: n } : {} });
    e > 1 && i10.multiStepGenerationsCounter && i10.multiStepGenerationsCounter.add(1, o), i10.stepsPerGenerationHistogram && i10.stepsPerGenerationHistogram.record(e, o), e >= t && i10.maxStepsReachedCounter && i10.maxStepsReachedCounter.add(1, o);
  } catch (o) {
    console.warn("Failed to record multi-step metric:", o);
  }
};
var eo = (i10, e, t) => {
  try {
    let n = Y({ error_type: e, ...t ? { signature: t } : {} });
    e === "validation" && i10.validationErrorsCounter && i10.validationErrorsCounter.add(1, n), e === "assertion" && i10.assertionErrorsCounter && i10.assertionErrorsCounter.add(1, n);
  } catch (n) {
    console.warn("Failed to record validation error metric:", n);
  }
};
var Ur = (i10, e) => {
  try {
    let t = Y({ error_type: "refusal", ...e ? { signature: e } : {} });
    i10.validationErrorsCounter && i10.validationErrorsCounter.add(1, t);
  } catch (t) {
    console.warn("Failed to record refusal error metric:", t);
  }
};
var to = (i10, e, t, n, o) => {
  try {
    let r = Y({ success: t.toString(), ...o ? { signature: o } : {} });
    i10.errorCorrectionAttemptsHistogram && i10.errorCorrectionAttemptsHistogram.record(e, r), t && i10.errorCorrectionSuccessCounter && i10.errorCorrectionSuccessCounter.add(1, r), t || (i10.errorCorrectionFailureCounter && i10.errorCorrectionFailureCounter.add(1, r), e >= n && i10.maxRetriesReachedCounter && i10.maxRetriesReachedCounter.add(1, r));
  } catch (r) {
    console.warn("Failed to record error correction metric:", r);
  }
};
var Br = (i10, e, t, n, o = false, r) => {
  try {
    let s = Y({ functions_enabled: e.toString(), had_function_calls: n.toString(), ...r ? { signature: r } : {} });
    e && i10.functionsEnabledGenerationsCounter && i10.functionsEnabledGenerationsCounter.add(1, s), n && i10.functionCallStepsCounter && i10.functionCallStepsCounter.add(1, s), t > 0 && i10.functionsExecutedPerGenerationHistogram && i10.functionsExecutedPerGenerationHistogram.record(t, s), o && i10.functionErrorCorrectionCounter && i10.functionErrorCorrectionCounter.add(1, s);
  } catch (s) {
    console.warn("Failed to record function calling metric:", s);
  }
};
var qr = (i10, e, t, n) => {
  try {
    let o = Y({ ...n ? { signature: n } : {} });
    e > 0 && i10.fieldProcessorsExecutedCounter && i10.fieldProcessorsExecutedCounter.add(e, o), t > 0 && i10.streamingFieldProcessorsExecutedCounter && i10.streamingFieldProcessorsExecutedCounter.add(t, o);
  } catch (o) {
    console.warn("Failed to record field processing metric:", o);
  }
};
var zr = (i10, e, t, n, o) => {
  try {
    let r = Y({ is_streaming: e.toString(), ...o ? { signature: o } : {} });
    e && i10.streamingGenerationsCounter && i10.streamingGenerationsCounter.add(1, r), t > 0 && i10.streamingDeltasEmittedCounter && i10.streamingDeltasEmittedCounter.add(t, r), n && i10.streamingFinalizationLatencyHistogram && i10.streamingFinalizationLatencyHistogram.record(n, r);
  } catch (r) {
    console.warn("Failed to record streaming metric:", r);
  }
};
var jr = (i10, e, t, n, o) => {
  try {
    let r = Y({ result_picker_used: t.toString(), ...o ? { signature: o } : {} });
    i10.samplesGeneratedHistogram && i10.samplesGeneratedHistogram.record(e, r), t && i10.resultPickerUsageCounter && i10.resultPickerUsageCounter.add(1, r), n && i10.resultPickerLatencyHistogram && i10.resultPickerLatencyHistogram.record(n, r);
  } catch (r) {
    console.warn("Failed to record samples metric:", r);
  }
};
var Hr = (i10, e, t, n, o, r) => {
  try {
    let s = Y({ ...r ? { signature: r } : {} });
    i10.inputFieldsGauge && i10.inputFieldsGauge.record(e, s), i10.outputFieldsGauge && i10.outputFieldsGauge.record(t, s), i10.examplesUsedGauge && i10.examplesUsedGauge.record(n, s), i10.demosUsedGauge && i10.demosUsedGauge.record(o, s);
  } catch (s) {
    console.warn("Failed to record signature complexity metrics:", s);
  }
};
var Lt = (i10, e, t, n) => {
  try {
    let o = Y({ metric_type: e, ...n ? { signature: n } : {} });
    switch (e) {
      case "prompt_render":
        i10.promptRenderLatencyHistogram && i10.promptRenderLatencyHistogram.record(t, o);
        break;
      case "extraction":
        i10.extractionLatencyHistogram && i10.extractionLatencyHistogram.record(t, o);
        break;
      case "assertion":
        i10.assertionLatencyHistogram && i10.assertionLatencyHistogram.record(t, o);
        break;
      case "state_creation":
        i10.stateCreationLatencyHistogram && i10.stateCreationLatencyHistogram.record(t, o);
        break;
      case "memory_update":
        i10.memoryUpdateLatencyHistogram && i10.memoryUpdateLatencyHistogram.record(t, o);
        break;
    }
  } catch (o) {
    console.warn("Failed to record performance metric:", o);
  }
};
var G = class extends Error {
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
var Kr = ({ error: i10, errCount: e, debug: t, logger: n, metricsInstruments: o, signatureName: r, span: s }) => {
  let a = i10.getFixingInstructions();
  if (t && n) {
    let l = a?.map((p) => p.title).join(", ") ?? "";
    Wo(i10, e, l, n);
  }
  return o && eo(o, "validation", r), s && s.addEvent("validation.error", { message: i10.toString(), fixing_instructions: a?.map((l) => l.title).join(", ") ?? "" }), a;
};
var Wr = ({ error: i10, errCount: e, debug: t, logger: n, metricsInstruments: o, signatureName: r, span: s }) => {
  let a = i10.getFixingInstructions();
  if (t && n) {
    let l = a?.map((p) => p.title).join(", ") ?? "";
    Vo(i10, e, l, n);
  }
  return o && eo(o, "assertion", r), s && s.addEvent("assertion.error", { message: i10.toString(), fixing_instructions: a?.map((l) => l.title).join(", ") ?? "" }), a;
};
var Vr = ({ error: i10, errCount: e, debug: t, logger: n, metricsInstruments: o, signatureName: r, span: s }) => {
  t && n && Jo(i10, e, n), o && Ur(o, r), s && s.addEvent("refusal.error", { message: i10.toString() });
};
var Jr = (i10) => {
  let e = [], t = (n, o = "") => {
    if (!n || typeof n != "object") return;
    let r = ["array", "integer", "number", "string", "boolean", "null", "object"];
    if (n.anyOf && Array.isArray(n.anyOf)) {
      n.anyOf.length === 0 && e.push({ path: o || "root", issue: "anyOf array is empty", fix: "Add at least one schema to the anyOf array", example: 'anyOf: [{ type: "string" }, { type: "null" }]' }), n.anyOf.forEach((s, a) => {
        t(s, `${o}anyOf[${a}].`);
      });
      return;
    }
    if (n.oneOf && Array.isArray(n.oneOf)) {
      n.oneOf.length === 0 && e.push({ path: o || "root", issue: "oneOf array is empty", fix: "Add at least one schema to the oneOf array", example: 'oneOf: [{ type: "string" }, { type: "number" }]' }), n.oneOf.forEach((s, a) => {
        t(s, `${o}oneOf[${a}].`);
      });
      return;
    }
    if (n.allOf && Array.isArray(n.allOf)) {
      n.allOf.length === 0 && e.push({ path: o || "root", issue: "allOf array is empty", fix: "Add at least one schema to the allOf array", example: 'allOf: [{ type: "object" }, { properties: { name: { type: "string" } } }]' }), n.allOf.forEach((s, a) => {
        t(s, `${o}allOf[${a}].`);
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
        else for (let s in n.properties) {
          let a = n.properties[s];
          if (a != null) {
            if (typeof a != "object") {
              e.push({ path: `${o}${s}`, issue: `Property schema must be an object, got ${typeof a}`, fix: "Define the property as a proper schema object", example: `${s}: { type: "string", description: "..." }` });
              continue;
            }
            t(a, `${o}${s}.`);
          }
        }
        if (n.required) {
          if (!Array.isArray(n.required)) e.push({ path: o || "root", issue: `'required' must be an array, got ${typeof n.required}`, fix: "Change required to be an array of property names", example: 'required: ["name", "email"] instead of required: "name,email"' });
          else if (n.required.length !== 0) {
            if (n.properties) for (let s of n.required) typeof s != "string" ? e.push({ path: `${o}required`, issue: `Required property names must be strings, got ${typeof s}`, fix: "Ensure all items in required array are strings", example: 'required: ["name", "email"] not required: [123, "email"]' }) : s in n.properties || e.push({ path: `${o}required`, issue: `Required property '${s}' is not defined in properties`, fix: `Either add '${s}' to properties or remove it from required`, example: `properties: { ${s}: { type: "string" } }` });
          }
        }
      }
      n.type === "array" && (n.items ? typeof n.items != "object" ? e.push({ path: `${o}items`, issue: `Array items schema must be an object, got ${typeof n.items}`, fix: "Define items as a proper schema object", example: 'items: { type: "string" } or items: { type: "object", properties: {...} }' }) : t(n.items, `${o}items.`) : e.push({ path: o || "root", issue: 'Array schema is missing an "items" definition (required by JSON Schema and all LLM providers for function tools)', fix: 'Add an "items" schema describing the array element type, e.g., items: { type: "string" } or items: { type: "object", properties: { ... } }', example: ['type: "array",', 'description: "List of step strings"', 'items: { type: "string" }'].join(`
`) }));
    }
  };
  if (t(i10), e.length > 0) {
    let n = ["JSON Schema validation failed:", "", ...e.map((o, r) => {
      let s = [`${r + 1}. Path: ${o.path}`, `   Issue: ${o.issue}`, `   Fix: ${o.fix}`];
      return o.example && s.push(`   Example: ${o.example}`), s.join(`
`);
    }), "", "Please fix these issues and try again."].join(`
`);
    throw new Error(n);
  }
};
var Nt = class extends Error {
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
var Xe = class extends Error {
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
var Gt = class {
  funcList = [];
  constructor(e) {
    this.funcList = e;
  }
  executeFunction = async (e, t, n) => {
    let o;
    typeof t.args == "string" && t.args.length > 0 ? o = JSON.parse(t.args) : o = t.args;
    let r = n ? { sessionId: n.sessionId, traceId: n.traceId, ai: n.ai } : void 0, s;
    return e.parameters ? s = e.func.length === 2 ? await e.func(o, r) : await e.func(o) : s = e.func.length === 1 ? await e.func(r) : await e.func(), (n?.functionResultFormatter ?? M.functionResultFormatter)(s);
  };
  execute = async (e, t) => {
    let n = (s) => s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(), o = n(e.name), r = this.funcList.find((s) => s.name === e.name);
    if (r || (r = this.funcList.find((s) => n(s.name) === o)), !r) throw new Error(`Function not found: ${e.name}`);
    if (!r.func) throw new Error(`No handler for function: ${e.name}`);
    try {
      return await this.executeFunction(r, e, t);
    } catch (s) {
      throw s instanceof Nt ? new Xe(s.getFields(), r, e.id) : s;
    }
  };
};
var no = (i10, e) => {
  if (i10.length === 0) return [...e ?? []];
  let t = i10.map((n) => "toFunction" in n ? n.toFunction() : n).flat();
  for (let n of t.filter((o) => o.parameters)) if (n.parameters) try {
    Jr(n.parameters);
  } catch (o) {
    throw o instanceof Error ? new Error(`Function '${n.name}' parameters schema is invalid.
${o.message}
Tip: Arrays must include an "items" schema (e.g., { items: { type: "string" } } or items: { type: "object", properties: { ... } }).`, { cause: o }) : o;
  }
  return [...e ?? [], ...t];
};
var oo = async ({ ai: i10, functionList: e, functionCalls: t, mem: n, sessionId: o, traceId: r, span: s, excludeContentFromTrace: a, index: l, functionResultFormatter: p, logger: u, debug: d }) => {
  let c = new Gt(e), m = /* @__PURE__ */ new Set(), g = t.map((f) => {
    if (!f.id) throw new Error(`Function ${f.name} did not return an ID`);
    let A = i10.getOptions().tracer ?? M.tracer;
    return A ? A.startActiveSpan(`Tool: ${f.name}`, async (I) => {
      try {
        I?.setAttributes?.({ "tool.name": f.name, "tool.mode": "native", "function.id": f.id, "session.id": o ?? "" });
        let b = await c.execute(f, { sessionId: o, ai: i10, functionResultFormatter: p, traceId: I?.spanContext?.().traceId ?? r });
        if (m.add(f.name.toLowerCase()), a ? I.addEvent("gen_ai.tool.message", { name: f.name }) : I.addEvent("gen_ai.tool.message", { name: f.name, args: f.args, result: b ?? "" }), s) {
          let y = { name: f.name };
          a || (y.args = f.args, y.result = b ?? ""), s.addEvent("function.call", y);
        }
        return { result: b ?? "", role: "function", functionId: f.id, index: l };
      } catch (b) {
        if (I?.recordException?.(b), b instanceof Xe) {
          let y = b.getFixingInstructions(), R = { name: f.name, message: b.toString() };
          return a || (R.args = f.args, R.fixing_instructions = y), I?.addEvent?.("function.error", R), d && on(b, l, y, u), { functionId: f.id, isError: true, index: l, result: y, role: "function" };
        }
        throw b;
      } finally {
        I?.end?.();
      }
    }) : c.execute(f, { sessionId: o, ai: i10, functionResultFormatter: p, traceId: r }).then((I) => {
      if (m.add(f.name.toLowerCase()), s) {
        let b = { name: f.name };
        a || (b.args = f.args, b.result = I ?? ""), s.addEvent("function.call", b);
      }
      return { result: I ?? "", role: "function", functionId: f.id, index: l };
    }).catch((I) => {
      if (!(I instanceof Xe)) throw I;
      let b = I.getFixingInstructions();
      if (s) {
        let y = { name: f.name, message: I.toString() };
        a || (y.args = f.args, y.fixing_instructions = b), s.addEvent("function.error", y);
      }
      return d && on(I, l, b, u), { functionId: f.id, isError: true, index: l, result: b, role: "function" };
    });
  }), x = (await Promise.all(g)).filter((f) => f !== void 0);
  if (n.addFunctionResults(x, o), d) {
    let f = x.filter((A) => !A.isError);
    f.length > 0 && Ko(f, u);
  }
  return x.some((f) => f.isError) && n.addTag("error", o), m;
};
function ro(i10, e, t, n) {
  if (!e || e.length === 0) return;
  if (!i10.getFeatures(n).functions) throw new Error("Functions are not supported by the AI service");
  return e.map((r) => ({ id: r.id, name: r.function.name, args: r.function.params }));
}
function Qr(i10, e, t, n) {
  let o = e;
  return n?.functionCallMode === "prompt" ? { functions: [], functionCall: void 0 } : !t && (o === "required" || typeof o == "function") ? { functions: [], functionCall: void 0 } : i10 ? { functions: i10.map((s) => "toFunction" in s ? s.toFunction() : s).flat(), functionCall: o } : { functions: [], functionCall: o };
}
import_dayjs.default.extend(import_utc.default);
import_dayjs.default.extend(import_timezone.default);
import_dayjs.default.extend(import_customParseFormat.default);
function Yr(i10, e, t = false) {
  try {
    return Si(e);
  } catch (n) {
    if (i10.isOptional && !t) return;
    let o = n.message;
    throw new G({ fields: [i10], message: o, value: e });
  }
}
function Si(i10) {
  if (!(0, import_dayjs.default)(i10, "YYYY-MM-DD", true).isValid()) throw new Error('Invalid date format. Please provide the date in "YYYY-MM-DD" format.');
  return import_dayjs.default.utc(i10, "YYYY-MM-DD").startOf("day").toDate();
}
function Xr(i10, e, t = false) {
  try {
    return vi(e);
  } catch (n) {
    if (i10.isOptional && !t) return;
    let o = n.message;
    throw new G({ fields: [i10], message: o, value: e });
  }
}
function vi(i10) {
  let e = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?) (.+)$/, t = i10.match(e);
  if (!t) throw new Error('Invalid date and time format. Please provide the date and time in "YYYY-MM-DD HH:mm" or "YYYY-MM-DD HH:mm:ss" format, followed by the timezone.');
  let [, n, o] = t;
  if (!n || !o) throw new Error('Invalid date and time format. Please provide the date and time in "YYYY-MM-DD HH:mm" or "YYYY-MM-DD HH:mm:ss" format, followed by the timezone.');
  try {
    let r = n.includes(":") && n.split(":").length === 3 ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm", s = import_dayjs.default.tz(n, r, o);
    if (!s.isValid()) throw new Error("Invalid date and time values. Please ensure all components are correct.");
    return s.utc().toDate();
  } catch {
    throw new Error(`Unrecognized time zone ${o}. Please provide a valid time zone name, abbreviation, or offset. For example, "America/New_York", or "EST".`);
  }
}
var Zr = (i10) => (0, import_dayjs.default)(i10).utc().format("YYYY-MM-DD HH:mm:ss [UTC]");
var Lc = new $();
var $t = (i10, e) => {
  let t = i10.type ?? { name: "string", isArray: false }, n = (p, u) => {
    switch (p) {
      case "class":
        return typeof u == "string";
      case "code":
        return typeof u == "string";
      case "string":
        return typeof u == "string";
      case "number":
        return typeof u == "number";
      case "boolean":
        return typeof u == "boolean";
      case "date":
        return u instanceof Date || typeof u == "string";
      case "datetime":
        return u instanceof Date || typeof u == "string";
      case "json":
        return typeof u == "object" || typeof u == "string";
      default:
        return false;
    }
  }, o = (p) => !(!p || typeof p != "object" || !("mimeType" in p) || !("data" in p));
  if (i10.type?.name === "image") {
    let p;
    if (Array.isArray(e)) {
      for (let u of e) if (!o(u)) {
        p = "object ({ mimeType: string; data: string })";
        break;
      }
    } else o(e) || (p = "object ({ mimeType: string; data: string })");
    if (p) throw new Error(`Validation failed: Expected '${i10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let r = (p) => !(!p || typeof p != "object" || !("data" in p));
  if (i10.type?.name === "audio") {
    let p;
    if (Array.isArray(e)) {
      for (let u of e) if (!r(u)) {
        p = "object ({ data: string; format?: string })";
        break;
      }
    } else r(e) || (p = "object ({ data: string; format?: string })");
    if (p) throw new Error(`Validation failed: Expected '${i10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let s = (p) => {
    if (!p || typeof p != "object" || !("mimeType" in p)) return false;
    let u = "data" in p, d = "fileUri" in p;
    return !(!u && !d || u && d);
  };
  if (i10.type?.name === "file") {
    let p;
    if (Array.isArray(e)) {
      for (let u of e) if (!s(u)) {
        p = "object ({ mimeType: string; data: string } | { mimeType: string; fileUri: string })";
        break;
      }
    } else s(e) || (p = "object ({ mimeType: string; data: string } | { mimeType: string; fileUri: string })");
    if (p) throw new Error(`Validation failed: Expected '${i10.name}' to be type '${p}' instead got '${e}'`);
    return;
  }
  let a = (p) => typeof p == "string" ? true : !(!p || typeof p != "object" || !("url" in p));
  if (i10.type?.name === "url") {
    let p;
    if (Array.isArray(e)) {
      for (let u of e) if (!a(u)) {
        p = "string or object ({ url: string; title?: string; description?: string })";
        break;
      }
    } else a(e) || (p = "string or object ({ url: string; title?: string; description?: string })");
    if (p) throw new Error(`Validation failed: Expected '${i10.name}' to be type '${p}' instead got '${e}'`);
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
    throw new Error(`Validation failed: Expected '${i10.name}' to be a ${i10.type?.isArray ? "an array of " : ""}${t.name} instead got '${p}' (${JSON.stringify(e)})`);
  }
};
function Ze(i10) {
  let e = {};
  for (let t of i10) {
    let n = `${t.ai}:${t.model}`;
    if (!e[n]) {
      e[n] = { ...t };
      continue;
    }
    let o = e[n];
    if (o) {
      let r = o.tokens ?? { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
      r.promptTokens += t?.tokens?.promptTokens ?? 0, r.completionTokens += t?.tokens?.completionTokens ?? 0, r.totalTokens += t?.tokens?.totalTokens ?? 0, o.tokens = r;
      let s = o.citations ?? [], a = t.citations ?? [];
      if (a.length) {
        let l = new Set(s.map((p) => p.url));
        for (let p of a) p?.url && !l.has(p.url) && (s.push(p), l.add(p.url));
        o.citations = s;
      }
    }
  }
  return Object.values(e);
}
var es = (i10) => {
  if (!i10.trim()) return [];
  let e = /* @__PURE__ */ new Set(["-", "*", "+"]), t = /^\d+[\s]*[.)\]]\s*/, n = i10.split(`
`), o = [];
  for (let r of n) {
    let s = r.trim();
    if (s) {
      if (s[0] && e.has(s[0])) o.push(s.slice(1).trim());
      else if (t.test(s)) o.push(s.replace(t, "").trim());
      else if (o.length !== 0) throw new Error("Could not parse markdown list: mixed content detected");
    }
  }
  if (o.length === 0) throw new Error("Could not parse markdown list: no valid list items found");
  return o;
};
function io(i10, e) {
  let { index: t, delta: n, version: o } = e, r = i10.find((s) => s.index === t)?.delta;
  if (!r) return i10.push({ index: t, delta: n, version: o }), i10;
  for (let s of Object.keys(n)) {
    let a = r[s], l = n[s];
    a === void 0 && Array.isArray(l) ? r[s] = [...l] : Array.isArray(a) && Array.isArray(l) ? r[s] = [...a, ...l] : (a === void 0 || typeof a == "string") && typeof l == "string" ? r[s] = `${a ?? ""}${l}` : r[s] = l;
  }
  return i10;
}
var so = class {
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
var Oi = new so(500);
function ao(i10, e, t = 0, n = Oi) {
  if (/^```[a-zA-Z]*\s*$/.test(i10)) return -4;
  if (/^[\s`]*$/.test(i10)) return -3;
  let o = i10.indexOf(e, t);
  if (o !== -1) return o;
  let r = n.get(e) ?? Array.from({ length: e.length }, (a, l) => e.slice(0, l + 1));
  n.get(e) || n.set(e, r);
  let s = -1;
  for (let a = r.length - 1; a >= 0; a--) {
    let l = r[a];
    if (i10.endsWith(l)) {
      s = a;
      break;
    }
  }
  return s >= 0 ? -2 : -1;
}
var os = (i10, e, t, n = false) => {
  let o = { extractedFields: [], streamedIndex: {}, s: -1 };
  lo(i10, e, o, t, { strictMode: n }), po(i10, e, o, t, n);
  for (let r of i10.getOutputFields()) r.isInternal && delete e[r.name];
};
var Mi = (i10, e, t) => {
  let n = [];
  for (let o of t) o && !o.isOptional && e[o.name] === void 0 && n.push(o);
  if (n.length > 0) throw new G({ message: `Required ${n.length === 1 ? "field" : "fields"} not found`, fields: n });
};
var lo = (i10, e, t, n, { strictMode: o, skipEarlyFail: r } = {}) => {
  let s = i10.getOutputFields(), a;
  for (let [l, p] of s.entries()) {
    if (l === t.currFieldIndex && !t.inAssumedField || p.name in e && !(l === t.currFieldIndex && t.inAssumedField)) continue;
    let d = `${(t.extractedFields.length === 0 ? "" : `
`) + p.title}:`, c = ao(n, d, t.s), m = d.length;
    switch (c) {
      case -1:
        if (r) continue;
        if (!o && s.length === 1 && t.currField === void 0) {
          t.inAssumedField = true, a = p, m = 0, c = 0;
          break;
        }
        if (t.currField === void 0 && t.extractedFields.length === 0) {
          if (o && !p.isOptional) throw new G({ message: "Expected (Required) field not found", fields: [p] });
          if (!o) {
            let g = false;
            for (let h = l; h < s.length; h++) {
              let x = s[h];
              if (!x) continue;
              let f = `${(t.extractedFields.length === 0 ? "" : `
`) + x.title}:`;
              if (ao(n, f, t.s) >= 0) {
                g = true;
                break;
              }
            }
            if (!g) {
              t.inAssumedField = true, a = p, m = 0, c = 0;
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
    if (a && a.name !== p.name) throw new G({ message: "Expected (Required) field not found", fields: [a] });
    if (t.currField !== void 0 && t.inAssumedField) {
      let g = n.substring(0, c).trim();
      if (g && t.currField.name === p.name) {
        let h = et(t.currField, g);
        h !== void 0 && (e[t.currField.name] = h);
      } else if (g) {
        let h = et(t.currField, g);
        h !== void 0 && (e[t.currField.name] = h);
      }
      t.inAssumedField = false, t.streamedIndex[t.currField.name] = 0, t.currField = void 0;
    }
    if (t.currField) {
      let g = n.substring(t.s, c).trim(), h = et(t.currField, g);
      h !== void 0 && (e[t.currField.name] = h), t.prevFields ? t.prevFields?.push({ field: t.currField, s: t.s, e: c }) : t.prevFields = [{ field: t.currField, s: t.s, e: c }];
    }
    t.s = c + m, t.currField = p, t.currFieldIndex = l, t.extractedFields.includes(p) || t.extractedFields.push(p), t.streamedIndex[p.name] === void 0 && (t.streamedIndex[p.name] = 0);
  }
};
var po = (i10, e, t, n, o = false) => {
  if (t.currField) {
    let r = n.substring(t.s).trim(), s = et(t.currField, r);
    s !== void 0 && (e[t.currField.name] = s);
  }
  if (o && !t.currField && t.extractedFields.length === 0 && n.trim()) {
    let a = i10.getOutputFields().find((l) => !l.isOptional);
    if (a) throw new G({ message: "Expected field not found", fields: [a] });
  }
  ki(i10, e, n), Mi(t, e, i10.getOutputFields());
};
var ki = (i10, e, t) => {
  let n = i10.getOutputFields();
  for (let o of n) {
    if (!o.isOptional || o.name in e) continue;
    let r = `${o.title}:`, s = t.indexOf(r);
    if (s === -1) continue;
    let a = s + r.length, l = t.length;
    for (let u of n) {
      if (u.name === o.name) continue;
      let d = `${u.title}:`, c = t.indexOf(d, a);
      c !== -1 && c < l && (l = c);
    }
    let p = t.substring(a, l).trim();
    if (p) try {
      let u = et(o, p);
      u !== void 0 && (e[o.name] = u);
    } catch {
    }
  }
};
var ts = (i10, e, t = false) => {
  switch (i10.type?.name) {
    case "code":
      return rs(e);
    case "string":
      return e;
    case "number": {
      let n = Number(e);
      if (Number.isNaN(n)) {
        if (i10.isOptional && !t) return;
        throw new Error("Invalid number");
      }
      return n;
    }
    case "boolean": {
      if (typeof e == "boolean") return e;
      let n = e.toLowerCase();
      if (n === "true") return true;
      if (n === "false") return false;
      if (i10.isOptional && !t) return;
      throw new Error("Invalid boolean");
    }
    case "date":
      return Yr(i10, e, t);
    case "datetime":
      return Xr(i10, e, t);
    case "class": {
      let n = e;
      if (i10.type.options && !i10.type.options.includes(n)) {
        if (i10.isOptional) return;
        throw new Error(`Invalid class '${e}', expected one of the following: ${i10.type.options.join(", ")}`);
      }
      return n;
    }
    default:
      return e;
  }
};
function* ns(i10, e, t, n, o, r) {
  let { name: s, isInternal: a } = e, { isArray: l, name: p } = e.type ?? {};
  if (a || l || p && p !== "string" && p !== "code") return;
  let u = o.streamedIndex[s] ?? 0, d = u === 0, c = i10.substring(t + u, n);
  if (c.length === 0) return;
  let m = c.replace(/\s+$/, "");
  o.currField?.type?.name === "code" && (m = m.replace(/\s*```\s*$/, ""));
  let g = d ? m.trimStart() : m;
  o.currField?.type?.name === "code" && (g = g.replace(/^[ ]*```[a-zA-Z0-9]*\n\s*/, "")), g.length > 0 && (yield { index: r, delta: { [s]: g } }, o.streamedIndex[s] = u + m.length);
}
function* uo(i10, e, t, n, o) {
  for (let s of n.prevFields ?? []) {
    let { field: a, s: l, e: p } = s;
    yield* ns(e, a, l, p, n, o);
  }
  if (n.prevFields = void 0, !n.currField || n.currField.isInternal) return;
  yield* ns(e, n.currField, n.s, e.length, n, o);
  let r = i10.getOutputFields();
  for (let s of Object.keys(t)) {
    let a = r.find((p) => p.name === s);
    if (!a || a.isInternal) continue;
    let l = t[s];
    if (Array.isArray(l)) {
      let p = n.streamedIndex?.[s] ?? 0, u = l.slice(p);
      u && u.length > 0 && (yield { index: o, delta: { [s]: u } }, n.streamedIndex[s] = p + u.length);
      continue;
    }
    n.streamedIndex[s] || (yield { index: o, delta: { [s]: l } }, n.streamedIndex[s] = 1);
  }
}
function et(i10, e) {
  if (!e || e === "" || /^(null|undefined)\s*$/i.test(e)) {
    if (i10.isOptional) return;
    throw new G({ message: "Required field is missing", fields: [i10], value: e });
  }
  let t;
  if (i10.type?.name === "json") try {
    let n = rs(e);
    return t = JSON.parse(n), t;
  } catch (n) {
    throw new G({ message: `Invalid JSON: ${n.message}`, fields: [i10], value: e });
  }
  if (i10.type?.isArray) try {
    try {
      t = JSON.parse(e);
    } catch {
      t = es(e);
    }
    if (!Array.isArray(t)) throw new Error("Expected an array");
  } catch (n) {
    throw new G({ message: `Invalid Array: ${n.message}`, fields: [i10], value: e });
  }
  try {
    if (Array.isArray(t)) {
      for (let [n, o] of t.entries()) if (o !== void 0) {
        let r = typeof o == "string" ? o.trim() : o;
        t[n] = ts(i10, r, true);
      }
    } else t = ts(i10, e);
  } catch (n) {
    throw new G({ message: n.message, fields: [i10], value: e });
  }
  if (!(typeof t == "string" && t === "")) return t;
}
var rs = (i10) => {
  let t = /```([A-Za-z]*)\n([\s\S]*?)\n```/g.exec(i10);
  return t ? t.length === 3 ? t[2] : t.length === 2 ? t[1] : i10 : i10;
};
async function co(i10, e, t, n) {
  for (let o of i10) {
    if (e[o.field.name] === void 0) continue;
    let r = o.process, s = await r(e[o.field.name], { sessionId: n, values: e, done: true });
    ss(o.field, t, s, n);
  }
}
async function mo(i10, e, t, n, o, r, s = false) {
  for (let a of i10) {
    if (t.currField?.name !== a.field.name) continue;
    let l = e.substring(t.s);
    t.currField?.type?.name === "code" && (l = l.replace(/^[ ]*```[a-zA-Z0-9]*\n\s*/, ""), l = l.replace(/\s*```\s*$/, ""));
    let p = a.process, u = await p(l, { sessionId: r, values: o, done: s });
    ss(t.currField, n, u, r);
  }
}
var ss = (i10, e, t, n) => {
  if (t === void 0 || typeof t == "string" && (t === "" || /^(null|undefined)\s*$/i.test(t))) return;
  let o = JSON.stringify(t, (s, a) => typeof a == "bigint" ? Number(a) : a, 2), r = Ei(i10, o);
  e.addRequest([{ role: "user", content: [{ type: "text", text: r }] }], n), e.addTag("processor", n);
};
function Ei(i10, e) {
  let t = i10.type?.name === "code", n = i10.title;
  return t ? `Code in the field "${n}" was executed. The code execution produced the following output: ${e}` : `The field "${n}" was processed. The field contents were transformed into the following output: ${e}`;
}
async function* is({ res: i10, usage: e, states: t, debug: n, ...o }) {
  let r = (o.ai.getFeatures().functionCot ?? false) && o.functions !== void 0 && o.functions.length > 0, s, a = [], l = i10.getReader();
  try {
    for (; ; ) {
      let { done: p, value: u } = await l.read();
      if (p) break;
      let d = u;
      d.modelUsage && (s = d.modelUsage);
      for (let c of d.results) {
        if (Array.isArray(c.citations)) for (let g of c.citations) g?.url && a.push({ url: g.url, title: g.title, description: g.description, license: g.license, publicationDate: g.publicationDate, snippet: g.snippet });
        if ((!c.content || c.content === "") && (!c.thought || c.thought === "") && (!c.functionCalls || c.functionCalls.length === 0)) continue;
        let m = t.find((g) => g.index === c.index);
        if (!m) throw new Error(`No state found for result (index: ${c.index})`);
        yield* Pi({ ...o, result: c, skipEarlyFail: r, state: m, debug: n });
      }
    }
  } finally {
    l.releaseLock();
  }
  for (let p of t) yield* Fi({ ...o, state: p, debug: n });
  if (s) {
    if (a.length) {
      let p = Array.from(new Map(a.filter((u) => u.url).map((u) => [u.url, u])).values());
      s.citations = p;
    }
    if (e.push(s), n && o.logger) {
      let p = structuredClone(s);
      delete p.citations, o.logger({ name: "ChatResponseUsage", value: p }), s.citations && s.citations.length > 0 && o.logger({ name: "ChatResponseCitations", value: s.citations });
    }
  }
}
async function* Pi({ result: i10, mem: e, sessionId: t, strictMode: n, skipEarlyFail: o, state: r, signature: s, streamingFieldProcessors: a, thoughtFieldName: l, streamingAsserts: p, asserts: u }) {
  if (i10.functionCalls && i10.functionCalls.length > 0) mt(r.functionCalls, i10.functionCalls), e.updateResult({ name: i10.name, content: i10.content, functionCalls: r.functionCalls, delta: i10.functionCalls?.[0]?.function?.params, index: i10.index }, t);
  else if (i10.content && i10.content.length > 0) {
    if (i10.thought && i10.thought.length > 0 && (yield { index: i10.index, delta: { [l]: i10.thought } }), r.content += i10.content, e.updateResult({ name: i10.name, content: r.content, delta: i10.content, index: i10.index }, t), lo(s, r.values, r.xstate, r.content, { strictMode: n, skipEarlyFail: o })) return;
    p.length !== 0 && await Xn(p, r.xstate, r.content), a.length !== 0 && await mo(a, r.content, r.xstate, e, r.values, t), yield* uo(s, r.content, r.values, r.xstate, i10.index), await Ft(u, r.values);
  } else i10.thought && i10.thought.length > 0 && (r.values[l] = (r.values[l] ?? "") + i10.thought, yield { index: i10.index, delta: { [l]: i10.thought } });
  if (i10.finishReason === "length") throw new Error(`Max tokens reached before completion
Content: ${r.content}`);
}
async function* Fi({ state: i10, signature: e, ai: t, model: n, functions: o, mem: r, sessionId: s, traceId: a, span: l, strictMode: p, excludeContentFromTrace: u, streamingAsserts: d, asserts: c, fieldProcessors: m, streamingFieldProcessors: g, functionResultFormatter: h, logger: x, debug: f }) {
  let A = ro(t, i10.functionCalls, i10.values, n);
  if (A) {
    if (!o) throw new Error("Functions are not defined");
    let I = await oo({ ai: t, functionList: o, functionCalls: A, mem: r, sessionId: s, traceId: a, span: l, index: i10.index, excludeContentFromTrace: u, functionResultFormatter: h, logger: x, debug: f });
    i10.functionsExecuted = /* @__PURE__ */ new Set([...i10.functionsExecuted, ...I]), i10.functionCalls = [];
  } else po(e, i10.values, i10.xstate, i10.content, p), await Xn(d, i10.xstate, i10.content, true), await Ft(c, i10.values), m.length && await co(m, i10.values, r, s), g.length !== 0 && await mo(g, i10.content, i10.xstate, r, i10.values, s, true), yield* uo(e, i10.content, i10.values, i10.xstate, i10.index);
}
async function* as({ ai: i10, res: e, mem: t, sessionId: n, traceId: o, functions: r, span: s, strictMode: a, states: l, usage: p, excludeContentFromTrace: u, asserts: d, fieldProcessors: c, thoughtFieldName: m, signature: g, functionResultFormatter: h, logger: x, debug: f }) {
  let A = e.results ?? [];
  t.addResponse(A, n);
  let I = [];
  for (let T of A) if (Array.isArray(T?.citations)) for (let w of T.citations) w?.url && I.push({ url: w.url, title: w.title, description: w.description, license: w.license, publicationDate: w.publicationDate, snippet: w.snippet });
  for (let T of A) {
    let w = l[T.index];
    if (!w) throw new Error(`No state found for result (index: ${T.index})`);
    if (e.modelUsage) {
      let P = Array.from(new Map(I.filter((F) => F.url).map((F) => [F.url, F])).values()), k = { ...e.modelUsage, ...P.length ? { citations: P } : {} };
      if (p.push(k), f && x) {
        let F = structuredClone(k);
        delete F.citations, x({ name: "ChatResponseUsage", value: F }), k.citations && k.citations.length > 0 && x({ name: "ChatResponseCitations", value: k.citations });
      }
    }
    if (T.functionCalls?.length) {
      let P = ro(i10, T.functionCalls, w.values);
      if (P) {
        if (!r) throw new Error("Functions are not defined");
        let k = await oo({ ai: i10, functionList: r, functionCalls: P, mem: t, sessionId: n, traceId: o, span: s, excludeContentFromTrace: u, index: T.index, functionResultFormatter: h, logger: x, debug: f });
        w.functionsExecuted = /* @__PURE__ */ new Set([...w.functionsExecuted, ...k]);
      }
    } else T.content && (T.thought && T.thought.length > 0 && (w.values[m] = T.thought), os(g, w.values, T.content, a), await Ft(d, w.values), c.length && await co(c, w.values, t, n));
    if (T.finishReason === "length") throw new Error(`Max tokens reached before completion
Content: ${T.content}`);
  }
  let b = l.map((T) => T.values);
  for (let T of b) for (let w of g.getOutputFields()) w.isInternal && delete T[w.name];
  let y = g.getOutputFields(), R = b.map((T, w) => {
    let P = {};
    for (let k of y) k.isInternal || (P[k.name] = T[k.name]);
    return T[m] !== void 0 && (P[m] = T[m]), { index: w, delta: P };
  });
  for (let T of R) yield T;
}
function ls(i10, e, t, n) {
  let o = i10.getLast(n);
  if (!o) return true;
  for (let [r, s] of t.entries()) {
    let a = e && s.functionsExecuted.has(e);
    if (!o.chat[r]) throw new Error(`No chat message found for result (index: ${r})`);
    let p = o.role === "function", u = o.tags ? o.tags.some((d) => d === "processor") : false;
    if (p && e && a || !(p || u)) return false;
  }
  return true;
}
var tt = class {
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
var S = class extends Error {
  constructor(t, n, o, r) {
    super(t);
    this.position = n;
    this.context = o;
    this.suggestion = r;
    this.name = "SignatureValidationError";
  }
};
var go = class {
  input;
  position;
  currentFieldName = null;
  currentSection = "description";
  constructor(e) {
    if (this.input = e.trim(), this.position = 0, !this.input) throw new S("Empty signature provided", 0, "", 'A signature must contain at least input and output fields separated by "->". Example: "userQuery:string -> aiResponse:string"');
  }
  parse() {
    try {
      this.skipWhitespace();
      let e = this.parseParsedString();
      this.skipWhitespace(), this.currentSection = "inputs";
      let t = this.parseFieldList(this.parseInputField.bind(this), "input");
      if (this.skipWhitespace(), this.position >= this.input.length) throw new S("Incomplete signature: Missing output section", this.position, this.getErrorContext(), 'Add "->" followed by output fields. Example: "-> responseText:string"');
      if (this.expectArrow(), this.skipWhitespace(), this.position >= this.input.length) throw new S('Incomplete signature: No output fields specified after "->"', this.position, this.getErrorContext(), 'Add at least one output field. Example: "-> responseText:string"');
      this.currentSection = "outputs";
      let n = this.parseFieldList(this.parseOutputField.bind(this), "output");
      if (this.skipWhitespace(), this.position < this.input.length) {
        let o = this.input.slice(this.position);
        throw new S(`Unexpected content after signature: "${o}"`, this.position, this.getErrorContext(), "Remove any extra content after the output fields");
      }
      return this.validateParsedSignature({ desc: e?.trim(), inputs: t, outputs: n }), { desc: e?.trim(), inputs: t, outputs: n };
    } catch (e) {
      if (e instanceof S) throw e;
      let t = e instanceof Error ? e.message : "Unknown error";
      throw new S(t, this.position, this.getErrorContext());
    }
  }
  validateParsedSignature(e) {
    let t = /* @__PURE__ */ new Set();
    for (let o of e.inputs) {
      if (t.has(o.name)) throw new S(`Duplicate input field name: "${o.name}"`, 0, "", "Each field name must be unique within the signature");
      t.add(o.name);
    }
    let n = /* @__PURE__ */ new Set();
    for (let o of e.outputs) {
      if (n.has(o.name)) throw new S(`Duplicate output field name: "${o.name}"`, 0, "", "Each field name must be unique within the signature");
      n.add(o.name);
    }
    for (let o of e.outputs) if (t.has(o.name)) throw new S(`Field name "${o.name}" appears in both inputs and outputs`, 0, "", "Use different names for input and output fields to avoid confusion");
    if (e.inputs.length === 0) throw new S("Signature must have at least one input field", 0, "", 'Add an input field before "->". Example: "userInput:string -> ..."');
    if (e.outputs.length === 0) throw new S("Signature must have at least one output field", 0, "", 'Add an output field after "->". Example: "... -> responseText:string"');
  }
  getErrorContext() {
    let e = Math.max(0, this.position - 25), t = Math.min(this.input.length, this.position + 25), n = this.input.slice(e, this.position), o = this.input.slice(this.position, t), r = `${" ".repeat(n.length)}^`;
    return [`Position ${this.position} in signature:`, `"${n}${o}"`, ` ${r}`].join(`
`);
  }
  parseFieldList(e, t) {
    let n = [];
    if (this.skipWhitespace(), this.position >= this.input.length) throw new S(`Empty ${t} section: Expected at least one field`, this.position, this.getErrorContext(), `Add a ${t} field. Example: ${t === "input" ? "userInput:string" : "responseText:string"}`);
    try {
      n.push(e());
    } catch (o) {
      throw o instanceof S ? o : new S(`Invalid first ${t} field: ${o instanceof Error ? o.message : "Unknown error"}`, this.position, this.getErrorContext());
    }
    for (this.skipWhitespace(); this.position < this.input.length && !(this.input[this.position] === "-" && this.position + 1 < this.input.length && this.input[this.position + 1] === ">"); ) if (this.match(",")) {
      if (this.skipWhitespace(), this.position >= this.input.length) throw new S(`Unexpected end of input after comma in ${t} section`, this.position, this.getErrorContext(), `Add another ${t} field after the comma`);
      try {
        n.push(e());
      } catch (o) {
        throw o instanceof S ? o : new S(`Invalid ${t} field after comma: ${o instanceof Error ? o.message : "Unknown error"}`, this.position, this.getErrorContext());
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
      if (this.match("!")) throw new S(`Input field "${e}" cannot use the internal marker "!"`, this.position - 1, this.getErrorContext(), "Internal markers (!) are only allowed on output fields");
      break;
    }
    let n;
    if (this.skipWhitespace(), this.match(":")) {
      if (this.skipWhitespace(), /^class\b/.test(this.input.slice(this.position))) throw new S(`Input field "${e}" cannot use the "class" type`, this.position, this.getErrorContext(), 'Class types are only allowed on output fields. Use "string" type for input classifications');
      try {
        let r = this.parseTypeNotClass(), s = this.match("[]");
        n = { name: r, isArray: s };
      } catch (r) {
        throw r instanceof S ? r : new S(`Input field "${e}": ${r instanceof Error ? r.message : "Unknown error"}`, this.position, this.getErrorContext());
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
      let s = this.match("[]");
      this.skipWhitespace();
      let a = this.parseParsedString();
      if (!a) throw new S(`Output field "${e}": Missing class options after "class" type`, this.position, this.getErrorContext(), 'Add class names in quotes. Example: class "positive, negative, neutral"');
      let l = a.split(/[,|]/).map((p) => p.trim()).filter((p) => p.length > 0);
      if (l.length === 0) throw new S(`Output field "${e}": Empty class list provided`, this.position, this.getErrorContext(), 'Provide at least one class option. Example: "positive, negative"');
      o = { name: "class", isArray: s, options: l };
    } else try {
      let s = this.parseTypeNotClass(), a = this.match("[]");
      if (o = { name: s, isArray: a }, s === "image" && a) throw new S(`Output field "${e}": Arrays of images are not supported`, this.position, this.getErrorContext(), 'Use a single image type instead: "image"');
      if (s === "audio" && a) throw new S(`Output field "${e}": Arrays of audio are not supported`, this.position, this.getErrorContext(), 'Use a single audio type instead: "audio"');
      if (s === "image") throw new S(`Output field "${e}": Image type is not supported in output fields`, this.position, this.getErrorContext(), "Image types can only be used in input fields");
      if (s === "audio") throw new S(`Output field "${e}": Audio type is not supported in output fields`, this.position, this.getErrorContext(), "Audio types can only be used in input fields");
    } catch (s) {
      throw s instanceof S ? s : new S(`Output field "${e}": ${s instanceof Error ? s.message : "Unknown error"}`, this.position, this.getErrorContext());
    }
    this.skipWhitespace();
    let r = this.parseParsedString();
    return { name: e, desc: r?.trim(), type: o, isOptional: t, isInternal: n };
  }
  validateFieldName(e, t) {
    if (M.signatureStrict && ["text", "object", "image", "string", "number", "boolean", "json", "array", "datetime", "date", "time", "type", "class", "input", "output", "data", "value", "result", "response", "request", "item", "element"].includes(e.toLowerCase())) {
      let s = t === "input" ? ["userInput", "questionText", "documentContent", "messageText"] : ["responseText", "analysisResult", "categoryType", "summaryText"];
      throw new S(`Field name "${e}" is too generic`, this.position, this.getErrorContext(), `Use a more descriptive name. Examples: ${s.join(", ")}`);
    }
    let n = /^[a-z][a-zA-Z0-9]*$/, o = /^[a-z]+(_[a-z0-9]+)*$/;
    if (!n.test(e) && !o.test(e)) throw new S(`Invalid field name "${e}"`, this.position, this.getErrorContext(), 'Field names must be in camelCase (e.g., "userInput") or snake_case (e.g., "user_input")');
    if (e.length < 2) throw new S(`Field name "${e}" is too short`, this.position, this.getErrorContext(), "Field names must be at least 2 characters long");
    if (e.length > 50) throw new S(`Field name "${e}" is too long (${e.length} characters)`, this.position, this.getErrorContext(), "Field names should be 50 characters or less");
  }
  parseTypeNotClass() {
    let e = ["string", "number", "boolean", "json", "image", "audio", "file", "url", "datetime", "date", "code"], t = e.find((n) => this.match(n));
    if (!t) {
      let n = this.input.slice(this.position).match(/^\w+/)?.[0] || "", o = this.suggestType(n), r = `Invalid type "${n || "empty"}"`, s = o ? `. Did you mean "${o}"?` : "", a = `${r}${s}`;
      throw new S(a, this.position, this.getErrorContext(), `Expected one of: ${e.join(", ")}`);
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
    throw n === "" ? new S("Expected field name but found end of input", this.position, this.getErrorContext(), "Add a field name. Field names must start with a letter or underscore") : /^\d/.test(n) ? new S(`Invalid field name "${n}" - cannot start with a number`, this.position, this.getErrorContext(), 'Field names must start with a letter or underscore. Example: "userInput" or "_internal"') : new S(`Invalid field name "${n}"`, this.position, this.getErrorContext(), "Field names must start with a letter or underscore and contain only letters, numbers, or underscores");
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
      let s = this.input.slice(r, Math.min(this.position, r + 20));
      throw new S(`Unterminated string starting at position ${r}`, r, this.getErrorContext(), `Add closing ${t} to complete the string: ${s}${t}`);
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
      throw new S(`Expected "->" but found "${e}..."`, this.position, this.getErrorContext(), t);
    }
  }
};
function ps(i10) {
  return new go(i10).parse();
}
var Bt = class {
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
    return new L(e);
  }
};
var U = class i6 {
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
    return new i6({ ...this, isOptional: true });
  }
  array() {
    return new i6({ ...this, isArray: true });
  }
  internal() {
    return new i6({ ...this, isInternal: true });
  }
};
var nt = Object.assign(() => new Bt(), { string: (i10) => new U({ type: "string", isArray: false, description: i10 }), number: (i10) => new U({ type: "number", isArray: false, description: i10 }), boolean: (i10) => new U({ type: "boolean", isArray: false, description: i10 }), json: (i10) => new U({ type: "json", isArray: false, description: i10 }), datetime: (i10) => new U({ type: "datetime", isArray: false, description: i10 }), date: (i10) => new U({ type: "date", isArray: false, description: i10 }), class: (i10, e) => new U({ type: "class", isArray: false, options: i10, description: e }), image: (i10) => new U({ type: "image", isArray: false, description: i10 }), audio: (i10) => new U({ type: "audio", isArray: false, description: i10 }), file: (i10) => new U({ type: "file", isArray: false, description: i10 }), url: (i10) => new U({ type: "url", isArray: false, description: i10 }), code: (i10, e) => new U({ type: "code", isArray: false, description: e || i10 }), array: (i10) => ({ ...i10, isArray: true }), optional: (i10) => ({ ...i10, isOptional: true }), internal: (i10) => ({ ...i10, isInternal: true }), legacyArray: (i10) => ({ ...i10, isArray: true }), legacyOptional: (i10) => ({ ...i10, isOptional: true }), legacyInternal: (i10) => ({ ...i10, isInternal: true }) });
function Ut(i10) {
  return { type: { name: i10.type, isArray: i10.isArray, options: i10.options ? [...i10.options] : void 0 }, description: i10.description, isOptional: i10.isOptional, isInternal: i10.isInternal };
}
var C = class extends Error {
  constructor(t, n, o) {
    super(t);
    this.fieldName = n;
    this.suggestion = o;
    this.name = "AxSignatureValidationError";
  }
};
var L = class i7 {
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
        t = ps(e);
      } catch (n) {
        if (n instanceof Error) {
          let o = "suggestion" in n && typeof n.suggestion == "string" ? n.suggestion : 'Please check the signature format. Example: "userInput:string -> responseText:string"';
          throw new C(`Invalid Signature: ${n.message}`, void 0, o);
        }
        throw new C(`Invalid Signature: ${e}`, void 0, 'Please check the signature format. Example: "userInput:string -> responseText:string"');
      }
      this.description = t.desc, this.inputFields = t.inputs.map((n) => this.parseParsedField(n)), this.outputFields = t.outputs.map((n) => this.parseParsedField(n)), [this.sigHash, this.sigString] = this.updateHash();
    } else if (e instanceof i7) this.description = e.getDescription(), this.inputFields = structuredClone(e.getInputFields()), this.outputFields = structuredClone(e.getOutputFields()), this.sigHash = e.hash(), this.sigString = e.toString(), e.validatedAtHash === this.sigHash && (this.validatedAtHash = this.sigHash);
    else if (typeof e == "object" && e !== null) {
      if (!("inputs" in e) || !("outputs" in e)) throw new C("Invalid signature object: missing inputs or outputs", void 0, 'Signature object must have "inputs" and "outputs" arrays. Example: { inputs: [...], outputs: [...] }');
      if (!Array.isArray(e.inputs) || !Array.isArray(e.outputs)) throw new C("Invalid signature object: inputs and outputs must be arrays", void 0, 'Both "inputs" and "outputs" must be arrays of AxField objects');
      try {
        this.description = e.description, this.inputFields = e.inputs.map((t) => this.parseField(t)), this.outputFields = e.outputs.map((t) => this.parseField(t)), [this.sigHash, this.sigString] = this.updateHash();
      } catch (t) {
        throw t instanceof C ? t : new C(`Failed to create signature from object: ${t instanceof Error ? t.message : "Unknown error"}`, void 0, "Check that all fields in inputs and outputs arrays are valid AxField objects");
      }
    } else throw new C("Invalid signature argument type", void 0, "Signature must be a string, another AxSignature instance, or an object with inputs and outputs arrays");
  }
  static create(e) {
    return new i7(e);
  }
  parseParsedField = (e) => {
    if (!e.name || e.name.length === 0) throw new C("Field name is required", e.name, 'Every field must have a descriptive name. Example: "userInput", "responseText"');
    let t = this.toTitle(e.name);
    return { name: e.name, title: t, description: "desc" in e ? e.desc : void 0, type: e.type ?? { name: "string", isArray: false }, ..."isInternal" in e ? { isInternal: e.isInternal } : {}, ..."isOptional" in e ? { isOptional: e.isOptional } : {} };
  };
  parseField = (e) => {
    let t = !e.title || e.title.length === 0 ? this.toTitle(e.name) : e.title;
    if (e.type && (!e.type.name || e.type.name.length === 0)) throw new C("Field type name is required", e.name, "Specify a valid type. Available types: string, number, boolean, json, image, audio, file, url, date, datetime, class, code");
    return { ...e, title: t };
  };
  setDescription = (e) => {
    if (typeof e != "string") throw new C("Description must be a string", void 0, "Provide a string description for the signature");
    this.description = e, this.invalidateValidationCache(), this.updateHashLight();
  };
  addInputField = (e) => {
    try {
      let t = this.parseField(e);
      ne(t, "input");
      for (let n of this.inputFields) if (n.name === t.name) throw new C(`Duplicate input field name: "${t.name}"`, t.name, "Each field name must be unique within the signature");
      for (let n of this.outputFields) if (n.name === t.name) throw new C(`Field name "${t.name}" appears in both inputs and outputs`, t.name, "Use different names for input and output fields to avoid confusion");
      this.inputFields.push(t), this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof C ? t : new C(`Failed to add input field "${e.name}": ${t instanceof Error ? t.message : "Unknown error"}`, e.name);
    }
  };
  addOutputField = (e) => {
    try {
      let t = this.parseField(e);
      ne(t, "output");
      for (let n of this.outputFields) if (n.name === t.name) throw new C(`Duplicate output field name: "${t.name}"`, t.name, "Each field name must be unique within the signature");
      for (let n of this.inputFields) if (n.name === t.name) throw new C(`Field name "${t.name}" appears in both inputs and outputs`, t.name, "Use different names for input and output fields to avoid confusion");
      this.outputFields.push(t), this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof C ? t : new C(`Failed to add output field "${e.name}": ${t instanceof Error ? t.message : "Unknown error"}`, e.name);
    }
  };
  setInputFields = (e) => {
    if (!Array.isArray(e)) throw new C("Input fields must be an array", void 0, "Provide an array of field objects");
    try {
      let t = e.map((n) => {
        let o = this.parseField(n);
        return ne(o, "input"), o;
      });
      this.inputFields = t, this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof C ? t : new C(`Failed to set input fields: ${t instanceof Error ? t.message : "Unknown error"}`);
    }
  };
  setOutputFields = (e) => {
    if (!Array.isArray(e)) throw new C("Output fields must be an array", void 0, "Provide an array of field objects");
    try {
      let t = e.map((n) => {
        let o = this.parseField(n);
        return ne(o, "output"), o;
      });
      this.outputFields = t, this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof C ? t : new C(`Failed to set output fields: ${t instanceof Error ? t.message : "Unknown error"}`);
    }
  };
  getInputFields = () => this.inputFields;
  getOutputFields = () => this.outputFields;
  getDescription = () => this.description;
  appendInputField = (e, t) => {
    let n = new i7(this);
    return n.addInputField({ name: e, ...Ut(t) }), n;
  };
  prependInputField = (e, t) => {
    let n = new i7(this), o = { name: e, ...Ut(t) }, r = n.parseField(o);
    ne(r, "input");
    for (let s of n.inputFields) if (s.name === r.name) throw new C(`Duplicate input field name: "${r.name}"`, r.name, "Each field name must be unique within the signature");
    for (let s of n.outputFields) if (s.name === r.name) throw new C(`Field name "${r.name}" appears in both inputs and outputs`, r.name, "Use different names for input and output fields to avoid confusion");
    return n.inputFields.unshift(r), n.invalidateValidationCache(), n.updateHashLight(), n;
  };
  appendOutputField = (e, t) => {
    let n = new i7(this);
    return n.addOutputField({ name: e, ...Ut(t) }), n;
  };
  prependOutputField = (e, t) => {
    let n = new i7(this), o = { name: e, ...Ut(t) }, r = n.parseField(o);
    ne(r, "output");
    for (let s of n.outputFields) if (s.name === r.name) throw new C(`Duplicate output field name: "${r.name}"`, r.name, "Each field name must be unique within the signature");
    for (let s of n.inputFields) if (s.name === r.name) throw new C(`Field name "${r.name}" appears in both inputs and outputs`, r.name, "Use different names for input and output fields to avoid confusion");
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
        ne(e, "input");
      }), this.getOutputFields().forEach((e) => {
        ne(e, "output");
      }), this.sigHash = pt("sha256").update(JSON.stringify(this.inputFields)).update(JSON.stringify(this.outputFields)).digest("hex"), this.sigString = cs(this.description, this.inputFields, this.outputFields), [this.sigHash, this.sigString];
    } catch (e) {
      throw e instanceof C ? e : new C(`Signature validation failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };
  updateHash = () => {
    try {
      return this.getInputFields().forEach((e) => {
        ne(e, "input");
      }), this.getOutputFields().forEach((e) => {
        ne(e, "output");
      }), this.validateSignatureConsistency(), this.sigHash = pt("sha256").update(this.description ?? "").update(JSON.stringify(this.inputFields)).update(JSON.stringify(this.outputFields)).digest("hex"), this.sigString = cs(this.description, this.inputFields, this.outputFields), [this.sigHash, this.sigString];
    } catch (e) {
      throw e instanceof C ? e : new C(`Signature validation failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };
  validateSignatureConsistency() {
    let e = /* @__PURE__ */ new Set();
    for (let n of this.inputFields) {
      if (e.has(n.name)) throw new C(`Duplicate input field name: "${n.name}"`, n.name, "Each field name must be unique within the signature");
      e.add(n.name);
    }
    let t = /* @__PURE__ */ new Set();
    for (let n of this.outputFields) {
      if (t.has(n.name)) throw new C(`Duplicate output field name: "${n.name}"`, n.name, "Each field name must be unique within the signature");
      t.add(n.name);
    }
    for (let n of this.outputFields) if (e.has(n.name)) throw new C(`Field name "${n.name}" appears in both inputs and outputs`, n.name, "Use different names for input and output fields to avoid confusion");
    if (this.inputFields.length === 0) throw new C("Signature must have at least one input field", void 0, 'Add an input field. Example: "userInput:string -> ..."');
    if (this.outputFields.length === 0) throw new C("Signature must have at least one output field", void 0, 'Add an output field. Example: "... -> responseText:string"');
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
  injectToolFields(e) {
    let t = new i7(this);
    for (let n of e) if (n.parameters?.properties && Object.keys(n.parameters.properties).length > 0) {
      let o = this.generateToolParameterFields(n);
      for (let r of o) t.outputFields.some((a) => a.name === r.name) || t.addOutputField(r);
    } else {
      let o = this.sanitizeFieldName(n.name), r = this.inferToolFieldType(n.parameters);
      t.outputFields.some((a) => a.name === o) || t.addOutputField({ name: o, title: this.formatTitle(n.name), type: r, description: n.description || `Parameters for ${n.name}`, isOptional: true });
    }
    return t;
  }
  generateToolParameterFields(e) {
    let t = [];
    if (!e.parameters || !e.parameters.properties) return t;
    let n = e.parameters.properties, o = e.parameters.required || [], r = (s, a, l) => {
      for (let [p, u] of Object.entries(s)) {
        let d = a ? `${a}.${p}` : p, c = `${e.name}.${d}`;
        if (u.type === "object" && u.properties) r(u.properties, d, u.required || []);
        else {
          let m = this.inferParameterType(u);
          t.push({ name: this.sanitizeFieldName(c), title: this.formatParameterTitle(e.name, d), type: m, description: u.description || `${p} parameter for ${e.name}`, isOptional: true });
        }
      }
    };
    return r(n, "", o), t;
  }
  inferParameterType(e) {
    switch (e.type) {
      case "string":
        return { name: "string", isArray: false };
      case "number":
      case "integer":
        return { name: "number", isArray: false };
      case "boolean":
        return { name: "boolean", isArray: false };
      case "array": {
        let t = e.items;
        if (t?.type) switch (t.type) {
          case "string":
            return { name: "string", isArray: true };
          case "number":
          case "integer":
            return { name: "number", isArray: true };
          case "boolean":
            return { name: "boolean", isArray: true };
          default:
            return { name: "json", isArray: true };
        }
        return { name: "json", isArray: true };
      }
      case "object":
        return { name: "json", isArray: false };
      default:
        return { name: "string", isArray: false };
    }
  }
  formatParameterTitle(e, t) {
    return `${e} ${t.replace(/\./g, " ")}`;
  }
  sanitizeFieldName(e) {
    return e.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_|_$/g, "").replace(/[^a-z0-9_]/g, "_");
  }
  formatTitle(e) {
    return e.replace(/([A-Z])/g, " $1").replace(/^./, (t) => t.toUpperCase()).trim();
  }
  inferToolFieldType(e) {
    return !e || !e.properties || Object.keys(e.properties).length === 0 ? { name: "string", isArray: false } : { name: "json", isArray: false };
  }
  toJSON = () => ({ id: this.hash(), description: this.description, inputFields: this.inputFields, outputFields: this.outputFields });
};
function us(i10) {
  let e = i10.name;
  return i10.isOptional && (e += "?"), i10.isInternal && (e += "!"), i10.type && (e += `:${i10.type.name}`, i10.type.isArray && (e += "[]"), i10.type.name === "class" && i10.type.options && (e += ` "${i10.type.options.join(" | ")}"`)), i10.description && i10.type?.name !== "class" && (e += ` "${i10.description}"`), e;
}
function cs(i10, e, t) {
  let n = i10 ? `"${i10}" ` : "", o = e.map(us).join(", "), r = t.map(us).join(", ");
  return `${n}${o} -> ${r}`;
}
function _i(i10) {
  let e = /^[a-z][a-zA-Z0-9]*$/, t = /^[a-z]+(_[a-z0-9]+)*$/;
  return e.test(i10) || t.test(i10);
}
function ne(i10, e) {
  if (!i10.name || i10.name.length === 0) throw new C("Field name cannot be blank", i10.name, "Every field must have a descriptive name");
  if (!_i(i10.name)) throw new C(`Invalid field name '${i10.name}' - must be camelCase or snake_case`, i10.name, 'Use camelCase (e.g., "userInput") or snake_case (e.g., "user_input")');
  if (M.signatureStrict && ["text", "object", "image", "string", "number", "boolean", "json", "array", "datetime", "date", "time", "type", "class", "input", "output", "data", "value", "result", "response", "request", "item", "element"].includes(i10.name.toLowerCase())) {
    let n = e === "input" ? ["userInput", "questionText", "documentContent", "messageText", "queryString"] : ["responseText", "analysisResult", "categoryType", "summaryText", "outputData"];
    throw new C(`Field name '${i10.name}' is too generic`, i10.name, `Use a more descriptive name. Examples for ${e} fields: ${n.join(", ")}`);
  }
  if (i10.name.length < 2) throw new C(`Field name '${i10.name}' is too short`, i10.name, "Field names must be at least 2 characters long");
  if (i10.name.length > 50) throw new C(`Field name '${i10.name}' is too long (${i10.name.length} characters)`, i10.name, "Field names should be 50 characters or less");
  i10.type && Di(i10, e);
}
function Di(i10, e) {
  if (!i10.type) return;
  let { type: t } = i10;
  if ((t.name === "image" || t.name === "audio" || t.name === "file" || t.name === "url") && e === "output") throw new C(`${t.name} type is not supported in output fields`, i10.name, `${t.name} types can only be used in input fields`);
  if (t.name === "class") {
    if (e === "input") throw new C("Class type is not supported in input fields", i10.name, 'Class types are only allowed on output fields. Use "string" type for input classifications');
    if (!t.options || t.options.length === 0) throw new C("Class type requires options", i10.name, 'Provide class options. Example: class "positive, negative, neutral"');
    for (let o of t.options) {
      if (!o || o.trim().length === 0) throw new C("Empty class option found", i10.name, "All class options must be non-empty strings");
      let r = o.trim();
      if (r.includes(",") || r.includes("|")) throw new C(`Invalid class option "${r}"`, i10.name, "Class options cannot contain commas (,) or pipes (|) as they are used to separate options");
    }
    if (new Set(t.options.map((o) => o.trim().toLowerCase())).size !== t.options.length) throw new C("Duplicate class options found", i10.name, "Each class option must be unique (case-insensitive)");
  }
  if (t.name === "code" && t.isArray) throw new C("Arrays of code are not commonly supported", i10.name, "Consider using a single code field or an array of strings instead");
  if (i10.isInternal && e === "input") throw new C("Internal marker (!) is not allowed on input fields", i10.name, "Internal markers are only allowed on output fields");
}
var pe = class {
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
    this.signature = new L(e), t?.description && this.signature.setDescription(t.description), t?.traceLabel && (this.traceLabel = t.traceLabel), e && this.signature.validate(), this.sigHash = this.signature?.hash(), this.children = new tt(), this.key = { id: this.signature.hash() };
  }
  getSignature() {
    return new L(this.signature);
  }
  setSignature(e) {
    this.signature = new L(e), e && this.signature.validate(), this.updateSignatureHash();
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
      this.examples = n.map((s) => {
        let a = {};
        for (let l of r) {
          let p = s[l.name];
          p !== void 0 && ($t(l, p), a[l.name] = p);
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
    return Ze(e);
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
  applyOptimization(e) {
    e.applyTo(this);
    for (let t of Array.from(this.children)) t && "applyOptimization" in t && typeof t.applyOptimization == "function" && t.applyOptimization(e);
  }
};
var Li = `
## Function Call Instructions
- Complete the task, using the functions defined earlier in this prompt. 
- Output fields should only be generated after all functions have been called.
- Use the function results to generate the output fields.`;
var Ni = `
## Strict Output Formatting Rules
- Output must strictly follow the defined plain-text \`field name: value\` field format.
- Output field, values must strictly adhere to the specified output field formatting rules.
- No formatting rules should override these **Strict Output Formatting Rules**
- Do not add any text before or after the output fields, just the field name and value.
- Do not use code blocks.`;
var fe = class {
  sig;
  fieldTemplates;
  task;
  thoughtFieldName;
  functions;
  constructor(e, t, n) {
    this.sig = e, this.fieldTemplates = n, this.thoughtFieldName = t?.thoughtFieldName ?? "thought", this.functions = t?.functions;
    let o = [], r = ds(this.sig.getInputFields()), s = ds(this.sig.getOutputFields());
    o.push(`You will be provided with the following fields: ${r}. Your task is to generate new fields: ${s}.`);
    let l = this.functions?.map((c) => "toFunction" in c ? c.toFunction() : c)?.flat()?.map((c) => `- \`${c.name}\`: ${qt(c.description)}`).join(`
`);
    l && l.length > 0 && o.push(`## Available Functions
${l}`);
    let p = Gi(this.sig.getInputFields());
    o.push(`## Input Fields
${p}`);
    let u = $i(this.sig.getOutputFields());
    o.push(`## Output Fields
${u}`), l && l.length > 0 && o.push(Li.trim()), o.push(Ni.trim());
    let d = this.sig.getDescription();
    if (d) {
      let c = qt(d);
      o.push(c);
    }
    this.task = { type: "text", text: o.join(`

`) + "\n" };
  }
  renderSingleValueUserContent = (e, t, n, o) => {
    let r = this.renderInputFields(e), a = (o ? r : [...t, ...n, ...r]).filter((l) => l !== void 0);
    return a.every((l) => l.type === "text") ? a.map((l) => l.text).join(`
`) : a.reduce(ms(`
`), []);
  };
  render = (e, { examples: t, demos: n }) => {
    let o = t ? [{ type: "text", text: `

## Examples
` }, ...this.renderExamples(t)] : [], r = n ? this.renderDemos(n) : [], s = o.every((c) => c.type === "text"), a = r.every((c) => c.type === "text"), l = s && a, p = this.task.text;
    if (l) {
      let c = [{ type: "text", text: p }, ...o, ...r];
      c.reduce(ms(""), []), c?.[0] && (p = c[0].text);
    }
    let u = { role: "system", content: p };
    if (Array.isArray(e)) {
      let c = [], m = e, g = true;
      for (let h of m) {
        let x;
        if (g ? (x = this.renderSingleValueUserContent(h.values, o, r, l), g = false) : x = this.renderSingleValueUserContent(h.values, [], [], false), h.role === "user") {
          c.push({ role: "user", content: x });
          continue;
        }
        if (h.role !== "assistant") throw new Error("Invalid message role");
        if (typeof x != "string") throw new Error("Assistant message cannot contain non-text content like images, files,etc");
        c.push({ role: "assistant", content: x });
      }
      return [u, ...c];
    }
    let d = this.renderSingleValueUserContent(e, o, r, l);
    return [u, { role: "user", content: d }];
  };
  renderExtraFields = (e) => {
    let t = [];
    if (!e || e.length === 0) return t;
    let n = e.reduce((r, s) => {
      let a = s.title;
      return r[a] || (r[a] = []), r[a].push(s), r;
    }, {});
    return Object.entries(n).map(([r, s]) => {
      if (s.length === 1) {
        let a = s[0];
        return { title: r, name: a.name, description: a.description };
      }
      if (s.length > 1) {
        let a = s.map((l) => `- ${l.description}`).join(`
`);
        return { title: r, name: s[0].name, description: a };
      }
    }).filter(Boolean).forEach((r) => {
      let s = this.fieldTemplates?.[r.name] ?? this.defaultRenderInField;
      t.push(...s(r, r.description));
    }), t;
  };
  renderExamples = (e) => {
    let t = [], n = { isExample: true };
    for (let [o, r] of e.entries()) {
      let s = this.sig.getInputFields().map((p) => this.renderInField(p, r, { ...n, isInputField: true })).filter((p) => p !== void 0).flat(), a = this.sig.getOutputFields().map((p) => this.renderInField(p, r, { ...n, isInputField: false })).filter((p) => p !== void 0).flat(), l = [...s, ...a];
      o > 0 && l.length > 0 && l[0]?.type === "text" && t.push({ type: "text", text: `---

` }), l.forEach((p) => {
        "text" in p && (p.text = `${p.text}
`), t.push(p);
      });
    }
    return t;
  };
  renderDemos = (e) => {
    let t = [], n = this.sig.getInputFields(), o = this.sig.getOutputFields(), r = { isExample: true };
    for (let s of e) {
      let a = n.map((u) => this.renderInField(u, s, { ...r, isInputField: true })).filter((u) => u !== void 0).flat(), l = o.map((u) => this.renderInField(u, s, { ...r, isInputField: false })).filter((u) => u !== void 0).flat();
      [...a, ...l].slice(0, -1).forEach((u) => {
        "text" in u && (u.text = `${u.text}
`), t.push(u);
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
    if (Bi(e, o, n)) return;
    e.type && $t(e, o);
    let r = Ui(e, o);
    return (this.fieldTemplates?.[e.name] ?? this.defaultRenderInField)(e, r);
  };
  defaultRenderInField = (e, t) => {
    if (e.type?.name === "image") {
      let o = (s) => {
        if (!s) throw new Error("Image field value is required.");
        if (typeof s != "object") throw new Error("Image field value must be an object.");
        if (!("mimeType" in s)) throw new Error("Image field must have mimeType");
        if (!("data" in s)) throw new Error("Image field must have data");
        return s;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("Image field value must be an array.");
        r = r.concat(t.map((s) => {
          let a = o(s);
          return { type: "image", mimeType: a.mimeType, image: a.data };
        }));
      } else {
        let s = o(t);
        r.push({ type: "image", mimeType: s.mimeType, image: s.data });
      }
      return r;
    }
    if (e.type?.name === "audio") {
      let o = (s) => {
        if (!s) throw new Error("Audio field value is required.");
        if (typeof s != "object") throw new Error("Audio field value must be an object.");
        if (!("data" in s)) throw new Error("Audio field must have data");
        return s;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("Audio field value must be an array.");
        r = r.concat(t.map((s) => {
          let a = o(s);
          return { type: "audio", format: a.format ?? "wav", data: a.data };
        }));
      } else {
        let s = o(t);
        r.push({ type: "audio", format: s.format ?? "wav", data: s.data });
      }
      return r;
    }
    if (e.type?.name === "file") {
      let o = (s) => {
        if (!s) throw new Error("File field value is required.");
        if (typeof s != "object") throw new Error("File field value must be an object.");
        if (!("mimeType" in s)) throw new Error("File field must have mimeType");
        let a = "data" in s, l = "fileUri" in s;
        if (!a && !l) throw new Error("File field must have either data or fileUri");
        if (a && l) throw new Error("File field cannot have both data and fileUri");
        return s;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("File field value must be an array.");
        r = r.concat(t.map((s) => {
          let a = o(s);
          return "fileUri" in a ? { type: "file", mimeType: a.mimeType, fileUri: a.fileUri } : { type: "file", mimeType: a.mimeType, data: a.data };
        }));
      } else {
        let s = o(t);
        r.push("fileUri" in s ? { type: "file", mimeType: s.mimeType, fileUri: s.fileUri } : { type: "file", mimeType: s.mimeType, data: s.data });
      }
      return r;
    }
    if (e.type?.name === "url") {
      let o = (s) => {
        if (!s) throw new Error("URL field value is required.");
        if (typeof s == "string") return { url: s };
        if (typeof s != "object") throw new Error("URL field value must be a string or object.");
        if (!("url" in s)) throw new Error("URL field must have url property");
        return s;
      }, r = [{ type: "text", text: `${e.title}: ` }];
      if (e.type.isArray) {
        if (!Array.isArray(t)) throw new Error("URL field value must be an array.");
        r = r.concat(t.map((s) => {
          let a = o(s);
          return { type: "url", url: a.url, ...a.title ? { title: a.title } : {}, ...a.description ? { description: a.description } : {} };
        }));
      } else {
        let s = o(t);
        r.push({ type: "url", url: s.url, ...s.title ? { title: s.title } : {}, ...s.description ? { description: s.description } : {} });
      }
      return r;
    }
    let n = [e.title, ": "];
    return Array.isArray(t) ? (n.push(`
`), n.push(t.map((o) => `- ${o}`).join(`
`))) : n.push(t), [{ type: "text", text: n.join("") }];
  };
};
var ds = (i10) => i10.map((e) => `\`${e.title}\``).join(", ");
var Gi = (i10) => i10.map((t) => {
  let n = t.title, o = t.type?.name ? gs(t.type) : "string", r = t.isOptional ? `This optional ${o} field may be omitted` : `A ${o} field`, s = t.description ? ` ${qt(t.description)}` : "";
  return `${n}: (${r})${s}`.trim();
}).join(`
`);
var $i = (i10) => i10.map((t) => {
  let n = t.title, o = t.type?.name ? gs(t.type) : "string", r = t.isOptional ? `Only include this ${o} field if its value is available` : `This ${o} field must be included`, s = "";
  return t.description && t.description.length > 0 && (s = ` ${t.type?.name === "class" ? t.description : qt(t.description)}`), t.type?.options && t.type.options.length > 0 && (s.length > 0 && (s += ". "), s += `Allowed values: ${t.type.options.join(", ")}`), `${n}: (${r})${s}`.trim();
}).join(`
`);
var Ui = (i10, e) => {
  if (i10.type?.name === "date" && e instanceof Date) {
    let t = e.toISOString();
    return t.slice(0, t.indexOf("T"));
  }
  return i10.type?.name === "datetime" && e instanceof Date ? Zr(e) : i10.type?.name === "image" && typeof e == "object" || i10.type?.name === "audio" && typeof e == "object" || i10.type?.name === "file" && typeof e == "object" || i10.type?.name === "url" && (typeof e == "string" || typeof e == "object") || typeof e == "string" ? e : JSON.stringify(e, null, 2);
};
var gs = (i10) => {
  let e = (() => {
    switch (i10?.name) {
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
  return i10?.isArray ? `json array of ${e} items` : e;
};
function ms(i10) {
  return (e, t) => {
    if (t.type === "text") {
      let n = e.length > 0 ? e[e.length - 1] : null;
      n && n.type === "text" ? n.text += i10 + t.text : e.push(t);
    } else e.push(t);
    return e;
  };
}
var Bi = (i10, e, t) => {
  if (typeof e == "boolean") return false;
  if (!e || (Array.isArray(e) || typeof e == "string") && e.length === 0) {
    if (t?.isExample || i10.isOptional || i10.isInternal) return true;
    let n = t?.isInputField !== false ? "input" : "output";
    throw new Error(`Value for ${n} field '${i10.name}' is required.`);
  }
  return false;
};
function qt(i10) {
  let e = i10.trim();
  return e.length > 0 ? `${e.charAt(0).toUpperCase()}${e.slice(1)}${e.endsWith(".") ? "" : "."}` : "";
}
function qi(i10, e) {
  let t = i10.history(0, e), n = t.some((r) => r.role === "function");
  return t.some((r) => r.role === "assistant" && "functionCalls" in r && Array.isArray(r.functionCalls) && r.functionCalls.length > 0) && n;
}
function zi(i10, e) {
  let t = i10.history(0, e), n = [], o = t.filter((s) => s.role === "assistant" && "functionCalls" in s && Array.isArray(s.functionCalls) && s.functionCalls.length > 0), r = t.filter((s) => s.role === "function");
  for (let s of o) if ("functionCalls" in s && s.functionCalls) for (let a of s.functionCalls) {
    let l = r.find((p) => "functionId" in p && p.functionId === a.id);
    l && "result" in l && "functionId" in l && n.push({ index: n.length, functionName: a.function.name, functionId: a.id, args: a.function.params || "", result: String(l.result), isError: "isError" in l ? !!l.isError : false });
  }
  return n;
}
async function zt(i10, e, t, n) {
  if (!e?.resultPicker || i10.length <= 1) return 0;
  let o = e.resultPicker;
  if ((t ? qi(t, n) : false) && t) {
    let l = zi(t, n), p = await o({ type: "function", results: l });
    if (p < 0 || p >= l.length) throw new Error(`Result picker returned invalid index: ${p}. Must be between 0 and ${l.length - 1}`);
    return p;
  }
  let s = i10.map((l, p) => ({ index: p, sample: l.delta })), a = await o({ type: "fields", results: s });
  if (a < 0 || a >= i10.length) throw new Error(`Result picker returned invalid index: ${a}. Must be between 0 and ${i10.length - 1}`);
  return a;
}
async function hs(i10, e, t) {
  let n = i10?.getLast(e);
  if (!n || n.role !== "assistant" || n.chat.length <= 1) return 0;
  let o = n.chat.map((s) => ({ version: 0, index: s.index, delta: s.value }));
  return await zt(o, t, i10, e);
}
var ot = class {
  tools;
  logger;
  constructor(e, t) {
    this.tools = new Map(e.map((n) => [n.name, n])), this.logger = t;
  }
  async route(e, t) {
    let n = {}, o = {}, r = [];
    for (let [a, l] of Object.entries(e)) {
      let p = this.tools.get(this.normalizeToolName(a));
      if (p && l !== void 0 && l !== null) try {
        let u = await this.executeTool(p, l, t);
        n[a] = u, r.push(p.name);
      } catch {
        o[a] = l;
      }
      else o[a] = l;
    }
    let s = { ...o, ...n };
    return { toolResults: n, remainingFields: s };
  }
  async executeTool(e, t, n) {
    if (!e.func) throw new Error(`Tool ${e.name} has no handler function`);
    let o = typeof t == "object" && t !== null ? t : {}, r = M.tracer ?? trace.getTracer("ax");
    if (!r) {
      let s = e.func;
      return await s(o, { sessionId: n?.sessionId, traceId: n?.traceId });
    }
    return await r.startActiveSpan(`Tool: ${e.name}`, async (s) => {
      try {
        s.setAttributes?.({ "tool.name": e.name, "tool.mode": "prompt" });
        let a = e.func, l = await a(o, { sessionId: n?.sessionId, traceId: s.spanContext().traceId });
        return s.addEvent("gen_ai.tool.message", { name: e.name, args: JSON.stringify(o), result: typeof l == "string" ? l : JSON.stringify(l ?? "") }), l;
      } catch (a) {
        throw s.recordException(a), s.addEvent("function.error", { name: e.name, message: a.toString() }), a;
      } finally {
        s.end();
      }
    });
  }
  normalizeToolName(e) {
    return e.replace(/_([a-z])/g, (t, n) => n.toUpperCase());
  }
  isToolField(e) {
    return this.tools.has(this.normalizeToolName(e));
  }
  getToolFieldNames() {
    return Array.from(this.tools.keys()).map((e) => e.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, ""));
  }
};
var jt = class {
  functionCallMode;
  tools;
  router;
  usePromptMode = false;
  constructor(e) {
    this.functionCallMode = e.functionCallMode ?? "auto", this.tools = e.functions ?? [], this.functionCallMode === "prompt" && this.tools.length > 0 && (this.usePromptMode = true, this.router = new ot(this.tools));
  }
  setUsePromptMode(e) {
    this.usePromptMode = e, e && this.tools.length > 0 && !this.router && (this.router = new ot(this.tools));
  }
  getMode() {
    return this.functionCallMode;
  }
  processSignature(e) {
    return this.usePromptMode && this.tools.length > 0 ? e.injectToolFields(this.tools) : e;
  }
  async processResults(e, t) {
    return this.usePromptMode && this.router ? (await this.router.route(e, t)).remainingFields : e;
  }
  isPromptModeEnabled() {
    return this.usePromptMode;
  }
  isNativeModeEnabled() {
    return !this.usePromptMode && this.tools.length > 0;
  }
  getRouter() {
    return this.router;
  }
};
var H = class extends pe {
  promptTemplate;
  asserts;
  streamingAsserts;
  options;
  functions;
  fieldProcessors = [];
  streamingFieldProcessors = [];
  excludeContentFromTrace = false;
  thoughtFieldName;
  signatureToolCallingManager;
  constructor(e, t) {
    super(e, { description: t?.description, traceLabel: t?.traceLabel }), this.options = t, this.thoughtFieldName = t?.thoughtFieldName ?? "thought";
    let n = { functions: t?.functions, thoughtFieldName: this.thoughtFieldName };
    this.promptTemplate = new (t?.promptTemplate ?? fe)(this.signature, n), this.asserts = this.options?.asserts ?? [], this.streamingAsserts = this.options?.streamingAsserts ?? [], this.excludeContentFromTrace = t?.excludeContentFromTrace ?? false, this.usage = [], t?.functions && (this.functions = no(t.functions), t?.functionCallMode && (this.signatureToolCallingManager = new jt({ functionCallMode: t.functionCallMode, functions: this.functions })));
  }
  getSignatureName() {
    return this.signature.getDescription() || "unknown_signature";
  }
  getMetricsInstruments() {
    return Zn();
  }
  updateMeter(e) {
    Zn(e);
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
  async forwardSendRequest({ ai: e, mem: t, options: n, traceContext: o, functions: r, functionCall: s, stepIndex: a }) {
    let { sessionId: l, model: p, rateLimiter: u, stream: d, thinkingTokenBudget: c, showThoughts: m } = n ?? {}, g = await hs(t, l, { resultPicker: n?.resultPicker }), h = t?.history(g, l) ?? [];
    if (h.length === 0) throw new Error("No chat prompt found");
    let x = { ...n?.modelConfig, ...n?.sampleCount ? { n: n.sampleCount } : {}, ...n?.sampleCount && n?.modelConfig?.temperature === 1 ? { temperature: 0.8 } : {} }, f = this.isDebug(e, n), A = a === 0, I = this.getLogger(e, n);
    return await e.chat({ chatPrompt: h, functions: r, functionCall: s, modelConfig: x, model: p }, { sessionId: l, rateLimiter: u, stream: d, debug: f, debugHideSystemPrompt: !A, thinkingTokenBudget: c, showThoughts: m, traceContext: o, abortSignal: n?.abortSignal, stepIndex: a, logger: I });
  }
  async *forwardCore({ ai: e, mem: t, options: n, stepIndex: o, span: r, traceContext: s, states: a }) {
    let { sessionId: l, functions: p } = n ?? {}, u = n?.functionCall ?? this.options?.functionCall, d = n?.strictMode ?? false, c = n.model, m = this.usage, g = o === 0, h = this.isDebug(e, n), x = this.getLogger(e, n), { functions: f, functionCall: A } = Qr(p, u, g, n), I = await this.forwardSendRequest({ ai: e, mem: t, options: n, traceContext: s, functions: f, functionCall: A, stepIndex: o });
    I instanceof ReadableStream ? yield* is({ ai: e, model: c, res: I, mem: t, sessionId: l, traceId: r ? r.spanContext?.().traceId : void 0, functions: f, strictMode: d, span: r, states: a, usage: m, asserts: this.asserts, streamingAsserts: this.streamingAsserts, fieldProcessors: this.fieldProcessors, streamingFieldProcessors: this.streamingFieldProcessors, thoughtFieldName: this.thoughtFieldName, excludeContentFromTrace: this.excludeContentFromTrace, signature: this.signature, logger: x, debug: h, functionResultFormatter: n?.functionResultFormatter ?? this.options?.functionResultFormatter }) : yield* as({ ai: e, model: c, res: I, mem: t, sessionId: l, traceId: r ? r.spanContext?.().traceId : void 0, functions: f, span: r, strictMode: d, states: a, usage: m, asserts: this.asserts, fieldProcessors: this.fieldProcessors, thoughtFieldName: this.thoughtFieldName, excludeContentFromTrace: this.excludeContentFromTrace, signature: this.signature, logger: x, debug: h, functionResultFormatter: n?.functionResultFormatter ?? this.options?.functionResultFormatter });
  }
  async *_forward2(e, t, n, o, r, s) {
    let a = (o?.stopFunction ?? this.options?.stopFunction)?.toLowerCase(), l = o.maxRetries ?? this.options?.maxRetries ?? 10, p = o.maxSteps ?? this.options?.maxSteps ?? 10, u = o.mem ?? this.options?.mem ?? new Qe();
    if (this.signatureToolCallingManager?.getMode() === "auto" && this.functions && this.functions.length > 0) {
      let I = e.getFeatures(o.model).functions;
      this.signatureToolCallingManager.setUsePromptMode(!I);
    }
    let d;
    {
      let A = this.options?.promptTemplate ?? fe, I = this.signature;
      this.signatureToolCallingManager?.isPromptModeEnabled() && (I = this.signatureToolCallingManager.processSignature(this.signature));
      let b = { functions: o?.functions ?? this.functions, thoughtFieldName: this.thoughtFieldName };
      this.promptTemplate = new A(I, b);
    }
    let c, m = performance.now();
    Array.isArray(t) ? (xr(t), c = this.promptTemplate.render(t, { examples: this.examples, demos: this.demos })) : c = this.promptTemplate.render(t, { examples: this.examples, demos: this.demos });
    let g = performance.now() - m, h = this.getMetricsInstruments();
    h && Lt(h, "prompt_render", g, this.getSignatureName());
    let x = performance.now();
    u.addRequest(c, o.sessionId);
    let f = performance.now() - x;
    h && Lt(h, "memory_update", f, this.getSignatureName());
    e: for (let A = 0; A < p; A++) {
      for (let b = 0; b < l; b++) try {
        let y = this.forwardCore({ options: o, ai: e, mem: u, stepIndex: A, span: r, traceContext: s, states: n });
        for await (let w of y) w !== void 0 && (yield { version: b, index: w.index, delta: w.delta });
        if (ls(u, a, n, o?.sessionId)) {
          let w = this.getMetricsInstruments();
          w && Dt(w, A + 1, p, this.getSignatureName());
          continue e;
        }
        let T = this.getMetricsInstruments();
        if (T) {
          Dt(T, A + 1, p, this.getSignatureName());
          let w = /* @__PURE__ */ new Set();
          n.forEach((P) => {
            P.functionsExecuted.forEach((k) => w.add(k));
          }), w.size > 0 && Br(T, true, w.size, true, false, this.getSignatureName()), qr(T, this.fieldProcessors.length, this.streamingFieldProcessors.length, this.getSignatureName());
        }
        return;
      } catch (y) {
        let R, T = this.isDebug(e, o), w = this.getLogger(e, o), P = this.getMetricsInstruments(), k = this.getSignatureName(), F = { error: y, errCount: b, logger: w, metricsInstruments: P, signatureName: k, span: r, debug: T };
        if (r?.recordException(y), y instanceof G) R = Kr(F), d = y;
        else if (y instanceof ae) R = Wr(F), d = y;
        else if (y instanceof E) Vr(F);
        else if (!(y instanceof Z)) throw ho(y, e, this.signature);
        R && (u.addRequest([{ role: "user", content: this.promptTemplate.renderExtraFields(R) }], o.sessionId), u.addTag("error", o.sessionId));
      }
      let I = this.getMetricsInstruments();
      throw I && to(I, l, false, l, this.getSignatureName()), ho(new Error(`Unable to fix validation error: ${d?.toString()}`), e, this.signature);
    }
    throw h && Dt(h, p, p, this.getSignatureName()), ho(new Error(`Max steps reached: ${p}`), e, this.signature);
  }
  async *_forward1(e, t, n) {
    let o = performance.now(), r = this.createStates(n.sampleCount ?? 1), s = performance.now() - o, a = this.getMetricsInstruments();
    a && Lt(a, "state_creation", s, this.getSignatureName());
    let l = n?.tracer ?? this.options?.tracer ?? e.getOptions().tracer, p = this.functions;
    if (n?.functions && (p = no(n.functions, this.functions)), !l) {
      yield* this._forward2(e, t, r, { ...n, functions: p });
      return;
    }
    let u = p?.map((f) => f.name).join(","), d = { signature: JSON.stringify(this.signature.toJSON(), null, 2), ...this.examples ? { examples: JSON.stringify(this.examples, null, 2) } : {}, ...u ? { provided_functions: u } : {}, ...n?.model ? { model: n.model } : {}, ...n?.thinkingTokenBudget ? { thinking_token_budget: n.thinkingTokenBudget } : {}, ...n?.showThoughts ? { show_thoughts: n.showThoughts } : {}, ...n?.maxSteps ? { max_steps: n.maxSteps } : {}, ...n?.maxRetries ? { max_retries: n.maxRetries } : {} }, c = this.traceLabel && n.traceLabel ? `${this.traceLabel} > ${n.traceLabel}` : n.traceLabel ?? this.traceLabel, m = c ? `AxGen > ${c}` : "AxGen", g = l.startSpan(m, { kind: SpanKind.SERVER, attributes: d }), h = context.active(), x = trace.setSpan(h, g);
    try {
      if (this.excludeContentFromTrace || g.addEvent("input", { content: JSON.stringify(t, null, 2) }), yield* this._forward2(e, t, r, { ...n, functions: p }, g, x), !this.excludeContentFromTrace) {
        let f = r.map((I) => I.values), A = f.length === 1 ? f[0] : f;
        g.addEvent("output", { content: JSON.stringify(A, null, 2) });
      }
    } finally {
      g.end();
    }
  }
  async forward(e, t, n) {
    let o = performance.now(), r = this.getSignatureName(), s = n?.stream ?? false, a = false, l = 0, p = false;
    try {
      let u = this.getMetricsInstruments();
      u && Hr(u, this.signature.getInputFields().length, this.signature.getOutputFields().length, this.examples?.length ?? 0, this.demos?.length ?? 0, r);
      let d = this._forward1(e, t, n ?? {}), c = [], m = 0, g = 0;
      for await (let y of d) y.version !== m && (c = []), m = y.version, c = io(c, y), g++;
      l = m;
      let h = performance.now();
      p = !!n?.resultPicker;
      let x = await zt(c, { resultPicker: n?.resultPicker }, n?.mem, n?.sessionId), f = performance.now() - h, I = c[x]?.delta ?? {};
      this.signatureToolCallingManager?.isPromptModeEnabled() && (I = await this.signatureToolCallingManager.processResults(I, { sessionId: n?.sessionId }));
      let b = Array.isArray(t) ? {} : t ?? {};
      if (this.trace = { ...b, ...I }, p && this.isDebug(e, n)) {
        let y = this.getLogger(e, n);
        Xo(c.length, x, f, y);
      }
      return a = true, u && (jr(u, c.length, p, p ? f : void 0, r), zr(u, s, g, void 0, r)), I;
    } catch (u) {
      throw a = false, u;
    } finally {
      let u = performance.now() - o, d = this.getMetricsInstruments();
      d && ($r(d, u, a, r, e.getName(), n?.model ? String(n.model) : void 0), l > 0 && to(d, l, a, n?.maxRetries ?? 10, r));
    }
  }
  async *streamingForward(e, t, n) {
    if (!n?.resultPicker) {
      yield* this._forward1(e, t, { ...n, stream: true });
      return;
    }
    let o = this._forward1(e, t, { ...n, stream: true }), r = [], s = 0;
    for await (let p of o) p.version !== s && (r = []), s = p.version, r = io(r, p);
    let a = await zt(r, { resultPicker: n?.resultPicker }, n?.mem, n?.sessionId), l = r[a];
    l && (yield { version: s, index: a, delta: l.delta });
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
var Ht = class extends Error {
  details;
  constructor(e, t, n) {
    super(e), this.name = "AxGenerateError", this.details = t, n?.cause && (this.cause = n.cause);
  }
};
function ho(i10, e, t) {
  let n = i10 instanceof Error ? i10 : new Error(String(i10)), o = e.getLastUsedChatModel(), r = e.getLastUsedModelConfig(), s = { model: o, maxTokens: r?.maxTokens, streaming: r?.stream ?? false, signature: { input: t.getInputFields(), output: t.getOutputFields(), description: t.getDescription() } };
  return new Ht("Generate failed", s, { cause: n });
}
var Vi = (i10) => i10.replace(/^\W+|\W+$/g, "");
var Ji = (i10, e) => {
  let t = i10.search(e);
  if (t === -1) return [i10];
  let n = i10.match(e);
  if (!n) throw new Error("Match failed unexpectedly.");
  let o = i10.substring(0, t), r = i10.substring(t + n[0].length);
  return [o, r];
};
var Qi = (i10) => {
  let e = /* @__PURE__ */ new Set(), t = [];
  for (let n of i10) e.has(n) || (e.add(n), t.push(n));
  return t;
};
var Yi = (i10) => {
  let e = i10.match(/^(\d+)[.,\s]+(.*)$/);
  if (!e || e.length < 3) throw new Error('line must start with a number, a dot and then text. e.g. "1. hello"');
  let t = Number.parseInt(e[1], 10), n = e[2].trim();
  return { id: t, text: n };
};
var Xi = (i10) => {
  let e = i10.match(/^(\d+)[.,\s]+(.*)$/);
  return e && e[2] !== void 0 ? e[2].trim() : i10;
};
var Zi = (i10, e) => {
  let t = [];
  for (let n = 0; n < i10.length; n += e) t.push(i10.slice(n, n + e));
  return t;
};
var fo = { trimNonAlphaNum: Vi, splitIntoTwo: Ji, dedup: Qi, extractIdAndText: Yi, extractIndexPrefixedText: Xi, batchArray: Zi };
var Ao = class extends H {
  constructor(e) {
    super(`"You are a re-ranker assistant tasked with evaluating a set of content items in relation to a specific question. Your role involves critically analyzing each content item to determine its relevance to the question and re-ranking them accordingly. This process includes assigning a relevance score from 0 to 10 to each content item based on how well it answers the question, its coverage of the topic, and the reliability of its information. This re-ranked list should start with the content item that is most relevant to the question and end with the least relevant. Output only the list."
    query: string, items: string[] -> rankedItems: string[] "list of id, 5-words Rationale, relevance score"`, e);
  }
  forward = async (e, t, n) => {
    let { rankedItems: o } = await super.forward(e, t, n), r = o.map((a) => {
      let { id: l } = fo.extractIdAndText(a);
      return l;
    });
    return { rankedItems: t.items.map((a, l) => {
      let p = r[l];
      return p !== void 0 ? t.items[p] : void 0;
    }).filter((a) => a !== void 0) };
  };
};
var xo = class {
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
var $d = new $();
var yo = class {
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
var Io = class {
  ai;
  db;
  debug;
  constructor(e) {
    this.db = new ie(), this.ai = e;
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
    let s = r.at(0);
    return s ? s.id : "";
  }
  setOptions(e) {
    typeof e.debug == "boolean" && (this.debug = e.debug);
  }
};
var fs = /* @__PURE__ */ new Set(["0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "don't", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadn't", "happens", "hardly", "has", "hasn", "hasnt", "hasn't", "have", "haven", "haven't", "having", "he", "hed", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "here's", "hereupon", "hers", "herself", "hes", "he's", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "how's", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "i'd", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "i'll", "im", "i'm", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isn't", "it", "itd", "it'd", "it'll", "its", "it's", "itself", "iv", "i've", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "let's", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightn't", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustn't", "my", "myself", "model", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "needn't", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shan't", "she", "shed", "she'd", "she'll", "shes", "she's", "should", "shouldn", "shouldn't", "should've", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "there's", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'd", "they'll", "theyre", "they're", "they've", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "t's", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasn't", "way", "we", "wed", "we'd", "welcome", "well", "we'll", "well-b", "went", "were", "we're", "weren", "werent", "weren't", "we've", "what", "whatever", "what'll", "whats", "what's", "when", "whence", "whenever", "when's", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "where's", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "who's", "whose", "why", "why's", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "won't", "words", "world", "would", "wouldn", "wouldnt", "wouldn't", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "you'd", "you'll", "your", "youre", "you're", "yours", "yourself", "yourselves", "you've", "yr", "ys", "yt", "z", "zero", "zi", "zz", "task"]);
function As(i10, e) {
  return i10.filter((t) => !e.has(t));
}
function xs(i10) {
  let e = {};
  for (let t of i10) e[t] = (e[t] || 0) + 1;
  return e;
}
function ue(i10) {
  let e = i10.normalize("NFD");
  return e = e.replace(/\b(a|an|the)\b/g, " "), e = e.split(/\s+/).join(" "), e = e.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, ""), e.toLowerCase();
}
function ea(i10, e) {
  return ue(i10) === ue(e) ? 1 : 0;
}
function ta(i10, e) {
  let t = ue(i10).split(" "), n = ue(e).split(" "), o = xs(t), r = xs(n), s = 0;
  for (let p in o) {
    let u = o[p] ?? 0, d = r[p] ?? 0;
    s += Math.min(u, d);
  }
  if (s === 0) return 0;
  let a = s / t.length, l = s / n.length;
  return 2 * a * l / (a + l);
}
function na(i10, e, t, n = false) {
  let o = ue(i10).split(" "), r = ue(e).split(" "), s = ue(t).split(" "), a = /* @__PURE__ */ new Set([...fs, ...o]);
  r = As(r, a), s = As(s, a);
  let l = 0, p = l / r.length, u = l / s.length, d = 2 * p * u / (p + u);
  return n ? u : d;
}
var oa = { emScore: ea, f1Score: ta, novelF1ScoreOptimized: na };
var bo = class {
  ai;
  program;
  examples;
  constructor({ ai: e, program: t, examples: n = [] }) {
    if (n.length === 0) throw new Error("No examples found");
    this.ai = e, this.program = t, this.examples = n;
  }
  async run(e) {
    let t = Date.now(), n = this.examples.length, o = 0;
    for (let s = 0; s < n; s++) {
      let a = this.examples[s];
      if (!a) throw new Error("Invalid example");
      try {
        let l = await this.program.forward(this.ai, a, { maxRetries: 1 }), p = await e({ prediction: l, example: a });
        o += p;
      } catch (l) {
        console.warn(`Program evaluation failed for example ${s}: ${l instanceof Error ? l.message : "Unknown error"}`);
      }
    }
    let r = n > 0 ? o / n : 0;
    this.ai.getOptions().debug && console.log(`
Performance: `, o, "/", n, "Average Score: ", r, `
`);
  }
};
var To = class {
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
    return this.rows = await this.fetchDataFromAPI(o), this.rows;
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
      let s = {};
      return t.forEach((a) => {
        let l = a.split("."), p = r.row;
        for (let d of l) Object.hasOwn(p, d) && (p = p[d]);
        if (!p) return;
        let u = n && a in n ? n[a] : a;
        if (!u) throw new Error(`Invalid field name: ${a}`);
        s[u] = p;
      }), s;
    }).filter((r) => Object.keys(r).length !== 0);
  }
};
var ys = (i10) => {
  console.log(i10);
};
var Is = (i10 = ys) => {
  let e = new $(), t = e.gray("\u2500".repeat(50)), n = e.gray("\u2501".repeat(50));
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
        {
          let s = o.value.configuration || {}, a = [];
          s.temperature !== void 0 && typeof s.temperature == "number" && a.push(`T=${s.temperature.toFixed(2)}`), s.bootstrappedDemos !== void 0 && a.push(`demos=${s.bootstrappedDemos}`), Object.entries(s).forEach(([u, d]) => {
            u !== "temperature" && u !== "bootstrappedDemos" && u !== "trialNumber" && typeof d == "number" && a.push(`${u}=${d.toFixed(2)}`);
          });
          let l = o.value.currentScore - o.value.bestScore, p = l > 0 ? e.greenBright(` \u2191${l.toFixed(3)}`) : l < 0 ? e.red(` \u2193${Math.abs(l).toFixed(3)}`) : "";
          r = `${e.yellow("\u25CF ")}${e.whiteBright(`Round ${o.value.round}/${o.value.totalRounds}`)}` + (s.trialNumber !== void 0 ? e.gray(` [Trial #${s.trialNumber}]`) : "") + `
  ${e.white("Score:")} ${e.green(o.value.currentScore.toFixed(3))} ${e.white("(best:")} ${e.greenBright(o.value.bestScore.toFixed(3))}${e.white(")")}${p}
` + (a.length > 0 ? `  ${e.white("Config:")} ${e.cyan(a.join(", "))}
` : "");
        }
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
        {
          let s = "";
          o.value.explanation && (s += `
${e.blueBright("\u{1F4CA} Summary:")}
  ${e.white(o.value.explanation)}
`), o.value.performanceAssessment && (s += `
${e.yellowBright("\u26A1 Performance:")}
  ${e.white(o.value.performanceAssessment)}
`), o.value.recommendations && o.value.recommendations.length > 0 && (s += `
${e.greenBright("\u{1F4A1} Recommendations:")}
`, o.value.recommendations.forEach((a, l) => {
            s += `  ${e.white(`${l + 1}.`)} ${e.white(a)}
`;
          })), r = `
${e.green("\u25CF ")}${e.whiteBright("Optimization Complete")}
${t}
  ${e.white("Best Score:")} ${e.greenBright(o.value.bestScore.toFixed(3))}
  ${e.white("Best Config:")} ${e.cyan(JSON.stringify(o.value.bestConfiguration).slice(0, 80))}${JSON.stringify(o.value.bestConfiguration).length > 80 ? "..." : ""}
  ${e.white("Total Calls:")} ${e.white(o.value.stats?.totalCalls?.toString() || "N/A")}
  ${e.white("Success Rate:")} ${e.green(`${((o.value.stats?.successfulDemos || 0) / Math.max(o.value.stats?.totalCalls || 1, 1) * 100).toFixed(1)}%`)}
` + s + `${n}
`;
        }
        break;
      case "ConfigurationProposal":
        r = `${e.magenta("\u25CF ")}${e.whiteBright(`${o.value.type} Proposals`)} ${e.white(`(${o.value.count})`)}
  ${e.white("Candidates:")} ${e.white(o.value.proposals.slice(0, 2).map((s) => typeof s == "string" ? `"${s.slice(0, 40)}..."` : `${JSON.stringify(s).slice(0, 40)}...`).join(", "))}
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
    i10(r);
  };
};
var ra = (i10 = ys) => {
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
    i10(n);
  };
};
var Kt = Is();
var bs = { enabled: true, enabledCategories: ["optimization", "convergence", "resource_usage", "teacher_student", "checkpointing", "pareto"], maxLabelLength: 100, samplingRate: 1 };
var Wt;
var sa = (i10) => {
  if (Wt) return Wt;
  if (i10) return Wt = la(i10), Wt;
};
var Vt = bs;
var ia = (i10) => {
  Vt = { ...Vt, ...i10 };
};
var aa = () => ({ ...Vt });
var la = (i10) => ({ optimizationLatencyHistogram: i10.createHistogram("ax_optimizer_optimization_duration_ms", { description: "End-to-end duration of optimization runs", unit: "ms" }), optimizationRequestsCounter: i10.createCounter("ax_optimizer_optimization_requests_total", { description: "Total number of optimization requests" }), optimizationErrorsCounter: i10.createCounter("ax_optimizer_optimization_errors_total", { description: "Total number of failed optimizations" }), convergenceRoundsHistogram: i10.createHistogram("ax_optimizer_convergence_rounds", { description: "Number of rounds until convergence" }), convergenceScoreGauge: i10.createGauge("ax_optimizer_convergence_score", { description: "Current best score during optimization" }), convergenceImprovementGauge: i10.createGauge("ax_optimizer_convergence_improvement", { description: "Improvement in score from baseline" }), stagnationRoundsGauge: i10.createGauge("ax_optimizer_stagnation_rounds", { description: "Number of rounds without improvement" }), earlyStoppingCounter: i10.createCounter("ax_optimizer_early_stopping_total", { description: "Total number of early stopping events" }), tokenUsageCounter: i10.createCounter("ax_optimizer_token_usage_total", { description: "Total tokens used during optimization" }), costUsageCounter: i10.createCounter("ax_optimizer_cost_usage_total", { description: "Total cost incurred during optimization", unit: "$" }), memoryUsageGauge: i10.createGauge("ax_optimizer_memory_usage_bytes", { description: "Peak memory usage during optimization", unit: "By" }), optimizationDurationHistogram: i10.createHistogram("ax_optimizer_duration_ms", { description: "Duration of optimization runs", unit: "ms" }), teacherStudentUsageCounter: i10.createCounter("ax_optimizer_teacher_student_usage_total", { description: "Total number of teacher-student interactions" }), teacherStudentLatencyHistogram: i10.createHistogram("ax_optimizer_teacher_student_latency_ms", { description: "Latency of teacher-student interactions", unit: "ms" }), teacherStudentScoreImprovementGauge: i10.createGauge("ax_optimizer_teacher_student_score_improvement", { description: "Score improvement from teacher-student interactions" }), checkpointSaveCounter: i10.createCounter("ax_optimizer_checkpoint_save_total", { description: "Total number of checkpoint saves" }), checkpointLoadCounter: i10.createCounter("ax_optimizer_checkpoint_load_total", { description: "Total number of checkpoint loads" }), checkpointSaveLatencyHistogram: i10.createHistogram("ax_optimizer_checkpoint_save_latency_ms", { description: "Latency of checkpoint save operations", unit: "ms" }), checkpointLoadLatencyHistogram: i10.createHistogram("ax_optimizer_checkpoint_load_latency_ms", { description: "Latency of checkpoint load operations", unit: "ms" }), paretoOptimizationsCounter: i10.createCounter("ax_optimizer_pareto_optimizations_total", { description: "Total number of Pareto optimizations" }), paretoFrontSizeHistogram: i10.createHistogram("ax_optimizer_pareto_front_size", { description: "Size of Pareto frontier" }), paretoHypervolumeGauge: i10.createGauge("ax_optimizer_pareto_hypervolume", { description: "Hypervolume of Pareto frontier" }), paretoSolutionsGeneratedHistogram: i10.createHistogram("ax_optimizer_pareto_solutions_generated", { description: "Number of solutions generated for Pareto optimization" }), programInputFieldsGauge: i10.createGauge("ax_optimizer_program_input_fields", { description: "Number of input fields in optimized program" }), programOutputFieldsGauge: i10.createGauge("ax_optimizer_program_output_fields", { description: "Number of output fields in optimized program" }), examplesCountGauge: i10.createGauge("ax_optimizer_examples_count", { description: "Number of training examples used" }), validationSetSizeGauge: i10.createGauge("ax_optimizer_validation_set_size", { description: "Size of validation set used" }), evaluationLatencyHistogram: i10.createHistogram("ax_optimizer_evaluation_latency_ms", { description: "Latency of program evaluations", unit: "ms" }), demoGenerationLatencyHistogram: i10.createHistogram("ax_optimizer_demo_generation_latency_ms", { description: "Latency of demo generation", unit: "ms" }), metricComputationLatencyHistogram: i10.createHistogram("ax_optimizer_metric_computation_latency_ms", { description: "Latency of metric computation", unit: "ms" }), optimizerTypeGauge: i10.createGauge("ax_optimizer_type", { description: "Type of optimizer being used" }), targetScoreGauge: i10.createGauge("ax_optimizer_target_score", { description: "Target score for optimization" }), maxRoundsGauge: i10.createGauge("ax_optimizer_max_rounds", { description: "Maximum rounds for optimization" }) });
var X = (i10) => {
  let e = {};
  for (let [t, n] of Object.entries(i10)) if (n != null) {
    let o = String(n), r = Vt.maxLabelLength;
    e[t] = o.length > r ? o.substring(0, r) : o;
  }
  return e;
};
var pa = (i10, e, t, n, o) => {
  try {
    let r = X({ success: t.toString(), optimizer_type: n, ...o ? { program_signature: o } : {} });
    i10.optimizationLatencyHistogram && i10.optimizationLatencyHistogram.record(e, r), i10.optimizationRequestsCounter && i10.optimizationRequestsCounter.add(1, r), !t && i10.optimizationErrorsCounter && i10.optimizationErrorsCounter.add(1, r);
  } catch (r) {
    console.warn("Failed to record optimization metric:", r);
  }
};
var ua = (i10, e, t, n, o, r) => {
  try {
    let s = X({ optimizer_type: r });
    i10.convergenceRoundsHistogram && i10.convergenceRoundsHistogram.record(e, s), i10.convergenceScoreGauge && i10.convergenceScoreGauge.record(t, s), i10.convergenceImprovementGauge && i10.convergenceImprovementGauge.record(n, s), i10.stagnationRoundsGauge && i10.stagnationRoundsGauge.record(o, s);
  } catch (s) {
    console.warn("Failed to record convergence metric:", s);
  }
};
var ca = (i10, e, t) => {
  try {
    let n = X({ reason: e, optimizer_type: t });
    i10.earlyStoppingCounter && i10.earlyStoppingCounter.add(1, n);
  } catch (n) {
    console.warn("Failed to record early stopping metric:", n);
  }
};
var da = (i10, e, t, n, o) => {
  try {
    let r = X({ optimizer_type: n });
    i10.tokenUsageCounter && i10.tokenUsageCounter.add(e, r), i10.costUsageCounter && i10.costUsageCounter.add(t, r), o !== void 0 && i10.memoryUsageGauge && i10.memoryUsageGauge.record(o, r);
  } catch (r) {
    console.warn("Failed to record resource usage metric:", r);
  }
};
var ma = (i10, e, t) => {
  try {
    let n = X({ optimizer_type: t });
    i10.optimizationDurationHistogram && i10.optimizationDurationHistogram.record(e, n);
  } catch (n) {
    console.warn("Failed to record optimization duration metric:", n);
  }
};
var ga = (i10, e, t, n) => {
  try {
    let o = X({ optimizer_type: n });
    i10.teacherStudentUsageCounter && i10.teacherStudentUsageCounter.add(1, o), i10.teacherStudentLatencyHistogram && i10.teacherStudentLatencyHistogram.record(e, o), i10.teacherStudentScoreImprovementGauge && i10.teacherStudentScoreImprovementGauge.record(t, o);
  } catch (o) {
    console.warn("Failed to record teacher-student metric:", o);
  }
};
var ha = (i10, e, t, n, o) => {
  try {
    let r = X({ operation: e, success: n.toString(), optimizer_type: o });
    e === "save" ? (i10.checkpointSaveCounter && i10.checkpointSaveCounter.add(1, r), i10.checkpointSaveLatencyHistogram && i10.checkpointSaveLatencyHistogram.record(t, r)) : (i10.checkpointLoadCounter && i10.checkpointLoadCounter.add(1, r), i10.checkpointLoadLatencyHistogram && i10.checkpointLoadLatencyHistogram.record(t, r));
  } catch (r) {
    console.warn("Failed to record checkpoint metric:", r);
  }
};
var fa = (i10, e, t, n, o) => {
  try {
    let r = X({ optimizer_type: n });
    i10.paretoOptimizationsCounter && i10.paretoOptimizationsCounter.add(1, r), i10.paretoFrontSizeHistogram && i10.paretoFrontSizeHistogram.record(e, r), o !== void 0 && i10.paretoHypervolumeGauge && i10.paretoHypervolumeGauge.record(o, r), i10.paretoSolutionsGeneratedHistogram && i10.paretoSolutionsGeneratedHistogram.record(t, r);
  } catch (r) {
    console.warn("Failed to record Pareto metric:", r);
  }
};
var Aa = (i10, e, t, n, o, r) => {
  try {
    let s = X({ optimizer_type: r });
    i10.programInputFieldsGauge && i10.programInputFieldsGauge.record(e, s), i10.programOutputFieldsGauge && i10.programOutputFieldsGauge.record(t, s), i10.examplesCountGauge && i10.examplesCountGauge.record(n, s), i10.validationSetSizeGauge && i10.validationSetSizeGauge.record(o, s);
  } catch (s) {
    console.warn("Failed to record program complexity metric:", s);
  }
};
var xa = (i10, e, t, n) => {
  try {
    let o = X({ metric_type: e, optimizer_type: n });
    switch (e) {
      case "evaluation":
        i10.evaluationLatencyHistogram && i10.evaluationLatencyHistogram.record(t, o);
        break;
      case "demo_generation":
        i10.demoGenerationLatencyHistogram && i10.demoGenerationLatencyHistogram.record(t, o);
        break;
      case "metric_computation":
        i10.metricComputationLatencyHistogram && i10.metricComputationLatencyHistogram.record(t, o);
        break;
    }
  } catch (o) {
    console.warn("Failed to record optimizer performance metric:", o);
  }
};
var ya = (i10, e, t, n) => {
  try {
    let o = X({ optimizer_type: e });
    i10.optimizerTypeGauge && i10.optimizerTypeGauge.record(1, o), t !== void 0 && i10.targetScoreGauge && i10.targetScoreGauge.record(t, o), n !== void 0 && i10.maxRoundsGauge && i10.maxRoundsGauge.record(n, o);
  } catch (o) {
    console.warn("Failed to record optimizer configuration metric:", o);
  }
};
var rt = class {
  bestScore;
  stats;
  instruction;
  demos;
  examples;
  modelConfig;
  optimizerType;
  optimizationTime;
  totalRounds;
  converged;
  scoreHistory;
  configurationHistory;
  constructor(e) {
    this.bestScore = e.bestScore, this.stats = e.stats, this.instruction = e.instruction, this.demos = e.demos, this.examples = e.examples, this.modelConfig = e.modelConfig, this.optimizerType = e.optimizerType, this.optimizationTime = e.optimizationTime, this.totalRounds = e.totalRounds, this.converged = e.converged, this.scoreHistory = e.scoreHistory, this.configurationHistory = e.configurationHistory;
  }
  applyTo(e) {
    this.demos && this.demos.length > 0 && e.setDemos(this.demos), this.examples && this.examples.length > 0 && e.setExamples(this.examples), this.instruction && (e._optimizedInstruction = this.instruction), this.modelConfig && (e._optimizedModelConfig = this.modelConfig);
  }
};
var Jt = class {
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
  resultExplainer;
  constructor(e) {
    this.studentAI = e.studentAI, this.teacherAI = e.teacherAI, this.targetScore = e.targetScore, this.minSuccessRate = e.minSuccessRate, this.onProgress = e.onProgress, this.onEarlyStop = e.onEarlyStop, this.seed = e.seed, this.checkpointSave = e.checkpointSave, this.checkpointLoad = e.checkpointLoad, this.checkpointInterval = e.checkpointInterval ?? 10, this.resumeFromCheckpoint = e.resumeFromCheckpoint, this.logger = e.logger, this.verbose = e.verbose;
    let t = new Jt({ maxTokens: 1e6 });
    this.costTracker = e.costTracker ?? t, this.metricsInstruments = sa(M.meter), this.stats = this.initializeStats(), this.debugOptimizer = e.debugOptimizer ?? false, this.optimizerLogger = e.optimizerLogger ?? (this.verbose ? Kt : void 0), this.initializeResultExplainer();
  }
  initializeResultExplainer() {
    this.resultExplainer = void 0;
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
  validateExamples(e, t = true) {
    if (!e || e.length === 0) throw new Error("At least 1 example is required for optimization");
    if (t && e.length < 2) throw new Error("At least 2 examples are required for optimization with auto-splitting. Provide more examples to enable proper train/validation split.");
    let n = t ? 10 : 5;
    e.length < n && this.verbose && console.warn(`[Ax Optimizer] Warning: Only ${e.length} examples provided. Consider providing more examples (${n}+ recommended) for better optimization results.`);
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
  async *compileStream(e, t, n, o) {
    let r = Date.now(), s = this.constructor.name, a = e.getSignature().toString();
    this.recordOptimizationStart(s, a);
    let l, p = (g, h, x, f, A, I, b, y = {}, R) => {
      this.getOptimizerLogger(R)?.({ name: "RoundProgress", value: { round: g, totalRounds: R?.maxIterations ?? 0, currentScore: h, bestScore: I, configuration: x } }), this.updateOptimizationProgress(g, h, x, f, A, I, b, y, R);
    }, u = (g, h) => {
      l = g, this.triggerEarlyStopping(g, this.currentRound);
    }, d = (g) => {
      this.onProgress?.(g), p(g.round, g.currentScore, g.currentConfiguration || {}, s, {}, g.bestScore, g.bestConfiguration, g.convergenceInfo, o);
    }, c = await this.compile(e, t, n, { ...o, overrideOnProgress: d, overrideOnEarlyStop: u }), m = Date.now() - r;
    return this.recordOptimizationComplete(m, true, s, a), l && this.getLogger(o)?.({ name: "Notification", id: "optimization_early_stop", value: `Optimization stopped early due to ${l}` }), { demos: c.demos, stats: c.stats, bestScore: c.bestScore, finalConfiguration: c.finalConfiguration, scoreHistory: c.scoreHistory, configurationHistory: c.configurationHistory };
  }
  async compilePareto(e, t, n, o) {
    let r = this.constructor.name, s = Date.now(), a = await this.generateWeightedSolutions(e, t, n, o), l = await this.generateConstraintSolutions(e, t, n, o), p = [...a, ...l], u = this.findParetoFrontier(p), d = this.calculateHypervolume(u);
    this.updateResourceUsage(s), this.stats.convergenceInfo.converged = true, this.recordParetoMetrics(u.length, p.length, "base_optimizer", d);
    let c = u.length > 0 ? Math.max(...u.map((m) => Math.max(...Object.values(m.scores)))) : 0;
    return { demos: u.length > 0 ? [...u[0].demos] : void 0, stats: this.stats, bestScore: c, paretoFront: u, hypervolume: d, paretoFrontSize: u.length, finalConfiguration: { paretoFrontSize: u.length, hypervolume: d, strategy: "weighted_combinations_and_constraints", numSolutions: p.length } };
  }
  async generateWeightedSolutions(e, t, n, o) {
    let r = [];
    if (!t || t.length === 0) throw new Error("No examples provided for Pareto optimization");
    let s = t[0], a = await e.forward(this.getAIService(false, o), s), l = await n({ prediction: a, example: s }), p = Object.keys(l), u = this.generateWeightCombinations(p);
    for (let d = 0; d < u.length; d++) {
      let c = u[d], m = async ({ prediction: g, example: h }) => {
        let x = await n({ prediction: g, example: h }), f = 0;
        for (let [A, I] of Object.entries(x)) f += I * (c[A] || 0);
        return f;
      };
      try {
        let g = await this.compile(e, t, m, { ...o, verbose: false }), h = await this.evaluateWithMultiObjective(e, g, n, t);
        r.push({ scores: h, demos: g.demos, configuration: { ...g.finalConfiguration, weights: c, strategy: "weighted_combination" } });
      } catch {
      }
    }
    return r;
  }
  async generateConstraintSolutions(e, t, n, o) {
    let r = [];
    if (!t || t.length === 0) throw new Error("No examples provided for multi-objective optimization");
    let s = t[0], a = await e.forward(this.getAIService(false, o), s), l = await n({ prediction: a, example: s }), p = Object.keys(l);
    for (let u of p) {
      let d = async ({ prediction: c, example: m }) => {
        let g = await n({ prediction: c, example: m }), h = g[u] || 0, x = 0;
        for (let [f, A] of Object.entries(g)) f !== u && A < 0.3 && (x += (0.3 - A) * 2);
        return h - x;
      };
      try {
        let c = await this.compile(e, t, d, { ...o, verbose: false }), m = await this.evaluateWithMultiObjective(e, c, n, t);
        r.push({ scores: m, demos: c.demos, configuration: { ...c.finalConfiguration, primaryObjective: u, strategy: "constraint_based" } });
      } catch {
      }
    }
    return r;
  }
  generateWeightCombinations(e) {
    let t = [];
    for (let o of e) {
      let r = {};
      for (let s of e) r[s] = s === o ? 1 : 0;
      t.push(r);
    }
    let n = {};
    for (let o of e) n[o] = 1 / e.length;
    if (t.push(n), e.length === 2) {
      let [o, r] = e;
      for (let s = 0.1; s <= 0.9; s += 0.2) {
        let a = 1 - s;
        t.push({ [o]: s, [r]: a });
      }
    }
    if (e.length === 3) {
      let [o, r, s] = e;
      t.push({ [o]: 0.5, [r]: 0.3, [s]: 0.2 }, { [o]: 0.3, [r]: 0.5, [s]: 0.2 }, { [o]: 0.2, [r]: 0.3, [s]: 0.5 });
    }
    return t;
  }
  async evaluateWithMultiObjective(e, t, n, o) {
    let r = new H(e.getSignature());
    t.demos && r.setDemos(t.demos);
    let s = [], a = Math.max(1, Math.min(5, Math.floor(o.length * 0.2))), l = o.slice(-a), p = {}, u = l;
    for (let c of u) try {
      let m = await r.forward(this.studentAI, c), g = await n({ prediction: m, example: c });
      for (let [h, x] of Object.entries(g)) p[h] || (p[h] = []), p[h].push(x);
    } catch {
    }
    let d = {};
    for (let [c, m] of Object.entries(p)) d[c] = m.length > 0 ? m.reduce((g, h) => g + h, 0) / m.length : 0;
    return d;
  }
  findParetoFrontier(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let o = e[n], r = false, s = 0;
      for (let a = 0; a < e.length; a++) {
        if (n === a) continue;
        let l = e[a];
        if (this.dominates(l.scores, o.scores)) {
          r = true;
          break;
        }
        this.dominates(o.scores, l.scores) && s++;
      }
      r || t.push({ demos: o.demos || [], scores: o.scores, configuration: o.configuration, dominatedSolutions: s });
    }
    return t;
  }
  dominates(e, t) {
    let n = Object.keys(e), o = true, r = false;
    for (let s of n) {
      let a = e[s] || 0, l = t[s] || 0;
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
      let [o, r] = n, s = 0, a = [...e].sort((p, u) => (u.scores[o] || 0) - (p.scores[o] || 0)), l = 0;
      for (let p of a) {
        let u = p.scores[o] || 0, d = p.scores[r] || 0;
        s += u * (d - l), l = Math.max(l, d);
      }
      return s;
    }
  }
  async saveCheckpoint(e, t, n, o, r = {}, s) {
    let a = s?.overrideCheckpointSave || this.checkpointSave;
    if (!a) return;
    let l = Date.now(), p = false, u;
    try {
      let d = { version: "1.0.0", timestamp: Date.now(), optimizerType: e, optimizerConfig: t, currentRound: this.currentRound, totalRounds: this.stats.resourceUsage.totalTime > 0 ? this.currentRound : 0, bestScore: n, bestConfiguration: o, scoreHistory: [...this.scoreHistory], configurationHistory: [...this.configurationHistory], stats: { ...this.stats }, optimizerState: r, examples: [] };
      u = await a(d), p = true;
    } catch (d) {
      throw p = false, d;
    } finally {
      let d = Date.now() - l;
      this.recordCheckpointMetrics("save", d, p, e);
    }
    return u;
  }
  async loadCheckpoint(e, t) {
    let n = t?.overrideCheckpointLoad || this.checkpointLoad;
    if (!n) return null;
    let o = Date.now(), r = false, s = null;
    try {
      s = await n(e), r = s !== null;
    } catch (a) {
      throw r = false, a;
    } finally {
      let a = Date.now() - o;
      this.recordCheckpointMetrics("load", a, r, "unknown");
    }
    return s;
  }
  restoreFromCheckpoint(e) {
    this.currentRound = e.currentRound, this.scoreHistory = [...e.scoreHistory], this.configurationHistory = [...e.configurationHistory], this.stats = { ...e.stats };
  }
  shouldSaveCheckpoint(e, t) {
    let n = t?.overrideCheckpointInterval || this.checkpointInterval;
    return n !== void 0 && e % n === 0;
  }
  async updateOptimizationProgress(e, t, n, o, r, s, a, l = {}, p) {
    this.currentRound = e, this.scoreHistory.push(t), this.configurationHistory.push(n), this.shouldSaveCheckpoint(e, p) && await this.saveCheckpoint(o, r, s, a, l, p), this.getOptimizerLogger(p)?.({ name: "RoundProgress", value: { round: e, totalRounds: p?.maxIterations ?? 0, currentScore: t, bestScore: s, configuration: n } });
  }
  async saveFinalCheckpoint(e, t, n, o, r = {}, s) {
    s?.saveCheckpointOnComplete !== false && await this.saveCheckpoint(e, t, n, o, { ...r, final: true }, s);
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
        Aa(this.metricsInstruments, n, o, 0, 0, e);
      }
      ya(this.metricsInstruments, e, this.targetScore, void 0);
    }
  }
  recordOptimizationComplete(e, t, n, o) {
    if (!this.metricsInstruments) return;
    pa(this.metricsInstruments, e, t, n, o), ma(this.metricsInstruments, e, n);
    let r = this.costTracker?.getCurrentCost() ?? 0, s = this.costTracker?.getTotalTokens() ?? 0;
    da(this.metricsInstruments, s, r, n);
  }
  recordConvergenceMetrics(e, t, n, o, r) {
    this.metricsInstruments && ua(this.metricsInstruments, e, t, n, o, r);
  }
  recordEarlyStoppingMetrics(e, t) {
    this.metricsInstruments && ca(this.metricsInstruments, e, t);
  }
  recordTeacherStudentMetrics(e, t, n) {
    this.metricsInstruments && ga(this.metricsInstruments, e, t, n);
  }
  recordCheckpointMetrics(e, t, n, o) {
    this.metricsInstruments && ha(this.metricsInstruments, e, t, n, o);
  }
  recordParetoMetrics(e, t, n, o) {
    this.metricsInstruments && fa(this.metricsInstruments, e, t, n, o);
  }
  recordPerformanceMetrics(e, t, n) {
    this.metricsInstruments && xa(this.metricsInstruments, e, t, n);
  }
  isOptimizerLoggingEnabled(e) {
    return this.debugOptimizer || (e?.verbose ?? this.verbose ?? false);
  }
  getOptimizerLogger(e) {
    if (this.isOptimizerLoggingEnabled(e)) return this.optimizerLogger ?? M.optimizerLogger ?? Kt;
  }
  getStats() {
    return { ...this.stats };
  }
  async explainOptimizationResults(e, t, n) {
    let o = this.stats.convergenceInfo.converged, r = this.stats.totalCalls, s = r > 0 ? this.stats.successfulDemos / r * 100 : 0, a = `Optimization finished with best score ${e.toFixed(3)}${t ? ` using configuration ${JSON.stringify(t)}` : ""}. Convergence: ${o ? "yes" : "no"}. Success rate: ${s.toFixed(1)}%.`, l = [];
    if (o || l.push("Increase numTrials or relax earlyStoppingTrials to allow further improvement."), typeof this.targetScore == "number" && e < this.targetScore && l.push("Tighten the metric or supply more/better-labeled examples to reach targetScore."), t && "bootstrappedDemos" in t) {
      let u = t.bootstrappedDemos;
      typeof u == "number" && u === 0 && l.push("Consider allowing a small number of bootstrapped demos to boost performance.");
    }
    l.length === 0 && l.push("Re-run with more trials or different acquisition settings to explore more of the space.");
    let p = `Tokens used: ${this.stats.resourceUsage.totalTokens}, rounds: ${this.currentRound}, stagnationRounds: ${this.stats.convergenceInfo.stagnationRounds}.`;
    return { humanExplanation: a, recommendations: l, performanceAssessment: p };
  }
  async logOptimizationComplete(e, t, n, o, r) {
    let s = this.getOptimizerLogger(o);
    s && s(r ? { name: "OptimizationComplete", value: { optimizerType: e, bestScore: t, bestConfiguration: n || {}, totalCalls: this.stats.totalCalls, successRate: this.stats.totalCalls > 0 ? `${(this.stats.successfulDemos / this.stats.totalCalls * 100).toFixed(1)}%` : "N/A", explanation: r.humanExplanation, recommendations: r.recommendations, performanceAssessment: r.performanceAssessment, stats: this.stats } } : { name: "OptimizationComplete", value: { optimizerType: e, bestScore: t, bestConfiguration: n || {}, totalCalls: this.stats.totalCalls, successRate: this.stats.totalCalls > 0 ? `${(this.stats.successfulDemos / this.stats.totalCalls * 100).toFixed(1)}%` : "N/A", stats: this.stats } });
  }
  reset() {
    this.stats = this.initializeStats(), this.costTracker?.reset(), this.currentRound = 0, this.scoreHistory = [], this.configurationHistory = [];
  }
};
var st = class extends ce {
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
  async compileRound(e, t, n, o, r) {
    let s = Date.now(), a = r?.maxDemos ?? this.maxDemos, l = { modelConfig: { temperature: 0.7 } };
    this.maxTokensPerGeneration > 0 && (l.modelConfig.max_tokens = this.maxTokensPerGeneration);
    let p = ba([...t], this.maxExamples), u = this.traces.length;
    for (let d = 0; d < p.length; d += this.batchSize) {
      d > 0 && (l.modelConfig.temperature = 0.7 + 1e-3 * d);
      let c = p.slice(d, d + this.batchSize);
      for (let m of c) {
        if (!m || typeof m != "object") continue;
        let g = t.filter((f) => f !== m);
        e.setExamples(g);
        let h = this.getTeacherOrStudentAI();
        this.stats.totalCalls++;
        let x;
        try {
          let f = { ...l, maxRetries: 1 };
          x = await e.forward(h, m, f), this.costMonitoring && (this.stats.estimatedTokenUsage += JSON.stringify(m).length / 4 + JSON.stringify(x).length / 4), await o({ prediction: x, example: m }) >= 0.5 && (this.traces = [...this.traces, ...e.getTraces()], this.stats.successfulDemos++);
        } catch (f) {
          (this.verboseMode || this.debugMode) && console.warn(`Student model failed during bootstrap: ${f instanceof Error ? f.message : "Unknown error"}`), x = {};
        }
        if (this.traces.length >= a) return;
      }
    }
    if (this.earlyStoppingPatience > 0) {
      let c = this.traces.length - u;
      if (!this.stats.earlyStopping) this.stats.earlyStopping = { bestScoreRound: c > 0 ? n : 0, patienceExhausted: false, reason: "No improvement detected" };
      else if (c > 0) this.stats.earlyStopping.bestScoreRound = n;
      else if (n - this.stats.earlyStopping.bestScoreRound >= this.earlyStoppingPatience) {
        this.stats.earlyStopping.patienceExhausted = true, this.stats.earlyStopped = true, this.stats.earlyStopping.reason = `No improvement for ${this.earlyStoppingPatience} rounds`;
        return;
      }
    }
  }
  async compile(e, t, n, o) {
    this.validateExamples(t, false);
    let r = o?.maxIterations ?? this.maxRounds;
    this.traces = [], this.reset();
    for (let l = 0; l < r && (await this.compileRound(e, t, l, n, o), !this.stats.earlyStopped); l++) ;
    if (this.traces.length === 0) throw new Error("No demonstrations found. Either provide more examples or improve the existing ones.");
    let s = Ia(this.traces), a = 0;
    return this.traces.length > 0 && (a = this.stats.successfulDemos / Math.max(1, this.stats.totalCalls)), await this.logOptimizationComplete("BootstrapFewShot", a, { maxRounds: this.maxRounds, maxDemos: this.maxDemos, batchSize: this.batchSize, successRate: a, demosGenerated: s.length, tracesCollected: this.traces.length }, o), { demos: s, stats: this.stats, bestScore: a, finalConfiguration: { maxRounds: this.maxRounds, maxDemos: this.maxDemos, batchSize: this.batchSize, successRate: a } };
  }
};
function Ia(i10) {
  let e = /* @__PURE__ */ new Map();
  for (let n of i10) if (e.has(n.programId)) {
    let o = e.get(n.programId);
    o && o.push(n.trace);
  } else e.set(n.programId, [n.trace]);
  let t = [];
  return e.forEach((n, o) => {
    t.push({ traces: n, programId: o });
  }), t;
}
var ba = (i10, e) => {
  let t = [...i10];
  for (let n = t.length - 1; n > 0; n--) {
    let o = Math.floor(Math.random() * (n + 1)), r = t[n], s = t[o];
    if (!r || !s) throw new Error("Invalid array elements");
    [t[n], t[o]] = [s, r];
  }
  return t.slice(0, e);
};
function Ta(i10) {
  return L.create(i10);
}
function Ae(i10, e) {
  let t = typeof i10 == "string" ? L.create(i10) : i10;
  return new H(t, e);
}
var Qt = class {
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
      let s = new AbortController(), a = setTimeout(() => s.abort(), this.timeout), l = await fetch(n, { ...t, signal: s.signal });
      return clearTimeout(a), l;
    } catch (s) {
      o = s, this.logger?.({ name: "Notification", id: "retry_attempt", value: `Attempt ${r + 1} failed: ${s}` }), r < this.retryAttempts - 1 && await this.sleep(this.retryDelay * Math.pow(2, r));
    }
    throw new Error(`Request failed after ${this.retryAttempts} attempts: ${o?.message}`);
  }
  sleep(e) {
    return new Promise((t) => setTimeout(t, e));
  }
};
var Ro = class extends ce {
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
  optimizeTopP;
  sampleCount;
  pythonClient;
  localScoreHistory = [];
  localConfigurationHistory = [];
  customResultPicker;
  constructor(e) {
    if (super(e), this.numCandidates = e.numCandidates ?? 5, this.initTemperature = e.initTemperature ?? 0.7, this.maxBootstrappedDemos = e.maxBootstrappedDemos ?? 3, this.maxLabeledDemos = e.maxLabeledDemos ?? 4, this.numTrials = e.numTrials ?? 30, this.minibatch = e.minibatch ?? true, this.minibatchSize = e.minibatchSize ?? 25, this.minibatchFullEvalSteps = e.minibatchFullEvalSteps ?? 10, this.programAwareProposer = e.programAwareProposer ?? true, this.dataAwareProposer = e.dataAwareProposer ?? true, this.viewDataBatchSize = e.viewDataBatchSize ?? 10, this.tipAwareProposer = e.tipAwareProposer ?? true, this.fewshotAwareProposer = e.fewshotAwareProposer ?? true, this.earlyStoppingTrials = e.earlyStoppingTrials ?? 5, this.minImprovementThreshold = e.minImprovementThreshold ?? 0.01, this.bayesianOptimization = e.bayesianOptimization ?? true, this.acquisitionFunction = e.acquisitionFunction ?? "expected_improvement", this.explorationWeight = e.explorationWeight ?? 0.1, this.optimizeTopP = e.optimizeTopP ?? false, this.sampleCount = e.sampleCount ?? 1, this.customResultPicker = e.resultPicker, e.optimizerEndpoint) {
      let t = { endpoint: e.optimizerEndpoint, timeout: e.optimizerTimeout ?? 3e4, retryAttempts: e.optimizerRetries ?? 3, logger: (n) => {
        this.logger?.({ name: "Notification", id: "python_client", value: typeof n == "string" ? n : JSON.stringify(n) });
      } };
      this.pythonClient = new Qt(t);
    }
    this.stats.convergenceInfo.convergenceThreshold = this.minImprovementThreshold;
  }
  defaultResultPicker = async (e) => {
    if (e.type === "function") {
      let r = e.results.findIndex((s) => !s.isError);
      return r >= 0 ? r : 0;
    }
    let t = /* @__PURE__ */ new Map();
    for (let r of e.results) {
      let s = JSON.stringify(r.sample ?? {}), a = t.get(s);
      a ? a.count += 1 : t.set(s, { count: 1, firstIndex: r.index });
    }
    let n = "", o = { count: -1, firstIndex: 0 };
    for (let [r, s] of t.entries()) s.count > o.count && (o = s, n = r);
    return t.get(n)?.firstIndex ?? 0;
  };
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
    let n = Math.min(this.viewDataBatchSize, e.length), s = `
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
      let a = await t.chat({ chatPrompt: [{ role: "user", content: s }] });
      return "results" in a && a.results[0]?.content?.trim() || "General dataset";
    } catch {
      return "General dataset";
    }
  }
  async generateInstruction({ tip: e, candidateIndex: t, ai: n, programSummary: o, datasetSummary: r, previousInstructions: s = [] }) {
    let a = "";
    this.programAwareProposer && o && (a += `
Program Context: ${o}`), this.dataAwareProposer && r && (a += `
Dataset Context: ${r}`), this.fewshotAwareProposer && s.length > 0 && (a += `
Previous Instructions (avoid repeating): ${s.slice(-3).join("; ")}`);
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
      let m = (await Ae('programSummary?:string "Program context" , datasetSummary?:string "Dataset context" , tip?:string "Generation tip" -> instructionText:string "Well-crafted instruction for the program"').forward(n, { programSummary: o ?? "", datasetSummary: r ?? "", tip: e ?? "" })).instructionText;
      if (m && m.trim().length > 10) return m.trim();
    } catch {
    }
    let p = ["Analyze the input systematically and provide a precise, well-reasoned response.", "Think through this step-by-step, considering all relevant factors before responding.", "Examine the input carefully and generate an accurate, detailed answer.", "Process the information methodically and deliver a clear, comprehensive response.", "Consider the context thoroughly and provide a thoughtful, accurate answer."], u = p[t % p.length] || p[0];
    return e && (u = `${u} ${e}`), u;
  }
  async proposeInstructionCandidates(e, t, n = []) {
    let o = [], r = this.getTeacherOrStudentAI(t), s, a;
    this.programAwareProposer && (s = await this.generateProgramSummary(e, r)), this.dataAwareProposer && (a = await this.generateDatasetSummary([...n], r));
    let l = this.tipAwareProposer ? this.generateTips() : [];
    for (let p = 0; p < this.numCandidates; p++) {
      let u = l.length > 0 ? p % l.length : -1, d = u >= 0 ? l[u] : void 0, c = await this.generateInstruction({ tip: d, candidateIndex: p, ai: r, programSummary: s, datasetSummary: a, previousInstructions: o });
      o.push(c);
    }
    return o;
  }
  async bootstrapFewShotExamples(e, t, n) {
    return (await new st({ studentAI: this.studentAI, options: { maxDemos: this.maxBootstrappedDemos, maxRounds: 3, verboseMode: this.verbose ?? false } }).compile(e, n, t, { maxDemos: this.maxBootstrappedDemos })).demos || [];
  }
  selectLabeledExamples(e) {
    let t = [], n = /* @__PURE__ */ new Set();
    for (; n.size < this.maxLabeledDemos && n.size < e.length; ) {
      let o = Math.floor(Math.random() * e.length);
      if (!n.has(o)) {
        n.add(o);
        let r = e[o];
        r && t.push(r);
      }
    }
    return t;
  }
  applyConfigToProgram(e, t, n, o) {
    e.setInstruction && e.setInstruction(t.instruction), t.bootstrappedDemos > 0 && e.setDemos && e.setDemos(n.slice(0, t.bootstrappedDemos)), t.labeledExamples > 0 && e.setExamples && e.setExamples(o.slice(0, t.labeledExamples));
  }
  async compile(e, t, n, o) {
    let r = Date.now();
    if (this.validateExamples(t), this.setupRandomSeed(), o?.auto && this.configureAuto(o.auto), !this.pythonClient) throw new Error("AxMiPRO v2 requires the Python optimizer service. Please configure optimizerEndpoint.");
    if (!await this.pythonClient.healthCheck()) throw new Error("Python optimizer service is not available or unhealthy");
    return await this.compilePython(e, t, n, o);
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
    super.reset(), this.stats.convergenceInfo.convergenceThreshold = this.minImprovementThreshold;
  }
  validateProgram(e) {
    let t = [], n = [];
    return { isValid: t.length === 0, issues: t, suggestions: n };
  }
  async compilePython(e, t, n, o) {
    if (!this.pythonClient) throw new Error("Python client not initialized");
    let r = Date.now();
    this.localScoreHistory = [], this.localConfigurationHistory = [];
    let s = `mipro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, a = { study_name: s, parameters: [{ name: "temperature", type: "float", low: 0.1, high: 2 }, { name: "bootstrappedDemos", type: "int", low: 0, high: this.maxBootstrappedDemos }, ...this.optimizeTopP ? [{ name: "topP", type: "float", low: 0.7, high: 1 }] : []], objective: { name: "score", direction: "maximize" }, n_trials: this.numTrials, sampler: "TPESampler", pruner: this.minibatch ? "MedianPruner" : void 0 }, l = await this.pythonClient.createOptimizationJob(a);
    this.getOptimizerLogger()?.({ name: "OptimizationStart", value: { optimizerType: "MiPRO (Python)", exampleCount: t.length, validationCount: 0, config: { jobId: l.job_id, numTrials: this.numTrials } } });
    let u = Number.NEGATIVE_INFINITY, d, c = 0, m = 0;
    for (let b = 0; b < this.numTrials; b++) try {
      let y = await this.pythonClient.suggestParameters(s), R = y.params.temperature, T = y.params.bootstrappedDemos, w = this.optimizeTopP ? y.params.topP : void 0;
      if (R === void 0) throw new Error(`Missing temperature parameter in suggestion: ${JSON.stringify(y)}`);
      if (T === void 0) throw new Error(`Missing bootstrappedDemos parameter in suggestion: ${JSON.stringify(y)}`);
      let k = !this.minibatch || this.minibatchFullEvalSteps > 0 && b % this.minibatchFullEvalSteps === this.minibatchFullEvalSteps - 1 ? [...t] : (() => {
        let be = Math.min(this.minibatchSize, t.length), z = /* @__PURE__ */ new Set();
        for (; z.size < be; ) z.add(Math.floor(Math.random() * t.length));
        return Array.from(z).map((Os) => t[Os]);
      })(), F = await this.evaluateConfiguration(e, n, { temperature: R, bootstrappedDemos: T, topP: w }, k);
      c++, await this.pythonClient.evaluateTrial({ study_name: s, trial_number: y.trial_number, value: F }), F > u + this.minImprovementThreshold ? (u = F, d = { temperature: R, bootstrappedDemos: T, ...w !== void 0 ? { topP: w } : {}, trialNumber: y.trial_number }, m = 0) : m += 1, this.currentRound = b + 1;
      let K = { temperature: R, bootstrappedDemos: T, ...w !== void 0 ? { topP: w } : {}, trialNumber: y.trial_number };
      if (this.localScoreHistory.push(F), this.localConfigurationHistory.push(K), await this.updateOptimizationProgress(this.currentRound, F, K, "MiPRO (Python)", { sampler: "TPESampler" }, u, d), this.onProgress?.({ round: b + 1, totalRounds: this.numTrials, currentScore: F, bestScore: u, tokensUsed: this.stats.estimatedTokenUsage, timeElapsed: Date.now() - r, successfulExamples: c, totalExamples: t.length }), this.earlyStoppingTrials > 0 && m >= this.earlyStoppingTrials) {
        this.getOptimizerLogger()?.({ name: "EarlyStopping", value: { reason: `No improvement \u2265 ${this.minImprovementThreshold} for ${this.earlyStoppingTrials} trials`, finalScore: u, round: this.currentRound } }), this.onEarlyStop?.(`No improvement for ${this.earlyStoppingTrials} trials`, this.stats);
        break;
      }
    } catch {
    }
    let g = u, h = {}, x = [];
    try {
      let b = await this.pythonClient.getStudyResults(s);
      if (g = b.best_value || u, h = b.best_params || {}, h && Object.keys(h).length > 0) {
        let y = h.bootstrappedDemos || 0;
        y > 0 && (x = await this.bootstrapFewShotExamples(e, n, t.slice(0, Math.floor(t.length * 0.8))), x = x.slice(0, y));
      }
    } catch {
    }
    let f;
    try {
      let y = await Ae('optimizerType:string "Optimizer name" , bestScore:number "Final best score" , totalCalls:number "Total eval calls" , successfulDemos:number "Successful evals" , bestConfig:json "Best configuration" -> humanExplanation:string "Readable summary", recommendations:string[] "Next steps", performanceAssessment:string "Performance notes"').forward(this.studentAI, { optimizerType: "MiPRO (Python)", bestScore: g, totalCalls: this.stats.totalCalls, successfulDemos: this.stats.successfulDemos, bestConfig: h || {} });
      f = { humanExplanation: y.humanExplanation ?? "", recommendations: y.recommendations ?? [], performanceAssessment: y.performanceAssessment ?? "" };
    } catch {
    }
    await this.logOptimizationComplete("MiPRO (Python)", g, h, o, f);
    try {
      await this.pythonClient.deleteStudy(s);
    } catch {
    }
    this.stats.bestScore = g;
    let A = new H(e.getSignature());
    x.length > 0 && A.setDemos(x), h.temperature && (A._optimizedModelConfig = { temperature: h.temperature });
    let I = new rt({ bestScore: g, stats: this.stats, instruction: void 0, demos: x, examples: [], modelConfig: { temperature: h.temperature }, optimizerType: "MiPRO (Python)", optimizationTime: Date.now() - r, totalRounds: this.numTrials, converged: this.stats.convergenceInfo.converged, scoreHistory: [...this.localScoreHistory], configurationHistory: [...this.localConfigurationHistory] });
    return { bestScore: g, demos: x, stats: this.stats, optimizedGen: A, optimizedProgram: I, finalConfiguration: { temperature: h.temperature, bootstrappedDemos: h.bootstrappedDemos || 0, ...h } };
  }
  async evaluateConfiguration(e, t, n, o) {
    let r = 0, s = 0, a = 0, l = o, p = [];
    if (n.bootstrappedDemos > 0) try {
      p = (await this.bootstrapFewShotExamples(e, t, l)).slice(0, n.bootstrappedDemos);
    } catch {
      p = [];
    }
    for (let u of l) try {
      p.length > 0 && e.setDemos?.(p);
      let d = await e.forward(this.studentAI, u, { modelConfig: { temperature: n.temperature, ...n.topP !== void 0 ? { topP: n.topP } : {} }, sampleCount: this.sampleCount, resultPicker: this.sampleCount > 1 ? this.customResultPicker ?? this.defaultResultPicker : void 0 });
      this.stats.totalCalls += 1;
      let c = await t({ prediction: d, example: u });
      if (typeof c == "number" && !Number.isNaN(c)) {
        r += c, s++;
        let m = typeof this.targetScore == "number" ? this.targetScore : 0.5;
        c >= m && a++;
      }
    } catch (d) {
      this.getLogger()?.({ name: "Notification", id: "mipro_evaluate", value: typeof d == "string" ? d : String(d) });
    }
    return this.stats.successfulDemos += a, s > 0 ? r / s : 0;
  }
};
var it = class {
  analyzeMappingDependencies(e, t) {
    if (!e || typeof e != "function") return [];
    let n = [];
    try {
      let o = e.toString(), r = Array.from(o.matchAll(/state\.(\w+)/g));
      for (let s of r) s[1] && !n.includes(s[1]) && n.push(s[1]);
      if (n.length === 0) try {
        let s = this.createDependencyTracker(n);
        e(s);
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
      let s = o[r];
      return s && typeof s == "object" ? n.createTrackingProxy(s, t) : s;
    }, has(o, r) {
      return typeof r == "string" && !t.includes(r) && t.push(r), r in o;
    } });
  }
  parseStaticDependencies(e) {
    let t = [];
    try {
      let n = Array.from(e.matchAll(/state\.(\w+)/g));
      for (let s of n) s[1] && !t.includes(s[1]) && t.push(s[1]);
      let o = Array.from(e.matchAll(/\$\{state\.(\w+)\}/g));
      for (let s of o) s[1] && !t.includes(s[1]) && t.push(s[1]);
      let r = Array.from(e.matchAll(/\{\s*(\w+)(?:\s*,\s*(\w+))*\s*\}\s*=\s*state/g));
      for (let s of r) for (let a = 1; a < s.length; a++) s[a] && !t.includes(s[a]) && t.push(s[a]);
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
async function xe(i10, e, t) {
  if (!t || t <= 0 || t >= i10.length) {
    let o = i10.map((r, s) => e(r, s));
    return Promise.all(o);
  }
  let n = new Array(i10.length);
  for (let o = 0; o < i10.length; o += t) {
    let s = i10.slice(o, o + t).map((l, p) => {
      let u = o + p;
      return e(l, u).then((d) => ({ result: d, originalIndex: u }));
    }), a = await Promise.all(s);
    for (let { result: l, originalIndex: p } of a) n[p] = l;
  }
  return n;
}
var at = class {
  steps = [];
  parallelGroups = [];
  analyzer = new it();
  initialFields = /* @__PURE__ */ new Set();
  addExecutionStep(e, t, n, o, r, s, a) {
    let l = [], p = [], u = o || "map";
    if (t && n) u = "execute", l = this.analyzer.analyzeMappingDependencies(n, t), p = [`${t}Result`];
    else if (u === "map" && r) p = this.analyzeMapTransformation(r), l = this.getAllProducedFields();
    else if (u === "parallel-map") {
      if (Array.isArray(r)) {
        let c = /* @__PURE__ */ new Set();
        for (let m of r) this.analyzeMapTransformation(m).forEach((h) => c.add(h));
        p = Array.from(c);
      } else r ? p = this.analyzeMapTransformation(r) : p = ["_parallelMapResult"];
      l = this.getAllProducedFields();
    } else if (u === "merge") {
      if (s?.resultKey) p = [s.resultKey];
      else {
        let m = this.analyzeBranchMergeFields();
        p = m.length > 0 ? m : ["_mergedResult"];
      }
      e.toString().includes("_parallelResults") ? l = ["_parallelResults"] : l = this.getAllProducedFields();
    } else if (u === "parallel") p = ["_parallelResults"], l = this.getAllProducedFields();
    else if (u === "derive") if (a?.outputFieldName && a?.inputFieldName) {
      p = [a.outputFieldName];
      let c = r ? this.analyzer.analyzeMappingDependencies(r, "derive") : [];
      l = [a.inputFieldName, ...c].filter((m, g, h) => h.indexOf(m) === g);
    } else p = ["_deriveResult"], l = this.getAllProducedFields();
    else e.toString().includes("transform(") ? (u = "map", l = this.getAllProducedFields(), p = ["_mapResult"]) : e.toString().includes("_parallelResults") && (p = ["_parallelResults"], l = this.getAllProducedFields());
    for (let c of l) this.getAllProducedFields().includes(c) || this.initialFields.add(c);
    let d = { type: u, nodeName: t, dependencies: l, produces: p, stepFunction: e, stepIndex: this.steps.length };
    this.steps.push(d);
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
        let r = n.map((s) => {
          let a = s.match(/(\w+)\s*:/);
          return a ? a[1] : null;
        }).filter(Boolean);
        if (r.length > 0) return r;
      }
      let o = t.match(/state\.(\w+)\s*=/g);
      if (o) {
        let r = o.map((s) => {
          let a = s.match(/state\.(\w+)\s*=/);
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
        for (let r of o) r.produces.forEach((s) => t.add(s));
        this.parallelGroups.push({ level: n, steps: o }), n++;
      } else {
        let r = this.steps.filter((s) => !e.has(s.stepIndex));
        if (r.length > 0) {
          let s = r[0];
          e.add(s.stepIndex), s.produces.forEach((a) => t.add(a)), this.parallelGroups.push({ level: n, steps: [s] }), n++;
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
      let o = async (r, s) => {
        let a = await xe(n.steps, async (u) => await u.stepFunction(r, s), e);
        if (a.some((u) => u && typeof u == "object" && "_parallelResults" in u)) {
          let u = a.find((d) => d && typeof d == "object" && "_parallelResults" in d);
          return u || r;
        }
        let p = r;
        for (let u of a) p = { ...p, ...u };
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
var Ts = (i10) => {
  console.log(i10);
};
var ye = (i10, e = false) => {
  if (e) return "[State hidden]";
  let t = {};
  for (let [n, o] of Object.entries(i10)) if (typeof o == "string" && o.length > 100) t[n] = `${o.substring(0, 100)}...`;
  else if (Array.isArray(o) && o.length > 3) t[n] = [...o.slice(0, 3), `... (${o.length - 3} more)`];
  else if (typeof o == "object" && o !== null) {
    let r = JSON.stringify(o);
    r.length > 200 ? t[n] = `${r.substring(0, 200)}...` : t[n] = o;
  } else t[n] = o;
  return JSON.stringify(t, null, 2);
};
var Ie = (i10) => i10 < 1e3 ? `${i10.toFixed(1)}ms` : i10 < 6e4 ? `${(i10 / 1e3).toFixed(2)}s` : `${(i10 / 6e4).toFixed(2)}min`;
var Yt = (i10 = Ts) => {
  let e = new $(), t = e.gray(`${"\u2501".repeat(80)}
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
        let s = o.stepType === "execute" ? "\u26A1" : o.stepType === "map" ? "\u{1F504}" : o.stepType === "merge" ? "\u{1F500}" : o.stepType === "parallel" ? "\u2696\uFE0F" : "\u{1F4CB}";
        r = `${e.greenBright(`${s} [ STEP ${o.stepIndex} START ]`)} ${e.white(`(${o.stepType})`)}`, o.nodeName && (r += ` ${e.cyanBright(`Node: ${o.nodeName}`)}`), r += `
`, o.dependencies.length > 0 && (r += `${e.white("Dependencies:")} ${e.gray(o.dependencies.join(", "))}
`), o.produces.length > 0 && (r += `${e.white("Produces:")} ${e.cyan(o.produces.join(", "))}
`), r += `${e.white("State:")} ${e.gray(ye(o.state, true))}
`, r += n;
        break;
      }
      case "StepComplete": {
        let s = (o.stepType === "execute" || o.stepType === "map" || o.stepType === "merge" || o.stepType === "parallel", "\u2705");
        r = `${e.greenBright(`${s} [ STEP ${o.stepIndex} COMPLETE ]`)} ${e.white(`(${o.stepType})`)}`, o.nodeName && (r += ` ${e.cyanBright(`Node: ${o.nodeName}`)}`), r += ` ${e.magenta(`in ${Ie(o.executionTime)}`)}
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
        r = `${e.blueBright("\u2705 [ PARALLEL GROUP COMPLETE ]")} ${e.white(`Level ${o.groupLevel}`)}`, r += ` ${e.magenta(`in ${Ie(o.executionTime)}`)}
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
${t}`, r += `${e.white("Total Time:")} ${e.magenta(Ie(o.totalExecutionTime))}
`, r += `${e.white("Steps Executed:")} ${e.yellow(o.stepsExecuted.toString())}
`, r += `${e.white("Output Fields:")} ${e.green(o.outputFields.join(", "))}
`, r += `${e.white("Final State:")} ${e.gray(ye(o.finalState, true))}
`, r += t;
        break;
      case "FlowError":
        r = `
${e.redBright("\u274C [ AXFLOW ERROR ]")}
${t}`, o.stepIndex !== void 0 && (r += `${e.white("Step:")} ${e.yellow(o.stepIndex.toString())}`, o.stepType && (r += ` ${e.gray(`(${o.stepType})`)}`), o.nodeName && (r += ` ${e.cyan(`Node: ${o.nodeName}`)}`), r += `
`), r += `${e.white("Error:")} ${e.red(o.error)}
`, o.state && (r += `${e.white("State:")} ${e.gray(ye(o.state, true))}
`), r += t;
        break;
      default:
        r = e.gray(JSON.stringify(o, null, 2));
    }
    i10(r);
  };
};
var Ra = (i10 = Ts) => {
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
`), o += `State: ${ye(n.state, true)}
`, o += `${t}
`;
        break;
      case "StepComplete":
        o = `[ STEP ${n.stepIndex} COMPLETE ] (${n.stepType})`, n.nodeName && (o += ` Node: ${n.nodeName}`), o += ` in ${Ie(n.executionTime)}
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
        o = `[ PARALLEL GROUP COMPLETE ] Level ${n.groupLevel} in ${Ie(n.executionTime)}
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
`, o += `Total Time: ${Ie(n.totalExecutionTime)}
`, o += `Steps Executed: ${n.stepsExecuted}
`, o += `Output Fields: ${n.outputFields.join(", ")}
`, o += `Final State: ${ye(n.finalState, true)}
`, o += `${e}
`;
        break;
      case "FlowError":
        o = `
[ AXFLOW ERROR ]
${e}
`, n.stepIndex !== void 0 && (o += `Step: ${n.stepIndex}`, n.stepType && (o += ` (${n.stepType})`), n.nodeName && (o += ` Node: ${n.nodeName}`), o += `
`), o += `Error: ${n.error}
`, n.state && (o += `State: ${ye(n.state, true)}
`), o += `${e}
`;
        break;
      default:
        o = JSON.stringify(n, null, 2);
    }
    i10(o);
  };
};
var Ca = Yt();
var Rs = (i10) => {
  let e = /* @__PURE__ */ new Map();
  return { logger: i10, startTiming: (t) => {
    e.set(t, Date.now());
  }, endTiming: (t) => {
    let n = e.get(t);
    if (!n) return 0;
    let o = Date.now() - n;
    return e.delete(t), o;
  }, getCurrentTime: () => Date.now() };
};
var lt = class {
  constructor(e) {
    this.nodeGenerators = e;
  }
  steps = [];
  execute(e, t, n) {
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    return this.steps.push(async (r, s) => {
      let a = n?.ai ?? s.mainAi, l = n?.options ?? s.mainOptions, p = t(r), u = l?.traceLabel ? `Node:${e} (${l.traceLabel})` : `Node:${e}`, d;
      if ("forward" in o && typeof o.forward == "function") d = await o.forward(a, p, { ...l, traceLabel: u });
      else throw new Error(`Node program for '${e}' does not have a forward method`);
      return { ...r, [`${e}Result`]: d };
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
var Co = class {
  constructor(e) {
    this.nodeGenerators = e;
  }
  steps = [];
  execute(e, t, n) {
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    return this.steps.push(async (r, s) => {
      let a = n?.ai ?? s.mainAi, l = n?.options ?? s.mainOptions, p = t(r), u = l?.traceLabel ? `Node:${e} (${l.traceLabel})` : `Node:${e}`, d;
      if ("forward" in o && typeof o.forward == "function") d = await o.forward(a, p, { ...l, traceLabel: u });
      else throw new Error(`Node program for '${e}' does not have a forward method`);
      return { ...r, [`${e}Result`]: d };
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
var Xt = class i8 {
  static _ctorWarned = false;
  nodes = /* @__PURE__ */ new Map();
  flowDefinition = [];
  nodeGenerators = /* @__PURE__ */ new Map();
  loopStack = [];
  stepLabels = /* @__PURE__ */ new Map();
  branchContext = null;
  autoParallelConfig;
  executionPlanner = new at();
  program;
  nodeUsage = /* @__PURE__ */ new Map();
  nodeTraces = /* @__PURE__ */ new Map();
  flowLogger;
  timingLogger;
  defaultAIOptions;
  toCamelCase(e) {
    return e.replace(/_([a-z])/g, (t, n) => n.toUpperCase());
  }
  async executeStepsWithLogging(e, t, n, o) {
    let r = { ...t }, s = 0;
    for (let a = 0; a < e.length; a++) {
      let l = e[a];
      if (!l) continue;
      let p = this.getStepType(l, a), u = this.getStepMetadata(l, a), d = Object.keys(r);
      this.flowLogger && this.flowLogger({ name: "StepStart", timestamp: Date.now(), stepIndex: a, stepType: p, nodeName: u.nodeName, dependencies: u.dependencies, produces: u.produces, state: { ...r } });
      let c = Date.now();
      this.timingLogger?.startTiming(`step-${a}`);
      try {
        r = await l(r, n), s++;
        let g = this.timingLogger?.endTiming(`step-${a}`) ?? Date.now() - c, x = Object.keys(r).filter((A) => !d.includes(A)), f;
        if (p === "execute" && u.nodeName && x.length > 0) {
          let A = `${u.nodeName}Result`;
          f = r[A];
        }
        this.flowLogger && this.flowLogger({ name: "StepComplete", timestamp: Date.now(), stepIndex: a, stepType: p, nodeName: u.nodeName, executionTime: g, state: { ...r }, newFields: x, result: f });
      } catch (m) {
        throw this.flowLogger && this.flowLogger({ name: "FlowError", timestamp: Date.now(), error: m instanceof Error ? m.message : String(m), stepIndex: a, stepType: p, nodeName: u.nodeName, state: { ...r } }), m;
      }
    }
    return { finalState: r, stepsExecuted: s };
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
    if (this.nodeGenerators.size === 0 && e.steps.length === 0) return nt().input("userInput", nt.string("User input to the flow")).output("flowOutput", nt.string("Output from the flow")).build();
    let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
    for (let u of e.steps) u.produces.forEach((d) => t.add(d)), u.dependencies.forEach((d) => n.add(d));
    let o = /* @__PURE__ */ new Set();
    for (let u of Array.from(n)) t.has(u) || o.add(u);
    let r = /* @__PURE__ */ new Set(), s = e.steps[e.steps.length - 1];
    if (s && (s.type === "map" || s.type === "merge")) {
      if (s.produces.forEach((u) => {
        u.startsWith("_") || r.add(u);
      }), s.type === "merge" && s.produces.includes("_mergedResult")) for (let u of e.steps) u.type === "execute" && u.produces.length > 0 && u.produces.forEach((d) => r.add(d));
    } else for (let u of Array.from(t)) {
      let d = false;
      for (let c of e.steps) if (c.dependencies.includes(u)) {
        d = true;
        break;
      }
      if (!d) if (u.endsWith("Result")) {
        let c = u.replace("Result", ""), m = this.nodeGenerators.get(c);
        if (m) {
          let h = m.getSignature().getOutputFields();
          for (let x of h) r.add(x.name);
        } else r.add(u);
      } else r.add(u);
    }
    if (o.size === 0 && r.size === 0) {
      let u = [], d = [];
      for (let [m, g] of Array.from(this.nodeGenerators)) {
        let h = g.getSignature();
        for (let x of h.getInputFields()) {
          let f = this.toCamelCase(`${m}_${x.name}`);
          u.push({ name: f, type: x.type, description: x.description, isOptional: x.isOptional, isInternal: x.isInternal });
        }
        for (let x of h.getOutputFields()) {
          let f = this.toCamelCase(`${m}_${x.name}`);
          d.push({ name: f, type: x.type, description: x.description, isOptional: x.isOptional, isInternal: x.isInternal });
        }
      }
      let c = new L();
      return u.length > 0 ? c.setInputFields(u) : c.addInputField({ name: "userInput", type: { name: "string" }, description: "User input to the flow" }), d.length > 0 ? c.setOutputFields(d) : c.addOutputField({ name: "flowOutput", type: { name: "string" }, description: "Output from the flow" }), c;
    }
    let a = new L(), l = [];
    for (let u of Array.from(o)) l.push({ name: u, type: { name: "string" }, description: `Input field: ${u}` });
    l.length === 0 && l.push({ name: "userInput", type: { name: "string" }, description: "User input to the flow" });
    let p = [];
    for (let u of Array.from(r)) u.startsWith("_") || p.push({ name: u, type: { name: "string" }, description: `Output field: ${u}` });
    return p.length === 0 && p.push({ name: "flowOutput", type: { name: "string" }, description: "Output from the flow" }), a.setInputFields(l), a.setOutputFields(p), a;
  }
  constructor(e) {
    i8._ctorWarned || (console.warn("[AxFlow] new AxFlow() is deprecated. Use flow() factory instead."), i8._ctorWarned = true), this.autoParallelConfig = { enabled: e?.autoParallel !== false, batchSize: e?.batchSize || 10 }, e?.logger ? this.flowLogger = e.logger : e?.debug === true ? this.flowLogger = Yt() : this.flowLogger = void 0, this.timingLogger = this.flowLogger ? Rs(this.flowLogger) : void 0, (e?.tracer || e?.meter) && (this.defaultAIOptions = { tracer: e.tracer, meter: e.meter });
  }
  static create(e) {
    return new i8(e);
  }
  ensureProgram() {
    let e = this.inferSignatureFromFlow();
    if (!this.program) {
      this.program = new pe(e);
      for (let [t, n] of Array.from(this.nodeGenerators)) this.program.register(n);
      return;
    }
    this.program.setSignature(e);
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
    return Ze(e);
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
    for (let [t, n] of Array.from(this.nodeUsage)) e[t] = Ze(n);
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
      let s;
      if (Array.isArray(t)) {
        let g = t.filter((h) => h.role === "user").pop();
        if (!g) throw new Error("No user message found in values array");
        s = g.values;
      } else s = t;
      if (this.nodeGenerators.size > 0 && this.ensureProgram(), r = { ...s }, this.flowLogger) {
        let g = this.getExecutionPlan();
        this.flowLogger({ name: "FlowStart", timestamp: o, inputFields: Object.keys(s), totalSteps: g.totalSteps, parallelGroups: g.parallelGroups, maxParallelism: g.maxParallelism, autoParallelEnabled: g.autoParallelEnabled });
      }
      let a = n?.tracer ?? this.defaultAIOptions?.tracer, l = n?.traceContext, p, u = l;
      if (a) {
        let g = this.getExecutionPlan(), h = n?.traceLabel ? `AxFlow > ${n.traceLabel}` : "AxFlow";
        p = a.startSpan(h, { kind: SpanKind.INTERNAL, attributes: { total_steps: g.totalSteps, parallel_groups: g.parallelGroups, max_parallelism: g.maxParallelism, auto_parallel_enabled: g.autoParallelEnabled } });
        let x = l ?? context.active();
        u = trace.setSpan(x, p);
      }
      let d = { mainAi: e, mainOptions: (() => {
        let g = { ...this.defaultAIOptions ?? {}, ...n };
        return n?.model && (g.model = String(n.model)), a && (g.tracer = a), u && (g.traceContext = u), Object.keys(g).length > 0 ? g : void 0;
      })() }, c = n?.autoParallel !== false && this.autoParallelConfig.enabled, m = 0;
      if (c) {
        this.executionPlanner.setInitialFields(Object.keys(s));
        let g = this.executionPlanner.createOptimizedExecution(this.autoParallelConfig.batchSize), h = await this.executeStepsWithLogging(g, r, d, true);
        r = h.finalState, m = h.stepsExecuted;
      } else {
        let g = await this.executeStepsWithLogging(this.flowDefinition, r, d, false);
        r = g.finalState, m = g.stepsExecuted;
      }
      if (this.flowLogger) {
        let g = this.timingLogger?.endTiming("flow-execution") ?? Date.now() - o;
        this.flowLogger({ name: "FlowComplete", timestamp: Date.now(), totalExecutionTime: g, finalState: r, outputFields: Object.keys(r), stepsExecuted: m });
      }
      return p && p.end(), r;
    } catch (s) {
      throw this.flowLogger && this.flowLogger({ name: "FlowError", timestamp: Date.now(), error: s instanceof Error ? s.message : String(s), state: r }), typeof parentSpan < "u" && parentSpan && parentSpan.end(), s;
    }
  }
  node(e, t) {
    if (typeof t == "string" || t instanceof L) {
      let n = t;
      if (!n) throw new Error(`Invalid signature for node '${e}': signature cannot be empty`);
      this.nodes.set(e, { inputs: {}, outputs: {} });
      let o = Ae(n);
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
      let n = Array.isArray(e) ? e : [e], o = async (r) => (await xe(n, async (l, p) => {
        let u = l(r);
        return Promise.resolve(u);
      }, this.autoParallelConfig.batchSize)).reduce((l, p) => ({ ...l, ...p }), r);
      if (this.branchContext?.currentBranchValue !== void 0) {
        let r = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
        r.push(o), this.branchContext.branches.set(this.branchContext.currentBranchValue, r);
      } else this.flowDefinition.push(o), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(o, void 0, void 0, "parallel-map", n);
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
    let r = async (s, a) => {
      let l = n?.ai ?? a.mainAi, p = { ...a.mainOptions ?? {}, ...n?.options ?? {} }, u = t(s), d = p?.traceLabel ? `Node:${e} (${p.traceLabel})` : `Node:${e}`, c;
      if ("forward" in o && typeof o.forward == "function") {
        if (c = await o.forward(l, u, { ...p, traceLabel: d }), "getUsage" in o && typeof o.getUsage == "function") {
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
      return { ...s, [`${e}Result`]: c };
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let s = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      s.push(r), this.branchContext.branches.set(this.branchContext.currentBranchValue, s);
    } else this.flowDefinition.push(r), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(r, e, t);
    return this.ensureProgram(), this;
  }
  applyOptimization(e) {
    this.program && "applyOptimization" in this.program && this.program.applyOptimization(e);
    for (let [t, n] of Array.from(this.nodeGenerators)) n && "applyOptimization" in n && typeof n.applyOptimization == "function" && n.applyOptimization(e);
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
      let r = e.predicate(n), s = e.branches.get(r);
      if (this.flowLogger && this.flowLogger({ name: "BranchEvaluation", timestamp: Date.now(), branchValue: r, hasMatchingBranch: !!s, branchStepsCount: s?.length ?? 0 }), !s) return n;
      let a = n;
      for (let l of s) a = await l(a, o);
      return a;
    };
    return this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t, void 0, void 0, "merge"), this.ensureProgram(), this;
  }
  mg() {
    return this.merge();
  }
  parallel(e) {
    let t = async (n, o) => {
      let r = await xe(e, async (s, a) => {
        let l = new lt(this.nodeGenerators);
        return await s(l).executeSteps(n, o);
      }, this.autoParallelConfig.batchSize);
      return { ...n, _parallelResults: r };
    };
    return this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t, void 0, void 0, "parallel", void 0, void 0), this.ensureProgram(), { merge: (n, o) => {
      let r = (s) => {
        let a = s._parallelResults;
        if (!Array.isArray(a)) throw new Error("No parallel results found for merge");
        let l = o(...a), p = { ...s };
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
    return this.flowDefinition.push(async (s, a) => {
      let l = s, p = 1, u = `_feedback_${t}_iterations`;
      for (typeof l[u] != "number" && (l = { ...l, [u]: 1 }); e(l) && p < n; ) {
        p++, l = { ...l, [u]: p };
        for (let d = o; d < r; d++) {
          let c = this.flowDefinition[d];
          c && (l = await c(l, a));
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
    return this.flowDefinition[e] = async (s, a) => {
      let l = s, p = 0;
      for (; n(l) && p < o; ) {
        p++;
        for (let u of r) l = await u(l, a);
      }
      if (p >= o && n(l)) throw new Error(`While loop exceeded maximum iterations (${o}). Consider increasing maxIterations or ensuring the loop condition eventually becomes false.`);
      return l;
    }, this.nodeGenerators.size > 0 && this.ensureProgram(), this;
  }
  end() {
    return this.endWhile();
  }
  derive(e, t, n, o) {
    let r = async (s) => {
      let a = s[t];
      if (a === void 0) throw new Error(`Input field '${t}' not found in state`);
      let l;
      if (Array.isArray(a)) if (this.autoParallelConfig.enabled) {
        let p = o?.batchSize || this.autoParallelConfig.batchSize;
        l = await xe(a, async (u, d) => n(u, d, s), p);
      } else l = a.map((p, u) => n(p, u, s));
      else l = n(a, void 0, s);
      return { ...s, [e]: l };
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let s = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      s.push(r), this.branchContext.branches.set(this.branchContext.currentBranchValue, s);
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
    let r = typeof t == "string" ? L.create(t) : t;
    if (n.prependInputs) for (let s of n.prependInputs) r = r.prependInputField(s.name, s.type);
    if (n.appendInputs) for (let s of n.appendInputs) r = r.appendInputField(s.name, s.type);
    if (n.prependOutputs) for (let s of n.prependOutputs) r = r.prependOutputField(s.name, s.type);
    if (n.appendOutputs) for (let s of n.appendOutputs) r = r.appendOutputField(s.name, s.type);
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
function wo(i10) {
  return Xt.create(i10);
}
var So = class {
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
    let s = { Image: e, Tty: true, OpenStdin: false, AttachStdin: false, AttachStdout: false, AttachStderr: false, HostConfig: { Binds: r }, Labels: {} };
    o && (s.Labels["com.example.tag"] = o);
    let a = await this.fetchDockerAPI("/containers/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    if (!a.ok) throw new Error(`Failed to create container: ${a.statusText}`);
    let l = await a.json();
    return this.containerId = l.Id, l;
  }
  async findOrCreateContainer({ imageName: e, volumes: t = [], doNotPullImage: n, tag: o }) {
    let s = (await this.listContainers(true)).filter((l) => l.Labels && l.Labels["com.example.tag"] === o);
    if (s && s.length > 0) {
      let l = Math.floor(Math.random() * s.length), p = s[l];
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
    let o = [], r = await this.listContainers(true), s = e ? r.filter((a) => a.Labels["com.example.tag"] === e) : r;
    for (let a of s) {
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
    if (!this.containerId) throw new Error("No container created or connected");
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
var vo = class {
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
var Oo = class {
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
        let { result: s } = await this.sendRequest("tools/call", { name: t.name, arguments: r });
        return s;
      } };
    });
  }
  async ping(e = 3e3) {
    let t = this.sendRequest("ping"), n = new Promise((s, a) => setTimeout(() => a(new Error("Ping response timeout exceeded")), e)), o = await Promise.race([t, n]), { result: r } = o;
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
    let n = B(), o = { jsonrpc: "2.0", id: n, method: e, params: t }, r = new Promise((a, l) => {
      this.activeRequests.set(n, { reject: l }), this.transport.send(o).then((p) => {
        if (this.activeRequests.delete(n), p !== null && typeof p == "object" && "error" in p) {
          let u = p;
          l(new Error(`RPC Error ${u.error.code}: ${u.error.message}`));
        } else p !== null && typeof p == "object" && "result" in p ? a({ result: p.result }) : l(new Error("Invalid response no result or error"));
      }).catch((p) => {
        this.activeRequests.delete(n), l(p);
      });
    }), { result: s } = await r;
    return { id: n, result: s };
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
var Mo = class {
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
var ko = class {
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
          let s = JSON.parse(r.data);
          this.messageHandler && this.messageHandler(s);
        } catch (s) {
          console.error("Failed to parse SSE message:", s);
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
    let n = t.body.getReader(), o = new TextDecoder(), r = "", s = async () => {
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
        for (let u of p) if (u.startsWith("data: ")) {
          let d = u.slice(6);
          if (d === "[DONE]") return;
          try {
            let c = JSON.parse(d);
            this.messageHandler && this.messageHandler(c);
          } catch (c) {
            console.error("Failed to parse SSE data:", c);
          }
        }
        await s();
      } catch (a) {
        throw n.releaseLock(), a;
      }
    };
    await s();
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
      let s = new TextDecoder(), a = "", l = async () => {
        try {
          let { done: p, value: u } = await r.read();
          if (p) {
            r.releaseLock();
            return;
          }
          a += s.decode(u, { stream: true });
          let d = a.split(`
`);
          a = d.pop() || "";
          for (let c of d) if (c.startsWith("data: ")) {
            let m = c.slice(6);
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
function Oa(i10, e, t, n, o) {
  let r = { ...i10 };
  if (r.parameters) {
    let s = r.parameters.properties ? Object.keys(r.parameters.properties) : [], l = t.filter((p) => s.includes(p)).filter((p) => p !== "model").filter((p) => !o.excludeFieldsFromPassthrough.includes(p));
    if (l.length > 0) {
      r.parameters = ka(r.parameters, l);
      let p = r.func;
      r.func = async (u, d) => {
        let c = {};
        if (Array.isArray(e)) {
          let g = e.filter((h) => h.role === "user").pop();
          g && (c = Ss(g.values, l));
        } else c = Ss(e, l);
        let m = { ...u, ...c };
        return await p(m, d);
      };
    }
    return r;
  }
  return n && !o.disableSmartModelRouting && o.canConfigureSmartModelRouting && (r.parameters = vs(r.parameters, n)), r;
}
var Cs = new Error("Agent description must be at least 20 characters (explain in detail what the agent does)");
var ws = new Error("Agent definition is the prompt you give to the LLM for the agent. It must be detailed and at least 100 characters");
var Zt = class i9 {
  ai;
  program;
  functions;
  agents;
  disableSmartModelRouting;
  excludeFieldsFromPassthrough;
  debug;
  options;
  name;
  func;
  constructor({ ai: e, name: t, description: n, definition: o, signature: r, agents: s, functions: a }, l) {
    let { disableSmartModelRouting: p, excludeFieldsFromPassthrough: u, debug: d } = l ?? {};
    if (this.ai = e, this.agents = s, this.functions = a, this.disableSmartModelRouting = p, this.excludeFieldsFromPassthrough = u ?? [], this.debug = d, this.options = l, !t || t.length < 5) throw new Error("Agent name must be at least 10 characters (more descriptive)");
    if (!n || n.length < 20) throw Cs;
    if (o && o.length < 100) throw ws;
    this.program = new H(r, { ...l, description: o ?? n });
    for (let m of s ?? []) this.program.register(m);
    this.name = t, this.func = { name: Ma(this.name), description: n, parameters: this.program.getSignature().toJSONSchema(), func: () => this.forward };
    let c = e?.getModelList();
    c && !this.disableSmartModelRouting && (this.func.parameters = vs(this.func.parameters, c));
  }
  static create(e, t) {
    let n = L.create(e), { ai: o, name: r, description: s, definition: a, agents: l, functions: p, ...u } = t;
    return new i9({ ai: o, name: r, description: s, definition: a, signature: n, agents: l, functions: p }, u);
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
      let { model: r, ...s } = n, a = this.ai ?? o?.ai;
      if (!a) throw new Error("AI service is required to run the agent");
      let l = await e(a, s, { ...o, model: r }), u = this.program.getSignature().getOutputFields();
      return Object.keys(l).map((c) => {
        let m = u.find((g) => g.name === c);
        return m ? `${m.title}: ${l[c]}` : `${c}: ${l[c]}`;
      }).join(`
`);
    };
    return { ...this.func, func: t };
  }
  getFeatures() {
    return { canConfigureSmartModelRouting: this.ai === void 0, excludeFieldsFromPassthrough: this.excludeFieldsFromPassthrough };
  }
  init(e, t, n) {
    let o = this.ai ?? e, r = o?.getModelList(), a = this.program.getSignature().getInputFields().map((d) => d.name), l = this.getDebug(o, n), p = this.agents?.map((d) => {
      let c = d.getFeatures(), m = { debug: l, disableSmartModelRouting: !!this.disableSmartModelRouting, excludeFieldsFromPassthrough: c.excludeFieldsFromPassthrough, canConfigureSmartModelRouting: c.canConfigureSmartModelRouting };
      return Oa(d.getFunction(), t, a, r, m);
    }), u = [...n?.functions ?? this.functions ?? [], ...p ?? []];
    return { ai: o, functions: u, debug: l };
  }
  async forward(e, t, n) {
    let { ai: o, functions: r, debug: s } = this.init(e, t, n), a = { ...this.options, ...n, debug: s, functions: r };
    return await this.program.forward(o, t, a);
  }
  async *streamingForward(e, t, n) {
    let { ai: o, functions: r, debug: s } = this.init(e, t, n), a = { ...this.options, ...n, debug: s, functions: r };
    return yield* this.program.streamingForward(o, t, a);
  }
  setDescription(e) {
    if (!e || e.length < 20) throw Cs;
    this.program.getSignature().setDescription(e), this.func.description = e;
  }
  setDefinition(e) {
    if (!e || e.length < 100) throw ws;
    this.program.setDescription(e), this.func.description = e;
  }
  getSignature() {
    return this.program.getSignature();
  }
  setSignature(e) {
    this.program.setSignature(e);
  }
  applyOptimization(e) {
    this.program.applyOptimization?.(e);
  }
  getDebug(e, t) {
    return t?.debug ?? this.debug ?? e?.getOptions()?.debug ?? false;
  }
};
function Ma(i10) {
  return i10.split(/[^a-zA-Z0-9]/).map((n, o) => {
    let r = n.toLowerCase();
    return o > 0 && r && r[0] ? r[0].toUpperCase() + r.slice(1) : r;
  }).join("");
}
function vs(i10, e) {
  let t = i10 ? structuredClone(i10) : { type: "object", properties: {}, required: [] };
  if (t.properties?.model) return t;
  let n = { type: "string", enum: e.map((s) => s.key), description: `The AI model to use for this function call. Available options: ${e.map((s) => `\`${s.key}\` ${s.description}`).join(", ")}` }, o = { ...t.properties ?? {}, model: n }, r = [...t.required ?? [], "model"];
  return { ...t, properties: o, required: r };
}
function ka(i10, e) {
  let t = structuredClone(i10);
  if (t.properties) for (let n of e) delete t.properties[n];
  if (Array.isArray(t.required)) {
    let n = t.required.filter((o) => !e.includes(o));
    Object.defineProperty(t, "required", { value: n, writable: true, configurable: true });
  }
  return t;
}
function Ss(i10, e) {
  let t = {};
  for (let n of e) n in i10 && (t[n] = i10[n]);
  return t;
}
function Ea(i10, e) {
  let t = typeof i10 == "string" ? L.create(i10) : i10, { ai: n, name: o, description: r, definition: s, agents: a, functions: l, ...p } = e;
  return new Zt({ ai: n, name: o, description: r, definition: s, signature: t, agents: a, functions: l }, p);
}
var Pa = (i10, e) => {
  let t = e?.maxHops ?? 3, n = e?.qualityThreshold ?? 0.8, o = e?.maxIterations ?? 2, r = e?.qualityTarget ?? 0.85, s = e?.disableQualityHealing ?? false;
  return wo({ logger: e?.logger, debug: e?.debug }).node("queryGenerator", "originalQuestion:string, previousContext?:string -> searchQuery:string, queryReasoning:string").node("contextualizer", "retrievedDocument:string, accumulatedContext?:string -> enhancedContext:string").node("qualityAssessor", "currentContext:string, originalQuestion:string -> completenessScore:number, missingAspects:string[]").node("questionDecomposer", "complexQuestion:string -> subQuestions:string[], decompositionReason:string").node("evidenceSynthesizer", "collectedEvidence:string[], originalQuestion:string -> synthesizedEvidence:string, evidenceGaps:string[]").node("gapAnalyzer", "synthesizedEvidence:string, evidenceGaps:string[], originalQuestion:string -> needsMoreInfo:boolean, focusedQueries:string[]").node("answerGenerator", "finalContext:string, originalQuestion:string -> comprehensiveAnswer:string, confidenceLevel:number").node("queryRefiner", "originalQuestion:string, currentContext:string, missingAspects:string[] -> refinedQuery:string").node("qualityValidator", "generatedAnswer:string, userQuery:string -> qualityScore:number, issues:string[]").node("answerHealer", "originalAnswer:string, healingDocument:string, issues?:string[] -> healedAnswer:string").map((a) => ({ ...a, maxHops: t, qualityThreshold: n, maxIterations: o, qualityTarget: r, disableQualityHealing: s, currentHop: 0, accumulatedContext: "", retrievedContexts: [], completenessScore: 0, searchQuery: a.originalQuestion, shouldContinue: true, iteration: 0, allEvidence: [], evidenceSources: [], needsMoreInfo: true, healingAttempts: 0, currentQuality: 0, shouldContinueHealing: true, currentAnswer: "", currentIssues: [] })).while((a) => a.currentHop < a.maxHops && a.completenessScore < a.qualityThreshold && a.shouldContinue).map((a) => ({ ...a, currentHop: a.currentHop + 1 })).execute("queryGenerator", (a) => ({ originalQuestion: a.originalQuestion, previousContext: a.accumulatedContext || void 0 })).map(async (a) => {
    let l = a.queryGeneratorResult?.searchQuery || a.searchQuery || a.originalQuestion, p = await i10(l);
    return { ...a, retrievalResult: { retrievedDocument: p, retrievalConfidence: 0.9 } };
  }).execute("contextualizer", (a) => ({ retrievedDocument: a.retrievalResult.retrievedDocument, accumulatedContext: a.accumulatedContext || void 0 })).execute("qualityAssessor", (a) => ({ currentContext: a.contextualizerResult.enhancedContext, originalQuestion: a.originalQuestion })).map((a) => ({ ...a, accumulatedContext: a.contextualizerResult.enhancedContext, retrievedContexts: [...a.retrievedContexts, a.retrievalResult.retrievedDocument], completenessScore: a.qualityAssessorResult.completenessScore, searchQuery: a.queryGeneratorResult.searchQuery, shouldContinue: a.qualityAssessorResult.completenessScore < a.qualityThreshold })).branch((a) => a.shouldContinue && a.currentHop < a.maxHops).when(true).execute("queryRefiner", (a) => ({ originalQuestion: a.originalQuestion, currentContext: a.accumulatedContext, missingAspects: a.qualityAssessorResult.missingAspects })).map((a) => ({ ...a, searchQuery: a.queryRefinerResult?.refinedQuery || a.searchQuery })).when(false).map((a) => a).merge().endWhile().map((a) => ({ ...a, allEvidence: a.retrievedContexts.length > 0 ? a.retrievedContexts : [] })).while((a) => a.iteration < a.maxIterations && a.needsMoreInfo).map((a) => ({ ...a, iteration: a.iteration + 1 })).branch((a) => a.iteration === 1).when(true).execute("questionDecomposer", (a) => ({ complexQuestion: a.originalQuestion })).map((a) => ({ ...a, currentQueries: a.questionDecomposerResult.subQuestions })).when(false).map((a) => ({ ...a, currentQueries: a.gapAnalyzerResult?.focusedQueries || [] })).merge().map(async (a) => {
    let l = a.currentQueries || [], p = l.length > 0 ? await Promise.all(l.filter(Boolean).map((u) => i10(u))) : [];
    return { ...a, retrievalResults: p };
  }).execute("evidenceSynthesizer", (a) => {
    let l = [...a.allEvidence || [], ...a.retrievalResults || []].filter(Boolean);
    return { collectedEvidence: l.length > 0 ? l : ["No evidence collected yet"], originalQuestion: a.originalQuestion };
  }).execute("gapAnalyzer", (a) => ({ synthesizedEvidence: a.evidenceSynthesizerResult.synthesizedEvidence, evidenceGaps: a.evidenceSynthesizerResult.evidenceGaps, originalQuestion: a.originalQuestion })).map((a) => ({ ...a, allEvidence: [...a.allEvidence, ...a.retrievalResults], evidenceSources: [...a.evidenceSources, `Iteration ${a.iteration} sources`], needsMoreInfo: a.gapAnalyzerResult.needsMoreInfo, synthesizedEvidence: a.evidenceSynthesizerResult.synthesizedEvidence })).endWhile().execute("answerGenerator", (a) => ({ finalContext: a.accumulatedContext || a.synthesizedEvidence || a.allEvidence.join(`
`), originalQuestion: a.originalQuestion })).branch((a) => !a.disableQualityHealing).when(true).execute("qualityValidator", (a) => ({ generatedAnswer: a.answerGeneratorResult.comprehensiveAnswer, userQuery: a.originalQuestion })).map((a) => ({ ...a, currentAnswer: a.answerGeneratorResult.comprehensiveAnswer, currentQuality: a.qualityValidatorResult.qualityScore, currentIssues: a.qualityValidatorResult.issues, shouldContinueHealing: a.qualityValidatorResult.qualityScore < a.qualityTarget })).while((a) => a.healingAttempts < 3 && a.shouldContinueHealing).map((a) => ({ ...a, healingAttempts: a.healingAttempts + 1 })).map(async (a) => {
    let l = a.currentIssues || [], p = l.length > 0 ? `${a.originalQuestion} addressing issues: ${l.join(", ")}` : `${a.originalQuestion} quality improvement`, u = await i10(p);
    return { ...a, healingResult: { healingDocument: u } };
  }).execute("answerHealer", (a) => ({ originalAnswer: a.currentAnswer, healingDocument: a.healingResult.healingDocument, issues: a.currentIssues })).execute("qualityValidator", (a) => ({ generatedAnswer: a.answerHealerResult.healedAnswer, userQuery: a.originalQuestion })).map((a) => ({ ...a, currentAnswer: a.answerHealerResult.healedAnswer, currentQuality: a.qualityValidatorResult.qualityScore, currentIssues: a.qualityValidatorResult.issues, shouldContinueHealing: a.qualityValidatorResult.qualityScore < a.qualityTarget })).endWhile().when(false).map((a) => ({ ...a, currentAnswer: a.answerGeneratorResult.comprehensiveAnswer, currentQuality: 1, currentIssues: [], shouldContinueHealing: false })).merge().returns((a) => ({ finalAnswer: a.currentAnswer, totalHops: a.currentHop, retrievedContexts: a.retrievedContexts, iterationCount: a.iteration, healingAttempts: a.healingAttempts, qualityAchieved: a.currentQuality }));
};
export {
  Pt as AxAI,
  we as AxAIAnthropic,
  ht as AxAIAnthropicModel,
  un as AxAIAnthropicVertexModel,
  ke as AxAIAzureOpenAI,
  Ee as AxAICohere,
  It as AxAICohereEmbedModel,
  yt as AxAICohereModel,
  Pe as AxAIDeepSeek,
  bt as AxAIDeepSeekModel,
  Fe as AxAIGoogleGemini,
  Rn as AxAIGoogleGeminiEmbedModel,
  vr as AxAIGoogleGeminiEmbedTypes,
  Tt as AxAIGoogleGeminiModel,
  Cn as AxAIGoogleGeminiSafetyCategory,
  wn as AxAIGoogleGeminiSafetyThreshold,
  He as AxAIGrok,
  Nr as AxAIGrokEmbedModels,
  Et as AxAIGrokModel,
  De as AxAIGroq,
  Rt as AxAIGroqModel,
  Le as AxAIHuggingFace,
  En as AxAIHuggingFaceModel,
  Ne as AxAIMistral,
  Er as AxAIMistralEmbedModels,
  Ct as AxAIMistralModel,
  Ge as AxAIOllama,
  Me as AxAIOpenAI,
  _ as AxAIOpenAIBase,
  Se as AxAIOpenAIEmbedModel,
  xt as AxAIOpenAIModel,
  Ue as AxAIOpenAIResponses,
  St as AxAIOpenAIResponsesBase,
  $e as AxAIOpenAIResponsesImpl,
  ve as AxAIOpenAIResponsesModel,
  Be as AxAIOpenRouter,
  E as AxAIRefusalError,
  qe as AxAIReka,
  Ot as AxAIRekaModel,
  Te as AxAIServiceAbortedError,
  se as AxAIServiceAuthenticationError,
  j as AxAIServiceError,
  oe as AxAIServiceNetworkError,
  re2 as AxAIServiceResponseError,
  de as AxAIServiceStatusError,
  Z as AxAIServiceStreamTerminatedError,
  me as AxAIServiceTimeoutError,
  ze as AxAITogether,
  je as AxAIWebLLM,
  kt as AxAIWebLLMModel,
  Zt as AxAgent,
  xo as AxApacheTika,
  ae as AxAssertionError,
  An as AxBalancer,
  D as AxBaseAI,
  ce as AxBaseOptimizer,
  st as AxBootstrapFewShot,
  ee as AxContentProcessingError,
  Jn as AxDB,
  Q as AxDBBase,
  Ke as AxDBCloudflare,
  Yn as AxDBManager,
  ie as AxDBMemory,
  We as AxDBPinecone,
  Ve as AxDBWeaviate,
  Jt as AxDefaultCostTracker,
  Ao as AxDefaultResultReranker,
  So as AxDockerSession,
  vo as AxEmbeddingAdapter,
  oa as AxEvalUtil,
  Xt as AxFlow,
  it as AxFlowDependencyAnalyzer,
  at as AxFlowExecutionPlanner,
  lt as AxFlowSubContextImpl,
  Co as AxFlowTypedSubContextImpl,
  U as AxFluentFieldType,
  Nt as AxFunctionError,
  Gt as AxFunctionProcessor,
  H as AxGen,
  Ht as AxGenerateError,
  To as AxHFDataLoader,
  tt as AxInstanceRegistry,
  Uo as AxLLMRequestTypeValues,
  Oo as AxMCPClient,
  Mo as AxMCPHTTPSSETransport,
  ko as AxMCPStreambleHTTPTransport,
  V as AxMediaNotSupportedError,
  Qe as AxMemory,
  Ro as AxMiPRO,
  Dn as AxMockAIService,
  Ln as AxMultiServiceRouter,
  rt as AxOptimizedProgramImpl,
  pe as AxProgram,
  fe as AxPromptTemplate,
  Bn as AxProviderRouter,
  _e as AxRateLimiterTokenUsage,
  L as AxSignature,
  Bt as AxSignatureBuilder,
  Io as AxSimpleClassifier,
  yo as AxSimpleClassifierClass,
  Bo as AxSpanKindValues,
  fo as AxStringUtil,
  bo as AxTestPrompt,
  Ea as agent,
  gi as ai,
  Ae as ax,
  Ir as axAIAnthropicDefaultConfig,
  Ns as axAIAnthropicVertexDefaultConfig,
  js as axAIAzureOpenAIBestConfig,
  qs as axAIAzureOpenAICreativeConfig,
  Tr as axAIAzureOpenAIDefaultConfig,
  zs as axAIAzureOpenAIFastConfig,
  Js as axAICohereCreativeConfig,
  wr as axAICohereDefaultConfig,
  Ys as axAIDeepSeekCodeConfig,
  Sr as axAIDeepSeekDefaultConfig,
  Mr as axAIGoogleGeminiDefaultConfig,
  Xs as axAIGoogleGeminiDefaultCreativeConfig,
  mi as axAIGrokBestConfig,
  Kn as axAIGrokDefaultConfig,
  ti as axAIHuggingFaceCreativeConfig,
  kr as axAIHuggingFaceDefaultConfig,
  ni as axAIMistralBestConfig,
  _n as axAIMistralDefaultConfig,
  Pr as axAIOllamaDefaultConfig,
  oi as axAIOllamaDefaultCreativeConfig,
  gn as axAIOpenAIBestConfig,
  hn as axAIOpenAICreativeConfig,
  ge as axAIOpenAIDefaultConfig,
  fn as axAIOpenAIFastConfig,
  si as axAIOpenAIResponsesBestConfig,
  ii as axAIOpenAIResponsesCreativeConfig,
  vt as axAIOpenAIResponsesDefaultConfig,
  Fr as axAIOpenRouterDefaultConfig,
  li as axAIRekaBestConfig,
  pi as axAIRekaCreativeConfig,
  Mt as axAIRekaDefaultConfig,
  ui as axAIRekaFastConfig,
  Dr as axAITogetherDefaultConfig,
  di as axAIWebLLMCreativeConfig,
  Lr as axAIWebLLMDefaultConfig,
  ai as axAnalyzeChatPromptRequirements,
  he as axAnalyzeRequestRequirements,
  O as axBaseAIDefaultConfig,
  N as axBaseAIDefaultCreativeConfig,
  yi as axCheckMetricsHealth,
  Go as axCreateDefaultColorLogger,
  Is as axCreateDefaultOptimizerColorLogger,
  ra as axCreateDefaultOptimizerTextLogger,
  Fs as axCreateDefaultTextLogger,
  Yt as axCreateFlowColorLogger,
  Ra as axCreateFlowTextLogger,
  Ca as axDefaultFlowLogger,
  Gr as axDefaultMetricsConfig,
  Kt as axDefaultOptimizerLogger,
  bs as axDefaultOptimizerMetricsConfig,
  Ks as axGetCompatibilityReport,
  Vs as axGetFormatCompatibility,
  Ti as axGetMetricsConfig,
  aa as axGetOptimizerMetricsConfig,
  Ws as axGetProvidersWithMediaSupport,
  M as axGlobals,
  ft as axModelInfoAnthropic,
  In as axModelInfoCohere,
  Tn as axModelInfoDeepSeek,
  Sn as axModelInfoGoogleGemini,
  Hn as axModelInfoGrok,
  Mn as axModelInfoGroq,
  kn as axModelInfoHuggingFace,
  Fn as axModelInfoMistral,
  Oe as axModelInfoOpenAI,
  dn as axModelInfoOpenAIResponses,
  $n as axModelInfoReka,
  qn as axModelInfoTogether,
  zn as axModelInfoWebLLM,
  Gn as axProcessContentForProvider,
  Pa as axRAG,
  xn as axScoreProvidersForRequest,
  yn as axSelectOptimalProvider,
  v as axSpanAttributes,
  te as axSpanEvents,
  bi as axUpdateMetricsConfig,
  ia as axUpdateOptimizerMetricsConfig,
  Ce as axValidateChatRequestMessage,
  pn as axValidateChatResponseResult,
  Rr as axValidateProviderCapabilities,
  nt as f,
  wo as flow,
  Ta as s
};
//# sourceMappingURL=ax.js.map

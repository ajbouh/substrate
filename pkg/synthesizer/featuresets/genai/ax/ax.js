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

// node_modules/dayjs/dayjs.min.js
var require_dayjs_min = __commonJS({
  "node_modules/dayjs/dayjs.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
    }(exports, function() {
      "use strict";
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s3 = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $2 = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y2 = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v2 = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s4 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s4 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s4 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s3, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D2 = {};
      D2[g] = M2;
      var p = "$isDayjsObject", S2 = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w2 = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s4 = e2.toLowerCase();
          D2[s4] && (i2 = s4), n2 && (D2[s4] = n2, i2 = s4);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D2[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O = function(t2, e2) {
        if (S2(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v2;
      b.l = w2, b.i = S2, b.w = function(t2, e2) {
        return O(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M3(t2) {
          this.$L = w2(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
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
                var i2 = r2[2] - 1 || 0, s4 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s4)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s4);
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
          var n2 = O(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $3 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y3 = this.$W, M4 = this.$M, m3 = this.$D, v3 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M4) : l2(0, M4 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D3 = (y3 < g2 ? y3 + 7 : y3) - g2;
              return l2(r2 ? m3 - D3 : m3 + (6 - D3), M4);
            case a:
            case d:
              return $3(v3 + "Hours", 0);
            case u:
              return $3(v3 + "Minutes", 1);
            case s3:
              return $3(v3 + "Seconds", 2);
            case i:
              return $3(v3 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s3] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $3 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y3 = this.clone().set(d, 1);
            y3.$d[l2]($3), y3.init(), this.$d = y3.set(d, Math.min(this.$D, y3.daysInMonth())).$d;
          } else l2 && this.$d[l2]($3);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $3 = b.p(f2), y3 = function(t2) {
            var e2 = O(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($3 === c) return this.set(c, this.$M + r2);
          if ($3 === h) return this.set(h, this.$y + r2);
          if ($3 === a) return y3(1);
          if ($3 === o) return y3(7);
          var M4 = (d2 = {}, d2[s3] = e, d2[u] = n, d2[i] = t, d2)[$3] || 1, m3 = this.$d.getTime() + r2 * M4;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s4 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s5) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s5);
          }, d2 = function(t3) {
            return b.s(s4 % 12 || 12, t3, "0");
          }, $3 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y2, function(t3, r3) {
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
                  return String(s4);
                case "HH":
                  return b.s(s4, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $3(s4, u2, true);
                case "A":
                  return $3(s4, u2, false);
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
                  return i2;
              }
              return null;
            }(t3) || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $3, y3 = this, M4 = b.p(d2), m3 = O(r2), v3 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D3 = function() {
            return b.m(y3, m3);
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
            case s3:
              $3 = g2 / e;
              break;
            case i:
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
          var n2 = this.clone(), r2 = w2(t2, e2, true);
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
      }(), k2 = _.prototype;
      return O.prototype = k2, [["$ms", r], ["$s", i], ["$m", s3], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t2) {
        k2[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), O.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O), t2.$i = true), O;
      }, O.locale = w2, O.isDayjs = S2, O.unix = function(t2) {
        return O(1e3 * t2);
      }, O.en = D2[g], O.Ls = D2, O.p = {}, O;
    });
  }
});

// node_modules/dayjs/plugin/customParseFormat.js
var require_customParseFormat = __commonJS({
  "node_modules/dayjs/plugin/customParseFormat.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_customParseFormat = t();
    }(exports, function() {
      "use strict";
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s3 = {}, a = function(e2) {
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
        var t2 = s3[e2];
        return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
      }, d = function(e2, t2) {
        var n2, r2 = s3.meridiem;
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
        var t2 = s3.ordinal, n2 = e2.match(/\d+/);
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
        r2 = n2, i2 = s3 && s3.formats;
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
              var s4 = i3.regex, f3 = i3.parser, h3 = e2.slice(r3), u3 = s4.exec(h3)[0];
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
            h2 && (d2 = o2[2]), s3 = this.$locale(), !f2 && d2 && (s3 = n2.Ls[d2]), this.$d = function(e4, t4, n3, r4) {
              try {
                if (["x", "X"].indexOf(t4) > -1) return new Date(("X" === t4 ? 1e3 : 1) * e4);
                var i3 = l(t4)(e4), o3 = i3.year, s4 = i3.month, a3 = i3.day, f3 = i3.hours, h3 = i3.minutes, u3 = i3.seconds, d3 = i3.milliseconds, c3 = i3.zone, m2 = i3.week, M3 = /* @__PURE__ */ new Date(), Y2 = a3 || (o3 || s4 ? 1 : M3.getDate()), p = o3 || M3.getFullYear(), v2 = 0;
                o3 && !s4 || (v2 = s4 > 0 ? s4 - 1 : M3.getMonth());
                var D2, w2 = f3 || 0, g = h3 || 0, y2 = u3 || 0, L2 = d3 || 0;
                return c3 ? new Date(Date.UTC(p, v2, Y2, w2, g, y2, L2 + 60 * c3.offset * 1e3)) : n3 ? new Date(Date.UTC(p, v2, Y2, w2, g, y2, L2)) : (D2 = new Date(p, v2, Y2, w2, g, y2, L2), m2 && (D2 = r4(D2).week(m2).toDate()), D2);
              } catch (e5) {
                return /* @__PURE__ */ new Date("");
              }
            }(t3, a2, r3, n2), this.init(), d2 && true !== d2 && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = /* @__PURE__ */ new Date("")), s3 = {};
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

// node_modules/dayjs/plugin/timezone.js
var require_timezone = __commonJS({
  "node_modules/dayjs/plugin/timezone.js"(exports, module) {
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
            var f2 = i2[u2], s4 = f2.type, m = f2.value, c = t[s4];
            c >= 0 && (r2[c] = parseInt(m, 10));
          }
          var d = r2[3], l = 24 === d ? 0 : d, h = r2[0] + "-" + r2[1] + "-" + r2[2] + " " + l + ":" + r2[4] + ":" + r2[5] + ":000", v2 = +e2;
          return (o.utc(h).valueOf() - (v2 -= v2 % 1e3)) / 6e4;
        }, f = i.prototype;
        f.tz = function(t2, e2) {
          void 0 === t2 && (t2 = r);
          var n2, i2 = this.utcOffset(), a2 = this.toDate(), u2 = a2.toLocaleString("en-US", { timeZone: t2 }), f2 = Math.round((a2 - new Date(u2)) / 1e3 / 60), s4 = 15 * -Math.round(a2.getTimezoneOffset() / 15) - f2;
          if (!Number(s4)) n2 = this.utcOffset(0, e2);
          else if (n2 = o(u2, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(s4, true), e2) {
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
        var s3 = f.startOf;
        f.startOf = function(t2, e2) {
          if (!this.$x || !this.$x.$timezone) return s3.call(this, t2, e2);
          var n2 = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
          return s3.call(n2, t2, e2).tz(this.$x.$timezone, true);
        }, o.tz = function(t2, e2, n2) {
          var i2 = n2 && e2, a2 = n2 || e2 || r, f2 = u(+o(), a2);
          if ("string" != typeof t2) return o(t2).tz(a2);
          var s4 = function(t3, e3, n3) {
            var i3 = t3 - 60 * e3 * 1e3, o2 = u(i3, n3);
            if (e3 === o2) return [i3, e3];
            var r2 = u(i3 -= 60 * (o2 - e3) * 1e3, n3);
            return o2 === r2 ? [i3, o2] : [t3 - 60 * Math.min(o2, r2) * 1e3, Math.max(o2, r2)];
          }(o.utc(t2, i2).valueOf(), f2, a2), m = s4[0], c = s4[1], d = o(m).utcOffset(c);
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

// node_modules/dayjs/plugin/utc.js
var require_utc = __commonJS({
  "node_modules/dayjs/plugin/utc.js"(exports, module) {
    !function(t, i) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_utc = i();
    }(exports, function() {
      "use strict";
      var t = "minute", i = /[+-]\d\d(?::?\d\d)?/g, e = /([+-]|\d\d)/g;
      return function(s3, f, n) {
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
        u.utcOffset = function(s4, f2) {
          var n2 = this.$utils().u;
          if (n2(s4)) return this.$u ? 0 : n2(this.$offset) ? a.call(this) : this.$offset;
          if ("string" == typeof s4 && (s4 = function(t2) {
            void 0 === t2 && (t2 = "");
            var s5 = t2.match(i);
            if (!s5) return null;
            var f3 = ("" + s5[0]).match(e) || ["-", 0, 0], n3 = f3[0], u3 = 60 * +f3[1] + +f3[2];
            return 0 === u3 ? 0 : "+" === n3 ? u3 : -u3;
          }(s4), null === s4)) return this;
          var u2 = Math.abs(s4) <= 16 ? 60 * s4 : s4, o2 = this;
          if (f2) return o2.$offset = u2, o2.$u = 0 === s4, o2;
          if (0 !== s4) {
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
          var s4 = this.local(), f2 = n(t2).local();
          return c.call(s4, f2, i2, e2);
        };
      };
    });
  }
});

// node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

// node_modules/@opentelemetry/api/build/esm/version.js
var VERSION = "1.9.0";

// node_modules/@opentelemetry/api/build/esm/internal/semver.js
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

// node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
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

// node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
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

// node_modules/@opentelemetry/api/build/esm/diag/types.js
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

// node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
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

// node_modules/@opentelemetry/api/build/esm/api/diag.js
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

// node_modules/@opentelemetry/api/build/esm/context/context.js
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

// node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
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
    NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
      var args = [];
      for (var _i2 = 3; _i2 < arguments.length; _i2++) {
        args[_i2 - 3] = arguments[_i2];
      }
      return fn.call.apply(fn, __spreadArray3([thisArg], __read3(args), false));
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

// node_modules/@opentelemetry/api/build/esm/api/context.js
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
    ContextAPI2.prototype.with = function(context2, fn, thisArg) {
      var _a;
      var args = [];
      for (var _i2 = 3; _i2 < arguments.length; _i2++) {
        args[_i2 - 3] = arguments[_i2];
      }
      return (_a = this._getContextManager()).with.apply(_a, __spreadArray4([context2, fn, thisArg], __read4(args), false));
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

// node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
(function(TraceFlags2) {
  TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
  TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

// node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID = "0000000000000000";
var INVALID_TRACEID = "00000000000000000000000000000000";
var INVALID_SPAN_CONTEXT = {
  traceId: INVALID_TRACEID,
  spanId: INVALID_SPANID,
  traceFlags: TraceFlags.NONE
};

// node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
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

// node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
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

// node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
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

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
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
      var fn;
      if (arguments.length < 2) {
        return;
      } else if (arguments.length === 2) {
        fn = arg2;
      } else if (arguments.length === 3) {
        opts = arg2;
        fn = arg3;
      } else {
        opts = arg2;
        ctx = arg3;
        fn = arg4;
      }
      var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
      var span = this.startSpan(name, opts, parentContext);
      var contextWithSpanSet = setSpan(parentContext, span);
      return contextApi.with(contextWithSpanSet, fn, void 0, span);
    };
    return NoopTracer2;
  }()
);
function isSpanContext(spanContext) {
  return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
}

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
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

// node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
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

// node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
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

// node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var SpanKind;
(function(SpanKind2) {
  SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
  SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
  SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
  SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
  SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind || (SpanKind = {}));

// node_modules/@opentelemetry/api/build/esm/context-api.js
var context = ContextAPI.getInstance();

// node_modules/@opentelemetry/api/build/esm/api/trace.js
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

// node_modules/@opentelemetry/api/build/esm/trace-api.js
var trace = TraceAPI.getInstance();

// node_modules/@ax-llm/ax/index.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_customParseFormat = __toESM(require_customParseFormat(), 1);
var import_timezone = __toESM(require_timezone(), 1);
var import_utc = __toESM(require_utc(), 1);
function L({ model: s3, modelInfo: e, models: t }) {
  let n = t?.find((l) => l.key === s3), o = n && "model" in n ? n.model : s3, r = e.find((l) => l.name === s3);
  if (r) return r;
  let i = o.replace(/^(anthropic\.|openai\.)/, "").replace(/-latest$/, "").replace(/-\d{8}$/, "").replace(/-v\d+:\d+$/, "").replace(/@\d{8}$/, "").replace(/-\d{2,}(-[a-zA-Z0-9-]+)?$/, "").replace(/-v\d+@\d{8}$/, "").replace(/-v\d+$/, ""), a = e.find((l) => l.name === i);
  return a || null;
}
var po = (() => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID == "function") return globalThis.crypto;
  throw new Error("Web Crypto API with randomUUID support not available. Requires Node.js 16+ or modern browser.");
})();
function B() {
  return po.randomUUID();
}
async function Jr(s3) {
  let e = new TextEncoder(), t = typeof s3 == "string" ? e.encode(s3) : s3, n = await po.subtle.digest("SHA-256", t);
  return Array.from(new Uint8Array(n)).map((i) => i.toString(16).padStart(2, "0")).join("");
}
var wt = class {
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
    return Jr(this.data);
  }
};
function je(s3) {
  if (s3 !== "sha256") throw new Error("Only SHA-256 algorithm is supported");
  return new wt();
}
var He = class extends TransformStream {
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
var vt = class {
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
var Ve = class extends TransformStream {
  constructor() {
    super(new vt());
  }
};
var Yr = { maxRetries: 3, initialDelayMs: 1e3, maxDelayMs: 6e4, backoffFactor: 2, retryableStatusCodes: [500, 408, 429, 502, 503, 504] };
var Kr = 3e4;
var Qr = globalThis.TextDecoderStream ?? Ve;
var U = class extends Error {
  constructor(t, n, o, r, i = {}) {
    super(t);
    this.url = n;
    this.requestBody = o;
    this.responseBody = r;
    this.name = this.constructor.name, this.timestamp = (/* @__PURE__ */ new Date()).toISOString(), this.errorId = B(), this.context = i, this.stack = this.toString();
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
var le = class extends U {
  constructor(t, n, o, r, i, a) {
    super(`HTTP ${t} - ${n}`, o, r, { httpStatus: t, httpStatusText: n, responseBody: i, ...a });
    this.status = t;
    this.statusText = n;
    this.name = this.constructor.name;
  }
};
var X = class extends U {
  constructor(t, n, o, r, i) {
    super(`Network Error: ${t.message}`, n, o, r, { originalErrorName: t.name, originalErrorStack: t.stack, ...i });
    this.originalError = t;
    this.name = this.constructor.name, this.stack = t.stack;
  }
};
var Q = class extends U {
  constructor(e, t, n, o) {
    super(e, t, n, void 0, o), this.name = this.constructor.name;
  }
};
var Y = class extends U {
  constructor(t, n, o, r) {
    super("Stream terminated unexpectedly by remote host", t, n, void 0, { lastChunk: o, ...r });
    this.lastChunk = o;
    this.name = this.constructor.name;
  }
};
var pe = class extends U {
  constructor(e, t, n, o) {
    super(`Request timed out after ${t}ms`, e, n, void 0, { timeoutMs: t, ...o }), this.name = this.constructor.name;
  }
};
var me = class extends U {
  constructor(e, t, n, o) {
    super(`Request aborted${t ? `: ${t}` : ""}`, e, n, void 0, { abortReason: t, ...o }), this.name = this.constructor.name;
  }
};
var ne = class extends U {
  constructor(e, t, n, o) {
    super("Authentication failed", e, t, n, o), this.name = this.constructor.name;
  }
};
var v = class extends Error {
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
async function co(s3) {
  try {
    return s3.headers.get("content-type")?.includes("application/json") ? await s3.json() : await s3.clone().text();
  } catch (e) {
    return `[ReadableStream - read failed: ${e.message}]`;
  }
}
function uo(s3, e) {
  return Math.min(e.maxDelayMs, e.initialDelayMs * e.backoffFactor ** s3) * (0.75 + Math.random() * 0.5);
}
function Xr() {
  return { startTime: Date.now(), retryCount: 0 };
}
function mo(s3) {
  s3.retryCount++, s3.lastRetryTime = Date.now();
}
function go(s3, e, t, n) {
  return t >= n.maxRetries ? false : e && n.retryableStatusCodes.includes(e) ? true : s3 instanceof X && !(s3 instanceof ne);
}
var D = async (s3, e) => {
  let t = { ...Yr, ...s3.retry }, n = s3.timeout ?? Kr, o = Xr(), r, i = new URL(s3.url), a = `${[i.pathname, s3.name].filter(Boolean).join("/").replace(/\/+/g, "/")}${i.search}`, l = new URL(a, i), p = B();
  if (s3.validateRequest && !await s3.validateRequest(e)) throw new Q("Invalid request data", l.href, e, { validation: "request" });
  s3.span?.setAttributes({ "http.request.method": s3.put ? "PUT" : "POST", "url.full": l.href, "request.id": p, "request.startTime": o.startTime });
  let c = 0;
  for (; ; ) {
    let d = new AbortController();
    if (s3.abortSignal) {
      if (s3.abortSignal.aborted) throw new me(l.href, s3.abortSignal.reason, e, { metrics: o });
      let u = () => {
        d.abort(s3.abortSignal.reason || "User aborted request");
      };
      s3.abortSignal.addEventListener("abort", u, { once: true });
      let m = d.abort.bind(d);
      d.abort = (A) => {
        s3.abortSignal.removeEventListener("abort", u), m(A);
      };
    }
    r = setTimeout(() => {
      d.abort("Request timeout");
    }, n);
    try {
      let u = await (s3.fetch ?? fetch)(l, { method: s3.put ? "PUT" : "POST", headers: { "Content-Type": "application/json", "X-Request-ID": p, "X-Retry-Count": c.toString(), ...s3.headers }, body: JSON.stringify(e), signal: d.signal });
      if (clearTimeout(r), u.status === 401 || u.status === 403) {
        let h = await co(u);
        throw new ne(l.href, e, h, { metrics: o });
      }
      if (u.status >= 400 && go(new Error(), u.status, c, t)) {
        let h = uo(c, t);
        c++, mo(o), s3.span?.addEvent("retry", { attempt: c, delay: h, status: u.status, "metrics.startTime": o.startTime, "metrics.retryCount": o.retryCount, "metrics.lastRetryTime": o.lastRetryTime }), await new Promise((I) => setTimeout(I, h));
        continue;
      }
      if (u.status >= 400) {
        let h = await co(u);
        throw new le(u.status, u.statusText, l.href, e, h, { metrics: o });
      }
      if (!s3.stream) {
        let h = await u.json();
        if (s3.validateResponse && !await s3.validateResponse(h)) throw new Q("Invalid response data", l.href, e, { validation: "response" });
        return s3.span?.setAttributes({ "response.time": Date.now() - o.startTime, "response.retries": o.retryCount }), h;
      }
      if (!u.body) throw new Q("Response body is null", l.href, e, { metrics: o });
      let m, A = 0, g = new TransformStream({ transform(h, I) {
        m = h, A++, o.streamChunks = A, o.lastChunkTime = Date.now(), I.enqueue(h), s3.span?.addEvent("stream.chunk", { "stream.chunks": A, "stream.duration": Date.now() - o.startTime, "response.retries": o.retryCount });
      } }), f = false;
      return new ReadableStream({ start(h) {
        let I = u.body.pipeThrough(new Qr()).pipeThrough(new He()).pipeThrough(g).getReader();
        async function x() {
          try {
            for (; ; ) {
              let { done: b, value: T } = await I.read();
              if (b) {
                f || (f = true, h.close());
                break;
              }
              if (f) break;
              h.enqueue(T);
            }
          } catch (b) {
            let T = b, O = { ...o, streamDuration: Date.now() - o.startTime };
            throw T.name === "AbortError" || T.message?.includes("aborted") ? h.error(new Y(l.href, e, m, { streamMetrics: O })) : T instanceof TypeError && T.message.includes("cancelled") ? h.error(new Y(l.href, e, m, { streamMetrics: O, cancelReason: "Stream cancelled by client" })) : h.error(new X(T, l.href, e, "[ReadableStream - consumed during streaming]", { streamMetrics: O })), T;
          } finally {
            clearTimeout(r), I.releaseLock();
          }
        }
        x();
      }, cancel() {
        f = true;
      } });
    } catch (u) {
      if (u instanceof Error && u.name === "AbortError") throw s3.abortSignal?.aborted ? new me(l.href, s3.abortSignal.reason, e, { metrics: o }) : new pe(l.href, n, e, { metrics: o });
      if (s3.span?.isRecording() && (s3.span.recordException(u), s3.span.setAttributes({ "error.time": Date.now() - o.startTime, "error.retries": o.retryCount })), u instanceof X && go(u, void 0, c, t)) {
        let m = uo(c, t);
        c++, mo(o), s3.span?.addEvent("retry", { attempt: c, delay: m, error: u.message, "metrics.startTime": o.startTime, "metrics.retryCount": o.retryCount, "metrics.lastRetryTime": o.lastRetryTime }), await new Promise((A) => setTimeout(A, m));
        continue;
      }
      throw u instanceof U && (u.context.metrics = o), u;
    } finally {
      r !== void 0 && clearTimeout(r);
    }
  }
};
var k = { signatureStrict: true, tracer: void 0, meter: void 0, functionResultFormatter: (s3) => typeof s3 == "string" ? s3 : s3 == null ? "" : JSON.stringify(s3, null, 2) };
var C = { LLM_SYSTEM: "gen_ai.system", LLM_OPERATION_NAME: "gen_ai.operation.name", LLM_REQUEST_MODEL: "gen_ai.request.model", LLM_REQUEST_MAX_TOKENS: "gen_ai.request.max_tokens", LLM_REQUEST_TEMPERATURE: "gen_ai.request.temperature", LLM_REQUEST_TOP_K: "gen_ai.request.top_k", LLM_REQUEST_FREQUENCY_PENALTY: "gen_ai.request.frequency_penalty", LLM_REQUEST_PRESENCE_PENALTY: "gen_ai.request.presence_penalty", LLM_REQUEST_STOP_SEQUENCES: "gen_ai.request.stop_sequences", LLM_REQUEST_LLM_IS_STREAMING: "gen_ai.request.llm_is_streaming", LLM_REQUEST_TOP_P: "gen_ai.request.top_p", LLM_USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens", LLM_USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens", LLM_USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens", LLM_USAGE_THOUGHTS_TOKENS: "gen_ai.usage.thoughts_tokens", DB_SYSTEM: "db.system", DB_TABLE: "db.table", DB_NAMESPACE: "db.namespace", DB_ID: "db.id", DB_QUERY_TEXT: "db.query.text", DB_VECTOR: "db.vector", DB_OPERATION_NAME: "db.operation.name", DB_VECTOR_QUERY_TOP_K: "db.vector.query.top_k", DB_QUERY_EMBEDDINGS: "db.query.embeddings", DB_QUERY_RESULT: "db.query.result", DB_QUERY_EMBEDDINGS_VECTOR: "db.query.embeddings.vector", DB_QUERY_RESULT_ID: "db.query.result.id", DB_QUERY_RESULT_SCORE: "db.query.result.score", DB_QUERY_RESULT_DISTANCE: "db.query.result.distance", DB_QUERY_RESULT_METADATA: "db.query.result.metadata", DB_QUERY_RESULT_VECTOR: "db.query.result.vector", DB_QUERY_RESULT_DOCUMENT: "db.query.result.document" };
var j = { GEN_AI_USER_MESSAGE: "gen_ai.user.message", GEN_AI_SYSTEM_MESSAGE: "gen_ai.system.message", GEN_AI_ASSISTANT_MESSAGE: "gen_ai.assistant.message", GEN_AI_TOOL_MESSAGE: "gen_ai.tool.message", GEN_AI_CHOICE: "gen_ai.choice", GEN_AI_USAGE: "gen_ai.usage" };
var Ao = ((o) => (o.COMPLETION = "completion", o.CHAT = "chat", o.RERANK = "rerank", o.UNKNOWN = "unknown", o))(Ao || {});
var ho = ((r) => (r.WORKFLOW = "workflow", r.TASK = "task", r.AGENT = "agent", r.TOOL = "tool", r.UNKNOWN = "unknown", r))(ho || {});
var Ot = class {
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
var We = class extends TransformStream {
  constructor(e, t) {
    super(new Ot(e, t));
  }
};
var H = class {
  ANSI_WHITE_BRIGHT = "\x1B[97m";
  ANSI_GREEN_BRIGHT = "\x1B[92m";
  ANSI_BLUE_BRIGHT = "\x1B[94m";
  ANSI_RED_BRIGHT = "\x1B[91m";
  ANSI_YELLOW = "\x1B[93m";
  ANSI_RED = "\x1B[91m";
  ANSI_RESET = "\x1B[0m";
  ANSI_ORANGE = "\x1B[38;5;208m";
  ANSI_WHITE = "\x1B[37m";
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
};
var K = new H();
var xo = (s3) => {
  process.stdout.write(s3);
};
var St = (s3 = xo) => (e, t) => {
  let n = t?.tags ?? [], o = e, r = (i) => i;
  n.includes("systemContent") ? r = (i) => K.white(i) : n.includes("userContent") ? r = (i) => K.white(i) : n.includes("functionName") ? r = (i) => K.greenBright(i) : n.includes("functionArg") ? r = (i) => K.greenBright(i) : n.includes("assistantContent") ? r = (i) => K.white(i) : n.includes("responseContent") ? r = (i) => K.greenBright(i) : n.includes("functionResult") && (r = (i) => K.blueBright(i)), n.includes("error") ? r = (i) => K.redBright(i) : n.includes("warning") && (r = (i) => K.red(i)), (n.includes("systemContent") || n.includes("userContent") || n.includes("functionName") || n.includes("functionArg") || n.includes("functionResult") || n.includes("assistantStart") || n.includes("start") || n.includes("end")) && (o = `
${o}`), n.includes("responseEnd") && (o = `${o}
\u2500\u2500\u2500
`), s3(r(o));
};
var V = St();
var Zr = (s3 = xo) => (e, t) => {
  let n = t?.tags ?? [], o = e;
  (n.includes("systemContent") || n.includes("userContent") || n.includes("functionName") || n.includes("functionArg") || n.includes("functionResult") || n.includes("assistantStart") || n.includes("start") || n.includes("end")) && (o = `
${o}`), n.includes("responseEnd") && (o = `${o}\u2500\u2500\u2500
`), s3(o);
};
var fo = (s3 = (e) => process.stdout.write(e)) => {
  let e = St(s3), t = true;
  return (n, o) => {
    let r = o?.tags ?? [], i = n;
    if (r.includes("optimizer")) {
      if (r.includes("start")) {
        let a = n.match(/with (\d+) trials?/) || n.match(/(\d+) trials?/), l = n.match(/(MIPROv2|BootstrapFewshot|[A-Z][a-zA-Z]+)/), p = l ? l[1] : "Optimizer";
        a?.[1] ? i = `
\u250C\u2500 ${p} optimization (${a[1]} trials)
` : i = `
\u250C\u2500 ${p} optimization
`, t = true;
      } else if (r.includes("config")) if (n.includes("examples") && n.includes("training")) {
        let a = n.match(/(\d+) examples for training and (\d+) for validation/) || n.match(/(\d+) training.*?(\d+) validation/);
        if (a?.[1] && a[2]) i = `\u2502  Dataset: ${a[1]} training, ${a[2]} validation
`;
        else {
          let l = n.match(/(\d+) examples/);
          l?.[1] && (i = `\u2502  Dataset: ${l[1]} examples
`);
        }
      } else n.includes("teacher") ? i = `\u2502  Using teacher model
` : i = `\u2502  ${n}
`;
      else if (r.includes("phase")) t ? (i = `\u251C\u2500 ${n}
`, t = false) : i = `\u251C\u2500 ${n}
`;
      else if (r.includes("result")) n.includes("Generated") || n.includes("Selected") ? n.match(/(\d+)/)?.[1] ? i = `\u2502  \u2713 ${n}
` : i = `\u2502  \u2713 ${n}
` : n.includes("configuration") ? i = `\u2502  Applied best configuration
` : i = `\u2502  ${n}
`;
      else if (r.includes("progress")) i = `\u2502  ${n}
`;
      else if (r.includes("complete")) {
        let a = n.match(/(score|performance):\s*([\d.]+)/);
        if (a?.[2]) {
          let l = Number.parseFloat(a[2]);
          i = `\u251C\u2500 Complete! Best: ${l <= 1 ? `${(l * 100).toFixed(1)}%` : l.toFixed(3)}
`;
        } else n.includes("Bootstrap") ? i = `\u251C\u2500 ${n}
` : i = `\u251C\u2500 Optimization complete
`;
      } else if (r.includes("checkpoint")) if (n.includes("Resuming")) i = `\u2502  ${n}
`;
      else {
        let a = n.match(/checkpoint:\s*(.+)/) || n.match(/Saved\s+(.+)/);
        a?.[1] ? i = `\u2514\u2500 Saved: ${a[1]}
` : i = `\u2514\u2500 Checkpoint saved
`;
      }
    } else if (r.includes("discovery") && n.includes("Found") && n.includes("examples")) {
      let a = n.match(/Found (\d+)/);
      a?.[1] && (i = `\u2502  Found ${a[1]} examples
`);
    }
    r.includes("error") ? i = `
\u2717 ${n}
` : r.includes("warning") && (i = `
\u26A0 ${n}
`), e(i, o);
  };
};
var kt = fo();
var es = (s3, e, t) => {
  switch (s3.role) {
    case "system":
      return t ? "" : `\u2500\u2500\u2500 System: \u2500\u2500\u2500
${s3.content}`;
    case "function":
      return `\u2500\u2500\u2500 Function Result: \u2500\u2500\u2500
${s3.result}`;
    case "user":
      return typeof s3.content == "string" ? `\u2500\u2500\u2500 User: \u2500\u2500\u2500
${s3.content}` : `\u2500\u2500\u2500 User: \u2500\u2500\u2500
${s3.content.map((o) => {
        switch (o.type) {
          case "text":
            return o.text;
          case "image":
            return `(Image, ${o.mimeType}) ${o.image.substring(0, 10)}`;
          default:
            throw new Error("Invalid content type");
        }
      }).join(`
`)}`;
    case "assistant":
      return s3.functionCalls ? `\u2500\u2500\u2500 Functions: \u2500\u2500\u2500
${(s3.functionCalls?.map(({ function: o }) => {
        let r = typeof o.params != "string" ? JSON.stringify(o.params, null, 2) : o.params;
        return `${o.name}(${r})`;
      })).join(`
`)}` : `\u2500\u2500\u2500 Assistant: \u2500\u2500\u2500
${e ? "" : s3.content ?? "<empty>"}`;
    default:
      throw new Error("Invalid role");
  }
};
var yo = (s3, e, t = V) => {
  ge([s3], e, t);
};
var ge = (s3, e, t = V) => {
  for (let n of s3 ?? []) {
    let o = es(n, false, e);
    if (o) {
      let r = [];
      switch (n.role) {
        case "system":
          r.push("systemContent");
          break;
        case "function":
          r.push("functionName");
          break;
        case "user":
          r.push("userContent");
          break;
      }
      t(o, { tags: r });
    }
  }
  t("\u2500\u2500\u2500 Assistant: \u2500\u2500\u2500", { tags: ["assistantStart"] });
};
var Mt = (s3, e = V) => {
  s3.content && e(s3.content, { tags: ["responseContent"] });
  let t = /* @__PURE__ */ new Set();
  if (s3.functionCalls && s3.functionCalls.length > 0) for (let [n, o] of s3.functionCalls.entries()) {
    if (o.id) {
      if (t.has(o.id)) continue;
      t.add(o.id);
      let r = ["functionName"];
      n === 0 && r.push("firstFunction"), s3.functionCalls.length > 1 && r.push("multipleFunctions"), e(`[${n + 1}] ${o.function.name} [${o.id}]`, { tags: r });
    }
    if (o.function.params) {
      let r = typeof o.function.params == "string" ? o.function.params : JSON.stringify(o.function.params, null, 2);
      e(r, { tags: ["functionArg"] });
    }
  }
};
var Et = (s3, e = V) => {
  if (s3.results) for (let t of s3.results) Mt(t, e);
};
var Io = (s3, e = V) => {
  e(s3, { tags: ["responseContent", "responseDelta"] });
};
var bo = (s3, e = V) => {
  for (let t of s3) e(`Function Result [${t.functionId}]:`, { tags: ["functionResult"] }), t.isError ? e(t.result, { tags: ["functionResult", "error"] }) : e(t.result, { tags: ["functionResult"] });
};
var Pt = (s3) => {
  let e = {};
  for (let [t, n] of Object.entries(s3)) if (n != null) {
    let o = String(n);
    e[t] = o.length > 100 ? o.substring(0, 100) : o;
  }
  return e;
};
var Je;
var Ro = (s3) => {
  if (Je) return Je;
  if (s3) return Je = ts(s3), Je;
};
var ts = (s3) => ({ latencyHistogram: s3.createHistogram("ax_llm_request_duration_ms", { description: "Duration of LLM requests in milliseconds", unit: "ms" }), errorCounter: s3.createCounter("ax_llm_errors_total", { description: "Total number of LLM request errors" }), requestCounter: s3.createCounter("ax_llm_requests_total", { description: "Total number of LLM requests" }), tokenCounter: s3.createCounter("ax_llm_tokens_total", { description: "Total number of LLM tokens consumed" }), inputTokenCounter: s3.createCounter("ax_llm_input_tokens_total", { description: "Total number of input/prompt tokens consumed" }), outputTokenCounter: s3.createCounter("ax_llm_output_tokens_total", { description: "Total number of output/completion tokens generated" }), errorRateGauge: s3.createGauge("ax_llm_error_rate", { description: "Current error rate as a percentage (0-100)" }), meanLatencyGauge: s3.createGauge("ax_llm_mean_latency_ms", { description: "Mean latency of LLM requests in milliseconds", unit: "ms" }), p95LatencyGauge: s3.createGauge("ax_llm_p95_latency_ms", { description: "95th percentile latency of LLM requests in milliseconds", unit: "ms" }), p99LatencyGauge: s3.createGauge("ax_llm_p99_latency_ms", { description: "99th percentile latency of LLM requests in milliseconds", unit: "ms" }), streamingRequestsCounter: s3.createCounter("ax_llm_streaming_requests_total", { description: "Total number of streaming LLM requests" }), functionCallsCounter: s3.createCounter("ax_llm_function_calls_total", { description: "Total number of function/tool calls made" }), functionCallLatencyHistogram: s3.createHistogram("ax_llm_function_call_latency_ms", { description: "Latency of function calls in milliseconds", unit: "ms" }), requestSizeHistogram: s3.createHistogram("ax_llm_request_size_bytes", { description: "Size of LLM request payloads in bytes", unit: "By" }), responseSizeHistogram: s3.createHistogram("ax_llm_response_size_bytes", { description: "Size of LLM response payloads in bytes", unit: "By" }), temperatureGauge: s3.createGauge("ax_llm_temperature_gauge", { description: "Temperature setting used for LLM requests" }), maxTokensGauge: s3.createGauge("ax_llm_max_tokens_gauge", { description: "Maximum tokens setting used for LLM requests" }), estimatedCostCounter: s3.createCounter("ax_llm_estimated_cost_total", { description: "Estimated cost of LLM requests in USD", unit: "$" }), promptLengthHistogram: s3.createHistogram("ax_llm_prompt_length_chars", { description: "Length of prompts in characters" }), contextWindowUsageGauge: s3.createGauge("ax_llm_context_window_usage_ratio", { description: "Context window utilization ratio (0-1)" }), timeoutsCounter: s3.createCounter("ax_llm_timeouts_total", { description: "Total number of timed out LLM requests" }), abortsCounter: s3.createCounter("ax_llm_aborts_total", { description: "Total number of aborted LLM requests" }), thinkingBudgetUsageCounter: s3.createCounter("ax_llm_thinking_budget_usage_total", { description: "Total thinking budget tokens used" }), multimodalRequestsCounter: s3.createCounter("ax_llm_multimodal_requests_total", { description: "Total number of multimodal requests (with images/audio)" }) });
var Co = (s3, e, t, n, o) => {
  try {
    if (s3.latencyHistogram) {
      let r = Pt({ operation: e, ai_service: n, ...o ? { model: o } : {} });
      s3.latencyHistogram.record(t, r);
    }
  } catch (r) {
    console.warn("Failed to record latency metric:", r);
  }
};
var To = (s3, e, t, n, o, r, i) => {
  let a = { operation: e, ai_service: r, ...i ? { model: i } : {} };
  s3.meanLatencyGauge && s3.meanLatencyGauge.record(t, a), s3.p95LatencyGauge && s3.p95LatencyGauge.record(n, a), s3.p99LatencyGauge && s3.p99LatencyGauge.record(o, a);
};
var wo = (s3, e, t, n) => {
  try {
    if (s3.errorCounter) {
      let o = Pt({ operation: e, ai_service: t, ...n ? { model: n } : {} });
      s3.errorCounter.add(1, o);
    }
  } catch (o) {
    console.warn("Failed to record error metric:", o);
  }
};
var vo = (s3, e, t, n, o) => {
  s3.errorRateGauge && s3.errorRateGauge.record(t * 100, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var Oo = (s3, e, t, n) => {
  s3.requestCounter && s3.requestCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var Ae = (s3, e, t, n, o) => {
  try {
    let r = Pt({ ai_service: n, ...o ? { model: o } : {} });
    s3.tokenCounter && s3.tokenCounter.add(t, { token_type: e, ...r }), e === "input" && s3.inputTokenCounter && s3.inputTokenCounter.add(t, r), e === "output" && s3.outputTokenCounter && s3.outputTokenCounter.add(t, r);
  } catch (r) {
    console.warn("Failed to record token metric:", r);
  }
};
var So = (s3, e, t, n, o) => {
  t && s3.streamingRequestsCounter && s3.streamingRequestsCounter.add(1, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var ko = (s3, e, t, n, o) => {
  let r = { function_name: e, ...n ? { ai_service: n } : {}, ...o ? { model: o } : {} };
  s3.functionCallsCounter && s3.functionCallsCounter.add(1, r), t && s3.functionCallLatencyHistogram && s3.functionCallLatencyHistogram.record(t, r);
};
var _t = (s3, e, t, n, o) => {
  s3.requestSizeHistogram && s3.requestSizeHistogram.record(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var Ft = (s3, e, t, n, o) => {
  s3.responseSizeHistogram && s3.responseSizeHistogram.record(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var Mo = (s3, e, t, n, o) => {
  let r = { ...n ? { ai_service: n } : {}, ...o ? { model: o } : {} };
  e !== void 0 && s3.temperatureGauge && s3.temperatureGauge.record(e, r), t !== void 0 && s3.maxTokensGauge && s3.maxTokensGauge.record(t, r);
};
var Gt = (s3, e, t, n, o) => {
  s3.estimatedCostCounter && s3.estimatedCostCounter.add(t, { operation: e, ai_service: n, ...o ? { model: o } : {} });
};
var Eo = (s3, e, t, n) => {
  s3.promptLengthHistogram && s3.promptLengthHistogram.record(e, { ai_service: t, ...n ? { model: n } : {} });
};
var Po = (s3, e, t, n) => {
  s3.contextWindowUsageGauge && s3.contextWindowUsageGauge.record(e, { ai_service: t, ...n ? { model: n } : {} });
};
var _o = (s3, e, t, n) => {
  s3.timeoutsCounter && s3.timeoutsCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var Fo = (s3, e, t, n) => {
  s3.abortsCounter && s3.abortsCounter.add(1, { operation: e, ai_service: t, ...n ? { model: n } : {} });
};
var Go = (s3, e, t, n) => {
  s3.thinkingBudgetUsageCounter && s3.thinkingBudgetUsageCounter.add(e, { ai_service: t, ...n ? { model: n } : {} });
};
var Do = (s3, e, t, n, o) => {
  (e || t) && s3.multimodalRequestsCounter && s3.multimodalRequestsCounter.add(1, { ai_service: n, has_images: e.toString(), has_audio: t.toString(), ...o ? { model: o } : {} });
};
var w = () => structuredClone({ temperature: 0, topK: 40, topP: 0.9 });
var F = () => structuredClone({ temperature: 0.4, topP: 0.7, frequencyPenalty: 0.2 });
var E = class {
  constructor(e, { name: t, apiURL: n, headers: o, modelInfo: r, defaults: i, options: a = {}, supportFor: l, models: p }) {
    this.aiImpl = e;
    this.name = t, this.apiURL = n, this.headers = o, this.supportFor = l, this.tracer = a.tracer ?? k.tracer, this.meter = a.meter ?? k.meter, this.modelInfo = r, this.models = p, this.id = B();
    let c = this.getModel(i.model) ?? i.model, d = this.getEmbedModel(i.embedModel) ?? i.embedModel;
    if (this.defaults = { model: c, embedModel: d }, !i.model || typeof i.model != "string" || i.model === "") throw new Error("No model defined");
    this.setOptions(a), p && os(p);
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
  logger = V;
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
    return Ro(this.meter);
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
    this.debug = e.debug ?? false, this.rt = e.rateLimiter, this.fetch = e.fetch, this.timeout = e.timeout, this.tracer = e.tracer ?? k.tracer, this.meter = e.meter ?? k.meter, this.excludeContentFromTrace = e.excludeContentFromTrace, this.abortSignal = e.abortSignal, this.logger = e.logger ?? V;
  }
  getOptions() {
    return { debug: this.debug, rateLimiter: this.rt, fetch: this.fetch, tracer: this.tracer, meter: this.meter, timeout: this.timeout, excludeContentFromTrace: this.excludeContentFromTrace, abortSignal: this.abortSignal, logger: this.logger };
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
      Co(o, e, t, this.name, r), To(o, e, n.mean, n.p95, n.p99, this.name, r);
    }
  }
  updateErrorMetrics(e, t) {
    let n = this.metrics.errors[e];
    n.total++, t && n.count++, n.rate = n.count / n.total;
    let o = this.getMetricsInstruments();
    if (o) {
      let r = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      Oo(o, e, this.name, r), t && wo(o, e, this.name, r), vo(o, e, n.rate, this.name, r);
    }
  }
  recordTokenUsage(e) {
    let t = this.getMetricsInstruments();
    if (t && e?.tokens) {
      let { promptTokens: n, completionTokens: o, totalTokens: r, thoughtsTokens: i } = e.tokens;
      n && Ae(t, "input", n, this.name, e.model), o && Ae(t, "output", o, this.name, e.model), r && Ae(t, "total", r, this.name, e.model), i && Ae(t, "thoughts", i, this.name, e.model);
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
    if (!(!n || !e)) for (let o of e) o && typeof o == "object" && "function" in o && o.function && typeof o.function == "object" && "name" in o.function && ko(n, o.function.name, void 0, this.name, t);
  }
  recordTimeoutMetric(e) {
    let t = this.getMetricsInstruments();
    if (t) {
      let n = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      _o(t, e, this.name, n);
    }
  }
  recordAbortMetric(e) {
    let t = this.getMetricsInstruments();
    if (t) {
      let n = e === "chat" ? this.lastUsedChatModel : this.lastUsedEmbedModel;
      Fo(t, e, this.name, n);
    }
  }
  recordChatMetrics(e, t, n) {
    let o = this.getMetricsInstruments();
    if (!o) return;
    let r = this.lastUsedChatModel, i = this.lastUsedModelConfig, a = i?.stream ?? false;
    So(o, "chat", a, this.name, r);
    let { hasImages: l, hasAudio: p } = this.detectMultimodalContent(e);
    Do(o, l, p, this.name, r);
    let c = this.calculatePromptLength(e);
    Eo(o, c, this.name, r), Mo(o, i?.temperature, i?.maxTokens, this.name, r), t?.thinkingTokenBudget && this.modelUsage?.tokens?.thoughtsTokens && Go(o, this.modelUsage.tokens.thoughtsTokens, this.name, r);
    let d = this.calculateRequestSize(e);
    if (_t(o, "chat", d, this.name, r), n && !a) {
      let u = n, m = this.calculateResponseSize(u);
      if (Ft(o, "chat", m, this.name, r), u.results) for (let f of u.results) f.functionCalls && this.recordFunctionCallMetrics(f.functionCalls, this.lastUsedChatModel);
      let A = this.calculateContextWindowUsage(this.lastUsedChatModel, u.modelUsage);
      A > 0 && Po(o, A, this.name, r);
      let g = this.estimateCost(this.lastUsedChatModel, u.modelUsage);
      g > 0 && Gt(o, "chat", g, this.name, r);
    }
  }
  recordEmbedMetrics(e, t) {
    let n = this.getMetricsInstruments();
    if (!n) return;
    let o = this.lastUsedEmbedModel, r = this.calculateRequestSize(e);
    _t(n, "embed", r, this.name, o);
    let i = this.calculateResponseSize(t);
    Ft(n, "embed", i, this.name, o);
    let a = this.estimateCostByName(o, t.modelUsage);
    a > 0 && Gt(n, "embed", a, this.name, o);
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
    e.chatPrompt && Array.isArray(e.chatPrompt) && Dt(e.chatPrompt);
    let o = { ...this.aiImpl.getModelConfig(), ...e.modelConfig };
    if (t?.thinkingTokenBudget && !this.getFeatures(n).hasThinkingBudget) throw new Error(`Model ${n} does not support thinkingTokenBudget.`);
    if (t?.showThoughts && !this.getFeatures(n).hasShowThoughts) throw new Error(`Model ${n} does not support showThoughts.`);
    if (this.modelInfo.find((a) => a.name === n)?.isExpensive && t?.useExpensiveModel !== "yes") throw new Error(`Model ${n} is marked as expensive and requires explicit confirmation. Set useExpensiveModel: "yes" to proceed.`);
    return o.stream = (t?.stream !== void 0 ? t.stream : o.stream) ?? true, this.getFeatures(n).streaming || (o.stream = false), this.tracer ? await this.tracer.startActiveSpan("AI Chat Request", { kind: SpanKind.SERVER, attributes: { [C.LLM_SYSTEM]: this.name, [C.LLM_OPERATION_NAME]: "chat", [C.LLM_REQUEST_MODEL]: n, [C.LLM_REQUEST_MAX_TOKENS]: o.maxTokens ?? "Not set", [C.LLM_REQUEST_TEMPERATURE]: o.temperature, [C.LLM_REQUEST_TOP_P]: o.topP ?? "Not set", [C.LLM_REQUEST_TOP_K]: o.topK ?? "Not set", [C.LLM_REQUEST_FREQUENCY_PENALTY]: o.frequencyPenalty ?? "Not set", [C.LLM_REQUEST_PRESENCE_PENALTY]: o.presencePenalty ?? "Not set", [C.LLM_REQUEST_STOP_SEQUENCES]: o.stopSequences?.join(", ") ?? "Not set", [C.LLM_REQUEST_LLM_IS_STREAMING]: o.stream ?? "Not set" } }, t?.traceContext ?? context.active(), async (a) => await this._chat2(n, o, e, t, a)) : await this._chat2(n, o, e, t);
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
      let [m, A] = await this.aiImpl.createChatReq(l, o);
      return r?.isRecording() && ns(n, r, this.excludeContentFromTrace), await D({ name: m.name, url: this.apiURL, headers: await this.buildHeaders(m.headers), stream: t.stream, timeout: this.timeout, debug: i, fetch: this.fetch, span: r, abortSignal: o?.abortSignal ?? this.abortSignal }, A);
    };
    i && ge(l.chatPrompt, o?.debugHideSystemPrompt, o?.logger ?? this.logger);
    let c = o?.rateLimiter ?? this.rt, d = c ? await c(p, { modelUsage: this.modelUsage }) : await p();
    if (t.stream) {
      if (!this.aiImpl.createChatStreamResp) throw new Error("generateChatResp not implemented");
      let m = this.aiImpl.createChatStreamResp.bind(this), A = (h) => (I) => {
        let x = m(I, h);
        if (x.sessionId = o?.sessionId, !x.modelUsage) {
          let b = this.aiImpl.getTokenUsage();
          b && (x.modelUsage = { ai: this.name, model: e, tokens: b });
        }
        return this.modelUsage = x.modelUsage, this.recordTokenUsage(x.modelUsage), r?.isRecording() && Lo(x, r, this.excludeContentFromTrace), i && Et(x, o?.logger ?? this.logger), x;
      }, g = async (h) => {
        r?.isRecording() && r.end();
      };
      return d.pipeThrough(new We(A({}), g));
    }
    if (!this.aiImpl.createChatResp) throw new Error("generateChatResp not implemented");
    let u = this.aiImpl.createChatResp(d);
    if (u.sessionId = o?.sessionId, !u.modelUsage) {
      let m = this.aiImpl.getTokenUsage();
      m && (u.modelUsage = { ai: this.name, model: e, tokens: m });
    }
    return u.modelUsage && (this.modelUsage = u.modelUsage, this.recordTokenUsage(u.modelUsage)), r?.isRecording() && (Lo(u, r, this.excludeContentFromTrace), r.end()), i && Et(u, o?.logger ?? this.logger), u;
  }
  async embed(e, t) {
    let n = performance.now(), o = false, r;
    try {
      return r = await this._embed1(e, t), r;
    } catch (i) {
      throw o = true, i instanceof Error && (i.message.includes("timeout") || i.name === "TimeoutError" ? this.recordTimeoutMetric("embed") : (i.message.includes("abort") || i.name === "AbortError") && this.recordAbortMetric("embed")), i;
    } finally {
      let i = performance.now() - n;
      this.updateLatencyMetrics("embed", i), this.updateErrorMetrics("embed", o), o || this.recordEmbedMetrics(e, r);
    }
  }
  async _embed1(e, t) {
    let n = this.getEmbedModel(e.embedModel) ?? e.embedModel ?? this.defaults.embedModel;
    if (!n) throw new Error("No embed model defined");
    return this.tracer && await this.tracer?.startActiveSpan("AI Embed Request", { kind: SpanKind.SERVER, attributes: { [C.LLM_SYSTEM]: this.name, [C.LLM_OPERATION_NAME]: "embeddings", [C.LLM_REQUEST_MODEL]: n } }, t?.traceContext ?? context.active(), async (o) => {
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
    let r = n?.debug ?? this.debug, i = { ...t, embedModel: e };
    this.lastUsedEmbedModel = e;
    let a = async () => {
      let [c, d] = await this.aiImpl.createEmbedReq(i);
      return await D({ name: c.name, url: this.apiURL, headers: await this.buildHeaders(c.headers), debug: r, fetch: this.fetch, timeout: this.timeout, span: o, abortSignal: n?.abortSignal ?? this.abortSignal }, d);
    }, l = this.rt ? await this.rt(a, { modelUsage: this.embedModelUsage }) : await a(), p = this.aiImpl.createEmbedResp(l);
    if (p.sessionId = n?.sessionId, !p.modelUsage) {
      let c = this.aiImpl.getTokenUsage();
      c && (p.modelUsage = { ai: this.name, model: e, tokens: c });
    }
    return this.embedModelUsage = p.modelUsage, this.recordTokenUsage(p.modelUsage), o?.isRecording() && p.modelUsage?.tokens && o.addEvent(j.GEN_AI_USAGE, { [C.LLM_USAGE_INPUT_TOKENS]: p.modelUsage.tokens.promptTokens, [C.LLM_USAGE_OUTPUT_TOKENS]: p.modelUsage.tokens.completionTokens ?? 0, [C.LLM_USAGE_TOTAL_TOKENS]: p.modelUsage.tokens.totalTokens }), o?.end(), p;
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
function ns(s3, e, t) {
  let n = [];
  if (s3.chatPrompt && Array.isArray(s3.chatPrompt) && s3.chatPrompt.length > 0) for (let r of s3.chatPrompt) switch (r.role) {
    case "system":
      if (r.content) {
        let i = {};
        t || (i.content = r.content), e.addEvent(j.GEN_AI_SYSTEM_MESSAGE, i);
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
        !t && r.content && (a.content = r.content), e.addEvent(j.GEN_AI_ASSISTANT_MESSAGE, a);
      } else if (r.content) {
        let a = {};
        t || (a.content = r.content), e.addEvent(j.GEN_AI_ASSISTANT_MESSAGE, a);
      }
      break;
    }
    case "function": {
      let i = { id: r.functionId };
      t || (i.content = r.result), e.addEvent(j.GEN_AI_TOOL_MESSAGE, i);
      break;
    }
  }
  let o = {};
  t || (o.content = n.join(`
`)), e.addEvent(j.GEN_AI_USER_MESSAGE, o);
}
function Lo(s3, e, t) {
  if (s3.modelUsage?.tokens) {
    let n = s3.modelUsage.tokens.thoughtsTokens ? { [C.LLM_USAGE_THOUGHTS_TOKENS]: s3.modelUsage.tokens.thoughtsTokens } : {};
    e.addEvent(j.GEN_AI_USAGE, { [C.LLM_USAGE_INPUT_TOKENS]: s3.modelUsage.tokens.promptTokens, [C.LLM_USAGE_OUTPUT_TOKENS]: s3.modelUsage.tokens.completionTokens ?? 0, [C.LLM_USAGE_TOTAL_TOKENS]: s3.modelUsage.tokens.totalTokens, ...n });
  }
  if (s3.results) for (let n = 0; n < s3.results.length; n++) {
    let o = s3.results[n];
    if (!o || !o.content && !o.thought && !o.functionCalls?.length && !o.finishReason) continue;
    let r = o.functionCalls?.map((a) => ({ id: a.id, type: a.type, function: a.function.name, arguments: a.function.params })), i = {};
    r && r.length > 0 ? (t || (i.content = o.content), i.tool_calls = r) : t || (i.content = o.content ?? ""), e.addEvent(j.GEN_AI_CHOICE, { finish_reason: o.finishReason, index: n, message: JSON.stringify(i, null, 2) });
  }
}
function Dt(s3) {
  for (let e = 0; e < s3.length; e++) {
    let t = s3[e];
    if (!t || typeof t != "object") throw new Error(`AxMessage array validation failed: Item at index ${e} is not a valid message object`);
    if ("content" in t && typeof t.content == "string" && t.content.trim() === "") throw new Error(`AxMessage array validation failed: Item at index ${e} has empty content`);
  }
}
function os(s3) {
  let e = /* @__PURE__ */ new Set();
  for (let t of s3) {
    if (e.has(t.key)) throw new Error(`Duplicate model key detected: "${t.key}". Each model key must be unique.`);
    e.add(t.key);
  }
}
var Ye = ((c) => (c.Claude4Opus = "claude-opus-4-20250514", c.Claude4Sonnet = "claude-sonnet-4-20250514", c.Claude37Sonnet = "claude-3-7-sonnet-latest", c.Claude35Sonnet = "claude-3-5-sonnet-latest", c.Claude35Haiku = "claude-3-5-haiku-latest", c.Claude3Opus = "claude-3-opus-latest", c.Claude3Sonnet = "claude-3-sonnet-20240229", c.Claude3Haiku = "claude-3-haiku-20240307", c.Claude21 = "claude-2.1", c.ClaudeInstant12 = "claude-instant-1.2", c))(Ye || {});
var Ut = ((i) => (i.Claude37Sonnet = "claude-3-7-sonnet", i.Claude35Haiku = "claude-3-5-haiku", i.Claude35Sonnet = "claude-3-5-sonnet", i.Claude35SonnetV2 = "claude-3-5-sonnet-v2", i.Claude3Haiku = "claude-3-haiku", i.Claude3Opus = "claude-3-opus", i))(Ut || {});
var Ke = [{ name: "claude-opus-4-20250514", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 32e3, hasThinkingBudget: true, hasShowThoughts: true }, { name: "claude-sonnet-4-20250514", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 64e3, hasThinkingBudget: true, hasShowThoughts: true }, { name: "claude-3-7-sonnet-latest", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 64e3, hasThinkingBudget: true, hasShowThoughts: true }, { name: "claude-3-5-sonnet-latest", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 8192 }, { name: "claude-3-5-haiku-latest", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 4, maxTokens: 8192 }, { name: "claude-3-opus-latest", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 75, maxTokens: 4096 }, { name: "claude-3-sonnet-20240229", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15, maxTokens: 4096 }, { name: "claude-3-haiku-20240307", currency: "usd", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 1.25, maxTokens: 4096 }, { name: "claude-2.1", currency: "usd", promptTokenCostPer1M: 8, completionTokenCostPer1M: 25, maxTokens: 4096 }, { name: "claude-instant-1.2", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 2.24, maxTokens: 4096 }];
var $o = () => structuredClone({ model: "claude-3-7-sonnet-latest", maxTokens: 4e4, thinkingTokenBudgetLevels: { minimal: 1024, low: 5e3, medium: 1e4, high: 2e4, highest: 32e3 }, ...w() });
var rs = () => structuredClone({ model: "claude-3-7-sonnet", maxTokens: 4e4, thinkingTokenBudgetLevels: { minimal: 1024, low: 5e3, medium: 1e4, high: 2e4, highest: 32e3 }, ...w() });
var Nt = class {
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
    let a = e.chatPrompt.filter((x) => x.role === "system").map((x) => ({ type: "text", text: x.content, ...x.cache ? { cache: { type: "ephemeral" } } : {} })), l = e.chatPrompt.filter((x) => x.role !== "system"), p = ss(l), c = e.functions?.map((x) => ({ name: x.name, description: x.description, input_schema: x.parameters })), d = e.modelConfig?.maxTokens ?? this.config.maxTokens, u = e.modelConfig?.stopSequences ?? this.config.stopSequences, m = e.modelConfig?.temperature ?? this.config.temperature, A = e.modelConfig?.topP ?? this.config.topP, g = e.modelConfig?.topK ?? this.config.topK, f = e.modelConfig?.n ?? this.config.n;
    if (f && f > 1) throw new Error("Anthropic does not support sampling (n > 1)");
    let h;
    if (this.config.thinking?.budget_tokens && (h = this.config.thinking), t?.thinkingTokenBudget) {
      let x = this.config.thinkingTokenBudgetLevels;
      switch (t.thinkingTokenBudget) {
        case "none":
          h = void 0;
          break;
        case "minimal":
          h = { type: "enabled", budget_tokens: x?.minimal ?? 1024 };
          break;
        case "low":
          h = { type: "enabled", budget_tokens: x?.low ?? 5e3 };
          break;
        case "medium":
          h = { type: "enabled", budget_tokens: x?.medium ?? 1e4 };
          break;
        case "high":
          h = { type: "enabled", budget_tokens: x?.high ?? 2e4 };
          break;
        case "highest":
          h = { type: "enabled", budget_tokens: x?.highest ?? 32e3 };
          break;
      }
    }
    let I = { ...this.isVertex ? { anthropic_version: "vertex-2023-10-16" } : { model: n }, ...d ? { max_tokens: d } : {}, ...u && u.length > 0 ? { stop_sequences: u } : {}, ...m && !h ? { temperature: m } : {}, ...A && (!h || A >= 0.95) ? { top_p: A } : {}, ...g && !h ? { top_k: g } : {}, ...i, ...c && c.length > 0 ? { tools: c } : {}, ...o ? { stream: true } : {}, ...a ? { system: a } : {}, ...h ? { thinking: h } : {}, messages: p };
    return [r, I];
  };
  createChatResp = (e) => {
    if (e.type === "error") throw new v(e.error.message, void 0, void 0);
    let t = Bo(e.stop_reason), n = this.currentPromptConfig?.thinkingTokenBudget !== "none" && this.currentPromptConfig?.showThoughts !== false, o = e.content.map((r, i) => r.type === "tool_use" ? { index: i, id: r.id, functionCalls: [{ id: r.id, type: "function", function: { name: r.name, params: r.input } }], finishReason: t } : (r.type === "thinking" || r.type === "redacted_thinking") && n ? { index: i, thought: r.thinking, id: e.id, finishReason: t } : { index: i, content: r.type === "text" ? r.text : "", id: e.id, finishReason: t }).filter((r) => r.content !== "" || r.thought !== void 0 || r.functionCalls !== void 0);
    return this.tokensUsed = { promptTokens: e.usage.input_tokens, completionTokens: e.usage.output_tokens, totalTokens: e.usage.input_tokens + e.usage.output_tokens }, { results: o, remoteId: e.id };
  };
  createChatStreamResp = (e, t) => {
    if (!("type" in e)) throw new Error("Invalid Anthropic streaming event");
    let n = t;
    if (n.indexIdMap || (n.indexIdMap = {}), e.type === "error") {
      let { error: r } = e;
      throw new v(r.message, void 0, void 0);
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
      return this.tokensUsed = { promptTokens: 0, completionTokens: i.output_tokens, totalTokens: i.output_tokens }, { results: [{ index: o, content: "", finishReason: Bo(r.stop_reason) }] };
    }
    return { results: [{ index: o, content: "" }] };
  };
};
var he = class extends E {
  constructor({ apiKey: e, projectId: t, region: n, config: o, options: r, models: i }) {
    let a = t !== void 0 && n !== void 0, l, p;
    if (a) {
      if (!e) throw new Error("Anthropic Vertex API key not set");
      l = `https://${n}-aiplatform.googleapis.com/v1/projects/${t}/locations/${n}/publishers/anthropic/`, p = async () => ({ Authorization: `Bearer ${typeof e == "function" ? await e() : e}` });
    } else {
      if (!e) throw new Error("Anthropic API key not set");
      l = "https://api.anthropic.com/v1", p = async () => ({ "anthropic-version": "2023-06-01", "anthropic-beta": "prompt-caching-2024-07-31", "x-api-key": typeof e == "function" ? await e() : e });
    }
    let c = { ...$o(), ...o }, d = new Nt(c, a), u = (m) => {
      let A = L({ model: m, modelInfo: Ke, models: i });
      return { functions: true, streaming: true, hasThinkingBudget: A?.hasThinkingBudget ?? false, hasShowThoughts: A?.hasShowThoughts ?? false, functionCot: true };
    };
    super(d, { name: "Anthropic", apiURL: l, headers: p, modelInfo: Ke, defaults: { model: c.model }, options: r, supportFor: u, models: i });
  }
};
function ss(s3) {
  let e = s3.map((t) => {
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
  return is(e);
}
function is(s3) {
  let e = [];
  for (let [t, n] of s3.entries()) {
    if (n.role !== "assistant") {
      e.push(n);
      continue;
    }
    if (t > 0 && s3.at(t - 1)?.role === "assistant") {
      let o = e.pop();
      e.push({ ...o || {}, ...n });
    } else e.push(n);
  }
  return e;
}
function Bo(s3) {
  if (s3) switch (s3) {
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
var Qe = ((h) => (h.GPT4 = "gpt-4", h.GPT41 = "gpt-4.1", h.GPT41Mini = "gpt-4.1-mini", h.GPT4O = "gpt-4o", h.GPT4OMini = "gpt-4o-mini", h.GPT4ChatGPT4O = "chatgpt-4o-latest", h.GPT4Turbo = "gpt-4-turbo", h.GPT35Turbo = "gpt-3.5-turbo", h.GPT35TurboInstruct = "gpt-3.5-turbo-instruct", h.GPT35TextDavinci002 = "text-davinci-002", h.GPT3TextBabbage002 = "text-babbage-002", h.GPT3TextAda001 = "text-ada-001", h.O1 = "o1", h.O1Mini = "o1-mini", h.O3 = "o3", h.O3Mini = "o3-mini", h.O4Mini = "o4-mini", h))(Qe || {});
var xe = ((n) => (n.TextEmbeddingAda002 = "text-embedding-ada-002", n.TextEmbedding3Small = "text-embedding-3-small", n.TextEmbedding3Large = "text-embedding-3-large", n))(xe || {});
var fe = ((x) => (x.GPT4 = "gpt-4", x.GPT41 = "gpt-4.1", x.GPT41Mini = "gpt-4.1-mini", x.GPT4O = "gpt-4o", x.GPT4OMini = "gpt-4o-mini", x.GPT4ChatGPT4O = "chatgpt-4o-latest", x.GPT4Turbo = "gpt-4-turbo", x.GPT35Turbo = "gpt-3.5-turbo", x.GPT35TurboInstruct = "gpt-3.5-turbo-instruct", x.GPT35TextDavinci002 = "text-davinci-002", x.GPT3TextBabbage002 = "text-babbage-002", x.GPT3TextAda001 = "text-ada-001", x.O1Pro = "o1-pro", x.O1 = "o1", x.O1Mini = "o1-mini", x.O3Pro = "o3-pro", x.O3 = "o3", x.O3Mini = "o3-mini", x.O4Mini = "o4-mini", x))(fe || {});
var ye = [{ name: "gpt-4", currency: "usd", promptTokenCostPer1M: 30, completionTokenCostPer1M: 60 }, { name: "gpt-4.1", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 8 }, { name: "gpt-4.1-mini", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1.6 }, { name: "gpt-4o", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4o-mini", currency: "usd", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.6 }, { name: "chatgpt-4o-latest", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4-turbo", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30 }, { name: "gpt-3.5-turbo", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "o1", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60 }, { name: "o1-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 14.4 }, { name: "o3", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60 }, { name: "o3-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4 }, { name: "o4-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4 }, { name: "text-embedding-ada-002", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "text-embedding-3-small", currency: "usd", promptTokenCostPer1M: 0.02, completionTokenCostPer1M: 0.02 }, { name: "text-embedding-3-large", currency: "usd", promptTokenCostPer1M: 0.13, completionTokenCostPer1M: 0.13 }];
var Lt = [{ name: "gpt-4", currency: "usd", promptTokenCostPer1M: 30, completionTokenCostPer1M: 60 }, { name: "gpt-4.1", currency: "usd", promptTokenCostPer1M: 2, completionTokenCostPer1M: 8 }, { name: "gpt-4.1-mini", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1.6 }, { name: "gpt-4o", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4o-mini", currency: "usd", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.6 }, { name: "chatgpt-4o-latest", currency: "usd", promptTokenCostPer1M: 5, completionTokenCostPer1M: 15 }, { name: "gpt-4-turbo", currency: "usd", promptTokenCostPer1M: 10, completionTokenCostPer1M: 30 }, { name: "gpt-3.5-turbo", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "o1-pro", currency: "usd", promptTokenCostPer1M: 150, completionTokenCostPer1M: 600, hasThinkingBudget: true, hasShowThoughts: true, isExpensive: true }, { name: "o1", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60, hasThinkingBudget: true, hasShowThoughts: true }, { name: "o3-pro", currency: "usd", promptTokenCostPer1M: 20, completionTokenCostPer1M: 80, hasThinkingBudget: true, hasShowThoughts: true, isExpensive: true }, { name: "o3", currency: "usd", promptTokenCostPer1M: 15, completionTokenCostPer1M: 60, hasThinkingBudget: true, hasShowThoughts: true }, { name: "o3-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4, hasThinkingBudget: true, hasShowThoughts: true }, { name: "o4-mini", currency: "usd", promptTokenCostPer1M: 1.1, completionTokenCostPer1M: 4.4, hasThinkingBudget: true, hasShowThoughts: true }];
var as = (s3) => {
  let e = ["o1", "o1-mini", "o3", "o3-mini", "o4-mini", "o1-pro", "o3-pro"];
  return e.includes(s3) || e.includes(s3);
};
var ce = () => structuredClone({ model: "gpt-4.1", embedModel: "text-embedding-3-small", ...w() });
var $t = () => structuredClone({ ...ce(), model: "gpt-4.1" });
var qt = () => structuredClone({ model: "gpt-4.1", embedModel: "text-embedding-3-small", ...F() });
var zt = () => ({ ...ce(), model: "gpt-4.1-mini" });
var Bt = class {
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
    let o = { name: "/chat/completions" }, r = e.functions?.map((m) => ({ type: "function", function: { name: m.name, description: m.description, parameters: m.parameters } })), i = !e.functionCall && e.functions && e.functions.length > 0 ? "auto" : e.functionCall, a = ls(e), l = e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, p = e.modelConfig?.stream ?? this.config.stream, c = this.config.store, d = as(n), u = { model: n, messages: a, response_format: this.config?.responseFormat ? { type: this.config.responseFormat } : void 0, tools: r, tool_choice: i, ...d ? {} : { max_completion_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_p: e.modelConfig?.topP ?? this.config.topP ?? 1, n: e.modelConfig?.n ?? this.config.n, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, ...l ? { frequency_penalty: l } : {} }, stop: e.modelConfig?.stopSequences ?? this.config.stop, logit_bias: this.config.logitBias, ...p && this.streamingUsage ? { stream: true, stream_options: { include_usage: true } } : {}, ...c ? { store: c } : {}, ...this.config.serviceTier ? { service_tier: this.config.serviceTier } : {}, ...this.config.user ? { user: this.config.user } : {} };
    if (this.config.reasoningEffort && (u.reasoning_effort = this.config.reasoningEffort), this.config.webSearchOptions && (u.web_search_options = { ...this.config.webSearchOptions.searchContextSize && { search_context_size: this.config.webSearchOptions.searchContextSize }, ...this.config.webSearchOptions.userLocation && { user_location: { approximate: { type: "approximate", ...this.config.webSearchOptions.userLocation.approximate.city && { city: this.config.webSearchOptions.userLocation.approximate.city }, ...this.config.webSearchOptions.userLocation.approximate.country && { country: this.config.webSearchOptions.userLocation.approximate.country }, ...this.config.webSearchOptions.userLocation.approximate.region && { region: this.config.webSearchOptions.userLocation.approximate.region }, ...this.config.webSearchOptions.userLocation.approximate.timezone && { timezone: this.config.webSearchOptions.userLocation.approximate.timezone } } } } }), t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        u.reasoning_effort = void 0;
        break;
      case "minimal":
        u.reasoning_effort = "low";
        break;
      case "low":
        u.reasoning_effort = "medium";
        break;
      case "medium":
        u.reasoning_effort = "high";
        break;
      case "high":
        u.reasoning_effort = "high";
        break;
      case "highest":
        u.reasoning_effort = "high";
        break;
    }
    return this.chatReqUpdater && (u = this.chatReqUpdater(u)), [o, u];
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
      if (a.message.refusal) throw new v(a.message.refusal, e.model, e.id);
      let l = qo(a.finish_reason), p = a.message.tool_calls?.map(({ id: c, function: { arguments: d, name: u } }) => ({ id: c, type: "function", function: { name: u, params: d } }));
      return { index: a.index, id: `${a.index}`, content: a.message.content ?? void 0, thought: a.message.reasoning_content, annotations: a.message.annotations, functionCalls: p, finishReason: l };
    }), remoteId: t };
  }
  createChatStreamResp(e, t) {
    let { id: n, usage: o, choices: r } = e;
    this.tokensUsed = o ? { promptTokens: o.prompt_tokens, completionTokens: o.completion_tokens, totalTokens: o.total_tokens } : void 0;
    let i = t;
    return i.indexIdMap || (i.indexIdMap = {}), { results: r.map(({ index: l, delta: { content: p, role: c, refusal: d, tool_calls: u, reasoning_content: m, annotations: A }, finish_reason: g }) => {
      if (d) throw new v(d, void 0, n);
      let f = qo(g), h = u?.map(({ id: I, index: x, function: { name: b, arguments: T } }) => {
        typeof I == "string" && typeof x == "number" && !i.indexIdMap[x] && (i.indexIdMap[x] = I);
        let O = i.indexIdMap[x];
        return O ? { id: O, type: "function", function: { name: b, params: T } } : null;
      }).filter((I) => I !== null);
      return { index: l, content: p ?? void 0, role: c, thought: m, annotations: A, functionCalls: h, finishReason: f, id: n };
    }) };
  }
  createEmbedResp(e) {
    let { data: t, usage: n } = e;
    return this.tokensUsed = n ? { promptTokens: n.prompt_tokens, completionTokens: n.completion_tokens, totalTokens: n.total_tokens } : void 0, { embeddings: t.map((o) => o.embedding) };
  }
};
var qo = (s3) => {
  switch (s3) {
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
function ls(s3) {
  return s3.chatPrompt.map((t) => {
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
              return { type: "input_audio", input_audio: { data: o.data, format: o.format ?? "wav" } };
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
var M = class extends E {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r, models: i, chatReqUpdater: a, supportFor: l }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    let p = new Bt(t, n?.streamingUsage ?? true, a);
    super(p, { name: "OpenAI", apiURL: o || "https://api.openai.com/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: r, defaults: { model: t.model, embedModel: t.embedModel }, options: n, supportFor: l, models: i });
  }
};
var Ie = class extends M {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    r = [...ye, ...r ?? []];
    let i = (a) => {
      let l = L({ model: a, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: l?.hasThinkingBudget ?? false, hasShowThoughts: l?.hasShowThoughts ?? false };
    };
    super({ apiKey: e, config: { ...ce(), ...t }, options: n, modelInfo: r, models: o, supportFor: i }), super.setName("OpenAI");
  }
};
var zo = ce;
var ps = qt;
var cs = zt;
var us = $t;
var be = class extends M {
  constructor({ apiKey: e, resourceName: t, deploymentName: n, version: o = "api-version=2024-02-15-preview", config: r, options: i, models: a, modelInfo: l }) {
    if (!e || e === "") throw new Error("Azure OpenAPI API key not set");
    if (!t || t === "") throw new Error("Azure OpenAPI resource name not set");
    if (!n || n === "") throw new Error("Azure OpenAPI deployment id not set");
    let p = { ...zo(), ...r };
    l = [...ye, ...l ?? []];
    let c = (u) => {
      let m = L({ model: u, modelInfo: l, models: a });
      return { functions: true, streaming: true, hasThinkingBudget: m?.hasThinkingBudget ?? false, hasShowThoughts: m?.hasShowThoughts ?? false };
    };
    super({ apiKey: e, config: p, options: i, models: a, modelInfo: l, supportFor: c });
    let d = t.includes("://") ? t : `https://${t}.openai.azure.com/`;
    super.setName("Azure OpenAI"), super.setAPIURL(new URL(`/openai/deployments/${n}?api-version=${o}`, d).href), super.setHeaders(async () => ({ "api-key": e }));
  }
};
var jt = class s {
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
    ds(e), this.services = [...e].sort(t?.comparator ?? s.metricComparator);
    let n = this.services[this.currentServiceIndex];
    if (n === void 0) throw new Error("Error initializing the AI services.");
    this.currentService = n, this.debug = t?.debug ?? true, this.initialBackoffMs = t?.initialBackoffMs ?? 1e3, this.maxBackoffMs = t?.maxBackoffMs ?? 32e3, this.maxRetries = t?.maxRetries ?? 3;
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
        if (!(n instanceof U)) throw n;
        switch (n.constructor) {
          case ne:
            throw n;
          case le:
            break;
          case X:
            break;
          case Q:
            break;
          case Y:
            break;
          case pe:
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
function ds(s3) {
  let e = s3.find((o) => o.getModelList() !== void 0);
  if (!e) return;
  let t = e.getModelList();
  if (!t) throw new Error("No model list found in any service.");
  let n = new Set(t.map((o) => o.key));
  for (let o = 0; o < s3.length; o++) {
    let r = s3[o];
    if (!r) throw new Error(`Service at index ${o} is undefined`);
    let i = r.getModelList();
    if (!i) throw new Error(`Service at index ${o} (${r.getName()}) has no model list while another service does.`);
    let a = new Set(i.map((l) => l.key));
    for (let l of n) if (!a.has(l)) throw new Error(`Service at index ${o} (${r.getName()}) is missing model "${l}"`);
    for (let l of a) if (!n.has(l)) throw new Error(`Service at index ${o} (${r.getName()}) has extra model "${l}"`);
  }
}
var Xe = ((o) => (o.CommandRPlus = "command-r-plus", o.CommandR = "command-r", o.Command = "command", o.CommandLight = "command-light", o))(Xe || {});
var Ze = ((o) => (o.EmbedEnglishV30 = "embed-english-v3.0", o.EmbedEnglishLightV30 = "embed-english-light-v3.0", o.EmbedMultiLingualV30 = "embed-multilingual-v3.0", o.EmbedMultiLingualLightV30 = "embed-multilingual-light-v3.0", o))(Ze || {});
var Ht = [{ name: "command-r-plus", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "command-r", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "command", currency: "usd", promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }, { name: "command-light", currency: "usd", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.6 }, { name: "embed-english-light-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-english-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-multilingual-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }, { name: "embed-multilingual-light-v3.0", currency: "usd", promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.1 }];
var Ho = () => structuredClone({ model: "command-r-plus", embedModel: "embed-english-v3.0", ...w() });
var ms = () => structuredClone({ model: "command-r", embedModel: "embed-english-v3.0", ...F() });
var Vt = class {
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
  createChatReq(e, t) {
    let n = e.model, o = e.chatPrompt.at(-1), r = e.chatPrompt.slice(0, -1), i;
    o && o.role === "user" && typeof o.content == "string" && (i = o?.content);
    let a = gs(r), l = e.functions?.map((u) => {
      let m = {};
      if (u.parameters?.properties) for (let [A, g] of Object.entries(u.parameters.properties)) m[A] = { description: g.description, type: g.type, required: u.parameters.required?.includes(A) ?? false };
      return { name: u.name, description: u.description, parameter_definitions: m };
    }), p = e.chatPrompt.filter((u) => u.role === "function").map((u) => {
      let m = l?.find((A) => A.name === u.functionId);
      if (!m) throw new Error("Function not found");
      return { call: { name: m.name, parameters: m.parameter_definitions }, outputs: [{ result: u.result ?? "" }] };
    }), c = { name: "/chat" }, d = { message: i, model: n, tools: l, ...p && !i ? { tool_results: p } : {}, chat_history: a, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, k: e.modelConfig?.topK ?? this.config.topK, p: e.modelConfig?.topP ?? this.config.topP, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, end_sequences: this.config.endSequences, stop_sequences: e.modelConfig?.stopSequences ?? this.config.stopSequences };
    return [c, d];
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
var Re = class extends E {
  constructor({ apiKey: e, config: t, options: n, models: o }) {
    if (!e || e === "") throw new Error("Cohere API key not set");
    let r = { ...Ho(), ...t }, i = new Vt(r);
    super(i, { name: "Cohere", apiURL: "https://api.cohere.ai/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: Ht, defaults: { model: r.model }, supportFor: { functions: true, streaming: true }, options: n, models: o });
  }
};
function gs(s3) {
  return s3.map((e) => {
    let t = "";
    if (e.role === "system" || e.role === "assistant" || e.role === "user") if (typeof e.content == "string") t = e.content;
    else throw new Error("Multi-modal content not supported");
    switch (e.role) {
      case "user":
        return { role: "USER", message: t };
      case "system":
        return { role: "SYSTEM", message: t };
      case "assistant": {
        let n = jo(e.functionCalls);
        return { role: "CHATBOT", message: t, tool_calls: n };
      }
      case "function": {
        let n = s3.map((i) => {
          if (i.role === "assistant") return i.functionCalls?.find((a) => a.id === e.functionId);
        }).filter((i) => i !== void 0), o = jo(n)?.at(0);
        if (!o) throw new Error("Function call not found");
        let r = [{ result: e.result }];
        return { role: "TOOL", tool_results: [{ call: o, outputs: r }] };
      }
      default:
        throw new Error("Unknown role");
    }
  });
}
function jo(s3) {
  return s3?.map((e) => {
    let t = typeof e.function.params == "string" ? JSON.parse(e.function.params) : e.function.params;
    return { name: e.function.name, parameters: t };
  });
}
var et = ((n) => (n.DeepSeekChat = "deepseek-chat", n.DeepSeekCoder = "deepseek-coder", n.DeepSeekReasoner = "deepseek-reasoner", n))(et || {});
var Wt = [{ name: "deepseek-chat", currency: "USD", promptTokenCostPer1M: 0.27, completionTokenCostPer1M: 1.1 }, { name: "deepseek-reasoner", currency: "USD", promptTokenCostPer1M: 0.55, completionTokenCostPer1M: 2.19 }];
var Vo = () => structuredClone({ model: "deepseek-chat", ...w() });
var As = () => structuredClone({ model: "deepseek-coder", ...F() });
var Ce = class extends M {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("DeepSeek API key not set");
    let i = { ...Vo(), ...t };
    r = [...Wt, ...r ?? []], super({ apiKey: e, config: i, options: n, apiURL: "https://api.deepseek.com", modelInfo: r, supportFor: { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false }, models: o }), super.setName("DeepSeek");
  }
};
var tt = ((c) => (c.Gemini25Pro = "gemini-2.5-pro", c.Gemini25Flash = "gemini-2.5-flash", c.Gemini25FlashLite = "gemini-2.5-flash-lite-preview-06-17", c.Gemini20Flash = "gemini-2.0-flash", c.Gemini20FlashLite = "gemini-2.0-flash-lite-preview-02-05", c.Gemini1Pro = "gemini-1.0-pro", c.Gemini15Flash = "gemini-1.5-flash", c.Gemini15Flash002 = "gemini-1.5-flash-002", c.Gemini15Flash8B = "gemini-1.5-flash-8b", c.Gemini15Pro = "gemini-1.5-pro", c))(tt || {});
var Jt = ((o) => (o.GeminiEmbedding = "gemini-embedding-exp", o.TextEmbeddingLarge = "text-embedding-large-exp-03-07", o.TextEmbedding004 = "text-embedding-004", o.TextEmbedding005 = "text-embedding-005", o))(Jt || {});
var Yt = ((o) => (o.HarmCategoryHarassment = "HARM_CATEGORY_HARASSMENT", o.HarmCategoryHateSpeech = "HARM_CATEGORY_HATE_SPEECH", o.HarmCategorySexuallyExplicit = "HARM_CATEGORY_SEXUALLY_EXPLICIT", o.HarmCategoryDangerousContent = "HARM_CATEGORY_DANGEROUS_CONTENT", o))(Yt || {});
var Kt = ((r) => (r.BlockNone = "BLOCK_NONE", r.BlockOnlyHigh = "BLOCK_ONLY_HIGH", r.BlockMediumAndAbove = "BLOCK_MEDIUM_AND_ABOVE", r.BlockLowAndAbove = "BLOCK_LOW_AND_ABOVE", r.BlockDefault = "HARM_BLOCK_THRESHOLD_UNSPECIFIED", r))(Kt || {});
var Wo = ((l) => (l.SemanticSimilarity = "SEMANTIC_SIMILARITY", l.Classification = "CLASSIFICATION", l.Clustering = "CLUSTERING", l.RetrievalDocument = "RETRIEVAL_DOCUMENT", l.RetrievalQuery = "RETRIEVAL_QUERY", l.QuestionAnswering = "QUESTION_ANSWERING", l.FactVerification = "FACT_VERIFICATION", l.CodeRetrievalQuery = "CODE_RETRIEVAL_QUERY", l))(Wo || {});
var Qt = [{ name: "gemini-2.5-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 2.5, completionTokenCostPer1M: 15, hasThinkingBudget: true, hasShowThoughts: true }, { name: "gemini-2.5-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 15, completionTokenCostPer1M: 3.5, hasThinkingBudget: true, hasShowThoughts: true }, { name: "gemini-2.5-flash-lite-preview-06-17", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.1, completionTokenCostPer1M: 0.4, hasThinkingBudget: true, hasShowThoughts: true }, { name: "gemini-2.0-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.01, completionTokenCostPer1M: 0.4 }, { name: "gemini-2.0-flash-lite-preview-02-05", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0, completionTokenCostPer1M: 0 }, { name: "gemini-1.5-flash", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.075, completionTokenCostPer1M: 0.3 }, { name: "gemini-1.5-flash-8b", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.0375, completionTokenCostPer1M: 0.15 }, { name: "gemini-1.5-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 1.25, completionTokenCostPer1M: 5 }, { name: "gemini-1.0-pro", currency: "usd", characterIsToken: false, promptTokenCostPer1M: 0.5, completionTokenCostPer1M: 1.5 }];
var Jo = [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }];
var Yo = () => structuredClone({ model: "gemini-2.5-flash", embedModel: "text-embedding-005", safetySettings: Jo, thinkingTokenBudgetLevels: { minimal: 200, low: 800, medium: 5e3, high: 1e4, highest: 24500 }, ...w() });
var hs = () => structuredClone({ model: "gemini-2.0-flash", embedModel: "text-embedding-005", safetySettings: Jo, thinkingTokenBudgetLevels: { minimal: 200, low: 800, medium: 5e3, high: 1e4, highest: 24500 }, ...F() });
var Xt = class {
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
      let g = o ? "&" : "?", f = typeof this.apiKey == "function" ? await this.apiKey() : this.apiKey;
      r.name += `${g}key=${f}`;
    }
    let i = e.chatPrompt.filter((g) => g.role === "system").map((g) => g.content), a = i.length > 0 ? { role: "user", parts: [{ text: i.join(" ") }] } : void 0, l = e.chatPrompt.filter((g) => g.role !== "system").map((g, f) => {
      switch (g.role) {
        case "user":
          return { role: "user", parts: Array.isArray(g.content) ? g.content.map((I, x) => {
            switch (I.type) {
              case "text":
                return { text: I.text };
              case "image":
                return { inlineData: { mimeType: I.mimeType, data: I.image } };
              default:
                throw new Error(`Chat prompt content type not supported (index: ${x})`);
            }
          }) : [{ text: g.content }] };
        case "assistant": {
          let h = [];
          if (g.functionCalls) {
            if (h = g.functionCalls.map((I) => {
              let x = typeof I.function.params == "string" ? JSON.parse(I.function.params) : I.function.params;
              return { functionCall: { name: I.function.name, args: x } };
            }), !h) throw new Error("Function call is empty");
            return { role: "model", parts: h };
          }
          if (!g.content) throw new Error("Assistant content is empty");
          return h = [{ text: g.content }], { role: "model", parts: h };
        }
        case "function": {
          if (!("functionId" in g)) throw new Error(`Chat prompt functionId is empty (index: ${f})`);
          return { role: "user", parts: [{ functionResponse: { name: g.functionId, response: { result: g.result } } }] };
        }
        default:
          throw new Error(`Invalid role: ${JSON.stringify(g)} (index: ${f})`);
      }
    }), p = [];
    e.functions && e.functions.length > 0 && p.push({ function_declarations: e.functions }), this.options?.codeExecution && p.push({ code_execution: {} }), this.options?.googleSearchRetrieval && p.push({ google_search_retrieval: { dynamic_retrieval_config: this.options.googleSearchRetrieval } }), this.options?.googleSearch && p.push({ google_search: {} }), this.options?.urlContext && p.push({ url_context: {} }), p.length === 0 && (p = void 0);
    let c;
    if (e.functionCall) if (e.functionCall === "none") c = { function_calling_config: { mode: "NONE" } };
    else if (e.functionCall === "auto") c = { function_calling_config: { mode: "AUTO" } };
    else if (e.functionCall === "required") c = { function_calling_config: { mode: "ANY" } };
    else {
      let g = e.functionCall.function?.name ? { allowedFunctionNames: [e.functionCall.function.name] } : {};
      c = { function_calling_config: { mode: "ANY" }, ...g };
    }
    else p && p.length > 0 && (c = { function_calling_config: { mode: "AUTO" } });
    let d = {};
    if (this.config.thinking?.includeThoughts && (d.includeThoughts = true), this.config.thinking?.thinkingTokenBudget && (d.thinkingBudget = this.config.thinking.thinkingTokenBudget), t?.thinkingTokenBudget) {
      let g = this.config.thinkingTokenBudgetLevels;
      switch (t.thinkingTokenBudget) {
        case "none":
          d.thinkingBudget = 0, d.includeThoughts = false;
          break;
        case "minimal":
          d.thinkingBudget = g?.minimal ?? 200;
          break;
        case "low":
          d.thinkingBudget = g?.low ?? 800;
          break;
        case "medium":
          d.thinkingBudget = g?.medium ?? 5e3;
          break;
        case "high":
          d.thinkingBudget = g?.high ?? 1e4;
          break;
        case "highest":
          d.thinkingBudget = g?.highest ?? 24500;
          break;
      }
    }
    t?.showThoughts !== void 0 && t?.thinkingTokenBudget !== "none" && (d.includeThoughts = t.showThoughts);
    let u = { maxOutputTokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, topP: e.modelConfig?.topP ?? this.config.topP, topK: e.modelConfig?.topK ?? this.config.topK, frequencyPenalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, candidateCount: 1, stopSequences: e.modelConfig?.stopSequences ?? this.config.stopSequences, responseMimeType: "text/plain", ...Object.keys(d).length > 0 ? { thinkingConfig: d } : {} }, m = this.config.safetySettings;
    return [r, { contents: l, tools: p, toolConfig: c, systemInstruction: a, generationConfig: u, safetySettings: m }];
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
          throw new v("Content was blocked due to safety settings", void 0, void 0);
        case "RECITATION":
          throw new v("Content was blocked due to recitation policy", void 0, void 0);
        case "MALFORMED_FUNCTION_CALL":
          throw new v("Function call was malformed and blocked", void 0, void 0);
        case "UNEXPECTED_TOOL_CALL":
          throw new v("Unexpected tool call", void 0, void 0);
        case "FINISH_REASON_UNSPECIFIED":
          throw new v("Finish reason unspecified", void 0, void 0);
        case "BLOCKLIST":
          throw new v("Content was blocked due to blocklist", void 0, void 0);
        case "PROHIBITED_CONTENT":
          throw new v("Content was blocked due to prohibited content", void 0, void 0);
        case "SPII":
          throw new v("Content was blocked due to SPII", void 0, void 0);
        case "OTHER":
          throw new v("Other finish reason", void 0, void 0);
      }
      if (!n.content || !n.content.parts) return o;
      for (let r of n.content.parts) {
        if ("text" in r) {
          "thought" in r && r.thought ? o.thought = r.text : o.content = r.text;
          continue;
        }
        "functionCall" in r && (o.functionCalls = [{ id: B(), type: "function", function: { name: r.functionCall.name, params: r.functionCall.args } }]);
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
var Te = class extends E {
  constructor({ apiKey: e, projectId: t, region: n, endpointId: o, config: r, options: i, models: a, modelInfo: l }) {
    let p = t !== void 0 && n !== void 0, c, d;
    if (p) {
      if (!e) throw new Error("GoogleGemini Vertex API key not set");
      let g;
      o ? g = "endpoints" : g = "publishers/google", c = `https://${n === "global" ? "aiplatform" : `${n}-aiplatform`}.googleapis.com/v1/projects/${t}/locations/${n}/${g}`, d = async () => ({ Authorization: `Bearer ${typeof e == "function" ? await e() : e}` });
    } else {
      if (!e) throw new Error("GoogleGemini AI API key not set");
      c = "https://generativelanguage.googleapis.com/v1beta", d = async () => ({});
    }
    let u = { ...Yo(), ...r }, m = new Xt(u, p, o, e, i);
    l = [...Qt, ...l ?? []];
    let A = (g) => {
      let f = L({ model: g, modelInfo: l, models: a });
      return { functions: true, streaming: true, hasThinkingBudget: f?.hasThinkingBudget ?? false, hasShowThoughts: f?.hasShowThoughts ?? false, functionCot: false };
    };
    super(m, { name: "GoogleGeminiAI", apiURL: c, headers: d, modelInfo: l, defaults: { model: u.model, embedModel: u.embedModel }, options: i, supportFor: A, models: a });
  }
};
var xs = new H();
var we = class {
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
    return this.options?.debug && console.log(xs.red(`Rate limiter: Waiting for ${e - this.currentTokens} tokens`)), await new Promise((t) => setTimeout(t, 100)), this.waitUntilTokensAvailable(e);
  }
  async acquire(e) {
    await this.waitUntilTokensAvailable(e);
  }
};
var nt = ((o) => (o.Llama3_8B = "llama3-8b-8192", o.Llama33_70B = "llama-3.3-70b-versatile", o.Mixtral_8x7B = "mixtral-8x7b-32768", o.Gemma2_9B = "gemma2-9b-it", o))(nt || {});
var Zt = [{ name: "gemma2-9b-it", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.2 }, { name: "llama-3.3-70b-versatile", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.59, completionTokenCostPer1M: 0.79 }, { name: "llama3-8b-8192", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.05, completionTokenCostPer1M: 0.08 }, { name: "mixtral-8x7b-32768", currency: "usd", characterIsToken: true, promptTokenCostPer1M: 0.24, completionTokenCostPer1M: 0.24 }];
var fs = () => structuredClone({ model: "llama-3.3-70b-versatile", ...w() });
var ve = class extends M {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Groq API key not set");
    let i = { ...fs(), ...t }, a = { ...n, streamingUsage: false };
    r = [...Zt, ...r ?? []];
    let l = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false };
    super({ apiKey: e, config: i, options: a, modelInfo: r, apiURL: "https://api.groq.com/openai/v1", models: o, supportFor: l }), super.setName("Groq"), this.setOptions(a);
  }
  setOptions = (e) => {
    let t = this.newRateLimiter(e);
    super.setOptions({ ...e, rateLimiter: t });
  };
  newRateLimiter = (e) => {
    if (e?.rateLimiter) return e.rateLimiter;
    let t = e?.tokensPerMinute ?? 4800, n = new we(t, t / 60, { debug: e?.debug });
    return async (r, i) => {
      let a = i.modelUsage?.tokens?.totalTokens || 0;
      return await n.acquire(a), await r();
    };
  };
};
var en = [];
var tn = ((e) => (e.MetaLlama270BChatHF = "meta-llama/Llama-2-70b-chat-hf", e))(tn || {});
var Ko = () => structuredClone({ model: "meta-llama/Llama-2-70b-chat-hf", ...w() });
var ys = () => structuredClone({ model: "meta-llama/Llama-2-70b-chat-hf", ...F() });
var nn = class {
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
  createChatReq = (e, t) => {
    let n = e.model, o = e.functions ? `Functions:
${JSON.stringify(e.functions, null, 2)}
` : "", r = e.chatPrompt?.map((p) => {
      switch (p.role) {
        case "user":
          return `User: ${p.content}`;
        case "system":
          return `System: ${p.content}`;
        case "function":
          return `Function Result: ${p.result}`;
        case "assistant": {
          let c = p.functionCalls?.map((d) => {
            let u = typeof d.function.params == "string" ? d.function.params : JSON.stringify(d.function.params);
            return `${d.function.name}(${u})`;
          }).join(`
`);
          return c ? `Assistant: ${p.content}
 Functions:
${c}` : `Assistant: ${p.content}`;
        }
        default:
          throw new Error("Unknown role");
      }
    }).join(`
`), i = `${o} ${r}`.trim(), a = { name: "/models" }, l = { model: n, inputs: i, parameters: { max_new_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, repetition_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_p: e.modelConfig?.topP ?? this.config.topP, top_k: e.modelConfig?.topK ?? this.config.topK, return_full_text: this.config.returnFullText, num_return_sequences: this.config.n, do_sample: this.config.doSample, max_time: this.config.maxTime }, options: { use_cache: this.config.useCache, wait_for_model: this.config.waitForModel } };
    return [a, l];
  };
  createChatResp = (e) => ({ results: [{ index: 0, content: e.generated_text }] });
};
var Oe = class extends E {
  constructor({ apiKey: e, config: t, options: n, models: o }) {
    if (!e || e === "") throw new Error("HuggingFace API key not set");
    let r = { ...Ko(), ...t }, i = new nn(r);
    super(i, { name: "HuggingFace", apiURL: "https://api-inference.huggingface.co", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: en, defaults: { model: r.model }, options: n, supportFor: { functions: false, streaming: false }, models: o });
  }
};
var ot = ((l) => (l.Mistral7B = "open-mistral-7b", l.Mistral8x7B = "open-mixtral-8x7b", l.MistralSmall = "mistral-small-latest", l.MistralNemo = "mistral-nemo-latest", l.MistralLarge = "mistral-large-latest", l.Codestral = "codestral-latest", l.OpenCodestralMamba = "open-codestral-mamba", l.OpenMistralNemo = "open-mistral-nemo-latest", l))(ot || {});
var Qo = ((e) => (e.MistralEmbed = "mistral-embed", e))(Qo || {});
var on = [{ name: "open-mistral-7b", currency: "USD", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 0.25 }, { name: "open-mixtral-8x7b", currency: "USD", promptTokenCostPer1M: 0.7, completionTokenCostPer1M: 0.7 }, { name: "mistral-nemo-latest", currency: "USD", promptTokenCostPer1M: 0.15, completionTokenCostPer1M: 0.15 }, { name: "mistral-small-latest", currency: "USD", promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.6 }, { name: "mistral-large-latest", currency: "USD", promptTokenCostPer1M: 2, completionTokenCostPer1M: 6 }, { name: "codestral-latest", currency: "USD", promptTokenCostPer1M: 0.2, completionTokenCostPer1M: 0.6 }, { name: "open-codestral-mamba", currency: "USD", promptTokenCostPer1M: 0.25, completionTokenCostPer1M: 0.25 }, { name: "open-mistral-nemo-latest", currency: "USD", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.3 }];
var rn = () => structuredClone({ model: "mistral-small-latest", ...w(), topP: 1 });
var Is = () => structuredClone({ ...rn(), model: "mistral-large-latest" });
var Se = class extends M {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Mistral API key not set");
    let i = { ...rn(), ...t };
    r = [...on, ...r ?? []];
    let a = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false }, l = (p) => {
      let { max_completion_tokens: c, messages: d, ...u } = p;
      return { ...u, messages: this.updateMessages(d), max_tokens: c };
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
var sn = class {
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
    return { functions: this.config.features?.functions ?? false, streaming: this.config.features?.streaming ?? false };
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
      process.stdout.write(e);
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
var an = class {
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
    return { functions: false, streaming: false };
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
    return e ? e.getLogger() : (t) => {
      process.stdout.write(t);
    };
  }
  setServiceEntry(e, t) {
    this.services.set(e, t);
  }
};
var Xo = () => structuredClone({ ...w(), model: "nous-hermes2", embedModel: "all-minilm" });
var bs = () => structuredClone({ ...F(), model: "nous-hermes2", embedModel: "all-minilm" });
var ke = class extends M {
  constructor({ apiKey: e = "not-set", url: t = "http://localhost:11434/v1", config: n, options: o, models: r }) {
    let i = { ...Xo(), ...n };
    super({ apiKey: e, options: o, config: i, apiURL: t, models: r, modelInfo: [], supportFor: { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false } }), super.setName("Ollama");
  }
};
var Rs = (s3) => ["o1", "o1-mini", "o1-pro", "o3", "o3-mini", "o3-pro", "o4-mini"].includes(s3);
var Me = class {
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
      if (n.type === "audio") return { type: "input_audio", input_audio: { data: n.data, format: n.format ?? "wav" } };
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
      for (let h of e.chatPrompt) if (h.role === "system" && typeof h.content == "string") {
        r = h.content, i = true;
        break;
      }
    }
    let a = r ?? this.config.systemPrompt ?? null, l = e.functions?.map((h) => ({ type: "function", name: h.name, description: h.description, parameters: h.parameters ?? {} })), p = [], c = Rs(n), d = this.config.reasoningSummary;
    t?.showThoughts ? d || (d = "auto") : d = void 0;
    let u = this.config.reasoningEffort;
    if (t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        u = void 0;
        break;
      case "minimal":
        u = "low";
        break;
      case "low":
        u = "medium";
        break;
      case "medium":
      case "high":
      case "highest":
        u = "high";
        break;
    }
    let m = { model: n, input: "", instructions: a, tools: l?.length ? l : void 0, tool_choice: e.functionCall === "none" || e.functionCall === "auto" || e.functionCall === "required" ? e.functionCall : typeof e.functionCall == "object" && e.functionCall.function ? { type: "function", name: e.functionCall.function.name } : void 0, ...c ? { max_output_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens ?? void 0 } : { temperature: e.modelConfig?.temperature ?? this.config.temperature ?? void 0, top_p: e.modelConfig?.topP ?? this.config.topP ?? void 0, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty ?? void 0, frequency_penalty: e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty ?? void 0 }, stream: e.modelConfig?.stream ?? this.config.stream ?? false, background: void 0, include: p.length > 0 ? p : void 0, metadata: void 0, parallel_tool_calls: this.config.parallelToolCalls, previous_response_id: void 0, ...u ? { reasoning: { effort: u, summary: d } } : {}, service_tier: this.config.serviceTier, store: this.config.store, text: void 0, truncation: void 0, user: this.config.user, seed: this.config.seed };
    this.config.user && (m.user = this.config.user), this.config.parallelToolCalls !== void 0 && (m.parallel_tool_calls = this.config.parallelToolCalls), this.config.responseFormat && (m.text = { format: { type: this.config.responseFormat } }), this.config.seed && (m.seed = this.config.seed);
    let A = e.chatPrompt ? this.createResponsesReqInternalInput(e.chatPrompt, i) : [];
    if (A.length > 0) m.input = A;
    else if (e.chatPrompt && e.chatPrompt.length === 1 && e.chatPrompt[0]?.role === "user" && e.chatPrompt[0]?.content && typeof e.chatPrompt[0].content == "string" && !a) m.input = e.chatPrompt[0].content;
    else if (A.length === 0 && !a) throw new Error("Responses API request must have input or instructions.");
    let g = m.reasoning ?? {};
    if (this.config.reasoningEffort && (g = { ...g, effort: this.config.reasoningEffort }), t?.thinkingTokenBudget) switch (t.thinkingTokenBudget) {
      case "none":
        g = {};
        break;
      case "minimal":
        g = { ...g, effort: "low" };
        break;
      case "low":
        g = { ...g, effort: "medium" };
        break;
      case "medium":
      case "high":
      case "highest":
        g = { ...g, effort: "high" };
        break;
    }
    Object.keys(g).length > 0 && g.effort ? m.reasoning = g : m.reasoning = void 0;
    let f = m;
    return this.responsesReqUpdater && (f = this.responsesReqUpdater(f)), [o, f];
  }
  createChatResp(e) {
    let { id: t, output: n, usage: o } = e;
    o && (this.tokensUsed = { promptTokens: o.prompt_tokens, completionTokens: o.completion_tokens, totalTokens: o.total_tokens });
    let r = {};
    for (let i of n ?? []) switch (i.type) {
      case "message":
        r.id = i.id, r.content = ln(i.content, t), r.finishReason = i.status === "completed" ? "stop" : "content_filter";
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
            n.id = t.item.id, n.content = ln(t.item.content, t.item.id);
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
        n.id = t.item_id, n.content = ln([t.part], t.item_id);
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
var ln = (s3, e) => {
  let t = s3.filter((n) => n.type === "refusal");
  if (t.length > 0) {
    let n = t.map((o) => o.refusal).join(`
`);
    throw new v(n, void 0, e);
  }
  return s3.filter((n) => n.type === "output_text").map((n) => n.text).join(`
`);
};
var st = () => ({ model: "gpt-4o", embedModel: "text-embedding-ada-002", temperature: 0.7, topP: 1, stream: true });
var Cs = () => ({ ...st(), model: "gpt-4o", temperature: 0.5 });
var Ts = () => ({ ...st(), model: "gpt-4o", temperature: 0.9 });
var rt = class extends E {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r = [], models: i, responsesReqUpdater: a, supportFor: l = { functions: true, streaming: true } }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    let p = new Me(t, n?.streamingUsage ?? true, a), c = i;
    super(p, { name: "OpenAI", apiURL: o || "https://api.openai.com/v1", headers: async () => ({ Authorization: `Bearer ${e}` }), modelInfo: r, defaults: { model: t.model, embedModel: t.embedModel }, options: n, supportFor: l, models: c });
  }
};
var Ee = class extends rt {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("OpenAI API key not set");
    r = [...Lt, ...r ?? []];
    let i = (a) => {
      let l = L({ model: a, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: l?.hasThinkingBudget ?? false, hasShowThoughts: l?.hasShowThoughts ?? false };
    };
    super({ apiKey: e, config: { ...st(), ...t }, options: n, modelInfo: r, models: o, supportFor: i });
  }
};
var it = ((n) => (n.RekaCore = "reka-core", n.RekaFlash = "reka-flash", n.RekaEdge = "reka-edge", n))(it || {});
var pn = [{ name: "reka-core", currency: "usd", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "reka-flash", currency: "usd", promptTokenCostPer1M: 0.8, completionTokenCostPer1M: 2 }, { name: "reka-edge", currency: "usd", promptTokenCostPer1M: 0.4, completionTokenCostPer1M: 1 }];
var at = () => structuredClone({ model: "reka-core", ...w() });
var ws = () => structuredClone({ ...at(), model: "reka-core" });
var vs = () => structuredClone({ model: "reka-core", ...F() });
var Os = () => ({ ...at(), model: "reka-flash" });
var cn = class {
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
  createChatReq = (e, t) => {
    let n = e.model;
    if (!e.chatPrompt || e.chatPrompt.length === 0) throw new Error("Chat prompt is empty");
    let o = { name: "/chat/completions" }, r = Ss(e), i = e.modelConfig?.frequencyPenalty ?? this.config.frequencyPenalty, a = e.modelConfig?.stream ?? this.config.stream, l = { model: n, messages: r, max_tokens: e.modelConfig?.maxTokens ?? this.config.maxTokens, temperature: e.modelConfig?.temperature ?? this.config.temperature, top_k: e.modelConfig?.n ?? this.config.n, top_p: e.modelConfig?.topP ?? this.config.topP ?? 1, stop: e.modelConfig?.stopSequences ?? this.config.stop, presence_penalty: e.modelConfig?.presencePenalty ?? this.config.presencePenalty, ...i ? { frequency_penalty: i } : {}, ...a ? { stream: true } : {} };
    return [o, l];
  };
  createChatResp = (e) => {
    let { id: t, usage: n, responses: o } = e;
    return this.tokensUsed = n ? { promptTokens: n.input_tokens, completionTokens: n.output_tokens, totalTokens: n.input_tokens + n.output_tokens } : void 0, { results: o.map((i, a) => {
      let l = Zo(i.finish_reason), p;
      return typeof i.message.content == "string" ? p = i.message.content : p = i.message.content.text, { index: a, id: `${t}`, content: p, finishReason: l };
    }), remoteId: t };
  };
  createChatStreamResp = (e) => {
    let { id: t, usage: n, responses: o } = e;
    return this.tokensUsed = n ? { promptTokens: n.input_tokens, completionTokens: n.output_tokens, totalTokens: n.input_tokens + n.output_tokens } : void 0, { results: o.map((i, a) => {
      let l = Zo(i.finish_reason), p;
      return typeof i.chunk.content == "string" ? p = i.chunk.content : p = i.chunk.content.text, { index: a, id: `${t}`, content: p, finishReason: l };
    }) };
  };
};
var Zo = (s3) => {
  switch (s3) {
    case "stop":
      return "stop";
    case "context":
      return "length";
    case "length":
      return "length";
  }
};
function Ss(s3) {
  return s3.chatPrompt.map((e) => {
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
var Pe = class extends E {
  constructor({ apiKey: e, config: t, options: n, apiURL: o, modelInfo: r = pn, models: i }) {
    if (!e || e === "") throw new Error("Reka API key not set");
    let a = { ...at(), ...t }, l = new cn(a);
    super(l, { name: "Reka", apiURL: o || "https://api.reka.ai/v1/chat", headers: async () => ({ "X-Api-Key": e }), modelInfo: r, defaults: { model: a.model }, options: n, supportFor: { functions: true, streaming: true }, models: i });
  }
};
var un = [];
var er = () => structuredClone({ model: "mistralai/Mixtral-8x7B-Instruct-v0.1", ...w() });
var _e = class extends M {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Together API key not set");
    let i = { ...er(), ...t };
    r = [...un, ...r ?? []];
    let a = { functions: true, streaming: true, hasThinkingBudget: false, hasShowThoughts: false };
    super({ apiKey: e, config: i, options: n, apiURL: "https://api.together.xyz/v1", modelInfo: r, models: o, supportFor: a }), super.setName("Together");
  }
};
function dn(s3) {
  let e = (n) => JSON.stringify(n, null, 2);
  if (!s3) throw new Error(`Chat request message item cannot be null or undefined, received: ${e(s3)}`);
  let t = s3?.role;
  if (!t) throw new Error(`Chat request message must have a role, received: ${e(t)}`);
  switch (t) {
    case "system": {
      let n = s3;
      if (!n.content || n.content.trim() === "") throw new Error(`System message content cannot be empty or whitespace-only, received: ${e(n.content)}`);
      break;
    }
    case "user": {
      let n = s3;
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
      let n = s3;
      if (!n.content && !n.functionCalls) throw new Error(`Assistant message must have either content or function calls, received content: ${e(n.content)}, functionCalls: ${e(n.functionCalls)}`);
      if (n.content && typeof n.content != "string") throw new Error(`Assistant message content must be a string, received: ${e(n.content)}`);
      if (n.functionCalls && !Array.isArray(n.functionCalls)) throw new Error(`Assistant message function calls must be an array, received: ${e(n.functionCalls)}`);
      break;
    }
    case "function": {
      let n = s3;
      if (!n.functionId || n.functionId.trim() === "") throw new Error(`Function message must have a non-empty functionId, received: ${e(n.functionId)}`);
      if (n.result === void 0 || n.result === null) throw new Error(`Function message must have a result, received: ${e(n.result)}`);
      if (typeof n.result != "string") throw new Error(`Function message result must be a string, received: ${e(n.result)}`);
      break;
    }
    default:
      throw new Error(`Unsupported message role: ${e(t)}`);
  }
}
function mn(s3) {
  let e = (n) => JSON.stringify(n, null, 2), t = Array.isArray(s3) ? s3 : [s3];
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
var gn = class {
  ai;
  constructor(e) {
    switch (e.name) {
      case "openai":
        this.ai = new Ie(e);
        break;
      case "openai-responses":
        this.ai = new Ee(e);
        break;
      case "azure-openai":
        this.ai = new be(e);
        break;
      case "huggingface":
        this.ai = new Oe(e);
        break;
      case "groq":
        this.ai = new ve(e);
        break;
      case "together":
        this.ai = new _e(e);
        break;
      case "cohere":
        this.ai = new Re(e);
        break;
      case "google-gemini":
        this.ai = new Te(e);
        break;
      case "anthropic":
        this.ai = new he(e);
        break;
      case "mistral":
        this.ai = new Se(e);
        break;
      case "deepseek":
        this.ai = new Ce(e);
        break;
      case "ollama":
        this.ai = new ke(e);
        break;
      case "reka":
        this.ai = new Pe(e);
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
var lt = ((o) => (o.Grok3 = "grok-3", o.Grok3Mini = "grok-3-mini", o.Grok3Fast = "grok-3-fast", o.Grok3MiniFast = "grok-3-mini-fast", o))(lt || {});
var tr = ((e) => (e.GrokEmbedSmall = "grok-embed-small", e))(tr || {});
var An = [{ name: "grok-3", currency: "USD", promptTokenCostPer1M: 3, completionTokenCostPer1M: 15 }, { name: "grok-3-mini", currency: "USD", promptTokenCostPer1M: 0.3, completionTokenCostPer1M: 0.5, hasThinkingBudget: true }, { name: "grok-3-fast", currency: "USD", promptTokenCostPer1M: 5, completionTokenCostPer1M: 25 }, { name: "grok-3-mini-fast", currency: "USD", promptTokenCostPer1M: 0.6, completionTokenCostPer1M: 4, hasThinkingBudget: true }];
var xn = () => structuredClone({ model: "grok-3-mini", ...w() });
var ks = () => structuredClone({ ...xn(), model: "grok-3" });
var hn = class extends M {
  constructor({ apiKey: e, config: t, options: n, models: o, modelInfo: r }) {
    if (!e || e === "") throw new Error("Grok API key not set");
    let i = { ...xn(), ...t };
    r = [...An, ...r ?? []];
    let a = (p) => {
      let c = L({ model: p, modelInfo: r, models: o });
      return { functions: true, streaming: true, hasThinkingBudget: c?.hasThinkingBudget ?? false, hasShowThoughts: c?.hasShowThoughts ?? false };
    }, l = (p) => {
      if (n?.searchParameters) {
        let c = n.searchParameters;
        return { ...p, search_parameters: { mode: c.mode, return_citations: c.returnCitations, from_date: c.fromDate, to_date: c.toDate, max_search_results: c.maxSearchResults, sources: c.sources?.map((d) => ({ type: d.type, country: d.country, excluded_websites: d.excludedWebsites, allowed_websites: d.allowedWebsites, safe_search: d.safeSearch, x_handles: d.xHandles, links: d.links })) } };
      }
      return p;
    };
    super({ apiKey: e, config: i, options: n, apiURL: "https://api.x.ai/v1", modelInfo: r, models: o, supportFor: a, chatReqUpdater: l }), super.setName("Grok");
  }
};
var $ = class {
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
    return this.tracer ? await this.tracer.startActiveSpan("DB Upsert Request", { kind: SpanKind.SERVER, attributes: { [C.DB_SYSTEM]: this.name, [C.DB_OPERATION_NAME]: "upsert", [C.DB_TABLE]: e.table, [C.DB_NAMESPACE]: e.namespace, [C.DB_OPERATION_NAME]: t ? "update" : "insert" } }, async (n) => {
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
    return this.tracer ? await this.tracer.startActiveSpan("DB Batch Upsert Request", { kind: SpanKind.SERVER, attributes: { [C.DB_SYSTEM]: this.name, [C.DB_OPERATION_NAME]: "upsert", [C.DB_TABLE]: e[0].table, [C.DB_NAMESPACE]: e[0].namespace, [C.DB_OPERATION_NAME]: t ? "update" : "insert" } }, async (n) => {
      try {
        return await this._batchUpsert(e, t, { span: n });
      } finally {
        n.end();
      }
    }) : await this._batchUpsert(e, t);
  }
  async query(e) {
    if (!this._query) throw new Error("query() not implemented");
    return this.tracer ? await this.tracer.startActiveSpan("DB Query Request", { kind: SpanKind.SERVER, attributes: { [C.DB_SYSTEM]: this.name, [C.DB_OPERATION_NAME]: "upsert", [C.DB_TABLE]: e.table, [C.DB_NAMESPACE]: e.namespace, [C.DB_OPERATION_NAME]: "query" } }, async (t) => {
      try {
        return await this._query(e, { span: t });
      } finally {
        t.end();
      }
    }) : await this._query(e);
  }
};
var yn = "https://api.cloudflare.com/client/v4/accounts/";
var Fe = class extends $ {
  apiKey;
  accountId;
  constructor({ apiKey: e, accountId: t, fetch: n, tracer: o }) {
    if (!e || !t) throw new Error("Cloudflare credentials not set");
    super({ name: "Cloudflare", fetch: n, tracer: o }), this.apiKey = e, this.accountId = t;
  }
  _upsert = async (e, t, n) => {
    let o = await D({ url: new URL(`${this.accountId}/vectorize/indexes/${e.table}/upsert`, yn), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: n?.span }, { id: e.id, values: e.values, namespace: e.namespace, metadata: e.metadata });
    if (o.errors) throw new Error(`Cloudflare upsert failed: ${o.errors.map(({ message: r }) => r).join(", ")}`);
    return { ids: o.result.ids };
  };
  batchUpsert = async (e, t, n) => {
    if (t) throw new Error("Weaviate does not support batch update");
    if (e.length < 1) throw new Error("Batch request is empty");
    if (!e[0] || !e[0].table) throw new Error("Table name is empty");
    let o = e[0].table, r = await D({ url: new URL(`${this.accountId}/vectorize/indexes/${o}/upsert`, yn), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: n?.span }, e.map((i) => ({ id: i.id, values: i.values, namespace: i.namespace, metadata: i.metadata })));
    if (r.errors) throw new Error(`Cloudflare batch upsert failed: ${r.errors.map(({ message: i }) => i).join(", ")}`);
    return { ids: r.result.ids };
  };
  query = async (e, t) => {
    let n = await D({ url: new URL(`${this.accountId}/vectorize/indexes/${e.table}/query`, yn), headers: { "X-Auth-Key": this.apiKey }, fetch: this.fetch, span: t?.span }, { vector: e.values, topK: e.limit || 10, returnValues: true });
    if (n.errors) throw new Error(`Cloudflare query failed: ${n.errors.map(({ message: r }) => r).join(", ")}`);
    return { matches: n.result.matches.map(({ id: r, score: i, values: a, metadata: l }) => ({ id: r, score: i, values: a, metadata: l })) };
  };
};
var oe = class extends $ {
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
        let a = Ms(e.values, i.values);
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
var Ms = (s3, e) => {
  if (s3.length !== e.length) throw new Error("Vectors must be of the same length.");
  let t = 0, n = 0, o = 0, r = true, i = true, a = new Float64Array(s3), l = new Float64Array(e);
  for (let u = 0; u < a.length; u++) t += a[u] * l[u], n += a[u] * a[u], o += l[u] * l[u], a[u] !== 0 && (r = false), l[u] !== 0 && (i = false);
  if (r || i) return 1;
  let p = Math.sqrt(n), c = Math.sqrt(o);
  return 1 - t / (p * c);
};
var Es = (s3) => ({ namespace: s3.namespace, topK: s3.limit || 10, filter: {}, includeValues: true, includeMetadata: true, vector: s3.values ?? [], id: s3.id });
var Ge = class extends $ {
  apiKey;
  apiURL;
  constructor({ apiKey: e, host: t, fetch: n, tracer: o }) {
    if (!e || e === "") throw new Error("Pinecone API key not set");
    super({ name: "Pinecone", fetch: n, tracer: o }), this.apiKey = e, this.apiURL = t;
  }
  _upsert = async (e, t, n) => (await this._batchUpsert([e], t, n), { ids: [e.id] });
  _batchUpsert = async (e, t, n) => {
    if (e.length === 0) throw new Error("Batch request is empty");
    return await D({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/vectors/upsert", fetch: this.fetch, span: n?.span }, e.map(({ id: o, values: r = [], metadata: i }) => ({ id: o, values: r, metadata: i }))), { ids: e.map(({ id: o }) => o) };
  };
  query = async (e, t) => {
    if (e.text) throw new Error("Pinecone does not support text");
    return { matches: (await D({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/query", fetch: this.fetch, span: t?.span }, Es(e))).matches.map(({ id: r, score: i, values: a, metadata: l }) => ({ id: r, score: i, metadata: l, values: a })) };
  };
};
var De = class extends $ {
  apiKey;
  apiURL;
  constructor({ apiKey: e, host: t, fetch: n, tracer: o }) {
    if (!e || e === "") throw new Error("Weaviate API key not set");
    super({ name: "Weaviate", fetch: n, tracer: o }), this.apiKey = e, this.apiURL = t;
  }
  _upsert = async (e, t, n) => {
    let o = await D({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: `/v1/objects/${e.table}/${e.id}`, put: !!t, fetch: this.fetch, span: n?.span }, { id: e.id, class: e.table, tenant: e.namespace, vector: e.values, properties: e.metadata ?? {} });
    if (o?.result?.errors) throw new Error(`Weaviate upsert failed: ${o.result.errors.error.map(({ message: r }) => r).join(", ")}`);
    return { ids: [o.id] };
  };
  _batchUpsert = async (e, t, n) => {
    if (t) throw new Error("Weaviate does not support batch update");
    if (e.length === 0) throw new Error("Batch request is empty");
    let o = e.map((i) => ({ id: i.id, class: i.table, tenant: i.namespace, vector: i.values, properties: i.metadata ?? {} })), r = await D({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/v1/batch/objects", fetch: this.fetch, span: n?.span }, { objects: o });
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
    let o = await D({ url: this.apiURL, headers: { Authorization: `Bearer ${this.apiKey}` }, name: "/v1/graphql", fetch: this.fetch, span: t?.span }, { query: `{
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
var In = class {
  db;
  constructor(e) {
    switch (e.name) {
      case "weaviate":
        this.db = new De(e);
        break;
      case "pinecone":
        this.db = new Ge(e);
        break;
      case "cloudflare":
        this.db = new Fe(e);
        break;
      case "memory":
        this.db = new oe(e);
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
var bn = "_internal";
var Rn = class {
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

`) : e, o = this.chunker(n).filter((p) => p.length > 0), r = t?.maxWordsPerChunk, i = t?.minWordsPerChunk, a = Ps({ initialChunks: o, minWordsPerChunk: i, maxWordsPerChunk: r }), l = t?.batchSize ?? 10;
      for (let p = 0; p < a.length; p += l) {
        let c = a.slice(p, p + l), u = (await this.ai.embed({ texts: c }, { abortSignal: t?.abortSignal })).embeddings.map((m, A) => ({ id: `chunk_${Date.now() + A}`, table: bn, values: m, metadata: { text: c[A] ?? "" } })).filter((m) => m.metadata?.text && m.metadata?.text.length > 0);
        await this.db.batchUpsert(u);
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
    typeof o[0] == "string" ? r = (await this.ai.embed({ texts: o }, { abortSignal: n })).embeddings.map((p) => this.db.query({ table: bn, values: p })) : r = o.map((l) => this.db.query({ table: bn, values: l }));
    let i = await Promise.all(r), a = [];
    for (let { matches: l } of i) {
      let p = l.filter((u) => u.metadata?.text && u.metadata?.text.length > 0).map(({ score: u, metadata: m }) => ({ score: u, text: m?.text ?? "" })), c = t && t > 1 ? t / 100 : t, d = c ? _s(p, c) : p;
      if (this.reranker) {
        let { rankedItems: u } = await this.reranker.forward(this.ai, { query: o[0], items: d.map((A) => A.text) }), m = u.map((A) => d.find((g) => g.text === A)).filter((A) => A !== void 0);
        a.push(m);
      } else a.push(d);
    }
    return a;
  };
};
var Ps = ({ initialChunks: s3, maxWordsPerChunk: e = 350, minWordsPerChunk: t = 250 }) => {
  let n = [], o = "", r = 0;
  return s3.forEach((i) => {
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
var _s = (s3, e = 0.1) => {
  let t = [...s3].sort((o, r) => o.score - r.score), n = Math.ceil(t.length * e);
  return t.slice(0, n);
};
var Ue = class {
  constructor(e) {
    this.options = e;
  }
  data = [];
  addRequest(e, t) {
    this.data.push(...e.map((n) => {
      let o = structuredClone(n);
      return { role: n.role, chat: [{ index: t, value: o }] };
    })), this.options?.debug && Fs(e, this.options?.debugHideSystemPrompt, this.options?.logger);
  }
  addFunctionResults(e) {
    let t = e.map(({ index: o, ...r }) => ({ index: o, value: structuredClone(r) })), n = this.getLast();
    n?.role === "function" ? n.chat.push(...t) : this.data.push({ role: "function", chat: t }), this.options?.debug && Ds(e, this.options?.logger);
  }
  addResponse(e) {
    let t = e.map(({ index: n, ...o }) => ({ index: n, value: structuredClone(o) }));
    if (this.data.push({ role: "assistant", chat: t }), this.options?.debug) for (let n of e) nr(n, this.options?.logger);
  }
  updateResult({ content: e, name: t, functionCalls: n, delta: o, index: r }) {
    let i = this.data.at(-1), a = (p) => {
      this.options?.debug && (o && typeof o == "string" ? Gs(o, p) : nr({ content: e, name: t, functionCalls: n, index: r }, p));
    };
    if (!i || i.role !== "assistant" || i.role === "assistant" && !i.updatable) {
      this.data.push({ role: "assistant", updatable: true, chat: [{ index: r, value: structuredClone({ content: e, name: t, functionCalls: n }) }] }), a(this.options?.logger);
      return;
    }
    let l = i.chat.find((p) => p.index === r);
    if (!l) {
      i.chat.push({ index: r, value: structuredClone({ content: e, name: t, functionCalls: n }) }), a(this.options?.logger);
      return;
    }
    typeof e == "string" && e.trim() !== "" && (l.value.content = e), typeof t == "string" && t.trim() !== "" && (l.value.name = t), Array.isArray(n) && n.length > 0 && (l.value.functionCalls = n), a(this.options?.logger);
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
var Ne = class {
  constructor(e) {
    this.options = e;
    this.defaultMemory = new Ue(e);
  }
  memories = /* @__PURE__ */ new Map();
  defaultMemory;
  getMemory(e) {
    return e ? (this.memories.has(e) || this.memories.set(e, new Ue(this.options)), this.memories.get(e)) : this.defaultMemory;
  }
  addRequest(e, t) {
    for (let n of e) dn(n);
    this.getMemory(t).addRequest(e, 0);
  }
  addResponse(e, t) {
    mn(e), this.getMemory(t).addResponse(e);
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
    e ? this.memories.set(e, new Ue(this.options)) : this.defaultMemory.reset();
  }
};
function Fs(s3, e, t) {
  Array.isArray(s3) ? ge(s3, e, t) : yo(s3, e, t);
}
function nr(s3, e) {
  Mt(s3, e);
}
function Gs(s3, e) {
  Io(s3, e);
}
function Ds(s3, e) {
  bo(s3, e);
}
var re2 = class extends Error {
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
var pt = async (s3, e) => {
  for (let t of s3) {
    let { fn: n, message: o } = t, r = await n(e);
    if (r !== void 0 && !r) throw o ? new re2({ message: o }) : new Error("Assertion Failed: No message provided for assertion");
  }
};
var Cn = async (s3, e, t, n = false) => {
  if (!e.currField || e.s === -1 || !s3 || s3.length === 0) return;
  let o = s3.filter((i) => i.fieldName === e.currField?.name);
  if (o.length === 0) return;
  let r = t.substring(e.s);
  for (let i of o) {
    let { message: a, fn: l } = i, p = await l(r, n);
    if (p !== void 0 && !p && a) throw new re2({ message: a });
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
var or = (s3) => {
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
  if (t(s3), e.length > 0) {
    let n = ["JSON Schema validation failed:", "", ...e.map((o, r) => {
      let i = [`${r + 1}. Path: ${o.path}`, `   Issue: ${o.issue}`, `   Fix: ${o.fix}`];
      return o.example && i.push(`   Example: ${o.example}`), i.join(`
`);
    }), "", "Please fix these issues and try again."].join(`
`);
    throw new Error(n);
  }
};
var ct = class extends Error {
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
var ut = class extends Error {
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
var dt = class {
  funcList = [];
  constructor(e) {
    this.funcList = e;
  }
  executeFunction = async (e, t, n) => {
    let o;
    typeof t.args == "string" && t.args.length > 0 ? o = JSON.parse(t.args) : o = t.args;
    let r = n ? { sessionId: n.sessionId, traceId: n.traceId, ai: n.ai } : void 0, i;
    return e.parameters ? i = e.func.length === 2 ? await e.func(o, r) : await e.func(o) : i = e.func.length === 1 ? await e.func(r) : await e.func(), (n?.functionResultFormatter ?? k.functionResultFormatter)(i);
  };
  execute = async (e, t) => {
    let n = this.funcList.find((o) => o.name.localeCompare(e.name) === 0);
    if (!n) throw new Error(`Function not found: ${e.name}`);
    if (!n.func) throw new Error(`No handler for function: ${e.name}`);
    try {
      return await this.executeFunction(n, e, t);
    } catch (o) {
      throw o instanceof ct ? new ut(o.getFields(), n, e.id) : o;
    }
  };
};
var Tn = (s3, e) => {
  if (s3.length === 0) return [...e ?? []];
  let t = s3.map((n) => "toFunction" in n ? n.toFunction() : n).flat();
  for (let n of t.filter((o) => o.parameters)) n.parameters && or(n.parameters);
  return [...e ?? [], ...t];
};
var wn = async ({ ai: s3, functionList: e, functionCalls: t, mem: n, sessionId: o, traceId: r, span: i, excludeContentFromTrace: a, index: l, functionResultFormatter: p }) => {
  let c = new dt(e), d = /* @__PURE__ */ new Set(), u = t.map((g) => {
    if (!g.id) throw new Error(`Function ${g.name} did not return an ID`);
    return c.execute(g, { sessionId: o, traceId: r, ai: s3, functionResultFormatter: p }).then((h) => {
      if (d.add(g.name.toLowerCase()), i) {
        let I = { name: g.name };
        a || (I.args = g.args, I.result = h ?? ""), i.addEvent("function.call", I);
      }
      return { result: h ?? "", role: "function", functionId: g.id, index: l };
    }).catch((h) => {
      if (!(h instanceof ut)) throw h;
      let I = h.getFixingInstructions();
      if (i) {
        let x = { name: g.name, message: h.toString() };
        a || (x.args = g.args, x.fixing_instructions = I), i.addEvent("function.error", x);
      }
      return s3.getOptions().debug && s3.getLogger()(`\u274C Function Error Correction:
${I}`, { tags: ["error"] }), { functionId: g.id, isError: true, index: l, result: I, role: "function" };
    });
  }), A = (await Promise.all(u)).filter((g) => g !== void 0);
  return n.addFunctionResults(A, o), A.some((g) => g.isError) && n.addTag("error", o), d;
};
function vn(s3, e, t, n) {
  if (!e || e.length === 0) return;
  if (!s3.getFeatures(n).functions) throw new Error("Functions are not supported by the AI service");
  return e.map((r) => ({ id: r.id, name: r.function.name, args: r.function.params }));
}
function rr(s3, e, t) {
  let n = e;
  return !t && (n === "required" || typeof n == "function") ? { functions: [], functionCall: void 0 } : s3 ? { functions: s3.map((r) => "toFunction" in r ? r.toFunction() : r).flat(), functionCall: n } : { functions: [], functionCall: n };
}
var sr = { enabled: true, enabledCategories: ["generation", "streaming", "functions", "errors", "performance"], maxLabelLength: 100, samplingRate: 1 };
var Le;
var On = (s3) => {
  if (Le) return Le;
  let e = s3 ?? k.meter;
  if (e) return Le = Ns(e), Le;
};
var Us = () => {
  let s3 = [];
  return k.meter || s3.push("Global meter not initialized"), !Le && k.meter && s3.push("Metrics instruments not created despite available meter"), { healthy: s3.length === 0, issues: s3 };
};
var Ns = (s3) => ({ generationLatencyHistogram: s3.createHistogram("ax_gen_generation_duration_ms", { description: "End-to-end duration of AxGen generation requests", unit: "ms" }), generationRequestsCounter: s3.createCounter("ax_gen_generation_requests_total", { description: "Total number of AxGen generation requests" }), generationErrorsCounter: s3.createCounter("ax_gen_generation_errors_total", { description: "Total number of failed AxGen generations" }), multiStepGenerationsCounter: s3.createCounter("ax_gen_multistep_generations_total", { description: "Total number of generations that required multiple steps" }), stepsPerGenerationHistogram: s3.createHistogram("ax_gen_steps_per_generation", { description: "Number of steps taken per generation" }), maxStepsReachedCounter: s3.createCounter("ax_gen_max_steps_reached_total", { description: "Total number of generations that hit max steps limit" }), validationErrorsCounter: s3.createCounter("ax_gen_validation_errors_total", { description: "Total number of validation errors encountered" }), assertionErrorsCounter: s3.createCounter("ax_gen_assertion_errors_total", { description: "Total number of assertion errors encountered" }), errorCorrectionAttemptsHistogram: s3.createHistogram("ax_gen_error_correction_attempts", { description: "Number of error correction attempts per generation" }), errorCorrectionSuccessCounter: s3.createCounter("ax_gen_error_correction_success_total", { description: "Total number of successful error corrections" }), errorCorrectionFailureCounter: s3.createCounter("ax_gen_error_correction_failure_total", { description: "Total number of failed error corrections" }), maxRetriesReachedCounter: s3.createCounter("ax_gen_max_retries_reached_total", { description: "Total number of generations that hit max retries limit" }), functionsEnabledGenerationsCounter: s3.createCounter("ax_gen_functions_enabled_generations_total", { description: "Total number of generations with functions enabled" }), functionCallStepsCounter: s3.createCounter("ax_gen_function_call_steps_total", { description: "Total number of steps that included function calls" }), functionsExecutedPerGenerationHistogram: s3.createHistogram("ax_gen_functions_executed_per_generation", { description: "Number of unique functions executed per generation" }), functionErrorCorrectionCounter: s3.createCounter("ax_gen_function_error_correction_total", { description: "Total number of function-related error corrections" }), fieldProcessorsExecutedCounter: s3.createCounter("ax_gen_field_processors_executed_total", { description: "Total number of field processors executed" }), streamingFieldProcessorsExecutedCounter: s3.createCounter("ax_gen_streaming_field_processors_executed_total", { description: "Total number of streaming field processors executed" }), streamingGenerationsCounter: s3.createCounter("ax_gen_streaming_generations_total", { description: "Total number of streaming generations" }), streamingDeltasEmittedCounter: s3.createCounter("ax_gen_streaming_deltas_emitted_total", { description: "Total number of streaming deltas emitted" }), streamingFinalizationLatencyHistogram: s3.createHistogram("ax_gen_streaming_finalization_duration_ms", { description: "Duration of streaming response finalization", unit: "ms" }), samplesGeneratedHistogram: s3.createHistogram("ax_gen_samples_generated", { description: "Number of samples generated per request" }), resultPickerUsageCounter: s3.createCounter("ax_gen_result_picker_usage_total", { description: "Total number of times result picker was used" }), resultPickerLatencyHistogram: s3.createHistogram("ax_gen_result_picker_duration_ms", { description: "Duration of result picker execution", unit: "ms" }), inputFieldsGauge: s3.createGauge("ax_gen_input_fields", { description: "Number of input fields in signature" }), outputFieldsGauge: s3.createGauge("ax_gen_output_fields", { description: "Number of output fields in signature" }), examplesUsedGauge: s3.createGauge("ax_gen_examples_used", { description: "Number of examples used in generation" }), demosUsedGauge: s3.createGauge("ax_gen_demos_used", { description: "Number of demos used in generation" }), promptRenderLatencyHistogram: s3.createHistogram("ax_gen_prompt_render_duration_ms", { description: "Duration of prompt template rendering", unit: "ms" }), extractionLatencyHistogram: s3.createHistogram("ax_gen_extraction_duration_ms", { description: "Duration of value extraction from responses", unit: "ms" }), assertionLatencyHistogram: s3.createHistogram("ax_gen_assertion_duration_ms", { description: "Duration of assertion checking", unit: "ms" }), stateCreationLatencyHistogram: s3.createHistogram("ax_gen_state_creation_duration_ms", { description: "Duration of state creation for multiple samples", unit: "ms" }), memoryUpdateLatencyHistogram: s3.createHistogram("ax_gen_memory_update_duration_ms", { description: "Duration of memory updates during generation", unit: "ms" }) });
var mt = sr;
var Ls = (s3) => {
  mt = { ...mt, ...s3 };
};
var Bs = () => ({ ...mt });
var W = (s3) => {
  let e = {};
  for (let [t, n] of Object.entries(s3)) if (n != null) {
    let o = String(n), r = mt.maxLabelLength;
    e[t] = o.length > r ? o.substring(0, r) : o;
  }
  return e;
};
var ir = (s3, e, t, n, o, r) => {
  try {
    let i = W({ success: t.toString(), ...n ? { signature: n } : {}, ...o ? { ai_service: o } : {}, ...r ? { model: r } : {} });
    s3.generationLatencyHistogram && s3.generationLatencyHistogram.record(e, i), s3.generationRequestsCounter && s3.generationRequestsCounter.add(1, i), !t && s3.generationErrorsCounter && s3.generationErrorsCounter.add(1, i);
  } catch (i) {
    console.warn("Failed to record generation metric:", i);
  }
};
var gt = (s3, e, t, n) => {
  try {
    let o = W({ ...n ? { signature: n } : {} });
    e > 1 && s3.multiStepGenerationsCounter && s3.multiStepGenerationsCounter.add(1, o), s3.stepsPerGenerationHistogram && s3.stepsPerGenerationHistogram.record(e, o), e >= t && s3.maxStepsReachedCounter && s3.maxStepsReachedCounter.add(1, o);
  } catch (o) {
    console.warn("Failed to record multi-step metric:", o);
  }
};
var Sn = (s3, e, t) => {
  try {
    let n = W({ error_type: e, ...t ? { signature: t } : {} });
    e === "validation" && s3.validationErrorsCounter && s3.validationErrorsCounter.add(1, n), e === "assertion" && s3.assertionErrorsCounter && s3.assertionErrorsCounter.add(1, n);
  } catch (n) {
    console.warn("Failed to record validation error metric:", n);
  }
};
var kn = (s3, e, t, n, o) => {
  try {
    let r = W({ success: t.toString(), ...o ? { signature: o } : {} });
    s3.errorCorrectionAttemptsHistogram && s3.errorCorrectionAttemptsHistogram.record(e, r), t && s3.errorCorrectionSuccessCounter && s3.errorCorrectionSuccessCounter.add(1, r), t || (s3.errorCorrectionFailureCounter && s3.errorCorrectionFailureCounter.add(1, r), e >= n && s3.maxRetriesReachedCounter && s3.maxRetriesReachedCounter.add(1, r));
  } catch (r) {
    console.warn("Failed to record error correction metric:", r);
  }
};
var Mn = (s3, e, t, n, o = false, r) => {
  try {
    let i = W({ functions_enabled: e.toString(), had_function_calls: n.toString(), ...r ? { signature: r } : {} });
    e && s3.functionsEnabledGenerationsCounter && s3.functionsEnabledGenerationsCounter.add(1, i), n && s3.functionCallStepsCounter && s3.functionCallStepsCounter.add(1, i), t > 0 && s3.functionsExecutedPerGenerationHistogram && s3.functionsExecutedPerGenerationHistogram.record(t, i), o && s3.functionErrorCorrectionCounter && s3.functionErrorCorrectionCounter.add(1, i);
  } catch (i) {
    console.warn("Failed to record function calling metric:", i);
  }
};
var ar = (s3, e, t, n) => {
  try {
    let o = W({ ...n ? { signature: n } : {} });
    e > 0 && s3.fieldProcessorsExecutedCounter && s3.fieldProcessorsExecutedCounter.add(e, o), t > 0 && s3.streamingFieldProcessorsExecutedCounter && s3.streamingFieldProcessorsExecutedCounter.add(t, o);
  } catch (o) {
    console.warn("Failed to record field processing metric:", o);
  }
};
var lr = (s3, e, t, n, o) => {
  try {
    let r = W({ is_streaming: e.toString(), ...o ? { signature: o } : {} });
    e && s3.streamingGenerationsCounter && s3.streamingGenerationsCounter.add(1, r), t > 0 && s3.streamingDeltasEmittedCounter && s3.streamingDeltasEmittedCounter.add(t, r), n && s3.streamingFinalizationLatencyHistogram && s3.streamingFinalizationLatencyHistogram.record(n, r);
  } catch (r) {
    console.warn("Failed to record streaming metric:", r);
  }
};
var pr = (s3, e, t, n, o) => {
  try {
    let r = W({ result_picker_used: t.toString(), ...o ? { signature: o } : {} });
    s3.samplesGeneratedHistogram && s3.samplesGeneratedHistogram.record(e, r), t && s3.resultPickerUsageCounter && s3.resultPickerUsageCounter.add(1, r), n && s3.resultPickerLatencyHistogram && s3.resultPickerLatencyHistogram.record(n, r);
  } catch (r) {
    console.warn("Failed to record samples metric:", r);
  }
};
var cr = (s3, e, t, n, o, r) => {
  try {
    let i = W({ ...r ? { signature: r } : {} });
    s3.inputFieldsGauge && s3.inputFieldsGauge.record(e, i), s3.outputFieldsGauge && s3.outputFieldsGauge.record(t, i), s3.examplesUsedGauge && s3.examplesUsedGauge.record(n, i), s3.demosUsedGauge && s3.demosUsedGauge.record(o, i);
  } catch (i) {
    console.warn("Failed to record signature complexity metrics:", i);
  }
};
var At = (s3, e, t, n) => {
  try {
    let o = W({ metric_type: e, ...n ? { signature: n } : {} });
    switch (e) {
      case "prompt_render":
        s3.promptRenderLatencyHistogram && s3.promptRenderLatencyHistogram.record(t, o);
        break;
      case "extraction":
        s3.extractionLatencyHistogram && s3.extractionLatencyHistogram.record(t, o);
        break;
      case "assertion":
        s3.assertionLatencyHistogram && s3.assertionLatencyHistogram.record(t, o);
        break;
      case "state_creation":
        s3.stateCreationLatencyHistogram && s3.stateCreationLatencyHistogram.record(t, o);
        break;
      case "memory_update":
        s3.memoryUpdateLatencyHistogram && s3.memoryUpdateLatencyHistogram.record(t, o);
        break;
    }
  } catch (o) {
    console.warn("Failed to record performance metric:", o);
  }
};
function ur(s3, e) {
  for (let t of e) {
    let n = s3.find((o) => o.id === t.id);
    n ? (typeof t.function.name == "string" && t.function.name.length > 0 && (n.function.name += t.function.name), typeof t.function.params == "string" && t.function.params.length > 0 && (n.function.params += t.function.params), typeof t.function.params == "object" && (n.function.params = t.function.params)) : s3.push(t);
  }
}
import_dayjs.default.extend(import_utc.default);
import_dayjs.default.extend(import_timezone.default);
import_dayjs.default.extend(import_customParseFormat.default);
function dr(s3, e, t = false) {
  try {
    return js(e);
  } catch (n) {
    if (s3.isOptional && !t) return;
    let o = n.message;
    throw new G({ fields: [s3], message: o, value: e });
  }
}
function js(s3) {
  if (!(0, import_dayjs.default)(s3, "YYYY-MM-DD", true).isValid()) throw new Error('Invalid date format. Please provide the date in "YYYY-MM-DD" format.');
  return import_dayjs.default.utc(s3, "YYYY-MM-DD").startOf("day").toDate();
}
function mr(s3, e, t = false) {
  try {
    return Hs(e);
  } catch (n) {
    if (s3.isOptional && !t) return;
    let o = n.message;
    throw new G({ fields: [s3], message: o, value: e });
  }
}
function Hs(s3) {
  let e = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?) (.+)$/, t = s3.match(e);
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
var gr = (s3) => (0, import_dayjs.default)(s3).utc().format("YYYY-MM-DD HH:mm:ss [UTC]");
var En = new H();
var ue = (s3, e, t, n, o, r = 20) => {
  let i = (s3 / e * 100).toFixed(1), a = Math.round(r * s3 / e), l = r - a, p = En.blueBright("\u2588".repeat(a)), c = " ".repeat(l), d = e > 0 ? (t / e * 100).toFixed(1) : "0.0", u = o.includes("Running MIPROv2 optimization") ? "Testing prompt variations" : o.includes("Tuning Prompt") ? "Generating training examples" : o;
  process.stdout.write(`\u2502  ${u}: ${s3}/${e} (${En.yellow(i)}%) |${p}${c}| Success rate: ${En.greenBright(d)}%
`);
};
var ht = (s3, e) => {
  let t = s3.type ?? { name: "string", isArray: false }, n = (a, l) => {
    switch (a) {
      case "class":
        return typeof l == "string";
      case "code":
        return typeof l == "string";
      case "string":
        return typeof l == "string";
      case "number":
        return typeof l == "number";
      case "boolean":
        return typeof l == "boolean";
      case "date":
        return l instanceof Date || typeof l == "string";
      case "datetime":
        return l instanceof Date || typeof l == "string";
      case "json":
        return typeof l == "object" || typeof l == "string";
      default:
        return false;
    }
  }, o = (a) => !(!a || typeof a != "object" || !("mimeType" in a) || !("data" in a));
  if (s3.type?.name === "image") {
    let a;
    if (Array.isArray(e)) {
      for (let l of e) if (!o(l)) {
        a = "object ({ mimeType: string; data: string })";
        break;
      }
    } else o(e) || (a = "object ({ mimeType: string; data: string })");
    if (a) throw new Error(`Validation failed: Expected '${s3.name}' to be type '${a}' instead got '${e}'`);
    return;
  }
  let r = (a) => !(!a || typeof a != "object" || !("data" in a));
  if (s3.type?.name === "audio") {
    let a;
    if (Array.isArray(e)) {
      for (let l of e) if (!r(l)) {
        a = "object ({ data: string; format?: string })";
        break;
      }
    } else r(e) || (a = "object ({ data: string; format?: string })");
    if (a) throw new Error(`Validation failed: Expected '${s3.name}' to be type '${a}' instead got '${e}'`);
    return;
  }
  let i = true;
  if (t.isArray) {
    if (!Array.isArray(e)) i = false;
    else for (let a of e) if (!n(t.name, a)) {
      i = false;
      break;
    }
  } else i = n(t.name, e);
  if (!i) {
    let a = Array.isArray(e) ? "array" : typeof e;
    throw new Error(`Validation failed: Expected '${s3.name}' to be a ${s3.type?.isArray ? "an array of " : ""}${t.name} instead got '${a}' (${JSON.stringify(e)})`);
  }
};
function Ar(s3) {
  let e = {};
  for (let t of s3) {
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
var hr = (s3) => {
  if (!s3.trim()) return [];
  let e = /* @__PURE__ */ new Set(["-", "*", "+"]), t = /^\d+[\s]*[.)\]]\s*/, n = s3.split(`
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
function _n(s3, e) {
  let { index: t, delta: n, version: o } = e, r = s3.find((i) => i.index === t)?.delta;
  if (!r) return s3.push({ index: t, delta: n, version: o }), s3;
  for (let i of Object.keys(n)) {
    let a = r[i], l = n[i];
    a === void 0 && Array.isArray(l) ? r[i] = [...l] : Array.isArray(a) && Array.isArray(l) ? r[i] = [...a, ...l] : (a === void 0 || typeof a == "string") && typeof l == "string" ? r[i] = `${a ?? ""}${l}` : r[i] = l;
  }
  return s3;
}
var Pn = class {
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
var Vs = new Pn(500);
function xr(s3, e, t = 0, n = Vs) {
  if (/^```[a-zA-Z]*\s*$/.test(s3)) return -4;
  if (/^[\s`]*$/.test(s3)) return -3;
  let o = s3.indexOf(e, t);
  if (o !== -1) return o;
  let r = n.get(e) ?? Array.from({ length: e.length }, (a, l) => e.slice(0, l + 1));
  n.get(e) || n.set(e, r);
  let i = -1;
  for (let a = r.length - 1; a >= 0; a--) {
    let l = r[a];
    if (s3.endsWith(l)) {
      i = a;
      break;
    }
  }
  return i >= 0 ? -2 : -1;
}
var fr = (s3) => {
  let e = Math.floor(s3 / 1e3);
  if (e < 60) return `${e}s`;
  let t = Math.floor(e / 60), n = e % 60;
  if (t < 60) return `${t}m ${n}s`;
  let o = Math.floor(t / 60), r = t % 60;
  return `${o}h ${r}m ${n}s`;
};
var Ws = (s3, e, t) => {
  if (s3 === 0) return "calculating...";
  let n = t / s3, o = e - s3, r = n * o;
  return fr(r);
};
var yr = (s3, e, t, n, o, r, i, a, l) => {
  process.stdout.write("\r\x1B[K");
  let p = (e / t * 100).toFixed(1), c = fr(n), d = Ws(e, t, n), u = `Training round ${s3 + 1}/${i.maxRounds}: ${e}/${t} (${p}%) [${c}, ETA: ${d}]`, m = r.totalCalls > 0 ? r.successfulDemos / r.totalCalls * 100 : 0;
  if (u += ` | Success rate: ${m.toFixed(1)}% (${r.successfulDemos}/${r.totalCalls})`, (i.verboseMode || i.debugMode) && (i.costMonitoring && (u += `
  Tokens: ~${r.estimatedTokenUsage.toLocaleString()} total`), u += `
  Batch: ${Math.floor(e / i.batchSize) + 1}/${Math.ceil(t / i.batchSize)}`, i.earlyStoppingPatience > 0 && r.earlyStopping && (u += `
  Best round: ${r.earlyStopping.bestScoreRound + 1}, Patience: ${i.earlyStoppingPatience}`)), i.debugMode) {
    let A = Object.keys(o).map((g) => {
      let f = JSON.stringify(o[g]), h = f.length > 30 ? `${f.substring(0, 30)}...` : f;
      return `${g}: ${h}`;
    }).join(", ");
    if (u += `
  Example: {${A}}`, l) u += `
  ERROR: ${l.message}`;
    else if (a) {
      let g = JSON.stringify(a), f = g.length > 50 ? `${g.substring(0, 50)}...` : g;
      u += `
  Result: ${f}`;
    }
    u += `
  Temperature: ${(0.7 + 1e-3 * e).toFixed(3)}`;
  }
  console.log(u);
};
var Rr = (s3, e, t, n = false) => {
  let o = { extractedFields: [], streamedIndex: {}, s: -1 };
  Fn(s3, e, o, t, { strictMode: n }), Gn(s3, e, o, t);
  for (let r of s3.getOutputFields()) r.isInternal && delete e[r.name];
};
var Js = (s3, e, t) => {
  let n = [];
  for (let o of t) o && !o.isOptional && e[o.name] === void 0 && n.push(o);
  if (n.length > 0) throw new G({ message: `Required ${n.length === 1 ? "field" : "fields"} not found`, fields: n });
};
var Fn = (s3, e, t, n, { strictMode: o, skipEarlyFail: r } = {}) => {
  let i = s3.getOutputFields(), a;
  for (let [l, p] of i.entries()) {
    if (l === t.currFieldIndex && !t.inAssumedField || p.name in e && !(l === t.currFieldIndex && t.inAssumedField)) continue;
    let d = `${(t.extractedFields.length === 0 ? "" : `
`) + p.title}:`, u = xr(n, d, t.s), m = d.length;
    switch (u) {
      case -1:
        if (r) continue;
        if (!o && i.length === 1 && t.currField === void 0) {
          t.inAssumedField = true, a = p, m = 0, u = 0;
          break;
        }
        if (t.currField === void 0 && !p.isOptional) throw new G({ message: "Expected (Required) field not found", fields: [p] });
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
    if (t.currField !== void 0 && t.inAssumedField && (t.inAssumedField = false, t.streamedIndex[t.currField.name] = 0, t.currField = void 0), t.currField) {
      let A = n.substring(t.s, u).trim(), g = Cr(t.currField, A);
      g !== void 0 && (e[t.currField.name] = g), t.prevFields ? t.prevFields?.push({ field: t.currField, s: t.s, e: u }) : t.prevFields = [{ field: t.currField, s: t.s, e: u }];
    }
    t.s = u + m, t.currField = p, t.currFieldIndex = l, t.extractedFields.includes(p) || t.extractedFields.push(p), t.streamedIndex[p.name] === void 0 && (t.streamedIndex[p.name] = 0);
  }
};
var Gn = (s3, e, t, n) => {
  if (t.currField) {
    let o = n.substring(t.s).trim(), r = Cr(t.currField, o);
    r !== void 0 && (e[t.currField.name] = r);
  }
  Js(t, e, s3.getOutputFields());
};
var Ir = (s3, e, t = false) => {
  switch (s3.type?.name) {
    case "code":
      return Tr(e);
    case "string":
      return e;
    case "number": {
      let n = Number(e);
      if (Number.isNaN(n)) {
        if (s3.isOptional && !t) return;
        throw new Error("Invalid number");
      }
      return n;
    }
    case "boolean": {
      if (typeof e == "boolean") return e;
      let n = e.toLowerCase();
      if (n === "true") return true;
      if (n === "false") return false;
      if (s3.isOptional && !t) return;
      throw new Error("Invalid boolean");
    }
    case "date":
      return dr(s3, e, t);
    case "datetime":
      return mr(s3, e, t);
    case "class": {
      let n = e;
      if (s3.type.options && !s3.type.options.includes(n)) {
        if (s3.isOptional) return;
        throw new Error(`Invalid class '${e}', expected one of the following: ${s3.type.options.join(", ")}`);
      }
      return n;
    }
    default:
      return e;
  }
};
function* br(s3, e, t, n, o, r) {
  let { name: i, isInternal: a } = e, { isArray: l, name: p } = e.type ?? {};
  if (a || l || p && p !== "string" && p !== "code") return;
  let c = o.streamedIndex[i] ?? 0, d = c === 0, u = s3.substring(t + c, n);
  if (u.length === 0) return;
  let m = u.replace(/\s+$/, "");
  o.currField?.type?.name === "code" && (m = m.replace(/\s*```\s*$/, ""));
  let A = d ? m.trimStart() : m;
  o.currField?.type?.name === "code" && (A = A.replace(/^[ ]*```[a-zA-Z0-9]*\n\s*/, "")), A.length > 0 && (yield { index: r, delta: { [i]: A } }, o.streamedIndex[i] = c + m.length);
}
function* Dn(s3, e, t, n, o) {
  for (let i of n.prevFields ?? []) {
    let { field: a, s: l, e: p } = i;
    yield* br(e, a, l, p, n, o);
  }
  if (n.prevFields = void 0, !n.currField || n.currField.isInternal) return;
  yield* br(e, n.currField, n.s, e.length, n, o);
  let r = s3.getOutputFields();
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
function Cr(s3, e) {
  if (!e || e === "" || /^(null|undefined)\s*$/i.test(e)) {
    if (s3.isOptional) return;
    throw new G({ message: "Required field is missing", fields: [s3], value: e });
  }
  let t;
  if (s3.type?.name === "json") try {
    let n = Tr(e);
    return t = JSON.parse(n), t;
  } catch (n) {
    throw new G({ message: `Invalid JSON: ${n.message}`, fields: [s3], value: e });
  }
  if (s3.type?.isArray) try {
    try {
      t = JSON.parse(e);
    } catch {
      t = hr(e);
    }
    if (!Array.isArray(t)) throw new Error("Expected an array");
  } catch (n) {
    throw new G({ message: `Invalid Array: ${n.message}`, fields: [s3], value: e });
  }
  try {
    if (Array.isArray(t)) {
      for (let [n, o] of t.entries()) if (o !== void 0) {
        let r = typeof o == "string" ? o.trim() : o;
        t[n] = Ir(s3, r, true);
      }
    } else t = Ir(s3, e);
  } catch (n) {
    throw new G({ message: n.message, fields: [s3], value: e });
  }
  if (!(typeof t == "string" && t === "")) return t;
}
var Tr = (s3) => {
  let t = /```([A-Za-z]*)\n([\s\S]*?)\n```/g.exec(s3);
  return t ? t.length === 3 ? t[2] : t.length === 2 ? t[1] : s3 : s3;
};
async function Un(s3, e, t, n) {
  for (let o of s3) {
    if (e[o.field.name] === void 0) continue;
    let r = o.process, i = await r(e[o.field.name], { sessionId: n, values: e, done: true });
    wr(o.field, t, i, n);
  }
}
async function Nn(s3, e, t, n, o, r, i = false) {
  for (let a of s3) {
    if (t.currField?.name !== a.field.name) continue;
    let l = e.substring(t.s);
    t.currField?.type?.name === "code" && (l = l.replace(/^[ ]*```[a-zA-Z0-9]*\n\s*/, ""), l = l.replace(/\s*```\s*$/, ""));
    let p = a.process, c = await p(l, { sessionId: r, values: o, done: i });
    wr(t.currField, n, c, r);
  }
}
var wr = (s3, e, t, n) => {
  if (t === void 0 || typeof t == "string" && (t === "" || /^(null|undefined)\s*$/i.test(t))) return;
  let o = JSON.stringify(t, (i, a) => typeof a == "bigint" ? Number(a) : a, 2), r = Ys(s3, o);
  e.addRequest([{ role: "user", content: [{ type: "text", text: r }] }], n), e.addTag("processor", n);
};
function Ys(s3, e) {
  let t = s3.type?.name === "code", n = s3.title;
  return t ? `Code in the field "${n}" was executed. The code execution produced the following output: ${e}` : `The field "${n}" was processed. The field contents were transformed into the following output: ${e}`;
}
async function* vr({ res: s3, usage: e, states: t, ...n }) {
  let o = (n.ai.getFeatures().functionCot ?? false) && n.functions !== void 0 && n.functions.length > 0, r = s3.getReader();
  try {
    for (; ; ) {
      let { done: i, value: a } = await r.read();
      if (i) break;
      let l = a;
      l.modelUsage && e.push(l.modelUsage);
      for (let p of l.results) {
        if ((!p.content || p.content === "") && (!p.thought || p.thought === "") && (!p.functionCalls || p.functionCalls.length === 0)) continue;
        let c = t.find((d) => d.index === p.index);
        if (!c) throw new Error(`No state found for result (index: ${p.index})`);
        yield* Ks({ ...n, result: p, skipEarlyFail: o, state: c });
      }
    }
  } finally {
    r.releaseLock();
  }
  for (let i of t) yield* Qs({ ...n, state: i });
}
async function* Ks({ result: s3, mem: e, sessionId: t, strictMode: n, skipEarlyFail: o, state: r, signature: i, streamingFieldProcessors: a, thoughtFieldName: l, streamingAsserts: p, asserts: c }) {
  if (s3.functionCalls && s3.functionCalls.length > 0) ur(r.functionCalls, s3.functionCalls), e.updateResult({ name: s3.name, content: s3.content, functionCalls: r.functionCalls, delta: s3.functionCalls?.[0]?.function?.params, index: s3.index }, t);
  else if (s3.content && s3.content.length > 0) {
    if (s3.thought && s3.thought.length > 0 && (yield { index: s3.index, delta: { [l]: s3.thought } }), r.content += s3.content, e.updateResult({ name: s3.name, content: r.content, delta: s3.content, index: s3.index }, t), Fn(i, r.values, r.xstate, r.content, { strictMode: n, skipEarlyFail: o })) return;
    p.length !== 0 && await Cn(p, r.xstate, r.content), a.length !== 0 && await Nn(a, r.content, r.xstate, e, r.values, t), yield* Dn(i, r.content, r.values, r.xstate, s3.index), await pt(c, r.values);
  } else s3.thought && s3.thought.length > 0 && (r.values[l] = (r.values[l] ?? "") + s3.thought, yield { index: s3.index, delta: { [l]: s3.thought } });
  if (s3.finishReason === "length") throw new Error(`Max tokens reached before completion
Content: ${r.content}`);
}
async function* Qs({ state: s3, signature: e, ai: t, model: n, functions: o, mem: r, sessionId: i, traceId: a, span: l, excludeContentFromTrace: p, streamingAsserts: c, asserts: d, fieldProcessors: u, streamingFieldProcessors: m, functionResultFormatter: A }) {
  let g = vn(t, s3.functionCalls, s3.values, n);
  if (g) {
    if (!o) throw new Error("Functions are not defined");
    let f = await wn({ ai: t, functionList: o, functionCalls: g, mem: r, sessionId: i, traceId: a, span: l, index: s3.index, excludeContentFromTrace: p, functionResultFormatter: A });
    s3.functionsExecuted = /* @__PURE__ */ new Set([...s3.functionsExecuted, ...f]);
  } else Gn(e, s3.values, s3.xstate, s3.content), await Cn(c, s3.xstate, s3.content, true), await pt(d, s3.values), u.length && await Un(u, s3.values, r, i), m.length !== 0 && await Nn(m, s3.content, s3.xstate, r, s3.values, i, true), yield* Dn(e, s3.content, s3.values, s3.xstate, s3.index);
}
async function* Or({ ai: s3, res: e, mem: t, sessionId: n, traceId: o, functions: r, span: i, strictMode: a, states: l, usage: p, excludeContentFromTrace: c, asserts: d, fieldProcessors: u, thoughtFieldName: m, signature: A, functionResultFormatter: g }) {
  let f = e.results ?? [];
  t.addResponse(f, n);
  for (let b of f) {
    let T = l[b.index];
    if (!T) throw new Error(`No state found for result (index: ${b.index})`);
    if (e.modelUsage && p.push(e.modelUsage), b.functionCalls?.length) {
      let O = vn(s3, b.functionCalls, T.values);
      if (O) {
        if (!r) throw new Error("Functions are not defined");
        let J = await wn({ ai: s3, functionList: r, functionCalls: O, mem: t, sessionId: n, traceId: o, span: i, excludeContentFromTrace: c, index: b.index, functionResultFormatter: g });
        T.functionsExecuted = /* @__PURE__ */ new Set([...T.functionsExecuted, ...J]);
      }
    } else b.content && (b.thought && b.thought.length > 0 && (T.values[m] = b.thought), Rr(A, T.values, b.content, a), await pt(d, T.values), u.length && await Un(u, T.values, t, n));
    if (b.finishReason === "length") throw new Error(`Max tokens reached before completion
Content: ${b.content}`);
  }
  let h = l.map((b) => b.values);
  for (let b of h) for (let T of A.getOutputFields()) T.isInternal && delete b[T.name];
  let I = A.getOutputFields(), x = h.map((b, T) => {
    let O = {};
    for (let J of I) J.isInternal || (O[J.name] = b[J.name]);
    return b[m] !== void 0 && (O[m] = b[m]), { index: T, delta: O };
  });
  for (let b of x) yield b;
}
function Sr(s3, e, t, n) {
  let o = s3.getLast(n);
  if (!o) return true;
  for (let [r, i] of t.entries()) {
    let a = e && i.functionsExecuted.has(e);
    if (!o.chat[r]) throw new Error(`No chat message found for result (index: ${r})`);
    let p = o.role === "function", c = o.tags ? o.tags.some((d) => d === "processor") : false;
    if (p && e && a || !(p || c)) return false;
  }
  return true;
}
var Be = class {
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
var Ln = class {
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
    if (k.signatureStrict && ["text", "object", "image", "string", "number", "boolean", "json", "array", "datetime", "date", "time", "type", "class", "input", "output", "data", "value", "result", "response", "request", "item", "element"].includes(e.toLowerCase())) {
      let i = t === "input" ? ["userInput", "questionText", "documentContent", "messageText"] : ["responseText", "analysisResult", "categoryType", "summaryText"];
      throw new R(`Field name "${e}" is too generic`, this.position, this.getErrorContext(), `Use a more descriptive name. Examples: ${i.join(", ")}`);
    }
    let n = /^[a-z][a-zA-Z0-9]*$/, o = /^[a-z]+(_[a-z0-9]+)*$/;
    if (!n.test(e) && !o.test(e)) throw new R(`Invalid field name "${e}"`, this.position, this.getErrorContext(), 'Field names must be in camelCase (e.g., "userInput") or snake_case (e.g., "user_input")');
    if (e.length < 2) throw new R(`Field name "${e}" is too short`, this.position, this.getErrorContext(), "Field names must be at least 2 characters long");
    if (e.length > 50) throw new R(`Field name "${e}" is too long (${e.length} characters)`, this.position, this.getErrorContext(), "Field names should be 50 characters or less");
  }
  parseTypeNotClass() {
    let e = ["string", "number", "boolean", "json", "image", "audio", "datetime", "date", "code"], t = e.find((n) => this.match(n));
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
function kr(s3) {
  return new Ln(s3).parse();
}
var y = class extends Error {
  constructor(t, n, o) {
    super(t);
    this.fieldName = n;
    this.suggestion = o;
    this.name = "AxSignatureValidationError";
  }
};
var P = class s2 {
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
        t = kr(e);
      } catch (n) {
        if (n instanceof Error) {
          let o = "suggestion" in n && typeof n.suggestion == "string" ? n.suggestion : 'Please check the signature format. Example: "userInput:string -> responseText:string"';
          throw new y(`Invalid Signature: ${n.message}`, void 0, o);
        }
        throw new y(`Invalid Signature: ${e}`, void 0, 'Please check the signature format. Example: "userInput:string -> responseText:string"');
      }
      this.description = t.desc, this.inputFields = t.inputs.map((n) => this.parseParsedField(n)), this.outputFields = t.outputs.map((n) => this.parseParsedField(n)), [this.sigHash, this.sigString] = this.updateHash();
    } else if (e instanceof s2) this.description = e.getDescription(), this.inputFields = structuredClone(e.getInputFields()), this.outputFields = structuredClone(e.getOutputFields()), this.sigHash = e.hash(), this.sigString = e.toString(), e.validatedAtHash === this.sigHash && (this.validatedAtHash = this.sigHash);
    else if (typeof e == "object" && e !== null) {
      if (!("inputs" in e) || !("outputs" in e)) throw new y("Invalid signature object: missing inputs or outputs", void 0, 'Signature object must have "inputs" and "outputs" arrays. Example: { inputs: [...], outputs: [...] }');
      if (!Array.isArray(e.inputs) || !Array.isArray(e.outputs)) throw new y("Invalid signature object: inputs and outputs must be arrays", void 0, 'Both "inputs" and "outputs" must be arrays of AxField objects');
      try {
        this.description = e.description, this.inputFields = e.inputs.map((t) => this.parseField(t)), this.outputFields = e.outputs.map((t) => this.parseField(t)), [this.sigHash, this.sigString] = this.updateHash();
      } catch (t) {
        throw t instanceof y ? t : new y(`Failed to create signature from object: ${t instanceof Error ? t.message : "Unknown error"}`, void 0, "Check that all fields in inputs and outputs arrays are valid AxField objects");
      }
    } else throw new y("Invalid signature argument type", void 0, "Signature must be a string, another AxSignature instance, or an object with inputs and outputs arrays");
  }
  parseParsedField = (e) => {
    if (!e.name || e.name.length === 0) throw new y("Field name is required", e.name, 'Every field must have a descriptive name. Example: "userInput", "responseText"');
    let t = this.toTitle(e.name);
    return { name: e.name, title: t, description: "desc" in e ? e.desc : void 0, type: e.type ?? { name: "string", isArray: false }, ..."isInternal" in e ? { isInternal: e.isInternal } : {}, ..."isOptional" in e ? { isOptional: e.isOptional } : {} };
  };
  parseField = (e) => {
    let t = !e.title || e.title.length === 0 ? this.toTitle(e.name) : e.title;
    if (e.type && (!e.type.name || e.type.name.length === 0)) throw new y("Field type name is required", e.name, "Specify a valid type. Available types: string, number, boolean, json, image, audio, date, datetime, class, code");
    return { ...e, title: t };
  };
  setDescription = (e) => {
    if (typeof e != "string") throw new y("Description must be a string", void 0, "Provide a string description for the signature");
    this.description = e, this.invalidateValidationCache(), this.updateHashLight();
  };
  addInputField = (e) => {
    try {
      let t = this.parseField(e);
      Z(t, "input");
      for (let n of this.inputFields) if (n.name === t.name) throw new y(`Duplicate input field name: "${t.name}"`, t.name, "Each field name must be unique within the signature");
      for (let n of this.outputFields) if (n.name === t.name) throw new y(`Field name "${t.name}" appears in both inputs and outputs`, t.name, "Use different names for input and output fields to avoid confusion");
      this.inputFields.push(t), this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof y ? t : new y(`Failed to add input field "${e.name}": ${t instanceof Error ? t.message : "Unknown error"}`, e.name);
    }
  };
  addOutputField = (e) => {
    try {
      let t = this.parseField(e);
      Z(t, "output");
      for (let n of this.outputFields) if (n.name === t.name) throw new y(`Duplicate output field name: "${t.name}"`, t.name, "Each field name must be unique within the signature");
      for (let n of this.inputFields) if (n.name === t.name) throw new y(`Field name "${t.name}" appears in both inputs and outputs`, t.name, "Use different names for input and output fields to avoid confusion");
      this.outputFields.push(t), this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof y ? t : new y(`Failed to add output field "${e.name}": ${t instanceof Error ? t.message : "Unknown error"}`, e.name);
    }
  };
  setInputFields = (e) => {
    if (!Array.isArray(e)) throw new y("Input fields must be an array", void 0, "Provide an array of field objects");
    try {
      let t = e.map((n) => {
        let o = this.parseField(n);
        return Z(o, "input"), o;
      });
      this.inputFields = t, this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof y ? t : new y(`Failed to set input fields: ${t instanceof Error ? t.message : "Unknown error"}`);
    }
  };
  setOutputFields = (e) => {
    if (!Array.isArray(e)) throw new y("Output fields must be an array", void 0, "Provide an array of field objects");
    try {
      let t = e.map((n) => {
        let o = this.parseField(n);
        return Z(o, "output"), o;
      });
      this.outputFields = t, this.invalidateValidationCache(), this.updateHashLight();
    } catch (t) {
      throw t instanceof y ? t : new y(`Failed to set output fields: ${t instanceof Error ? t.message : "Unknown error"}`);
    }
  };
  getInputFields = () => this.inputFields;
  getOutputFields = () => this.outputFields;
  getDescription = () => this.description;
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
        Z(e, "input");
      }), this.getOutputFields().forEach((e) => {
        Z(e, "output");
      }), this.sigHash = je("sha256").update(JSON.stringify(this.inputFields)).update(JSON.stringify(this.outputFields)).digest("hex"), this.sigString = Er(this.description, this.inputFields, this.outputFields), [this.sigHash, this.sigString];
    } catch (e) {
      throw e instanceof y ? e : new y(`Signature validation failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };
  updateHash = () => {
    try {
      return this.getInputFields().forEach((e) => {
        Z(e, "input");
      }), this.getOutputFields().forEach((e) => {
        Z(e, "output");
      }), this.validateSignatureConsistency(), this.sigHash = je("sha256").update(this.description ?? "").update(JSON.stringify(this.inputFields)).update(JSON.stringify(this.outputFields)).digest("hex"), this.sigString = Er(this.description, this.inputFields, this.outputFields), [this.sigHash, this.sigString];
    } catch (e) {
      throw e instanceof y ? e : new y(`Signature validation failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  };
  validateSignatureConsistency() {
    let e = /* @__PURE__ */ new Set();
    for (let n of this.inputFields) {
      if (e.has(n.name)) throw new y(`Duplicate input field name: "${n.name}"`, n.name, "Each field name must be unique within the signature");
      e.add(n.name);
    }
    let t = /* @__PURE__ */ new Set();
    for (let n of this.outputFields) {
      if (t.has(n.name)) throw new y(`Duplicate output field name: "${n.name}"`, n.name, "Each field name must be unique within the signature");
      t.add(n.name);
    }
    for (let n of this.outputFields) if (e.has(n.name)) throw new y(`Field name "${n.name}" appears in both inputs and outputs`, n.name, "Use different names for input and output fields to avoid confusion");
    if (this.inputFields.length === 0) throw new y("Signature must have at least one input field", void 0, 'Add an input field. Example: "userInput:string -> ..."');
    if (this.outputFields.length === 0) throw new y("Signature must have at least one output field", void 0, 'Add an output field. Example: "... -> responseText:string"');
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
function Mr(s3) {
  let e = s3.name;
  return s3.isOptional && (e += "?"), s3.isInternal && (e += "!"), s3.type && (e += `:${s3.type.name}`, s3.type.isArray && (e += "[]"), s3.type.name === "class" && s3.type.options && (e += ` "${s3.type.options.join(" | ")}"`)), s3.description && s3.type?.name !== "class" && (e += ` "${s3.description}"`), e;
}
function Er(s3, e, t) {
  let n = s3 ? `"${s3}" ` : "", o = e.map(Mr).join(", "), r = t.map(Mr).join(", ");
  return `${n}${o} -> ${r}`;
}
function Xs(s3) {
  let e = /^[a-z][a-zA-Z0-9]*$/, t = /^[a-z]+(_[a-z0-9]+)*$/;
  return e.test(s3) || t.test(s3);
}
function Z(s3, e) {
  if (!s3.name || s3.name.length === 0) throw new y("Field name cannot be blank", s3.name, "Every field must have a descriptive name");
  if (!Xs(s3.name)) throw new y(`Invalid field name '${s3.name}' - must be camelCase or snake_case`, s3.name, 'Use camelCase (e.g., "userInput") or snake_case (e.g., "user_input")');
  if (k.signatureStrict && ["text", "object", "image", "string", "number", "boolean", "json", "array", "datetime", "date", "time", "type", "class", "input", "output", "data", "value", "result", "response", "request", "item", "element"].includes(s3.name.toLowerCase())) {
    let n = e === "input" ? ["userInput", "questionText", "documentContent", "messageText", "queryString"] : ["responseText", "analysisResult", "categoryType", "summaryText", "outputData"];
    throw new y(`Field name '${s3.name}' is too generic`, s3.name, `Use a more descriptive name. Examples for ${e} fields: ${n.join(", ")}`);
  }
  if (s3.name.length < 2) throw new y(`Field name '${s3.name}' is too short`, s3.name, "Field names must be at least 2 characters long");
  if (s3.name.length > 50) throw new y(`Field name '${s3.name}' is too long (${s3.name.length} characters)`, s3.name, "Field names should be 50 characters or less");
  s3.type && Zs(s3, e);
}
function Zs(s3, e) {
  if (!s3.type) return;
  let { type: t } = s3;
  if (t.name === "image" || t.name === "audio") {
    if (e === "output") throw new y(`${t.name} type is not supported in output fields`, s3.name, `${t.name} types can only be used in input fields`);
    if (t.isArray) throw new y(`Arrays of ${t.name} are not supported`, s3.name, `Use a single ${t.name} type instead`);
  }
  if (t.name === "class") {
    if (e === "input") throw new y("Class type is not supported in input fields", s3.name, 'Class types are only allowed on output fields. Use "string" type for input classifications');
    if (!t.options || t.options.length === 0) throw new y("Class type requires options", s3.name, 'Provide class options. Example: class "positive, negative, neutral"');
    for (let o of t.options) {
      if (!o || o.trim().length === 0) throw new y("Empty class option found", s3.name, "All class options must be non-empty strings");
      let r = o.trim();
      if (r.includes(",") || r.includes("|")) throw new y(`Invalid class option "${r}"`, s3.name, "Class options cannot contain commas (,) or pipes (|) as they are used to separate options");
    }
    if (new Set(t.options.map((o) => o.trim().toLowerCase())).size !== t.options.length) throw new y("Duplicate class options found", s3.name, "Each class option must be unique (case-insensitive)");
  }
  if (t.name === "code" && t.isArray) throw new y("Arrays of code are not commonly supported", s3.name, "Consider using a single code field or an array of strings instead");
  if (s3.isInternal && e === "input") throw new y("Internal marker (!) is not allowed on input fields", s3.name, "Internal markers are only allowed on output fields");
}
var ee = class {
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
    this.signature = new P(e), t?.description && this.signature.setDescription(t.description), t?.traceLabel && (this.traceLabel = t.traceLabel), this.signature.validate(), this.sigHash = this.signature?.hash(), this.children = new Be(), this.key = { id: this.signature.hash() };
  }
  getSignature() {
    return this.signature;
  }
  register(e) {
    this.key && e.setParentId(this.key.id), this.children.register(e);
  }
  async forward(e, t, n) {
    throw new Error("forward() not implemented");
  }
  async *streamingForward(e, t, n) {
    throw new Error("streamingForward() not implemented");
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
          p !== void 0 && (ht(l, p), a[l.name] = p);
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
    return Ar(e);
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
var ei = `
## Function Call Instructions
- Complete the task, using the functions defined earlier in this prompt. 
- Output fields should only be generated after all functions have been called.
- Use the function results to generate the output fields.`;
var ti = `
## Strict Output Formatting Rules
- Output must strictly follow the defined plain-text \`field name: value\` field format.
- Output field, values must strictly adhere to the specified output field formatting rules.
- No formatting rules should override these **Strict Output Formatting Rules**
- Do not add any text before or after the output fields, just the field name and value.
- Do not use code blocks.`;
var de = class {
  sig;
  fieldTemplates;
  task;
  thoughtFieldName;
  functions;
  constructor(e, t, n) {
    this.sig = e, this.fieldTemplates = n, this.thoughtFieldName = t?.thoughtFieldName ?? "thought", this.functions = t?.functions;
    let o = [], r = Pr(this.sig.getInputFields()), i = Pr(this.sig.getOutputFields());
    o.push(`You will be provided with the following fields: ${r}. Your task is to generate new fields: ${i}.`);
    let l = this.functions?.map((u) => "toFunction" in u ? u.toFunction() : u)?.flat()?.map((u) => `- \`${u.name}\`: ${xt(u.description)}`).join(`
`);
    l && l.length > 0 && o.push(`## Available Functions
${l}`);
    let p = ni(this.sig.getInputFields());
    o.push(`## Input Fields
${p}`);
    let c = oi(this.sig.getOutputFields());
    o.push(`## Output Fields
${c}`), l && l.length > 0 && o.push(ei.trim()), o.push(ti.trim());
    let d = this.sig.getDescription();
    if (d) {
      let u = xt(d);
      o.push(u);
    }
    this.task = { type: "text", text: o.join(`

`) };
  }
  renderSingleValueUserContent = (e, t, n, o) => {
    let r = this.renderInputFields(e), a = (o ? r : [...t, ...n, ...r]).filter((l) => l !== void 0);
    return a.every((l) => l.type === "text") ? a.map((l) => l.text).join(`
`) : a.reduce(_r(`
`), []);
  };
  render = (e, { examples: t, demos: n }) => {
    let o = t ? [{ type: "text", text: `

## Examples
` }, ...this.renderExamples(t)] : [], r = n ? this.renderDemos(n) : [], i = o.every((u) => u.type === "text"), a = r.every((u) => u.type === "text"), l = i && a, p = this.task.text;
    if (l) {
      let u = [{ type: "text", text: p }, ...o, ...r];
      u.reduce(_r(""), []), u?.[0] && (p = u[0].text);
    }
    let c = { role: "system", content: p };
    if (Array.isArray(e)) {
      let u = [], m = e, A = true;
      for (let g of m) {
        let f;
        if (A ? (f = this.renderSingleValueUserContent(g.values, o, r, l), A = false) : f = this.renderSingleValueUserContent(g.values, [], [], false), g.role === "user") {
          u.push({ role: "user", content: f });
          continue;
        }
        if (g.role !== "assistant") throw new Error("Invalid message role");
        if (typeof f != "string") throw new Error("Assistant message cannot contain non-text content like images, files,etc");
        u.push({ role: "assistant", content: f });
      }
      return [c, ...u];
    }
    let d = this.renderSingleValueUserContent(e, o, r, l);
    return [c, { role: "user", content: d }];
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
  renderDemos = (e) => {
    let t = [], n = this.sig.getInputFields(), o = this.sig.getOutputFields(), r = { isExample: true };
    for (let i of e) {
      let a = n.map((c) => this.renderInField(c, i, { ...r, isInputField: true })).filter((c) => c !== void 0).flat(), l = o.map((c) => this.renderInField(c, i, { ...r, isInputField: false })).filter((c) => c !== void 0).flat();
      [...a, ...l].slice(0, -1).forEach((c) => {
        "text" in c && (c.text = `${c.text}
`), t.push(c);
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
    if (si(e, o, n)) return;
    e.type && ht(e, o);
    let r = ri(e, o);
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
    let n = [e.title, ": "];
    return Array.isArray(t) ? (n.push(`
`), n.push(t.map((o) => `- ${o}`).join(`
`))) : n.push(t), [{ type: "text", text: n.join("") }];
  };
};
var Pr = (s3) => s3.map((e) => `\`${e.title}\``).join(", ");
var ni = (s3) => s3.map((t) => {
  let n = t.title, o = t.type?.name ? Fr(t.type) : "string", r = t.isOptional ? `This optional ${o} field may be omitted` : `A ${o} field`, i = t.description ? ` ${xt(t.description)}` : "";
  return `${n}: (${r})${i}`.trim();
}).join(`
`);
var oi = (s3) => s3.map((t) => {
  let n = t.title, o = t.type?.name ? Fr(t.type) : "string", r = t.isOptional ? `Only include this ${o} field if its value is available` : `This ${o} field must be included`, i = "";
  return t.description && t.description.length > 0 && (i = ` ${t.type?.name === "class" ? t.description : xt(t.description)}`), t.type?.options && t.type.options.length > 0 && (i.length > 0 && (i += ". "), i += `Allowed values: ${t.type.options.join(", ")}`), `${n}: (${r})${i}`.trim();
}).join(`
`);
var ri = (s3, e) => {
  if (s3.type?.name === "date" && e instanceof Date) {
    let t = e.toISOString();
    return t.slice(0, t.indexOf("T"));
  }
  return s3.type?.name === "datetime" && e instanceof Date ? gr(e) : s3.type?.name === "image" && typeof e == "object" || s3.type?.name === "audio" && typeof e == "object" || typeof e == "string" ? e : JSON.stringify(e, null, 2);
};
var Fr = (s3) => {
  let e = (() => {
    switch (s3?.name) {
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
      default:
        return "string";
    }
  })();
  return s3?.isArray ? `json array of ${e} items` : e;
};
function _r(s3) {
  return (e, t) => {
    if (t.type === "text") {
      let n = e.length > 0 ? e[e.length - 1] : null;
      n && n.type === "text" ? n.text += s3 + t.text : e.push(t);
    } else e.push(t);
    return e;
  };
}
var si = (s3, e, t) => {
  if (typeof e == "boolean") return false;
  if (!e || (Array.isArray(e) || typeof e == "string") && e.length === 0) {
    if (t?.isExample || s3.isOptional || s3.isInternal) return true;
    let n = t?.isInputField !== false ? "input" : "output";
    throw new Error(`Value for ${n} field '${s3.name}' is required.`);
  }
  return false;
};
function xt(s3) {
  let e = s3.trim();
  return e.length > 0 ? `${e.charAt(0).toUpperCase()}${e.slice(1)}${e.endsWith(".") ? "" : "."}` : "";
}
function ii(s3, e) {
  let t = s3.history(0, e), n = t.some((r) => r.role === "function");
  return t.some((r) => r.role === "assistant" && "functionCalls" in r && Array.isArray(r.functionCalls) && r.functionCalls.length > 0) && n;
}
function ai(s3, e) {
  let t = s3.history(0, e), n = [], o = t.filter((i) => i.role === "assistant" && "functionCalls" in i && Array.isArray(i.functionCalls) && i.functionCalls.length > 0), r = t.filter((i) => i.role === "function");
  for (let i of o) if ("functionCalls" in i && i.functionCalls) for (let a of i.functionCalls) {
    let l = r.find((p) => "functionId" in p && p.functionId === a.id);
    l && "result" in l && "functionId" in l && n.push({ index: n.length, functionName: a.function.name, functionId: a.id, args: a.function.params || "", result: String(l.result), isError: "isError" in l ? !!l.isError : false });
  }
  return n;
}
async function ft(s3, e, t, n) {
  if (!e?.resultPicker || s3.length <= 1) return 0;
  let o = e.resultPicker;
  if ((t ? ii(t, n) : false) && t) {
    let l = ai(t, n), p = await o({ type: "function", results: l });
    if (p < 0 || p >= l.length) throw new Error(`Result picker returned invalid index: ${p}. Must be between 0 and ${l.length - 1}`);
    return p;
  }
  let i = s3.map((l, p) => ({ index: p, sample: l.delta })), a = await o({ type: "fields", results: i });
  if (a < 0 || a >= s3.length) throw new Error(`Result picker returned invalid index: ${a}. Must be between 0 and ${s3.length - 1}`);
  return a;
}
async function Gr(s3, e, t) {
  let n = s3?.getLast(e);
  if (!n || n.role !== "assistant" || n.chat.length <= 1) return 0;
  let o = n.chat.map((i) => ({ version: 0, index: i.index, delta: i.value }));
  return await ft(o, t, s3, e);
}
function Dr(s3, e, t, n, o) {
  if (s3.addRequest([{ role: "user", content: n.renderExtraFields(e) }], o), s3.addTag("error", o), t.getOptions().debug) {
    let r = e.map((a) => `- ${a.title}: ${a.description}`).join(`
`);
    t.getLogger()(`\u274C Error Correction:
${r}`, { tags: ["error"] });
  }
}
var S = class extends ee {
  promptTemplate;
  asserts;
  streamingAsserts;
  options;
  functions;
  fieldProcessors = [];
  streamingFieldProcessors = [];
  excludeContentFromTrace = false;
  thoughtFieldName;
  constructor(e, t) {
    super(e, { description: t?.description, traceLabel: t?.traceLabel }), this.options = t, this.thoughtFieldName = t?.thoughtFieldName ?? "thought";
    let n = { functions: t?.functions, thoughtFieldName: this.thoughtFieldName };
    this.promptTemplate = new (t?.promptTemplate ?? de)(this.signature, n), this.asserts = this.options?.asserts ?? [], this.streamingAsserts = this.options?.streamingAsserts ?? [], this.excludeContentFromTrace = t?.excludeContentFromTrace ?? false, this.usage = [], t?.functions && (this.functions = Tn(t.functions));
  }
  getSignatureName() {
    return this.signature.getDescription() || "unknown_signature";
  }
  getMetricsInstruments() {
    return On();
  }
  updateMeter(e) {
    On(e);
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
  async forwardSendRequest({ ai: e, mem: t, options: n, traceContext: o, functions: r, functionCall: i }) {
    let { sessionId: a, traceId: l, model: p, rateLimiter: c, stream: d, thinkingTokenBudget: u, showThoughts: m } = n ?? {}, A = await Gr(t, a, { resultPicker: n?.resultPicker }), g = t?.history(A, a) ?? [];
    if (g.length === 0) throw new Error("No chat prompt found");
    let f = { ...n?.modelConfig, ...n?.sampleCount ? { n: n.sampleCount } : {}, ...n?.sampleCount && n?.modelConfig?.temperature === 1 ? { temperature: 0.8 } : {} };
    return await e.chat({ chatPrompt: g, functions: r, functionCall: i, modelConfig: f, model: p }, { sessionId: a, traceId: l, rateLimiter: c, stream: d, debug: false, thinkingTokenBudget: u, showThoughts: m, traceContext: o, abortSignal: n?.abortSignal });
  }
  async *forwardCore({ ai: e, mem: t, options: n, firstStep: o, span: r, traceContext: i }) {
    let { sessionId: a, traceId: l, functions: p } = n ?? {}, c = n?.functionCall ?? this.options?.functionCall, d = n?.strictMode ?? false, u = n.model, m = this.createStates(n.sampleCount ?? 1), A = this.usage, { functions: g, functionCall: f } = rr(p, c, o), h = await this.forwardSendRequest({ ai: e, mem: t, options: n, traceContext: i, functions: g, functionCall: f });
    h instanceof ReadableStream ? yield* vr({ ai: e, model: u, res: h, mem: t, traceId: l, sessionId: a, functions: g, strictMode: d, span: r, states: m, usage: A, asserts: this.asserts, streamingAsserts: this.streamingAsserts, fieldProcessors: this.fieldProcessors, streamingFieldProcessors: this.streamingFieldProcessors, thoughtFieldName: this.thoughtFieldName, excludeContentFromTrace: this.excludeContentFromTrace, signature: this.signature, functionResultFormatter: n?.functionResultFormatter ?? this.options?.functionResultFormatter }) : yield* Or({ ai: e, model: u, res: h, mem: t, traceId: l, sessionId: a, functions: g, span: r, strictMode: d, states: m, usage: A, asserts: this.asserts, fieldProcessors: this.fieldProcessors, thoughtFieldName: this.thoughtFieldName, excludeContentFromTrace: this.excludeContentFromTrace, signature: this.signature, functionResultFormatter: n?.functionResultFormatter ?? this.options?.functionResultFormatter }), this.getLogger(e, n)?.("", { tags: ["responseEnd"] });
  }
  async *_forward2(e, t, n, o, r, i) {
    let a = (o?.stopFunction ?? this.options?.stopFunction)?.toLowerCase(), l = o.maxRetries ?? this.options?.maxRetries ?? 10, p = o.maxSteps ?? this.options?.maxSteps ?? 10, c = o.debugHideSystemPrompt, d = { debug: this.isDebug(e, o), debugHideSystemPrompt: c, logger: this.getLogger(e, o) }, u = o.mem ?? this.options?.mem ?? new Ne(d), m;
    if (o?.functions && o.functions.length > 0) {
      let b = this.options?.promptTemplate ?? de, T = { functions: o.functions, thoughtFieldName: this.thoughtFieldName };
      this.promptTemplate = new b(this.signature, T);
    }
    let A, g = performance.now();
    Array.isArray(t) ? (Dt(t), A = this.promptTemplate.render(t, { examples: this.examples, demos: this.demos })) : A = this.promptTemplate.render(t, { examples: this.examples, demos: this.demos });
    let f = performance.now() - g, h = this.getMetricsInstruments();
    h && At(h, "prompt_render", f, this.getSignatureName());
    let I = performance.now();
    u.addRequest(A, o.sessionId);
    let x = performance.now() - I;
    h && At(h, "memory_update", x, this.getSignatureName());
    e: for (let b = 0; b < p; b++) {
      let T = b === 0;
      for (let J = 0; J < l; J++) try {
        let N = this.forwardCore({ options: o, ai: e, mem: u, firstStep: T, span: r, traceContext: i });
        for await (let _ of N) _ !== void 0 && (yield { version: J, index: _.index, delta: _.delta });
        if (Sr(u, a, n, o?.sessionId)) {
          let _ = this.getMetricsInstruments();
          _ && gt(_, b + 1, p, this.getSignatureName());
          continue e;
        }
        let z = this.getMetricsInstruments();
        if (z) {
          gt(z, b + 1, p, this.getSignatureName());
          let _ = /* @__PURE__ */ new Set();
          n.forEach((Tt) => {
            Tt.functionsExecuted.forEach((Wr) => _.add(Wr));
          }), _.size > 0 && Mn(z, true, _.size, true, false, this.getSignatureName()), ar(z, this.fieldProcessors.length, this.streamingFieldProcessors.length, this.getSignatureName());
        }
        return;
      } catch (N) {
        let te;
        if (r?.recordException(N), N instanceof G) {
          te = N.getFixingInstructions(), m = N;
          let z = this.getMetricsInstruments();
          z && Sn(z, "validation", this.getSignatureName()), r && r.addEvent("validation.error", { message: N.toString(), fixing_instructions: te?.map((_) => _.title).join(", ") ?? "" });
        } else if (N instanceof re2) {
          let z = N;
          te = z.getFixingInstructions(), m = N;
          let _ = this.getMetricsInstruments();
          _ && Sn(_, "assertion", this.getSignatureName()), r && r.addEvent("assertion.error", { message: z.toString(), fixing_instructions: te?.map((Tt) => Tt.title).join(", ") ?? "" });
        } else if (!(N instanceof Y)) throw Bn(N, e, this.signature);
        te && Dr(u, te, e, this.promptTemplate, o.sessionId);
      }
      let O = this.getMetricsInstruments();
      throw O && kn(O, l, false, l, this.getSignatureName()), Bn(new Error(`Unable to fix validation error: ${m?.toString()}`), e, this.signature);
    }
    throw h && gt(h, p, p, this.getSignatureName()), Bn(new Error(`Max steps reached: ${p}`), e, this.signature);
  }
  async *_forward1(e, t, n) {
    let o = performance.now(), r = this.createStates(n.sampleCount ?? 1), i = performance.now() - o, a = this.getMetricsInstruments();
    a && At(a, "state_creation", i, this.getSignatureName());
    let l = n?.tracer ?? this.options?.tracer ?? e.getOptions().tracer, p = this.functions;
    if (n?.functions && (p = Tn(n.functions, this.functions)), !l) {
      yield* this._forward2(e, t, r, { ...n, functions: p });
      return;
    }
    let c = p?.map((h) => h.name).join(","), d = { signature: JSON.stringify(this.signature.toJSON(), null, 2), ...this.examples ? { examples: JSON.stringify(this.examples, null, 2) } : {}, ...c ? { provided_functions: c } : {}, ...n?.model ? { model: n.model } : {}, ...n?.thinkingTokenBudget ? { thinking_token_budget: n.thinkingTokenBudget } : {}, ...n?.showThoughts ? { show_thoughts: n.showThoughts } : {}, ...n?.maxSteps ? { max_steps: n.maxSteps } : {}, ...n?.maxRetries ? { max_retries: n.maxRetries } : {} }, u = this.traceLabel && n.traceLabel ? `${this.traceLabel} > ${n.traceLabel}` : n.traceLabel ?? this.traceLabel, m = u ? `AxGen > ${u}` : "AxGen", A = l.startSpan(m, { kind: SpanKind.SERVER, attributes: d }), g = context.active(), f = trace.setSpan(g, A);
    try {
      if (this.excludeContentFromTrace || A.addEvent("input", { content: JSON.stringify(t, null, 2) }), yield* this._forward2(e, t, r, { ...n, functions: p }, A, f), !this.excludeContentFromTrace) {
        let h = r.map((x) => x.values), I = h.length === 1 ? h[0] : h;
        A.addEvent("output", { content: JSON.stringify(I, null, 2) });
      }
    } finally {
      A.end();
    }
  }
  async forward(e, t, n) {
    let o = performance.now(), r = this.getSignatureName(), i = n?.stream ?? false, a = false, l = 0, p = false, c = 0, d = false;
    try {
      let u = this.getMetricsInstruments();
      u && cr(u, this.signature.getInputFields().length, this.signature.getOutputFields().length, this.examples?.length ?? 0, this.demos?.length ?? 0, r), p = !!(n?.functions || this.functions);
      let m = this._forward1(e, t, n ?? {}), A = [], g = 0, f = 0;
      for await (let O of m) O.version !== g && (A = []), g = O.version, A = _n(A, O), f++;
      l = g;
      let h = performance.now();
      d = !!n?.resultPicker;
      let I = await ft(A, { resultPicker: n?.resultPicker }, n?.mem, n?.sessionId), x = performance.now() - h, T = A[I]?.delta ?? {};
      return this.trace = { ...t, ...T }, a = true, u && (pr(u, A.length, d, d ? x : void 0, r), lr(u, i, f, void 0, r)), T;
    } catch (u) {
      throw a = false, u;
    } finally {
      let u = performance.now() - o, m = this.getMetricsInstruments();
      m && (ir(m, u, a, r, e.getName(), n?.model), p && Mn(m, p, c, c > 0, false, r), l > 0 && kn(m, l, a, n?.maxRetries ?? 10, r));
    }
  }
  async *streamingForward(e, t, n) {
    if (!n?.resultPicker) {
      yield* this._forward1(e, t, { ...n, stream: true });
      return;
    }
    let o = this._forward1(e, t, { ...n, stream: true }), r = [], i = 0;
    for await (let p of o) p.version !== i && (r = []), i = p.version, r = _n(r, p);
    let a = await ft(r, { resultPicker: n?.resultPicker }, n?.mem, n?.sessionId), l = r[a];
    l && (yield { version: i, index: a, delta: l.delta });
  }
  setExamples(e, t) {
    super.setExamples(e, t);
  }
  isDebug(e, t) {
    return t?.debug ?? this.options?.debug ?? e.getOptions().debug ?? false;
  }
  getLogger(e, t) {
    return t?.logger ?? this.options?.logger ?? e.getLogger();
  }
};
var yt = class extends Error {
  details;
  constructor(e, t, n) {
    super(e), this.name = "AxGenerateError", this.details = t, n?.cause && (this.cause = n.cause);
  }
};
function Bn(s3, e, t) {
  let n = s3 instanceof Error ? s3 : new Error(String(s3)), o = e.getLastUsedChatModel(), r = e.getLastUsedModelConfig(), i = { model: o, maxTokens: r?.maxTokens, streaming: r?.stream ?? false, signature: { input: t.getInputFields(), output: t.getOutputFields(), description: t.getDescription() } };
  return new yt("Generate failed", i, { cause: n });
}
var ui = (s3) => s3.replace(/^\W+|\W+$/g, "");
var di = (s3, e) => {
  let t = s3.search(e);
  if (t === -1) return [s3];
  let n = s3.match(e);
  if (!n) throw new Error("Match failed unexpectedly.");
  let o = s3.substring(0, t), r = s3.substring(t + n[0].length);
  return [o, r];
};
var mi = (s3) => {
  let e = /* @__PURE__ */ new Set(), t = [];
  for (let n of s3) e.has(n) || (e.add(n), t.push(n));
  return t;
};
var gi = (s3) => {
  let e = s3.match(/^(\d+)[.,\s]+(.*)$/);
  if (!e || e.length < 3) throw new Error('line must start with a number, a dot and then text. e.g. "1. hello"');
  let t = Number.parseInt(e[1], 10), n = e[2].trim();
  return { id: t, text: n };
};
var Ai = (s3) => {
  let e = s3.match(/^(\d+)[.,\s]+(.*)$/);
  return e && e[2] !== void 0 ? e[2].trim() : s3;
};
var hi = (s3, e) => {
  let t = [];
  for (let n = 0; n < s3.length; n += e) t.push(s3.slice(n, n + e));
  return t;
};
var $e = { trimNonAlphaNum: ui, splitIntoTwo: di, dedup: mi, extractIdAndText: gi, extractIndexPrefixedText: Ai, batchArray: hi };
var $n = class extends S {
  constructor(e) {
    super(`"You are a re-ranker assistant tasked with evaluating a set of content items in relation to a specific question. Your role involves critically analyzing each content item to determine its relevance to the question and re-ranking them accordingly. This process includes assigning a relevance score from 0 to 10 to each content item based on how well it answers the question, its coverage of the topic, and the reliability of its information. This re-ranked list should start with the content item that is most relevant to the question and end with the least relevant. Output only the list."
    query: string, items: string[] -> rankedItems: string[] "list of id, 5-words Rationale, relevance score"`, e);
  }
  forward = async (e, t, n) => {
    let { rankedItems: o } = await super.forward(e, t, n), r = o.map((a) => {
      let { id: l } = $e.extractIdAndText(a);
      return l;
    });
    return { rankedItems: t.items.map((a, l) => {
      let p = r[l];
      return p !== void 0 ? t.items[p] : void 0;
    }).filter((a) => a !== void 0) };
  };
};
var qn = class {
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
var Ur = new H();
var zn = class {
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
var jn = class {
  ai;
  db;
  debug;
  constructor(e) {
    this.db = new oe(), this.ai = e;
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
    this.debug && console.log(`${Ur.whiteBright(`query: ${e}`)}
${Ur.greenBright(JSON.stringify(r.map((a) => `${a.id}, ${a.score}`)))}`);
    let i = r.at(0);
    return i ? i.id : "";
  }
  setOptions(e) {
    typeof e.debug == "boolean" && (this.debug = e.debug);
  }
};
var Nr = /* @__PURE__ */ new Set(["0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "don't", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadn't", "happens", "hardly", "has", "hasn", "hasnt", "hasn't", "have", "haven", "haven't", "having", "he", "hed", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "here's", "hereupon", "hers", "herself", "hes", "he's", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "how's", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "i'd", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "i'll", "im", "i'm", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isn't", "it", "itd", "it'd", "it'll", "its", "it's", "itself", "iv", "i've", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "let's", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightn't", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustn't", "my", "myself", "model", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "needn't", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shan't", "she", "shed", "she'd", "she'll", "shes", "she's", "should", "shouldn", "shouldn't", "should've", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "there's", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'd", "they'll", "theyre", "they're", "they've", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "t's", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasn't", "way", "we", "wed", "we'd", "welcome", "well", "we'll", "well-b", "went", "were", "we're", "weren", "werent", "weren't", "we've", "what", "whatever", "what'll", "whats", "what's", "when", "whence", "whenever", "when's", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "where's", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "who's", "whose", "why", "why's", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "won't", "words", "world", "would", "wouldn", "wouldnt", "wouldn't", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "you'd", "you'll", "your", "youre", "you're", "yours", "yourself", "yourselves", "you've", "yr", "ys", "yt", "z", "zero", "zi", "zz", "task"]);
function Lr(s3, e) {
  return s3.filter((t) => !e.has(t));
}
function Br(s3) {
  let e = {};
  for (let t of s3) e[t] = (e[t] || 0) + 1;
  return e;
}
function ie(s3) {
  let e = s3.normalize("NFD");
  return e = e.replace(/\b(a|an|the)\b/g, " "), e = e.split(/\s+/).join(" "), e = e.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, ""), e.toLowerCase();
}
function xi(s3, e) {
  return ie(s3) === ie(e) ? 1 : 0;
}
function fi(s3, e) {
  let t = ie(s3).split(" "), n = ie(e).split(" "), o = Br(t), r = Br(n), i = 0;
  for (let p in o) {
    let c = o[p] ?? 0, d = r[p] ?? 0;
    i += Math.min(c, d);
  }
  if (i === 0) return 0;
  let a = i / t.length, l = i / n.length;
  return 2 * a * l / (a + l);
}
function yi(s3, e, t, n = false) {
  let o = ie(s3).split(" "), r = ie(e).split(" "), i = ie(t).split(" "), a = /* @__PURE__ */ new Set([...Nr, ...o]);
  r = Lr(r, a), i = Lr(i, a);
  let l = 0, p = l / r.length, c = l / i.length, d = 2 * p * c / (p + c);
  return n ? c : d;
}
var Ii = { emScore: xi, f1Score: fi, novelF1ScoreOptimized: yi };
var Hn = class {
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
      let l = await this.program.forward(this.ai, a), p = await e({ prediction: l, example: a });
      o += p;
      let c = Date.now() - t;
      ue(i, n, o, c, "Testing Prompt", 30);
    }
    let r = n > 0 ? o / n : 0;
    console.log(`
Performance: `, o, "/", n, "Average Score: ", r, `
`);
  }
};
var Vn = class {
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
        for (let d of l) Object.hasOwn(p, d) && (p = p[d]);
        if (!p) return;
        let c = n && a in n ? n[a] : a;
        if (!c) throw new Error(`Invalid field name: ${a}`);
        i[c] = p;
      }), i;
    }).filter((r) => Object.keys(r).length !== 0);
  }
};
var $r = { enabled: true, enabledCategories: ["optimization", "convergence", "resource_usage", "teacher_student", "checkpointing", "pareto"], maxLabelLength: 100, samplingRate: 1 };
var It;
var bi = (s3) => {
  if (It) return It;
  if (s3) return It = Ti(s3), It;
};
var bt = $r;
var Ri = (s3) => {
  bt = { ...bt, ...s3 };
};
var Ci = () => ({ ...bt });
var Ti = (s3) => ({ optimizationLatencyHistogram: s3.createHistogram("ax_optimizer_optimization_duration_ms", { description: "End-to-end duration of optimization runs", unit: "ms" }), optimizationRequestsCounter: s3.createCounter("ax_optimizer_optimization_requests_total", { description: "Total number of optimization requests" }), optimizationErrorsCounter: s3.createCounter("ax_optimizer_optimization_errors_total", { description: "Total number of failed optimizations" }), convergenceRoundsHistogram: s3.createHistogram("ax_optimizer_convergence_rounds", { description: "Number of rounds until convergence" }), convergenceScoreGauge: s3.createGauge("ax_optimizer_convergence_score", { description: "Current best score during optimization" }), convergenceImprovementGauge: s3.createGauge("ax_optimizer_convergence_improvement", { description: "Improvement in score from baseline" }), stagnationRoundsGauge: s3.createGauge("ax_optimizer_stagnation_rounds", { description: "Number of rounds without improvement" }), earlyStoppingCounter: s3.createCounter("ax_optimizer_early_stopping_total", { description: "Total number of early stopping events" }), tokenUsageCounter: s3.createCounter("ax_optimizer_token_usage_total", { description: "Total tokens used during optimization" }), costUsageCounter: s3.createCounter("ax_optimizer_cost_usage_total", { description: "Total cost incurred during optimization", unit: "$" }), memoryUsageGauge: s3.createGauge("ax_optimizer_memory_usage_bytes", { description: "Peak memory usage during optimization", unit: "By" }), optimizationDurationHistogram: s3.createHistogram("ax_optimizer_duration_ms", { description: "Duration of optimization runs", unit: "ms" }), teacherStudentUsageCounter: s3.createCounter("ax_optimizer_teacher_student_usage_total", { description: "Total number of teacher-student interactions" }), teacherStudentLatencyHistogram: s3.createHistogram("ax_optimizer_teacher_student_latency_ms", { description: "Latency of teacher-student interactions", unit: "ms" }), teacherStudentScoreImprovementGauge: s3.createGauge("ax_optimizer_teacher_student_score_improvement", { description: "Score improvement from teacher-student interactions" }), checkpointSaveCounter: s3.createCounter("ax_optimizer_checkpoint_save_total", { description: "Total number of checkpoint saves" }), checkpointLoadCounter: s3.createCounter("ax_optimizer_checkpoint_load_total", { description: "Total number of checkpoint loads" }), checkpointSaveLatencyHistogram: s3.createHistogram("ax_optimizer_checkpoint_save_latency_ms", { description: "Latency of checkpoint save operations", unit: "ms" }), checkpointLoadLatencyHistogram: s3.createHistogram("ax_optimizer_checkpoint_load_latency_ms", { description: "Latency of checkpoint load operations", unit: "ms" }), paretoOptimizationsCounter: s3.createCounter("ax_optimizer_pareto_optimizations_total", { description: "Total number of Pareto optimizations" }), paretoFrontSizeHistogram: s3.createHistogram("ax_optimizer_pareto_front_size", { description: "Size of Pareto frontier" }), paretoHypervolumeGauge: s3.createGauge("ax_optimizer_pareto_hypervolume", { description: "Hypervolume of Pareto frontier" }), paretoSolutionsGeneratedHistogram: s3.createHistogram("ax_optimizer_pareto_solutions_generated", { description: "Number of solutions generated for Pareto optimization" }), programInputFieldsGauge: s3.createGauge("ax_optimizer_program_input_fields", { description: "Number of input fields in optimized program" }), programOutputFieldsGauge: s3.createGauge("ax_optimizer_program_output_fields", { description: "Number of output fields in optimized program" }), examplesCountGauge: s3.createGauge("ax_optimizer_examples_count", { description: "Number of training examples used" }), validationSetSizeGauge: s3.createGauge("ax_optimizer_validation_set_size", { description: "Size of validation set used" }), evaluationLatencyHistogram: s3.createHistogram("ax_optimizer_evaluation_latency_ms", { description: "Latency of program evaluations", unit: "ms" }), demoGenerationLatencyHistogram: s3.createHistogram("ax_optimizer_demo_generation_latency_ms", { description: "Latency of demo generation", unit: "ms" }), metricComputationLatencyHistogram: s3.createHistogram("ax_optimizer_metric_computation_latency_ms", { description: "Latency of metric computation", unit: "ms" }), optimizerTypeGauge: s3.createGauge("ax_optimizer_type", { description: "Type of optimizer being used" }), targetScoreGauge: s3.createGauge("ax_optimizer_target_score", { description: "Target score for optimization" }), maxRoundsGauge: s3.createGauge("ax_optimizer_max_rounds", { description: "Maximum rounds for optimization" }) });
var q = (s3) => {
  let e = {};
  for (let [t, n] of Object.entries(s3)) if (n != null) {
    let o = String(n), r = bt.maxLabelLength;
    e[t] = o.length > r ? o.substring(0, r) : o;
  }
  return e;
};
var wi = (s3, e, t, n, o) => {
  try {
    let r = q({ success: t.toString(), optimizer_type: n, ...o ? { program_signature: o } : {} });
    s3.optimizationLatencyHistogram && s3.optimizationLatencyHistogram.record(e, r), s3.optimizationRequestsCounter && s3.optimizationRequestsCounter.add(1, r), !t && s3.optimizationErrorsCounter && s3.optimizationErrorsCounter.add(1, r);
  } catch (r) {
    console.warn("Failed to record optimization metric:", r);
  }
};
var vi = (s3, e, t, n, o, r) => {
  try {
    let i = q({ optimizer_type: r });
    s3.convergenceRoundsHistogram && s3.convergenceRoundsHistogram.record(e, i), s3.convergenceScoreGauge && s3.convergenceScoreGauge.record(t, i), s3.convergenceImprovementGauge && s3.convergenceImprovementGauge.record(n, i), s3.stagnationRoundsGauge && s3.stagnationRoundsGauge.record(o, i);
  } catch (i) {
    console.warn("Failed to record convergence metric:", i);
  }
};
var Oi = (s3, e, t) => {
  try {
    let n = q({ reason: e, optimizer_type: t });
    s3.earlyStoppingCounter && s3.earlyStoppingCounter.add(1, n);
  } catch (n) {
    console.warn("Failed to record early stopping metric:", n);
  }
};
var Si = (s3, e, t, n, o) => {
  try {
    let r = q({ optimizer_type: n });
    s3.tokenUsageCounter && s3.tokenUsageCounter.add(e, r), s3.costUsageCounter && s3.costUsageCounter.add(t, r), o !== void 0 && s3.memoryUsageGauge && s3.memoryUsageGauge.record(o, r);
  } catch (r) {
    console.warn("Failed to record resource usage metric:", r);
  }
};
var ki = (s3, e, t) => {
  try {
    let n = q({ optimizer_type: t });
    s3.optimizationDurationHistogram && s3.optimizationDurationHistogram.record(e, n);
  } catch (n) {
    console.warn("Failed to record optimization duration metric:", n);
  }
};
var Mi = (s3, e, t, n) => {
  try {
    let o = q({ optimizer_type: n });
    s3.teacherStudentUsageCounter && s3.teacherStudentUsageCounter.add(1, o), s3.teacherStudentLatencyHistogram && s3.teacherStudentLatencyHistogram.record(e, o), s3.teacherStudentScoreImprovementGauge && s3.teacherStudentScoreImprovementGauge.record(t, o);
  } catch (o) {
    console.warn("Failed to record teacher-student metric:", o);
  }
};
var Ei = (s3, e, t, n, o) => {
  try {
    let r = q({ operation: e, success: n.toString(), optimizer_type: o });
    e === "save" ? (s3.checkpointSaveCounter && s3.checkpointSaveCounter.add(1, r), s3.checkpointSaveLatencyHistogram && s3.checkpointSaveLatencyHistogram.record(t, r)) : (s3.checkpointLoadCounter && s3.checkpointLoadCounter.add(1, r), s3.checkpointLoadLatencyHistogram && s3.checkpointLoadLatencyHistogram.record(t, r));
  } catch (r) {
    console.warn("Failed to record checkpoint metric:", r);
  }
};
var Pi = (s3, e, t, n, o) => {
  try {
    let r = q({ optimizer_type: n });
    s3.paretoOptimizationsCounter && s3.paretoOptimizationsCounter.add(1, r), s3.paretoFrontSizeHistogram && s3.paretoFrontSizeHistogram.record(e, r), o !== void 0 && s3.paretoHypervolumeGauge && s3.paretoHypervolumeGauge.record(o, r), s3.paretoSolutionsGeneratedHistogram && s3.paretoSolutionsGeneratedHistogram.record(t, r);
  } catch (r) {
    console.warn("Failed to record Pareto metric:", r);
  }
};
var _i = (s3, e, t, n, o, r) => {
  try {
    let i = q({ optimizer_type: r });
    s3.programInputFieldsGauge && s3.programInputFieldsGauge.record(e, i), s3.programOutputFieldsGauge && s3.programOutputFieldsGauge.record(t, i), s3.examplesCountGauge && s3.examplesCountGauge.record(n, i), s3.validationSetSizeGauge && s3.validationSetSizeGauge.record(o, i);
  } catch (i) {
    console.warn("Failed to record program complexity metric:", i);
  }
};
var Fi = (s3, e, t, n) => {
  try {
    let o = q({ metric_type: e, optimizer_type: n });
    switch (e) {
      case "evaluation":
        s3.evaluationLatencyHistogram && s3.evaluationLatencyHistogram.record(t, o);
        break;
      case "demo_generation":
        s3.demoGenerationLatencyHistogram && s3.demoGenerationLatencyHistogram.record(t, o);
        break;
      case "metric_computation":
        s3.metricComputationLatencyHistogram && s3.metricComputationLatencyHistogram.record(t, o);
        break;
    }
  } catch (o) {
    console.warn("Failed to record optimizer performance metric:", o);
  }
};
var Gi = (s3, e, t, n) => {
  try {
    let o = q({ optimizer_type: e });
    s3.optimizerTypeGauge && s3.optimizerTypeGauge.record(1, o), t !== void 0 && s3.targetScoreGauge && s3.targetScoreGauge.record(t, o), n !== void 0 && s3.maxRoundsGauge && s3.maxRoundsGauge.record(n, o);
  } catch (o) {
    console.warn("Failed to record optimizer configuration metric:", o);
  }
};
var Rt = class {
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
var ae = class {
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
  currentRound = 0;
  scoreHistory = [];
  configurationHistory = [];
  stats;
  metricsInstruments;
  constructor(e) {
    if (e.examples.length === 0) throw new Error("No examples found");
    this.studentAI = e.studentAI, this.teacherAI = e.teacherAI, this.examples = e.examples, this.validationSet = e.validationSet, this.targetScore = e.targetScore, this.minSuccessRate = e.minSuccessRate, this.onProgress = e.onProgress, this.onEarlyStop = e.onEarlyStop, this.seed = e.seed, this.checkpointSave = e.checkpointSave, this.checkpointLoad = e.checkpointLoad, this.checkpointInterval = e.checkpointInterval ?? 10, this.resumeFromCheckpoint = e.resumeFromCheckpoint, this.logger = e.logger, this.verbose = e.verbose;
    let t = new Rt({ maxTokens: 1e6 });
    this.costTracker = e.costTracker ?? t, this.metricsInstruments = bi(k.meter), this.stats = this.initializeStats();
  }
  initializeStats() {
    return { totalCalls: 0, successfulDemos: 0, estimatedTokenUsage: 0, earlyStopped: false, resourceUsage: { totalTokens: 0, totalTime: 0, avgLatencyPerEval: 0, costByModel: {} }, convergenceInfo: { converged: false, finalImprovement: 0, stagnationRounds: 0, convergenceThreshold: 0.01 } };
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
    this.stats.earlyStopped = true, this.stats.earlyStopping = { bestScoreRound: t, patienceExhausted: e.includes("improvement"), reason: e }, this.recordEarlyStoppingMetrics(e, "unknown"), this.onEarlyStop && this.onEarlyStop(e, this.stats);
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
  getStats() {
    return { ...this.stats };
  }
  reset() {
    this.stats = this.initializeStats(), this.costTracker?.reset(), this.currentRound = 0, this.scoreHistory = [], this.configurationHistory = [];
  }
  validateProgram(e) {
    let t = [], n = [];
    return (!("forward" in e) || typeof e.forward != "function") && t.push("Program must have a forward method"), this.examples.length < 2 && (t.push("Need at least 2 examples for optimization"), n.push("Provide more training examples")), this.getValidationSet().length < 1 && (t.push("Validation set is empty"), n.push("Provide examples or a validation set")), { isValid: t.length === 0, issues: t, suggestions: n };
  }
  async compilePareto(e, t, n) {
    let o = Date.now();
    n?.verbose && (this.getLogger(n)?.("Starting Pareto optimization using base implementation", { tags: ["discovery"] }), this.getLogger(n)?.("This will run multiple single-objective optimizations", { tags: ["discovery"] }));
    let r = await this.generateWeightedSolutions(e, t, n), i = await this.generateConstraintSolutions(e, t, n), a = [...r, ...i];
    n?.verbose && this.getLogger(n)?.(`Generated ${a.length} candidate solutions`, { tags: ["discovery"] });
    let l = this.findParetoFrontier(a), p = this.calculateHypervolume(l);
    n?.verbose && (this.getLogger(n)?.(`Found ${l.length} non-dominated solutions`, { tags: ["discovery"] }), this.getLogger(n)?.(`Hypervolume: ${p?.toFixed(4) || "N/A"}`, { tags: ["discovery"] })), this.updateResourceUsage(o), this.stats.convergenceInfo.converged = true, this.recordParetoMetrics(l.length, a.length, "base_optimizer", p);
    let c = l.length > 0 ? Math.max(...l.map((d) => Math.max(...Object.values(d.scores)))) : 0;
    return { demos: l.length > 0 ? [...l[0].demos] : void 0, stats: this.stats, bestScore: c, paretoFront: l, hypervolume: p, paretoFrontSize: l.length, finalConfiguration: { paretoFrontSize: l.length, hypervolume: p, strategy: "weighted_combinations_and_constraints", numSolutions: a.length } };
  }
  async generateWeightedSolutions(e, t, n) {
    let o = [], r = this.examples[0], i = await e.forward(this.studentAI, r), a = await t({ prediction: i, example: r }), l = Object.keys(a);
    n?.verbose && this.getLogger(n)?.(`Detected objectives: ${l.join(", ")}`, { tags: ["discovery"] });
    let p = this.generateWeightCombinations(l);
    for (let c = 0; c < p.length; c++) {
      let d = p[c];
      n?.verbose && this.getLogger(n)?.(`Optimizing with weights: ${JSON.stringify(d)}`, { tags: ["discovery"] });
      let u = async ({ prediction: m, example: A }) => {
        let g = await t({ prediction: m, example: A }), f = 0;
        for (let [h, I] of Object.entries(g)) f += I * (d[h] || 0);
        return f;
      };
      try {
        let m = await this.compile(e, u, { ...n, verbose: false }), A = await this.evaluateWithMultiObjective(e, m, t);
        o.push({ scores: A, demos: m.demos, configuration: { ...m.finalConfiguration, weights: d, strategy: "weighted_combination" } });
      } catch (m) {
        n?.verbose && this.getLogger(n)?.(`Failed optimization with weights ${JSON.stringify(d)}: ${m}`, { tags: ["warning"] });
      }
    }
    return o;
  }
  async generateConstraintSolutions(e, t, n) {
    let o = [], r = this.examples[0], i = await e.forward(this.studentAI, r), a = await t({ prediction: i, example: r }), l = Object.keys(a);
    for (let p of l) {
      n?.verbose && this.getLogger(n)?.(`Optimizing ${p} with constraints on other objectives`, { tags: ["discovery"] });
      let c = async ({ prediction: d, example: u }) => {
        let m = await t({ prediction: d, example: u }), A = m[p] || 0, g = 0;
        for (let [f, h] of Object.entries(m)) f !== p && h < 0.3 && (g += (0.3 - h) * 2);
        return A - g;
      };
      try {
        let d = await this.compile(e, c, { ...n, verbose: false }), u = await this.evaluateWithMultiObjective(e, d, t);
        o.push({ scores: u, demos: d.demos, configuration: { ...d.finalConfiguration, primaryObjective: p, strategy: "constraint_based" } });
      } catch (d) {
        n?.verbose && this.getLogger(n)?.(`Failed constraint optimization for ${p}: ${d}`, { tags: ["warning"] });
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
    let o = this.getValidationSet(), r = {}, i = { ...e };
    t.demos && "setDemos" in i && i.setDemos(t.demos);
    let a = o.slice(0, Math.min(5, o.length));
    for (let p of a) try {
      let c = await i.forward(this.studentAI, p), d = await n({ prediction: c, example: p });
      for (let [u, m] of Object.entries(d)) r[u] || (r[u] = []), r[u].push(m);
    } catch {
    }
    let l = {};
    for (let [p, c] of Object.entries(r)) l[p] = c.length > 0 ? c.reduce((d, u) => d + u, 0) / c.length : 0;
    return l;
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
        let c = p.scores[o] || 0, d = p.scores[r] || 0;
        i += c * (d - l), l = Math.max(l, d);
      }
      return i;
    }
  }
  async saveCheckpoint(e, t, n, o, r = {}, i) {
    let a = i?.overrideCheckpointSave || this.checkpointSave;
    if (!a) return;
    let l = Date.now(), p = false, c;
    try {
      let d = { version: "1.0.0", timestamp: Date.now(), optimizerType: e, optimizerConfig: t, currentRound: this.currentRound, totalRounds: this.stats.resourceUsage.totalTime > 0 ? this.currentRound : 0, bestScore: n, bestConfiguration: o, scoreHistory: [...this.scoreHistory], configurationHistory: [...this.configurationHistory], stats: { ...this.stats }, optimizerState: r, examples: this.examples, validationSet: this.validationSet };
      c = await a(d), p = true;
    } catch (d) {
      throw p = false, d;
    } finally {
      let d = Date.now() - l;
      this.recordCheckpointMetrics("save", d, p, e);
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
    this.currentRound = e, this.scoreHistory.push(t), this.configurationHistory.push(n), this.shouldSaveCheckpoint(e, p) && await this.saveCheckpoint(o, r, i, a, l, p);
  }
  async saveFinalCheckpoint(e, t, n, o, r = {}, i) {
    i?.saveCheckpointOnComplete !== false && await this.saveCheckpoint(e, t, n, o, { ...r, final: true }, i);
  }
  getLogger(e) {
    if (this.isLoggingEnabled(e)) return this.logger ? this.logger : kt;
  }
  isLoggingEnabled(e) {
    return e?.verbose !== void 0 ? e.verbose : this.verbose ?? true;
  }
  recordOptimizationStart(e, t) {
    if (this.metricsInstruments) {
      if (t) {
        let n = (t.match(/input:/g) || []).length, o = (t.match(/output:/g) || []).length;
        _i(this.metricsInstruments, n, o, this.examples.length, this.getValidationSet().length, e);
      }
      Gi(this.metricsInstruments, e, this.targetScore, void 0);
    }
  }
  recordOptimizationComplete(e, t, n, o) {
    if (!this.metricsInstruments) return;
    wi(this.metricsInstruments, e, t, n, o), ki(this.metricsInstruments, e, n);
    let r = this.costTracker?.getCurrentCost() ?? 0, i = this.costTracker?.getTotalTokens() ?? 0;
    Si(this.metricsInstruments, i, r, n);
  }
  recordConvergenceMetrics(e, t, n, o, r) {
    this.metricsInstruments && vi(this.metricsInstruments, e, t, n, o, r);
  }
  recordEarlyStoppingMetrics(e, t) {
    this.metricsInstruments && Oi(this.metricsInstruments, e, t);
  }
  recordTeacherStudentMetrics(e, t, n) {
    this.metricsInstruments && Mi(this.metricsInstruments, e, t, n);
  }
  recordCheckpointMetrics(e, t, n, o) {
    this.metricsInstruments && Ei(this.metricsInstruments, e, t, n, o);
  }
  recordParetoMetrics(e, t, n, o) {
    this.metricsInstruments && Pi(this.metricsInstruments, e, t, n, o);
  }
  recordPerformanceMetrics(e, t, n) {
    this.metricsInstruments && Fi(this.metricsInstruments, e, t, n);
  }
};
var qe = class extends ae {
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
    let l = Ui(this.examples, this.maxExamples), p = this.traces.length;
    for (let c = 0; c < l.length; c += this.batchSize) {
      c > 0 && (a.modelConfig.temperature = 0.7 + 1e-3 * c);
      let d = l.slice(c, c + this.batchSize);
      for (let u of d) {
        if (!u) continue;
        let m = l.filter((b) => b !== u);
        e.setExamples(m);
        let A = this.getTeacherOrStudentAI();
        this.stats.totalCalls++;
        let g, f;
        try {
          g = await e.forward(A, u, a), this.costMonitoring && (this.stats.estimatedTokenUsage += JSON.stringify(u).length / 4 + JSON.stringify(g).length / 4), await n({ prediction: g, example: u }) >= 0.5 && (this.traces = [...this.traces, ...e.getTraces()], this.stats.successfulDemos++);
        } catch (b) {
          f = b, g = {};
        }
        let h = c + l.length * t + (d.indexOf(u) + 1), I = l.length * this.maxRounds, x = Date.now() - r;
        if (this.verboseMode || this.debugMode) {
          let b = { maxRounds: this.maxRounds, batchSize: this.batchSize, earlyStoppingPatience: this.earlyStoppingPatience, costMonitoring: this.costMonitoring, verboseMode: this.verboseMode, debugMode: this.debugMode };
          yr(t, h, I, x, u, this.stats, b, g, f);
        } else ue(h, I, this.traces.length, x, "Tuning Prompt", 30);
        if (this.traces.length >= i) return;
      }
    }
    if (this.earlyStoppingPatience > 0) {
      let d = this.traces.length - p;
      if (!this.stats.earlyStopping) this.stats.earlyStopping = { bestScoreRound: d > 0 ? t : 0, patienceExhausted: false, reason: "No improvement detected" };
      else if (d > 0) this.stats.earlyStopping.bestScoreRound = t;
      else if (t - this.stats.earlyStopping.bestScoreRound >= this.earlyStoppingPatience) {
        this.stats.earlyStopping.patienceExhausted = true, this.stats.earlyStopped = true, this.stats.earlyStopping.reason = `No improvement for ${this.earlyStoppingPatience} rounds`, (this.verboseMode || this.debugMode) && this.getLogger()?.(`Early stopping after ${t + 1} rounds (no improvement for ${this.earlyStoppingPatience} rounds)`, { tags: ["optimizer", "warning"] });
        return;
      }
    }
  }
  async compile(e, t, n) {
    let o = n?.maxIterations ?? this.maxRounds;
    this.traces = [], this.reset(), (this.verboseMode || this.debugMode) && (this.getLogger()?.(`Starting BootstrapFewshot optimization with ${o} rounds`, { tags: ["optimizer", "start"] }), this.getLogger()?.(`Using ${this.examples.length} examples, max ${this.maxDemos} demos`, { tags: ["optimizer", "config"] }));
    for (let a = 0; a < o && (await this.compileRound(e, a, t, n), !this.stats.earlyStopped); a++) ;
    if (this.traces.length === 0) throw new Error("No demonstrations found. Either provide more examples or improve the existing ones.");
    let r = Di(this.traces), i = 0;
    return this.traces.length > 0 && (i = this.stats.successfulDemos / Math.max(1, this.stats.totalCalls)), (this.verboseMode || this.debugMode) && this.getLogger()?.(`Bootstrap complete. Generated ${r.length} demos with ${i.toFixed(3)} success rate`, { tags: ["optimizer", "complete"] }), { demos: r, stats: this.stats, bestScore: i, finalConfiguration: { maxRounds: this.maxRounds, maxDemos: this.maxDemos, batchSize: this.batchSize, successRate: i } };
  }
};
function Di(s3) {
  let e = /* @__PURE__ */ new Map();
  for (let n of s3) if (e.has(n.programId)) {
    let o = e.get(n.programId);
    o && o.push(n.trace);
  } else e.set(n.programId, [n.trace]);
  let t = [];
  return e.forEach((n, o) => {
    t.push({ traces: n, programId: o });
  }), t;
}
var Ui = (s3, e) => {
  let t = [...s3];
  for (let n = t.length - 1; n > 0; n--) {
    let o = Math.floor(Math.random() * (n + 1)), r = t[n], i = t[o];
    if (!r || !i) throw new Error("Invalid array elements");
    [t[n], t[o]] = [i, r];
  }
  return t.slice(0, e);
};
var Wn = class extends ae {
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
  constructor(e) {
    super(e);
    let t = e.options || {};
    this.numCandidates = t.numCandidates ?? 5, this.initTemperature = t.initTemperature ?? 0.7, this.maxBootstrappedDemos = t.maxBootstrappedDemos ?? 3, this.maxLabeledDemos = t.maxLabeledDemos ?? 4, this.numTrials = t.numTrials ?? 30, this.minibatch = t.minibatch ?? true, this.minibatchSize = t.minibatchSize ?? 25, this.minibatchFullEvalSteps = t.minibatchFullEvalSteps ?? 10, this.programAwareProposer = t.programAwareProposer ?? true, this.dataAwareProposer = t.dataAwareProposer ?? true, this.viewDataBatchSize = t.viewDataBatchSize ?? 10, this.tipAwareProposer = t.tipAwareProposer ?? true, this.fewshotAwareProposer = t.fewshotAwareProposer ?? true, this.earlyStoppingTrials = t.earlyStoppingTrials ?? 5, this.minImprovementThreshold = t.minImprovementThreshold ?? 0.01, this.bayesianOptimization = t.bayesianOptimization ?? false, this.acquisitionFunction = t.acquisitionFunction ?? "expected_improvement", this.explorationWeight = t.explorationWeight ?? 0.1, this.sampleCount = t.sampleCount ?? 1, this.stats.convergenceInfo.convergenceThreshold = this.minImprovementThreshold;
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
      let d = await n.chat({ chatPrompt: [{ role: "user", content: l }] });
      if ("results" in d) {
        let u = d.results[0]?.content?.trim();
        if (u && u.length > 10) return u;
      }
    } catch (d) {
      this.isLoggingEnabled() && this.getLogger()?.(`Failed to generate AI instruction: ${d}`, { tags: ["optimizer", "warning"] });
    }
    let p = ["Analyze the input systematically and provide a precise, well-reasoned response.", "Think through this step-by-step, considering all relevant factors before responding.", "Examine the input carefully and generate an accurate, detailed answer.", "Process the information methodically and deliver a clear, comprehensive response.", "Consider the context thoroughly and provide a thoughtful, accurate answer."], c = p[t % p.length] || p[0];
    return e && (c = `${c} ${e}`), c;
  }
  async proposeInstructionCandidates(e, t) {
    let n = [], o = this.getTeacherOrStudentAI(t), r, i;
    this.programAwareProposer && (r = await this.generateProgramSummary(e, o), this.isLoggingEnabled(t) && this.getLogger(t)?.(`Program summary: ${r}`, { tags: ["optimizer", "config"] })), this.dataAwareProposer && (i = await this.generateDatasetSummary(this.examples, o), this.isLoggingEnabled(t) && this.getLogger(t)?.(`Dataset summary: ${i}`, { tags: ["optimizer", "config"] }));
    let a = this.tipAwareProposer ? this.generateTips() : [];
    for (let l = 0; l < this.numCandidates; l++) {
      let p = a.length > 0 ? l % a.length : -1, c = p >= 0 ? a[p] : void 0, d = await this.generateInstruction({ tip: c, candidateIndex: l, ai: o, programSummary: r, datasetSummary: i, previousInstructions: n });
      n.push(d);
    }
    return n;
  }
  async bootstrapFewShotExamples(e, t) {
    return this.isLoggingEnabled() && this.getLogger()?.("Bootstrapping few-shot examples...", { tags: ["optimizer", "phase"] }), (await new qe({ studentAI: this.studentAI, examples: this.examples, options: { maxDemos: this.maxBootstrappedDemos, maxRounds: 3, verboseMode: this.isLoggingEnabled() } }).compile(e, t, { maxDemos: this.maxBootstrappedDemos })).demos || [];
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
    let l = { instruction: o[0] || "", bootstrappedDemos: Math.min(1, t.length), labeledExamples: Math.min(1, n.length) }, p = 0, c = 0, d = [], u = 0;
    if (this.resumeFromCheckpoint) {
      let m = await this.loadCheckpoint(this.resumeFromCheckpoint, a);
      m && m.optimizerType === "MiPRO" && (this.isLoggingEnabled(a) && this.getLogger(a)?.(`Resuming from checkpoint at round ${m.currentRound}`, { tags: ["optimizer", "checkpoint"] }), this.restoreFromCheckpoint(m), u = m.currentRound, p = m.bestScore, l = m.bestConfiguration || l, c = m.stats.convergenceInfo?.stagnationRounds || 0);
    }
    this.isLoggingEnabled(a) && this.getLogger(a)?.(`Running optimization trials (${this.numTrials} total)`, { tags: ["optimizer", "phase"] });
    for (let m = u; m < this.numTrials; m++) {
      let A;
      this.bayesianOptimization && this.miproConfigHistory.length > 2 ? A = await this.selectConfigurationViaBayesianOptimization(o, t, n) : A = { instruction: o[m % o.length] || o[0] || "", bootstrappedDemos: Math.min(Math.floor(Math.random() * (t.length + 1)), this.maxBootstrappedDemos), labeledExamples: Math.min(Math.floor(Math.random() * (n.length + 1)), this.maxLabeledDemos) };
      let g = await this.evaluateConfig(e, A, t, n, r, i, m + 1);
      this.updateSurrogateModel(A, g), d.push(g);
      let f = g - p;
      if (f > this.minImprovementThreshold ? (p = g, l = A, c = 0, this.isLoggingEnabled(a) && this.getLogger(a)?.(`Trial ${m + 1}/${this.numTrials}: New best score ${p.toFixed(3)}`, { tags: ["optimizer", "progress"] })) : c++, await this.updateOptimizationProgress(m + 1, g, A, "MiPRO", this.getConfiguration(), p, l, { stagnationRounds: c, bootstrappedDemos: t.length, labeledExamples: n.length, instructions: o.length }, a), this.onProgress && this.onProgress({ round: m + 1, totalRounds: this.numTrials, currentScore: g, bestScore: p, tokensUsed: this.stats.resourceUsage.totalTokens, timeElapsed: Date.now(), successfulExamples: this.stats.successfulDemos, totalExamples: this.examples.length, currentConfiguration: A, convergenceInfo: { improvement: f, stagnationRounds: c, isConverging: c < this.earlyStoppingTrials } }), ue(m + 1, this.numTrials, Math.round(p * 100), 0, "Running MIPROv2 optimization", 30), this.checkCostLimits()) {
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
    return this.stats.convergenceInfo.stagnationRounds = c, this.stats.convergenceInfo.finalImprovement = d.length > 1 ? p - d[0] : 0, this.stats.convergenceInfo.converged = c < this.earlyStoppingTrials, { bestConfig: l, bestScore: p };
  }
  async evaluateConfig(e, t, n, o, r, i, a = 0) {
    let l = { ...e };
    this.applyConfigToProgram(l, t, n, o);
    let p = 0, c = 0, d;
    if (this.minibatch) {
      let A = Math.min(this.minibatchSize, r.length);
      a % this.minibatchFullEvalSteps === 0 || a > this.numTrials * 0.8 ? d = Math.min(r.length, A * 2) : d = Math.max(3, Math.min(A, r.length));
    } else d = r.length;
    let m = this.shuffleArray([...Array(r.length).keys()]).slice(0, d).map((A) => r[A]);
    for (let A of m) try {
      let g = await l.forward(this.studentAI, A, this.sampleCount > 1 ? { sampleCount: this.sampleCount, resultPicker: Ni() } : void 0), f = await i({ prediction: g, example: A });
      p += f, c++, this.stats.totalCalls++;
    } catch {
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
    r?.auto && this.configureAuto(r.auto);
    let i = this.getValidationSet(n) || (r?.validationExamples ?? this.examples.slice(0, Math.floor(this.examples.length * 0.2)));
    this.isLoggingEnabled(n) && (this.getLogger(n)?.(`Starting MIPROv2 optimization with ${this.numTrials} trials`, { tags: ["optimizer", "start"] }), this.getLogger(n)?.(`Using ${this.examples.length} examples for training and ${i.length} for validation`, { tags: ["optimizer", "config"] }), this.teacherAI && this.getLogger(n)?.("Using separate teacher model for instruction generation", { tags: ["optimizer", "config"] }));
    let a = [];
    this.maxBootstrappedDemos > 0 && (a = await this.bootstrapFewShotExamples(e, t), this.isLoggingEnabled(n) && this.getLogger(n)?.(`Generated ${a.length} bootstrapped demonstrations`, { tags: ["optimizer", "result"] }));
    let l = [];
    this.maxLabeledDemos > 0 && (l = this.selectLabeledExamples(), this.isLoggingEnabled(n) && this.getLogger(n)?.(`Selected ${l.length} labeled examples from training set`, { tags: ["optimizer", "result"] }));
    let p = await this.proposeInstructionCandidates(e, n);
    this.isLoggingEnabled(n) && (this.getLogger(n)?.(`Generated ${p.length} instruction candidates`, { tags: ["optimizer", "result"] }), this.hasTeacherAI(n) && this.getLogger(n)?.("Using teacher AI for instruction generation", { tags: ["optimizer", "config"] }));
    let { bestConfig: c, bestScore: d } = await this.runOptimization(e, a, l, p, i, t, n);
    this.isLoggingEnabled(n) && (this.getLogger(n)?.(`Optimization complete. Best score: ${d}`, { tags: ["optimizer", "complete"] }), this.getLogger(n)?.(`Best configuration: ${JSON.stringify(c)}`, { tags: ["optimizer", "result"] })), this.checkTargetScore(d) && this.triggerEarlyStopping(`Target score ${this.targetScore} reached with score ${d}`, this.numTrials);
    let u;
    "getSignature" in e && typeof e.getSignature == "function" ? u = e.getSignature() : u = "input -> output";
    let m = new S(u);
    return this.applyConfigToAxGen(m, c, a, l), this.updateResourceUsage(o), this.stats.convergenceInfo.converged = true, this.stats.convergenceInfo.finalImprovement = d, await this.saveFinalCheckpoint("MiPRO", this.getConfiguration(), d, c, { bootstrappedDemos: a.length, labeledExamples: l.length, instructions: p.length, optimizedGen: !!m }, n), { demos: a, stats: this.stats, bestScore: d, optimizedGen: m, finalConfiguration: { instruction: c.instruction, bootstrappedDemos: c.bootstrappedDemos, labeledExamples: c.labeledExamples, numCandidates: this.numCandidates, numTrials: this.numTrials, sampleCount: this.sampleCount } };
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
    let t = super.validateProgram(e);
    return this.examples.length < this.maxBootstrappedDemos + this.maxLabeledDemos && (t.issues.push(`Not enough examples: need at least ${this.maxBootstrappedDemos + this.maxLabeledDemos}, got ${this.examples.length}`), t.suggestions.push("Reduce maxBootstrappedDemos or maxLabeledDemos, or provide more examples")), this.getValidationSet().length < 5 && (t.issues.push("Validation set too small for reliable MiPRO optimization"), t.suggestions.push("Provide more examples or a larger validation set")), { isValid: t.issues.length === 0, issues: t.issues, suggestions: t.suggestions };
  }
  encodeConfiguration(e) {
    return `${e.instruction.length}_${e.bootstrappedDemos}_${e.labeledExamples}`;
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
    let t = 0.254829592, n = -0.284496736, o = 1.421413741, r = -1.453152027, i = 1.061405429, a = 0.3275911, l = e >= 0 ? 1 : -1, p = Math.abs(e), c = 1 / (1 + a * p), d = 1 - ((((i * c + r) * c + o) * c + n) * c + t) * c * Math.exp(-p * p);
    return l * d;
  }
  async selectConfigurationViaBayesianOptimization(e, t, n) {
    let o = [], r = Math.min(20, e.length * 3);
    for (let i = 0; i < r; i++) {
      let a = { instruction: e[i % e.length] || e[0] || "", bootstrappedDemos: Math.min(Math.floor(Math.random() * (t.length + 1)), this.maxBootstrappedDemos), labeledExamples: Math.min(Math.floor(Math.random() * (n.length + 1)), this.maxLabeledDemos) }, l = this.calculateAcquisitionValue(a);
      o.push({ config: a, acquisitionValue: l });
    }
    return o.sort((i, a) => a.acquisitionValue - i.acquisitionValue), o[0].config;
  }
};
var Ni = () => async (s3) => {
  if (s3.type === "fields") {
    let e = {};
    for (let { index: o, sample: r } of s3.results) {
      let i = JSON.stringify(r);
      e[i] || (e[i] = { count: 0, index: o }), e[i].count += 1;
    }
    let t, n = -1;
    for (let [o, r] of Object.entries(e)) r.count > n && (n = r.count, t = o);
    return e[t]?.index ?? 0;
  }
  return s3.results[0]?.index ?? 0;
};
function Li(s3, ...e) {
  let t = "";
  for (let n = 0; n < s3.length; n++) if (t += s3[n] ?? "", n < e.length) {
    let o = e[n];
    if (Yn(o)) {
      let r = t.match(/(\w+)\s*:\s*$/);
      if (r && (o.isOptional || o.isInternal)) {
        let c = r[1];
        o.isOptional && (c += "?"), o.isInternal && (c += "!"), t = t.replace(/(\w+)(\s*:\s*)$/, `${c}$2`);
      }
      let { isOptional: i, isInternal: a, ...l } = o;
      t += Ct(l);
    } else if (Kn(o)) t += Jn(o);
    else if (typeof o == "string" || o instanceof P) t += qr(o);
    else throw new Error("Unsupported template interpolation value");
  }
  return new P(t);
}
function Bi(s3, ...e) {
  let t = "";
  for (let n = 0; n < s3.length; n++) if (t += s3[n] ?? "", n < e.length) {
    let o = e[n];
    if (Yn(o)) {
      let r = t.match(/(\w+)\s*:\s*$/);
      if (r && (o.isOptional || o.isInternal)) {
        let c = r[1];
        o.isOptional && (c += "?"), o.isInternal && (c += "!"), t = t.replace(/(\w+)(\s*:\s*)$/, `${c}$2`);
      }
      let { isOptional: i, isInternal: a, ...l } = o;
      t += Ct(l);
    } else if (Kn(o)) t += Jn(o);
    else if (typeof o == "string" || o instanceof P) t += qr(o);
    else throw new Error("Unsupported template interpolation value");
  }
  return new S(t);
}
function qr(s3) {
  if (typeof s3 == "string") return s3;
  if (Yn(s3)) return Ct(s3);
  if (Kn(s3)) return Jn(s3);
  if (s3 instanceof P) {
    let e = s3.toString(), t = e.indexOf(" -> ");
    return t !== -1 ? e.substring(t + 4) : e;
  }
  throw new Error(`Unsupported template value type: ${typeof s3}`);
}
function Ct(s3) {
  let e = s3.type;
  return s3.isArray && (e += "[]"), s3.options && s3.options.length > 0 && s3.type === "class" && (e += ` "${s3.options.join(", ")}"`), s3.description && (e += ` "${s3.description}"`), e;
}
function Jn(s3) {
  let e = s3.name;
  return s3.isOptional && (e += "?"), s3.isInternal && (e += "!"), s3.type && (e += `:${Ct(s3.type)}`), s3.description && !s3.type?.description && (e += ` "${s3.description}"`), e;
}
function Yn(s3) {
  return s3 !== null && typeof s3 == "object" && s3 !== void 0 && "type" in s3 && typeof s3.type == "string";
}
function Kn(s3) {
  return s3 !== null && typeof s3 == "object" && s3 !== void 0 && "name" in s3 && typeof s3.name == "string";
}
var $i = { string: (s3) => ({ type: "string", description: s3 }), number: (s3) => ({ type: "number", description: s3 }), boolean: (s3) => ({ type: "boolean", description: s3 }), date: (s3) => ({ type: "date", description: s3 }), datetime: (s3) => ({ type: "datetime", description: s3 }), json: (s3) => ({ type: "json", description: s3 }), image: (s3) => ({ type: "image", description: s3 }), audio: (s3) => ({ type: "audio", description: s3 }), class: (s3, e) => ({ type: "class", options: s3, description: e }), code: (s3, e) => ({ type: "code", options: [s3], description: e }), array: (s3) => ({ ...s3, isArray: true }), optional: (s3) => ({ ...s3, isOptional: true }), internal: (s3) => ({ ...s3, isInternal: true }) };
var Qn = class {
  analyzeMappingDependencies(e, t) {
    let n = [], o = e.toString(), r = Array.from(o.matchAll(/state\.(\w+)/g));
    for (let i of r) i[1] && !n.includes(i[1]) && n.push(i[1]);
    if (n.length === 0) try {
      let i = this.createDependencyTracker(n);
      e(i);
    } catch {
    }
    return n;
  }
  createDependencyTracker(e) {
    return new Proxy({}, { get(t, n) {
      return typeof n == "string" && !e.includes(n) && e.push(n), new Proxy({}, { get: () => {
      } });
    } });
  }
};
var Xn = class {
  steps = [];
  parallelGroups = [];
  analyzer = new Qn();
  initialFields = /* @__PURE__ */ new Set();
  addExecutionStep(e, t, n) {
    let o = [], r = [], i = "other";
    t && n ? (i = "execute", o = this.analyzer.analyzeMappingDependencies(n, t), r = [`${t}Result`]) : e.toString().includes("transform(") && (i = "map", o = this.getAllProducedFields());
    let a = { type: i, nodeName: t, dependencies: o, produces: r, stepFunction: e, stepIndex: this.steps.length };
    this.steps.push(a);
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
        (r.dependencies.length === 0 || r.dependencies.every((a) => t.has(a))) && (o.push(r), e.add(r.stepIndex));
      }
      if (o.length > 0) {
        for (let r of o) r.produces.forEach((i) => t.add(i));
        this.parallelGroups.push({ level: n, steps: o }), n++;
      } else break;
    }
  }
  getAllProducedFields() {
    let e = [];
    for (let t of this.steps) e.push(...t.produces);
    return e;
  }
  createOptimizedExecution() {
    let e = [];
    for (let t of this.parallelGroups) if (t.steps.length === 1) {
      let n = t.steps[0];
      n && e.push(n.stepFunction);
    } else if (t.steps.length > 1) {
      let n = async (o, r) => {
        let i = t.steps.map((p) => p.stepFunction(o, r)), a = await Promise.all(i), l = o;
        for (let p of a) l = { ...l, ...p };
        return l;
      };
      e.push(n);
    }
    return e;
  }
  getExecutionPlan() {
    return { totalSteps: this.steps.length, parallelGroups: this.parallelGroups.length, maxParallelism: Math.max(...this.parallelGroups.map((e) => e.steps.length), 0), steps: this.steps, groups: this.parallelGroups };
  }
};
var Zn = class extends ee {
  nodes = /* @__PURE__ */ new Map();
  flowDefinition = [];
  nodeGenerators = /* @__PURE__ */ new Map();
  loopStack = [];
  stepLabels = /* @__PURE__ */ new Map();
  branchContext = null;
  autoParallelConfig;
  executionPlanner = new Xn();
  constructor(e = "userInput:string -> flowOutput:string", t) {
    super(e), this.autoParallelConfig = { enabled: t?.autoParallel !== false };
  }
  node(e, t, n) {
    if (t instanceof S) this.nodes.set(e, { inputs: {}, outputs: {} }), this.nodeGenerators.set(e, t);
    else if (t instanceof P) this.nodes.set(e, { inputs: {}, outputs: {} }), this.nodeGenerators.set(e, new S(t, n));
    else if (typeof t == "function" && t.prototype instanceof ee) {
      this.nodes.set(e, { inputs: {}, outputs: {} });
      let o = new t();
      this.nodeGenerators.set(e, o);
    } else if (typeof t == "string") {
      let o = t;
      if (!o) throw new Error(`Invalid signature for node '${e}': signature cannot be empty`);
      this.nodes.set(e, { inputs: {}, outputs: {} }), this.nodeGenerators.set(e, new S(o, n));
    } else throw new Error(`Invalid second argument for node '${e}': expected string, AxSignature, AxGen instance, or class extending AxProgram`);
    return this;
  }
  n(e, t, n) {
    return this.node(e, t, n);
  }
  map(e) {
    let t = (n) => e(n);
    if (this.branchContext?.currentBranchValue !== void 0) {
      let n = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      n.push(t), this.branchContext.branches.set(this.branchContext.currentBranchValue, n);
    } else this.flowDefinition.push(t), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(t);
    return this;
  }
  m(e) {
    return this.map(e);
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
      let l = n?.ai ?? a.mainAi, p = n?.options ?? a.mainOptions, c = t(i), d = p?.traceLabel ? `Node:${e} (${p.traceLabel})` : `Node:${e}`, u = await o.forward(l, c, { ...p, traceLabel: d });
      return { ...i, [`${e}Result`]: u };
    };
    if (this.branchContext?.currentBranchValue !== void 0) {
      let i = this.branchContext.branches.get(this.branchContext.currentBranchValue) || [];
      i.push(r), this.branchContext.branches.set(this.branchContext.currentBranchValue, i);
    } else this.flowDefinition.push(r), this.autoParallelConfig.enabled && this.executionPlanner.addExecutionStep(r, e, t);
    return this;
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
    return this.branchContext = null, this.flowDefinition.push(async (t, n) => {
      let o = e.predicate(t), r = e.branches.get(o);
      if (!r) return t;
      let i = t;
      for (let a of r) i = await a(i, n);
      return i;
    }), this;
  }
  mg() {
    return this.merge();
  }
  parallel(e) {
    let t = async (n, o) => {
      let r = e.map(async (a) => {
        let l = new eo(this.nodeGenerators);
        return await a(l).executeSteps(n, o);
      }), i = await Promise.all(r);
      return { ...n, _parallelResults: i };
    };
    return this.flowDefinition.push(t), { merge: (n, o) => (this.flowDefinition.push((r) => {
      let i = r._parallelResults;
      if (!Array.isArray(i)) throw new Error("No parallel results found for merge");
      let a = o(...i), l = { ...r };
      return l._parallelResults = void 0, l[n] = a, l;
    }), this) };
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
        for (let d = o; d < r; d++) {
          let u = this.flowDefinition[d];
          u && (l = await u(l, a));
        }
      }
      return l;
    }), this;
  }
  fb(e, t, n = 10) {
    return this.feedback(e, t, n);
  }
  while(e, t = 100) {
    let n = this.flowDefinition.length;
    this.loopStack.push(n);
    let o = Object.assign((r) => r, { _condition: e, _maxIterations: t, _isLoopStart: true });
    return this.flowDefinition.push(o), this;
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
    }, this;
  }
  end() {
    return this.endWhile();
  }
  async forward(e, t, n) {
    let o = { ...t }, r = { mainAi: e, mainOptions: n };
    if (n?.autoParallel !== false && this.autoParallelConfig.enabled) {
      this.executionPlanner.setInitialFields(Object.keys(t));
      let a = this.executionPlanner.createOptimizedExecution();
      for (let l of a) o = await l(o, r);
    } else for (let a of this.flowDefinition) o = await a(o, r);
    return o;
  }
  getExecutionPlan() {
    let e = this.executionPlanner.getExecutionPlan();
    return { totalSteps: e.totalSteps, parallelGroups: e.parallelGroups, maxParallelism: e.maxParallelism, autoParallelEnabled: this.autoParallelConfig.enabled, steps: e.steps, groups: e.groups };
  }
};
var eo = class {
  constructor(e) {
    this.nodeGenerators = e;
  }
  steps = [];
  execute(e, t, n) {
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    return this.steps.push(async (r, i) => {
      let a = n?.ai ?? i.mainAi, l = n?.options ?? i.mainOptions, p = t(r), c = l?.traceLabel ? `Node:${e} (${l.traceLabel})` : `Node:${e}`, d = await o.forward(a, p, { ...l, traceLabel: c });
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
var to = class {
  constructor(e) {
    this.nodeGenerators = e;
  }
  steps = [];
  execute(e, t, n) {
    let o = this.nodeGenerators.get(e);
    if (!o) throw new Error(`Node program for '${e}' not found.`);
    return this.steps.push(async (r, i) => {
      let a = n?.ai ?? i.mainAi, l = n?.options ?? i.mainOptions, p = t(r), c = l?.traceLabel ? `Node:${e} (${l.traceLabel})` : `Node:${e}`, d = await o.forward(a, p, { ...l, traceLabel: c });
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
var no = class {
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
var oo = class {
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
var ro = class {
  constructor(e, t = {}) {
    this.transport = e;
    this.options = t;
    this.logger = t.logger ?? ((n) => console.log(n));
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
    if (this.functions = e.tools.map((t) => {
      let n = this.options.functionOverrides?.find((r) => r.name === t.name), o = t.inputSchema.properties ? { properties: t.inputSchema.properties, required: t.inputSchema.required ?? [], type: t.inputSchema.type } : void 0;
      return { name: n?.updates.name ?? t.name, description: n?.updates.description ?? t.description, parameters: o, func: async (r) => {
        let { result: i } = await this.sendRequest("tools/call", { name: t.name, arguments: r });
        return i;
      } };
    }), this.options.debug) {
      this.logger(`> Discovered ${this.functions.length} functions:`, { tags: ["discovery"] });
      for (let t of this.functions) this.logger(`  - ${t.name}: ${t.description}`, { tags: ["discovery"] });
    }
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
    let n = B(), o = { jsonrpc: "2.0", id: n, method: e, params: t }, r = new Promise((a, l) => {
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
    let n = { jsonrpc: "2.0", method: e, params: t };
    this.options.debug && this.logger(`\u27A1\uFE0F Sending notification: ${JSON.stringify(n, null, 2)}`, { tags: ["requestStart"] }), await this.transport.sendNotification(n);
  }
};
var so = class {
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
var io = class {
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
          let d = c.slice(6);
          if (d === "[DONE]") return;
          try {
            let u = JSON.parse(d);
            this.messageHandler && this.messageHandler(u);
          } catch (u) {
            console.error("Failed to parse SSE data:", u);
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
          let d = a.split(`
`);
          a = d.pop() || "";
          for (let u of d) if (u.startsWith("data: ")) {
            let m = u.slice(6);
            if (m === "[DONE]") return;
            try {
              let A = JSON.parse(m);
              if ("id" in A && A.id === t) {
                n(A);
                return;
              }
              this.messageHandler && this.messageHandler(A);
            } catch (A) {
              console.error("Failed to parse SSE data:", A);
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
function qi(s3, e, t, n, o) {
  let r = { ...s3 };
  if (r.parameters) {
    let i = r.parameters.properties ? Object.keys(r.parameters.properties) : [], l = t.filter((p) => i.includes(p)).filter((p) => p !== "model").filter((p) => !o.excludeFieldsFromPassthrough.includes(p));
    if (l.length > 0) {
      r.parameters = ji(r.parameters, l);
      let p = r.func;
      r.func = async (c, d) => {
        let u = {};
        if (Array.isArray(e)) {
          let A = e.filter((g) => g.role === "user").pop();
          A && (u = Hr(A.values, l));
        } else u = Hr(e, l);
        let m = { ...c, ...u };
        if (o.debug && l.length > 0) {
          let A = d?.ai;
          A && A.getLogger()(`Function Params: ${JSON.stringify(m, null, 2)}`, { tags: ["functionArg"] });
        }
        return await p(m, d);
      };
    }
    return r;
  }
  return n && !o.disableSmartModelRouting && o.canConfigureSmartModelRouting && (r.parameters = Vr(r.parameters, n)), r;
}
var zr = new Error("Agent description must be at least 20 characters (explain in detail what the agent does)");
var jr = new Error("Agent definition is the prompt you give to the LLM for the agent. It must be detailed and at least 100 characters");
var ao = class {
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
    let { disableSmartModelRouting: p, excludeFieldsFromPassthrough: c, debug: d } = l ?? {};
    if (this.ai = e, this.agents = i, this.functions = a, this.disableSmartModelRouting = p, this.excludeFieldsFromPassthrough = c ?? [], this.debug = d, !t || t.length < 5) throw new Error("Agent name must be at least 10 characters (more descriptive)");
    if (!n || n.length < 20) throw zr;
    if (o && o.length < 100) throw jr;
    this.program = new S(r, { ...l, description: o ?? n });
    for (let m of i ?? []) this.program.register(m);
    this.name = t, this.func = { name: zi(this.name), description: n, parameters: this.program.getSignature().toJSONSchema(), func: () => this.forward };
    let u = e?.getModelList();
    u && !this.disableSmartModelRouting && (this.func.parameters = Vr(this.func.parameters, u));
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
      let l = this.getDebug(a, o);
      l && a.getLogger()(`\u{1F916} Agent ${this.name} starting...`, { tags: ["start"] });
      let p = await e(a, i, { ...o, model: r });
      l && a.getLogger()(`\u{1F916} Agent ${this.name} completed.`, { tags: ["end"] });
      let d = this.program.getSignature().getOutputFields();
      return Object.keys(p).map((m) => {
        let A = d.find((g) => g.name === m);
        return A ? `${A.title}: ${p[m]}` : `${m}: ${p[m]}`;
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
      let u = d.getFeatures(), m = { debug: l, disableSmartModelRouting: !!this.disableSmartModelRouting, excludeFieldsFromPassthrough: u.excludeFieldsFromPassthrough, canConfigureSmartModelRouting: u.canConfigureSmartModelRouting };
      return qi(d.getFunction(), t, a, r, m);
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
    if (!e || e.length < 20) throw zr;
    this.program.getSignature().setDescription(e), this.func.description = e;
  }
  setDefinition(e) {
    if (!e || e.length < 100) throw jr;
    this.program.getSignature().setDescription(e);
  }
  getDebug(e, t) {
    return t?.debug ?? this.debug ?? e?.getOptions()?.debug ?? false;
  }
};
function zi(s3) {
  return s3.split(/[^a-zA-Z0-9]/).map((n, o) => {
    let r = n.toLowerCase();
    return o > 0 && r && r[0] ? r[0].toUpperCase() + r.slice(1) : r;
  }).join("");
}
function Vr(s3, e) {
  let t = s3 ? structuredClone(s3) : { type: "object", properties: {}, required: [] };
  if (t.properties?.model) return t;
  let n = { type: "string", enum: e.map((i) => i.key), description: `The AI model to use for this function call. Available options: ${e.map((i) => `\`${i.key}\` ${i.description}`).join(", ")}` }, o = { ...t.properties ?? {}, model: n }, r = [...t.required ?? [], "model"];
  return { ...t, properties: o, required: r };
}
function ji(s3, e) {
  let t = structuredClone(s3);
  if (t.properties) for (let n of e) delete t.properties[n];
  if (Array.isArray(t.required)) {
    let n = t.required.filter((o) => !e.includes(o));
    Object.defineProperty(t, "required", { value: n, writable: true, configurable: true });
  }
  return t;
}
function Hr(s3, e) {
  let t = {};
  for (let n of e) n in s3 && (t[n] = s3[n]);
  return t;
}
var ze = class extends S {
  constructor(e, t) {
    let n = new P(e);
    n.setOutputFields([{ name: "reason", description: "Let's work this out in a step by step way in order to ensure we have the right answer.", isInternal: t?.setVisibleReasoning !== true }, ...n.getOutputFields()]), super(n, t);
  }
};
var lo = class extends ze {
  genQuery;
  queryFn;
  maxHops;
  constructor(e, t) {
    super('"Answer questions with short factoid answers." context:string[] "may contain relevant facts", question -> answer', t), this.maxHops = t?.maxHops ?? 3;
    let o = new P('"Write a simple search query that will help answer a complex question." context?:string[] "may contain relevant facts", question -> query "question to further our understanding"');
    this.genQuery = new S(o), this.queryFn = e;
  }
  async forward(e, t, n) {
    let o;
    if (Array.isArray(t)) {
      let l = t.filter((p) => p.role === "user").pop();
      if (!l) throw new Error("No user message found in values array");
      o = l.values.question;
    } else o = t.question;
    let r = 0, i = [];
    for (; r < this.maxHops; ) {
      let l = await this.genQuery.forward(e, { context: i, question: o }), p = await this.queryFn(l.query);
      i = $e.dedup([...i, p]), r++;
    }
    return await super.forward(e, { context: i, question: o }, n);
  }
};
export {
  gn as AxAI,
  he as AxAIAnthropic,
  Ye as AxAIAnthropicModel,
  Ut as AxAIAnthropicVertexModel,
  be as AxAIAzureOpenAI,
  Re as AxAICohere,
  Ze as AxAICohereEmbedModel,
  Xe as AxAICohereModel,
  Ce as AxAIDeepSeek,
  et as AxAIDeepSeekModel,
  Te as AxAIGoogleGemini,
  Jt as AxAIGoogleGeminiEmbedModel,
  Wo as AxAIGoogleGeminiEmbedTypes,
  tt as AxAIGoogleGeminiModel,
  Yt as AxAIGoogleGeminiSafetyCategory,
  Kt as AxAIGoogleGeminiSafetyThreshold,
  hn as AxAIGrok,
  tr as AxAIGrokEmbedModels,
  lt as AxAIGrokModel,
  ve as AxAIGroq,
  nt as AxAIGroqModel,
  Oe as AxAIHuggingFace,
  tn as AxAIHuggingFaceModel,
  Se as AxAIMistral,
  Qo as AxAIMistralEmbedModels,
  ot as AxAIMistralModel,
  ke as AxAIOllama,
  Ie as AxAIOpenAI,
  M as AxAIOpenAIBase,
  xe as AxAIOpenAIEmbedModel,
  Qe as AxAIOpenAIModel,
  Ee as AxAIOpenAIResponses,
  rt as AxAIOpenAIResponsesBase,
  Me as AxAIOpenAIResponsesImpl,
  fe as AxAIOpenAIResponsesModel,
  v as AxAIRefusalError,
  Pe as AxAIReka,
  it as AxAIRekaModel,
  me as AxAIServiceAbortedError,
  ne as AxAIServiceAuthenticationError,
  U as AxAIServiceError,
  X as AxAIServiceNetworkError,
  Q as AxAIServiceResponseError,
  le as AxAIServiceStatusError,
  Y as AxAIServiceStreamTerminatedError,
  pe as AxAIServiceTimeoutError,
  _e as AxAITogether,
  ao as AxAgent,
  qn as AxApacheTika,
  re2 as AxAssertionError,
  jt as AxBalancer,
  E as AxBaseAI,
  ae as AxBaseOptimizer,
  qe as AxBootstrapFewShot,
  ze as AxChainOfThought,
  In as AxDB,
  $ as AxDBBase,
  Fe as AxDBCloudflare,
  Rn as AxDBManager,
  oe as AxDBMemory,
  Ge as AxDBPinecone,
  De as AxDBWeaviate,
  Rt as AxDefaultCostTracker,
  $n as AxDefaultResultReranker,
  no as AxDockerSession,
  oo as AxEmbeddingAdapter,
  Ii as AxEvalUtil,
  Zn as AxFlow,
  to as AxFlowTypedSubContextImpl,
  ct as AxFunctionError,
  dt as AxFunctionProcessor,
  S as AxGen,
  yt as AxGenerateError,
  Vn as AxHFDataLoader,
  Be as AxInstanceRegistry,
  Ao as AxLLMRequestTypeValues,
  ro as AxMCPClient,
  so as AxMCPHTTPSSETransport,
  io as AxMCPStreambleHTTPTransport,
  Ne as AxMemory,
  Wn as AxMiPRO,
  sn as AxMockAIService,
  an as AxMultiServiceRouter,
  ee as AxProgram,
  de as AxPromptTemplate,
  lo as AxRAG,
  we as AxRateLimiterTokenUsage,
  P as AxSignature,
  jn as AxSimpleClassifier,
  zn as AxSimpleClassifierClass,
  ho as AxSpanKindValues,
  $e as AxStringUtil,
  Hn as AxTestPrompt,
  Bi as ax,
  $o as axAIAnthropicDefaultConfig,
  rs as axAIAnthropicVertexDefaultConfig,
  us as axAIAzureOpenAIBestConfig,
  ps as axAIAzureOpenAICreativeConfig,
  zo as axAIAzureOpenAIDefaultConfig,
  cs as axAIAzureOpenAIFastConfig,
  ms as axAICohereCreativeConfig,
  Ho as axAICohereDefaultConfig,
  As as axAIDeepSeekCodeConfig,
  Vo as axAIDeepSeekDefaultConfig,
  Yo as axAIGoogleGeminiDefaultConfig,
  hs as axAIGoogleGeminiDefaultCreativeConfig,
  ks as axAIGrokBestConfig,
  xn as axAIGrokDefaultConfig,
  ys as axAIHuggingFaceCreativeConfig,
  Ko as axAIHuggingFaceDefaultConfig,
  Is as axAIMistralBestConfig,
  rn as axAIMistralDefaultConfig,
  Xo as axAIOllamaDefaultConfig,
  bs as axAIOllamaDefaultCreativeConfig,
  $t as axAIOpenAIBestConfig,
  qt as axAIOpenAICreativeConfig,
  ce as axAIOpenAIDefaultConfig,
  zt as axAIOpenAIFastConfig,
  Cs as axAIOpenAIResponsesBestConfig,
  Ts as axAIOpenAIResponsesCreativeConfig,
  st as axAIOpenAIResponsesDefaultConfig,
  ws as axAIRekaBestConfig,
  vs as axAIRekaCreativeConfig,
  at as axAIRekaDefaultConfig,
  Os as axAIRekaFastConfig,
  er as axAITogetherDefaultConfig,
  w as axBaseAIDefaultConfig,
  F as axBaseAIDefaultCreativeConfig,
  Us as axCheckMetricsHealth,
  St as axCreateDefaultColorLogger,
  Zr as axCreateDefaultTextLogger,
  fo as axCreateOptimizerLogger,
  sr as axDefaultMetricsConfig,
  kt as axDefaultOptimizerLogger,
  $r as axDefaultOptimizerMetricsConfig,
  Bs as axGetMetricsConfig,
  Ci as axGetOptimizerMetricsConfig,
  k as axGlobals,
  Ke as axModelInfoAnthropic,
  Ht as axModelInfoCohere,
  Wt as axModelInfoDeepSeek,
  Qt as axModelInfoGoogleGemini,
  An as axModelInfoGrok,
  Zt as axModelInfoGroq,
  en as axModelInfoHuggingFace,
  on as axModelInfoMistral,
  ye as axModelInfoOpenAI,
  Lt as axModelInfoOpenAIResponses,
  pn as axModelInfoReka,
  un as axModelInfoTogether,
  C as axSpanAttributes,
  j as axSpanEvents,
  Ls as axUpdateMetricsConfig,
  Ri as axUpdateOptimizerMetricsConfig,
  dn as axValidateChatRequestMessage,
  mn as axValidateChatResponseResult,
  $i as f,
  Li as s
};
//# sourceMappingURL=ax.js.map

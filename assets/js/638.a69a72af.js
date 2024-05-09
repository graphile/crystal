"use strict";
exports.id = 638;
exports.ids = [638];
exports.modules = {

/***/ 61638:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ q)
/* harmony export */ });
/* harmony import */ var _codemirror_es2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16424);
var m = Object.defineProperty;
var y = (T, d) => m(T, "name", { value: d, configurable: !0 });

function I(T, d) {
  for (var e = 0; e < d.length; e++) {
    const c = d[e];
    if (typeof c != "string" && !Array.isArray(c)) {
      for (const t in c)
        if (t !== "default" && !(t in T)) {
          const a = Object.getOwnPropertyDescriptor(c, t);
          a && Object.defineProperty(T, t, a.get ? a : {
            enumerable: !0,
            get: () => c[t]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(T, Symbol.toStringTag, { value: "Module" }));
}
y(I, "_mergeNamespaces");
var w = { exports: {} };
(function(T, d) {
  (function(e) {
    e((0,_codemirror_es2_js__WEBPACK_IMPORTED_MODULE_0__.r)());
  })(function(e) {
    function c(t) {
      return function(a, f) {
        var r = f.line, s = a.getLine(r);
        function v(l) {
          for (var u, g = f.ch, h = 0; ; ) {
            var p = g <= 0 ? -1 : s.lastIndexOf(l[0], g - 1);
            if (p == -1) {
              if (h == 1)
                break;
              h = 1, g = s.length;
              continue;
            }
            if (h == 1 && p < f.ch)
              break;
            if (u = a.getTokenTypeAt(e.Pos(r, p + 1)), !/^(comment|string)/.test(u))
              return { ch: p + 1, tokenType: u, pair: l };
            g = p - 1;
          }
        }
        y(v, "findOpening");
        function k(l) {
          var u = 1, g = a.lastLine(), h, p = l.ch, j;
          e:
            for (var L = r; L <= g; ++L)
              for (var A = a.getLine(L), b = L == r ? p : 0; ; ) {
                var O = A.indexOf(l.pair[0], b), F = A.indexOf(l.pair[1], b);
                if (O < 0 && (O = A.length), F < 0 && (F = A.length), b = Math.min(O, F), b == A.length)
                  break;
                if (a.getTokenTypeAt(e.Pos(L, b + 1)) == l.tokenType) {
                  if (b == O)
                    ++u;
                  else if (!--u) {
                    h = L, j = b;
                    break e;
                  }
                }
                ++b;
              }
          return h == null || r == h ? null : {
            from: e.Pos(r, p),
            to: e.Pos(h, j)
          };
        }
        y(k, "findRange");
        for (var i = [], n = 0; n < t.length; n++) {
          var o = v(t[n]);
          o && i.push(o);
        }
        i.sort(function(l, u) {
          return l.ch - u.ch;
        });
        for (var n = 0; n < i.length; n++) {
          var P = k(i[n]);
          if (P)
            return P;
        }
        return null;
      };
    }
    y(c, "bracketFolding"), e.registerHelper("fold", "brace", c([["{", "}"], ["[", "]"]])), e.registerHelper("fold", "brace-paren", c([["{", "}"], ["[", "]"], ["(", ")"]])), e.registerHelper("fold", "import", function(t, a) {
      function f(n) {
        if (n < t.firstLine() || n > t.lastLine())
          return null;
        var o = t.getTokenAt(e.Pos(n, 1));
        if (/\S/.test(o.string) || (o = t.getTokenAt(e.Pos(n, o.end + 1))), o.type != "keyword" || o.string != "import")
          return null;
        for (var P = n, l = Math.min(t.lastLine(), n + 10); P <= l; ++P) {
          var u = t.getLine(P), g = u.indexOf(";");
          if (g != -1)
            return { startCh: o.end, end: e.Pos(P, g) };
        }
      }
      y(f, "hasImport");
      var r = a.line, s = f(r), v;
      if (!s || f(r - 1) || (v = f(r - 2)) && v.end.line == r - 1)
        return null;
      for (var k = s.end; ; ) {
        var i = f(k.line + 1);
        if (i == null)
          break;
        k = i.end;
      }
      return { from: t.clipPos(e.Pos(r, s.startCh + 1)), to: k };
    }), e.registerHelper("fold", "include", function(t, a) {
      function f(i) {
        if (i < t.firstLine() || i > t.lastLine())
          return null;
        var n = t.getTokenAt(e.Pos(i, 1));
        if (/\S/.test(n.string) || (n = t.getTokenAt(e.Pos(i, n.end + 1))), n.type == "meta" && n.string.slice(0, 8) == "#include")
          return n.start + 8;
      }
      y(f, "hasInclude");
      var r = a.line, s = f(r);
      if (s == null || f(r - 1) != null)
        return null;
      for (var v = r; ; ) {
        var k = f(v + 1);
        if (k == null)
          break;
        ++v;
      }
      return {
        from: e.Pos(r, s + 1),
        to: t.clipPos(e.Pos(v))
      };
    });
  });
})();
var _ = w.exports;
const D = /* @__PURE__ */ (0,_codemirror_es2_js__WEBPACK_IMPORTED_MODULE_0__.g)(_), q = /* @__PURE__ */ I({
  __proto__: null,
  default: D
}, [_]);

//# sourceMappingURL=brace-fold.es.js.map


/***/ }),

/***/ 16424:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ hu),
/* harmony export */   r: () => (/* binding */ cu)
/* harmony export */ });
var su = Object.defineProperty;
var u = (He, Dn) => su(He, "name", { value: Dn, configurable: !0 });
var uu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function hu(He) {
  return He && He.__esModule && Object.prototype.hasOwnProperty.call(He, "default") ? He.default : He;
}
u(hu, "getDefaultExportFromCjs");
var Mn = { exports: {} }, Ko;
function cu() {
  return Ko || (Ko = 1, function(He, Dn) {
    (function(ie, Lr) {
      He.exports = Lr();
    })(uu, function() {
      var ie = navigator.userAgent, Lr = navigator.platform, Fe = /gecko\/\d/i.test(ie), Nn = /MSIE \d/.test(ie), An = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ie), kr = /Edge\/(\d+)/.exec(ie), O = Nn || An || kr, I = O && (Nn ? document.documentMode || 6 : +(kr || An)[1]), ne = !kr && /WebKit\//.test(ie), _o = ne && /Qt\/\d+\.\d+/.test(ie), Tr = !kr && /Chrome\//.test(ie), we = /Opera\//.test(ie), Mr = /Apple Computer/.test(navigator.vendor), Xo = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(ie), Yo = /PhantomJS/.test(ie), Ut = Mr && (/Mobile\/\w+/.test(ie) || navigator.maxTouchPoints > 2), Dr = /Android/.test(ie), Kt = Ut || Dr || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(ie), me = Ut || /Mac/.test(Lr), qo = /\bCrOS\b/.test(ie), Zo = /win/i.test(Lr), et = we && ie.match(/Version\/(\d*\.\d*)/);
      et && (et = Number(et[1])), et && et >= 15 && (we = !1, ne = !0);
      var On = me && (_o || we && (et == null || et < 12.11)), ci = Fe || O && I >= 9;
      function mt(e) {
        return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*");
      }
      u(mt, "classTest");
      var tt = /* @__PURE__ */ u(function(e, t) {
        var i = e.className, r = mt(t).exec(i);
        if (r) {
          var n = i.slice(r.index + r[0].length);
          e.className = i.slice(0, r.index) + (n ? r[1] + n : "");
        }
      }, "rmClass");
      function Ue(e) {
        for (var t = e.childNodes.length; t > 0; --t)
          e.removeChild(e.firstChild);
        return e;
      }
      u(Ue, "removeChildren");
      function ve(e, t) {
        return Ue(e).appendChild(t);
      }
      u(ve, "removeChildrenAndAdd");
      function T(e, t, i, r) {
        var n = document.createElement(e);
        if (i && (n.className = i), r && (n.style.cssText = r), typeof t == "string")
          n.appendChild(document.createTextNode(t));
        else if (t)
          for (var l = 0; l < t.length; ++l)
            n.appendChild(t[l]);
        return n;
      }
      u(T, "elt");
      function bt(e, t, i, r) {
        var n = T(e, t, i, r);
        return n.setAttribute("role", "presentation"), n;
      }
      u(bt, "eltP");
      var rt;
      document.createRange ? rt = /* @__PURE__ */ u(function(e, t, i, r) {
        var n = document.createRange();
        return n.setEnd(r || e, i), n.setStart(e, t), n;
      }, "range") : rt = /* @__PURE__ */ u(function(e, t, i) {
        var r = document.body.createTextRange();
        try {
          r.moveToElementText(e.parentNode);
        } catch {
          return r;
        }
        return r.collapse(!0), r.moveEnd("character", i), r.moveStart("character", t), r;
      }, "range");
      function Ke(e, t) {
        if (t.nodeType == 3 && (t = t.parentNode), e.contains)
          return e.contains(t);
        do
          if (t.nodeType == 11 && (t = t.host), t == e)
            return !0;
        while (t = t.parentNode);
      }
      u(Ke, "contains");
      function be() {
        var e;
        try {
          e = document.activeElement;
        } catch {
          e = document.body || null;
        }
        for (; e && e.shadowRoot && e.shadowRoot.activeElement; )
          e = e.shadowRoot.activeElement;
        return e;
      }
      u(be, "activeElt");
      function it(e, t) {
        var i = e.className;
        mt(t).test(i) || (e.className += (i ? " " : "") + t);
      }
      u(it, "addClass");
      function di(e, t) {
        for (var i = e.split(" "), r = 0; r < i.length; r++)
          i[r] && !mt(i[r]).test(t) && (t += " " + i[r]);
        return t;
      }
      u(di, "joinClasses");
      var _t = /* @__PURE__ */ u(function(e) {
        e.select();
      }, "selectInput");
      Ut ? _t = /* @__PURE__ */ u(function(e) {
        e.selectionStart = 0, e.selectionEnd = e.value.length;
      }, "selectInput") : O && (_t = /* @__PURE__ */ u(function(e) {
        try {
          e.select();
        } catch {
        }
      }, "selectInput"));
      function pi(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return function() {
          return e.apply(null, t);
        };
      }
      u(pi, "bind");
      function nt(e, t, i) {
        t || (t = {});
        for (var r in e)
          e.hasOwnProperty(r) && (i !== !1 || !t.hasOwnProperty(r)) && (t[r] = e[r]);
        return t;
      }
      u(nt, "copyObj");
      function xe(e, t, i, r, n) {
        t == null && (t = e.search(/[^\s\u00a0]/), t == -1 && (t = e.length));
        for (var l = r || 0, o = n || 0; ; ) {
          var a = e.indexOf("	", l);
          if (a < 0 || a >= t)
            return o + (t - l);
          o += a - l, o += i - o % i, l = a + 1;
        }
      }
      u(xe, "countColumn");
      var _e = /* @__PURE__ */ u(function() {
        this.id = null, this.f = null, this.time = 0, this.handler = pi(this.onTimeout, this);
      }, "Delayed");
      _e.prototype.onTimeout = function(e) {
        e.id = 0, e.time <= +/* @__PURE__ */ new Date() ? e.f() : setTimeout(e.handler, e.time - +/* @__PURE__ */ new Date());
      }, _e.prototype.set = function(e, t) {
        this.f = t;
        var i = +/* @__PURE__ */ new Date() + e;
        (!this.id || i < this.time) && (clearTimeout(this.id), this.id = setTimeout(this.handler, e), this.time = i);
      };
      function ee(e, t) {
        for (var i = 0; i < e.length; ++i)
          if (e[i] == t)
            return i;
        return -1;
      }
      u(ee, "indexOf");
      var Wn = 50, Nr = { toString: function() {
        return "CodeMirror.Pass";
      } }, Me = { scroll: !1 }, vi = { origin: "*mouse" }, Xt = { origin: "+move" };
      function gi(e, t, i) {
        for (var r = 0, n = 0; ; ) {
          var l = e.indexOf("	", r);
          l == -1 && (l = e.length);
          var o = l - r;
          if (l == e.length || n + o >= t)
            return r + Math.min(o, t - n);
          if (n += l - r, n += i - n % i, r = l + 1, n >= t)
            return r;
        }
      }
      u(gi, "findColumn");
      var Ar = [""];
      function yi(e) {
        for (; Ar.length <= e; )
          Ar.push(H(Ar) + " ");
        return Ar[e];
      }
      u(yi, "spaceStr");
      function H(e) {
        return e[e.length - 1];
      }
      u(H, "lst");
      function Or(e, t) {
        for (var i = [], r = 0; r < e.length; r++)
          i[r] = t(e[r], r);
        return i;
      }
      u(Or, "map");
      function Qo(e, t, i) {
        for (var r = 0, n = i(t); r < e.length && i(e[r]) <= n; )
          r++;
        e.splice(r, 0, t);
      }
      u(Qo, "insertSorted");
      function Hn() {
      }
      u(Hn, "nothing");
      function Fn(e, t) {
        var i;
        return Object.create ? i = Object.create(e) : (Hn.prototype = e, i = new Hn()), t && nt(t, i), i;
      }
      u(Fn, "createObj");
      var Jo = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
      function mi(e) {
        return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Jo.test(e));
      }
      u(mi, "isWordCharBasic");
      function Wr(e, t) {
        return t ? t.source.indexOf("\\w") > -1 && mi(e) ? !0 : t.test(e) : mi(e);
      }
      u(Wr, "isWordChar");
      function Pn(e) {
        for (var t in e)
          if (e.hasOwnProperty(t) && e[t])
            return !1;
        return !0;
      }
      u(Pn, "isEmpty");
      var jo = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
      function bi(e) {
        return e.charCodeAt(0) >= 768 && jo.test(e);
      }
      u(bi, "isExtendingChar");
      function En(e, t, i) {
        for (; (i < 0 ? t > 0 : t < e.length) && bi(e.charAt(t)); )
          t += i;
        return t;
      }
      u(En, "skipExtendingChars");
      function Yt(e, t, i) {
        for (var r = t > i ? -1 : 1; ; ) {
          if (t == i)
            return t;
          var n = (t + i) / 2, l = r < 0 ? Math.ceil(n) : Math.floor(n);
          if (l == t)
            return e(l) ? t : i;
          e(l) ? i = l : t = l + r;
        }
      }
      u(Yt, "findFirst");
      function Vo(e, t, i, r) {
        if (!e)
          return r(t, i, "ltr", 0);
        for (var n = !1, l = 0; l < e.length; ++l) {
          var o = e[l];
          (o.from < i && o.to > t || t == i && o.to == t) && (r(Math.max(o.from, t), Math.min(o.to, i), o.level == 1 ? "rtl" : "ltr", l), n = !0);
        }
        n || r(t, i, "ltr");
      }
      u(Vo, "iterateBidiSections");
      var qt = null;
      function Zt(e, t, i) {
        var r;
        qt = null;
        for (var n = 0; n < e.length; ++n) {
          var l = e[n];
          if (l.from < t && l.to > t)
            return n;
          l.to == t && (l.from != l.to && i == "before" ? r = n : qt = n), l.from == t && (l.from != l.to && i != "before" ? r = n : qt = n);
        }
        return r ?? qt;
      }
      u(Zt, "getBidiPartAt");
      var $o = function() {
        var e = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN", t = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function i(f) {
          return f <= 247 ? e.charAt(f) : 1424 <= f && f <= 1524 ? "R" : 1536 <= f && f <= 1785 ? t.charAt(f - 1536) : 1774 <= f && f <= 2220 ? "r" : 8192 <= f && f <= 8203 ? "w" : f == 8204 ? "b" : "L";
        }
        u(i, "charType");
        var r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, n = /[stwN]/, l = /[LRr]/, o = /[Lb1n]/, a = /[1n]/;
        function s(f, h, c) {
          this.level = f, this.from = h, this.to = c;
        }
        return u(s, "BidiSpan"), function(f, h) {
          var c = h == "ltr" ? "L" : "R";
          if (f.length == 0 || h == "ltr" && !r.test(f))
            return !1;
          for (var p = f.length, d = [], v = 0; v < p; ++v)
            d.push(i(f.charCodeAt(v)));
          for (var g = 0, m = c; g < p; ++g) {
            var b = d[g];
            b == "m" ? d[g] = m : m = b;
          }
          for (var C = 0, x = c; C < p; ++C) {
            var w = d[C];
            w == "1" && x == "r" ? d[C] = "n" : l.test(w) && (x = w, w == "r" && (d[C] = "R"));
          }
          for (var k = 1, L = d[0]; k < p - 1; ++k) {
            var A = d[k];
            A == "+" && L == "1" && d[k + 1] == "1" ? d[k] = "1" : A == "," && L == d[k + 1] && (L == "1" || L == "n") && (d[k] = L), L = A;
          }
          for (var E = 0; E < p; ++E) {
            var j = d[E];
            if (j == ",")
              d[E] = "N";
            else if (j == "%") {
              var B = void 0;
              for (B = E + 1; B < p && d[B] == "%"; ++B)
                ;
              for (var pe = E && d[E - 1] == "!" || B < p && d[B] == "1" ? "1" : "N", fe = E; fe < B; ++fe)
                d[fe] = pe;
              E = B - 1;
            }
          }
          for (var _ = 0, he = c; _ < p; ++_) {
            var $ = d[_];
            he == "L" && $ == "1" ? d[_] = "L" : l.test($) && (he = $);
          }
          for (var Y = 0; Y < p; ++Y)
            if (n.test(d[Y])) {
              var X = void 0;
              for (X = Y + 1; X < p && n.test(d[X]); ++X)
                ;
              for (var z = (Y ? d[Y - 1] : c) == "L", ce = (X < p ? d[X] : c) == "L", zt = z == ce ? z ? "L" : "R" : c, $e = Y; $e < X; ++$e)
                d[$e] = zt;
              Y = X - 1;
            }
          for (var re = [], We, V = 0; V < p; )
            if (o.test(d[V])) {
              var kn = V;
              for (++V; V < p && o.test(d[V]); ++V)
                ;
              re.push(new s(0, kn, V));
            } else {
              var Ge = V, gt = re.length, yt = h == "rtl" ? 1 : 0;
              for (++V; V < p && d[V] != "L"; ++V)
                ;
              for (var oe = Ge; oe < V; )
                if (a.test(d[oe])) {
                  Ge < oe && (re.splice(gt, 0, new s(1, Ge, oe)), gt += yt);
                  var Gt = oe;
                  for (++oe; oe < V && a.test(d[oe]); ++oe)
                    ;
                  re.splice(gt, 0, new s(2, Gt, oe)), gt += yt, Ge = oe;
                } else
                  ++oe;
              Ge < V && re.splice(gt, 0, new s(1, Ge, V));
            }
          return h == "ltr" && (re[0].level == 1 && (We = f.match(/^\s+/)) && (re[0].from = We[0].length, re.unshift(new s(0, 0, We[0].length))), H(re).level == 1 && (We = f.match(/\s+$/)) && (H(re).to -= We[0].length, re.push(new s(0, p - We[0].length, p)))), h == "rtl" ? re.reverse() : re;
        };
      }();
      function Pe(e, t) {
        var i = e.order;
        return i == null && (i = e.order = $o(e.text, t)), i;
      }
      u(Pe, "getOrder");
      var In = [], M = /* @__PURE__ */ u(function(e, t, i) {
        if (e.addEventListener)
          e.addEventListener(t, i, !1);
        else if (e.attachEvent)
          e.attachEvent("on" + t, i);
        else {
          var r = e._handlers || (e._handlers = {});
          r[t] = (r[t] || In).concat(i);
        }
      }, "on");
      function xi(e, t) {
        return e._handlers && e._handlers[t] || In;
      }
      u(xi, "getHandlers");
      function ge(e, t, i) {
        if (e.removeEventListener)
          e.removeEventListener(t, i, !1);
        else if (e.detachEvent)
          e.detachEvent("on" + t, i);
        else {
          var r = e._handlers, n = r && r[t];
          if (n) {
            var l = ee(n, i);
            l > -1 && (r[t] = n.slice(0, l).concat(n.slice(l + 1)));
          }
        }
      }
      u(ge, "off");
      function U(e, t) {
        var i = xi(e, t);
        if (i.length)
          for (var r = Array.prototype.slice.call(arguments, 2), n = 0; n < i.length; ++n)
            i[n].apply(null, r);
      }
      u(U, "signal");
      function q(e, t, i) {
        return typeof t == "string" && (t = { type: t, preventDefault: function() {
          this.defaultPrevented = !0;
        } }), U(e, i || t.type, e, t), Ci(t) || t.codemirrorIgnore;
      }
      u(q, "signalDOMEvent");
      function Rn(e) {
        var t = e._handlers && e._handlers.cursorActivity;
        if (t)
          for (var i = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), r = 0; r < t.length; ++r)
            ee(i, t[r]) == -1 && i.push(t[r]);
      }
      u(Rn, "signalCursorActivity");
      function Ce(e, t) {
        return xi(e, t).length > 0;
      }
      u(Ce, "hasHandler");
      function xt(e) {
        e.prototype.on = function(t, i) {
          M(this, t, i);
        }, e.prototype.off = function(t, i) {
          ge(this, t, i);
        };
      }
      u(xt, "eventMixin");
      function ae(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
      }
      u(ae, "e_preventDefault");
      function Bn(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
      }
      u(Bn, "e_stopPropagation");
      function Ci(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == !1;
      }
      u(Ci, "e_defaultPrevented");
      function Qt(e) {
        ae(e), Bn(e);
      }
      u(Qt, "e_stop");
      function wi(e) {
        return e.target || e.srcElement;
      }
      u(wi, "e_target");
      function zn(e) {
        var t = e.which;
        return t == null && (e.button & 1 ? t = 1 : e.button & 2 ? t = 3 : e.button & 4 && (t = 2)), me && e.ctrlKey && t == 1 && (t = 3), t;
      }
      u(zn, "e_button");
      var ea = function() {
        if (O && I < 9)
          return !1;
        var e = T("div");
        return "draggable" in e || "dragDrop" in e;
      }(), Si;
      function ta(e) {
        if (Si == null) {
          var t = T("span", "​");
          ve(e, T("span", [t, document.createTextNode("x")])), e.firstChild.offsetHeight != 0 && (Si = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(O && I < 8));
        }
        var i = Si ? T("span", "​") : T("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
        return i.setAttribute("cm-text", ""), i;
      }
      u(ta, "zeroWidthElement");
      var Li;
      function ra(e) {
        if (Li != null)
          return Li;
        var t = ve(e, document.createTextNode("AخA")), i = rt(t, 0, 1).getBoundingClientRect(), r = rt(t, 1, 2).getBoundingClientRect();
        return Ue(e), !i || i.left == i.right ? !1 : Li = r.right - i.right < 3;
      }
      u(ra, "hasBadBidiRects");
      var ki = `

b`.split(/\n/).length != 3 ? function(e) {
        for (var t = 0, i = [], r = e.length; t <= r; ) {
          var n = e.indexOf(`
`, t);
          n == -1 && (n = e.length);
          var l = e.slice(t, e.charAt(n - 1) == "\r" ? n - 1 : n), o = l.indexOf("\r");
          o != -1 ? (i.push(l.slice(0, o)), t += o + 1) : (i.push(l), t = n + 1);
        }
        return i;
      } : function(e) {
        return e.split(/\r\n?|\n/);
      }, ia = window.getSelection ? function(e) {
        try {
          return e.selectionStart != e.selectionEnd;
        } catch {
          return !1;
        }
      } : function(e) {
        var t;
        try {
          t = e.ownerDocument.selection.createRange();
        } catch {
        }
        return !t || t.parentElement() != e ? !1 : t.compareEndPoints("StartToEnd", t) != 0;
      }, na = function() {
        var e = T("div");
        return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), typeof e.oncopy == "function");
      }(), Ti = null;
      function la(e) {
        if (Ti != null)
          return Ti;
        var t = ve(e, T("span", "x")), i = t.getBoundingClientRect(), r = rt(t, 0, 1).getBoundingClientRect();
        return Ti = Math.abs(i.left - r.left) > 1;
      }
      u(la, "hasBadZoomedRects");
      var Mi = {}, Ct = {};
      function oa(e, t) {
        arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)), Mi[e] = t;
      }
      u(oa, "defineMode");
      function aa(e, t) {
        Ct[e] = t;
      }
      u(aa, "defineMIME");
      function Hr(e) {
        if (typeof e == "string" && Ct.hasOwnProperty(e))
          e = Ct[e];
        else if (e && typeof e.name == "string" && Ct.hasOwnProperty(e.name)) {
          var t = Ct[e.name];
          typeof t == "string" && (t = { name: t }), e = Fn(t, e), e.name = t.name;
        } else {
          if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(e))
            return Hr("application/xml");
          if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(e))
            return Hr("application/json");
        }
        return typeof e == "string" ? { name: e } : e || { name: "null" };
      }
      u(Hr, "resolveMode");
      function Di(e, t) {
        t = Hr(t);
        var i = Mi[t.name];
        if (!i)
          return Di(e, "text/plain");
        var r = i(e, t);
        if (wt.hasOwnProperty(t.name)) {
          var n = wt[t.name];
          for (var l in n)
            n.hasOwnProperty(l) && (r.hasOwnProperty(l) && (r["_" + l] = r[l]), r[l] = n[l]);
        }
        if (r.name = t.name, t.helperType && (r.helperType = t.helperType), t.modeProps)
          for (var o in t.modeProps)
            r[o] = t.modeProps[o];
        return r;
      }
      u(Di, "getMode");
      var wt = {};
      function sa(e, t) {
        var i = wt.hasOwnProperty(e) ? wt[e] : wt[e] = {};
        nt(t, i);
      }
      u(sa, "extendMode");
      function lt(e, t) {
        if (t === !0)
          return t;
        if (e.copyState)
          return e.copyState(t);
        var i = {};
        for (var r in t) {
          var n = t[r];
          n instanceof Array && (n = n.concat([])), i[r] = n;
        }
        return i;
      }
      u(lt, "copyState");
      function Ni(e, t) {
        for (var i; e.innerMode && (i = e.innerMode(t), !(!i || i.mode == e)); )
          t = i.state, e = i.mode;
        return i || { mode: e, state: t };
      }
      u(Ni, "innerMode");
      function Gn(e, t, i) {
        return e.startState ? e.startState(t, i) : !0;
      }
      u(Gn, "startState");
      var K = /* @__PURE__ */ u(function(e, t, i) {
        this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0, this.lineOracle = i;
      }, "StringStream");
      K.prototype.eol = function() {
        return this.pos >= this.string.length;
      }, K.prototype.sol = function() {
        return this.pos == this.lineStart;
      }, K.prototype.peek = function() {
        return this.string.charAt(this.pos) || void 0;
      }, K.prototype.next = function() {
        if (this.pos < this.string.length)
          return this.string.charAt(this.pos++);
      }, K.prototype.eat = function(e) {
        var t = this.string.charAt(this.pos), i;
        if (typeof e == "string" ? i = t == e : i = t && (e.test ? e.test(t) : e(t)), i)
          return ++this.pos, t;
      }, K.prototype.eatWhile = function(e) {
        for (var t = this.pos; this.eat(e); )
          ;
        return this.pos > t;
      }, K.prototype.eatSpace = function() {
        for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
          ++this.pos;
        return this.pos > e;
      }, K.prototype.skipToEnd = function() {
        this.pos = this.string.length;
      }, K.prototype.skipTo = function(e) {
        var t = this.string.indexOf(e, this.pos);
        if (t > -1)
          return this.pos = t, !0;
      }, K.prototype.backUp = function(e) {
        this.pos -= e;
      }, K.prototype.column = function() {
        return this.lastColumnPos < this.start && (this.lastColumnValue = xe(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? xe(this.string, this.lineStart, this.tabSize) : 0);
      }, K.prototype.indentation = function() {
        return xe(this.string, null, this.tabSize) - (this.lineStart ? xe(this.string, this.lineStart, this.tabSize) : 0);
      }, K.prototype.match = function(e, t, i) {
        if (typeof e == "string") {
          var r = /* @__PURE__ */ u(function(o) {
            return i ? o.toLowerCase() : o;
          }, "cased"), n = this.string.substr(this.pos, e.length);
          if (r(n) == r(e))
            return t !== !1 && (this.pos += e.length), !0;
        } else {
          var l = this.string.slice(this.pos).match(e);
          return l && l.index > 0 ? null : (l && t !== !1 && (this.pos += l[0].length), l);
        }
      }, K.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
      }, K.prototype.hideFirstChars = function(e, t) {
        this.lineStart += e;
        try {
          return t();
        } finally {
          this.lineStart -= e;
        }
      }, K.prototype.lookAhead = function(e) {
        var t = this.lineOracle;
        return t && t.lookAhead(e);
      }, K.prototype.baseToken = function() {
        var e = this.lineOracle;
        return e && e.baseToken(this.pos);
      };
      function S(e, t) {
        if (t -= e.first, t < 0 || t >= e.size)
          throw new Error("There is no line " + (t + e.first) + " in the document.");
        for (var i = e; !i.lines; )
          for (var r = 0; ; ++r) {
            var n = i.children[r], l = n.chunkSize();
            if (t < l) {
              i = n;
              break;
            }
            t -= l;
          }
        return i.lines[t];
      }
      u(S, "getLine");
      function ot(e, t, i) {
        var r = [], n = t.line;
        return e.iter(t.line, i.line + 1, function(l) {
          var o = l.text;
          n == i.line && (o = o.slice(0, i.ch)), n == t.line && (o = o.slice(t.ch)), r.push(o), ++n;
        }), r;
      }
      u(ot, "getBetween");
      function Ai(e, t, i) {
        var r = [];
        return e.iter(t, i, function(n) {
          r.push(n.text);
        }), r;
      }
      u(Ai, "getLines");
      function De(e, t) {
        var i = t - e.height;
        if (i)
          for (var r = e; r; r = r.parent)
            r.height += i;
      }
      u(De, "updateLineHeight");
      function F(e) {
        if (e.parent == null)
          return null;
        for (var t = e.parent, i = ee(t.lines, e), r = t.parent; r; t = r, r = r.parent)
          for (var n = 0; r.children[n] != t; ++n)
            i += r.children[n].chunkSize();
        return i + t.first;
      }
      u(F, "lineNo");
      function at(e, t) {
        var i = e.first;
        e:
          do {
            for (var r = 0; r < e.children.length; ++r) {
              var n = e.children[r], l = n.height;
              if (t < l) {
                e = n;
                continue e;
              }
              t -= l, i += n.chunkSize();
            }
            return i;
          } while (!e.lines);
        for (var o = 0; o < e.lines.length; ++o) {
          var a = e.lines[o], s = a.height;
          if (t < s)
            break;
          t -= s;
        }
        return i + o;
      }
      u(at, "lineAtHeight");
      function Jt(e, t) {
        return t >= e.first && t < e.first + e.size;
      }
      u(Jt, "isLine");
      function Oi(e, t) {
        return String(e.lineNumberFormatter(t + e.firstLineNumber));
      }
      u(Oi, "lineNumberFor");
      function y(e, t, i) {
        if (i === void 0 && (i = null), !(this instanceof y))
          return new y(e, t, i);
        this.line = e, this.ch = t, this.sticky = i;
      }
      u(y, "Pos");
      function D(e, t) {
        return e.line - t.line || e.ch - t.ch;
      }
      u(D, "cmp");
      function Wi(e, t) {
        return e.sticky == t.sticky && D(e, t) == 0;
      }
      u(Wi, "equalCursorPos");
      function Hi(e) {
        return y(e.line, e.ch);
      }
      u(Hi, "copyPos");
      function Fr(e, t) {
        return D(e, t) < 0 ? t : e;
      }
      u(Fr, "maxPos");
      function Pr(e, t) {
        return D(e, t) < 0 ? e : t;
      }
      u(Pr, "minPos");
      function Un(e, t) {
        return Math.max(e.first, Math.min(t, e.first + e.size - 1));
      }
      u(Un, "clipLine");
      function N(e, t) {
        if (t.line < e.first)
          return y(e.first, 0);
        var i = e.first + e.size - 1;
        return t.line > i ? y(i, S(e, i).text.length) : ua(t, S(e, t.line).text.length);
      }
      u(N, "clipPos");
      function ua(e, t) {
        var i = e.ch;
        return i == null || i > t ? y(e.line, t) : i < 0 ? y(e.line, 0) : e;
      }
      u(ua, "clipToLen");
      function Kn(e, t) {
        for (var i = [], r = 0; r < t.length; r++)
          i[r] = N(e, t[r]);
        return i;
      }
      u(Kn, "clipPosArray");
      var Er = /* @__PURE__ */ u(function(e, t) {
        this.state = e, this.lookAhead = t;
      }, "SavedContext"), Ne = /* @__PURE__ */ u(function(e, t, i, r) {
        this.state = t, this.doc = e, this.line = i, this.maxLookAhead = r || 0, this.baseTokens = null, this.baseTokenPos = 1;
      }, "Context");
      Ne.prototype.lookAhead = function(e) {
        var t = this.doc.getLine(this.line + e);
        return t != null && e > this.maxLookAhead && (this.maxLookAhead = e), t;
      }, Ne.prototype.baseToken = function(e) {
        if (!this.baseTokens)
          return null;
        for (; this.baseTokens[this.baseTokenPos] <= e; )
          this.baseTokenPos += 2;
        var t = this.baseTokens[this.baseTokenPos + 1];
        return {
          type: t && t.replace(/( |^)overlay .*/, ""),
          size: this.baseTokens[this.baseTokenPos] - e
        };
      }, Ne.prototype.nextLine = function() {
        this.line++, this.maxLookAhead > 0 && this.maxLookAhead--;
      }, Ne.fromSaved = function(e, t, i) {
        return t instanceof Er ? new Ne(e, lt(e.mode, t.state), i, t.lookAhead) : new Ne(e, lt(e.mode, t), i);
      }, Ne.prototype.save = function(e) {
        var t = e !== !1 ? lt(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new Er(t, this.maxLookAhead) : t;
      };
      function _n(e, t, i, r) {
        var n = [e.state.modeGen], l = {};
        Jn(
          e,
          t.text,
          e.doc.mode,
          i,
          function(f, h) {
            return n.push(f, h);
          },
          l,
          r
        );
        for (var o = i.state, a = /* @__PURE__ */ u(function(f) {
          i.baseTokens = n;
          var h = e.state.overlays[f], c = 1, p = 0;
          i.state = !0, Jn(e, t.text, h.mode, i, function(d, v) {
            for (var g = c; p < d; ) {
              var m = n[c];
              m > d && n.splice(c, 1, d, n[c + 1], m), c += 2, p = Math.min(d, m);
            }
            if (v)
              if (h.opaque)
                n.splice(g, c - g, d, "overlay " + v), c = g + 2;
              else
                for (; g < c; g += 2) {
                  var b = n[g + 1];
                  n[g + 1] = (b ? b + " " : "") + "overlay " + v;
                }
          }, l), i.state = o, i.baseTokens = null, i.baseTokenPos = 1;
        }, "loop"), s = 0; s < e.state.overlays.length; ++s)
          a(s);
        return { styles: n, classes: l.bgClass || l.textClass ? l : null };
      }
      u(_n, "highlightLine");
      function Xn(e, t, i) {
        if (!t.styles || t.styles[0] != e.state.modeGen) {
          var r = jt(e, F(t)), n = t.text.length > e.options.maxHighlightLength && lt(e.doc.mode, r.state), l = _n(e, t, r);
          n && (r.state = n), t.stateAfter = r.save(!n), t.styles = l.styles, l.classes ? t.styleClasses = l.classes : t.styleClasses && (t.styleClasses = null), i === e.doc.highlightFrontier && (e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier));
        }
        return t.styles;
      }
      u(Xn, "getLineStyles");
      function jt(e, t, i) {
        var r = e.doc, n = e.display;
        if (!r.mode.startState)
          return new Ne(r, !0, t);
        var l = fa(e, t, i), o = l > r.first && S(r, l - 1).stateAfter, a = o ? Ne.fromSaved(r, o, l) : new Ne(r, Gn(r.mode), l);
        return r.iter(l, t, function(s) {
          Fi(e, s.text, a);
          var f = a.line;
          s.stateAfter = f == t - 1 || f % 5 == 0 || f >= n.viewFrom && f < n.viewTo ? a.save() : null, a.nextLine();
        }), i && (r.modeFrontier = a.line), a;
      }
      u(jt, "getContextBefore");
      function Fi(e, t, i, r) {
        var n = e.doc.mode, l = new K(t, e.options.tabSize, i);
        for (l.start = l.pos = r || 0, t == "" && Yn(n, i.state); !l.eol(); )
          Pi(n, l, i.state), l.start = l.pos;
      }
      u(Fi, "processLine");
      function Yn(e, t) {
        if (e.blankLine)
          return e.blankLine(t);
        if (e.innerMode) {
          var i = Ni(e, t);
          if (i.mode.blankLine)
            return i.mode.blankLine(i.state);
        }
      }
      u(Yn, "callBlankLine");
      function Pi(e, t, i, r) {
        for (var n = 0; n < 10; n++) {
          r && (r[0] = Ni(e, i).mode);
          var l = e.token(t, i);
          if (t.pos > t.start)
            return l;
        }
        throw new Error("Mode " + e.name + " failed to advance stream.");
      }
      u(Pi, "readToken");
      var qn = /* @__PURE__ */ u(function(e, t, i) {
        this.start = e.start, this.end = e.pos, this.string = e.current(), this.type = t || null, this.state = i;
      }, "Token");
      function Zn(e, t, i, r) {
        var n = e.doc, l = n.mode, o;
        t = N(n, t);
        var a = S(n, t.line), s = jt(e, t.line, i), f = new K(a.text, e.options.tabSize, s), h;
        for (r && (h = []); (r || f.pos < t.ch) && !f.eol(); )
          f.start = f.pos, o = Pi(l, f, s.state), r && h.push(new qn(f, o, lt(n.mode, s.state)));
        return r ? h : new qn(f, o, s.state);
      }
      u(Zn, "takeToken");
      function Qn(e, t) {
        if (e)
          for (; ; ) {
            var i = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!i)
              break;
            e = e.slice(0, i.index) + e.slice(i.index + i[0].length);
            var r = i[1] ? "bgClass" : "textClass";
            t[r] == null ? t[r] = i[2] : new RegExp("(?:^|\\s)" + i[2] + "(?:$|\\s)").test(t[r]) || (t[r] += " " + i[2]);
          }
        return e;
      }
      u(Qn, "extractLineClasses");
      function Jn(e, t, i, r, n, l, o) {
        var a = i.flattenSpans;
        a == null && (a = e.options.flattenSpans);
        var s = 0, f = null, h = new K(t, e.options.tabSize, r), c, p = e.options.addModeClass && [null];
        for (t == "" && Qn(Yn(i, r.state), l); !h.eol(); ) {
          if (h.pos > e.options.maxHighlightLength ? (a = !1, o && Fi(e, t, r, h.pos), h.pos = t.length, c = null) : c = Qn(Pi(i, h, r.state, p), l), p) {
            var d = p[0].name;
            d && (c = "m-" + (c ? d + " " + c : d));
          }
          if (!a || f != c) {
            for (; s < h.start; )
              s = Math.min(h.start, s + 5e3), n(s, f);
            f = c;
          }
          h.start = h.pos;
        }
        for (; s < h.pos; ) {
          var v = Math.min(h.pos, s + 5e3);
          n(v, f), s = v;
        }
      }
      u(Jn, "runMode");
      function fa(e, t, i) {
        for (var r, n, l = e.doc, o = i ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), a = t; a > o; --a) {
          if (a <= l.first)
            return l.first;
          var s = S(l, a - 1), f = s.stateAfter;
          if (f && (!i || a + (f instanceof Er ? f.lookAhead : 0) <= l.modeFrontier))
            return a;
          var h = xe(s.text, null, e.options.tabSize);
          (n == null || r > h) && (n = a - 1, r = h);
        }
        return n;
      }
      u(fa, "findStartLine");
      function ha(e, t) {
        if (e.modeFrontier = Math.min(e.modeFrontier, t), !(e.highlightFrontier < t - 10)) {
          for (var i = e.first, r = t - 1; r > i; r--) {
            var n = S(e, r).stateAfter;
            if (n && (!(n instanceof Er) || r + n.lookAhead < t)) {
              i = r + 1;
              break;
            }
          }
          e.highlightFrontier = Math.min(e.highlightFrontier, i);
        }
      }
      u(ha, "retreatFrontier");
      var jn = !1, Ee = !1;
      function ca() {
        jn = !0;
      }
      u(ca, "seeReadOnlySpans");
      function da() {
        Ee = !0;
      }
      u(da, "seeCollapsedSpans");
      function Ir(e, t, i) {
        this.marker = e, this.from = t, this.to = i;
      }
      u(Ir, "MarkedSpan");
      function Vt(e, t) {
        if (e)
          for (var i = 0; i < e.length; ++i) {
            var r = e[i];
            if (r.marker == t)
              return r;
          }
      }
      u(Vt, "getMarkedSpanFor");
      function pa(e, t) {
        for (var i, r = 0; r < e.length; ++r)
          e[r] != t && (i || (i = [])).push(e[r]);
        return i;
      }
      u(pa, "removeMarkedSpan");
      function va(e, t, i) {
        var r = i && window.WeakSet && (i.markedSpans || (i.markedSpans = /* @__PURE__ */ new WeakSet()));
        r && e.markedSpans && r.has(e.markedSpans) ? e.markedSpans.push(t) : (e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], r && r.add(e.markedSpans)), t.marker.attachLine(e);
      }
      u(va, "addMarkedSpan");
      function ga(e, t, i) {
        var r;
        if (e)
          for (var n = 0; n < e.length; ++n) {
            var l = e[n], o = l.marker, a = l.from == null || (o.inclusiveLeft ? l.from <= t : l.from < t);
            if (a || l.from == t && o.type == "bookmark" && (!i || !l.marker.insertLeft)) {
              var s = l.to == null || (o.inclusiveRight ? l.to >= t : l.to > t);
              (r || (r = [])).push(new Ir(o, l.from, s ? null : l.to));
            }
          }
        return r;
      }
      u(ga, "markedSpansBefore");
      function ya(e, t, i) {
        var r;
        if (e)
          for (var n = 0; n < e.length; ++n) {
            var l = e[n], o = l.marker, a = l.to == null || (o.inclusiveRight ? l.to >= t : l.to > t);
            if (a || l.from == t && o.type == "bookmark" && (!i || l.marker.insertLeft)) {
              var s = l.from == null || (o.inclusiveLeft ? l.from <= t : l.from < t);
              (r || (r = [])).push(new Ir(
                o,
                s ? null : l.from - t,
                l.to == null ? null : l.to - t
              ));
            }
          }
        return r;
      }
      u(ya, "markedSpansAfter");
      function Ei(e, t) {
        if (t.full)
          return null;
        var i = Jt(e, t.from.line) && S(e, t.from.line).markedSpans, r = Jt(e, t.to.line) && S(e, t.to.line).markedSpans;
        if (!i && !r)
          return null;
        var n = t.from.ch, l = t.to.ch, o = D(t.from, t.to) == 0, a = ga(i, n, o), s = ya(r, l, o), f = t.text.length == 1, h = H(t.text).length + (f ? n : 0);
        if (a)
          for (var c = 0; c < a.length; ++c) {
            var p = a[c];
            if (p.to == null) {
              var d = Vt(s, p.marker);
              d ? f && (p.to = d.to == null ? null : d.to + h) : p.to = n;
            }
          }
        if (s)
          for (var v = 0; v < s.length; ++v) {
            var g = s[v];
            if (g.to != null && (g.to += h), g.from == null) {
              var m = Vt(a, g.marker);
              m || (g.from = h, f && (a || (a = [])).push(g));
            } else
              g.from += h, f && (a || (a = [])).push(g);
          }
        a && (a = Vn(a)), s && s != a && (s = Vn(s));
        var b = [a];
        if (!f) {
          var C = t.text.length - 2, x;
          if (C > 0 && a)
            for (var w = 0; w < a.length; ++w)
              a[w].to == null && (x || (x = [])).push(new Ir(a[w].marker, null, null));
          for (var k = 0; k < C; ++k)
            b.push(x);
          b.push(s);
        }
        return b;
      }
      u(Ei, "stretchSpansOverChange");
      function Vn(e) {
        for (var t = 0; t < e.length; ++t) {
          var i = e[t];
          i.from != null && i.from == i.to && i.marker.clearWhenEmpty !== !1 && e.splice(t--, 1);
        }
        return e.length ? e : null;
      }
      u(Vn, "clearEmptySpans");
      function ma(e, t, i) {
        var r = null;
        if (e.iter(t.line, i.line + 1, function(d) {
          if (d.markedSpans)
            for (var v = 0; v < d.markedSpans.length; ++v) {
              var g = d.markedSpans[v].marker;
              g.readOnly && (!r || ee(r, g) == -1) && (r || (r = [])).push(g);
            }
        }), !r)
          return null;
        for (var n = [{ from: t, to: i }], l = 0; l < r.length; ++l)
          for (var o = r[l], a = o.find(0), s = 0; s < n.length; ++s) {
            var f = n[s];
            if (!(D(f.to, a.from) < 0 || D(f.from, a.to) > 0)) {
              var h = [s, 1], c = D(f.from, a.from), p = D(f.to, a.to);
              (c < 0 || !o.inclusiveLeft && !c) && h.push({ from: f.from, to: a.from }), (p > 0 || !o.inclusiveRight && !p) && h.push({ from: a.to, to: f.to }), n.splice.apply(n, h), s += h.length - 3;
            }
          }
        return n;
      }
      u(ma, "removeReadOnlyRanges");
      function $n(e) {
        var t = e.markedSpans;
        if (t) {
          for (var i = 0; i < t.length; ++i)
            t[i].marker.detachLine(e);
          e.markedSpans = null;
        }
      }
      u($n, "detachMarkedSpans");
      function el(e, t) {
        if (t) {
          for (var i = 0; i < t.length; ++i)
            t[i].marker.attachLine(e);
          e.markedSpans = t;
        }
      }
      u(el, "attachMarkedSpans");
      function Rr(e) {
        return e.inclusiveLeft ? -1 : 0;
      }
      u(Rr, "extraLeft");
      function Br(e) {
        return e.inclusiveRight ? 1 : 0;
      }
      u(Br, "extraRight");
      function Ii(e, t) {
        var i = e.lines.length - t.lines.length;
        if (i != 0)
          return i;
        var r = e.find(), n = t.find(), l = D(r.from, n.from) || Rr(e) - Rr(t);
        if (l)
          return -l;
        var o = D(r.to, n.to) || Br(e) - Br(t);
        return o || t.id - e.id;
      }
      u(Ii, "compareCollapsedMarkers");
      function tl(e, t) {
        var i = Ee && e.markedSpans, r;
        if (i)
          for (var n = void 0, l = 0; l < i.length; ++l)
            n = i[l], n.marker.collapsed && (t ? n.from : n.to) == null && (!r || Ii(r, n.marker) < 0) && (r = n.marker);
        return r;
      }
      u(tl, "collapsedSpanAtSide");
      function rl(e) {
        return tl(e, !0);
      }
      u(rl, "collapsedSpanAtStart");
      function zr(e) {
        return tl(e, !1);
      }
      u(zr, "collapsedSpanAtEnd");
      function ba(e, t) {
        var i = Ee && e.markedSpans, r;
        if (i)
          for (var n = 0; n < i.length; ++n) {
            var l = i[n];
            l.marker.collapsed && (l.from == null || l.from < t) && (l.to == null || l.to > t) && (!r || Ii(r, l.marker) < 0) && (r = l.marker);
          }
        return r;
      }
      u(ba, "collapsedSpanAround");
      function il(e, t, i, r, n) {
        var l = S(e, t), o = Ee && l.markedSpans;
        if (o)
          for (var a = 0; a < o.length; ++a) {
            var s = o[a];
            if (s.marker.collapsed) {
              var f = s.marker.find(0), h = D(f.from, i) || Rr(s.marker) - Rr(n), c = D(f.to, r) || Br(s.marker) - Br(n);
              if (!(h >= 0 && c <= 0 || h <= 0 && c >= 0) && (h <= 0 && (s.marker.inclusiveRight && n.inclusiveLeft ? D(f.to, i) >= 0 : D(f.to, i) > 0) || h >= 0 && (s.marker.inclusiveRight && n.inclusiveLeft ? D(f.from, r) <= 0 : D(f.from, r) < 0)))
                return !0;
            }
          }
      }
      u(il, "conflictingCollapsedRange");
      function Se(e) {
        for (var t; t = rl(e); )
          e = t.find(-1, !0).line;
        return e;
      }
      u(Se, "visualLine");
      function xa(e) {
        for (var t; t = zr(e); )
          e = t.find(1, !0).line;
        return e;
      }
      u(xa, "visualLineEnd");
      function Ca(e) {
        for (var t, i; t = zr(e); )
          e = t.find(1, !0).line, (i || (i = [])).push(e);
        return i;
      }
      u(Ca, "visualLineContinued");
      function Ri(e, t) {
        var i = S(e, t), r = Se(i);
        return i == r ? t : F(r);
      }
      u(Ri, "visualLineNo");
      function nl(e, t) {
        if (t > e.lastLine())
          return t;
        var i = S(e, t), r;
        if (!Xe(e, i))
          return t;
        for (; r = zr(i); )
          i = r.find(1, !0).line;
        return F(i) + 1;
      }
      u(nl, "visualLineEndNo");
      function Xe(e, t) {
        var i = Ee && t.markedSpans;
        if (i) {
          for (var r = void 0, n = 0; n < i.length; ++n)
            if (r = i[n], !!r.marker.collapsed) {
              if (r.from == null)
                return !0;
              if (!r.marker.widgetNode && r.from == 0 && r.marker.inclusiveLeft && Bi(e, t, r))
                return !0;
            }
        }
      }
      u(Xe, "lineIsHidden");
      function Bi(e, t, i) {
        if (i.to == null) {
          var r = i.marker.find(1, !0);
          return Bi(e, r.line, Vt(r.line.markedSpans, i.marker));
        }
        if (i.marker.inclusiveRight && i.to == t.text.length)
          return !0;
        for (var n = void 0, l = 0; l < t.markedSpans.length; ++l)
          if (n = t.markedSpans[l], n.marker.collapsed && !n.marker.widgetNode && n.from == i.to && (n.to == null || n.to != i.from) && (n.marker.inclusiveLeft || i.marker.inclusiveRight) && Bi(e, t, n))
            return !0;
      }
      u(Bi, "lineIsHiddenInner");
      function Ie(e) {
        e = Se(e);
        for (var t = 0, i = e.parent, r = 0; r < i.lines.length; ++r) {
          var n = i.lines[r];
          if (n == e)
            break;
          t += n.height;
        }
        for (var l = i.parent; l; i = l, l = i.parent)
          for (var o = 0; o < l.children.length; ++o) {
            var a = l.children[o];
            if (a == i)
              break;
            t += a.height;
          }
        return t;
      }
      u(Ie, "heightAtLine");
      function Gr(e) {
        if (e.height == 0)
          return 0;
        for (var t = e.text.length, i, r = e; i = rl(r); ) {
          var n = i.find(0, !0);
          r = n.from.line, t += n.from.ch - n.to.ch;
        }
        for (r = e; i = zr(r); ) {
          var l = i.find(0, !0);
          t -= r.text.length - l.from.ch, r = l.to.line, t += r.text.length - l.to.ch;
        }
        return t;
      }
      u(Gr, "lineLength");
      function zi(e) {
        var t = e.display, i = e.doc;
        t.maxLine = S(i, i.first), t.maxLineLength = Gr(t.maxLine), t.maxLineChanged = !0, i.iter(function(r) {
          var n = Gr(r);
          n > t.maxLineLength && (t.maxLineLength = n, t.maxLine = r);
        });
      }
      u(zi, "findMaxLine");
      var St = /* @__PURE__ */ u(function(e, t, i) {
        this.text = e, el(this, t), this.height = i ? i(this) : 1;
      }, "Line");
      St.prototype.lineNo = function() {
        return F(this);
      }, xt(St);
      function wa(e, t, i, r) {
        e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), e.order != null && (e.order = null), $n(e), el(e, i);
        var n = r ? r(e) : 1;
        n != e.height && De(e, n);
      }
      u(wa, "updateLine");
      function Sa(e) {
        e.parent = null, $n(e);
      }
      u(Sa, "cleanUpLine");
      var La = {}, ka = {};
      function ll(e, t) {
        if (!e || /^\s*$/.test(e))
          return null;
        var i = t.addModeClass ? ka : La;
        return i[e] || (i[e] = e.replace(/\S+/g, "cm-$&"));
      }
      u(ll, "interpretTokenStyle");
      function ol(e, t) {
        var i = bt("span", null, null, ne ? "padding-right: .1px" : null), r = {
          pre: bt("pre", [i], "CodeMirror-line"),
          content: i,
          col: 0,
          pos: 0,
          cm: e,
          trailingSpace: !1,
          splitSpaces: e.getOption("lineWrapping")
        };
        t.measure = {};
        for (var n = 0; n <= (t.rest ? t.rest.length : 0); n++) {
          var l = n ? t.rest[n - 1] : t.line, o = void 0;
          r.pos = 0, r.addToken = Ma, ra(e.display.measure) && (o = Pe(l, e.doc.direction)) && (r.addToken = Na(r.addToken, o)), r.map = [];
          var a = t != e.display.externalMeasured && F(l);
          Aa(l, r, Xn(e, l, a)), l.styleClasses && (l.styleClasses.bgClass && (r.bgClass = di(l.styleClasses.bgClass, r.bgClass || "")), l.styleClasses.textClass && (r.textClass = di(l.styleClasses.textClass, r.textClass || ""))), r.map.length == 0 && r.map.push(0, 0, r.content.appendChild(ta(e.display.measure))), n == 0 ? (t.measure.map = r.map, t.measure.cache = {}) : ((t.measure.maps || (t.measure.maps = [])).push(r.map), (t.measure.caches || (t.measure.caches = [])).push({}));
        }
        if (ne) {
          var s = r.content.lastChild;
          (/\bcm-tab\b/.test(s.className) || s.querySelector && s.querySelector(".cm-tab")) && (r.content.className = "cm-tab-wrap-hack");
        }
        return U(e, "renderLine", e, t.line, r.pre), r.pre.className && (r.textClass = di(r.pre.className, r.textClass || "")), r;
      }
      u(ol, "buildLineContent");
      function Ta(e) {
        var t = T("span", "•", "cm-invalidchar");
        return t.title = "\\u" + e.charCodeAt(0).toString(16), t.setAttribute("aria-label", t.title), t;
      }
      u(Ta, "defaultSpecialCharPlaceholder");
      function Ma(e, t, i, r, n, l, o) {
        if (t) {
          var a = e.splitSpaces ? Da(t, e.trailingSpace) : t, s = e.cm.state.specialChars, f = !1, h;
          if (!s.test(t))
            e.col += t.length, h = document.createTextNode(a), e.map.push(e.pos, e.pos + t.length, h), O && I < 9 && (f = !0), e.pos += t.length;
          else {
            h = document.createDocumentFragment();
            for (var c = 0; ; ) {
              s.lastIndex = c;
              var p = s.exec(t), d = p ? p.index - c : t.length - c;
              if (d) {
                var v = document.createTextNode(a.slice(c, c + d));
                O && I < 9 ? h.appendChild(T("span", [v])) : h.appendChild(v), e.map.push(e.pos, e.pos + d, v), e.col += d, e.pos += d;
              }
              if (!p)
                break;
              c += d + 1;
              var g = void 0;
              if (p[0] == "	") {
                var m = e.cm.options.tabSize, b = m - e.col % m;
                g = h.appendChild(T("span", yi(b), "cm-tab")), g.setAttribute("role", "presentation"), g.setAttribute("cm-text", "	"), e.col += b;
              } else
                p[0] == "\r" || p[0] == `
` ? (g = h.appendChild(T("span", p[0] == "\r" ? "␍" : "␤", "cm-invalidchar")), g.setAttribute("cm-text", p[0]), e.col += 1) : (g = e.cm.options.specialCharPlaceholder(p[0]), g.setAttribute("cm-text", p[0]), O && I < 9 ? h.appendChild(T("span", [g])) : h.appendChild(g), e.col += 1);
              e.map.push(e.pos, e.pos + 1, g), e.pos++;
            }
          }
          if (e.trailingSpace = a.charCodeAt(t.length - 1) == 32, i || r || n || f || l || o) {
            var C = i || "";
            r && (C += r), n && (C += n);
            var x = T("span", [h], C, l);
            if (o)
              for (var w in o)
                o.hasOwnProperty(w) && w != "style" && w != "class" && x.setAttribute(w, o[w]);
            return e.content.appendChild(x);
          }
          e.content.appendChild(h);
        }
      }
      u(Ma, "buildToken");
      function Da(e, t) {
        if (e.length > 1 && !/  /.test(e))
          return e;
        for (var i = t, r = "", n = 0; n < e.length; n++) {
          var l = e.charAt(n);
          l == " " && i && (n == e.length - 1 || e.charCodeAt(n + 1) == 32) && (l = " "), r += l, i = l == " ";
        }
        return r;
      }
      u(Da, "splitSpaces");
      function Na(e, t) {
        return function(i, r, n, l, o, a, s) {
          n = n ? n + " cm-force-border" : "cm-force-border";
          for (var f = i.pos, h = f + r.length; ; ) {
            for (var c = void 0, p = 0; p < t.length && (c = t[p], !(c.to > f && c.from <= f)); p++)
              ;
            if (c.to >= h)
              return e(i, r, n, l, o, a, s);
            e(i, r.slice(0, c.to - f), n, l, null, a, s), l = null, r = r.slice(c.to - f), f = c.to;
          }
        };
      }
      u(Na, "buildTokenBadBidi");
      function al(e, t, i, r) {
        var n = !r && i.widgetNode;
        n && e.map.push(e.pos, e.pos + t, n), !r && e.cm.display.input.needsContentAttribute && (n || (n = e.content.appendChild(document.createElement("span"))), n.setAttribute("cm-marker", i.id)), n && (e.cm.display.input.setUneditable(n), e.content.appendChild(n)), e.pos += t, e.trailingSpace = !1;
      }
      u(al, "buildCollapsedSpan");
      function Aa(e, t, i) {
        var r = e.markedSpans, n = e.text, l = 0;
        if (!r) {
          for (var o = 1; o < i.length; o += 2)
            t.addToken(t, n.slice(l, l = i[o]), ll(i[o + 1], t.cm.options));
          return;
        }
        for (var a = n.length, s = 0, f = 1, h = "", c, p, d = 0, v, g, m, b, C; ; ) {
          if (d == s) {
            v = g = m = p = "", C = null, b = null, d = 1 / 0;
            for (var x = [], w = void 0, k = 0; k < r.length; ++k) {
              var L = r[k], A = L.marker;
              if (A.type == "bookmark" && L.from == s && A.widgetNode)
                x.push(A);
              else if (L.from <= s && (L.to == null || L.to > s || A.collapsed && L.to == s && L.from == s)) {
                if (L.to != null && L.to != s && d > L.to && (d = L.to, g = ""), A.className && (v += " " + A.className), A.css && (p = (p ? p + ";" : "") + A.css), A.startStyle && L.from == s && (m += " " + A.startStyle), A.endStyle && L.to == d && (w || (w = [])).push(A.endStyle, L.to), A.title && ((C || (C = {})).title = A.title), A.attributes)
                  for (var E in A.attributes)
                    (C || (C = {}))[E] = A.attributes[E];
                A.collapsed && (!b || Ii(b.marker, A) < 0) && (b = L);
              } else
                L.from > s && d > L.from && (d = L.from);
            }
            if (w)
              for (var j = 0; j < w.length; j += 2)
                w[j + 1] == d && (g += " " + w[j]);
            if (!b || b.from == s)
              for (var B = 0; B < x.length; ++B)
                al(t, 0, x[B]);
            if (b && (b.from || 0) == s) {
              if (al(
                t,
                (b.to == null ? a + 1 : b.to) - s,
                b.marker,
                b.from == null
              ), b.to == null)
                return;
              b.to == s && (b = !1);
            }
          }
          if (s >= a)
            break;
          for (var pe = Math.min(a, d); ; ) {
            if (h) {
              var fe = s + h.length;
              if (!b) {
                var _ = fe > pe ? h.slice(0, pe - s) : h;
                t.addToken(
                  t,
                  _,
                  c ? c + v : v,
                  m,
                  s + _.length == d ? g : "",
                  p,
                  C
                );
              }
              if (fe >= pe) {
                h = h.slice(pe - s), s = pe;
                break;
              }
              s = fe, m = "";
            }
            h = n.slice(l, l = i[f++]), c = ll(i[f++], t.cm.options);
          }
        }
      }
      u(Aa, "insertLineContent");
      function sl(e, t, i) {
        this.line = t, this.rest = Ca(t), this.size = this.rest ? F(H(this.rest)) - i + 1 : 1, this.node = this.text = null, this.hidden = Xe(e, t);
      }
      u(sl, "LineView");
      function Ur(e, t, i) {
        for (var r = [], n, l = t; l < i; l = n) {
          var o = new sl(e.doc, S(e.doc, l), l);
          n = l + o.size, r.push(o);
        }
        return r;
      }
      u(Ur, "buildViewArray");
      var Lt = null;
      function Oa(e) {
        Lt ? Lt.ops.push(e) : e.ownsGroup = Lt = {
          ops: [e],
          delayedCallbacks: []
        };
      }
      u(Oa, "pushOperation");
      function Wa(e) {
        var t = e.delayedCallbacks, i = 0;
        do {
          for (; i < t.length; i++)
            t[i].call(null);
          for (var r = 0; r < e.ops.length; r++) {
            var n = e.ops[r];
            if (n.cursorActivityHandlers)
              for (; n.cursorActivityCalled < n.cursorActivityHandlers.length; )
                n.cursorActivityHandlers[n.cursorActivityCalled++].call(null, n.cm);
          }
        } while (i < t.length);
      }
      u(Wa, "fireCallbacksForOps");
      function Ha(e, t) {
        var i = e.ownsGroup;
        if (i)
          try {
            Wa(i);
          } finally {
            Lt = null, t(i);
          }
      }
      u(Ha, "finishOperation");
      var $t = null;
      function Z(e, t) {
        var i = xi(e, t);
        if (i.length) {
          var r = Array.prototype.slice.call(arguments, 2), n;
          Lt ? n = Lt.delayedCallbacks : $t ? n = $t : (n = $t = [], setTimeout(Fa, 0));
          for (var l = /* @__PURE__ */ u(function(a) {
            n.push(function() {
              return i[a].apply(null, r);
            });
          }, "loop"), o = 0; o < i.length; ++o)
            l(o);
        }
      }
      u(Z, "signalLater");
      function Fa() {
        var e = $t;
        $t = null;
        for (var t = 0; t < e.length; ++t)
          e[t]();
      }
      u(Fa, "fireOrphanDelayed");
      function ul(e, t, i, r) {
        for (var n = 0; n < t.changes.length; n++) {
          var l = t.changes[n];
          l == "text" ? Ea(e, t) : l == "gutter" ? hl(e, t, i, r) : l == "class" ? Gi(e, t) : l == "widget" && Ia(e, t, r);
        }
        t.changes = null;
      }
      u(ul, "updateLineForChanges");
      function er(e) {
        return e.node == e.text && (e.node = T("div", null, null, "position: relative"), e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text), e.node.appendChild(e.text), O && I < 8 && (e.node.style.zIndex = 2)), e.node;
      }
      u(er, "ensureLineWrapped");
      function Pa(e, t) {
        var i = t.bgClass ? t.bgClass + " " + (t.line.bgClass || "") : t.line.bgClass;
        if (i && (i += " CodeMirror-linebackground"), t.background)
          i ? t.background.className = i : (t.background.parentNode.removeChild(t.background), t.background = null);
        else if (i) {
          var r = er(t);
          t.background = r.insertBefore(T("div", null, i), r.firstChild), e.display.input.setUneditable(t.background);
        }
      }
      u(Pa, "updateLineBackground");
      function fl(e, t) {
        var i = e.display.externalMeasured;
        return i && i.line == t.line ? (e.display.externalMeasured = null, t.measure = i.measure, i.built) : ol(e, t);
      }
      u(fl, "getLineContent");
      function Ea(e, t) {
        var i = t.text.className, r = fl(e, t);
        t.text == t.node && (t.node = r.pre), t.text.parentNode.replaceChild(r.pre, t.text), t.text = r.pre, r.bgClass != t.bgClass || r.textClass != t.textClass ? (t.bgClass = r.bgClass, t.textClass = r.textClass, Gi(e, t)) : i && (t.text.className = i);
      }
      u(Ea, "updateLineText");
      function Gi(e, t) {
        Pa(e, t), t.line.wrapClass ? er(t).className = t.line.wrapClass : t.node != t.text && (t.node.className = "");
        var i = t.textClass ? t.textClass + " " + (t.line.textClass || "") : t.line.textClass;
        t.text.className = i || "";
      }
      u(Gi, "updateLineClasses");
      function hl(e, t, i, r) {
        if (t.gutter && (t.node.removeChild(t.gutter), t.gutter = null), t.gutterBackground && (t.node.removeChild(t.gutterBackground), t.gutterBackground = null), t.line.gutterClass) {
          var n = er(t);
          t.gutterBackground = T(
            "div",
            null,
            "CodeMirror-gutter-background " + t.line.gutterClass,
            "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px; width: " + r.gutterTotalWidth + "px"
          ), e.display.input.setUneditable(t.gutterBackground), n.insertBefore(t.gutterBackground, t.text);
        }
        var l = t.line.gutterMarkers;
        if (e.options.lineNumbers || l) {
          var o = er(t), a = t.gutter = T("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px");
          if (a.setAttribute("aria-hidden", "true"), e.display.input.setUneditable(a), o.insertBefore(a, t.text), t.line.gutterClass && (a.className += " " + t.line.gutterClass), e.options.lineNumbers && (!l || !l["CodeMirror-linenumbers"]) && (t.lineNumber = a.appendChild(
            T(
              "div",
              Oi(e.options, i),
              "CodeMirror-linenumber CodeMirror-gutter-elt",
              "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"
            )
          )), l)
            for (var s = 0; s < e.display.gutterSpecs.length; ++s) {
              var f = e.display.gutterSpecs[s].className, h = l.hasOwnProperty(f) && l[f];
              h && a.appendChild(T(
                "div",
                [h],
                "CodeMirror-gutter-elt",
                "left: " + r.gutterLeft[f] + "px; width: " + r.gutterWidth[f] + "px"
              ));
            }
        }
      }
      u(hl, "updateLineGutter");
      function Ia(e, t, i) {
        t.alignable && (t.alignable = null);
        for (var r = mt("CodeMirror-linewidget"), n = t.node.firstChild, l = void 0; n; n = l)
          l = n.nextSibling, r.test(n.className) && t.node.removeChild(n);
        cl(e, t, i);
      }
      u(Ia, "updateLineWidgets");
      function Ra(e, t, i, r) {
        var n = fl(e, t);
        return t.text = t.node = n.pre, n.bgClass && (t.bgClass = n.bgClass), n.textClass && (t.textClass = n.textClass), Gi(e, t), hl(e, t, i, r), cl(e, t, r), t.node;
      }
      u(Ra, "buildLineElement");
      function cl(e, t, i) {
        if (dl(e, t.line, t, i, !0), t.rest)
          for (var r = 0; r < t.rest.length; r++)
            dl(e, t.rest[r], t, i, !1);
      }
      u(cl, "insertLineWidgets");
      function dl(e, t, i, r, n) {
        if (t.widgets)
          for (var l = er(i), o = 0, a = t.widgets; o < a.length; ++o) {
            var s = a[o], f = T("div", [s.node], "CodeMirror-linewidget" + (s.className ? " " + s.className : ""));
            s.handleMouseEvents || f.setAttribute("cm-ignore-events", "true"), Ba(s, f, i, r), e.display.input.setUneditable(f), n && s.above ? l.insertBefore(f, i.gutter || i.text) : l.appendChild(f), Z(s, "redraw");
          }
      }
      u(dl, "insertLineWidgetsFor");
      function Ba(e, t, i, r) {
        if (e.noHScroll) {
          (i.alignable || (i.alignable = [])).push(t);
          var n = r.wrapperWidth;
          t.style.left = r.fixedPos + "px", e.coverGutter || (n -= r.gutterTotalWidth, t.style.paddingLeft = r.gutterTotalWidth + "px"), t.style.width = n + "px";
        }
        e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"));
      }
      u(Ba, "positionLineWidget");
      function tr(e) {
        if (e.height != null)
          return e.height;
        var t = e.doc.cm;
        if (!t)
          return 0;
        if (!Ke(document.body, e.node)) {
          var i = "position: relative;";
          e.coverGutter && (i += "margin-left: -" + t.display.gutters.offsetWidth + "px;"), e.noHScroll && (i += "width: " + t.display.wrapper.clientWidth + "px;"), ve(t.display.measure, T("div", [e.node], null, i));
        }
        return e.height = e.node.parentNode.offsetHeight;
      }
      u(tr, "widgetHeight");
      function Re(e, t) {
        for (var i = wi(t); i != e.wrapper; i = i.parentNode)
          if (!i || i.nodeType == 1 && i.getAttribute("cm-ignore-events") == "true" || i.parentNode == e.sizer && i != e.mover)
            return !0;
      }
      u(Re, "eventInWidget");
      function Kr(e) {
        return e.lineSpace.offsetTop;
      }
      u(Kr, "paddingTop");
      function Ui(e) {
        return e.mover.offsetHeight - e.lineSpace.offsetHeight;
      }
      u(Ui, "paddingVert");
      function pl(e) {
        if (e.cachedPaddingH)
          return e.cachedPaddingH;
        var t = ve(e.measure, T("pre", "x", "CodeMirror-line-like")), i = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle, r = { left: parseInt(i.paddingLeft), right: parseInt(i.paddingRight) };
        return !isNaN(r.left) && !isNaN(r.right) && (e.cachedPaddingH = r), r;
      }
      u(pl, "paddingH");
      function Ae(e) {
        return Wn - e.display.nativeBarWidth;
      }
      u(Ae, "scrollGap");
      function st(e) {
        return e.display.scroller.clientWidth - Ae(e) - e.display.barWidth;
      }
      u(st, "displayWidth");
      function Ki(e) {
        return e.display.scroller.clientHeight - Ae(e) - e.display.barHeight;
      }
      u(Ki, "displayHeight");
      function za(e, t, i) {
        var r = e.options.lineWrapping, n = r && st(e);
        if (!t.measure.heights || r && t.measure.width != n) {
          var l = t.measure.heights = [];
          if (r) {
            t.measure.width = n;
            for (var o = t.text.firstChild.getClientRects(), a = 0; a < o.length - 1; a++) {
              var s = o[a], f = o[a + 1];
              Math.abs(s.bottom - f.bottom) > 2 && l.push((s.bottom + f.top) / 2 - i.top);
            }
          }
          l.push(i.bottom - i.top);
        }
      }
      u(za, "ensureLineHeights");
      function vl(e, t, i) {
        if (e.line == t)
          return { map: e.measure.map, cache: e.measure.cache };
        if (e.rest) {
          for (var r = 0; r < e.rest.length; r++)
            if (e.rest[r] == t)
              return { map: e.measure.maps[r], cache: e.measure.caches[r] };
          for (var n = 0; n < e.rest.length; n++)
            if (F(e.rest[n]) > i)
              return { map: e.measure.maps[n], cache: e.measure.caches[n], before: !0 };
        }
      }
      u(vl, "mapFromLineView");
      function Ga(e, t) {
        t = Se(t);
        var i = F(t), r = e.display.externalMeasured = new sl(e.doc, t, i);
        r.lineN = i;
        var n = r.built = ol(e, r);
        return r.text = n.pre, ve(e.display.lineMeasure, n.pre), r;
      }
      u(Ga, "updateExternalMeasurement");
      function gl(e, t, i, r) {
        return Oe(e, kt(e, t), i, r);
      }
      u(gl, "measureChar");
      function _i(e, t) {
        if (t >= e.display.viewFrom && t < e.display.viewTo)
          return e.display.view[ht(e, t)];
        var i = e.display.externalMeasured;
        if (i && t >= i.lineN && t < i.lineN + i.size)
          return i;
      }
      u(_i, "findViewForLine");
      function kt(e, t) {
        var i = F(t), r = _i(e, i);
        r && !r.text ? r = null : r && r.changes && (ul(e, r, i, Qi(e)), e.curOp.forceUpdate = !0), r || (r = Ga(e, t));
        var n = vl(r, t, i);
        return {
          line: t,
          view: r,
          rect: null,
          map: n.map,
          cache: n.cache,
          before: n.before,
          hasHeights: !1
        };
      }
      u(kt, "prepareMeasureForLine");
      function Oe(e, t, i, r, n) {
        t.before && (i = -1);
        var l = i + (r || ""), o;
        return t.cache.hasOwnProperty(l) ? o = t.cache[l] : (t.rect || (t.rect = t.view.text.getBoundingClientRect()), t.hasHeights || (za(e, t.view, t.rect), t.hasHeights = !0), o = Ka(e, t, i, r), o.bogus || (t.cache[l] = o)), {
          left: o.left,
          right: o.right,
          top: n ? o.rtop : o.top,
          bottom: n ? o.rbottom : o.bottom
        };
      }
      u(Oe, "measureCharPrepared");
      var yl = { left: 0, right: 0, top: 0, bottom: 0 };
      function ml(e, t, i) {
        for (var r, n, l, o, a, s, f = 0; f < e.length; f += 3)
          if (a = e[f], s = e[f + 1], t < a ? (n = 0, l = 1, o = "left") : t < s ? (n = t - a, l = n + 1) : (f == e.length - 3 || t == s && e[f + 3] > t) && (l = s - a, n = l - 1, t >= s && (o = "right")), n != null) {
            if (r = e[f + 2], a == s && i == (r.insertLeft ? "left" : "right") && (o = i), i == "left" && n == 0)
              for (; f && e[f - 2] == e[f - 3] && e[f - 1].insertLeft; )
                r = e[(f -= 3) + 2], o = "left";
            if (i == "right" && n == s - a)
              for (; f < e.length - 3 && e[f + 3] == e[f + 4] && !e[f + 5].insertLeft; )
                r = e[(f += 3) + 2], o = "right";
            break;
          }
        return { node: r, start: n, end: l, collapse: o, coverStart: a, coverEnd: s };
      }
      u(ml, "nodeAndOffsetInLineMap");
      function Ua(e, t) {
        var i = yl;
        if (t == "left")
          for (var r = 0; r < e.length && (i = e[r]).left == i.right; r++)
            ;
        else
          for (var n = e.length - 1; n >= 0 && (i = e[n]).left == i.right; n--)
            ;
        return i;
      }
      u(Ua, "getUsefulRect");
      function Ka(e, t, i, r) {
        var n = ml(t.map, i, r), l = n.node, o = n.start, a = n.end, s = n.collapse, f;
        if (l.nodeType == 3) {
          for (var h = 0; h < 4; h++) {
            for (; o && bi(t.line.text.charAt(n.coverStart + o)); )
              --o;
            for (; n.coverStart + a < n.coverEnd && bi(t.line.text.charAt(n.coverStart + a)); )
              ++a;
            if (O && I < 9 && o == 0 && a == n.coverEnd - n.coverStart ? f = l.parentNode.getBoundingClientRect() : f = Ua(rt(l, o, a).getClientRects(), r), f.left || f.right || o == 0)
              break;
            a = o, o = o - 1, s = "right";
          }
          O && I < 11 && (f = _a(e.display.measure, f));
        } else {
          o > 0 && (s = r = "right");
          var c;
          e.options.lineWrapping && (c = l.getClientRects()).length > 1 ? f = c[r == "right" ? c.length - 1 : 0] : f = l.getBoundingClientRect();
        }
        if (O && I < 9 && !o && (!f || !f.left && !f.right)) {
          var p = l.parentNode.getClientRects()[0];
          p ? f = { left: p.left, right: p.left + Mt(e.display), top: p.top, bottom: p.bottom } : f = yl;
        }
        for (var d = f.top - t.rect.top, v = f.bottom - t.rect.top, g = (d + v) / 2, m = t.view.measure.heights, b = 0; b < m.length - 1 && !(g < m[b]); b++)
          ;
        var C = b ? m[b - 1] : 0, x = m[b], w = {
          left: (s == "right" ? f.right : f.left) - t.rect.left,
          right: (s == "left" ? f.left : f.right) - t.rect.left,
          top: C,
          bottom: x
        };
        return !f.left && !f.right && (w.bogus = !0), e.options.singleCursorHeightPerLine || (w.rtop = d, w.rbottom = v), w;
      }
      u(Ka, "measureCharInner");
      function _a(e, t) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !la(e))
          return t;
        var i = screen.logicalXDPI / screen.deviceXDPI, r = screen.logicalYDPI / screen.deviceYDPI;
        return {
          left: t.left * i,
          right: t.right * i,
          top: t.top * r,
          bottom: t.bottom * r
        };
      }
      u(_a, "maybeUpdateRectForZooming");
      function bl(e) {
        if (e.measure && (e.measure.cache = {}, e.measure.heights = null, e.rest))
          for (var t = 0; t < e.rest.length; t++)
            e.measure.caches[t] = {};
      }
      u(bl, "clearLineMeasurementCacheFor");
      function xl(e) {
        e.display.externalMeasure = null, Ue(e.display.lineMeasure);
        for (var t = 0; t < e.display.view.length; t++)
          bl(e.display.view[t]);
      }
      u(xl, "clearLineMeasurementCache");
      function rr(e) {
        xl(e), e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null;
      }
      u(rr, "clearCaches");
      function Cl() {
        return Tr && Dr ? -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft)) : window.pageXOffset || (document.documentElement || document.body).scrollLeft;
      }
      u(Cl, "pageScrollX");
      function wl() {
        return Tr && Dr ? -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop)) : window.pageYOffset || (document.documentElement || document.body).scrollTop;
      }
      u(wl, "pageScrollY");
      function Xi(e) {
        var t = Se(e), i = t.widgets, r = 0;
        if (i)
          for (var n = 0; n < i.length; ++n)
            i[n].above && (r += tr(i[n]));
        return r;
      }
      u(Xi, "widgetTopHeight");
      function _r(e, t, i, r, n) {
        if (!n) {
          var l = Xi(t);
          i.top += l, i.bottom += l;
        }
        if (r == "line")
          return i;
        r || (r = "local");
        var o = Ie(t);
        if (r == "local" ? o += Kr(e.display) : o -= e.display.viewOffset, r == "page" || r == "window") {
          var a = e.display.lineSpace.getBoundingClientRect();
          o += a.top + (r == "window" ? 0 : wl());
          var s = a.left + (r == "window" ? 0 : Cl());
          i.left += s, i.right += s;
        }
        return i.top += o, i.bottom += o, i;
      }
      u(_r, "intoCoordSystem");
      function Sl(e, t, i) {
        if (i == "div")
          return t;
        var r = t.left, n = t.top;
        if (i == "page")
          r -= Cl(), n -= wl();
        else if (i == "local" || !i) {
          var l = e.display.sizer.getBoundingClientRect();
          r += l.left, n += l.top;
        }
        var o = e.display.lineSpace.getBoundingClientRect();
        return { left: r - o.left, top: n - o.top };
      }
      u(Sl, "fromCoordSystem");
      function Xr(e, t, i, r, n) {
        return r || (r = S(e.doc, t.line)), _r(e, r, gl(e, r, t.ch, n), i);
      }
      u(Xr, "charCoords");
      function Le(e, t, i, r, n, l) {
        r = r || S(e.doc, t.line), n || (n = kt(e, r));
        function o(v, g) {
          var m = Oe(e, n, v, g ? "right" : "left", l);
          return g ? m.left = m.right : m.right = m.left, _r(e, r, m, i);
        }
        u(o, "get");
        var a = Pe(r, e.doc.direction), s = t.ch, f = t.sticky;
        if (s >= r.text.length ? (s = r.text.length, f = "before") : s <= 0 && (s = 0, f = "after"), !a)
          return o(f == "before" ? s - 1 : s, f == "before");
        function h(v, g, m) {
          var b = a[g], C = b.level == 1;
          return o(m ? v - 1 : v, C != m);
        }
        u(h, "getBidi");
        var c = Zt(a, s, f), p = qt, d = h(s, c, f == "before");
        return p != null && (d.other = h(s, p, f != "before")), d;
      }
      u(Le, "cursorCoords");
      function Ll(e, t) {
        var i = 0;
        t = N(e.doc, t), e.options.lineWrapping || (i = Mt(e.display) * t.ch);
        var r = S(e.doc, t.line), n = Ie(r) + Kr(e.display);
        return { left: i, right: i, top: n, bottom: n + r.height };
      }
      u(Ll, "estimateCoords");
      function Yi(e, t, i, r, n) {
        var l = y(e, t, i);
        return l.xRel = n, r && (l.outside = r), l;
      }
      u(Yi, "PosWithInfo");
      function qi(e, t, i) {
        var r = e.doc;
        if (i += e.display.viewOffset, i < 0)
          return Yi(r.first, 0, null, -1, -1);
        var n = at(r, i), l = r.first + r.size - 1;
        if (n > l)
          return Yi(r.first + r.size - 1, S(r, l).text.length, null, 1, 1);
        t < 0 && (t = 0);
        for (var o = S(r, n); ; ) {
          var a = Xa(e, o, n, t, i), s = ba(o, a.ch + (a.xRel > 0 || a.outside > 0 ? 1 : 0));
          if (!s)
            return a;
          var f = s.find(1);
          if (f.line == n)
            return f;
          o = S(r, n = f.line);
        }
      }
      u(qi, "coordsChar");
      function kl(e, t, i, r) {
        r -= Xi(t);
        var n = t.text.length, l = Yt(function(o) {
          return Oe(e, i, o - 1).bottom <= r;
        }, n, 0);
        return n = Yt(function(o) {
          return Oe(e, i, o).top > r;
        }, l, n), { begin: l, end: n };
      }
      u(kl, "wrappedLineExtent");
      function Tl(e, t, i, r) {
        i || (i = kt(e, t));
        var n = _r(e, t, Oe(e, i, r), "line").top;
        return kl(e, t, i, n);
      }
      u(Tl, "wrappedLineExtentChar");
      function Zi(e, t, i, r) {
        return e.bottom <= i ? !1 : e.top > i ? !0 : (r ? e.left : e.right) > t;
      }
      u(Zi, "boxIsAfter");
      function Xa(e, t, i, r, n) {
        n -= Ie(t);
        var l = kt(e, t), o = Xi(t), a = 0, s = t.text.length, f = !0, h = Pe(t, e.doc.direction);
        if (h) {
          var c = (e.options.lineWrapping ? qa : Ya)(e, t, i, l, h, r, n);
          f = c.level != 1, a = f ? c.from : c.to - 1, s = f ? c.to : c.from - 1;
        }
        var p = null, d = null, v = Yt(function(k) {
          var L = Oe(e, l, k);
          return L.top += o, L.bottom += o, Zi(L, r, n, !1) ? (L.top <= n && L.left <= r && (p = k, d = L), !0) : !1;
        }, a, s), g, m, b = !1;
        if (d) {
          var C = r - d.left < d.right - r, x = C == f;
          v = p + (x ? 0 : 1), m = x ? "after" : "before", g = C ? d.left : d.right;
        } else {
          !f && (v == s || v == a) && v++, m = v == 0 ? "after" : v == t.text.length ? "before" : Oe(e, l, v - (f ? 1 : 0)).bottom + o <= n == f ? "after" : "before";
          var w = Le(e, y(i, v, m), "line", t, l);
          g = w.left, b = n < w.top ? -1 : n >= w.bottom ? 1 : 0;
        }
        return v = En(t.text, v, 1), Yi(i, v, m, b, r - g);
      }
      u(Xa, "coordsCharInner");
      function Ya(e, t, i, r, n, l, o) {
        var a = Yt(function(c) {
          var p = n[c], d = p.level != 1;
          return Zi(Le(
            e,
            y(i, d ? p.to : p.from, d ? "before" : "after"),
            "line",
            t,
            r
          ), l, o, !0);
        }, 0, n.length - 1), s = n[a];
        if (a > 0) {
          var f = s.level != 1, h = Le(
            e,
            y(i, f ? s.from : s.to, f ? "after" : "before"),
            "line",
            t,
            r
          );
          Zi(h, l, o, !0) && h.top > o && (s = n[a - 1]);
        }
        return s;
      }
      u(Ya, "coordsBidiPart");
      function qa(e, t, i, r, n, l, o) {
        var a = kl(e, t, r, o), s = a.begin, f = a.end;
        /\s/.test(t.text.charAt(f - 1)) && f--;
        for (var h = null, c = null, p = 0; p < n.length; p++) {
          var d = n[p];
          if (!(d.from >= f || d.to <= s)) {
            var v = d.level != 1, g = Oe(e, r, v ? Math.min(f, d.to) - 1 : Math.max(s, d.from)).right, m = g < l ? l - g + 1e9 : g - l;
            (!h || c > m) && (h = d, c = m);
          }
        }
        return h || (h = n[n.length - 1]), h.from < s && (h = { from: s, to: h.to, level: h.level }), h.to > f && (h = { from: h.from, to: f, level: h.level }), h;
      }
      u(qa, "coordsBidiPartWrapped");
      var ut;
      function Tt(e) {
        if (e.cachedTextHeight != null)
          return e.cachedTextHeight;
        if (ut == null) {
          ut = T("pre", null, "CodeMirror-line-like");
          for (var t = 0; t < 49; ++t)
            ut.appendChild(document.createTextNode("x")), ut.appendChild(T("br"));
          ut.appendChild(document.createTextNode("x"));
        }
        ve(e.measure, ut);
        var i = ut.offsetHeight / 50;
        return i > 3 && (e.cachedTextHeight = i), Ue(e.measure), i || 1;
      }
      u(Tt, "textHeight");
      function Mt(e) {
        if (e.cachedCharWidth != null)
          return e.cachedCharWidth;
        var t = T("span", "xxxxxxxxxx"), i = T("pre", [t], "CodeMirror-line-like");
        ve(e.measure, i);
        var r = t.getBoundingClientRect(), n = (r.right - r.left) / 10;
        return n > 2 && (e.cachedCharWidth = n), n || 10;
      }
      u(Mt, "charWidth");
      function Qi(e) {
        for (var t = e.display, i = {}, r = {}, n = t.gutters.clientLeft, l = t.gutters.firstChild, o = 0; l; l = l.nextSibling, ++o) {
          var a = e.display.gutterSpecs[o].className;
          i[a] = l.offsetLeft + l.clientLeft + n, r[a] = l.clientWidth;
        }
        return {
          fixedPos: Ji(t),
          gutterTotalWidth: t.gutters.offsetWidth,
          gutterLeft: i,
          gutterWidth: r,
          wrapperWidth: t.wrapper.clientWidth
        };
      }
      u(Qi, "getDimensions");
      function Ji(e) {
        return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left;
      }
      u(Ji, "compensateForHScroll");
      function Ml(e) {
        var t = Tt(e.display), i = e.options.lineWrapping, r = i && Math.max(5, e.display.scroller.clientWidth / Mt(e.display) - 3);
        return function(n) {
          if (Xe(e.doc, n))
            return 0;
          var l = 0;
          if (n.widgets)
            for (var o = 0; o < n.widgets.length; o++)
              n.widgets[o].height && (l += n.widgets[o].height);
          return i ? l + (Math.ceil(n.text.length / r) || 1) * t : l + t;
        };
      }
      u(Ml, "estimateHeight");
      function ji(e) {
        var t = e.doc, i = Ml(e);
        t.iter(function(r) {
          var n = i(r);
          n != r.height && De(r, n);
        });
      }
      u(ji, "estimateLineHeights");
      function ft(e, t, i, r) {
        var n = e.display;
        if (!i && wi(t).getAttribute("cm-not-content") == "true")
          return null;
        var l, o, a = n.lineSpace.getBoundingClientRect();
        try {
          l = t.clientX - a.left, o = t.clientY - a.top;
        } catch {
          return null;
        }
        var s = qi(e, l, o), f;
        if (r && s.xRel > 0 && (f = S(e.doc, s.line).text).length == s.ch) {
          var h = xe(f, f.length, e.options.tabSize) - f.length;
          s = y(s.line, Math.max(0, Math.round((l - pl(e.display).left) / Mt(e.display)) - h));
        }
        return s;
      }
      u(ft, "posFromMouse");
      function ht(e, t) {
        if (t >= e.display.viewTo || (t -= e.display.viewFrom, t < 0))
          return null;
        for (var i = e.display.view, r = 0; r < i.length; r++)
          if (t -= i[r].size, t < 0)
            return r;
      }
      u(ht, "findViewIndex");
      function se(e, t, i, r) {
        t == null && (t = e.doc.first), i == null && (i = e.doc.first + e.doc.size), r || (r = 0);
        var n = e.display;
        if (r && i < n.viewTo && (n.updateLineNumbers == null || n.updateLineNumbers > t) && (n.updateLineNumbers = t), e.curOp.viewChanged = !0, t >= n.viewTo)
          Ee && Ri(e.doc, t) < n.viewTo && qe(e);
        else if (i <= n.viewFrom)
          Ee && nl(e.doc, i + r) > n.viewFrom ? qe(e) : (n.viewFrom += r, n.viewTo += r);
        else if (t <= n.viewFrom && i >= n.viewTo)
          qe(e);
        else if (t <= n.viewFrom) {
          var l = Yr(e, i, i + r, 1);
          l ? (n.view = n.view.slice(l.index), n.viewFrom = l.lineN, n.viewTo += r) : qe(e);
        } else if (i >= n.viewTo) {
          var o = Yr(e, t, t, -1);
          o ? (n.view = n.view.slice(0, o.index), n.viewTo = o.lineN) : qe(e);
        } else {
          var a = Yr(e, t, t, -1), s = Yr(e, i, i + r, 1);
          a && s ? (n.view = n.view.slice(0, a.index).concat(Ur(e, a.lineN, s.lineN)).concat(n.view.slice(s.index)), n.viewTo += r) : qe(e);
        }
        var f = n.externalMeasured;
        f && (i < f.lineN ? f.lineN += r : t < f.lineN + f.size && (n.externalMeasured = null));
      }
      u(se, "regChange");
      function Ye(e, t, i) {
        e.curOp.viewChanged = !0;
        var r = e.display, n = e.display.externalMeasured;
        if (n && t >= n.lineN && t < n.lineN + n.size && (r.externalMeasured = null), !(t < r.viewFrom || t >= r.viewTo)) {
          var l = r.view[ht(e, t)];
          if (l.node != null) {
            var o = l.changes || (l.changes = []);
            ee(o, i) == -1 && o.push(i);
          }
        }
      }
      u(Ye, "regLineChange");
      function qe(e) {
        e.display.viewFrom = e.display.viewTo = e.doc.first, e.display.view = [], e.display.viewOffset = 0;
      }
      u(qe, "resetView");
      function Yr(e, t, i, r) {
        var n = ht(e, t), l, o = e.display.view;
        if (!Ee || i == e.doc.first + e.doc.size)
          return { index: n, lineN: i };
        for (var a = e.display.viewFrom, s = 0; s < n; s++)
          a += o[s].size;
        if (a != t) {
          if (r > 0) {
            if (n == o.length - 1)
              return null;
            l = a + o[n].size - t, n++;
          } else
            l = a - t;
          t += l, i += l;
        }
        for (; Ri(e.doc, i) != i; ) {
          if (n == (r < 0 ? 0 : o.length - 1))
            return null;
          i += r * o[n - (r < 0 ? 1 : 0)].size, n += r;
        }
        return { index: n, lineN: i };
      }
      u(Yr, "viewCuttingPoint");
      function Za(e, t, i) {
        var r = e.display, n = r.view;
        n.length == 0 || t >= r.viewTo || i <= r.viewFrom ? (r.view = Ur(e, t, i), r.viewFrom = t) : (r.viewFrom > t ? r.view = Ur(e, t, r.viewFrom).concat(r.view) : r.viewFrom < t && (r.view = r.view.slice(ht(e, t))), r.viewFrom = t, r.viewTo < i ? r.view = r.view.concat(Ur(e, r.viewTo, i)) : r.viewTo > i && (r.view = r.view.slice(0, ht(e, i)))), r.viewTo = i;
      }
      u(Za, "adjustView");
      function Dl(e) {
        for (var t = e.display.view, i = 0, r = 0; r < t.length; r++) {
          var n = t[r];
          !n.hidden && (!n.node || n.changes) && ++i;
        }
        return i;
      }
      u(Dl, "countDirtyView");
      function ir(e) {
        e.display.input.showSelection(e.display.input.prepareSelection());
      }
      u(ir, "updateSelection");
      function Nl(e, t) {
        t === void 0 && (t = !0);
        var i = e.doc, r = {}, n = r.cursors = document.createDocumentFragment(), l = r.selection = document.createDocumentFragment(), o = e.options.$customCursor;
        o && (t = !0);
        for (var a = 0; a < i.sel.ranges.length; a++)
          if (!(!t && a == i.sel.primIndex)) {
            var s = i.sel.ranges[a];
            if (!(s.from().line >= e.display.viewTo || s.to().line < e.display.viewFrom)) {
              var f = s.empty();
              if (o) {
                var h = o(e, s);
                h && Vi(e, h, n);
              } else
                (f || e.options.showCursorWhenSelecting) && Vi(e, s.head, n);
              f || Qa(e, s, l);
            }
          }
        return r;
      }
      u(Nl, "prepareSelection");
      function Vi(e, t, i) {
        var r = Le(e, t, "div", null, null, !e.options.singleCursorHeightPerLine), n = i.appendChild(T("div", " ", "CodeMirror-cursor"));
        if (n.style.left = r.left + "px", n.style.top = r.top + "px", n.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + "px", /\bcm-fat-cursor\b/.test(e.getWrapperElement().className)) {
          var l = Xr(e, t, "div", null, null), o = l.right - l.left;
          n.style.width = (o > 0 ? o : e.defaultCharWidth()) + "px";
        }
        if (r.other) {
          var a = i.appendChild(T("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
          a.style.display = "", a.style.left = r.other.left + "px", a.style.top = r.other.top + "px", a.style.height = (r.other.bottom - r.other.top) * 0.85 + "px";
        }
      }
      u(Vi, "drawSelectionCursor");
      function qr(e, t) {
        return e.top - t.top || e.left - t.left;
      }
      u(qr, "cmpCoords");
      function Qa(e, t, i) {
        var r = e.display, n = e.doc, l = document.createDocumentFragment(), o = pl(e.display), a = o.left, s = Math.max(r.sizerWidth, st(e) - r.sizer.offsetLeft) - o.right, f = n.direction == "ltr";
        function h(x, w, k, L) {
          w < 0 && (w = 0), w = Math.round(w), L = Math.round(L), l.appendChild(T("div", null, "CodeMirror-selected", "position: absolute; left: " + x + `px;
                             top: ` + w + "px; width: " + (k ?? s - x) + `px;
                             height: ` + (L - w) + "px"));
        }
        u(h, "add");
        function c(x, w, k) {
          var L = S(n, x), A = L.text.length, E, j;
          function B(_, he) {
            return Xr(e, y(x, _), "div", L, he);
          }
          u(B, "coords");
          function pe(_, he, $) {
            var Y = Tl(e, L, null, _), X = he == "ltr" == ($ == "after") ? "left" : "right", z = $ == "after" ? Y.begin : Y.end - (/\s/.test(L.text.charAt(Y.end - 1)) ? 2 : 1);
            return B(z, X)[X];
          }
          u(pe, "wrapX");
          var fe = Pe(L, n.direction);
          return Vo(fe, w || 0, k ?? A, function(_, he, $, Y) {
            var X = $ == "ltr", z = B(_, X ? "left" : "right"), ce = B(he - 1, X ? "right" : "left"), zt = w == null && _ == 0, $e = k == null && he == A, re = Y == 0, We = !fe || Y == fe.length - 1;
            if (ce.top - z.top <= 3) {
              var V = (f ? zt : $e) && re, kn = (f ? $e : zt) && We, Ge = V ? a : (X ? z : ce).left, gt = kn ? s : (X ? ce : z).right;
              h(Ge, z.top, gt - Ge, z.bottom);
            } else {
              var yt, oe, Gt, Tn;
              X ? (yt = f && zt && re ? a : z.left, oe = f ? s : pe(_, $, "before"), Gt = f ? a : pe(he, $, "after"), Tn = f && $e && We ? s : ce.right) : (yt = f ? pe(_, $, "before") : a, oe = !f && zt && re ? s : z.right, Gt = !f && $e && We ? a : ce.left, Tn = f ? pe(he, $, "after") : s), h(yt, z.top, oe - yt, z.bottom), z.bottom < ce.top && h(a, z.bottom, null, ce.top), h(Gt, ce.top, Tn - Gt, ce.bottom);
            }
            (!E || qr(z, E) < 0) && (E = z), qr(ce, E) < 0 && (E = ce), (!j || qr(z, j) < 0) && (j = z), qr(ce, j) < 0 && (j = ce);
          }), { start: E, end: j };
        }
        u(c, "drawForLine");
        var p = t.from(), d = t.to();
        if (p.line == d.line)
          c(p.line, p.ch, d.ch);
        else {
          var v = S(n, p.line), g = S(n, d.line), m = Se(v) == Se(g), b = c(p.line, p.ch, m ? v.text.length + 1 : null).end, C = c(d.line, m ? 0 : null, d.ch).start;
          m && (b.top < C.top - 2 ? (h(b.right, b.top, null, b.bottom), h(a, C.top, C.left, C.bottom)) : h(b.right, b.top, C.left - b.right, b.bottom)), b.bottom < C.top && h(a, b.bottom, null, C.top);
        }
        i.appendChild(l);
      }
      u(Qa, "drawSelectionRange");
      function $i(e) {
        if (e.state.focused) {
          var t = e.display;
          clearInterval(t.blinker);
          var i = !0;
          t.cursorDiv.style.visibility = "", e.options.cursorBlinkRate > 0 ? t.blinker = setInterval(function() {
            e.hasFocus() || Dt(e), t.cursorDiv.style.visibility = (i = !i) ? "" : "hidden";
          }, e.options.cursorBlinkRate) : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden");
        }
      }
      u($i, "restartBlink");
      function Al(e) {
        e.hasFocus() || (e.display.input.focus(), e.state.focused || tn(e));
      }
      u(Al, "ensureFocus");
      function en(e) {
        e.state.delayingBlurEvent = !0, setTimeout(function() {
          e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1, e.state.focused && Dt(e));
        }, 100);
      }
      u(en, "delayBlurEvent");
      function tn(e, t) {
        e.state.delayingBlurEvent && !e.state.draggingText && (e.state.delayingBlurEvent = !1), e.options.readOnly != "nocursor" && (e.state.focused || (U(e, "focus", e, t), e.state.focused = !0, it(e.display.wrapper, "CodeMirror-focused"), !e.curOp && e.display.selForContextMenu != e.doc.sel && (e.display.input.reset(), ne && setTimeout(function() {
          return e.display.input.reset(!0);
        }, 20)), e.display.input.receivedFocus()), $i(e));
      }
      u(tn, "onFocus");
      function Dt(e, t) {
        e.state.delayingBlurEvent || (e.state.focused && (U(e, "blur", e, t), e.state.focused = !1, tt(e.display.wrapper, "CodeMirror-focused")), clearInterval(e.display.blinker), setTimeout(function() {
          e.state.focused || (e.display.shift = !1);
        }, 150));
      }
      u(Dt, "onBlur");
      function Zr(e) {
        for (var t = e.display, i = t.lineDiv.offsetTop, r = Math.max(0, t.scroller.getBoundingClientRect().top), n = t.lineDiv.getBoundingClientRect().top, l = 0, o = 0; o < t.view.length; o++) {
          var a = t.view[o], s = e.options.lineWrapping, f = void 0, h = 0;
          if (!a.hidden) {
            if (n += a.line.height, O && I < 8) {
              var c = a.node.offsetTop + a.node.offsetHeight;
              f = c - i, i = c;
            } else {
              var p = a.node.getBoundingClientRect();
              f = p.bottom - p.top, !s && a.text.firstChild && (h = a.text.firstChild.getBoundingClientRect().right - p.left - 1);
            }
            var d = a.line.height - f;
            if ((d > 5e-3 || d < -5e-3) && (n < r && (l -= d), De(a.line, f), Ol(a.line), a.rest))
              for (var v = 0; v < a.rest.length; v++)
                Ol(a.rest[v]);
            if (h > e.display.sizerWidth) {
              var g = Math.ceil(h / Mt(e.display));
              g > e.display.maxLineLength && (e.display.maxLineLength = g, e.display.maxLine = a.line, e.display.maxLineChanged = !0);
            }
          }
        }
        Math.abs(l) > 2 && (t.scroller.scrollTop += l);
      }
      u(Zr, "updateHeightsInViewport");
      function Ol(e) {
        if (e.widgets)
          for (var t = 0; t < e.widgets.length; ++t) {
            var i = e.widgets[t], r = i.node.parentNode;
            r && (i.height = r.offsetHeight);
          }
      }
      u(Ol, "updateWidgetHeight");
      function Qr(e, t, i) {
        var r = i && i.top != null ? Math.max(0, i.top) : e.scroller.scrollTop;
        r = Math.floor(r - Kr(e));
        var n = i && i.bottom != null ? i.bottom : r + e.wrapper.clientHeight, l = at(t, r), o = at(t, n);
        if (i && i.ensure) {
          var a = i.ensure.from.line, s = i.ensure.to.line;
          a < l ? (l = a, o = at(t, Ie(S(t, a)) + e.wrapper.clientHeight)) : Math.min(s, t.lastLine()) >= o && (l = at(t, Ie(S(t, s)) - e.wrapper.clientHeight), o = s);
        }
        return { from: l, to: Math.max(o, l + 1) };
      }
      u(Qr, "visibleLines");
      function Ja(e, t) {
        if (!q(e, "scrollCursorIntoView")) {
          var i = e.display, r = i.sizer.getBoundingClientRect(), n = null;
          if (t.top + r.top < 0 ? n = !0 : t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight) && (n = !1), n != null && !Yo) {
            var l = T("div", "​", null, `position: absolute;
                         top: ` + (t.top - i.viewOffset - Kr(e.display)) + `px;
                         height: ` + (t.bottom - t.top + Ae(e) + i.barHeight) + `px;
                         left: ` + t.left + "px; width: " + Math.max(2, t.right - t.left) + "px;");
            e.display.lineSpace.appendChild(l), l.scrollIntoView(n), e.display.lineSpace.removeChild(l);
          }
        }
      }
      u(Ja, "maybeScrollWindow");
      function ja(e, t, i, r) {
        r == null && (r = 0);
        var n;
        !e.options.lineWrapping && t == i && (i = t.sticky == "before" ? y(t.line, t.ch + 1, "before") : t, t = t.ch ? y(t.line, t.sticky == "before" ? t.ch - 1 : t.ch, "after") : t);
        for (var l = 0; l < 5; l++) {
          var o = !1, a = Le(e, t), s = !i || i == t ? a : Le(e, i);
          n = {
            left: Math.min(a.left, s.left),
            top: Math.min(a.top, s.top) - r,
            right: Math.max(a.left, s.left),
            bottom: Math.max(a.bottom, s.bottom) + r
          };
          var f = rn(e, n), h = e.doc.scrollTop, c = e.doc.scrollLeft;
          if (f.scrollTop != null && (lr(e, f.scrollTop), Math.abs(e.doc.scrollTop - h) > 1 && (o = !0)), f.scrollLeft != null && (ct(e, f.scrollLeft), Math.abs(e.doc.scrollLeft - c) > 1 && (o = !0)), !o)
            break;
        }
        return n;
      }
      u(ja, "scrollPosIntoView");
      function Va(e, t) {
        var i = rn(e, t);
        i.scrollTop != null && lr(e, i.scrollTop), i.scrollLeft != null && ct(e, i.scrollLeft);
      }
      u(Va, "scrollIntoView");
      function rn(e, t) {
        var i = e.display, r = Tt(e.display);
        t.top < 0 && (t.top = 0);
        var n = e.curOp && e.curOp.scrollTop != null ? e.curOp.scrollTop : i.scroller.scrollTop, l = Ki(e), o = {};
        t.bottom - t.top > l && (t.bottom = t.top + l);
        var a = e.doc.height + Ui(i), s = t.top < r, f = t.bottom > a - r;
        if (t.top < n)
          o.scrollTop = s ? 0 : t.top;
        else if (t.bottom > n + l) {
          var h = Math.min(t.top, (f ? a : t.bottom) - l);
          h != n && (o.scrollTop = h);
        }
        var c = e.options.fixedGutter ? 0 : i.gutters.offsetWidth, p = e.curOp && e.curOp.scrollLeft != null ? e.curOp.scrollLeft : i.scroller.scrollLeft - c, d = st(e) - i.gutters.offsetWidth, v = t.right - t.left > d;
        return v && (t.right = t.left + d), t.left < 10 ? o.scrollLeft = 0 : t.left < p ? o.scrollLeft = Math.max(0, t.left + c - (v ? 0 : 10)) : t.right > d + p - 3 && (o.scrollLeft = t.right + (v ? 0 : 10) - d), o;
      }
      u(rn, "calculateScrollPos");
      function nn(e, t) {
        t != null && (Jr(e), e.curOp.scrollTop = (e.curOp.scrollTop == null ? e.doc.scrollTop : e.curOp.scrollTop) + t);
      }
      u(nn, "addToScrollTop");
      function Nt(e) {
        Jr(e);
        var t = e.getCursor();
        e.curOp.scrollToPos = { from: t, to: t, margin: e.options.cursorScrollMargin };
      }
      u(Nt, "ensureCursorVisible");
      function nr(e, t, i) {
        (t != null || i != null) && Jr(e), t != null && (e.curOp.scrollLeft = t), i != null && (e.curOp.scrollTop = i);
      }
      u(nr, "scrollToCoords");
      function $a(e, t) {
        Jr(e), e.curOp.scrollToPos = t;
      }
      u($a, "scrollToRange");
      function Jr(e) {
        var t = e.curOp.scrollToPos;
        if (t) {
          e.curOp.scrollToPos = null;
          var i = Ll(e, t.from), r = Ll(e, t.to);
          Wl(e, i, r, t.margin);
        }
      }
      u(Jr, "resolveScrollToPos");
      function Wl(e, t, i, r) {
        var n = rn(e, {
          left: Math.min(t.left, i.left),
          top: Math.min(t.top, i.top) - r,
          right: Math.max(t.right, i.right),
          bottom: Math.max(t.bottom, i.bottom) + r
        });
        nr(e, n.scrollLeft, n.scrollTop);
      }
      u(Wl, "scrollToCoordsRange");
      function lr(e, t) {
        Math.abs(e.doc.scrollTop - t) < 2 || (Fe || on(e, { top: t }), Hl(e, t, !0), Fe && on(e), sr(e, 100));
      }
      u(lr, "updateScrollTop");
      function Hl(e, t, i) {
        t = Math.max(0, Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t)), !(e.display.scroller.scrollTop == t && !i) && (e.doc.scrollTop = t, e.display.scrollbars.setScrollTop(t), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t));
      }
      u(Hl, "setScrollTop");
      function ct(e, t, i, r) {
        t = Math.max(0, Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth)), !((i ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) && !r) && (e.doc.scrollLeft = t, Rl(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbars.setScrollLeft(t));
      }
      u(ct, "setScrollLeft");
      function or(e) {
        var t = e.display, i = t.gutters.offsetWidth, r = Math.round(e.doc.height + Ui(e.display));
        return {
          clientHeight: t.scroller.clientHeight,
          viewHeight: t.wrapper.clientHeight,
          scrollWidth: t.scroller.scrollWidth,
          clientWidth: t.scroller.clientWidth,
          viewWidth: t.wrapper.clientWidth,
          barLeft: e.options.fixedGutter ? i : 0,
          docHeight: r,
          scrollHeight: r + Ae(e) + t.barHeight,
          nativeBarWidth: t.nativeBarWidth,
          gutterWidth: i
        };
      }
      u(or, "measureForScrollbars");
      var dt = /* @__PURE__ */ u(function(e, t, i) {
        this.cm = i;
        var r = this.vert = T("div", [T("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"), n = this.horiz = T("div", [T("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        r.tabIndex = n.tabIndex = -1, e(r), e(n), M(r, "scroll", function() {
          r.clientHeight && t(r.scrollTop, "vertical");
        }), M(n, "scroll", function() {
          n.clientWidth && t(n.scrollLeft, "horizontal");
        }), this.checkedZeroWidth = !1, O && I < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px");
      }, "NativeScrollbars");
      dt.prototype.update = function(e) {
        var t = e.scrollWidth > e.clientWidth + 1, i = e.scrollHeight > e.clientHeight + 1, r = e.nativeBarWidth;
        if (i) {
          this.vert.style.display = "block", this.vert.style.bottom = t ? r + "px" : "0";
          var n = e.viewHeight - (t ? r : 0);
          this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + n) + "px";
        } else
          this.vert.scrollTop = 0, this.vert.style.display = "", this.vert.firstChild.style.height = "0";
        if (t) {
          this.horiz.style.display = "block", this.horiz.style.right = i ? r + "px" : "0", this.horiz.style.left = e.barLeft + "px";
          var l = e.viewWidth - e.barLeft - (i ? r : 0);
          this.horiz.firstChild.style.width = Math.max(0, e.scrollWidth - e.clientWidth + l) + "px";
        } else
          this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
        return !this.checkedZeroWidth && e.clientHeight > 0 && (r == 0 && this.zeroWidthHack(), this.checkedZeroWidth = !0), { right: i ? r : 0, bottom: t ? r : 0 };
      }, dt.prototype.setScrollLeft = function(e) {
        this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
      }, dt.prototype.setScrollTop = function(e) {
        this.vert.scrollTop != e && (this.vert.scrollTop = e), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
      }, dt.prototype.zeroWidthHack = function() {
        var e = me && !Xo ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = e, this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none", this.disableHoriz = new _e(), this.disableVert = new _e();
      }, dt.prototype.enableZeroWidthBar = function(e, t, i) {
        e.style.pointerEvents = "auto";
        function r() {
          var n = e.getBoundingClientRect(), l = i == "vert" ? document.elementFromPoint(n.right - 1, (n.top + n.bottom) / 2) : document.elementFromPoint((n.right + n.left) / 2, n.bottom - 1);
          l != e ? e.style.pointerEvents = "none" : t.set(1e3, r);
        }
        u(r, "maybeDisable"), t.set(1e3, r);
      }, dt.prototype.clear = function() {
        var e = this.horiz.parentNode;
        e.removeChild(this.horiz), e.removeChild(this.vert);
      };
      var ar = /* @__PURE__ */ u(function() {
      }, "NullScrollbars");
      ar.prototype.update = function() {
        return { bottom: 0, right: 0 };
      }, ar.prototype.setScrollLeft = function() {
      }, ar.prototype.setScrollTop = function() {
      }, ar.prototype.clear = function() {
      };
      function At(e, t) {
        t || (t = or(e));
        var i = e.display.barWidth, r = e.display.barHeight;
        Fl(e, t);
        for (var n = 0; n < 4 && i != e.display.barWidth || r != e.display.barHeight; n++)
          i != e.display.barWidth && e.options.lineWrapping && Zr(e), Fl(e, or(e)), i = e.display.barWidth, r = e.display.barHeight;
      }
      u(At, "updateScrollbars");
      function Fl(e, t) {
        var i = e.display, r = i.scrollbars.update(t);
        i.sizer.style.paddingRight = (i.barWidth = r.right) + "px", i.sizer.style.paddingBottom = (i.barHeight = r.bottom) + "px", i.heightForcer.style.borderBottom = r.bottom + "px solid transparent", r.right && r.bottom ? (i.scrollbarFiller.style.display = "block", i.scrollbarFiller.style.height = r.bottom + "px", i.scrollbarFiller.style.width = r.right + "px") : i.scrollbarFiller.style.display = "", r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (i.gutterFiller.style.display = "block", i.gutterFiller.style.height = r.bottom + "px", i.gutterFiller.style.width = t.gutterWidth + "px") : i.gutterFiller.style.display = "";
      }
      u(Fl, "updateScrollbarsInner");
      var Pl = { native: dt, null: ar };
      function El(e) {
        e.display.scrollbars && (e.display.scrollbars.clear(), e.display.scrollbars.addClass && tt(e.display.wrapper, e.display.scrollbars.addClass)), e.display.scrollbars = new Pl[e.options.scrollbarStyle](function(t) {
          e.display.wrapper.insertBefore(t, e.display.scrollbarFiller), M(t, "mousedown", function() {
            e.state.focused && setTimeout(function() {
              return e.display.input.focus();
            }, 0);
          }), t.setAttribute("cm-not-content", "true");
        }, function(t, i) {
          i == "horizontal" ? ct(e, t) : lr(e, t);
        }, e), e.display.scrollbars.addClass && it(e.display.wrapper, e.display.scrollbars.addClass);
      }
      u(El, "initScrollbars");
      var es = 0;
      function pt(e) {
        e.curOp = {
          cm: e,
          viewChanged: !1,
          // Flag that indicates that lines might need to be redrawn
          startHeight: e.doc.height,
          // Used to detect need to update scrollbar
          forceUpdate: !1,
          // Used to force a redraw
          updateInput: 0,
          // Whether to reset the input textarea
          typing: !1,
          // Whether this reset should be careful to leave existing text (for compositing)
          changeObjs: null,
          // Accumulated changes, for firing change events
          cursorActivityHandlers: null,
          // Set of handlers to fire cursorActivity on
          cursorActivityCalled: 0,
          // Tracks which cursorActivity handlers have been called already
          selectionChanged: !1,
          // Whether the selection needs to be redrawn
          updateMaxLine: !1,
          // Set when the widest line needs to be determined anew
          scrollLeft: null,
          scrollTop: null,
          // Intermediate scroll position, not pushed to DOM yet
          scrollToPos: null,
          // Used to scroll to a specific position
          focus: !1,
          id: ++es,
          // Unique ID
          markArrays: null
          // Used by addMarkedSpan
        }, Oa(e.curOp);
      }
      u(pt, "startOperation");
      function vt(e) {
        var t = e.curOp;
        t && Ha(t, function(i) {
          for (var r = 0; r < i.ops.length; r++)
            i.ops[r].cm.curOp = null;
          ts(i);
        });
      }
      u(vt, "endOperation");
      function ts(e) {
        for (var t = e.ops, i = 0; i < t.length; i++)
          rs(t[i]);
        for (var r = 0; r < t.length; r++)
          is(t[r]);
        for (var n = 0; n < t.length; n++)
          ns(t[n]);
        for (var l = 0; l < t.length; l++)
          ls(t[l]);
        for (var o = 0; o < t.length; o++)
          os(t[o]);
      }
      u(ts, "endOperations");
      function rs(e) {
        var t = e.cm, i = t.display;
        ss(t), e.updateMaxLine && zi(t), e.mustUpdate = e.viewChanged || e.forceUpdate || e.scrollTop != null || e.scrollToPos && (e.scrollToPos.from.line < i.viewFrom || e.scrollToPos.to.line >= i.viewTo) || i.maxLineChanged && t.options.lineWrapping, e.update = e.mustUpdate && new jr(t, e.mustUpdate && { top: e.scrollTop, ensure: e.scrollToPos }, e.forceUpdate);
      }
      u(rs, "endOperation_R1");
      function is(e) {
        e.updatedDisplay = e.mustUpdate && ln(e.cm, e.update);
      }
      u(is, "endOperation_W1");
      function ns(e) {
        var t = e.cm, i = t.display;
        e.updatedDisplay && Zr(t), e.barMeasure = or(t), i.maxLineChanged && !t.options.lineWrapping && (e.adjustWidthTo = gl(t, i.maxLine, i.maxLine.text.length).left + 3, t.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(i.scroller.clientWidth, i.sizer.offsetLeft + e.adjustWidthTo + Ae(t) + t.display.barWidth), e.maxScrollLeft = Math.max(0, i.sizer.offsetLeft + e.adjustWidthTo - st(t))), (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = i.input.prepareSelection());
      }
      u(ns, "endOperation_R2");
      function ls(e) {
        var t = e.cm;
        e.adjustWidthTo != null && (t.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < t.doc.scrollLeft && ct(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0), t.display.maxLineChanged = !1);
        var i = e.focus && e.focus == be();
        e.preparedSelection && t.display.input.showSelection(e.preparedSelection, i), (e.updatedDisplay || e.startHeight != t.doc.height) && At(t, e.barMeasure), e.updatedDisplay && sn(t, e.barMeasure), e.selectionChanged && $i(t), t.state.focused && e.updateInput && t.display.input.reset(e.typing), i && Al(e.cm);
      }
      u(ls, "endOperation_W2");
      function os(e) {
        var t = e.cm, i = t.display, r = t.doc;
        if (e.updatedDisplay && Il(t, e.update), i.wheelStartX != null && (e.scrollTop != null || e.scrollLeft != null || e.scrollToPos) && (i.wheelStartX = i.wheelStartY = null), e.scrollTop != null && Hl(t, e.scrollTop, e.forceScroll), e.scrollLeft != null && ct(t, e.scrollLeft, !0, !0), e.scrollToPos) {
          var n = ja(
            t,
            N(r, e.scrollToPos.from),
            N(r, e.scrollToPos.to),
            e.scrollToPos.margin
          );
          Ja(t, n);
        }
        var l = e.maybeHiddenMarkers, o = e.maybeUnhiddenMarkers;
        if (l)
          for (var a = 0; a < l.length; ++a)
            l[a].lines.length || U(l[a], "hide");
        if (o)
          for (var s = 0; s < o.length; ++s)
            o[s].lines.length && U(o[s], "unhide");
        i.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop), e.changeObjs && U(t, "changes", t, e.changeObjs), e.update && e.update.finish();
      }
      u(os, "endOperation_finish");
      function de(e, t) {
        if (e.curOp)
          return t();
        pt(e);
        try {
          return t();
        } finally {
          vt(e);
        }
      }
      u(de, "runInOp");
      function Q(e, t) {
        return function() {
          if (e.curOp)
            return t.apply(e, arguments);
          pt(e);
          try {
            return t.apply(e, arguments);
          } finally {
            vt(e);
          }
        };
      }
      u(Q, "operation");
      function le(e) {
        return function() {
          if (this.curOp)
            return e.apply(this, arguments);
          pt(this);
          try {
            return e.apply(this, arguments);
          } finally {
            vt(this);
          }
        };
      }
      u(le, "methodOp");
      function J(e) {
        return function() {
          var t = this.cm;
          if (!t || t.curOp)
            return e.apply(this, arguments);
          pt(t);
          try {
            return e.apply(this, arguments);
          } finally {
            vt(t);
          }
        };
      }
      u(J, "docMethodOp");
      function sr(e, t) {
        e.doc.highlightFrontier < e.display.viewTo && e.state.highlight.set(t, pi(as, e));
      }
      u(sr, "startWorker");
      function as(e) {
        var t = e.doc;
        if (!(t.highlightFrontier >= e.display.viewTo)) {
          var i = +/* @__PURE__ */ new Date() + e.options.workTime, r = jt(e, t.highlightFrontier), n = [];
          t.iter(r.line, Math.min(t.first + t.size, e.display.viewTo + 500), function(l) {
            if (r.line >= e.display.viewFrom) {
              var o = l.styles, a = l.text.length > e.options.maxHighlightLength ? lt(t.mode, r.state) : null, s = _n(e, l, r, !0);
              a && (r.state = a), l.styles = s.styles;
              var f = l.styleClasses, h = s.classes;
              h ? l.styleClasses = h : f && (l.styleClasses = null);
              for (var c = !o || o.length != l.styles.length || f != h && (!f || !h || f.bgClass != h.bgClass || f.textClass != h.textClass), p = 0; !c && p < o.length; ++p)
                c = o[p] != l.styles[p];
              c && n.push(r.line), l.stateAfter = r.save(), r.nextLine();
            } else
              l.text.length <= e.options.maxHighlightLength && Fi(e, l.text, r), l.stateAfter = r.line % 5 == 0 ? r.save() : null, r.nextLine();
            if (+/* @__PURE__ */ new Date() > i)
              return sr(e, e.options.workDelay), !0;
          }), t.highlightFrontier = r.line, t.modeFrontier = Math.max(t.modeFrontier, r.line), n.length && de(e, function() {
            for (var l = 0; l < n.length; l++)
              Ye(e, n[l], "text");
          });
        }
      }
      u(as, "highlightWorker");
      var jr = /* @__PURE__ */ u(function(e, t, i) {
        var r = e.display;
        this.viewport = t, this.visible = Qr(r, e.doc, t), this.editorIsHidden = !r.wrapper.offsetWidth, this.wrapperHeight = r.wrapper.clientHeight, this.wrapperWidth = r.wrapper.clientWidth, this.oldDisplayWidth = st(e), this.force = i, this.dims = Qi(e), this.events = [];
      }, "DisplayUpdate");
      jr.prototype.signal = function(e, t) {
        Ce(e, t) && this.events.push(arguments);
      }, jr.prototype.finish = function() {
        for (var e = 0; e < this.events.length; e++)
          U.apply(null, this.events[e]);
      };
      function ss(e) {
        var t = e.display;
        !t.scrollbarsClipped && t.scroller.offsetWidth && (t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth, t.heightForcer.style.height = Ae(e) + "px", t.sizer.style.marginBottom = -t.nativeBarWidth + "px", t.sizer.style.borderRightWidth = Ae(e) + "px", t.scrollbarsClipped = !0);
      }
      u(ss, "maybeClipScrollbars");
      function us(e) {
        if (e.hasFocus())
          return null;
        var t = be();
        if (!t || !Ke(e.display.lineDiv, t))
          return null;
        var i = { activeElt: t };
        if (window.getSelection) {
          var r = window.getSelection();
          r.anchorNode && r.extend && Ke(e.display.lineDiv, r.anchorNode) && (i.anchorNode = r.anchorNode, i.anchorOffset = r.anchorOffset, i.focusNode = r.focusNode, i.focusOffset = r.focusOffset);
        }
        return i;
      }
      u(us, "selectionSnapshot");
      function fs(e) {
        if (!(!e || !e.activeElt || e.activeElt == be()) && (e.activeElt.focus(), !/^(INPUT|TEXTAREA)$/.test(e.activeElt.nodeName) && e.anchorNode && Ke(document.body, e.anchorNode) && Ke(document.body, e.focusNode))) {
          var t = window.getSelection(), i = document.createRange();
          i.setEnd(e.anchorNode, e.anchorOffset), i.collapse(!1), t.removeAllRanges(), t.addRange(i), t.extend(e.focusNode, e.focusOffset);
        }
      }
      u(fs, "restoreSelection");
      function ln(e, t) {
        var i = e.display, r = e.doc;
        if (t.editorIsHidden)
          return qe(e), !1;
        if (!t.force && t.visible.from >= i.viewFrom && t.visible.to <= i.viewTo && (i.updateLineNumbers == null || i.updateLineNumbers >= i.viewTo) && i.renderedView == i.view && Dl(e) == 0)
          return !1;
        Bl(e) && (qe(e), t.dims = Qi(e));
        var n = r.first + r.size, l = Math.max(t.visible.from - e.options.viewportMargin, r.first), o = Math.min(n, t.visible.to + e.options.viewportMargin);
        i.viewFrom < l && l - i.viewFrom < 20 && (l = Math.max(r.first, i.viewFrom)), i.viewTo > o && i.viewTo - o < 20 && (o = Math.min(n, i.viewTo)), Ee && (l = Ri(e.doc, l), o = nl(e.doc, o));
        var a = l != i.viewFrom || o != i.viewTo || i.lastWrapHeight != t.wrapperHeight || i.lastWrapWidth != t.wrapperWidth;
        Za(e, l, o), i.viewOffset = Ie(S(e.doc, i.viewFrom)), e.display.mover.style.top = i.viewOffset + "px";
        var s = Dl(e);
        if (!a && s == 0 && !t.force && i.renderedView == i.view && (i.updateLineNumbers == null || i.updateLineNumbers >= i.viewTo))
          return !1;
        var f = us(e);
        return s > 4 && (i.lineDiv.style.display = "none"), hs(e, i.updateLineNumbers, t.dims), s > 4 && (i.lineDiv.style.display = ""), i.renderedView = i.view, fs(f), Ue(i.cursorDiv), Ue(i.selectionDiv), i.gutters.style.height = i.sizer.style.minHeight = 0, a && (i.lastWrapHeight = t.wrapperHeight, i.lastWrapWidth = t.wrapperWidth, sr(e, 400)), i.updateLineNumbers = null, !0;
      }
      u(ln, "updateDisplayIfNeeded");
      function Il(e, t) {
        for (var i = t.viewport, r = !0; ; r = !1) {
          if (!r || !e.options.lineWrapping || t.oldDisplayWidth == st(e)) {
            if (i && i.top != null && (i = { top: Math.min(e.doc.height + Ui(e.display) - Ki(e), i.top) }), t.visible = Qr(e.display, e.doc, i), t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo)
              break;
          } else
            r && (t.visible = Qr(e.display, e.doc, i));
          if (!ln(e, t))
            break;
          Zr(e);
          var n = or(e);
          ir(e), At(e, n), sn(e, n), t.force = !1;
        }
        t.signal(e, "update", e), (e.display.viewFrom != e.display.reportedViewFrom || e.display.viewTo != e.display.reportedViewTo) && (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo), e.display.reportedViewFrom = e.display.viewFrom, e.display.reportedViewTo = e.display.viewTo);
      }
      u(Il, "postUpdateDisplay");
      function on(e, t) {
        var i = new jr(e, t);
        if (ln(e, i)) {
          Zr(e), Il(e, i);
          var r = or(e);
          ir(e), At(e, r), sn(e, r), i.finish();
        }
      }
      u(on, "updateDisplaySimple");
      function hs(e, t, i) {
        var r = e.display, n = e.options.lineNumbers, l = r.lineDiv, o = l.firstChild;
        function a(v) {
          var g = v.nextSibling;
          return ne && me && e.display.currentWheelTarget == v ? v.style.display = "none" : v.parentNode.removeChild(v), g;
        }
        u(a, "rm");
        for (var s = r.view, f = r.viewFrom, h = 0; h < s.length; h++) {
          var c = s[h];
          if (!c.hidden)
            if (!c.node || c.node.parentNode != l) {
              var p = Ra(e, c, f, i);
              l.insertBefore(p, o);
            } else {
              for (; o != c.node; )
                o = a(o);
              var d = n && t != null && t <= f && c.lineNumber;
              c.changes && (ee(c.changes, "gutter") > -1 && (d = !1), ul(e, c, f, i)), d && (Ue(c.lineNumber), c.lineNumber.appendChild(document.createTextNode(Oi(e.options, f)))), o = c.node.nextSibling;
            }
          f += c.size;
        }
        for (; o; )
          o = a(o);
      }
      u(hs, "patchDisplay");
      function an(e) {
        var t = e.gutters.offsetWidth;
        e.sizer.style.marginLeft = t + "px", Z(e, "gutterChanged", e);
      }
      u(an, "updateGutterSpace");
      function sn(e, t) {
        e.display.sizer.style.minHeight = t.docHeight + "px", e.display.heightForcer.style.top = t.docHeight + "px", e.display.gutters.style.height = t.docHeight + e.display.barHeight + Ae(e) + "px";
      }
      u(sn, "setDocumentHeight");
      function Rl(e) {
        var t = e.display, i = t.view;
        if (!(!t.alignWidgets && (!t.gutters.firstChild || !e.options.fixedGutter))) {
          for (var r = Ji(t) - t.scroller.scrollLeft + e.doc.scrollLeft, n = t.gutters.offsetWidth, l = r + "px", o = 0; o < i.length; o++)
            if (!i[o].hidden) {
              e.options.fixedGutter && (i[o].gutter && (i[o].gutter.style.left = l), i[o].gutterBackground && (i[o].gutterBackground.style.left = l));
              var a = i[o].alignable;
              if (a)
                for (var s = 0; s < a.length; s++)
                  a[s].style.left = l;
            }
          e.options.fixedGutter && (t.gutters.style.left = r + n + "px");
        }
      }
      u(Rl, "alignHorizontally");
      function Bl(e) {
        if (!e.options.lineNumbers)
          return !1;
        var t = e.doc, i = Oi(e.options, t.first + t.size - 1), r = e.display;
        if (i.length != r.lineNumChars) {
          var n = r.measure.appendChild(T(
            "div",
            [T("div", i)],
            "CodeMirror-linenumber CodeMirror-gutter-elt"
          )), l = n.firstChild.offsetWidth, o = n.offsetWidth - l;
          return r.lineGutter.style.width = "", r.lineNumInnerWidth = Math.max(l, r.lineGutter.offsetWidth - o) + 1, r.lineNumWidth = r.lineNumInnerWidth + o, r.lineNumChars = r.lineNumInnerWidth ? i.length : -1, r.lineGutter.style.width = r.lineNumWidth + "px", an(e.display), !0;
        }
        return !1;
      }
      u(Bl, "maybeUpdateLineNumberWidth");
      function un(e, t) {
        for (var i = [], r = !1, n = 0; n < e.length; n++) {
          var l = e[n], o = null;
          if (typeof l != "string" && (o = l.style, l = l.className), l == "CodeMirror-linenumbers")
            if (t)
              r = !0;
            else
              continue;
          i.push({ className: l, style: o });
        }
        return t && !r && i.push({ className: "CodeMirror-linenumbers", style: null }), i;
      }
      u(un, "getGutters");
      function zl(e) {
        var t = e.gutters, i = e.gutterSpecs;
        Ue(t), e.lineGutter = null;
        for (var r = 0; r < i.length; ++r) {
          var n = i[r], l = n.className, o = n.style, a = t.appendChild(T("div", null, "CodeMirror-gutter " + l));
          o && (a.style.cssText = o), l == "CodeMirror-linenumbers" && (e.lineGutter = a, a.style.width = (e.lineNumWidth || 1) + "px");
        }
        t.style.display = i.length ? "" : "none", an(e);
      }
      u(zl, "renderGutters");
      function ur(e) {
        zl(e.display), se(e), Rl(e);
      }
      u(ur, "updateGutters");
      function cs(e, t, i, r) {
        var n = this;
        this.input = i, n.scrollbarFiller = T("div", null, "CodeMirror-scrollbar-filler"), n.scrollbarFiller.setAttribute("cm-not-content", "true"), n.gutterFiller = T("div", null, "CodeMirror-gutter-filler"), n.gutterFiller.setAttribute("cm-not-content", "true"), n.lineDiv = bt("div", null, "CodeMirror-code"), n.selectionDiv = T("div", null, null, "position: relative; z-index: 1"), n.cursorDiv = T("div", null, "CodeMirror-cursors"), n.measure = T("div", null, "CodeMirror-measure"), n.lineMeasure = T("div", null, "CodeMirror-measure"), n.lineSpace = bt(
          "div",
          [n.measure, n.lineMeasure, n.selectionDiv, n.cursorDiv, n.lineDiv],
          null,
          "position: relative; outline: none"
        );
        var l = bt("div", [n.lineSpace], "CodeMirror-lines");
        n.mover = T("div", [l], null, "position: relative"), n.sizer = T("div", [n.mover], "CodeMirror-sizer"), n.sizerWidth = null, n.heightForcer = T("div", null, null, "position: absolute; height: " + Wn + "px; width: 1px;"), n.gutters = T("div", null, "CodeMirror-gutters"), n.lineGutter = null, n.scroller = T("div", [n.sizer, n.heightForcer, n.gutters], "CodeMirror-scroll"), n.scroller.setAttribute("tabIndex", "-1"), n.wrapper = T("div", [n.scrollbarFiller, n.gutterFiller, n.scroller], "CodeMirror"), n.wrapper.setAttribute("translate", "no"), O && I < 8 && (n.gutters.style.zIndex = -1, n.scroller.style.paddingRight = 0), !ne && !(Fe && Kt) && (n.scroller.draggable = !0), e && (e.appendChild ? e.appendChild(n.wrapper) : e(n.wrapper)), n.viewFrom = n.viewTo = t.first, n.reportedViewFrom = n.reportedViewTo = t.first, n.view = [], n.renderedView = null, n.externalMeasured = null, n.viewOffset = 0, n.lastWrapHeight = n.lastWrapWidth = 0, n.updateLineNumbers = null, n.nativeBarWidth = n.barHeight = n.barWidth = 0, n.scrollbarsClipped = !1, n.lineNumWidth = n.lineNumInnerWidth = n.lineNumChars = null, n.alignWidgets = !1, n.cachedCharWidth = n.cachedTextHeight = n.cachedPaddingH = null, n.maxLine = null, n.maxLineLength = 0, n.maxLineChanged = !1, n.wheelDX = n.wheelDY = n.wheelStartX = n.wheelStartY = null, n.shift = !1, n.selForContextMenu = null, n.activeTouch = null, n.gutterSpecs = un(r.gutters, r.lineNumbers), zl(n), i.init(n);
      }
      u(cs, "Display");
      var Vr = 0, Be = null;
      O ? Be = -0.53 : Fe ? Be = 15 : Tr ? Be = -0.7 : Mr && (Be = -1 / 3);
      function Gl(e) {
        var t = e.wheelDeltaX, i = e.wheelDeltaY;
        return t == null && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail), i == null && e.detail && e.axis == e.VERTICAL_AXIS ? i = e.detail : i == null && (i = e.wheelDelta), { x: t, y: i };
      }
      u(Gl, "wheelEventDelta");
      function ds(e) {
        var t = Gl(e);
        return t.x *= Be, t.y *= Be, t;
      }
      u(ds, "wheelEventPixels");
      function Ul(e, t) {
        var i = Gl(t), r = i.x, n = i.y, l = Be;
        t.deltaMode === 0 && (r = t.deltaX, n = t.deltaY, l = 1);
        var o = e.display, a = o.scroller, s = a.scrollWidth > a.clientWidth, f = a.scrollHeight > a.clientHeight;
        if (r && s || n && f) {
          if (n && me && ne) {
            e:
              for (var h = t.target, c = o.view; h != a; h = h.parentNode)
                for (var p = 0; p < c.length; p++)
                  if (c[p].node == h) {
                    e.display.currentWheelTarget = h;
                    break e;
                  }
          }
          if (r && !Fe && !we && l != null) {
            n && f && lr(e, Math.max(0, a.scrollTop + n * l)), ct(e, Math.max(0, a.scrollLeft + r * l)), (!n || n && f) && ae(t), o.wheelStartX = null;
            return;
          }
          if (n && l != null) {
            var d = n * l, v = e.doc.scrollTop, g = v + o.wrapper.clientHeight;
            d < 0 ? v = Math.max(0, v + d - 50) : g = Math.min(e.doc.height, g + d + 50), on(e, { top: v, bottom: g });
          }
          Vr < 20 && t.deltaMode !== 0 && (o.wheelStartX == null ? (o.wheelStartX = a.scrollLeft, o.wheelStartY = a.scrollTop, o.wheelDX = r, o.wheelDY = n, setTimeout(function() {
            if (o.wheelStartX != null) {
              var m = a.scrollLeft - o.wheelStartX, b = a.scrollTop - o.wheelStartY, C = b && o.wheelDY && b / o.wheelDY || m && o.wheelDX && m / o.wheelDX;
              o.wheelStartX = o.wheelStartY = null, C && (Be = (Be * Vr + C) / (Vr + 1), ++Vr);
            }
          }, 200)) : (o.wheelDX += r, o.wheelDY += n));
        }
      }
      u(Ul, "onScrollWheel");
      var ye = /* @__PURE__ */ u(function(e, t) {
        this.ranges = e, this.primIndex = t;
      }, "Selection");
      ye.prototype.primary = function() {
        return this.ranges[this.primIndex];
      }, ye.prototype.equals = function(e) {
        if (e == this)
          return !0;
        if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length)
          return !1;
        for (var t = 0; t < this.ranges.length; t++) {
          var i = this.ranges[t], r = e.ranges[t];
          if (!Wi(i.anchor, r.anchor) || !Wi(i.head, r.head))
            return !1;
        }
        return !0;
      }, ye.prototype.deepCopy = function() {
        for (var e = [], t = 0; t < this.ranges.length; t++)
          e[t] = new W(Hi(this.ranges[t].anchor), Hi(this.ranges[t].head));
        return new ye(e, this.primIndex);
      }, ye.prototype.somethingSelected = function() {
        for (var e = 0; e < this.ranges.length; e++)
          if (!this.ranges[e].empty())
            return !0;
        return !1;
      }, ye.prototype.contains = function(e, t) {
        t || (t = e);
        for (var i = 0; i < this.ranges.length; i++) {
          var r = this.ranges[i];
          if (D(t, r.from()) >= 0 && D(e, r.to()) <= 0)
            return i;
        }
        return -1;
      };
      var W = /* @__PURE__ */ u(function(e, t) {
        this.anchor = e, this.head = t;
      }, "Range");
      W.prototype.from = function() {
        return Pr(this.anchor, this.head);
      }, W.prototype.to = function() {
        return Fr(this.anchor, this.head);
      }, W.prototype.empty = function() {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
      };
      function ke(e, t, i) {
        var r = e && e.options.selectionsMayTouch, n = t[i];
        t.sort(function(p, d) {
          return D(p.from(), d.from());
        }), i = ee(t, n);
        for (var l = 1; l < t.length; l++) {
          var o = t[l], a = t[l - 1], s = D(a.to(), o.from());
          if (r && !o.empty() ? s > 0 : s >= 0) {
            var f = Pr(a.from(), o.from()), h = Fr(a.to(), o.to()), c = a.empty() ? o.from() == o.head : a.from() == a.head;
            l <= i && --i, t.splice(--l, 2, new W(c ? h : f, c ? f : h));
          }
        }
        return new ye(t, i);
      }
      u(ke, "normalizeSelection");
      function Ze(e, t) {
        return new ye([new W(e, t || e)], 0);
      }
      u(Ze, "simpleSelection");
      function Qe(e) {
        return e.text ? y(
          e.from.line + e.text.length - 1,
          H(e.text).length + (e.text.length == 1 ? e.from.ch : 0)
        ) : e.to;
      }
      u(Qe, "changeEnd");
      function Kl(e, t) {
        if (D(e, t.from) < 0)
          return e;
        if (D(e, t.to) <= 0)
          return Qe(t);
        var i = e.line + t.text.length - (t.to.line - t.from.line) - 1, r = e.ch;
        return e.line == t.to.line && (r += Qe(t).ch - t.to.ch), y(i, r);
      }
      u(Kl, "adjustForChange");
      function fn(e, t) {
        for (var i = [], r = 0; r < e.sel.ranges.length; r++) {
          var n = e.sel.ranges[r];
          i.push(new W(
            Kl(n.anchor, t),
            Kl(n.head, t)
          ));
        }
        return ke(e.cm, i, e.sel.primIndex);
      }
      u(fn, "computeSelAfterChange");
      function _l(e, t, i) {
        return e.line == t.line ? y(i.line, e.ch - t.ch + i.ch) : y(i.line + (e.line - t.line), e.ch);
      }
      u(_l, "offsetPos");
      function ps(e, t, i) {
        for (var r = [], n = y(e.first, 0), l = n, o = 0; o < t.length; o++) {
          var a = t[o], s = _l(a.from, n, l), f = _l(Qe(a), n, l);
          if (n = a.to, l = f, i == "around") {
            var h = e.sel.ranges[o], c = D(h.head, h.anchor) < 0;
            r[o] = new W(c ? f : s, c ? s : f);
          } else
            r[o] = new W(s, s);
        }
        return new ye(r, e.sel.primIndex);
      }
      u(ps, "computeReplacedSel");
      function hn(e) {
        e.doc.mode = Di(e.options, e.doc.modeOption), fr(e);
      }
      u(hn, "loadMode");
      function fr(e) {
        e.doc.iter(function(t) {
          t.stateAfter && (t.stateAfter = null), t.styles && (t.styles = null);
        }), e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first, sr(e, 100), e.state.modeGen++, e.curOp && se(e);
      }
      u(fr, "resetModeState");
      function Xl(e, t) {
        return t.from.ch == 0 && t.to.ch == 0 && H(t.text) == "" && (!e.cm || e.cm.options.wholeLineUpdateBefore);
      }
      u(Xl, "isWholeLineUpdate");
      function cn(e, t, i, r) {
        function n(C) {
          return i ? i[C] : null;
        }
        u(n, "spansFor");
        function l(C, x, w) {
          wa(C, x, w, r), Z(C, "change", C, t);
        }
        u(l, "update");
        function o(C, x) {
          for (var w = [], k = C; k < x; ++k)
            w.push(new St(f[k], n(k), r));
          return w;
        }
        u(o, "linesFor");
        var a = t.from, s = t.to, f = t.text, h = S(e, a.line), c = S(e, s.line), p = H(f), d = n(f.length - 1), v = s.line - a.line;
        if (t.full)
          e.insert(0, o(0, f.length)), e.remove(f.length, e.size - f.length);
        else if (Xl(e, t)) {
          var g = o(0, f.length - 1);
          l(c, c.text, d), v && e.remove(a.line, v), g.length && e.insert(a.line, g);
        } else if (h == c)
          if (f.length == 1)
            l(h, h.text.slice(0, a.ch) + p + h.text.slice(s.ch), d);
          else {
            var m = o(1, f.length - 1);
            m.push(new St(p + h.text.slice(s.ch), d, r)), l(h, h.text.slice(0, a.ch) + f[0], n(0)), e.insert(a.line + 1, m);
          }
        else if (f.length == 1)
          l(h, h.text.slice(0, a.ch) + f[0] + c.text.slice(s.ch), n(0)), e.remove(a.line + 1, v);
        else {
          l(h, h.text.slice(0, a.ch) + f[0], n(0)), l(c, p + c.text.slice(s.ch), d);
          var b = o(1, f.length - 1);
          v > 1 && e.remove(a.line + 1, v - 1), e.insert(a.line + 1, b);
        }
        Z(e, "change", e, t);
      }
      u(cn, "updateDoc");
      function Je(e, t, i) {
        function r(n, l, o) {
          if (n.linked)
            for (var a = 0; a < n.linked.length; ++a) {
              var s = n.linked[a];
              if (s.doc != l) {
                var f = o && s.sharedHist;
                i && !f || (t(s.doc, f), r(s.doc, n, f));
              }
            }
        }
        u(r, "propagate"), r(e, null, !0);
      }
      u(Je, "linkedDocs");
      function Yl(e, t) {
        if (t.cm)
          throw new Error("This document is already in use.");
        e.doc = t, t.cm = e, ji(e), hn(e), ql(e), e.options.direction = t.direction, e.options.lineWrapping || zi(e), e.options.mode = t.modeOption, se(e);
      }
      u(Yl, "attachDoc");
      function ql(e) {
        (e.doc.direction == "rtl" ? it : tt)(e.display.lineDiv, "CodeMirror-rtl");
      }
      u(ql, "setDirectionClass");
      function vs(e) {
        de(e, function() {
          ql(e), se(e);
        });
      }
      u(vs, "directionChanged");
      function $r(e) {
        this.done = [], this.undone = [], this.undoDepth = e ? e.undoDepth : 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e ? e.maxGeneration : 1;
      }
      u($r, "History");
      function dn(e, t) {
        var i = { from: Hi(t.from), to: Qe(t), text: ot(e, t.from, t.to) };
        return Jl(e, i, t.from.line, t.to.line + 1), Je(e, function(r) {
          return Jl(r, i, t.from.line, t.to.line + 1);
        }, !0), i;
      }
      u(dn, "historyChangeFromChange");
      function Zl(e) {
        for (; e.length; ) {
          var t = H(e);
          if (t.ranges)
            e.pop();
          else
            break;
        }
      }
      u(Zl, "clearSelectionEvents");
      function gs(e, t) {
        if (t)
          return Zl(e.done), H(e.done);
        if (e.done.length && !H(e.done).ranges)
          return H(e.done);
        if (e.done.length > 1 && !e.done[e.done.length - 2].ranges)
          return e.done.pop(), H(e.done);
      }
      u(gs, "lastChangeEvent");
      function Ql(e, t, i, r) {
        var n = e.history;
        n.undone.length = 0;
        var l = +/* @__PURE__ */ new Date(), o, a;
        if ((n.lastOp == r || n.lastOrigin == t.origin && t.origin && (t.origin.charAt(0) == "+" && n.lastModTime > l - (e.cm ? e.cm.options.historyEventDelay : 500) || t.origin.charAt(0) == "*")) && (o = gs(n, n.lastOp == r)))
          a = H(o.changes), D(t.from, t.to) == 0 && D(t.from, a.to) == 0 ? a.to = Qe(t) : o.changes.push(dn(e, t));
        else {
          var s = H(n.done);
          for ((!s || !s.ranges) && ei(e.sel, n.done), o = {
            changes: [dn(e, t)],
            generation: n.generation
          }, n.done.push(o); n.done.length > n.undoDepth; )
            n.done.shift(), n.done[0].ranges || n.done.shift();
        }
        n.done.push(i), n.generation = ++n.maxGeneration, n.lastModTime = n.lastSelTime = l, n.lastOp = n.lastSelOp = r, n.lastOrigin = n.lastSelOrigin = t.origin, a || U(e, "historyAdded");
      }
      u(Ql, "addChangeToHistory");
      function ys(e, t, i, r) {
        var n = t.charAt(0);
        return n == "*" || n == "+" && i.ranges.length == r.ranges.length && i.somethingSelected() == r.somethingSelected() && /* @__PURE__ */ new Date() - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500);
      }
      u(ys, "selectionEventCanBeMerged");
      function ms(e, t, i, r) {
        var n = e.history, l = r && r.origin;
        i == n.lastSelOp || l && n.lastSelOrigin == l && (n.lastModTime == n.lastSelTime && n.lastOrigin == l || ys(e, l, H(n.done), t)) ? n.done[n.done.length - 1] = t : ei(t, n.done), n.lastSelTime = +/* @__PURE__ */ new Date(), n.lastSelOrigin = l, n.lastSelOp = i, r && r.clearRedo !== !1 && Zl(n.undone);
      }
      u(ms, "addSelectionToHistory");
      function ei(e, t) {
        var i = H(t);
        i && i.ranges && i.equals(e) || t.push(e);
      }
      u(ei, "pushSelectionToHistory");
      function Jl(e, t, i, r) {
        var n = t["spans_" + e.id], l = 0;
        e.iter(Math.max(e.first, i), Math.min(e.first + e.size, r), function(o) {
          o.markedSpans && ((n || (n = t["spans_" + e.id] = {}))[l] = o.markedSpans), ++l;
        });
      }
      u(Jl, "attachLocalSpans");
      function bs(e) {
        if (!e)
          return null;
        for (var t, i = 0; i < e.length; ++i)
          e[i].marker.explicitlyCleared ? t || (t = e.slice(0, i)) : t && t.push(e[i]);
        return t ? t.length ? t : null : e;
      }
      u(bs, "removeClearedSpans");
      function xs(e, t) {
        var i = t["spans_" + e.id];
        if (!i)
          return null;
        for (var r = [], n = 0; n < t.text.length; ++n)
          r.push(bs(i[n]));
        return r;
      }
      u(xs, "getOldSpans");
      function jl(e, t) {
        var i = xs(e, t), r = Ei(e, t);
        if (!i)
          return r;
        if (!r)
          return i;
        for (var n = 0; n < i.length; ++n) {
          var l = i[n], o = r[n];
          if (l && o)
            e:
              for (var a = 0; a < o.length; ++a) {
                for (var s = o[a], f = 0; f < l.length; ++f)
                  if (l[f].marker == s.marker)
                    continue e;
                l.push(s);
              }
          else
            o && (i[n] = o);
        }
        return i;
      }
      u(jl, "mergeOldSpans");
      function Ot(e, t, i) {
        for (var r = [], n = 0; n < e.length; ++n) {
          var l = e[n];
          if (l.ranges) {
            r.push(i ? ye.prototype.deepCopy.call(l) : l);
            continue;
          }
          var o = l.changes, a = [];
          r.push({ changes: a });
          for (var s = 0; s < o.length; ++s) {
            var f = o[s], h = void 0;
            if (a.push({ from: f.from, to: f.to, text: f.text }), t)
              for (var c in f)
                (h = c.match(/^spans_(\d+)$/)) && ee(t, Number(h[1])) > -1 && (H(a)[c] = f[c], delete f[c]);
          }
        }
        return r;
      }
      u(Ot, "copyHistoryArray");
      function pn(e, t, i, r) {
        if (r) {
          var n = e.anchor;
          if (i) {
            var l = D(t, n) < 0;
            l != D(i, n) < 0 ? (n = t, t = i) : l != D(t, i) < 0 && (t = i);
          }
          return new W(n, t);
        } else
          return new W(i || t, t);
      }
      u(pn, "extendRange");
      function ti(e, t, i, r, n) {
        n == null && (n = e.cm && (e.cm.display.shift || e.extend)), te(e, new ye([pn(e.sel.primary(), t, i, n)], 0), r);
      }
      u(ti, "extendSelection");
      function Vl(e, t, i) {
        for (var r = [], n = e.cm && (e.cm.display.shift || e.extend), l = 0; l < e.sel.ranges.length; l++)
          r[l] = pn(e.sel.ranges[l], t[l], null, n);
        var o = ke(e.cm, r, e.sel.primIndex);
        te(e, o, i);
      }
      u(Vl, "extendSelections");
      function vn(e, t, i, r) {
        var n = e.sel.ranges.slice(0);
        n[t] = i, te(e, ke(e.cm, n, e.sel.primIndex), r);
      }
      u(vn, "replaceOneSelection");
      function $l(e, t, i, r) {
        te(e, Ze(t, i), r);
      }
      u($l, "setSimpleSelection");
      function Cs(e, t, i) {
        var r = {
          ranges: t.ranges,
          update: function(n) {
            this.ranges = [];
            for (var l = 0; l < n.length; l++)
              this.ranges[l] = new W(
                N(e, n[l].anchor),
                N(e, n[l].head)
              );
          },
          origin: i && i.origin
        };
        return U(e, "beforeSelectionChange", e, r), e.cm && U(e.cm, "beforeSelectionChange", e.cm, r), r.ranges != t.ranges ? ke(e.cm, r.ranges, r.ranges.length - 1) : t;
      }
      u(Cs, "filterSelectionChange");
      function eo(e, t, i) {
        var r = e.history.done, n = H(r);
        n && n.ranges ? (r[r.length - 1] = t, ri(e, t, i)) : te(e, t, i);
      }
      u(eo, "setSelectionReplaceHistory");
      function te(e, t, i) {
        ri(e, t, i), ms(e, e.sel, e.cm ? e.cm.curOp.id : NaN, i);
      }
      u(te, "setSelection");
      function ri(e, t, i) {
        (Ce(e, "beforeSelectionChange") || e.cm && Ce(e.cm, "beforeSelectionChange")) && (t = Cs(e, t, i));
        var r = i && i.bias || (D(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
        to(e, io(e, t, r, !0)), !(i && i.scroll === !1) && e.cm && e.cm.getOption("readOnly") != "nocursor" && Nt(e.cm);
      }
      u(ri, "setSelectionNoUndo");
      function to(e, t) {
        t.equals(e.sel) || (e.sel = t, e.cm && (e.cm.curOp.updateInput = 1, e.cm.curOp.selectionChanged = !0, Rn(e.cm)), Z(e, "cursorActivity", e));
      }
      u(to, "setSelectionInner");
      function ro(e) {
        to(e, io(e, e.sel, null, !1));
      }
      u(ro, "reCheckSelection");
      function io(e, t, i, r) {
        for (var n, l = 0; l < t.ranges.length; l++) {
          var o = t.ranges[l], a = t.ranges.length == e.sel.ranges.length && e.sel.ranges[l], s = ii(e, o.anchor, a && a.anchor, i, r), f = ii(e, o.head, a && a.head, i, r);
          (n || s != o.anchor || f != o.head) && (n || (n = t.ranges.slice(0, l)), n[l] = new W(s, f));
        }
        return n ? ke(e.cm, n, t.primIndex) : t;
      }
      u(io, "skipAtomicInSelection");
      function Wt(e, t, i, r, n) {
        var l = S(e, t.line);
        if (l.markedSpans)
          for (var o = 0; o < l.markedSpans.length; ++o) {
            var a = l.markedSpans[o], s = a.marker, f = "selectLeft" in s ? !s.selectLeft : s.inclusiveLeft, h = "selectRight" in s ? !s.selectRight : s.inclusiveRight;
            if ((a.from == null || (f ? a.from <= t.ch : a.from < t.ch)) && (a.to == null || (h ? a.to >= t.ch : a.to > t.ch))) {
              if (n && (U(s, "beforeCursorEnter"), s.explicitlyCleared))
                if (l.markedSpans) {
                  --o;
                  continue;
                } else
                  break;
              if (!s.atomic)
                continue;
              if (i) {
                var c = s.find(r < 0 ? 1 : -1), p = void 0;
                if ((r < 0 ? h : f) && (c = no(e, c, -r, c && c.line == t.line ? l : null)), c && c.line == t.line && (p = D(c, i)) && (r < 0 ? p < 0 : p > 0))
                  return Wt(e, c, t, r, n);
              }
              var d = s.find(r < 0 ? -1 : 1);
              return (r < 0 ? f : h) && (d = no(e, d, r, d.line == t.line ? l : null)), d ? Wt(e, d, t, r, n) : null;
            }
          }
        return t;
      }
      u(Wt, "skipAtomicInner");
      function ii(e, t, i, r, n) {
        var l = r || 1, o = Wt(e, t, i, l, n) || !n && Wt(e, t, i, l, !0) || Wt(e, t, i, -l, n) || !n && Wt(e, t, i, -l, !0);
        return o || (e.cantEdit = !0, y(e.first, 0));
      }
      u(ii, "skipAtomic");
      function no(e, t, i, r) {
        return i < 0 && t.ch == 0 ? t.line > e.first ? N(e, y(t.line - 1)) : null : i > 0 && t.ch == (r || S(e, t.line)).text.length ? t.line < e.first + e.size - 1 ? y(t.line + 1, 0) : null : new y(t.line, t.ch + i);
      }
      u(no, "movePos");
      function lo(e) {
        e.setSelection(y(e.firstLine(), 0), y(e.lastLine()), Me);
      }
      u(lo, "selectAll");
      function oo(e, t, i) {
        var r = {
          canceled: !1,
          from: t.from,
          to: t.to,
          text: t.text,
          origin: t.origin,
          cancel: function() {
            return r.canceled = !0;
          }
        };
        return i && (r.update = function(n, l, o, a) {
          n && (r.from = N(e, n)), l && (r.to = N(e, l)), o && (r.text = o), a !== void 0 && (r.origin = a);
        }), U(e, "beforeChange", e, r), e.cm && U(e.cm, "beforeChange", e.cm, r), r.canceled ? (e.cm && (e.cm.curOp.updateInput = 2), null) : { from: r.from, to: r.to, text: r.text, origin: r.origin };
      }
      u(oo, "filterChange");
      function Ht(e, t, i) {
        if (e.cm) {
          if (!e.cm.curOp)
            return Q(e.cm, Ht)(e, t, i);
          if (e.cm.state.suppressEdits)
            return;
        }
        if (!((Ce(e, "beforeChange") || e.cm && Ce(e.cm, "beforeChange")) && (t = oo(e, t, !0), !t))) {
          var r = jn && !i && ma(e, t.from, t.to);
          if (r)
            for (var n = r.length - 1; n >= 0; --n)
              ao(e, { from: r[n].from, to: r[n].to, text: n ? [""] : t.text, origin: t.origin });
          else
            ao(e, t);
        }
      }
      u(Ht, "makeChange");
      function ao(e, t) {
        if (!(t.text.length == 1 && t.text[0] == "" && D(t.from, t.to) == 0)) {
          var i = fn(e, t);
          Ql(e, t, i, e.cm ? e.cm.curOp.id : NaN), hr(e, t, i, Ei(e, t));
          var r = [];
          Je(e, function(n, l) {
            !l && ee(r, n.history) == -1 && (ho(n.history, t), r.push(n.history)), hr(n, t, null, Ei(n, t));
          });
        }
      }
      u(ao, "makeChangeInner");
      function ni(e, t, i) {
        var r = e.cm && e.cm.state.suppressEdits;
        if (!(r && !i)) {
          for (var n = e.history, l, o = e.sel, a = t == "undo" ? n.done : n.undone, s = t == "undo" ? n.undone : n.done, f = 0; f < a.length && (l = a[f], !(i ? l.ranges && !l.equals(e.sel) : !l.ranges)); f++)
            ;
          if (f != a.length) {
            for (n.lastOrigin = n.lastSelOrigin = null; ; )
              if (l = a.pop(), l.ranges) {
                if (ei(l, s), i && !l.equals(e.sel)) {
                  te(e, l, { clearRedo: !1 });
                  return;
                }
                o = l;
              } else if (r) {
                a.push(l);
                return;
              } else
                break;
            var h = [];
            ei(o, s), s.push({ changes: h, generation: n.generation }), n.generation = l.generation || ++n.maxGeneration;
            for (var c = Ce(e, "beforeChange") || e.cm && Ce(e.cm, "beforeChange"), p = /* @__PURE__ */ u(function(g) {
              var m = l.changes[g];
              if (m.origin = t, c && !oo(e, m, !1))
                return a.length = 0, {};
              h.push(dn(e, m));
              var b = g ? fn(e, m) : H(a);
              hr(e, m, b, jl(e, m)), !g && e.cm && e.cm.scrollIntoView({ from: m.from, to: Qe(m) });
              var C = [];
              Je(e, function(x, w) {
                !w && ee(C, x.history) == -1 && (ho(x.history, m), C.push(x.history)), hr(x, m, null, jl(x, m));
              });
            }, "loop"), d = l.changes.length - 1; d >= 0; --d) {
              var v = p(d);
              if (v)
                return v.v;
            }
          }
        }
      }
      u(ni, "makeChangeFromHistory");
      function so(e, t) {
        if (t != 0 && (e.first += t, e.sel = new ye(Or(e.sel.ranges, function(n) {
          return new W(
            y(n.anchor.line + t, n.anchor.ch),
            y(n.head.line + t, n.head.ch)
          );
        }), e.sel.primIndex), e.cm)) {
          se(e.cm, e.first, e.first - t, t);
          for (var i = e.cm.display, r = i.viewFrom; r < i.viewTo; r++)
            Ye(e.cm, r, "gutter");
        }
      }
      u(so, "shiftDoc");
      function hr(e, t, i, r) {
        if (e.cm && !e.cm.curOp)
          return Q(e.cm, hr)(e, t, i, r);
        if (t.to.line < e.first) {
          so(e, t.text.length - 1 - (t.to.line - t.from.line));
          return;
        }
        if (!(t.from.line > e.lastLine())) {
          if (t.from.line < e.first) {
            var n = t.text.length - 1 - (e.first - t.from.line);
            so(e, n), t = {
              from: y(e.first, 0),
              to: y(t.to.line + n, t.to.ch),
              text: [H(t.text)],
              origin: t.origin
            };
          }
          var l = e.lastLine();
          t.to.line > l && (t = {
            from: t.from,
            to: y(l, S(e, l).text.length),
            text: [t.text[0]],
            origin: t.origin
          }), t.removed = ot(e, t.from, t.to), i || (i = fn(e, t)), e.cm ? ws(e.cm, t, r) : cn(e, t, r), ri(e, i, Me), e.cantEdit && ii(e, y(e.firstLine(), 0)) && (e.cantEdit = !1);
        }
      }
      u(hr, "makeChangeSingleDoc");
      function ws(e, t, i) {
        var r = e.doc, n = e.display, l = t.from, o = t.to, a = !1, s = l.line;
        e.options.lineWrapping || (s = F(Se(S(r, l.line))), r.iter(s, o.line + 1, function(d) {
          if (d == n.maxLine)
            return a = !0, !0;
        })), r.sel.contains(t.from, t.to) > -1 && Rn(e), cn(r, t, i, Ml(e)), e.options.lineWrapping || (r.iter(s, l.line + t.text.length, function(d) {
          var v = Gr(d);
          v > n.maxLineLength && (n.maxLine = d, n.maxLineLength = v, n.maxLineChanged = !0, a = !1);
        }), a && (e.curOp.updateMaxLine = !0)), ha(r, l.line), sr(e, 400);
        var f = t.text.length - (o.line - l.line) - 1;
        t.full ? se(e) : l.line == o.line && t.text.length == 1 && !Xl(e.doc, t) ? Ye(e, l.line, "text") : se(e, l.line, o.line + 1, f);
        var h = Ce(e, "changes"), c = Ce(e, "change");
        if (c || h) {
          var p = {
            from: l,
            to: o,
            text: t.text,
            removed: t.removed,
            origin: t.origin
          };
          c && Z(e, "change", e, p), h && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(p);
        }
        e.display.selForContextMenu = null;
      }
      u(ws, "makeChangeSingleDocInEditor");
      function Ft(e, t, i, r, n) {
        var l;
        r || (r = i), D(r, i) < 0 && (l = [r, i], i = l[0], r = l[1]), typeof t == "string" && (t = e.splitLines(t)), Ht(e, { from: i, to: r, text: t, origin: n });
      }
      u(Ft, "replaceRange");
      function uo(e, t, i, r) {
        i < e.line ? e.line += r : t < e.line && (e.line = t, e.ch = 0);
      }
      u(uo, "rebaseHistSelSingle");
      function fo(e, t, i, r) {
        for (var n = 0; n < e.length; ++n) {
          var l = e[n], o = !0;
          if (l.ranges) {
            l.copied || (l = e[n] = l.deepCopy(), l.copied = !0);
            for (var a = 0; a < l.ranges.length; a++)
              uo(l.ranges[a].anchor, t, i, r), uo(l.ranges[a].head, t, i, r);
            continue;
          }
          for (var s = 0; s < l.changes.length; ++s) {
            var f = l.changes[s];
            if (i < f.from.line)
              f.from = y(f.from.line + r, f.from.ch), f.to = y(f.to.line + r, f.to.ch);
            else if (t <= f.to.line) {
              o = !1;
              break;
            }
          }
          o || (e.splice(0, n + 1), n = 0);
        }
      }
      u(fo, "rebaseHistArray");
      function ho(e, t) {
        var i = t.from.line, r = t.to.line, n = t.text.length - (r - i) - 1;
        fo(e.done, i, r, n), fo(e.undone, i, r, n);
      }
      u(ho, "rebaseHist");
      function cr(e, t, i, r) {
        var n = t, l = t;
        return typeof t == "number" ? l = S(e, Un(e, t)) : n = F(t), n == null ? null : (r(l, n) && e.cm && Ye(e.cm, n, i), l);
      }
      u(cr, "changeLine");
      function dr(e) {
        this.lines = e, this.parent = null;
        for (var t = 0, i = 0; i < e.length; ++i)
          e[i].parent = this, t += e[i].height;
        this.height = t;
      }
      u(dr, "LeafChunk"), dr.prototype = {
        chunkSize: function() {
          return this.lines.length;
        },
        // Remove the n lines at offset 'at'.
        removeInner: function(e, t) {
          for (var i = e, r = e + t; i < r; ++i) {
            var n = this.lines[i];
            this.height -= n.height, Sa(n), Z(n, "delete");
          }
          this.lines.splice(e, t);
        },
        // Helper used to collapse a small branch into a single leaf.
        collapse: function(e) {
          e.push.apply(e, this.lines);
        },
        // Insert the given array of lines at offset 'at', count them as
        // having the given height.
        insertInner: function(e, t, i) {
          this.height += i, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
          for (var r = 0; r < t.length; ++r)
            t[r].parent = this;
        },
        // Used to iterate over a part of the tree.
        iterN: function(e, t, i) {
          for (var r = e + t; e < r; ++e)
            if (i(this.lines[e]))
              return !0;
        }
      };
      function pr(e) {
        this.children = e;
        for (var t = 0, i = 0, r = 0; r < e.length; ++r) {
          var n = e[r];
          t += n.chunkSize(), i += n.height, n.parent = this;
        }
        this.size = t, this.height = i, this.parent = null;
      }
      u(pr, "BranchChunk"), pr.prototype = {
        chunkSize: function() {
          return this.size;
        },
        removeInner: function(e, t) {
          this.size -= t;
          for (var i = 0; i < this.children.length; ++i) {
            var r = this.children[i], n = r.chunkSize();
            if (e < n) {
              var l = Math.min(t, n - e), o = r.height;
              if (r.removeInner(e, l), this.height -= o - r.height, n == l && (this.children.splice(i--, 1), r.parent = null), (t -= l) == 0)
                break;
              e = 0;
            } else
              e -= n;
          }
          if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof dr))) {
            var a = [];
            this.collapse(a), this.children = [new dr(a)], this.children[0].parent = this;
          }
        },
        collapse: function(e) {
          for (var t = 0; t < this.children.length; ++t)
            this.children[t].collapse(e);
        },
        insertInner: function(e, t, i) {
          this.size += t.length, this.height += i;
          for (var r = 0; r < this.children.length; ++r) {
            var n = this.children[r], l = n.chunkSize();
            if (e <= l) {
              if (n.insertInner(e, t, i), n.lines && n.lines.length > 50) {
                for (var o = n.lines.length % 25 + 25, a = o; a < n.lines.length; ) {
                  var s = new dr(n.lines.slice(a, a += 25));
                  n.height -= s.height, this.children.splice(++r, 0, s), s.parent = this;
                }
                n.lines = n.lines.slice(0, o), this.maybeSpill();
              }
              break;
            }
            e -= l;
          }
        },
        // When a node has grown, check whether it should be split.
        maybeSpill: function() {
          if (!(this.children.length <= 10)) {
            var e = this;
            do {
              var t = e.children.splice(e.children.length - 5, 5), i = new pr(t);
              if (e.parent) {
                e.size -= i.size, e.height -= i.height;
                var n = ee(e.parent.children, e);
                e.parent.children.splice(n + 1, 0, i);
              } else {
                var r = new pr(e.children);
                r.parent = e, e.children = [r, i], e = r;
              }
              i.parent = e.parent;
            } while (e.children.length > 10);
            e.parent.maybeSpill();
          }
        },
        iterN: function(e, t, i) {
          for (var r = 0; r < this.children.length; ++r) {
            var n = this.children[r], l = n.chunkSize();
            if (e < l) {
              var o = Math.min(t, l - e);
              if (n.iterN(e, o, i))
                return !0;
              if ((t -= o) == 0)
                break;
              e = 0;
            } else
              e -= l;
          }
        }
      };
      var vr = /* @__PURE__ */ u(function(e, t, i) {
        if (i)
          for (var r in i)
            i.hasOwnProperty(r) && (this[r] = i[r]);
        this.doc = e, this.node = t;
      }, "LineWidget");
      vr.prototype.clear = function() {
        var e = this.doc.cm, t = this.line.widgets, i = this.line, r = F(i);
        if (!(r == null || !t)) {
          for (var n = 0; n < t.length; ++n)
            t[n] == this && t.splice(n--, 1);
          t.length || (i.widgets = null);
          var l = tr(this);
          De(i, Math.max(0, i.height - l)), e && (de(e, function() {
            co(e, i, -l), Ye(e, r, "widget");
          }), Z(e, "lineWidgetCleared", e, this, r));
        }
      }, vr.prototype.changed = function() {
        var e = this, t = this.height, i = this.doc.cm, r = this.line;
        this.height = null;
        var n = tr(this) - t;
        n && (Xe(this.doc, r) || De(r, r.height + n), i && de(i, function() {
          i.curOp.forceUpdate = !0, co(i, r, n), Z(i, "lineWidgetChanged", i, e, F(r));
        }));
      }, xt(vr);
      function co(e, t, i) {
        Ie(t) < (e.curOp && e.curOp.scrollTop || e.doc.scrollTop) && nn(e, i);
      }
      u(co, "adjustScrollWhenAboveVisible");
      function Ss(e, t, i, r) {
        var n = new vr(e, i, r), l = e.cm;
        return l && n.noHScroll && (l.display.alignWidgets = !0), cr(e, t, "widget", function(o) {
          var a = o.widgets || (o.widgets = []);
          if (n.insertAt == null ? a.push(n) : a.splice(Math.min(a.length, Math.max(0, n.insertAt)), 0, n), n.line = o, l && !Xe(e, o)) {
            var s = Ie(o) < e.scrollTop;
            De(o, o.height + tr(n)), s && nn(l, n.height), l.curOp.forceUpdate = !0;
          }
          return !0;
        }), l && Z(l, "lineWidgetAdded", l, n, typeof t == "number" ? t : F(t)), n;
      }
      u(Ss, "addLineWidget");
      var po = 0, je = /* @__PURE__ */ u(function(e, t) {
        this.lines = [], this.type = t, this.doc = e, this.id = ++po;
      }, "TextMarker");
      je.prototype.clear = function() {
        if (!this.explicitlyCleared) {
          var e = this.doc.cm, t = e && !e.curOp;
          if (t && pt(e), Ce(this, "clear")) {
            var i = this.find();
            i && Z(this, "clear", i.from, i.to);
          }
          for (var r = null, n = null, l = 0; l < this.lines.length; ++l) {
            var o = this.lines[l], a = Vt(o.markedSpans, this);
            e && !this.collapsed ? Ye(e, F(o), "text") : e && (a.to != null && (n = F(o)), a.from != null && (r = F(o))), o.markedSpans = pa(o.markedSpans, a), a.from == null && this.collapsed && !Xe(this.doc, o) && e && De(o, Tt(e.display));
          }
          if (e && this.collapsed && !e.options.lineWrapping)
            for (var s = 0; s < this.lines.length; ++s) {
              var f = Se(this.lines[s]), h = Gr(f);
              h > e.display.maxLineLength && (e.display.maxLine = f, e.display.maxLineLength = h, e.display.maxLineChanged = !0);
            }
          r != null && e && this.collapsed && se(e, r, n + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, e && ro(e.doc)), e && Z(e, "markerCleared", e, this, r, n), t && vt(e), this.parent && this.parent.clear();
        }
      }, je.prototype.find = function(e, t) {
        e == null && this.type == "bookmark" && (e = 1);
        for (var i, r, n = 0; n < this.lines.length; ++n) {
          var l = this.lines[n], o = Vt(l.markedSpans, this);
          if (o.from != null && (i = y(t ? l : F(l), o.from), e == -1))
            return i;
          if (o.to != null && (r = y(t ? l : F(l), o.to), e == 1))
            return r;
        }
        return i && { from: i, to: r };
      }, je.prototype.changed = function() {
        var e = this, t = this.find(-1, !0), i = this, r = this.doc.cm;
        !t || !r || de(r, function() {
          var n = t.line, l = F(t.line), o = _i(r, l);
          if (o && (bl(o), r.curOp.selectionChanged = r.curOp.forceUpdate = !0), r.curOp.updateMaxLine = !0, !Xe(i.doc, n) && i.height != null) {
            var a = i.height;
            i.height = null;
            var s = tr(i) - a;
            s && De(n, n.height + s);
          }
          Z(r, "markerChanged", r, e);
        });
      }, je.prototype.attachLine = function(e) {
        if (!this.lines.length && this.doc.cm) {
          var t = this.doc.cm.curOp;
          (!t.maybeHiddenMarkers || ee(t.maybeHiddenMarkers, this) == -1) && (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this);
        }
        this.lines.push(e);
      }, je.prototype.detachLine = function(e) {
        if (this.lines.splice(ee(this.lines, e), 1), !this.lines.length && this.doc.cm) {
          var t = this.doc.cm.curOp;
          (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this);
        }
      }, xt(je);
      function Pt(e, t, i, r, n) {
        if (r && r.shared)
          return Ls(e, t, i, r, n);
        if (e.cm && !e.cm.curOp)
          return Q(e.cm, Pt)(e, t, i, r, n);
        var l = new je(e, n), o = D(t, i);
        if (r && nt(r, l, !1), o > 0 || o == 0 && l.clearWhenEmpty !== !1)
          return l;
        if (l.replacedWith && (l.collapsed = !0, l.widgetNode = bt("span", [l.replacedWith], "CodeMirror-widget"), r.handleMouseEvents || l.widgetNode.setAttribute("cm-ignore-events", "true"), r.insertLeft && (l.widgetNode.insertLeft = !0)), l.collapsed) {
          if (il(e, t.line, t, i, l) || t.line != i.line && il(e, i.line, t, i, l))
            throw new Error("Inserting collapsed marker partially overlapping an existing one");
          da();
        }
        l.addToHistory && Ql(e, { from: t, to: i, origin: "markText" }, e.sel, NaN);
        var a = t.line, s = e.cm, f;
        if (e.iter(a, i.line + 1, function(c) {
          s && l.collapsed && !s.options.lineWrapping && Se(c) == s.display.maxLine && (f = !0), l.collapsed && a != t.line && De(c, 0), va(c, new Ir(
            l,
            a == t.line ? t.ch : null,
            a == i.line ? i.ch : null
          ), e.cm && e.cm.curOp), ++a;
        }), l.collapsed && e.iter(t.line, i.line + 1, function(c) {
          Xe(e, c) && De(c, 0);
        }), l.clearOnEnter && M(l, "beforeCursorEnter", function() {
          return l.clear();
        }), l.readOnly && (ca(), (e.history.done.length || e.history.undone.length) && e.clearHistory()), l.collapsed && (l.id = ++po, l.atomic = !0), s) {
          if (f && (s.curOp.updateMaxLine = !0), l.collapsed)
            se(s, t.line, i.line + 1);
          else if (l.className || l.startStyle || l.endStyle || l.css || l.attributes || l.title)
            for (var h = t.line; h <= i.line; h++)
              Ye(s, h, "text");
          l.atomic && ro(s.doc), Z(s, "markerAdded", s, l);
        }
        return l;
      }
      u(Pt, "markText");
      var gr = /* @__PURE__ */ u(function(e, t) {
        this.markers = e, this.primary = t;
        for (var i = 0; i < e.length; ++i)
          e[i].parent = this;
      }, "SharedTextMarker");
      gr.prototype.clear = function() {
        if (!this.explicitlyCleared) {
          this.explicitlyCleared = !0;
          for (var e = 0; e < this.markers.length; ++e)
            this.markers[e].clear();
          Z(this, "clear");
        }
      }, gr.prototype.find = function(e, t) {
        return this.primary.find(e, t);
      }, xt(gr);
      function Ls(e, t, i, r, n) {
        r = nt(r), r.shared = !1;
        var l = [Pt(e, t, i, r, n)], o = l[0], a = r.widgetNode;
        return Je(e, function(s) {
          a && (r.widgetNode = a.cloneNode(!0)), l.push(Pt(s, N(s, t), N(s, i), r, n));
          for (var f = 0; f < s.linked.length; ++f)
            if (s.linked[f].isParent)
              return;
          o = H(l);
        }), new gr(l, o);
      }
      u(Ls, "markTextShared");
      function vo(e) {
        return e.findMarks(y(e.first, 0), e.clipPos(y(e.lastLine())), function(t) {
          return t.parent;
        });
      }
      u(vo, "findSharedMarkers");
      function ks(e, t) {
        for (var i = 0; i < t.length; i++) {
          var r = t[i], n = r.find(), l = e.clipPos(n.from), o = e.clipPos(n.to);
          if (D(l, o)) {
            var a = Pt(e, l, o, r.primary, r.primary.type);
            r.markers.push(a), a.parent = r;
          }
        }
      }
      u(ks, "copySharedMarkers");
      function Ts(e) {
        for (var t = /* @__PURE__ */ u(function(r) {
          var n = e[r], l = [n.primary.doc];
          Je(n.primary.doc, function(s) {
            return l.push(s);
          });
          for (var o = 0; o < n.markers.length; o++) {
            var a = n.markers[o];
            ee(l, a.doc) == -1 && (a.parent = null, n.markers.splice(o--, 1));
          }
        }, "loop"), i = 0; i < e.length; i++)
          t(i);
      }
      u(Ts, "detachSharedMarkers");
      var Ms = 0, ue = /* @__PURE__ */ u(function(e, t, i, r, n) {
        if (!(this instanceof ue))
          return new ue(e, t, i, r, n);
        i == null && (i = 0), pr.call(this, [new dr([new St("", null)])]), this.first = i, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.modeFrontier = this.highlightFrontier = i;
        var l = y(i, 0);
        this.sel = Ze(l), this.history = new $r(null), this.id = ++Ms, this.modeOption = t, this.lineSep = r, this.direction = n == "rtl" ? "rtl" : "ltr", this.extend = !1, typeof e == "string" && (e = this.splitLines(e)), cn(this, { from: l, to: l, text: e }), te(this, Ze(l), Me);
      }, "Doc");
      ue.prototype = Fn(pr.prototype, {
        constructor: ue,
        // Iterate over the document. Supports two forms -- with only one
        // argument, it calls that for each line in the document. With
        // three, it iterates over the range given by the first two (with
        // the second being non-inclusive).
        iter: function(e, t, i) {
          i ? this.iterN(e - this.first, t - e, i) : this.iterN(this.first, this.first + this.size, e);
        },
        // Non-public interface for adding and removing lines.
        insert: function(e, t) {
          for (var i = 0, r = 0; r < t.length; ++r)
            i += t[r].height;
          this.insertInner(e - this.first, t, i);
        },
        remove: function(e, t) {
          this.removeInner(e - this.first, t);
        },
        // From here, the methods are part of the public interface. Most
        // are also available from CodeMirror (editor) instances.
        getValue: function(e) {
          var t = Ai(this, this.first, this.first + this.size);
          return e === !1 ? t : t.join(e || this.lineSeparator());
        },
        setValue: J(function(e) {
          var t = y(this.first, 0), i = this.first + this.size - 1;
          Ht(this, {
            from: t,
            to: y(i, S(this, i).text.length),
            text: this.splitLines(e),
            origin: "setValue",
            full: !0
          }, !0), this.cm && nr(this.cm, 0, 0), te(this, Ze(t), Me);
        }),
        replaceRange: function(e, t, i, r) {
          t = N(this, t), i = i ? N(this, i) : t, Ft(this, e, t, i, r);
        },
        getRange: function(e, t, i) {
          var r = ot(this, N(this, e), N(this, t));
          return i === !1 ? r : i === "" ? r.join("") : r.join(i || this.lineSeparator());
        },
        getLine: function(e) {
          var t = this.getLineHandle(e);
          return t && t.text;
        },
        getLineHandle: function(e) {
          if (Jt(this, e))
            return S(this, e);
        },
        getLineNumber: function(e) {
          return F(e);
        },
        getLineHandleVisualStart: function(e) {
          return typeof e == "number" && (e = S(this, e)), Se(e);
        },
        lineCount: function() {
          return this.size;
        },
        firstLine: function() {
          return this.first;
        },
        lastLine: function() {
          return this.first + this.size - 1;
        },
        clipPos: function(e) {
          return N(this, e);
        },
        getCursor: function(e) {
          var t = this.sel.primary(), i;
          return e == null || e == "head" ? i = t.head : e == "anchor" ? i = t.anchor : e == "end" || e == "to" || e === !1 ? i = t.to() : i = t.from(), i;
        },
        listSelections: function() {
          return this.sel.ranges;
        },
        somethingSelected: function() {
          return this.sel.somethingSelected();
        },
        setCursor: J(function(e, t, i) {
          $l(this, N(this, typeof e == "number" ? y(e, t || 0) : e), null, i);
        }),
        setSelection: J(function(e, t, i) {
          $l(this, N(this, e), N(this, t || e), i);
        }),
        extendSelection: J(function(e, t, i) {
          ti(this, N(this, e), t && N(this, t), i);
        }),
        extendSelections: J(function(e, t) {
          Vl(this, Kn(this, e), t);
        }),
        extendSelectionsBy: J(function(e, t) {
          var i = Or(this.sel.ranges, e);
          Vl(this, Kn(this, i), t);
        }),
        setSelections: J(function(e, t, i) {
          if (e.length) {
            for (var r = [], n = 0; n < e.length; n++)
              r[n] = new W(
                N(this, e[n].anchor),
                N(this, e[n].head || e[n].anchor)
              );
            t == null && (t = Math.min(e.length - 1, this.sel.primIndex)), te(this, ke(this.cm, r, t), i);
          }
        }),
        addSelection: J(function(e, t, i) {
          var r = this.sel.ranges.slice(0);
          r.push(new W(N(this, e), N(this, t || e))), te(this, ke(this.cm, r, r.length - 1), i);
        }),
        getSelection: function(e) {
          for (var t = this.sel.ranges, i, r = 0; r < t.length; r++) {
            var n = ot(this, t[r].from(), t[r].to());
            i = i ? i.concat(n) : n;
          }
          return e === !1 ? i : i.join(e || this.lineSeparator());
        },
        getSelections: function(e) {
          for (var t = [], i = this.sel.ranges, r = 0; r < i.length; r++) {
            var n = ot(this, i[r].from(), i[r].to());
            e !== !1 && (n = n.join(e || this.lineSeparator())), t[r] = n;
          }
          return t;
        },
        replaceSelection: function(e, t, i) {
          for (var r = [], n = 0; n < this.sel.ranges.length; n++)
            r[n] = e;
          this.replaceSelections(r, t, i || "+input");
        },
        replaceSelections: J(function(e, t, i) {
          for (var r = [], n = this.sel, l = 0; l < n.ranges.length; l++) {
            var o = n.ranges[l];
            r[l] = { from: o.from(), to: o.to(), text: this.splitLines(e[l]), origin: i };
          }
          for (var a = t && t != "end" && ps(this, r, t), s = r.length - 1; s >= 0; s--)
            Ht(this, r[s]);
          a ? eo(this, a) : this.cm && Nt(this.cm);
        }),
        undo: J(function() {
          ni(this, "undo");
        }),
        redo: J(function() {
          ni(this, "redo");
        }),
        undoSelection: J(function() {
          ni(this, "undo", !0);
        }),
        redoSelection: J(function() {
          ni(this, "redo", !0);
        }),
        setExtending: function(e) {
          this.extend = e;
        },
        getExtending: function() {
          return this.extend;
        },
        historySize: function() {
          for (var e = this.history, t = 0, i = 0, r = 0; r < e.done.length; r++)
            e.done[r].ranges || ++t;
          for (var n = 0; n < e.undone.length; n++)
            e.undone[n].ranges || ++i;
          return { undo: t, redo: i };
        },
        clearHistory: function() {
          var e = this;
          this.history = new $r(this.history), Je(this, function(t) {
            return t.history = e.history;
          }, !0);
        },
        markClean: function() {
          this.cleanGeneration = this.changeGeneration(!0);
        },
        changeGeneration: function(e) {
          return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation;
        },
        isClean: function(e) {
          return this.history.generation == (e || this.cleanGeneration);
        },
        getHistory: function() {
          return {
            done: Ot(this.history.done),
            undone: Ot(this.history.undone)
          };
        },
        setHistory: function(e) {
          var t = this.history = new $r(this.history);
          t.done = Ot(e.done.slice(0), null, !0), t.undone = Ot(e.undone.slice(0), null, !0);
        },
        setGutterMarker: J(function(e, t, i) {
          return cr(this, e, "gutter", function(r) {
            var n = r.gutterMarkers || (r.gutterMarkers = {});
            return n[t] = i, !i && Pn(n) && (r.gutterMarkers = null), !0;
          });
        }),
        clearGutter: J(function(e) {
          var t = this;
          this.iter(function(i) {
            i.gutterMarkers && i.gutterMarkers[e] && cr(t, i, "gutter", function() {
              return i.gutterMarkers[e] = null, Pn(i.gutterMarkers) && (i.gutterMarkers = null), !0;
            });
          });
        }),
        lineInfo: function(e) {
          var t;
          if (typeof e == "number") {
            if (!Jt(this, e) || (t = e, e = S(this, e), !e))
              return null;
          } else if (t = F(e), t == null)
            return null;
          return {
            line: t,
            handle: e,
            text: e.text,
            gutterMarkers: e.gutterMarkers,
            textClass: e.textClass,
            bgClass: e.bgClass,
            wrapClass: e.wrapClass,
            widgets: e.widgets
          };
        },
        addLineClass: J(function(e, t, i) {
          return cr(this, e, t == "gutter" ? "gutter" : "class", function(r) {
            var n = t == "text" ? "textClass" : t == "background" ? "bgClass" : t == "gutter" ? "gutterClass" : "wrapClass";
            if (!r[n])
              r[n] = i;
            else {
              if (mt(i).test(r[n]))
                return !1;
              r[n] += " " + i;
            }
            return !0;
          });
        }),
        removeLineClass: J(function(e, t, i) {
          return cr(this, e, t == "gutter" ? "gutter" : "class", function(r) {
            var n = t == "text" ? "textClass" : t == "background" ? "bgClass" : t == "gutter" ? "gutterClass" : "wrapClass", l = r[n];
            if (l)
              if (i == null)
                r[n] = null;
              else {
                var o = l.match(mt(i));
                if (!o)
                  return !1;
                var a = o.index + o[0].length;
                r[n] = l.slice(0, o.index) + (!o.index || a == l.length ? "" : " ") + l.slice(a) || null;
              }
            else
              return !1;
            return !0;
          });
        }),
        addLineWidget: J(function(e, t, i) {
          return Ss(this, e, t, i);
        }),
        removeLineWidget: function(e) {
          e.clear();
        },
        markText: function(e, t, i) {
          return Pt(this, N(this, e), N(this, t), i, i && i.type || "range");
        },
        setBookmark: function(e, t) {
          var i = {
            replacedWith: t && (t.nodeType == null ? t.widget : t),
            insertLeft: t && t.insertLeft,
            clearWhenEmpty: !1,
            shared: t && t.shared,
            handleMouseEvents: t && t.handleMouseEvents
          };
          return e = N(this, e), Pt(this, e, e, i, "bookmark");
        },
        findMarksAt: function(e) {
          e = N(this, e);
          var t = [], i = S(this, e.line).markedSpans;
          if (i)
            for (var r = 0; r < i.length; ++r) {
              var n = i[r];
              (n.from == null || n.from <= e.ch) && (n.to == null || n.to >= e.ch) && t.push(n.marker.parent || n.marker);
            }
          return t;
        },
        findMarks: function(e, t, i) {
          e = N(this, e), t = N(this, t);
          var r = [], n = e.line;
          return this.iter(e.line, t.line + 1, function(l) {
            var o = l.markedSpans;
            if (o)
              for (var a = 0; a < o.length; a++) {
                var s = o[a];
                !(s.to != null && n == e.line && e.ch >= s.to || s.from == null && n != e.line || s.from != null && n == t.line && s.from >= t.ch) && (!i || i(s.marker)) && r.push(s.marker.parent || s.marker);
              }
            ++n;
          }), r;
        },
        getAllMarks: function() {
          var e = [];
          return this.iter(function(t) {
            var i = t.markedSpans;
            if (i)
              for (var r = 0; r < i.length; ++r)
                i[r].from != null && e.push(i[r].marker);
          }), e;
        },
        posFromIndex: function(e) {
          var t, i = this.first, r = this.lineSeparator().length;
          return this.iter(function(n) {
            var l = n.text.length + r;
            if (l > e)
              return t = e, !0;
            e -= l, ++i;
          }), N(this, y(i, t));
        },
        indexFromPos: function(e) {
          e = N(this, e);
          var t = e.ch;
          if (e.line < this.first || e.ch < 0)
            return 0;
          var i = this.lineSeparator().length;
          return this.iter(this.first, e.line, function(r) {
            t += r.text.length + i;
          }), t;
        },
        copy: function(e) {
          var t = new ue(
            Ai(this, this.first, this.first + this.size),
            this.modeOption,
            this.first,
            this.lineSep,
            this.direction
          );
          return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = this.sel, t.extend = !1, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t;
        },
        linkedDoc: function(e) {
          e || (e = {});
          var t = this.first, i = this.first + this.size;
          e.from != null && e.from > t && (t = e.from), e.to != null && e.to < i && (i = e.to);
          var r = new ue(Ai(this, t, i), e.mode || this.modeOption, t, this.lineSep, this.direction);
          return e.sharedHist && (r.history = this.history), (this.linked || (this.linked = [])).push({ doc: r, sharedHist: e.sharedHist }), r.linked = [{ doc: this, isParent: !0, sharedHist: e.sharedHist }], ks(r, vo(this)), r;
        },
        unlinkDoc: function(e) {
          if (e instanceof R && (e = e.doc), this.linked)
            for (var t = 0; t < this.linked.length; ++t) {
              var i = this.linked[t];
              if (i.doc == e) {
                this.linked.splice(t, 1), e.unlinkDoc(this), Ts(vo(this));
                break;
              }
            }
          if (e.history == this.history) {
            var r = [e.id];
            Je(e, function(n) {
              return r.push(n.id);
            }, !0), e.history = new $r(null), e.history.done = Ot(this.history.done, r), e.history.undone = Ot(this.history.undone, r);
          }
        },
        iterLinkedDocs: function(e) {
          Je(this, e);
        },
        getMode: function() {
          return this.mode;
        },
        getEditor: function() {
          return this.cm;
        },
        splitLines: function(e) {
          return this.lineSep ? e.split(this.lineSep) : ki(e);
        },
        lineSeparator: function() {
          return this.lineSep || `
`;
        },
        setDirection: J(function(e) {
          e != "rtl" && (e = "ltr"), e != this.direction && (this.direction = e, this.iter(function(t) {
            return t.order = null;
          }), this.cm && vs(this.cm));
        })
      }), ue.prototype.eachLine = ue.prototype.iter;
      var go = 0;
      function Ds(e) {
        var t = this;
        if (yo(t), !(q(t, e) || Re(t.display, e))) {
          ae(e), O && (go = +/* @__PURE__ */ new Date());
          var i = ft(t, e, !0), r = e.dataTransfer.files;
          if (!(!i || t.isReadOnly()))
            if (r && r.length && window.FileReader && window.File)
              for (var n = r.length, l = Array(n), o = 0, a = /* @__PURE__ */ u(function() {
                ++o == n && Q(t, function() {
                  i = N(t.doc, i);
                  var d = {
                    from: i,
                    to: i,
                    text: t.doc.splitLines(
                      l.filter(function(v) {
                        return v != null;
                      }).join(t.doc.lineSeparator())
                    ),
                    origin: "paste"
                  };
                  Ht(t.doc, d), eo(t.doc, Ze(N(t.doc, i), N(t.doc, Qe(d))));
                })();
              }, "markAsReadAndPasteIfAllFilesAreRead"), s = /* @__PURE__ */ u(function(d, v) {
                if (t.options.allowDropFileTypes && ee(t.options.allowDropFileTypes, d.type) == -1) {
                  a();
                  return;
                }
                var g = new FileReader();
                g.onerror = function() {
                  return a();
                }, g.onload = function() {
                  var m = g.result;
                  if (/[\x00-\x08\x0e-\x1f]{2}/.test(m)) {
                    a();
                    return;
                  }
                  l[v] = m, a();
                }, g.readAsText(d);
              }, "readTextFromFile"), f = 0; f < r.length; f++)
                s(r[f], f);
            else {
              if (t.state.draggingText && t.doc.sel.contains(i) > -1) {
                t.state.draggingText(e), setTimeout(function() {
                  return t.display.input.focus();
                }, 20);
                return;
              }
              try {
                var h = e.dataTransfer.getData("Text");
                if (h) {
                  var c;
                  if (t.state.draggingText && !t.state.draggingText.copy && (c = t.listSelections()), ri(t.doc, Ze(i, i)), c)
                    for (var p = 0; p < c.length; ++p)
                      Ft(t.doc, "", c[p].anchor, c[p].head, "drag");
                  t.replaceSelection(h, "around", "paste"), t.display.input.focus();
                }
              } catch {
              }
            }
        }
      }
      u(Ds, "onDrop");
      function Ns(e, t) {
        if (O && (!e.state.draggingText || +/* @__PURE__ */ new Date() - go < 100)) {
          Qt(t);
          return;
        }
        if (!(q(e, t) || Re(e.display, t)) && (t.dataTransfer.setData("Text", e.getSelection()), t.dataTransfer.effectAllowed = "copyMove", t.dataTransfer.setDragImage && !Mr)) {
          var i = T("img", null, null, "position: fixed; left: 0; top: 0;");
          i.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", we && (i.width = i.height = 1, e.display.wrapper.appendChild(i), i._top = i.offsetTop), t.dataTransfer.setDragImage(i, 0, 0), we && i.parentNode.removeChild(i);
        }
      }
      u(Ns, "onDragStart");
      function As(e, t) {
        var i = ft(e, t);
        if (i) {
          var r = document.createDocumentFragment();
          Vi(e, i, r), e.display.dragCursor || (e.display.dragCursor = T("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)), ve(e.display.dragCursor, r);
        }
      }
      u(As, "onDragOver");
      function yo(e) {
        e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor), e.display.dragCursor = null);
      }
      u(yo, "clearDragCursor");
      function mo(e) {
        if (document.getElementsByClassName) {
          for (var t = document.getElementsByClassName("CodeMirror"), i = [], r = 0; r < t.length; r++) {
            var n = t[r].CodeMirror;
            n && i.push(n);
          }
          i.length && i[0].operation(function() {
            for (var l = 0; l < i.length; l++)
              e(i[l]);
          });
        }
      }
      u(mo, "forEachCodeMirror");
      var bo = !1;
      function Os() {
        bo || (Ws(), bo = !0);
      }
      u(Os, "ensureGlobalHandlers");
      function Ws() {
        var e;
        M(window, "resize", function() {
          e == null && (e = setTimeout(function() {
            e = null, mo(Hs);
          }, 100));
        }), M(window, "blur", function() {
          return mo(Dt);
        });
      }
      u(Ws, "registerGlobalHandlers");
      function Hs(e) {
        var t = e.display;
        t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null, t.scrollbarsClipped = !1, e.setSize();
      }
      u(Hs, "onResize");
      for (var Ve = {
        3: "Pause",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        145: "ScrollLock",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "Mod",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
      }, yr = 0; yr < 10; yr++)
        Ve[yr + 48] = Ve[yr + 96] = String(yr);
      for (var li = 65; li <= 90; li++)
        Ve[li] = String.fromCharCode(li);
      for (var mr = 1; mr <= 12; mr++)
        Ve[mr + 111] = Ve[mr + 63235] = "F" + mr;
      var ze = {};
      ze.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharAfter",
        Backspace: "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        Tab: "defaultTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite",
        Esc: "singleSelection"
      }, ze.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        fallthrough: "basic"
      }, ze.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars",
        "Ctrl-O": "openLine"
      }, ze.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        fallthrough: ["basic", "emacsy"]
      }, ze.default = me ? ze.macDefault : ze.pcDefault;
      function Fs(e) {
        var t = e.split(/-(?!$)/);
        e = t[t.length - 1];
        for (var i, r, n, l, o = 0; o < t.length - 1; o++) {
          var a = t[o];
          if (/^(cmd|meta|m)$/i.test(a))
            l = !0;
          else if (/^a(lt)?$/i.test(a))
            i = !0;
          else if (/^(c|ctrl|control)$/i.test(a))
            r = !0;
          else if (/^s(hift)?$/i.test(a))
            n = !0;
          else
            throw new Error("Unrecognized modifier name: " + a);
        }
        return i && (e = "Alt-" + e), r && (e = "Ctrl-" + e), l && (e = "Cmd-" + e), n && (e = "Shift-" + e), e;
      }
      u(Fs, "normalizeKeyName");
      function Ps(e) {
        var t = {};
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var r = e[i];
            if (/^(name|fallthrough|(de|at)tach)$/.test(i))
              continue;
            if (r == "...") {
              delete e[i];
              continue;
            }
            for (var n = Or(i.split(" "), Fs), l = 0; l < n.length; l++) {
              var o = void 0, a = void 0;
              l == n.length - 1 ? (a = n.join(" "), o = r) : (a = n.slice(0, l + 1).join(" "), o = "...");
              var s = t[a];
              if (!s)
                t[a] = o;
              else if (s != o)
                throw new Error("Inconsistent bindings for " + a);
            }
            delete e[i];
          }
        for (var f in t)
          e[f] = t[f];
        return e;
      }
      u(Ps, "normalizeKeyMap");
      function Et(e, t, i, r) {
        t = oi(t);
        var n = t.call ? t.call(e, r) : t[e];
        if (n === !1)
          return "nothing";
        if (n === "...")
          return "multi";
        if (n != null && i(n))
          return "handled";
        if (t.fallthrough) {
          if (Object.prototype.toString.call(t.fallthrough) != "[object Array]")
            return Et(e, t.fallthrough, i, r);
          for (var l = 0; l < t.fallthrough.length; l++) {
            var o = Et(e, t.fallthrough[l], i, r);
            if (o)
              return o;
          }
        }
      }
      u(Et, "lookupKey");
      function xo(e) {
        var t = typeof e == "string" ? e : Ve[e.keyCode];
        return t == "Ctrl" || t == "Alt" || t == "Shift" || t == "Mod";
      }
      u(xo, "isModifierKey");
      function Co(e, t, i) {
        var r = e;
        return t.altKey && r != "Alt" && (e = "Alt-" + e), (On ? t.metaKey : t.ctrlKey) && r != "Ctrl" && (e = "Ctrl-" + e), (On ? t.ctrlKey : t.metaKey) && r != "Mod" && (e = "Cmd-" + e), !i && t.shiftKey && r != "Shift" && (e = "Shift-" + e), e;
      }
      u(Co, "addModifierNames");
      function wo(e, t) {
        if (we && e.keyCode == 34 && e.char)
          return !1;
        var i = Ve[e.keyCode];
        return i == null || e.altGraphKey ? !1 : (e.keyCode == 3 && e.code && (i = e.code), Co(i, e, t));
      }
      u(wo, "keyName");
      function oi(e) {
        return typeof e == "string" ? ze[e] : e;
      }
      u(oi, "getKeyMap");
      function It(e, t) {
        for (var i = e.doc.sel.ranges, r = [], n = 0; n < i.length; n++) {
          for (var l = t(i[n]); r.length && D(l.from, H(r).to) <= 0; ) {
            var o = r.pop();
            if (D(o.from, l.from) < 0) {
              l.from = o.from;
              break;
            }
          }
          r.push(l);
        }
        de(e, function() {
          for (var a = r.length - 1; a >= 0; a--)
            Ft(e.doc, "", r[a].from, r[a].to, "+delete");
          Nt(e);
        });
      }
      u(It, "deleteNearSelection");
      function gn(e, t, i) {
        var r = En(e.text, t + i, i);
        return r < 0 || r > e.text.length ? null : r;
      }
      u(gn, "moveCharLogically");
      function yn(e, t, i) {
        var r = gn(e, t.ch, i);
        return r == null ? null : new y(t.line, r, i < 0 ? "after" : "before");
      }
      u(yn, "moveLogically");
      function mn(e, t, i, r, n) {
        if (e) {
          t.doc.direction == "rtl" && (n = -n);
          var l = Pe(i, t.doc.direction);
          if (l) {
            var o = n < 0 ? H(l) : l[0], a = n < 0 == (o.level == 1), s = a ? "after" : "before", f;
            if (o.level > 0 || t.doc.direction == "rtl") {
              var h = kt(t, i);
              f = n < 0 ? i.text.length - 1 : 0;
              var c = Oe(t, h, f).top;
              f = Yt(function(p) {
                return Oe(t, h, p).top == c;
              }, n < 0 == (o.level == 1) ? o.from : o.to - 1, f), s == "before" && (f = gn(i, f, 1));
            } else
              f = n < 0 ? o.to : o.from;
            return new y(r, f, s);
          }
        }
        return new y(r, n < 0 ? i.text.length : 0, n < 0 ? "before" : "after");
      }
      u(mn, "endOfLine");
      function Es(e, t, i, r) {
        var n = Pe(t, e.doc.direction);
        if (!n)
          return yn(t, i, r);
        i.ch >= t.text.length ? (i.ch = t.text.length, i.sticky = "before") : i.ch <= 0 && (i.ch = 0, i.sticky = "after");
        var l = Zt(n, i.ch, i.sticky), o = n[l];
        if (e.doc.direction == "ltr" && o.level % 2 == 0 && (r > 0 ? o.to > i.ch : o.from < i.ch))
          return yn(t, i, r);
        var a = /* @__PURE__ */ u(function(b, C) {
          return gn(t, b instanceof y ? b.ch : b, C);
        }, "mv"), s, f = /* @__PURE__ */ u(function(b) {
          return e.options.lineWrapping ? (s = s || kt(e, t), Tl(e, t, s, b)) : { begin: 0, end: t.text.length };
        }, "getWrappedLineExtent"), h = f(i.sticky == "before" ? a(i, -1) : i.ch);
        if (e.doc.direction == "rtl" || o.level == 1) {
          var c = o.level == 1 == r < 0, p = a(i, c ? 1 : -1);
          if (p != null && (c ? p <= o.to && p <= h.end : p >= o.from && p >= h.begin)) {
            var d = c ? "before" : "after";
            return new y(i.line, p, d);
          }
        }
        var v = /* @__PURE__ */ u(function(b, C, x) {
          for (var w = /* @__PURE__ */ u(function(E, j) {
            return j ? new y(i.line, a(E, 1), "before") : new y(i.line, E, "after");
          }, "getRes"); b >= 0 && b < n.length; b += C) {
            var k = n[b], L = C > 0 == (k.level != 1), A = L ? x.begin : a(x.end, -1);
            if (k.from <= A && A < k.to || (A = L ? k.from : a(k.to, -1), x.begin <= A && A < x.end))
              return w(A, L);
          }
        }, "searchInVisualLine"), g = v(l + r, r, h);
        if (g)
          return g;
        var m = r > 0 ? h.end : a(h.begin, -1);
        return m != null && !(r > 0 && m == t.text.length) && (g = v(r > 0 ? 0 : n.length - 1, r, f(m)), g) ? g : null;
      }
      u(Es, "moveVisually");
      var br = {
        selectAll: lo,
        singleSelection: function(e) {
          return e.setSelection(e.getCursor("anchor"), e.getCursor("head"), Me);
        },
        killLine: function(e) {
          return It(e, function(t) {
            if (t.empty()) {
              var i = S(e.doc, t.head.line).text.length;
              return t.head.ch == i && t.head.line < e.lastLine() ? { from: t.head, to: y(t.head.line + 1, 0) } : { from: t.head, to: y(t.head.line, i) };
            } else
              return { from: t.from(), to: t.to() };
          });
        },
        deleteLine: function(e) {
          return It(e, function(t) {
            return {
              from: y(t.from().line, 0),
              to: N(e.doc, y(t.to().line + 1, 0))
            };
          });
        },
        delLineLeft: function(e) {
          return It(e, function(t) {
            return {
              from: y(t.from().line, 0),
              to: t.from()
            };
          });
        },
        delWrappedLineLeft: function(e) {
          return It(e, function(t) {
            var i = e.charCoords(t.head, "div").top + 5, r = e.coordsChar({ left: 0, top: i }, "div");
            return { from: r, to: t.from() };
          });
        },
        delWrappedLineRight: function(e) {
          return It(e, function(t) {
            var i = e.charCoords(t.head, "div").top + 5, r = e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: i }, "div");
            return { from: t.from(), to: r };
          });
        },
        undo: function(e) {
          return e.undo();
        },
        redo: function(e) {
          return e.redo();
        },
        undoSelection: function(e) {
          return e.undoSelection();
        },
        redoSelection: function(e) {
          return e.redoSelection();
        },
        goDocStart: function(e) {
          return e.extendSelection(y(e.firstLine(), 0));
        },
        goDocEnd: function(e) {
          return e.extendSelection(y(e.lastLine()));
        },
        goLineStart: function(e) {
          return e.extendSelectionsBy(
            function(t) {
              return So(e, t.head.line);
            },
            { origin: "+move", bias: 1 }
          );
        },
        goLineStartSmart: function(e) {
          return e.extendSelectionsBy(
            function(t) {
              return Lo(e, t.head);
            },
            { origin: "+move", bias: 1 }
          );
        },
        goLineEnd: function(e) {
          return e.extendSelectionsBy(
            function(t) {
              return Is(e, t.head.line);
            },
            { origin: "+move", bias: -1 }
          );
        },
        goLineRight: function(e) {
          return e.extendSelectionsBy(function(t) {
            var i = e.cursorCoords(t.head, "div").top + 5;
            return e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: i }, "div");
          }, Xt);
        },
        goLineLeft: function(e) {
          return e.extendSelectionsBy(function(t) {
            var i = e.cursorCoords(t.head, "div").top + 5;
            return e.coordsChar({ left: 0, top: i }, "div");
          }, Xt);
        },
        goLineLeftSmart: function(e) {
          return e.extendSelectionsBy(function(t) {
            var i = e.cursorCoords(t.head, "div").top + 5, r = e.coordsChar({ left: 0, top: i }, "div");
            return r.ch < e.getLine(r.line).search(/\S/) ? Lo(e, t.head) : r;
          }, Xt);
        },
        goLineUp: function(e) {
          return e.moveV(-1, "line");
        },
        goLineDown: function(e) {
          return e.moveV(1, "line");
        },
        goPageUp: function(e) {
          return e.moveV(-1, "page");
        },
        goPageDown: function(e) {
          return e.moveV(1, "page");
        },
        goCharLeft: function(e) {
          return e.moveH(-1, "char");
        },
        goCharRight: function(e) {
          return e.moveH(1, "char");
        },
        goColumnLeft: function(e) {
          return e.moveH(-1, "column");
        },
        goColumnRight: function(e) {
          return e.moveH(1, "column");
        },
        goWordLeft: function(e) {
          return e.moveH(-1, "word");
        },
        goGroupRight: function(e) {
          return e.moveH(1, "group");
        },
        goGroupLeft: function(e) {
          return e.moveH(-1, "group");
        },
        goWordRight: function(e) {
          return e.moveH(1, "word");
        },
        delCharBefore: function(e) {
          return e.deleteH(-1, "codepoint");
        },
        delCharAfter: function(e) {
          return e.deleteH(1, "char");
        },
        delWordBefore: function(e) {
          return e.deleteH(-1, "word");
        },
        delWordAfter: function(e) {
          return e.deleteH(1, "word");
        },
        delGroupBefore: function(e) {
          return e.deleteH(-1, "group");
        },
        delGroupAfter: function(e) {
          return e.deleteH(1, "group");
        },
        indentAuto: function(e) {
          return e.indentSelection("smart");
        },
        indentMore: function(e) {
          return e.indentSelection("add");
        },
        indentLess: function(e) {
          return e.indentSelection("subtract");
        },
        insertTab: function(e) {
          return e.replaceSelection("	");
        },
        insertSoftTab: function(e) {
          for (var t = [], i = e.listSelections(), r = e.options.tabSize, n = 0; n < i.length; n++) {
            var l = i[n].from(), o = xe(e.getLine(l.line), l.ch, r);
            t.push(yi(r - o % r));
          }
          e.replaceSelections(t);
        },
        defaultTab: function(e) {
          e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab");
        },
        // Swap the two chars left and right of each selection's head.
        // Move cursor behind the two swapped characters afterwards.
        //
        // Doesn't consider line feeds a character.
        // Doesn't scan more than one line above to find a character.
        // Doesn't do anything on an empty line.
        // Doesn't do anything with non-empty selections.
        transposeChars: function(e) {
          return de(e, function() {
            for (var t = e.listSelections(), i = [], r = 0; r < t.length; r++)
              if (t[r].empty()) {
                var n = t[r].head, l = S(e.doc, n.line).text;
                if (l) {
                  if (n.ch == l.length && (n = new y(n.line, n.ch - 1)), n.ch > 0)
                    n = new y(n.line, n.ch + 1), e.replaceRange(
                      l.charAt(n.ch - 1) + l.charAt(n.ch - 2),
                      y(n.line, n.ch - 2),
                      n,
                      "+transpose"
                    );
                  else if (n.line > e.doc.first) {
                    var o = S(e.doc, n.line - 1).text;
                    o && (n = new y(n.line, 1), e.replaceRange(
                      l.charAt(0) + e.doc.lineSeparator() + o.charAt(o.length - 1),
                      y(n.line - 1, o.length - 1),
                      n,
                      "+transpose"
                    ));
                  }
                }
                i.push(new W(n, n));
              }
            e.setSelections(i);
          });
        },
        newlineAndIndent: function(e) {
          return de(e, function() {
            for (var t = e.listSelections(), i = t.length - 1; i >= 0; i--)
              e.replaceRange(e.doc.lineSeparator(), t[i].anchor, t[i].head, "+input");
            t = e.listSelections();
            for (var r = 0; r < t.length; r++)
              e.indentLine(t[r].from().line, null, !0);
            Nt(e);
          });
        },
        openLine: function(e) {
          return e.replaceSelection(`
`, "start");
        },
        toggleOverwrite: function(e) {
          return e.toggleOverwrite();
        }
      };
      function So(e, t) {
        var i = S(e.doc, t), r = Se(i);
        return r != i && (t = F(r)), mn(!0, e, r, t, 1);
      }
      u(So, "lineStart");
      function Is(e, t) {
        var i = S(e.doc, t), r = xa(i);
        return r != i && (t = F(r)), mn(!0, e, i, t, -1);
      }
      u(Is, "lineEnd");
      function Lo(e, t) {
        var i = So(e, t.line), r = S(e.doc, i.line), n = Pe(r, e.doc.direction);
        if (!n || n[0].level == 0) {
          var l = Math.max(i.ch, r.text.search(/\S/)), o = t.line == i.line && t.ch <= l && t.ch;
          return y(i.line, o ? 0 : l, i.sticky);
        }
        return i;
      }
      u(Lo, "lineStartSmart");
      function ai(e, t, i) {
        if (typeof t == "string" && (t = br[t], !t))
          return !1;
        e.display.input.ensurePolled();
        var r = e.display.shift, n = !1;
        try {
          e.isReadOnly() && (e.state.suppressEdits = !0), i && (e.display.shift = !1), n = t(e) != Nr;
        } finally {
          e.display.shift = r, e.state.suppressEdits = !1;
        }
        return n;
      }
      u(ai, "doHandleBinding");
      function Rs(e, t, i) {
        for (var r = 0; r < e.state.keyMaps.length; r++) {
          var n = Et(t, e.state.keyMaps[r], i, e);
          if (n)
            return n;
        }
        return e.options.extraKeys && Et(t, e.options.extraKeys, i, e) || Et(t, e.options.keyMap, i, e);
      }
      u(Rs, "lookupKeyForEditor");
      var Bs = new _e();
      function xr(e, t, i, r) {
        var n = e.state.keySeq;
        if (n) {
          if (xo(t))
            return "handled";
          if (/\'$/.test(t) ? e.state.keySeq = null : Bs.set(50, function() {
            e.state.keySeq == n && (e.state.keySeq = null, e.display.input.reset());
          }), ko(e, n + " " + t, i, r))
            return !0;
        }
        return ko(e, t, i, r);
      }
      u(xr, "dispatchKey");
      function ko(e, t, i, r) {
        var n = Rs(e, t, r);
        return n == "multi" && (e.state.keySeq = t), n == "handled" && Z(e, "keyHandled", e, t, i), (n == "handled" || n == "multi") && (ae(i), $i(e)), !!n;
      }
      u(ko, "dispatchKeyInner");
      function To(e, t) {
        var i = wo(t, !0);
        return i ? t.shiftKey && !e.state.keySeq ? xr(e, "Shift-" + i, t, function(r) {
          return ai(e, r, !0);
        }) || xr(e, i, t, function(r) {
          if (typeof r == "string" ? /^go[A-Z]/.test(r) : r.motion)
            return ai(e, r);
        }) : xr(e, i, t, function(r) {
          return ai(e, r);
        }) : !1;
      }
      u(To, "handleKeyBinding");
      function zs(e, t, i) {
        return xr(e, "'" + i + "'", t, function(r) {
          return ai(e, r, !0);
        });
      }
      u(zs, "handleCharBinding");
      var bn = null;
      function Mo(e) {
        var t = this;
        if (!(e.target && e.target != t.display.input.getField()) && (t.curOp.focus = be(), !q(t, e))) {
          O && I < 11 && e.keyCode == 27 && (e.returnValue = !1);
          var i = e.keyCode;
          t.display.shift = i == 16 || e.shiftKey;
          var r = To(t, e);
          we && (bn = r ? i : null, !r && i == 88 && !na && (me ? e.metaKey : e.ctrlKey) && t.replaceSelection("", null, "cut")), Fe && !me && !r && i == 46 && e.shiftKey && !e.ctrlKey && document.execCommand && document.execCommand("cut"), i == 18 && !/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) && Gs(t);
        }
      }
      u(Mo, "onKeyDown");
      function Gs(e) {
        var t = e.display.lineDiv;
        it(t, "CodeMirror-crosshair");
        function i(r) {
          (r.keyCode == 18 || !r.altKey) && (tt(t, "CodeMirror-crosshair"), ge(document, "keyup", i), ge(document, "mouseover", i));
        }
        u(i, "up"), M(document, "keyup", i), M(document, "mouseover", i);
      }
      u(Gs, "showCrossHair");
      function Do(e) {
        e.keyCode == 16 && (this.doc.sel.shift = !1), q(this, e);
      }
      u(Do, "onKeyUp");
      function No(e) {
        var t = this;
        if (!(e.target && e.target != t.display.input.getField()) && !(Re(t.display, e) || q(t, e) || e.ctrlKey && !e.altKey || me && e.metaKey)) {
          var i = e.keyCode, r = e.charCode;
          if (we && i == bn) {
            bn = null, ae(e);
            return;
          }
          if (!(we && (!e.which || e.which < 10) && To(t, e))) {
            var n = String.fromCharCode(r ?? i);
            n != "\b" && (zs(t, e, n) || t.display.input.onKeyPress(e));
          }
        }
      }
      u(No, "onKeyPress");
      var Us = 400, xn = /* @__PURE__ */ u(function(e, t, i) {
        this.time = e, this.pos = t, this.button = i;
      }, "PastClick");
      xn.prototype.compare = function(e, t, i) {
        return this.time + Us > e && D(t, this.pos) == 0 && i == this.button;
      };
      var Cr, wr;
      function Ks(e, t) {
        var i = +/* @__PURE__ */ new Date();
        return wr && wr.compare(i, e, t) ? (Cr = wr = null, "triple") : Cr && Cr.compare(i, e, t) ? (wr = new xn(i, e, t), Cr = null, "double") : (Cr = new xn(i, e, t), wr = null, "single");
      }
      u(Ks, "clickRepeat");
      function Ao(e) {
        var t = this, i = t.display;
        if (!(q(t, e) || i.activeTouch && i.input.supportsTouch())) {
          if (i.input.ensurePolled(), i.shift = e.shiftKey, Re(i, e)) {
            ne || (i.scroller.draggable = !1, setTimeout(function() {
              return i.scroller.draggable = !0;
            }, 100));
            return;
          }
          if (!Cn(t, e)) {
            var r = ft(t, e), n = zn(e), l = r ? Ks(r, n) : "single";
            window.focus(), n == 1 && t.state.selectingText && t.state.selectingText(e), !(r && _s(t, n, r, l, e)) && (n == 1 ? r ? Ys(t, r, l, e) : wi(e) == i.scroller && ae(e) : n == 2 ? (r && ti(t.doc, r), setTimeout(function() {
              return i.input.focus();
            }, 20)) : n == 3 && (ci ? t.display.input.onContextMenu(e) : en(t)));
          }
        }
      }
      u(Ao, "onMouseDown");
      function _s(e, t, i, r, n) {
        var l = "Click";
        return r == "double" ? l = "Double" + l : r == "triple" && (l = "Triple" + l), l = (t == 1 ? "Left" : t == 2 ? "Middle" : "Right") + l, xr(e, Co(l, n), n, function(o) {
          if (typeof o == "string" && (o = br[o]), !o)
            return !1;
          var a = !1;
          try {
            e.isReadOnly() && (e.state.suppressEdits = !0), a = o(e, i) != Nr;
          } finally {
            e.state.suppressEdits = !1;
          }
          return a;
        });
      }
      u(_s, "handleMappedButton");
      function Xs(e, t, i) {
        var r = e.getOption("configureMouse"), n = r ? r(e, t, i) : {};
        if (n.unit == null) {
          var l = qo ? i.shiftKey && i.metaKey : i.altKey;
          n.unit = l ? "rectangle" : t == "single" ? "char" : t == "double" ? "word" : "line";
        }
        return (n.extend == null || e.doc.extend) && (n.extend = e.doc.extend || i.shiftKey), n.addNew == null && (n.addNew = me ? i.metaKey : i.ctrlKey), n.moveOnDrag == null && (n.moveOnDrag = !(me ? i.altKey : i.ctrlKey)), n;
      }
      u(Xs, "configureMouse");
      function Ys(e, t, i, r) {
        O ? setTimeout(pi(Al, e), 0) : e.curOp.focus = be();
        var n = Xs(e, i, r), l = e.doc.sel, o;
        e.options.dragDrop && ea && !e.isReadOnly() && i == "single" && (o = l.contains(t)) > -1 && (D((o = l.ranges[o]).from(), t) < 0 || t.xRel > 0) && (D(o.to(), t) > 0 || t.xRel < 0) ? qs(e, r, t, n) : Zs(e, r, t, n);
      }
      u(Ys, "leftButtonDown");
      function qs(e, t, i, r) {
        var n = e.display, l = !1, o = Q(e, function(f) {
          ne && (n.scroller.draggable = !1), e.state.draggingText = !1, e.state.delayingBlurEvent && (e.hasFocus() ? e.state.delayingBlurEvent = !1 : en(e)), ge(n.wrapper.ownerDocument, "mouseup", o), ge(n.wrapper.ownerDocument, "mousemove", a), ge(n.scroller, "dragstart", s), ge(n.scroller, "drop", o), l || (ae(f), r.addNew || ti(e.doc, i, null, null, r.extend), ne && !Mr || O && I == 9 ? setTimeout(function() {
            n.wrapper.ownerDocument.body.focus({ preventScroll: !0 }), n.input.focus();
          }, 20) : n.input.focus());
        }), a = /* @__PURE__ */ u(function(f) {
          l = l || Math.abs(t.clientX - f.clientX) + Math.abs(t.clientY - f.clientY) >= 10;
        }, "mouseMove"), s = /* @__PURE__ */ u(function() {
          return l = !0;
        }, "dragStart");
        ne && (n.scroller.draggable = !0), e.state.draggingText = o, o.copy = !r.moveOnDrag, M(n.wrapper.ownerDocument, "mouseup", o), M(n.wrapper.ownerDocument, "mousemove", a), M(n.scroller, "dragstart", s), M(n.scroller, "drop", o), e.state.delayingBlurEvent = !0, setTimeout(function() {
          return n.input.focus();
        }, 20), n.scroller.dragDrop && n.scroller.dragDrop();
      }
      u(qs, "leftButtonStartDrag");
      function Oo(e, t, i) {
        if (i == "char")
          return new W(t, t);
        if (i == "word")
          return e.findWordAt(t);
        if (i == "line")
          return new W(y(t.line, 0), N(e.doc, y(t.line + 1, 0)));
        var r = i(e, t);
        return new W(r.from, r.to);
      }
      u(Oo, "rangeForUnit");
      function Zs(e, t, i, r) {
        O && en(e);
        var n = e.display, l = e.doc;
        ae(t);
        var o, a, s = l.sel, f = s.ranges;
        if (r.addNew && !r.extend ? (a = l.sel.contains(i), a > -1 ? o = f[a] : o = new W(i, i)) : (o = l.sel.primary(), a = l.sel.primIndex), r.unit == "rectangle")
          r.addNew || (o = new W(i, i)), i = ft(e, t, !0, !0), a = -1;
        else {
          var h = Oo(e, i, r.unit);
          r.extend ? o = pn(o, h.anchor, h.head, r.extend) : o = h;
        }
        r.addNew ? a == -1 ? (a = f.length, te(
          l,
          ke(e, f.concat([o]), a),
          { scroll: !1, origin: "*mouse" }
        )) : f.length > 1 && f[a].empty() && r.unit == "char" && !r.extend ? (te(
          l,
          ke(e, f.slice(0, a).concat(f.slice(a + 1)), 0),
          { scroll: !1, origin: "*mouse" }
        ), s = l.sel) : vn(l, a, o, vi) : (a = 0, te(l, new ye([o], 0), vi), s = l.sel);
        var c = i;
        function p(x) {
          if (D(c, x) != 0)
            if (c = x, r.unit == "rectangle") {
              for (var w = [], k = e.options.tabSize, L = xe(S(l, i.line).text, i.ch, k), A = xe(S(l, x.line).text, x.ch, k), E = Math.min(L, A), j = Math.max(L, A), B = Math.min(i.line, x.line), pe = Math.min(e.lastLine(), Math.max(i.line, x.line)); B <= pe; B++) {
                var fe = S(l, B).text, _ = gi(fe, E, k);
                E == j ? w.push(new W(y(B, _), y(B, _))) : fe.length > _ && w.push(new W(y(B, _), y(B, gi(fe, j, k))));
              }
              w.length || w.push(new W(i, i)), te(
                l,
                ke(e, s.ranges.slice(0, a).concat(w), a),
                { origin: "*mouse", scroll: !1 }
              ), e.scrollIntoView(x);
            } else {
              var he = o, $ = Oo(e, x, r.unit), Y = he.anchor, X;
              D($.anchor, Y) > 0 ? (X = $.head, Y = Pr(he.from(), $.anchor)) : (X = $.anchor, Y = Fr(he.to(), $.head));
              var z = s.ranges.slice(0);
              z[a] = Qs(e, new W(N(l, Y), X)), te(l, ke(e, z, a), vi);
            }
        }
        u(p, "extendTo");
        var d = n.wrapper.getBoundingClientRect(), v = 0;
        function g(x) {
          var w = ++v, k = ft(e, x, !0, r.unit == "rectangle");
          if (k)
            if (D(k, c) != 0) {
              e.curOp.focus = be(), p(k);
              var L = Qr(n, l);
              (k.line >= L.to || k.line < L.from) && setTimeout(Q(e, function() {
                v == w && g(x);
              }), 150);
            } else {
              var A = x.clientY < d.top ? -20 : x.clientY > d.bottom ? 20 : 0;
              A && setTimeout(Q(e, function() {
                v == w && (n.scroller.scrollTop += A, g(x));
              }), 50);
            }
        }
        u(g, "extend");
        function m(x) {
          e.state.selectingText = !1, v = 1 / 0, x && (ae(x), n.input.focus()), ge(n.wrapper.ownerDocument, "mousemove", b), ge(n.wrapper.ownerDocument, "mouseup", C), l.history.lastSelOrigin = null;
        }
        u(m, "done");
        var b = Q(e, function(x) {
          x.buttons === 0 || !zn(x) ? m(x) : g(x);
        }), C = Q(e, m);
        e.state.selectingText = C, M(n.wrapper.ownerDocument, "mousemove", b), M(n.wrapper.ownerDocument, "mouseup", C);
      }
      u(Zs, "leftButtonSelect");
      function Qs(e, t) {
        var i = t.anchor, r = t.head, n = S(e.doc, i.line);
        if (D(i, r) == 0 && i.sticky == r.sticky)
          return t;
        var l = Pe(n);
        if (!l)
          return t;
        var o = Zt(l, i.ch, i.sticky), a = l[o];
        if (a.from != i.ch && a.to != i.ch)
          return t;
        var s = o + (a.from == i.ch == (a.level != 1) ? 0 : 1);
        if (s == 0 || s == l.length)
          return t;
        var f;
        if (r.line != i.line)
          f = (r.line - i.line) * (e.doc.direction == "ltr" ? 1 : -1) > 0;
        else {
          var h = Zt(l, r.ch, r.sticky), c = h - o || (r.ch - i.ch) * (a.level == 1 ? -1 : 1);
          h == s - 1 || h == s ? f = c < 0 : f = c > 0;
        }
        var p = l[s + (f ? -1 : 0)], d = f == (p.level == 1), v = d ? p.from : p.to, g = d ? "after" : "before";
        return i.ch == v && i.sticky == g ? t : new W(new y(i.line, v, g), r);
      }
      u(Qs, "bidiSimplify");
      function Wo(e, t, i, r) {
        var n, l;
        if (t.touches)
          n = t.touches[0].clientX, l = t.touches[0].clientY;
        else
          try {
            n = t.clientX, l = t.clientY;
          } catch {
            return !1;
          }
        if (n >= Math.floor(e.display.gutters.getBoundingClientRect().right))
          return !1;
        r && ae(t);
        var o = e.display, a = o.lineDiv.getBoundingClientRect();
        if (l > a.bottom || !Ce(e, i))
          return Ci(t);
        l -= a.top - o.viewOffset;
        for (var s = 0; s < e.display.gutterSpecs.length; ++s) {
          var f = o.gutters.childNodes[s];
          if (f && f.getBoundingClientRect().right >= n) {
            var h = at(e.doc, l), c = e.display.gutterSpecs[s];
            return U(e, i, e, h, c.className, t), Ci(t);
          }
        }
      }
      u(Wo, "gutterEvent");
      function Cn(e, t) {
        return Wo(e, t, "gutterClick", !0);
      }
      u(Cn, "clickInGutter");
      function Ho(e, t) {
        Re(e.display, t) || Js(e, t) || q(e, t, "contextmenu") || ci || e.display.input.onContextMenu(t);
      }
      u(Ho, "onContextMenu");
      function Js(e, t) {
        return Ce(e, "gutterContextMenu") ? Wo(e, t, "gutterContextMenu", !1) : !1;
      }
      u(Js, "contextMenuInGutter");
      function Fo(e) {
        e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), rr(e);
      }
      u(Fo, "themeChanged");
      var Rt = { toString: function() {
        return "CodeMirror.Init";
      } }, Po = {}, si = {};
      function js(e) {
        var t = e.optionHandlers;
        function i(r, n, l, o) {
          e.defaults[r] = n, l && (t[r] = o ? function(a, s, f) {
            f != Rt && l(a, s, f);
          } : l);
        }
        u(i, "option"), e.defineOption = i, e.Init = Rt, i("value", "", function(r, n) {
          return r.setValue(n);
        }, !0), i("mode", null, function(r, n) {
          r.doc.modeOption = n, hn(r);
        }, !0), i("indentUnit", 2, hn, !0), i("indentWithTabs", !1), i("smartIndent", !0), i("tabSize", 4, function(r) {
          fr(r), rr(r), se(r);
        }, !0), i("lineSeparator", null, function(r, n) {
          if (r.doc.lineSep = n, !!n) {
            var l = [], o = r.doc.first;
            r.doc.iter(function(s) {
              for (var f = 0; ; ) {
                var h = s.text.indexOf(n, f);
                if (h == -1)
                  break;
                f = h + n.length, l.push(y(o, h));
              }
              o++;
            });
            for (var a = l.length - 1; a >= 0; a--)
              Ft(r.doc, n, l[a], y(l[a].line, l[a].ch + n.length));
          }
        }), i("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(r, n, l) {
          r.state.specialChars = new RegExp(n.source + (n.test("	") ? "" : "|	"), "g"), l != Rt && r.refresh();
        }), i("specialCharPlaceholder", Ta, function(r) {
          return r.refresh();
        }, !0), i("electricChars", !0), i("inputStyle", Kt ? "contenteditable" : "textarea", function() {
          throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, !0), i("spellcheck", !1, function(r, n) {
          return r.getInputField().spellcheck = n;
        }, !0), i("autocorrect", !1, function(r, n) {
          return r.getInputField().autocorrect = n;
        }, !0), i("autocapitalize", !1, function(r, n) {
          return r.getInputField().autocapitalize = n;
        }, !0), i("rtlMoveVisually", !Zo), i("wholeLineUpdateBefore", !0), i("theme", "default", function(r) {
          Fo(r), ur(r);
        }, !0), i("keyMap", "default", function(r, n, l) {
          var o = oi(n), a = l != Rt && oi(l);
          a && a.detach && a.detach(r, o), o.attach && o.attach(r, a || null);
        }), i("extraKeys", null), i("configureMouse", null), i("lineWrapping", !1, $s, !0), i("gutters", [], function(r, n) {
          r.display.gutterSpecs = un(n, r.options.lineNumbers), ur(r);
        }, !0), i("fixedGutter", !0, function(r, n) {
          r.display.gutters.style.left = n ? Ji(r.display) + "px" : "0", r.refresh();
        }, !0), i("coverGutterNextToScrollbar", !1, function(r) {
          return At(r);
        }, !0), i("scrollbarStyle", "native", function(r) {
          El(r), At(r), r.display.scrollbars.setScrollTop(r.doc.scrollTop), r.display.scrollbars.setScrollLeft(r.doc.scrollLeft);
        }, !0), i("lineNumbers", !1, function(r, n) {
          r.display.gutterSpecs = un(r.options.gutters, n), ur(r);
        }, !0), i("firstLineNumber", 1, ur, !0), i("lineNumberFormatter", function(r) {
          return r;
        }, ur, !0), i("showCursorWhenSelecting", !1, ir, !0), i("resetSelectionOnContextMenu", !0), i("lineWiseCopyCut", !0), i("pasteLinesPerSelection", !0), i("selectionsMayTouch", !1), i("readOnly", !1, function(r, n) {
          n == "nocursor" && (Dt(r), r.display.input.blur()), r.display.input.readOnlyChanged(n);
        }), i("screenReaderLabel", null, function(r, n) {
          n = n === "" ? null : n, r.display.input.screenReaderLabelChanged(n);
        }), i("disableInput", !1, function(r, n) {
          n || r.display.input.reset();
        }, !0), i("dragDrop", !0, Vs), i("allowDropFileTypes", null), i("cursorBlinkRate", 530), i("cursorScrollMargin", 0), i("cursorHeight", 1, ir, !0), i("singleCursorHeightPerLine", !0, ir, !0), i("workTime", 100), i("workDelay", 100), i("flattenSpans", !0, fr, !0), i("addModeClass", !1, fr, !0), i("pollInterval", 100), i("undoDepth", 200, function(r, n) {
          return r.doc.history.undoDepth = n;
        }), i("historyEventDelay", 1250), i("viewportMargin", 10, function(r) {
          return r.refresh();
        }, !0), i("maxHighlightLength", 1e4, fr, !0), i("moveInputWithCursor", !0, function(r, n) {
          n || r.display.input.resetPosition();
        }), i("tabindex", null, function(r, n) {
          return r.display.input.getField().tabIndex = n || "";
        }), i("autofocus", null), i("direction", "ltr", function(r, n) {
          return r.doc.setDirection(n);
        }, !0), i("phrases", null);
      }
      u(js, "defineOptions");
      function Vs(e, t, i) {
        var r = i && i != Rt;
        if (!t != !r) {
          var n = e.display.dragFunctions, l = t ? M : ge;
          l(e.display.scroller, "dragstart", n.start), l(e.display.scroller, "dragenter", n.enter), l(e.display.scroller, "dragover", n.over), l(e.display.scroller, "dragleave", n.leave), l(e.display.scroller, "drop", n.drop);
        }
      }
      u(Vs, "dragDropChanged");
      function $s(e) {
        e.options.lineWrapping ? (it(e.display.wrapper, "CodeMirror-wrap"), e.display.sizer.style.minWidth = "", e.display.sizerWidth = null) : (tt(e.display.wrapper, "CodeMirror-wrap"), zi(e)), ji(e), se(e), rr(e), setTimeout(function() {
          return At(e);
        }, 100);
      }
      u($s, "wrappingChanged");
      function R(e, t) {
        var i = this;
        if (!(this instanceof R))
          return new R(e, t);
        this.options = t = t ? nt(t) : {}, nt(Po, t, !1);
        var r = t.value;
        typeof r == "string" ? r = new ue(r, t.mode, null, t.lineSeparator, t.direction) : t.mode && (r.modeOption = t.mode), this.doc = r;
        var n = new R.inputStyles[t.inputStyle](this), l = this.display = new cs(e, r, n, t);
        l.wrapper.CodeMirror = this, Fo(this), t.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), El(this), this.state = {
          keyMaps: [],
          // stores maps added by addKeyMap
          overlays: [],
          // highlighting overlays, as added by addOverlay
          modeGen: 0,
          // bumped when mode/overlay changes, used to invalidate highlighting info
          overwrite: !1,
          delayingBlurEvent: !1,
          focused: !1,
          suppressEdits: !1,
          // used to disable editing during key handlers when in readOnly mode
          pasteIncoming: -1,
          cutIncoming: -1,
          // help recognize paste/cut edits in input.poll
          selectingText: !1,
          draggingText: !1,
          highlight: new _e(),
          // stores highlight worker timeout
          keySeq: null,
          // Unfinished key sequence
          specialChars: null
        }, t.autofocus && !Kt && l.input.focus(), O && I < 11 && setTimeout(function() {
          return i.display.input.reset(!0);
        }, 20), eu(this), Os(), pt(this), this.curOp.forceUpdate = !0, Yl(this, r), t.autofocus && !Kt || this.hasFocus() ? setTimeout(function() {
          i.hasFocus() && !i.state.focused && tn(i);
        }, 20) : Dt(this);
        for (var o in si)
          si.hasOwnProperty(o) && si[o](this, t[o], Rt);
        Bl(this), t.finishInit && t.finishInit(this);
        for (var a = 0; a < wn.length; ++a)
          wn[a](this);
        vt(this), ne && t.lineWrapping && getComputedStyle(l.lineDiv).textRendering == "optimizelegibility" && (l.lineDiv.style.textRendering = "auto");
      }
      u(R, "CodeMirror"), R.defaults = Po, R.optionHandlers = si;
      function eu(e) {
        var t = e.display;
        M(t.scroller, "mousedown", Q(e, Ao)), O && I < 11 ? M(t.scroller, "dblclick", Q(e, function(s) {
          if (!q(e, s)) {
            var f = ft(e, s);
            if (!(!f || Cn(e, s) || Re(e.display, s))) {
              ae(s);
              var h = e.findWordAt(f);
              ti(e.doc, h.anchor, h.head);
            }
          }
        })) : M(t.scroller, "dblclick", function(s) {
          return q(e, s) || ae(s);
        }), M(t.scroller, "contextmenu", function(s) {
          return Ho(e, s);
        }), M(t.input.getField(), "contextmenu", function(s) {
          t.scroller.contains(s.target) || Ho(e, s);
        });
        var i, r = { end: 0 };
        function n() {
          t.activeTouch && (i = setTimeout(function() {
            return t.activeTouch = null;
          }, 1e3), r = t.activeTouch, r.end = +/* @__PURE__ */ new Date());
        }
        u(n, "finishTouch");
        function l(s) {
          if (s.touches.length != 1)
            return !1;
          var f = s.touches[0];
          return f.radiusX <= 1 && f.radiusY <= 1;
        }
        u(l, "isMouseLikeTouchEvent");
        function o(s, f) {
          if (f.left == null)
            return !0;
          var h = f.left - s.left, c = f.top - s.top;
          return h * h + c * c > 20 * 20;
        }
        u(o, "farAway"), M(t.scroller, "touchstart", function(s) {
          if (!q(e, s) && !l(s) && !Cn(e, s)) {
            t.input.ensurePolled(), clearTimeout(i);
            var f = +/* @__PURE__ */ new Date();
            t.activeTouch = {
              start: f,
              moved: !1,
              prev: f - r.end <= 300 ? r : null
            }, s.touches.length == 1 && (t.activeTouch.left = s.touches[0].pageX, t.activeTouch.top = s.touches[0].pageY);
          }
        }), M(t.scroller, "touchmove", function() {
          t.activeTouch && (t.activeTouch.moved = !0);
        }), M(t.scroller, "touchend", function(s) {
          var f = t.activeTouch;
          if (f && !Re(t, s) && f.left != null && !f.moved && /* @__PURE__ */ new Date() - f.start < 300) {
            var h = e.coordsChar(t.activeTouch, "page"), c;
            !f.prev || o(f, f.prev) ? c = new W(h, h) : !f.prev.prev || o(f, f.prev.prev) ? c = e.findWordAt(h) : c = new W(y(h.line, 0), N(e.doc, y(h.line + 1, 0))), e.setSelection(c.anchor, c.head), e.focus(), ae(s);
          }
          n();
        }), M(t.scroller, "touchcancel", n), M(t.scroller, "scroll", function() {
          t.scroller.clientHeight && (lr(e, t.scroller.scrollTop), ct(e, t.scroller.scrollLeft, !0), U(e, "scroll", e));
        }), M(t.scroller, "mousewheel", function(s) {
          return Ul(e, s);
        }), M(t.scroller, "DOMMouseScroll", function(s) {
          return Ul(e, s);
        }), M(t.wrapper, "scroll", function() {
          return t.wrapper.scrollTop = t.wrapper.scrollLeft = 0;
        }), t.dragFunctions = {
          enter: function(s) {
            q(e, s) || Qt(s);
          },
          over: function(s) {
            q(e, s) || (As(e, s), Qt(s));
          },
          start: function(s) {
            return Ns(e, s);
          },
          drop: Q(e, Ds),
          leave: function(s) {
            q(e, s) || yo(e);
          }
        };
        var a = t.input.getField();
        M(a, "keyup", function(s) {
          return Do.call(e, s);
        }), M(a, "keydown", Q(e, Mo)), M(a, "keypress", Q(e, No)), M(a, "focus", function(s) {
          return tn(e, s);
        }), M(a, "blur", function(s) {
          return Dt(e, s);
        });
      }
      u(eu, "registerEventHandlers");
      var wn = [];
      R.defineInitHook = function(e) {
        return wn.push(e);
      };
      function Sr(e, t, i, r) {
        var n = e.doc, l;
        i == null && (i = "add"), i == "smart" && (n.mode.indent ? l = jt(e, t).state : i = "prev");
        var o = e.options.tabSize, a = S(n, t), s = xe(a.text, null, o);
        a.stateAfter && (a.stateAfter = null);
        var f = a.text.match(/^\s*/)[0], h;
        if (!r && !/\S/.test(a.text))
          h = 0, i = "not";
        else if (i == "smart" && (h = n.mode.indent(l, a.text.slice(f.length), a.text), h == Nr || h > 150)) {
          if (!r)
            return;
          i = "prev";
        }
        i == "prev" ? t > n.first ? h = xe(S(n, t - 1).text, null, o) : h = 0 : i == "add" ? h = s + e.options.indentUnit : i == "subtract" ? h = s - e.options.indentUnit : typeof i == "number" && (h = s + i), h = Math.max(0, h);
        var c = "", p = 0;
        if (e.options.indentWithTabs)
          for (var d = Math.floor(h / o); d; --d)
            p += o, c += "	";
        if (p < h && (c += yi(h - p)), c != f)
          return Ft(n, c, y(t, 0), y(t, f.length), "+input"), a.stateAfter = null, !0;
        for (var v = 0; v < n.sel.ranges.length; v++) {
          var g = n.sel.ranges[v];
          if (g.head.line == t && g.head.ch < f.length) {
            var m = y(t, f.length);
            vn(n, v, new W(m, m));
            break;
          }
        }
      }
      u(Sr, "indentLine");
      var Te = null;
      function ui(e) {
        Te = e;
      }
      u(ui, "setLastCopied");
      function Sn(e, t, i, r, n) {
        var l = e.doc;
        e.display.shift = !1, r || (r = l.sel);
        var o = +/* @__PURE__ */ new Date() - 200, a = n == "paste" || e.state.pasteIncoming > o, s = ki(t), f = null;
        if (a && r.ranges.length > 1)
          if (Te && Te.text.join(`
`) == t) {
            if (r.ranges.length % Te.text.length == 0) {
              f = [];
              for (var h = 0; h < Te.text.length; h++)
                f.push(l.splitLines(Te.text[h]));
            }
          } else
            s.length == r.ranges.length && e.options.pasteLinesPerSelection && (f = Or(s, function(b) {
              return [b];
            }));
        for (var c = e.curOp.updateInput, p = r.ranges.length - 1; p >= 0; p--) {
          var d = r.ranges[p], v = d.from(), g = d.to();
          d.empty() && (i && i > 0 ? v = y(v.line, v.ch - i) : e.state.overwrite && !a ? g = y(g.line, Math.min(S(l, g.line).text.length, g.ch + H(s).length)) : a && Te && Te.lineWise && Te.text.join(`
`) == s.join(`
`) && (v = g = y(v.line, 0)));
          var m = {
            from: v,
            to: g,
            text: f ? f[p % f.length] : s,
            origin: n || (a ? "paste" : e.state.cutIncoming > o ? "cut" : "+input")
          };
          Ht(e.doc, m), Z(e, "inputRead", e, m);
        }
        t && !a && Io(e, t), Nt(e), e.curOp.updateInput < 2 && (e.curOp.updateInput = c), e.curOp.typing = !0, e.state.pasteIncoming = e.state.cutIncoming = -1;
      }
      u(Sn, "applyTextInput");
      function Eo(e, t) {
        var i = e.clipboardData && e.clipboardData.getData("Text");
        if (i)
          return e.preventDefault(), !t.isReadOnly() && !t.options.disableInput && de(t, function() {
            return Sn(t, i, 0, null, "paste");
          }), !0;
      }
      u(Eo, "handlePaste");
      function Io(e, t) {
        if (!(!e.options.electricChars || !e.options.smartIndent))
          for (var i = e.doc.sel, r = i.ranges.length - 1; r >= 0; r--) {
            var n = i.ranges[r];
            if (!(n.head.ch > 100 || r && i.ranges[r - 1].head.line == n.head.line)) {
              var l = e.getModeAt(n.head), o = !1;
              if (l.electricChars) {
                for (var a = 0; a < l.electricChars.length; a++)
                  if (t.indexOf(l.electricChars.charAt(a)) > -1) {
                    o = Sr(e, n.head.line, "smart");
                    break;
                  }
              } else
                l.electricInput && l.electricInput.test(S(e.doc, n.head.line).text.slice(0, n.head.ch)) && (o = Sr(e, n.head.line, "smart"));
              o && Z(e, "electricInput", e, n.head.line);
            }
          }
      }
      u(Io, "triggerElectric");
      function Ro(e) {
        for (var t = [], i = [], r = 0; r < e.doc.sel.ranges.length; r++) {
          var n = e.doc.sel.ranges[r].head.line, l = { anchor: y(n, 0), head: y(n + 1, 0) };
          i.push(l), t.push(e.getRange(l.anchor, l.head));
        }
        return { text: t, ranges: i };
      }
      u(Ro, "copyableRanges");
      function Bo(e, t, i, r) {
        e.setAttribute("autocorrect", i ? "" : "off"), e.setAttribute("autocapitalize", r ? "" : "off"), e.setAttribute("spellcheck", !!t);
      }
      u(Bo, "disableBrowserMagic");
      function zo() {
        var e = T("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none"), t = T("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        return ne ? e.style.width = "1000px" : e.setAttribute("wrap", "off"), Ut && (e.style.border = "1px solid black"), Bo(e), t;
      }
      u(zo, "hiddenTextarea");
      function tu(e) {
        var t = e.optionHandlers, i = e.helpers = {};
        e.prototype = {
          constructor: e,
          focus: function() {
            window.focus(), this.display.input.focus();
          },
          setOption: function(r, n) {
            var l = this.options, o = l[r];
            l[r] == n && r != "mode" || (l[r] = n, t.hasOwnProperty(r) && Q(this, t[r])(this, n, o), U(this, "optionChange", this, r));
          },
          getOption: function(r) {
            return this.options[r];
          },
          getDoc: function() {
            return this.doc;
          },
          addKeyMap: function(r, n) {
            this.state.keyMaps[n ? "push" : "unshift"](oi(r));
          },
          removeKeyMap: function(r) {
            for (var n = this.state.keyMaps, l = 0; l < n.length; ++l)
              if (n[l] == r || n[l].name == r)
                return n.splice(l, 1), !0;
          },
          addOverlay: le(function(r, n) {
            var l = r.token ? r : e.getMode(this.options, r);
            if (l.startState)
              throw new Error("Overlays may not be stateful.");
            Qo(
              this.state.overlays,
              {
                mode: l,
                modeSpec: r,
                opaque: n && n.opaque,
                priority: n && n.priority || 0
              },
              function(o) {
                return o.priority;
              }
            ), this.state.modeGen++, se(this);
          }),
          removeOverlay: le(function(r) {
            for (var n = this.state.overlays, l = 0; l < n.length; ++l) {
              var o = n[l].modeSpec;
              if (o == r || typeof r == "string" && o.name == r) {
                n.splice(l, 1), this.state.modeGen++, se(this);
                return;
              }
            }
          }),
          indentLine: le(function(r, n, l) {
            typeof n != "string" && typeof n != "number" && (n == null ? n = this.options.smartIndent ? "smart" : "prev" : n = n ? "add" : "subtract"), Jt(this.doc, r) && Sr(this, r, n, l);
          }),
          indentSelection: le(function(r) {
            for (var n = this.doc.sel.ranges, l = -1, o = 0; o < n.length; o++) {
              var a = n[o];
              if (a.empty())
                a.head.line > l && (Sr(this, a.head.line, r, !0), l = a.head.line, o == this.doc.sel.primIndex && Nt(this));
              else {
                var s = a.from(), f = a.to(), h = Math.max(l, s.line);
                l = Math.min(this.lastLine(), f.line - (f.ch ? 0 : 1)) + 1;
                for (var c = h; c < l; ++c)
                  Sr(this, c, r);
                var p = this.doc.sel.ranges;
                s.ch == 0 && n.length == p.length && p[o].from().ch > 0 && vn(this.doc, o, new W(s, p[o].to()), Me);
              }
            }
          }),
          // Fetch the parser token for a given character. Useful for hacks
          // that want to inspect the mode state (say, for completion).
          getTokenAt: function(r, n) {
            return Zn(this, r, n);
          },
          getLineTokens: function(r, n) {
            return Zn(this, y(r), n, !0);
          },
          getTokenTypeAt: function(r) {
            r = N(this.doc, r);
            var n = Xn(this, S(this.doc, r.line)), l = 0, o = (n.length - 1) / 2, a = r.ch, s;
            if (a == 0)
              s = n[2];
            else
              for (; ; ) {
                var f = l + o >> 1;
                if ((f ? n[f * 2 - 1] : 0) >= a)
                  o = f;
                else if (n[f * 2 + 1] < a)
                  l = f + 1;
                else {
                  s = n[f * 2 + 2];
                  break;
                }
              }
            var h = s ? s.indexOf("overlay ") : -1;
            return h < 0 ? s : h == 0 ? null : s.slice(0, h - 1);
          },
          getModeAt: function(r) {
            var n = this.doc.mode;
            return n.innerMode ? e.innerMode(n, this.getTokenAt(r).state).mode : n;
          },
          getHelper: function(r, n) {
            return this.getHelpers(r, n)[0];
          },
          getHelpers: function(r, n) {
            var l = [];
            if (!i.hasOwnProperty(n))
              return l;
            var o = i[n], a = this.getModeAt(r);
            if (typeof a[n] == "string")
              o[a[n]] && l.push(o[a[n]]);
            else if (a[n])
              for (var s = 0; s < a[n].length; s++) {
                var f = o[a[n][s]];
                f && l.push(f);
              }
            else
              a.helperType && o[a.helperType] ? l.push(o[a.helperType]) : o[a.name] && l.push(o[a.name]);
            for (var h = 0; h < o._global.length; h++) {
              var c = o._global[h];
              c.pred(a, this) && ee(l, c.val) == -1 && l.push(c.val);
            }
            return l;
          },
          getStateAfter: function(r, n) {
            var l = this.doc;
            return r = Un(l, r ?? l.first + l.size - 1), jt(this, r + 1, n).state;
          },
          cursorCoords: function(r, n) {
            var l, o = this.doc.sel.primary();
            return r == null ? l = o.head : typeof r == "object" ? l = N(this.doc, r) : l = r ? o.from() : o.to(), Le(this, l, n || "page");
          },
          charCoords: function(r, n) {
            return Xr(this, N(this.doc, r), n || "page");
          },
          coordsChar: function(r, n) {
            return r = Sl(this, r, n || "page"), qi(this, r.left, r.top);
          },
          lineAtHeight: function(r, n) {
            return r = Sl(this, { top: r, left: 0 }, n || "page").top, at(this.doc, r + this.display.viewOffset);
          },
          heightAtLine: function(r, n, l) {
            var o = !1, a;
            if (typeof r == "number") {
              var s = this.doc.first + this.doc.size - 1;
              r < this.doc.first ? r = this.doc.first : r > s && (r = s, o = !0), a = S(this.doc, r);
            } else
              a = r;
            return _r(this, a, { top: 0, left: 0 }, n || "page", l || o).top + (o ? this.doc.height - Ie(a) : 0);
          },
          defaultTextHeight: function() {
            return Tt(this.display);
          },
          defaultCharWidth: function() {
            return Mt(this.display);
          },
          getViewport: function() {
            return { from: this.display.viewFrom, to: this.display.viewTo };
          },
          addWidget: function(r, n, l, o, a) {
            var s = this.display;
            r = Le(this, N(this.doc, r));
            var f = r.bottom, h = r.left;
            if (n.style.position = "absolute", n.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(n), s.sizer.appendChild(n), o == "over")
              f = r.top;
            else if (o == "above" || o == "near") {
              var c = Math.max(s.wrapper.clientHeight, this.doc.height), p = Math.max(s.sizer.clientWidth, s.lineSpace.clientWidth);
              (o == "above" || r.bottom + n.offsetHeight > c) && r.top > n.offsetHeight ? f = r.top - n.offsetHeight : r.bottom + n.offsetHeight <= c && (f = r.bottom), h + n.offsetWidth > p && (h = p - n.offsetWidth);
            }
            n.style.top = f + "px", n.style.left = n.style.right = "", a == "right" ? (h = s.sizer.clientWidth - n.offsetWidth, n.style.right = "0px") : (a == "left" ? h = 0 : a == "middle" && (h = (s.sizer.clientWidth - n.offsetWidth) / 2), n.style.left = h + "px"), l && Va(this, { left: h, top: f, right: h + n.offsetWidth, bottom: f + n.offsetHeight });
          },
          triggerOnKeyDown: le(Mo),
          triggerOnKeyPress: le(No),
          triggerOnKeyUp: Do,
          triggerOnMouseDown: le(Ao),
          execCommand: function(r) {
            if (br.hasOwnProperty(r))
              return br[r].call(null, this);
          },
          triggerElectric: le(function(r) {
            Io(this, r);
          }),
          findPosH: function(r, n, l, o) {
            var a = 1;
            n < 0 && (a = -1, n = -n);
            for (var s = N(this.doc, r), f = 0; f < n && (s = Ln(this.doc, s, a, l, o), !s.hitSide); ++f)
              ;
            return s;
          },
          moveH: le(function(r, n) {
            var l = this;
            this.extendSelectionsBy(function(o) {
              return l.display.shift || l.doc.extend || o.empty() ? Ln(l.doc, o.head, r, n, l.options.rtlMoveVisually) : r < 0 ? o.from() : o.to();
            }, Xt);
          }),
          deleteH: le(function(r, n) {
            var l = this.doc.sel, o = this.doc;
            l.somethingSelected() ? o.replaceSelection("", null, "+delete") : It(this, function(a) {
              var s = Ln(o, a.head, r, n, !1);
              return r < 0 ? { from: s, to: a.head } : { from: a.head, to: s };
            });
          }),
          findPosV: function(r, n, l, o) {
            var a = 1, s = o;
            n < 0 && (a = -1, n = -n);
            for (var f = N(this.doc, r), h = 0; h < n; ++h) {
              var c = Le(this, f, "div");
              if (s == null ? s = c.left : c.left = s, f = Go(this, c, a, l), f.hitSide)
                break;
            }
            return f;
          },
          moveV: le(function(r, n) {
            var l = this, o = this.doc, a = [], s = !this.display.shift && !o.extend && o.sel.somethingSelected();
            if (o.extendSelectionsBy(function(h) {
              if (s)
                return r < 0 ? h.from() : h.to();
              var c = Le(l, h.head, "div");
              h.goalColumn != null && (c.left = h.goalColumn), a.push(c.left);
              var p = Go(l, c, r, n);
              return n == "page" && h == o.sel.primary() && nn(l, Xr(l, p, "div").top - c.top), p;
            }, Xt), a.length)
              for (var f = 0; f < o.sel.ranges.length; f++)
                o.sel.ranges[f].goalColumn = a[f];
          }),
          // Find the word at the given position (as returned by coordsChar).
          findWordAt: function(r) {
            var n = this.doc, l = S(n, r.line).text, o = r.ch, a = r.ch;
            if (l) {
              var s = this.getHelper(r, "wordChars");
              (r.sticky == "before" || a == l.length) && o ? --o : ++a;
              for (var f = l.charAt(o), h = Wr(f, s) ? function(c) {
                return Wr(c, s);
              } : /\s/.test(f) ? function(c) {
                return /\s/.test(c);
              } : function(c) {
                return !/\s/.test(c) && !Wr(c);
              }; o > 0 && h(l.charAt(o - 1)); )
                --o;
              for (; a < l.length && h(l.charAt(a)); )
                ++a;
            }
            return new W(y(r.line, o), y(r.line, a));
          },
          toggleOverwrite: function(r) {
            r != null && r == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? it(this.display.cursorDiv, "CodeMirror-overwrite") : tt(this.display.cursorDiv, "CodeMirror-overwrite"), U(this, "overwriteToggle", this, this.state.overwrite));
          },
          hasFocus: function() {
            return this.display.input.getField() == be();
          },
          isReadOnly: function() {
            return !!(this.options.readOnly || this.doc.cantEdit);
          },
          scrollTo: le(function(r, n) {
            nr(this, r, n);
          }),
          getScrollInfo: function() {
            var r = this.display.scroller;
            return {
              left: r.scrollLeft,
              top: r.scrollTop,
              height: r.scrollHeight - Ae(this) - this.display.barHeight,
              width: r.scrollWidth - Ae(this) - this.display.barWidth,
              clientHeight: Ki(this),
              clientWidth: st(this)
            };
          },
          scrollIntoView: le(function(r, n) {
            r == null ? (r = { from: this.doc.sel.primary().head, to: null }, n == null && (n = this.options.cursorScrollMargin)) : typeof r == "number" ? r = { from: y(r, 0), to: null } : r.from == null && (r = { from: r, to: null }), r.to || (r.to = r.from), r.margin = n || 0, r.from.line != null ? $a(this, r) : Wl(this, r.from, r.to, r.margin);
          }),
          setSize: le(function(r, n) {
            var l = this, o = /* @__PURE__ */ u(function(s) {
              return typeof s == "number" || /^\d+$/.test(String(s)) ? s + "px" : s;
            }, "interpret");
            r != null && (this.display.wrapper.style.width = o(r)), n != null && (this.display.wrapper.style.height = o(n)), this.options.lineWrapping && xl(this);
            var a = this.display.viewFrom;
            this.doc.iter(a, this.display.viewTo, function(s) {
              if (s.widgets) {
                for (var f = 0; f < s.widgets.length; f++)
                  if (s.widgets[f].noHScroll) {
                    Ye(l, a, "widget");
                    break;
                  }
              }
              ++a;
            }), this.curOp.forceUpdate = !0, U(this, "refresh", this);
          }),
          operation: function(r) {
            return de(this, r);
          },
          startOperation: function() {
            return pt(this);
          },
          endOperation: function() {
            return vt(this);
          },
          refresh: le(function() {
            var r = this.display.cachedTextHeight;
            se(this), this.curOp.forceUpdate = !0, rr(this), nr(this, this.doc.scrollLeft, this.doc.scrollTop), an(this.display), (r == null || Math.abs(r - Tt(this.display)) > 0.5 || this.options.lineWrapping) && ji(this), U(this, "refresh", this);
          }),
          swapDoc: le(function(r) {
            var n = this.doc;
            return n.cm = null, this.state.selectingText && this.state.selectingText(), Yl(this, r), rr(this), this.display.input.reset(), nr(this, r.scrollLeft, r.scrollTop), this.curOp.forceScroll = !0, Z(this, "swapDoc", this, n), n;
          }),
          phrase: function(r) {
            var n = this.options.phrases;
            return n && Object.prototype.hasOwnProperty.call(n, r) ? n[r] : r;
          },
          getInputField: function() {
            return this.display.input.getField();
          },
          getWrapperElement: function() {
            return this.display.wrapper;
          },
          getScrollerElement: function() {
            return this.display.scroller;
          },
          getGutterElement: function() {
            return this.display.gutters;
          }
        }, xt(e), e.registerHelper = function(r, n, l) {
          i.hasOwnProperty(r) || (i[r] = e[r] = { _global: [] }), i[r][n] = l;
        }, e.registerGlobalHelper = function(r, n, l, o) {
          e.registerHelper(r, n, o), i[r]._global.push({ pred: l, val: o });
        };
      }
      u(tu, "addEditorMethods");
      function Ln(e, t, i, r, n) {
        var l = t, o = i, a = S(e, t.line), s = n && e.direction == "rtl" ? -i : i;
        function f() {
          var C = t.line + s;
          return C < e.first || C >= e.first + e.size ? !1 : (t = new y(C, t.ch, t.sticky), a = S(e, C));
        }
        u(f, "findNextLine");
        function h(C) {
          var x;
          if (r == "codepoint") {
            var w = a.text.charCodeAt(t.ch + (i > 0 ? 0 : -1));
            if (isNaN(w))
              x = null;
            else {
              var k = i > 0 ? w >= 55296 && w < 56320 : w >= 56320 && w < 57343;
              x = new y(t.line, Math.max(0, Math.min(a.text.length, t.ch + i * (k ? 2 : 1))), -i);
            }
          } else
            n ? x = Es(e.cm, a, t, i) : x = yn(a, t, i);
          if (x == null)
            if (!C && f())
              t = mn(n, e.cm, a, t.line, s);
            else
              return !1;
          else
            t = x;
          return !0;
        }
        if (u(h, "moveOnce"), r == "char" || r == "codepoint")
          h();
        else if (r == "column")
          h(!0);
        else if (r == "word" || r == "group")
          for (var c = null, p = r == "group", d = e.cm && e.cm.getHelper(t, "wordChars"), v = !0; !(i < 0 && !h(!v)); v = !1) {
            var g = a.text.charAt(t.ch) || `
`, m = Wr(g, d) ? "w" : p && g == `
` ? "n" : !p || /\s/.test(g) ? null : "p";
            if (p && !v && !m && (m = "s"), c && c != m) {
              i < 0 && (i = 1, h(), t.sticky = "after");
              break;
            }
            if (m && (c = m), i > 0 && !h(!v))
              break;
          }
        var b = ii(e, t, l, o, !0);
        return Wi(l, b) && (b.hitSide = !0), b;
      }
      u(Ln, "findPosH");
      function Go(e, t, i, r) {
        var n = e.doc, l = t.left, o;
        if (r == "page") {
          var a = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight), s = Math.max(a - 0.5 * Tt(e.display), 3);
          o = (i > 0 ? t.bottom : t.top) + i * s;
        } else
          r == "line" && (o = i > 0 ? t.bottom + 3 : t.top - 3);
        for (var f; f = qi(e, l, o), !!f.outside; ) {
          if (i < 0 ? o <= 0 : o >= n.height) {
            f.hitSide = !0;
            break;
          }
          o += i * 5;
        }
        return f;
      }
      u(Go, "findPosV");
      var P = /* @__PURE__ */ u(function(e) {
        this.cm = e, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new _e(), this.composing = null, this.gracePeriod = !1, this.readDOMTimeout = null;
      }, "ContentEditableInput");
      P.prototype.init = function(e) {
        var t = this, i = this, r = i.cm, n = i.div = e.lineDiv;
        n.contentEditable = !0, Bo(n, r.options.spellcheck, r.options.autocorrect, r.options.autocapitalize);
        function l(a) {
          for (var s = a.target; s; s = s.parentNode) {
            if (s == n)
              return !0;
            if (/\bCodeMirror-(?:line)?widget\b/.test(s.className))
              break;
          }
          return !1;
        }
        u(l, "belongsToInput"), M(n, "paste", function(a) {
          !l(a) || q(r, a) || Eo(a, r) || I <= 11 && setTimeout(Q(r, function() {
            return t.updateFromDOM();
          }), 20);
        }), M(n, "compositionstart", function(a) {
          t.composing = { data: a.data, done: !1 };
        }), M(n, "compositionupdate", function(a) {
          t.composing || (t.composing = { data: a.data, done: !1 });
        }), M(n, "compositionend", function(a) {
          t.composing && (a.data != t.composing.data && t.readFromDOMSoon(), t.composing.done = !0);
        }), M(n, "touchstart", function() {
          return i.forceCompositionEnd();
        }), M(n, "input", function() {
          t.composing || t.readFromDOMSoon();
        });
        function o(a) {
          if (!(!l(a) || q(r, a))) {
            if (r.somethingSelected())
              ui({ lineWise: !1, text: r.getSelections() }), a.type == "cut" && r.replaceSelection("", null, "cut");
            else if (r.options.lineWiseCopyCut) {
              var s = Ro(r);
              ui({ lineWise: !0, text: s.text }), a.type == "cut" && r.operation(function() {
                r.setSelections(s.ranges, 0, Me), r.replaceSelection("", null, "cut");
              });
            } else
              return;
            if (a.clipboardData) {
              a.clipboardData.clearData();
              var f = Te.text.join(`
`);
              if (a.clipboardData.setData("Text", f), a.clipboardData.getData("Text") == f) {
                a.preventDefault();
                return;
              }
            }
            var h = zo(), c = h.firstChild;
            r.display.lineSpace.insertBefore(h, r.display.lineSpace.firstChild), c.value = Te.text.join(`
`);
            var p = be();
            _t(c), setTimeout(function() {
              r.display.lineSpace.removeChild(h), p.focus(), p == n && i.showPrimarySelection();
            }, 50);
          }
        }
        u(o, "onCopyCut"), M(n, "copy", o), M(n, "cut", o);
      }, P.prototype.screenReaderLabelChanged = function(e) {
        e ? this.div.setAttribute("aria-label", e) : this.div.removeAttribute("aria-label");
      }, P.prototype.prepareSelection = function() {
        var e = Nl(this.cm, !1);
        return e.focus = be() == this.div, e;
      }, P.prototype.showSelection = function(e, t) {
        !e || !this.cm.display.view.length || ((e.focus || t) && this.showPrimarySelection(), this.showMultipleSelections(e));
      }, P.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
      }, P.prototype.showPrimarySelection = function() {
        var e = this.getSelection(), t = this.cm, i = t.doc.sel.primary(), r = i.from(), n = i.to();
        if (t.display.viewTo == t.display.viewFrom || r.line >= t.display.viewTo || n.line < t.display.viewFrom) {
          e.removeAllRanges();
          return;
        }
        var l = fi(t, e.anchorNode, e.anchorOffset), o = fi(t, e.focusNode, e.focusOffset);
        if (!(l && !l.bad && o && !o.bad && D(Pr(l, o), r) == 0 && D(Fr(l, o), n) == 0)) {
          var a = t.display.view, s = r.line >= t.display.viewFrom && Uo(t, r) || { node: a[0].measure.map[2], offset: 0 }, f = n.line < t.display.viewTo && Uo(t, n);
          if (!f) {
            var h = a[a.length - 1].measure, c = h.maps ? h.maps[h.maps.length - 1] : h.map;
            f = { node: c[c.length - 1], offset: c[c.length - 2] - c[c.length - 3] };
          }
          if (!s || !f) {
            e.removeAllRanges();
            return;
          }
          var p = e.rangeCount && e.getRangeAt(0), d;
          try {
            d = rt(s.node, s.offset, f.offset, f.node);
          } catch {
          }
          d && (!Fe && t.state.focused ? (e.collapse(s.node, s.offset), d.collapsed || (e.removeAllRanges(), e.addRange(d))) : (e.removeAllRanges(), e.addRange(d)), p && e.anchorNode == null ? e.addRange(p) : Fe && this.startGracePeriod()), this.rememberSelection();
        }
      }, P.prototype.startGracePeriod = function() {
        var e = this;
        clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function() {
          e.gracePeriod = !1, e.selectionChanged() && e.cm.operation(function() {
            return e.cm.curOp.selectionChanged = !0;
          });
        }, 20);
      }, P.prototype.showMultipleSelections = function(e) {
        ve(this.cm.display.cursorDiv, e.cursors), ve(this.cm.display.selectionDiv, e.selection);
      }, P.prototype.rememberSelection = function() {
        var e = this.getSelection();
        this.lastAnchorNode = e.anchorNode, this.lastAnchorOffset = e.anchorOffset, this.lastFocusNode = e.focusNode, this.lastFocusOffset = e.focusOffset;
      }, P.prototype.selectionInEditor = function() {
        var e = this.getSelection();
        if (!e.rangeCount)
          return !1;
        var t = e.getRangeAt(0).commonAncestorContainer;
        return Ke(this.div, t);
      }, P.prototype.focus = function() {
        this.cm.options.readOnly != "nocursor" && ((!this.selectionInEditor() || be() != this.div) && this.showSelection(this.prepareSelection(), !0), this.div.focus());
      }, P.prototype.blur = function() {
        this.div.blur();
      }, P.prototype.getField = function() {
        return this.div;
      }, P.prototype.supportsTouch = function() {
        return !0;
      }, P.prototype.receivedFocus = function() {
        var e = this, t = this;
        this.selectionInEditor() ? setTimeout(function() {
          return e.pollSelection();
        }, 20) : de(this.cm, function() {
          return t.cm.curOp.selectionChanged = !0;
        });
        function i() {
          t.cm.state.focused && (t.pollSelection(), t.polling.set(t.cm.options.pollInterval, i));
        }
        u(i, "poll"), this.polling.set(this.cm.options.pollInterval, i);
      }, P.prototype.selectionChanged = function() {
        var e = this.getSelection();
        return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset;
      }, P.prototype.pollSelection = function() {
        if (!(this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged())) {
          var e = this.getSelection(), t = this.cm;
          if (Dr && Tr && this.cm.display.gutterSpecs.length && ru(e.anchorNode)) {
            this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs }), this.blur(), this.focus();
            return;
          }
          if (!this.composing) {
            this.rememberSelection();
            var i = fi(t, e.anchorNode, e.anchorOffset), r = fi(t, e.focusNode, e.focusOffset);
            i && r && de(t, function() {
              te(t.doc, Ze(i, r), Me), (i.bad || r.bad) && (t.curOp.selectionChanged = !0);
            });
          }
        }
      }, P.prototype.pollContent = function() {
        this.readDOMTimeout != null && (clearTimeout(this.readDOMTimeout), this.readDOMTimeout = null);
        var e = this.cm, t = e.display, i = e.doc.sel.primary(), r = i.from(), n = i.to();
        if (r.ch == 0 && r.line > e.firstLine() && (r = y(r.line - 1, S(e.doc, r.line - 1).length)), n.ch == S(e.doc, n.line).text.length && n.line < e.lastLine() && (n = y(n.line + 1, 0)), r.line < t.viewFrom || n.line > t.viewTo - 1)
          return !1;
        var l, o, a;
        r.line == t.viewFrom || (l = ht(e, r.line)) == 0 ? (o = F(t.view[0].line), a = t.view[0].node) : (o = F(t.view[l].line), a = t.view[l - 1].node.nextSibling);
        var s = ht(e, n.line), f, h;
        if (s == t.view.length - 1 ? (f = t.viewTo - 1, h = t.lineDiv.lastChild) : (f = F(t.view[s + 1].line) - 1, h = t.view[s + 1].node.previousSibling), !a)
          return !1;
        for (var c = e.doc.splitLines(iu(e, a, h, o, f)), p = ot(e.doc, y(o, 0), y(f, S(e.doc, f).text.length)); c.length > 1 && p.length > 1; )
          if (H(c) == H(p))
            c.pop(), p.pop(), f--;
          else if (c[0] == p[0])
            c.shift(), p.shift(), o++;
          else
            break;
        for (var d = 0, v = 0, g = c[0], m = p[0], b = Math.min(g.length, m.length); d < b && g.charCodeAt(d) == m.charCodeAt(d); )
          ++d;
        for (var C = H(c), x = H(p), w = Math.min(
          C.length - (c.length == 1 ? d : 0),
          x.length - (p.length == 1 ? d : 0)
        ); v < w && C.charCodeAt(C.length - v - 1) == x.charCodeAt(x.length - v - 1); )
          ++v;
        if (c.length == 1 && p.length == 1 && o == r.line)
          for (; d && d > r.ch && C.charCodeAt(C.length - v - 1) == x.charCodeAt(x.length - v - 1); )
            d--, v++;
        c[c.length - 1] = C.slice(0, C.length - v).replace(/^\u200b+/, ""), c[0] = c[0].slice(d).replace(/\u200b+$/, "");
        var k = y(o, d), L = y(f, p.length ? H(p).length - v : 0);
        if (c.length > 1 || c[0] || D(k, L))
          return Ft(e.doc, c, k, L, "+input"), !0;
      }, P.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
      }, P.prototype.reset = function() {
        this.forceCompositionEnd();
      }, P.prototype.forceCompositionEnd = function() {
        this.composing && (clearTimeout(this.readDOMTimeout), this.composing = null, this.updateFromDOM(), this.div.blur(), this.div.focus());
      }, P.prototype.readFromDOMSoon = function() {
        var e = this;
        this.readDOMTimeout == null && (this.readDOMTimeout = setTimeout(function() {
          if (e.readDOMTimeout = null, e.composing)
            if (e.composing.done)
              e.composing = null;
            else
              return;
          e.updateFromDOM();
        }, 80));
      }, P.prototype.updateFromDOM = function() {
        var e = this;
        (this.cm.isReadOnly() || !this.pollContent()) && de(this.cm, function() {
          return se(e.cm);
        });
      }, P.prototype.setUneditable = function(e) {
        e.contentEditable = "false";
      }, P.prototype.onKeyPress = function(e) {
        e.charCode == 0 || this.composing || (e.preventDefault(), this.cm.isReadOnly() || Q(this.cm, Sn)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0));
      }, P.prototype.readOnlyChanged = function(e) {
        this.div.contentEditable = String(e != "nocursor");
      }, P.prototype.onContextMenu = function() {
      }, P.prototype.resetPosition = function() {
      }, P.prototype.needsContentAttribute = !0;
      function Uo(e, t) {
        var i = _i(e, t.line);
        if (!i || i.hidden)
          return null;
        var r = S(e.doc, t.line), n = vl(i, r, t.line), l = Pe(r, e.doc.direction), o = "left";
        if (l) {
          var a = Zt(l, t.ch);
          o = a % 2 ? "right" : "left";
        }
        var s = ml(n.map, t.ch, o);
        return s.offset = s.collapse == "right" ? s.end : s.start, s;
      }
      u(Uo, "posToDOM");
      function ru(e) {
        for (var t = e; t; t = t.parentNode)
          if (/CodeMirror-gutter-wrapper/.test(t.className))
            return !0;
        return !1;
      }
      u(ru, "isInGutter");
      function Bt(e, t) {
        return t && (e.bad = !0), e;
      }
      u(Bt, "badPos");
      function iu(e, t, i, r, n) {
        var l = "", o = !1, a = e.doc.lineSeparator(), s = !1;
        function f(d) {
          return function(v) {
            return v.id == d;
          };
        }
        u(f, "recognizeMarker");
        function h() {
          o && (l += a, s && (l += a), o = s = !1);
        }
        u(h, "close");
        function c(d) {
          d && (h(), l += d);
        }
        u(c, "addText");
        function p(d) {
          if (d.nodeType == 1) {
            var v = d.getAttribute("cm-text");
            if (v) {
              c(v);
              return;
            }
            var g = d.getAttribute("cm-marker"), m;
            if (g) {
              var b = e.findMarks(y(r, 0), y(n + 1, 0), f(+g));
              b.length && (m = b[0].find(0)) && c(ot(e.doc, m.from, m.to).join(a));
              return;
            }
            if (d.getAttribute("contenteditable") == "false")
              return;
            var C = /^(pre|div|p|li|table|br)$/i.test(d.nodeName);
            if (!/^br$/i.test(d.nodeName) && d.textContent.length == 0)
              return;
            C && h();
            for (var x = 0; x < d.childNodes.length; x++)
              p(d.childNodes[x]);
            /^(pre|p)$/i.test(d.nodeName) && (s = !0), C && (o = !0);
          } else
            d.nodeType == 3 && c(d.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
        }
        for (u(p, "walk"); p(t), t != i; )
          t = t.nextSibling, s = !1;
        return l;
      }
      u(iu, "domTextBetween");
      function fi(e, t, i) {
        var r;
        if (t == e.display.lineDiv) {
          if (r = e.display.lineDiv.childNodes[i], !r)
            return Bt(e.clipPos(y(e.display.viewTo - 1)), !0);
          t = null, i = 0;
        } else
          for (r = t; ; r = r.parentNode) {
            if (!r || r == e.display.lineDiv)
              return null;
            if (r.parentNode && r.parentNode == e.display.lineDiv)
              break;
          }
        for (var n = 0; n < e.display.view.length; n++) {
          var l = e.display.view[n];
          if (l.node == r)
            return nu(l, t, i);
        }
      }
      u(fi, "domToPos");
      function nu(e, t, i) {
        var r = e.text.firstChild, n = !1;
        if (!t || !Ke(r, t))
          return Bt(y(F(e.line), 0), !0);
        if (t == r && (n = !0, t = r.childNodes[i], i = 0, !t)) {
          var l = e.rest ? H(e.rest) : e.line;
          return Bt(y(F(l), l.text.length), n);
        }
        var o = t.nodeType == 3 ? t : null, a = t;
        for (!o && t.childNodes.length == 1 && t.firstChild.nodeType == 3 && (o = t.firstChild, i && (i = o.nodeValue.length)); a.parentNode != r; )
          a = a.parentNode;
        var s = e.measure, f = s.maps;
        function h(m, b, C) {
          for (var x = -1; x < (f ? f.length : 0); x++)
            for (var w = x < 0 ? s.map : f[x], k = 0; k < w.length; k += 3) {
              var L = w[k + 2];
              if (L == m || L == b) {
                var A = F(x < 0 ? e.line : e.rest[x]), E = w[k] + C;
                return (C < 0 || L != m) && (E = w[k + (C ? 1 : 0)]), y(A, E);
              }
            }
        }
        u(h, "find");
        var c = h(o, a, i);
        if (c)
          return Bt(c, n);
        for (var p = a.nextSibling, d = o ? o.nodeValue.length - i : 0; p; p = p.nextSibling) {
          if (c = h(p, p.firstChild, 0), c)
            return Bt(y(c.line, c.ch - d), n);
          d += p.textContent.length;
        }
        for (var v = a.previousSibling, g = i; v; v = v.previousSibling) {
          if (c = h(v, v.firstChild, -1), c)
            return Bt(y(c.line, c.ch + g), n);
          g += v.textContent.length;
        }
      }
      u(nu, "locateNodeInLineView");
      var G = /* @__PURE__ */ u(function(e) {
        this.cm = e, this.prevInput = "", this.pollingFast = !1, this.polling = new _e(), this.hasSelection = !1, this.composing = null;
      }, "TextareaInput");
      G.prototype.init = function(e) {
        var t = this, i = this, r = this.cm;
        this.createField(e);
        var n = this.textarea;
        e.wrapper.insertBefore(this.wrapper, e.wrapper.firstChild), Ut && (n.style.width = "0px"), M(n, "input", function() {
          O && I >= 9 && t.hasSelection && (t.hasSelection = null), i.poll();
        }), M(n, "paste", function(o) {
          q(r, o) || Eo(o, r) || (r.state.pasteIncoming = +/* @__PURE__ */ new Date(), i.fastPoll());
        });
        function l(o) {
          if (!q(r, o)) {
            if (r.somethingSelected())
              ui({ lineWise: !1, text: r.getSelections() });
            else if (r.options.lineWiseCopyCut) {
              var a = Ro(r);
              ui({ lineWise: !0, text: a.text }), o.type == "cut" ? r.setSelections(a.ranges, null, Me) : (i.prevInput = "", n.value = a.text.join(`
`), _t(n));
            } else
              return;
            o.type == "cut" && (r.state.cutIncoming = +/* @__PURE__ */ new Date());
          }
        }
        u(l, "prepareCopyCut"), M(n, "cut", l), M(n, "copy", l), M(e.scroller, "paste", function(o) {
          if (!(Re(e, o) || q(r, o))) {
            if (!n.dispatchEvent) {
              r.state.pasteIncoming = +/* @__PURE__ */ new Date(), i.focus();
              return;
            }
            var a = new Event("paste");
            a.clipboardData = o.clipboardData, n.dispatchEvent(a);
          }
        }), M(e.lineSpace, "selectstart", function(o) {
          Re(e, o) || ae(o);
        }), M(n, "compositionstart", function() {
          var o = r.getCursor("from");
          i.composing && i.composing.range.clear(), i.composing = {
            start: o,
            range: r.markText(o, r.getCursor("to"), { className: "CodeMirror-composing" })
          };
        }), M(n, "compositionend", function() {
          i.composing && (i.poll(), i.composing.range.clear(), i.composing = null);
        });
      }, G.prototype.createField = function(e) {
        this.wrapper = zo(), this.textarea = this.wrapper.firstChild;
      }, G.prototype.screenReaderLabelChanged = function(e) {
        e ? this.textarea.setAttribute("aria-label", e) : this.textarea.removeAttribute("aria-label");
      }, G.prototype.prepareSelection = function() {
        var e = this.cm, t = e.display, i = e.doc, r = Nl(e);
        if (e.options.moveInputWithCursor) {
          var n = Le(e, i.sel.primary().head, "div"), l = t.wrapper.getBoundingClientRect(), o = t.lineDiv.getBoundingClientRect();
          r.teTop = Math.max(0, Math.min(
            t.wrapper.clientHeight - 10,
            n.top + o.top - l.top
          )), r.teLeft = Math.max(0, Math.min(
            t.wrapper.clientWidth - 10,
            n.left + o.left - l.left
          ));
        }
        return r;
      }, G.prototype.showSelection = function(e) {
        var t = this.cm, i = t.display;
        ve(i.cursorDiv, e.cursors), ve(i.selectionDiv, e.selection), e.teTop != null && (this.wrapper.style.top = e.teTop + "px", this.wrapper.style.left = e.teLeft + "px");
      }, G.prototype.reset = function(e) {
        if (!(this.contextMenuPending || this.composing)) {
          var t = this.cm;
          if (t.somethingSelected()) {
            this.prevInput = "";
            var i = t.getSelection();
            this.textarea.value = i, t.state.focused && _t(this.textarea), O && I >= 9 && (this.hasSelection = i);
          } else
            e || (this.prevInput = this.textarea.value = "", O && I >= 9 && (this.hasSelection = null));
        }
      }, G.prototype.getField = function() {
        return this.textarea;
      }, G.prototype.supportsTouch = function() {
        return !1;
      }, G.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!Kt || be() != this.textarea))
          try {
            this.textarea.focus();
          } catch {
          }
      }, G.prototype.blur = function() {
        this.textarea.blur();
      }, G.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
      }, G.prototype.receivedFocus = function() {
        this.slowPoll();
      }, G.prototype.slowPoll = function() {
        var e = this;
        this.pollingFast || this.polling.set(this.cm.options.pollInterval, function() {
          e.poll(), e.cm.state.focused && e.slowPoll();
        });
      }, G.prototype.fastPoll = function() {
        var e = !1, t = this;
        t.pollingFast = !0;
        function i() {
          var r = t.poll();
          !r && !e ? (e = !0, t.polling.set(60, i)) : (t.pollingFast = !1, t.slowPoll());
        }
        u(i, "p"), t.polling.set(20, i);
      }, G.prototype.poll = function() {
        var e = this, t = this.cm, i = this.textarea, r = this.prevInput;
        if (this.contextMenuPending || !t.state.focused || ia(i) && !r && !this.composing || t.isReadOnly() || t.options.disableInput || t.state.keySeq)
          return !1;
        var n = i.value;
        if (n == r && !t.somethingSelected())
          return !1;
        if (O && I >= 9 && this.hasSelection === n || me && /[\uf700-\uf7ff]/.test(n))
          return t.display.input.reset(), !1;
        if (t.doc.sel == t.display.selForContextMenu) {
          var l = n.charCodeAt(0);
          if (l == 8203 && !r && (r = "​"), l == 8666)
            return this.reset(), this.cm.execCommand("undo");
        }
        for (var o = 0, a = Math.min(r.length, n.length); o < a && r.charCodeAt(o) == n.charCodeAt(o); )
          ++o;
        return de(t, function() {
          Sn(
            t,
            n.slice(o),
            r.length - o,
            null,
            e.composing ? "*compose" : null
          ), n.length > 1e3 || n.indexOf(`
`) > -1 ? i.value = e.prevInput = "" : e.prevInput = n, e.composing && (e.composing.range.clear(), e.composing.range = t.markText(
            e.composing.start,
            t.getCursor("to"),
            { className: "CodeMirror-composing" }
          ));
        }), !0;
      }, G.prototype.ensurePolled = function() {
        this.pollingFast && this.poll() && (this.pollingFast = !1);
      }, G.prototype.onKeyPress = function() {
        O && I >= 9 && (this.hasSelection = null), this.fastPoll();
      }, G.prototype.onContextMenu = function(e) {
        var t = this, i = t.cm, r = i.display, n = t.textarea;
        t.contextMenuPending && t.contextMenuPending();
        var l = ft(i, e), o = r.scroller.scrollTop;
        if (!l || we)
          return;
        var a = i.options.resetSelectionOnContextMenu;
        a && i.doc.sel.contains(l) == -1 && Q(i, te)(i.doc, Ze(l), Me);
        var s = n.style.cssText, f = t.wrapper.style.cssText, h = t.wrapper.offsetParent.getBoundingClientRect();
        t.wrapper.style.cssText = "position: static", n.style.cssText = `position: absolute; width: 30px; height: 30px;
      top: ` + (e.clientY - h.top - 5) + "px; left: " + (e.clientX - h.left - 5) + `px;
      z-index: 1000; background: ` + (O ? "rgba(255, 255, 255, .05)" : "transparent") + `;
      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);`;
        var c;
        ne && (c = window.scrollY), r.input.focus(), ne && window.scrollTo(null, c), r.input.reset(), i.somethingSelected() || (n.value = t.prevInput = " "), t.contextMenuPending = d, r.selForContextMenu = i.doc.sel, clearTimeout(r.detectingSelectAll);
        function p() {
          if (n.selectionStart != null) {
            var g = i.somethingSelected(), m = "​" + (g ? n.value : "");
            n.value = "⇚", n.value = m, t.prevInput = g ? "" : "​", n.selectionStart = 1, n.selectionEnd = m.length, r.selForContextMenu = i.doc.sel;
          }
        }
        u(p, "prepareSelectAllHack");
        function d() {
          if (t.contextMenuPending == d && (t.contextMenuPending = !1, t.wrapper.style.cssText = f, n.style.cssText = s, O && I < 9 && r.scrollbars.setScrollTop(r.scroller.scrollTop = o), n.selectionStart != null)) {
            (!O || O && I < 9) && p();
            var g = 0, m = /* @__PURE__ */ u(function() {
              r.selForContextMenu == i.doc.sel && n.selectionStart == 0 && n.selectionEnd > 0 && t.prevInput == "​" ? Q(i, lo)(i) : g++ < 10 ? r.detectingSelectAll = setTimeout(m, 500) : (r.selForContextMenu = null, r.input.reset());
            }, "poll");
            r.detectingSelectAll = setTimeout(m, 200);
          }
        }
        if (u(d, "rehide"), O && I >= 9 && p(), ci) {
          Qt(e);
          var v = /* @__PURE__ */ u(function() {
            ge(window, "mouseup", v), setTimeout(d, 20);
          }, "mouseup");
          M(window, "mouseup", v);
        } else
          setTimeout(d, 50);
      }, G.prototype.readOnlyChanged = function(e) {
        e || this.reset(), this.textarea.disabled = e == "nocursor", this.textarea.readOnly = !!e;
      }, G.prototype.setUneditable = function() {
      }, G.prototype.needsContentAttribute = !1;
      function lu(e, t) {
        if (t = t ? nt(t) : {}, t.value = e.value, !t.tabindex && e.tabIndex && (t.tabindex = e.tabIndex), !t.placeholder && e.placeholder && (t.placeholder = e.placeholder), t.autofocus == null) {
          var i = be();
          t.autofocus = i == e || e.getAttribute("autofocus") != null && i == document.body;
        }
        function r() {
          e.value = a.getValue();
        }
        u(r, "save");
        var n;
        if (e.form && (M(e.form, "submit", r), !t.leaveSubmitMethodAlone)) {
          var l = e.form;
          n = l.submit;
          try {
            var o = l.submit = function() {
              r(), l.submit = n, l.submit(), l.submit = o;
            };
          } catch {
          }
        }
        t.finishInit = function(s) {
          s.save = r, s.getTextArea = function() {
            return e;
          }, s.toTextArea = function() {
            s.toTextArea = isNaN, r(), e.parentNode.removeChild(s.getWrapperElement()), e.style.display = "", e.form && (ge(e.form, "submit", r), !t.leaveSubmitMethodAlone && typeof e.form.submit == "function" && (e.form.submit = n));
          };
        }, e.style.display = "none";
        var a = R(
          function(s) {
            return e.parentNode.insertBefore(s, e.nextSibling);
          },
          t
        );
        return a;
      }
      u(lu, "fromTextArea");
      function ou(e) {
        e.off = ge, e.on = M, e.wheelEventPixels = ds, e.Doc = ue, e.splitLines = ki, e.countColumn = xe, e.findColumn = gi, e.isWordChar = mi, e.Pass = Nr, e.signal = U, e.Line = St, e.changeEnd = Qe, e.scrollbarModel = Pl, e.Pos = y, e.cmpPos = D, e.modes = Mi, e.mimeModes = Ct, e.resolveMode = Hr, e.getMode = Di, e.modeExtensions = wt, e.extendMode = sa, e.copyState = lt, e.startState = Gn, e.innerMode = Ni, e.commands = br, e.keyMap = ze, e.keyName = wo, e.isModifierKey = xo, e.lookupKey = Et, e.normalizeKeyMap = Ps, e.StringStream = K, e.SharedTextMarker = gr, e.TextMarker = je, e.LineWidget = vr, e.e_preventDefault = ae, e.e_stopPropagation = Bn, e.e_stop = Qt, e.addClass = it, e.contains = Ke, e.rmClass = tt, e.keyNames = Ve;
      }
      u(ou, "addLegacyProps"), js(R), tu(R);
      var au = "iter insert remove copy getEditor constructor".split(" ");
      for (var hi in ue.prototype)
        ue.prototype.hasOwnProperty(hi) && ee(au, hi) < 0 && (R.prototype[hi] = function(e) {
          return function() {
            return e.apply(this.doc, arguments);
          };
        }(ue.prototype[hi]));
      return xt(ue), R.inputStyles = { textarea: G, contenteditable: P }, R.defineMode = function(e) {
        !R.defaults.mode && e != "null" && (R.defaults.mode = e), oa.apply(this, arguments);
      }, R.defineMIME = aa, R.defineMode("null", function() {
        return { token: function(e) {
          return e.skipToEnd();
        } };
      }), R.defineMIME("text/plain", "null"), R.defineExtension = function(e, t) {
        R.prototype[e] = t;
      }, R.defineDocExtension = function(e, t) {
        ue.prototype[e] = t;
      }, R.fromTextArea = lu, ou(R), R.version = "5.65.3", R;
    });
  }(Mn)), Mn.exports;
}
u(cu, "requireCodemirror");

//# sourceMappingURL=codemirror.es2.js.map


/***/ })

};
;
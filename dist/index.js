var mr = Object.defineProperty;
var br = (a, n, o) => n in a ? mr(a, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : a[n] = o;
var $ = (a, n, o) => br(a, typeof n != "symbol" ? n + "" : n, o);
import je, { createContext as wr, useMemo as Er, useContext as _r, useRef as ee, useEffect as kr } from "react";
var re = { exports: {} }, V = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pe;
function Sr() {
  if (Pe) return V;
  Pe = 1;
  var a = je, n = Symbol.for("react.element"), o = Symbol.for("react.fragment"), l = Object.prototype.hasOwnProperty, d = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function m(y, g, E) {
    var v, k = {}, O = null, I = null;
    E !== void 0 && (O = "" + E), g.key !== void 0 && (O = "" + g.key), g.ref !== void 0 && (I = g.ref);
    for (v in g) l.call(g, v) && !R.hasOwnProperty(v) && (k[v] = g[v]);
    if (y && y.defaultProps) for (v in g = y.defaultProps, g) k[v] === void 0 && (k[v] = g[v]);
    return { $$typeof: n, type: y, key: O, ref: I, props: k, _owner: d.current };
  }
  return V.Fragment = o, V.jsx = m, V.jsxs = m, V;
}
var Y = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xe;
function Tr() {
  return xe || (xe = 1, process.env.NODE_ENV !== "production" && function() {
    var a = je, n = Symbol.for("react.element"), o = Symbol.for("react.portal"), l = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), m = Symbol.for("react.provider"), y = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), E = Symbol.for("react.suspense"), v = Symbol.for("react.suspense_list"), k = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), I = Symbol.for("react.offscreen"), ne = Symbol.iterator, $e = "@@iterator";
    function Ae(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = ne && e[ne] || e[$e];
      return typeof r == "function" ? r : null;
    }
    var F = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function b(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
          t[i - 1] = arguments[i];
        We("error", e, t);
      }
    }
    function We(e, r, t) {
      {
        var i = F.ReactDebugCurrentFrame, c = i.getStackAddendum();
        c !== "" && (r += "%s", t = t.concat([c]));
        var f = t.map(function(s) {
          return String(s);
        });
        f.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, f);
      }
    }
    var Ve = !1, Ye = !1, He = !1, Me = !1, Le = !1, ae;
    ae = Symbol.for("react.module.reference");
    function Be(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === l || e === R || Le || e === d || e === E || e === v || Me || e === I || Ve || Ye || He || typeof e == "object" && e !== null && (e.$$typeof === O || e.$$typeof === k || e.$$typeof === m || e.$$typeof === y || e.$$typeof === g || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ae || e.getModuleId !== void 0));
    }
    function Ue(e, r, t) {
      var i = e.displayName;
      if (i)
        return i;
      var c = r.displayName || r.name || "";
      return c !== "" ? t + "(" + c + ")" : t;
    }
    function oe(e) {
      return e.displayName || "Context";
    }
    function C(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && b("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case l:
          return "Fragment";
        case o:
          return "Portal";
        case R:
          return "Profiler";
        case d:
          return "StrictMode";
        case E:
          return "Suspense";
        case v:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case y:
            var r = e;
            return oe(r) + ".Consumer";
          case m:
            var t = e;
            return oe(t._context) + ".Provider";
          case g:
            return Ue(e, e.render, "ForwardRef");
          case k:
            var i = e.displayName || null;
            return i !== null ? i : C(e.type) || "Memo";
          case O: {
            var c = e, f = c._payload, s = c._init;
            try {
              return C(s(f));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var P = Object.assign, A = 0, ie, ue, se, ce, le, fe, ve;
    function de() {
    }
    de.__reactDisabledLog = !0;
    function qe() {
      {
        if (A === 0) {
          ie = console.log, ue = console.info, se = console.warn, ce = console.error, le = console.group, fe = console.groupCollapsed, ve = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: de,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        A++;
      }
    }
    function Ke() {
      {
        if (A--, A === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: P({}, e, {
              value: ie
            }),
            info: P({}, e, {
              value: ue
            }),
            warn: P({}, e, {
              value: se
            }),
            error: P({}, e, {
              value: ce
            }),
            group: P({}, e, {
              value: le
            }),
            groupCollapsed: P({}, e, {
              value: fe
            }),
            groupEnd: P({}, e, {
              value: ve
            })
          });
        }
        A < 0 && b("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var q = F.ReactCurrentDispatcher, K;
    function H(e, r, t) {
      {
        if (K === void 0)
          try {
            throw Error();
          } catch (c) {
            var i = c.stack.trim().match(/\n( *(at )?)/);
            K = i && i[1] || "";
          }
        return `
` + K + e;
      }
    }
    var J = !1, M;
    {
      var Je = typeof WeakMap == "function" ? WeakMap : Map;
      M = new Je();
    }
    function ge(e, r) {
      if (!e || J)
        return "";
      {
        var t = M.get(e);
        if (t !== void 0)
          return t;
      }
      var i;
      J = !0;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var f;
      f = q.current, q.current = null, qe();
      try {
        if (r) {
          var s = function() {
            throw Error();
          };
          if (Object.defineProperty(s.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(s, []);
            } catch (_) {
              i = _;
            }
            Reflect.construct(e, [], s);
          } else {
            try {
              s.call();
            } catch (_) {
              i = _;
            }
            e.call(s.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (_) {
            i = _;
          }
          e();
        }
      } catch (_) {
        if (_ && i && typeof _.stack == "string") {
          for (var u = _.stack.split(`
`), w = i.stack.split(`
`), h = u.length - 1, p = w.length - 1; h >= 1 && p >= 0 && u[h] !== w[p]; )
            p--;
          for (; h >= 1 && p >= 0; h--, p--)
            if (u[h] !== w[p]) {
              if (h !== 1 || p !== 1)
                do
                  if (h--, p--, p < 0 || u[h] !== w[p]) {
                    var S = `
` + u[h].replace(" at new ", " at ");
                    return e.displayName && S.includes("<anonymous>") && (S = S.replace("<anonymous>", e.displayName)), typeof e == "function" && M.set(e, S), S;
                  }
                while (h >= 1 && p >= 0);
              break;
            }
        }
      } finally {
        J = !1, q.current = f, Ke(), Error.prepareStackTrace = c;
      }
      var D = e ? e.displayName || e.name : "", x = D ? H(D) : "";
      return typeof e == "function" && M.set(e, x), x;
    }
    function Ge(e, r, t) {
      return ge(e, !1);
    }
    function ze(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function L(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ge(e, ze(e));
      if (typeof e == "string")
        return H(e);
      switch (e) {
        case E:
          return H("Suspense");
        case v:
          return H("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case g:
            return Ge(e.render);
          case k:
            return L(e.type, r, t);
          case O: {
            var i = e, c = i._payload, f = i._init;
            try {
              return L(f(c), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var W = Object.prototype.hasOwnProperty, he = {}, pe = F.ReactDebugCurrentFrame;
    function B(e) {
      if (e) {
        var r = e._owner, t = L(e.type, e._source, r ? r.type : null);
        pe.setExtraStackFrame(t);
      } else
        pe.setExtraStackFrame(null);
    }
    function Xe(e, r, t, i, c) {
      {
        var f = Function.call.bind(W);
        for (var s in e)
          if (f(e, s)) {
            var u = void 0;
            try {
              if (typeof e[s] != "function") {
                var w = Error((i || "React class") + ": " + t + " type `" + s + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[s] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw w.name = "Invariant Violation", w;
              }
              u = e[s](r, s, i, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (h) {
              u = h;
            }
            u && !(u instanceof Error) && (B(c), b("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", t, s, typeof u), B(null)), u instanceof Error && !(u.message in he) && (he[u.message] = !0, B(c), b("Failed %s type: %s", t, u.message), B(null));
          }
      }
    }
    var Ze = Array.isArray;
    function G(e) {
      return Ze(e);
    }
    function Qe(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function er(e) {
      try {
        return ye(e), !1;
      } catch {
        return !0;
      }
    }
    function ye(e) {
      return "" + e;
    }
    function Re(e) {
      if (er(e))
        return b("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Qe(e)), ye(e);
    }
    var me = F.ReactCurrentOwner, rr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, be, we;
    function tr(e) {
      if (W.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function nr(e) {
      if (W.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function ar(e, r) {
      typeof e.ref == "string" && me.current;
    }
    function or(e, r) {
      {
        var t = function() {
          be || (be = !0, b("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function ir(e, r) {
      {
        var t = function() {
          we || (we = !0, b("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var ur = function(e, r, t, i, c, f, s) {
      var u = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: n,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: s,
        // Record the component responsible for creating this element.
        _owner: f
      };
      return u._store = {}, Object.defineProperty(u._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(u, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: i
      }), Object.defineProperty(u, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.freeze && (Object.freeze(u.props), Object.freeze(u)), u;
    };
    function sr(e, r, t, i, c) {
      {
        var f, s = {}, u = null, w = null;
        t !== void 0 && (Re(t), u = "" + t), nr(r) && (Re(r.key), u = "" + r.key), tr(r) && (w = r.ref, ar(r, c));
        for (f in r)
          W.call(r, f) && !rr.hasOwnProperty(f) && (s[f] = r[f]);
        if (e && e.defaultProps) {
          var h = e.defaultProps;
          for (f in h)
            s[f] === void 0 && (s[f] = h[f]);
        }
        if (u || w) {
          var p = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          u && or(s, p), w && ir(s, p);
        }
        return ur(e, u, w, c, i, me.current, s);
      }
    }
    var z = F.ReactCurrentOwner, Ee = F.ReactDebugCurrentFrame;
    function N(e) {
      if (e) {
        var r = e._owner, t = L(e.type, e._source, r ? r.type : null);
        Ee.setExtraStackFrame(t);
      } else
        Ee.setExtraStackFrame(null);
    }
    var X;
    X = !1;
    function Z(e) {
      return typeof e == "object" && e !== null && e.$$typeof === n;
    }
    function _e() {
      {
        if (z.current) {
          var e = C(z.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function cr(e) {
      return "";
    }
    var ke = {};
    function lr(e) {
      {
        var r = _e();
        if (!r) {
          var t = typeof e == "string" ? e : e.displayName || e.name;
          t && (r = `

Check the top-level render call using <` + t + ">.");
        }
        return r;
      }
    }
    function Se(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = lr(r);
        if (ke[t])
          return;
        ke[t] = !0;
        var i = "";
        e && e._owner && e._owner !== z.current && (i = " It was passed a child from " + C(e._owner.type) + "."), N(e), b('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, i), N(null);
      }
    }
    function Te(e, r) {
      {
        if (typeof e != "object")
          return;
        if (G(e))
          for (var t = 0; t < e.length; t++) {
            var i = e[t];
            Z(i) && Se(i, r);
          }
        else if (Z(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var c = Ae(e);
          if (typeof c == "function" && c !== e.entries)
            for (var f = c.call(e), s; !(s = f.next()).done; )
              Z(s.value) && Se(s.value, r);
        }
      }
    }
    function fr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === g || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === k))
          t = r.propTypes;
        else
          return;
        if (t) {
          var i = C(r);
          Xe(t, e.props, "prop", i, e);
        } else if (r.PropTypes !== void 0 && !X) {
          X = !0;
          var c = C(r);
          b("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", c || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && b("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function vr(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var i = r[t];
          if (i !== "children" && i !== "key") {
            N(e), b("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", i), N(null);
            break;
          }
        }
        e.ref !== null && (N(e), b("Invalid attribute `ref` supplied to `React.Fragment`."), N(null));
      }
    }
    var Oe = {};
    function Ce(e, r, t, i, c, f) {
      {
        var s = Be(e);
        if (!s) {
          var u = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (u += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var w = cr();
          w ? u += w : u += _e();
          var h;
          e === null ? h = "null" : G(e) ? h = "array" : e !== void 0 && e.$$typeof === n ? (h = "<" + (C(e.type) || "Unknown") + " />", u = " Did you accidentally export a JSX literal instead of a component?") : h = typeof e, b("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", h, u);
        }
        var p = sr(e, r, t, c, f);
        if (p == null)
          return p;
        if (s) {
          var S = r.children;
          if (S !== void 0)
            if (i)
              if (G(S)) {
                for (var D = 0; D < S.length; D++)
                  Te(S[D], e);
                Object.freeze && Object.freeze(S);
              } else
                b("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Te(S, e);
        }
        if (W.call(r, "key")) {
          var x = C(e), _ = Object.keys(r).filter(function(Rr) {
            return Rr !== "key";
          }), Q = _.length > 0 ? "{key: someKey, " + _.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Oe[x + Q]) {
            var yr = _.length > 0 ? "{" + _.join(": ..., ") + ": ...}" : "{}";
            b(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Q, x, yr, x), Oe[x + Q] = !0;
          }
        }
        return e === l ? vr(p) : fr(p), p;
      }
    }
    function dr(e, r, t) {
      return Ce(e, r, t, !0);
    }
    function gr(e, r, t) {
      return Ce(e, r, t, !1);
    }
    var hr = gr, pr = dr;
    Y.Fragment = l, Y.jsx = hr, Y.jsxs = pr;
  }()), Y;
}
process.env.NODE_ENV === "production" ? re.exports = Sr() : re.exports = Tr();
var Ie = re.exports;
class T extends Error {
  constructor(o, l = "HOOK_INJECTION_ERROR", d) {
    super(o);
    $(this, "code");
    $(this, "details");
    this.name = "HookInjectionError", this.code = l, this.details = d, Error.captureStackTrace && Error.captureStackTrace(this, T);
  }
  /**
   * Create error for when hook is not set
   */
  static hookNotSet(o = "hook") {
    return new T(
      `${o} has not been injected yet. Make sure to wrap your component tree with the appropriate provider.`,
      "HOOK_NOT_SET"
    );
  }
  /**
   * Create error for invalid hook
   */
  static invalidHook(o = "hook", l) {
    const d = l ? `Invalid ${o}. Expected ${l}.` : `Invalid ${o} provided.`;
    return new T(d, "INVALID_HOOK");
  }
  /**
   * Create error for provider not found
   */
  static providerNotFound() {
    return new T(
      "HookInjectionProvider not found in component tree. Make sure to wrap your app with HookInjectionProvider.",
      "PROVIDER_NOT_FOUND"
    );
  }
  /**
   * Create error for timeout
   */
  static timeout(o, l) {
    return new T(
      `Operation '${o}' timed out after ${l}ms.`,
      "TIMEOUT"
    );
  }
}
const Fe = wr(null), jr = ({
  children: a,
  navigationHook: n,
  customHooks: o = {}
}) => {
  const l = n == null ? void 0 : n(), d = Er(() => ({
    navigate: l,
    ...o
  }), [l, o]);
  return /* @__PURE__ */ Ie.jsx(Fe.Provider, { value: d, children: a });
}, U = () => {
  const a = _r(Fe);
  if (a === null)
    throw T.providerNotFound();
  return a;
};
function Or(a, n = {}) {
  const { autoInject: o = !0, onReady: l, onError: d } = n, R = U(), m = ee(a), y = ee(l), g = ee(d);
  m.current = a, y.current = l, g.current = d, kr(() => {
    var E, v, k, O;
    if (!(!o || !R.navigate)) {
      try {
        (v = (E = m.current).setNavigate) == null || v.call(E, R.navigate), (k = y.current) == null || k.call(y);
      } catch (I) {
        (O = g.current) == null || O.call(g, I);
      }
      return () => {
        m.current.reset && m.current.reset();
      };
    }
  }, [R.navigate, o]);
}
function Ir() {
  return U().navigate;
}
function Fr(a) {
  return U()[a];
}
function Nr() {
  return U();
}
function Dr(a = {}) {
  const {
    enableWarnings: n = !0,
    fallbackBehavior: o = "warn",
    timeout: l = 5e3,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    initialValue: d = null,
    validator: R
  } = a;
  let m = d, y = !!d;
  return console.log("Creating HookInjectionService with options:", {
    enableWarnings: n,
    fallbackBehavior: o,
    timeout: l,
    initialValue: d,
    validator: R
  }), {
    setHook(E) {
      if (R && !R(E)) {
        const v = T.invalidHook("hook", "valid hook function");
        if (o === "error")
          throw v;
        o === "warn" && n && console.warn(v.message);
        return;
      }
      m = E, y = !0;
    },
    getHook() {
      return m;
    },
    isReady() {
      return y;
    },
    execute(E) {
      if (!y || !m) {
        const v = T.hookNotSet();
        if (o === "error")
          throw v;
        return o === "warn" && n && console.warn(v.message), null;
      }
      try {
        return E(m);
      } catch (v) {
        return n && console.error("Error executing hook callback:", v), null;
      }
    }
  };
}
class Ne {
  constructor(n = {}) {
    $(this, "navigateFn", null);
    $(this, "config");
    $(this, "isNavigationReady", !1);
    this.config = {
      enableWarnings: !0,
      fallbackBehavior: "warn",
      timeout: 5e3,
      ...n
    };
  }
  /**
   * Set the navigation function (typically from useNavigate hook)
   */
  setNavigate(n) {
    if (typeof n != "function") {
      const o = T.invalidHook("navigation function", "function");
      if (this.config.fallbackBehavior === "error")
        throw o;
      this.config.fallbackBehavior === "warn" && this.config.enableWarnings && console.warn(o.message);
      return;
    }
    this.navigateFn = n, this.isNavigationReady = !0;
  }
  /**
   * Navigate to a specific path
   */
  navigate(n, o) {
    if (!this.isNavigationReady || !this.navigateFn) {
      this.handleNavigationError("navigate");
      return;
    }
    try {
      this.navigateFn(n, o);
    } catch (l) {
      this.config.enableWarnings && console.error("Navigation error:", l);
    }
  }
  /**
   * Navigate to login page (convenience method)
   */
  navigateToLogin(n = "/login") {
    this.navigate(n);
  }
  /**
   * Navigate to home page (convenience method)
   */
  navigateToHome(n = "/") {
    this.navigate(n);
  }
  /**
   * Navigate to error page (convenience method)
   */
  navigateToError(n = "/error", o) {
    this.navigate(n, { state: o });
  }
  /**
   * Replace current route (if supported by the router)
   */
  replace(n, o) {
    this.navigate(n, { ...o, replace: !0 });
  }
  /**
   * Go back in history (browser navigation)
   */
  goBack() {
    typeof window < "u" && window.history ? window.history.back() : this.config.enableWarnings && console.warn("Browser navigation not available");
  }
  /**
   * Go forward in history (browser navigation)
   */
  goForward() {
    typeof window < "u" && window.history ? window.history.forward() : this.config.enableWarnings && console.warn("Browser navigation not available");
  }
  /**
   * Check if navigation is ready
   */
  isReady() {
    return this.isNavigationReady;
  }
  /**
   * Wait for navigation to be ready
   */
  async waitForReady() {
    return this.isReady() ? Promise.resolve() : new Promise((n, o) => {
      let d = 0;
      const R = setInterval(() => {
        if (this.isReady()) {
          clearInterval(R), n();
          return;
        }
        d += 50, d >= this.config.timeout && (clearInterval(R), o(T.timeout("waitForReady", this.config.timeout)));
      }, 50);
    });
  }
  /**
   * Execute a callback with the navigation function
   */
  executeWithNavigation(n) {
    if (!this.isNavigationReady || !this.navigateFn)
      return this.handleNavigationError("executeWithNavigation"), null;
    try {
      return n(this.navigateFn);
    } catch (o) {
      return this.config.enableWarnings && console.error("Error executing navigation callback:", o), null;
    }
  }
  /**
   * Reset the navigation service
   */
  reset() {
    this.navigateFn = null, this.isNavigationReady = !1;
  }
  /**
   * Handle navigation errors based on configuration
   */
  handleNavigationError(n) {
    const o = T.hookNotSet("navigation function");
    if (this.config.fallbackBehavior === "error")
      throw o;
    this.config.fallbackBehavior === "warn" && this.config.enableWarnings && console.warn(`${n}: ${o.message}`);
  }
}
function $r(a = {}) {
  return new Ne(a);
}
let j = null;
function Ar(a = {}) {
  return j || (j = new Ne(a)), j;
}
function Wr() {
  return j;
}
function Vr() {
  j && j.reset(), j = null;
}
function Yr(a, n, o) {
  const l = (d) => (Or(n, o), /* @__PURE__ */ Ie.jsx(a, { ...d }));
  return l.displayName = `withHookInjection(${a.displayName || a.name})`, l;
}
function Hr() {
  try {
    if (typeof require < "u") {
      const a = require("react");
      return te(a.version);
    }
    return typeof window < "u" && window.React ? te(window.React.version) : !0;
  } catch {
    return !0;
  }
}
function te(a) {
  if (!a) return !0;
  try {
    const [n, o] = a.split(".").map(Number);
    return n > 16 || n === 16 && o >= 8;
  } catch {
    return !0;
  }
}
function Cr() {
  try {
    return typeof require < "u" ? require("react").version || "unknown" : typeof window < "u" && window.React && window.React.version || "unknown";
  } catch {
    return "unknown";
  }
}
function De() {
  const a = Cr(), n = te(a);
  return {
    version: a,
    isSupported: n,
    hasHooks: n,
    minimumVersion: "16.8.0",
    recommendations: n ? ["✅ Your React version is fully supported"] : ["❌ Please upgrade to React 16.8.0 or higher to use hooks"]
  };
}
function Mr() {
  const a = De();
  console.group("🎯 React Hook Injection Pattern - Compatibility Check"), console.log(`React Version: ${a.version}`), console.log(`Hooks Supported: ${a.hasHooks ? "✅" : "❌"}`), console.log(`Minimum Required: ${a.minimumVersion}`), a.recommendations.forEach((n) => console.log(n)), a.isSupported || console.warn("⚠️  React version is too old. Please upgrade to use this library."), console.groupEnd();
}
function Lr() {
  const a = De();
  if (!a.isSupported)
    throw new Error(
      `React Hook Injection Pattern requires React ${a.minimumVersion} or higher. Current version: ${a.version}. Please upgrade React to use this library.`
    );
}
export {
  T as HookInjectionError,
  jr as HookInjectionProvider,
  Ne as NavigationService,
  Lr as assertReactCompatibility,
  te as checkReactVersion,
  Dr as createHookInjectionService,
  $r as createNavigationService,
  Ar as createSingletonNavigationService,
  De as getCompatibilityInfo,
  Cr as getReactVersion,
  Wr as getSingletonNavigationService,
  Hr as isReactVersionSupported,
  Mr as logCompatibilityInfo,
  Vr as resetSingletonNavigationService,
  Nr as useAllInjectedHooks,
  Fr as useCustomHook,
  Or as useHookInjection,
  Ir as useNavigationFromContext,
  Yr as withHookInjection
};
//# sourceMappingURL=index.js.map

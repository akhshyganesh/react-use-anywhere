var yr = Object.defineProperty;
var br = (s, n, a) => n in s ? yr(s, n, { enumerable: !0, configurable: !0, writable: !0, value: a }) : s[n] = a;
var A = (s, n, a) => br(s, typeof n != "symbol" ? n + "" : n, a);
import Ce, { createContext as Rr, useMemo as Er, useContext as mr, useRef as ee, useEffect as _r } from "react";
var re = { exports: {} }, Y = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xe;
function wr() {
  if (xe) return Y;
  xe = 1;
  var s = Ce, n = Symbol.for("react.element"), a = Symbol.for("react.fragment"), f = Object.prototype.hasOwnProperty, d = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, m = { key: !0, ref: !0, __self: !0, __source: !0 };
  function b(y, g, _) {
    var v, T = {}, S = null, F = null;
    _ !== void 0 && (S = "" + _), g.key !== void 0 && (S = "" + g.key), g.ref !== void 0 && (F = g.ref);
    for (v in g) f.call(g, v) && !m.hasOwnProperty(v) && (T[v] = g[v]);
    if (y && y.defaultProps) for (v in g = y.defaultProps, g) T[v] === void 0 && (T[v] = g[v]);
    return { $$typeof: n, type: y, key: S, ref: F, props: T, _owner: d.current };
  }
  return Y.Fragment = a, Y.jsx = b, Y.jsxs = b, Y;
}
var V = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pe;
function Tr() {
  return Pe || (Pe = 1, process.env.NODE_ENV !== "production" && function() {
    var s = Ce, n = Symbol.for("react.element"), a = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), d = Symbol.for("react.strict_mode"), m = Symbol.for("react.profiler"), b = Symbol.for("react.provider"), y = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), v = Symbol.for("react.suspense_list"), T = Symbol.for("react.memo"), S = Symbol.for("react.lazy"), F = Symbol.for("react.offscreen"), te = Symbol.iterator, Ne = "@@iterator";
    function De(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = te && e[te] || e[Ne];
      return typeof r == "function" ? r : null;
    }
    var I = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function R(e) {
      {
        for (var r = arguments.length, t = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
          t[i - 1] = arguments[i];
        Ae("error", e, t);
      }
    }
    function Ae(e, r, t) {
      {
        var i = I.ReactDebugCurrentFrame, c = i.getStackAddendum();
        c !== "" && (r += "%s", t = t.concat([c]));
        var l = t.map(function(u) {
          return String(u);
        });
        l.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, l);
      }
    }
    var We = !1, $e = !1, Ye = !1, Ve = !1, Me = !1, ne;
    ne = Symbol.for("react.module.reference");
    function Le(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === f || e === m || Me || e === d || e === _ || e === v || Ve || e === F || We || $e || Ye || typeof e == "object" && e !== null && (e.$$typeof === S || e.$$typeof === T || e.$$typeof === b || e.$$typeof === y || e.$$typeof === g || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ne || e.getModuleId !== void 0));
    }
    function Be(e, r, t) {
      var i = e.displayName;
      if (i)
        return i;
      var c = r.displayName || r.name || "";
      return c !== "" ? t + "(" + c + ")" : t;
    }
    function ae(e) {
      return e.displayName || "Context";
    }
    function x(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && R("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case f:
          return "Fragment";
        case a:
          return "Portal";
        case m:
          return "Profiler";
        case d:
          return "StrictMode";
        case _:
          return "Suspense";
        case v:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case y:
            var r = e;
            return ae(r) + ".Consumer";
          case b:
            var t = e;
            return ae(t._context) + ".Provider";
          case g:
            return Be(e, e.render, "ForwardRef");
          case T:
            var i = e.displayName || null;
            return i !== null ? i : x(e.type) || "Memo";
          case S: {
            var c = e, l = c._payload, u = c._init;
            try {
              return x(u(l));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var P = Object.assign, W = 0, ie, oe, ue, se, ce, le, fe;
    function ve() {
    }
    ve.__reactDisabledLog = !0;
    function Ue() {
      {
        if (W === 0) {
          ie = console.log, oe = console.info, ue = console.warn, se = console.error, ce = console.group, le = console.groupCollapsed, fe = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ve,
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
        W++;
      }
    }
    function He() {
      {
        if (W--, W === 0) {
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
              value: oe
            }),
            warn: P({}, e, {
              value: ue
            }),
            error: P({}, e, {
              value: se
            }),
            group: P({}, e, {
              value: ce
            }),
            groupCollapsed: P({}, e, {
              value: le
            }),
            groupEnd: P({}, e, {
              value: fe
            })
          });
        }
        W < 0 && R("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var K = I.ReactCurrentDispatcher, J;
    function M(e, r, t) {
      {
        if (J === void 0)
          try {
            throw Error();
          } catch (c) {
            var i = c.stack.trim().match(/\n( *(at )?)/);
            J = i && i[1] || "";
          }
        return `
` + J + e;
      }
    }
    var q = !1, L;
    {
      var Ke = typeof WeakMap == "function" ? WeakMap : Map;
      L = new Ke();
    }
    function de(e, r) {
      if (!e || q)
        return "";
      {
        var t = L.get(e);
        if (t !== void 0)
          return t;
      }
      var i;
      q = !0;
      var c = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var l;
      l = K.current, K.current = null, Ue();
      try {
        if (r) {
          var u = function() {
            throw Error();
          };
          if (Object.defineProperty(u.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(u, []);
            } catch (w) {
              i = w;
            }
            Reflect.construct(e, [], u);
          } else {
            try {
              u.call();
            } catch (w) {
              i = w;
            }
            e.call(u.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (w) {
            i = w;
          }
          e();
        }
      } catch (w) {
        if (w && i && typeof w.stack == "string") {
          for (var o = w.stack.split(`
`), E = i.stack.split(`
`), h = o.length - 1, p = E.length - 1; h >= 1 && p >= 0 && o[h] !== E[p]; )
            p--;
          for (; h >= 1 && p >= 0; h--, p--)
            if (o[h] !== E[p]) {
              if (h !== 1 || p !== 1)
                do
                  if (h--, p--, p < 0 || o[h] !== E[p]) {
                    var O = `
` + o[h].replace(" at new ", " at ");
                    return e.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", e.displayName)), typeof e == "function" && L.set(e, O), O;
                  }
                while (h >= 1 && p >= 0);
              break;
            }
        }
      } finally {
        q = !1, K.current = l, He(), Error.prepareStackTrace = c;
      }
      var D = e ? e.displayName || e.name : "", C = D ? M(D) : "";
      return typeof e == "function" && L.set(e, C), C;
    }
    function Je(e, r, t) {
      return de(e, !1);
    }
    function qe(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function B(e, r, t) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return de(e, qe(e));
      if (typeof e == "string")
        return M(e);
      switch (e) {
        case _:
          return M("Suspense");
        case v:
          return M("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case g:
            return Je(e.render);
          case T:
            return B(e.type, r, t);
          case S: {
            var i = e, c = i._payload, l = i._init;
            try {
              return B(l(c), r, t);
            } catch {
            }
          }
        }
      return "";
    }
    var $ = Object.prototype.hasOwnProperty, ge = {}, he = I.ReactDebugCurrentFrame;
    function U(e) {
      if (e) {
        var r = e._owner, t = B(e.type, e._source, r ? r.type : null);
        he.setExtraStackFrame(t);
      } else
        he.setExtraStackFrame(null);
    }
    function Ge(e, r, t, i, c) {
      {
        var l = Function.call.bind($);
        for (var u in e)
          if (l(e, u)) {
            var o = void 0;
            try {
              if (typeof e[u] != "function") {
                var E = Error((i || "React class") + ": " + t + " type `" + u + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[u] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw E.name = "Invariant Violation", E;
              }
              o = e[u](r, u, i, t, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (h) {
              o = h;
            }
            o && !(o instanceof Error) && (U(c), R("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", t, u, typeof o), U(null)), o instanceof Error && !(o.message in ge) && (ge[o.message] = !0, U(c), R("Failed %s type: %s", t, o.message), U(null));
          }
      }
    }
    var ze = Array.isArray;
    function G(e) {
      return ze(e);
    }
    function Xe(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, t = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t;
      }
    }
    function Ze(e) {
      try {
        return pe(e), !1;
      } catch {
        return !0;
      }
    }
    function pe(e) {
      return "" + e;
    }
    function ye(e) {
      if (Ze(e))
        return R("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Xe(e)), pe(e);
    }
    var be = I.ReactCurrentOwner, Qe = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Re, Ee;
    function er(e) {
      if ($.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function rr(e) {
      if ($.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function tr(e, r) {
      typeof e.ref == "string" && be.current;
    }
    function nr(e, r) {
      {
        var t = function() {
          Re || (Re = !0, R("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: t,
          configurable: !0
        });
      }
    }
    function ar(e, r) {
      {
        var t = function() {
          Ee || (Ee = !0, R("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        t.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: t,
          configurable: !0
        });
      }
    }
    var ir = function(e, r, t, i, c, l, u) {
      var o = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: n,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: t,
        props: u,
        // Record the component responsible for creating this element.
        _owner: l
      };
      return o._store = {}, Object.defineProperty(o._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(o, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: i
      }), Object.defineProperty(o, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: c
      }), Object.freeze && (Object.freeze(o.props), Object.freeze(o)), o;
    };
    function or(e, r, t, i, c) {
      {
        var l, u = {}, o = null, E = null;
        t !== void 0 && (ye(t), o = "" + t), rr(r) && (ye(r.key), o = "" + r.key), er(r) && (E = r.ref, tr(r, c));
        for (l in r)
          $.call(r, l) && !Qe.hasOwnProperty(l) && (u[l] = r[l]);
        if (e && e.defaultProps) {
          var h = e.defaultProps;
          for (l in h)
            u[l] === void 0 && (u[l] = h[l]);
        }
        if (o || E) {
          var p = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          o && nr(u, p), E && ar(u, p);
        }
        return ir(e, o, E, c, i, be.current, u);
      }
    }
    var z = I.ReactCurrentOwner, me = I.ReactDebugCurrentFrame;
    function N(e) {
      if (e) {
        var r = e._owner, t = B(e.type, e._source, r ? r.type : null);
        me.setExtraStackFrame(t);
      } else
        me.setExtraStackFrame(null);
    }
    var X;
    X = !1;
    function Z(e) {
      return typeof e == "object" && e !== null && e.$$typeof === n;
    }
    function _e() {
      {
        if (z.current) {
          var e = x(z.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function ur(e) {
      return "";
    }
    var we = {};
    function sr(e) {
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
    function Te(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var t = sr(r);
        if (we[t])
          return;
        we[t] = !0;
        var i = "";
        e && e._owner && e._owner !== z.current && (i = " It was passed a child from " + x(e._owner.type) + "."), N(e), R('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', t, i), N(null);
      }
    }
    function Oe(e, r) {
      {
        if (typeof e != "object")
          return;
        if (G(e))
          for (var t = 0; t < e.length; t++) {
            var i = e[t];
            Z(i) && Te(i, r);
          }
        else if (Z(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var c = De(e);
          if (typeof c == "function" && c !== e.entries)
            for (var l = c.call(e), u; !(u = l.next()).done; )
              Z(u.value) && Te(u.value, r);
        }
      }
    }
    function cr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var t;
        if (typeof r == "function")
          t = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === g || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === T))
          t = r.propTypes;
        else
          return;
        if (t) {
          var i = x(r);
          Ge(t, e.props, "prop", i, e);
        } else if (r.PropTypes !== void 0 && !X) {
          X = !0;
          var c = x(r);
          R("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", c || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && R("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function lr(e) {
      {
        for (var r = Object.keys(e.props), t = 0; t < r.length; t++) {
          var i = r[t];
          if (i !== "children" && i !== "key") {
            N(e), R("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", i), N(null);
            break;
          }
        }
        e.ref !== null && (N(e), R("Invalid attribute `ref` supplied to `React.Fragment`."), N(null));
      }
    }
    var ke = {};
    function Se(e, r, t, i, c, l) {
      {
        var u = Le(e);
        if (!u) {
          var o = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (o += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var E = ur();
          E ? o += E : o += _e();
          var h;
          e === null ? h = "null" : G(e) ? h = "array" : e !== void 0 && e.$$typeof === n ? (h = "<" + (x(e.type) || "Unknown") + " />", o = " Did you accidentally export a JSX literal instead of a component?") : h = typeof e, R("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", h, o);
        }
        var p = or(e, r, t, c, l);
        if (p == null)
          return p;
        if (u) {
          var O = r.children;
          if (O !== void 0)
            if (i)
              if (G(O)) {
                for (var D = 0; D < O.length; D++)
                  Oe(O[D], e);
                Object.freeze && Object.freeze(O);
              } else
                R("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Oe(O, e);
        }
        if ($.call(r, "key")) {
          var C = x(e), w = Object.keys(r).filter(function(pr) {
            return pr !== "key";
          }), Q = w.length > 0 ? "{key: someKey, " + w.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!ke[C + Q]) {
            var hr = w.length > 0 ? "{" + w.join(": ..., ") + ": ...}" : "{}";
            R(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Q, C, hr, C), ke[C + Q] = !0;
          }
        }
        return e === f ? lr(p) : cr(p), p;
      }
    }
    function fr(e, r, t) {
      return Se(e, r, t, !0);
    }
    function vr(e, r, t) {
      return Se(e, r, t, !1);
    }
    var dr = vr, gr = fr;
    V.Fragment = f, V.jsx = dr, V.jsxs = gr;
  }()), V;
}
process.env.NODE_ENV === "production" ? re.exports = wr() : re.exports = Tr();
var je = re.exports;
class k extends Error {
  constructor(a, f = "HOOK_INJECTION_ERROR", d) {
    super(a);
    A(this, "code");
    A(this, "details");
    this.name = "HookInjectionError", this.code = f, this.details = d, Error.captureStackTrace && Error.captureStackTrace(this, k);
  }
  /**
   * Create error for when hook is not set
   */
  static hookNotSet(a = "hook") {
    return new k(
      `${a} has not been injected yet. Make sure to wrap your component tree with the appropriate provider.`,
      "HOOK_NOT_SET"
    );
  }
  /**
   * Create error for invalid hook
   */
  static invalidHook(a = "hook", f) {
    const d = f ? `Invalid ${a}. Expected ${f}.` : `Invalid ${a} provided.`;
    return new k(d, "INVALID_HOOK");
  }
  /**
   * Create error for provider not found
   */
  static providerNotFound() {
    return new k(
      "HookInjectionProvider not found in component tree. Make sure to wrap your app with HookInjectionProvider.",
      "PROVIDER_NOT_FOUND"
    );
  }
  /**
   * Create error for timeout
   */
  static timeout(a, f) {
    return new k(
      `Operation '${a}' timed out after ${f}ms.`,
      "TIMEOUT"
    );
  }
}
const Fe = Rr(null), xr = ({
  children: s,
  navigationHook: n,
  customHooks: a = {}
}) => {
  const f = n == null ? void 0 : n(), d = Er(() => ({
    navigate: f,
    ...a
  }), [f, a]);
  return /* @__PURE__ */ je.jsx(Fe.Provider, { value: d, children: s });
}, H = () => {
  const s = mr(Fe);
  if (s === null)
    throw k.providerNotFound();
  return s;
};
function Or(s, n = {}) {
  const { autoInject: a = !0, onReady: f, onError: d } = n, m = H(), b = ee(s), y = ee(f), g = ee(d);
  b.current = s, y.current = f, g.current = d, _r(() => {
    var _, v, T, S;
    if (!(!a || !m.navigate)) {
      try {
        (v = (_ = b.current).setNavigate) == null || v.call(_, m.navigate), (T = y.current) == null || T.call(y);
      } catch (F) {
        (S = g.current) == null || S.call(g, F);
      }
      return () => {
        b.current.reset && b.current.reset();
      };
    }
  }, [m.navigate, a]);
}
function Pr() {
  return H().navigate;
}
function Cr(s) {
  return H()[s];
}
function jr() {
  return H();
}
function Fr(s = {}) {
  const {
    enableWarnings: n = !0,
    fallbackBehavior: a = "warn",
    timeout: f = 5e3,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    initialValue: d = null,
    validator: m
  } = s;
  let b = d, y = !!d;
  return {
    setHook(_) {
      if (m && !m(_)) {
        const v = k.invalidHook("hook", "valid hook function");
        if (a === "error")
          throw v;
        a === "warn" && n && console.warn(v.message);
        return;
      }
      b = _, y = !0;
    },
    getHook() {
      return b;
    },
    isReady() {
      return y;
    },
    execute(_) {
      if (!y || !b) {
        const v = k.hookNotSet();
        if (a === "error")
          throw v;
        return a === "warn" && n && console.warn(v.message), null;
      }
      try {
        return _(b);
      } catch (v) {
        return n && console.error("Error executing hook callback:", v), null;
      }
    }
  };
}
class Ie {
  constructor(n = {}) {
    A(this, "navigateFn", null);
    A(this, "config");
    A(this, "isNavigationReady", !1);
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
      const a = k.invalidHook("navigation function", "function");
      if (this.config.fallbackBehavior === "error")
        throw a;
      this.config.fallbackBehavior === "warn" && this.config.enableWarnings && console.warn(a.message);
      return;
    }
    this.navigateFn = n, this.isNavigationReady = !0;
  }
  /**
   * Navigate to a specific path
   */
  navigate(n, a) {
    if (!this.isNavigationReady || !this.navigateFn) {
      this.handleNavigationError("navigate");
      return;
    }
    try {
      this.navigateFn(n, a);
    } catch (f) {
      this.config.enableWarnings && console.error("Navigation error:", f);
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
  navigateToError(n = "/error", a) {
    this.navigate(n, { state: a });
  }
  /**
   * Replace current route (if supported by the router)
   */
  replace(n, a) {
    this.navigate(n, { ...a, replace: !0 });
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
    return this.isReady() ? Promise.resolve() : new Promise((n, a) => {
      let d = 0;
      const m = setInterval(() => {
        if (this.isReady()) {
          clearInterval(m), n();
          return;
        }
        d += 50, d >= this.config.timeout && (clearInterval(m), a(k.timeout("waitForReady", this.config.timeout)));
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
    } catch (a) {
      return this.config.enableWarnings && console.error("Error executing navigation callback:", a), null;
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
    const a = k.hookNotSet("navigation function");
    if (this.config.fallbackBehavior === "error")
      throw a;
    this.config.fallbackBehavior === "warn" && this.config.enableWarnings && console.warn(`${n}: ${a.message}`);
  }
}
function Ir(s = {}) {
  return new Ie(s);
}
let j = null;
function Nr(s = {}) {
  return j || (j = new Ie(s)), j;
}
function Dr() {
  return j;
}
function Ar() {
  j && j.reset(), j = null;
}
function Wr(s, n, a) {
  const f = (d) => (Or(n, a), /* @__PURE__ */ je.jsx(s, { ...d }));
  return f.displayName = `withHookInjection(${s.displayName || s.name})`, f;
}
export {
  k as HookInjectionError,
  xr as HookInjectionProvider,
  Ie as NavigationService,
  Fr as createHookInjectionService,
  Ir as createNavigationService,
  Nr as createSingletonNavigationService,
  Dr as getSingletonNavigationService,
  Ar as resetSingletonNavigationService,
  jr as useAllInjectedHooks,
  Cr as useCustomHook,
  Or as useHookInjection,
  Pr as useNavigationFromContext,
  Wr as withHookInjection
};
//# sourceMappingURL=index.js.map

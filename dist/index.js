var kr = Object.defineProperty;
var _r = (n, t, a) => t in n ? kr(n, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : n[t] = a;
var H = (n, t, a) => _r(n, typeof t != "symbol" ? t + "" : t, a);
import $e, { createContext as Sr, useMemo as ae, useContext as Tr, useRef as A, useEffect as De } from "react";
var ie = { exports: {} }, L = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Fe;
function Or() {
  if (Fe) return L;
  Fe = 1;
  var n = $e, t = Symbol.for("react.element"), a = Symbol.for("react.fragment"), s = Object.prototype.hasOwnProperty, l = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(v, d, m) {
    var u, b = {}, E = null, C = null;
    m !== void 0 && (E = "" + m), d.key !== void 0 && (E = "" + d.key), d.ref !== void 0 && (C = d.ref);
    for (u in d) s.call(d, u) && !p.hasOwnProperty(u) && (b[u] = d[u]);
    if (v && v.defaultProps) for (u in d = v.defaultProps, d) b[u] === void 0 && (b[u] = d[u]);
    return { $$typeof: t, type: v, key: E, ref: C, props: b, _owner: l.current };
  }
  return L.Fragment = a, L.jsx = g, L.jsxs = g, L;
}
var B = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ne;
function xr() {
  return Ne || (Ne = 1, process.env.NODE_ENV !== "production" && function() {
    var n = $e, t = Symbol.for("react.element"), a = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), l = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), v = Symbol.for("react.context"), d = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), b = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), C = Symbol.for("react.offscreen"), V = Symbol.iterator, U = "@@iterator";
    function q(e) {
      if (e === null || typeof e != "object")
        return null;
      var r = V && e[V] || e[U];
      return typeof r == "function" ? r : null;
    }
    var O = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function k(e) {
      {
        for (var r = arguments.length, o = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++)
          o[i - 1] = arguments[i];
        Me("error", e, o);
      }
    }
    function Me(e, r, o) {
      {
        var i = O.ReactDebugCurrentFrame, h = i.getStackAddendum();
        h !== "" && (r += "%s", o = o.concat([h]));
        var y = o.map(function(f) {
          return String(f);
        });
        y.unshift("Warning: " + r), Function.prototype.apply.call(console[e], console, y);
      }
    }
    var Le = !1, Be = !1, Ue = !1, qe = !1, Ke = !1, ue;
    ue = Symbol.for("react.module.reference");
    function Je(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === s || e === p || Ke || e === l || e === m || e === u || qe || e === C || Le || Be || Ue || typeof e == "object" && e !== null && (e.$$typeof === E || e.$$typeof === b || e.$$typeof === g || e.$$typeof === v || e.$$typeof === d || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ue || e.getModuleId !== void 0));
    }
    function Ge(e, r, o) {
      var i = e.displayName;
      if (i)
        return i;
      var h = r.displayName || r.name || "";
      return h !== "" ? o + "(" + h + ")" : o;
    }
    function ce(e) {
      return e.displayName || "Context";
    }
    function P(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && k("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case s:
          return "Fragment";
        case a:
          return "Portal";
        case p:
          return "Profiler";
        case l:
          return "StrictMode";
        case m:
          return "Suspense";
        case u:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case v:
            var r = e;
            return ce(r) + ".Consumer";
          case g:
            var o = e;
            return ce(o._context) + ".Provider";
          case d:
            return Ge(e, e.render, "ForwardRef");
          case b:
            var i = e.displayName || null;
            return i !== null ? i : P(e.type) || "Memo";
          case E: {
            var h = e, y = h._payload, f = h._init;
            try {
              return P(f(y));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var I = Object.assign, Y = 0, le, fe, ve, de, ge, he, pe;
    function ye() {
    }
    ye.__reactDisabledLog = !0;
    function ze() {
      {
        if (Y === 0) {
          le = console.log, fe = console.info, ve = console.warn, de = console.error, ge = console.group, he = console.groupCollapsed, pe = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: ye,
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
        Y++;
      }
    }
    function Xe() {
      {
        if (Y--, Y === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: I({}, e, {
              value: le
            }),
            info: I({}, e, {
              value: fe
            }),
            warn: I({}, e, {
              value: ve
            }),
            error: I({}, e, {
              value: de
            }),
            group: I({}, e, {
              value: ge
            }),
            groupCollapsed: I({}, e, {
              value: he
            }),
            groupEnd: I({}, e, {
              value: pe
            })
          });
        }
        Y < 0 && k("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var X = O.ReactCurrentDispatcher, Z;
    function K(e, r, o) {
      {
        if (Z === void 0)
          try {
            throw Error();
          } catch (h) {
            var i = h.stack.trim().match(/\n( *(at )?)/);
            Z = i && i[1] || "";
          }
        return `
` + Z + e;
      }
    }
    var Q = !1, J;
    {
      var Ze = typeof WeakMap == "function" ? WeakMap : Map;
      J = new Ze();
    }
    function me(e, r) {
      if (!e || Q)
        return "";
      {
        var o = J.get(e);
        if (o !== void 0)
          return o;
      }
      var i;
      Q = !0;
      var h = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var y;
      y = X.current, X.current = null, ze();
      try {
        if (r) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (S) {
              i = S;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (S) {
              i = S;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (S) {
            i = S;
          }
          e();
        }
      } catch (S) {
        if (S && i && typeof S.stack == "string") {
          for (var c = S.stack.split(`
`), _ = i.stack.split(`
`), R = c.length - 1, w = _.length - 1; R >= 1 && w >= 0 && c[R] !== _[w]; )
            w--;
          for (; R >= 1 && w >= 0; R--, w--)
            if (c[R] !== _[w]) {
              if (R !== 1 || w !== 1)
                do
                  if (R--, w--, w < 0 || c[R] !== _[w]) {
                    var x = `
` + c[R].replace(" at new ", " at ");
                    return e.displayName && x.includes("<anonymous>") && (x = x.replace("<anonymous>", e.displayName)), typeof e == "function" && J.set(e, x), x;
                  }
                while (R >= 1 && w >= 0);
              break;
            }
        }
      } finally {
        Q = !1, X.current = y, Xe(), Error.prepareStackTrace = h;
      }
      var D = e ? e.displayName || e.name : "", F = D ? K(D) : "";
      return typeof e == "function" && J.set(e, F), F;
    }
    function Qe(e, r, o) {
      return me(e, !1);
    }
    function er(e) {
      var r = e.prototype;
      return !!(r && r.isReactComponent);
    }
    function G(e, r, o) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return me(e, er(e));
      if (typeof e == "string")
        return K(e);
      switch (e) {
        case m:
          return K("Suspense");
        case u:
          return K("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case d:
            return Qe(e.render);
          case b:
            return G(e.type, r, o);
          case E: {
            var i = e, h = i._payload, y = i._init;
            try {
              return G(y(h), r, o);
            } catch {
            }
          }
        }
      return "";
    }
    var M = Object.prototype.hasOwnProperty, Re = {}, we = O.ReactDebugCurrentFrame;
    function z(e) {
      if (e) {
        var r = e._owner, o = G(e.type, e._source, r ? r.type : null);
        we.setExtraStackFrame(o);
      } else
        we.setExtraStackFrame(null);
    }
    function rr(e, r, o, i, h) {
      {
        var y = Function.call.bind(M);
        for (var f in e)
          if (y(e, f)) {
            var c = void 0;
            try {
              if (typeof e[f] != "function") {
                var _ = Error((i || "React class") + ": " + o + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw _.name = "Invariant Violation", _;
              }
              c = e[f](r, f, i, o, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (R) {
              c = R;
            }
            c && !(c instanceof Error) && (z(h), k("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", o, f, typeof c), z(null)), c instanceof Error && !(c.message in Re) && (Re[c.message] = !0, z(h), k("Failed %s type: %s", o, c.message), z(null));
          }
      }
    }
    var tr = Array.isArray;
    function ee(e) {
      return tr(e);
    }
    function nr(e) {
      {
        var r = typeof Symbol == "function" && Symbol.toStringTag, o = r && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return o;
      }
    }
    function or(e) {
      try {
        return be(e), !1;
      } catch {
        return !0;
      }
    }
    function be(e) {
      return "" + e;
    }
    function Ee(e) {
      if (or(e))
        return k("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", nr(e)), be(e);
    }
    var ke = O.ReactCurrentOwner, ar = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, _e, Se;
    function ir(e) {
      if (M.call(e, "ref")) {
        var r = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function sr(e) {
      if (M.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function ur(e, r) {
      typeof e.ref == "string" && ke.current;
    }
    function cr(e, r) {
      {
        var o = function() {
          _e || (_e = !0, k("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: o,
          configurable: !0
        });
      }
    }
    function lr(e, r) {
      {
        var o = function() {
          Se || (Se = !0, k("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", r));
        };
        o.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: o,
          configurable: !0
        });
      }
    }
    var fr = function(e, r, o, i, h, y, f) {
      var c = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: r,
        ref: o,
        props: f,
        // Record the component responsible for creating this element.
        _owner: y
      };
      return c._store = {}, Object.defineProperty(c._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(c, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: i
      }), Object.defineProperty(c, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: h
      }), Object.freeze && (Object.freeze(c.props), Object.freeze(c)), c;
    };
    function vr(e, r, o, i, h) {
      {
        var y, f = {}, c = null, _ = null;
        o !== void 0 && (Ee(o), c = "" + o), sr(r) && (Ee(r.key), c = "" + r.key), ir(r) && (_ = r.ref, ur(r, h));
        for (y in r)
          M.call(r, y) && !ar.hasOwnProperty(y) && (f[y] = r[y]);
        if (e && e.defaultProps) {
          var R = e.defaultProps;
          for (y in R)
            f[y] === void 0 && (f[y] = R[y]);
        }
        if (c || _) {
          var w = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          c && cr(f, w), _ && lr(f, w);
        }
        return fr(e, c, _, h, i, ke.current, f);
      }
    }
    var re = O.ReactCurrentOwner, Te = O.ReactDebugCurrentFrame;
    function $(e) {
      if (e) {
        var r = e._owner, o = G(e.type, e._source, r ? r.type : null);
        Te.setExtraStackFrame(o);
      } else
        Te.setExtraStackFrame(null);
    }
    var te;
    te = !1;
    function ne(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Oe() {
      {
        if (re.current) {
          var e = P(re.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function dr(e) {
      return "";
    }
    var xe = {};
    function gr(e) {
      {
        var r = Oe();
        if (!r) {
          var o = typeof e == "string" ? e : e.displayName || e.name;
          o && (r = `

Check the top-level render call using <` + o + ">.");
        }
        return r;
      }
    }
    function Ce(e, r) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var o = gr(r);
        if (xe[o])
          return;
        xe[o] = !0;
        var i = "";
        e && e._owner && e._owner !== re.current && (i = " It was passed a child from " + P(e._owner.type) + "."), $(e), k('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', o, i), $(null);
      }
    }
    function Pe(e, r) {
      {
        if (typeof e != "object")
          return;
        if (ee(e))
          for (var o = 0; o < e.length; o++) {
            var i = e[o];
            ne(i) && Ce(i, r);
          }
        else if (ne(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var h = q(e);
          if (typeof h == "function" && h !== e.entries)
            for (var y = h.call(e), f; !(f = y.next()).done; )
              ne(f.value) && Ce(f.value, r);
        }
      }
    }
    function hr(e) {
      {
        var r = e.type;
        if (r == null || typeof r == "string")
          return;
        var o;
        if (typeof r == "function")
          o = r.propTypes;
        else if (typeof r == "object" && (r.$$typeof === d || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        r.$$typeof === b))
          o = r.propTypes;
        else
          return;
        if (o) {
          var i = P(r);
          rr(o, e.props, "prop", i, e);
        } else if (r.PropTypes !== void 0 && !te) {
          te = !0;
          var h = P(r);
          k("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", h || "Unknown");
        }
        typeof r.getDefaultProps == "function" && !r.getDefaultProps.isReactClassApproved && k("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function pr(e) {
      {
        for (var r = Object.keys(e.props), o = 0; o < r.length; o++) {
          var i = r[o];
          if (i !== "children" && i !== "key") {
            $(e), k("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", i), $(null);
            break;
          }
        }
        e.ref !== null && ($(e), k("Invalid attribute `ref` supplied to `React.Fragment`."), $(null));
      }
    }
    var je = {};
    function Ie(e, r, o, i, h, y) {
      {
        var f = Je(e);
        if (!f) {
          var c = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (c += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var _ = dr();
          _ ? c += _ : c += Oe();
          var R;
          e === null ? R = "null" : ee(e) ? R = "array" : e !== void 0 && e.$$typeof === t ? (R = "<" + (P(e.type) || "Unknown") + " />", c = " Did you accidentally export a JSX literal instead of a component?") : R = typeof e, k("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", R, c);
        }
        var w = vr(e, r, o, h, y);
        if (w == null)
          return w;
        if (f) {
          var x = r.children;
          if (x !== void 0)
            if (i)
              if (ee(x)) {
                for (var D = 0; D < x.length; D++)
                  Pe(x[D], e);
                Object.freeze && Object.freeze(x);
              } else
                k("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Pe(x, e);
        }
        if (M.call(r, "key")) {
          var F = P(e), S = Object.keys(r).filter(function(Er) {
            return Er !== "key";
          }), oe = S.length > 0 ? "{key: someKey, " + S.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!je[F + oe]) {
            var br = S.length > 0 ? "{" + S.join(": ..., ") + ": ...}" : "{}";
            k(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, oe, F, br, F), je[F + oe] = !0;
          }
        }
        return e === s ? pr(w) : hr(w), w;
      }
    }
    function yr(e, r, o) {
      return Ie(e, r, o, !0);
    }
    function mr(e, r, o) {
      return Ie(e, r, o, !1);
    }
    var Rr = mr, wr = yr;
    B.Fragment = s, B.jsx = Rr, B.jsxs = wr;
  }()), B;
}
process.env.NODE_ENV === "production" ? ie.exports = Or() : ie.exports = xr();
var He = ie.exports;
class T extends Error {
  constructor(a, s = "HOOK_INJECTION_ERROR", l) {
    super(a);
    H(this, "code");
    H(this, "details");
    this.name = "HookInjectionError", this.code = s, this.details = l, Error.captureStackTrace && Error.captureStackTrace(this, T);
  }
  /**
   * Create error for when hook is not set
   */
  static hookNotSet(a = "hook") {
    return new T(
      `${a} has not been injected yet. Make sure to wrap your component tree with the appropriate provider.`,
      "HOOK_NOT_SET"
    );
  }
  /**
   * Create error for invalid hook
   */
  static invalidHook(a = "hook", s) {
    const l = s ? `Invalid ${a}. Expected ${s}.` : `Invalid ${a} provided.`;
    return new T(l, "INVALID_HOOK");
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
  static timeout(a, s) {
    return new T(
      `Operation '${a}' timed out after ${s}ms.`,
      "TIMEOUT"
    );
  }
}
const Ae = Sr(null), Fr = ({
  children: n,
  hooks: t = {},
  navigationHook: a,
  // Legacy support
  customHooks: s = {}
  // Legacy support
}) => {
  const l = ae(() => {
    const v = {};
    return Object.entries(t).forEach(([d, m]) => {
      try {
        v[d] = m();
      } catch (u) {
        console.warn(`Failed to call hook "${d}":`, u);
      }
    }), v;
  }, [t]), p = ae(() => {
    if (a)
      try {
        return a();
      } catch (v) {
        console.warn("Failed to call navigationHook:", v);
        return;
      }
  }, [a]), g = ae(() => ({
    ...l,
    // Legacy support
    ...p && { navigate: p },
    ...s
  }), [l, p, s]);
  return /* @__PURE__ */ He.jsx(Ae.Provider, { value: g, children: n });
}, W = () => {
  const n = Tr(Ae);
  if (n === null)
    throw T.providerNotFound();
  return n;
};
function Cr(n, t, a = {}) {
  const s = W(), l = A(n), p = typeof t != "string", g = p ? "navigation" : t, v = p ? t || {} : a, { autoInject: d = !0, onReady: m, onError: u } = v, b = A(m), E = A(u);
  l.current = n, b.current = m, E.current = u, De(() => {
    var V, U, q;
    if (!d)
      return;
    const C = p ? s.navigate : s[g];
    if (C) {
      try {
        if (p) {
          const O = n;
          (V = O.setNavigate) == null || V.call(O, C);
        } else
          n.setHook(C);
        (U = b.current) == null || U.call(b);
      } catch (O) {
        (q = E.current) == null || q.call(E, O);
      }
      return () => {
        "reset" in l.current && l.current.reset && l.current.reset();
      };
    }
  }, [s[g], s.navigate, g, d, p]);
}
function Nr(n, t = {}) {
  const { autoInject: a = !0, onReady: s, onError: l } = t, p = W(), g = A(n), v = A(s), d = A(l);
  g.current = n, v.current = s, d.current = l, De(() => {
    var m, u, b, E;
    if (!(!a || !p.navigate)) {
      try {
        (u = (m = g.current).setNavigate) == null || u.call(m, p.navigate), (b = v.current) == null || b.call(v);
      } catch (C) {
        (E = d.current) == null || E.call(d, C);
      }
      return () => {
        g.current.reset && g.current.reset();
      };
    }
  }, [p.navigate, a]);
}
function $r(n) {
  return W()[n];
}
function Dr() {
  return W().navigate;
}
function Hr(n) {
  return W()[n];
}
function Ar() {
  return W();
}
function We(n = {}) {
  const {
    enableWarnings: t = !0,
    fallbackBehavior: a = "warn",
    timeout: s = 5e3,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    initialValue: l = null,
    validator: p
  } = n;
  let g = l, v = !!l;
  return {
    setHook(m) {
      if (p && !p(m)) {
        const u = T.invalidHook("hook", "valid hook function");
        if (a === "error")
          throw u;
        a === "warn" && t && console.warn(u.message);
        return;
      }
      g = m, v = !0;
    },
    getHook() {
      return g;
    },
    isReady() {
      return v;
    },
    execute(m) {
      if (!v || !g) {
        const u = T.hookNotSet();
        if (a === "error")
          throw u;
        return a === "warn" && t && console.warn(u.message), null;
      }
      try {
        return m(g);
      } catch (u) {
        return t && console.warn("Error executing callback with hook:", u), null;
      }
    },
    reset() {
      g = l, v = !!l;
    }
  };
}
function Wr(n = {}) {
  const t = We(n), { timeout: a = 5e3 } = n;
  return {
    ...t,
    async waitForHook() {
      if (t.isReady()) {
        const s = t.getHook();
        if (s !== null)
          return s;
      }
      return new Promise((s, l) => {
        let g = 0;
        const v = setInterval(() => {
          if (t.isReady()) {
            const d = t.getHook();
            if (d !== null) {
              clearInterval(v), s(d);
              return;
            }
          }
          g += 50, g >= a && (clearInterval(v), l(new Error(`Hook was not ready within ${a}ms timeout`)));
        }, 50);
      });
    }
  };
}
const j = /* @__PURE__ */ new Map();
function Vr(n, t = {}) {
  return j.has(n) || j.set(n, We(t)), j.get(n);
}
function Yr(n) {
  return j.get(n) || null;
}
function Mr(n) {
  const t = j.get(n);
  t != null && t.reset && t.reset(), j.delete(n);
}
function Lr() {
  j.forEach((n, t) => {
    n.reset && n.reset();
  }), j.clear();
}
function Br(n = {}) {
  const {
    enableWarnings: t = !0,
    fallbackBehavior: a = "warn",
    timeout: s = 5e3,
    // eslint-disable-line @typescript-eslint/no-unused-vars
    initialValue: l = null,
    validator: p
  } = n;
  let g = l, v = !!l;
  return console.log("Creating HookInjectionService with options:", {
    enableWarnings: t,
    fallbackBehavior: a,
    timeout: s,
    initialValue: l,
    validator: p
  }), {
    setHook(m) {
      if (p && !p(m)) {
        const u = T.invalidHook("hook", "valid hook function");
        if (a === "error")
          throw u;
        a === "warn" && t && console.warn(u.message);
        return;
      }
      g = m, v = !0;
    },
    getHook() {
      return g;
    },
    isReady() {
      return v;
    },
    execute(m) {
      if (!v || !g) {
        const u = T.hookNotSet();
        if (a === "error")
          throw u;
        return a === "warn" && t && console.warn(u.message), null;
      }
      try {
        return m(g);
      } catch (u) {
        return t && console.error("Error executing hook callback:", u), null;
      }
    }
  };
}
class Ve {
  constructor(t = {}) {
    H(this, "navigateFn", null);
    H(this, "config");
    H(this, "isNavigationReady", !1);
    this.config = {
      enableWarnings: !0,
      fallbackBehavior: "warn",
      timeout: 5e3,
      ...t
    };
  }
  /**
   * Set the navigation function (typically from useNavigate hook)
   */
  setNavigate(t) {
    if (typeof t != "function") {
      const a = T.invalidHook("navigation function", "function");
      if (this.config.fallbackBehavior === "error")
        throw a;
      this.config.fallbackBehavior === "warn" && this.config.enableWarnings && console.warn(a.message);
      return;
    }
    this.navigateFn = t, this.isNavigationReady = !0;
  }
  /**
   * Navigate to a specific path
   */
  navigate(t, a) {
    if (!this.isNavigationReady || !this.navigateFn) {
      this.handleNavigationError("navigate");
      return;
    }
    try {
      this.navigateFn(t, a);
    } catch (s) {
      this.config.enableWarnings && console.error("Navigation error:", s);
    }
  }
  /**
   * Navigate to login page (convenience method)
   */
  navigateToLogin(t = "/login") {
    this.navigate(t);
  }
  /**
   * Navigate to home page (convenience method)
   */
  navigateToHome(t = "/") {
    this.navigate(t);
  }
  /**
   * Navigate to error page (convenience method)
   */
  navigateToError(t = "/error", a) {
    this.navigate(t, { state: a });
  }
  /**
   * Replace current route (if supported by the router)
   */
  replace(t, a) {
    this.navigate(t, { ...a, replace: !0 });
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
    return this.isReady() ? Promise.resolve() : new Promise((t, a) => {
      let l = 0;
      const p = setInterval(() => {
        if (this.isReady()) {
          clearInterval(p), t();
          return;
        }
        l += 50, l >= this.config.timeout && (clearInterval(p), a(T.timeout("waitForReady", this.config.timeout)));
      }, 50);
    });
  }
  /**
   * Execute a callback with the navigation function
   */
  executeWithNavigation(t) {
    if (!this.isNavigationReady || !this.navigateFn)
      return this.handleNavigationError("executeWithNavigation"), null;
    try {
      return t(this.navigateFn);
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
  handleNavigationError(t) {
    const a = T.hookNotSet("navigation function");
    if (this.config.fallbackBehavior === "error")
      throw a;
    this.config.fallbackBehavior === "warn" && this.config.enableWarnings && console.warn(`${t}: ${a.message}`);
  }
}
function Ur(n = {}) {
  return new Ve(n);
}
let N = null;
function qr(n = {}) {
  return N || (N = new Ve(n)), N;
}
function Kr() {
  return N;
}
function Jr() {
  N && N.reset(), N = null;
}
function Gr(n, t, a) {
  const s = (l) => (Cr(t, a), /* @__PURE__ */ He.jsx(n, { ...l }));
  return s.displayName = `withHookInjection(${n.displayName || n.name})`, s;
}
function zr() {
  try {
    if (typeof require < "u") {
      const n = require("react");
      return se(n.version);
    }
    return typeof window < "u" && window.React ? se(window.React.version) : !0;
  } catch {
    return !0;
  }
}
function se(n) {
  if (!n) return !0;
  try {
    const [t, a] = n.split(".").map(Number);
    return t > 16 || t === 16 && a >= 8;
  } catch {
    return !0;
  }
}
function Pr() {
  try {
    return typeof require < "u" ? require("react").version || "unknown" : typeof window < "u" && window.React && window.React.version || "unknown";
  } catch {
    return "unknown";
  }
}
function Ye() {
  const n = Pr(), t = se(n);
  return {
    version: n,
    isSupported: t,
    hasHooks: t,
    minimumVersion: "16.8.0",
    recommendations: t ? ["✅ Your React version is fully supported"] : ["❌ Please upgrade to React 16.8.0 or higher to use hooks"]
  };
}
function Xr() {
  const n = Ye();
  console.group("🎯 React Hook Injection Pattern - Compatibility Check"), console.log(`React Version: ${n.version}`), console.log(`Hooks Supported: ${n.hasHooks ? "✅" : "❌"}`), console.log(`Minimum Required: ${n.minimumVersion}`), n.recommendations.forEach((t) => console.log(t)), n.isSupported || console.warn("⚠️  React version is too old. Please upgrade to use this library."), console.groupEnd();
}
function Zr() {
  const n = Ye();
  if (!n.isSupported)
    throw new Error(
      `React Hook Injection Pattern requires React ${n.minimumVersion} or higher. Current version: ${n.version}. Please upgrade React to use this library.`
    );
}
export {
  T as HookInjectionError,
  Fr as HookInjectionProvider,
  Ve as NavigationService,
  Zr as assertReactCompatibility,
  se as checkReactVersion,
  Br as createHookInjectionService,
  We as createHookService,
  Wr as createHookServiceWithTimeout,
  Ur as createNavigationService,
  Vr as createSingletonHookService,
  qr as createSingletonNavigationService,
  Ye as getCompatibilityInfo,
  Pr as getReactVersion,
  Yr as getSingletonHookService,
  Kr as getSingletonNavigationService,
  zr as isReactVersionSupported,
  Xr as logCompatibilityInfo,
  Lr as resetAllSingletonHookServices,
  Mr as resetSingletonHookService,
  Jr as resetSingletonNavigationService,
  Ar as useAllInjectedHooks,
  Hr as useCustomHook,
  $r as useHookFromContext,
  Cr as useHookInjection,
  Dr as useNavigationFromContext,
  Nr as useNavigationInjection,
  Gr as withHookInjection
};
//# sourceMappingURL=index.js.map

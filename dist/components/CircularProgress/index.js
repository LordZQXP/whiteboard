"use strict";

exports.__esModule = true;
exports["default"] = SimpleBackdrop;
var React = _interopRequireWildcard(require("react"));
var _Backdrop = _interopRequireDefault(require("@mui/material/Backdrop"));
var _CircularProgress = _interopRequireDefault(require("@mui/material/CircularProgress"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function SimpleBackdrop(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Backdrop["default"], {
    sx: {
      color: '#fff',
      zIndex: function zIndex(theme) {
        return theme.zIndex.drawer + 1;
      }
    },
    open: props == null ? void 0 : props.open
  }, /*#__PURE__*/React.createElement(_CircularProgress["default"], {
    color: "inherit"
  })));
}
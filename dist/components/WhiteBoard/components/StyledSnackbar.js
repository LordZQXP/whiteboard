"use strict";

exports.__esModule = true;
exports["default"] = StyledSnackbar;
var React = _interopRequireWildcard(require("react"));
var _Alert = _interopRequireDefault(require("@mui/material/Alert"));
var _Snackbar = _interopRequireDefault(require("@mui/material/Snackbar"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function StyledSnackbar(_ref) {
  var xPos = _ref.xPos,
    yPos = _ref.yPos,
    status = _ref.status,
    title = _ref.title,
    onClose = _ref.onClose,
    open = _ref.open;
  return /*#__PURE__*/React.createElement(_Snackbar["default"], {
    open: open,
    autoHideDuration: 2000,
    anchorOrigin: {
      vertical: yPos,
      horizontal: xPos
    },
    onClose: onClose
  }, /*#__PURE__*/React.createElement(_Alert["default"], {
    onClose: onClose,
    severity: status,
    color: status,
    sx: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, title));
}
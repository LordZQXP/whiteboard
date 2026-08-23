"use strict";

exports.__esModule = true;
exports["default"] = InputSlider;
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Slider = _interopRequireDefault(require("@mui/material/Slider"));
var _Input = _interopRequireDefault(require("@mui/material/Input"));
var _indexModule = _interopRequireDefault(require("../index.module.scss"));
var _templateObject;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) { "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); } return f; })(e, t); }
function _taggedTemplateLiteralLoose(e, t) { return t || (t = e.slice(0)), e.raw = t, e; }
var Input = (0, _styles.styled)(_Input["default"])(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  width: 42px;\n"])));
function InputSlider(props) {
  var _React$useState = React.useState(props == null ? void 0 : props.value),
    value = _React$useState[0],
    setValue = _React$useState[1];
  var handleSliderChange = function handleSliderChange(event, newValue) {
    if (newValue < 5) return;
    setValue(newValue);
    props == null ? void 0 : props.changeHandler(newValue);
  };
  var handleInputChange = function handleInputChange(event) {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    props == null ? void 0 : props.changeHandler(event.target.value === '' ? '' : Number(event.target.value));
  };
  return /*#__PURE__*/React.createElement(_Box["default"], {
    sx: {
      width: 280,
      marginBottom: "120px",
      backgroundColor: 'white',
      display: props != null && props.open ? "flex" : "none",
      boxShadow: open ? '0 0 10px #ccc' : 'none',
      position: 'absolute',
      zIndex: '999999999999',
      paddingLeft: '5px',
      paddingRight: '5px',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(_Grid["default"], {
    container: true,
    spacing: 2,
    alignItems: "center",
    className: _indexModule["default"].slider
  }, /*#__PURE__*/React.createElement(_Grid["default"], {
    item: true,
    xs: true,
    className: _indexModule["default"].slider
  }, /*#__PURE__*/React.createElement(_Slider["default"], {
    value: typeof value === 'number' ? value : props == null ? void 0 : props.min,
    onChange: handleSliderChange,
    max: 20,
    min: 0,
    step: 1,
    "aria-labelledby": "input-slider"
  })), /*#__PURE__*/React.createElement(_Grid["default"], {
    item: true
  }, /*#__PURE__*/React.createElement(Input, {
    value: value,
    size: "small",
    "aria-orientation": "vertical",
    onChange: handleInputChange,
    inputProps: {
      step: 1,
      min: 5,
      max: 20,
      type: 'number',
      'aria-labelledby': 'input-slider'
    },
    disabled: true
  }))));
}
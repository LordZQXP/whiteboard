"use strict";

exports.__esModule = true;
exports.default = InputSlider;

var React = _interopRequireWildcard(require("react"));

var _styles = require("@mui/material/styles");

var _Box = _interopRequireDefault(require("@mui/material/Box"));

var _Grid = _interopRequireDefault(require("@mui/material/Grid"));

var _Typography = _interopRequireDefault(require("@mui/material/Typography"));

var _Slider = _interopRequireDefault(require("@mui/material/Slider"));

var _Input = _interopRequireDefault(require("@mui/material/Input"));

var _LineWeight = _interopRequireDefault(require("@mui/icons-material/LineWeight"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var Input = (0, _styles.styled)(_Input.default)(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["\n  width: 42px;\n"])));

function InputSlider(props) {
  var _React$useState = React.useState(props == null ? void 0 : props.value),
      value = _React$useState[0],
      setValue = _React$useState[1];

  var handleSliderChange = function handleSliderChange(event, newValue) {
    if (newValue > 5) {
      setValue(newValue);
      props == null ? void 0 : props.changeHandler(newValue);
    }
  };

  var handleInputChange = function handleInputChange(event) {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    props == null ? void 0 : props.changeHandler(event.target.value === '' ? '' : Number(event.target.value));
  };

  var handleBlur = function handleBlur() {
    if (value < 5) {
      setValue(5);
    } else if (value > 20) {
      setValue(20);
    }
  };

  return /*#__PURE__*/React.createElement(_Box.default, {
    sx: {
      width: 250
    }
  }, /*#__PURE__*/React.createElement(_Grid.default, {
    container: true,
    spacing: 2,
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(_Grid.default, {
    item: true
  }, /*#__PURE__*/React.createElement(_LineWeight.default, null)), /*#__PURE__*/React.createElement(_Grid.default, {
    item: true,
    xs: true
  }, /*#__PURE__*/React.createElement(_Slider.default, {
    value: typeof value === 'number' ? value : props == null ? void 0 : props.min,
    onChange: handleSliderChange,
    "aria-labelledby": "input-slider"
  })), /*#__PURE__*/React.createElement(_Grid.default, {
    item: true
  }, /*#__PURE__*/React.createElement(Input, {
    value: value,
    size: "small",
    onChange: handleInputChange,
    onBlur: handleBlur,
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
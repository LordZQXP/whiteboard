"use strict";

exports.__esModule = true;
exports.default = StyledSnackbar;

var React = _interopRequireWildcard(require("react"));

var _Alert = _interopRequireDefault(require("@mui/material/Alert"));

var _Snackbar = _interopRequireDefault(require("@mui/material/Snackbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function StyledSnackbar(_ref) {
  var xPos = _ref.xPos,
      yPos = _ref.yPos,
      status = _ref.status,
      title = _ref.title,
      onClose = _ref.onClose,
      open = _ref.open;
  return /*#__PURE__*/React.createElement(_Snackbar.default, {
    open: open,
    autoHideDuration: 2000,
    anchorOrigin: {
      vertical: yPos,
      horizontal: xPos
    },
    onClose: onClose
  }, /*#__PURE__*/React.createElement(_Alert.default, {
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
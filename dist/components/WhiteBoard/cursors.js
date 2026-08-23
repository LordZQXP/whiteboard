"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _remove = _interopRequireDefault(require("./images/remove.svg"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var getCursor = function getCursor(_ref) {
  var type = _ref.type;
  switch (type) {
    case 'eraser':
      {
        return _remove["default"];
      }
    default:
      {
        return '';
      }
  }
};
var _default = exports["default"] = getCursor;
"use strict";

exports.__esModule = true;
exports.default = OpenDrawSpeedDial;

var React = _interopRequireWildcard(require("react"));

var _Box = _interopRequireDefault(require("@mui/material/Box"));

var _SpeedDial = _interopRequireDefault(require("@mui/material/SpeedDial"));

var _SpeedDialIcon = _interopRequireDefault(require("@mui/material/SpeedDialIcon"));

var _SpeedDialAction = _interopRequireDefault(require("@mui/material/SpeedDialAction"));

var _HorizontalRule = _interopRequireDefault(require("@mui/icons-material/HorizontalRule"));

var _Crop = _interopRequireDefault(require("@mui/icons-material/Crop169"));

var _ChangeHistory = _interopRequireDefault(require("@mui/icons-material/ChangeHistory"));

var _Create = _interopRequireDefault(require("@mui/icons-material/Create"));

var _RadioButtonUnchecked = _interopRequireDefault(require("@mui/icons-material/RadioButtonUnchecked"));

var _TitleRounded = _interopRequireDefault(require("@mui/icons-material/TitleRounded"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var actions = [{
  icon: /*#__PURE__*/React.createElement(_HorizontalRule.default, {
    alt: "Line",
    style: {
      rotate: '-45deg',
      color: 'black'
    }
  }),
  name: 'LINE'
}, {
  icon: /*#__PURE__*/React.createElement(_Crop.default, {
    alt: "Rectangle",
    style: {
      color: 'black'
    }
  }),
  name: 'RECTANGLE'
}, {
  icon: /*#__PURE__*/React.createElement(_RadioButtonUnchecked.default, {
    style: {
      color: 'black'
    }
  }),
  name: 'ELLIPSE'
}, {
  icon: /*#__PURE__*/React.createElement(_ChangeHistory.default, {
    style: {
      color: 'black'
    }
  }),
  name: 'TRIANGLE'
}, {
  icon: /*#__PURE__*/React.createElement(_Create.default, {
    style: {
      color: 'black'
    }
  }),
  name: 'PENCIL'
}, {
  icon: /*#__PURE__*/React.createElement(_TitleRounded.default, {
    style: {
      color: 'black'
    }
  }),
  name: 'TEXT'
}];

function OpenDrawSpeedDial(props) {
  return /*#__PURE__*/React.createElement(_Box.default, null, /*#__PURE__*/React.createElement(_SpeedDial.default, {
    ariaLabel: "SpeedDial openIcon example",
    icon: /*#__PURE__*/React.createElement(_SpeedDialIcon.default, {
      openIcon: /*#__PURE__*/React.createElement(_Create.default, null)
    })
  }, actions.map(function (action) {
    return /*#__PURE__*/React.createElement(_SpeedDialAction.default, {
      key: action.name,
      icon: action.icon,
      tooltipTitle: action.name,
      onClick: function onClick() {
        return props == null ? void 0 : props.toolCommander(action.name, props == null ? void 0 : props.canvas);
      }
    });
  })));
}
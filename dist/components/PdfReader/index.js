"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _entry = require("react-pdf/dist/esm/entry.webpack");

var _reactPdf = require("react-pdf");

var _indexModule = _interopRequireDefault(require("./index.module.scss"));

var _material = require("@mui/material");

var _indexModule2 = _interopRequireDefault(require("../WhiteBoard/index.module.scss"));

var _CircularProgress = _interopRequireDefault(require("../CircularProgress"));

var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));

var _Remove = _interopRequireDefault(require("@mui/icons-material/Remove"));

var _PageviewOutlined = _interopRequireDefault(require("@mui/icons-material/PageviewOutlined"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + _reactPdf.pdfjs.version + "/pdf.worker.js";

var PDFReader = function PDFReader(_ref) {
  var fileReaderInfo = _ref.fileReaderInfo,
      open = _ref.open;

  var _React$useState = _react.default.useState(true),
      spinnerValue = _React$useState[0],
      setSpinnerValue = _React$useState[1];

  var _React$useState2 = _react.default.useState(false),
      zoomToggle = _React$useState2[0],
      setZoomToggle = _React$useState2[1];

  var _React$useState3 = _react.default.useState(1.0),
      scale = _React$useState3[0],
      setScale = _React$useState3[1];

  var intervalRef = _react.default.useRef(null);

  var zoomIn = function zoomIn(value) {
    setScale(value += 0.01);
  };

  var zoomOut = function zoomOut(value) {
    if (value > 1.0) setScale(value -= 0.01);
  };

  var startCounter = function startCounter(zoom) {
    var value = scale;
    intervalRef.current = setInterval(function () {
      if (zoom === "in") zoomIn(value);else {
        zoomOut(value);
      }
    }, 10);
  };

  var stopCounter = function stopCounter() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  var _React$useState4 = _react.default.useState(null),
      numPages = _React$useState4[0],
      setNumPages = _React$useState4[1];

  var _React$useState5 = _react.default.useState(1),
      pageNumber = _React$useState5[0],
      setPageNumber = _React$useState5[1];

  function onDocumentLoadSuccess(_ref2) {
    var numPages = _ref2.numPages;
    setSpinnerValue(false);
    setNumPages(numPages);
  }

  var _React$useState6 = _react.default.useState(500),
      width = _React$useState6[0],
      setWidth = _React$useState6[1];

  _react.default.useEffect(function () {
    if (window.innerWidth > 900) setWidth(500);else if (window.innerWidth > 480 && window.innerWidth < 900) setWidth(window.innerWidth);else if (window.innerWidth > 350) {
      setWidth(350);
    } else if (window.innerWidth < 330) setWidth(200);
  }, [window.innerWidth]);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: numPages > 1 ? _indexModule.default.pdfAbsoluteDiv : _indexModule.default.pdfFixedDiv
  }, spinnerValue && /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
    open: true
  }), /*#__PURE__*/_react.default.createElement(_entry.Document, {
    file: fileReaderInfo,
    onLoadSuccess: onDocumentLoadSuccess
  }, Array.from(Array(numPages), function (e, x) {
    return /*#__PURE__*/_react.default.createElement(_entry.Page, {
      key: x,
      pageNumber: x + 1,
      width: width,
      scale: scale
    });
  })));
};

var _default = PDFReader;
exports.default = _default;
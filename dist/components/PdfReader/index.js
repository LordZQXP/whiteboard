"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactPdf = require("react-pdf");

var _indexModule = _interopRequireDefault(require("./index.module.scss"));

var _material = require("@mui/material");

var _indexModule2 = _interopRequireDefault(require("../WhiteBoard/index.module.scss"));

var _CircularProgress = _interopRequireDefault(require("../CircularProgress"));

var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));

var _Remove = _interopRequireDefault(require("@mui/icons-material/Remove"));

var _PageviewOutlined = _interopRequireDefault(require("@mui/icons-material/PageviewOutlined"));

var _pdfWorker = require("../../pdfWorker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _pdfWorker.ensurePdfWorker)();

const PDFReader = _ref => {
  let {
    fileReaderInfo,
    open
  } = _ref;

  const [spinnerValue, setSpinnerValue] = _react.default.useState(true);

  const [zoomToggle, setZoomToggle] = _react.default.useState(false);

  const [scale, setScale] = _react.default.useState(1.0);

  const intervalRef = _react.default.useRef(null);

  const zoomIn = value => {
    setScale(value += 0.01);
  };

  const zoomOut = value => {
    if (value > 1.0) setScale(value -= 0.01);
  };

  const startCounter = zoom => {
    let value = scale;
    intervalRef.current = setInterval(() => {
      if (zoom === "in") zoomIn(value);else {
        zoomOut(value);
      }
    }, 10);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const [numPages, setNumPages] = _react.default.useState(null);

  const [pageNumber, setPageNumber] = _react.default.useState(1);

  function onDocumentLoadSuccess(_ref2) {
    let {
      numPages
    } = _ref2;
    setSpinnerValue(false);
    setNumPages(numPages);
  }

  const [width, setWidth] = _react.default.useState(500);

  _react.default.useEffect(() => {
    if (window.innerWidth > 900) setWidth(500);else if (window.innerWidth > 480 && window.innerWidth < 900) setWidth(window.innerWidth);else if (window.innerWidth > 350) {
      setWidth(350);
    } else if (window.innerWidth < 330) setWidth(200);
  }, [window.innerWidth]);

  return /*#__PURE__*/_react.default.createElement("div", {
    className: numPages > 1 ? _indexModule.default.pdfAbsoluteDiv : _indexModule.default.pdfFixedDiv
  }, spinnerValue && /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
    open: true
  }), /*#__PURE__*/_react.default.createElement(_reactPdf.Document, {
    file: fileReaderInfo,
    onLoadSuccess: onDocumentLoadSuccess
  }, Array.from(Array(numPages), (e, x) => /*#__PURE__*/_react.default.createElement(_reactPdf.Page, {
    key: x,
    pageNumber: x + 1,
    width: width,
    scale: scale,
    renderTextLayer: false,
    renderAnnotationLayer: false
  }))));
};

var _default = PDFReader;
exports.default = _default;
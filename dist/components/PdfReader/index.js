"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _entry = require("react-pdf/dist/esm/entry.webpack");

var _reactPdf = require("react-pdf");

var _indexModule = _interopRequireDefault(require("./index.module.scss"));

var _material = require("@mui/material");

var _ArrowForwardIos = _interopRequireDefault(require("@mui/icons-material/ArrowForwardIos"));

var _ArrowBackIosNew = _interopRequireDefault(require("@mui/icons-material/ArrowBackIosNew"));

var _indexModule2 = _interopRequireDefault(require("../WhiteBoard/index.module.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + _reactPdf.pdfjs.version + "/pdf.worker.js";

var PDFReader = function PDFReader(_ref) {
  var fileReaderInfo = _ref.fileReaderInfo,
      open = _ref.open;

  var _React$useState = _react.default.useState(null),
      numPages = _React$useState[0],
      setNumPages = _React$useState[1];

  var _React$useState2 = _react.default.useState(1),
      pageNumber = _React$useState2[0],
      setPageNumber = _React$useState2[1];

  function onDocumentLoadSuccess(_ref2) {
    var numPages = _ref2.numPages;
    setNumPages(numPages);
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.pdfFixedDiv
  }, /*#__PURE__*/_react.default.createElement(_entry.Document, {
    file: fileReaderInfo,
    onLoadSuccess: onDocumentLoadSuccess
  }, /*#__PURE__*/_react.default.createElement(_entry.Page, {
    pageNumber: pageNumber,
    width: window.innerWidth > 500 ? 500 : window.innerWidth
  })), open && /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule2.default.nextFixedButton
  }, " ", /*#__PURE__*/_react.default.createElement(_material.Button, {
    className: _indexModule2.default.floatingButtonsZoom,
    onClick: function onClick() {
      return setPageNumber(pageNumber - 1 > 0 ? pageNumber - 1 : 1);
    }
  }, /*#__PURE__*/_react.default.createElement(_ArrowBackIosNew.default, {
    className: _indexModule2.default.blackIcon
  })), /*#__PURE__*/_react.default.createElement("p", null, "Page ", pageNumber, " of ", numPages), /*#__PURE__*/_react.default.createElement(_material.Button, {
    className: _indexModule2.default.floatingButtonsZoom,
    onClick: function onClick() {
      return setPageNumber(pageNumber + 1 <= numPages ? pageNumber + 1 : pageNumber);
    }
  }, /*#__PURE__*/_react.default.createElement(_ArrowForwardIos.default, null)), " "));
};

var _default = PDFReader;
exports.default = _default;
"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _entry = require("react-pdf/dist/esm/entry.webpack");

var _reactPdf = require("react-pdf");

var _indexModule = _interopRequireDefault(require("../PdfReader/index.module.scss"));

var _indexModule2 = _interopRequireDefault(require("../WhiteBoard/index.module.scss"));

var _ArrowForwardIos = _interopRequireDefault(require("@mui/icons-material/ArrowForwardIos"));

var _ArrowBackIosNew = _interopRequireDefault(require("@mui/icons-material/ArrowBackIosNew"));

var _material = require("@mui/material");

var _CircularProgress = _interopRequireDefault(require("../CircularProgress"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + _reactPdf.pdfjs.version + "/pdf.worker.js";

var PDFCanvas = function PDFCanvas(_ref) {
  var fileCanvasInfo = _ref.fileCanvasInfo,
      updateFileCanvasInfo = _ref.updateFileCanvasInfo,
      back = _ref.back,
      next = _ref.next,
      setSubmitPdf = _ref.setSubmitPdf,
      extend = _ref.extend,
      revision = _ref.revision;

  var _React$useState = _react.default.useState(true),
      spinnerValue = _React$useState[0],
      setSpinnerValue = _React$useState[1];

  var _React$useState2 = _react.default.useState(1),
      totalIndex = _React$useState2[0],
      setTotalIndex = _React$useState2[1];

  function onRenderSuccess() {
    var importPDFCanvas = document.querySelector('.import-pdf-page canvas');
    var pdfAsImageSrc = importPDFCanvas.toDataURL();
    updateFileCanvasInfo({
      currentPage: pdfAsImageSrc
    });
  }

  function onDocumentLoadSuccess(_ref2) {
    var numPages = _ref2.numPages;
    setSpinnerValue(false);
    updateFileCanvasInfo({
      totalPages: numPages
    });
    setTotalIndex(numPages);
    if (numPages === 1) setSubmitPdf(true);
  }

  function changePage(offset) {
    updateFileCanvasInfo({
      currentPageNumber: fileCanvasInfo.currentPageNumber + offset
    });
  }

  function submitPdf() {
    setSubmitPdf(true);
  }

  var nextPage = function nextPage() {
    if (fileCanvasInfo.currentPageNumber + 1 <= fileCanvasInfo.totalPages) {
      changePage(1);
      next();
    } else if (fileCanvasInfo.currentPageNumber + 1 > fileCanvasInfo.totalPages) {
      updateFileCanvasInfo({
        totalPages: fileCanvasInfo.currentPageNumber + 1
      });
      extend();
      changePage(1);
      setTotalIndex(Math.max(totalIndex, fileCanvasInfo.currentPageNumber + 1));
    }

    if (fileCanvasInfo.currentPageNumber + 1 == fileCanvasInfo.totalPages) submitPdf();
  };

  var previousPage = function previousPage() {
    changePage(-1);
    back();
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.fileContainer
  }, spinnerValue && /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
    open: true
  }), /*#__PURE__*/_react.default.createElement(_entry.Document, {
    className: _indexModule.default.document,
    file: fileCanvasInfo.file,
    onLoadSuccess: onDocumentLoadSuccess
  }, /*#__PURE__*/_react.default.createElement(_entry.Page, {
    className: "import-pdf-page",
    onRenderSuccess: onRenderSuccess,
    pageNumber: fileCanvasInfo.currentPageNumber
  }))), !spinnerValue && /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule2.default.nextFixedButton
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    className: _indexModule2.default.floatingButtonsZoom,
    disabled: fileCanvasInfo.currentPageNumber <= 1,
    onClick: previousPage
  }, /*#__PURE__*/_react.default.createElement(_ArrowBackIosNew.default, {
    className: _indexModule2.default.blackIcon
  })), /*#__PURE__*/_react.default.createElement("p", null, "Page ", fileCanvasInfo.currentPageNumber, " of ", totalIndex || '--'), /*#__PURE__*/_react.default.createElement(_material.Button, {
    className: _indexModule2.default.floatingButtonsZoom,
    disabled: fileCanvasInfo.currentPageNumber >= fileCanvasInfo.totalPages && !revision,
    onClick: nextPage
  }, /*#__PURE__*/_react.default.createElement(_ArrowForwardIos.default, null))));
};

var _default = PDFCanvas;
exports.default = _default;
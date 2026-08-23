"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactPdf = require("react-pdf");

var _indexModule = _interopRequireDefault(require("../PdfReader/index.module.scss"));

var _indexModule2 = _interopRequireDefault(require("../WhiteBoard/index.module.scss"));

var _left = _interopRequireDefault(require("../WhiteBoard/images/left.svg"));

var _right = _interopRequireDefault(require("../WhiteBoard/images/right.svg"));

var _material = require("@mui/material");

var _CircularProgress = _interopRequireDefault(require("../CircularProgress"));

var _pdfWorker = require("../../pdfWorker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _pdfWorker.ensurePdfWorker)();

const PDFCanvas = _ref => {
  let {
    fileCanvasInfo,
    updateFileCanvasInfo,
    back,
    next,
    setSubmitPdf,
    extend,
    revision
  } = _ref;

  const [spinnerValue, setSpinnerValue] = _react.default.useState(true);

  const [totalIndex, setTotalIndex] = _react.default.useState(1);

  function onRenderSuccess() {
    const importPDFCanvas = document.querySelector('.import-pdf-page canvas');
    const pdfAsImageSrc = importPDFCanvas.toDataURL();
    updateFileCanvasInfo({
      currentPage: pdfAsImageSrc
    });
  }

  function onDocumentLoadSuccess(_ref2) {
    let {
      numPages
    } = _ref2;
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

  const nextPage = () => {
    if (fileCanvasInfo.currentPageNumber + 1 <= fileCanvasInfo.totalPages) {
      changePage(1);
      next();
    }

    if (fileCanvasInfo.currentPageNumber + 1 == fileCanvasInfo.totalPages) submitPdf();
  };

  const previousPage = () => {
    changePage(-1);
    back();
  };

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.fileContainer
  }, spinnerValue && /*#__PURE__*/_react.default.createElement(_CircularProgress.default, {
    open: true
  }), /*#__PURE__*/_react.default.createElement(_reactPdf.Document, {
    className: _indexModule.default.document,
    file: fileCanvasInfo.file,
    onLoadSuccess: onDocumentLoadSuccess
  }, /*#__PURE__*/_react.default.createElement(_reactPdf.Page, {
    className: "import-pdf-page",
    onRenderSuccess: onRenderSuccess,
    pageNumber: fileCanvasInfo.currentPageNumber,
    renderTextLayer: false,
    renderAnnotationLayer: false
  }))), !spinnerValue && fileCanvasInfo.totalPages > 1 && /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule2.default.nextFixedButton
  }, /*#__PURE__*/_react.default.createElement("p", null, "Page ", fileCanvasInfo.currentPageNumber, " of ", totalIndex || '--'), fileCanvasInfo.currentPageNumber > 1 && /*#__PURE__*/_react.default.createElement(_material.Button, {
    className: _indexModule2.default.floatingButtonsZoom,
    onClick: previousPage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _left.default,
    style: {
      width: '20px',
      height: '20px'
    }
  })), fileCanvasInfo.currentPageNumber < fileCanvasInfo.totalPages && /*#__PURE__*/_react.default.createElement(_material.Button, {
    className: _indexModule2.default.floatingButtonsZoom,
    onClick: nextPage
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: _right.default,
    style: {
      width: '20px',
      height: '20px'
    }
  }))));
};

var _default = PDFCanvas;
exports.default = _default;
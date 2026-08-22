"use strict";

exports.__esModule = true;

var _index = _interopRequireDefault(require("./components/WhiteBoard/index"));

exports.Whiteboard = _index.default;

var _pdfWorker = require("./pdfWorker");

exports.setPdfWorkerSrc = _pdfWorker.setPdfWorkerSrc;
exports.pdfjsVersion = _pdfWorker.pdfjsVersion;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
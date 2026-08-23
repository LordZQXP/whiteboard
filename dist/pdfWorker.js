"use strict";

exports.__esModule = true;
exports.setPdfWorkerSrc = exports.pdfjsVersion = exports.ensurePdfWorker = void 0;

var _reactPdf = require("react-pdf");

exports.pdfjs = _reactPdf.pdfjs;

/**
 * PDF.js runs its parser in a Web Worker, and the worker script has to be
 * fetched from somewhere at runtime.
 *
 * Earlier versions of this library pointed `workerSrc` at cdnjs over a
 * protocol-relative URL. That put the component that parses untrusted,
 * user-uploaded PDFs on a third-party CDN with no integrity checking, so the
 * default is now a self-hosted copy served from the consuming app's own origin.
 *
 * Consumers must copy `pdfjs-dist/build/pdf.worker.min.mjs` into the directory
 * they serve static assets from (`public/` for CRA), or call
 * `setPdfWorkerSrc()` once at startup with wherever they serve it from.
 */
const DEFAULT_WORKER_SRC = '/pdf.worker.min.mjs';
let workerSrc = DEFAULT_WORKER_SRC;
/**
 * Point pdf.js at the configured worker.
 *
 * The components that render PDFs call this on import. It is an explicit call
 * rather than a module side effect because bundlers that honour the
 * `sideEffects` package flag will drop a side-effect-only `import` outright,
 * which leaves `GlobalWorkerOptions.workerSrc` unset and makes pdf.js throw.
 */

const ensurePdfWorker = () => {
  _reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
};

exports.ensurePdfWorker = ensurePdfWorker;

const setPdfWorkerSrc = src => {
  workerSrc = src;
  ensurePdfWorker();
};
/** The pdfjs version this library is built against — useful for pinning the copied worker. */


exports.setPdfWorkerSrc = setPdfWorkerSrc;
const pdfjsVersion = _reactPdf.pdfjs.version;
exports.pdfjsVersion = pdfjsVersion;
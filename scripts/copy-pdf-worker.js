/**
 * Copies the pdf.js worker into public/ so the dev harness can serve it from
 * its own origin, which is where src/lib/pdfWorker.js points by default.
 *
 * Consumers of the published package do the equivalent in their own app; this
 * script only sets up the local demo. Resolving through react-pdf keeps the
 * worker and the pdfjs-dist it was built against on the same version.
 */
const fs = require('fs');
const path = require('path');

const WORKER = 'pdf.worker.min.mjs';

const from = require.resolve(`pdfjs-dist/build/${WORKER}`, {
  paths: [path.dirname(require.resolve('react-pdf/package.json'))],
});
const to = path.join(__dirname, '..', 'public', WORKER);

fs.copyFileSync(from, to);
console.log(`copied ${path.relative(process.cwd(), from)} -> public/${WORKER}`);

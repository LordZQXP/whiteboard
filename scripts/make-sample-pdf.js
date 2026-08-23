/**
 * Generates public/sample.pdf, the document the dev harness loads.
 *
 * The harness used to point at a staging S3 URL that now 404s, which left the
 * whiteboard with nothing to render. Building the file locally keeps the demo
 * working without depending on a remote bucket.
 */
const fs = require('fs');
const path = require('path');

const page = (n) => `BT /F1 24 Tf 72 700 Td (Whiteboard sample - page ${n}) Tj ET
0.2 0.4 0.9 RG 4 w 72 120 m 468 120 l S`;

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  null, // stream, filled below
  null,
];

const streams = { 5: page(1), 6: page(2) };
Object.entries(streams).forEach(([i, body]) => {
  objects[i] = `<< /Length ${Buffer.byteLength(body)} >>\nstream\n${body}\nendstream`;
});

let pdf = '%PDF-1.4\n';
const offsets = [];
objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
offsets.forEach((o) => {
  pdf += `${String(o).padStart(10, '0')} 00000 n \n`;
});
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

const out = path.join(__dirname, '..', 'public', 'sample.pdf');
fs.writeFileSync(out, pdf, 'latin1');
console.log(`wrote public/sample.pdf (${Buffer.byteLength(pdf)} bytes, 2 pages)`);

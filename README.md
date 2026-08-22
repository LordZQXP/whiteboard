
## PDF worker

This library renders PDFs with `react-pdf` / PDF.js, which runs its parser in a
Web Worker loaded at runtime. Earlier versions fetched that worker from cdnjs;
because the worker is what parses untrusted, user-supplied PDFs, it is now
served from the consuming application's own origin by default.

Copy the worker into whatever directory your app serves static files from:

```sh
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
```

The default `workerSrc` is `/pdf.worker.min.mjs`. To serve it from somewhere
else, call `setPdfWorkerSrc` once before rendering:

```js
import { setPdfWorkerSrc } from 'react-fabricjs-whiteboard';

setPdfWorkerSrc('/static/pdf.worker.min.mjs');
```

The worker's version must match the `pdfjs-dist` this library resolves —
PDF.js refuses to start on a mismatch. `pdfjsVersion` is exported for that.

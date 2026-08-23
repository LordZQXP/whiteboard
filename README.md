
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

## Local development

The demo harness in `src/App.jsx` runs on Vite:

```sh
npm start        # dev server on http://localhost:3000
npm run build    # bundles the demo into build/
```

`prestart`/`prebuild` copy the PDF.js worker and generate a sample PDF into
`public/`, so the demo serves both from its own origin.

The published package is **not** built by Vite — `npm run build-npm` compiles
`src/lib` to `dist` with babel, and `dist` plus `README.md` are the only files
shipped to npm. Vite is a devDependency of the harness only.

Files under `src/` that contain JSX use the `.jsx` extension; babel emits `.js`
for them, so `dist` filenames are unaffected.

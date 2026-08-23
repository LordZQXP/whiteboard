import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev harness only.
 *
 * The published package is built by `npm run build-npm` (babel src/lib -> dist)
 * and never goes through Vite. This config only serves and bundles the demo in
 * src/App.jsx so the library can be exercised locally.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // Keep CRA's output directory so existing paths and tooling still line up.
    outDir: 'build',
    emptyOutDir: true,
  },
});

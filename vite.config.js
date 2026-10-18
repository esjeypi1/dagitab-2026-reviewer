import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Only index.html is built for the site. The dev/ preview page is for local use only;
// set PREVIEW=1 to also build it (used for screenshots during question review).
export default defineConfig({
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        ...(process.env.PREVIEW ? { preview: resolve(import.meta.dirname, 'dev/preview.html') } : {}),
      },
    },
  },
});

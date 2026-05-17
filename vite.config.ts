import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: deploy via main -> /docs. Build output is written
// directly into ./docs so the published site stays in sync.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: true,
  },
});

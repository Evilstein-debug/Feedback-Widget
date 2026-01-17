import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'FeedbackWidget',
      fileName: () => 'widget.js',
      formats: ['iife'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  }
})

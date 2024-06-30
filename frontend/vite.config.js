import {defineConfig} from 'vite';
import {fileURLToPath, URL} from 'node:url';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/dist',
  },
  server: {
    watch: {
      usePolling: true,
    },
    hrm: {
      host: 'localhost',
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      backend: fileURLToPath(new URL('../backend/src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/base/variable.scss";`,
      },
    },
  },
});

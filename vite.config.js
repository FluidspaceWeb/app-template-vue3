// https://vitejs.dev/config/

import { fileURLToPath, URL } from 'node:url'
import { env } from 'node:process';
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path';

// Please set the appropriate namespace and modulename.
// If deploying locally then set the appropriate hostname.
const _MODULES_CDN_BASE_URL = 'http://modules-my.fluidspace.local/namespace/modulename';

export default defineConfig({
  define: {
    'process.env': env
  },
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('module-')
      }
    }
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    cssCodeSplit: false,
    copyPublicDir: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        entryFileNames: 'js/main-[hash].js',
        format: 'iife',
        exports: 'none',
        generatedCode: 'es2015',
        sourcemap: false
      }
    }
  },
  experimental: {
    renderBuiltUrl(filename, { type }) {
      if (type === 'asset') {
        return _MODULES_CDN_BASE_URL + '/' + filename;
      }
      return filename;
    }
  }
});

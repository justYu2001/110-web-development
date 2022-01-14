import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import Components from 'unplugin-vue-components/vite';
import Pages from "vite-plugin-pages";
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components(),
    Pages(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
});

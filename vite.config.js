import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // List your html files here, e.g:
        main: resolve(__dirname, 'etusivu.html'),
        login: resolve(__dirname, 'login.html'),
        diary: resolve(__dirname, 'diary.html'),

      },
    },
  },
  // Public base path could be set here too:
  // base: '/~username/my-app/',
});
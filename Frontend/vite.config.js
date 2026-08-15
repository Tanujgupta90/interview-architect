import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Silences all deprecation warnings coming from styles or node_modules
        quietDeps: true,
        silenceDeprecations: ['global-builtin', 'color-functions', 'import']
      }
    }
  }
});

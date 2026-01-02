import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Vercel ku idhu MANDATORY da!
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

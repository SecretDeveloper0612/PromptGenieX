
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This shims process.env.API_KEY for the browser, 
    // pulling it from Vercel's environment variables during build.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // API Key Injection: Uses env file if available, otherwise falls back to the provided key.
      // This ensures it works on Vercel even if .env is not uploaded.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "AIzaSyD98Yu24d86IMin0_AbExACDNgew49A8GQ"),
    },
    build: {
      outDir: 'dist',
    }
  };
});
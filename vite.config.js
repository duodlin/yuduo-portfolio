import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages publishes this project beneath its repository name. Vercel
  // and local development serve from the domain root.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/yuduo-portfolio/' : '/',
});

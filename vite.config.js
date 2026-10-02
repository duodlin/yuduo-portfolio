import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This is a project site (rather than the account-level username.github.io site).
  base: '/yuduo-portfolio/',
});

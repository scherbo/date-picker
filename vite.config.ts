import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), analyzer()],
});

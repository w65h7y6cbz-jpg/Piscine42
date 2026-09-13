import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2022', assetsInlineLimit: 0 },
  // La chaîne clang dépasse allègrement les limites par défaut de l'optimiseur.
  optimizeDeps: { exclude: ['@chaine-c'] },
});

// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Domínio definitivo pendente (PENDENCIAS item 16). Usado em sitemap e Open Graph na Fase 5.
  site: 'https://example.invalid',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    // Os originais e os clones antigos ficam fora do que o Vite observa.
    server: { watch: { ignored: ['**/Fotos Para Potifolio/**', '**/taste-skill/**', '**/anti-slop/**', '**/.cache/**'] } },
  },
});

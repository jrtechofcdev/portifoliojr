// @ts-check
import { defineConfig } from 'astro/config';
import curadoria from './scripts/curadoria-dev.mjs';

export default defineConfig({
  // Domínio definitivo pendente (PENDENCIAS item 16). Usado em sitemap e Open Graph na Fase 5.
  site: 'https://example.invalid',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    // Página /curadoria (estrela e casinha): só no desenvolvimento.
    plugins: [curadoria()],
    // Os originais e os clones antigos ficam fora do que o Vite observa.
    server: { watch: { ignored: ['**/Fotos Para Potifolio/**', '**/taste-skill/**', '**/anti-slop/**', '**/.cache/**'] } },
  },
});

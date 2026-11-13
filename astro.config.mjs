// @ts-check
import { defineConfig } from 'astro/config';
import curadoria from './scripts/curadoria-dev.mjs';

// Endereço do site (canônico, sitemap, Open Graph). SITE_URL vence; na Vercel usa o domínio de produção
// do projeto. Quando houver domínio próprio, defina SITE_URL nas variáveis de ambiente da Vercel.
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process.env;
const vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
const site = env.SITE_URL ?? (vercel ? `https://${vercel}` : 'https://example.invalid');

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    // Página /curadoria (estrela e casinha): só no desenvolvimento.
    plugins: [curadoria()],
    // Os originais e os clones antigos ficam fora do que o Vite observa.
    server: { watch: { ignored: ['**/Fotos Para Potifolio/**', '**/taste-skill/**', '**/anti-slop/**', '**/.cache/**'] } },
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import curadoria from './scripts/curadoria-dev.mjs';

// Endereço oficial do site (canônico, sitemap, Open Graph e a imagem da prévia de compartilhamento).
// Fixo no domínio próprio para que o link compartilhado aponte sempre para ele, e não para o
// endereço .vercel.app. A variável SITE_URL, se existir, vence (útil para testar em outro endereço).
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process.env;
const site = env.SITE_URL ?? 'https://portifolio.jrtechofc.com.br';

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

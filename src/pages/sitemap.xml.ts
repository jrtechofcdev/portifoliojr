import type { APIRoute } from 'astro';
import { ensaiosPublicaveis } from '../lib/fotos';

export const GET: APIRoute = async ({ site }) => {
  const caminhos = ['/', '/trabalhos', ...(await ensaiosPublicaveis()).map((e) => `/trabalhos/${e.id}`)];
  const urls = caminhos.map((c) => `  <url><loc>${new URL(c, site).href}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

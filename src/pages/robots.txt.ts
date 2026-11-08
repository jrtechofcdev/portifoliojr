import type { APIRoute } from 'astro';
import { PREVIA } from '../lib/fotos';

// A prévia (com fotos ainda sem autorização) nunca pode ser indexada.
export const GET: APIRoute = ({ site }) =>
  new Response(
    PREVIA ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

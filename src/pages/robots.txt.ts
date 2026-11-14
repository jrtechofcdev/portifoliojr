import type { APIRoute } from 'astro';
import { PREVIA } from '../lib/fotos';

// A prévia (com fotos ainda sem autorização) nunca pode ser indexada.
// /escolha/ é a curadoria das modelos (links privados, servidos pelo Worker do Cloudflare).
export const GET: APIRoute = ({ site }) =>
  new Response(
    PREVIA ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /escolha/\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

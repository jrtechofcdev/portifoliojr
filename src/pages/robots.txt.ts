import type { APIRoute } from 'astro';
import { PREVIA } from '../lib/fotos';

// Robôs que coletam conteúdo para treinar inteligência artificial: bloqueados no site inteiro
// (proteção das fotos, 14/11/2026). Os buscadores (Google, Bing) e as prévias de link do WhatsApp
// continuam liberados, para o portfólio seguir sendo encontrado.
const ROBOS_DE_IA = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'FacebookBot',
  'Amazonbot',
  'cohere-ai',
  'Diffbot',
  'img2dataset',
  'omgili',
];

const producao = (site: URL | undefined) =>
  [
    ...ROBOS_DE_IA.map((r) => `User-agent: ${r}\nDisallow: /\n`),
    'User-agent: *\nAllow: /\n',
    `Sitemap: ${new URL('/sitemap.xml', site).href}\n`,
  ].join('\n');

// A prévia (com fotos ainda sem autorização) nunca pode ser indexada.
export const GET: APIRoute = ({ site }) =>
  new Response(PREVIA ? 'User-agent: *\nDisallow: /\n' : producao(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

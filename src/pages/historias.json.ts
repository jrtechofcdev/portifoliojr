import type { APIRoute } from 'astro';
import { dadosHistorias, historiasDoPortfolio } from '../lib/historias';

// Histórias de todos os álbuns, para o visualizador de Stories da home e do portfólio.
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(dadosHistorias(await historiasDoPortfolio())), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

// Escolha das fotos pela modelo: um link secreto por ensaio (/a/<token>), aberto no celular.
// Ela marca cada foto como Destaque, Álbum ou Não quero; tudo vai para o banco D1 na hora.
// O fotógrafo baixa as escolhas com `npm run escolha:baixar` e aplica na /curadoria.
// As prévias das fotos ficam nos assets do Worker (publico/f/<sigla>/<n>.webp) e só saem
// por aqui, depois de conferir o token: com run_worker_first nenhum asset é servido direto.
import { pagina } from './pagina.js';

const LIMITE_DESTAQUES = 7;
const ESTADOS = new Set(['album', 'destaque', 'nao', '']);
const TOKEN = /^[A-Za-z0-9_-]{20,64}$/;

const SEM_ROBOS = { 'x-robots-tag': 'noindex, nofollow, noarchive, noimageindex', 'referrer-policy': 'no-referrer' };

function json(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...SEM_ROBOS },
  });
}

async function album(env, token) {
  if (!TOKEN.test(token)) return null;
  const a = await env.DB.prepare('SELECT sigla, nome, fotos, concluido FROM albuns WHERE token = ?').bind(token).first();
  if (!a) return null;
  return { ...a, fotos: JSON.parse(a.fotos) };
}

async function estados(env, a) {
  const { results } = await env.DB.prepare('SELECT arquivo, estado, quando FROM escolhas WHERE sigla = ?').bind(a.sigla).all();
  const porArquivo = new Map(results.map((r) => [r.arquivo, r]));
  return a.fotos.map((f) => {
    const r = porArquivo.get(f[0]);
    return r ? [r.estado, r.quando] : ['', 0];
  });
}

// Comparação em tempo constante para a chave do fotógrafo.
function mesmaChave(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function admin(req, env, rota) {
  const chave = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!mesmaChave(chave, env.CHAVE_ADMIN)) return json({ erro: 'sem permissão' }, 401);
  const { results: albuns } = await env.DB.prepare('SELECT sigla, token, nome, concluido FROM albuns ORDER BY sigla').all();
  if (rota === 'links') return json(albuns);
  const { results } = await env.DB.prepare('SELECT sigla, arquivo, estado, quando, origem FROM escolhas ORDER BY sigla, quando').all();
  return json(
    albuns.map((a) => ({
      sigla: a.sigla,
      nome: a.nome,
      concluido: a.concluido,
      escolhas: results.filter((r) => r.sigla === a.sigla).map(({ arquivo, estado, quando, origem }) => ({ arquivo, estado, quando, origem })),
    })),
  );
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    let partes = url.pathname.split('/').filter(Boolean);
    // Endereço oficial: portifolio.jrtechofc.com.br/escolha/<token>. A Vercel repassa /escolha/* para cá
    // (vercel.json, rewrites), então a página fica dentro do portfólio. /a/<token> continua valendo.
    let prefixo = '';
    if (partes[0] === 'escolha') {
      prefixo = '/escolha';
      partes = partes.slice(1);
      if (partes[0] && partes[0] !== 'explica') partes = ['a', ...partes];
    }

    if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain' } });
    // Prints do portfólio público que explicam onde cada foto aparece.
    if (partes[0] === 'explica' && partes.length === 2 && /^[\w-]+\.(webp|png)$/.test(partes[1])) {
      const r = await env.ASSETS.fetch(new Request(new URL(`/explica/${partes[1]}`, url)));
      return new Response(r.body, { status: r.status, headers: { 'content-type': r.headers.get('content-type') ?? 'image/webp', 'cache-control': 'public, max-age=86400' } });
    }
    if (partes[0] === 'admin' && req.method === 'GET' && ['escolhas', 'links'].includes(partes[1])) return admin(req, env, partes[1]);

    if (partes[0] !== 'a' || !partes[1]) return new Response('Página não encontrada.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', ...SEM_ROBOS } });
    const a = await album(env, partes[1]);
    if (!a) return new Response('Este link não existe ou foi trocado. Peça um novo ao José Renato.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', ...SEM_ROBOS } });
    const acao = partes[2] ?? '';

    if (acao === '' && req.method === 'GET') {
      return new Response(pagina({ nome: a.nome, limite: LIMITE_DESTAQUES, prefixo }), {
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...SEM_ROBOS },
      });
    }
    if (acao === 'dados' && req.method === 'GET') {
      return json({ nome: a.nome, fotos: a.fotos.map((f) => [f[1], f[2]]), estados: await estados(env, a), concluido: a.concluido, limite: LIMITE_DESTAQUES });
    }
    if (acao === 'f' && req.method === 'GET') {
      const n = Number(partes[3]);
      if (!Number.isInteger(n) || n < 0 || n >= a.fotos.length) return new Response('', { status: 404 });
      const r = await env.ASSETS.fetch(new Request(new URL(`/f/${a.sigla}/${n}.webp`, url)));
      return new Response(r.body, { status: r.status, headers: { 'content-type': 'image/webp', 'cache-control': 'private, max-age=604800', ...SEM_ROBOS } });
    }
    if (acao === 'marcar' && req.method === 'POST') {
      let corpo;
      try {
        corpo = await req.json();
      } catch {
        return json({ erro: 'pedido inválido' }, 400);
      }
      const { n, estado } = corpo ?? {};
      if (!Number.isInteger(n) || n < 0 || n >= a.fotos.length || !ESTADOS.has(estado)) return json({ erro: 'pedido inválido' }, 400);
      const arquivo = a.fotos[n][0];
      if (estado === 'destaque') {
        const { c } = await env.DB.prepare("SELECT count(*) AS c FROM escolhas WHERE sigla = ? AND estado = 'destaque' AND arquivo <> ?").bind(a.sigla, arquivo).first();
        if (c >= LIMITE_DESTAQUES) return json({ erro: 'limite', limite: LIMITE_DESTAQUES }, 409);
      }
      const quando = Date.now();
      await env.DB.prepare(
        "INSERT INTO escolhas (sigla, arquivo, estado, quando, origem) VALUES (?1, ?2, ?3, ?4, 'modelo') ON CONFLICT (sigla, arquivo) DO UPDATE SET estado = ?3, quando = ?4, origem = 'modelo'",
      )
        .bind(a.sigla, arquivo, estado, quando)
        .run();
      return json({ n, estado, quando });
    }
    if (acao === 'concluir' && req.method === 'POST') {
      const quando = new Date().toISOString();
      await env.DB.prepare('UPDATE albuns SET concluido = ? WHERE sigla = ?').bind(quando, a.sigla).run();
      return json({ concluido: quando });
    }
    return json({ erro: 'rota desconhecida' }, 404);
  },
};

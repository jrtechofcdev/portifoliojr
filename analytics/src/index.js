// Estatísticas próprias do portfólio (16/11/2026): coletor de visitas e cliques e o painel do
// fotógrafo. Privacidade primeiro: sem cookies no site, sem guardar IP, sem seguir a pessoa
// de um dia para o outro (o código do visitante usa um sal sorteado por dia e apagado depois).
import { paginaEntrar, paginaPainel } from './painel.js';

const DIA_MS = 86_400_000;
const FUSO_MS = -3 * 3_600_000; // horário do Maranhão (UTC-3, sem horário de verão)
const GUARDAR_DIAS = 400;
const ROBO = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|go-http/i;
const TIPOS = new Set(['ver', 'clique', 'assistente']);

const local = (ts) => new Date(ts + FUSO_MS);
const diaDe = (ts) => local(ts).toISOString().slice(0, 10);
const corta = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');

// ---------------------------------------------------------------------------------------------
// Coletor
// ---------------------------------------------------------------------------------------------
let salCache = null; // { dia, valor } por isolado

async function salDoDia(env, dia) {
  if (salCache?.dia === dia) return salCache.valor;
  let linha = await env.DB.prepare('SELECT valor FROM sais WHERE dia = ?').bind(dia).first();
  if (!linha) {
    const valor = [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, '0')).join('');
    await env.DB.prepare('INSERT OR IGNORE INTO sais (dia, valor) VALUES (?, ?)').bind(dia, valor).run();
    linha = await env.DB.prepare('SELECT valor FROM sais WHERE dia = ?').bind(dia).first();
    // Primeira visita do dia: faz a limpeza diária (eventos antigos, sais e tentativas vencidas).
    await limpar(env);
  }
  salCache = { dia, valor: linha.valor };
  return linha.valor;
}

async function hash(texto) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(b)].slice(0, 10).map((x) => x.toString(16).padStart(2, '0')).join('');
}

function aparelho(ua) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'Tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'Celular';
  return 'Computador';
}
function navegador(ua) {
  if (/Instagram/i.test(ua)) return 'Instagram (app)';
  if (/FBAN|FBAV/i.test(ua)) return 'Facebook (app)';
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Firefox|FxiOS/i.test(ua)) return 'Firefox';
  if (/CriOS|Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  return 'Outro';
}
function sistema(ua) {
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iOS/i.test(ua)) return 'iPhone / iPad';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'Mac';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Outro';
}

/** De onde a pessoa veio, num nome que o fotógrafo reconhece. */
function origem(ref, utm, site) {
  if (utm) {
    const u = utm.toLowerCase();
    if (/insta|ig/.test(u)) return 'Instagram';
    if (/whats|wa\b|zap/.test(u)) return 'WhatsApp';
    if (/face|fb/.test(u)) return 'Facebook';
    return utm.slice(0, 40);
  }
  if (!ref) return 'Direto ou WhatsApp';
  let host = '';
  try {
    host = new URL(ref).hostname.replace(/^www\./, '');
  } catch {
    return 'Outro';
  }
  if (host === new URL(site).hostname) return '';
  if (/instagram\.com$/.test(host)) return 'Instagram';
  if (/(^|\.)(wa\.me|whatsapp\.com)$/.test(host)) return 'WhatsApp';
  if (/facebook\.com$|fb\.com$|fb\.me$/.test(host)) return 'Facebook';
  if (/google\./.test(host)) return 'Google';
  if (/bing\.com$/.test(host)) return 'Bing';
  if (/youtube\.com$|youtu\.be$/.test(host)) return 'YouTube';
  if (/tiktok\.com$/.test(host)) return 'TikTok';
  if (/jrtechofc\.com\.br$/.test(host)) return 'Site Jr_Tech_OFC';
  return host.slice(0, 60);
}

async function coletar(req, env) {
  const cabecalhos = { 'Access-Control-Allow-Origin': env.SITE, Vary: 'Origin' };
  const origemReq = req.headers.get('Origin');
  if (origemReq !== env.SITE) return new Response(null, { status: 403, headers: cabecalhos });
  const ua = req.headers.get('User-Agent') || '';
  if (!ua || ROBO.test(ua)) return new Response(null, { status: 204, headers: cabecalhos });
  let d;
  try {
    const texto = await req.text();
    if (texto.length > 4000) throw new Error('grande');
    d = JSON.parse(texto);
  } catch {
    return new Response(null, { status: 400, headers: cabecalhos });
  }
  const tipo = TIPOS.has(d.t) ? d.t : null;
  const caminho = corta(d.p, 200);
  if (!tipo || !caminho.startsWith('/')) return new Response(null, { status: 400, headers: cabecalhos });

  const ts = Date.now();
  const dia = diaDe(ts);
  const ip = req.headers.get('CF-Connecting-IP') || '';
  const visitante = await hash(`${await salDoDia(env, dia)}|${ip}|${ua}`);
  const cf = req.cf || {};
  // Origem e campanha só contam na primeira página da visita (as outras vêm do próprio site).
  const ori = tipo === 'ver' ? origem(corta(d.r, 400), corta(d.u, 60), env.SITE) : '';
  await env.DB.prepare(
    `INSERT INTO eventos (ts, dia, hora, tipo, nome, rotulo, caminho, origem, campanha, cidade, regiao, pais, aparelho, navegador, sistema, visitante)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      ts,
      dia,
      local(ts).getUTCHours(),
      tipo,
      corta(d.n, 40),
      corta(d.l, 120),
      caminho,
      ori,
      tipo === 'ver' ? corta(d.c, 60) : '',
      corta(cf.city, 60),
      corta(cf.regionCode || cf.region, 30),
      corta(cf.country, 4),
      aparelho(ua),
      navegador(ua),
      sistema(ua),
      visitante,
    )
    .run();
  return new Response(null, { status: 204, headers: cabecalhos });
}

// ---------------------------------------------------------------------------------------------
// Acesso ao painel: senha (segredo SENHA) e sessão assinada num cookie só deste endereço
// ---------------------------------------------------------------------------------------------
const enc = new TextEncoder();
async function assinar(env, texto) {
  const chave = await crypto.subtle.importKey('raw', enc.encode(env.SEGREDO || env.SENHA), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', chave, enc.encode(texto));
  return btoa(String.fromCharCode(...new Uint8Array(s))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' })[c]);
}
async function iguais(env, a, b) {
  const [x, y] = await Promise.all([assinar(env, 'cmp|' + a), assinar(env, 'cmp|' + b)]);
  return x === y;
}
async function logado(req, env) {
  const m = (req.headers.get('Cookie') || '').match(/(?:^|;\s*)painel=([^;]+)/);
  if (!m) return false;
  const [ate, assinatura] = m[1].split('.');
  if (!ate || Number(ate) < Date.now()) return false;
  return (await assinar(env, 'sessao|' + ate)) === assinatura;
}

const SEGURO = {
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
  'Strict-Transport-Security': 'max-age=63072000',
  'Content-Security-Policy':
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
const html = (corpo, status = 200, extra = {}) =>
  new Response(corpo, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...SEGURO, ...extra } });

async function entrar(req, env) {
  const ip = req.headers.get('CF-Connecting-IP') || '';
  const chave = await hash('login|' + ip + '|' + diaDe(Date.now()));
  const agora = Date.now();
  const t = await env.DB.prepare('SELECT n, ate FROM tentativas WHERE chave = ?').bind(chave).first();
  if (t && t.n >= 8 && t.ate > agora) return html(paginaEntrar('Muitas tentativas. Tente de novo daqui a uma hora.'), 429);
  const form = await req.formData();
  const senha = String(form.get('senha') || '');
  if (env.SENHA && senha && (await iguais(env, senha, env.SENHA))) {
    await env.DB.prepare('DELETE FROM tentativas WHERE chave = ?').bind(chave).run();
    const ate = agora + 30 * DIA_MS;
    const cookie = `painel=${ate}.${await assinar(env, 'sessao|' + ate)}; Path=/; Max-Age=${30 * 86400}; HttpOnly; Secure; SameSite=Strict`;
    return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': cookie, ...SEGURO } });
  }
  const n = t && t.ate > agora ? t.n + 1 : 1;
  await env.DB.prepare('INSERT OR REPLACE INTO tentativas (chave, n, ate) VALUES (?, ?, ?)').bind(chave, n, agora + 3_600_000).run();
  await new Promise((r) => setTimeout(r, 600));
  return html(paginaEntrar('Senha incorreta.'), 401);
}

// ---------------------------------------------------------------------------------------------
// Números do painel
// ---------------------------------------------------------------------------------------------
function periodo(url) {
  const hoje = diaDe(Date.now());
  const p = url.searchParams.get('periodo') || '30';
  const n = { hoje: 1, ontem: 1, 7: 7, 30: 30, 90: 90, 365: 365 }[p] ?? 30;
  const fimTs = p === 'ontem' ? Date.parse(hoje) - DIA_MS : Date.parse(hoje);
  const de = new Date(fimTs - (n - 1) * DIA_MS).toISOString().slice(0, 10);
  const ate = new Date(fimTs).toISOString().slice(0, 10);
  const antesAte = new Date(Date.parse(de) - DIA_MS).toISOString().slice(0, 10);
  const antesDe = new Date(Date.parse(antesAte) - (n - 1) * DIA_MS).toISOString().slice(0, 10);
  return { p, n, de, ate, antesDe, antesAte };
}

async function dados(url, env) {
  const { p, n, de, ate, antesDe, antesAte } = periodo(url);
  const db = env.DB;
  const todos = (sql, ...args) => db.prepare(sql).bind(...args).all().then((r) => r.results);
  const um = (sql, ...args) => db.prepare(sql).bind(...args).first();
  const totaisSql = `SELECT
      COUNT(DISTINCT visitante) AS visitantes,
      SUM(tipo = 'ver') AS visualizacoes,
      SUM(tipo = 'clique' AND nome = 'whatsapp') AS whatsapp,
      SUM(tipo = 'clique' AND nome IN ('whatsapp', 'email', 'instagram')) AS contatos,
      COUNT(DISTINCT CASE WHEN tipo = 'clique' AND nome = 'whatsapp' THEN visitante END) AS chamaram,
      SUM(tipo = 'assistente' AND nome = 'abrir') AS assistente
    FROM eventos WHERE dia BETWEEN ? AND ?`;
  const [totais, antes, porDia, paginas, albuns, origens, cliques, cidades, aparelhos, navegadores, sistemas, horas, assistente, agora, campanhas] =
    await Promise.all([
      um(totaisSql, de, ate),
      um(totaisSql, antesDe, antesAte),
      todos(
        `SELECT dia, COUNT(DISTINCT visitante) AS visitantes, SUM(tipo = 'ver') AS visualizacoes,
           SUM(tipo = 'clique' AND nome = 'whatsapp') AS whatsapp
         FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY dia ORDER BY dia`,
        de,
        ate,
      ),
      todos(
        `SELECT caminho AS nome, COUNT(*) AS total, COUNT(DISTINCT visitante) AS pessoas FROM eventos
         WHERE tipo = 'ver' AND dia BETWEEN ? AND ? GROUP BY caminho ORDER BY total DESC LIMIT 15`,
        de,
        ate,
      ),
      todos(
        `SELECT substr(caminho, 12) AS nome, COUNT(*) AS total, COUNT(DISTINCT visitante) AS pessoas FROM eventos
         WHERE tipo = 'ver' AND caminho LIKE '/trabalhos/_%' AND dia BETWEEN ? AND ? GROUP BY caminho ORDER BY total DESC LIMIT 20`,
        de,
        ate,
      ),
      todos(
        `SELECT origem AS nome, COUNT(DISTINCT visitante) AS total FROM eventos
         WHERE tipo = 'ver' AND origem != '' AND dia BETWEEN ? AND ? GROUP BY origem ORDER BY total DESC LIMIT 12`,
        de,
        ate,
      ),
      todos(
        `SELECT nome || CASE WHEN rotulo != '' THEN ' · ' || rotulo ELSE '' END AS nome, COUNT(*) AS total FROM eventos
         WHERE tipo = 'clique' AND dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC LIMIT 20`,
        de,
        ate,
      ),
      todos(
        `SELECT CASE WHEN cidade = '' THEN 'Não identificada' ELSE cidade || CASE WHEN regiao != '' THEN ' (' || regiao || ')' ELSE '' END END AS nome,
           COUNT(DISTINCT visitante) AS total FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC LIMIT 12`,
        de,
        ate,
      ),
      todos(`SELECT aparelho AS nome, COUNT(DISTINCT visitante) AS total FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC`, de, ate),
      todos(`SELECT navegador AS nome, COUNT(DISTINCT visitante) AS total FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC LIMIT 8`, de, ate),
      todos(`SELECT sistema AS nome, COUNT(DISTINCT visitante) AS total FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC`, de, ate),
      todos(`SELECT hora, COUNT(*) AS total FROM eventos WHERE tipo = 'ver' AND dia BETWEEN ? AND ? GROUP BY hora ORDER BY hora`, de, ate),
      todos(
        `SELECT nome, rotulo, COUNT(*) AS total FROM eventos WHERE tipo = 'assistente' AND dia BETWEEN ? AND ?
         GROUP BY nome, rotulo ORDER BY total DESC LIMIT 60`,
        de,
        ate,
      ),
      um(`SELECT COUNT(DISTINCT visitante) AS n FROM eventos WHERE ts > ?`, Date.now() - 30 * 60_000),
      todos(
        `SELECT campanha AS nome, COUNT(DISTINCT visitante) AS total FROM eventos
         WHERE tipo = 'ver' AND campanha != '' AND dia BETWEEN ? AND ? GROUP BY campanha ORDER BY total DESC LIMIT 10`,
        de,
        ate,
      ),
    ]);
  return { periodo: { p, n, de, ate }, totais, antes, porDia, paginas, albuns, origens, cliques, cidades, aparelhos, navegadores, sistemas, horas, assistente, agora: agora?.n ?? 0, campanhas };
}

// ---------------------------------------------------------------------------------------------
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/e') {
      if (req.method === 'POST') return coletar(req, env);
      if (req.method === 'OPTIONS')
        return new Response(null, {
          status: 204,
          headers: { 'Access-Control-Allow-Origin': env.SITE, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Max-Age': '86400' },
        });
      return new Response(null, { status: 405 });
    }
    if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain' } });
    if (url.pathname === '/entrar' && req.method === 'POST') return entrar(req, env);
    if (url.pathname === '/sair')
      return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': 'painel=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict', ...SEGURO } });
    if (!(await logado(req, env))) {
      if (url.pathname.startsWith('/api/')) return new Response('{}', { status: 401, headers: { 'Content-Type': 'application/json', ...SEGURO } });
      return html(paginaEntrar());
    }
    if (url.pathname === '/api/dados') return new Response(JSON.stringify(await dados(url, env)), { headers: { 'Content-Type': 'application/json', ...SEGURO } });
    if (url.pathname === '/') return html(paginaPainel(env.SITE));
    return html('<p>Página não encontrada.</p>', 404);
  },

};

/** Apaga eventos com mais de 13 meses, os sais de antes de ontem e as tentativas vencidas. */
async function limpar(env) {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM eventos WHERE ts < ?').bind(Date.now() - GUARDAR_DIAS * DIA_MS),
    env.DB.prepare('DELETE FROM sais WHERE dia < ?').bind(diaDe(Date.now() - DIA_MS)),
    env.DB.prepare('DELETE FROM tentativas WHERE ate < ?').bind(Date.now()),
  ]);
}

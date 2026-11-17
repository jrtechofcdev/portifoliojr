// Estatísticas próprias do portfólio (16/11/2026; aparelhos, ao vivo, análise e previsão em
// 17/11/2026): coletor de visitas e cliques e o painel do fotógrafo.
// Cada aparelho recebe um código aleatório guardado no navegador (sem nome, telefone ou IP), para
// contar quantas vezes ele volta e o que faz. Uma "entrada" é uma sessão: termina depois de 30
// minutos sem atividade. Sem o código (navegador que bloqueia o armazenamento), o aparelho é
// identificado por um código do dia (sal sorteado e apagado depois), como antes.
import { paginaEntrar, paginaPainel } from './painel.js';
import { analisar, previsao, resumoMarkdown } from './analise.js';

const DIA_MS = 86_400_000;
const FUSO_MS = -3 * 3_600_000; // horário do Maranhão (UTC-3, sem horário de verão)
const GUARDAR_DIAS = 400;
const ROBO = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|go-http/i;
const TIPOS = new Set(['ver', 'clique', 'assistente']);
const CODIGO = /^[a-z0-9]{12,40}$/;

const local = (ts) => new Date(ts + FUSO_MS);
const diaDe = (ts) => local(ts).toISOString().slice(0, 10);
const corta = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
/** Sessão de um evento; eventos antigos (sem sessão) contam uma por aparelho e dia. */
const SESSAO = "COALESCE(NULLIF(sessao, ''), visitante || dia)";
/** A mesma sessão, para consultas com a tabela de eventos apelidada de v. */
const SV = "COALESCE(NULLIF(v.sessao, ''), v.visitante || v.dia)";

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
    if (/insta|^ig$/.test(u)) return 'Instagram';
    if (/whats|^wa$|zap/.test(u)) return 'WhatsApp';
    if (/face|^fb$/.test(u)) return 'Facebook';
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
  if (req.headers.get('Origin') !== env.SITE) return new Response(null, { status: 403, headers: cabecalhos });
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
  const codigo = typeof d.d === 'string' && CODIGO.test(d.d) ? d.d : null;
  const visitante = codigo ?? (await hash(`${await salDoDia(env, dia)}|${req.headers.get('CF-Connecting-IP') || ''}|${ua}`));
  if (codigo && salCache?.dia !== dia) await salDoDia(env, dia); // mantém a limpeza diária
  const sessao = typeof d.s === 'string' && CODIGO.test(d.s) ? d.s : '';
  const cf = req.cf || {};
  // Origem e campanha só contam na primeira página da visita (as outras vêm do próprio site).
  const ori = tipo === 'ver' ? origem(corta(d.r, 400), corta(d.u, 60), env.SITE) : '';
  // Nas páginas vistas, o rótulo é o capítulo do álbum (ensaio, casal, festa, evento).
  const rotulo = tipo === 'ver' ? (/^[a-z]{3,12}$/.test(d.g || '') ? d.g : '') : corta(d.l, 120);
  await env.DB.prepare(
    `INSERT INTO eventos (ts, dia, hora, tipo, nome, rotulo, caminho, origem, campanha, cidade, regiao, pais, aparelho, navegador, sistema, visitante, sessao, novo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      ts,
      dia,
      local(ts).getUTCHours(),
      tipo,
      corta(d.n, 40),
      rotulo,
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
      sessao,
      d.novo === 1 ? 1 : 0,
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
const json = (dados, status = 200) => new Response(JSON.stringify(dados), { status, headers: { 'Content-Type': 'application/json', ...SEGURO } });

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

const consultas = (db) => ({
  todos: (sql, ...args) => db.prepare(sql).bind(...args).all().then((r) => r.results),
  um: (sql, ...args) => db.prepare(sql).bind(...args).first(),
});

const TOTAIS = `SELECT
    COUNT(DISTINCT visitante) AS visitantes,
    COUNT(DISTINCT ${SESSAO}) AS entradas,
    SUM(tipo = 'ver') AS visualizacoes,
    SUM(tipo = 'clique') AS cliques,
    SUM(tipo = 'clique' AND nome = 'whatsapp') AS whatsapp,
    SUM(tipo = 'clique' AND nome IN ('whatsapp', 'email', 'instagram', 'telefone')) AS contatos,
    COUNT(DISTINCT CASE WHEN tipo = 'clique' AND nome = 'whatsapp' THEN visitante END) AS chamaram,
    COUNT(DISTINCT CASE WHEN tipo = 'clique' AND nome = 'whatsapp' THEN ${SESSAO} END) AS entradasConv,
    COUNT(DISTINCT CASE WHEN novo = 1 THEN visitante END) AS novos,
    SUM(tipo = 'assistente' AND nome = 'abrir') AS assistente
  FROM eventos WHERE dia BETWEEN ? AND ?`;

async function dados(url, env) {
  const { p, n, de, ate, antesDe, antesAte } = periodo(url);
  const { todos, um } = consultas(env.DB);
  const [totais, antes, voltaram, porDia, paginas, albuns, origens, cliques, cidades, aparelhos, navegadores, sistemas, horas, assistente, agora, campanhas] =
    await Promise.all([
      um(TOTAIS, de, ate),
      um(TOTAIS, antesDe, antesAte),
      um(
        `SELECT COUNT(*) AS n FROM (SELECT visitante FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY visitante HAVING COUNT(DISTINCT ${SESSAO}) > 1)`,
        de,
        ate,
      ),
      todos(
        `SELECT dia, COUNT(DISTINCT visitante) AS visitantes, COUNT(DISTINCT ${SESSAO}) AS entradas, SUM(tipo = 'ver') AS visualizacoes,
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
        `SELECT origem AS nome, COUNT(DISTINCT ${SESSAO}) AS total FROM eventos
         WHERE tipo = 'ver' AND origem != '' AND dia BETWEEN ? AND ? GROUP BY origem ORDER BY total DESC LIMIT 12`,
        de,
        ate,
      ),
      todos(
        `SELECT nome || CASE WHEN rotulo != '' THEN ' · ' || rotulo ELSE '' END AS nome, COUNT(*) AS total, COUNT(DISTINCT visitante) AS pessoas FROM eventos
         WHERE tipo = 'clique' AND dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC LIMIT 25`,
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
      um(`SELECT COUNT(DISTINCT visitante) AS n FROM eventos WHERE ts > ?`, Date.now() - 5 * 60_000),
      todos(
        `SELECT campanha AS nome, COUNT(DISTINCT ${SESSAO}) AS total FROM eventos
         WHERE tipo = 'ver' AND campanha != '' AND dia BETWEEN ? AND ? GROUP BY campanha ORDER BY total DESC LIMIT 10`,
        de,
        ate,
      ),
    ]);
  return {
    periodo: { p, n, de, ate },
    totais: { ...totais, voltaram: voltaram?.n ?? 0 },
    antes,
    porDia,
    paginas,
    albuns,
    origens,
    cliques,
    cidades,
    aparelhos,
    navegadores,
    sistemas,
    horas,
    assistente,
    agora: agora?.n ?? 0,
    campanhas,
  };
}

/** Ao vivo: os últimos eventos e quem está no site agora (últimos 5 minutos). */
async function aoVivo(env) {
  const { todos } = consultas(env.DB);
  const limite = Date.now() - 5 * 60_000;
  const [eventos, ativos] = await Promise.all([
    todos(
      `SELECT ts, tipo, nome, rotulo, caminho, origem, campanha, cidade, aparelho, sistema, navegador, visitante, novo
       FROM eventos ORDER BY ts DESC LIMIT 80`,
    ),
    todos(
      `SELECT visitante, MAX(ts) AS ultimo, aparelho, sistema, cidade,
         (SELECT caminho FROM eventos e2 WHERE e2.visitante = e.visitante AND e2.tipo = 'ver' ORDER BY ts DESC LIMIT 1) AS pagina
       FROM eventos e WHERE ts > ? GROUP BY visitante ORDER BY ultimo DESC LIMIT 30`,
      limite,
    ),
  ]);
  return { agora: Date.now(), eventos, ativos };
}

/** Aparelhos do período: quantas entradas, páginas e cliques cada um fez. */
async function aparelhosDoPeriodo(url, env) {
  const { de, ate } = periodo(url);
  const { todos } = consultas(env.DB);
  const lista = await todos(
    `SELECT visitante,
       MIN(ts) AS primeiro, MAX(ts) AS ultimo,
       COUNT(DISTINCT ${SESSAO}) AS entradas,
       SUM(tipo = 'ver') AS paginas,
       SUM(tipo = 'clique') AS cliques,
       SUM(tipo = 'clique' AND nome = 'whatsapp') AS whatsapp,
       SUM(tipo = 'clique' AND nome = 'album') + COUNT(DISTINCT CASE WHEN tipo = 'ver' AND caminho LIKE '/trabalhos/_%' THEN caminho END) AS albuns,
       MAX(novo) AS novo,
       MAX(aparelho) AS aparelho, MAX(sistema) AS sistema, MAX(navegador) AS navegador,
       (SELECT cidade FROM eventos e2 WHERE e2.visitante = e.visitante ORDER BY ts DESC LIMIT 1) AS cidade,
       (SELECT origem FROM eventos e3 WHERE e3.visitante = e.visitante AND e3.origem != '' ORDER BY ts LIMIT 1) AS origem
     FROM eventos e WHERE dia BETWEEN ? AND ?
     GROUP BY visitante ORDER BY ultimo DESC LIMIT 200`,
    de,
    ate,
  );
  return { periodo: { de, ate }, lista };
}

/** Linha do tempo de um aparelho: todos os eventos, do mais recente ao mais antigo. */
async function linhaDoTempo(url, env) {
  const id = url.searchParams.get('id') || '';
  if (!/^[a-z0-9]{8,40}$/.test(id)) return { eventos: [] };
  const { todos } = consultas(env.DB);
  const eventos = await todos(
    `SELECT ts, dia, tipo, nome, rotulo, caminho, origem, campanha, cidade, aparelho, sistema, navegador, ${SESSAO} AS sessao
     FROM eventos WHERE visitante = ? ORDER BY ts DESC LIMIT 600`,
    id,
  );
  return { eventos };
}

/** Dados para a análise automática e o resumo: tudo agregado no banco, pouco cálculo no Worker. */
async function dadosAnalise(url, env) {
  const per = periodo(url);
  const { de, ate } = per;
  const { todos, um } = consultas(env.DB);
  const CONV = `(SELECT DISTINCT ${SESSAO} AS s FROM eventos WHERE tipo = 'clique' AND nome = 'whatsapp' AND dia BETWEEN ?1 AND ?2)`;
  const historicoDe = new Date(Date.parse(diaDe(Date.now())) - 89 * DIA_MS).toISOString().slice(0, 10);
  const [totais, antes, voltaramSemChamar, areas, albuns, origens, campanhas, fluxos, ondeWhats, horas, semana, assistente, aparelhos, historico] =
    await Promise.all([
      um(TOTAIS, de, ate),
      um(TOTAIS, per.antesDe, per.antesAte),
      um(
        `SELECT COUNT(*) AS n FROM (SELECT visitante FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY visitante
           HAVING COUNT(DISTINCT ${SESSAO}) > 1 AND SUM(tipo = 'clique' AND nome = 'whatsapp') = 0)`,
        de,
        ate,
      ),
      todos(
        `SELECT v.rotulo AS nome, COUNT(DISTINCT ${SV}) AS entradas,
           COUNT(*) AS visualizacoes, COUNT(DISTINCT c.s) AS converteram
         FROM eventos v LEFT JOIN ${CONV} c ON c.s = ${SV}
         WHERE v.tipo = 'ver' AND v.rotulo != '' AND v.dia BETWEEN ?1 AND ?2 GROUP BY v.rotulo ORDER BY entradas DESC`,
        de,
        ate,
      ),
      todos(
        `SELECT substr(v.caminho, 12) AS nome, COUNT(DISTINCT ${SV}) AS entradas,
           COUNT(*) AS visualizacoes, COUNT(DISTINCT c.s) AS converteram
         FROM eventos v LEFT JOIN ${CONV} c ON c.s = ${SV}
         WHERE v.tipo = 'ver' AND v.caminho LIKE '/trabalhos/_%' AND v.dia BETWEEN ?1 AND ?2 GROUP BY v.caminho ORDER BY entradas DESC LIMIT 15`,
        de,
        ate,
      ),
      todos(
        `SELECT v.origem AS nome, COUNT(DISTINCT ${SV}) AS entradas,
           COUNT(DISTINCT c.s) AS converteram
         FROM eventos v LEFT JOIN ${CONV} c ON c.s = ${SV}
         WHERE v.tipo = 'ver' AND v.origem != '' AND v.dia BETWEEN ?1 AND ?2 GROUP BY v.origem ORDER BY entradas DESC LIMIT 10`,
        de,
        ate,
      ),
      todos(
        `SELECT v.campanha AS nome, COUNT(DISTINCT ${SV}) AS entradas,
           COUNT(DISTINCT c.s) AS converteram
         FROM eventos v LEFT JOIN ${CONV} c ON c.s = ${SV}
         WHERE v.tipo = 'ver' AND v.campanha != '' AND v.dia BETWEEN ?1 AND ?2 GROUP BY v.campanha ORDER BY entradas DESC LIMIT 10`,
        de,
        ate,
      ),
      todos(
        `WITH ord AS (
           SELECT ${SESSAO} AS s, caminho, ROW_NUMBER() OVER (PARTITION BY ${SESSAO} ORDER BY ts) AS n
           FROM eventos WHERE tipo = 'ver' AND dia BETWEEN ?1 AND ?2
         ),
         f AS (SELECT s, group_concat(caminho, ' > ') AS fluxo, COUNT(*) AS paginas FROM (SELECT * FROM ord WHERE n <= 5 ORDER BY s, n) GROUP BY s)
         SELECT fluxo, COUNT(*) AS entradas, COUNT(c.s) AS converteram FROM f LEFT JOIN ${CONV} c ON c.s = f.s
         GROUP BY fluxo ORDER BY entradas DESC, converteram DESC LIMIT 12`,
        de,
        ate,
      ),
      todos(
        `SELECT CASE WHEN rotulo = '' THEN 'sem lugar' ELSE rotulo END AS nome, COUNT(*) AS total FROM eventos
         WHERE tipo = 'clique' AND nome = 'whatsapp' AND dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC LIMIT 10`,
        de,
        ate,
      ),
      todos(
        `SELECT hora, COUNT(DISTINCT ${SESSAO}) AS entradas FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY hora ORDER BY hora`,
        de,
        ate,
      ),
      todos(
        `SELECT CAST(strftime('%w', dia) AS INTEGER) AS dow, COUNT(DISTINCT ${SESSAO}) AS entradas, COUNT(DISTINCT dia) AS dias FROM eventos
         WHERE dia BETWEEN ? AND ? GROUP BY dow ORDER BY dow`,
        de,
        ate,
      ),
      todos(
        `SELECT nome, rotulo, COUNT(*) AS total FROM eventos WHERE tipo = 'assistente' AND dia BETWEEN ? AND ?
         GROUP BY nome, rotulo ORDER BY total DESC LIMIT 60`,
        de,
        ate,
      ),
      todos(`SELECT aparelho AS nome, COUNT(DISTINCT visitante) AS total FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY 1 ORDER BY total DESC`, de, ate),
      todos(
        `SELECT dia, COUNT(DISTINCT visitante) AS visitantes, SUM(tipo = 'clique' AND nome = 'whatsapp') AS whatsapp
         FROM eventos WHERE dia BETWEEN ? AND ? GROUP BY dia ORDER BY dia`,
        historicoDe,
        diaDe(Date.now()),
      ),
    ]);
  const base = {
    periodo: { p: per.p, n: per.n, de, ate },
    totais,
    antes,
    voltaramSemChamar: voltaramSemChamar?.n ?? 0,
    areas,
    albuns,
    origens,
    campanhas,
    fluxos,
    ondeWhats,
    horas,
    semana,
    assistente,
    aparelhos,
  };
  const prev = previsao(historico, diaDe(Date.now()));
  return { ...base, previsao: prev, leitura: analisar(base, prev) };
}

async function limparTudo(req, env) {
  let corpo = {};
  try {
    corpo = await req.json();
  } catch {}
  if (corpo.confirmar !== 'LIMPAR') return json({ ok: false, erro: 'confirmação' }, 400);
  await env.DB.batch([env.DB.prepare('DELETE FROM eventos'), env.DB.prepare('DELETE FROM sais')]);
  salCache = null;
  return json({ ok: true });
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
      if (url.pathname.startsWith('/api/')) return json({}, 401);
      return html(paginaEntrar());
    }
    switch (url.pathname) {
      case '/':
        return html(paginaPainel(env.SITE));
      case '/api/dados':
        return json(await dados(url, env));
      case '/api/aovivo':
        return json(await aoVivo(env));
      case '/api/aparelhos':
        return json(await aparelhosDoPeriodo(url, env));
      case '/api/aparelho':
        return json(await linhaDoTempo(url, env));
      case '/api/analise':
        return json(await dadosAnalise(url, env));
      case '/api/resumo.md': {
        const d = await dadosAnalise(url, env);
        const nome = `resumo-portfolio-${d.periodo.de}-a-${d.periodo.ate}.md`;
        return new Response(resumoMarkdown(d, env.SITE), {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Content-Disposition': `attachment; filename="${nome}"`, ...SEGURO },
        });
      }
      case '/api/limpar':
        if (req.method !== 'POST' || !(req.headers.get('Content-Type') || '').includes('application/json')) return json({ ok: false }, 405);
        return limparTudo(req, env);
    }
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

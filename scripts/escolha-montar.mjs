// Monta e publica no Cloudflare a escolha das fotos pelas modelos (pasta escolha/).
// Pré-requisito, uma vez só: `npx wrangler login` (abre o navegador para autorizar).
//
//   node scripts/escolha-montar.mjs            prepara, cria o banco se faltar e publica
//   node scripts/escolha-montar.mjs --local    só prepara os arquivos (sem Cloudflare)
//
// O que faz:
// 1. Cria o banco D1 "jr-escolha" (se ainda não existe) e grava o id em escolha/wrangler.jsonc.
// 2. Aplica escolha/esquema.sql.
// 3. Copia as prévias de .cache/miniaturas para escolha/publico/f/<sigla>/<n>.webp (fora do Git).
// 4. Cadastra um link secreto por ensaio. Links que já existem no banco são mantidos.
//    As fotos que já estão no portfólio entram marcadas como "Álbum" (só na primeira vez).
// 5. Cria a chave do fotógrafo (CHAVE_ADMIN no Worker, ESCOLHA_CHAVE no .env) se faltar.
// 6. Publica o Worker e grava os links em ESCOLHA_LINKS.txt (fora do Git).
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { lerManifestos, NOVAS, RAIZ } from './curadoria-lib.mjs';

const DIR = path.join(RAIZ, 'escolha');
const CONFIG = path.join(DIR, 'wrangler.jsonc');
const PUBLICO_F = path.join(DIR, 'publico/f');
const MINI = path.join(RAIZ, '.cache/miniaturas');
const ENV = path.join(RAIZ, '.env');
const BANCO = 'jr-escolha';
const DOMINIO = 'escolha.jrtechofc.com.br';
const local = process.argv.includes('--local');

function wrangler(args, { entrada, json = false, falhaOk = false } = {}) {
  const r = spawnSync('npx', ['--yes', 'wrangler@4', ...args.map((a) => (process.platform === 'win32' && /\s/.test(a) ? '"' + a + '"' : a))], { cwd: DIR, input: entrada, encoding: 'utf8', shell: process.platform === 'win32', maxBuffer: 64 * 1024 * 1024 });
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  if (r.status !== 0 && !falhaOk) {
    console.error(saida);
    if (/not authenticated|wrangler login|Authentication error/i.test(saida)) console.error('\nFalta autorizar o Cloudflare neste computador: rode  npx wrangler login');
    throw new Error(`wrangler ${args.slice(0, 3).join(' ')} falhou`);
  }
  if (json) return JSON.parse(r.stdout.slice(r.stdout.indexOf('[')));
  return { ok: r.status === 0, saida };
}

const sql = (v) => (v === null || v === undefined ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

async function lerEnv() {
  const env = {};
  if (existsSync(ENV)) for (const l of (await readFile(ENV, 'utf8')).split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}
async function gravarEnv(chave, valor) {
  const atual = existsSync(ENV) ? await readFile(ENV, 'utf8') : '';
  const linhas = atual.split(/\r?\n/).filter((l) => l && !l.startsWith(chave + '='));
  linhas.push(`${chave}=${valor}`);
  await writeFile(ENV, linhas.join('\n') + '\n');
}

// --- 1 e 2: banco ---
let tokens = {};
if (!local) {
  const quem = wrangler(['whoami'], { falhaOk: true });
  if (!quem.ok || /not authenticated/i.test(quem.saida)) {
    console.error('O Cloudflare ainda não está autorizado neste computador. Rode  npx wrangler login  e depois este script de novo.');
    process.exit(1);
  }
  const bancos = wrangler(['d1', 'list', '--json'], { json: true });
  let id = bancos.find((b) => b.name === BANCO)?.uuid;
  if (!id) {
    const { saida } = wrangler(['d1', 'create', BANCO, '--location', 'enam']);
    id = saida.match(/"database_id"\s*:\s*"([0-9a-f-]{36})"/)?.[1] ?? saida.match(/database_id\s*=\s*"([0-9a-f-]{36})"/)?.[1];
    if (!id) throw new Error('Não achei o id do banco na resposta:\n' + saida);
    console.log('Banco criado:', id);
  }
  const cfg = await readFile(CONFIG, 'utf8');
  await writeFile(CONFIG, cfg.replace(/"database_id": "[^"]*"/, `"database_id": "${id}"`));
  wrangler(['d1', 'execute', BANCO, '--remote', '--yes', '--file', 'esquema.sql']);
  const r = wrangler(['d1', 'execute', BANCO, '--remote', '--json', '--command', 'SELECT sigla, token FROM albuns'], { json: true });
  for (const { sigla, token } of r[0]?.results ?? []) tokens[sigla] = token;
}

// --- 3 e 4: prévias e cadastro ---
const indice = JSON.parse(await readFile(path.join(MINI, 'indice.json'), 'utf8'));
const pastas = JSON.parse(await readFile(path.join(RAIZ, 'src/data/pastas.json'), 'utf8'));
const manifestos = await lerManifestos();
await rm(PUBLICO_F, { recursive: true, force: true });
const comandos = [];
const albuns = [];
for (const sigla of Object.keys(pastas)) {
  const lista = indice[sigla] ?? [];
  if (!lista.length) continue;
  const m = manifestos[sigla];
  const nome = m?.m.nome ?? NOVAS[sigla]?.nome ?? sigla;
  await mkdir(path.join(PUBLICO_F, sigla), { recursive: true });
  for (const [i, f] of lista.entries()) await copyFile(path.join(MINI, sigla, f.mini), path.join(PUBLICO_F, sigla, `${i}.webp`));
  const token = (tokens[sigla] ??= randomBytes(18).toString('base64url'));
  const fotos = lista.map((f) => [f.arquivo.normalize('NFC'), f.w, f.h]);
  comandos.push(
    `INSERT INTO albuns (sigla, token, nome, fotos) VALUES (${sql(sigla)}, ${sql(token)}, ${sql(nome)}, ${sql(JSON.stringify(fotos))}) ON CONFLICT (sigla) DO UPDATE SET nome = excluded.nome, fotos = excluded.fotos;`,
  );
  const noSite = m && !m.fora ? m.m.fotos.map((f) => f.arquivo.normalize('NFC')) : [];
  for (const arquivo of noSite) comandos.push(`INSERT OR IGNORE INTO escolhas (sigla, arquivo, estado, quando, origem) VALUES (${sql(sigla)}, ${sql(arquivo)}, 'album', 0, 'site');`);
  albuns.push({ sigla, nome, token, fotos: fotos.length, noSite: noSite.length });
}
await writeFile(path.join(DIR, '.semente.sql'), comandos.join('\n') + '\n');
console.log(`Prévias: ${albuns.reduce((s, a) => s + a.fotos, 0)} fotos de ${albuns.length} ensaios em escolha/publico/f`);
if (local) process.exit(0);

wrangler(['d1', 'execute', BANCO, '--remote', '--yes', '--file', '.semente.sql']);

// --- 5: chave do fotógrafo ---
const env = await lerEnv();
if (!env.ESCOLHA_CHAVE) {
  const chave = randomBytes(24).toString('base64url');
  wrangler(['secret', 'put', 'CHAVE_ADMIN'], { entrada: chave });
  await gravarEnv('ESCOLHA_CHAVE', chave);
  console.log('Chave do fotógrafo criada e guardada no .env (ESCOLHA_CHAVE).');
}

// --- 6: publicação (tenta o endereço próprio; se o domínio não estiver nesta conta, fica no workers.dev) ---
const cfg = (await readFile(CONFIG, 'utf8')).replace(/,\n  "routes": \[[^\n]*\]/, '');
const comDominio = cfg.replace(/\n}\s*$/, `,\n  "routes": [{ "pattern": "${DOMINIO}", "custom_domain": true }]\n}\n`);
await writeFile(CONFIG, comDominio);
let pub = wrangler(['deploy'], { falhaOk: true });
let base = `https://${DOMINIO}`;
if (!pub.ok) {
  console.warn('Não deu para usar o endereço ' + DOMINIO + '. Publicando no endereço workers.dev.\n' + pub.saida.slice(-800));
  await writeFile(CONFIG, cfg);
  pub = wrangler(['deploy']);
  base = pub.saida.match(/https:\/\/[\w.-]+\.workers\.dev/)?.[0];
  if (!base) throw new Error('Publicado, mas não achei o endereço na resposta:\n' + pub.saida);
}
// Com o domínio funcionando, a rota fica no wrangler.jsonc para as próximas publicações.
await gravarEnv('ESCOLHA_URL', base);

const linhas = [
  'LINKS DA ESCOLHA DAS FOTOS (um por ensaio). Não publique: quem tem o link vê todas as fotos do ensaio.',
  `Atualizado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })}`,
  '',
  ...albuns.map((a) => `${a.nome} (${a.fotos} fotos, ${a.noSite} já no site)\n   ${base}/a/${a.token}\n`),
];
await writeFile(path.join(RAIZ, 'ESCOLHA_LINKS.txt'), linhas.join('\n'));
console.log(`\nPublicado em ${base}. Links em ESCOLHA_LINKS.txt.`);

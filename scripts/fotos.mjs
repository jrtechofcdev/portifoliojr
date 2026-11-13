// Gera as versões web das fotos listadas nos manifestos de src/content/ensaios.
// Os originais em "Fotos Para Potifolio/" são só lidos: nunca escritos, movidos ou renomeados.
//
// Uso:
//   node scripts/fotos.mjs              desenvolvimento: inclui fotos com autorização pendente
//   node scripts/fotos.mjs --producao   só fotos com autorizacao: sim
//
// Saídas (todas ignoradas pelo git):
//   .cache/fotos/          derivados de todas as fotos já processadas (reaproveitados entre execuções)
//   public/fotos/<slug>/   cópia só dos derivados que entram nesta execução
//   src/generated/fotos.json   dimensões, srcset, LQIP e cor de cada foto incluída

import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import YAML from 'yaml';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGINAIS = path.join(RAIZ, 'Fotos Para Potifolio');
// As variáveis FOTOS_* só existem para o teste de bloqueio (scripts/testar-bloqueio.mjs).
const MANIFESTOS = process.env.FOTOS_MANIFESTOS ?? path.join(RAIZ, 'src/content/ensaios');
const CACHE = path.join(RAIZ, '.cache/fotos');
const PUBLICO = process.env.FOTOS_PUBLICO ?? path.join(RAIZ, 'public/fotos');
const SAIDA_JSON = process.env.FOTOS_JSON ?? path.join(RAIZ, 'src/generated/fotos.json');

// Pensado para celular Android: 1800 px cobre a tela cheia de qualquer aparelho com folga.
// Só AVIF e WebP: todo navegador atual lê os dois, e o repositório fica menor (as fotos vão no Git para a Vercel).
const LARGURAS = [480, 800, 1200, 1800];
const FORMATOS = {
  avif: (img) => img.avif({ quality: 52, effort: 3 }),
  webp: (img) => img.webp({ quality: 74 }),
};

const producao = process.argv.includes('--producao');
const pastas = JSON.parse(await readFile(path.join(RAIZ, 'src/data/pastas.json'), 'utf8'));

// Nomes no disco misturam NFC e NFD (ex.: "ANIVERSÁRIO IRENILDE -025.jpg").
// Compara sempre em NFC e devolve o nome exatamente como está no disco.
const cacheDir = new Map();
async function resolverNoDisco(dir, nome) {
  if (!cacheDir.has(dir)) {
    const itens = await readdir(dir);
    cacheDir.set(dir, new Map(itens.map((n) => [n.normalize('NFC'), n])));
  }
  return cacheDir.get(dir).get(nome.normalize('NFC')) ?? null;
}

function slugArquivo(nome) {
  return path
    .parse(nome)
    .name.normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const erros = [];
const entradas = [];

for (const arq of (await readdir(MANIFESTOS)).filter((f) => f.endsWith('.yaml')).sort()) {
  const slug = path.parse(arq).name;
  const m = YAML.parse(await readFile(path.join(MANIFESTOS, arq), 'utf8'));
  const pasta = pastas[m.pasta];
  if (!pasta) {
    erros.push(`${arq}: sigla de pasta desconhecida "${m.pasta}"`);
    continue;
  }
  const dirPasta = path.join(ORIGINAIS, (await resolverNoDisco(ORIGINAIS, pasta)) ?? pasta);
  for (const foto of m.fotos ?? []) {
    const nomeDisco = existsSync(dirPasta) ? await resolverNoDisco(dirPasta, foto.arquivo) : null;
    if (!nomeDisco) {
      erros.push(`${arq}: arquivo não encontrado em ${m.pasta}: "${foto.arquivo}"`);
      continue;
    }
    const autorizacao = foto.autorizacao ?? m.autorizacao;
    const abertura = m.abertura?.arquivo === foto.arquivo;
    entradas.push({
      og: abertura ? (m.abertura.foco ?? '50% 50%') : null,
      chave: `${slug}/${foto.arquivo.normalize('NFC')}`,
      slug,
      origem: path.join(dirPasta, nomeDisco),
      nome: slugArquivo(foto.arquivo),
      autorizada: autorizacao === 'sim',
    });
  }
}

if (erros.length) {
  console.error('fotos: manifesto inválido\n  ' + erros.join('\n  '));
  process.exit(1);
}

const incluidas = entradas.filter((e) => !producao || e.autorizada);
console.log(
  `fotos: ${entradas.length} no manifesto, ${incluidas.length} incluídas (${producao ? 'produção' : 'desenvolvimento'})`,
);

async function processar(e) {
  const info = await stat(e.origem);
  const id = createHash('sha1')
    .update(`${e.origem.normalize('NFC')}|${info.size}|${info.mtimeMs}|${JSON.stringify(LARGURAS)}|v2`)
    .digest('hex')
    .slice(0, 12);
  const dirCache = path.join(CACHE, id);
  const meta = path.join(dirCache, 'meta.json');

  if (!existsSync(meta)) {
    await mkdir(dirCache, { recursive: true });
    // rotate() aplica a orientação do EXIF; a saída do sharp não leva metadados (EXIF, GPS).
    const base = sharp(e.origem, { failOn: 'error' }).rotate();
    const md = await sharp(e.origem).metadata();
    const girada = (md.orientation ?? 1) >= 5;
    const width = girada ? md.height : md.width;
    const height = girada ? md.width : md.height;
    const larguras = LARGURAS.filter((w) => w < width);
    if (width <= LARGURAS.at(-1)) larguras.push(width);
    const arquivos = [];
    for (const w of [...new Set(larguras)]) {
      const redim = base.clone().resize({ width: w, withoutEnlargement: true });
      for (const [ext, codificar] of Object.entries(FORMATOS)) {
        const nome = `${w}.${ext}`;
        await codificar(redim.clone()).toFile(path.join(dirCache, nome));
        arquivos.push(nome);
      }
    }
    const lqip = await base.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
    const { dominant } = await base.clone().stats();
    const cor = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');
    await writeFile(
      meta,
      JSON.stringify({ width, height, larguras: [...new Set(larguras)], cor, lqip: `data:image/webp;base64,${lqip.toString('base64')}` }),
    );
  }

  const dados = JSON.parse(await readFile(meta, 'utf8'));
  const destino = path.join(PUBLICO, e.slug);
  await mkdir(destino, { recursive: true });
  const srcset = {};
  for (const ext of Object.keys(FORMATOS)) {
    srcset[ext] = [];
    for (const w of dados.larguras) {
      if (!existsSync(path.join(dirCache, `${w}.${ext}`))) continue;
      const nome = `${e.nome}-${w}.${ext}`;
      const alvo = path.join(destino, nome);
      if (!existsSync(alvo)) await copyFile(path.join(dirCache, `${w}.${ext}`), alvo);
      srcset[ext].push(`/fotos/${e.slug}/${nome} ${w}w`);
    }
  }
  // Formato padrão do <img>: WebP (todo navegador atual, Android inclusive). Sem JPEG publicado.
  const padrao = dados.larguras.filter((w) => w <= 1200).at(-1) ?? dados.larguras[0];
  const maior = dados.larguras.at(-1);

  // Imagem de compartilhamento (Open Graph) 1200x630, recortada no ponto focal da abertura.
  let og;
  if (e.og) {
    const cacheOg = path.join(dirCache, `og-${e.og.replace(/[^0-9]+/g, '-')}.jpg`);
    if (!existsSync(cacheOg)) {
      const [fx, fy] = e.og.split(' ').map((v) => parseFloat(v) / 100);
      const escala = Math.max(1200 / dados.width, 630 / dados.height);
      const rw = Math.round(dados.width * escala);
      const rh = Math.round(dados.height * escala);
      await sharp(e.origem)
        .rotate()
        .resize(rw, rh)
        .extract({ left: Math.round((rw - 1200) * fx), top: Math.round((rh - 630) * fy), width: 1200, height: 630 })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(cacheOg);
    }
    await copyFile(cacheOg, path.join(destino, `${e.nome}-og.jpg`));
    og = `/fotos/${e.slug}/${e.nome}-og.jpg`;
  }

  return [
    e.chave,
    {
      width: dados.width,
      height: dados.height,
      cor: dados.cor,
      lqip: dados.lqip,
      autorizada: e.autorizada,
      src: `/fotos/${e.slug}/${e.nome}-${padrao}.webp`,
      grande: `/fotos/${e.slug}/${e.nome}-${maior}.webp`,
      ...(og ? { og } : {}),
      srcset: Object.fromEntries(Object.entries(srcset).map(([k, v]) => [k, v.join(', ')])),
    },
  ];
}

// Recomeça public/fotos a cada execução: assim uma foto que perdeu a autorização some do build.
await rm(PUBLICO, { recursive: true, force: true });

const resultado = {};
const fila = [...incluidas];
let feitas = 0;
const t0 = Date.now();
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (fila.length) {
      const e = fila.shift();
      const [chave, dados] = await processar(e);
      resultado[chave] = dados;
      feitas++;
      if (feitas % 10 === 0 || feitas === incluidas.length) {
        process.stdout.write(`\rfotos: ${feitas}/${incluidas.length} (${Math.round((Date.now() - t0) / 1000)} s)`);
      }
    }
  }),
);
if (incluidas.length) process.stdout.write('\n');

const ordenado = Object.fromEntries(Object.entries(resultado).sort(([a], [b]) => a.localeCompare(b)));
await mkdir(path.dirname(SAIDA_JSON), { recursive: true });
await writeFile(SAIDA_JSON, JSON.stringify({ producao, fotos: ordenado }, null, 2) + '\n');

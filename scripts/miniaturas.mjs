// Gera miniaturas de TODAS as fotos de "Fotos Para Potifolio/" para a página /curadoria (só desenvolvimento).
// Os originais são só lidos. Saída em .cache/miniaturas/ (ignorada pelo git, nunca vai para o build).
//   node scripts/miniaturas.mjs
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGINAIS = path.join(RAIZ, 'Fotos Para Potifolio');
const SAIDA = path.join(RAIZ, '.cache/miniaturas');
const pastas = JSON.parse(await readFile(path.join(RAIZ, 'src/data/pastas.json'), 'utf8'));
const discos = new Map((await readdir(ORIGINAIS)).map((n) => [n.normalize('NFC'), n]));

export const slugMini = (nome) =>
  nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9.]+/g, '-');

const fila = [];
const indice = {};
for (const [sigla, pasta] of Object.entries(pastas)) {
  const dir = path.join(ORIGINAIS, discos.get(pasta.normalize('NFC')) ?? pasta);
  if (!existsSync(dir)) {
    console.warn(`aviso: pasta ${sigla} não encontrada, pulada: ${pasta}`);
    continue;
  }
  const arquivos = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort((a, b) => a.localeCompare(b, 'pt', { numeric: true }));
  indice[sigla] = [];
  await mkdir(path.join(SAIDA, sigla), { recursive: true });
  for (const arq of arquivos) {
    const item = { arquivo: arq.normalize('NFC'), mini: `${slugMini(arq)}.webp` };
    indice[sigla].push(item);
    fila.push({ origem: path.join(dir, arq), destino: path.join(SAIDA, sigla, item.mini), item });
  }
}

let feitas = 0;
const total = fila.length;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (fila.length) {
      const t = fila.shift();
      try {
        if (!existsSync(t.destino)) {
          await sharp(t.origem, { failOn: 'none' }).rotate().resize({ width: 640, height: 640, fit: 'inside' }).webp({ quality: 70 }).toFile(t.destino);
        }
        const m = await sharp(t.destino).metadata();
        t.item.w = m.width;
        t.item.h = m.height;
      } catch (e) {
        t.item.erro = String(e.message ?? e);
      }
      if (++feitas % 50 === 0 || feitas === total) process.stdout.write(`\rminiaturas: ${feitas}/${total}`);
    }
  }),
);
process.stdout.write('\n');
await writeFile(path.join(SAIDA, 'indice.json'), JSON.stringify(indice));

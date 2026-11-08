// Depois do build de produção: nenhum arquivo de foto em dist/ pode vir de foto sem autorização,
// e nenhum derivado pode carregar EXIF.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const dist = path.join(RAIZ, 'dist/fotos');
const { producao, fotos } = JSON.parse(await readFile(path.join(RAIZ, 'src/generated/fotos.json'), 'utf8'));

let falhas = 0;
if (!producao) {
  console.error('FAIL  src/generated/fotos.json é de desenvolvimento; rode o build de produção');
  process.exit(1);
}
const permitidos = new Set();
for (const d of Object.values(fotos)) {
  if (!d.autorizada) falhas++;
  for (const lista of Object.values(d.srcset)) for (const item of lista.split(', ')) permitidos.add(item.split(' ')[0]);
}
const presentes = [];
if (existsSync(dist)) {
  for (const slug of await readdir(dist)) for (const f of await readdir(path.join(dist, slug))) presentes.push(`/fotos/${slug}/${f}`);
}
const intrusos = presentes.filter((p) => !permitidos.has(p));
console.log(`${intrusos.length ? 'FAIL' : 'PASS'}  ${presentes.length} arquivos de foto em dist/, ${intrusos.length} fora da lista autorizada`);
falhas += intrusos.length;
for (const p of presentes.slice(0, 20)) {
  const m = await sharp(path.join(RAIZ, 'dist', p)).metadata();
  if (m.exif) {
    console.log(`FAIL  EXIF presente em ${p}`);
    falhas++;
  }
}
process.exit(falhas ? 1 : 0);

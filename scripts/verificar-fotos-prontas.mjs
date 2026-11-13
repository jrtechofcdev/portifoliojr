// Roda antes do build na Vercel, onde os originais não existem: as fotos já vêm prontas no Git
// (public/fotos e src/generated/fotos.json, gerados com `npm run fotos:publicar`).
// Falha se o JSON for de desenvolvimento (teria foto pendente e noindex) ou se faltar algum arquivo.
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const json = path.join(RAIZ, 'src/generated/fotos.json');
if (!existsSync(json)) {
  console.error('FAIL  src/generated/fotos.json não existe. Rode `npm run fotos:publicar` e envie para o Git.');
  process.exit(1);
}
const { producao, fotos } = JSON.parse(await readFile(json, 'utf8'));
if (!producao) {
  console.error('FAIL  fotos.json é de desenvolvimento. Rode `npm run fotos:publicar` antes de enviar para o Git.');
  process.exit(1);
}
const faltando = [];
for (const d of Object.values(fotos)) {
  const caminhos = [d.src, d.og, ...Object.values(d.srcset).flatMap((s) => s.split(', ').map((x) => x.split(' ')[0]))];
  for (const c of caminhos) if (c && !existsSync(path.join(RAIZ, 'public', c))) faltando.push(c);
}
if (faltando.length) {
  console.error(`FAIL  ${faltando.length} arquivos de foto faltando em public/, por exemplo ${faltando[0]}`);
  process.exit(1);
}
console.log(`PASS  ${Object.keys(fotos).length} fotos prontas para o build`);

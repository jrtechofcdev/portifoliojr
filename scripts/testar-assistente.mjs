// Teste do assistente: frases como as pessoas escrevem (com erro, sem acento, abreviadas) e o que
// o assistente precisa entender de cada uma. Uso: npm run test:assistente
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Compila os três arquivos TypeScript para uma pasta temporária e importa de lá.
const RAIZ = path.resolve(import.meta.dirname, '..');
const SAIDA = path.join(RAIZ, '.cache/teste-assistente');
const arquivos = ['src/lib/entender.ts', 'src/data/site.ts', 'src/data/assistente.ts'];
for (const a of arquivos) {
  const fonte = await readFile(path.join(RAIZ, a), 'utf8');
  const js = ts
    .transpileModule(fonte, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
    .outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
  const destino = path.join(SAIDA, a.replace(/\.ts$/, '.mjs'));
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, js);
}
const m = {
  ...(await import(pathToFileURL(path.join(SAIDA, 'src/lib/entender.mjs')).href)),
  dados: await import(pathToFileURL(path.join(SAIDA, 'src/data/assistente.mjs')).href),
};
const { entender, extrair, dados } = m;
const { TIPOS, PRAZOS, CIDADES, DUVIDAS, ESPECIAIS, NAO_SEI } = dados;

// Tudo o que o texto livre pode querer dizer, como no assistente (AssistenteChat.astro).
const GERAL = [...TIPOS, NAO_SEI, ...DUVIDAS.filter((d) => !d.id.startsWith('servico-')), ...ESPECIAIS];
const FRACAS = ['oi', 'obrigado', 'orcamento', 'naosei'];
const grupos = { tipo: [...TIPOS], prazo: PRAZOS, cidade: CIDADES };

const casos = [
  // [frase, intenção esperada no texto livre (ou null), { tipo, prazo, cidade } esperados (parcial)]
  ['quero um ensaio jestante em bacabau mes que vem', 'gestante', { tipo: 'gestante', prazo: 'meses', cidade: 'bacabal' }],
  ['quinse anos da minha filha', 'quinze', { tipo: 'quinze' }],
  ['qto custa?', 'valores', {}],
  ['qual o valor do orsamento', 'valores', {}],
  ['aniverssario da minha fiha em imperatris', 'aniversario', { tipo: 'aniversario', cidade: 'imperatriz' }],
  ['fotos de cazamento', 'evento', { tipo: 'evento' }],
  ['ensaio de casal com meu namorado', 'casal', { tipo: 'casal' }],
  ['tenho vergonha de tirar foto, nunca fiz', 'preparar', {}],
  ['quando recebo as fotos', 'entrega', {}],
  ['vc atende em sao luis?', 'onde', { cidade: 'outra' }],
  ['quero falar com o fotografo', 'falar', {}],
  ['bom dia', 'oi', {}],
  ['obrigada!!', 'obrigado', {}],
  ['culto da igreja no sabado', 'evento', { tipo: 'evento', prazo: 'mes' }],
  ['ensaio infantil country na fazenda', 'infantil', { tipo: 'infantil' }],
  ['como funciona?', 'como-funciona', {}],
  ['nao sei ainda o que quero', null, {}],
  ['asdkjh qwe zzz', null, {}],
  ['forma de pagamento parcela no cartao?', 'valores', {}],
  ['grávida de 7 meses', 'gestante', { tipo: 'gestante' }],
  ['quero um orçamento', 'orcamento', {}],
  ['quero marcar um ensaio pra dezembro', 'individual', { tipo: 'individual', prazo: 'meses' }],
  ['fotos pro cartaz da igreja', null, {}],
  ['meu filho faz 1 ano, quero fotos', 'infantil', { tipo: 'infantil' }],
  ['tem como parcelar no pix', 'valores', {}],
  ['onde fica o estudio', 'onde', {}],
  ['oii tudo bem?', 'oi', {}],
  ['quanto tempo demora pra entregar', 'entrega', {}],
  ['fotografia de evento em imperatriz', 'evento', { tipo: 'evento', cidade: 'imperatriz' }],
];

let falhas = 0;
for (const [frase, esperado, campos] of casos) {
  const e = entender(frase, GERAL, FRACAS);
  const achado = e.tipo === 'certa' ? e.id : e.tipo === 'duvida' ? `duvida(${e.ids.join(',')})` : 'nada';
  const okIntencao = esperado === null ? e.tipo !== 'certa' || e.id === 'naosei' : e.tipo === 'certa' && e.id === esperado;
  const x = extrair(frase, grupos).valores;
  const okCampos = Object.entries(campos).every(([k, v]) => x[k] === v);
  const ok = okIntencao && okCampos;
  if (!ok) falhas++;
  const correcoes = e.correcoes?.length ? '  correções: ' + e.correcoes.map((c) => `${c.de}→${c.para}`).join(', ') : '';
  console.log(`${ok ? 'ok  ' : 'FALHA'}  "${frase}"  →  ${achado}  ${JSON.stringify(x)}${correcoes}`);
}
console.log(falhas ? `\nFAIL  ${falhas} de ${casos.length} frases` : `\nPASS  ${casos.length} frases entendidas`);
process.exit(falhas ? 1 : 0);

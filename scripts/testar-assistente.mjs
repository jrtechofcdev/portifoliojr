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
const { TIPOS, PRAZOS, CIDADES, DUVIDAS, ESPECIAIS, NAO_SEI, FRACAS, PLANOS_ENSAIO, PLANOS_EVENTO } = dados;

// Tudo o que o texto livre pode querer dizer, como no atendimento (AssistenteChat.astro).
const GERAL = [...TIPOS, NAO_SEI, ...DUVIDAS, ...ESPECIAIS];
const grupos = { tipo: [...TIPOS], prazo: PRAZOS, cidade: CIDADES };
const PLANOS = { ensaio: PLANOS_ENSAIO, evento: PLANOS_EVENTO };

// [frase, intenção esperada (ou null = não pode ter certeza, ou lista = qualquer uma delas),
//  campos esperados { tipo, prazo, cidade, plano } (parcial; o plano usa os planos do tipo)]
const casos = [
  // Perguntas frequentes reais (docs/DOCUMENTO_MESTRE_ASSISTENTE.md, §32)
  ['Oi, tudo bem? Quanto custa um ensaio fotográfico? Quais são os pacotes que você tem?', 'valores', {}],
  ['Quantos dias demora pra entregar as fotos? Você manda todas pelo link?', 'entrega', {}],
  ['Tem que pagar tudo antes ou posso dar uma entrada e pagar o restante no dia?', 'pagamento', {}],
  ['Eu não sei posar pra foto kkkk, você vai me orientar na hora?', 'vergonha', {}],
  ['Você faz ensaio em qualquer lugar? E como faço pra marcar um horário?', ['agendar', 'onde', 'locais'], {}],
  ['Pode fazer fotos com meu namorado/amiga também ou é só individual?', 'quem', {}],
  ['Se eu marcar e acontecer algum imprevisto, consigo mudar o dia?', 'remarcar', {}],
  // Com erro de digitação
  ['quero um ensaio jestante em bacabau mes que vem', 'gestante', { tipo: 'gestante', prazo: 'meses', cidade: 'bacabal' }],
  ['quinse anos da minha filha', 'quinze', { tipo: 'quinze' }],
  ['qto custa?', 'valores', {}],
  ['qual o valor do orsamento', 'valores', {}],
  ['aniverssario da minha fiha em imperatris', 'aniversario', { tipo: 'aniversario', cidade: 'imperatriz' }],
  ['fotos de cazamento', 'casamento', {}],
  ['grávida de 7 meses', 'gestante', { tipo: 'gestante' }],
  ['oii tudo bem?', 'oi', {}],
  ['obrigada!!', 'obrigado', {}],
  // Guia
  ['ensaio de casal com meu namorado', 'casal', { tipo: 'casal' }],
  ['culto da igreja no sabado', 'evento', { tipo: 'evento', prazo: 'mes' }],
  ['ensaio infantil country na fazenda', 'infantil', { tipo: 'infantil' }],
  ['meu filho faz 1 ano, quero fotos', 'infantil', { tipo: 'infantil' }],
  ['quero marcar um ensaio pra dezembro', ['individual', 'agendar'], { tipo: 'individual', prazo: 'meses' }],
  ['fotografia de evento em imperatriz', 'evento', { tipo: 'evento', cidade: 'imperatriz' }],
  ['quero um ensaio com 2 looks', 'individual', { tipo: 'individual', plano: 'destaque' }],
  ['aniversario de 4 horas', 'aniversario', { tipo: 'aniversario', plano: 'evento-classico' }],
  ['foto pro linkedin', 'profissional', { tipo: 'profissional' }],
  ['quero um orçamento', 'orcamento', {}],
  ['nao sei ainda o que quero', null, {}],
  ['asdkjh qwe zzz', null, {}],
  // Dúvidas do documento mestre
  ['forma de pagamento parcela no cartao?', 'pagamento', {}],
  ['tem como parcelar no pix', 'pagamento', {}],
  ['tem desconto?', 'desconto', {}],
  ['quanto tempo demora pra entregar', 'entrega', {}],
  ['quanto tempo o link fica disponivel', 'galeria', {}],
  ['perdi o link das fotos', 'galeria', {}],
  ['posso pedir alteração na edição?', 'edicao', {}],
  ['e se chover no dia?', 'chuva', {}],
  ['qual o melhor horario pra fazer o ensaio', 'horario', {}],
  ['vc atende em sao luis?', 'onde', { cidade: 'outra' }],
  ['onde fazer o ensaio em bacabal', 'locais', { cidade: 'bacabal' }],
  ['faz ensaio a noite com flash?', 'noite', {}],
  ['tem estudio?', 'estudio', {}],
  ['vocês fazem video tambem?', 'video', {}],
  ['faz smash the cake?', 'naofaz', {}],
  ['faz newborn?', 'naofaz', {}],
  ['que roupa eu uso', 'roupa', {}],
  ['indica maquiadora?', 'beleza', {}],
  ['com quantas semanas faço o ensaio gestante', 'gestante-quando', {}],
  ['posso levar meu cachorro?', 'quem', {}],
  ['tem contrato?', 'contrato', {}],
  ['quero falar com o fotografo', 'falar', {}],
  ['como funciona?', 'como-funciona', {}],
  ['quanto custa fotografar uma festa', 'valores-eventos', {}],
];

let falhas = 0;
for (const [frase, esperado, campos] of casos) {
  const e = entender(frase, GERAL, [...FRACAS]);
  const achado = e.tipo === 'certa' ? e.id : e.tipo === 'duvida' ? `duvida(${e.ids.join(',')})` : 'nada';
  const okIntencao =
    esperado === null
      ? e.tipo !== 'certa' || e.id === 'naosei'
      : Array.isArray(esperado)
        ? (e.tipo === 'certa' && esperado.includes(e.id)) || (e.tipo === 'duvida' && esperado.some((x) => e.ids.includes(x)))
        : e.tipo === 'certa' && e.id === esperado;
  const x = extrair(frase, grupos).valores;
  const tipoX = TIPOS.find((tt) => tt.id === x.tipo);
  if (tipoX && PLANOS[tipoX.servico]) {
    const pl = extrair(frase, { plano: PLANOS[tipoX.servico] }).valores.plano;
    if (pl) x.plano = pl;
  }
  const okCampos = Object.entries(campos).every(([k, v]) => x[k] === v);
  const ok = okIntencao && okCampos;
  if (!ok) falhas++;
  const correcoes = e.correcoes?.length ? '  correções: ' + e.correcoes.map((c) => `${c.de}→${c.para}`).join(', ') : '';
  console.log(`${ok ? 'ok  ' : 'FALHA'}  "${frase}"  →  ${achado}  ${JSON.stringify(x)}${correcoes}`);
}
console.log(falhas ? `\nFAIL  ${falhas} de ${casos.length} frases` : `\nPASS  ${casos.length} frases entendidas`);
process.exit(falhas ? 1 : 0);

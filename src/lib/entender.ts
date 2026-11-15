// Motor de entendimento do assistente (14/11/2026). Roda só no navegador de quem visita: nada do
// que a pessoa escreve sai do aparelho. Não é IA: compara o que foi escrito com as palavras-chave
// de cada resposta prevista (src/data/assistente.ts), tolerando erros de digitação, falta de
// acento, abreviações de mensagem ("vc", "qto") e trocas de som comuns do português
// ("jestante", "quinse", "orsamento", "bacabau"). Só responde o que está previsto.
// Funções puras, sem DOM: o teste em scripts/testar-assistente.mjs roda no Node.

export interface Intencao {
  id: string;
  /** Palavras ou expressões (com acento, como devem aparecer na correção). "palavra*" vale como
   *  começo de palavra ("anivers*" pega aniversário, aniversariante). */
  chaves: readonly string[];
}

export type Correcao = { de: string; para: string };

export type Entendimento =
  | { tipo: 'certa'; id: string; pontos: number; correcoes: Correcao[] }
  | { tipo: 'duvida'; ids: string[]; correcoes: Correcao[] }
  | { tipo: 'nada' };

// Abreviações de mensagem, trocadas antes de comparar.
const ABREVIACOES: Record<string, string> = {
  vc: 'voce',
  vcs: 'voces',
  qto: 'quanto',
  qt: 'quanto',
  qnt: 'quanto',
  qnd: 'quando',
  qdo: 'quando',
  pq: 'porque',
  tb: 'tambem',
  tbm: 'tambem',
  q: 'que',
  oq: 'o que',
  hj: 'hoje',
  td: 'tudo',
  mt: 'muito',
  mto: 'muito',
  msm: 'mesmo',
  obg: 'obrigado',
  vlw: 'valeu',
  blz: 'beleza',
  pfv: 'por favor',
  pf: 'por favor',
  fds: 'fim de semana',
  ctt: 'contato',
  whats: 'whatsapp',
  zap: 'whatsapp',
  wpp: 'whatsapp',
  insta: 'instagram',
  aniver: 'aniversario',
  niver: 'aniversario',
  fotog: 'fotografo',
  ft: 'foto',
  fts: 'fotos',
};

// Palavras que aparecem em quase toda frase e não ajudam a decidir.
const VAZIAS = new Set(
  'a o e as os um uma uns umas de da do das dos em no na nos nas para pra pro por com sem que eu me meu minha meus minhas seu sua voce voces ele ela isso esse essa este esta aqui ai la se ja so tambem mais muito pouco bem quero queria gostaria gostava preciso precisava tem ter tenho seria sobre como qual quais ou mas porque entao favor'.split(
    ' ',
  ),
);

/** Minúsculas, sem acento, sem pontuação, letras repetidas três vezes ou mais viram uma
 *  ("fotooo" vira "foto"), abreviações trocadas. */
export function normalizar(texto: string): string {
  const base = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/([a-z])\1{2,}/g, '$1')
    .trim();
  return base
    .split(' ')
    .map((p) => ABREVIACOES[p] ?? p)
    .join(' ')
    .trim();
}

/** Chave de som: escritas diferentes com o mesmo som ficam iguais ("gestante" e "jestante",
 *  "quinze" e "quinse", "orçamento" e "orsamento", "Bacabal" e "Bacabau"). */
export function som(palavra: string): string {
  let p = palavra
    .toLowerCase()
    .replace(/ç/g, 's')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
  p = p
    .replace(/ch|sh/g, 'x')
    .replace(/lh/g, 'li')
    .replace(/nh/g, 'ni')
    .replace(/ph/g, 'f')
    .replace(/qu(?=[ei])/g, 'k')
    .replace(/gu(?=[ei])/g, 'g')
    .replace(/q/g, 'k')
    .replace(/c(?=[ei])/g, 's')
    .replace(/c/g, 'k')
    .replace(/g(?=[ei])/g, 'j')
    .replace(/sc(?=[ei])/g, 's')
    .replace(/xc(?=[ei])/g, 's')
    .replace(/z/g, 's')
    .replace(/y/g, 'i')
    .replace(/w/g, 'u')
    .replace(/h/g, '')
    .replace(/m(?=[^aeiou]|$)/g, 'n')
    .replace(/l(?=[^aeiou]|$)/g, 'u')
    .replace(/([a-z])\1+/g, '$1');
  return p;
}

/** Distância de edição com troca de letras vizinhas (Damerau, versão OSA). */
export function distancia(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + custo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** Erros aceitos: nenhum até 4 letras (palavras curtas se confundem fácil: "fora" e "forma"),
 *  1 de 5 a 6, 2 a partir de 7. Palavras curtas com o mesmo som continuam valendo. */
const tolerancia = (n: number) => (n <= 4 ? 0 : n <= 6 ? 1 : 2);

/** Quanto uma palavra digitada se parece com uma palavra-chave (0 = nada, 1 = igual). */
export function parecida(digitada: string, chave: string): number {
  const prefixo = chave.endsWith('*');
  const original = prefixo ? chave.slice(0, -1) : chave;
  const k = normalizar(original);
  if (!k || !digitada) return 0;
  if (digitada === k) return 1;
  if (prefixo && digitada.startsWith(k) && k.length >= 4) return 1;
  const sd = som(digitada);
  // O som sai da chave original, com o "ç" ("orçamento" soa como "orsamento").
  const sk = som(original);
  if (sd === sk && sk.length >= 2) return 0.95;
  if (prefixo && sk.length >= 4 && sd.startsWith(sk)) return 0.95;
  const tol = tolerancia(k.length);
  if (!tol || Math.abs(digitada.length - k.length) > tol) return 0;
  // Começo da palavra igual dá mais segurança: "fotografo" e "fotografia" não se confundem com
  // palavras que só terminam igual.
  const alvo = prefixo ? digitada.slice(0, k.length + 1) : digitada;
  const dist = Math.min(distancia(alvo, k), distancia(som(alvo), sk) + 0.5);
  if (dist <= tol && digitada[0] === k[0]) return dist <= 1 ? 0.8 : 0.6;
  if (dist <= tol - 1) return 0.7;
  return 0;
}

type Achado = { pontos: number; correcoes: Correcao[]; inicio: number; fim: number };

/** Procura uma chave (palavra ou expressão) nas palavras digitadas. */
function procurar(palavras: string[], chave: string): Achado | null {
  const partes = chave.split(/\s+/).filter(Boolean);
  const nPartes = partes.map((p) => normalizar(p.replace(/\*$/, '')));
  let melhor: Achado | null = null;
  for (let i = 0; i + partes.length <= palavras.length; i++) {
    // Palavra vazia ("de", "que") só conta dentro de expressão.
    if (partes.length === 1 && VAZIAS.has(palavras[i])) continue;
    let soma = 0;
    const correcoes: Correcao[] = [];
    let ok = true;
    for (let j = 0; j < partes.length; j++) {
      const p = parecida(palavras[i + j], partes[j]);
      if (!p) {
        ok = false;
        break;
      }
      soma += p;
      if (p < 1 && palavras[i + j] !== nPartes[j]) correcoes.push({ de: palavras[i + j], para: partes[j].replace(/\*$/, '') });
    }
    if (!ok) continue;
    // Expressão inteira vale mais que palavra solta.
    const pontos = (soma / partes.length) * (partes.length > 1 ? 1 + 0.5 * (partes.length - 1) : 1);
    if (!melhor || pontos > melhor.pontos) melhor = { pontos, correcoes, inicio: i, fim: i + partes.length };
  }
  return melhor;
}

function palavrasDe(frase: string): string[] {
  return normalizar(frase).split(' ').filter(Boolean);
}

/** Pontua cada intenção pelo que foi escrito. Cada palavra digitada conta uma vez por intenção
 *  (a chave que melhor a explica); as palavras vazias só contam dentro de expressões
 *  ("quanto custa", "15 anos"). */
export function pontuar(frase: string, intencoes: readonly Intencao[]): { id: string; pontos: number; correcoes: Correcao[] }[] {
  const palavras = palavrasDe(frase);
  return intencoes
    .map((it) => {
      const achados = it.chaves
        .map((chave) => procurar(palavras, chave))
        .filter((a): a is Achado => a !== null)
        .sort((a, b) => b.pontos - a.pontos);
      const usadas = new Set<number>();
      let pontos = 0;
      const correcoes: Correcao[] = [];
      for (const a of achados) {
        const posicoes = Array.from({ length: a.fim - a.inicio }, (_, k) => a.inicio + k);
        if (posicoes.some((p) => usadas.has(p))) continue;
        posicoes.forEach((p) => usadas.add(p));
        pontos += a.pontos;
        correcoes.push(...a.correcoes);
      }
      return { id: it.id, pontos, correcoes };
    })
    .filter((r) => r.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos);
}

const unicas = (cs: Correcao[]) => cs.filter((c, i) => cs.findIndex((o) => o.de === c.de) === i);

/** O que a pessoa quis dizer: uma intenção certa, duas ou três possíveis ("Você quis dizer...?")
 *  ou nada. */
export function entender(frase: string, intencoes: readonly Intencao[], fracas: readonly string[] = []): Entendimento {
  let r = pontuar(frase, intencoes);
  // Intenções fracas (cumprimento, "quero marcar") cedem a vez quando há um assunto de verdade
  // empatado com elas: "quero marcar um ensaio" é sobre o ensaio.
  if (fracas.length && r.length > 1) {
    const perto = r.filter((x) => x.pontos >= r[0].pontos * 0.85);
    const fortes = perto.filter((x) => !fracas.includes(x.id));
    if (fortes.length && fortes.length < perto.length) r = [...fortes, ...r.filter((x) => !fortes.includes(x) && !perto.includes(x))];
  }
  if (!r.length) return { tipo: 'nada' };
  const [a, b] = r;
  // Só palpite (palavra com erro, nenhuma certeza): confirma antes de seguir.
  if (a.pontos < 0.75) return { tipo: 'duvida', ids: r.slice(0, 3).map((x) => x.id), correcoes: unicas(a.correcoes) };
  if (b && b.pontos >= a.pontos * 0.85) {
    const ids = r.filter((x) => x.pontos >= a.pontos * 0.85).slice(0, 3).map((x) => x.id);
    return { tipo: 'duvida', ids, correcoes: unicas(r.flatMap((x) => x.correcoes)) };
  }
  return { tipo: 'certa', id: a.id, pontos: a.pontos, correcoes: unicas(a.correcoes) };
}

/** Tira de uma frase livre o que já dá para saber (tipo, cidade, prazo...), para o guia pular as
 *  perguntas já respondidas. Cada grupo aceita só uma resposta segura. */
export function extrair<G extends string>(
  frase: string,
  grupos: Record<G, readonly Intencao[]>,
): { valores: Partial<Record<G, string>>; correcoes: Correcao[] } {
  const valores: Partial<Record<G, string>> = {};
  const correcoes: Correcao[] = [];
  for (const g of Object.keys(grupos) as G[]) {
    const e = entender(frase, grupos[g]);
    if (e.tipo === 'certa') {
      valores[g] = e.id;
      correcoes.push(...e.correcoes);
    }
  }
  return { valores, correcoes: unicas(correcoes) };
}

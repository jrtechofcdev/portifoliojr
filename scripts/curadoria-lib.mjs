// Curadoria pelo próprio fotógrafo (página /curadoria, só no desenvolvimento).
// Estrela = a foto entra no álbum da amostra. Casinha = a capa da amostra.
// A seleção fica em src/data/curadoria.json; aplicar() reescreve os manifestos de src/content/ensaios.
import { existsSync } from 'node:fs';
import { readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export const RAIZ = path.resolve(import.meta.dirname, '..');
export const MANIFESTOS = path.join(RAIZ, 'src/content/ensaios');
export const SELECAO = path.join(RAIZ, 'src/data/curadoria.json');
export const MINIMO = 4;

// Dados de cada pasta que ainda não tem manifesto. Datas vêm do nome da pasta.
export const NOVAS = {
  KI: { slug: 'kiara-15-anos', nome: '15 anos de Kiara', categoria: 'eventos', rotulo: 'Festa de 15 anos', cidade: null, data: '2026-01-31', tema: 'escuro' },
  IR: { slug: 'aniversario-de-irenilde', nome: 'Aniversário de Irenilde', categoria: 'eventos', rotulo: 'Aniversário', cidade: null, data: '2024-03-09', tema: 'escuro' },
  AD: { slug: 'adrian-18-anos', nome: '18 anos de Adrian', categoria: 'eventos', rotulo: 'Aniversário', cidade: null, data: '2025-01-05', tema: 'escuro' },
  VE: { slug: 'vitoria-emanuela-15-anos', nome: '15 anos de Vitória Emanuela', categoria: 'eventos', rotulo: 'Festa de 15 anos', cidade: null, data: '2024-02-17', tema: 'escuro' },
  TJ: { slug: 'tia-josiana', nome: 'Tia Josiana', categoria: 'ensaios', rotulo: 'Retrato para cartaz', cidade: null, data: '2024-12-05', tema: 'claro' },
  BM: { slug: 'bombeiro-mirim-bacabal', nome: 'Desfile do Bombeiro Mirim', categoria: 'eventos', rotulo: 'Desfile cívico', cidade: 'Bacabal', data: '2025-04-17', tema: 'claro' },
  FC: { slug: 'feira-de-ciencias', nome: 'Feira de Ciências', categoria: 'eventos', rotulo: 'Evento escolar', cidade: null, data: '2024-10-20', tema: 'claro' },
  VT: { slug: 'victor-e-tamires', nome: 'Victor & Tamires', categoria: 'casais', rotulo: 'Ensaio gestante', cidade: null, data: '2024-03-01', tema: 'escuro' },
};

const ordemNatural = (a, b) => a.localeCompare(b, 'pt', { numeric: true });

/** Manifestos atuais por sigla de pasta, inclusive os guardados como .yaml.fora (amostra sem seleção suficiente). */
export async function lerManifestos() {
  const porSigla = {};
  for (const arq of await readdir(MANIFESTOS)) {
    const fora = arq.endsWith('.yaml.fora');
    if (!arq.endsWith('.yaml') && !fora) continue;
    const slug = arq.replace(/\.yaml(\.fora)?$/, '');
    const m = YAML.parse(await readFile(path.join(MANIFESTOS, arq), 'utf8'));
    if (!porSigla[m.pasta] || !fora) porSigla[m.pasta] = { slug, arquivo: arq, fora, m };
  }
  return porSigla;
}

export async function lerSelecao() {
  if (existsSync(SELECAO)) return JSON.parse(await readFile(SELECAO, 'utf8'));
  // Primeira vez: começa com o que já está no site.
  const sel = {};
  for (const [sigla, { m, fora }] of Object.entries(await lerManifestos())) {
    if (fora) continue;
    sel[sigla] = { estrelas: m.fotos.map((f) => f.arquivo.normalize('NFC')).sort(ordemNatural), casa: m.capa.normalize('NFC') };
  }
  await gravarSelecao(sel);
  return sel;
}

export async function gravarSelecao(sel) {
  const ordenada = {};
  for (const k of Object.keys(sel).sort()) {
    const { estrelas = [], casa = null } = sel[k];
    if (!estrelas.length && !casa) continue;
    ordenada[k] = { estrelas: [...new Set(estrelas)].sort(ordemNatural), casa };
  }
  await writeFile(SELECAO, JSON.stringify(ordenada, null, 2) + '\n');
  await gravarLista(ordenada);
  return ordenada;
}

/** FOTOS_ESCOLHIDAS.txt: a mesma seleção em texto, para conferir sem abrir o site. */
async function gravarLista(sel) {
  const pastas = JSON.parse(await readFile(path.join(RAIZ, 'src/data/pastas.json'), 'utf8'));
  const linhas = [
    'FOTOS ESCOLHIDAS NA PÁGINA /curadoria',
    'Gerado automaticamente a cada clique. Não edite à mão: use a página /curadoria (npm run dev).',
    `Atualizado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })}`,
    `Cada amostra entra no site com 1 capa (casinha) e pelo menos ${MINIMO} estrelas.`,
    '',
  ];
  for (const [sigla, { estrelas, casa }] of Object.entries(sel)) {
    const ok = casa && estrelas.length >= MINIMO;
    linhas.push(`== ${sigla}: ${pastas[sigla] ?? sigla}`);
    linhas.push(`   ${ok ? 'ENTRA NO SITE' : 'AINDA FORA DO SITE'} · ${estrelas.length} com estrela · capa: ${casa ?? '(falta escolher)'}`);
    for (const a of estrelas) linhas.push(`   ${a === casa ? '⌂ ★' : '  ★'} ${a}`);
    linhas.push('');
  }
  await writeFile(path.join(RAIZ, 'FOTOS_ESCOLHIDAS.txt'), linhas.join('\n'));
}

/** Marca ou desmarca. A casinha sempre leva estrela; tirar a estrela da capa tira a casinha. */
export async function marcar(sigla, arquivo, tipo, valor) {
  const sel = await lerSelecao();
  const s = (sel[sigla] ??= { estrelas: [], casa: null });
  arquivo = arquivo.normalize('NFC');
  if (tipo === 'casa') {
    if (valor) {
      s.casa = arquivo;
      if (!s.estrelas.includes(arquivo)) s.estrelas.push(arquivo);
    } else if (s.casa === arquivo) s.casa = null;
  } else if (valor) {
    if (!s.estrelas.includes(arquivo)) s.estrelas.push(arquivo);
  } else {
    s.estrelas = s.estrelas.filter((a) => a !== arquivo);
    if (s.casa === arquivo) s.casa = null;
  }
  return (await gravarSelecao(sel))[sigla] ?? { estrelas: [], casa: null };
}

const q = (v) => (v === null ? 'null' : JSON.stringify(v));

function yamlManifesto(slug, m) {
  const linhas = [
    '# Fotos escolhidas pelo fotógrafo na página /curadoria (estrela = álbum, casinha = capa).',
    '# Para mudar a seleção, use a página /curadoria; os textos alternativos (alt) podem ser editados aqui.',
    `nome: ${q(m.nome)}`,
    `titulo: ${q(m.titulo ?? m.nome)}`,
    `categoria: ${m.categoria}`,
    `rotulo: ${q(m.rotulo)}`,
    `cidade: ${q(m.cidade)}`,
    `data: "${m.data}"`,
    `tema: ${m.tema}`,
    'autorizacao: sim',
    `pasta: ${m.pasta}`,
    `abertura: { arquivo: ${q(m.abertura.arquivo)}, foco: ${m.abertura.foco ?? '50% 35%'} }`,
    `capa: ${q(m.capa)}`,
    'fotos:',
    ...m.fotos.map((f) => `  - { arquivo: ${q(f.arquivo)}, alt: ${q(f.alt)} }${f.rascunho ? ' # alt a revisar' : ''}`),
  ];
  return linhas.join('\n') + '\n';
}

/** Reescreve os manifestos a partir da seleção. Devolve um resumo por sigla. */
export async function aplicar() {
  const sel = await lerSelecao();
  const atuais = await lerManifestos();
  const resumo = [];
  const siglas = new Set([...Object.keys(sel), ...Object.keys(atuais)]);
  for (const sigla of [...siglas].sort()) {
    const s = sel[sigla] ?? { estrelas: [], casa: null };
    const atual = atuais[sigla];
    const base = atual?.m ?? (NOVAS[sigla] ? { ...NOVAS[sigla], pasta: sigla } : null);
    if (!base) continue;
    const slug = atual?.slug ?? NOVAS[sigla].slug;
    const destino = path.join(MANIFESTOS, `${slug}.yaml`);
    const valido = s.casa && s.estrelas.length >= MINIMO;
    if (!valido) {
      if (atual && !atual.fora) await rename(destino, destino + '.fora');
      if (atual || s.estrelas.length) resumo.push({ sigla, slug, publicada: false, estrelas: s.estrelas.length, casa: !!s.casa });
      continue;
    }
    const alts = new Map((atual?.m.fotos ?? []).map((f) => [f.arquivo.normalize('NFC'), f.alt]));
    const provisorio = (arquivo) => `${base.nome}, foto ${arquivo.replace(/\.[^.]+$/, '')}`;
    const fotos = [s.casa, ...s.estrelas.filter((a) => a !== s.casa)].map((arquivo) => {
      const alt = alts.get(arquivo) ?? provisorio(arquivo);
      return { arquivo, alt, rascunho: alt === provisorio(arquivo) };
    });
    const manter = atual?.m.abertura?.arquivo?.normalize('NFC') === s.casa;
    const m = { ...base, pasta: sigla, capa: s.casa, abertura: { arquivo: s.casa, foco: manter ? atual.m.abertura.foco : '50% 35%' }, fotos };
    await writeFile(destino, yamlManifesto(slug, m));
    if (atual?.fora) await unlink(path.join(MANIFESTOS, atual.arquivo));
    resumo.push({ sigla, slug, publicada: true, estrelas: fotos.length, rascunhos: fotos.filter((f) => f.rascunho).length });
  }
  return resumo;
}

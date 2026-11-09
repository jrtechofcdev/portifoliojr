import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import gerado from '../generated/fotos.json';

export type DadosFoto = {
  width: number;
  height: number;
  cor: string;
  lqip: string;
  autorizada: boolean;
  src: string;
  grande: string;
  og?: string;
  srcset: { avif: string; webp: string; jpg: string };
};

const json = gerado as { producao: boolean; fotos: Record<string, DadosFoto> };
const fotos = json.fotos;

/** Build de prévia: mostra fotos pendentes, mas a página não pode ser indexada. */
export const PREVIA = !json.producao;

/** Dados da foto gerada por scripts/fotos.mjs, ou null se ela ficou fora deste build (sem autorização). */
export function dadosFoto(slug: string, arquivo: string): DadosFoto | null {
  return fotos[`${slug}/${arquivo.normalize('NFC')}`] ?? null;
}

export type Ensaio = CollectionEntry<'ensaios'>;
export type FotoEnsaio = Ensaio['data']['fotos'][number] & { slug: string; dados: DadosFoto };

/** Fotos do ensaio que entram neste build, na ordem do manifesto. */
export function fotosDoEnsaio(e: Ensaio): FotoEnsaio[] {
  return e.data.fotos.flatMap((f) => {
    const dados = dadosFoto(e.id, f.arquivo);
    return dados ? [{ ...f, slug: e.id, dados }] : [];
  });
}

/** Uma foto específica de um ensaio, com o texto alternativo do manifesto.
 *  Devolve null se o ensaio ou a foto saíram da seleção (página /curadoria) ou não entram neste build. */
export async function fotoDe(slug: string, arquivo: string): Promise<FotoEnsaio | null> {
  const e = await getEntry('ensaios', slug);
  const f = e?.data.fotos.find((x) => x.arquivo === arquivo);
  const dados = f ? dadosFoto(slug, arquivo) : null;
  return f && dados ? { ...f, slug, dados } : null;
}

/** A capa (casinha) de um ensaio, pronta para o componente Foto. */
export function capaDe(e: Ensaio): FotoEnsaio | null {
  return fotosDoEnsaio(e).find((f) => f.arquivo === e.data.capa) ?? null;
}

/** Ensaios com a capa e a abertura publicáveis, do mais recente ao mais antigo. */
export async function ensaiosPublicaveis(): Promise<Ensaio[]> {
  const todos = await getCollection('ensaios');
  return todos
    .filter((e) => dadosFoto(e.id, e.data.capa) && dadosFoto(e.id, e.data.abertura.arquivo) && fotosDoEnsaio(e).length >= 4)
    .sort((a, b) => b.data.data.localeCompare(a.data.data));
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "2025-08-17" vira "agosto de 2025". */
export function mesAno(data: string): string {
  const [ano, mes] = data.split('-');
  return `${MESES[Number(mes) - 1]} de ${ano}`;
}

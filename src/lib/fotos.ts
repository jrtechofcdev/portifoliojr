import { getCollection, type CollectionEntry } from 'astro:content';
import gerado from '../generated/fotos.json';

export type DadosFoto = {
  width: number;
  height: number;
  cor: string;
  lqip: string;
  autorizada: boolean;
  src: string;
  srcset: { avif: string; webp: string; jpg: string };
};

const fotos = (gerado as { producao: boolean; fotos: Record<string, DadosFoto> }).fotos;

/** Dados da foto gerada por scripts/fotos.mjs, ou null se ela ficou fora deste build (sem autorização). */
export function dadosFoto(slug: string, arquivo: string): DadosFoto | null {
  return fotos[`${slug}/${arquivo.normalize('NFC')}`] ?? null;
}

export type Ensaio = CollectionEntry<'ensaios'>;

/** Ensaios com ao menos uma foto neste build, do mais recente ao mais antigo. */
export async function ensaiosPublicaveis(): Promise<Ensaio[]> {
  const todos = await getCollection('ensaios');
  return todos
    .filter((e) => e.data.fotos.some((f) => dadosFoto(e.id, f.arquivo)))
    .sort((a, b) => b.data.data.localeCompare(a.data.data));
}

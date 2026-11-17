// Dados do visualizador de Stories (Historias.astro). Na home e no portfólio, as histórias de todos
// os álbuns vão num arquivo à parte (/historias.json, src/pages/historias.json.ts), baixado depois
// da abertura: assim a página fica cerca de 120 KB menor e a abertura não disputa o celular com eles.
import { capasDe, ensaiosPublicaveis, fotosDoEnsaio, type Ensaio, type FotoEnsaio } from './fotos';

export type Historia = { nome: string; legenda: string; href?: string; fotos: FotoEnsaio[] };

/** "Ensaio externo · Bacabal · 2025" */
export const legendaDe = (e: Ensaio) => [e.data.rotulo, e.data.cidade, e.data.data.slice(0, 4)].filter(Boolean).join(' · ');

/** Cada álbum vira uma história: a capa (ou as duas, quando se alternam) e as primeiras fotos. */
export function historiaDoEnsaio(e: Ensaio): Historia {
  const capas = capasDe(e);
  const resto = fotosDoEnsaio(e).filter((f) => !capas.includes(f));
  return { nome: e.data.nome, legenda: legendaDe(e), href: `/trabalhos/${e.id}`, fotos: [...capas, ...resto.slice(0, 8 - capas.length)] };
}

/** Todas as histórias, na mesma ordem dos álbuns da home e do portfólio (data-historia="<i>"). */
export async function historiasDoPortfolio(): Promise<Historia[]> {
  return (await ensaiosPublicaveis()).map(historiaDoEnsaio);
}

/** O que o visualizador precisa de cada foto. */
export function dadosHistorias(historias: Historia[]) {
  return historias.map((h) => ({
    nome: h.nome,
    legenda: h.legenda,
    href: h.href ?? null,
    fotos: h.fotos.map((f) => ({
      avif: f.dados.srcset.avif,
      webp: f.dados.srcset.webp,
      src: f.dados.src,
      alt: f.alt,
      cor: f.dados.cor,
      lqip: f.dados.lqip,
    })),
  }));
}

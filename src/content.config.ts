import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import pastas from './data/pastas.json';

const autorizacao = z.enum(['sim', 'nao', 'pendente']);

const foto = z.object({
  arquivo: z.string().min(1),
  // Descrição factual do que está na foto, sem "imagem de" (docs/DESIGN.md §10).
  alt: z.string().min(10),
  // Sobrepõe a autorização do ensaio só para esta foto.
  autorizacao: autorizacao.optional(),
});

const ensaios = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/ensaios' }),
  schema: z
    .object({
      nome: z.string().min(1),
      titulo: z.string().min(1),
      categoria: z.enum(['ensaios', 'casais', 'eventos']),
      rotulo: z.string().min(1),
      cidade: z.string().nullable(),
      data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      tema: z.enum(['claro', 'escuro']),
      autorizacao,
      pasta: z.enum(Object.keys(pastas) as [string, ...string[]]),
      abertura: z.object({ arquivo: z.string(), foco: z.string().default('50% 50%') }),
      capa: z.string(),
      // Segunda capa, opcional: nos cartões ela se alterna com a primeira (pedido do fotógrafo).
      capaAlternativa: z.string().optional(),
      fotos: z.array(foto).min(4),
    })
    .superRefine((e, ctx) => {
      const nomes = new Set(e.fotos.map((f) => f.arquivo));
      if (nomes.size !== e.fotos.length) ctx.addIssue({ code: 'custom', message: 'foto repetida em fotos[]' });
      const conferir: [string, string][] = [['abertura', e.abertura.arquivo], ['capa', e.capa]];
      if (e.capaAlternativa) conferir.push(['capaAlternativa', e.capaAlternativa]);
      for (const [campo, arquivo] of conferir) {
        if (!nomes.has(arquivo)) ctx.addIssue({ code: 'custom', path: [campo], message: `"${arquivo}" precisa estar em fotos[]` });
      }
      if (e.capaAlternativa === e.capa) ctx.addIssue({ code: 'custom', path: ['capaAlternativa'], message: 'precisa ser diferente da capa' });
    }),
});

export const collections = { ensaios };

// Dados de contato e marca. Fonte: briefing (PLANO_DIRETRIZES) e PENDENCIAS item 5 (confirmar antes de publicar).
export const site = {
  marca: 'Jr_Tech_OFC',
  nome: 'Jr_Tech_OFC Fotografia',
  fotografo: 'José Renato Alves da Silva',
  slogan: 'Nossa Arte, Seu Sucesso!',
  cidades: 'Imperatriz e Bacabal, MA',
  whatsapp: '5599982785958',
  whatsappExibicao: '(99) 98278-5958',
  email: 'jrtechofc@gmail.com',
  instagram: 'jose_renato_a',
} as const;

export const MENSAGEM_PADRAO = 'Olá, José Renato! Vi seu site e quero saber sobre um ensaio ou evento.';

export function linkWhatsApp(mensagem: string = MENSAGEM_PADRAO): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const linkEmail = `mailto:${site.email}?subject=${encodeURIComponent('Orçamento pelo site')}`;
export const linkInstagram = `https://www.instagram.com/${site.instagram}/`;

export const CATEGORIAS = {
  ensaios: { nome: 'Ensaios', titulo: 'Ensaios externos' },
  casais: { nome: 'Casais', titulo: 'Casais e gestantes' },
  eventos: { nome: 'Eventos e celebrações', titulo: 'Eventos e celebrações' },
} as const;

export type Categoria = keyof typeof CATEGORIAS;

// Assistente de escolha (revisão de 13/11/2026): duas perguntas curtas que colocam primeiro
// os álbuns que combinam com o que a pessoa procura. Nada fica escondido, só muda a ordem.
export const TIPOS_ASSISTENTE = [
  { id: 'ensaio', resposta: 'Um ensaio meu', titulo: 'ensaios externos', frase: 'um ensaio externo' },
  { id: 'casal', resposta: 'Casal ou gestante', titulo: 'casais e gestantes', frase: 'um ensaio de casal ou gestante' },
  { id: 'festa', resposta: '15 anos ou aniversário', titulo: '15 anos e aniversários', frase: 'fotos de 15 anos ou aniversário' },
  { id: 'evento', resposta: 'Evento, culto ou celebração', titulo: 'eventos e celebrações', frase: 'a cobertura de um evento' },
] as const;

export const PRAZOS_ASSISTENTE = [
  { id: 'mes', resposta: 'Este mês', frase: 'para este mês' },
  { id: 'meses', resposta: 'Nos próximos meses', frase: 'para os próximos meses' },
  { id: 'sem-data', resposta: 'Ainda sem data', frase: 'ainda sem data definida' },
] as const;

export type TipoAssistente = (typeof TIPOS_ASSISTENTE)[number]['id'];

/** Em qual resposta do assistente cada álbum se encaixa (pela categoria e pelo rótulo do manifesto). */
export function tipoDoEnsaio(categoria: Categoria, rotulo: string): TipoAssistente {
  if (categoria === 'casais') return 'casal';
  if (categoria === 'ensaios') return 'ensaio';
  return /15 anos|anivers/i.test(rotulo) ? 'festa' : 'evento';
}

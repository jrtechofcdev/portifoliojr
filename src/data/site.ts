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

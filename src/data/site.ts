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

/** Mensagem de orçamento já escrita para o WhatsApp (plano comercial de 13/11/2026).
 *  `pedido` completa "orçamento para ...". A última linha fica em aberto para a pessoa completar
 *  ali mesmo, onde o cursor já está (data, cidade), sem precisar editar o texto. */
export function mensagemOrcamento(pedido = 'um serviço fotográfico', completar = 'Serviço, data e cidade'): string {
  return `Olá! Conheci o trabalho da ${site.marca} pelo site e gostaria de solicitar um orçamento para ${pedido}.\n\n${completar}: `;
}

export const MENSAGEM_PADRAO = mensagemOrcamento();

export function linkWhatsApp(mensagem: string = MENSAGEM_PADRAO): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// Prévia de compartilhamento do portfólio (o que aparece ao enviar o link pelo WhatsApp).
// A imagem é a capa de couro gerada por scripts/capa-compartilhamento.mjs (npm run capa).
export const CAPA_SOCIAL = {
  titulo: 'Além do Olhar | Jr_Tech_OFC Fotografia',
  descricao: 'Cada fotografia guarda uma história. Abra o álbum da Jr_Tech_OFC e descubra o que existe além de cada registro.',
  imagem: '/capa-compartilhamento.jpg',
  imagemAlt:
    'Álbum de couro verde-grafite com costura, gravado com a marca Jr_Tech_OFC, o título Portfólio e a frase Existem histórias que merecem ser vistas.',
} as const;

export const linkEmail = `mailto:${site.email}?subject=${encodeURIComponent('Orçamento pelo site')}`;
export const linkInstagram = `https://www.instagram.com/${site.instagram}/`;

export const CATEGORIAS = {
  ensaios: { nome: 'Ensaios', titulo: 'Ensaios externos' },
  casais: { nome: 'Casais', titulo: 'Casais e gestantes' },
  eventos: { nome: 'Eventos e celebrações', titulo: 'Eventos e celebrações' },
} as const;

export type Categoria = keyof typeof CATEGORIAS;

// Álbuns em destaque, na ordem escolhida pelo fotógrafo em 13/11/2026 ("são os melhores").
// Formam a fileira "Em destaque" da home e aparecem primeiro em todo o site; os outros álbuns
// vêm depois, do mais recente ao mais antigo. Cada item é o nome do arquivo do manifesto
// (src/content/ensaios/<nome>.yaml). Para mudar a ordem, mude as linhas de lugar.
export const DESTAQUES = [
  'sabrina',
  'sara-e-yasmin',
  'aniversario-de-irenilde',
  'kiara-15-anos',
  'marlieth-e-paulo',
  'adrian-18-anos',
  'dalila',
  'bodas-de-ouro-nelson-e-dalvina',
] as const;

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

// Capítulos da home (revisão de 13/11/2026, noite): os álbuns agrupados pelo mesmo tipo que o
// assistente usa. O título tem uma palavra em itálico; o apoio é uma linha só.
export const CAPITULOS: Record<TipoAssistente, { titulo: [string, string]; apoio: string }> = {
  ensaio: { titulo: ['Ensaios', 'externos'], apoio: 'Retratos ao ar livre, a sós ou em boa companhia.' },
  casal: { titulo: ['Casais e', 'gestantes'], apoio: 'A história a dois e a espera de quem está chegando.' },
  festa: { titulo: ['15 anos e', 'aniversários'], apoio: 'A festa inteira, do primeiro retrato ao parabéns.' },
  evento: { titulo: ['Eventos e', 'celebrações'], apoio: 'Cultos, confraternizações e festas de família.' },
};

// Serviços (plano comercial de 13/11/2026). Cada um tem uma descrição curta e um botão de
// orçamento: `pedido` e `completar` montam a mensagem do WhatsApp (mensagemOrcamento), e
// `capitulo` aponta para os álbuns daquele tipo na home. Sem preços nem nomes de pacote.
export const SERVICOS = [
  {
    icone: 'pessoa',
    nome: 'Ensaios individuais',
    texto: 'Retratos ao ar livre, com as poses conduzidas do começo ao fim.',
    pedido: 'um ensaio individual',
    completar: 'Data e cidade',
    capitulo: 'ensaio',
  },
  {
    icone: 'coracao',
    nome: 'Ensaios de casais',
    texto: 'A história a dois, registrada com naturalidade.',
    pedido: 'um ensaio de casal',
    completar: 'Data e cidade',
    capitulo: 'casal',
  },
  {
    icone: 'broto',
    nome: 'Ensaios gestantes',
    texto: 'A espera de quem está chegando, a dois ou em família.',
    pedido: 'um ensaio gestante',
    completar: 'Data e cidade',
    capitulo: 'casal',
  },
  {
    icone: 'bolo',
    nome: 'Aniversários',
    texto: 'A festa, os convidados e os detalhes da decoração.',
    pedido: 'a cobertura de um aniversário',
    completar: 'Data e local',
    capitulo: 'festa',
  },
  {
    icone: 'coroa',
    nome: 'Festas de 15 anos',
    texto: 'Do primeiro retrato da debutante ao parabéns.',
    pedido: 'a cobertura de uma festa de 15 anos',
    completar: 'Data e local',
    capitulo: 'festa',
  },
  {
    icone: 'brilho',
    nome: 'Eventos e celebrações',
    texto: 'Cultos, confraternizações, bodas e festas de família.',
    pedido: 'a cobertura de um evento',
    completar: 'Tipo de evento, data e local',
    capitulo: 'evento',
  },
  {
    icone: 'local',
    nome: 'Coberturas externas',
    texto: 'Fotografia no local do seu evento. Outras cidades, sob consulta.',
    pedido: 'uma cobertura fotográfica externa',
    completar: 'Tipo de evento, data e local',
    capitulo: 'evento',
  },
] as const;

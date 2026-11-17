// Roteiro e respostas do assistente. Fonte: docs/DOCUMENTO_MESTRE_ASSISTENTE.md (16/11/2026),
// aprovado pelo fotógrafo, inclusive os preços. Tudo o que o assistente pergunta e responde está
// aqui, em texto comum: para mudar uma resposta, mude a frase. As `chaves` são as palavras que a
// pessoa pode escrever para chegar àquela opção (o motor em src/lib/entender.ts tolera erro de
// digitação e falta de acento; "palavra*" vale como começo de palavra).
// Regras do documento mestre: falar em primeira pessoa, como o fotógrafo; não confirmar data,
// local, deslocamento, estúdio, vídeo ou desconto sem ele; não prometer quantidade de fotos em
// evento; a política de cancelamento ainda não vale (casos concretos vão para o fotógrafo).
// `albuns` são nomes de arquivo de src/content/ensaios; o build para se algum não existir.
import { PASSOS, type TipoAssistente } from './site';

export interface OpcaoGuia {
  id: string;
  /** Texto do botão. */
  resposta: string;
  chaves: readonly string[];
  /** Como entra na mensagem do WhatsApp. */
  frase: string;
  /** Álbuns que mostram essa escolha, do mais indicado ao menos. */
  albuns?: readonly string[];
  /** Escolha que o fotógrafo precisa avaliar antes de falar em plano (casamento, formatura). */
  avaliar?: string;
}

/** ensaio: planos de ensaio · evento: planos por tempo de cobertura · consulta: orçamento sob medida. */
export type Servico = 'ensaio' | 'evento' | 'consulta';

export interface TipoGuia extends OpcaoGuia {
  /** Capítulo do portfólio (filtro de /trabalhos e ordem das listas). */
  capitulo: TipoAssistente;
  servico: Servico;
  /** Foto da opção: a capa deste álbum. */
  mini: string;
  /** Plural para "Separei ... para você". */
  titulo: string;
  /** Segunda pergunta, própria deste tipo. */
  segunda: { pergunta: string; opcoes: readonly OpcaoGuia[] };
  /** Observação honesta no resultado, quando o portfólio não tem um álbum exato. */
  nota?: string;
}

export interface Plano extends OpcaoGuia {
  nome: string;
  preco: string;
  itens: readonly string[];
  /** Etiqueta no cartão (ex.: "Melhor custo-benefício"). */
  selo?: string;
}

// ---------------------------------------------------------------------------------------------
// Planos (documento mestre, §5 e §6)
// ---------------------------------------------------------------------------------------------
export const PLANOS_ENSAIO: readonly Plano[] = [
  {
    id: 'essencial',
    nome: 'Essencial',
    preco: 'R$ 200,00',
    resposta: 'Algo mais rápido, 1 look',
    frase: 'Plano Essencial (R$ 200,00)',
    chaves: ['essencial', '1 look', 'um look', 'uma roupa', 'rapido', 'simples', 'mais barato', 'mais em conta', 'economico', '25 fotos', '1 hora', 'uma hora'],
    itens: ['25 fotografias editadas', 'Até 1 hora de ensaio', '1 look', 'Direção de poses', 'Galeria online para entrega'],
  },
  {
    id: 'destaque',
    nome: 'Destaque',
    preco: 'R$ 297,00',
    resposta: 'Mais fotos e 2 looks',
    frase: 'Plano Destaque (R$ 297,00)',
    selo: 'Melhor custo-benefício',
    chaves: ['destaque', '2 looks', 'dois looks', 'duas roupas', 'mais fotos', 'variedade', '45 fotos', '2 horas', 'duas horas', 'fotos impressas', 'custo beneficio'],
    itens: [
      '45 fotografias editadas',
      'Até 2 horas de ensaio',
      'Até 2 looks',
      '5 fotografias impressas (10 × 15 cm)',
      'Direção de poses',
      'Galeria online para entrega',
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 697,00',
    resposta: 'O completo, com álbum e pendrive',
    frase: 'Plano Premium (R$ 697,00)',
    chaves: ['premium', '3 looks', 'tres looks', 'tres roupas', 'album impresso', 'com album', 'album fisico', 'pendrive', 'o completo', '60 fotos', '3 horas', 'tres horas'],
    itens: [
      '60 ou mais fotografias editadas',
      'Até 3 horas de ensaio',
      'Até 3 looks',
      '10 fotografias impressas',
      'Álbum fotográfico personalizado',
      'Pendrive personalizado com as fotografias digitais',
      'Direção de poses',
      'Galeria online para entrega',
    ],
  },
];

export const PLANOS_EVENTO: readonly Plano[] = [
  {
    id: 'evento-essencial',
    nome: 'Evento Essencial',
    preco: 'R$ 350,00',
    resposta: 'Até 2 horas',
    frase: 'Evento Essencial, até 2 horas (R$ 350,00)',
    chaves: ['2 horas', 'duas horas', '1 hora', 'uma hora', 'pouco tempo', 'rapidinho', 'essencial'],
    itens: ['Até 2 horas de cobertura', 'Para aniversários pequenos, batizados, chás e celebrações curtas'],
  },
  {
    id: 'evento-classico',
    nome: 'Evento Clássico',
    preco: 'R$ 550,00',
    resposta: 'Até 4 horas',
    frase: 'Evento Clássico, até 4 horas (R$ 550,00)',
    chaves: ['3 horas', 'tres horas', '4 horas', 'quatro horas', 'classico'],
    itens: ['Até 4 horas de cobertura', 'Para aniversários, confraternizações e eventos com programação moderada'],
  },
  {
    id: 'evento-completo',
    nome: 'Evento Completo',
    preco: 'R$ 750,00',
    resposta: 'Até 6 horas',
    frase: 'Evento Completo, até 6 horas (R$ 750,00)',
    chaves: ['5 horas', 'cinco horas', '6 horas', 'seis horas', 'completo'],
    itens: ['Até 6 horas de cobertura', 'Recepção, momentos principais e boa parte da comemoração'],
  },
  {
    id: 'evento-integral',
    nome: 'Evento Integral',
    preco: 'R$ 950,00',
    resposta: 'Até 8 horas',
    frase: 'Evento Integral, até 8 horas (R$ 950,00)',
    chaves: ['7 horas', 'sete horas', '8 horas', 'oito horas', 'integral', 'o dia todo', 'tarde e noite', 'festa inteira'],
    itens: ['Até 8 horas de cobertura', 'Eventos longos, da tarde até a noite'],
  },
];

export const PERGUNTA_PLANO: Record<Exclude<Servico, 'consulta'>, string> = {
  ensaio: 'E o que você espera do ensaio?',
  evento: 'Quanto tempo da festa você quer fotografado?',
};

export const PLANO_NAO_SEI = {
  id: 'plano-naosei',
  resposta: 'Me ajuda a decidir',
  chaves: ['nao sei', 'me ajuda', 'me ajude', 'tanto faz', 'qual voce indica', 'qual o melhor', 'decidir'],
} as const;

/** Condições gerais, ditas no resultado do guia e nas dúvidas de pagamento e entrega. */
export const CONDICOES = {
  ensaio:
    'Para reservar a data, peço um sinal de 50%, e o restante você paga logo depois do ensaio, no mesmo dia. Aceito Pix, dinheiro e cartão, em até 3 vezes sem juros.',
  entregaEnsaio: 'Você recebe 5 fotos de prévia no mesmo dia, e as demais editadas em 10 a 15 dias úteis.',
  evento:
    'A quantidade de fotos varia com a duração e os momentos da festa. Entrego em 10 a 15 dias úteis, por galeria online. Para reservar, peço um sinal de 50%, e o restante é pago no dia do evento.',
  horaExtra: 'Se a festa passar do tempo contratado, a hora adicional é R$ 100,00, sempre combinada com você antes.',
  agenda: 'A data e o horário eu confirmo com você pelo WhatsApp, conforme a minha agenda.',
  deslocamento: 'Para outra cidade, o deslocamento a gente combina à parte.',
} as const;

// ---------------------------------------------------------------------------------------------
// Guia: o que a pessoa quer registrar
// ---------------------------------------------------------------------------------------------
const NO_QUE_IMPORTA = [
  { id: 'retratos', resposta: 'Retratos de quem faz a festa', frase: 'com atenção aos retratos', chaves: ['retrato*', 'ela', 'aniversariante', 'debutante', 'pose*'] },
  { id: 'familia', resposta: 'Família e convidados', frase: 'com a família e os convidados', chaves: ['familia', 'convidado*', 'amigo*', 'parente*', 'gente', 'pessoas'] },
  { id: 'detalhes', resposta: 'Decoração e detalhes', frase: 'com a decoração e os detalhes', chaves: ['decora*', 'detalhe*', 'bolo', 'mesa', 'painel', 'enfeite*'] },
  { id: 'tudo', resposta: 'Um pouco de tudo', frase: 'com os principais momentos', chaves: ['tudo', 'todos os momentos', 'um pouco de tudo', 'momentos'] },
] as const;

export const TIPOS: readonly TipoGuia[] = [
  {
    id: 'individual',
    resposta: 'Um ensaio só meu',
    capitulo: 'ensaio',
    servico: 'ensaio',
    mini: 'sabrina',
    titulo: 'ensaios externos',
    frase: 'um ensaio individual',
    chaves: ['ensaio', 'individual', 'sozinha', 'sozinho', 'book', 'ensaio externo', 'ensaio feminino', 'ensaio masculino', 'ensaio jovem', 'modelo'],
    albuns: ['sabrina', 'dalila', 'sara-e-yasmin'],
    segunda: {
      pergunta: 'Que estilo combina mais com você?',
      opcoes: [
        { id: 'natural', resposta: 'Natural, ao ar livre', frase: 'natural, ao ar livre', chaves: ['natural', 'ar livre', 'externo', 'estrada', 'campo', 'natureza', 'rua', 'leve', 'dia'], albuns: ['dalila', 'sabrina'] },
        { id: 'noite', resposta: 'Noturno, com flash', frase: 'noturno, com flash', chaves: ['noite', 'noturno', 'flash', 'escuro', 'anoitecer', 'dramatic*', 'ousad*'], albuns: ['sara-e-yasmin'] },
        { id: 'objeto', resposta: 'Com um objeto que conta minha história', frase: 'com um objeto que conta a minha história', chaves: ['livro', 'objeto', 'tema', 'historia', 'conceito', 'acessorio', 'leitura', 'hobby'], albuns: ['sabrina'] },
        { id: 'cartaz', resposta: 'Retrato para cartaz ou divulgação', frase: 'para cartaz ou divulgação', chaves: ['cartaz', 'divulga*', 'banner', 'convite', 'propaganda'], albuns: ['tia-josina'] },
      ],
    },
  },
  {
    id: 'casal',
    resposta: 'Casal',
    capitulo: 'casal',
    servico: 'ensaio',
    mini: 'victor-e-tamires',
    titulo: 'ensaios a dois',
    frase: 'um ensaio de casal',
    chaves: ['casal', 'namorad*', 'noivo*', 'noiva*', 'marido', 'esposa', 'a dois', 'nos dois', 'pre wedding', 'romantic*', 'love'],
    albuns: ['victor-e-tamires', 'marlieth-e-paulo'],
    nota: 'Os ensaios a dois do portfólio são de casais esperando bebê, e mostram como eu conduzo um casal diante da câmera.',
    segunda: {
      pergunta: 'Que clima vocês querem nas fotos?',
      opcoes: [
        { id: 'romantico', resposta: 'Romântico e próximo', frase: 'num clima romântico', chaves: ['romantic*', 'proximo', 'carinho', 'beijo', 'abraço', 'amor', 'intimo'] },
        { id: 'leve', resposta: 'Leve e divertido', frase: 'num clima leve e divertido', chaves: ['divertid*', 'leve', 'alegre', 'risada', 'descontraid*', 'espontane*'] },
        { id: 'tema', resposta: 'Com um tema especial', frase: 'com um tema especial', chaves: ['tema', 'objeto', 'historia', 'conceito', 'pedido', 'aniversario de namoro'] },
      ],
    },
  },
  {
    id: 'gestante',
    resposta: 'Gestante',
    capitulo: 'casal',
    servico: 'ensaio',
    mini: 'marlieth-e-paulo',
    titulo: 'ensaios gestantes',
    frase: 'um ensaio gestante',
    chaves: ['gestante', 'gravida', 'gravidez', 'barriga', 'gestacao', 'gestacional', 'ensaio gestante', 'bebe a caminho', 'esperando bebe', 'maternidade', 'mamae'],
    albuns: ['marlieth-e-paulo', 'victor-e-tamires'],
    segunda: {
      pergunta: 'Quem vai aparecer nas fotos?',
      opcoes: [
        { id: 'mae', resposta: 'Só a mamãe', frase: 'só da mamãe', chaves: ['so eu', 'sozinha', 'mamae', 'mae', 'so ela'] },
        { id: 'casal', resposta: 'O casal', frase: 'do casal', chaves: ['casal', 'marido', 'pai', 'nos dois', 'esposo', 'papai'] },
        { id: 'familia', resposta: 'A família toda', frase: 'com a família', chaves: ['familia', 'filho*', 'filha*', 'todos', 'irmao*'] },
      ],
    },
  },
  {
    id: 'infantil',
    resposta: 'Infantil ou família',
    capitulo: 'ensaio',
    servico: 'ensaio',
    mini: 'jose',
    titulo: 'ensaios infantis e de família',
    frase: 'um ensaio infantil',
    chaves: ['infantil', 'crianca', 'filho*', 'filha*', 'menino', 'menina', 'neto*', 'sobrinh*', 'familia', 'mae e filho', 'country', 'fazenda'],
    albuns: ['jose'],
    segunda: {
      pergunta: 'Quem vai aparecer nas fotos?',
      opcoes: [
        { id: 'crianca', resposta: 'Só a criança', frase: 'só da criança', chaves: ['so ele', 'so ela', 'crianca', 'sozinho', 'sozinha'] },
        { id: 'mae', resposta: 'A criança com a mãe ou o pai', frase: 'da criança com a mãe ou o pai', chaves: ['mae', 'pai', 'comigo', 'mae e filho', 'pai e filho', 'mamae', 'papai'] },
        { id: 'familia', resposta: 'A família toda', frase: 'com a família toda', chaves: ['familia', 'todos', 'irmao*', 'avo*'] },
      ],
    },
  },
  {
    id: 'quinze',
    resposta: 'Festa de 15 anos',
    capitulo: 'festa',
    servico: 'evento',
    mini: 'kiara-15-anos',
    titulo: 'festas de 15 anos',
    frase: 'a cobertura de uma festa de 15 anos',
    chaves: ['15 anos', 'quinze anos', 'debutante', 'festa de 15', 'xv anos', 'baile de debutante'],
    albuns: ['kiara-15-anos', 'vitoria-emanuela-15-anos'],
    segunda: { pergunta: 'O que não pode faltar nas fotos?', opcoes: NO_QUE_IMPORTA },
  },
  {
    id: 'aniversario',
    resposta: 'Aniversário',
    capitulo: 'festa',
    servico: 'evento',
    mini: 'aniversario-de-irenilde',
    titulo: 'aniversários',
    frase: 'a cobertura de um aniversário',
    chaves: ['anivers*', 'niver', 'festa de aniversario', 'bolo', 'parabens', '18 anos', 'dezoito anos', '40 anos', 'quarenta anos', '50 anos'],
    albuns: ['aniversario-de-irenilde', 'adrian-18-anos'],
    segunda: { pergunta: 'O que não pode faltar nas fotos?', opcoes: NO_QUE_IMPORTA },
  },
  {
    id: 'evento',
    resposta: 'Evento, culto ou celebração',
    capitulo: 'evento',
    servico: 'evento',
    mini: 'bodas-de-ouro-nelson-e-dalvina',
    titulo: 'eventos e celebrações',
    frase: 'a cobertura de um evento',
    chaves: ['evento*', 'culto', 'igreja', 'gospel', 'confra*', 'celebra*', 'bodas', 'batizado', 'cha revelacao', 'cha de bebe', 'encontro', 'congresso', 'retiro', 'cerimonia', 'cobertura'],
    albuns: ['bodas-de-ouro-nelson-e-dalvina', 'manha-com-deus', 'confra-juventude-estrela-de-luz'],
    segunda: {
      pergunta: 'Que tipo de evento é?',
      opcoes: [
        { id: 'igreja', resposta: 'Culto ou evento de igreja', frase: 'de igreja', chaves: ['culto', 'igreja', 'gospel', 'louvor', 'congresso', 'retiro', 'jovens', 'juventude', 'ministerio'], albuns: ['manha-com-deus', 'confra-juventude-estrela-de-luz'] },
        { id: 'familia', resposta: 'Bodas ou celebração de família', frase: 'de família', chaves: ['bodas', 'familia', 'renovacao', 'celebra*', 'homenage*'], albuns: ['bodas-de-ouro-nelson-e-dalvina'] },
        { id: 'cha', resposta: 'Batizado ou chá', frase: '(batizado ou chá)', chaves: ['batizado', 'cha', 'cha revelacao', 'cha de bebe', 'cha de fraldas', 'cha de panela'] },
        { id: 'confra', resposta: 'Confraternização', frase: 'de confraternização', chaves: ['confra*', 'jantar', 'amigos', 'empresa', 'equipe', 'fim de ano', 'natal'], albuns: ['confra-juventude-estrela-de-luz'] },
        {
          id: 'formatura',
          resposta: 'Formatura',
          frase: '(formatura)',
          chaves: ['formatura', 'colacao', 'baile de formatura', 'formando*'],
          avaliar: 'Formatura eu avalio caso a caso, conforme o tamanho, a duração e a programação.',
        },
        {
          id: 'casamento',
          resposta: 'Casamento',
          frase: '(casamento)',
          chaves: ['casamento', 'casar', 'cartorio', 'noivos', 'cerimonia de casamento', 'comunitario'],
          avaliar:
            'Não costumo fazer a cobertura completa de casamentos grandes, porque trabalho sem equipe e não conseguiria garantir todos os momentos. Casamento no cartório, cerimônia simples ou casamento comunitário eu avalio com você.',
        },
        { id: 'outro', resposta: 'Outro evento', frase: '', chaves: ['outro', 'outra coisa', 'inauguracao', 'palestra'] },
      ],
    },
  },
  {
    id: 'profissional',
    resposta: 'Profissional ou empresa',
    capitulo: 'ensaio',
    servico: 'consulta',
    mini: 'tia-josina',
    titulo: 'retratos',
    frase: 'fotografia profissional',
    chaves: ['profissional', 'linkedin', 'perfil', 'foto de perfil', 'empresa', 'corporativ*', 'produto*', 'loja', 'negocio', 'curriculo', 'equipe', 'trabalho'],
    albuns: ['tia-josina'],
    segunda: {
      pergunta: 'O que você precisa?',
      opcoes: [
        { id: 'perfil', resposta: 'Foto de perfil ou LinkedIn', frase: 'para perfil ou LinkedIn', chaves: ['perfil', 'linkedin', 'curriculo', 'rede social', 'foto minha'] },
        { id: 'empresa', resposta: 'Fotos da empresa ou da equipe', frase: 'para empresa ou equipe', chaves: ['empresa', 'equipe', 'funcionarios', 'corporativ*', 'institucional'] },
        { id: 'produtos', resposta: 'Fotos de produtos', frase: 'de produtos', chaves: ['produto*', 'catalogo', 'loja', 'cardapio', 'mercadoria'] },
        { id: 'ambiente', resposta: 'No meu ambiente de trabalho', frase: 'no ambiente de trabalho', chaves: ['ambiente', 'escritorio', 'consultorio', 'salao', 'local de trabalho'] },
      ],
    },
  },
];

/** "Ainda não sei": a pessoa escolhe por foto entre os capítulos. */
export const NAO_SEI = {
  id: 'naosei',
  resposta: 'Ainda não sei',
  chaves: ['nao sei', 'sei la', 'indecis*', 'tanto faz', 'qualquer', 'me ajuda a escolher', 'me ajude', 'sugest*', 'nao tenho ideia'],
  opcoes: ['individual', 'gestante', 'quinze', 'evento'],
} as const;

export const PRAZOS: readonly OpcaoGuia[] = [
  { id: 'mes', resposta: 'Este mês', frase: 'para este mês', chaves: ['este mes', 'esse mes', 'agora', 'urgente', 'logo', 'essa semana', 'esta semana', 'semana que vem', 'proxima semana', 'amanha', 'hoje', 'fim de semana', 'sabado', 'domingo'] },
  {
    id: 'meses',
    resposta: 'Nos próximos meses',
    frase: 'para os próximos meses',
    chaves: ['mês que vem', 'próximo mês', 'próximos meses', 'daqui a alguns meses', 'daqui a', 'mais pra frente', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 'ano que vem', 'proximo ano'],
  },
  { id: 'sem-data', resposta: 'Ainda sem data', frase: 'ainda sem data definida', chaves: ['sem data', 'nao sei', 'ainda nao', 'nao tenho data', 'nao definid*', 'sem previsao', 'depois', 'futuro', 'pesquisando', 'so olhando', 'so vendo'] },
];

export const CIDADES: readonly OpcaoGuia[] = [
  { id: 'bacabal', resposta: 'Bacabal', frase: 'em Bacabal', chaves: ['Bacabal'] },
  { id: 'imperatriz', resposta: 'Imperatriz', frase: 'em Imperatriz', chaves: ['Imperatriz', 'itz'] },
  {
    id: 'outra',
    resposta: 'Outra cidade',
    frase: 'em outra cidade (a combinar)',
    chaves: ['outra cidade', 'outra', 'fora', 'montes altos', 'sao luis', 'teresina', 'pedreiras', 'lago da pedra', 'codo', 'caxias', 'santa ines', 'acailandia', 'presidente dutra', 'timon', 'balsas', 'trizidela', 'esperantinopolis', 'joselandia', 'sao mateus'],
  },
];

/** Perguntas do guia, na ordem. A segunda depende do tipo; a do plano, do serviço. */
export const PERGUNTAS = {
  tipo: 'O que você gostaria de fotografar?',
  prazo: 'Para quando você imagina?',
  cidade: 'E em qual cidade?',
} as const;

// ---------------------------------------------------------------------------------------------
// Dúvidas
// ---------------------------------------------------------------------------------------------
export interface Duvida {
  id: string;
  /** Texto do botão. */
  pergunta: string;
  chaves: readonly string[];
  /** Parágrafos da resposta. */
  resposta: readonly string[];
  /** Cartões de planos depois do primeiro parágrafo. */
  planos?: 'ensaio' | 'evento';
  /** Links (páginas do site abrem na mesma janela). */
  links?: readonly { rotulo: string; href: string }[];
  /** Mostra o botão de falar no WhatsApp junto da resposta. */
  contato?: boolean;
  /** Mostra o botão que leva ao guia ("Me ajude a escolher"). */
  guia?: boolean;
  /** Assuntos que aparecem em seguida, como próximo passo. */
  seguintes?: readonly string[];
}

export const DUVIDAS: readonly Duvida[] = [
  {
    id: 'valores',
    pergunta: 'Planos e valores de ensaio',
    chaves: ['preco*', 'valor*', 'quanto custa', 'quanto e', 'quanto fica', 'quanto sai', 'custa', 'custo', 'investimento', 'caro', 'barato', 'cobra*', 'tabela', 'pacote*', 'plano*', 'valor do orçamento', 'preço do ensaio', 'valor do ensaio'],
    resposta: [
      'Para ensaios eu tenho três planos:',
      'O Destaque costuma ser o de melhor custo-benefício para quem quer mais fotos e variedade. Me conta o que você imagina que eu te ajudo a escolher.',
    ],
    planos: 'ensaio',
    guia: true,
    seguintes: ['pagamento', 'valores-eventos', 'entrega'],
  },
  {
    id: 'valores-eventos',
    pergunta: 'Planos de festas e eventos',
    chaves: ['cobertura de evento', 'cobertura da festa', 'preço da festa', 'valor da festa', 'valor do evento', 'preço do evento', 'quanto custa a festa', 'quanto custa o evento', 'fotografar uma festa', 'fotografar o evento', 'planos de evento', 'hora adicional', 'hora extra', 'por hora'],
    resposta: [
      'Para festas e eventos, os planos são pelo tempo de cobertura:',
      'A quantidade de fotos varia com a duração e os momentos da festa, e a hora adicional é R$ 100,00, sempre combinada com você antes. O serviço é de fotografia, com um fotógrafo.',
    ],
    planos: 'evento',
    guia: true,
    seguintes: ['pagamento', 'entrega', 'casamento'],
  },
  {
    id: 'pagamento',
    pergunta: 'Pagamento e reserva',
    chaves: ['pagamento', 'pagar', 'pix', 'cartao', 'credito', 'debito', 'dinheiro', 'parcel*', 'vezes', 'juros', 'sinal', 'entrada', 'reserva*', 'pagar tudo antes', 'restante', 'mercado pago', 'forma de pagamento'],
    resposta: [
      'Aceito Pix, dinheiro e cartão de crédito ou débito, por link do Mercado Pago. No cartão, até 3 vezes sem juros; de 4 a 12 vezes, com os juros da plataforma, e eu te mostro o valor total antes de você pagar.',
      'Para reservar a data, peço um sinal de 50%. Nos ensaios, o restante é pago logo depois do ensaio, no mesmo dia. Nos eventos, no dia do evento.',
    ],
    contato: true,
    seguintes: ['desconto', 'remarcar', 'valores'],
  },
  {
    id: 'desconto',
    pergunta: 'Tem desconto?',
    chaves: ['desconto', 'promoca*', 'mais barato', 'abaixar', 'baixar o preço', 'negociar', 'cupom'],
    resposta: ['Não tenho desconto padrão. Se você tiver uma situação especial, me conta que eu avalio com você.'],
    contato: true,
    seguintes: ['pagamento', 'valores'],
  },
  {
    id: 'como-funciona',
    pergunta: 'Como funciona',
    chaves: ['como funciona', 'funciona', 'etapa*', 'processo', 'passo a passo', 'como e', 'como faz', 'como contratar'],
    resposta: ['Funciona em cinco etapas, do primeiro contato à entrega:', ...PASSOS.map((p, i) => `${i + 1}. ${p.nome}: ${p.texto}`)],
    links: [{ rotulo: 'Ver a página Como funciona', href: '/como-funciona' }],
    seguintes: ['valores', 'entrega', 'agendar'],
  },
  {
    id: 'servicos',
    pergunta: 'O que você fotografa',
    chaves: ['servico*', 'o que voce faz', 'o que voce fotografa', 'que tipo de foto', 'tipos de ensaio', 'opcoes de ensaio', 'voce faz'],
    resposta: [
      'Fotografo ensaios (individual, casal, gestante, infantil e família), festas e eventos (aniversários, 15 anos, batizados, chás, cultos e confraternizações) e também fotos profissionais: perfil, LinkedIn, empresas e produtos.',
      'Meu foco é fotografia, com ensaios externos e direção de poses.',
    ],
    links: [{ rotulo: 'Ver a página de serviços', href: '/servicos' }],
    seguintes: ['valores', 'valores-eventos', 'profissional-info', 'video', 'casamento', 'naofaz'],
  },
  {
    id: 'profissional-info',
    pergunta: 'Fotos profissionais e de empresa',
    chaves: ['voce faz foto profissional', 'faz foto de empresa', 'faz foto de produto', 'fotos de produto', 'no ambiente de trabalho', 'institucional'],
    resposta: [
      'Faço fotos para perfil pessoal, LinkedIn, empresas e produtos, e também no seu ambiente de trabalho, depois de avaliar o local.',
      'O valor depende do que você precisa, então me conta os detalhes que eu preparo o orçamento.',
    ],
    contato: true,
    seguintes: ['pagamento', 'onde'],
  },
  {
    id: 'entrega',
    pergunta: 'Entrega das fotos',
    chaves: ['prazo', 'entrega', 'entregar', 'quando recebo', 'receber', 'recebo', 'demora', 'quanto tempo', 'quantos dias', 'pronta*', 'arquivo*', 'online', 'link', 'manda todas', 'previa', 'alta resolucao'],
    resposta: [
      'Nos ensaios, você recebe 5 fotos de prévia no mesmo dia, e as demais editadas em 10 a 15 dias úteis. Antes, te mando um link para você escolher as fotos que quer editadas, dentro da quantidade do plano.',
      'Nos eventos, a entrega é em 10 a 15 dias úteis, sem prévia no mesmo dia.',
      'Tudo em alta resolução, pronto para imprimir, por um link de galeria que eu mando no WhatsApp. O álbum e o pendrive do plano Premium ficam prontos em até 30 dias.',
    ],
    seguintes: ['galeria', 'edicao', 'valores'],
  },
  {
    id: 'galeria',
    pergunta: 'Por quanto tempo fica o link',
    chaves: ['galeria', 'quanto tempo o link', 'link fica disponivel', 'disponivel', 'link fica', 'quanto tempo o link', 'perdi o link', 'perder o link', 'expira', 'acesso', 'guarda as fotos', 'backup', 'armazena*'],
    resposta: [
      'O link da galeria fica disponível por 1 ano, para ensaios e eventos. Se perder o link nesse período, é só me pedir de novo.',
      'Depois, dá para estender o acesso com um pagamento único: 1 ano a mais por R$ 29,90, 2 anos por R$ 49,90 ou 3 anos por R$ 69,90.',
    ],
    seguintes: ['entrega', 'edicao'],
  },
  {
    id: 'edicao',
    pergunta: 'Ajustes na edição',
    chaves: ['edicao', 'editar', 'alteraca*', 'ajuste*', 'retoque', 'mudar a foto', 'refazer a edicao', 'tratamento'],
    resposta: [
      'Em cada entrega você pode pedir até 3 alterações de edição. Passando disso, cada foto com alteração extra custa R$ 15,00.',
    ],
    seguintes: ['entrega', 'galeria'],
  },
  {
    id: 'agendar',
    pergunta: 'Agendar uma data',
    chaves: ['agendar', 'agenda', 'marcar', 'marcar um horario', 'horario livre', 'disponibilidade', 'disponivel', 'data livre', 'como faço pra marcar', 'reservar a data', 'antecedencia', 'feriado', 'fim de semana'],
    resposta: [
      'Para marcar, me conta o tipo de ensaio ou evento, a cidade e o dia que você imagina. Eu confirmo a agenda e a gente reserva a data com o sinal de 50%. O contrato vai pelo WhatsApp.',
      'Para ensaios, peço que o agendamento seja feito com até 7 dias de antecedência. Para eventos, de preferência de 15 a 30 dias antes. Fotografo de segunda a domingo e também em feriados, em horário combinado.',
    ],
    contato: true,
    seguintes: ['remarcar', 'horario', 'pagamento'],
  },
  {
    id: 'remarcar',
    pergunta: 'Imprevisto ou remarcação',
    chaves: ['imprevisto', 'sinal de volta', 'receber o sinal', 'cancelar e receber', 'mudar o dia', 'mudar a data', 'trocar a data', 'remarcar', 'remarcacao', 'cancelar', 'cancelamento', 'desmarcar', 'desistir', 'reembolso', 'devolver o sinal', 'perder o sinal', 'adiar'],
    resposta: [
      'Imprevistos acontecem. Se precisar mudar o dia, me avise o quanto antes que eu vejo a agenda e a gente avalia a remarcação.',
      'Casos de cancelamento e reembolso eu avalio com você diretamente, pelo WhatsApp.',
    ],
    contato: true,
    seguintes: ['chuva', 'agendar'],
  },
  {
    id: 'chuva',
    pergunta: 'E se chover?',
    chaves: ['chuva', 'chover', 'chovendo', 'tempo ruim', 'nublado', 'clima'],
    resposta: [
      'Se chover antes do ensaio, dá para remarcar sem custo. Se começar a chover durante, a gente para por segurança e avalia uma nova data.',
      'Com céu nublado e sem chuva, o ensaio pode acontecer normalmente. Em chuva leve, a gente decide junto. E se você preferir não arriscar, combinamos outro dia, conforme a agenda.',
    ],
    seguintes: ['horario', 'remarcar'],
  },
  {
    id: 'onde',
    pergunta: 'Onde você atende',
    chaves: ['onde', 'cidade*', 'atende', 'regiao', 'viaja', 'viagem', 'longe', 'deslocamento', 'outra cidade', 'que cidade', 'atende em', 'qualquer lugar'],
    resposta: [
      'Minha base é Bacabal, e também atendo em Imperatriz. Já fotografei em Montes Altos, e outras cidades eu avalio com você. O deslocamento é combinado à parte para cada ensaio ou evento.',
    ],
    contato: true,
    seguintes: ['locais', 'agendar'],
  },
  {
    id: 'locais',
    pergunta: 'Lugares para o ensaio',
    chaves: ['lugar', 'lugares', 'locais', 'local para ensaio', 'onde fazer', 'cenario', 'parque', 'praça', 'orla', 'bosque', 'qualquer lugar', 'ponto de encontro'],
    resposta: [
      'Alguns lugares que costumo sugerir:',
      'Em Bacabal: o Parque Ambiental (ótimo para ensaio infantil), a Praça da Família, perto da UEMA, e o Residencial Green Park, no Areal.',
      'Em Imperatriz: a Orla da Beira Rio e o Bosque Jardim das Oliveiras.',
      'O ponto exato a gente combina no dia. Também posso fotografar em outro lugar que você preferir, depois de avaliar o acesso e a segurança.',
    ],
    seguintes: ['horario', 'estudio', 'noite'],
  },
  {
    id: 'horario',
    pergunta: 'Melhor horário',
    chaves: ['horario', 'melhor horario', 'que horas', 'melhor hora', 'luz', 'por do sol', 'golden hour', 'hora dourada', 'manha', 'tarde', 'nascer do sol'],
    resposta: [
      'Para ensaio ao ar livre, a melhor luz costuma ser bem cedo, das 5h30 às 8h30, ou no fim da tarde, das 15h30 às 18h. Das 16h30 às 17h30 é a hora dourada, ótima para retratos.',
      'Esses horários mudam um pouco com a época do ano, e eu ajusto com você conforme o local e o tempo.',
    ],
    seguintes: ['chuva', 'locais'],
  },
  {
    id: 'noite',
    pergunta: 'Ensaio à noite',
    chaves: ['noite', 'noturno', 'noturna', 'flash', 'escuro', 'anoitecer'],
    resposta: [
      'Faço ensaio à noite, com flash, como o da Sara & Yasmin. Antes eu avalio a iluminação, a segurança e as condições do lugar.',
    ],
    links: [{ rotulo: 'Ver o álbum Sara & Yasmin', href: '/trabalhos/sara-e-yasmin' }],
    contato: true,
    seguintes: ['locais', 'valores'],
  },
  {
    id: 'estudio',
    pergunta: 'Ensaio em estúdio',
    chaves: ['estudio', 'fundo branco', 'fundo infinito', 'lugar fechado'],
    resposta: [
      'Meus ensaios são feitos de preferência ao ar livre. Se você quiser estúdio, eu verifico a disponibilidade e o custo da locação, que entra no valor final do ensaio.',
    ],
    contato: true,
    seguintes: ['locais', 'valores'],
  },
  {
    id: 'video',
    pergunta: 'Vocês fazem vídeo?',
    chaves: ['video', 'filmagem', 'filmar', 'filme', 'videomaker', 'reels', 'drone'],
    resposta: [
      'Meu trabalho é fotografia. Vídeo eu só consigo avaliar caso a caso, porque depende de encontrar um videomaker disponível e do custo. Se quiser, me conta o que você imagina.',
    ],
    contato: true,
    seguintes: ['servicos', 'valores-eventos'],
  },
  {
    id: 'casamento',
    pergunta: 'Casamento',
    chaves: ['casamento', 'casar', 'cartorio', 'noivos', 'cerimonia de casamento', 'casamento comunitario', 'faz casamento'],
    resposta: [
      'Não costumo fazer a cobertura completa de casamentos grandes, porque trabalho sem equipe e não conseguiria garantir todos os momentos.',
      'Casamento no cartório, cerimônia simples ou casamento comunitário eu avalio com você. Me conta a data, o local e como vai ser.',
    ],
    contato: true,
    seguintes: ['valores-eventos', 'servicos'],
  },
  {
    id: 'naofaz',
    pergunta: 'Newborn e smash the cake',
    chaves: ['smash the cake', 'smash', 'newborn', 'recem nascido', 'recem-nascido', 'mesversario', 'acompanhamento mensal', 'mes a mes', 'ensaio do bebe todo mes'],
    resposta: [
      'No momento eu não faço smash the cake, newborn (recém-nascido) nem acompanhamento mensal do bebê.',
      'Ensaio infantil e de família eu faço, como o do José.',
    ],
    links: [{ rotulo: 'Ver o álbum do José', href: '/trabalhos/jose' }],
    seguintes: ['servicos', 'valores'],
  },
  {
    id: 'preparar',
    pergunta: 'Como me preparar',
    chaves: ['preparar', 'preparo', 'preparacao', 'dica*', 'antes do ensaio'],
    resposta: ['Posso te ajudar a se preparar. Sobre o que você quer saber?'],
    seguintes: ['vergonha', 'roupa', 'levar', 'beleza', 'infantil-dicas', 'gestante-quando'],
  },
  {
    id: 'vergonha',
    pergunta: 'Não sei posar',
    chaves: ['posar', 'pose*', 'timid*', 'vergonha', 'nunca fiz', 'nao sei posar', 'experiencia', 'nervos*', 'travad*', 'me orientar', 'vai me orientar', 'nao sou modelo', 'desajeitad*'],
    resposta: [
      'Você não precisa saber posar. Eu oriento as poses, os movimentos e as expressões durante todo o ensaio, no seu tempo.',
      'Dá para caminhar, sorrir, interagir com o lugar e relaxar. Seja você mesmo(a).',
    ],
    seguintes: ['roupa', 'levar', 'valores'],
  },
  {
    id: 'roupa',
    pergunta: 'Que roupa usar',
    chaves: ['roupa*', 'que look', 'qual look', 'vestir', 'vestido', 'cor*', 'estampa*', 'figurino', 'o que usar'],
    resposta: [
      'Escolha peças que tenham a sua cara e combinem com o lugar. Cores que costumam funcionar bem: neutras (branco, bege, creme, cinza, preto), terrosas (marrom, caramelo, terracota) e suaves (azul-claro, verde-oliva, rosa queimado).',
      'Para um visual mais atemporal, evite estampas muito grandes, logotipos e frases chamativas, excesso de cores e padrões miudinhos. São sugestões, não regras: se quiser, me manda fotos das opções que eu te ajudo a escolher.',
    ],
    seguintes: ['beleza', 'levar'],
  },
  {
    id: 'beleza',
    pergunta: 'Cabelo e maquiagem',
    chaves: ['cabelo', 'cabeleireir*', 'penteado', 'maquiagem', 'maquiador*', 'make', 'salao'],
    resposta: [
      'Para cabelo, indico a Thaiane Santos (@thaiane_santos.hair). O serviço dela é contratado à parte, fora dos planos.',
      'Maquiadora eu ainda não tenho para indicar.',
    ],
    links: [{ rotulo: 'Instagram da Thaiane Santos', href: 'https://www.instagram.com/thaiane_santos.hair/' }],
    seguintes: ['roupa', 'levar'],
  },
  {
    id: 'levar',
    pergunta: 'O que levar no dia',
    chaves: ['levar', 'o que levar', 'trazer', 'no dia do ensaio', 'precisa levar'],
    resposta: [
      'Leve as roupas dos looks do seu plano, calçados confortáveis, maquiagem e itens para retoque (se usar), água, os acessórios ou objetos que quiser nas fotos e referências, se tiver.',
    ],
    seguintes: ['roupa', 'vergonha'],
  },
  {
    id: 'infantil-dicas',
    pergunta: 'Dicas para ensaio infantil',
    chaves: ['ensaio infantil', 'crianca chora', 'crianca', 'soneca', 'bebe', 'filho pequeno', 'dicas infantil'],
    resposta: [
      'Marque num horário em que a criança esteja descansada e, se der, longe da hora da soneca. Leve água, lanche, o brinquedo favorito e uma troca de roupa.',
      'Durante o ensaio eu não forço poses: priorizo brincadeiras e expressões espontâneas.',
    ],
    links: [{ rotulo: 'Ver o álbum do José', href: '/trabalhos/jose' }],
    seguintes: ['locais', 'valores'],
  },
  {
    id: 'gestante-quando',
    pergunta: 'Melhor época do ensaio gestante',
    chaves: ['semanas', 'com quantas semanas', 'semanas de gestacao', 'quantas semanas', 'quantos meses', 'que mes da gravidez', 'quando fazer o ensaio gestante', 'melhor epoca'],
    resposta: [
      'Para o planejamento das fotos, prefiro entre a 28ª e a 32ª semana, por volta do 7º mês. Vale considerar como você está se sentindo e a orientação de quem acompanha a sua gestação.',
      'Use roupas confortáveis e tecidos leves, e a gente faz pausas sempre que precisar.',
    ],
    links: [{ rotulo: 'Ver o álbum Marlieth & Paulo', href: '/trabalhos/marlieth-e-paulo' }],
    seguintes: ['roupa', 'valores'],
  },
  {
    id: 'quem',
    pergunta: 'Posso levar alguém?',
    chaves: ['quem pode', 'participar', 'levar alguem', 'pode levar', 'acompanhante', 'levar meu cachorro', 'levar meu pet', 'levar meu namorado', 'levar minha namorada', 'levar minha mae', 'levar minha amiga', 'levar meu filho', 'ou e so individual', 'com minha amiga', 'com meu amigo', 'com minha mae', 'com meu pai', 'so individual', 'ou e so individual', 'pet', 'cachorro', 'gato', 'mais pessoas'],
    resposta: [
      'Pode sim! Você pode levar mãe, pai, namorado(a), amigo(a) ou outra pessoa, sem custo a mais, e dá para fazer algumas fotos juntos, sem atrapalhar o planejamento do ensaio.',
      'Se a outra pessoa também quiser um ensaio próprio, aí é outro pacote. Pet também pode, quando o lugar for adequado e seguro.',
    ],
    seguintes: ['valores', 'locais'],
  },
  {
    id: 'contrato',
    pergunta: 'Contrato e uso das fotos',
    chaves: ['contrato', 'autoriza*', 'postar', 'publicar', 'instagram', 'marcar voce', 'portfolio', 'minhas fotos no site', 'uso de imagem'],
    resposta: [
      'O contrato vai pelo WhatsApp. Eu peço autorização para usar algumas fotos no Instagram e no portfólio, mas você não é obrigado(a) a autorizar para contratar.',
      'Você pode postar as suas fotos à vontade. Se puder marcar @jose_renato_a, eu agradeço.',
    ],
    links: [
      { rotulo: 'Política de privacidade', href: '/privacidade' },
      { rotulo: 'Direitos autorais', href: '/direitos-autorais' },
    ],
    seguintes: ['privacidade', 'pagamento'],
  },
  {
    id: 'privacidade',
    pergunta: 'Minhas fotos e privacidade',
    chaves: ['privacidade', 'tirar foto do site', 'remover', 'apagar', 'dados', 'lgpd', 'direito*', 'seguranca'],
    resposta: [
      'As fotos só entram no portfólio com a autorização de quem aparece nelas, ou do responsável, no caso de crianças. Você pode pedir para retirar uma foto quando quiser.',
      'Este atendimento funciona só no seu aparelho. Nada do que você escreve aqui é enviado, a não ser a mensagem que você decidir mandar pelo WhatsApp.',
    ],
    links: [
      { rotulo: 'Política de privacidade', href: '/privacidade' },
      { rotulo: 'Direitos autorais', href: '/direitos-autorais' },
    ],
    seguintes: ['contrato', 'como-funciona'],
  },
  {
    id: 'atendimento',
    pergunta: 'Horário de atendimento',
    chaves: ['horario de atendimento', 'que horas atende', 'atende que horas', 'responde', 'demora pra responder', 'presencial', 'escritorio', 'atendimento'],
    resposta: [
      'Respondo pelo WhatsApp de segunda a sexta, das 8h às 20h. O atendimento presencial é em horário comercial, e posso ir até você, em casa ou no trabalho, quando fizer sentido.',
    ],
    contato: true,
    seguintes: ['agendar', 'como-funciona'],
  },
  {
    id: 'portfolio',
    pergunta: 'Ver o portfólio',
    chaves: ['ver fotos', 'albuns', 'trabalhos', 'galeria de fotos', 'exemplos', 'fotos que voce fez', 'seu trabalho'],
    resposta: ['Os álbuns estão organizados por tipo de trabalho. Você pode ver todos ou começar pelo tipo que procura.'],
    links: [{ rotulo: 'Ver todos os álbuns', href: '/trabalhos' }],
    seguintes: ['servicos', 'valores'],
  },
];

/** Assuntos do menu de dúvidas (os outros chegam pelos "seguintes" ou pelo texto). */
export const MENU_DUVIDAS = ['valores', 'valores-eventos', 'pagamento', 'entrega', 'agendar', 'onde', 'preparar', 'servicos', 'contrato'] as const;

/** Conversa solta: cumprimento, agradecimento, pedido de falar com alguém, recomeçar. */
export const ESPECIAIS = [
  { id: 'falar', chaves: ['falar com', 'atendente', 'humano', 'pessoa real', 'fotografo', 'jose renato', 'whatsapp', 'contato', 'ligar', 'telefone', 'numero', 'conversar', 'chamar', 'atendimento humano'] },
  { id: 'orcamento', chaves: ['orçamento', 'orcar', 'contratar', 'fechar', 'quero fechar'] },
  { id: 'oi', chaves: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'opa', 'salve', 'hey', 'hello', 'tudo bem'] },
  { id: 'obrigado', chaves: ['obrigad*', 'valeu', 'agradeco', 'brigad*', 'show', 'otimo', 'perfeito', 'top', 'massa', 'legal', 'entendi', 'beleza'] },
  { id: 'recomecar', chaves: ['recomecar', 'comecar de novo', 'reiniciar', 'do zero', 'refazer'] },
] as const;

/** Intenções fracas: cedem a vez quando há um assunto de verdade empatado com elas. */
export const FRACAS = ['oi', 'obrigado', 'orcamento', 'naosei'] as const;

/** Assuntos rápidos do formulário de contato. */
export const ASSUNTOS = ['Orçamento', 'Agendar uma data', 'Tirar uma dúvida', 'Outro assunto'] as const;

export const TEXTOS = {
  nome: 'Atendimento',
  sub: 'Jr_Tech_OFC · Nossa Arte, Seu Sucesso',
  chamadaFab: 'Posso ajudar?',
  botaoContato: 'Falar no WhatsApp',
  boasVindas: (saudacao: string) =>
    `${saudacao}! Aqui é o atendimento da Jr_Tech_OFC. Me conta o que você quer fotografar que eu te ajudo a escolher, ou tiro suas dúvidas.`,
  retorno: (titulo: string) => `Que bom te ver de novo! Da última vez você procurava ${titulo}. Quer continuar de onde parou?`,
  naoEntendi: 'Não consegui entender. Pode escrever de outro jeito? Se preferir, escolha uma opção ou fale direto comigo no WhatsApp.',
  quisDizer: 'Você quis dizer:',
  menuDuvidas: 'Claro! Sobre o que você quer saber?',
  falar: 'Me diz seu nome e o assunto que a conversa abre no WhatsApp com a mensagem pronta. Respondo de segunda a sexta, das 8h às 20h.',
  obrigado: 'Por nada! Se surgir outra dúvida, é só chamar.',
  oi: 'Oi! Como posso te ajudar?',
} as const;

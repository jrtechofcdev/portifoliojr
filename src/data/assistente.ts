// Roteiro e respostas do assistente (14/11/2026). Tudo o que o assistente pergunta e responde
// está aqui, em texto comum: para mudar uma resposta, mude a frase. As `chaves` são as palavras
// que a pessoa pode escrever para chegar àquela opção (o motor em src/lib/entender.ts tolera
// erro de digitação e falta de acento; "palavra*" vale como começo de palavra).
// Regras do texto: sem travessão, sem preço, prazo ou número inventado, só o que o site já diz.
// `albuns` são nomes de arquivo de src/content/ensaios; o build para se algum não existir.
import { PASSOS, SERVICOS, site, type TipoAssistente } from './site';

export interface OpcaoGuia {
  id: string;
  /** Texto do botão. */
  resposta: string;
  chaves: readonly string[];
  /** Como entra na mensagem do WhatsApp. */
  frase: string;
  /** Álbuns que mostram essa escolha, do mais indicado ao menos. */
  albuns?: readonly string[];
}

export interface TipoGuia extends OpcaoGuia {
  /** Capítulo do portfólio (filtro de /trabalhos e ordem das listas). */
  capitulo: TipoAssistente;
  /** Foto da opção: a capa deste álbum. */
  mini: string;
  /** Plural para "Separei ... para você". */
  titulo: string;
  /** Segunda pergunta, própria deste tipo. */
  segunda: { pergunta: string; opcoes: readonly OpcaoGuia[] };
  /** Observação honesta no resultado, quando o portfólio não tem um álbum exato. */
  nota?: string;
}

const NO_QUE_IMPORTA = [
  { id: 'retratos', resposta: 'Retratos de quem faz a festa', frase: 'com atenção aos retratos', chaves: ['retrato*', 'ela', 'aniversariante', 'debutante', 'pose*'] },
  { id: 'familia', resposta: 'Família e convidados', frase: 'com a família e os convidados', chaves: ['familia', 'convidado*', 'amigo*', 'parente*', 'gente', 'pessoas'] },
  { id: 'detalhes', resposta: 'Decoração e detalhes', frase: 'com a decoração e os detalhes', chaves: ['decora*', 'detalhe*', 'bolo', 'mesa', 'painel', 'enfeite*'] },
  { id: 'tudo', resposta: 'A festa inteira', frase: 'com a festa inteira', chaves: ['tudo', 'inteira', 'todos os momentos', 'completo', 'cobertura'] },
] as const;

export const TIPOS: readonly TipoGuia[] = [
  {
    id: 'individual',
    resposta: 'Um ensaio só meu',
    capitulo: 'ensaio',
    mini: 'sabrina',
    titulo: 'ensaios externos',
    frase: 'um ensaio individual',
    chaves: ['ensaio', 'individual', 'sozinha', 'sozinho', 'book', 'ensaio externo', 'ensaio feminino', 'ensaio masculino', 'retrato*', 'modelo', 'amiga*', 'cartaz', 'foto de perfil'],
    albuns: ['sabrina', 'dalila', 'sara-e-yasmin'],
    segunda: {
      pergunta: 'Que estilo combina mais com você?',
      opcoes: [
        { id: 'natural', resposta: 'Natural, ao ar livre', frase: 'natural, ao ar livre', chaves: ['natural', 'ar livre', 'externo', 'estrada', 'campo', 'natureza', 'rua', 'simples', 'leve', 'dia'], albuns: ['dalila', 'sabrina'] },
        { id: 'noite', resposta: 'Noturno, com flash', frase: 'noturno, com flash', chaves: ['noite', 'noturno', 'flash', 'escuro', 'anoitecer', 'dramatic*', 'ousad*'], albuns: ['sara-e-yasmin'] },
        { id: 'objeto', resposta: 'Com um objeto que conta minha história', frase: 'com um objeto que conta a minha história', chaves: ['livro', 'objeto', 'tema', 'historia', 'conceito', 'acessorio', 'leitura', 'hobby'], albuns: ['sabrina'] },
        { id: 'cartaz', resposta: 'Retrato para cartaz ou divulgação', frase: 'para cartaz ou divulgação', chaves: ['cartaz', 'divulga*', 'banner', 'perfil', 'profissional', 'curriculo', 'convite', 'evento da igreja', 'propaganda'], albuns: ['tia-josina'] },
      ],
    },
  },
  {
    id: 'casal',
    resposta: 'Casal',
    capitulo: 'casal',
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
    mini: 'marlieth-e-paulo',
    titulo: 'ensaios gestantes',
    frase: 'um ensaio gestante',
    chaves: ['gestante', 'gravida', 'gravidez', 'barriga', 'gestacao', 'ensaio gestante', 'bebe a caminho', 'esperando bebe', 'maternidade', 'mamae'],
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
    mini: 'jose',
    titulo: 'ensaios infantis e de família',
    frase: 'um ensaio infantil',
    chaves: ['infantil', 'crianca', 'filho*', 'filha*', 'bebe', 'menino', 'menina', 'neto*', 'sobrinh*', 'familia', 'mae e filho', 'smash the cake', 'country', 'fazenda'],
    albuns: ['jose'],
    segunda: {
      pergunta: 'Quem vai aparecer nas fotos?',
      opcoes: [
        { id: 'crianca', resposta: 'Só a criança', frase: 'só da criança', chaves: ['so ele', 'so ela', 'crianca', 'sozinho', 'sozinha', 'bebe'] },
        { id: 'mae', resposta: 'A criança com a mãe ou o pai', frase: 'da criança com a mãe ou o pai', chaves: ['mae', 'pai', 'comigo', 'mae e filho', 'pai e filho', 'mamae', 'papai'] },
        { id: 'familia', resposta: 'A família toda', frase: 'com a família toda', chaves: ['familia', 'todos', 'irmao*', 'avo*', 'avó'] },
      ],
    },
  },
  {
    id: 'quinze',
    resposta: 'Festa de 15 anos',
    capitulo: 'festa',
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
    mini: 'bodas-de-ouro-nelson-e-dalvina',
    titulo: 'eventos e celebrações',
    frase: 'a cobertura de um evento',
    chaves: ['evento*', 'culto', 'igreja', 'gospel', 'confra*', 'celebra*', 'bodas', 'casamento', 'formatura', 'batizado', 'encontro', 'congresso', 'retiro', 'cerimonia', 'empresa', 'cobertura'],
    albuns: ['bodas-de-ouro-nelson-e-dalvina', 'manha-com-deus', 'confra-juventude-estrela-de-luz'],
    segunda: {
      pergunta: 'Que tipo de evento é?',
      opcoes: [
        { id: 'igreja', resposta: 'Culto ou evento de igreja', frase: 'de igreja', chaves: ['culto', 'igreja', 'gospel', 'louvor', 'congresso', 'retiro', 'jovens', 'juventude', 'ministerio'], albuns: ['manha-com-deus', 'confra-juventude-estrela-de-luz'] },
        { id: 'familia', resposta: 'Bodas ou celebração de família', frase: 'de família', chaves: ['bodas', 'familia', 'casamento', 'batizado', 'renovacao', 'celebra*', 'homenage*'], albuns: ['bodas-de-ouro-nelson-e-dalvina'] },
        { id: 'confra', resposta: 'Confraternização', frase: 'de confraternização', chaves: ['confra*', 'jantar', 'amigos', 'empresa', 'equipe', 'fim de ano', 'natal'], albuns: ['confra-juventude-estrela-de-luz'] },
        { id: 'outro', resposta: 'Outro evento', frase: '', chaves: ['outro', 'outra coisa', 'formatura', 'inauguracao', 'palestra'] },
      ],
    },
  },
] as const;

/** "Ainda não sei": a pessoa escolhe por foto entre os capítulos. */
export const NAO_SEI = {
  id: 'naosei',
  resposta: 'Ainda não sei',
  chaves: ['nao sei', 'sei la', 'indecis*', 'tanto faz', 'qualquer', 'me ajuda a escolher', 'me ajude', 'sugest*', 'nao tenho ideia'],
  opcoes: ['individual', 'gestante', 'quinze', 'evento'],
} as const;

export const PRAZOS: readonly OpcaoGuia[] = [
  { id: 'mes', resposta: 'Este mês', frase: 'para este mês', chaves: ['este mes', 'esse mes', 'agora', 'urgente', 'logo', 'essa semana', 'esta semana', 'semana que vem', 'proxima semana', 'amanha', 'hoje', 'fim de semana', 'sabado', 'domingo', 'rapido'] },
  {
    id: 'meses',
    resposta: 'Nos próximos meses',
    frase: 'para os próximos meses',
    chaves: ['mês que vem', 'próximo mês', 'próximos meses', 'daqui a alguns meses', 'daqui a', 'mais pra frente', 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro', 'ano que vem', 'proximo ano'],
  },
  { id: 'sem-data', resposta: 'Ainda sem data', frase: 'ainda sem data definida', chaves: ['sem data', 'nao sei', 'ainda nao', 'nao tenho data', 'nao definid*', 'sem previsao', 'depois', 'futuro', 'pesquisando', 'so olhando', 'so vendo'] },
] as const;

export const CIDADES: readonly OpcaoGuia[] = [
  { id: 'bacabal', resposta: 'Bacabal', frase: 'em Bacabal', chaves: ['Bacabal'] },
  { id: 'imperatriz', resposta: 'Imperatriz', frase: 'em Imperatriz', chaves: ['Imperatriz', 'itz'] },
  {
    id: 'outra',
    resposta: 'Outra cidade',
    frase: 'em outra cidade (a combinar)',
    chaves: ['outra cidade', 'outra', 'fora', 'sao luis', 'teresina', 'pedreiras', 'lago da pedra', 'codo', 'caxias', 'santa ines', 'acailandia', 'presidente dutra', 'timon', 'balsas', 'trizidela', 'esperantinopolis', 'joselandia', 'sao mateus'],
  },
] as const;

/** Perguntas do guia, na ordem. A segunda depende do tipo. */
export const PERGUNTAS = {
  tipo: 'O que você gostaria de registrar?',
  prazo: 'Para quando você imagina?',
  cidade: 'E em qual cidade?',
} as const;

export interface Duvida {
  id: string;
  /** Texto do botão. */
  pergunta: string;
  chaves: readonly string[];
  /** Parágrafos da resposta. */
  resposta: readonly string[];
  /** Links para páginas do site (abrem na mesma janela). */
  links?: readonly { rotulo: string; href: string }[];
  /** Mostra o botão "Falar com José Renato" junto da resposta. */
  contato?: boolean;
  /** Assuntos que aparecem em seguida, como próximo passo. */
  seguintes?: readonly string[];
}

const cidadesTexto = 'Atendo em Bacabal e Imperatriz, no Maranhão. Outras cidades, sob consulta: me conte o local e a data.';

export const DUVIDAS: readonly Duvida[] = [
  {
    id: 'como-funciona',
    pergunta: 'Como funciona',
    chaves: ['como funciona', 'funciona', 'etapa*', 'processo', 'passo a passo', 'como e', 'como faz', 'como contratar'],
    resposta: [
      'Funciona em cinco etapas, do primeiro contato à entrega:',
      ...PASSOS.map((p, i) => `${i + 1}. ${p.nome}: ${p.texto}`),
    ],
    links: [{ rotulo: 'Ver a página Como funciona', href: '/como-funciona' }],
    seguintes: ['valores', 'entrega', 'preparar'],
  },
  {
    id: 'servicos',
    pergunta: 'Que serviços você faz',
    chaves: ['servico*', 'o que voce faz', 'o que voce fotografa', 'que tipo de foto', 'tipos de ensaio', 'opcoes de ensaio', 'voce faz'],
    resposta: [
      `Faço ${SERVICOS.map((s) => s.nome.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' e $1')}.`,
      'Toque num serviço para saber mais:',
    ],
    links: [{ rotulo: 'Ver a página de serviços', href: '/servicos' }],
    seguintes: SERVICOS.map((_, i) => `servico-${i}`),
  },
  ...SERVICOS.map((s, i) => ({
    id: `servico-${i}`,
    pergunta: s.nome,
    chaves: [s.nome.toLowerCase()],
    resposta: [s.texto],
    links: [{ rotulo: 'Ver álbuns desse tipo', href: `/trabalhos?c=${s.capitulo}` }],
    contato: true,
    seguintes: ['valores', 'onde'],
  })),
  {
    id: 'onde',
    pergunta: 'Onde você atende',
    chaves: ['onde', 'cidade*', 'atende', 'regiao', 'viaja', 'viagem', 'longe', 'endereco', 'estudio', 'outra cidade', 'que cidade', 'atende em'],
    resposta: [
      cidadesTexto,
      'Os ensaios são feitos em ambiente externo, e as coberturas, no local do seu evento ou da sua comemoração.',
    ],
    contato: true,
    seguintes: ['valores', 'como-funciona'],
  },
  {
    id: 'valores',
    pergunta: 'Valores e pagamento',
    chaves: ['preco*', 'valor*', 'valor do orçamento', 'preço do orçamento', 'quanto fica o orçamento', 'quanto custa', 'quanto e', 'quanto fica', 'quanto sai', 'custa', 'custo', 'pagamento', 'pagar', 'pix', 'cartao', 'parcel*', 'investimento', 'caro', 'barato', 'cobra*', 'tabela', 'pacote*', 'desconto', 'sinal', 'entrada'],
    resposta: [
      'Os valores e as formas de pagamento são definidos no orçamento, de acordo com o tipo de trabalho, a data, o local e o que você deseja registrar.',
      'Me conte esses detalhes que eu preparo o orçamento para você.',
    ],
    contato: true,
    seguintes: ['entrega', 'como-funciona'],
  },
  {
    id: 'entrega',
    pergunta: 'Prazo e entrega das fotos',
    chaves: ['prazo', 'entrega', 'entregar', 'quando recebo', 'receber', 'recebo', 'demora', 'quanto tempo', 'pronta*', 'arquivo*', 'online', 'drive', 'pendrive', 'impressa*', 'album fisico'],
    resposta: [
      'Depois do ensaio ou do evento, faço a seleção das imagens e o tratamento cuidadoso das fotografias.',
      'Você recebe as fotografias finalizadas pelo meio e no prazo definidos no orçamento.',
    ],
    contato: true,
    seguintes: ['valores', 'como-funciona'],
  },
  {
    id: 'preparar',
    pergunta: 'Como me preparar',
    chaves: ['preparar', 'preparo', 'roupa*', 'look', 'maquiagem', 'cabelo', 'pose*', 'timid*', 'vergonha', 'nunca fiz', 'experiencia', 'nervos*', 'dica*', 'levar', 'vestir'],
    resposta: [
      'Não precisa ter experiência diante da câmera. Durante o ensaio eu oriento as poses e deixo tempo para você ficar à vontade.',
      'Antes, no planejamento, combinamos o local, o horário, as referências e os detalhes. Se você tiver fotos de referência ou uma ideia de tema, pode me mandar.',
    ],
    contato: true,
    seguintes: ['quem', 'como-funciona'],
  },
  {
    id: 'quem',
    pergunta: 'Quem pode participar',
    chaves: ['quem pode', 'participar', 'levar alguem', 'acompanhante', 'pet', 'cachorro', 'grupo', 'pode levar', 'mais pessoas', 'menor de idade'],
    resposta: [
      'Os ensaios podem ser individuais, a dois ou em família, e também há ensaios infantis, como o do José.',
      'Crianças e adolescentes são fotografados com a autorização do responsável.',
    ],
    links: [{ rotulo: 'Ver o álbum do José', href: '/trabalhos/jose' }],
    contato: true,
    seguintes: ['preparar', 'valores'],
  },
  {
    id: 'privacidade',
    pergunta: 'Minhas fotos e privacidade',
    chaves: ['privacidade', 'autoriza*', 'minhas fotos', 'publicar', 'postar', 'portfolio', 'tirar foto do site', 'remover', 'apagar', 'dados', 'lgpd', 'direito*', 'imagem', 'seguranca'],
    resposta: [
      'As fotos só entram no portfólio com a autorização de quem aparece nelas, ou do responsável, no caso de crianças. Você pode pedir para retirar uma foto quando quiser.',
      'Este assistente funciona só no seu aparelho. Nada do que você escreve aqui é enviado, a não ser a mensagem que você decidir mandar pelo WhatsApp.',
    ],
    links: [
      { rotulo: 'Política de privacidade', href: '/privacidade' },
      { rotulo: 'Direitos autorais', href: '/direitos-autorais' },
    ],
    seguintes: ['como-funciona', 'valores'],
  },
  {
    id: 'portfolio',
    pergunta: 'Ver o portfólio',
    chaves: ['ver fotos', 'album', 'albuns', 'trabalhos', 'galeria', 'exemplos', 'portfolio', 'fotos que voce fez'],
    resposta: ['Os álbuns estão organizados por tipo de trabalho. Você pode ver todos ou começar pelo tipo que procura.'],
    links: [{ rotulo: 'Ver todos os álbuns', href: '/trabalhos' }],
    seguintes: ['servicos', 'como-funciona'],
  },
];

/** Assuntos que aparecem no menu de dúvidas (os outros chegam pelos "seguintes" ou pelo texto). */
export const MENU_DUVIDAS = ['como-funciona', 'servicos', 'valores', 'entrega', 'onde', 'preparar', 'quem', 'privacidade'] as const;

/** Conversa solta: cumprimento, agradecimento, pedido de falar com alguém, recomeçar. */
export const ESPECIAIS = [
  { id: 'falar', chaves: ['falar com', 'atendente', 'humano', 'pessoa real', 'fotografo', 'jose renato', 'whatsapp', 'contato', 'ligar', 'telefone', 'numero', 'conversar', 'chamar', 'atendimento humano'] },
  { id: 'orcamento', chaves: ['orçamento', 'orcar', 'contratar', 'agendar', 'marcar', 'reservar', 'fechar', 'disponibilidade', 'data livre', 'agenda', 'disponivel'] },
  { id: 'oi', chaves: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'opa', 'salve', 'hey', 'hello', 'tudo bem'] },
  { id: 'obrigado', chaves: ['obrigad*', 'valeu', 'agradeco', 'brigad*', 'show', 'otimo', 'perfeito', 'top', 'massa', 'legal', 'entendi', 'beleza'] },
  { id: 'recomecar', chaves: ['recomecar', 'comecar de novo', 'reiniciar', 'do zero', 'refazer'] },
] as const;

/** Assuntos rápidos do formulário "Falar com José Renato". */
export const ASSUNTOS = ['Orçamento', 'Agendar uma data', 'Tirar uma dúvida', 'Outro assunto'] as const;

export const TEXTOS = {
  nome: 'Assistente',
  sub: 'Atendimento Jr_Tech_OFC',
  chamadaFab: 'Posso ajudar?',
  boasVindas: (saudacao: string) =>
    `${saudacao}! Sou o assistente do portfólio. Posso te ajudar a encontrar o estilo de ensaio que combina com você, ou tirar suas dúvidas.`,
  retorno: (titulo: string) => `Que bom ver você de novo. Da última vez você procurava ${titulo}. Quer continuar de onde parou?`,
  naoEntendi:
    'Não consegui entender. Pode escrever de outro jeito? Se preferir, escolha uma das opções ou fale direto com o José Renato.',
  quisDizer: 'Você quis dizer:',
  menuDuvidas: 'Claro. Sobre o que você quer saber?',
  ajudou: 'Posso ajudar em mais alguma coisa?',
  falar: `Para falar direto com o ${site.fotografo.split(' ').slice(0, 2).join(' ')}, me diga seu nome e o assunto. A conversa abre no WhatsApp com a mensagem pronta.`,
  obrigado: 'Por nada! Se surgir outra dúvida, é só chamar.',
  oi: 'Olá! Como posso ajudar?',
  semAlbumExato: 'Ainda não tenho um álbum exatamente assim, mas estes mostram como eu trabalho:',
} as const;

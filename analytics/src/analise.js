// Análise automática do período (o "assistente" do painel), previsão e o resumo para baixar.
// Não é IA: são regras simples sobre os números já agregados pelo banco. Cada conclusão diz em que
// número se apoia, e com poucos dados o texto avisa que ainda é cedo.

// Contexto do negócio para o resumo que vai para uma IA. Manter igual a
// docs/DOCUMENTO_MESTRE_ASSISTENTE.md (planos e valores aprovados em 16/11/2026).
const CONTEXTO = [
  'Negócio: Jr_Tech_OFC Fotografia ("Nossa Arte, Seu Sucesso"), do fotógrafo José Renato Alves da Silva. Base em Bacabal (MA), também atende Imperatriz (MA); outras cidades sob consulta, com deslocamento combinado à parte.',
  'Prioridade comercial: ensaios fotográficos externos, especialmente ensaios jovens. Estilo natural e espontâneo, com direção de poses: o cliente não precisa saber posar.',
  'Planos de ensaio: Essencial R$ 200,00 (25 fotos editadas, até 1 h, 1 look); Destaque R$ 297,00 (45 fotos, até 2 h, até 2 looks, 5 impressas 10 × 15; melhor custo-benefício); Premium R$ 697,00 (60 ou mais fotos, até 3 h, até 3 looks, 10 impressas, álbum e pendrive personalizados).',
  'Planos de eventos, por tempo de cobertura: Evento Essencial R$ 350,00 (até 2 h), Clássico R$ 550,00 (até 4 h), Completo R$ 750,00 (até 6 h), Integral R$ 950,00 (até 8 h); hora adicional R$ 100,00.',
  'Reserva com sinal de 50%. Pix, dinheiro e cartão (até 3 vezes sem juros). Não faz newborn, smash the cake nem acompanhamento mensal; casamentos grandes normalmente não. Não há desconto padrão.',
  'Canais: portfólio https://portifolio.jrtechofc.com.br, Instagram @jose_renato_a e WhatsApp.',
];

const CAPITULOS = { ensaio: 'Ensaios externos', casal: 'Casais e gestantes', festa: '15 anos e aniversários', evento: 'Eventos e celebrações' };
const ALBUNS = {
  sabrina: 'Sabrina',
  'sara-e-yasmin': 'Sara & Yasmin',
  dalila: 'Dalila',
  jose: 'José',
  'tia-josina': 'Tia Josina',
  'marlieth-e-paulo': 'Marlieth & Paulo',
  'victor-e-tamires': 'Victor & Tamires',
  'kiara-15-anos': '15 anos de Kiara',
  'vitoria-emanuela-15-anos': '15 anos de Vitória Emanuela',
  'aniversario-de-irenilde': 'Aniversário de Irenilde',
  'adrian-18-anos': '18 anos de Adrian',
  'bodas-de-ouro-nelson-e-dalvina': 'Bodas de Ouro de Nelson e Dalvina',
  'manha-com-deus': 'Manhã com Deus',
  'confra-juventude-estrela-de-luz': 'Confra Juventude Estrela de Luz',
};
const PAGINAS = {
  '/': 'Início',
  '/trabalhos': 'Portfólio',
  '/servicos': 'Serviços',
  '/como-funciona': 'Como funciona',
  '/sobre': 'Sobre',
  '/contato': 'Contato',
  '/privacidade': 'Privacidade',
  '/direitos-autorais': 'Direitos autorais',
};
const ATENDIMENTO = {
  individual: 'ensaio individual',
  casal: 'casal',
  gestante: 'gestante',
  infantil: 'infantil ou família',
  quinze: '15 anos',
  aniversario: 'aniversário',
  evento: 'evento',
  profissional: 'profissional ou empresa',
  valores: 'planos de ensaio',
  'valores-eventos': 'planos de eventos',
  pagamento: 'pagamento e reserva',
  entrega: 'entrega das fotos',
  agendar: 'agendar',
  remarcar: 'remarcação',
  vergonha: 'não sabe posar',
  onde: 'onde atende',
  locais: 'lugares',
  desconto: 'desconto',
};
const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const bonito = (slug) => slug.replace(/\/$/, '').split('-').map((p) => (p.length > 2 ? p[0].toUpperCase() + p.slice(1) : p)).join(' ');
export const nomeAlbum = (slug) => ALBUNS[slug.replace(/\/$/, '')] || bonito(slug);
export const nomeCapitulo = (id) => CAPITULOS[id] || id;
export function nomePagina(caminho) {
  const c = caminho.replace(/\/$/, '') || '/';
  if (PAGINAS[c]) return PAGINAS[c];
  if (c.startsWith('/trabalhos/')) return 'Álbum ' + nomeAlbum(c.slice(11));
  return c;
}
/** "/ > /trabalhos/sabrina > /contato" vira "Início → Álbum Sabrina → Contato" (sem repetir recarregadas). */
export const nomeFluxo = (f) =>
  f
    .split(' > ')
    .filter((p, i, a) => i === 0 || p !== a[i - 1])
    .map(nomePagina)
    .join(' → ');

const pct = (a, b) => (b ? (a / b) * 100 : 0);
const fp = (v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
const fn = (v) => Math.round(v).toLocaleString('pt-BR');
const cliques = (v) => `${fn(v)} ${Math.round(v) === 1 ? 'clique' : 'cliques'}`;
const vezes = (v) => `${fn(v)} ${Math.round(v) === 1 ? 'vez' : 'vezes'}`;
const entradasTxt = (v) => `${fn(v)} ${Math.round(v) === 1 ? 'entrada' : 'entradas'}`;

// ---------------------------------------------------------------------------------------------
// Previsão: tendência linear dos últimos dias completos, com o peso de cada dia da semana quando
// já há três semanas de dados. A faixa é de 80%.
// ---------------------------------------------------------------------------------------------
export function previsao(historico, hoje) {
  if (!historico.length) return { suficiente: false, aviso: 'Ainda não há visitas registradas para prever.' };
  const mapa = new Map(historico.map((h) => [h.dia, h]));
  const serie = [];
  for (let t = Date.parse(historico[0].dia); t <= Date.parse(hoje); t += 86_400_000) {
    const dia = new Date(t).toISOString().slice(0, 10);
    const h = mapa.get(dia);
    serie.push({ dia, v: h?.visitantes ?? 0, w: h?.whatsapp ?? 0 });
  }
  const completos = serie.slice(0, -1); // hoje ainda não terminou
  const janela = completos.slice(-56);
  const n = janela.length;
  const somaV = janela.reduce((s, x) => s + x.v, 0);
  const somaW = janela.reduce((s, x) => s + x.w, 0);
  const conversao = somaV ? somaW / somaV : 0;
  if (n < 3) {
    return {
      suficiente: false,
      aviso: `Ainda são ${n} dia(s) completo(s) de dados. A previsão começa a aparecer com 3 dias e fica confiável a partir de 14.`,
      serie: serie.slice(-30).map((s) => ({ dia: s.dia, real: s.v })),
    };
  }
  const xs = janela.map((_, i) => i);
  const ys = janela.map((x) => x.v);
  const mx = (n - 1) / 2;
  const my = somaV / n;
  let num = 0,
    den = 0;
  xs.forEach((x, i) => {
    num += (x - mx) * (ys[i] - my);
    den += (x - mx) ** 2;
  });
  const inclinacao = n >= 7 && den ? num / den : 0; // com menos de uma semana, só a média
  const corte = my - inclinacao * mx;
  // Peso de cada dia da semana (só com 3 semanas ou mais)
  const peso = Array(7).fill(1);
  if (n >= 21 && my > 0) {
    const soma = Array(7).fill(0),
      cont = Array(7).fill(0);
    janela.forEach((x) => {
      const d = new Date(x.dia + 'T12:00:00Z').getUTCDay();
      soma[d] += x.v;
      cont[d]++;
    });
    for (let d = 0; d < 7; d++) if (cont[d]) peso[d] = Math.min(2, Math.max(0.4, soma[d] / cont[d] / my));
  }
  const residuos = ys.map((y, i) => y - (corte + inclinacao * i));
  const desvio = Math.sqrt(residuos.reduce((s, r) => s + r * r, 0) / Math.max(1, n - 2));
  const futuro = (k) => {
    const dia = new Date(Date.parse(hoje) + (k - 1) * 86_400_000).toISOString().slice(0, 10);
    const d = new Date(dia + 'T12:00:00Z').getUTCDay();
    return { dia, v: Math.max(0, (corte + inclinacao * (n - 1 + k)) * peso[d]) };
  };
  const bloco = (dias) => {
    const pts = Array.from({ length: dias }, (_, i) => futuro(i + 1));
    const v = pts.reduce((s, p) => s + p.v, 0);
    const margem = 1.28 * desvio * Math.sqrt(dias);
    return { visitantes: Math.round(v), min: Math.max(0, Math.round(v - margem)), max: Math.round(v + margem), whatsapp: Math.round(v * conversao) };
  };
  return {
    suficiente: true,
    provisoria: n < 14,
    dias: n,
    conversao,
    tendenciaSemanal: my ? (inclinacao * 7) / my : 0,
    proximos7: bloco(7),
    proximos30: bloco(30),
    serie: [
      ...serie.slice(-30).map((s) => ({ dia: s.dia, real: s.v })),
      ...Array.from({ length: 7 }, (_, i) => {
        const f = futuro(i + 2);
        return { dia: f.dia, previsto: f.v, min: Math.max(0, f.v - 1.28 * desvio), max: f.v + 1.28 * desvio };
      }),
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Leitura do período: o que funcionou e para onde direcionar o trabalho
// ---------------------------------------------------------------------------------------------
const melhorTaxa = (lista, minimo) =>
  lista
    .filter((x) => x.entradas >= minimo && x.converteram > 0)
    .map((x) => ({ ...x, taxa: pct(x.converteram, x.entradas) }))
    .sort((a, b) => b.taxa - a.taxa || b.entradas - a.entradas)[0];

export function analisar(d, prev) {
  const t = d.totais || {};
  const a = d.antes || {};
  const entradas = t.entradas || 0;
  const leitura = [];
  const diz = (tipo, titulo, texto) => leitura.push({ tipo, titulo, texto });
  const minimo = entradas >= 100 ? 10 : entradas >= 30 ? 5 : 2;

  if (!entradas) {
    diz('alerta', 'Sem visitas neste período', 'Ainda não há entradas registradas. Divulgue os links curtos (/ig, /s, /wa) e volte aqui depois.');
    return leitura;
  }
  if (entradas < 30)
    diz('alerta', 'Ainda é cedo', `São ${fn(entradas)} entradas no período. As conclusões abaixo ficam mais firmes a partir de umas 30 a 50 entradas.`);

  // Conversão geral
  const conv = pct(t.entradasConv || 0, entradas);
  const convAntes = pct(a.entradasConv || 0, a.entradas || 0);
  diz(
    'info',
    'Conversão',
    `${fp(conv)} das entradas terminaram com um clique no WhatsApp (${fn(t.entradasConv || 0)} de ${fn(entradas)}).` +
      (a.entradas ? ` No período anterior: ${fp(convAntes)}.` : ''),
  );

  // Área mais procurada e área que mais converte
  const areas = (d.areas || []).filter((x) => CAPITULOS[x.nome]);
  const totalAreas = areas.reduce((s, x) => s + x.entradas, 0);
  const topArea = areas[0];
  if (topArea) {
    diz(
      'foco',
      'Área mais procurada',
      `${nomeCapitulo(topArea.nome)}: ${fn(topArea.entradas)} entradas viram álbuns dessa área (${fp(pct(topArea.entradas, totalAreas))} do interesse em álbuns).`,
    );
    const conv = melhorTaxa(areas, minimo);
    if (conv && conv.nome !== topArea.nome)
      diz('foco', 'Área que mais converte', `Quem vê ${nomeCapitulo(conv.nome)} chama mais no WhatsApp: ${fp(conv.taxa)} das entradas (${fn(conv.converteram)} de ${fn(conv.entradas)}).`);
    else if (conv) diz('foco', 'Ela também é a que mais converte', `${fp(conv.taxa)} das entradas que viram ${nomeCapitulo(conv.nome)} chamaram no WhatsApp.`);
  }

  // O que escolheram no atendimento
  const escolhas = (d.assistente || []).filter((x) => x.nome === 'tipo').sort((x, y) => y.total - x.total);
  if (escolhas[0])
    diz('info', 'No atendimento', `O que mais escolheram foi ${ATENDIMENTO[escolhas[0].rotulo] || escolhas[0].rotulo} (${vezes(escolhas[0].total)}).`);
  const duvidas = (d.assistente || []).filter((x) => x.nome === 'duvida').sort((x, y) => y.total - x.total);
  if (duvidas[0]) {
    const id = duvidas[0].rotulo;
    const dica =
      id === 'valores' || id === 'valores-eventos'
        ? ' Deixe o valor de partida claro nos posts e stories.'
        : id === 'vergonha'
          ? ' Vale mostrar bastidores, com você orientando as poses.'
          : id === 'pagamento'
            ? ' Mostre nos stories que dá para reservar com 50% e parcelar em até 3 vezes sem juros.'
            : '';
    diz('info', 'Dúvida mais aberta', `${ATENDIMENTO[id] || id} (${vezes(duvidas[0].total)}).${dica}`);
  }
  const naoEntendeu = (d.assistente || []).filter((x) => x.nome === 'naoentendeu').reduce((s, x) => s + x.total, 0);
  if (naoEntendeu >= 3) diz('alerta', 'Atendimento sem resposta', `${fn(naoEntendeu)} mensagens escritas não foram entendidas. Vale revisar as palavras-chave do atendimento.`);

  // Álbuns
  const albuns = d.albuns || [];
  if (albuns[0]) {
    const melhor = melhorTaxa(albuns, minimo);
    diz(
      'info',
      'Álbum campeão',
      `${nomeAlbum(albuns[0].nome)} foi o mais aberto (${fn(albuns[0].entradas)} entradas).` +
        (melhor && melhor.nome !== albuns[0].nome ? ` O que mais levou ao WhatsApp foi ${nomeAlbum(melhor.nome)} (${fp(melhor.taxa)}).` : ''),
    );
  }

  // Origem e campanhas
  const origens = d.origens || [];
  if (origens[0]) {
    const melhor = melhorTaxa(origens, minimo);
    diz(
      'foco',
      'Canal que mais traz gente',
      `${origens[0].nome}: ${entradasTxt(origens[0].entradas)}.` +
        (melhor && melhor.nome === origens[0].nome
          ? ` É também o que mais converte: ${fp(melhor.taxa)} das entradas chamaram no WhatsApp.`
          : melhor
            ? ` O que mais converte: ${melhor.nome} (${fp(melhor.taxa)} das entradas chamaram no WhatsApp).`
            : ''),
    );
  }
  const campanhas = d.campanhas || [];
  if (campanhas[0]) {
    const melhor = melhorTaxa(campanhas, 2);
    diz('info', 'Links de divulgação', `O link que mais trouxe gente foi "${campanhas[0].nome}" (${fn(campanhas[0].entradas)} entradas)` + (melhor && melhor.nome === campanhas[0].nome ? `, e foi também o que mais converteu (${fp(melhor.taxa)}).` : melhor ? `; o que mais converteu foi "${melhor.nome}" (${fp(melhor.taxa)}).` : '.'));
  }

  // Fluxos
  const fluxos = d.fluxos || [];
  if (fluxos[0]) diz('info', 'Caminho mais comum', `${nomeFluxo(fluxos[0].fluxo)} (${fn(fluxos[0].entradas)} entradas).`);
  const fluxoConv = [...fluxos].filter((f) => f.converteram > 0).sort((x, y) => y.converteram - x.converteram)[0];
  if (fluxoConv) diz('foco', 'Caminho que mais leva ao WhatsApp', `${nomeFluxo(fluxoConv.fluxo)} (${fn(fluxoConv.converteram)} ${fluxoConv.converteram === 1 ? 'contato' : 'contatos'}).`);
  if (d.ondeWhats?.[0]) diz('info', 'Botão que mais gera contato', `WhatsApp em ${d.ondeWhats[0].nome} (${cliques(d.ondeWhats[0].total)}).`);

  // Horários
  const horas = Array.from({ length: 24 }, (_, h) => d.horas?.find((x) => x.hora === h)?.entradas ?? 0);
  let melhorH = 0,
    somaH = -1;
  for (let h = 0; h < 24; h++) {
    const s = horas[h] + horas[(h + 1) % 24] + horas[(h + 2) % 24];
    if (s > somaH) {
      somaH = s;
      melhorH = h;
    }
  }
  const semana = (d.semana || []).map((x) => ({ ...x, media: x.dias ? x.entradas / x.dias : 0 })).sort((x, y) => y.media - x.media);
  if (somaH > 0)
    diz(
      'foco',
      'Melhor horário para postar',
      `Mais entradas entre ${melhorH}h e ${(melhorH + 3) % 24}h.` + (semana[0] && d.periodo.n >= 14 ? ` O dia mais forte é ${SEMANA[semana[0].dow]}.` : ''),
    );

  // Público quente
  if (d.voltaramSemChamar > 0)
    diz(
      'foco',
      'Público quente',
      `${fn(d.voltaramSemChamar)} aparelho(s) voltaram mais de uma vez sem chamar no WhatsApp. São pessoas interessadas: um story com chamada direta (por exemplo, o plano Destaque e a reserva com 50%) pode converter esse público.`,
    );

  // Previsão
  if (prev?.suficiente) {
    const tend = prev.tendenciaSemanal;
    diz(
      'info',
      prev.provisoria ? 'Previsão (provisória)' : 'Previsão',
      `Próximos 7 dias: cerca de ${fn(prev.proximos7.visitantes)} visitantes (entre ${fn(prev.proximos7.min)} e ${fn(prev.proximos7.max)}) e ${cliques(prev.proximos7.whatsapp)} no WhatsApp. ` +
        (Math.abs(tend) >= 0.05 ? `Tendência: ${tend > 0 ? 'subindo' : 'caindo'} ${fp(Math.abs(tend) * 100)} por semana.` : 'Tendência estável.'),
    );
  } else if (prev?.aviso) diz('info', 'Previsão', prev.aviso);

  // Para onde direcionar
  if (topArea || origens[0]) {
    const area = melhorTaxa(areas, minimo) || topArea;
    // "Direto ou WhatsApp" não é um canal que se escolhe para uma campanha.
    const canais = origens.filter((o) => !['Direto ou WhatsApp', 'Outro'].includes(o.nome));
    // Só troca o canal de maior volume por outro que converta melhor com volume parecido (30% ou mais).
    const canal = melhorTaxa(canais.filter((o) => o.entradas >= (canais[0]?.entradas ?? 0) * 0.3), minimo) || canais[0];
    const oferta = area && (area.nome === 'festa' || area.nome === 'evento') ? 'os planos de evento por horas' : 'o plano Destaque (R$ 297,00, melhor custo-benefício)';
    diz(
      'foco',
      'Para onde direcionar o trabalho',
      `Concentre a próxima campanha em ${area ? nomeCapitulo(area.nome) : 'ensaios externos'}` +
        (canal ? `, pelo canal ${canal.nome}` : '') +
        (somaH > 0 ? `, postando entre ${melhorH}h e ${(melhorH + 3) % 24}h` : '') +
        `, com ${oferta} como oferta principal.`,
    );
  }
  return leitura;
}

// ---------------------------------------------------------------------------------------------
// Resumo para baixar (Markdown), pronto para colar numa IA
// ---------------------------------------------------------------------------------------------
const linha = (cols) => '| ' + cols.join(' | ') + ' |';
function tabela(cabecalho, linhas) {
  if (!linhas.length) return '_Sem dados neste período._\n';
  return [linha(cabecalho), linha(cabecalho.map(() => '---')), ...linhas.map(linha)].join('\n') + '\n';
}
const br = (s) => s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4);

export function resumoMarkdown(d, site) {
  const t = d.totais || {};
  const a = d.antes || {};
  const entradas = t.entradas || 0;
  const varia = (x, y) => (y ? `${x >= y ? '+' : ''}${fp(pct(x - y, y))}` : 'sem comparação');
  const partes = [];
  partes.push(`# Resumo do portfólio Jr_Tech_OFC: ${br(d.periodo.de)} a ${br(d.periodo.ate)}\n`);
  partes.push(`Gerado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} (horário do Maranhão), a partir do painel de estatísticas próprio do site ${site}.\n`);
  partes.push('## Contexto do negócio\n\n' + CONTEXTO.map((c) => '- ' + c).join('\n') + '\n');
  partes.push(
    '## Como ler os números\n\n' +
      '- Visitante = aparelho (celular ou computador) identificado por um código anônimo guardado no navegador.\n' +
      '- Entrada = uma visita ao site; termina depois de 30 minutos sem atividade.\n' +
      '- Conversão = entrada que terminou com um clique no botão do WhatsApp.\n',
  );
  partes.push(
    '## Números do período\n\n' +
      tabela(
        ['Indicador', 'Período', 'Período anterior', 'Variação'],
        [
          ['Visitantes (aparelhos)', fn(t.visitantes || 0), fn(a.visitantes || 0), varia(t.visitantes || 0, a.visitantes || 0)],
          ['Entradas', fn(entradas), fn(a.entradas || 0), varia(entradas, a.entradas || 0)],
          ['Páginas vistas', fn(t.visualizacoes || 0), fn(a.visualizacoes || 0), varia(t.visualizacoes || 0, a.visualizacoes || 0)],
          ['Cliques no WhatsApp', fn(t.whatsapp || 0), fn(a.whatsapp || 0), varia(t.whatsapp || 0, a.whatsapp || 0)],
          ['Conversão (entradas com WhatsApp)', fp(pct(t.entradasConv || 0, entradas)), fp(pct(a.entradasConv || 0, a.entradas || 0)), ''],
          ['Aparelhos novos', fn(t.novos || 0), fn(a.novos || 0), ''],
          ['Aparelhos que voltaram sem chamar', fn(d.voltaramSemChamar || 0), '', ''],
          ['Atendimento aberto', fn(t.assistente || 0), fn(a.assistente || 0), varia(t.assistente || 0, a.assistente || 0)],
        ],
      ),
  );
  partes.push(
    '## Interesse por área do portfólio\n\n' +
      tabela(
        ['Área', 'Entradas', 'Páginas vistas', 'Chamaram no WhatsApp', 'Conversão'],
        (d.areas || []).filter((x) => CAPITULOS[x.nome]).map((x) => [nomeCapitulo(x.nome), fn(x.entradas), fn(x.visualizacoes), fn(x.converteram), fp(pct(x.converteram, x.entradas))]),
      ),
  );
  partes.push(
    '## Álbuns\n\n' +
      tabela(
        ['Álbum', 'Entradas', 'Páginas vistas', 'Chamaram no WhatsApp', 'Conversão'],
        (d.albuns || []).map((x) => [nomeAlbum(x.nome), fn(x.entradas), fn(x.visualizacoes), fn(x.converteram), fp(pct(x.converteram, x.entradas))]),
      ),
  );
  partes.push(
    '## De onde vieram\n\n' +
      tabela(['Origem', 'Entradas', 'Chamaram no WhatsApp', 'Conversão'], (d.origens || []).map((x) => [x.nome, fn(x.entradas), fn(x.converteram), fp(pct(x.converteram, x.entradas))])),
  );
  if ((d.campanhas || []).length)
    partes.push(
      '## Links de divulgação (campanhas)\n\n' +
        tabela(['Campanha', 'Entradas', 'Chamaram no WhatsApp', 'Conversão'], d.campanhas.map((x) => [x.nome, fn(x.entradas), fn(x.converteram), fp(pct(x.converteram, x.entradas))])),
    );
  partes.push(
    '## Caminhos mais comuns dentro do site (até 5 páginas)\n\n' +
      tabela(['Caminho', 'Entradas', 'Chamaram no WhatsApp'], (d.fluxos || []).map((x) => [nomeFluxo(x.fluxo), fn(x.entradas), fn(x.converteram)])),
  );
  partes.push('## Onde clicaram para chamar no WhatsApp\n\n' + tabela(['Lugar da página', 'Cliques'], (d.ondeWhats || []).map((x) => [x.nome, fn(x.total)])));
  const horas = (d.horas || []).filter((x) => x.entradas > 0);
  partes.push('## Horários (entradas por hora, horário do Maranhão)\n\n' + tabela(['Hora', 'Entradas'], horas.map((x) => [`${x.hora}h`, fn(x.entradas)])));
  partes.push(
    '## Dias da semana (média de entradas por dia)\n\n' +
      tabela(['Dia', 'Média de entradas'], (d.semana || []).map((x) => [SEMANA[x.dow], (x.dias ? x.entradas / x.dias : 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })])),
  );
  partes.push('## Aparelhos\n\n' + tabela(['Tipo', 'Visitantes'], (d.aparelhos || []).map((x) => [x.nome, fn(x.total)])));
  const assist = (d.assistente || []).filter((x) => ['tipo', 'resultado', 'duvida', 'falar'].includes(x.nome));
  const nomesAssist = { tipo: 'Escolheu', resultado: 'Chegou ao plano', duvida: 'Dúvida', falar: 'Mandou mensagem' };
  partes.push(
    '## Atendimento do site (o que as pessoas escolheram e perguntaram)\n\n' +
      tabela(
        ['Etapa', 'Detalhe', 'Vezes'],
        assist.map((x) => [nomesAssist[x.nome], x.rotulo.split(':').map((r) => ATENDIMENTO[r] || r).join(' · '), fn(x.total)]),
      ),
  );
  const p = d.previsao;
  partes.push(
    '## Previsão\n\n' +
      (p?.suficiente
        ? tabela(
            ['Período', 'Visitantes previstos', 'Faixa provável (80%)', 'Cliques no WhatsApp previstos'],
            [
              ['Próximos 7 dias', fn(p.proximos7.visitantes), `${fn(p.proximos7.min)} a ${fn(p.proximos7.max)}`, fn(p.proximos7.whatsapp)],
              ['Próximos 30 dias', fn(p.proximos30.visitantes), `${fn(p.proximos30.min)} a ${fn(p.proximos30.max)}`, fn(p.proximos30.whatsapp)],
            ],
          ) +
          `\nBaseada em ${p.dias} dias completos de dados${p.provisoria ? ' (ainda provisória: menos de 14 dias)' : ''}. Tendência: ${p.tendenciaSemanal >= 0 ? '+' : ''}${fp(p.tendenciaSemanal * 100)} por semana. Conversão usada: ${fp(p.conversao * 100)} dos visitantes.\n`
        : (p?.aviso || 'Sem dados suficientes.') + '\n'),
  );
  partes.push('## Leitura automática do painel\n\n' + (d.leitura || []).map((l) => `- **${l.titulo}:** ${l.texto}`).join('\n') + '\n');
  partes.push(
    '## Pedido para a IA\n\n' +
      'Você é especialista em marketing para fotógrafos que vendem pelo Instagram e pelo WhatsApp. Com base no contexto e nos números acima:\n\n' +
      '1. Diga em poucas linhas o que os dados mostram (o que mais atrai, o que mais converte e onde as pessoas desistem).\n' +
      '2. Monte uma campanha para os próximos 30 dias: público, área do portfólio e plano em foco, mensagem principal, canais, frequência e horários de postagem.\n' +
      '3. Crie um calendário semana a semana com ideias de posts, stories e reels, e as chamadas para o WhatsApp.\n' +
      '4. Escreva 3 textos curtos de story e 3 legendas, no tom do fotógrafo: primeira pessoa, próximo, sem pressionar ("Seja você mesmo(a)").\n' +
      '5. Defina metas realistas de visitas e de contatos no WhatsApp, usando a previsão como ponto de partida.\n\n' +
      'Regras: use só os planos e valores do contexto; não invente promoções nem descontos; se os dados forem poucos, diga isso e proponha testes.\n',
  );
  return partes.join('\n');
}

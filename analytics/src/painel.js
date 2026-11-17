// Páginas do painel de estatísticas: entrar (senha) e o painel. Todo texto que vem dos visitantes
// (caminho, rótulo, cidade) entra na página como texto puro (textContent), nunca como HTML.

const ESTILO = `
:root {
  color-scheme: dark;
  --fundo: #0b110f;
  --painel: #141e1b;
  --painel-2: #1a2723;
  --linha: rgb(242 238 230 / 0.08);
  --costura: rgb(0 252 168 / 0.35);
  --texto: #f2eee6;
  --texto-2: #b3ada2;
  --texto-3: #8a857c;
  --marca: #00e39a;
  --marca-fraca: rgb(0 227 154 / 0.16);
  --serifa: 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif;
  --fonte: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}
* { box-sizing: border-box; margin: 0; }
body { background: var(--fundo); color: var(--texto); font: 15px/1.45 var(--fonte); -webkit-font-smoothing: antialiased; }
a { color: var(--marca); }
button, input, select { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--marca); outline-offset: 2px; }
`;

const SIMBOLO = `<svg width="26" height="26" viewBox="0 0 500 500" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00fca8"/><stop offset="1" stop-color="#22d8ff"/></linearGradient></defs><g fill="url(#g)"><path d="M158 40h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H106a10 10 0 0 1-9.6-12.8l52-174A10 10 0 0 1 158 40Z"/><path d="M350 125h94a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2h-94a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 350 125Z"/><path d="M90 265h96a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2H63a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 90 265Z"/><path d="M225 265h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H173a10 10 0 0 1-9.6-12.8l52-174a10 10 0 0 1 9.6-7.2Z"/></g></svg>`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function paginaEntrar(erro = '') {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Estatísticas | Jr_Tech_OFC</title><style>${ESTILO}
body { min-height: 100dvh; display: grid; place-items: center; padding: 16px; }
form { width: min(380px, 100%); display: grid; gap: 14px; padding: 28px 24px; border-radius: 24px; background: var(--painel); outline: 1.5px dashed var(--costura); outline-offset: -9px; }
h1 { font: 400 28px/1.1 var(--serifa); }
.marca { display: flex; align-items: center; gap: 10px; color: var(--texto-2); font-size: 13px; letter-spacing: .18em; text-transform: uppercase; }
label { display: grid; gap: 6px; color: var(--texto-2); font-size: 14px; }
input { min-height: 48px; padding: 0 16px; border: 1.5px solid var(--linha); border-radius: 14px; background: var(--fundo); font-size: 16px; }
input:focus { border-color: var(--marca); outline: none; }
button { min-height: 48px; border: 0; border-radius: 999px; background: #0d6449; color: #f4f0e8; font-weight: 650; cursor: pointer; }
.erro { color: #ffb4a8; font-weight: 600; }
</style></head><body>
<form method="post" action="/entrar">
  <p class="marca">${SIMBOLO} Jr_Tech_OFC</p>
  <h1>Estatísticas do portfólio</h1>
  ${erro ? `<p class="erro" role="alert">${esc(erro)}</p>` : ''}
  <label>Senha<input type="password" name="senha" autocomplete="current-password" required autofocus></label>
  <button type="submit">Entrar</button>
</form></body></html>`;
}

export function paginaPainel(site) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Estatísticas | Jr_Tech_OFC</title><style>${ESTILO}
.wrap { width: min(1180px, 100%); margin-inline: auto; padding: 0 16px; }
header.topo { position: sticky; top: 0; z-index: 5; background: rgb(11 17 15 / 0.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--linha); }
.topo-linha { display: flex; align-items: center; gap: 12px; min-height: 60px; }
.topo h1 { font: 400 21px/1.1 var(--serifa); flex: 1; display: flex; align-items: center; gap: 10px; }
.agora { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--texto-2); white-space: nowrap; }
.agora i { width: 8px; height: 8px; border-radius: 50%; background: var(--marca); box-shadow: 0 0 0 4px var(--marca-fraca); }
.sair { color: var(--texto-2); font-size: 13.5px; }
.periodos { display: flex; gap: 6px; overflow-x: auto; padding: 0 0 12px; scrollbar-width: none; }
.periodos button { flex: none; min-height: 38px; padding: 0 14px; border: 1.5px dashed var(--costura); border-radius: 999px; background: var(--painel); font-size: 14px; font-weight: 600; cursor: pointer; }
.periodos button[aria-pressed="true"] { background: #0d6449; border-style: solid; border-color: transparent; }
main { display: grid; gap: 16px; padding-block: 18px 40px; }
.faixa { color: var(--texto-3); font-size: 13px; }
.tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (min-width: 760px) { .tiles { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
.tile { padding: 14px 16px 16px; border-radius: 18px; background: var(--painel); display: grid; gap: 2px; }
.tile .rot { color: var(--texto-2); font-size: 13px; }
.tile .val { font: 400 34px/1.1 var(--serifa); font-variant-numeric: tabular-nums; }
.tile .var { font-size: 12.5px; color: var(--texto-3); }
.tile .var b { color: var(--texto-2); font-weight: 600; }
.card { padding: 16px; border-radius: 20px; background: var(--painel); min-width: 0; }
.card h2 { font: 400 19px/1.2 var(--serifa); margin-bottom: 2px; }
.card .sub { color: var(--texto-3); font-size: 13px; margin-bottom: 12px; }
.grade { display: grid; gap: 16px; }
@media (min-width: 860px) { .grade { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.grafico { position: relative; }
.grafico svg { display: block; width: 100%; height: auto; overflow: visible; }
.grafico text { fill: var(--texto-3); font-size: 11px; font-family: var(--fonte); }
.dica { position: absolute; z-index: 3; pointer-events: none; padding: 8px 11px; border-radius: 12px; background: #24332e; box-shadow: 0 10px 24px -10px #000; font-size: 13px; line-height: 1.4; white-space: nowrap; transform: translate(-50%, calc(-100% - 12px)); }
.dica b { font-variant-numeric: tabular-nums; }
.dica[hidden] { display: none; }
ol.barras { list-style: none; padding: 0; display: grid; gap: 4px; }
ol.barras li { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; min-height: 34px; padding: 0 10px; border-radius: 9px; overflow: hidden; }
ol.barras li::before { content: ''; position: absolute; inset: 3px auto 3px 0; width: var(--w); border-radius: 0 6px 6px 0; background: var(--marca-fraca); border-right: 2px solid var(--marca); }
ol.barras li > * { position: relative; }
ol.barras .nome { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
ol.barras .num { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 14px; }
ol.barras .num small { color: var(--texto-3); font-weight: 400; margin-left: 6px; }
.vazio { color: var(--texto-3); font-size: 14px; padding: 8px 0; }
.ajuda { color: var(--texto-3); font-size: 13px; line-height: 1.5; }
.ajuda a { color: var(--texto-2); }
</style></head><body>
<header class="topo"><div class="wrap">
  <div class="topo-linha">
    <h1>${SIMBOLO} Estatísticas</h1>
    <span class="agora" title="Pessoas no site nos últimos 30 minutos"><i></i><span id="agora">0</span> agora</span>
    <a class="sair" href="/sair">Sair</a>
  </div>
  <div class="periodos" role="group" aria-label="Período">
    <button data-p="hoje">Hoje</button><button data-p="ontem">Ontem</button><button data-p="7">7 dias</button><button data-p="30">30 dias</button><button data-p="90">90 dias</button><button data-p="365">12 meses</button>
  </div>
</div></header>
<main class="wrap" id="painel" aria-busy="true">
  <p class="faixa" id="faixa">Carregando...</p>
  <section class="tiles" id="tiles" aria-label="Resumo"></section>
  <section class="card" id="c-dias"><h2>Visitantes por dia</h2><p class="sub">Pessoas diferentes em cada dia. Passe o dedo sobre o gráfico para ver o dia.</p><div class="grafico" id="g-dias"></div></section>
  <div class="grade">
    <section class="card"><h2>Cliques de contato</h2><p class="sub">Onde as pessoas tocaram para falar com você.</p><ol class="barras" id="l-cliques"></ol></section>
    <section class="card"><h2>De onde vieram</h2><p class="sub">Primeira página da visita. Link aberto pelo WhatsApp quase sempre aparece como Direto.</p><ol class="barras" id="l-origens"></ol></section>
    <section class="card"><h2>Álbuns mais vistos</h2><p class="sub">Visualizações e pessoas.</p><ol class="barras" id="l-albuns"></ol></section>
    <section class="card"><h2>Páginas</h2><p class="sub">Visualizações e pessoas.</p><ol class="barras" id="l-paginas"></ol></section>
    <section class="card"><h2>Cidades</h2><p class="sub">Aproximada, pela rede de internet. Pode mostrar a cidade da operadora.</p><ol class="barras" id="l-cidades"></ol></section>
    <section class="card"><h2>Horário das visitas</h2><p class="sub">Visualizações por hora do dia (horário do Maranhão). Bom para escolher a hora de postar.</p><div class="grafico" id="g-horas"></div></section>
    <section class="card"><h2>Atendimento</h2><p class="sub">O que as pessoas escolheram, os planos a que chegaram e as dúvidas que abriram.</p><ol class="barras" id="l-assistente"></ol></section>
    <section class="card"><h2>Aparelhos</h2><p class="sub">Pessoas por tipo de aparelho, sistema e navegador.</p><ol class="barras" id="l-aparelhos"></ol><ol class="barras" id="l-sistemas" style="margin-top:12px"></ol><ol class="barras" id="l-navegadores" style="margin-top:12px"></ol></section>
    <section class="card" id="c-campanhas" hidden><h2>Campanhas</h2><p class="sub">Links com ?utm_campaign=</p><ol class="barras" id="l-campanhas"></ol></section>
  </div>
  <section class="card ajuda">
    <h2>Como usar</h2>
    <p>Para não contar as suas próprias visitas, abra uma vez em cada aparelho seu: <a href="${esc(site)}/?analytics=ignorar" rel="noopener">${esc(site.replace('https://', ''))}/?analytics=ignorar</a>. Para voltar a contar: <code>?analytics=contar</code>.</p>
    <p style="margin-top:8px">Para saber de onde veio cada divulgação, use links como <code>${esc(site.replace('https://', ''))}/?utm_source=instagram&amp;utm_campaign=bio</code>. A campanha aparece no quadro Campanhas.</p>
    <p style="margin-top:8px">Sem cookies e sem IP guardado: "visitantes" são pessoas diferentes em cada dia. Os dados ficam guardados por 13 meses.</p>
  </section>
</main>
<script>(${cliente.toString()})();</script>
</body></html>`;
}

// Roda no navegador do fotógrafo.
function cliente() {
  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat('pt-BR');
  const NOMES_PAGINA = { '/': 'Início', '/trabalhos': 'Portfólio', '/servicos': 'Serviços', '/como-funciona': 'Como funciona', '/sobre': 'Sobre', '/contato': 'Contato', '/privacidade': 'Privacidade', '/direitos-autorais': 'Direitos autorais' };
  const bonito = (slug) => slug.replace(/\/$/, '').split('-').map((p) => (p.length > 2 ? p[0].toUpperCase() + p.slice(1) : p)).join(' ');
  const nomePagina = (c) => {
    const k = c.replace(/\/$/, '') || '/';
    if (NOMES_PAGINA[k]) return NOMES_PAGINA[k];
    if (k.startsWith('/trabalhos/')) return 'Álbum: ' + bonito(k.slice(11));
    return k;
  };
  const NOMES_CLIQUE = { whatsapp: 'WhatsApp', email: 'E-mail', instagram: 'Instagram', album: 'Abriu álbum', stories: 'Stories', telefone: 'Telefone' };
  const NOMES_ASSIST = {
    abrir: 'Abriu o atendimento',
    tipo: 'Escolheu',
    resultado: 'Chegou ao plano',
    duvida: 'Dúvida',
    falar: 'Mandou mensagem pelo atendimento',
    naoentendeu: 'Não entendeu o que foi escrito',
    texto: 'Escreveu e foi entendido',
  };
  const ROTULOS_ASSIST = {
    guia: 'guia', duvidas: 'dúvidas',
    individual: 'ensaio individual', casal: 'casal', gestante: 'gestante', infantil: 'infantil ou família', quinze: '15 anos', aniversario: 'aniversário', evento: 'evento', profissional: 'profissional ou empresa',
    essencial: 'Essencial', destaque: 'Destaque', premium: 'Premium', 'plano-naosei': 'sem plano definido', avaliar: 'precisa avaliar',
    'evento-essencial': 'Evento Essencial', 'evento-classico': 'Evento Clássico', 'evento-completo': 'Evento Completo', 'evento-integral': 'Evento Integral',
    valores: 'planos de ensaio', 'valores-eventos': 'planos de eventos', pagamento: 'pagamento e reserva', desconto: 'desconto', 'como-funciona': 'como funciona', servicos: 'o que fotografa',
    'profissional-info': 'fotos profissionais', entrega: 'entrega', galeria: 'prazo do link', edicao: 'ajustes de edição', agendar: 'agendar', remarcar: 'remarcação', chuva: 'chuva', onde: 'onde atende',
    locais: 'lugares', horario: 'melhor horário', noite: 'ensaio à noite', estudio: 'estúdio', video: 'vídeo', casamento: 'casamento', naofaz: 'newborn ou smash', preparar: 'como se preparar',
    vergonha: 'não sabe posar', roupa: 'roupa', beleza: 'cabelo e maquiagem', levar: 'o que levar', 'infantil-dicas': 'dicas infantil', 'gestante-quando': 'época do ensaio gestante',
    quem: 'levar alguém', contrato: 'contrato', privacidade: 'privacidade', atendimento: 'horário de atendimento', portfolio: 'ver o portfólio',
  };
  const rotuloAssist = (r) => r.split(':').map((x) => ROTULOS_ASSIST[x] || x).join(' · ');

  function barras(el, linhas, { nome = (x) => x.nome, extra } = {}) {
    el.replaceChildren();
    if (!linhas || !linhas.length) {
      const p = document.createElement('li');
      p.className = 'vazio';
      p.textContent = 'Ainda sem dados neste período.';
      el.append(p);
      return;
    }
    const max = Math.max(...linhas.map((l) => l.total), 1);
    for (const l of linhas) {
      const li = document.createElement('li');
      li.style.setProperty('--w', Math.max(2, (l.total / max) * 100) + '%');
      const n = document.createElement('span');
      n.className = 'nome';
      n.textContent = nome(l);
      n.title = nome(l);
      const v = document.createElement('span');
      v.className = 'num';
      v.textContent = fmt.format(l.total);
      if (extra) {
        const s = document.createElement('small');
        s.textContent = extra(l);
        v.append(s);
      }
      li.append(n, v);
      el.append(li);
    }
  }

  function variacao(agora, antes) {
    if (!antes) return agora ? 'novo neste período' : 'sem comparação';
    const d = Math.round(((agora - antes) / antes) * 100);
    if (d === 0) return 'igual ao período anterior';
    return (d > 0 ? '▲ ' : '▼ ') + Math.abs(d) + '% vs. período anterior';
  }

  function tiles(t, a) {
    const conv = t.visitantes ? (t.chamaram / t.visitantes) * 100 : 0;
    const convAntes = a.visitantes ? (a.chamaram / a.visitantes) * 100 : 0;
    const lista = [
      ['Visitantes', fmt.format(t.visitantes || 0), variacao(t.visitantes || 0, a.visitantes || 0)],
      ['Páginas vistas', fmt.format(t.visualizacoes || 0), variacao(t.visualizacoes || 0, a.visualizacoes || 0)],
      ['Cliques no WhatsApp', fmt.format(t.whatsapp || 0), variacao(t.whatsapp || 0, a.whatsapp || 0)],
      ['Chamaram no WhatsApp', conv.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%', 'dos visitantes · antes ' + convAntes.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%'],
      ['Atendimento aberto', fmt.format(t.assistente || 0), variacao(t.assistente || 0, a.assistente || 0)],
    ];
    $('tiles').replaceChildren(
      ...lista.map(([r, v, x]) => {
        const d = document.createElement('div');
        d.className = 'tile';
        d.innerHTML = '<span class="rot"></span><span class="val"></span><span class="var"></span>';
        d.children[0].textContent = r;
        d.children[1].textContent = v;
        d.children[2].textContent = x;
        return d;
      }),
    );
  }

  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const passo = (max) => {
    const bruto = max / 4;
    const p = Math.pow(10, Math.floor(Math.log10(bruto || 1)));
    const m = [1, 2, 5, 10].find((x) => x * p >= bruto) * p;
    return Math.max(1, m);
  };
  const dataCurta = (d) => d.slice(8, 10) + '/' + d.slice(5, 7);
  const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  /** Linha de visitantes por dia, com área e dica ao passar o dedo. */
  function graficoDias(caixa, pontos) {
    caixa.replaceChildren();
    const W = 640, H = 220, E = 34, D = 8, T = 10, B = 26;
    const max = Math.max(...pontos.map((p) => p.visitantes), 1);
    const st = passo(max);
    const topo = Math.ceil(max / st) * st;
    const x = (i) => E + (pontos.length === 1 ? (W - E - D) / 2 : (i * (W - E - D)) / (pontos.length - 1));
    const y = (v) => T + (1 - v / topo) * (H - T - B);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Visitantes por dia' });
    for (let v = 0; v <= topo; v += st) {
      svg.append(svgEl('line', { x1: E, x2: W - D, y1: y(v), y2: y(v), stroke: 'rgb(242 238 230 / 0.07)' }));
      const t = svgEl('text', { x: E - 8, y: y(v) + 4, 'text-anchor': 'end' });
      t.textContent = fmt.format(v);
      svg.append(t);
    }
    const cada = Math.max(1, Math.ceil(pontos.length / 7));
    pontos.forEach((p, i) => {
      if (i % cada && i !== pontos.length - 1) return;
      const t = svgEl('text', { x: x(i), y: H - 6, 'text-anchor': 'middle' });
      t.textContent = dataCurta(p.dia);
      svg.append(t);
    });
    const linha = pontos.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.visitantes).toFixed(1)}`).join('');
    svg.append(svgEl('path', { d: `${linha}L${x(pontos.length - 1)},${y(0)}L${x(0)},${y(0)}Z`, fill: 'rgb(0 227 154 / 0.12)' }));
    svg.append(svgEl('path', { d: linha, fill: 'none', stroke: '#00e39a', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    const guia = svgEl('line', { y1: T, y2: H - B, stroke: 'rgb(242 238 230 / 0.35)', 'stroke-dasharray': '3 3', visibility: 'hidden' });
    const ponto = svgEl('circle', { r: 5, fill: '#00e39a', stroke: '#141e1b', 'stroke-width': 2, visibility: 'hidden' });
    svg.append(guia, ponto);
    const dica = document.createElement('div');
    dica.className = 'dica';
    dica.hidden = true;
    caixa.append(svg, dica);
    const mostrar = (ev) => {
      const r = svg.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * W;
      let i = Math.round(((px - E) / (W - E - D)) * (pontos.length - 1));
      i = Math.max(0, Math.min(pontos.length - 1, i));
      const p = pontos[i];
      guia.setAttribute('x1', x(i));
      guia.setAttribute('x2', x(i));
      ponto.setAttribute('cx', x(i));
      ponto.setAttribute('cy', y(p.visitantes));
      guia.setAttribute('visibility', 'visible');
      ponto.setAttribute('visibility', 'visible');
      const sem = DIAS_SEMANA[new Date(p.dia + 'T12:00:00Z').getUTCDay()];
      dica.innerHTML = '<div></div><div>Visitantes: <b></b></div><div>Páginas vistas: <b></b></div><div>WhatsApp: <b></b></div>';
      dica.children[0].textContent = sem + ', ' + dataCurta(p.dia);
      dica.children[1].lastChild.textContent = fmt.format(p.visitantes);
      dica.children[2].lastChild.textContent = fmt.format(p.visualizacoes);
      dica.children[3].lastChild.textContent = fmt.format(p.whatsapp);
      dica.hidden = false;
      const left = (x(i) / W) * r.width;
      dica.style.left = Math.min(Math.max(left, 70), r.width - 70) + 'px';
      dica.style.top = (y(p.visitantes) / H) * r.height + 'px';
    };
    const esconder = () => {
      dica.hidden = true;
      guia.setAttribute('visibility', 'hidden');
      ponto.setAttribute('visibility', 'hidden');
    };
    svg.addEventListener('pointermove', mostrar);
    svg.addEventListener('pointerdown', mostrar);
    svg.addEventListener('pointerleave', esconder);
  }

  /** Colunas por hora do dia, com dica em cada coluna. */
  function graficoHoras(caixa, horas) {
    caixa.replaceChildren();
    const valores = Array.from({ length: 24 }, (_, h) => horas.find((x) => x.hora === h)?.total ?? 0);
    const W = 640, H = 180, E = 8, D = 8, T = 10, B = 22;
    const max = Math.max(...valores, 1);
    const larg = (W - E - D) / 24;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Visualizações por hora do dia' });
    svg.append(svgEl('line', { x1: E, x2: W - D, y1: H - B, y2: H - B, stroke: 'rgb(242 238 230 / 0.12)' }));
    const dica = document.createElement('div');
    dica.className = 'dica';
    dica.hidden = true;
    valores.forEach((v, h) => {
      const alt = (v / max) * (H - T - B);
      const bx = E + h * larg + 2;
      const bw = larg - 4;
      const by = H - B - alt;
      const r = Math.min(4, bw / 2, alt);
      const d = alt > 0 ? `M${bx},${H - B}V${by + r}Q${bx},${by} ${bx + r},${by}H${bx + bw - r}Q${bx + bw},${by} ${bx + bw},${by + r}V${H - B}Z` : '';
      if (d) svg.append(svgEl('path', { d, fill: '#00c487' }));
      const alvo = svgEl('rect', { x: E + h * larg, y: T, width: larg, height: H - T - B, fill: 'transparent' });
      alvo.addEventListener('pointerenter', () => {
        const rr = svg.getBoundingClientRect();
        dica.textContent = '';
        const a = document.createElement('div');
        a.textContent = h + 'h às ' + (h + 1) + 'h';
        const b = document.createElement('div');
        b.innerHTML = 'Páginas vistas: <b></b>';
        b.lastChild.textContent = fmt.format(v);
        dica.append(a, b);
        dica.hidden = false;
        dica.style.left = Math.min(Math.max(((E + h * larg + larg / 2) / W) * rr.width, 70), rr.width - 70) + 'px';
        dica.style.top = (by / H) * rr.height + 'px';
      });
      alvo.addEventListener('pointerleave', () => (dica.hidden = true));
      svg.append(alvo);
      if (h % 3 === 0) {
        const t = svgEl('text', { x: E + h * larg + larg / 2, y: H - 6, 'text-anchor': 'middle' });
        t.textContent = h + 'h';
        svg.append(t);
      }
    });
    caixa.append(svg, dica);
  }

  function preencherDias(porDia, de, ate) {
    const mapa = new Map(porDia.map((p) => [p.dia, p]));
    const lista = [];
    for (let t = Date.parse(de); t <= Date.parse(ate); t += 86400000) {
      const dia = new Date(t).toISOString().slice(0, 10);
      lista.push(mapa.get(dia) || { dia, visitantes: 0, visualizacoes: 0, whatsapp: 0 });
    }
    return lista;
  }

  let periodo = new URLSearchParams(location.search).get('periodo') || '30';
  async function carregar() {
    document.querySelectorAll('.periodos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === periodo)));
    $('painel').setAttribute('aria-busy', 'true');
    const r = await fetch('/api/dados?periodo=' + encodeURIComponent(periodo), { credentials: 'same-origin' });
    if (r.status === 401) return location.reload();
    const d = await r.json();
    const { de, ate } = d.periodo;
    const br = (s) => s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4);
    $('faixa').textContent = de === ate ? 'Dia ' + br(de) : 'De ' + br(de) + ' a ' + br(ate);
    $('agora').textContent = fmt.format(d.agora);
    tiles(d.totais || {}, d.antes || {});
    const dias = preencherDias(d.porDia, de, ate);
    $('c-dias').hidden = dias.length < 2;
    if (dias.length >= 2) graficoDias($('g-dias'), dias);
    const pessoas = (l) => fmt.format(l.pessoas) + ' pessoas';
    barras($('l-cliques'), d.cliques, {
      nome: (l) => {
        const [n, ...resto] = l.nome.split(' · ');
        const r = resto.join(' · ');
        const rot = n === 'album' ? bonito(r.split(' · ')[0] || '') + (r.includes(' · ') ? ' · ' + r.split(' · ').slice(1).join(' · ') : '') : r;
        return (NOMES_CLIQUE[n] || n) + (rot ? ' · ' + rot : '');
      },
    });
    barras($('l-origens'), d.origens);
    barras($('l-albuns'), d.albuns, { nome: (l) => bonito(l.nome), extra: pessoas });
    barras($('l-paginas'), d.paginas, { nome: (l) => nomePagina(l.nome), extra: pessoas });
    barras($('l-cidades'), d.cidades);
    graficoHoras($('g-horas'), d.horas);
    barras($('l-assistente'), d.assistente, {
      nome: (l) => (NOMES_ASSIST[l.nome] || l.nome) + (l.rotulo ? ': ' + rotuloAssist(l.rotulo) : ''),
    });
    barras($('l-aparelhos'), d.aparelhos);
    barras($('l-sistemas'), d.sistemas);
    barras($('l-navegadores'), d.navegadores);
    $('c-campanhas').hidden = !d.campanhas.length;
    barras($('l-campanhas'), d.campanhas);
    $('painel').setAttribute('aria-busy', 'false');
  }
  document.querySelectorAll('.periodos button').forEach((b) =>
    b.addEventListener('click', () => {
      periodo = b.dataset.p;
      history.replaceState(null, '', '?periodo=' + periodo);
      carregar();
    }),
  );
  carregar();
  setInterval(() => document.visibilityState === 'visible' && carregar(), 60000);
}

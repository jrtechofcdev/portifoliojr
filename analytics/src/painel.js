// Páginas do painel de estatísticas: entrar (senha) e o painel, com quatro abas: Resumo, Ao vivo,
// Aparelhos e Análise. Todo texto que vem dos visitantes (caminho, rótulo, cidade) entra na página
// como texto puro (textContent), nunca como HTML.
import { nomeAlbum } from './analise.js';

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
  --alerta: #ffcf7a;
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
  const nomes = {
    albuns: Object.fromEntries(
      ['sabrina', 'sara-e-yasmin', 'dalila', 'jose', 'tia-josina', 'marlieth-e-paulo', 'victor-e-tamires', 'kiara-15-anos', 'vitoria-emanuela-15-anos', 'aniversario-de-irenilde', 'adrian-18-anos', 'bodas-de-ouro-nelson-e-dalvina', 'manha-com-deus', 'confra-juventude-estrela-de-luz'].map((s) => [s, nomeAlbum(s)]),
    ),
  };
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>Estatísticas | Jr_Tech_OFC</title><style>${ESTILO}
.wrap { width: min(1180px, 100%); margin-inline: auto; padding: 0 16px; }
header.topo { position: sticky; top: 0; z-index: 5; background: rgb(11 17 15 / 0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--linha); }
.topo-linha { display: flex; align-items: center; gap: 10px; min-height: 58px; }
.topo h1 { font: 400 20px/1.1 var(--serifa); flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0; }
.agora { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--texto-2); white-space: nowrap; }
.agora i { width: 8px; height: 8px; border-radius: 50%; background: var(--marca); box-shadow: 0 0 0 4px var(--marca-fraca); animation: pulsar 2s ease-in-out infinite; }
@keyframes pulsar { 50% { box-shadow: 0 0 0 7px rgb(0 227 154 / 0.05); } }
@media (prefers-reduced-motion: reduce) { .agora i { animation: none; } }
.acoes-topo { display: flex; gap: 6px; flex: 1 1 100%; overflow-x: auto; scrollbar-width: none; }
@media (min-width: 760px) { .abas { flex: 1 1 auto !important; } .acoes-topo { flex: none; } }
.acao { display: inline-flex; align-items: center; gap: 6px; min-height: 38px; padding: 0 12px; border: 1.5px dashed var(--costura); border-radius: 999px; background: var(--painel); color: var(--texto); font-size: 13.5px; font-weight: 600; text-decoration: none; cursor: pointer; white-space: nowrap; }
.acao.perigo { border-color: rgb(255 154 138 / 0.5); color: #ffb4a8; }
.abas { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.abas button { flex: none; min-height: 42px; padding: 0 14px; border: 0; border-bottom: 2.5px solid transparent; background: none; color: var(--texto-2); font-weight: 650; cursor: pointer; }
.abas button[aria-selected="true"] { color: var(--texto); border-bottom-color: var(--marca); }
.periodos { display: flex; gap: 6px; overflow-x: auto; padding: 10px 0 12px; scrollbar-width: none; }
.periodos button { flex: none; min-height: 36px; padding: 0 13px; border: 1.5px dashed var(--costura); border-radius: 999px; background: var(--painel); font-size: 13.5px; font-weight: 600; cursor: pointer; }
.periodos button[aria-pressed="true"] { background: #0d6449; border-style: solid; border-color: transparent; }
main { display: grid; gap: 16px; padding-block: 16px 48px; }
[hidden] { display: none !important; }
.faixa { color: var(--texto-3); font-size: 13px; }
.tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@media (min-width: 760px) { .tiles { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.tile { padding: 14px 16px 16px; border-radius: 18px; background: var(--painel); display: grid; gap: 2px; align-content: start; }
.tile .rot { color: var(--texto-2); font-size: 13px; }
.tile .val { font: 400 32px/1.1 var(--serifa); font-variant-numeric: tabular-nums; }
.tile .var { font-size: 12.5px; color: var(--texto-3); }
.card { padding: 16px; border-radius: 20px; background: var(--painel); min-width: 0; }
.card h2 { font: 400 19px/1.2 var(--serifa); margin-bottom: 2px; }
.card .sub { color: var(--texto-3); font-size: 13px; margin-bottom: 12px; }
.grade { display: grid; gap: 16px; }
@media (min-width: 860px) { .grade { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.grafico { position: relative; }
.grafico svg { display: block; width: 100%; height: auto; overflow: visible; }
.grafico text { fill: var(--texto-3); font-size: 11px; font-family: var(--fonte); }
.legenda-g { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12.5px; color: var(--texto-3); margin-top: 6px; }
.legenda-g span::before { content: ''; display: inline-block; width: 18px; height: 0; border-top: 2px solid var(--marca); margin-right: 6px; vertical-align: middle; }
.legenda-g .prev::before { border-top-style: dashed; }
.dica { position: absolute; z-index: 3; pointer-events: none; padding: 8px 11px; border-radius: 12px; background: #24332e; box-shadow: 0 10px 24px -10px #000; font-size: 13px; line-height: 1.4; white-space: nowrap; transform: translate(-50%, calc(-100% - 12px)); }
.dica b { font-variant-numeric: tabular-nums; }
ol.barras { list-style: none; padding: 0; display: grid; gap: 4px; }
ol.barras li { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; min-height: 34px; padding: 0 10px; border-radius: 9px; overflow: hidden; }
ol.barras li::before { content: ''; position: absolute; inset: 3px auto 3px 0; width: var(--w); border-radius: 0 6px 6px 0; background: var(--marca-fraca); border-right: 2px solid var(--marca); }
ol.barras li > * { position: relative; }
ol.barras .nome { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
ol.barras .num { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 14px; white-space: nowrap; }
ol.barras .num small { color: var(--texto-3); font-weight: 400; margin-left: 6px; }
.vazio { color: var(--texto-3); font-size: 14px; padding: 8px 0; }
.ajuda { color: var(--texto-3); font-size: 13px; line-height: 1.5; }
.ajuda a { color: var(--texto-2); }
code { font-size: 12.5px; background: var(--painel-2); padding: 1px 5px; border-radius: 5px; }
/* Ao vivo */
.ativos { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
.ativo { flex: none; display: grid; gap: 2px; min-width: 170px; padding: 10px 12px; border-radius: 14px; background: var(--painel-2); font-size: 13px; text-align: left; border: 0; cursor: pointer; }
.ativo strong { font-size: 14px; }
.ativo span { color: var(--texto-3); }
ol.feed { list-style: none; padding: 0; display: grid; }
ol.feed li { display: grid; grid-template-columns: 64px minmax(0, 1fr); gap: 10px; padding: 9px 4px; border-bottom: 1px solid var(--linha); font-size: 14px; }
ol.feed li.novo { animation: entrar 900ms ease-out; }
@keyframes entrar { from { background: rgb(0 227 154 / 0.14); } }
ol.feed time { color: var(--texto-3); font-size: 12.5px; font-variant-numeric: tabular-nums; padding-top: 1px; }
ol.feed .quem { display: block; color: var(--texto-3); font-size: 12.5px; }
ol.feed .quem button { padding: 0; border: 0; background: none; color: var(--texto-2); text-decoration: underline dashed; text-underline-offset: 3px; cursor: pointer; font-size: inherit; }
.marca-whats { color: var(--marca); font-weight: 650; }
/* Aparelhos */
.filtros { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.filtros button { min-height: 34px; padding: 0 12px; border: 1.5px dashed var(--costura); border-radius: 999px; background: var(--painel-2); font-size: 13px; font-weight: 600; cursor: pointer; }
.filtros button[aria-pressed="true"] { background: #0d6449; border-style: solid; border-color: transparent; }
ol.aparelhos { list-style: none; padding: 0; display: grid; gap: 8px; }
ol.aparelhos button { width: 100%; display: grid; gap: 6px; padding: 12px 14px; border: 0; border-radius: 16px; background: var(--painel-2); text-align: left; cursor: pointer; }
ol.aparelhos button:hover { outline: 1.5px solid var(--costura); }
.ap-topo { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
.ap-topo strong { font-size: 15px; }
.ap-topo span { color: var(--texto-3); font-size: 12.5px; white-space: nowrap; }
.ap-info { color: var(--texto-2); font-size: 13px; }
.ap-num { display: flex; gap: 6px 14px; flex-wrap: wrap; font-size: 13px; color: var(--texto-2); }
.ap-num b { color: var(--texto); font-variant-numeric: tabular-nums; }
.selo { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 650; margin-right: 4px; background: var(--painel); color: var(--texto-2); }
.selo.conv { background: #0d6449; color: #f4f0e8; }
.selo.quente { background: rgb(255 207 122 / 0.16); color: var(--alerta); }
dialog { margin: auto; width: min(640px, calc(100% - 24px)); max-height: calc(100dvh - 24px); padding: 0; border: 0; border-radius: 22px; background: var(--painel); color: var(--texto); }
dialog::backdrop { background: rgb(0 0 0 / 0.6); }
.dlg-topo { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 16px 16px 10px; background: var(--painel); border-bottom: 1px solid var(--linha); }
.dlg-topo h2 { font: 400 20px/1.2 var(--serifa); }
.dlg-corpo { padding: 12px 16px 18px; display: grid; gap: 14px; }
.sessao h3 { font-size: 13px; color: var(--texto-3); font-weight: 600; margin-bottom: 4px; }
/* Análise */
ol.leitura { list-style: none; padding: 0; display: grid; gap: 8px; }
ol.leitura li { padding: 12px 14px 12px 16px; border-radius: 14px; background: var(--painel-2); border-left: 3px solid var(--texto-3); font-size: 14.5px; line-height: 1.5; }
ol.leitura li.foco { border-left-color: var(--marca); }
ol.leitura li.alerta { border-left-color: var(--alerta); }
ol.leitura strong { display: block; font-size: 13px; color: var(--texto-2); margin-bottom: 2px; }
.prev-num { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
.prev-num div { padding: 12px 14px; border-radius: 14px; background: var(--painel-2); }
.prev-num b { display: block; font: 400 26px/1.15 var(--serifa); }
.prev-num span { font-size: 12.5px; color: var(--texto-3); }
table.tab { width: 100%; border-collapse: collapse; font-size: 13.5px; }
table.tab th { text-align: left; color: var(--texto-3); font-weight: 600; font-size: 12.5px; padding: 6px 6px; border-bottom: 1px solid var(--linha); }
table.tab td { padding: 8px 6px; border-bottom: 1px solid var(--linha); vertical-align: top; }
table.tab td.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.tab-rolo { overflow-x: auto; }
.limpar-form { display: grid; gap: 10px; }
.limpar-form input { min-height: 44px; padding: 0 14px; border: 1.5px solid var(--linha); border-radius: 12px; background: var(--fundo); }
.limpar-form .botoes { display: flex; gap: 8px; justify-content: flex-end; }
.btn { min-height: 42px; padding: 0 16px; border: 0; border-radius: 999px; font-weight: 650; cursor: pointer; }
.btn.perigo { background: #8a2b20; color: #fff; }
.btn.neutro { background: var(--painel-2); }
</style></head><body>
<header class="topo"><div class="wrap">
  <div class="topo-linha">
    <h1>${SIMBOLO} Estatísticas</h1>
    <span class="agora" title="Aparelhos com atividade nos últimos 5 minutos"><i></i><span id="agora">0</span> agora</span>
  </div>
  <div class="topo-linha" style="min-height:auto;padding-bottom:6px;flex-wrap:wrap">
    <nav class="abas" role="tablist" aria-label="Seções" style="flex:1 1 100%">
      <button role="tab" data-aba="resumo" aria-selected="true">Resumo</button>
      <button role="tab" data-aba="aovivo" aria-selected="false">Ao vivo</button>
      <button role="tab" data-aba="aparelhos" aria-selected="false">Aparelhos</button>
      <button role="tab" data-aba="analise" aria-selected="false">Análise</button>
    </nav>
    <div class="acoes-topo">
      <a class="acao" id="baixar" href="/api/resumo.md?periodo=30" download>Baixar resumo</a>
      <button class="acao perigo" id="limpar" type="button">Limpar dados</button>
      <a class="acao" href="/sair">Sair</a>
    </div>
  </div>
  <div class="periodos" role="group" aria-label="Período" id="periodos">
    <button data-p="hoje">Hoje</button><button data-p="ontem">Ontem</button><button data-p="7">7 dias</button><button data-p="30">30 dias</button><button data-p="90">90 dias</button><button data-p="365">12 meses</button>
  </div>
</div></header>

<main class="wrap">
  <p class="faixa" id="faixa">Carregando...</p>

  <!-- Resumo -->
  <section data-painel="resumo" class="grade" style="grid-template-columns:1fr">
    <div class="tiles" id="tiles" aria-label="Resumo"></div>
    <section class="card" id="c-dias"><h2>Visitantes por dia</h2><p class="sub">Aparelhos diferentes em cada dia. Passe o dedo sobre o gráfico para ver o dia.</p><div class="grafico" id="g-dias"></div></section>
    <div class="grade">
      <section class="card"><h2>Cliques por lugar</h2><p class="sub">Cada toque registrado, com o lugar da página. Número de cliques e de aparelhos.</p><ol class="barras" id="l-cliques"></ol></section>
      <section class="card"><h2>De onde vieram</h2><p class="sub">Entradas por origem. Link aberto pelo WhatsApp sem etiqueta aparece como Direto.</p><ol class="barras" id="l-origens"></ol></section>
      <section class="card"><h2>Álbuns mais vistos</h2><p class="sub">Visualizações e aparelhos.</p><ol class="barras" id="l-albuns"></ol></section>
      <section class="card"><h2>Páginas</h2><p class="sub">Visualizações e aparelhos.</p><ol class="barras" id="l-paginas"></ol></section>
      <section class="card"><h2>Cidades</h2><p class="sub">Aproximada, pela rede de internet. Pode mostrar a cidade da operadora.</p><ol class="barras" id="l-cidades"></ol></section>
      <section class="card"><h2>Horário das visitas</h2><p class="sub">Páginas vistas por hora (horário do Maranhão).</p><div class="grafico" id="g-horas"></div></section>
      <section class="card"><h2>Atendimento</h2><p class="sub">O que escolheram, os planos a que chegaram e as dúvidas.</p><ol class="barras" id="l-assistente"></ol></section>
      <section class="card"><h2>Aparelhos</h2><p class="sub">Por tipo, sistema e navegador.</p><ol class="barras" id="l-aparelhos"></ol><ol class="barras" id="l-sistemas" style="margin-top:12px"></ol><ol class="barras" id="l-navegadores" style="margin-top:12px"></ol></section>
      <section class="card" id="c-campanhas" hidden><h2>Campanhas</h2><p class="sub">Links com etiqueta (?utm_campaign=), como /ig, /s e /wa.</p><ol class="barras" id="l-campanhas"></ol></section>
    </div>
  </section>

  <!-- Ao vivo -->
  <section data-painel="aovivo" class="grade" style="grid-template-columns:1fr" hidden>
    <section class="card"><h2>No site agora</h2><p class="sub">Aparelhos com atividade nos últimos 5 minutos. Atualiza a cada 5 segundos. Toque para ver o caminho.</p><div class="ativos" id="ativos"></div></section>
    <section class="card"><h2>Acontecendo</h2><p class="sub">Cada página aberta e cada clique, do mais recente ao mais antigo.</p><ol class="feed" id="feed"></ol></section>
  </section>

  <!-- Aparelhos -->
  <section data-painel="aparelhos" hidden>
    <section class="card">
      <h2>Aparelhos do período</h2>
      <p class="sub">Cada celular ou computador, quantas vezes entrou, o que viu e onde clicou. Toque para ver a linha do tempo.</p>
      <div class="filtros" role="group" aria-label="Filtrar aparelhos" id="filtros-ap">
        <button data-f="todos" aria-pressed="true">Todos</button>
        <button data-f="conv" aria-pressed="false">Chamaram no WhatsApp</button>
        <button data-f="quente" aria-pressed="false">Voltaram sem chamar</button>
        <button data-f="uma" aria-pressed="false">Entraram uma vez</button>
      </div>
      <ol class="aparelhos" id="l-ap"></ol>
    </section>
  </section>

  <!-- Análise -->
  <section data-painel="analise" class="grade" style="grid-template-columns:1fr" hidden>
    <section class="card"><h2>Assistente de análise</h2><p class="sub">Leitura automática do período: o que mais atraiu, o que mais converteu e para onde direcionar o trabalho. São regras sobre os números, não IA.</p><ol class="leitura" id="leitura"></ol></section>
    <section class="card"><h2>Previsão</h2><p class="sub" id="prev-sub">Visitantes por dia: últimos 30 dias e os próximos 7.</p><div class="prev-num" id="prev-num"></div><div class="grafico" id="g-prev"></div><p class="legenda-g"><span>Real</span><span class="prev">Previsto (faixa clara: provável)</span></p></section>
    <div class="grade">
      <section class="card"><h2>Áreas do portfólio</h2><p class="sub">Entradas que viram álbuns de cada área e quantas chamaram no WhatsApp.</p><div class="tab-rolo"><table class="tab" id="t-areas"></table></div></section>
      <section class="card"><h2>Origem e conversão</h2><p class="sub">Entradas por origem e quantas terminaram no WhatsApp.</p><div class="tab-rolo"><table class="tab" id="t-origens"></table></div></section>
      <section class="card"><h2>Álbuns e conversão</h2><p class="sub">Entradas que abriram cada álbum e quantas chamaram.</p><div class="tab-rolo"><table class="tab" id="t-albuns"></table></div></section>
      <section class="card"><h2>Caminhos no site</h2><p class="sub">As primeiras páginas de cada entrada (até 5) e quantas terminaram no WhatsApp.</p><div class="tab-rolo"><table class="tab" id="t-fluxos"></table></div></section>
    </div>
  </section>

  <section class="card ajuda">
    <h2>Como usar</h2>
    <p>Para não contar as suas próprias visitas, abra uma vez em cada aparelho seu: <a href="${esc(site)}/?analytics=ignorar" rel="noopener">${esc(site.replace('https://', ''))}/?analytics=ignorar</a>. Para voltar a contar: <code>?analytics=contar</code>.</p>
    <p style="margin-top:8px">Links curtos com etiqueta: <code>/ig</code> (bio do Instagram), <code>/s</code> (story) e <code>/wa</code> (bio do WhatsApp).</p>
    <p style="margin-top:8px">"Baixar resumo" gera um arquivo com os números do período, a leitura automática, a previsão e um pedido pronto para colar numa IA montar a campanha.</p>
    <p style="margin-top:8px">Cada aparelho é um código anônimo guardado no navegador, sem nome, telefone ou IP. Os dados ficam 13 meses.</p>
  </section>
</main>

<dialog id="dlg-ap" aria-labelledby="dlg-ap-titulo"><div class="dlg-topo"><h2 id="dlg-ap-titulo">Aparelho</h2><button class="acao" type="button" data-fechar>Fechar</button></div><div class="dlg-corpo" id="dlg-ap-corpo"></div></dialog>
<dialog id="dlg-limpar" aria-labelledby="dlg-limpar-titulo"><div class="dlg-topo"><h2 id="dlg-limpar-titulo">Limpar todos os dados</h2></div>
  <form class="dlg-corpo limpar-form" id="form-limpar">
    <p>Isso apaga todas as visitas, cliques e aparelhos registrados até agora. O painel volta a zero e começa a contar de novo. Não dá para desfazer.</p>
    <label>Para confirmar, escreva <b>LIMPAR</b><input name="confirmar" autocomplete="off" required></label>
    <p class="erro" id="limpar-erro" role="alert" hidden style="color:#ffb4a8"></p>
    <div class="botoes"><button class="btn neutro" type="button" data-fechar>Cancelar</button><button class="btn perigo" type="submit">Apagar tudo</button></div>
  </form>
</dialog>
<script type="application/json" id="nomes">${JSON.stringify(nomes).replace(/</g, '\\u003c')}</script>
<script>var __name = function (f) { return f; };(${cliente.toString()})();</script>
</body></html>`;
}

// Roda no navegador do fotógrafo.
function cliente() {
  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat('pt-BR');
  const NOMES = JSON.parse($('nomes').textContent);
  const PAGINAS = { '/': 'Início', '/trabalhos': 'Portfólio', '/servicos': 'Serviços', '/como-funciona': 'Como funciona', '/sobre': 'Sobre', '/contato': 'Contato', '/privacidade': 'Privacidade', '/direitos-autorais': 'Direitos autorais' };
  const CAPITULOS = { ensaio: 'Ensaios externos', casal: 'Casais e gestantes', festa: '15 anos e aniversários', evento: 'Eventos e celebrações' };
  const bonito = (slug) => NOMES.albuns[slug] || slug.replace(/\/$/, '').split('-').map((p) => (p.length > 2 ? p[0].toUpperCase() + p.slice(1) : p)).join(' ');
  const nomePagina = (c) => {
    const k = (c || '').replace(/\/$/, '') || '/';
    if (PAGINAS[k]) return PAGINAS[k];
    if (k.startsWith('/trabalhos/')) return 'Álbum ' + bonito(k.slice(11));
    return k;
  };
  const nomeFluxo = (f) => f.split(' > ').filter((p, i, a) => i === 0 || p !== a[i - 1]).map(nomePagina).join(' → ');
  const ROT = {
    guia: 'guia', duvidas: 'dúvidas', falar: 'falar',
    individual: 'ensaio individual', casal: 'casal', gestante: 'gestante', infantil: 'infantil ou família', quinze: '15 anos', aniversario: 'aniversário', evento: 'evento', profissional: 'profissional ou empresa',
    essencial: 'Essencial', destaque: 'Destaque', premium: 'Premium', 'plano-naosei': 'sem plano definido', avaliar: 'precisa avaliar', preco: 'perguntou o preço',
    'evento-essencial': 'Evento Essencial', 'evento-classico': 'Evento Clássico', 'evento-completo': 'Evento Completo', 'evento-integral': 'Evento Integral',
    valores: 'planos de ensaio', 'valores-eventos': 'planos de eventos', pagamento: 'pagamento e reserva', desconto: 'desconto', 'como-funciona': 'como funciona', servicos: 'o que fotografa',
    'profissional-info': 'fotos profissionais', entrega: 'entrega', galeria: 'prazo do link', edicao: 'ajustes de edição', agendar: 'agendar', remarcar: 'remarcação', chuva: 'chuva', onde: 'onde atende',
    locais: 'lugares', horario: 'melhor horário', noite: 'ensaio à noite', estudio: 'estúdio', video: 'vídeo', casamento: 'casamento', naofaz: 'newborn ou smash', preparar: 'como se preparar',
    vergonha: 'não sabe posar', roupa: 'roupa', beleza: 'cabelo e maquiagem', levar: 'o que levar', 'infantil-dicas': 'dicas infantil', 'gestante-quando': 'época do ensaio gestante',
    quem: 'levar alguém', contrato: 'contrato', privacidade: 'privacidade', atendimento: 'horário de atendimento', portfolio: 'ver o portfólio', oi: 'cumprimento', obrigado: 'agradecimento',
    orcamento: 'pediu orçamento', recomecar: 'recomeçar', naosei: 'ainda não sabe', tipo: 'tipo', segunda: 'estilo', plano: 'plano', prazo: 'prazo', cidade: 'cidade',
  };
  const rot = (r) => (r || '').split(':').map((x) => ROT[x] || x).join(' · ');
  const NOMES_CLIQUE = { whatsapp: 'WhatsApp', email: 'E-mail', instagram: 'Instagram', telefone: 'Telefone', album: 'Abriu álbum', stories: 'Stories', foto: 'Ampliou foto', link: 'Link', filtro: 'Filtro', menu: 'Menu', externo: 'Link externo' };
  const NOMES_ASSIST = { abrir: 'Abriu o atendimento', tipo: 'Escolheu', resultado: 'Chegou ao plano', duvida: 'Dúvida', falar: 'Mandou mensagem pelo atendimento', naoentendeu: 'Não entendeu o que foi escrito', texto: 'Escreveu e foi entendido' };
  const nomeClique = (l) => {
    const [n, ...resto] = l.nome.split(' · ');
    let r = resto.join(' · ');
    if (n === 'album' || n === 'foto') r = r.replace(/^([^·]+)/, (m) => bonito(m.trim()) + ' ');
    if (n === 'link') r = r.replace(/^([^·]+)/, (m) => nomePagina(m.trim()) + ' ');
    if (n === 'filtro') r = CAPITULOS[r] || r || 'todos';
    return (NOMES_CLIQUE[n] || n) + (r.trim() ? ' · ' + r.trim().replace(/\s+·/g, ' ·') : '');
  };
  /** Frase de um evento, para o ao vivo e a linha do tempo. */
  function descrever(e) {
    if (e.tipo === 'ver') {
      let s = 'Abriu ' + nomePagina(e.caminho);
      if (e.origem) s += ' · ' + veioDe(e.origem);
      if (e.campanha) s += ' (' + e.campanha + ')';
      return s;
    }
    if (e.tipo === 'clique') {
      if (e.nome === 'whatsapp') return 'Tocou no WhatsApp' + (e.rotulo ? ' · ' + e.rotulo : '');
      return 'Tocou: ' + nomeClique({ nome: e.nome + (e.rotulo ? ' · ' + e.rotulo : '') });
    }
    return (NOMES_ASSIST[e.nome] || e.nome) + (e.rotulo ? ': ' + rot(e.rotulo) : '');
  }
  const codigo = (v) => 'Aparelho ' + (v || '').slice(0, 4).toUpperCase();
  const plural = (n, um, varios) => fmt.format(n) + ' ' + (n === 1 ? um : varios);
  const veioDe = (o) => (o === 'Direto ou WhatsApp' ? 'entrou direto ou por link do WhatsApp' : 'veio de ' + o);
  const quando = (ts) => {
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return 'há ' + Math.max(1, s) + ' s';
    if (s < 3600) return 'há ' + Math.round(s / 60) + ' min';
    if (s < 86400) return 'há ' + Math.round(s / 3600) + ' h';
    return new Date(ts).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };
  const hora = (ts) => new Date(ts).toLocaleTimeString('pt-BR', { timeZone: 'America/Fortaleza', hour: '2-digit', minute: '2-digit' });
  const dataHora = (ts) => new Date(ts).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const el = (tag, props = {}, ...filhos) => {
    const e = document.createElement(tag);
    for (const k in props) {
      if (k === 'class') e.className = props[k];
      else if (k === 'text') e.textContent = props[k];
      else e.setAttribute(k, props[k]);
    }
    e.append(...filhos.filter((f) => f !== null && f !== undefined && f !== false));
    return e;
  };
  const pct = (a, b) => (b ? ((a / b) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '0%');
  async function api(caminho) {
    const r = await fetch(caminho, { credentials: 'same-origin' });
    if (r.status === 401) {
      location.reload();
      throw new Error('sessão');
    }
    return r.json();
  }

  function barras(alvo, linhas, { nome = (x) => x.nome, extra } = {}) {
    alvo.replaceChildren();
    if (!linhas || !linhas.length) return alvo.append(el('li', { class: 'vazio', text: 'Ainda sem dados neste período.' }));
    const max = Math.max(...linhas.map((l) => l.total), 1);
    for (const l of linhas) {
      const li = el('li');
      li.style.setProperty('--w', Math.max(2, (l.total / max) * 100) + '%');
      const v = el('span', { class: 'num', text: fmt.format(l.total) });
      if (extra) v.append(el('small', { text: extra(l) }));
      li.append(el('span', { class: 'nome', text: nome(l), title: nome(l) }), v);
      alvo.append(li);
    }
  }
  function tabela(alvo, cab, linhas) {
    alvo.replaceChildren();
    if (!linhas.length) return alvo.append(el('tbody', {}, el('tr', {}, el('td', { class: 'vazio', text: 'Ainda sem dados neste período.' }))));
    alvo.append(el('thead', {}, el('tr', {}, ...cab.map((c, i) => el('th', { text: c, style: i ? 'text-align:right' : '' })))));
    alvo.append(el('tbody', {}, ...linhas.map((l) => el('tr', {}, ...l.map((c, i) => el('td', { class: i ? 'n' : '', text: c }))))));
  }

  function variacao(agora, antes) {
    if (!antes) return agora ? 'novo neste período' : 'sem comparação';
    const d = Math.round(((agora - antes) / antes) * 100);
    if (d === 0) return 'igual ao período anterior';
    return (d > 0 ? '▲ ' : '▼ ') + Math.abs(d) + '% vs. período anterior';
  }
  function tiles(t, a) {
    const lista = [
      ['Visitantes (aparelhos)', fmt.format(t.visitantes || 0), variacao(t.visitantes || 0, a.visitantes || 0)],
      ['Entradas', fmt.format(t.entradas || 0), variacao(t.entradas || 0, a.entradas || 0)],
      ['Páginas vistas', fmt.format(t.visualizacoes || 0), variacao(t.visualizacoes || 0, a.visualizacoes || 0)],
      ['Cliques', fmt.format(t.cliques || 0), variacao(t.cliques || 0, a.cliques || 0)],
      ['Cliques no WhatsApp', fmt.format(t.whatsapp || 0), variacao(t.whatsapp || 0, a.whatsapp || 0)],
      ['Conversão', pct(t.entradasConv || 0, t.entradas || 0), 'entradas com WhatsApp · antes ' + pct(a.entradasConv || 0, a.entradas || 0)],
      ['Voltaram', fmt.format(t.voltaram || 0), 'aparelhos com mais de uma entrada'],
      ['Atendimento aberto', fmt.format(t.assistente || 0), variacao(t.assistente || 0, a.assistente || 0)],
    ];
    $('tiles').replaceChildren(...lista.map(([r, v, x]) => el('div', { class: 'tile' }, el('span', { class: 'rot', text: r }), el('span', { class: 'val', text: v }), el('span', { class: 'var', text: x }))));
  }

  // ---- Gráficos (SVG) --------------------------------------------------------------------------
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const passo = (max) => {
    const bruto = max / 4;
    const p = Math.pow(10, Math.floor(Math.log10(bruto || 1)));
    return Math.max(1, [1, 2, 5, 10].find((x) => x * p >= bruto) * p);
  };
  const dataCurta = (d) => d.slice(8, 10) + '/' + d.slice(5, 7);
  const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  /** Linha por dia. `pontos`: { dia, real?, previsto?, min?, max?, linhas: [[rótulo, valor]] }. */
  function graficoLinha(caixa, pontos, rotuloAria) {
    caixa.replaceChildren();
    const W = 640, H = 220, E = 34, D = 8, T = 10, B = 26;
    const max = Math.max(...pontos.map((p) => Math.max(p.real ?? 0, p.max ?? 0, p.previsto ?? 0)), 1);
    const st = passo(max);
    const topo = Math.ceil(max / st) * st;
    const x = (i) => E + (pontos.length === 1 ? (W - E - D) / 2 : (i * (W - E - D)) / (pontos.length - 1));
    const y = (v) => T + (1 - v / topo) * (H - T - B);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': rotuloAria });
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
    const reais = pontos.map((p, i) => [i, p.real]).filter(([, v]) => v !== undefined);
    const prev = pontos.map((p, i) => [i, p.previsto, p.min, p.max]).filter(([, v]) => v !== undefined);
    if (prev.length) {
      const sup = prev.map(([i, , , mx]) => `${x(i)},${y(mx)}`);
      const inf = prev.map(([i, , mn]) => `${x(i)},${y(mn)}`).reverse();
      svg.append(svgEl('polygon', { points: [...sup, ...inf].join(' '), fill: 'rgb(0 227 154 / 0.10)' }));
      const ponte = reais.length ? [reais.at(-1)] : [];
      const d = [...ponte.map(([i, v]) => [i, v]), ...prev.map(([i, v]) => [i, v])].map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
      svg.append(svgEl('path', { d, fill: 'none', stroke: '#00e39a', 'stroke-width': 2, 'stroke-dasharray': '5 5', 'stroke-linecap': 'round' }));
    }
    if (reais.length) {
      const linha = reais.map(([i, v], k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
      const [i0] = reais[0];
      const [i1] = reais.at(-1);
      svg.append(svgEl('path', { d: `${linha}L${x(i1)},${y(0)}L${x(i0)},${y(0)}Z`, fill: 'rgb(0 227 154 / 0.12)' }));
      svg.append(svgEl('path', { d: linha, fill: 'none', stroke: '#00e39a', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    }
    const guia = svgEl('line', { y1: T, y2: H - B, stroke: 'rgb(242 238 230 / 0.35)', 'stroke-dasharray': '3 3', visibility: 'hidden' });
    const ponto = svgEl('circle', { r: 5, fill: '#00e39a', stroke: '#141e1b', 'stroke-width': 2, visibility: 'hidden' });
    svg.append(guia, ponto);
    const dica = el('div', { class: 'dica' });
    dica.hidden = true;
    caixa.append(svg, dica);
    const mostrar = (ev) => {
      const r = svg.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * W;
      let i = Math.round(((px - E) / (W - E - D)) * (pontos.length - 1));
      i = Math.max(0, Math.min(pontos.length - 1, i));
      const p = pontos[i];
      const v = p.real ?? p.previsto ?? 0;
      guia.setAttribute('x1', x(i));
      guia.setAttribute('x2', x(i));
      ponto.setAttribute('cx', x(i));
      ponto.setAttribute('cy', y(v));
      guia.setAttribute('visibility', 'visible');
      ponto.setAttribute('visibility', 'visible');
      dica.replaceChildren(el('div', { text: DIAS_SEMANA[new Date(p.dia + 'T12:00:00Z').getUTCDay()] + ', ' + dataCurta(p.dia) + (p.previsto !== undefined ? ' (previsão)' : '') }));
      for (const [rotulo, valor] of p.linhas) dica.append(el('div', {}, rotulo + ': ', el('b', { text: valor })));
      dica.hidden = false;
      dica.style.left = Math.min(Math.max((x(i) / W) * r.width, 80), r.width - 80) + 'px';
      dica.style.top = (y(v) / H) * r.height + 'px';
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

  function graficoHoras(caixa, horas) {
    caixa.replaceChildren();
    const valores = Array.from({ length: 24 }, (_, h) => horas.find((x) => x.hora === h)?.total ?? 0);
    const W = 640, H = 180, E = 8, D = 8, T = 10, B = 22;
    const max = Math.max(...valores, 1);
    const larg = (W - E - D) / 24;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Páginas vistas por hora do dia' });
    svg.append(svgEl('line', { x1: E, x2: W - D, y1: H - B, y2: H - B, stroke: 'rgb(242 238 230 / 0.12)' }));
    const dica = el('div', { class: 'dica' });
    dica.hidden = true;
    valores.forEach((v, h) => {
      const alt = (v / max) * (H - T - B);
      const bx = E + h * larg + 2;
      const bw = larg - 4;
      const by = H - B - alt;
      const r = Math.min(4, bw / 2, alt);
      if (alt > 0) svg.append(svgEl('path', { d: `M${bx},${H - B}V${by + r}Q${bx},${by} ${bx + r},${by}H${bx + bw - r}Q${bx + bw},${by} ${bx + bw},${by + r}V${H - B}Z`, fill: '#00c487' }));
      const alvo = svgEl('rect', { x: E + h * larg, y: T, width: larg, height: H - T - B, fill: 'transparent' });
      alvo.addEventListener('pointerenter', () => {
        const rr = svg.getBoundingClientRect();
        dica.replaceChildren(el('div', { text: h + 'h às ' + (h + 1) + 'h' }), el('div', {}, 'Páginas vistas: ', el('b', { text: fmt.format(v) })));
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

  // ---- Estado da tela -----------------------------------------------------------------------
  const params = new URLSearchParams(location.search);
  let periodo = params.get('periodo') || '30';
  let aba = params.get('aba') || 'resumo';
  let filtroAp = 'todos';
  let aparelhosLista = [];
  const br = (s) => s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4);
  const faixa = (p) => ($('faixa').textContent = p.de === p.ate ? 'Dia ' + br(p.de) : 'De ' + br(p.de) + ' a ' + br(p.ate));

  async function carregarResumo() {
    const d = await api('/api/dados?periodo=' + encodeURIComponent(periodo));
    faixa(d.periodo);
    $('agora').textContent = fmt.format(d.agora);
    tiles(d.totais || {}, d.antes || {});
    const mapa = new Map(d.porDia.map((p) => [p.dia, p]));
    const dias = [];
    for (let t = Date.parse(d.periodo.de); t <= Date.parse(d.periodo.ate); t += 86400000) {
      const dia = new Date(t).toISOString().slice(0, 10);
      const p = mapa.get(dia) || { visitantes: 0, entradas: 0, visualizacoes: 0, whatsapp: 0 };
      dias.push({ dia, real: p.visitantes, linhas: [['Visitantes', fmt.format(p.visitantes)], ['Entradas', fmt.format(p.entradas)], ['Páginas vistas', fmt.format(p.visualizacoes)], ['WhatsApp', fmt.format(p.whatsapp)]] });
    }
    $('c-dias').hidden = dias.length < 2;
    if (dias.length >= 2) graficoLinha($('g-dias'), dias, 'Visitantes por dia');
    const aparelhosTxt = (l) => plural(l.pessoas, 'aparelho', 'aparelhos');
    barras($('l-cliques'), d.cliques, { nome: nomeClique, extra: aparelhosTxt });
    barras($('l-origens'), d.origens);
    barras($('l-albuns'), d.albuns, { nome: (l) => bonito(l.nome), extra: aparelhosTxt });
    barras($('l-paginas'), d.paginas, { nome: (l) => nomePagina(l.nome), extra: aparelhosTxt });
    barras($('l-cidades'), d.cidades);
    graficoHoras($('g-horas'), d.horas);
    barras($('l-assistente'), d.assistente, { nome: (l) => (NOMES_ASSIST[l.nome] || l.nome) + (l.rotulo ? ': ' + rot(l.rotulo) : '') });
    barras($('l-aparelhos'), d.aparelhos);
    barras($('l-sistemas'), d.sistemas);
    barras($('l-navegadores'), d.navegadores);
    $('c-campanhas').hidden = !d.campanhas.length;
    barras($('l-campanhas'), d.campanhas);
  }

  // Ao vivo
  let vistos = new Set();
  let primeiraVez = true;
  async function carregarAoVivo() {
    const d = await api('/api/aovivo');
    $('agora').textContent = fmt.format(d.ativos.length);
    $('faixa').textContent = 'Ao vivo · atualizado ' + hora(d.agora);
    const ativos = $('ativos');
    ativos.replaceChildren(
      ...(d.ativos.length
        ? d.ativos.map((a) => {
            const b = el('button', { class: 'ativo', type: 'button' }, el('strong', { text: codigo(a.visitante) }), el('span', { text: [a.aparelho, a.sistema, a.cidade].filter(Boolean).join(' · ') }), el('span', { text: 'em ' + nomePagina(a.pagina || '/') + ' · ' + quando(a.ultimo) }));
            b.addEventListener('click', () => abrirAparelho(a.visitante));
            return b;
          })
        : [el('p', { class: 'vazio', text: 'Ninguém no site nos últimos 5 minutos.' })]),
    );
    const feed = $('feed');
    feed.replaceChildren(
      ...(d.eventos.length
        ? d.eventos.map((e) => {
            const chave = e.ts + e.visitante + e.nome + e.caminho;
            const btn = el('button', { type: 'button', text: codigo(e.visitante) });
            btn.addEventListener('click', () => abrirAparelho(e.visitante));
            const li = el(
              'li',
              { class: !primeiraVez && !vistos.has(chave) ? 'novo' : '' },
              el('time', { text: quando(e.ts) }),
              el('div', {}, el('span', { class: e.tipo === 'clique' && e.nome === 'whatsapp' ? 'marca-whats' : '', text: descrever(e) }), el('span', { class: 'quem' }, btn, ' · ' + [e.aparelho, e.sistema, e.cidade].filter(Boolean).join(' · ') + (e.novo ? ' · primeira vez' : ''))),
            );
            return li;
          })
        : [el('li', { class: 'vazio', text: 'Ainda sem eventos.' })]),
    );
    vistos = new Set(d.eventos.map((e) => e.ts + e.visitante + e.nome + e.caminho));
    primeiraVez = false;
  }

  // Aparelhos
  async function carregarAparelhos() {
    const d = await api('/api/aparelhos?periodo=' + encodeURIComponent(periodo));
    faixa(d.periodo);
    aparelhosLista = d.lista;
    desenharAparelhos();
  }
  function desenharAparelhos() {
    const lista = aparelhosLista.filter((a) =>
      filtroAp === 'conv' ? a.whatsapp > 0 : filtroAp === 'quente' ? a.entradas > 1 && !a.whatsapp : filtroAp === 'uma' ? a.entradas === 1 : true,
    );
    const alvo = $('l-ap');
    alvo.replaceChildren();
    if (!lista.length) return alvo.append(el('li', { class: 'vazio', text: 'Nenhum aparelho neste filtro.' }));
    for (const a of lista) {
      const selos = el('div', {});
      if (a.novo) selos.append(el('span', { class: 'selo', text: 'Novo' }));
      if (a.whatsapp) selos.append(el('span', { class: 'selo conv', text: 'Chamou no WhatsApp' }));
      else if (a.entradas > 1) selos.append(el('span', { class: 'selo quente', text: 'Voltou sem chamar' }));
      const b = el(
        'button',
        { type: 'button' },
        el('div', { class: 'ap-topo' }, el('strong', { text: codigo(a.visitante) }), el('span', { text: 'última vez ' + quando(a.ultimo) })),
        el('div', { class: 'ap-info', text: [a.aparelho, a.sistema, a.navegador, a.cidade].filter(Boolean).join(' · ') + (a.origem ? ' · ' + veioDe(a.origem) : '') }),
        el(
          'div',
          { class: 'ap-num' },
          el('span', {}, el('b', { text: fmt.format(a.entradas) }), a.entradas === 1 ? ' entrada' : ' entradas'),
          el('span', {}, el('b', { text: fmt.format(a.paginas) }), a.paginas === 1 ? ' página' : ' páginas'),
          el('span', {}, el('b', { text: fmt.format(a.cliques) }), a.cliques === 1 ? ' clique' : ' cliques'),
          el('span', {}, el('b', { text: fmt.format(a.whatsapp) }), ' no WhatsApp'),
          el('span', { text: 'desde ' + dataHora(a.primeiro) }),
        ),
        selos.childNodes.length ? selos : null,
      );
      b.addEventListener('click', () => abrirAparelho(a.visitante));
      alvo.append(el('li', {}, b));
    }
  }
  async function abrirAparelho(id) {
    const dlg = $('dlg-ap');
    $('dlg-ap-titulo').textContent = codigo(id);
    const corpo = $('dlg-ap-corpo');
    corpo.replaceChildren(el('p', { class: 'vazio', text: 'Carregando...' }));
    if (!dlg.open) dlg.showModal();
    const d = await api('/api/aparelho?id=' + encodeURIComponent(id));
    const ev = d.eventos;
    corpo.replaceChildren();
    if (!ev.length) return corpo.append(el('p', { class: 'vazio', text: 'Sem eventos.' }));
    const sessoes = new Map();
    for (const e of ev) {
      if (!sessoes.has(e.sessao)) sessoes.set(e.sessao, []);
      sessoes.get(e.sessao).push(e);
    }
    const u = ev[0];
    const cliques = ev.filter((e) => e.tipo === 'clique').length;
    const whats = ev.filter((e) => e.tipo === 'clique' && e.nome === 'whatsapp').length;
    corpo.append(
      el('p', { class: 'ap-info', text: [u.aparelho, u.sistema, u.navegador, u.cidade].filter(Boolean).join(' · ') }),
      el(
        'div',
        { class: 'ap-num' },
        el('span', {}, el('b', { text: fmt.format(sessoes.size) }), sessoes.size === 1 ? ' entrada' : ' entradas'),
        el('span', {}, el('b', { text: fmt.format(ev.filter((e) => e.tipo === 'ver').length) }), ' páginas'),
        el('span', {}, el('b', { text: fmt.format(cliques) }), cliques === 1 ? ' clique' : ' cliques'),
        el('span', {}, el('b', { text: fmt.format(whats) }), ' no WhatsApp'),
      ),
    );
    let n = sessoes.size;
    for (const [, lista] of sessoes) {
      const ordem = [...lista].reverse();
      corpo.append(
        el(
          'section',
          { class: 'sessao' },
          el('h3', { text: 'Entrada ' + n-- + ' · ' + dataHora(ordem[0].ts) }),
          el('ol', { class: 'feed' }, ...ordem.map((e) => el('li', {}, el('time', { text: hora(e.ts) }), el('div', {}, el('span', { class: e.tipo === 'clique' && e.nome === 'whatsapp' ? 'marca-whats' : '', text: descrever(e) }))))),
        ),
      );
    }
  }

  // Análise
  async function carregarAnalise() {
    const d = await api('/api/analise?periodo=' + encodeURIComponent(periodo));
    faixa(d.periodo);
    const lei = $('leitura');
    lei.replaceChildren(...d.leitura.map((l) => el('li', { class: l.tipo }, el('strong', { text: l.titulo }), l.texto)));
    const p = d.previsao;
    const num = $('prev-num');
    num.replaceChildren();
    if (p && p.suficiente) {
      $('prev-sub').textContent = 'Visitantes por dia: últimos 30 dias e os próximos 7. Baseada em ' + p.dias + ' dias completos' + (p.provisoria ? ' (ainda provisória).' : '.');
      for (const [r, b] of [['Próximos 7 dias', p.proximos7], ['Próximos 30 dias', p.proximos30]])
        num.append(el('div', {}, el('span', { text: r }), el('b', { text: fmt.format(b.visitantes) + ' visitantes' }), el('span', { text: 'entre ' + fmt.format(b.min) + ' e ' + fmt.format(b.max) + ' · ' + fmt.format(b.whatsapp) + ' no WhatsApp' })));
    } else {
      $('prev-sub').textContent = (p && p.aviso) || 'Sem dados suficientes.';
    }
    const serie = (p && p.serie) || [];
    if (serie.length >= 2)
      graficoLinha(
        $('g-prev'),
        serie.map((s) => ({
          ...s,
          linhas: s.real !== undefined ? [['Visitantes', fmt.format(s.real)]] : [['Previsto', fmt.format(Math.round(s.previsto))], ['Faixa', fmt.format(Math.round(s.min)) + ' a ' + fmt.format(Math.round(s.max))]],
        })),
        'Visitantes por dia e previsão',
      );
    else $('g-prev').replaceChildren();
    tabela($('t-areas'), ['Área', 'Entradas', 'WhatsApp', 'Conversão'], d.areas.filter((x) => CAPITULOS[x.nome]).map((x) => [CAPITULOS[x.nome], fmt.format(x.entradas), fmt.format(x.converteram), pct(x.converteram, x.entradas)]));
    tabela($('t-origens'), ['Origem', 'Entradas', 'WhatsApp', 'Conversão'], d.origens.map((x) => [x.nome, fmt.format(x.entradas), fmt.format(x.converteram), pct(x.converteram, x.entradas)]));
    tabela($('t-albuns'), ['Álbum', 'Entradas', 'WhatsApp', 'Conversão'], d.albuns.map((x) => [bonito(x.nome), fmt.format(x.entradas), fmt.format(x.converteram), pct(x.converteram, x.entradas)]));
    tabela($('t-fluxos'), ['Caminho', 'Entradas', 'WhatsApp'], d.fluxos.map((x) => [nomeFluxo(x.fluxo), fmt.format(x.entradas), fmt.format(x.converteram)]));
  }

  // ---- Abas, período, atualização ------------------------------------------------------------
  const CARREGAR = { resumo: carregarResumo, aovivo: carregarAoVivo, aparelhos: carregarAparelhos, analise: carregarAnalise };
  function atualizarUrl() {
    history.replaceState(null, '', '?aba=' + aba + '&periodo=' + periodo);
    $('baixar').href = '/api/resumo.md?periodo=' + encodeURIComponent(periodo);
  }
  async function mostrar() {
    document.querySelectorAll('[role=tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.aba === aba)));
    document.querySelectorAll('[data-painel]').forEach((s) => (s.hidden = s.dataset.painel !== aba));
    document.querySelectorAll('#periodos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === periodo)));
    $('periodos').hidden = aba === 'aovivo';
    atualizarUrl();
    try {
      await CARREGAR[aba]();
    } catch (e) {
      if (e.message !== 'sessão') $('faixa').textContent = 'Não foi possível carregar. Tentando de novo em instantes.';
    }
  }
  document.querySelectorAll('[role=tab]').forEach((b) =>
    b.addEventListener('click', () => {
      aba = b.dataset.aba;
      mostrar();
    }),
  );
  document.querySelectorAll('#periodos button').forEach((b) =>
    b.addEventListener('click', () => {
      periodo = b.dataset.p;
      mostrar();
    }),
  );
  document.querySelectorAll('#filtros-ap button').forEach((b) =>
    b.addEventListener('click', () => {
      filtroAp = b.dataset.f;
      document.querySelectorAll('#filtros-ap button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      desenharAparelhos();
    }),
  );
  document.querySelectorAll('dialog [data-fechar]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach((d) => d.addEventListener('click', (ev) => ev.target === d && d.close()));

  // Limpar todos os dados
  $('limpar').addEventListener('click', () => {
    $('form-limpar').reset();
    $('limpar-erro').hidden = true;
    $('dlg-limpar').showModal();
  });
  $('form-limpar').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const conf = ev.target.confirmar.value.trim().toUpperCase();
    const erro = $('limpar-erro');
    if (conf !== 'LIMPAR') {
      erro.hidden = false;
      erro.textContent = 'Escreva LIMPAR para confirmar.';
      return;
    }
    const r = await fetch('/api/limpar', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirmar: 'LIMPAR' }) });
    if (!r.ok) {
      erro.hidden = false;
      erro.textContent = 'Não foi possível limpar. Tente de novo.';
      return;
    }
    $('dlg-limpar').close();
    $('faixa').textContent = 'Dados apagados. O painel começou do zero.';
    mostrar();
  });

  mostrar();
  // Ao vivo: a cada 5 s com a aba aberta; o contador "agora" e as outras abas, a cada 60 s.
  setInterval(() => {
    if (document.visibilityState === 'visible' && aba === 'aovivo' && !$('dlg-ap').open) carregarAoVivo().catch(() => {});
  }, 5000);
  setInterval(() => {
    if (document.visibilityState !== 'visible' || aba === 'aovivo' || document.querySelector('dialog[open]')) return;
    CARREGAR[aba]().catch(() => {});
  }, 60000);
}

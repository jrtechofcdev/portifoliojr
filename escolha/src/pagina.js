// A página que a modelo abre no celular. Tudo num arquivo só: HTML, estilo e script.
// Visual do portfólio: couro escuro, papel creme nas explicações, verde da marca nos botões marcados.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const WHATSAPP = '5599982785958';

const SIMBOLO = '<svg class="simbolo" viewBox="44 34 412 432" width="26" height="26" aria-hidden="true"><defs><linearGradient id="sg" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="380" y2="470"><stop offset="0" stop-color="#00FCA8"/><stop offset="1" stop-color="#22D8FF"/></linearGradient></defs><g fill="url(#sg)"><path d="M158 40h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H106a10 10 0 0 1-9.6-12.8l52-174A10 10 0 0 1 158 40Z"/><path d="M350 125h94a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2h-94a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 350 125Z"/><path d="M90 265h96a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2H63a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 90 265Z"/><path d="M225 265h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H173a10 10 0 0 1-9.6-12.8l52-174a10 10 0 0 1 9.6-7.2Z"/></g></svg>';
const PORTFOLIO = 'https://portifolio.jrtechofc.com.br';

export function pagina({ nome, limite, prefixo = '' }) {
  const n = esc(nome);
  // Pela Vercel (/escolha/...) a página está dentro do portfólio: links relativos. Direto no Worker, endereço completo.
  const inicio = prefixo ? '/' : PORTFOLIO + '/';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#121b18">
<title>Escolha das fotos · ${n} | Jr_Tech_OFC Fotografia</title>
<link rel="icon" href="${inicio}favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="${inicio}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;650&family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&display=swap" rel="stylesheet">
<style>
:root {
  --couro: #121b18; --painel: #1a2723; --fundo: #0b110f; --papel: #f2eee6; --creme: #efe6d6; --tinta: #3b352d;
  --verde: #00fca8; --verde-escuro: #007a55; --ciano: #22d8ff; --vermelho: #ff8a7a;
  --costura: rgb(0 252 168 / .5); --linha: rgb(242 238 230 / .14);
  --serifa: 'Fraunces', Georgia, serif; --fonte: 'Archivo', system-ui, sans-serif;
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--couro); color: var(--papel); font: 16px/1.5 var(--fonte); padding-bottom: calc(96px + env(safe-area-inset-bottom)); }
img { display: block; max-width: 100%; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--verde); outline-offset: 2px; }
.wrap { width: min(1100px, 100%); margin: 0 auto; padding: 0 16px; }

.cab { border-bottom: 1px solid var(--linha); background: var(--fundo); }
.cab .wrap { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 60px; }
.marca { display: inline-flex; align-items: center; gap: 10px; color: var(--papel); text-decoration: none; font: 500 19px/1 var(--serifa); }
.voltar { color: rgb(242 238 230 / .8); font-size: 14px; text-decoration: underline; text-underline-offset: 3px; }
.topo { padding-top: 28px; padding-bottom: 20px; }
.sobre { margin: 0 0 12px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--verde); }
h1 { margin: 0; font: 500 clamp(30px, 8vw, 46px)/1.08 var(--serifa); letter-spacing: -.01em; }
h1 em { font-style: italic; font-weight: 400; color: var(--verde); }
.ensaio { margin: 10px 0 0; color: rgb(242 238 230 / .8); }

.papel { background: var(--creme); color: var(--tinta); border-radius: 18px; padding: 20px 18px 22px; box-shadow: 0 18px 40px -24px #000; }
.papel h2 { margin: 0 0 6px; font: 500 24px/1.2 var(--serifa); color: #1d1a16; }
.papel p { margin: 0 0 12px; }
details.papel > summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
details.papel > summary::-webkit-details-marker { display: none; }
details.papel > summary::after { content: 'Mostrar'; font-size: 14px; color: var(--verde-escuro); font-weight: 650; }
details.papel[open] > summary::after { content: 'Esconder'; }
.tipos { display: grid; gap: 16px; margin: 16px 0; padding: 0; list-style: none; }
.tipo { display: grid; gap: 10px; padding: 14px; border: 1.5px dashed rgb(59 53 45 / .3); border-radius: 14px; }
.tipo h3 { margin: 0; display: flex; align-items: center; gap: 10px; font: 650 18px/1.2 var(--fonte); color: #1d1a16; }
.tipo p { margin: 0; }
.ic { flex: none; display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 999px; font-size: 16px; font-weight: 700; }
.ic-destaque { background: linear-gradient(100deg, var(--verde), var(--ciano)); color: #0d1512; }
.ic-album { background: #1d2a26; color: var(--verde); }
.ic-nao { background: #e2d5c0; color: #8a2f22; border: 1.5px solid #c9b79b; }
.prints { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 0; }
.prints figure { margin: 0; }
.prints img { width: 100%; border-radius: 10px; border: 1px solid rgb(0 0 0 / .15); background: #0b110f; }
.prints figcaption { margin-top: 6px; font-size: 13px; line-height: 1.35; color: #5c5449; }
.nota { font-size: 15px; color: #5c5449; }
.entendi { width: 100%; min-height: 52px; border: 0; border-radius: 999px; background: var(--couro); color: var(--papel); font-weight: 650; cursor: pointer; }

.filtros { position: sticky; top: 0; z-index: 5; display: flex; gap: 8px; overflow-x: auto; padding: 12px 16px; margin: 20px -16px 0; background: rgb(18 27 24 / .94); backdrop-filter: blur(8px); scrollbar-width: none; }
.filtros::-webkit-scrollbar { display: none; }
.filtros button { flex: none; min-height: 40px; padding: 0 14px; border: 1.5px dashed var(--costura); border-radius: 999px; background: transparent; cursor: pointer; white-space: nowrap; font-size: 14px; }
.filtros button[aria-pressed="true"] { background: var(--papel); color: #121b18; border-style: solid; border-color: var(--papel); font-weight: 650; }

.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(46%, 220px), 1fr)); gap: 14px 10px; margin: 14px 0 0; padding: 0; list-style: none; }
.foto { display: grid; gap: 6px; }
.foto-ver { position: relative; padding: 0; border: 0; border-radius: 12px; overflow: hidden; background: var(--fundo); cursor: zoom-in; aspect-ratio: 4 / 5; outline-offset: 3px; }
.foto-ver img { width: 100%; height: 100%; object-fit: cover; }
.foto[data-estado="destaque"] .foto-ver { box-shadow: 0 0 0 3px var(--verde); }
.foto[data-estado="album"] .foto-ver { box-shadow: 0 0 0 2px rgb(242 238 230 / .7); }
.foto[data-estado="nao"] .foto-ver img { opacity: .35; filter: grayscale(1); }
.selo { position: absolute; left: 8px; top: 8px; padding: 3px 9px; border-radius: 999px; font-size: 12px; font-weight: 650; background: rgb(11 17 15 / .82); color: var(--papel); }
.foto[data-estado="destaque"] .selo { background: linear-gradient(100deg, var(--verde), var(--ciano)); color: #0d1512; }
.foto[data-estado="nao"] .selo { background: #3a1d18; color: #ffd2c9; }
.num { position: absolute; right: 8px; bottom: 8px; font-size: 12px; color: rgb(242 238 230 / .85); text-shadow: 0 1px 3px #000; }
.marcas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.marcas button { display: grid; justify-items: center; gap: 1px; min-height: 48px; padding: 4px 2px; border: 1px solid var(--linha); border-radius: 10px; background: var(--painel); cursor: pointer; font-size: 11.5px; line-height: 1.15; }
.marcas button b { font-size: 16px; line-height: 1.1; }
.marcas [data-m="destaque"][aria-pressed="true"] { background: linear-gradient(100deg, var(--verde), var(--ciano)); color: #0d1512; border-color: transparent; font-weight: 650; }
.marcas [data-m="album"][aria-pressed="true"] { background: var(--papel); color: #121b18; border-color: var(--papel); font-weight: 650; }
.marcas [data-m="nao"][aria-pressed="true"] { background: #5a2219; color: #ffe1da; border-color: #8a3a2c; font-weight: 650; }
.vazio { padding: 40px 0; text-align: center; color: rgb(242 238 230 / .7); }

.barra { position: fixed; inset: auto 0 0 0; z-index: 10; padding: 10px 16px calc(10px + env(safe-area-inset-bottom)); background: rgb(11 17 15 / .96); border-top: 1px solid var(--linha); backdrop-filter: blur(8px); }
.barra .wrap { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0; }
.resumo { margin: 0; font-size: 13.5px; line-height: 1.35; color: rgb(242 238 230 / .85); }
.resumo strong { color: var(--papel); }
.terminei { flex: none; min-height: 48px; padding: 0 20px; border: 0; border-radius: 999px; background: linear-gradient(100deg, var(--verde), var(--ciano)); color: #0d1512; font-weight: 650; cursor: pointer; }

dialog { border: 0; padding: 0; color: var(--papel); background: transparent; }
dialog::backdrop { background: rgb(5 8 7 / .94); }
.ver { width: 100%; max-width: 100%; height: 100%; max-height: 100%; margin: 0; background: #050807; }
.ver[open] { display: grid; grid-template-rows: auto 1fr auto; }
.ver-topo { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; padding-top: calc(10px + env(safe-area-inset-top)); }
.ver-topo button, .ver-nav button { min-height: 44px; padding: 0 14px; border: 1px solid var(--linha); border-radius: 999px; background: rgb(26 39 35 / .9); cursor: pointer; }
.ver-foto { min-height: 0; display: grid; place-items: center; padding: 0 8px; touch-action: pan-y; }
.ver-foto img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px; }
.ver-baixo { display: grid; gap: 10px; padding: 12px 16px calc(14px + env(safe-area-inset-bottom)); width: min(560px, 100%); margin: 0 auto; }
.ver-baixo .marcas button { min-height: 54px; font-size: 13px; }
.ver-nav { display: flex; justify-content: space-between; }

.fim { width: min(440px, calc(100% - 32px)); margin: auto; }
.fim .papel { text-align: left; }
.fim .acoes { display: grid; gap: 10px; margin-top: 16px; }
.fim a, .fim button { display: grid; place-items: center; min-height: 50px; border-radius: 999px; font-weight: 650; text-decoration: none; cursor: pointer; }
.fim a { background: var(--couro); color: var(--papel); }
.fim button { border: 1.5px solid rgb(59 53 45 / .35); background: transparent; color: var(--tinta); }

.aviso { position: fixed; left: 50%; bottom: calc(86px + env(safe-area-inset-bottom)); z-index: 20; transform: translateX(-50%); width: max-content; max-width: calc(100% - 32px); padding: 10px 16px; border-radius: 12px; background: var(--papel); color: #121b18; font-size: 14px; box-shadow: 0 10px 30px -10px #000; }
.aviso[hidden] { display: none; }
.carregando { padding: 40px 0; color: rgb(242 238 230 / .7); }
@media (prefers-reduced-motion: no-preference) { .foto-ver img { transition: opacity .2s; } }
</style>
</head>
<body>
<header class="cab"><div class="wrap">
  <a class="marca" href="${inicio}">${SIMBOLO}Jr_Tech_OFC</a>
  <a class="voltar" href="${inicio}">Ver o portfólio</a>
</div></header>
<header class="topo wrap">
  <p class="sobre">Curadoria do seu álbum</p>
  <h1>Escolha as fotos do <em>seu álbum</em></h1>
  <p class="ensaio">${n}</p>
</header>

<main class="wrap">
  <details class="papel" data-explica open>
    <summary><h2>Como funciona</h2></summary>
    <p>Aqui estão todas as fotos do seu ensaio, inclusive as que ainda não estão no portfólio. Você escolhe o que entra no seu álbum. Embaixo de cada foto há três botões:</p>
    <ul class="tipos">
      <li class="tipo">
        <h3><span class="ic ic-destaque" aria-hidden="true">★</span> Destaque</h3>
        <p>As preferidas, que abrem o seu álbum. Elas aparecem primeiro nos Stories: na bolinha "Em destaque" da página inicial do portfólio e no botão de play do cartão do seu álbum. Toda foto de destaque já entra no álbum sozinha. Escolha até ${limite}, na ordem em que quer que apareçam.</p>
        <div class="prints">
          <figure><img src="${prefixo}/explica/destaques.webp" alt="Página inicial do portfólio com a fileira de bolinhas Em destaque" loading="lazy" width="412" height="520"><figcaption>A bolinha "Em destaque" na página inicial.</figcaption></figure>
          <figure><img src="${prefixo}/explica/stories.webp" alt="Stories abertos em tela cheia, mostrando a primeira foto de um álbum" loading="lazy" width="412" height="733"><figcaption>Ao tocar, abrem os Stories com os destaques.</figcaption></figure>
        </div>
      </li>
      <li class="tipo">
        <h3><span class="ic ic-album" aria-hidden="true">✓</span> Álbum</h3>
        <p>A foto entra na página do seu álbum no portfólio. Nem toda foto do álbum precisa ser destaque. Qualquer pessoa que abrir o portfólio pode ver.</p>
        <div class="prints">
          <figure><img src="${prefixo}/explica/album.webp" alt="Página de um álbum no portfólio, com as fotos em grade" loading="lazy" width="412" height="733"><figcaption>A página do álbum, com todas as fotos escolhidas.</figcaption></figure>
        </div>
      </li>
      <li class="tipo">
        <h3><span class="ic ic-nao" aria-hidden="true">✕</span> Não quero</h3>
        <p>A foto não aparece em lugar nenhum do portfólio.</p>
      </li>
    </ul>
    <p class="nota">As fotos que já estão no portfólio vêm marcadas como Álbum. Pode trocar à vontade. Foto sem marca fica para o José Renato decidir. Depois que você terminar, ele monta a versão final do seu álbum no portfólio com a sua escolha.</p>
    <p class="nota">Cada toque fica salvo na hora. Pode fechar e continuar depois pelo mesmo link. Para ver uma foto inteira, toque nela.</p>
    <button type="button" class="entendi" data-entendi>Entendi, mostrar as fotos</button>
  </details>

  <nav class="filtros" aria-label="Mostrar" data-filtros></nav>
  <p class="carregando" data-carregando>Carregando as fotos…</p>
  <ul class="grade" data-grade></ul>
  <p class="vazio" data-vazio hidden>Nenhuma foto aqui.</p>
</main>

<div class="barra">
  <div class="wrap">
    <p class="resumo" data-resumo aria-live="polite"></p>
    <button type="button" class="terminei" data-terminei>Terminei</button>
  </div>
</div>

<dialog class="ver" data-ver aria-label="Foto em tamanho maior">
  <div class="ver-topo"><span data-ver-num></span><button type="button" data-fechar>Fechar</button></div>
  <div class="ver-foto" data-ver-foto><img alt="" data-ver-img></div>
  <div class="ver-baixo">
    <div class="marcas" data-ver-marcas></div>
    <div class="ver-nav"><button type="button" data-ant>← Anterior</button><button type="button" data-prox>Próxima →</button></div>
  </div>
</dialog>

<dialog class="fim" data-fim aria-labelledby="fim-titulo">
  <div class="papel">
    <h2 id="fim-titulo">Obrigado!</h2>
    <p data-fim-texto></p>
    <p class="nota">Se mudar de ideia, é só voltar a este link e trocar as marcas.</p>
    <div class="acoes">
      <a data-fim-whats target="_blank" rel="noopener">Avisar o José Renato no WhatsApp</a>
      <button type="button" data-fim-fechar>Voltar às fotos</button>
    </div>
  </div>
</dialog>

<p class="aviso" data-aviso role="status" hidden></p>

<script>
(() => {
  const NOME = ${JSON.stringify(String(nome))};
  const base = location.pathname.replace(/\\/+$/, '');
  const $ = (s) => document.querySelector(s);
  const ROTULO = { destaque: 'Destaque', album: 'Álbum', nao: 'Não quero' };
  const ICONE = { destaque: '★', album: '✓', nao: '✕' };
  let fotos = [], estados = [], limite = ${Number(limite)}, filtro = 'todas', aberta = -1;

  const aviso = $('[data-aviso]');
  let avisoTempo;
  function avisar(t) {
    aviso.textContent = t;
    aviso.hidden = false;
    clearTimeout(avisoTempo);
    avisoTempo = setTimeout(() => (aviso.hidden = true), 3200);
  }

  const lembrar = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const lido = (k) => { try { return localStorage.getItem(k); } catch { return null; } };

  const explica = $('[data-explica]');
  if (lido('escolha-entendi:' + base)) explica.open = false;
  $('[data-entendi]').addEventListener('click', () => {
    explica.open = false;
    lembrar('escolha-entendi:' + base, '1');
    $('[data-filtros]').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const conta = (e) => estados.filter((x) => x[0] === e).length;
  const noAlbum = (i) => estados[i][0] === 'album' || estados[i][0] === 'destaque';
  const visiveis = () => fotos.map((_, i) => i).filter((i) => filtro === 'todas' || (filtro === 'sem' ? !estados[i][0] : filtro === 'album' ? noAlbum(i) : estados[i][0] === filtro));
  const ordemDestaque = (i) => estados.map((x, j) => [x, j]).filter(([x]) => x[0] === 'destaque').sort((a, b) => a[0][1] - b[0][1]).findIndex(([, j]) => j === i) + 1;

  function botoes(i) {
    const e = estados[i][0];
    const ligado = { destaque: e === 'destaque', album: e === 'album' || e === 'destaque', nao: e === 'nao' };
    return ['destaque', 'album', 'nao'].map((m) => '<button type="button" data-m="' + m + '" aria-pressed="' + ligado[m] + '" aria-label="' + ROTULO[m] + ', foto ' + (i + 1) + '"><b aria-hidden="true">' + ICONE[m] + '</b>' + ROTULO[m] + '</button>').join('');
  }

  function selo(i) {
    const e = estados[i][0];
    if (!e) return '';
    return '<span class="selo">' + (e === 'destaque' ? '★ Destaque ' + ordemDestaque(i) + ' · Álbum' : ROTULO[e]) + '</span>';
  }

  function desenharFiltros() {
    const itens = [['todas', 'Todas', fotos.length], ['destaque', '★ Destaque', conta('destaque') + ' de ' + limite], ['album', '✓ Álbum', conta('album') + conta('destaque')], ['nao', '✕ Não quero', conta('nao')], ['sem', 'Sem marca', estados.filter((x) => !x[0]).length]];
    $('[data-filtros]').innerHTML = itens.map(([k, t, c]) => '<button type="button" data-filtro="' + k + '" aria-pressed="' + (filtro === k) + '">' + t + ' (' + c + ')</button>').join('');
    const d = conta('destaque'), a = conta('album'), n = conta('nao');
    $('[data-resumo]').innerHTML = '<strong>' + (d + a) + ' no álbum</strong>, sendo ' + d + ' em destaque<br>' + n + ' não quero · ' + estados.filter((x) => !x[0]).length + ' sem marca';
  }

  function cartao(i) {
    const li = document.createElement('li');
    li.className = 'foto';
    li.dataset.n = i;
    li.dataset.estado = estados[i][0];
    li.innerHTML = '<button type="button" class="foto-ver" aria-label="Ver a foto ' + (i + 1) + ' inteira"><img loading="lazy" decoding="async" alt="" width="' + fotos[i][0] + '" height="' + fotos[i][1] + '">' + selo(i) + '<span class="num">' + (i + 1) + '</span></button><div class="marcas">' + botoes(i) + '</div>';
    li.querySelector('img').src = base + '/f/' + i;
    return li;
  }

  function desenharGrade() {
    const lista = visiveis();
    $('[data-grade]').replaceChildren(...lista.map(cartao));
    $('[data-vazio]').hidden = lista.length > 0;
  }

  function atualizarCartao(i) {
    const li = $('[data-grade]').querySelector('[data-n="' + i + '"]');
    if (!li) return;
    li.dataset.estado = estados[i][0];
    li.querySelector('.marcas').innerHTML = botoes(i);
    li.querySelector('.selo')?.remove();
    li.querySelector('.foto-ver').insertAdjacentHTML('beforeend', selo(i));
  }

  function redesenharSelos() {
    estados.forEach((x, i) => x[0] === 'destaque' && atualizarCartao(i));
  }

  async function marcar(i, m) {
    const antes = estados[i];
    // Destaque já está no álbum. Tirar o destaque deixa a foto no álbum; tirar do álbum tira também o destaque.
    const e = antes[0];
    const novo = m === 'destaque' ? (e === 'destaque' ? 'album' : 'destaque') : m === 'album' ? (e === 'album' || e === 'destaque' ? '' : 'album') : e === 'nao' ? '' : 'nao';
    if (novo === 'destaque' && conta('destaque') >= limite) return avisar('Já são ' + limite + ' destaques. Tire um antes de escolher outro.');
    estados[i] = [novo, Date.now()];
    atualizarCartao(i);
    redesenharSelos();
    desenharFiltros();
    if (aberta === i) atualizarVer();
    try {
      const r = await fetch(base + '/marcar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ n: i, estado: novo }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro === 'limite' ? 'Já são ' + limite + ' destaques.' : 'Não salvou.');
      estados[i] = [d.estado, d.quando];
    } catch (e) {
      estados[i] = antes;
      atualizarCartao(i);
      redesenharSelos();
      desenharFiltros();
      if (aberta === i) atualizarVer();
      avisar((e.message || 'Não salvou.') + ' Confira a internet e toque de novo.');
    }
  }

  $('[data-grade]').addEventListener('click', (ev) => {
    const li = ev.target.closest('.foto');
    if (!li) return;
    const i = Number(li.dataset.n);
    const b = ev.target.closest('[data-m]');
    if (b) return marcar(i, b.dataset.m);
    if (ev.target.closest('.foto-ver')) abrir(i);
  });
  $('[data-filtros]').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-filtro]');
    if (!b) return;
    filtro = b.dataset.filtro;
    desenharFiltros();
    desenharGrade();
  });

  // Ver a foto inteira, com as mesmas marcas e troca por deslize.
  const ver = $('[data-ver]');
  function atualizarVer() {
    const img = $('[data-ver-img]');
    img.src = base + '/f/' + aberta;
    img.alt = 'Foto ' + (aberta + 1) + ' de ' + fotos.length;
    $('[data-ver-num]').textContent = 'Foto ' + (aberta + 1) + ' de ' + fotos.length + (estados[aberta][0] === 'destaque' ? ' · Destaque e Álbum' : estados[aberta][0] ? ' · ' + ROTULO[estados[aberta][0]] : '');
    $('[data-ver-marcas]').innerHTML = botoes(aberta);
  }
  function abrir(i) {
    aberta = i;
    atualizarVer();
    if (!ver.open) ver.showModal();
  }
  function mover(d) {
    const lista = visiveis();
    if (!lista.length) return;
    let p = lista.indexOf(aberta);
    p = p < 0 ? 0 : (p + d + lista.length) % lista.length;
    abrir(lista[p]);
  }
  $('[data-ver-marcas]').addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-m]');
    if (b) marcar(aberta, b.dataset.m);
  });
  $('[data-ant]').addEventListener('click', () => mover(-1));
  $('[data-prox]').addEventListener('click', () => mover(1));
  $('[data-fechar]').addEventListener('click', () => ver.close());
  ver.addEventListener('close', () => {
    const alvo = $('[data-grade]').querySelector('[data-n="' + aberta + '"] .foto-ver');
    aberta = -1;
    alvo?.focus({ preventScroll: true });
    alvo?.scrollIntoView({ block: 'nearest' });
  });
  ver.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') mover(1);
    if (ev.key === 'ArrowLeft') mover(-1);
  });
  let x0 = null, y0 = 0;
  const area = $('[data-ver-foto]');
  area.addEventListener('touchstart', (ev) => { x0 = ev.touches[0].clientX; y0 = ev.touches[0].clientY; }, { passive: true });
  area.addEventListener('touchend', (ev) => {
    if (x0 === null) return;
    const dx = ev.changedTouches[0].clientX - x0, dy = ev.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) mover(dx < 0 ? 1 : -1);
  });

  // Terminei
  const fim = $('[data-fim]');
  $('[data-terminei]').addEventListener('click', async () => {
    const d = conta('destaque'), a = conta('album'), n = conta('nao');
    try {
      const r = await fetch(base + '/concluir', { method: 'POST' });
      if (!r.ok) throw 0;
    } catch {
      return avisar('Não consegui enviar. Confira a internet e toque de novo.');
    }
    $('[data-fim-texto]').textContent = 'Sua escolha ficou salva: ' + (d + a) + ' fotos no álbum, sendo ' + d + ' em destaque, e ' + n + ' que você não quer no portfólio. O José Renato vê tudo por aqui.';
    const msg = 'Oi, José Renato! Terminei a escolha das fotos do álbum "' + NOME + '": ' + (d + a) + ' no álbum (' + d + ' em destaque) e ' + n + ' que não quero.';
    $('[data-fim-whats]').href = 'https://wa.me/${WHATSAPP}?text=' + encodeURIComponent(msg);
    fim.showModal();
  });
  $('[data-fim-fechar]').addEventListener('click', () => fim.close());

  (async () => {
    try {
      const r = await fetch(base + '/dados', { cache: 'no-store' });
      if (!r.ok) throw 0;
      const d = await r.json();
      fotos = d.fotos;
      estados = d.estados;
      limite = d.limite;
    } catch {
      $('[data-carregando]').textContent = 'Não consegui carregar as fotos. Confira a internet e recarregue a página.';
      return;
    }
    $('[data-carregando]').remove();
    desenharFiltros();
    desenharGrade();
  })();
})();
</script>
</body>
</html>`;
}

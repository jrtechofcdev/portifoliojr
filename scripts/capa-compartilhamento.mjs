// Gera a capa de compartilhamento do portfólio (prévia do link no WhatsApp, Instagram, Telegram):
// public/capa-compartilhamento.jpg, 1200 x 630 px.
//
// É o álbum da abertura do site (src/components/Abertura.astro) como objeto: um álbum book de
// couro verde-grafite pousado numa mesa escura, com lombada, costura feita à mão (linha, furos e
// sombra), friso em baixo-relevo, cantoneiras de platina, a fita de cetim e a espessura das
// páginas. A marca e o símbolo são estampados em folha verde-ciano e afundados no couro; o título
// em folha de platina. Tudo fica dentro do quadrado central, para não ser cortado nas miniaturas.
//
// O desenho é uma página HTML montada aqui com as fontes e a textura do site, fotografada pelo
// Edge ou Chrome sem janela no dobro da resolução e reduzida pelo sharp (texto e costura nítidos).
// Uso: npm run capa. Para mudar os textos, edite TEXTOS e rode de novo.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const TEXTOS = {
  marca: 'Jr_Tech_OFC',
  titulo: 'Portfólio',
  frase: 'Existem histórias que merecem ser vistas.',
};

const RAIZ = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(RAIZ, '.cache', 'capa-compartilhamento');
const SAIDA = path.join(RAIZ, 'public', 'capa-compartilhamento.jpg');
const NAVEGADORES = [
  process.env.NAVEGADOR,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const emBase64 = async (arquivo) => (await readFile(path.join(RAIZ, arquivo))).toString('base64');
const fontes = 'node_modules/@fontsource-variable/fraunces/files';
const [romana, italica, couro] = await Promise.all([
  emBase64(`${fontes}/fraunces-latin-opsz-normal.woff2`),
  emBase64(`${fontes}/fraunces-latin-opsz-italic.woff2`),
  emBase64('public/couro.webp'),
]);

// Medidas do álbum na imagem (px). A capa ocupa quase toda a largura; sobra mesa em volta.
// x: o álbum fica um pouco à esquerda para que o miolo (sem a lombada) caia no centro da imagem,
// que é o que sobra quando o WhatsApp recorta a prévia em quadrado.
const A = { x: 38, y: 26, w: 1076, h: 534, lombada: 76 };

// As mesmas peças de src/components/Simbolo.astro.
const PECAS = [
  'M158 40h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H106a10 10 0 0 1-9.6-12.8l52-174A10 10 0 0 1 158 40Z',
  'M350 125h94a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2h-94a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 350 125Z',
  'M90 265h96a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2H63a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 90 265Z',
  'M225 265h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H173a10 10 0 0 1-9.6-12.8l52-174a10 10 0 0 1 9.6-7.2Z',
];

// Costura: a linha corre num retângulo arredondado por dentro da capa (depois da dobra da lombada).
const pontos = (() => {
  const m = 22;
  const x = A.lombada + m;
  const y = m;
  const w = A.w - x - m;
  const h = A.h - 2 * m;
  const r = 14;
  const perimetro = 2 * (w + h) - (8 - 2 * Math.PI) * r;
  const passo = 17; // um ponto a cada 17 px: 11 de linha aparente e 6 por baixo do couro
  const n = Math.round(perimetro / passo);
  return { x, y, w, h, r, comprimento: n * passo };
})();
const ret = (o, extra = '') =>
  `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}" pathLength="${o.comprimento}" fill="none" ${extra}/>`;

// Friso duplo em baixo-relevo, por dentro da costura.
const friso = (d) => ({ x: A.lombada + d, y: d, w: A.w - A.lombada - 2 * d, h: A.h - 2 * d, r: 9 });
const sulco = (o) =>
  `<rect x="${o.x}" y="${o.y + 1.2}" width="${o.w}" height="${o.h}" rx="${o.r}" fill="none" stroke="rgb(255 255 255 / .075)" stroke-width="1.2"/>` +
  `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}" fill="none" stroke="rgb(0 0 0 / .62)" stroke-width="1.6"/>`;

const html = `<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<style>
  @font-face { font-family: Fraunces; font-style: normal; font-weight: 100 900; src: url(data:font/woff2;base64,${romana}) format('woff2'); }
  @font-face { font-family: Fraunces; font-style: italic; font-weight: 100 900; src: url(data:font/woff2;base64,${italica}) format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }

  /* Mesa: escura, com a luz caindo de cima e um brilho verde de leve atrás do álbum, como na abertura */
  .mesa {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background:
      radial-gradient(60% 55% at 50% 40%, rgb(0 252 168 / 0.075), rgb(0 252 168 / 0) 72%),
      radial-gradient(95% 120% at 48% 18%, #1a2a24 0%, #0b1210 52%, #040706 100%);
    font-family: Fraunces, Georgia, serif; font-optical-sizing: auto;
  }

  /* Fita de cetim marcando a página, saindo por baixo da capa */
  .fita {
    position: absolute; left: ${A.x + 760}px; top: ${A.y + A.h - 30}px; width: 30px; height: 98px;
    background: linear-gradient(90deg, #00865c 0%, #00d892 22%, #8dffd9 40%, #2df0b0 55%, #00c784 76%, #006d4b 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
    filter: drop-shadow(5px 7px 5px rgb(0 0 0 / 0.65));
    transform: rotate(3deg); transform-origin: 50% 0;
  }

  /* Espessura: a contracapa e o miolo aparecem embaixo e à direita */
  .contracapa {
    position: absolute; left: ${A.x + 4}px; top: ${A.y + 6}px; width: ${A.w + 10}px; height: ${A.h + 12}px;
    border-radius: 10px 20px 20px 10px; background: #070b0a;
    box-shadow: 0 34px 46px -14px rgb(0 0 0 / 0.95), 0 12px 18px -4px rgb(0 0 0 / 0.7), 0 2px 3px rgb(0 0 0 / 0.8);
  }
  .miolo {
    position: absolute; left: ${A.x + 16}px; top: ${A.y + 8}px; width: ${A.w - 10}px; height: ${A.h - 2}px;
    border-radius: 6px 14px 14px 6px;
    background:
      repeating-linear-gradient(90deg, #f1e9d9 0 1px, #c9bda6 1px 2px) right / 9px 100% no-repeat,
      repeating-linear-gradient(0deg, #f1e9d9 0 1px, #c9bda6 1px 2px) bottom / 100% 9px no-repeat,
      #e6dcc8;
    box-shadow: inset -1px -1px 0 rgb(0 0 0 / 0.25);
  }

  /* Capa: couro acolchoado. A textura do site, o grão em relevo e a luz vindo do alto à esquerda */
  .capa {
    position: absolute; left: ${A.x}px; top: ${A.y}px; width: ${A.w}px; height: ${A.h}px;
    border-radius: 10px 18px 18px 10px; overflow: hidden; isolation: isolate;
    background: #11201a url(data:image/webp;base64,${couro}) 0 0 / 256px 256px;
    background-blend-mode: overlay;
    box-shadow:
      inset 0 1.5px 0 rgb(255 255 255 / 0.13),
      inset 0 -3px 6px rgb(0 0 0 / 0.55),
      inset -2px 0 4px rgb(0 0 0 / 0.4),
      inset 0 0 40px rgb(0 0 0 / 0.42);
  }
  .grao { position: absolute; inset: 0; mix-blend-mode: soft-light; opacity: 0.42; }
  .luz {
    position: absolute; inset: 0;
    background:
      radial-gradient(70% 95% at 22% 0%, rgb(205 255 236 / 0.12), rgb(205 255 236 / 0) 62%),
      linear-gradient(112deg, rgb(255 255 255 / 0) 34%, rgb(255 255 255 / 0.045) 47%, rgb(255 255 255 / 0) 60%),
      radial-gradient(120% 130% at 55% 45%, rgb(0 0 0 / 0) 44%, rgb(0 0 0 / 0.58) 100%);
  }
  /* Lombada e a dobra onde a capa abre */
  .lombada {
    position: absolute; inset: 0 auto 0 0; width: ${A.lombada}px;
    background: linear-gradient(90deg, rgb(0 0 0 / 0.55) 0%, rgb(0 0 0 / 0.16) 38%, rgb(255 255 255 / 0.07) 66%, rgb(0 0 0 / 0.25) 100%);
  }
  .dobra {
    position: absolute; top: 0; bottom: 0; left: ${A.lombada - 3}px; width: 8px;
    background: linear-gradient(90deg, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.15) 45%, rgb(255 255 255 / 0.09) 70%, rgb(255 255 255 / 0));
  }
  .tracos { position: absolute; inset: 0; overflow: visible; }

  /* Cantoneiras de platina nos cantos de fora, com o rebite */
  .canto { position: absolute; right: 0; width: 96px; height: 96px; }
  .canto.alto {
    top: 0; clip-path: polygon(0 0, 100% 0, 100% 100%);
    background:
      radial-gradient(circle at 74% 26%, #f4fffb 0 3.4%, rgb(24 66 55 / 0.9) 3.8% 5.6%, rgb(24 66 55 / 0) 6.2%),
      linear-gradient(225deg, #f3fffb 0%, #b4e4d7 24%, #5fa996 46%, #cff8ec 58%, #86c8b6 74%, #356f60 100%);
    filter: drop-shadow(-1px 2px 2px rgb(0 0 0 / 0.55));
  }
  .canto.baixo {
    bottom: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%);
    background:
      radial-gradient(circle at 74% 74%, #f4fffb 0 3.4%, rgb(24 66 55 / 0.9) 3.8% 5.6%, rgb(24 66 55 / 0) 6.2%),
      linear-gradient(315deg, #d9fff3 0%, #9fd6c7 24%, #4f9886 46%, #b9eede 58%, #74b9a6 74%, #2c6254 100%);
    filter: drop-shadow(-1px -1px 2px rgb(0 0 0 / 0.5));
  }

  /* Conteúdo gravado, centrado entre a dobra e a borda direita */
  .conteudo {
    position: absolute; top: 0; bottom: 0; left: ${A.lombada}px; right: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
    padding-bottom: 6px;
  }
  /* Folha metálica afundada no couro (filtro "gravado": sombra por dentro em cima, luz embaixo) */
  .marca {
    font-size: 31px; font-weight: 600; line-height: 1; letter-spacing: 0.34em; text-indent: 0.34em; text-transform: uppercase;
    background: linear-gradient(100deg, #00fca8 0%, #12efc6 42%, #b8fff0 52%, #22d8ff 66%, #22d8ff 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: url(#gravado);
  }
  .simbolo { width: 108px; height: auto; margin-top: 26px; filter: url(#gravado-simbolo); }
  .titulo {
    margin-top: 30px;
    font-size: 68px; font-weight: 430; line-height: 1; letter-spacing: 0.24em; text-indent: 0.24em; text-transform: uppercase;
    background: linear-gradient(180deg, #fbfffd 0%, #e2f6ef 30%, #9fc9bc 52%, #eefcf7 70%, #b9dcd1 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: url(#gravado);
  }
  .ornamento { display: flex; align-items: center; gap: 16px; width: 360px; margin-top: 22px; }
  .ornamento::before, .ornamento::after {
    content: ''; flex: 1; height: 1.5px;
    background: linear-gradient(90deg, rgb(226 246 239 / 0), rgb(226 246 239 / 0.6));
    box-shadow: 0 1px 0 rgb(0 0 0 / 0.5);
  }
  .ornamento::after { transform: scaleX(-1); }
  .ornamento i { width: 10px; height: 10px; rotate: 45deg; background: linear-gradient(135deg, #00fca8, #22d8ff); box-shadow: 0 1px 1px rgb(0 0 0 / 0.6); }
  .frase {
    margin-top: 18px;
    font-size: 29px; font-style: italic; font-weight: 400; line-height: 1.15; letter-spacing: -0.003em;
    color: #ebe6dc; filter: url(#gravado-leve);
  }
  /* Grão fino por cima de tudo: evita faixas no degradê escuro depois da compressão */
  .ruido { position: absolute; inset: 0; mix-blend-mode: overlay; opacity: 0.05; pointer-events: none; }
</style>
<svg width="0" height="0" style="position:absolute">
  <defs>
    <filter id="gravado" x="-5%" y="-30%" width="110%" height="160%">
      <feOffset in="SourceAlpha" dy="2.2" result="desl"/>
      <feGaussianBlur in="desl" stdDeviation="1.1" result="borr"/>
      <feComposite in="SourceAlpha" in2="borr" operator="out" result="borda"/>
      <feFlood flood-color="#000" flood-opacity="0.72"/>
      <feComposite in2="borda" operator="in" result="sombra"/>
      <feOffset in="SourceAlpha" dy="1.4" result="d2"/>
      <feComposite in="d2" in2="SourceAlpha" operator="out" result="fora"/>
      <feFlood flood-color="#fff" flood-opacity="0.2"/>
      <feComposite in2="fora" operator="in" result="luz"/>
      <feOffset in="SourceAlpha" dy="-1" result="d3"/>
      <feComposite in="d3" in2="SourceAlpha" operator="out" result="cima"/>
      <feFlood flood-color="#000" flood-opacity="0.55"/>
      <feComposite in2="cima" operator="in" result="beira"/>
      <feMerge><feMergeNode in="beira"/><feMergeNode in="luz"/><feMergeNode in="SourceGraphic"/><feMergeNode in="sombra"/></feMerge>
    </filter>
    <filter id="gravado-simbolo" x="-10%" y="-10%" width="120%" height="125%">
      <feOffset in="SourceAlpha" dy="2.6" result="desl"/>
      <feGaussianBlur in="desl" stdDeviation="1.4" result="borr"/>
      <feComposite in="SourceAlpha" in2="borr" operator="out" result="borda"/>
      <feFlood flood-color="#000" flood-opacity="0.6"/>
      <feComposite in2="borda" operator="in" result="sombra"/>
      <feOffset in="SourceAlpha" dy="1.6" result="d2"/>
      <feComposite in="d2" in2="SourceAlpha" operator="out" result="fora"/>
      <feFlood flood-color="#fff" flood-opacity="0.2"/>
      <feComposite in2="fora" operator="in" result="luz"/>
      <feOffset in="SourceAlpha" dy="-1.2" result="d3"/>
      <feComposite in="d3" in2="SourceAlpha" operator="out" result="cima"/>
      <feFlood flood-color="#000" flood-opacity="0.6"/>
      <feComposite in2="cima" operator="in" result="beira"/>
      <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="halo"/>
      <feFlood flood-color="#00fca8" flood-opacity="0.16"/>
      <feComposite in2="halo" operator="in" result="brilho"/>
      <feMerge><feMergeNode in="brilho"/><feMergeNode in="beira"/><feMergeNode in="luz"/><feMergeNode in="SourceGraphic"/><feMergeNode in="sombra"/></feMerge>
    </filter>
    <filter id="gravado-leve" x="-3%" y="-30%" width="106%" height="160%">
      <feOffset in="SourceAlpha" dy="1.6" result="desl"/>
      <feGaussianBlur in="desl" stdDeviation="0.8" result="borr"/>
      <feComposite in="SourceAlpha" in2="borr" operator="out" result="borda"/>
      <feFlood flood-color="#000" flood-opacity="0.5"/>
      <feComposite in2="borda" operator="in" result="sombra"/>
      <feOffset in="SourceAlpha" dy="1.2" result="d2"/>
      <feComposite in="d2" in2="SourceAlpha" operator="out" result="fora"/>
      <feFlood flood-color="#fff" flood-opacity="0.12"/>
      <feComposite in2="fora" operator="in" result="luz"/>
      <feMerge><feMergeNode in="luz"/><feMergeNode in="SourceGraphic"/><feMergeNode in="sombra"/></feMerge>
    </filter>
    <filter id="couro-relevo" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.095" numOctaves="3" seed="11" result="ruido"/>
      <feDiffuseLighting in="ruido" surfaceScale="1.7" diffuseConstant="0.9" lighting-color="#ffffff" result="luz">
        <feDistantLight azimuth="235" elevation="52"/>
      </feDiffuseLighting>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="granulado" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="sombra-linha" x="-2%" y="-2%" width="104%" height="104%">
      <feGaussianBlur stdDeviation="0.7"/>
    </filter>
    <linearGradient id="folha" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="380" y2="470">
      <stop offset="0" stop-color="#00FCA8"/><stop offset="1" stop-color="#22D8FF"/>
    </linearGradient>
  </defs>
</svg>
<div class="mesa">
  <span class="fita"></span>
  <span class="contracapa"></span>
  <span class="miolo"></span>
  <div class="capa">
    <svg class="grao" width="${A.w}" height="${A.h}"><rect width="100%" height="100%" filter="url(#couro-relevo)"/></svg>
    <span class="lombada"></span>
    <span class="dobra"></span>
    <span class="luz"></span>
    <svg class="tracos" width="${A.w}" height="${A.h}" viewBox="0 0 ${A.w} ${A.h}">
      ${sulco(friso(46))}
      ${sulco(friso(53))}
      <!-- canal da costura, levemente afundado -->
      ${ret(pontos, 'stroke="rgb(0 0 0 / .3)" stroke-width="4.5"')}
      <!-- furos nas pontas de cada ponto -->
      ${ret(pontos, `stroke="rgb(0 0 0 / .78)" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="0 17"`)}
      ${ret(pontos, `stroke="rgb(0 0 0 / .78)" stroke-width="3.3" stroke-linecap="round" stroke-dasharray="0 17" stroke-dashoffset="-11"`)}
      <!-- sombra da linha no couro -->
      <g transform="translate(0.9 1.5)" filter="url(#sombra-linha)">${ret(pontos, 'stroke="rgb(0 0 0 / .85)" stroke-width="2.9" stroke-linecap="round" stroke-dasharray="11 6"')}</g>
      <!-- a linha, com um brilho fino por cima -->
      ${ret(pontos, 'stroke="#22d99e" stroke-width="2.9" stroke-linecap="round" stroke-dasharray="11 6"')}
      <g transform="translate(-0.3 -0.5)">${ret(pontos, 'stroke="rgb(214 255 240 / .55)" stroke-width="0.9" stroke-linecap="round" stroke-dasharray="8 9" stroke-dashoffset="-1.5"')}</g>
    </svg>
    <span class="canto alto"></span>
    <span class="canto baixo"></span>
    <div class="conteudo">
      <p class="marca">${TEXTOS.marca}</p>
      <svg class="simbolo" viewBox="44 34 412 432"><g fill="url(#folha)">${PECAS.map((d) => `<path d="${d}"/>`).join('')}</g></svg>
      <p class="titulo">${TEXTOS.titulo}</p>
      <span class="ornamento"><i></i></span>
      <p class="frase">${TEXTOS.frase}</p>
    </div>
  </div>
  <svg class="ruido" width="1200" height="630"><rect width="100%" height="100%" filter="url(#granulado)"/></svg>
</div>
</html>
`;

const navegador = NAVEGADORES.find((n) => existsSync(n));
if (!navegador) {
  console.error('Não achei o Edge nem o Chrome. Informe o caminho na variável NAVEGADOR.');
  process.exit(1);
}
await mkdir(CACHE, { recursive: true });
const pagina = path.join(CACHE, 'capa.html');
const captura = path.join(CACHE, 'capa.png');
await writeFile(pagina, html);

const r = spawnSync(
  navegador,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--window-size=1200,630',
    '--virtual-time-budget=5000',
    `--user-data-dir=${path.join(CACHE, 'perfil')}`,
    `--screenshot=${captura}`,
    pathToFileURL(pagina).href,
  ],
  { stdio: 'ignore', timeout: 90000 },
);
if (r.error || !existsSync(captura)) {
  console.error('A captura falhou.', r.error?.message ?? '');
  process.exit(1);
}

await sharp(captura)
  .resize(1200, 630, { fit: 'cover', position: 'left top', kernel: 'lanczos3' })
  .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(SAIDA);
const { size } = await stat(SAIDA);
const dim = await sharp(SAIDA).metadata();
console.log(`ok public/capa-compartilhamento.jpg ${dim.width}x${dim.height}, ${Math.round(size / 1024)} KB`);

// Gera os ícones do site (aba do navegador, tela inicial do celular, favoritos): um álbum
// fotográfico de capa dura em perspectiva (plano de melhorias de 13/11/2026). Capa de couro
// escuro com o símbolo da marca em folha verde-ciano, lombada à esquerda, as páginas claras
// vistas por cima e, nos tamanhos grandes, costura, cantoneiras e a fita marcadora.
// Nos tamanhos pequenos (aba) o desenho é mais grosso e sem detalhes, para continuar legível em
// 16 x 16; nos ícones de tela inicial o álbum fica sobre um azulejo cor de papel.
// Uso: npm run icones. Os arquivos ficam em public/ e entram no repositório.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PUBLICO = path.resolve(import.meta.dirname, '../public');

// As mesmas peças de src/components/Simbolo.astro (centro em 250, 250).
const PECAS = [
  'M158 40h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H106a10 10 0 0 1-9.6-12.8l52-174A10 10 0 0 1 158 40Z',
  'M350 125h94a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2h-94a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 350 125Z',
  'M90 265h96a10 10 0 0 1 9.6 12.8l-26.6 89a10 10 0 0 1-9.6 7.2H63a10 10 0 0 1-9.6-12.8l26.6-89A10 10 0 0 1 90 265Z',
  'M225 265h176a10 10 0 0 1 9.6 12.8l-52 174a10 10 0 0 1-9.6 7.2H173a10 10 0 0 1-9.6-12.8l52-174a10 10 0 0 1 9.6-7.2Z',
];

const f = (n) => Math.round(n * 10) / 10;
const pts = (lista) => lista.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
const soma = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];

/**
 * O álbum em projeção oblíqua: capa de frente (levemente girada), lombada à esquerda e o miolo
 * visto por cima. Devolve o SVG centrado no quadro de 512 x 512.
 * @param {object} o
 * @param {number} o.ocupa     fração do quadro que o álbum ocupa (pelo lado maior)
 * @param {boolean} o.detalhe  costura, cantoneiras, fita, vincos e sombra (tamanhos grandes)
 * @param {boolean} o.grosso   proporções exageradas (lombada e miolo largos) para 16 a 48 px
 */
function album({ ocupa, detalhe, grosso }) {
  const W = 250;
  const H = 318;
  const k = -0.14; // inclinação das bordas de cima e de baixo da capa
  const D = grosso ? [-90, -68] : [-66, -32]; // espessura, para trás e para cima
  // Caixa do desenho, com a capa começando em (0, 0)
  const minX = D[0];
  const maxX = W;
  const minY = k * W + D[1];
  const maxY = H;
  const escala = (512 * ocupa) / Math.max(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2 + (detalhe ? -6 : 0);

  const TL = [0, 0];
  const TR = [W, k * W];
  const BR = [W, H + k * W];
  const BL = [0, H];
  const TL2 = soma(TL, D);
  const TR2 = soma(TR, D);
  const BL2 = soma(BL, D);
  const u = [1, k]; // direção da largura da capa
  // Miolo visto por cima: entre a capa da frente e a de trás, um pouco recuado da borda direita
  const placa = grosso ? 0.16 : 0.13;
  const recuo = grosso ? 10 : 7;
  const m1 = soma(TL, D, placa);
  const m2 = soma(soma(TR, D, placa), u, -recuo);
  const m3 = soma(soma(TR, D, 1 - placa), u, -recuo);
  const m4 = soma(TL, D, 1 - placa);
  const linhasMiolo = detalhe
    ? [0.28, 0.4, 0.52, 0.64, 0.76]
        .map((t) => {
          const a = soma(TL, D, t);
          const b = soma(soma(TR, D, t), u, -recuo);
          return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
        })
        .join('')
    : '';
  // Capa: coordenadas locais (largura, altura) levadas para o plano inclinado
  const plano = `matrix(1 ${k} 0 1 0 0)`;
  const fita = detalhe
    ? `<g transform="${plano}"><path d="M58 ${H - 12}h20v52l-10-9-10 9Z" fill="url(#fita)"/></g>`
    : '';
  const sombra = detalhe
    ? `<ellipse cx="${f(W / 2 - 40)}" cy="${f(H + 4)}" rx="${f(W * 0.66)}" ry="20" fill="#000" opacity=".32" filter="url(#desfoque)"/>`
    : '';
  const vincos = detalhe
    ? `<g fill="none" stroke-linecap="round">
      ${[0.3, 0.72]
        .map((t) => {
          const a = [0, H * t];
          const b = soma(a, D);
          return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="#000" stroke-opacity=".55" stroke-width="5"/>
      <line x1="${f(a[0])}" y1="${f(a[1] + 5)}" x2="${f(b[0])}" y2="${f(b[1] + 5)}" stroke="#7fa596" stroke-opacity=".35" stroke-width="2.5"/>`;
        })
        .join('\n      ')}
    </g>`
    : '';
  const capaDetalhe = detalhe
    ? `<g transform="${plano}">
      <line x1="20" y1="6" x2="20" y2="${H - 6}" stroke="#050908" stroke-opacity=".7" stroke-width="4"/>
      <line x1="24" y1="6" x2="24" y2="${H - 6}" stroke="#7fa596" stroke-opacity=".28" stroke-width="2"/>
      <rect x="40" y="18" width="${W - 58}" height="${H - 36}" rx="10" fill="none" stroke="#04110c" stroke-opacity=".6" stroke-width="4" stroke-dasharray="11 7" transform="translate(0 1.6)"/>
      <rect x="40" y="18" width="${W - 58}" height="${H - 36}" rx="10" fill="none" stroke="#00fca8" stroke-opacity=".78" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="11 7"/>
      <path d="M${W} 0v34l-34-34Z" fill="url(#platina)"/>
      <path d="M${W} ${H}v-34l-34 34Z" fill="url(#platina)"/>
    </g>`
    : '';
  const simbolo = `<g transform="${plano} translate(${f(W / 2 + 10)} ${f(H * 0.45)}) scale(${grosso ? 0.42 : 0.3}) translate(-250 -250)" fill="url(#folha)">
      ${PECAS.map((d) => `<path d="${d}"/>`).join('')}
    </g>`;

  return {
    defs: `
    <linearGradient id="couro" gradientUnits="userSpaceOnUse" x1="0" y1="${f(k * W)}" x2="${W}" y2="${H}">
      <stop offset="0" stop-color="#34493f"/><stop offset=".45" stop-color="#18261f"/><stop offset="1" stop-color="#0a120f"/>
    </linearGradient>
    <linearGradient id="lombada" gradientUnits="userSpaceOnUse" x1="${f(D[0])}" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#070d0b"/><stop offset=".55" stop-color="#1e2e27"/><stop offset="1" stop-color="#0e1713"/>
    </linearGradient>
    <linearGradient id="miolo" gradientUnits="userSpaceOnUse" x1="${f(m1[0])}" y1="${f(m1[1])}" x2="${f(m4[0])}" y2="${f(m4[1])}">
      <stop offset="0" stop-color="#fbf6ec"/><stop offset="1" stop-color="#ddd0b8"/>
    </linearGradient>
    <linearGradient id="folha" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="380" y2="470">
      <stop offset="0" stop-color="#00FCA8"/><stop offset="1" stop-color="#22D8FF"/>
    </linearGradient>
    <linearGradient id="fita" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00e39a"/><stop offset="1" stop-color="#16b9d8"/>
    </linearGradient>
    <linearGradient id="platina" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3fffb"/><stop offset=".5" stop-color="#9fd3c5"/><stop offset="1" stop-color="#5f9a8a"/>
    </linearGradient>
    <filter id="desfoque" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="12"/></filter>`,
    corpo: `
  <g transform="translate(256 256) scale(${f(escala * 1000) / 1000}) translate(${f(-cx)} ${f(-cy)})" stroke-linejoin="round">
    ${sombra}
    ${fita}
    <polygon class="contorno" points="${pts([BL2, TL2, TR2, TR, BR, BL])}" fill="#0a120f"/>
    <polygon points="${pts([BL, TL, TL2, BL2])}" fill="url(#lombada)"/>
    ${vincos}
    <polygon points="${pts([TL, TR, TR2, TL2])}" fill="#14201b"/>
    <polygon points="${pts([m1, m2, m3, m4])}" fill="url(#miolo)"/>
    <g stroke="#b9aa8d" stroke-opacity=".7" stroke-width="1.6">${linhasMiolo}</g>
    <polygon points="${pts([TL, TR, BR, BL])}" fill="url(#couro)"/>
    <line x1="0" y1="0" x2="${W}" y2="${f(k * W)}" stroke="#6f9486" stroke-opacity=".55" stroke-width="${grosso ? 6 : 3}" stroke-linecap="round"/>
    ${capaDetalhe}
    ${simbolo}
  </g>`,
  };
}

/** SVG completo: álbum sobre fundo transparente (aba) ou sobre azulejo de papel (tela inicial). */
function icone({ ocupa, detalhe, grosso, azulejo = null, contorno = false }) {
  const a = album({ ocupa, detalhe, grosso });
  const fundo = azulejo
    ? `<rect width="512" height="512" rx="${azulejo.raio}" fill="url(#papel)"/>
  ${azulejo.costura ? `<rect x="26" y="26" width="460" height="460" rx="${Math.max(azulejo.raio - 22, 20)}" fill="none" stroke="#007a55" stroke-opacity=".35" stroke-width="4" stroke-linecap="round" stroke-dasharray="13 11"/>` : ''}`
    : '';
  // Na aba escura do navegador, um contorno claro separa o couro do fundo; na clara, um escuro.
  const estilo = contorno
    ? `<style>.contorno{stroke:#050a08;stroke-width:22}@media (prefers-color-scheme:dark){.contorno{stroke:#9cc4b6}}</style>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${estilo}
  <defs>${a.defs}
    <radialGradient id="papel" cx="35%" cy="25%" r="90%">
      <stop offset="0" stop-color="#fbf6ec"/><stop offset=".6" stop-color="#efe6d6"/><stop offset="1" stop-color="#ddcfb6"/>
    </radialGradient>
  </defs>
  ${fundo}${a.corpo}
</svg>
`;
}

const png = (svg, tamanho) =>
  sharp(Buffer.from(svg), { density: Math.max(72, Math.round((72 * tamanho) / 512) * 4) })
    .resize(tamanho, tamanho)
    .png({ compressionLevel: 9 })
    .toBuffer();

// .ico com as imagens PNG dentro (aceito por todos os navegadores atuais e pelo Windows).
function ico(imagens) {
  const cabecalho = Buffer.alloc(6 + 16 * imagens.length);
  cabecalho.writeUInt16LE(0, 0);
  cabecalho.writeUInt16LE(1, 2);
  cabecalho.writeUInt16LE(imagens.length, 4);
  let deslocamento = cabecalho.length;
  imagens.forEach(({ tamanho, dados }, i) => {
    const o = 6 + 16 * i;
    cabecalho.writeUInt8(tamanho >= 256 ? 0 : tamanho, o);
    cabecalho.writeUInt8(tamanho >= 256 ? 0 : tamanho, o + 1);
    cabecalho.writeUInt8(0, o + 2);
    cabecalho.writeUInt8(0, o + 3);
    cabecalho.writeUInt16LE(1, o + 4);
    cabecalho.writeUInt16LE(32, o + 6);
    cabecalho.writeUInt32LE(dados.length, o + 8);
    cabecalho.writeUInt32LE(deslocamento, o + 12);
    deslocamento += dados.length;
  });
  return Buffer.concat([cabecalho, ...imagens.map((x) => x.dados)]);
}

// Aba do navegador: desenho grosso, sem detalhes, ocupando quase todo o quadro.
const aba = icone({ ocupa: 0.98, detalhe: false, grosso: true, contorno: true });
await writeFile(path.join(PUBLICO, 'favicon.svg'), aba);
console.log('ok favicon.svg');

const pequenos = [];
for (const t of [16, 32, 48]) {
  const dados = await png(aba, t);
  pequenos.push({ tamanho: t, dados });
  await writeFile(path.join(PUBLICO, `favicon-${t}.png`), dados);
  console.log(`ok favicon-${t}.png`);
}
await writeFile(path.join(PUBLICO, 'favicon.ico'), ico(pequenos));
console.log('ok favicon.ico');

const arquivos = [
  // Ícones de tela inicial: álbum detalhado sobre papel creme.
  ['icone-192.png', icone({ ocupa: 0.74, detalhe: true, grosso: false, azulejo: { raio: 112, costura: true } }), 192],
  ['icone-512.png', icone({ ocupa: 0.74, detalhe: true, grosso: false, azulejo: { raio: 112, costura: true } }), 512],
  // iOS arredonda sozinho; o adaptável do Android corta em círculo: azulejo cheio, álbum menor.
  ['apple-touch-icon.png', icone({ ocupa: 0.76, detalhe: true, grosso: false, azulejo: { raio: 0, costura: false } }), 180],
  ['icone-adaptavel-512.png', icone({ ocupa: 0.6, detalhe: true, grosso: false, azulejo: { raio: 0, costura: false } }), 512],
];
for (const [nome, svg, tamanho] of arquivos) {
  await writeFile(path.join(PUBLICO, nome), await png(svg, tamanho));
  console.log('ok', nome);
}

const manifesto = {
  name: 'Jr_Tech_OFC Fotografia',
  short_name: 'Jr_Tech_OFC',
  description: 'Portfólio de fotografia de José Renato: ensaios, casais, gestantes, aniversários, 15 anos e eventos em Bacabal e Imperatriz, MA.',
  lang: 'pt-BR',
  start_url: '/',
  display: 'browser',
  background_color: '#121B18',
  theme_color: '#121B18',
  icons: [
    { src: '/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icone-adaptavel-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
await writeFile(path.join(PUBLICO, 'site.webmanifest'), JSON.stringify(manifesto, null, 2) + '\n');
console.log('ok site.webmanifest');

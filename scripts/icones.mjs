// Gera os ícones do site (aba do navegador, tela inicial do celular, favoritos) a partir do símbolo
// da marca: as quatro peças no degradê verde-ciano sobre um azulejo de couro escuro.
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

/**
 * @param {object} o
 * @param {number} o.raio      raio do canto do azulejo (0 = quadrado cheio, para iOS e ícone adaptável)
 * @param {number} o.escala    tamanho do símbolo dentro do azulejo
 * @param {boolean} o.costura  linha de costura por dentro (só nos tamanhos grandes)
 */
function azulejo({ raio, escala, costura }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="couro" cx="32%" cy="24%" r="95%">
      <stop offset="0" stop-color="#22342e"/>
      <stop offset=".55" stop-color="#121b18"/>
      <stop offset="1" stop-color="#080d0b"/>
    </radialGradient>
    <linearGradient id="folha" gradientUnits="userSpaceOnUse" x1="120" y1="40" x2="380" y2="470">
      <stop offset="0" stop-color="#00FCA8"/>
      <stop offset="1" stop-color="#22D8FF"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${raio}" fill="url(#couro)"/>
  ${
    costura
      ? `<rect x="30" y="30" width="452" height="452" rx="${Math.max(raio - 26, 24)}" fill="none" stroke="#00fca8" stroke-opacity=".5" stroke-width="5" stroke-linecap="round" stroke-dasharray="15 13"/>`
      : ''
  }
  <g transform="translate(256 256) scale(${escala}) translate(-250 -250)" fill="url(#folha)">
    ${PECAS.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>
`;
}

const png = (svg, tamanho) => sharp(Buffer.from(svg), { density: 300 }).resize(tamanho, tamanho).png({ compressionLevel: 9 }).toBuffer();

// Aba do navegador: vetor, com canto arredondado.
await writeFile(path.join(PUBLICO, 'favicon.svg'), azulejo({ raio: 116, escala: 0.66, costura: false }));

const arquivos = [
  ['favicon-48.png', azulejo({ raio: 116, escala: 0.66, costura: false }), 48],
  ['icone-192.png', azulejo({ raio: 116, escala: 0.6, costura: true }), 192],
  ['icone-512.png', azulejo({ raio: 116, escala: 0.6, costura: true }), 512],
  // iOS arredonda sozinho; o adaptável do Android corta em círculo: azulejo cheio, símbolo menor.
  ['apple-touch-icon.png', azulejo({ raio: 0, escala: 0.6, costura: false }), 180],
  ['icone-adaptavel-512.png', azulejo({ raio: 0, escala: 0.5, costura: false }), 512],
];
for (const [nome, svg, tamanho] of arquivos) {
  await writeFile(path.join(PUBLICO, nome), await png(svg, tamanho));
  console.log('ok', nome);
}

const manifesto = {
  name: 'Jr_Tech_OFC Fotografia',
  short_name: 'Jr_Tech_OFC',
  description: 'Portfólio de fotografia de José Renato: ensaios, casais, gestantes, 15 anos e celebrações em Imperatriz e Bacabal, MA.',
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

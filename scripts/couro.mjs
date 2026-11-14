// Gera public/couro.webp: textura de grão de couro em cinza neutro (média 128), sem emenda ao repetir.
// O CSS aplica sobre as cores do couro com background-blend-mode: overlay (docs/DESIGN.md §2).
// Uso: node scripts/couro.mjs   (só é preciso rodar de novo se mudar os parâmetros)
import sharp from 'sharp';

const T = 256;
async function ruido(freq, oitavas, seed) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}"><filter id="f" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oitavas}" seed="${seed}" stitchTiles="stitch"/>
<feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1"/></filter>
<rect width="100%" height="100%" filter="url(#f)"/></svg>`;
  const { data } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  return Float32Array.from(data, (v) => v / 255);
}

const graos = await ruido(0.13, 2, 11); // pedrinhas do couro
const vincos = await ruido(0.6, 1, 3); // poros finos
const manchas = await ruido(0.012, 2, 5); // variação suave de tom
const s = (x) => x * x * (3 - 2 * x);
const h = new Float32Array(T * T);
for (let i = 0; i < h.length; i++) {
  const g = Math.min(1, Math.max(0, (graos[i] - 0.38) * 2.6));
  h[i] = s(g) + vincos[i] * 0.12;
}
const at = (x, y) => h[((y + T) % T) * T + ((x + T) % T)];
const luz = [-0.55, -0.55, 0.63]; // luz de cima à esquerda
const out = Buffer.alloc(T * T);
for (let y = 0; y < T; y++)
  for (let x = 0; x < T; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * 2.2;
    const dy = (at(x, y + 1) - at(x, y - 1)) * 2.2;
    const n = Math.hypot(dx, dy, 1);
    const sombra = (-dx * luz[0] - dy * luz[1] + luz[2]) / n - luz[2];
    const v = 128 + sombra * 80 + (manchas[y * T + x] - 0.5) * 22;
    out[y * T + x] = Math.max(0, Math.min(255, Math.round(v)));
  }
await sharp(out, { raw: { width: T, height: T, channels: 1 } }).webp({ quality: 72 }).toFile('public/couro.webp');
const st = await sharp('public/couro.webp').stats();
console.log('couro.webp', Math.round(st.channels[0].mean), Math.round(st.channels[0].stdev));

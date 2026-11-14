// Leva para o portfólio a versão final escolhida pelas modelos.
//
//   node scripts/escolha-aplicar.mjs             mostra o que cada modelo marcou (não muda nada)
//   node scripts/escolha-aplicar.mjs --aplicar   aplica nos álbuns das modelos que terminaram
//   node scripts/escolha-aplicar.mjs --aplicar SAB KI   aplica só nesses ensaios (mesmo sem "Terminei")
//
// Aplicar = baixar as escolhas do banco, passar para a seleção da /curadoria (Destaque e Álbum com
// estrela, destaques abrindo o álbum na ordem dela, Não quero fora), reescrever os manifestos e gerar
// as fotos novas. Depois: revisar os textos alternativos marcados "# alt a revisar", npm run build e commit.
import { spawnSync } from 'node:child_process';
import { aplicar, baixarEscolhas, MINIMO, RAIZ, usarEscolha } from './curadoria-lib.mjs';

const args = process.argv.slice(2);
const aplicarAgora = args.includes('--aplicar');
const pedidas = args.filter((a) => /^[A-Z]+$/.test(a));

const albuns = await baixarEscolhas();
const alvo = [];
for (const [sigla, a] of Object.entries(albuns)) {
  const daModelo = a.escolhas.filter((e) => e.origem === 'modelo');
  const conta = (x) => a.escolhas.filter((e) => e.estado === x).length;
  const situacao = a.concluido ? `terminou em ${new Date(a.concluido).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })}` : daModelo.length ? 'ainda escolhendo' : 'não abriu ou não marcou nada';
  console.log(`${sigla.padEnd(4)} ${a.nome}: ${situacao} · ${conta('destaque')} destaques, ${conta('album') + conta('destaque')} no álbum, ${conta('nao')} não quero`);
  if (pedidas.length ? pedidas.includes(sigla) : a.concluido) alvo.push(sigla);
}
if (!aplicarAgora) {
  console.log(`\nNada foi mudado. Para aplicar: node scripts/escolha-aplicar.mjs --aplicar${alvo.length ? ` (aplicaria: ${alvo.join(', ')})` : ''}`);
  process.exit(0);
}
if (!alvo.length) {
  console.log('\nNenhuma modelo terminou ainda. Para aplicar mesmo assim, diga as siglas: --aplicar SAB');
  process.exit(0);
}
for (const sigla of alvo) {
  const s = await usarEscolha(sigla);
  console.log(`${sigla}: ${s.estrelas.length} fotos no álbum, ${s.destaques?.length ?? 0} destaques, capa ${s.casa}${s.estrelas.length < MINIMO ? ` (menos de ${MINIMO}: o álbum sai do site)` : ''}`);
}
const resumo = await aplicar();
for (const r of resumo.filter((r) => alvo.includes(r.sigla))) {
  console.log(`  ${r.slug}: ${r.publicada ? `${r.estrelas} fotos${r.rascunhos ? `, ${r.rascunhos} sem texto alternativo` : ''}` : 'fora do site'}`);
}
const fotos = spawnSync(process.execPath, ['scripts/fotos.mjs'], { cwd: RAIZ, stdio: 'inherit' });
if (fotos.status !== 0) process.exit(fotos.status ?? 1);
console.log('\nPronto. Falta: textos alternativos das fotos novas, npm run fotos:publicar, npm run build e commit.');

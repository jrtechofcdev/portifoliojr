// Tarefa 2.6: uma foto sem "autorizacao: sim" não pode gerar arquivo no build de produção.
// Usa um manifesto de teste com uma foto autorizada e uma pendente, em pasta temporária.
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const tmp = await mkdtemp(path.join(tmpdir(), 'bloqueio-'));
const manifestos = path.join(tmp, 'ensaios');
await mkdir(manifestos);
await writeFile(
  path.join(manifestos, 'teste.yaml'),
  `pasta: SAB
autorizacao: pendente
fotos:
  - { arquivo: sabrina-01.png, alt: "teste autorizada", autorizacao: sim }
  - { arquivo: sabrina-02.png, alt: "teste pendente" }
`,
);
const env = { ...process.env, FOTOS_MANIFESTOS: manifestos, FOTOS_PUBLICO: path.join(tmp, 'publico'), FOTOS_JSON: path.join(tmp, 'fotos.json') };

let falhas = 0;
function confere(cond, msg) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!cond) falhas++;
}

try {
  execFileSync('node', [path.join(RAIZ, 'scripts/fotos.mjs'), '--producao'], { env, stdio: 'inherit' });
  const arquivos = await readdir(path.join(tmp, 'publico/teste'));
  const json = JSON.parse(await readFile(env.FOTOS_JSON, 'utf8'));
  confere(arquivos.some((f) => f.startsWith('sabrina-01-')), 'foto autorizada gera derivados');
  confere(!arquivos.some((f) => f.startsWith('sabrina-02-')), 'foto pendente não gera nenhum arquivo');
  confere(!('teste/sabrina-02.png' in json.fotos), 'foto pendente fica fora do fotos.json');

  execFileSync('node', [path.join(RAIZ, 'scripts/fotos.mjs')], { env, stdio: 'inherit' });
  const dev = await readdir(path.join(tmp, 'publico/teste'));
  confere(dev.some((f) => f.startsWith('sabrina-02-')), 'no desenvolvimento a foto pendente aparece (com aviso)');

  execFileSync('node', [path.join(RAIZ, 'scripts/fotos.mjs'), '--producao'], { env, stdio: 'inherit' });
  const prod2 = await readdir(path.join(tmp, 'publico/teste'));
  confere(!prod2.some((f) => f.startsWith('sabrina-02-')), 'voltar à produção remove a foto pendente que sobrou do desenvolvimento');
} finally {
  await rm(tmp, { recursive: true, force: true });
}
process.exit(falhas ? 1 : 0);

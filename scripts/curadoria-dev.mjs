// Plugin do Vite que dá à página /curadoria acesso às miniaturas e à seleção.
// Só existe no `npm run dev` (apply: 'serve'): nada disto vai para o build publicado.
import { spawn } from 'node:child_process';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';
import path from 'node:path';
import { aplicar, baixarEscolhas, lerEscolhas, lerManifestos, lerSelecao, marcar, MINIMO, NOVAS, RAIZ, usarEscolha } from './curadoria-lib.mjs';

const MINI = path.join(RAIZ, '.cache/miniaturas');
const status = { rodando: false, etapa: '', log: '', fim: null };

function json(res, dados, codigo = 200) {
  res.statusCode = codigo;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(dados));
}

async function corpo(req) {
  let s = '';
  for await (const c of req) s += c;
  return JSON.parse(s || '{}');
}

function rodar(cmd, args) {
  return new Promise((ok, erro) => {
    const p = spawn(cmd, args, { cwd: RAIZ });
    const add = (b) => (status.log = (status.log + b.toString()).slice(-4000));
    p.stdout.on('data', add);
    p.stderr.on('data', add);
    p.on('close', (c) => (c === 0 ? ok() : erro(new Error(`${args.join(' ')} saiu com código ${c}`))));
  });
}

export default function curadoria() {
  return {
    name: 'jr-curadoria',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__curadoria', async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', 'http://x');
          if (req.method === 'GET' && url.pathname === '/estado') {
            const indicePath = path.join(MINI, 'indice.json');
            if (!existsSync(indicePath)) return json(res, { erro: 'Rode antes: node scripts/miniaturas.mjs' }, 503);
            const indice = JSON.parse(await readFile(indicePath, 'utf8'));
            const pastas = JSON.parse(await readFile(path.join(RAIZ, 'src/data/pastas.json'), 'utf8'));
            const manifestos = await lerManifestos();
            const amostras = Object.keys(pastas).map((sigla) => ({
              sigla,
              nome: manifestos[sigla]?.m.nome ?? NOVAS[sigla]?.nome ?? sigla,
              slug: manifestos[sigla]?.slug ?? NOVAS[sigla]?.slug,
              fotos: indice[sigla] ?? [],
            }));
            return json(res, { amostras, selecao: await lerSelecao(), minimo: MINIMO, status, modelos: await lerEscolhas() });
          }
          if (req.method === 'GET' && url.pathname.startsWith('/mini/')) {
            const [, , sigla, nome] = url.pathname.split('/').map(decodeURIComponent);
            const arq = path.join(MINI, path.basename(sigla), path.basename(nome));
            if (!existsSync(arq)) return json(res, { erro: 'não encontrada' }, 404);
            res.setHeader('content-type', 'image/webp');
            res.setHeader('cache-control', 'max-age=86400');
            return createReadStream(arq).pipe(res);
          }
          if (req.method === 'GET' && url.pathname.startsWith('/grande/')) {
            // Versão de 1600 px para ver a foto em tela cheia, gerada na primeira vez e guardada.
            const [, , sigla, arquivo] = url.pathname.split('/').map(decodeURIComponent);
            const pastas = JSON.parse(await readFile(path.join(RAIZ, 'src/data/pastas.json'), 'utf8'));
            const raiz = path.join(RAIZ, 'Fotos Para Potifolio');
            const nomePasta = (await readdir(raiz)).find((n) => n.normalize('NFC') === pastas[sigla]?.normalize('NFC'));
            if (!nomePasta) return json(res, { erro: 'pasta' }, 404);
            const nomeArq = (await readdir(path.join(raiz, nomePasta))).find((n) => n.normalize('NFC') === arquivo.normalize('NFC'));
            if (!nomeArq) return json(res, { erro: 'arquivo' }, 404);
            const dir = path.join(RAIZ, '.cache/miniaturas-grandes', sigla);
            const destino = path.join(dir, nomeArq.normalize('NFC').replace(/[^\w.-]+/g, '_') + '.webp');
            if (!existsSync(destino)) {
              await mkdir(dir, { recursive: true });
              await sharp(path.join(raiz, nomePasta, nomeArq), { failOn: 'none' }).rotate().resize({ width: 1600, height: 1600, fit: 'inside' }).webp({ quality: 78 }).toFile(destino);
            }
            res.setHeader('content-type', 'image/webp');
            res.setHeader('cache-control', 'max-age=86400');
            return createReadStream(destino).pipe(res);
          }
          if (req.method === 'POST' && url.pathname === '/marcar') {
            const { sigla, arquivo, tipo, valor } = await corpo(req);
            if (!/^[A-Z]+$/.test(sigla) || !['estrela', 'casa'].includes(tipo)) return json(res, { erro: 'pedido inválido' }, 400);
            return json(res, { sigla, selecao: await marcar(sigla, arquivo, tipo, !!valor) });
          }
          if (req.method === 'POST' && url.pathname === '/aplicar') {
            if (status.rodando) return json(res, { status });
            Object.assign(status, { rodando: true, etapa: 'Atualizando as amostras', log: '', fim: null });
            (async () => {
              try {
                const resumo = await aplicar();
                status.log += resumo.map((r) => `${r.slug}: ${r.publicada ? `${r.estrelas} fotos` : 'fora do site'}\n`).join('');
                status.etapa = 'Preparando as fotos (as novas demoram alguns segundos cada)';
                await rodar(process.execPath, ['scripts/fotos.mjs']);
                Object.assign(status, { etapa: 'Pronto', fim: 'ok' });
              } catch (e) {
                Object.assign(status, { etapa: 'Erro', fim: String(e.message ?? e) });
              } finally {
                status.rodando = false;
              }
            })();
            return json(res, { status });
          }
          if (req.method === 'POST' && url.pathname === '/buscar-modelos') {
            await baixarEscolhas();
            return json(res, { modelos: await lerEscolhas() });
          }
          if (req.method === 'POST' && url.pathname === '/usar-modelo') {
            const { sigla } = await corpo(req);
            if (!/^[A-Z]+$/.test(sigla)) return json(res, { erro: 'pedido inválido' }, 400);
            return json(res, { sigla, selecao: await usarEscolha(sigla) });
          }
          if (req.method === 'GET' && url.pathname === '/status') return json(res, { status });
          json(res, { erro: 'rota desconhecida' }, 404);
        } catch (e) {
          json(res, { erro: String(e.message ?? e) }, 500);
        }
      });
    },
  };
}

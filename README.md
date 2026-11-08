# Portfólio Jr_Tech_OFC Fotografia

Site de portfólio de José Renato Alves da Silva, fotógrafo em Imperatriz e Bacabal, MA.
Feito com [Astro](https://astro.build) (site estático, sem servidor). As fotos vêm direto de `Fotos Para Potifolio/`, que nunca é alterada: o site gera cópias leves de cada foto escolhida.

## Requisitos

- Node.js 22 ou mais novo (`node --version`)
- Na primeira vez, dentro desta pasta: `npm install`

## Os quatro comandos

| Comando | Para que serve |
|---|---|
| `npm run dev` | Abre o site no seu computador em http://localhost:4321, **com todas as fotos**, inclusive as que ainda não têm autorização (aparecem com a etiqueta "autorização pendente"). |
| `npm run build:previa` e depois `npm run preview` | Gera a versão completa com todas as fotos para você revisar em http://localhost:4322. Essa versão tem `noindex` e **não deve ser publicada**. |
| `npm run build` | Gera a versão de publicação em `dist/`. **Só entram fotos com `autorizacao: sim`.** No fim, um teste confirma que nenhuma foto sem autorização foi para `dist/`. |
| `npm run test:bloqueio` | Prova que uma foto pendente não gera arquivo na versão de publicação. |

A primeira geração de fotos demora (cerca de 20 minutos para as 85 fotos atuais). Depois ela fica guardada em `.cache/fotos/` e leva segundos.

## Como liberar um ensaio para publicação

Cada ensaio tem um arquivo em `src/content/ensaios/`, por exemplo `sabrina.yaml`. Quando a pessoa autorizar o uso das fotos:

1. Abra o arquivo do ensaio.
2. Troque `autorizacao: pendente` por `autorizacao: sim`.
3. Se só algumas fotos foram autorizadas, deixe o ensaio como `pendente` e escreva `autorizacao: sim` na linha de cada foto liberada:
   ```yaml
   - { arquivo: sabrina-01.png, alt: "...", autorizacao: sim }
   ```
4. Rode `npm run build`.

Um ensaio só aparece no site quando a foto de abertura, a capa e pelo menos 4 fotos estão liberadas.

## Como adicionar um ensaio novo

1. Coloque a pasta do ensaio dentro de `Fotos Para Potifolio/`, como você já faz.
2. Abra `src/data/pastas.json` e acrescente uma sigla para a pasta nova, copiando o nome da pasta exatamente:
   ```json
   "AN": "📸 Ensaio Fotográfico - Ana - 10_01_2027"
   ```
3. Crie `src/content/ensaios/ana.yaml` (o nome do arquivo vira o endereço: `/trabalhos/ana`). Use outro ensaio como modelo:
   ```yaml
   nome: Ana
   titulo: ANA
   categoria: ensaios        # ensaios, casais ou eventos
   rotulo: Ensaio externo
   cidade: Imperatriz        # ou null se não quiser mostrar
   data: "2027-01-10"        # sempre entre aspas
   tema: claro               # claro (luz do dia) ou escuro (noite, eventos)
   autorizacao: pendente     # sim quando a pessoa autorizar
   pasta: AN
   abertura: { arquivo: foto-03.jpg, foco: 50% 30% }   # foco = ponto da foto que não pode ser cortado
   capa: foto-03.jpg
   fotos:
     - { arquivo: foto-03.jpg, alt: "Ana sentada no banco da praça, fim de tarde" }
     - { arquivo: foto-07.jpg, alt: "Ana de perfil, olhando o rio" }
     # 10 a 16 fotos, na ordem em que devem aparecer
   ```
4. O `alt` descreve o que está na foto para quem usa leitor de tela. Escreva o que se vê, sem "imagem de" e sem travessão.
5. Rode `npm run dev` e confira o ensaio em http://localhost:4321/trabalhos/ana.

Se um nome de arquivo estiver errado, o comando para e mostra qual foto não foi encontrada.

## Onde mudar cada coisa

| O quê | Arquivo |
|---|---|
| WhatsApp, e-mail, Instagram, cidades, slogan | `src/data/site.ts` |
| Textos da página inicial | `src/pages/index.astro` |
| Cores, fontes e espaçamentos | `src/styles/global.css` (seguindo `DESIGN.md`) |
| Endereço definitivo do site (domínio) | `astro.config.mjs`, campo `site` |

## Publicar

O conteúdo de `dist/` depois de `npm run build` pode ir para qualquer hospedagem estática (Cloudflare Pages, Netlify ou Vercel, todas com plano gratuito). Antes de publicar:

1. Troque `site: 'https://example.invalid'` em `astro.config.mjs` pelo domínio real.
2. Confirme as autorizações de imagem (`PENDENCIAS_E_DECISOES.md`).
3. Teste o botão do WhatsApp num celular.

## Documentos do projeto

`PLANO_GERAL_PORTFOLIO.md` (plano), `DESIGN.md` (direção visual), `MAPA_DO_SITE_E_CONTEUDO.md` (páginas e textos), `CURADORIA_E_INVENTARIO_DE_ASSETS.md` (fotos), `ROADMAP_DE_EXECUCAO.md` (fases), `PENDENCIAS_E_DECISOES.md` (o que falta decidir), `RELATORIO_ENTREGA.md` (testes da entrega).

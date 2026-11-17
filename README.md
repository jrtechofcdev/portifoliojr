# Jr_Tech_OFC Fotografia · Portfólio

Portfólio de **José Renato Alves da Silva**, fotógrafo em Bacabal e Imperatriz, MA.
No ar em **https://portifolio.jrtechofc.com.br**.

> Código fechado. Todos os direitos reservados. Veja [LICENSE](LICENSE).

## O site

- **Álbuns de clientes reais**, um por ensaio, com abertura em tela cheia, Stories e visualização ampliada.
- **Atendimento**: um botão flutuante de couro com uma sineta abre a conversa em qualquer página, falando em primeira pessoa, como o fotógrafo. Ele entende o que a pessoa procura (algumas perguntas de um toque, ou uma frase escrita, mesmo com erro de digitação), indica o plano com valor e condições, mostra álbuns de exemplo, tira dúvidas (pagamento, entrega, agenda, preparação) e leva ao WhatsApp com nome e assunto. Funciona só no aparelho, sem IA e sem servidor.
- **Estatísticas próprias** em https://analytics.jrtechofc.com.br: visitas, cliques no WhatsApp, álbuns mais vistos, de onde as pessoas vieram, cidades e o que foi escolhido no atendimento. Sem cookies e sem guardar IP.
- **Páginas próprias**: Portfólio, Serviços, Como funciona, Sobre e Contato. Os botões abrem a página na mesma janela, sem rolar a tela.
- **Orçamento pelo WhatsApp** em um toque, com a mensagem já escrita.
- **Botões de couro costurado** com disparo de câmera ao tocar, e troca de página como um obturador.
- **Celular primeiro**: pensado para Android, leve mesmo com fotos em alta qualidade (AVIF e WebP de 480 a 2400 px).
- **Privacidade e direitos autorais**: páginas `/privacidade` e `/direitos-autorais`, sem cookies, estatísticas ou anúncios.

## Tecnologia

| Parte | Escolha |
|---|---|
| Site | [Astro](https://astro.build) 7, estático, sem servidor |
| Fotos | `sharp`: versões web geradas a partir dos originais, sem localização nem dados da câmera |
| Fontes | Fraunces e Archivo, servidas pelo próprio site |
| Hospedagem | Vercel (publica a cada push no `main`), domínio na Cloudflare |

## Estrutura

```
src/
  content/ensaios/   um arquivo YAML por álbum (fotos, capa, abertura, textos alternativos)
  components/        partes da interface (abertura, Stories, galeria, assistente, rodapé...)
  pages/             início, /trabalhos, cada álbum, serviços, como funciona, sobre, contato, privacidade, direitos autorais
  data/              contatos, categorias, destaques, siglas das pastas e o roteiro do assistente (assistente.ts)
  lib/entender.ts    como o assistente entende o que a pessoa escreve (erros de digitação, abreviações)
  styles/global.css  cores, fontes e espaçamentos
  generated/         dados das fotos gerados por scripts/fotos.mjs
public/fotos/        versões web das fotos (vão no Git porque a Vercel não tem os originais)
scripts/             geração de fotos, ícones, capa de compartilhamento e verificações
docs/                plano, direção visual, inventário das fotos e relatórios
```

## Segurança

- **Fotos**: sem "salvar imagem" no clique direito ou no toque longo, sem arrastar e em branco na impressão. Outros sites não conseguem exibir as fotos direto do servidor (`Cross-Origin-Resource-Policy`).
- **Robôs de IA**: os que coletam conteúdo para treinar modelos são bloqueados no `robots.txt`, e as fotos levam `noai, noimageai`.
- **Cabeçalhos** (`vercel.json`): política de conteúdo (CSP), proibição de abrir o site dentro de outro (`frame-ancestors 'none'`), HTTPS obrigatório (HSTS) e permissões do navegador desligadas.
- **Código**: build minificado e sem mapas de código-fonte. O repositório deve ficar **privado** no GitHub.

Nenhuma proteção técnica impede uma captura de tela. A proteção que vale contra cópia é a legal: Lei 9.610/1998, explicada em `/direitos-autorais`.

## Comandos

Requisitos: Node.js 22 ou mais novo e, na primeira vez, `npm install`.

| Comando | Para que serve |
|---|---|
| `npm run dev` | Abre o site em http://localhost:4321 com todas as fotos, inclusive as sem autorização (com a etiqueta "autorização pendente"). |
| `npm run fotos:publicar` | Gera as versões web só das fotos com `autorizacao: sim`. |
| `npm run build` | Versão de publicação em `dist/`. No fim, confere que nenhuma foto sem autorização foi para `dist/`. |
| `npm run build:previa` e `npm run preview` | Versão completa para revisão local, com `noindex`. Não publicar. |
| `npm run test:bloqueio` | Prova que uma foto pendente não gera arquivo na publicação. |
| `npm run test:assistente` | Confere se o atendimento entende frases reais, com erro de digitação ("jestante em bacabau", "qto custa"). |
| `npm run icones` / `npm run capa` | Ícones do site e capa da prévia de link no WhatsApp. |

A primeira geração de fotos numa máquina nova leva cerca de 25 minutos. Depois ela fica em `.cache/fotos/` e leva segundos.

## Mudar as fotos de um álbum

Cada álbum é um arquivo em `src/content/ensaios/`, por exemplo `sabrina.yaml`.

1. Na lista `fotos`, acrescente, tire ou reordene as linhas. O álbum mostra as fotos na ordem da lista, e as primeiras também abrem os Stories.
2. `capa` é a foto do cartão do álbum e `abertura` é a foto do topo da página. As duas precisam estar na lista `fotos`.
3. Escreva o `alt` de cada foto nova: o que se vê na foto, sem "imagem de" e sem travessão.
4. Rode `npm run fotos:publicar` e depois `npm run build`. Um álbum precisa de pelo menos 4 fotos para aparecer.

## Adicionar um álbum novo

1. Coloque a pasta do ensaio dentro de `Fotos Para Potifolio/`. Ela nunca é alterada: o site só lê os originais.
2. Em `src/data/pastas.json`, crie uma sigla para a pasta, copiando o nome exato:
   ```json
   "AN": "📸 Ensaio Fotográfico - Ana - 10_01_2027"
   ```
3. Crie `src/content/ensaios/ana.yaml`. O nome do arquivo vira o endereço `/trabalhos/ana`:
   ```yaml
   nome: Ana
   titulo: ANA
   categoria: ensaios        # ensaios, casais ou eventos
   rotulo: Ensaio externo
   cidade: Imperatriz        # ou null
   data: "2027-01-10"        # sempre entre aspas
   tema: claro               # claro (luz do dia) ou escuro (noite, eventos)
   autorizacao: pendente     # sim quando a pessoa autorizar
   pasta: AN
   abertura: { arquivo: foto-03.jpg, foco: 50% 30% }   # foco = ponto que não pode ser cortado
   capa: foto-03.jpg
   fotos:
     - { arquivo: foto-03.jpg, alt: "Ana sentada no banco da praça, fim de tarde" }
     - { arquivo: foto-07.jpg, alt: "Ana de perfil, olhando o rio" }
   ```
4. Rode `npm run dev` e confira em http://localhost:4321/trabalhos/ana.

Se um nome de arquivo estiver errado, o comando para e mostra qual foto não foi encontrada.

**Autorização de imagem.** Um álbum só vai ao ar com `autorizacao: sim`. Se só algumas fotos foram liberadas, deixe o álbum `pendente` e marque `autorizacao: sim` na linha de cada foto liberada.

## Mudar o atendimento

As regras comerciais (planos, valores, pagamento, prazos, locais, o que não é feito) estão em `docs/DOCUMENTO_MESTRE_ASSISTENTE.md`. O que o atendimento pergunta e responde está em `src/data/assistente.ts`, em texto comum, seguindo esse documento.

- **Planos e valores**: `PLANOS_ENSAIO` e `PLANOS_EVENTO` (nome, preço e itens). As frases de sinal, entrega e hora adicional ficam em `CONDICOES`.
- **Perguntas do guia**: `TIPOS` (o que fotografar), a `segunda` pergunta de cada tipo, a pergunta do plano (`PERGUNTA_PLANO`), `PRAZOS` e `CIDADES`. Em `albuns` ficam os álbuns indicados para cada escolha (nome do arquivo em `src/content/ensaios`). Uma opção com `avaliar` (casamento, formatura) pula o plano e vai para avaliação.
- **Dúvidas**: `DUVIDAS`. Cada uma tem o texto do botão, a resposta, links, cartões de planos e se mostra o botão do WhatsApp. `MENU_DUVIDAS` define o que aparece em "Tirar dúvidas".
- **Palavras que a pessoa pode escrever**: o campo `chaves` de cada opção. Não precisa escrever as versões com erro: o atendimento já entende falta de acento, letra trocada e abreviações. `palavra*` vale como começo de palavra.
- Mudou um preço ou uma condição? Mude primeiro o documento mestre e depois `src/data/assistente.ts`. Rode `npm run test:assistente` e `npm run build` (o build para se algum álbum citado não existir).

## Estatísticas

O painel fica em https://analytics.jrtechofc.com.br, com senha. A senha está no arquivo `.env` deste computador (`ANALYTICS_SENHA`), que não vai para o Git.

- **O que conta**: páginas vistas, cliques no WhatsApp, e-mail, Instagram, álbuns e Stories (com o lugar da página), etapas do atendimento, de onde a pessoa veio, cidade aproximada e aparelho. Sem cookies, sem IP guardado e sem o que a pessoa escreve. Os dados se apagam depois de 13 meses.
- **Não contar as suas visitas**: abra uma vez em cada aparelho seu `https://portifolio.jrtechofc.com.br/?analytics=ignorar` (para voltar a contar: `?analytics=contar`).
- **Saber de onde veio cada divulgação**: use links como `https://portifolio.jrtechofc.com.br/?utm_source=instagram&utm_campaign=bio`.
- **Links curtos** (redirecionamentos em `vercel.json`): `portifolio.jrtechofc.com.br/ig` (bio do Instagram), `/s` (story do Instagram) e `/wa` (bio do WhatsApp). Cada um leva ao site com a etiqueta da origem. Para criar outro atalho, copie um desses blocos no `vercel.json` com outro nome e outra campanha.
- **Código**: pasta `analytics/` (Cloudflare Worker e banco D1). Para publicar uma mudança: dentro dela, `npx wrangler@4 deploy`. Para trocar a senha: `npx wrangler@4 secret put SENHA`.

## Onde mudar cada coisa

| O quê | Arquivo |
|---|---|
| WhatsApp, e-mail, Instagram, cidades, slogan | `src/data/site.ts` |
| Álbuns em destaque e a ordem deles | `DESTAQUES` em `src/data/site.ts` |
| Textos da página inicial | `src/pages/index.astro` |
| Serviços, Como funciona e Sobre | `src/components/SecaoServicos.astro`, `SecaoComoFunciona.astro`, `SecaoSobre.astro` (as etapas ficam em `PASSOS`, em `src/data/site.ts`) |
| Perguntas, planos e respostas do atendimento | `src/data/assistente.ts` (regras em `docs/DOCUMENTO_MESTRE_ASSISTENTE.md`) |
| Painel de estatísticas | `analytics/` |
| Privacidade e direitos autorais | `src/pages/privacidade.astro`, `src/pages/direitos-autorais.astro` |
| Cabeçalhos de segurança e redirecionamentos | `vercel.json` |
| Cores, fontes e espaçamentos | `src/styles/global.css` (seguindo `docs/DESIGN.md`) |

## Publicar

A Vercel publica sozinha a cada `git push` no `main`. Antes de enviar uma mudança de fotos:

1. `npm run fotos:publicar`
2. `npm run build`
3. `git add -A`, `git commit` e `git push`

## Documentos

Em `docs/`: `PLANO_GERAL_PORTFOLIO.md` (plano), `DESIGN.md` (direção visual), `MAPA_DO_SITE_E_CONTEUDO.md` (páginas e textos), `CURADORIA_E_INVENTARIO_DE_ASSETS.md` (fotos), `ROADMAP_DE_EXECUCAO.md` (fases), `PENDENCIAS_E_DECISOES.md` (decisões) e `RELATORIO_ENTREGA.md` (testes da entrega).

---

© 2026 Jr_Tech_OFC · José Renato Alves da Silva. Todos os direitos reservados.

# Portfólio Jr_Tech_OFC

Portfólio de fotografia de José Renato Alves da Silva (Jr_Tech_OFC Fotografia, "Nossa Arte, Seu Sucesso!"), Imperatriz e Bacabal, MA.

## Estado atual
Fases 0 a 6 concluídas na parte do desenvolvimento em 08/11/2026 (ver `docs/RELATORIO_ENTREGA.md`). Site em produção em https://portifolio.jrtechofc.com.br (Vercel publica a cada push no `main`). Nada de `git push`, deploy ou publicação sem ele. Documento principal: `docs/PLANO_GERAL_PORTFOLIO.md`. Manutenção: `README.md`. Dúvidas em aberto: `docs/PENDENCIAS_E_DECISOES.md`.

Revisão de 09/11/2026: visual "álbum de couro" (docs/DESIGN.md §0) e curadoria pelo fotógrafo em `/curadoria`. Autorizações de imagem confirmadas pelo responsável em 09/11/2026.

Revisão de 13/11/2026: curadoria final feita pelo fotógrafo (14 álbuns). Novo visual "fotos em tela cheia", celular Android primeiro, com Stories e bastante movimento (docs/DESIGN.md §0b). A pasta do Bombeiro Mirim (BM) não está na cópia das fotos deste computador.

Revisão de 13/11/2026 (tarde): site publicado no GitHub e na Vercel. Refinada de luxo (docs/DESIGN.md §0c): capa de couro que abre na home, símbolo da marca em SVG, assistente de escolha de duas perguntas, costura mais fina, transição entre páginas. Álbum "Dália" corrigido para "Dalila" (`/trabalhos/dalila`, redirect do endereço antigo no `vercel.json`).

Revisão de 13/11/2026 (noite): repaginada da home (docs/DESIGN.md §0d): álbuns em capítulos por tipo de trabalho, assistente com fotos nas respostas, "Como funciona" e "Sobre" em páginas de papel creme, botão de WhatsApp que encolhe ao rolar.

Revisão de 13/11/2026 (noite): prévia de compartilhamento (docs/DESIGN.md §0e): capa de couro em `public/capa-compartilhamento.jpg`, textos em `CAPA_SOCIAL`, endereço oficial fixo em `astro.config.mjs`.

Revisão de 13/11/2026 (noite): edição de luxo e plano comercial (docs/DESIGN.md §0f): ícones próprios, abertura do álbum como objeto, fotos que se alternam na abertura, serviços com orçamento, destaques na ordem do fotógrafo (`DESTAQUES`), capa alternada nas Bodas de Ouro (`capaAlternativa`), rodapé novo.

Revisão de 13/11/2026 (noite): plano de melhorias (docs/DESIGN.md §0g): foto do livro da Sabrina na abertura, com a foto num palco ao lado do texto; textos novos; botão "Solicitar orçamento" em todo o site (`CHAMADA`); categorias numa fonte só (`CAPITULOS`); chamada final e rodapé compacto; ícone de álbum em perspectiva; textos alternativos de todas as fotos.

Revisão de 14/11/2026: versão final escolhida pelas modelos (13 álbuns, 313 fotos). Cada álbum tem só o que a modelo marcou como Destaque ou Álbum; foto sem marca fica fora. Saíram "Dalila & Maria" e "Feira de Ciências". "Tia Josiana" corrigido para "Tia Josina" (`/trabalhos/tia-josina`, redirect no `vercel.json`; a pasta dos originais mantém o nome antigo). Fotos em qualidade mais alta: 480 a 2400 px, AVIF 62 e WebP 82 (`scripts/fotos.mjs`).

Revisão de 14/11/2026 (tarde): curadoria encerrada e retirada do projeto. Saíram a página `/curadoria`, a escolha pelas modelos (pasta `escolha/`, Worker e banco D1 do Cloudflare apagados, endereço `/escolha` desligado) e os scripts ligados a elas. Os álbuns agora são mantidos direto nos manifestos (`src/content/ensaios/*.yaml`).

Revisão de 14/11/2026 (noite): novo álbum "José", ensaio infantil country (`jose.yaml`, pasta DJ, 31 fotos PNG; filho de Dalila, autorizado por ela como responsável). As 7 fotos com 5 estrelas nos metadados (xmp:Rating) são os destaques e abrem o álbum; o álbum entrou no fim de `DESTAQUES`, com a capa no carrossel "Em destaque" abaixo da abertura da home. Proteção do portfólio: páginas `/privacidade` (LGPD) e `/direitos-autorais`, bloqueio de "salvar imagem" e de arrastar nas fotos (script em `Base.astro`, CSS no fim de `global.css`), cabeçalhos de segurança e CORP nas fotos (`vercel.json`), robôs de IA bloqueados (`robots.txt.ts`), build sem source maps, `LICENSE` proprietária. Documentos internos movidos para `docs/`. O repositório no GitHub ainda é público: tornar privado é ação do responsável.

Revisão de 14/11/2026 (noite, 2): assistente de atendimento (docs/DESIGN.md §0h). Botão flutuante de couro com sineta em todas as páginas (`AssistenteChat.astro`), que some com um obturador ao rolar para cima. Guia de até 4 perguntas, tirar dúvidas por opção e "Falar com José Renato" (nome e assunto para o WhatsApp). Entende texto com erro (`src/lib/entender.ts`, sem IA, só no aparelho); roteiro e respostas em `src/data/assistente.ts`, sem preço nem prazo inventado. Páginas próprias `/servicos`, `/como-funciona`, `/sobre`, `/contato`: nenhum botão rola a tela. Botões de couro costurado com disparo de câmera; troca de página como obturador. Saíram `Assistente.astro` e `BarraWhatsApp.astro`. Cuidado: `@property` é global; nomes de variável CSS registrados não podem repetir os de outro componente (o `--giro` da abertura quebrou uma vez).

Revisão de 16/11/2026: atendimento com o conteúdo comercial do responsável (`docs/DOCUMENTO_MESTRE_ASSISTENTE.md`, fonte de verdade de planos, preços, pagamento, prazos, locais e limites). O atendimento fala em primeira pessoa, sem nome próprio ("Atendimento"), indica plano com valor (ensaio: Essencial, Destaque, Premium; eventos: por horas), trata casamento e formatura como avaliação e nunca apresenta a política de cancelamento como vigente. Preços aprovados pelo responsável valem no atendimento; nas páginas do site continuam fora até ele pedir. Estatísticas próprias em https://analytics.jrtechofc.com.br (pasta `analytics/`, Worker `jr-analytics` + D1 `jr-analytics`, senha em `.env` `ANALYTICS_SENHA`), sem cookies e sem IP; script `Estatisticas.astro` no `Base.astro`; `?analytics=ignorar` exclui um aparelho. A limpeza de dados antigos roda na primeira visita de cada dia (a conta não tem workers.dev para cron).

## Comandos
- `npm run test:assistente`: frases reais, com erro de digitação, que o atendimento precisa entender (inclui as perguntas frequentes do documento mestre). Rodar depois de mudar `src/data/assistente.ts` ou `src/lib/entender.ts`.
- Estatísticas: `cd analytics && npx wrangler@4 deploy` publica o painel; `npx wrangler@4 secret put SENHA` troca a senha.
- Mudar as fotos de um álbum: editar o YAML do ensaio (lista `fotos` na ordem do álbum, `capa`, `abertura`, `alt` de cada foto), depois `npm run fotos:publicar` e `npm run build`. Passo a passo no `README.md`.
- `npm run dev`: gera as fotos (inclui pendentes, com aviso) e abre o site; `/sistema` mostra tokens, tipos e todas as fotos.
- `npm run build`: fotos só com `autorizacao: sim`, `astro check`, build e `scripts/verificar-dist.mjs`.
- `npm run build:previa`: site completo com fotos pendentes e `noindex`, só para revisão local (`npm run preview`).
- `npm run test:bloqueio`: prova que foto pendente não gera arquivo em produção.
- Ensaios: um YAML por ensaio em `src/content/ensaios/` (esquema em `src/content.config.ts`). Siglas de pasta em `src/data/pastas.json`.
- A primeira geração de fotos leva cerca de 25 min; depois usa `.cache/fotos/`.
- `npm run icones`: gera os ícones do site (álbum em perspectiva: `favicon.svg`, `favicon.ico`, PNGs da aba e da tela inicial do celular).
- `npm run capa`: gera a capa de compartilhamento (prévia do link no WhatsApp) com o Edge ou o Chrome da máquina. Textos no próprio script e em `CAPA_SOCIAL`.

## Skills obrigatórias (instaladas globalmente, ver `docs/RELATORIO_SKILLS.md`)
- Direção visual: leia `docs/DESIGN.md` antes de qualquer interface. Ele é a direção exigida pela regra R-37 do Anti-Slop e a base da Taste Skill.
- Interface: `design-taste-frontend` (método, sistema e verificação em navegador) com `antislop`, `antislop-ui` e `antislop-layoutmobile` como filtro.
- Texto do site: `antislop-copywriting`. Sem travessão (R-02), sem números, depoimentos ou anos de experiência inventados.
- Acessibilidade: `antislop-human` (contraste, teclado, foco, estados).
- Código: `antislop-code`.
- Antes de entregar: Delivery Gate do Anti-Slop e `gate.mjs` da Taste Skill, com o resultado PASS/FAIL apresentado.

## Exceções a estas skills, específicas deste projeto
- **Nunca usar fotos substitutas, de banco ou geradas por IA**, mesmo que a Taste Skill sugira stand-ins. Só fotografias reais de `Fotos Para Potifolio/`, com autorização confirmada em `docs/CURADORIA_E_INVENTARIO_DE_ASSETS.md`.
- Sem shaders, cenas 3D, parallax ou efeitos de demonstração. Fotografia de pessoas não é site de tecnologia. Exceções pedidas pelo cliente: a textura de couro e, desde 13/11/2026, "bastante movimento" (docs/DESIGN.md §0b: Stories, zoom lento na abertura, entradas ao rolar só com CSS) e a capa de couro que abre na home (§0c, refeita em §0f), e desde a noite de 13/11/2026 a troca de fotos na abertura, a capa alternada, o reflexo nos cartões e o selo que gira ao rolar (§0f), e desde 14/11/2026 o disparo de câmera nos botões, o obturador do botão do assistente e a troca de página como obturador (§0h).

## Regras de arquivo
- `Fotos Para Potifolio/`, os prints e o briefing são originais: nunca editar, mover, renomear nem recomprimir. Versões web são geradas como cópias derivadas.
- Não publicar dados dos insights do Instagram, preços ou nomes de pacotes sem confirmação. Exceção confirmada em 16/11/2026: os planos e valores do documento mestre, dentro do atendimento.

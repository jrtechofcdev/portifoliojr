# Portfólio Jr_Tech_OFC

Portfólio de fotografia de José Renato Alves da Silva (Jr_Tech_OFC Fotografia, "Nossa Arte, Seu Sucesso!"), Imperatriz e Bacabal, MA.

## Estado atual
Fases 0 a 6 concluídas na parte do desenvolvimento em 08/11/2026 (ver `RELATORIO_ENTREGA.md`). Site em produção em https://portifolio.jrtechofc.com.br (Vercel publica a cada push no `main`). Nada de `git push`, deploy ou publicação sem ele. Documento principal: `PLANO_GERAL_PORTFOLIO.md`. Manutenção: `README.md`. Dúvidas em aberto: `PENDENCIAS_E_DECISOES.md`.

Revisão de 09/11/2026: visual "álbum de couro" (DESIGN.md §0) e curadoria pelo fotógrafo em `/curadoria`. Autorizações de imagem confirmadas pelo responsável em 09/11/2026.

Revisão de 13/11/2026: curadoria final feita pelo fotógrafo (14 álbuns). Novo visual "fotos em tela cheia", celular Android primeiro, com Stories e bastante movimento (DESIGN.md §0b). A pasta do Bombeiro Mirim (BM) não está na cópia das fotos deste computador.

Revisão de 13/11/2026 (tarde): site publicado no GitHub e na Vercel. Refinada de luxo (DESIGN.md §0c): capa de couro que abre na home, símbolo da marca em SVG, assistente de escolha de duas perguntas, costura mais fina, transição entre páginas. Álbum "Dália" corrigido para "Dalila" (`/trabalhos/dalila`, redirect do endereço antigo no `vercel.json`).

Revisão de 13/11/2026 (noite): repaginada da home (DESIGN.md §0d): álbuns em capítulos por tipo de trabalho, assistente com fotos nas respostas, "Como funciona" e "Sobre" em páginas de papel creme, botão de WhatsApp que encolhe ao rolar.

Revisão de 13/11/2026 (noite): prévia de compartilhamento (DESIGN.md §0e): capa de couro em `public/capa-compartilhamento.jpg`, textos em `CAPA_SOCIAL`, endereço oficial fixo em `astro.config.mjs`.

Revisão de 13/11/2026 (noite): edição de luxo e plano comercial (DESIGN.md §0f): ícones próprios, abertura do álbum como objeto, fotos que se alternam na abertura, serviços com orçamento, destaques na ordem do fotógrafo (`DESTAQUES`), capa alternada nas Bodas de Ouro (`capaAlternativa`), rodapé novo.

Revisão de 13/11/2026 (noite): plano de melhorias (DESIGN.md §0g): foto do livro da Sabrina na abertura, com a foto num palco ao lado do texto; textos novos; botão "Solicitar orçamento" em todo o site (`CHAMADA`); categorias numa fonte só (`CAPITULOS`); chamada final e rodapé compacto; ícone de álbum em perspectiva; textos alternativos de todas as fotos.

Revisão de 14/11/2026: versão final escolhida pelas modelos (13 álbuns, 313 fotos). Cada álbum tem só o que a modelo marcou como Destaque ou Álbum; foto sem marca fica fora. Saíram "Dalila & Maria" e "Feira de Ciências". "Tia Josiana" corrigido para "Tia Josina" (`/trabalhos/tia-josina`, redirect no `vercel.json`; a pasta dos originais mantém o nome antigo). Fotos em qualidade mais alta: 480 a 2400 px, AVIF 62 e WebP 82 (`scripts/fotos.mjs`).

Revisão de 14/11/2026 (tarde): curadoria encerrada e retirada do projeto. Saíram a página `/curadoria`, a escolha pelas modelos (pasta `escolha/`, Worker e banco D1 do Cloudflare apagados, endereço `/escolha` desligado) e os scripts ligados a elas. Os álbuns agora são mantidos direto nos manifestos (`src/content/ensaios/*.yaml`).

## Comandos
- Mudar as fotos de um álbum: editar o YAML do ensaio (lista `fotos` na ordem do álbum, `capa`, `abertura`, `alt` de cada foto), depois `npm run fotos:publicar` e `npm run build`. Passo a passo no `README.md`.
- `npm run dev`: gera as fotos (inclui pendentes, com aviso) e abre o site; `/sistema` mostra tokens, tipos e todas as fotos.
- `npm run build`: fotos só com `autorizacao: sim`, `astro check`, build e `scripts/verificar-dist.mjs`.
- `npm run build:previa`: site completo com fotos pendentes e `noindex`, só para revisão local (`npm run preview`).
- `npm run test:bloqueio`: prova que foto pendente não gera arquivo em produção.
- Ensaios: um YAML por ensaio em `src/content/ensaios/` (esquema em `src/content.config.ts`). Siglas de pasta em `src/data/pastas.json`.
- A primeira geração de fotos leva cerca de 20 min; depois usa `.cache/fotos/`.
- `npm run icones`: gera os ícones do site (álbum em perspectiva: `favicon.svg`, `favicon.ico`, PNGs da aba e da tela inicial do celular).
- `npm run capa`: gera a capa de compartilhamento (prévia do link no WhatsApp) com o Edge ou o Chrome da máquina. Textos no próprio script e em `CAPA_SOCIAL`.

## Skills obrigatórias (instaladas globalmente, ver `RELATORIO_SKILLS.md`)
- Direção visual: leia `DESIGN.md` antes de qualquer interface. Ele é a direção exigida pela regra R-37 do Anti-Slop e a base da Taste Skill.
- Interface: `design-taste-frontend` (método, sistema e verificação em navegador) com `antislop`, `antislop-ui` e `antislop-layoutmobile` como filtro.
- Texto do site: `antislop-copywriting`. Sem travessão (R-02), sem números, depoimentos ou anos de experiência inventados.
- Acessibilidade: `antislop-human` (contraste, teclado, foco, estados).
- Código: `antislop-code`.
- Antes de entregar: Delivery Gate do Anti-Slop e `gate.mjs` da Taste Skill, com o resultado PASS/FAIL apresentado.

## Exceções a estas skills, específicas deste projeto
- **Nunca usar fotos substitutas, de banco ou geradas por IA**, mesmo que a Taste Skill sugira stand-ins. Só fotografias reais de `Fotos Para Potifolio/`, com autorização confirmada em `CURADORIA_E_INVENTARIO_DE_ASSETS.md`.
- Sem shaders, cenas 3D, parallax ou efeitos de demonstração. Fotografia de pessoas não é site de tecnologia. Exceções pedidas pelo cliente: a textura de couro e, desde 13/11/2026, "bastante movimento" (DESIGN.md §0b: Stories, zoom lento na abertura, entradas ao rolar só com CSS) e a capa de couro que abre na home (§0c, refeita em §0f), e desde a noite de 13/11/2026 a troca de fotos na abertura, a capa alternada, o reflexo nos cartões e o selo que gira ao rolar (§0f).

## Regras de arquivo
- `Fotos Para Potifolio/`, os prints e o briefing são originais: nunca editar, mover, renomear nem recomprimir. Versões web são geradas como cópias derivadas.
- Não publicar dados dos insights do Instagram, preços ou nomes de pacotes sem confirmação.

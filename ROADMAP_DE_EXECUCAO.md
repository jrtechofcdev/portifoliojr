# Roadmap de execução

Esforço relativo: **P** (pequeno), **M** (médio), **G** (grande). Sem prazos em dias.
Responsável: **JR** = José Renato · **DEV** = desenvolvimento (Claude Code).
Cada fase só começa com a anterior aceita, salvo onde está indicado "em paralelo".

---

## Fase 0: diagnóstico e planejamento ✅ aprovada em 08/11/2026
Entregues: os 8 documentos, `CLAUDE.md` e as skills globais.

## Fase 1: conteúdo e decisões (JR, com apoio do DEV)
| # | Tarefa | Quem | Esforço | Depende de | Aceite |
|---|---|---|---|---|---|
| 1.1 | Responder `PENDENCIAS_E_DECISOES.md`, bloco A | JR | M | n/a | cada item bloqueador com resposta escrita |
| 1.2 | Autorizações de imagem das pessoas destacadas | JR | M | n/a | lista por ensaio: autorizado / não / só sem rosto |
| 1.3 | Enviar o logo em vetor (SVG/PDF/AI) ou PNG transparente grande | JR | P | n/a | arquivo na pasta `Marca/` |
| 1.4 | Retrato do José Renato (ou decisão de não ter) | JR | P | n/a | foto na pasta ou decisão registrada |
| 1.5 | Prints de `@jose_renato_b` | JR | P | n/a | prints na raiz; DEV atualiza a auditoria |
| 1.6 | Instalar Chromium e ffmpeg (`sudo apt install chromium ffmpeg`) | JR | P | n/a | `chromium --version` e `ffprobe -version` respondem |
| 1.7 | DEV revisa os 6 vídeos e o linkfly | DEV | P | 1.6 | auditoria atualizada com duração, conteúdo e uso |
| 1.8 | Aprovar a seleção final de fotos por ensaio | JR | M | 1.2 | curadoria marcada "aprovada" |
| 1.9 | Aprovar os textos-rascunho do mapa do site | JR | P | n/a | textos marcados "aprovados" |
| 1.10 | Decidir hospedagem e domínio | JR | P | n/a | pode esperar até a Fase 6 |

## Fase 2: base técnica (DEV, em paralelo com o fim da Fase 1) ✅ concluída em 08/11/2026
Resultado: Astro 7.4.7, TypeScript 6 estrito, 8 manifestos com 85 fotos, média de 92 KB por AVIF em 1200 px, teste de bloqueio 5/5 PASS, build de produção sem nenhuma foto (todas pendentes), 1.341 originais com SHA-1 idêntico antes e depois. Kiara não tem manifesto até haver autorização.
| # | Tarefa | Esforço | Aceite |
|---|---|---|---|
| 2.1 | `git init`, `.gitignore` (exclui `Fotos Para Potifolio/`, `taste-skill/`, `anti-slop/`, `dist/`, `.taste-skill/`) | P | repositório criado sem os originais versionados |
| 2.2 | Projeto Astro (versão estável atual) com npm, TypeScript estrito, sem framework de UI | P | `npm run dev` e `npm run build` sem erro |
| 2.3 | Tokens CSS do `DESIGN.md` (cores, tipo, espaçamento) e fonte Archivo auto-hospedada | P | página de teste com a escala tipográfica nas 4 larguras |
| 2.4 | Content collection `ensaios` com schema (slug, nome, categoria, cidade, data, tema, capa, fotos[], autorizacao) | M | build falha se faltar campo ou se uma foto não existir |
| 2.5 | Pipeline de imagens: leitura dos originais por caminho (normalizando NFD), derivados AVIF/WebP/JPEG em 5 larguras, LQIP, EXIF removido nos derivados | M | originais com hash idêntico antes e depois do build; peso médio por foto em 1200 px abaixo de 250 KB |
| 2.6 | Bloqueio de publicação: foto com `autorizacao != "sim"` não entra no build de produção | P | teste com uma foto pendente não gera arquivo em `dist/` |

## Fase 3: estrutura e páginas (DEV)
| # | Tarefa | Esforço | Aceite |
|---|---|---|---|
| 3.1 | Layout base: cabeçalho, navegação com menu móvel, rodapé, link "pular para o conteúdo" | M | navegação completa só com teclado; menu móvel com foco preso e Esc |
| 3.2 | Início com as 8 seções do mapa | G | Taste Skill: screenshots em 390/768/1024/1440 sem rolagem horizontal; abertura com CTA visível sem rolar em 390×844 |
| 3.3 | `/trabalhos` com filtro | M | filtro funciona sem JS (mostra tudo) e com JS (`aria-pressed`, URL `?c=`) |
| 3.4 | Modelo de página de ensaio, com temas claro e escuro | M | as 8 páginas geradas pelo manifesto, sem página escrita à mão |
| 3.5 | 404 | P | rota inexistente mostra a página com links |

## Fase 4: galerias (DEV)
| # | Tarefa | Esforço | Aceite |
|---|---|---|---|
| 4.1 | Lightbox `<dialog>`: setas, Esc, ← →, deslizar, contador, foco devolvido | M | teste manual com teclado e celular; `prefers-reduced-motion` respeitado |
| 4.2 | Sequência editorial (vertical, par, sangria) dirigida pelo manifesto | M | nenhuma foto cortada fora da abertura |
| 4.3 | Carregamento: `fetchpriority` na abertura, `lazy` no resto, `sizes` corretos | P | LCP abaixo de 2,5 s em 4G simulado (`perf.mjs` da Taste Skill ou Lighthouse) |

## Fase 5: conversão e presença (DEV + JR)
| # | Tarefa | Quem | Esforço | Aceite |
|---|---|---|---|---|
| 5.1 | Links de WhatsApp com mensagem, mailto e Instagram | DEV | P | cada link testado em celular real pelo JR |
| 5.2 | Barra fixa de WhatsApp no celular nas páginas de ensaio | DEV | P | não cobre conteúdo; some no rodapé |
| 5.3 | Metadados, Open Graph por página, `sitemap.xml`, `robots.txt`, JSON-LD | DEV | P | prévia correta ao colar o link no WhatsApp |
| 5.4 | Revisão final dos textos com `antislop-copywriting` | DEV | P | zero travessões, zero afirmações sem fonte |
| 5.5 | Trocar o link da bio do Instagram para o site | JR | P | após publicação |

## Fase 6: qualidade e publicação (DEV + JR)
| # | Tarefa | Quem | Esforço | Aceite |
|---|---|---|---|---|
| 6.1 | `gate.mjs` e `consistency.mjs` da Taste Skill | DEV | M | nenhum FAIL corrigível restante |
| 6.2 | Delivery Gate do Anti-Slop | DEV | P | relatório PASS/FAIL apresentado ao JR |
| 6.3 | Acessibilidade: teclado, contraste (`contrast-check.py`), leitor de tela básico, `alt` em todas as fotos | DEV | M | sem erro no checker; navegação completa sem mouse |
| 6.4 | Lighthouse em celular | DEV | P | Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO ≥ 95 |
| 6.5 | Teste em celular Android real e num desktop | JR | P | aprovação escrita |
| 6.6 | Deploy na hospedagem escolhida e domínio | DEV + JR | P | site no ar com HTTPS; build reproduzível pelo README |
| 6.7 | README de manutenção: como adicionar um ensaio novo | DEV | P | JR consegue seguir os passos sozinho |

---

## Riscos
| Risco | Efeito | Mitigação |
|---|---|---|
| Autorizações não obtidas | menos ensaios publicáveis | o build bloqueia fotos pendentes; o site funciona mesmo com 4 ensaios |
| Sem logo em vetor | marca pixelada | não redesenhar o logo; usar PNG grande provisório só com aprovação |
| Sem retrato do fotógrafo | seção Sobre fraca | texto e foto de trabalho; nunca avatar genérico |
| Peso das imagens (PNG de 3–4 MB, Irenilde com 8192 px) | site lento | derivados AVIF e larguras limitadas; originais nunca servidos |
| Chromium ausente | verificação visual da Taste Skill impossível | tarefa 1.6 antes da Fase 3 |
| Categoria casal com um único ensaio forte | pouca prova | nomear "Casais e gestantes"; acrescentar quando houver ensaio novo |
| Nomes de arquivo com emoji e NFD | falhas de caminho no build | normalização na pipeline, teste na tarefa 2.5 |

# Plano geral do portfólio Jr_Tech_OFC

Versão 1.0, 08/11/2026. Fase 0 concluída e aguardando aprovação. **Nenhum código da aplicação foi escrito.**

Documentos de apoio:
| Documento | Para quê |
|---|---|
| `AUDITORIA_VISUAL_E_INSTAGRAMS.md` | prints, canais, identidade observada, vídeos |
| `CURADORIA_E_INVENTARIO_DE_ASSETS.md` | cada pasta classificada, as fotos escolhidas com caminho e o inventário completo |
| `MAPA_DO_SITE_E_CONTEUDO.md` | páginas, seções, textos-rascunho, CTAs, imagens |
| `DESIGN.md` | direção visual que guia Taste Skill e Anti-Slop |
| `ROADMAP_DE_EXECUCAO.md` | fases, tarefas, esforço, aceite, riscos |
| `PENDENCIAS_E_DECISOES.md` | o que só você pode responder |
| `RELATORIO_SKILLS.md` | prova da instalação das skills |
| `CLAUDE.md` | regras para as próximas sessões do Claude Code |

---

## 1. Resumo executivo

A Jr_Tech_OFC tem material real e suficiente para um portfólio forte: **8 trabalhos publicáveis** (4 ensaios jovens externos, 1 ensaio de casal gestante e 3 eventos gospel e celebrações). Os melhores são de 2025–2026. Hoje o Instagram profissional é a única vitrine, e em 30 dias levou só 4 pessoas ao link da bio.

O site proposto é pequeno e direto: uma página inicial longa, um índice de trabalhos e uma página por ensaio. O fundo é escuro, o tipo é condensado e grande (um gesto que já aparece na capa do ensaio Sabrina feita pelo próprio José Renato), as fotos ficam em primeiro plano e o WhatsApp está a um toque. Tecnicamente, é um site estático em Astro que gera versões leves das fotos sem tocar nos originais.

O que segura a publicação são **autorizações de imagem** (há menores e uma cena íntima no acervo), o **logo em arquivo** e o **teste do WhatsApp**. O que segura só a seção "Sobre" é um **retrato do fotógrafo** e os **prints do Instagram pessoal**.

## 2. Diagnóstico

| Pergunta (briefing 9.1) | Resposta |
|---|---|
| O que já existe no repositório? | Nenhuma aplicação. Existem o briefing, 4 prints, 16 pastas de fotos (1.335 imagens, 6 vídeos, cerca de 4,2 GB) e dois clones antigos e incompletos das skills. [CONFIRMADO NO REPOSITÓRIO] |
| Pronto, incompleto, quebrado, ausente? | Pronto: o acervo fotográfico, editado no Lightroom. Ausente: código, git, logo em arquivo, retrato, bastidores, textos institucionais confirmados. Quebrado: os clones das skills na raiz (arquivos apagados). |
| Stack real? | Não há. Recomendo **Astro estático**: o site é só conteúdo e imagem, o Node 22 já está instalado, não precisa de servidor, o pipeline de imagens é nativo e a manutenção é simples. [RECOMENDAÇÃO] |
| O que reaproveitar? | As fotos (por referência, sem copiar nem alterar), a linguagem da `SabrinaCapa.png` e as cores do logo. |
| Riscos técnicos prioritários | Peso das imagens (PNG de 3–4 MB, arquivos de 8192 px); nomes de pasta com emoji e acentos decompostos; ausência de Chromium para a verificação visual. |

## 3. Objetivos
1. Fazer o visitante entender em segundos **o que** a Jr_Tech_OFC faz, **onde** atende e **como** chamar.
2. Mostrar profundidade: ensaios inteiros, não só fotos soltas.
3. Transformar visitas do Instagram em conversas no WhatsApp.
4. Ter uma base que José Renato consiga atualizar com ensaios novos.

## 4. Público
Dados do próprio Instagram, uso interno: 60,4% mulheres, 68,7% entre 18 e 34 anos. [OBSERVADO NA IMAGEM/PRINT]
1. **Jovens (principalmente mulheres de 18 a 34)** que querem um ensaio externo só seu. É o público principal, e o ensaio mais visto (Sabrina) é desse tipo.
2. **Casais e gestantes.**
3. **Congregações e famílias** que organizam cultos, confraternizações, aniversários e bodas.
4. Secundário: pessoas e pequenos negócios que precisam de retrato para divulgação (exemplo: Tia Josiana).

## 5. Posicionamento e mensagem

- **Mensagem central** (rascunho): "Fotografia natural de pessoas. Ensaios externos, casais e celebrações em Imperatriz e Bacabal, MA."
- **Proposta de valor:** fotografia com direção leve (pose orientada sem rigidez), luz natural, edição própria e atendimento direto com o próprio fotógrafo.
- **Como apresentar José Renato e a marca:** a marca é Jr_Tech_OFC Fotografia, e quem atende é José Renato. O site fala em primeira pessoa na seção Sobre e no contato, porque é um profissional independente.
- **Perfil profissional e pessoal:** só o `@jose_renato_a` aparece no site por enquanto. O `@jose_renato_b` aguarda análise.
- **Especialidades sem prometer demais:** só as três frentes com ensaios publicados. Vídeo e edição aparecem como frase no Sobre, se confirmados; criação visual não aparece na v1. Sem casamento, sem preços, sem pacotes, sem estúdio.
- **Assinatura:** "Nossa Arte, Seu Sucesso!" no rodapé, junto ao logo, e não como título.

## 6. Direção visual
Detalhada em `DESIGN.md`. Resumo:
- Base `#141414` com o grafite oficial `#292929` em superfícies. Fundo creme `#F2EEE6` nos ensaios de luz diurna.
- Verde `#00FCA8` só no botão de ação e no foco; ciano `#1CDAFF` só no logo.
- Archivo condensada, enorme, para nomes e títulos; Archivo normal para texto.
- Fotos em proporção original, sem filtros, sem cartões, sem efeitos. Movimento mínimo.
- Dial Anti-Slop: ENERGY 2 / RHYTHM 2 / MOTION 1.

## 7. Arquitetura e conteúdo
Detalhado em `MAPA_DO_SITE_E_CONTEUDO.md`.
- `/`: abertura (`SY/IMG_1081.jpg`) · três frentes · ensaio em destaque (Sabrina) · pausa · mais trabalhos · como funciona · sobre · contato.
- `/trabalhos`: índice com filtro.
- `/trabalhos/[ensaio]`: 8 páginas, mais Kiara se autorizada.
- Escolhi multipágina enxuta porque são 8 ensaios com 6 a 16 fotos: numa página única a home ficaria pesada e os ensaios não teriam link próprio para compartilhar.

## 8. Curadoria
Detalhada em `CURADORIA_E_INVENTARIO_DE_ASSETS.md`.
| Categoria | Trabalhos | Destaque |
|---|---|---|
| Ensaios externos | Sabrina (estudo de caso principal), Sara & Yasmin, Dalila & Maria, Dália | `SAB/sabrina-20.png`, `SY/IMG_1081.jpg` |
| Casais e gestantes | Marlieth & Paulo | `MP/Foto (18).jpg` |
| Eventos e celebrações | Manhã com Deus, Confra Juventude Estrela de Luz, Bodas de Ouro (e Kiara, se autorizada) | `MCD/IMG_0690.jpg`, `BO/Wedding Anniversary (20).jpg` |
| Fora da v1 | Victor & Tamires, Vitória Emanuela, Irenilde, Adrian (celular ou fraco); Feira de Ciências, Bombeiro Mirim (menores, institucional) | n/a |

Estudos de caso com informação suficiente: Sabrina (tem capa, cidade e data) e Marlieth & Paulo (data, ensaio gestante). Os demais têm data pelo nome da pasta, mas não têm local nem contexto. Viram galerias com ficha mínima até você completar.

Para manter a consistência sem esconder a variedade, ficam de fora as fotos com saturação exagerada e as de celular, e a ordem prioriza o trabalho mais recente.

## 9. Funcionalidades
| Funcionalidade | Classe | Custo / dependência | Impacto |
|---|---|---|---|
| Galeria editorial por ensaio | essencial | M / manifesto | núcleo do site |
| Visualização ampliada (lightbox `<dialog>`) | essencial | M / nenhum pacote | baixo peso, acessível |
| Botão WhatsApp com mensagem pronta + barra fixa no celular | essencial | P / número confirmado | principal conversão |
| E-mail e Instagram | essencial | P | n/a |
| Metadados, Open Graph, sitemap, JSON-LD | essencial | P | prévia bonita no WhatsApp; busca local |
| Filtro por categoria no índice | desejável | P / funciona sem JS | 8 trabalhos justificam |
| Bloqueio de fotos não autorizadas no build | essencial | P | segurança jurídica |
| Trechos de vídeo | futura | M / ffmpeg + confirmação | depende da revisão dos vídeos |
| Formulário de orçamento | futura | M / serviço externo ou backend | o WhatsApp resolve na v1 |
| Página `/sobre` própria | futura | P / retrato e biografia | quando houver conteúdo |
| Blog, depoimentos, preços | não planejado | n/a | não há conteúdo comprovado |

## 10. Arquitetura técnica
- **Stack:** Astro (versão estável vigente na Fase 2), npm, TypeScript, CSS próprio com tokens, `@fontsource-variable/archivo`. Sem React, Tailwind ou biblioteca de animação, porque nada no plano precisa disso.
- **Pastas propostas:**
  ```
  src/
    content/ensaios/*.yaml     manifesto de cada ensaio (fotos por caminho, ordem, tema, autorização)
    components/                Cabecalho, Rodape, Abertura, Frentes, Sequencia, Lightbox, BotaoWhatsApp
    layouts/Base.astro
    pages/index.astro, trabalhos/index.astro, trabalhos/[slug].astro, 404.astro
    styles/tokens.css, base.css
  public/marca/                logo (quando enviado)
  ```
- **Imagens:** originais lidos de `Fotos Para Potifolio/` só no build; derivados AVIF, WebP e JPEG em 480, 800, 1200, 1600 e 2400 px; LQIP; EXIF removido nos derivados; os originais nunca são versionados nem publicados.
- **Responsividade:** mobile-first, verificada em 390, 768, 1024 e 1440 px.
- **Acessibilidade:** AA, teclado completo, foco visível, `alt` factual, `prefers-reduced-motion`.
- **SEO:** título e descrição por página, OG por página, sitemap, JSON-LD `ProfessionalService` com área de atendimento e sem endereço.
- **Segurança e privacidade:** site estático, sem coleta de dados, sem cookies de rastreamento na v1; fotos sem autorização bloqueadas no build; insights do Instagram nunca publicados.
- **Desempenho:** meta de LCP abaixo de 2,5 s em 4G e Lighthouse Performance ≥ 90 em celular.
- **Hospedagem:** pendente. Cloudflare Pages, Netlify ou Vercel atendem no plano gratuito.

## 11. Fases e prioridades
Detalhado em `ROADMAP_DE_EXECUCAO.md`.
| Fase | Conteúdo | Esforço | Quem |
|---|---|---|---|
| 0 | Planejamento (esta entrega) | concluída | DEV |
| 1 | Autorizações, logo, retrato, decisões, Chromium | M | JR |
| 2 | Base técnica e pipeline de imagens | M | DEV |
| 3 | Páginas | G | DEV |
| 4 | Galerias | M | DEV |
| 5 | Conversão e SEO | P | DEV + JR |
| 6 | Qualidade (Taste gate, Anti-Slop Delivery Gate, Lighthouse) e deploy | M | DEV + JR |

Dependências críticas: a Fase 3 precisa de Chromium (1.6) para a verificação; a publicação (6.6) precisa das autorizações (1.2) e do WhatsApp testado (5.1).

## 12. Riscos e pendências
Riscos e mitigações: `ROADMAP_DE_EXECUCAO.md`, seção final. Perguntas: `PENDENCIAS_E_DECISOES.md` (7 bloqueadoras, 8 importantes, 5 que podem esperar).

## 13. Critérios de conclusão do portfólio
- Em 390×844, a abertura mostra o que é, onde atende e o botão de WhatsApp sem rolar.
- As 8 páginas de ensaio são geradas pelo manifesto, com fotos reais, autorizadas e com proporção preservada.
- Nenhum número, depoimento, cliente, preço ou tempo de experiência sem confirmação.
- Todos os links (WhatsApp, e-mail, Instagram) testados em celular real.
- Taste Skill `gate.mjs` sem FAIL corrigível; Delivery Gate do Anti-Slop com PASS; Lighthouse dentro das metas.
- Originais em `Fotos Para Potifolio/` byte a byte idênticos ao início do projeto.
- README permite adicionar um ensaio novo sem ajuda.

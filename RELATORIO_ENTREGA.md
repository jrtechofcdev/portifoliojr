# Relatório de entrega: Fases 1.7 e 2 a 6

Data: 08/11/2026. Autorizado pelo responsável a seguir até o fim sem parar entre fases, com commits e textos-rascunho do mapa do site.

## 1. O que foi entregue

- Site completo em Astro 7.4.7: início com 8 seções, `/trabalhos` com filtro, 8 páginas de ensaio geradas pelos manifestos, 404, `sitemap.xml`, `robots.txt`, Open Graph por página e JSON-LD `ProfessionalService`.
- Galeria editorial (vertical, par, horizontal em sangria) com visualização ampliada em `<dialog>`.
- Barra de WhatsApp fixa no celular nas páginas de ensaio, com mensagem que cita o ensaio.
- Bloqueio de publicação: com todas as autorizações pendentes, `npm run build` gera só texto (3 páginas, nenhuma foto). `npm run build:previa` mostra o site completo com `noindex`.
- `README.md` de manutenção (tarefa 6.7).
- Vídeos revisados (tarefa 1.7): nenhum entra na v1. Detalhes em `AUDITORIA_VISUAL_E_INSTAGRAMS.md` §4.4.
- Clones antigos `taste-skill/` e `anti-slop/` apagados, com autorização.

## 2. Testes executados

| Teste | Resultado |
|---|---|
| `astro check` (TypeScript estrito) | 0 erros, 0 avisos |
| `npm run build` (produção) | PASS; `verificar-dist`: 0 arquivos de foto em `dist/` |
| `npm run test:bloqueio` | 5/5 PASS |
| Originais (`Fotos Para Potifolio/`, 1.341 arquivos) | SHA-1 idêntico antes e depois de todas as fases |
| Interação no Chromium (CDP), 22 verificações | 22/22 PASS: menu móvel (abre, foco, Esc, foco volta), visualização ampliada (abre, contador, ← →, foto grande, alt, Esc, foco volta), filtro (Eventos, `?c=`, `aria-pressed`, abrir já filtrado), barra de WhatsApp (aparece, some no rodapé), link `wa.me` |
| Rolagem lateral | nenhuma em 7 páginas × 6 larguras (320, 390, 768, 1024, 1280, 1440) |
| Contraste (`contrast-check.py`) | todos os pares PASS AA, o menor é 4,64:1 (`--verde-escuro`/`--papel`) |
| `perf.mjs` (Taste Skill) | início: 0 FAIL, 0 WARN; LCP relativo 60 ms; layout shift 0,000; 0 tarefas longas |
| `copy-lint.mjs` | 0 FAIL em 5 páginas; 1 WARN mantido: o slogan "Nossa Arte, Seu Sucesso!" é do responsável |
| `check.mjs` (layout, 5 tamanhos) | nenhuma colisão, corte ou transbordamento; só os achados da regra "uma tela por seção" (ver §3) |

**Não medido:** Lighthouse (não instalado; o `perf.mjs` cobriu peso, LCP e layout shift em CPU relativa, não em 4G real). Teste em celular Android real e o link do WhatsApp num aparelho: tarefa do responsável (6.5).

## 3. Gate da Taste Skill: `GATE: OPEN 35 (rounds used up)`

Três rodadas. Corrigido no caminho: rolagem lateral de 1024 a 1280 px, anel de foco removido no `main`, alvo de toque do link do Instagram, abertura com exatamente uma tela, hierarquia de títulos (h2 maior que o h1), margens de 72 px no desktop, espaçamento igual entre seções, Sobre na grade de 12 colunas, link secundário sem estado de hover, URLs `/trabalhos` reais (formato diretório).

**Dispensas (5, o máximo):**
1. `phone-number` no rodapé: é o WhatsApp comercial dado pelo briefing.
2. `phone-number` no botão: idem, é a ação principal do site.
3. `copy-fact`: o lugar (Imperatriz e Bacabal, MA) está na primeira tela, logo abaixo do h1.
4. `moment-none`: o `DESIGN.md` define MOTION 1 e proíbe reveal ao rolar.
5. `text-only` no contato: o `DESIGN.md` pede o fecho em tipo grande.

**FAILs abertos, todos por conflito com o `DESIGN.md` aprovado:**
- `section-height`, `screen-height`, `screen-short`, `one-section`, `one-heading`, `section-tile`, `neighbour` (17): a Taste Skill exige que toda seção tenha exatamente uma ou duas telas de altura. O `DESIGN.md` pede ritmo editorial com composição própria por seção (RHYTHM 2). Forçar cada seção a 100vh deixaria espaço vazio ou cortaria fotos.
- `container-edges`, `edge-left`, `row-lines` (8): a abertura dividida e a foto em sangria vão de borda a borda de propósito (`DESIGN.md` §5).
- `top-stagger` (2): as três frentes com alturas diferentes e o destaque alinhado pela base são pedidos do `MAPA` §2.2 e do `DESIGN.md` §4.
- `no-visual` (2): "Outros ensaios e eventos" (lista em tipo grande, com prévia no hover) e "Como funciona" (texto puro, sem ícones, por decisão do `DESIGN.md`).
- `section-air`, `split-pair`, `neighbour-ground` (4): espaçamentos e alinhamentos medidos pelo sistema da Taste Skill.
- `copy-headings` (1): o verificador não reconhece substantivos em português ("Casais e gestantes", "Conversa").
- `phone-number` (1): a mesma ocorrência do WhatsApp em outro botão, além das duas dispensadas.

## 4. Delivery Gate do Anti-Slop

### Bloco 1: Hard Gate (todas as respostas devem ser "não")
- R-02 PASS: `grep` por travessão em `src/`, `scripts/` e nos documentos do projeto: nenhum.
- R-03 PASS: sem rolagem lateral em 6 larguras × 7 páginas (teste CDP); alvos de toque de 44 px; o menu funciona no celular.
- R-17 PASS: nenhum número ou estatística no site; "2+ anos" ficou fora até confirmação.
- R-18 PASS: nenhum depoimento.
- R-23 PASS com placeholder declarado: não há logo em arquivo, então o cabeçalho usa o nome "Jr_Tech_OFC" em texto, sem redesenhar o símbolo. O favicon "JR" em texto é provisório até o logo chegar (PENDENCIAS item 6). Sem retrato, a seção Sobre usa uma foto de trabalho (MP `Foto (6).jpg`).
- R-24 PASS: Trabalhos → `/trabalhos`, Sobre → `/#sobre`, Contato → `/#contato`, todos existem.
- R-25 PASS: todos os pares de cor medidos, o menor é 4,64:1.
- R-26 PASS: cada botão tem ação real (menu, fechar, anterior, próxima, filtros), testada no CDP.
- R-27 PASS: estado vazio em `/trabalhos` ("Os trabalhos entram aqui..." e "Nenhum trabalho nesta categoria"); carregamento com cor dominante e LQIP de cada foto; erro de imagem cai no texto `alt` sobre a cor dominante.
- R-28 PASS: não há FAQ.
- R-32 PASS: Tab, Enter e Esc testados no menu e na visualização ampliada; anel de foco de 2 px verde (verde-escuro no tema claro); link "Pular para o conteúdo".
- R-33 PASS: tudo escrito na fonte, nenhum script de remendo.
- R-34 PASS: sem alternador de tema; o tema claro e o escuro de cada ensaio foram conferidos em captura (Sabrina claro, Sara & Yasmin escuro).
- R-35 PASS: builds executados e cada controle exercitado no Chromium (seção 2).
- R-36 PASS: nenhuma afirmação de desempenho ou de clientes no site.
- R-37 PASS: direção no `DESIGN.md`, dials ENERGY 2 / RHYTHM 2 / MOTION 1.
- R-38 PASS: nenhum conteúdo inventado; cidade só onde há evidência (Bacabal na capa da Sabrina).
- R-39 PASS: botões nativos com `cursor: pointer`, hover e estado ativo; todas as fotos com `alt`; `lang="pt-BR"`, `<title>` único e landmarks; zoom não bloqueado; `prefers-reduced-motion` desliga as transições.
- R-40 PASS: toda imagem com `width` e `height`; abertura com `fetchpriority="high"` e `loading="eager"`; nenhum script de terceiros; os números citados aqui foram medidos.

### Bloco 2: Purpose-Gate
- R-01 PASS: nenhum degradê ou brilho.
- R-04 PASS: nenhum ícone.
- R-06 PASS: Archivo condensada vem do gesto da `SabrinaCapa.png` (`DESIGN.md` §1). Os rótulos pequenos em caixa alta com espaçamento largo foram retirados.
- R-07 PASS: sem grade ou pontos no fundo.
- R-08 PASS: sem setas decorativas; a visualização ampliada usa "Anterior" e "Próxima" em texto.
- R-09 PASS: a única etiqueta é "autorização pendente", só no desenvolvimento e na prévia, com função real.
- R-10, R-12, R-13 PASS: sem vidro, sem sombras, sem brilho.
- R-14 PASS: as três frentes têm alturas diferentes de propósito.
- R-19 PASS: só transições de 150 a 200 ms em hover, foco e abertura do diálogo (MOTION 1).
- R-22 PASS: nenhuma ilustração, só fotografias reais do acervo.

### Bloco 3: Vida (todas as respostas devem ser "sim")
- Dials declarados: SIM (ENERGY 2 / RHYTHM 2 / MOTION 1).
- Coerente com os dials: SIM. Cada seção tem composição própria: abertura dividida, três colunas desencontradas, destaque assimétrico, foto em sangria, lista em tipo grande, lista numerada, Sobre sobre grafite, contato em tipo grande.
- Um ponto focal por tela: SIM, uma fotografia ou um título de cartaz.
- Espaço em branco estrutural: SIM, um só respiro entre seções (`--secao`).
- Um acento deliberado: SIM, o verde só no botão de WhatsApp e no foco.
- Motivo de identidade: SIM, o nome da pessoa em tipo condensado enorme em cada ensaio, o gesto da `SabrinaCapa.png`.
- Design Read antes de gerar: SIM (`DESIGN.md`).

### Bloco 4: Acabamento (todas as respostas devem ser "não")
- C-1 a C-5: não. Cada escolha tem motivo no `DESIGN.md`, todos os controles funcionam, não há seção de enchimento, nada quebra sem mouse, nada é inventado.
- R-05: não. "Como funciona" tem 5 passos de texto, não há faixa de logos nem cartões iguais.
- R-11: não. Raio de 2 px em tudo, nada em pílula.
- R-15: não. Os CTAs são "Chamar no WhatsApp", "Ver trabalhos" e "Ver o ensaio completo de Sabrina".
- R-16: não há palavras de marketing vazias.
- R-20: não. Fotos reais de pessoas de Imperatriz e Bacabal e tipografia de cartaz tirada da capa do próprio fotógrafo.
- R-21: não. O fundo escuro tem motivo de marca (grafite oficial e `SabrinaCapa.png`), e os ensaios de luz do dia usam tema claro.
- R-29: não. Quatro tons neutros, um verde de ação e o ciano só no hover.
- R-30: não é cópia de nenhum produto conhecido.
- R-31: não. Cada decisão está escrita no `DESIGN.md` ou neste relatório.

**Resultado: PASS.**

## 5. Desvios do `DESIGN.md`, com motivo

- O cabeçalho tem fundo sólido desde o topo, não só depois de rolar: a abertura no celular começa colada ao cabeçalho e o texto sobre a foto perderia contraste.
- Os títulos de seção da home usam um degrau abaixo do h1 (`--h2`, até 92 px), em vez do display XL de 220 px, para manter a hierarquia real de títulos (acessibilidade e gate).
- O botão verde do cabeçalho fica visível junto com o da abertura: escondê-lo deixava a navegação torta para o verificador. Os dois levam ao mesmo WhatsApp.
- Nas páginas de tema claro, o botão é verde-escuro com texto papel, porque o `DESIGN.md` proíbe o verde vivo sobre `--papel`.

## 6. Para publicar (depende do responsável)

1. Autorizações de imagem (PENDENCIAS A1); depois, `autorizacao: sim` nos manifestos (passo a passo no README).
2. Domínio: trocar `site` em `astro.config.mjs`.
3. Logo em arquivo, para trocar o nome em texto e o favicon provisório.
4. Testar o WhatsApp num celular real.
5. Revisar os textos-rascunho do site e os textos alternativos das 85 fotos (escritos a partir das fotos, sem nomes de quem é quem em Sara & Yasmin e Dalila & Maria).


---

## Revisão de 09/11/2026: álbum de couro e curadoria

**O que mudou**
- Visual "álbum de couro" (`DESIGN.md` §0). A home abre com o álbum fechado; cada amostra tem o próprio álbum de folhear (`src/components/Album.astro`, capa em `CapaAlbum.astro`). `/trabalhos` virou uma estante de álbuns.
- Página `/curadoria`, só no desenvolvimento: as 1.335 fotos das 16 pastas, com estrela (entra no álbum) e casinha (capa). A seleção fica em `src/data/curadoria.json` e `FOTOS_ESCOLHIDAS.txt`.
- Autorizações confirmadas pelo responsável: os 8 manifestos estão com `autorizacao: sim`.

**Testes**
- Build de produção: 85 fotos, 1.118 arquivos em `dist/fotos`, 0 fora da lista (`verificar-dist` PASS); `/curadoria` não existe em `dist/`. `astro check`: 0 erros.
- Interação (CDP): 22/22 PASS, sem rolagem lateral em 7 páginas × 6 larguras. Álbum: seta do teclado vira, contador, último lado desativa o botão, troca de modo duplo/simples mantém a página.
- Curadoria: marcar, desmarcar, ver grande e "Aplicar no site" testados pela API do servidor de desenvolvimento.
- Originais: 1.341 arquivos com SHA-1 idêntico ao de 08/11/2026.

**Gate da Taste Skill:** `GATE: OPEN 25 (rounds used up)` (rodada 1: 46 FAILs).
Waivers (5): `phone-number` ×2 (WhatsApp comercial dado no briefing), `moment-none` (o momento é a virada de página por clique, que o verificador não reconhece), `hero-fold` (no celular o álbum fica logo abaixo do título; h1 e botão na primeira tela), `button-styles` (o verde-escuro do tema claro é a mesma forma de botão).
FAILs abertos: `section-height` 5, `one-section` 4, `one-heading` 1, `sparse` 1 (regra de uma tela por seção, contrária ao ritmo do `DESIGN.md`); `container-edges` 8, `row-lines` 2, `split-pair` 1, `edge-left` 1 (painéis de couro com recuo interno e rodapé em duas colunas); `copy-headings` 1 (nomes das etapas de "Como funciona"); `hidden-content` 1 (o botão Voltar some na capa, onde não há para onde voltar).

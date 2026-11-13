# DESIGN.md: Jr_Tech_OFC Fotografia

Direção visual para a implementação do portfólio. É a fonte de direção que o Anti-Slop exige (R-37) e a base do sistema da Taste Skill.
Fundamentado na auditoria de 08/11/2026 (`AUDITORIA_VISUAL_E_INSTAGRAMS.md`, `CURADORIA_E_INVENTARIO_DE_ASSETS.md`). Siglas de pastas conforme a seção 2 da curadoria.

**Leitura de design:** site de portfólio de fotógrafo de pessoas, para jovens e famílias de Imperatriz e Bacabal, em linguagem editorial escura com tipografia condensada. **Dial: ENERGY 2 / RHYTHM 2 / MOTION 1.**
A energia vem das fotografias e da escala do tipo, não de efeitos. O ritmo alterna fotos em sangria com blocos de texto curtos. O movimento se limita a transições e estados.

---

## 0e. Revisão de 13/11/2026 (noite): prévia de compartilhamento

Pedido do responsável: que o link do portfólio, ao ser enviado no WhatsApp, Instagram ou Telegram, apareça como "a capa de couro do próprio portfólio", um álbum fotográfico físico de alto padrão, e não uma foto qualquer. Escopo só da prévia: a abertura e o resto do site não mudam.

- **Imagem** `public/capa-compartilhamento.jpg` (1200 x 630, JPEG, cerca de 100 KB), gerada por `scripts/capa-compartilhamento.mjs` (`npm run capa`): o álbum da abertura como objeto, pousado numa mesa escura, com lombada, costura (linha, furos e sombra), friso duplo em baixo-relevo, cantoneiras de platina, fita de cetim e a espessura das páginas. Marca `JR_TECH_OFC` e símbolo em folha verde-ciano afundados no couro; título `PORTFÓLIO` em folha de platina; frase "Existem histórias que merecem ser vistas." Mesmas fontes e mesma textura do site.
- **Área segura:** marca, símbolo, título e frase ficam no quadrado central (o WhatsApp às vezes recorta a prévia em quadrado). O álbum fica um pouco à esquerda para isso.
- **Textos** em `CAPA_SOCIAL` (`src/data/site.ts`): título "Além do Olhar | Jr_Tech_OFC Fotografia" e a descrição. Usados na home e em /trabalhos; cada álbum continua com a própria foto.
- **Endereço oficial** fixo em `astro.config.mjs` (`https://portifolio.jrtechofc.com.br`): canônico, `og:url` e `og:image` absolutos nele, não no endereço .vercel.app.
- O WhatsApp guarda a prévia de cada link por um tempo. Para ver a nova logo depois de publicar, envie o endereço com algo no fim, por exemplo `portifolio.jrtechofc.com.br/?v=2`.

## 0d. Revisão de 13/11/2026 (noite): repaginada em capítulos e páginas de papel (vale sobre §0c e o resto)

Pedido do responsável: "uma repaginada inteligente". O problema da versão anterior era a home: 14 cartões iguais empilhados (cerca de 8 telas de celular) antes de chegar em como funciona, sobre e contato, e tudo no mesmo couro escuro.

- **Capítulos** (`Capitulos.astro`, só na home): os álbuns agrupados pelos mesmos quatro tipos do assistente (`CAPITULOS` em `src/data/site.ts`): ensaios externos, casais e gestantes, 15 anos e aniversários, eventos e celebrações. Cada capítulo tem número romano em itálico (contador CSS, acompanha a ordem), fio de costura, contagem de álbuns, título com uma palavra em itálico e uma linha de apoio. No celular, os cartões ficam numa fileira que se desliza, com o próximo aparecendo na beirada; no computador, título fixo à esquerda e grade à direita (seis trilhas: três por linha, e os primeiros crescem quando sobraria um cartão sozinho).
- **O assistente move o capítulo inteiro** para o primeiro lugar e mostra nele o selo "Combina com você". Os outros capítulos continuam logo abaixo. Na página de trabalhos ele continua reordenando os cartões.
- **Primeira pergunta do assistente com fotos:** cada resposta é um botão com a capa do álbum mais recente daquele tipo e moldura de costura. "Quero ver tudo" continua em pílula.
- **Cartão de álbum** virou componente próprio (`CartaoAlbum.astro`), usado nos capítulos (variante `trilho`) e na lista completa. O tamanho do nome acompanha a largura do cartão (`cqi`).
- **Páginas de papel** (`.papel` com `.tema-claro`, em `global.css`): "Como funciona" e "Sobre" ficam num bloco creme pousado sobre o couro, com costura por dentro. É o miolo do álbum (§0: "páginas internas em papel creme") e quebra o escuro contínuo. O contato e o rodapé voltam ao couro.
- **Como funciona** deixou de ser fileira deslizante (os passos 3 a 5 ficavam escondidos): agora é uma linha do tempo costurada, com os cinco passos à vista; no computador, cinco colunas.
- **Botão flutuante de WhatsApp:** encolhe para só o ícone enquanto a pessoa rola para baixo (não cobre mais os nomes dos álbuns) e volta a mostrar o texto ao rolar para cima.
- A lista completa com filtro por categoria fica só em `/trabalhos` ("Ver todos os álbuns em uma página").
- Deixa de valer: §0b "álbuns em cartões grandes 4:5" na home e "Como funciona em cartões que se deslizam".

## 0c. Revisão de 13/11/2026 (tarde): refinada de luxo, capa que abre e assistente (vale sobre §0b e o resto)

Pedido do responsável: "uma abertura bem elegante e bem marcante", linguagem "mais refinada", mais luxo mantendo o couro ("remete a álbum book premium de luxo"), e "uma espécie de assistente" com um questionário bem pequeno que leva o cliente à categoria certa sem esconder as outras. Manter os Stories e o "leve shot" ao passar a foto.

- **Símbolo da marca** (`Simbolo.astro`): as quatro peças inclinadas em SVG, degradê #00FCA8 → #22D8FF, redesenhadas da referência enviada. Usado no cabeçalho, no rodapé (com o slogan), no assistente, na capa e no favicon.
- **Capa de couro que abre** (`Abertura.astro`, só na home): couro acolchoado, costura que se desenha em volta, símbolo que se monta peça por peça em hot stamping, nome com brilho de folha metálica e slogan; a capa gira na dobradiça da esquerda (cerca de 2,7 s) e revela a foto em tela cheia. Só CSS; uma vez por visita (`sessionStorage`, classe `html.ja-abriu`); toque ou tecla pula; com `prefers-reduced-motion` só some suave. Os textos da abertura esperam a capa.
- **Assistente de escolha** (`Assistente.astro`, home e /trabalhos): conversa com duas perguntas de um toque ("O que você quer registrar?" e "Para quando?"). A resposta reordena as listas `[data-reordenar]` pelo `data-tipo` (`tipoDoEnsaio` em `src/data/site.ts`), marca os cartões com o selo "Combina com você", separa "Mais trabalhos" e escreve a mensagem do WhatsApp (`[data-wa-auto]`). Nada some. Fica no `localStorage` do visitante. Não se apresenta como IA.
- **Costura mais fina** (1,5 px) com sombra de 1 px por ponto; moldura de costura por dentro dos cartões de álbum; sobretítulos menores e mais espaçados; botão de assistir pequeno, de vidro escuro, sem pulsar.
- **Transição entre páginas** só com CSS (`@view-transition`): a capa do cartão cresce até virar a abertura do álbum (`view-transition-name: capa-<slug>`).
- **Texto:** saem as instruções de interface ("Toque para...", "Deslize..."); títulos mais autorais ("Fotos que parecem com você", "Do primeiro contato à entrega", "Vamos criar o seu álbum?").
- O degradê verde-ciano aparece só no símbolo, no nome da capa e no selo do assistente.

## 0b. Revisão de 13/11/2026: fotos em tela cheia, celular Android primeiro (vale sobre §0 e o resto)

Pedido do responsável: o site estava "muito sem vida"; tem que ser "voltado para celular Android, que é onde o cliente vai acessar", "bem otimizado", "com mais vida" e "uma experiência melhorada". Escolhas dele: **fotos em tela cheia**, **bastante movimento**.

- **Dial: ENERGY 4 / RHYTHM 3 / MOTION 3.**
- **Sai o álbum que se folheia** (componentes Album e CapaAlbum removidos). O couro e a costura ficam como acabamento: cabeçalho ao rolar, cartões de passo, contato, rodapé, anéis dos destaques.
- **Abertura em tela cheia** (`Heroi.astro`): foto ocupando a tela do celular com zoom lento contínuo, escurecimento só embaixo para o texto, textos entrando em sequência. O cabeçalho fica transparente sobre a foto e se esconde ao rolar para baixo.
- **Stories** (`Historias.astro`): cada álbum abre em tela cheia com barras de progresso, avanço automático de 5 s, toque à direita avança e à esquerda volta, segurar pausa, deslizar para baixo fecha, deslizar para o lado troca de álbum. Botão de pausa (WCAG 2.2.2). A foto aparece inteira, sem corte, com fundo borrado da própria foto.
- **Home:** abertura, fileira de destaques (círculos com costura verde), álbuns em cartões grandes 4:5 com botão de assistir, foto horizontal de pausa que se abre ao entrar, "Como funciona" em cartões que se deslizam, sobre, contato. **Botão flutuante de WhatsApp** no celular, escondido sobre a abertura e perto do contato.
- **Página do álbum:** abertura em tela cheia com "Assistir" e "Ver todas as fotos"; grade em duas colunas no celular; visualização ampliada com deslize; próximo álbum em cartão de foto.
- **Movimento ao rolar só com CSS** (`animation-timeline: view()`, classes `.surge`, `.surge-lado`, `.revela`): roda fora da thread principal no Chrome do Android, sem JavaScript; sem suporte, tudo aparece parado. Continua proibido: parallax, scroll-jacking, cursor customizado, carrossel automático na página. Com `prefers-reduced-motion` nada se move.
- **Desempenho:** fotos em 480, 800, 1200 e 1800 px, AVIF e WebP (JPEG só de reserva em 800 e 1200); só a abertura carrega com prioridade, o resto com `loading="lazy"`.
- Deixam de valer: §0 "a home abre com o álbum fechado" e a virada de página; §8 "reveal de cada bloco ao rolar" (agora permitido, só com CSS).

## 0. Revisão de 09/11/2026: álbum de couro (vale sobre qualquer item abaixo que a contradiga)

Pedido do responsável: "luxo com estética confortável", "couro com as cores da marca" e, para quem chega pelo link do Instagram, "como se tivesse folheado um álbum de luxo". O site é o **portfólio** da marca, não o site institucional.

- **Conceito:** o site é um álbum de fotografia de luxo. A home abre com o álbum fechado; cada página dupla é uma amostra (capa à esquerda, nome e duas fotos à direita). Cada amostra tem o próprio álbum, que se folheia.
- **Materiais:** fundo em couro grafite puxado para o verde (`--couro #121b18`, painel `#1a2723`), grão gerado por `scripts/couro.mjs` (`public/couro.webp`, 4 KB, aplicado com `overlay`). Ensaios de luz do dia usam couro natural creme (`#efe6d6`). Páginas internas em papel creme.
- **Costura** tracejada no verde da marca em painéis, capas, divisórias e no botão. **Hot stamping** verde-ciano (as cores do símbolo) só no nome gravado nas capas.
- **Tipografia:** títulos em Fraunces (serifa variável, eixo SOFT 100) com uma palavra em itálico na cor da marca; texto em Archivo. Sai o caixa-alta condensado.
- **Formas:** nada de canto reto. Botões em pílula, fotos com raio de 14 a 20 px, painéis com 22 a 32 px.
- **Movimento:** a virada de página (0,9 s, só por clique, tecla ou deslize, nunca ligada à rolagem) é o momento do site. Com `prefers-reduced-motion` a página troca sem animação.
- **Curadoria:** as fotos são escolhidas pelo fotógrafo na página `/curadoria` (estrela = entra no álbum, casinha = capa). Ver `README.md`.
- Deixam de valer: §1 "Não: luxuoso", §3 família única e caixa alta, §6 "sem cartões", §7 raio 2 px e "sem sombra", §11 "cartões com borda e sombra" e "degradê verde-ciano fora do logo" (o hot stamping usa as cores do logo).

## 1. Conceito

**"A foto fala primeiro."** Cada tela tem uma fotografia real como foco, e o resto se recolhe: texto curto, tipografia grande quando há algo a dizer, cor da marca só onde o visitante age.

O motivo de identidade vem do próprio responsável: a capa `SAB/SabrinaCapa.png` usa o **nome da pessoa retratada em tipo condensado enorme, creme, sobre fundo quase preto**. O site repete esse gesto em cada ensaio. O título de uma página de ensaio é o primeiro nome da pessoa ou do casal, em escala de cartaz, e é o único elemento gráfico forte da página.

**Atributos:** natural, próximo, cuidadoso, direto. Não: futurista, "tech", luxuoso, fofo.

O nome "Jr_Tech_OFC" contém "Tech", mas o site é de fotografia de pessoas. Nada de linguagem de software, terminal, código, grade de pontos ou glow. [RECOMENDAÇÃO]

## 2. Paleta e papéis

| Token | Hex | Papel | Onde nunca usar |
|---|---|---|---|
| `--carvao` | `#141414` | fundo principal (home, índice, lightbox) | n/a |
| `--grafite` | `#292929` | cor oficial da marca: superfícies secundárias, rodapé, divisões de bloco, fundo de placeholder de imagem | texto |
| `--papel` | `#F2EEE6` | texto principal no escuro; **fundo claro** das páginas de ensaio de luz diurna (Sabrina, Dália, Marlieth) | n/a |
| `--cinza` | `#A8A39A` | texto secundário no escuro (legendas, datas, locais) | texto longo sobre `--papel` |
| `--tinta` | `#5E5A54` | texto secundário sobre `--papel` | fundo escuro |
| `--verde` | `#00FCA8` | cor oficial: **um único papel de ação**, o botão WhatsApp/orçamento e o anel de foco | fundos grandes, títulos, ícones decorativos, sobre `--papel` |
| `--verde-escuro` | `#007A55` | versão do verde para links e foco sobre `--papel` | fundo escuro |
| `--ciano` | `#1CDAFF` | cor oficial: **só no símbolo do logo** e no estado de link visitado/hover no escuro | botões, fundos |

Contrastes medidos com `antislop-human/contrast-check.py` (AA texto normal ≥ 4,5:1):
`--papel`/`--carvao` 15,92 · `--cinza`/`--carvao` 7,34 · `--cinza`/`--grafite` 5,80 · `--verde`/`--carvao` 13,59 (e `--carvao` sobre `--verde` igual) · `--ciano`/`--carvao` 10,99 · `--papel`/`--grafite` 12,57 · `--tinta`/`--papel` 5,92 · `--verde-escuro`/`--papel` 4,64.

Regras:
- Verde e ciano juntos só no logo. **Sem degradê verde-ciano** fora do símbolo.
- A cor da interface nunca encosta na foto: nada de moldura colorida, sobreposição tingida ou sombra verde.
- Fundo claro ou escuro por ensaio: o ensaio declara `tema: claro | escuro` no manifesto. Escuro: SY (noite com flash), MCD, JEL, BO noturno. Claro: SAB, DAL, MP, DM (lago diurno).

## 3. Tipografia

- **Família única:** Archivo (variável, eixos de peso e largura, licença OFL, hospedada no próprio site via `@fontsource-variable/archivo`). Uma família só reduz peso e incoerência.
- **Display:** Archivo, largura 62–75, peso 800, caixa alta, entrelinha 0,9, tracking -0,01em. Uso: nome do ensaio, frase de abertura, títulos de seção. Recria o gesto da `SabrinaCapa.png`.
- **Texto:** Archivo, largura 100, peso 400; destaque em 600. Tamanho base 18 px (celular 17 px), entrelinha 1,55, até 65 caracteres por linha.
- **Escala** (clamp fluido de 390 a 1440 px): display XL `clamp(64px, 16vw, 220px)` · display L `clamp(44px, 9vw, 120px)` · título `clamp(28px, 4vw, 44px)` · texto 18 · legenda 14 (mínimo, peso 500, `--cinza`).
- Proibido: script ou caligrafia (como na capa de SY), monoespaçada decorativa, mais de 2 pesos visíveis na mesma tela, texto em degradê.

## 4. Grid, largura e ritmo

- Grid de 12 colunas no desktop, 6 no tablet, 4 no celular. Margem lateral `clamp(16px, 4vw, 56px)`. Gutter 16 a 24 px.
- Largura de texto máxima de 65ch. As fotos podem ir de borda a borda.
- Ritmo vertical em escala de 8 px. Entre seções: `clamp(96px, 14vw, 200px)`. Entre título e conteúdo: 32 a 48 px.
- **Cada seção tem composição própria** (RHYTHM 2). Exemplo da home: abertura em sangria; três frentes em 3 colunas de alturas diferentes; destaque em foto única com texto ao lado; processo em lista numerada de texto puro; contato em tipo grande. Nunca três blocos iguais de "título + subtítulo + grade de cartões".

## 5. Linguagem fotográfica

- **Proporções originais preservadas.** Nunca forçar 1:1, nunca cortar cabeças. O acervo é majoritariamente vertical 2:3 (1366×2048, 2321×3480), e o layout é pensado para vertical: no desktop, verticais em pares ou ao lado do texto.
- Recorte permitido só na abertura (hero), com ponto focal definido por foto (`objectPosition` no manifesto). As três candidatas a hero são verticais (1366×2048). Por isso, no desktop a abertura é **dividida**: foto vertical em altura total ocupando cerca de 45% da largura, e frase e botão sobre `--carvao` no restante. No celular a foto vai em sangria com o texto abaixo. Exemplo: `SY/IMG_1081.jpg` com foco no rosto, no terço superior.
- Horizontais disponíveis para momentos de sangria: `SY/IMG_0957.jpg` (cabelo em leque com pétalas), `DM/Dalila e Maria (3).jpg`, `BO/Wedding Anniversary (35).jpg`.
- **Sem filtros** aplicados pelo site (nada de sépia, P&B automático ou overlay). A edição é do fotógrafo.
- Legenda só quando informa algo: local e data ("Bacabal, agosto de 2025"). Nunca descrição poética.
- Ordem dentro do ensaio: abertura forte, depois variação de plano (aberto, médio, detalhe) e fecho com uma imagem calma. Exemplo SAB: `sabrina-01` (aberto) → `-02` (close) → `-22` (gesto espontâneo) → `-12` (P&B como pausa) → `-44` (série do livro) → `-53` (costas, fecho).
- Fotos de cor saturada (parte de DM) ficam fora, para que o conjunto pareça de um mesmo autor.

## 6. Galerias

- Página de ensaio: sequência editorial de uma ou duas colunas, alternando vertical inteira, par de verticais e horizontal em sangria. **Não usar masonry automático**, porque a ordem importa.
- Índice `/trabalhos`: cada ensaio é **uma foto de capa e o nome em display L**, com categoria e data em legenda. Sem cartões com borda ou sombra; o hover só troca a opacidade do texto.
- Filtro por categoria (Ensaios, Casais, Eventos e celebrações) com botões de texto e `aria-pressed`; funciona sem JS mostrando tudo.
- **Visualização ampliada:** `<dialog>` nativo com fundo `--carvao` a 96%; setas, contador "4 / 16", fechar com Esc, navegar com ← →, deslizar no celular, foco preso no diálogo e devolvido à miniatura ao fechar. Carrega a versão de 1600 a 2400 px só ao abrir.

## 7. Componentes

- **Botão primário (um por tela):** fundo `--verde`, texto `--carvao` 600, altura 48 px, raio 2 px (quase reto, ecoando os paralelogramos do símbolo). Texto de ação concreta: "Chamar no WhatsApp", "Pedir orçamento".
- **Botão secundário:** texto `--papel` com sublinhado de 1 px que engrossa no hover. Sem contorno de pílula.
- **Links no texto:** sublinhados sempre (não só no hover). No escuro, `--papel`, com hover em `--ciano`; no claro, `--verde-escuro`.
- **Navegação:** barra fixa fina (56 px) com logo à esquerda, "Trabalhos · Sobre · Contato" à direita e WhatsApp como único botão verde. No celular: logo e botão "Menu" (texto, não ícone sozinho) abrindo painel em tela cheia. A barra ganha fundo `--carvao` só após rolar.
- **Barra de contato no celular:** botão WhatsApp fixo no rodapé da tela nas páginas de ensaio, 56 px, que some quando o rodapé real aparece.
- **Formulário:** não há na v1.
- Raio padrão 2 px em tudo. Sem sombra (no escuro, separar com `--grafite`).

## 8. Movimento (MOTION 1)

- Permitido: fade de 200 ms nas fotos ao carregar (do LQIP para a imagem); transição de 150 ms em hover e foco; abertura do lightbox com fade e escala 0,98→1 em 180 ms.
- Proibido: parallax, scroll-jacking, reveal de cada bloco ao rolar, cursor customizado, carrossel automático, contadores animados, texto digitando.
- `prefers-reduced-motion: reduce` desliga tudo, exceto mudanças de estado instantâneas.

## 9. Responsividade

- Mobile-first, testado em 390, 768, 1024 e 1440 px (larguras da Taste Skill).
- Celular: uma coluna, fotos em 100% da largura útil, display XL com no máximo 2 linhas, alvos de toque ≥ 44 px, nada de rolagem horizontal.
- Imagens com `srcset` e `sizes` reais; a abertura com `fetchpriority="high"` e o resto com `loading="lazy"`.
- A abertura no celular usa a mesma foto com ponto focal ajustado, não uma foto diferente.

## 10. Acessibilidade e estados

- Contraste AA mínimo em todo texto (seção 2).
- Foco visível: anel de 2 px `--verde` com 2 px de afastamento no escuro, `--verde-escuro` no claro. Nunca `outline: none` sem substituto.
- Ordem de teclado igual à visual; link "Pular para o conteúdo".
- `alt` descritivo e factual em cada foto ("Sabrina sentada no banco da praça, vestido laranja, fim de tarde"), sem "imagem de".
- Estados: hover, foco, ativo, visitado (links), carregando (cor dominante da foto) e erro de imagem (bloco `--grafite` com o nome do ensaio).
- Idioma `pt-BR`, títulos de página únicos, landmarks (`header`, `nav`, `main`, `footer`).

## 11. Proibido neste site

Degradê roxo-azul ou verde-ciano fora do logo · glassmorphism · cartões com borda e sombra para cada item · ícones em quadrado colorido · brilho ou neon nos verdes · grade de pontos ou linhas no fundo · emoji na interface · texto com travessão · números inventados ("+500 clientes", "100% satisfação") · depoimentos sem fonte real · fotos de banco, stand-ins ou IA · mockups de celular · lista de equipamentos como argumento de venda · preços e nomes de pacote não confirmados · arte de Natal ou peças do Canva como conteúdo de portfólio · carrossel automático no topo.

## 12. Exemplos concretos do acervo

| Situação | Arquivo | Tratamento |
|---|---|---|
| Abertura da home | `SY/IMG_1081.jpg` (vertical) | desktop: foto em altura total à direita, frase em display XL `--papel` à esquerda sobre `--carvao`, botão verde abaixo; celular: foto em sangria, frase e botão abaixo |
| Página Sabrina | `SAB/sabrina-20.png` (abertura), tema claro | "SABRINA" em display XL `--carvao` sobre `--papel`, foto ao lado (desktop) ou abaixo (celular) |
| Frente "Casais" na home | `MP/Foto (18).jpg` | vertical, metade da largura, legenda "Marlieth e Paulo, ensaio gestante, 2026" |
| Frente "Eventos" na home | `MCD/IMG_0690.jpg` | vertical, emoção do louvor; legenda com a congregação só se autorizado |
| Pausa entre seções | `SY/IMG_0957.jpg` (horizontal) | sangria total, sem texto |
| Silhueta no lago | `DM/Dalila e Maria (29).jpg` (vertical) | abertura da página Dalila & Maria, ou par com `(14).jpg` |
| Detalhe de evento | `JEL/IMG_1392.jpg` ou `MP/Foto (6).jpg` | foto pequena ao lado de texto curto sobre o processo |

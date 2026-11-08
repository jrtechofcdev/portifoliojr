# Mapa do site e conteúdo

As siglas de pasta (SAB, SY, MP...) seguem a seção 2 de `CURADORIA_E_INVENTARIO_DE_ASSETS.md`. Os textos marcados como **rascunho** são propostas escritas sob o `antislop-copywriting`; a versão final depende da aprovação do responsável. Nenhum texto contém número, cliente ou depoimento que não esteja comprovado.

## 1. Estrutura e por que multipágina

```
/                         Início (página longa com âncoras #trabalhos #como-funciona #sobre #contato)
/trabalhos                Índice de ensaios e eventos, com filtro por categoria
/trabalhos/sabrina
/trabalhos/sara-e-yasmin
/trabalhos/dalila-e-maria
/trabalhos/dalia
/trabalhos/marlieth-e-paulo
/trabalhos/manha-com-deus
/trabalhos/confra-juventude-estrela-de-luz
/trabalhos/bodas-de-ouro-nelson-e-dalvina
/trabalhos/15-anos-kiara          (só se houver autorização)
/404
```

**Por que não uma página única:** são 8 ensaios fortes, com 10 a 16 fotos cada. Numa página só, ou a home fica pesada (mais de 100 fotos) ou cada ensaio vira miniatura sem contexto. Com páginas, cada ensaio tem URL própria para mandar no WhatsApp ("olha o ensaio da Sabrina") e para o Google.
**Por que não mais páginas:** "Sobre", "Serviços", "Processo" e "Contato" têm pouco conteúdo comprovado. Como seções da home, o visitante encontra tudo rolando. Uma página `/sobre` só passa a fazer sentido quando houver retrato e biografia confirmados. [RECOMENDAÇÃO]

Navegação fixa: **Logo** (volta ao início) · Trabalhos · Sobre · Contato · botão **WhatsApp**.
Rodapé: logo, "Nossa Arte, Seu Sucesso!", Imperatriz e Bacabal, MA, WhatsApp, e-mail, Instagram, ano.

---

## 2. Início `/`

Visitante: chegou pelo link da bio do Instagram ou por indicação, quase sempre no celular. Quer ver se o trabalho é bom e como falar com o fotógrafo.

### 2.1 Abertura
- **Objetivo:** em 5 segundos, mostrar o que é, onde é e como chamar.
- **Imagem:** `SY/IMG_1081.jpg`. Alternativa: `SAB/sabrina-20.png`.
- **Texto (rascunho):** título "Fotografia natural de pessoas." Linha de apoio: "Ensaios externos, casais e celebrações em Imperatriz e Bacabal, MA."
- **CTA:** "Chamar no WhatsApp" (primário) e "Ver trabalhos" (secundário, âncora).
- **Celular:** foto em sangria (cerca de 70% da altura da tela), texto e botões abaixo, visíveis sem rolar em 390×844. **Desktop:** foto à direita em altura total, texto à esquerda.

### 2.2 Três frentes `#trabalhos`
- **Objetivo:** mostrar as três especialidades comprovadas, cada uma com uma foto real.
- **Conteúdo:**
  | Frente | Foto | Texto (rascunho) | Link |
  |---|---|---|---|
  | Ensaios externos | `SAB/sabrina-22.png` | "Luz do fim da tarde, um lugar da cidade e tempo para você ficar à vontade." | `/trabalhos?c=ensaios` |
  | Casais e gestantes | `MP/Foto (18).jpg` | "Orientação de pose sem deixar o abraço duro." | `/trabalhos?c=casais` |
  | Eventos e celebrações | `MCD/IMG_0690.jpg` | "Cultos, confraternizações, aniversários e bodas, registrados sem interromper o momento." | `/trabalhos?c=eventos` |
- **Celular:** empilhado, foto e texto. **Desktop:** 3 colunas de alturas diferentes (a do meio desce 80 px).

### 2.3 Ensaio em destaque
- **Objetivo:** provar profundidade com um ensaio inteiro, não só capas.
- **Conteúdo:** Sabrina. "SABRINA" em display, 4 fotos (`sabrina-01`, `-12`, `-36`, `-44`), legenda "Bacabal, agosto de 2025" e link "Ver o ensaio completo".
- **Celular:** carrossel horizontal com scroll-snap nativo, sem setas automáticas. **Desktop:** composição assimétrica (1 vertical grande e 3 menores).

### 2.4 Pausa
- `SY/IMG_0957.jpg` em sangria, sem texto.

### 2.5 Mais trabalhos
- Lista em tipo grande: Sara & Yasmin · Marlieth & Paulo · Dalila & Maria · Manhã com Deus · Bodas de Ouro · Dália. Cada nome é um link; no desktop, o hover mostra a foto de capa ao lado (sem animação de seguir o cursor). Link "Todos os trabalhos" leva a `/trabalhos`.

### 2.6 Como funciona `#como-funciona`
- **Objetivo:** tirar a insegurança de quem nunca fez ensaio. O story mais visto do período perguntava justamente "O que te impede hoje de fazer um ensaio fotográfico só seu?".
- **Texto (rascunho), lista numerada de texto puro:**
  1. **Conversa.** Você conta o que quer pelo WhatsApp: ensaio, evento, data e cidade.
  2. **Plano.** Combinamos lugar, horário de luz, roupa e o que vai ser entregue.
  3. **Sessão.** Eu oriento as poses e deixo espaço para o que acontece de verdade.
  4. **Seleção e edição.** Escolho e trato as melhores fotos.
  5. **Entrega.** Você recebe as fotos editadas no formato combinado.
- O briefing não define prazo, quantidade de fotos nem forma de entrega. Esses dados só entram se confirmados. [PENDENTE DE CONFIRMAÇÃO]
- Sem ícones. Números em display L `--grafite` claro como único elemento gráfico.

### 2.7 Sobre `#sobre`
- **Objetivo:** pôr um rosto e um nome atrás da marca.
- **Imagem:** **retrato de José Renato, que ainda não existe na pasta.** [PENDENTE DE CONFIRMAÇÃO] Sem retrato, a seção fica só com texto e uma foto de trabalho, nunca com um avatar genérico.
- **Texto (rascunho, baseado só no briefing):** "Sou José Renato Alves da Silva, fotógrafo da Jr_Tech_OFC. Fotografo pessoas em Imperatriz e Bacabal, quase sempre ao ar livre, e também cubro cultos, confraternizações e festas de família. Gosto de foto que parece com quem está nela: natural, sem pose dura. Além de fotografar, edito as fotos e faço vídeos curtos dos eventos."
  - A última frase só entra se os vídeos de BO e MCD forem entregas confirmadas.
  - "2+ anos de experiência" só entra se o responsável confirmar o uso no site.
- **Link:** "Instagram" para `@jose_renato_a`. O link para `@jose_renato_b` depende da análise pendente.

### 2.8 Contato `#contato`
- **Objetivo:** fechar a conversa.
- **Texto (rascunho):** título em display L "Vamos marcar?". Apoio: "Me diga o tipo de ensaio ou evento, a data e a cidade. Respondo pelo WhatsApp."
- **CTA primário:** `https://wa.me/5599982785958?text=` com mensagem pré-preenchida "Olá, José Renato! Vi seu site e quero saber sobre um ensaio/evento." **Testar antes de publicar.**
- **Secundários:** e-mail `jrtechofc@gmail.com` (mailto com assunto "Orçamento pelo site") e Instagram `@jose_renato_a`.
- Linha final: "Atendo em Imperatriz e Bacabal, MA. Outras cidades, sob consulta."
- Sem preços e sem formulário.

---

## 3. Índice `/trabalhos`

- **Objetivo:** ver todos os trabalhos e escolher um.
- **Filtro:** Todos · Ensaios · Casais · Eventos e celebrações. A URL guarda o filtro (`?c=`) para poder compartilhar.
- **Item:** foto de capa (proporção original), nome em display L, linha "Ensaio externo · Bacabal · 2025".
- **Ordem:** do mais recente ao mais antigo: Sara & Yasmin (2026), Marlieth & Paulo (2026), Sabrina (2025), Manhã com Deus (2024), Bodas de Ouro (2024), Dalila & Maria (2024), Dália (2024), Confra JEL (2024).
- **Capas:** SY `IMG_1081.jpg` · MP `Foto (18).jpg` · SAB `sabrina-20.png` · MCD `IMG_0690.jpg` · BO `Wedding Anniversary (20).jpg` · DM `Dalila e Maria (29).jpg` · DAL `Dalila (3).jpg` · JEL `IMG_1272.jpg`.
- **Celular:** uma coluna. **Desktop:** 2 colunas desencontradas.
- **CTA no fim:** "Quer um ensaio assim? Chamar no WhatsApp".

## 4. Página de ensaio `/trabalhos/[slug]`

Modelo único, alimentado pelo manifesto de cada ensaio.

| Bloco | Conteúdo |
|---|---|
| Abertura | nome em display XL + foto de abertura; tema claro ou escuro (ver `DESIGN.md` §2) |
| Ficha | categoria · cidade · mês e ano. Local específico só se autorizado |
| Texto curto (opcional) | 1 a 3 frases **somente com fatos confirmados** pelo responsável (ideia do ensaio, local). Se não houver, omitir |
| Sequência | 10 a 16 fotos da seção 4 da curadoria, na ordem indicada, com lightbox |
| Próximo | link para o próximo ensaio da mesma categoria |
| Contato | bloco com WhatsApp: "Quer um ensaio assim?" ou, nos eventos, "Tem um evento chegando?" |

Fichas conhecidas (dados de nome de pasta e EXIF; cidade só onde há evidência):
| Slug | Categoria | Cidade | Data | Fotos (curadoria §4) | Tema |
|---|---|---|---|---|---|
| `sabrina` | Ensaio externo | Bacabal ("Bacabal - MA" na `SabrinaCapa.png`) | ago/2025 | 16 | claro |
| `sara-e-yasmin` | Ensaio externo | PENDENTE | out/2026 | 16 | escuro |
| `dalila-e-maria` | Ensaio externo | PENDENTE | out/2024 | 12 | claro |
| `dalia` | Ensaio externo | PENDENTE | out/2024 | 6 | claro |
| `marlieth-e-paulo` | Casal / gestante | PENDENTE | mar/2026 | 10 | claro |
| `manha-com-deus` | Evento gospel | PENDENTE (Congregação Maanaim) | dez/2024 | 8 | claro |
| `confra-juventude-estrela-de-luz` | Evento gospel | PENDENTE | dez/2024 | 7 | escuro |
| `bodas-de-ouro-nelson-e-dalvina` | Celebração | PENDENTE | out/2024 | 10 | escuro |

## 5. 404
- "Esta página não existe." Link para Início e Trabalhos. Fundo com `JEL/IMG_1396.jpg` (detalhe, sem pessoas).

## 6. Metadados por página
- `title`: "Sabrina, ensaio externo em Bacabal | Jr_Tech_OFC Fotografia". Home: "Jr_Tech_OFC Fotografia | Ensaios e eventos em Imperatriz e Bacabal".
- `description`: uma frase factual por página.
- Open Graph: a foto de abertura de cada página, recortada em 1200×630 com ponto focal.
- JSON-LD `ProfessionalService` com `areaServed` Imperatriz e Bacabal, `sameAs` só com canais confirmados. Sem endereço (não há estúdio).

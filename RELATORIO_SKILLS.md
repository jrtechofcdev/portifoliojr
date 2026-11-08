# Relatório de instalação das skills

Verificado em 08/11/2026, na máquina do responsável (Debian, Linux 6.12, bash).

## 1. Resumo

| | Taste Skill | Anti-Slop |
|---|---|---|
| Repositório | https://github.com/Leonxlnx/taste-skill | https://github.com/miqdadbadjuber/anti-slop |
| Versão instalada | tasteskill **2.5.1** (commit `f6b7657`, 07/11/2026) | antislop **3.2.26** (`~/.claude/skills/antislop/VERSION`) |
| Rota de instalação | `install.sh` oficial (symlink) | `npx skills add` (rota "The skills directory" do GUIDE.md oficial) |
| Fonte | `~/.local/share/agent-skills/taste-skill` (clone fora do site) | cópia gerenciada pelo CLI `skills` |
| Destino global | `~/.claude/skills/design-taste-frontend` → symlink para `~/.local/share/agent-skills/taste-skill/skills/taste-skill` | `~/.claude/skills/antislop`, `antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`, `antislop-code` (pastas copiadas) |
| Escopo | usuário (todos os projetos) | usuário (todos os projetos) |
| Modo | n/a | `during`, salvo em `~/.config/antislop/settings.json` |
| Descoberta nesta sessão | **sim**: o Claude Code passou a listar `design-taste-frontend` logo após a instalação | **sim**: as 6 skills `antislop*` passaram a aparecer na lista de skills da sessão |

## 2. Pré-requisitos

| Item | Situação | Efeito |
|---|---|---|
| Node.js | v22.23.4 | atende Taste Skill (22+) e Anti-Slop (20.12+) |
| npm | 10.9.9 | ok |
| Git | 2.47.3 | ok |
| Chrome / Chromium / Edge | **ausente** (só Firefox) | os scripts da Taste Skill que abrem navegador (`shoot.mjs`, `consistency.mjs`, `gate.mjs`, `perf.mjs`) **não rodam** até instalar Chromium |
| ffmpeg | **ausente** | opcional na Taste Skill (WebP e recorte do hero em `photos.mjs`); também impediu a análise dos vídeos do acervo |
| Python 3 | presente | o verificador de contraste do `antislop-human` (`contrast-check.py`) pode rodar |

**Ação do responsável:** `sudo apt install chromium ffmpeg`. Se o Chromium ficar fora do caminho padrão, defina `CHROME_PATH`.

## 3. Passo a passo executado

### Taste Skill
1. Li o `install.sh` atual antes de executar. Ele só cria symlinks, não baixa nada e se recusa a sobrescrever uma pasta real.
2. `git clone https://github.com/Leonxlnx/taste-skill.git ~/.local/share/agent-skills/taste-skill`
3. `./install.sh --list` mostrou `design-taste-frontend → skills/taste-skill`.
4. `./install.sh design-taste-frontend` retornou `linked /home/jrtechofc/.claude/skills/design-taste-frontend -> skills/taste-skill`.
5. Abri `~/.claude/skills/design-taste-frontend/SKILL.md` (frontmatter `name: design-taste-frontend`).

### Anti-Slop
1. O instalador oficial `npx antislop-ai` (versão 3.2.26) respondeu: *"this installer needs a terminal"*. O ambiente do agente não oferece terminal interativo.
2. Por isso usei a rota alternativa documentada no próprio `GUIDE.md` ("The skills directory"): `npx skills add miqdadbadjuber/anti-slop -g -a claude-code --skill '*' -y`. O scanner do skills.sh classificou as 6 skills como "Safe / Low Risk".
3. `npx antislop-ai --mode during` respondeu `antislop global mode: during`. Conferido de novo com `npx antislop-ai --mode`.
4. Abri os 6 `SKILL.md` instalados (frontmatter `name:` correto em todos).

**Diferença em relação ao wizard:** numa instalação global ("Everywhere"), o GUIDE informa que o wizard **não** escreve bloco de ponteiro no projeto. Por isso as duas rotas dão o mesmo resultado global. O ponteiro de projeto foi substituído pelo `CLAUDE.md` deste projeto (seção 5).

## 4. Duplicações e conflitos

- **Nenhuma instalação anterior** em `~/.claude/skills`, nos plugins do Claude Code ou em `~/.config/antislop`. Não há duplicação.
- **Clones antigos dentro da pasta do site:** `taste-skill/` (commit `12af471`, v2.1.5) e `anti-slop/` (commit `4ca3b11`, 3.2.23) estão na raiz do portfólio, com vários arquivos apagados da árvore de trabalho (`README.md`, `install.sh`, `GUIDE.md` etc.). **Não foram usados nem alterados.** Como são versões antigas e incompletas, recomendo apagá-los ou movê-los para fora da pasta do site, e só com a sua confirmação. Até lá, a futura configuração do site deve excluí-los do build.
- **Conflito de orientação na Taste Skill 2.5.1:** ela propõe "fotografias substitutas licenciadas quando o cliente não tem fotos". **Neste projeto isso é proibido** (seção 5.4 do briefing). O `CLAUDE.md` registra essa exceção.
- **Taste Skill e páginas de tecnologia:** efeitos de shader e cenas ficam restritos a sites de tecnologia e games pela própria skill, e o briefing também os veta. Não se aplicam aqui.
- **Anti-Slop R-02:** proíbe o travessão (em dash) em todo texto produzido. Vale para o conteúdo do site e foi seguido nestes documentos.

## 5. Como as skills serão usadas neste projeto

O arquivo `CLAUDE.md` na raiz determina, em toda sessão futura:
- `DESIGN.md` como fonte de direção (exigência R-37 do Anti-Slop) e base para a Taste Skill;
- `antislop` mais `antislop-ui` e `antislop-layoutmobile` em qualquer interface;
- `antislop-copywriting` em todo texto do site;
- `antislop-human` para contraste, teclado, foco e estados;
- `antislop-code` quando houver código;
- método e verificação em navegador da Taste Skill (exige Chromium);
- Delivery Gate do Anti-Slop e `gate.mjs` da Taste Skill antes de dar qualquer entrega por pronta.

**Confirmação:** as duas instalações serão usadas neste projeto. Para validar o carregamento automático em sessão limpa, abra uma **nova sessão** do Claude Code nesta pasta e peça "liste as skills disponíveis". As 7 skills devem aparecer.

## 6. Como atualizar

```bash
# Taste Skill (o symlink acompanha o git pull)
cd ~/.local/share/agent-skills/taste-skill && git status && git pull

# Anti-Slop
npx skills update -g -y        # ou: npx antislop-ai --update

# Conferir
ls -la ~/.claude/skills/ && cat ~/.claude/skills/antislop/VERSION
```

Para desinstalar: `~/.local/share/agent-skills/taste-skill/install.sh --uninstall` e `npx skills remove -g antislop antislop-ui antislop-copywriting antislop-human antislop-layoutmobile antislop-code`.

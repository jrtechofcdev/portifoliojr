# Portfólio Jr_Tech_OFC

Portfólio de fotografia de José Renato Alves da Silva (Jr_Tech_OFC Fotografia, "Nossa Arte, Seu Sucesso!"), Imperatriz e Bacabal, MA.

## Estado atual
Fases 0 a 6 concluídas na parte do desenvolvimento em 08/11/2026 (ver `RELATORIO_ENTREGA.md`). Falta o que depende do responsável: autorizações de imagem, logo, domínio, teste em celular e publicação. Nada de `git push`, deploy ou publicação sem ele. Documento principal: `PLANO_GERAL_PORTFOLIO.md`. Manutenção: `README.md`. Dúvidas em aberto: `PENDENCIAS_E_DECISOES.md`.

## Comandos
- `npm run dev`: gera as fotos (inclui pendentes, com aviso) e abre o site; `/sistema` mostra tokens, tipos e todas as fotos.
- `npm run build`: fotos só com `autorizacao: sim`, `astro check`, build e `scripts/verificar-dist.mjs`.
- `npm run build:previa`: site completo com fotos pendentes e `noindex`, só para revisão local (`npm run preview`).
- `npm run test:bloqueio`: prova que foto pendente não gera arquivo em produção.
- Ensaios: um YAML por ensaio em `src/content/ensaios/` (esquema em `src/content.config.ts`). Siglas de pasta em `src/data/pastas.json`.
- A primeira geração de fotos leva cerca de 20 min; depois usa `.cache/fotos/`.

## Skills obrigatórias (instaladas globalmente, ver `RELATORIO_SKILLS.md`)
- Direção visual: leia `DESIGN.md` antes de qualquer interface. Ele é a direção exigida pela regra R-37 do Anti-Slop e a base da Taste Skill.
- Interface: `design-taste-frontend` (método, sistema e verificação em navegador) com `antislop`, `antislop-ui` e `antislop-layoutmobile` como filtro.
- Texto do site: `antislop-copywriting`. Sem travessão (R-02), sem números, depoimentos ou anos de experiência inventados.
- Acessibilidade: `antislop-human` (contraste, teclado, foco, estados).
- Código: `antislop-code`.
- Antes de entregar: Delivery Gate do Anti-Slop e `gate.mjs` da Taste Skill, com o resultado PASS/FAIL apresentado.

## Exceções a estas skills, específicas deste projeto
- **Nunca usar fotos substitutas, de banco ou geradas por IA**, mesmo que a Taste Skill sugira stand-ins. Só fotografias reais de `Fotos Para Potifolio/`, com autorização confirmada em `CURADORIA_E_INVENTARIO_DE_ASSETS.md`.
- Sem shaders, cenas 3D, parallax ou efeitos de demonstração. Fotografia de pessoas não é site de tecnologia.

## Regras de arquivo
- `Fotos Para Potifolio/`, os prints e o briefing são originais: nunca editar, mover, renomear nem recomprimir. Versões web são geradas como cópias derivadas.
- Não publicar dados dos insights do Instagram, preços ou nomes de pacotes sem confirmação.
